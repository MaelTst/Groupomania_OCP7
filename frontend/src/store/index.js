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

    REFRESH_ONE_POST(state, { response, postIndex }) {
      state.posts.splice(postIndex, 1, response[0])
    },

    DELETE_POST(state, index) {
      state.posts.splice(index, 1)
    },

    DELETE_COMMENT(state, { postIndex, commentIndex }) {
      state.posts[postIndex].comments.splice(commentIndex, 1)
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
        headers: { "Content-Type": "application/json" },
      })
        .then(() => {
          commit('USER_LOGOUT')
          router.push({ name: "Login" });
        })
        .catch((error) => {
          console.log("Erreur lors du fetch : " + error.message);
        });
    },

    refreshUserInfo({ commit, dispatch }, ID) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/user/${ID}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((userInfo) => {
              commit('USER_LOGIN', userInfo)
            })
          } else { dispatch("logOut"); }
        })
        .catch((error) => {
          console.log("Erreur lors du fetch : " + error.message);
        });
    },

    getUser({ commit }, userId) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/user/${userId}`, {
        method: "GET",
        credentials: "include"
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((response) => {
              commit('GET_USER', response)
            });
          } else { router.push({ name: "NotFound" }); }
        })
        .catch((error) => {
          console.log("Erreur lors du fetch : " + error.message);
        });
    },

    getUsers({ commit }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/user/`, {
        method: "GET",
        credentials: "include"
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

    deleteUser({ dispatch }, { ID, isAdminBan }) {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/user/${ID}`, {
          method: "DELETE",
          credentials: "include"
        }).then((response) => {
          if (response.ok) {
            response.json().then((response) => {
              resolve(response)
              if (isAdminBan) { dispatch("getUsers"); }
            });
          } else {
            response.json().then((error) => {
              reject(error)
            });
          }
        })
          .catch((error) => {
            reject(error.message)
          });
      })
    },

    updateUser({ dispatch }, { ID, userId, imgUrl, email, nickname, password, job, banned }) {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/user/${ID}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imgUrl: imgUrl, email: email, nickname: nickname, password: password, job: job, banned: banned })
        }).then((response) => {
          if (response.ok) {
            response.json().then((response) => {
              if (!banned) { dispatch("refreshUserInfo", ID); }
              if (job) { dispatch("getUser", userId); }
              resolve(response)
            });
          } else {
            response.json().then((error) => {
              reject(error)
            });
          }
        })
          .catch((error) => {
            reject(error.message)
          });
      })
    },

    updateUserAvatar({ dispatch }, { ID, formData }) {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/user/${ID}`, {
          method: "PUT",
          credentials: "include",
          body: formData
        })
          .then((response) => {
            if (response.ok) {
              dispatch("getUser", ID);
              dispatch("refreshUserInfo", ID);
              dispatch("getUserPost", ID);
              resolve(response)

            } else {
              response.json().then((error) => {
                reject(error)
              });
            }
          })
          .catch((error) => {
            reject(error)
          });
      })
    },

    updateUserBanner({ dispatch }, { ID, formData }) {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/user/${ID}/banner`, {
          method: "PUT",
          credentials: "include",
          body: formData
        })
          .then((response) => {
            if (response.ok) {
              dispatch("getUser", ID);
              resolve(response)

            } else {
              response.json().then((error) => {
                reject(error)
              });
            }
          })
          .catch((error) => {
            reject(error)
          });
      })
    },

    sendPost({ dispatch }, formData) {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/posts/`, {
          method: "POST",
          credentials: "include",
          body: formData
        })
          .then((response) => {
            if (response.ok) {
              resolve()
              dispatch("getPosts");
            } else { response.json().then((error) => { reject(error) }); }
          })
          .catch((error) => { reject(error) });
      })
    },

    editPost({ dispatch }, { formData, postId, postIndex }) {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}`, {
          method: "PUT",
          credentials: "include",
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              resolve()
              dispatch("refreshOnePost", { postId, postIndex })
            } else { response.json().then((error) => { reject(error) }); }
          })
          .catch((error) => { reject(error) });
      })
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
            if (response[0] === null) { router.push({ name: "NotFound" }); }
            commit('GET_POSTS', response)
          });
        }
      });
    },

    getUserPost({ commit }, userId) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/user/${userId}`, {
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

    refreshPosts({ dispatch }, { currentRoute, ID, postId, userId }) {
      if (currentRoute === "Home") { dispatch('getPosts'); }
      if (currentRoute === "Favorites") { dispatch("getFavoritesPosts", ID); }
      if (currentRoute === "Pictures") { dispatch("getPicsPosts"); }
      if (currentRoute === "Post") { dispatch("getUniquePost", postId); }
      if (currentRoute === "User") { dispatch("getUserPost", userId); }
    },

    deletePost({ dispatch, commit, state }, { postId, index }) {
      return new Promise((reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}`, {
          method: "DELETE",
          credentials: "include",
        })
          .then((response) => {
            if (response.ok) {
              if (state.posts[index].imgUrl) { dispatch('getMostLikedPics'); }
              commit('DELETE_POST', index)
            } else {
              response.json().then((error) => {
                reject(error)
              });
            }
          })
          .catch((error) => {
            reject(error)
          });
      })
    },

    deleteComment({ commit }, { postId, postIndex, commentId, commentIndex }) {
      return new Promise((reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}/comment/${commentId}`, {
          method: "DELETE",
          credentials: "include",
        })
          .then((response) => {
            if (response.ok) {
              commit('DELETE_COMMENT', { postIndex, commentIndex })
            } else {
              response.json().then((error) => {
                reject(error)
              });
            }
          })
          .catch((error) => {
            reject(error)
          });
      })
    },

    likePost({ dispatch }, { postId, postIndex, currentRoute, ID }) {
      return new Promise((reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}/like`, {
          method: "POST",
          credentials: "include",
        })
          .then((response) => {
            if (response.ok) {
              dispatch('getMostLikedPics');
              if (currentRoute === "Favorites") { dispatch('getFavoritesPosts', ID) } else {
              dispatch('refreshOnePost', { postId, postIndex }) }
            } else {
              response.json().then((error) => {
                reject(error)
              });
            }
          })
          .catch((error) => {
            reject(error)
          });
      })
    },

    refreshOnePost({ commit }, { postId, postIndex }) {
      fetch(`${process.env.VUE_APP_ROOT_API}api/posts/unique/${postId}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((response) => {
            commit('REFRESH_ONE_POST', { response, postIndex })
            })
          } else {
            response.json().then((error) => {
              console.log(error)
            });
          }
        })
        .catch((error) => {
          console.log(error)
        });
    },

    sendComment({ dispatch }, { postId, postIndex, content }) {
      return new Promise((resolve, reject) => {
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
            dispatch('refreshOnePost', { postId, postIndex })
            resolve()
          } else {
            response.json().then((error) => {
              reject(error)
            });
          }
        })
        .catch((error) => {
          reject(error)
        });
      })
    },

    updateComment({ dispatch }, { postId, postIndex, commentId, commentContent }) {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${postId}/comment/${commentId}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: commentContent })
        })
          .then((response) => {
            if (response.ok) {
              dispatch('refreshOnePost', { postId, postIndex })
              resolve()
            } else {
              response.json().then((error) => {
                reject(error)
              });
            }
          })
          .catch((error) => {
            console.log("Erreur lors du fetch : " + error.message);
          });
      })
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
})
