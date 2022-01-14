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
  },


  mutations: {
    USER_LOGIN(state, userInfo) {
      state.userInfo = userInfo
    },

    USER_LOGOUT(state) {
      state.userInfo = {}
    },

    GET_USERS(state, response) {
      state.users = response
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

    getUsers({ commit }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/user/`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((response) => {
              commit('GET_USERS', response)
            });
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

    getUniquePost({ commit }, ID) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/unique/${ID}`, {
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

    refreshPosts({ dispatch }, { currentRoute, ID, postId }) {
      if (currentRoute === "Home") { dispatch('getPosts'); }
      if (currentRoute === "Favorites") { dispatch("getFavoritesPosts", ID); }
      if (currentRoute === "Pictures") { dispatch("getPicsPosts"); }
      if (currentRoute === "Post") { dispatch("getUniquePost", postId); }
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

    likePost({ dispatch }, { postId, currentRoute, ID }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}/like`, {
        method: "POST",
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((response) => {
              console.log(response)
              dispatch('getMostLikedPics');
              dispatch('refreshPosts', { currentRoute, ID, postId });
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

    sendComment({ dispatch }, { postId, content, currentRoute, ID }) {
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
              dispatch('refreshPosts', { currentRoute, ID, postId });
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
