import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入路由
import Login from '@/views/login'
import Content from '@/views/content'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/content',
    name: 'content',
    component: Content
  },
  {
    path: '/search',
    component: () => import('@/views/Search')
  },
  {
    path: '/user',
    component: () => import('@/views/User')
  },
  {
    path: '/',
    component: () => import('@/views/Layout'),
    redirect: '/ ',
    children: [
      {
        path: '/ ',
        component: () => import('@/views/Home')
      },
      {
        path: '/video',
        component: () => import('@/views/Video')
      },
      {
        path: '/qa',
        component: () => import('@/views/QA')
      },
      {
        path: '/profile',
        component: () => import('@/views/My')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
