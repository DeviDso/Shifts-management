<template>
  <div class="wrapper">
    <form v-on:submit="addRecord()">
      <input type="date" v-model="newData.startDate">
      <input type="date" v-model="newData.endDate">
      <select v-model="newData.startTime">
        <option value="11:30">11:30</option>
        <option value="12:00">12:00</option>
      </select>
      <select v-model="newData.endTime">
        <option value="20:30">20:30</option>
        <option value="21:00">21:00</option>
      </select>
      <button type="submit">Pridėti</button>
    </form>
    <input type="checkbox" v-model="multipleDays">
    <br><br>
    <hr>
    <hr>
    <div id="calendar"></div>
  </div>
</template>

<script>
  import jQuery from 'jquery'

  export default{
    name: 'schedule-dontview',

    data(){
      return {
        selected: [],
        multipleDays: true,
        miltpleData: [],
        newData: [],
      }
    },
    mounted(){
      jQuery('#calendar').fullCalendar({
      header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
      },
      defaultView: 'month',
      events: [{
          start: '2018-08-11T13:00:00',
          end: '2018-08-11T16:00:00',
      }, ],
      selectable: true,
      select: function (start, end, jsEvent, view) {
          jQuery("#calendar").fullCalendar('addEventSource', [{
              start: start,
              end: end,
              // rendering: 'background',
              block: true,
          }, ]);
          // jQuery("#calendar").fullCalendar("unselect");
      },
      selectOverlap: function(event) {
          return ! event.block;
      }
  });
    },
    methods:{

    }
  }
</script>
<style>
   @import '~fullcalendar/dist/fullcalendar.css';
 </style>
