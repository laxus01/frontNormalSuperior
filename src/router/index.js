import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Dashboard from '../views/Dashboard'

/*Views*/
import Campus from '../views/Campus'
import Institutions from '../views/Institutions'
import Teachers from '../views/Teachers'
import Students from '../views/Students'
import Groups from '../views/Groups'
import Enrollment from '../views/Enrollment'
import Practices from '../views/Practices'
import Assign from '../views/Assign'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',  
    component: HomeView  
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: '/campus',
        component: Campus,
        meta: {
          requiresAuth: true,
        }, 
      }, 
      {
        path: '/institutions',
        component: Institutions,
        meta: {
          requiresAuth: true,
        }, 
      },  
      {
        path: '/teachers',
        component: Teachers,
        meta: {
          requiresAuth: true,
        }, 
      },
      {
        path: '/students',
        component: Students,
        meta: {
          requiresAuth: true,
        }, 
      },
      {
        path: '/groups',
        component: Groups,
        meta: {
          requiresAuth: true,
        }, 
      },
      {
        path: '/enrollment',
        component: Enrollment,
        meta: {
          requiresAuth: true,
        }, 
      },
      {
        path: '/practices',
        component: Practices,
        meta: {
          requiresAuth: true,
        }, 
      },
      {
        path: '/assign',
        component: Assign,
        meta: {
          requiresAuth: true,
        }, 
      },
    ],  
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
