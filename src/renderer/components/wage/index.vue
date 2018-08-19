<template>
  <div>
    <table class="uk-table uk-table-divider">
      <thead>
          <tr>
              <th>Darbuotojas</th>
              <th v-for="month in months.names">{{ month }}</th>
          </tr>
          <tr v-for="employee in employees" v-if="employee.schedule">
            <td>{{ employee.name + ' ' + employee.surname }}</td>
            <!-- <td v-for="month in months">0 &euro;</td> -->
            <td v-for="month in months">{{ calculateWage(month+1, employee.schedule.data, employee).toFixed(2) }} &euro;</td>
          </tr>
      </thead>
    </table>
    <button class="uk-hidden" id="load" uk-toggle="target: #loading-modal"></button>
    <div id="loading-modal" uk-modal class="uk-modal uk-open" style="display: none">
      <div class="uk-modal-dialog">
        <div class="uk-modal-body uk-margin-top uk-position-center">
          <div uk-spinner="ratio: 3" style="color: #000; margin-left: 40%; margin-top: 375px"></div>
        </div>
        <button id="closeLoadingModal" class="uk-button uk-button-default uk-modal-close uk-hidden" type="button">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default{
    data(){
      return{
        events: [],
        months: [],
        settings: [],
        employees: [],
        holidays: [],
        // nightMultiplier: 0,
        // holidayMultiplier: 0,
      }
    },
    mounted(){
      document.getElementById('load').click()
      this.$http.all([
        this.$http.get('employee'),
        this.$http.get('settings'),
        this.$http.get('holidays')
      ]).then(this.$http.spread((employees, settings, holiday) => {
        // this.nightMultiplier = settings.data.nightMultiplier
        // this.holidayMultiplier = settings.data.holidayMultiplier
        this.employees = employees.data
        this.settings = settings.data
        this.holidays = holiday.data
      })).catch(err => {
        this.notify('warning', 'Klaida įkeliant duomenis!')
        console.log(err)
      })
      this.$http.get('schedule-data').then(res => {
        this.events = res.data
        this.getMonths()
      }).catch(err => {
        this.notify('warning', 'Klaida įkeliant duomenis!')
        console.log(err)
      })
    },
    methods:{
      notify(status, message){
        this.$uikit.notification({
          message: message,
          status: status,
          timeout: 3000,
        })
      },
      calculateWage(month, data, employee){
        if(!employee.position){
          document.getElementById('closeLoadingModal').click()
          return 0
        }
        
        var totalWorkingMinutes = 0
        var totalHolidayMinutes = 0
        var totalNightMinutes = 0

        const nightWage = employee.position.wage * this.settings.night_multiplier
        const holidayWage = employee.position.wage * this.settings.holiday_multiplier
        const wage = employee.position.wage
        const night1 = this.settings.night_starts
        const night2 = this.settings.night_ends

        data.forEach(item => {
          var st = moment(item.start)
          var en = moment(item.end)

          var nightStart = moment(item.start.substring(0, 11) + night1)
          var nightEnd = moment(item.end.substring(0, 11) + night2)

          var daysInMonth = moment(en.get('year') + '-' + month).daysInMonth()
          var dateBegin = en.get('year') + '-' + month + '-01'
          var dateEnd = en.get('year') + '-' + month + '-' + daysInMonth
          //Checking if current date is in a month range
          var checker = en.isBetween(dateBegin, dateEnd, null, [])

          if(checker){
            //Counting Total Working Hours
            var diff = en.diff(st, 'minutes')
            if(item.type != 'vacation' && item.type != 'holiday'){
              if(item.type == 'work'){
                totalWorkingMinutes = parseInt(diff) + parseInt(totalWorkingMinutes)
              } else{
                totalWorkingMinutes = parseInt(totalWorkingMinutes) - parseInt(diff)
              }
            }

            //Counting Night Working hours
            if(item.type == 'work'){
              if(item.overNight){
                if(en >= nightEnd){
                  var count = nightEnd.diff(nightStart, 'm')
                  if(count > 0){
                    totalNightMinutes = parseInt(totalNightMinutes) + parseInt(count)
                  }
                } else {
                  var count = en.diff(nightStart, 'm')
                  if(count > 0){
                    totalNightMinutes= parseInt(totalNightMinutes) + parseInt(count)
                  }
                }
                //BREAKS
              } else{
                var count = en.diff(nightStart, 'm')
                if(count > 0){
                  totalNightMinutes = parseInt(totalNightMinutes) + parseInt(count)
                }
              }
            }

            this.holidays.forEach(holidayItem => {
              if(moment(item.start.substring(0,10)).isBetween(holidayItem.date, holidayItem.date, null, [])){
                  var hStart = moment(holidayItem.date + ' 00:00')
                  var hEnd = moment(holidayItem.date + ' 24:00')

                  var itemStart = moment(item.start)
                  var itemEnd = moment(item.end)

                  if(itemStart.get('date') == itemEnd.get('date')){
                    var difference = itemEnd.diff(itemStart, 'm')
                  } else{
                    //If it is first day of overnight
                    if(hStart.get('date') == itemStart.get('date')){
                      var difference = hEnd.diff(itemStart, 'm')
                      //If it is second day of overnight
                    } else{
                      var difference = itemEnd.diff(hStart, 'm')
                    }
                  }
                  totalHolidayMinutes = totalHolidayMinutes + parseInt(difference)
              }
            })
          }
        })

        totalWorkingMinutes = totalWorkingMinutes - totalNightMinutes - totalHolidayMinutes

        document.getElementById('closeLoadingModal').click()

        return ((nightWage /  60) * totalNightMinutes) + ((wage / 60) * totalWorkingMinutes) + ((holidayWage / 60) * totalHolidayMinutes)
      },
      getMonths(){
        this.events.forEach(item => {
          var start = moment(item.start)

          if(this.months.indexOf(start.get('month')) == -1){
              this.months.push(start.get('month'))
          }
        })
        this.monthsToNames()
      },
      monthsToNames(){
        var temp = []
        this.months.forEach(item => {
          switch(item){
            case 0:
              temp.push('Sausis')
              break;
            case 1:
              temp.push('Vasaris')
              break;
            case 2:
              temp.push('Kovas')
              break;
            case 3:
              temp.push('Balandis')
              break;
            case 4:
            temp.push('Gegužė')
              break;
            case 5:
              temp.push('Biržėlis')
              break;
            case 6:
              temp.push('Liepa')
              break;
            case 7:
              temp.push('Rugpjūtis')
              break;
            case 8:
              temp.push('Rugsėjis')
              break;
            case 9:
              temp.push('Spalis')
              break;
            case 10:
              temp.push('Lapkritis')
              break;
            case 11:
              temp.push('Gruodis')
          }
        })
        this.months.names = temp
      }
    }
  }
</script>
