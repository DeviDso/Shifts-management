<template>
  <div id="app">
    <div uk-grid>
    <div class="uk-width-1-5@m">
        <div class="uk-card uk-card-default uk-card-body" id="menu">
          <ul class="uk-nav-default uk-nav-parent-icon" uk-nav>
              <li class="uk-nav-header">Senolių namai</li>
              <li><router-link :to="{ name: 'home', params: {} }"><span class="uk-margin-small-right" uk-icon="icon: home"></span> Pradžia</router-link></li>
              <li><router-link :to="{ name: 'employees', params: {} }"><span class="uk-margin-small-right" uk-icon="icon: users"></span> Darbuotojai</router-link></li>
              <li><router-link :to="{ name: 'position', params: {} }"><span class="uk-margin-small-right" uk-icon="icon: nut"></span> Pareigos</router-link></li>
              <li><router-link :to="{ name: 'schedules', params: {} }"><span class="uk-margin-small-right" uk-icon="icon: calendar"></span> Tvarkaraščiai</router-link></li>
              <li class="uk-nav-divider"></li>
              <li><a href="#"><span class="uk-margin-small-right" uk-icon="icon: cloud-download"></span> Eksportavimas</a></li>
              <li><a href="#"><span class="uk-margin-small-right" uk-icon="icon: settings"></span> Nustatymai</a></li>
          </ul>
        </div>
    </div>
    <div class="uk-width-expand@m">
        <div class="uk-card uk-card-default uk-card-body">
          <router-view></router-view>
        </div>
    </div>
  </div>
  </div>
</template>

<script>
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons)

  export default {
    name: 'schedule'
  }
</script>

<style>
  @import url('~uikit/dist/css/uikit.min.css');
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
  #menu{
    /* position: fixed; */
    height: 100vh;
    /* background: #444; */
  }
  h1{
    font-size: 22px;
    margin-top: 0!important;
    text-transform: uppercase;
  }
  h2, h5{
    text-transform: uppercase;
  }
  button{
    font-size: 12px!important;
  }
  .uk-table-hover tbody tr:hover{
    background: #dedede;
    cursor: pointer;
  }
  .uk-table td{
    padding: 8px 18px;
    font-size: 14px;
  }
  .uk-nav-default li{
    text-transform: uppercase;
  }
</style>
