import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Edit from './views/Edit'
import Compare from './views/Compare'

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
      component: Edit,
      props: true
    },
    {
      path: '/compare',
      name: 'compare',
      component: Compare
    }
  ]
})
