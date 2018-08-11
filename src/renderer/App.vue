<template>
  <div id="app">
      <div class="menu">
          <h2>Tvakaraštis</h2>
          <router-link :to="{ name: 'home', params: {} }">Pradžia</router-link>
          <router-link :to="{ name: 'schedule-view', params: {} }">Tvakrastis</router-link>
          <router-link :to="{ name: 'schedule-dontview', params: {} }">Tvakrastis2</router-link>
      </div>
      <div class="content">
          <router-view></router-view>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'schedule'
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
  #app{
    height: 100vh;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body{
    background:
    radial-gradient(
      ellipse at top left,
      rgba(255, 255, 255, 1) 40%,
      rgba(229, 229, 229, .9) 100%
    );
    font-family: 'Source Sans Pro', sans-serif;
  }
  .menu{
    width: 25%;
    float: left;
    height: 100vh;
    background: #444;
  }
  .menu h2{
    text-align: center;
    color: #fff;
    font-size: 18px;
    margin-top: 5px;
  }
  .content{
    width: 75%;
    float: left;
  }
</style>
