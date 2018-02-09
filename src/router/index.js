import Vue from 'vue'
import Router from 'vue-router'
import Launches from '@/components/Launches'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SpaceX Launches',
      component: Launches
    }
  ]
})
