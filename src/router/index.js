import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)

const routes = [
  {
    path: "/index",
    label: "智慧案管",
    component: () => import ('../views/index.vue')
  },
  {
    path: '/',
    redirect: '/index'
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router
