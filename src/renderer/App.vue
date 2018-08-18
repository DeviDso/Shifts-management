<template>
  <div id="app">
    <div uk-grid>
      <div class="uk-width-1-4@m">
          <div class="uk-card uk-card-default uk-card-body" id="menu" uk-sticky>
            <ul class="uk-nav-default uk-nav-parent-icon" uk-nav>
                <li class="uk-nav-header">Senolių namai</li>
                <li><router-link :to="{ name: 'home', params: {} }"><span class="uk-margin-small-right" uk-icon="icon: home"></span> Pradžia</router-link></li>
                <li><router-link :to="{ name: 'employees', params: {} }"><span class="uk-margin-small-right" uk-icon="icon: users"></span> Darbuotojai</router-link></li>
                <li><router-link :to="{ name: 'position', params: {} }"><span class="uk-margin-small-right" uk-icon="icon: nut"></span> Pareigos</router-link></li>
                <li><router-link :to="{ name: 'schedules', params: {} }"><span class="uk-margin-small-right" uk-icon="icon: calendar"></span> Tvarkaraščiai</router-link></li>
                <li class="uk-nav-divider"></li>
                <!-- <li><a href="#" v-on:click="openPage('schedules')">TEST</a></li> -->
                <li><router-link :to="{ name: 'wage', params: {} }"><span class="uk-margin-small-right" uk-icon="icon: credit-card"></span> Atlyginimai</router-link></li>
                <li><router-link :to="{ name: 'export', params: {} }"><span class="uk-margin-small-right" uk-icon="icon: cloud-download"></span> Eksportavimas</router-link></li>
                <li><router-link :to="{ name: 'settings', params: {} }"><span class="uk-margin-small-right" uk-icon="icon: settings"></span> Nustatymai</router-link></li>
            </ul>
            <button type="button" uk-toggle="target: #report-bug" class="uk-button uk-button-primary uk-button-small uk-position-bottom-center uk-margin-bottom">Pranešti klaidą</button>
          </div>
      </div>
      <div class="uk-width-expand@m">
          <div class="uk-card uk-card-default uk-card-body">
            <router-view></router-view>
          </div>
      </div>
      <div id="report-bug" uk-modal>
          <div class="uk-modal-dialog uk-modal-body">
              <h2 class="uk-modal-title">Praneškite apie klaidą</h2>
              <p>Radote neveikiančia funkciją, o gal tiesiog programa užtstrigo atliekant tam tikrą veiksmą? Praneškite mums apie ją ir kuo įmanoma greičiau ją pašalinsime!</p>
              <div class="uk-align-center" uk-grid>
                <form class="uk-form-horizontal uk-margin-large" @submit.prevent="postReport">
                  <div class="uk-margin">
                      <label class="uk-form-label">Kategorija</label>
                      <div class="uk-form-controls">
                          <select class="uk-select" v-model="report.category">
                            <option value="Techninis sutrikimas">Techninis sutrikimas</option>
                            <option value="Neveikia funkcija">Neveikia funkcija</option>
                            <option value="Lėtai kraunasi">Lėtai kraunasi</option>
                            <option value="Kita">Kita</option>
                          </select>
                      </div>
                  </div>
                  <div class="uk-margin">
                      <label class="uk-form-label">Aprašymas</label>
                      <div class="uk-form-controls">
                          <textarea class="uk-textarea" v-model="report.description" rows="5" placeholder="Detaliai aprašyta klaida..." required></textarea>
                      </div>
                  </div>
                  <hr>
                  <div class="uk-align-left">
                    <button class="uk-button uk-button-primary" type="submit">Pranešti</button>
                  </div>
                  <div class="uk-align-right">
                    <button id="reportBugButton" class="uk-button uk-button-secondary uk-modal-close" type="button">Uždaryti</button>
                  </div>
                </form>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import mailgun from 'mailgun-js'

UIkit.use(Icons)

  export default {
    name: 'schedule',
    data(){
      return{
        report: {
          category: 'Techninis sutrikimas',
        }
      }
    },
    methods:{
      notify(status, message){
        this.$uikit.notification({
          message: message,
          status: status,
          timeout: 3000,
        })
      },
      openPage(name){
        this.$router.push({name:name})
      },
      postReport(){
        this.$http.post('report', this.report).then(res => {
          this.notify('success', 'Pranešimas apie klaidą gautas!')
          document.getElementById('reportBugButton').click()
          var api_key = 'key-c96a7d593a93504d685d7913ef2cdad5';
          var domain = 'sandboxe3c329db2dc44e50bc7d75fb8713c187.mailgun.org';
          var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

          var data = {
            from: 'Tvarkaraštis: Senolių namai <postmaster@sandboxe3c329db2dc44e50bc7d75fb8713c187.mailgun.org>',
            to: 'dsadeckas@gmail.com',
            subject: this.report.category,
            text: this.report.description
          };

          mailgun.messages().send(data, function (error, body) {
            console.log(body);
          });
        }).catch(err => {
          this.notify('warning', 'Klaida išsiunčiant pranešimą apie klaidą!')
          console.log(err)
        })
      }
    }
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
  html{
    /* background:
    radial-gradient(
      ellipse at top left,
      rgba(255, 255, 255, 1) 40%,
      rgba(229, 229, 229, .9) 100%
    ); */
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
  .uk-modal-title{
    font-size: 24px;
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
  .uk-notification{
    border: solid 1px #cecece;
    text-align: center;
    background: #fff;
  }
  .uk-notification-message{
    background: #fff;
  }
</style>
