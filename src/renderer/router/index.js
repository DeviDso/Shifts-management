import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/Home').default
    },
    {
      path: '/schedules',
      name: 'schedules',
      component: require('@/components/schedule/index').default
    },
    {
      path: '/schedules/view/:id',
      name: 'schedule-view',
      component: require('@/components/schedule/view').default
    },
    {
      path: '/employees/index',
      name: 'employees',
      component: require('@/components/employee/index').default
    },
    {
      path: '/position/index',
      name: 'position',
      component: require('@/components/position/index').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
