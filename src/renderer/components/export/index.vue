<template>
  <div>
    <h1 class="uk-heading-divider">Eksportavimas</h1>
    <div uk-grid>
      <div class="uk-width-4-5">
        <div class="uk-overflow-auto">
          <table class="uk-table uk-table-divider">
            <thead>
              <tr>
                <th><input class="uk-checkbox" type="checkbox" style="margin-left: 5px" v-on:click="checkAll()" v-model="selectAll"></th>
                <th>Vardas</th>
                <th>Pavardė</th>
                <th>Tvarkaraštis</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee, index in employees">
                <td><input class="uk-checkbox" type="checkbox" v-model="employee.checked"></td>
                <td class="uk-text-nowrap">{{ employee.name }}</td>
                <td class="uk-text-nowrap">{{ employee.surname }}</td>
                <td class="uk-text-nowrap">{{ employee.schedule.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="uk-width-1-5">
        <div class="uk-margin-small">
          <label class="uk-form-label" for="form-stacked-text">Metai</label>
          <div class="uk-form-controls">
            <select class="uk-select uk-form-small" v-model="year">
              <option value="Pasirinkite">Pasirinkite</option>
              <option value="2018">2018</option>
              <option value="2019">2019</option>
              <!-- <option :value="date.getFullYear()">{{ date.getFullYear() }}</option>
              <option :value="nextDate.getFullYear()">{{ nextDate.getFullYear() }}</option> -->
            </select>
          </div>
        </div>
        <div class="uk-margin-small">
          <label class="uk-form-label" for="form-stacked-text">Mėnesis</label>
          <div class="uk-form-controls">
            <select class="uk-select uk-form-small" v-model="month">
              <option value="Pasirinkite">Pasirinkite</option>
              <option value="01">Sausis</option>
              <option value="02">Vasaris</option>
              <option value="03">Kovas</option>
              <option value="04">Balandis</option>
              <option value="05">Gegužė</option>
              <option value="06">Birželis</option>
              <option value="07">Liepa</option>
              <option value="08">Rugpjūtis</option>
              <option value="09">Rugsėjis</option>
              <option value="10">Spalis</option>
              <option value="11">Lapkritis</option>
              <option value="12">Gruodis</option>
            </select>
          </div>
        </div>
        <hr>
        <button class="uk-hidden" id="openGenerateModal" uk-toggle="target: #generate-modal"></button>
        <button class="uk-button uk-button-primary uk-button-small" v-on:click="generatePdf()">Generuoti PDF</button>
      </div>
    </div>
    <div id="generate-modal" uk-modal>
      <div class="uk-modal-dialog">
        <div class="uk-modal-body uk-margin-top uk-position-center">
          <div uk-spinner="ratio: 3" style="color: #000; margin-left: 40%; margin-top: 375px"></div>
        </div>
        <button id="closeGenerateModal" class="uk-button uk-button-default uk-modal-close uk-hidden" type="button">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data(){
      return {
        date: new Date(),
        nextDate: '',
        employees: [],
        year: 'Pasirinkite',
        month: 'Pasirinkite',
        selectAll: false,
        loading: false,
        export: {
          employees: [],
          selectedMonth: ''
        }
      }
    },
    mounted(){
      this.nextDate = new Date(this.date.getFullYear() + 1, this.date.getMonth(), this.date.getDate())
      this.$http.get('employee').then(res => {
        this.employees = res.data
      }).catch(err => {
        console.log(err)
        this.notify('warning', 'Klaida įkeliant darbuotojus!')
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
      checkAll(){
        this.employees.forEach(item => {
          if(!this.selectAll){
            item.checked = true
          } else{
            item.checked= false
          }
        })
      },
      generatePdf(){
        var anySelected = false

        this.employees.forEach(item => {
          if(item.checked){
            anySelected = true
          }
        })

        if(this.year != 'Pasirinkite' && this.month != 'Pasirinkite'){
          document.getElementById('openGenerateModal').click()
          this.export.selectedMonth = this.year + '-' + this.month + '-01'
          var temp = []

          this.employees.forEach(item => {
            if(item.checked){
              temp.push(item.id)
            }
          })
          this.export.employees = temp

          this.$http({
            url: 'pdf/month',
            method: 'POST',
            responseType: 'blob',
            data: this.export,
          }).then((response) => {
            this.loading = false
            document.getElementById('closeGenerateModal').click()
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Tvarkaraštis ' + this.year + '-' + this.month + '.pdf');
            document.body.appendChild(link);
            link.click();

          });
        } else if(!anySelected){
          this.loading = false
          document.getElementById('closeGenerateModal').click()
          this.notify('warning', 'Nepasirinkti darbuotojai!')
        }
        else {
          this.loading = false
          document.getElementById('closeGenerateModal').click()
          this.notify('warning', 'Nepasirinkta data!')
        }
      },
      best(){
        this.$http({
          url: 'pdf/month',
          method: 'GET',
          responseType: 'blob',
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'file.pdf');
          document.body.appendChild(link);
          link.click();
        });
      }
    }
  }
</script>
