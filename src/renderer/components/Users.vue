<template>
  <div class="wrapper">
    <form @submit.prevent="addUser">
      <input type="text" v-model="user.name">
      <button type="submit">Pridėti</button>
    </form>
    {{ users }}1
    </div>
  </div>
</template>

<script>
  export default {
    name: 'landing-page',
    data(){
      return{
        users: [],
        user: {
          name: 'lol'
        },
      }
    },
    mounted(){
      this.$http.get('users').then(res =>{
        this.users = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      addUser(){
        this.$http.post('users', this.user).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>
