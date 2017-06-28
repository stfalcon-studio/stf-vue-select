import Vue from 'vue'
import App from './App'

import './styles/app.scss'
import './styles/app.styl'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
