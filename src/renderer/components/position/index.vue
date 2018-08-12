<template>
  <div>
    <div class="uk-align-right">
      <button class="uk-button uk-button-primary uk-button-small" uk-toggle="target: #new-wage" type="button">Pridėti naują</button>
    </div>
    <h1 class="uk-heading-divider">Pareigos</h1>
    <table class="uk-table uk-table-hover uk-table-divider">
      <thead>
        <tr>
            <th width="5%">#</th>
            <th>Pareigos</th>
            <th>Darbuotojų</th>
            <th>Uždarbis</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="position, index in positions">
            <td>{{ index+1 }}</td>
            <td>{{ position.name }}</td>
            <td>{{ position.employee.length }}</td>
            <td>{{ position.wage }}</td>
        </tr>
      </tbody>
    </table>
    <div id="new-wage" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
            <h2 class="uk-modal-title">Naujos pareigos</h2>
            <div class="uk-align-center" uk-grid>
              <form class="uk-form-horizontal uk-margin-large" @submit.prevent="createPosition">
                <div class="uk-margin">
                  <label class="uk-form-label">Pareigos</label>
                  <div class="uk-form-controls">
                    <input class="uk-input" v-model="position.name" type="text" placeholder="Paraigų pavadinimas" required>
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">Uždarbis (&euro;/h)</label>
                  <div class="uk-form-controls">
                    <input class="uk-input" v-model="position.wage" type="number" placeholder="10.50" min="0" max="999" step="0.01" required>
                  </div>
                </div>
                <hr>
                <div class="uk-align-left">
                  <button class="uk-button uk-button-primary uk-button-medium" type="submit">Sukurti</button>
                </div>
                <div class="uk-align-right">
                  <button id="newPosition" class="uk-button uk-button-secondary uk-button-medium uk-modal-close" type="button">Uždaryti</button>
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
        position: {
          name: '',
          wage: 0,
        },
        positions: [],
      }
    },
    mounted(){
      this.getList();
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
        this.$http.get('position').then(res => {
          this.positions = res.data
        }).catch(err => {
          this.notify('danger', 'Klaida įkeliant duomenis')
        })
      },
      createPosition(){
        this.$http.post('position', this.position).then(res => {
          this.position.name = ''
          this.position.wage = ''
          this.notify('success', 'Pareigos sukurtos!')
          document.getElementById('newPosition').click()
          this.getList();
        }).catch(err => {
          this.notify('danger', 'Klaida!<br>' + err.response.data.name[0])
        })
      },
    }
  }
</script>
<style media="screen">
  .uk-modal-title{
    font-size: 22px;
  }
</style>
