<template>
  <div class="wrapper">
    <form v-on:submit="addRecord()">
      <div class="column">
        <h5>Darbas</h5>
        <hr>
        <label>Pridėti keletą dienų</label>
        <label class="switch">
          <input type="checkbox" v-model="multipleDays" checked>
          <span class="slider round"></span>
        </label>
        <br>
        <label>Pradžia</label>
        <select v-model="startTime">
          <option value="8:00">8:00</option>
          <option value="9:00">9:00</option>
        </select>
        <label>Pabaiga</label>
        <select v-model="endTime">
          <option value="17:00">17:00</option>
          <option value="18:00">18:00</option>
        </select>
      </div>
      <div class="column">
        <h5>Pertraukos</h5>
        <hr>
        <div v-for="item, index in breaks">
          <label>Pradžia</label>
          <select v-model="item.start">
            <option value="11:30">11:30</option>
            <option value="12:00">12:00</option>
          </select>
          <label>Pabaiga</label>
          <select v-model="item.end">
            <option value="12:00">12:00</option>
            <option value="13:00">13:00</option>
          </select>
          <button type="button" v-on:click="breakCountUpdate(false, index)" v-if="breaks.length > 0">-</button>
        </div>
        <button type="button" v-on:click="breakCountUpdate(true)" v-if="breaks.length < 3">+</button>
      </div>
      <div class="column">
        <h5>Veiksmai</h5>
        <hr>
        <button>Pridėti</button>
        <button type="button" v-on:click="updateSchedule()">ATNAUJINTI</button>
      </div>
    </form>
    <full-calendar :events="events" @event-selected="eventSelected" @select-overlap="selectOverlap" @day-click="dayClick" :config="config"></full-calendar>
  </div>
</template>

<script>
  import { FullCalendar } from 'vue-full-calendar'
  import moment from 'moment'

  export default{
    name: 'schedule-view',
    components: {FullCalendar},
    data(){
      return {
        schedule_id: this.$route.params.id,
        selected: [],
        multipleDays: true,
        startTime: '8:00',
        endTime: '17:00',
        miltpleData: [],
        config:{
          defaultView: 'month',
          selectable: false,
          displayEventEnd: true
        },
        events: [],
        breaks: [],
        breakCount: 1,
        updateData: [
          {
            schedule_id: this.$route.params.id,
          }
        ]
      }
    },
    mounted(){
      this.$http.get('schedule-data/' + this.schedule_id).then(res => {
        this.events = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    methods:{
      updateSchedule(){
        this.updateData.push(this.events)

        this.$http.patch('schedule-data/' + this.schedule_id, this.events).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      },
      eventSelected(calEvent) {
        console.log(calEvent)
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
        this.events.forEach(item => {
          console.log(item)
          if(item.rendering == 'background'){
            var currentStart = item.start.format('Y MM DD')
            var currentEnd = item.start.format('Y MM DD')

            if(this.breaks.length > 0){
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

            item.start = moment(currentStart + ' ' + this.startTime).format('Y MM DD HH:mm')
            item.end = moment(currentEnd + ' ' + this.endTime).format('Y MM DD HH:mm')
            item.rendering = ''


          }
          console.log(item)
        })
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
   form{
     min-height: 100px;
   }
   h5{
     text-transform: uppercase;
   }
   label{
     font-size: 12px;
     color: #999;
     margin-right: 5px;
   }
   .switch {
    position: relative;
    display: inline-block;
    width: 39px;
    height: 18px;
    margin-top: 5px;
  }

  .switch input {display:none;}

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 4px;
    bottom: 3px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: #2196F3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(20px);
    -ms-transform: translateX(20px);
    transform: translateX(20px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
  .column{
    width: 33%;
    float: left;
  }
 </style>
