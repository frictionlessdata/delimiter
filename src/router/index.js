import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Edit from '@/views/Edit'
import Save from '@/views/Save'
import { constructLoginUrl } from '@/util'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/edit/:origin/:repo/:branch/:path*',
      name: 'edit',
      component: Edit
    },
    {
      path: '/save/:origin/:repo/:branch/:path*',
      name: 'save',
      component: Save
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter () {
        window.location.href = constructLoginUrl()
      }
    }
  ]
})
