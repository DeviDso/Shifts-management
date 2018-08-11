import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/Users').default
    },
    {
      path: '/schedule/view',
      name: 'schedule-view',
      component: require('@/components/schedule/view').default
    },
    {
      path: '/schedule/dontview',
      name: 'schedule-dontview',
      component: require('@/components/schedule/dontview').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
