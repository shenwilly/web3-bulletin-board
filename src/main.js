import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from "./router";

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.config.productionTip = false

Vue.use(require('vue-moment'));

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
