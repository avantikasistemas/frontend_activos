import { createRouter, createWebHistory } from 'vue-router'
import ActivosView from '@/views/ActivosView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', name: 'main', component: ActivosView},
  ]
})

export default router