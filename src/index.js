import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

import '../assets/css/reset.css'

Vue.prototype.$http = axios

/* eslint-disable-next-line */
const app = new Vue({
    el: '#app',
    components: { App },
    template: '<App/>'
})
