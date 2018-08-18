import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import dotenv from 'dotenv'
dotenv.config({path: './.env'})

// import FullCalendar from 'vue-full-calendar'
// import moment from 'moment'
import UIkit from 'uikit'
import FullCalendar from 'vue-full-calendar'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

axios.defaults.baseURL = process.env.API_URL
axios.defaults.headers.common['API-KEY'] = process.env.API_KEY

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
