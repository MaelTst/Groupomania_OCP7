import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'
import Settings from '../views/Settings.vue'
import User from '../views/User.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
      title: "Groupomania"
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: "Connexion - Groupomania"
    }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Home,
    meta: {
      requiresAuth: true,
      title: "Favoris - Groupomania"
    }
  },
  {
    path: '/pictures',
    name: 'Pictures',
    component: Home,
    meta: {
      requiresAuth: true,
      title: "Photos - Groupomania"
    }
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: Home,
    meta: {
      requiresAuth: true,
      title: "Groupomania"
    }
  },
  {
    path: '/user/:id',
    name: 'User',
    component: User,
    meta: {
      requiresAuth: true,
      title: "Profil utilisateur - Groupomania"
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      requiresAuth: true,
      title: "Paramètres - Groupomania"
    }
  },
  {
    path: '/404NotFound',
    alias: '*',
    name: 'NotFound',
    component: NotFound,
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

// Attribut le titre de page [meta.title] et vérifie si l'utilisateur peut y acceder (meta.requiresAuth) avant chaque changement de route
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
