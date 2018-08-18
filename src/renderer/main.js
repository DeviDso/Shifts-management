import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

// import FullCalendar from 'vue-full-calendar'
// import moment from 'moment'
import UIkit from 'uikit'
import FullCalendar from 'vue-full-calendar'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

axios.defaults.baseURL = 'http://scheduleapi.test/api/';
// axios.defaults.baseURL = 'http://senoliai.desam.lt/api/'
axios.defaults.headers.common['X-Auth-Token'] = '35A3A9ED6B7FCAD877A64BB0C9E6A28928240B5365ABDDC926169F449832E2F0'
Vue.http = Vue.prototype.$http = axios
Vue.prototype.$uikit = UIkit
Vue.config.productionTip = false

Vue.use(FullCalendar)
// Vue.use(moment)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
