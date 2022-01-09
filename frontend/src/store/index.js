import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    userInfo: {},
    posts: {}
  },
  mutations: {
    USER_LOGIN(state, userInfo) {
      state.isLoggedIn = true,
        state.userInfo = userInfo
    },
    GET_POSTS(state, response) {
      state.posts = response
    },
    DELETE_POST(state, index) {
      state.posts.splice(index, 1)
    },
  },
  actions: {
    logIn({ commit }, userInfo) {
      commit('USER_LOGIN', userInfo)
    },
    getPosts({ commit }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        response.json().then((response) => {
          commit('GET_POSTS', response)
        });
      }
    });
    },

    sendPost({ dispatch }, { content, file }) {
      var formData = new FormData()
      formData.append('content', content)
      if (file) { formData.append('image', file) }

      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/`, {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((response) => { 
            console.log(response)
            dispatch('getPosts');
            })
        } else {
          response.json().then((error) => {
            console.log(error)
          });
        }
      })
      .catch((error) => {
        console.log("Erreur lors du fetch : " + error.message);
      });
    },

    deletePost({ commit }, { postId, index }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}`, {
          method: "DELETE",
          credentials: "include",
        })
          .then((response) => {
            if (response.ok) {
              response.json().then((response) => { 
                console.log(response)
                commit('DELETE_POST', index)
                })
            } else {
              response.json().then((error) => {
                console.log(error)
              });
            }
          })
          .catch((error) => {
            console.log("Erreur lors du fetch : " + error.message);
          });
    },

    likePost({ dispatch }, { postId }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}/like`, {
          method: "POST",
          credentials: "include",
        })
          .then((response) => {
            if (response.ok) {
              response.json().then((response) => { 
                console.log(response)
                dispatch('getPosts');
                })
            } else {
              response.json().then((error) => {
                console.log(error)
              });
            }
          })
          .catch((error) => {
            console.log("Erreur lors du fetch : " + error.message);
          });
    },

    sendComment({ dispatch }, { postId, content }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}/comment`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({content: content})
        })
          .then((response) => {
            if (response.ok) {
              response.json().then((response) => { 
                console.log(response)
                dispatch('getPosts');
                })
            } else {
              response.json().then((error) => {
                console.log(error)
              });
            }
          })
          .catch((error) => {
            console.log("Erreur lors du fetch : " + error.message);
          });
    },
  },
  getters: {
  },
  modules: {
  }
})
