import { createRouter, createWebHistory } from 'vue-router'
import ActivosView from '@/views/ActivosView.vue'
import ActivosTerceroView from '@/views/ActivosTerceroView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', name: 'main', component: ActivosView},
    {path: '/activo/tercero/:tercero', name: 'Activotercero', component: ActivosTerceroView}
  ]
})

export default router