<template>
  <div>
    <div class="uk-align-right">
      <button class="uk-button uk-button-primary uk-button-small" uk-toggle="target: #new-employee" type="button">Pridėti naują</button>
    </div>
    <h1 class="uk-heading-divider">Darbuotojai</h1>
    <form class="uk-search uk-search-default">
      <span uk-search-icon></span>
      <input class="uk-search-input" type="search" v-model="searchText" placeholder="Paieška...">
    </form>
    <table class="uk-table uk-table-hover uk-table-divider">
      <thead>
        <tr>
            <th width="5%">#</th>
            <th>Vardas</th>
            <th>Pavardė</th>
            <th>Pareigos</th>
            <th>Tvarkaraštis</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee, index in searchFilter(employees, searchText)" uk-toggle="target: #edit-employee" v-on:click="getEmployee(employee.id)">
            <td>{{ index+1 }}</td>
            <td>{{ employee.name }}</td>
            <td>{{ employee.surname }}</td>
            <td>{{ employee.position.name }}</td>
            <td>{{ (employee.schedule.name == employee.name + ' ' + employee.surname) ? 'Asmeninis' :  employee.schedule.name }}</td>
        </tr>
      </tbody>
    </table>
    <div id="new-employee" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
            <h2 class="uk-modal-title">Naujas darbuotojas</h2>
            <div class="uk-align-center" uk-grid>
              <form class="uk-form-horizontal uk-margin-large" @submit.prevent="addEmployee">
                <div class="uk-margin">
                  <label class="uk-form-label">Vardas</label>
                  <div class="uk-form-controls">
                    <input class="uk-input" v-model="employee.name" type="text" placeholder="Darbuotojo vardas" required>
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">Pavardė</label>
                  <div class="uk-form-controls">
                    <input class="uk-input" v-model="employee.surname" type="text" placeholder="Darbuotojo pavardė" required>
                  </div>
                </div>
                <h5 class="uk-heading-divider">Nustatymai</h5>
                <div class="uk-margin">
                  <label class="uk-form-label">Pareigos</label>
                  <div class="uk-form-controls">
                    <select class="uk-select" v-model="employee.position_id" required>
                      <option v-for="position in positions" :value="position.id">{{ position.name }}</option>
                    </select>
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">Tvarkaraštis</label>
                  <div class="uk-form-controls">
                    <select class="uk-select" v-model="employee.schedule_id">
                      <option value="private">+ Naujas asmeninis tvarkaraštis</option>
                      <optgroup label="Bendri tvarkaraščiai">
                        <option v-for="schedule in schedules" :value="schedule.id" v-if="!schedule.private">{{ schedule.name }}</option>
                      </optgroup>
                      <optgroup label="Asmeniniai tvarkaraščiai">
                        <option v-for="schedule in schedules" :value="schedule.id" v-if="schedule.private">{{ schedule.name }}</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
                <hr>
                <div class="uk-align-left">
                  <button class="uk-button uk-button-primary uk-button-medium" type="submit">Sukurti</button>
                </div>
                <div class="uk-align-right">
                  <button id="new-employee" class="uk-button uk-button-secondary uk-button-medium uk-modal-close" type="button">Uždaryti</button>
                </div>
              </form>
            </div>
        </div>
    </div>
    <div id="edit-employee" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
            <h2 class="uk-modal-title">{{ editEmployee.name }} {{ editEmployee.surname }}</h2>
            <div class="uk-align-center" uk-grid>
              <form class="uk-form-horizontal uk-margin-large" @submit.prevent="updateEmployee">
                <div class="uk-margin">
                  <label class="uk-form-label">Vardas</label>
                  <div class="uk-form-controls">
                    <input class="uk-input" v-model="editEmployee.name" type="text" placeholder="Darbuotojo vardas" required>
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">Pavardė</label>
                  <div class="uk-form-controls">
                    <input class="uk-input" v-model="editEmployee.surname" type="text" placeholder="Darbuotojo pavardė" required>
                  </div>
                </div>
                <h5 class="uk-heading-divider">Nustatymai</h5>
                <div class="uk-margin">
                  <label class="uk-form-label">Pareigos</label>
                  <div class="uk-form-controls">
                    <select class="uk-select" v-model="editEmployee.position_id" required>
                      <option v-for="position in positions" :value="position.id">{{ position.name }}</option>
                    </select>
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">Tvarkaraštis</label>
                  <div class="uk-form-controls">
                    <select class="uk-select" v-model="editEmployee.schedule_id">
                      <option value="private">+ Naujas asmeninis tvarkaraštis</option>
                      <optgroup label="Bendri tvarkaraščiai">
                        <option v-for="schedule in schedules" :value="schedule.id" v-if="!schedule.private">{{ schedule.name }}</option>
                      </optgroup>
                      <optgroup label="Asmeniniai tvarkaraščiai">
                        <option v-for="schedule in schedules" :value="schedule.id" v-if="schedule.private">{{ schedule.name }}</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
                <hr>
                <div class="uk-align-left">
                  <button class="uk-button uk-button-primary uk-button-medium" type="submit">Atnaujinti</button>
                </div>
                <div class="uk-align-right">
                  <button id="editEmployee" class="uk-button uk-button-secondary uk-button-medium uk-modal-close" type="button">Uždaryti</button>
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
        searchText: '',
        employee: {
          name: '',
          surname: '',
          schedule_id: 'private',
          position_id: '1',
        },
        employees: [],
        positions: [],
        schedules: [],
        editEmployee: [],
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
        this.$http.all([
          this.$http.get('employee'),
          this.$http.get('position'),
          this.$http.get('schedule')
        ]).then(this.$http.spread((employees, positions, schedules) => {
          this.employees = employees.data
          this.positions = positions.data
          this.schedules = schedules.data
        })).catch(err => {
          this.notify('danger', 'Klaida įkeliant duomenis')
        })
      },
      addEmployee(){
        this.$http.post('employee', this.employee).then(res => {
          this.employee.name = ''
          this.employee.surname = ''
          this.employee.schedule_id = 'private'
          this.employee.position = 1

          this.notify('success', 'Darbuotojas pridėtas')
          this.getList()
          document.getElementById('new-employee').click()
        }).catch(err => {
          this.notify('danger', 'Klaida!<br>' + err.response.data.name[0])
        })
      },
      openEmployee(id){
        this.$router.push({name:'employee', params:{id:id}})
      },
      getEmployee(id){
        this.$http.get('employee/' + id).then(res => {
          this.editEmployee = res.data
        }).catch(err => {
          this.notify('warning', 'Klaida įkeliant darbuotoją!')
          console.log(err)
        })
      },
      updateEmployee(){
        this.$http.patch('employee/' + this.editEmployee.id, this.editEmployee).then(res => {
          this.notify('succes', 'Darbuotojo informacija atnaujinta!')
          document.getElementById('editEmployee').click()
          this.getList()
        }).catch(err => {
          this.notify('warning', 'Klaida atnaujinant darbuotoją!')
          console.log(err)
        })
      },
      openSchedule(id){
        this.$router.push({name: 'schedule-view', params:{id:id}})
      },
      searchFilter(items, text){
        var text = this.searchText

        var temp = []

        items.forEach(item => {
          if(item.name.toLowerCase().includes(text) || item.surname.toLowerCase().includes(text)){
            temp.push(item)
          }
        })

        return temp
      }
    },
    watch:{
      searchText(){
        var text = this.searchText

        var temp = []

        this.employees.forEach(item => {
          (item.name.toLowerCase().includes(text)) ? temp.push(item) : false;
        })

        return temp
      }
    }
  }
</script>
<style media="screen">
  .uk-modal-title{
    font-size: 22px;
  }
</style>
