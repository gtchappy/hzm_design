import { createRouter, createWebHistory } from 'vue-router'
import MVC01_24 from '@/views/MVC01-24.vue'
import XIOS01 from '@/views/XIOS-UC1.vue'
import NOFOUND from '@/views/NOFOUND.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/mvc',
      name: 'mvc',
      component:MVC01_24
    },
    {
      path: '/xios',
      name: 'xios',
      component:XIOS01
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
    },
    {
    // ͨ���·�ɣ�ƥ������δ�����·������������
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NOFOUND,
    meta: { title: 'ҳ��δ�ҵ�' }
  },
  ],
})

export default router
