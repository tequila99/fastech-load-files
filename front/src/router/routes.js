
const routes = [
  {
    path: '/object',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: ':id', component: () => import('pages/Object.vue'), props: true }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
