import {createRouter, createWebHistory } from 'vue-router'
import Swap from '../components/Swap.vue'
import Pools from '../components/Pools.vue'

const routes = [
  {
    path: '/',
    component: Swap
  },
  {
    path: '/pools',
    component: Pools
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router