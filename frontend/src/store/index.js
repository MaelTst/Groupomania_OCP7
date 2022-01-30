import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    posts: {},
    mostLikedPics: {},
    users: {},
    userProfile: {}
  },

  mutations: {
    USER_LOGIN(state, userInfo) {
      state.userInfo = userInfo
    },

    USER_LOGOUT(state) {
      state.userInfo = {}
    },

    GET_USER(state, response) {
      state.userProfile = response
    },

    GET_USERS(state, response) {
      state.users = response
    },

    GET_POSTS(state, response) {
      state.posts = response
    },

    GET_MOST_LIKED_PICS(state, response) {
      state.mostLikedPics = response
    },

    REFRESH_ONE_POST(state, { response, postIndex }) {
      state.posts.splice(postIndex, 1, response[0])
    },

    DELETE_POST(state, index) {
      state.posts.splice(index, 1)
    },

    DELETE_COMMENT(state, { postIndex, commentIndex }) {
      state.posts[postIndex].comments.splice(commentIndex, 1)
    }
  },

  actions: {
    // Affecte au state "userInfo" les informations de l'utilisateur suite à sa connexion
    logIn({ commit }, userInfo) { commit('USER_LOGIN', userInfo) },

    // Détruit les cookies de l'utilisateur, retire ses informations du state et le redirige vers la vue Login
    logOut({ commit }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/user/auth/logout`, { method: "GET", credentials: "include" })
        .then(() => {
          commit('USER_LOGOUT')
          router.push({ name: "Login" })
        })
        .catch((error) => { console.log(error.message) })
    },

    // Rafraichit les informations de l'utilisateur connecté et les affecte au state "userInfo"
    refreshUserInfo({ commit, dispatch }, ID) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/user/${ID}`, { method: "GET", credentials: "include" })
        .then((response) => {
          if (response.ok) {
            response.json().then((userInfo) => { commit('USER_LOGIN', userInfo) })
          } else { dispatch("logOut"); }
        })
        .catch((error) => { console.log(error.message) })
    },

    // Récupère les informations de l'utilisateur [userId] et les affecte au state "userProfile"
    getUser({ commit }, userId) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/user/${userId}`, { method: "GET", credentials: "include" })
        .then((response) => {
          if (response.ok) {
            response.json().then((response) => { commit('GET_USER', response) })
          } else { router.push({ name: "NotFound" }) }
        })
        .catch((error) => { console.log(error.message) })
    },

    // Récupère la liste des tous utilisateurs et l'affecte au state "users"
    getUsers({ commit }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/user/`, { method: "GET", credentials: "include" })
        .then((response) => {
          if (response.ok) {
            response.json().then((response) => { commit('GET_USERS', response) })
          }
        })
        .catch((error) => { console.log(error.message) })
    },

    // Supprime l'utilisateur [ID] et met à jour la liste des utilisateurs
    deleteUser({ dispatch }, { ID, isAdminBan }) {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/user/${ID}`, { method: "DELETE", credentials: "include" })
          .then((response) => {
            if (response.ok) {
              response.json().then((response) => {
                resolve(response)
                if (isAdminBan) { dispatch("getUsers") }
              })
            } else { response.json().then((error) => { reject(error) }) }
          })
          .catch((error) => { reject(error.message) })
      })
    },

    // Modifie les informations de l'utilisateur [ID]
    updateUser({ dispatch }, { ID, userId, password, job, banned }) {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/user/${ID}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: password, job: job, banned: banned })
        })
          .then((response) => {
            if (response.ok) {
              response.json().then((response) => {
                if (!banned) { dispatch("refreshUserInfo", ID) }
                if (job) { dispatch("getUser", userId) }
                resolve(response)
              })
            } else {
              response.json().then((error) => { reject(error) })
            }
          })
          .catch((error) => { reject(error.message) })
      })
    },

    // Modifie la photo de profil de l'utilisateur [ID]
    updateUserAvatar({ dispatch }, { ID, formData }) {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/user/${ID}`, { method: "PUT", credentials: "include", body: formData })
          .then((response) => {
            if (response.ok) {
              dispatch("getUser", ID)
              dispatch("refreshUserInfo", ID)
              dispatch("getUserPost", ID)
              resolve(response)
            } else { response.json().then((error) => { reject(error) }) }
          })
          .catch((error) => { reject(error) })
      })
    },

    // Modifie la photo de couverture de l'utilisateur [ID]
    updateUserBanner({ dispatch }, { ID, formData }) {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/user/${ID}/banner`, { method: "PUT", credentials: "include", body: formData })
          .then((response) => {
            if (response.ok) {
              dispatch("getUser", ID)
              resolve(response)
            } else { response.json().then((error) => { reject(error) }) }
          })
          .catch((error) => { reject(error) })
      })
    },

    // Récupère la liste de toutes les publications et les affecte au state "posts"
    getPosts({ commit }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/`, { method: "GET", credentials: "include" })
        .then((response) => {
          if (response.ok) { response.json().then((response) => { commit('GET_POSTS', response) }) }
        })
        .catch((error) => { console.log(error.message) })
    },

    // Récupère les 5 publications contenant des images les plus likées et les affecte au state "mostLikedPics"
    getMostLikedPics({ commit }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/mostlikedpics`, { method: "GET", credentials: "include" })
        .then((response) => {
          if (response.ok) {
            response.json().then((response) => { commit('GET_MOST_LIKED_PICS', response) })
          }
        })
        .catch((error) => { console.log(error.message) })
    },

    // Récupère la liste de toutes les publications contenant des images et les affecte au state "posts"
    getPicsPosts({ commit }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/pics`, { method: "GET", credentials: "include" })
        .then((response) => {
          if (response.ok) { response.json().then((response) => { commit('GET_POSTS', response) }) }
        })
        .catch((error) => { console.log(error.message) })
    },

    // Récupère la liste de toutes les publications likées par l'utilisateur [ID] et les affecte au state "posts"
    getFavoritesPosts({ commit }, ID) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/liked/${ID}`, { method: "GET", credentials: "include" })
        .then((response) => {
          if (response.ok) { response.json().then((response) => { commit('GET_POSTS', response) }) }
        })
        .catch((error) => { console.log(error.message) })
    },

    // Récupère la publication [ID] et l'affecte au state "posts"
    getUniquePost({ commit }, ID) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/unique/${ID}`, { method: "GET", credentials: "include" })
        .then((response) => {
          if (response.ok) {
            response.json().then((response) => {
              if (response[0] === null) { router.push({ name: "NotFound" }) }
              commit('GET_POSTS', response)
            })
          }
        })
        .catch((error) => { console.log(error.message) })
    },

    // Récupère la liste des publications postées par l'utilisateur [userId] et les affecte au state "posts"
    getUserPost({ commit }, userId) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/user/${userId}`, { method: "GET", credentials: "include" })
        .then((response) => {
          if (response.ok) { response.json().then((response) => { commit('GET_POSTS', response) }) }
        })
        .catch((error) => { console.log(error.message) })
    },

    // Dispatch vers les actions de récupération de publications appropriées en fonction de [currentRoute] ($route.name)
    refreshPosts({ dispatch }, { currentRoute, ID, postId, userId }) {
      if (currentRoute === "Home") { dispatch('getPosts') }
      if (currentRoute === "Favorites") { dispatch("getFavoritesPosts", ID) }
      if (currentRoute === "Pictures") { dispatch("getPicsPosts") }
      if (currentRoute === "Post") { dispatch("getUniquePost", postId) }
      if (currentRoute === "User") { dispatch("getUserPost", userId) }
    },

    // Récupère la publication [postId] et la met à jour dans le state "posts"
    refreshOnePost({ commit }, { postId, postIndex }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/unique/${postId}`, { method: "GET", credentials: "include" })
        .then((response) => {
          if (response.ok) {
            response.json().then((response) => { commit('REFRESH_ONE_POST', { response, postIndex }) })
          }
        })
        .catch((error) => { console.log(error.message) })
    },

    // Créer une nouvelle publication
    sendPost({ dispatch }, formData) {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/posts/`, { method: "POST", credentials: "include", body: formData })
          .then((response) => {
            if (response.ok) {
              resolve()
              dispatch("getPosts")
            } else { response.json().then((error) => { reject(error) }) }
          })
          .catch((error) => { reject(error) })
      })
    },

    // Modifie la publication [postId]
    editPost({ dispatch }, { formData, postId, postIndex }) {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}`, { method: "PUT", credentials: "include", body: formData })
          .then((response) => {
            if (response.ok) {
              resolve()
              if (formData.has('image') || formData.has('imgUrl')) { dispatch('getMostLikedPics') }
              dispatch("refreshOnePost", { postId, postIndex })
            } else { response.json().then((error) => { reject(error) }) }
          })
          .catch((error) => { reject(error) })
      })
    },

    // Supprime la publication [postId]
    deletePost({ dispatch, commit, state }, { postId, index }) {
      return new Promise((reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}`, { method: "DELETE", credentials: "include" })
          .then((response) => {
            if (response.ok) {
              if (state.posts[index].imgUrl) { dispatch('getMostLikedPics') }
              commit('DELETE_POST', index)
            } else { response.json().then((error) => { reject(error) }) }
          })
          .catch((error) => { reject(error) })
      })
    },

    // Like/Dislike la publication [postId]
    likePost({ dispatch }, { postId, postIndex, currentRoute, ID }) {
      return new Promise((reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}/like`, { method: "POST", credentials: "include" })
          .then((response) => {
            if (response.ok) {
              dispatch('getMostLikedPics');
              if (currentRoute === "Favorites") {
                dispatch('getFavoritesPosts', ID)
              } else { dispatch('refreshOnePost', { postId, postIndex }) }
            } else { response.json().then((error) => { reject(error) }) }
          })
          .catch((error) => { reject(error) })
      })
    },

    // Supprime le commentaire [commentId] de la publication [postId]
    deleteComment({ commit }, { postId, postIndex, commentId, commentIndex }) {
      return new Promise((reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}/comment/${commentId}`, { method: "DELETE", credentials: "include" })
          .then((response) => {
            if (response.ok) {
              commit('DELETE_COMMENT', { postIndex, commentIndex })
            } else { response.json().then((error) => { reject(error) }) }
          })
          .catch((error) => { reject(error) })
      })
    },

    // Créer un nouveau commentaire pour la publication [postId]
    sendComment({ dispatch }, { postId, postIndex, content }) {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}/comment`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: content })
        })
          .then((response) => {
            if (response.ok) {
              dispatch('refreshOnePost', { postId, postIndex })
              resolve()
            } else { response.json().then((error) => { reject(error) }) }
          })
          .catch((error) => { reject(error) })
      })
    },

    // Modifie le commentaire [commentId] de la publication [postId]
    updateComment({ dispatch }, { postId, postIndex, commentId, commentContent }) {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}/comment/${commentId}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: commentContent })
        })
          .then((response) => {
            if (response.ok) {
              dispatch('refreshOnePost', { postId, postIndex })
              resolve()
            } else { response.json().then((error) => { reject(error) }) }
          })
          .catch((error) => { reject(error) })
      })
    }
  }
})
