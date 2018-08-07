import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Home from '@/components/Home'
import Register from '@/components/Register'

Vue.use(Router)

export const router = new Router({
  routes: [{
    path: '/login',
    name: 'login',
    component: Welcome
  }, {
    path: '/',
    name: 'home',
    component: Home
  }, {
    path: '/register',
    name: 'register',
    component: Register
  }]
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')

  if (authRequired && !loggedIn) {
    console.log('NOT LOGGED IN')
    return next('/login')
  }

  next()
})
