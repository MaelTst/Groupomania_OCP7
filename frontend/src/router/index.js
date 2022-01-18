import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import User from '../views/User.vue'
import Settings from '../views/Settings.vue'
import NotFound from '../views/NotFound.vue'

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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
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

function getCookie() {
  let name = "isLoggedIn=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Groupomania"
  if (to.meta.requiresAuth) {
    if (!getCookie()) {
      next({ name: 'Login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
