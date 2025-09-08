import { createRouter, createWebHistory } from 'vue-router'
import ActivosView from '@/views/ActivosView.vue'
import ActivosTerceroView from '@/views/ActivosTerceroView.vue'
import ActivosTerceroClienteView from '@/views/ActivosTerceroClienteView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', name: 'main', component: ActivosView},
    {path: '/activo/tercero/:tercero', name: 'Activotercero', component: ActivosTerceroView},
    {path: '/activo/firmar/tercero/:id', name: 'ActivoFirmarTercero', component: ActivosTerceroClienteView},
  ]
})

export default router