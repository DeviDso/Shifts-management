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
            <option value="20:00">20:00</option>
            <option value="23:00">23:00</option>
          </select>
        </div>
        <br>
        <label><input class="uk-checkbox" type="checkbox" v-model="extDay"> Parinė</label>
        <label><input class="uk-checkbox" type="checkbox" v-model="vacation"> Atostogos</label>
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
          Max: {{ schedule.max_hours }} h {{ schedule.max_minutes }} min<br>
          Dirbama: {{ Math.trunc(workHours / 60) }} h {{ workHours % 60 }} min<br>
          Naktinės: {{ Math.trunc(nightHours / 60) }} h {{ nightHours % 60}} min <br>
          <br>
          <b>Liko: {{ Math.trunc((maxInMinutes - workHours) / 60) }} h {{ Math.abs((maxInMinutes - workHours) % 60) }} min</b>
          <!-- Liko: {{ Math.trunc(maxInMinutes / 60) - (workHours / 60) }} h {{ (maxInMinutes  % 60) - (workHours % 60) }} min -->
          <br>
          <!-- <span class="uk-label" v-if="daysSelected > 0">Pasirinkta dienų: {{ daysSelected }}</span> -->
        </div>
        <div class="uk-width-1-4">
          <h5>Veiksmai</h5>
          <button class="uk-button uk-button-secondary uk-button-small">Išsaugoti</button>
          <!-- <button class="uk-button uk-button-secondary uk-button-small" type="button" v-on:click="updateSchedule()">ATNAUJINTI</button> -->
          <hr>
          <button type="button" uk-toggle="target: #settings-modal" class="uk-button uk-button-default uk-button-small">Nustatymai</button>
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
                    <select class="uk-select" v-model="breaks[index].start">
                      <option value="11:30">11:30</option>
                      <option value="12:00">12:00</option>
                      <option value="16:30">16:30</option>
                    </select>
                  </div>
                </div>
                <div class="uk-width-2-5">
                  <label class="uk-form-label">Pabaiga</label>
                  <div class="uk-form-controls">
                    <select class="uk-select" v-model="breaks[index].end">
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                      <option value="17:00">17:00</option>
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
    <div id="settings-modal" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
            <h2 class="uk-modal-title">Tvarkaraščio nustatymai</h2>
            <div class="uk-align-center" uk-grid>
              <form class="uk-form-horizontal uk-margin-large" @submit.prevent="updateSettings">
                <div class="uk-margin">
                    <label class="uk-form-label">Pavadinimas</label>
                    <div class="uk-form-controls">
                        <input class="uk-input" v-model="schedule.name" type="text" placeholder="Tvarkaraščio pavadinimas" required :disabled="schedule.private == 1">
                    </div>
                </div>
                <h5 class="uk-heading-divider">Maksimalus dirbamų valandų skaičius</h5>
                <div class="uk-margin">
                    <label class="uk-form-label">Valandos <sup>(0 - 8670 h)</sup></label>
                    <div class="uk-form-controls">
                        <input class="uk-input" v-model="schedule.max_hours" type="number" min="1" max="8670">
                    </div>
                </div>
                <div class="uk-margin">
                    <label class="uk-form-label">Minutės <sup>(0 - 59 min)</sup></label>
                    <div class="uk-form-controls">
                        <input class="uk-input" v-model="schedule.max_minutes" type="number" min="0" max="59">
                    </div>
                </div>
                <hr>
                <div class="uk-margin">
                    <label class="uk-form-label">Tvarkraščio ištrinimas</label>
                    <div class="uk-form-controls">
                        <button class="uk-button uk-button-danger uk-button-small" v-on:click="deleteSchedule()" type="button">Ištrinti tvarkaraštį</button>
                    </div>
                </div>
                <hr>
                <div class="uk-align-left">
                  <button class="uk-button uk-button-primary uk-button-small" type="submit">Išsaugoti</button>
                </div>
                <div class="uk-align-right">
                  <button id="closeScheduleSettings" class="uk-button uk-button-secondary uk-button-small uk-modal-close" type="button">Uždaryti</button>
                </div>
              </form>
            </div>
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
        startTime: 'Pasirinkite',
        endTime: 'Pasirinkite',
        miltpleData: [],
        extDay: false,
        vacation: false,
        config:{
          // height: '100px',
          firstDay: 1,
          defaultView: 'month',
          selectable: false,
          disableDragging: true,
          editable: false,
          dragScroll: false,
          displayEventEnd: true,
          locale: 'lt',
          dayNamesShort: ['Sekm', 'Pir','Antr','Tre','Ket','Pen','Šešt'],
          monthNames: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Biržėlis', 'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
          nextDayThreshold: '00:00:00',
        },
        events: [],
        breaks: [],
        maxInMinutes: 0,
        breakCount: 1,
        workHours: 0,
        unselectAuto: false,
        daysSelected: 0,
        nightHours: 0,
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
          this.countNightHours()
          this.maxInMinutes = (this.schedule.max_hours * 60) + this.schedule.max_minutes
        })).catch(err => {
          this.notify('danger', 'Klaida įkeliant tvarkaraštį! ')
          console.log(err)
        })
      },
      countWorkHours(){
        this.workHours = 0
        this.events.forEach(item => {
          var st = moment(item.start)
          var en = moment(item.end)

          var diff = en.diff(st, 'minutes')
          if(item.type != 'vacation'){
            if(item.type == 'work'){
              this.workHours = parseInt(diff) + parseInt(this.workHours)
            } else{
              this.workHours = parseInt(this.workHours) - parseInt(diff)
            }
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
      updateSettings(){
        this.$http.patch('schedule/' + this.schedule.id, this.schedule).then(res => {
          this.notify('success', 'Tvarkaraštis atnaujitnas!')
          document.getElementById('closeScheduleSettings').click()
          this.getData()
        }).catch(err => {
          this.notify('danger', 'Klaida atnaujinant tvarkaraštį!')
          console.log(err)
        })
      },
      removeEventsRendering(){
        var temp = []
        this.events.forEach(item => {
          if(item.rendering != 'background'){
            temp.push(item)
          }
        })
        this.events = temp
      },
      countNightHours(){
        const night1 = '20:00'
        const night2 = '06:00'

        var events = this.events
        this.nightHours = 0

        events.forEach(item => {
          var start = moment(item.start)
          var end = moment(item.end)

          var nightStart = moment(item.start.substring(0, 11) + night1)
          var nightEnd = moment(item.end.substring(0, 11) + night2)

          if(item.type == 'work'){
            if(item.overNight){
              if(end >= nightEnd){
                var count = nightEnd.diff(nightStart, 'm')
                if(count > 0){
                  this.nightHours = parseInt(this.nightHours) + parseInt(count)
                }
              } else {
                var count = end.diff(nightStart, 'm')
                if(count > 0){
                  this.nightHours = parseInt(this.nightHours) + parseInt(count)
                }
              }
              //BREAKS
            } else{
              var count = end.diff(nightStart, 'm')
              if(count > 0){
                this.nightHours = parseInt(this.nightHours) + parseInt(count)
              }
            }
          }
        })
      },
      updateSchedule(){
        this.removeEventsRendering()
        this.updateData.push(this.events)

        this.$http.patch('schedule-data/' + this.schedule_id, this.events).then(res => {
          this.getData()
          this.notify('success', 'Tvarkaraštis atnaujintas')
          this.breaks = []
          this.extDay = false
          this.startTime = 'Pasirinkite'
          this.endTime = 'Pasirinkite'
          this.vacation = false
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
          this.daysSelected++
        } else {
          //removes selection if duplicate
          this.events = this.events.filter(item => {
            return item.start._i != event._i
          })
          this.daysSelected--
        }
      },
      addRecord(){
        this.events.forEach((item, index) => {
          if(item.rendering == 'background'){
            var currentStart = item.start.format('Y-MM-DD')
            var currentEnd = item.start.format('Y-MM-DD')

            if(this.breaks.length > 0){
              this.breaks.forEach(breakItem => {
                var singleBreak = {
                  start: moment(currentStart + ' ' + breakItem.start).format('Y-MM-DD HH:mm'),
                  end: moment(currentEnd + ' ' + breakItem.end).format('Y-MM-DD HH:mm'),
                  color: '#ffbf00',
                  rendering: '',
                  type: 'break'
                }
                this.events.push(singleBreak)
              })
            }

            if(this.vacation){
              item.start = moment(currentStart).format('Y-MM-DD')
              item.end = ''
              item.color = '#e74c3c'
              item.rendering = ''
              item.title = 'Atostogos'
              item.type = 'vacation'
              item.allDay = true
            }

            if(this.startTime != 'Pasirinkite' && this.endTime != 'Pasirinkite' && !this.vacation){
              item.start = moment(currentStart + ' ' + this.startTime).format('Y-MM-DD HH:mm')
              if(this.extDay){
                item.end = moment(currentEnd + ' ' + this.endTime).add(1, 'd').format('Y-MM-DD HH:mm')
                item.overNight = true
              } else {
                item.end = moment(currentEnd + ' ' + this.endTime).format('Y-MM-DD HH:mm')
              }
              item.rendering = ''
            }
          }
        })
        this.countWorkHours()
        this.updateSchedule()
        this.daysSelected = 0
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
      },
      deleteSchedule(){
        var confirmed = confirm('Ar tikrai norite ištrinti tvarkaraštį? Po ištrinimo tvarkaraščio sugrąžinti nebeįmanoma!')

        if(confirmed){
          this.$http.delete('schedule/' + this.schedule.id).then(res => {
            this.notify('success', res.data)
            document.getElementById('closeScheduleSettings').click()
            this.$router.push({name:'schedules'})
          }).catch(err => {
            this.notify('warning', 'Nepavyko ištrinti tvarkaraščio!')
          })
        }
      }
    },
    watch:{
      vacation(result){
        if(result){
          this.extDay = false
          this.startTime = 'Pasirinkite'
          this.endTime = 'Pasirinkite'
        }
      },
      extDay(result){
        if(result){
          this.vacation = false
        }
      }
    }
  }
</script>
<style>
   @import '~fullcalendar/dist/fullcalendar.css';
   .fc-basic-view .fc-body .fc-row{
     min-height: 2em;
     /* height: auto!important; */
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
