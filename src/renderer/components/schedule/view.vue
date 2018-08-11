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
        <h5>Pertrauka</h5>
        <hr>
        <div v-for="index in breakCount">
          <label>Pradžia</label>
          <select name="breaks[]">
            <option value="11:30">11:30</option>
            <option value="12:00">12:00</option>
          </select>
          <label>Pabaiga</label>
          <select name="breaks[]">
            <option value="12:30">12:30</option>
            <option value="13:00">13:00</option>
          </select>
        </div>
        <button type="button" v-on:click="breakCountUpdate(true)" v-if="breakCount < 3">+</button>
      </div>
      <div class="column">
        <h5>Veiksmai</h5>
        <hr>
        <button>Pridėti</button>
      </div>
    </form>
    {{ events }}
    <full-calendar :events="events" @event-selected="eventSelected" @select-overlap="selectOverlap" @day-click="dayClick" :config="config"></full-calendar>
  </div>
</template>

<script>
  import { FullCalendar } from 'vue-full-calendar'

  export default{
    name: 'schedule-view',
    components: {FullCalendar},
    data(){
      return {
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
      }
    },
    mounted(){
      //
    },
    methods:{
      eventSelected(calEvent) {
        console.log(calEvent)
      },
      selectOverlap(event) {
        // console.log(event)
         return event.rendering === 'background';

      },
      dayClick(event, jsEvent, view){
        var selection = {
          start: event,
          end: event,
          rendering: 'background',
          type: 'darbas'
        }

        var duplicate = false
        console.log(event)
        if(this.events.length != 0){
          duplicate = false
          this.events.forEach(item => {
            var d = new Date(item.start._i)
            var selectionDate = d.getFullYear() + ' ' + ("0" + (d.getMonth() + 1)).slice(-2) + ' ' + ("0" + (d.getDate() + 1)).slice(-2)
            var first = selection.start.format()

            var some = new Date(first)
            some = some.getFullYear() + ' ' + ("0" + (some.getMonth() + 1)).slice(-2) + ' ' + ("0" + (some.getMonth() + 1)).slice(-2)

            if(some == selectionDate){
              duplicate = true

            }
          })
        }
        if(!duplicate){
          this.events.push(selection)
        } else {
          this.events = this.events.filter(item => {
            return item.start._i != event._i
          })
        }
      },
      addRecord(){
        this.events.forEach(item => {
          if(item.rendering == 'background'){
            var currentStart = item.start.format('Y-MM-DD').toString()
            var currentEnd = item.start.format('Y-MM-DD').toString()

            item.start = currentStart + ' ' + this.startTime
            item.end = currentEnd + ' ' + this.endTime
            item.rendering = ''
          }
        })
      },
      breakCountUpdate(opt){
        if(opt && this.breakCount < 3){
          this.breakCount++
        } else if (!opt && this.breakCount >= 1){
          this.breakCount--
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
