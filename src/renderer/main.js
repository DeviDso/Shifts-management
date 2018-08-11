import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import FullCalendar from 'vue-full-calendar'
import fcalendar from 'fullcalendar'
import jquery from 'jquery'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

axios.defaults.baseURL = 'http://scheduleapi.test/api/';
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(FullCalendar, fcalendar, jquery)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
