import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Favorites from '../views/Favorites.vue'
import Pictures from '../views/Pictures.vue'
import Post from '../views/Post.vue'

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
    component: Favorites,
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
    component: Pictures,
    meta: {
      requiresAuth: true,
      title: "Photos - Groupomania"
    }
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: Post,
    meta: {
      requiresAuth: true,
      title: "Groupomania"
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
