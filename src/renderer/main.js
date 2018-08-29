import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import dotenv from 'dotenv'
import UIkit from 'uikit'
import FullCalendar from 'vue-full-calendar'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

// axios.defaults.baseURL = process.env.API_URL
// axios.defaults.headers.common['API-KEY'] = process.env.API_KEY

// axios.defaults.baseURL = 'https://senoliai.desam.lt/api'
axios.defaults.baseURL = 'http://scheduleapi.test/api'
axios.defaults.headers.common['API-KEY'] = '7ACA0D339949799D07AB0FD6FA784E25C97BA36D71B550B9AF20BC1EBA285507'


Vue.http = Vue.prototype.$http = axios
Vue.prototype.$uikit = UIkit
Vue.config.productionTip = false

Vue.use(FullCalendar)

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
