import { createRouter, createWebHistory } from 'vue-router'
import MVC01_24 from '@/views/MVC01-24.vue'
import XIOS01 from '@/views/XIOS-UC1.vue'
import NOFOUND from '@/views/NOFOUND.vue'
import DeviceDefine from '@/views/DeviceDefine.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/deviceDefine',
      name: 'deviceDefine',
      component: DeviceDefine,
    },
    {
      path: '/xios',
      name: 'xios',
      component: XIOS01,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
    },
    {
      path: '/mvc',
      name: 'mvc',
      component: MVC01_24,
    },
    {
      // 通配符路由，匹配所有未定义的路径（需放在最后）
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NOFOUND,
      meta: { title: '页面未找到' },
    },
  ],
})

export default router
