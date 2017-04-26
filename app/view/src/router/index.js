import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import Login from '../components/Login'
import Supplier from '../components/supplier/index'
import Manager from '../components/Manager/index'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'supplier',
          component: Supplier
        },
        {
          path: 'manager',
          component: Manager
        }
      ]
    },
    {
      path: '/supplier',
      name: 'supplier',
      component: Supplier
    },
    {
      path: '/manager',
      name: 'Manager',
      component: Manager
    }
  ]
})
