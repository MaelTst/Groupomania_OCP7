import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: {
      requiresAuth: true,
      title: "Groupomania"
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      title: "Connexion - Groupomania"
    }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: {
      requiresAuth: true,
      title: "Favoris - Groupomania"
    }
  },
  {
    path: '/pictures',
    name: 'Pictures',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: {
      requiresAuth: true,
      title: "Photos - Groupomania"
    }
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: {
      requiresAuth: true,
      title: "Groupomania"
    }
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import(/* webpackChunkName: "user" */ '../views/User.vue'),
    meta: {
      requiresAuth: true,
      title: "Profil utilisateur - Groupomania"
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue'),
    meta: {
      requiresAuth: true,
      title: "Paramètres - Groupomania"
    }
  },
  {
    path: '/404NotFound',
    alias: '*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "notfound" */ '../views/NotFound.vue'),
    meta: {
      requiresAuth: true,
      title: "404 Not Found - Groupomania"
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Groupomania"
  if (to.meta.requiresAuth) {
    if (!Vue.prototype.$getCookie('ID')) {
      store.dispatch('logOut')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
