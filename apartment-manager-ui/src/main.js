import Vue from 'vue'
import VueResource from 'vue-resource'
import VeeValidate from 'vee-validate'

import { store } from './store'
import { router } from './router'
import App from './App'

Vue.use(VueResource)
Vue.use(VeeValidate)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router: router,
  render: h => h(App)
})
