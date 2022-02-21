import Vue from 'vue'
import VueRouter from 'vue-router'

import BookHotel from '../components/BookHotel.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'hotels',
    component: BookHotel
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router