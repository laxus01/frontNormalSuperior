import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import Filters from './helpers/helper'
import './plugins/vuetify-money.js';

Vue.config.productionTip = false
Vue.use(Filters)

axios.defaults.baseURL = 'https://backnormalsuperior-production.up.railway.app/'
//axios.defaults.baseURL = 'http://localhost:8084'

// Decodifica el payload del JWT para verificar expiración
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    // exp está en segundos, Date.now() en milisegundos
    return payload.exp * 1000 < Date.now()
  } catch (e) {
    return true
  }
}

// Interceptor de peticiones: adjunta el token JWT y verifica expiración
axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('authToken')
    if (token) {
      if (isTokenExpired(token)) {
        window.localStorage.clear()
        router.push('/')
        return Promise.reject(new Error('Token expirado'))
      }
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de respuestas: redirige al login si el token expiró o es inválido
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.localStorage.clear()
      router.push('/')
    }
    return Promise.reject(error)
  }
)

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const authToken = window.localStorage.getItem('authToken')
    if (!authToken || isTokenExpired(authToken)) {
      window.localStorage.clear()
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')