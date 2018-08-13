<template>
  <div>
    <h1 class="uk-heading-divider">Tvarkaraštis - {{ schedule.name }}</h1>
    <form v-on:submit="addRecord()">
    <div uk-grid>
      <div class="uk-width-1-4">
        <h5>Darbas</h5>
        <div class="uk-width-1-1" style="margin-top: -10px">
          <label class="uk-form-label uk-text-meta" for="form-stacked-text">Pradžia</label>
          <select class="uk-select uk-form-controls uk-form-small" v-model="startTime">
            <option value="Pasirinkite">Pasirinkite</option>
            <option value="7:30">7:30</option>
            <option value="8:00">8:00</option>
            <option value="9:00">9:00</option>
            <option value="17:00">17:00</option>
            <option value="18:00">18:00</option>
          </select>
        </div>
        <div class="uk-width-1-1">
          <label class="uk-form-label uk-text-meta" for="form-stacked-text">Pabaiga</label>
          <select class="uk-select uk-form-controls uk-form-small" v-model="endTime">
            <option value="Pasirinkite">Pasirinkite</option>
            <option value="7:30">7:30</option>
            <option value="8:00">8:00</option>
            <option value="9:00">9:00</option>
            <option value="17:00">17:00</option>
            <option value="18:00">18:00</option>
          </select>
        </div>
        <br>
        <label><input class="uk-checkbox" type="checkbox" v-model="extDay"> Parinė</label>
      </div>
      <div class="uk-width-1-4">
        <h5>Pertraukos</h5>
        <div v-if="breaks.length > 0">
          <span v-for="item in breaks">
            <sup>{{ item.start }} - {{ item.end }}</sup> <br>
          </span>
        </div>
        <button type="button" uk-toggle="target: #breaks-modal" class="uk-button uk-button-default uk-button-small">{{ (this.breaks.length > 0) ? 'Redaguoti' : 'Pridėti'}}</button>
        </div>
        <div class="uk-width-1-4" id="informacija">
          <h5>Informacija</h5>
          Max: {{ schedule.max_hours * 60 + schedule.max_minutes }} min<br>
          Dirbama: {{ workHours / 60 }} h {{ workHours % 60 }}<br>
          Liko {{ ((schedule.max_hours * 60 + schedule.max_minutes) - workHours) / 60 }} h {{ ((schedule.max_hours * 60 + schedule.max_minutes) - workHours) % 60 }} min
        </div>
        <div class="uk-width-1-4">
          <h5>Veiksmai</h5>
          <button class="uk-button uk-button-secondary uk-button-small">Išsaugoti</button>
          <!-- <button class="uk-button uk-button-secondary uk-button-small" type="button" v-on:click="updateSchedule()">ATNAUJINTI</button> -->
          <hr>
          <button type="button" class="uk-button uk-button-default uk-button-small">Nustatymai</button>
        </div>
    </div>
    </form>
    <hr>
    <full-calendar :events="events" @event-selected="eventSelected" @select-overlap="selectOverlap" @day-click="dayClick" :config="config"></full-calendar>
    <div id="breaks-modal" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
            <h2 class="uk-modal-title">Pertraukos</h2>
            <form @submit.prevent="createPosition">
              <div uk-grid v-for="item, index in breaks">
                <div class="uk-width-2-5">
                  <label class="uk-form-label">Pradžia</label>
                  <div class="uk-form-controls">
                    <select class="uk-select" v-model="breaks[index].end">
                      <option value="11:30">11:30</option>
                      <option value="12:00">12:00</option>
                    </select>
                  </div>
                </div>
                <div class="uk-width-2-5">
                  <label class="uk-form-label">Pabaiga</label>
                  <div class="uk-form-controls">
                    <select class="uk-select" v-model="breaks[index].end">
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                    </select>
                  </div>
                </div>
                <div class="uk-width-1-5">
                  <button class="uk-button uk-button-danger uk-button-small uk-margin-top" type="button" v-on:click="breakCountUpdate(false, index)" v-if="breaks.length > 0">Ištrinti</button>
                </div>
              </div>
              <br>
              <button class="uk-button uk-button-secondary uk-button-small" type="button" v-on:click="breakCountUpdate(true)" v-if="breaks.length < 3">Nauja pertrauka</button>
              <hr>
              <div class="uk-align-left">
                <button class="uk-button uk-button-primary uk-button-medium uk-modal-close" type="submit">Išsaugoti</button>
              </div>
            </form>
        </div>
    </div>
  </div>
</template>

