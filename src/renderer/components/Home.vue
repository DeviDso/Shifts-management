<template>
  <div>
    <h1 class="uk-heading-divider">Senolių namai - Tvarkaraštis <sup>v 1.0.2</sup> </h1>

    <div uk-grid>
      <div class="uk-width-2-3">
        <h5>Atnaujinimai</h5>
        <dl class="uk-description-list">
          <dt>Rugpjūčio 27</dt>
          <dd>
            <ol>
              <li>Atnaujinti pertraukų pasirinkimo laikai</li>
              <li>Ištrynus darbutoją užsidaro informacinis langas</li>
              <li>Pridedant naują darbuotoją neberodo asmeninių tvarkaraščių sąrašo</li>
              <li>Asmeniniai tvarkaraščiai atvaizduojami pirmiau bendrų</li>
              <li>Pareigų, datos, šventinių bei viso darbo minučių atvaizdavimas eksportuojant tvarkaraštį</li>
            </ol>
          </dd>
        </dl>
        <hr>
        <dl class="uk-description-list">
          <dt>Rugpjūčio 17</dt>
          <dd>Pridėtas atlyginimų skaičiavimas (galimi netikslumai).</dd>
        </dl>
        <hr>
        <dl class="uk-description-list">
          <dt>Rugpjūčio 16</dt>
          <dd>Sutvarkytas PDF tvarkaraščio eksportavimas.</dd>
        </dl>
        <hr>
        <dl class="uk-description-list">
          <dt>Rugpjūčio 14</dt>
          <dd>Naktinių, šventinių bei įprastų darbo valandų skaičiavimo pertvarkymas kalendoriuje.</dd>
        </dl>
      </div>
      <div class="uk-width-1-3">
        <h5>Informacija</h5>
        <div class="uk-margin-small">
          <span uk-icon="users"></span> <span class="info_text">Darbuotojų: {{ employees.length }}</span>
        </div>
        <div class="uk-margin-small">
          <span uk-icon="calendar"></span> <span class="info_text">Tvarkaraščių: {{ schedules.length }}</span>
        </div>
        <div class="uk-margin-small">
          <span uk-icon="future"></span> <span class="info_text">Nakties pradžia: {{ settings.night_starts }}</span>
        </div>
        <div class="uk-margin-small">
          <span uk-icon="history"></span> <span class="info_text">Nakties pabaiga: {{ settings.night_ends }}</span>
        </div>
        <div class="uk-margin-small">
          <span uk-icon="triangle-right"></span> <span class="info_text">Naktinis tarifas: {{ settings.night_multiplier }}x</span>
        </div>
        <div class="uk-margin-small">
          <span uk-icon="triangle-right"></span> <span class="info_text">Šventinis tarifas: {{ settings.holiday_multiplier }}x</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data(){
      return{
        settings: [],
        employees: [],
        schedules: []
      }
    },
    mounted(){
      this.$http.all([
        this.$http.get('settings'),
        this.$http.get('employee'),
        this.$http.get('schedule')
      ]).then(this.$http.spread((settings, employees, schedules) => {
        this.settings = settings.data
        this.employees = employees.data
        this.schedules = schedules.data
      })).catch(err => {
        this.notify('warning', 'Klaida įkeliant duomenis!')
      })
    },
    methods: {
      notify(status, message){
        this.$uikit.notification({
          message: message,
          status: status,
          timeout: 3000,
        })
      },
    }
  }
</script>
<style media="screen">
  dd{
    font-size: 14px!important;
  }
  .info_text{
    font-size: 14px;
    font-weight: 200;
    margin-left: 5px;
  }
</style>
