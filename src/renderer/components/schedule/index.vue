<template>
  <div>
    <div class="uk-align-right">
      <button class="uk-button uk-button-primary uk-button-small" uk-toggle="target: #new-schedule" type="button">Sukurti naują</button>
    </div>
    <h1 class="uk-heading-divider">Tvarkaraščiai</h1>
    <ul class="uk-subnav uk-subnav-pill" uk-switcher>
        <li><a href="#">Bendri</a></li>
        <li><a href="#">Asmeniniai</a></li>
    </ul>
    <ul class="uk-switcher uk-margin">
        <li>
          <table class="uk-table uk-table-hover uk-table-divider">
            <thead>
              <tr>
                  <th>Pavadinimas</th>
                  <th>Dirbamų valandų skaičius</th>
                  <th>Priskirta žmonių</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="schedule, index in schedules" v-on:click="openSchedule(schedule.id)" v-if="!schedule.private">
                  <td>{{ schedule.name }}</td>
                  <td>{{ schedule.max_hours + 'h ' + schedule.max_minutes + 'm'}}</td>
                  <td>{{ schedule.employee.length }}</td>
              </tr>
            </tbody>
          </table>
        </li>
        <li>
          <table class="uk-table uk-table-hover uk-table-divider">
            <thead>
              <tr>
                  <th>Pavadinimas</th>
                  <th>Dirbamų valandų skaičius</th>
                  <!-- <th>Priskirta žmonių</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="schedule, index in schedules" v-on:click="openSchedule(schedule.id)" v-if="schedule.private">
                  <td>{{ schedule.name }}</td>
                  <td>{{ schedule.max_hours + 'h ' + schedule.max_minutes + 'm'}}</td>
                  <!-- <td>-</td> -->
              </tr>
            </tbody>
          </table>
        </li>
    </ul>
    <div id="new-schedule" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
            <h2 class="uk-modal-title">Naujas tvarkaraštis</h2>
            <div class="uk-align-center" uk-grid>
              <form class="uk-form-horizontal uk-margin-large" @submit.prevent="createSchedule">
                <div class="uk-margin">
                    <label class="uk-form-label">Pavadinimas</label>
                    <div class="uk-form-controls">
                        <input class="uk-input" v-model="schedule.name" type="text" placeholder="Tvarkaraščio pavadinimas" required>
                    </div>
                </div>
                <h5 class="uk-heading-divider">Maksimalus dirbamų valandų skaičius</h5>
                <div class="uk-margin">
                    <label class="uk-form-label">Valandos</label>
                    <div class="uk-form-controls">
                        <input class="uk-input" v-model="schedule.max_hours" type="number" min="1" max="999">
                    </div>
                </div>
                <div class="uk-margin">
                    <label class="uk-form-label">Minutės</label>
                    <div class="uk-form-controls">
                        <input class="uk-input" v-model="schedule.max_minutes" type="number" min="0" max="59">
                    </div>
                </div>
                <div class="uk-align-left">
                  <button class="uk-button uk-button-primary uk-button-small" type="submit">Sukurti</button>
                </div>
                <div class="uk-align-right">
                  <button id="newScheduleClose" class="uk-button uk-button-secondary uk-button-small uk-modal-close" type="button">Uždaryti</button>
                </div>
              </form>
            </div>
        </div>
    </div>
  </div>
</template>

<script>

  export default{
    data(){
      return {
        schedule: {
          name: '',
          max_hours: '0',
          max_minutes: '0',
          private: false
        },
        schedules: [],
      }
    },
    mounted(){
      this.getList()
    },
    methods:{
      notify(status, message){
        this.$uikit.notification({
          message: message,
          status: status,
          timeout: 3000,
        })
      },
      getList(){
        this.$http.get('schedule').then(res => {
          this.schedules = res.data
        }).catch(err => {
          this.notify('danger', 'Klaida įkeliant duomenis')
        })
      },
      createSchedule(){
        this.$http.post('schedule', this.schedule).then(res => {
          this.schedule.name = ''
          this.schedule.max_hours = 0
          this.schedule.max_minutes = 0
          this.notify('success', 'Tvarkaraštis sukurtas')
          document.getElementById('newScheduleClose').click()
          this.getList()
        }).catch(err => {
          this.notify('danger', 'Klaida!<br>' + err.response.data.name[0])
        })
      },
      openSchedule(id){
        this.$router.push({name: 'schedule-view', params:{id:id}})
      }
    }
  }
</script>
<style media="screen">
  .uk-modal-title{
    font-size: 22px;
  }
</style>