<script>

  // import { FullCalendar } from 'vue-full-calendar'
  import moment from 'moment'
  import 'fullcalendar/dist/locale/lt'
  export default{
    name: 'schedule-view',
    // components: {FullCalendar},
    data(){
      return {
        schedule_id: this.$route.params.id,
        schedule: [],
        selected: [],
        multipleDays: true,
        // startTime: 'Pasirinkite',
        // endTime: 'Pasirinkite',
        startTime: '7:30',
        endTime: '9:00',
        miltpleData: [],
        extDay: false,
        config:{
          firstDay: 1,
          defaultView: 'month',
          selectable: false,
          displayEventEnd: true,
          locale: 'lt',
          dayNamesShort: ['Sekm', 'Pir','Antr','Tre','Ket','Pen','Šešt'],
          monthNames: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Biržėlis', 'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
          nextDayThreshold: '00:00:00',
        },
        events: [],
        breaks: [],
        breakCount: 1,
        workHours: 0,
        updateData: [
          {
            schedule_id: this.$route.params.id,
          }
        ]
      }
    },
    mounted(){
      this.getData()
    },
    methods:{
      getData(){
        this.$http.all([
          this.$http.get('schedule-data/' + this.schedule_id),
          this.$http.get('schedule/' + this.schedule_id)
        ]).then(this.$http.spread((scheduleData, schedule) => {
          this.events = scheduleData.data
          this.schedule = schedule.data
          this.countWorkHours()
        })).catch(err => {
          this.notify('danger', 'Klaida įkeliant tvarkaraštį! ')
        })
      },
      countWorkHours(){
        this.workHours = 0
        this.events.forEach(item => {
          var st = moment(item.start)
          var en = moment(item.end)

          var diff = en.diff(st, 'minutes')
          if(item.type == 'work'){
            this.workHours = parseInt(diff) + parseInt(this.workHours)
          } else{
            this.workHours = parseInt(this.workHours) - parseInt(diff)
          }
        })
      },
      notify(status, message){
        this.$uikit.notification({
          message: message,
          status: status,
          timeout: 3000,
        })
      },
      removeEventsRendering(){
        var temp = []
        this.events.forEach(item => {
          if(item.rendering == ''){
            temp.push(item)
          }
        })
        this.events = temp
      },
      updateSchedule(){
        this.updateData.push(this.events)

        this.$http.patch('schedule-data/' + this.schedule_id, this.events).then(res => {
          this.getData()
          this.notify('success', 'Tvarkaraštis atnaujintas')
          this.breaks = []
          this.extDay = false
          this.startTime = 'Pasirinkite'
          this.endTime = 'Pasirinkite'
        }).catch(err => {
          this.notify('danger', 'Nepavyko atnaujinti tvarkaraščio')
        })
      },
      eventSelected(calEvent) {
        var type = 'darbo'

        if(calEvent.type == 'work'){
          type = 'darbo'
        } else{
          type = 'pertraukos'
        }
        var temp = []
        this.events.forEach(item => {
          if(item.id != calEvent.id){
            temp.push(item)
          }
        })
        this.events = temp;
        this.countWorkHours()
      },
      selectOverlap(event) {
         return event.rendering === 'background';

      },
      dayClick(event, jsEvent, view){
        var selectionWork = {
          start: event,
          end: event,
          rendering: 'background',
          type: 'work'
        }

        //Working hours
        var duplicate = false
        if(this.events.length != 0){
          duplicate = false
          this.events.forEach(item => {
            //checks if there are no duplicates
            if(moment(item.start._d).isSame(selectionWork.start._d)){
              duplicate = true
            }
          })
        }
        if(!duplicate){
          this.events.push(selectionWork)
        } else {
          //removes selection if duplicate
          this.events = this.events.filter(item => {
            return item.start._i != event._i
          })
        }
      },
      addRecord(){
        this.events.forEach((item, index) => {
          if(item.rendering == 'background'){
            var currentStart = item.start.format('Y-MM-DD')
            var currentEnd = item.start.format('Y-MM-DD')

            if(this.breaks.length > 0){
              console.log('break')
              this.breaks.forEach(breakItem => {
                var singleBreak = {
                  start: moment(currentStart + ' ' + breakItem.start).format('Y MM DD HH:mm'),
                  end: moment(currentEnd + ' ' + breakItem.end).format('Y MM DD HH:mm'),
                  color: '#ffbf00',
                  rendering: '',
                  type: 'break'
                }
                this.events.push(singleBreak)
              })
            }

            if(this.startTime != 'Pasirinkite' && this.endTime != 'Pasirinkite'){
              item.start = moment(currentStart + ' ' + this.startTime).format('Y-MM-DD HH:mm')
              if(this.extDay){
                item.end = moment(currentEnd + ' ' + this.endTime).add(1, 'd').format('Y-MM-DD HH:mm')
              } else {
                item.end = moment(currentEnd + ' ' + this.endTime).format('Y-MM-DD HH:mm')
              }
              item.rendering = ''
            }
          }
        })
        this.countWorkHours()
        this.updateSchedule()
      },
      removeEvent(event){
        this.$refs.calendar.$emit('remove-event', event)
      },
      breakCountUpdate(opt, index = null){
        if(opt && this.breaks.length < 3){
          var newBreak = {
            start: '11:30',
            end: '12:00'
          }
          this.breaks.push(newBreak)
          console.log(this.breaks)
        } else if (!opt && this.breaks.length >= 1){
          this.breaks.splice(index, 1)
        }
      }
    }
  }
</script>
<style>
   @import '~fullcalendar/dist/fullcalendar.css';
   .fc-basic-view .fc-body .fc-row{
     min-height: 2em;
     height: auto!important;
   }
   .fc-day-grid-container{
     height: auto!important;
   }
   .fc-prev-button, .fc-next-button, .fc-today-button, .fc-agendaWeek-button, .fc-agendaDay-button, .fc-month-button{
     background: #fff;
     border-radius: 0!important;
   }
   .fc-center h2{
     font-size: 18px;
   }
   #informacija{
     font-size: 14px;
   }
 </style>
