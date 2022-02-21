import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import * as _ from 'lodash'
import $helpers from './helpers/helpers'

Object.defineProperty(Vue.prototype, '_', { value: _ })
Object.defineProperty(Vue.prototype, '$helpers', { value: $helpers })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
