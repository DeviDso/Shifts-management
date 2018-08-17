<template>
  <div>
    <h1 class="uk-heading-divider">Nustatymai</h1>
    <form @submit.prevent="updateSettings">
      <div uk-grid>
        <div class="uk-width-1-3">
          <h5>Laikas ir užmokestis</h5>
          <div uk-grid>
            <div class="uk-width-1-2">
              <label class="uk-form-label">Nakties pradžia</label>
              <div class="uk-form-controls">
                <select class="uk-select uk-form-small" v-model="settings.night_starts">
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                  <option value="22:00">22:00</option>
                  <option value="23:00">23:00</option>
                  <option value="24:00">24:00</option>
                </select>
              </div>
            </div>
            <div class="uk-width-1-2">
              <label class="uk-form-label">Nakties pabaiga</label>
              <div class="uk-form-controls">
                <select class="uk-select uk-form-small" v-model="settings.night_ends">
                  <option value="5:00">4:00</option>
                  <option value="6:00">6:00</option>
                  <option value="7:00">7:00</option>
                  <option value="8:00">8:00</option>
                  <option value="9:00">9:00</option>
                  <option value="10:00">22:00</option>
                </select>
              </div>
            </div>
            <div class="uk-width-1-2">
              <label class="uk-form-label">Naktinis tarifas</label>
              <div class="uk-form-controls">
                <select class="uk-select uk-form-small" v-model="settings.night_multiplier">
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="1.75">1.75x</option>
                  <option value="2.00">2.00x</option>
                  <option value="2.25">2.25x</option>
                  <option value="2.50">2.50x</option>
                  <option value="3.00">3.00x</option>
                </select>
              </div>
            </div>
            <div class="uk-width-1-2">
              <label class="uk-form-label">Šventinis tarifas</label>
              <div class="uk-form-controls">
                <select class="uk-select uk-form-small" v-model="settings.holiday_multiplier">
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="1.75">1.75x</option>
                  <option value="2.00">2.00x</option>
                  <option value="2.25">2.25x</option>
                  <option value="2.50">2.50x</option>
                  <option value="3.00">3.00x</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="uk-width-1-3">
          <h5>Šventės</h5>
          <div v-if="holidays.length > 0">
            <span v-for="item in holidays">
              <sup>{{ item.date }} - {{ item.title }}</sup> <br>
            </span>
          </div>
          <button type="button" uk-toggle="target: #holidays-modal" class="uk-button uk-button-default uk-button-small">{{ (this.holidays.length > 0) ? 'Redaguoti' : 'Pridėti'}}</button>
        </div>
        <div class="uk-width-1-3">
          <h5>Veiksmai</h5>
          <div uk-grid>
            <div class="uk-width-1-2">
              <button type="submit" class="uk-button uk-button-primary uk-button-small">Išsaugoti</button>
            </div>
            <div class="uk-width-1-1">
              <hr>
              <button type="button" class="uk-button uk-button-danger uk-button-small">Tvarkraščių išvalymas</button>
            </div>
          </div>
        </div>
      </div>
    </form>
    <div id="holidays-modal" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
            <h2 class="uk-modal-title">Šventinės</h2>
            <form @submit.prevent="updateHolidays">
              <div uk-grid v-for="item, index in holidays">
                <div class="uk-width-2-5">
                  <label class="uk-form-label">Pavadinimas</label>
                  <div class="uk-form-controls">
                    <input type="text" class="uk-input" v-model="holidays[index].title" required>
                  </div>
                </div>
                <div class="uk-width-2-5">
                  <label class="uk-form-label">Data</label>
                  <div class="uk-form-controls">
                    <input type="date" class="uk-input" v-model="holidays[index].date" required>
                  </div>
                </div>
                <div class="uk-width-1-5">
                  <button class="uk-button uk-button-danger uk-button-small uk-margin-top" type="button" v-on:click="holidaysCountUpdate(false, index)" v-if="holidays.length > 0">Ištrinti</button>
                </div>
              </div>
              <br>
              <button class="uk-button uk-button-secondary uk-button-small" type="button" v-on:click="holidaysCountUpdate(true)">Nauja šventė</button>
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
  export default{
    data(){
      return{
        holidays: {

        },
        settings: []
      }
    },
    mounted(){
      this.$http.all([
        this.$http.get('settings'),
        this.$http.get('holidays'),
      ]).then(this.$http.spread((settings, holidays) => {
        this.settings = settings.data
        this.holidays = holidays.data
        console.log(this.settings)
      })).catch(err => {
        this.notify('warning', 'Nepavyko įkelti duomenų!')
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
      holidaysCountUpdate(opt, index = null){
        if(opt){
          var newHoliday = {
            title: '',
            date: ''
          }
          this.holidays.push(newHoliday)
        } else if (!opt && this.holidays.length >= 1){
          this.holidays.splice(index, 1)
        }
      },
      updateSettings(){
        var holidaysToUpdate = []

        this.holidays.forEach(item => {
          var holiday = {
            title: item.title,
            date: item.date
          }

          holidaysToUpdate.push(holiday)
        })

        this.$http.all([
          this.$http.post('settings', this.settings),
          this.$http.post('holidays', holidaysToUpdate)
        ]).then(this.$http.spread((settings, holidays) => {
          this.notify('success', 'Atnaujinta!')
        })).catch(err => {
          this.notify('warning', 'Klaida atnaujinant informaciją!')
          console.log(err)
        })
      }
    }
  }
</script>
