import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    posts: {},
    mostLikedPics: {},
  },


  mutations: {
    USER_LOGIN(state, userInfo) {
      state.userInfo = userInfo
    },

    USER_LOGOUT(state) {
      state.userInfo = {}
    },

    GET_POSTS(state, response) {
      state.posts = response
    },

    DELETE_POST(state, index) {
      state.posts.splice(index, 1)
    },

    GET_MOST_LIKED_PICS(state, response) {
      state.mostLikedPics = response
    }
  },


  actions: {
    logIn({ commit }, userInfo) {
      commit('USER_LOGIN', userInfo)
    },

    logOut({ commit }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/user/auth/logout`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          commit('USER_LOGOUT')
          router.push({ name: "Login" });
        })
        .catch((error) => {
          console.log("Erreur lors du fetch : " + error.message);
        });
    },

    refreshUserInfo({ commit }, ID) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/user/${ID}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((userInfo) => {
              commit('USER_LOGIN', userInfo)
            })
          }
        })
        .catch((error) => {
          console.log("Erreur lors du fetch : " + error.message);
        });
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

    getPicsPosts({ commit }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/pics`, {
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

    getFavoritesPosts({ commit }, ID) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/liked/${ID}`, {
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

    deletePost({ dispatch, commit, state }, { postId, index }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((response) => {
              console.log(response)
              if (state.posts[index].imgUrl) { dispatch('getMostLikedPics'); }
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

    likePost({ dispatch }, { postId, currentPage, ID }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}/like`, {
        method: "POST",
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((response) => {
              console.log(response)
              dispatch('getMostLikedPics');
              if (currentPage === "Pictures") { dispatch('getPicsPosts'); }
              if (currentPage === "Home") { dispatch('getPosts'); }
              if (currentPage === "Favorites") { dispatch('getFavoritesPosts', ID); }
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
        body: JSON.stringify({ content: content })
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

    getMostLikedPics({ commit }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/mostlikedpics`, {
        method: "GET",
        credentials: "include",
      }).then((response) => {
        if (response.ok) {
          response.json().then((response) => {
            commit('GET_MOST_LIKED_PICS', response)
          });
        }
      })
        .catch((error) => {
          console.log("Erreur lors du fetch : " + error.message);
        });
    }

  },

  getters: {
  },

  modules: {
  }
})
