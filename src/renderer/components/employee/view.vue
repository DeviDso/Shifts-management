<template>
  <div>
    <h1 class="uk-heading-divider">{{ employee.name }} {{ employee.surname }}</h1>
    <h5 class="uk-heading-divider">Atostogos</h5>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        employee: []
      }
    },
    mounted(){
      this.$http.get('employee/' + this.$route.params.id).then(res => {
        this.employee = res.data
      }).catch(err => {
        this.notify('warning', 'Klaida įkeliant darbuotoją!')
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
    }
  }
</script>
