import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import router from './router'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.config.productionTip = false
library.add(faSave)
Vue.component('font-awesome-icon', FontAwesomeIcon)
sync(store, router)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
