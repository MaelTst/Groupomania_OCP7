<template>
  <div>
    <div class="usersPosts mt-6">
      <v-card class="rounded-lg boxShadowed pa-6 pt-2">
        <div class="usersPosts__heading">
          <router-link :to="'/user/'+post.user.id">
            <v-avatar class="rounded-lg" size="42">
              <img
                :src="post.user.imgUrl || require('../assets/placeholder.png')"
                alt="Photo de profil"
              />
            </v-avatar>
          </router-link>
          <div class="usersPosts__heading__text">
            <v-card-title
              class="blue-grey--text text--darken-3 text-subtitle-2"
            >{{ post.user.nickname }}</v-card-title>
            <v-card-subtitle
              :title="$moment(post.createdAt).calendar()"
            >{{ $moment(post.createdAt).fromNow() }}</v-card-subtitle>
          </div>
          <v-menu
            content-class="elevation-2 rounded-lg"
            transition="slide-y-transition"
            bottom
            right
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn aria-label="Options du post" icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item link @click="reportPost">
                <v-list-item-icon class="mr-3">
                  <v-icon>mdi-alert</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Signaler</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                link
                v-if="post.userId === userInfo.id || userInfo.isAdmin === true"
                @click="editPost(1)"
              >
                <v-list-item-icon class="mr-3">
                  <v-icon>mdi-pencil</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Modifier</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                link
                v-if="post.userId === userInfo.id || userInfo.isAdmin === true"
                @click="deletePost"
              >
                <v-list-item-icon class="mr-3">
                  <v-icon>mdi-delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Supprimer</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div class="usersPosts__content mt-2">
          <div v-show="!isEditing">{{post.content}}</div>
          <div v-show="isEditing">
            <v-textarea
              hide-details
              class="rounded-lg usersPosts__content__edit"
              rows="1"
              row-height="36"
              auto-grow
              dense
              flat
              solo
              :label="'Quoi de neuf, '+userInfo.nickname + ' ?'"
              v-model="editPostContent"
              background-color="bg-light-grey"
            ></v-textarea>
            <div class="d-flex mt-6 justify-end">
              <v-file-input
                aria-label="Joindre un fichier"
                v-model="postFile"
                accept="image/*"
                icon="mdi-paperclip"
                hide-details
                :clearable="false"
                small-chips
                dense
                flat
                class="flex-grow-0 align-self-end mb-1"
              ></v-file-input>
              <v-btn
                depressed
                height="42"
                dark
                color="secondary"
                class="ml-3 rounded-lg align-self-end"
                @click="editPost(0)"
              >Annuler</v-btn>
              <v-btn
                depressed
                :loading="loading"
                :disabled="loading"
                height="42"
                color="primary"
                class="ml-3 rounded-lg align-self-end"
                @click="editPost(2)"
              >Confirmer</v-btn>
            </div>
          </div>
          <v-img
            v-show="!isEditing"
            class="usersPosts__img rounded-lg mt-6"
            v-if="post.imgUrl"
            :src="post.imgUrl"
            max-height="400"
            @click="toggleFullscreen(true)"
          ></v-img>
        </div>
        <div class="usersPosts__subContent mt-6">
          <div
            class="usersPosts__subContent__heading pa-2 d-flex justify-space-between align-center"
          >
            <div class="d-flex">
              <v-btn
                block
                :class="post.likes.map(like => like.userId).includes(userInfo.id) ? 'primary--text' : 'secondary--text'"
                depressed
                @click="likePost()"
              >
                <v-icon size="20">mdi-thumb-up</v-icon>
                {{post.likes.length}} J'aime
              </v-btn>
            </div>
            <div class="d-flex">
              <span>{{ post.comments.length }} {{ post.comments.length > 1 ? "commentaires" : "commentaire" }}</span>
              <v-icon size="20">mdi-comment</v-icon>
            </div>
          </div>
          <div v-for="comment in post.comments" :key="comment.id">
            <div class="usersPosts__subContent__comment d-flex">
              <v-avatar class="rounded-lg" size="32">
                <img
                  :src="comment.user.imgUrl || require('../assets/placeholder.png')"
                  alt="Photo de profil"
                />
              </v-avatar>
              <div>{{ comment.content }}</div>
            </div>
          </div>

          <div class="usersPosts__subContent__textfield d-flex align-center mt-6">
            <router-link :to="'/user/'+userInfo.id">
              <v-avatar class="rounded-lg d-none d-sm-flex mr-3" size="32">
                <img
                  :src="userInfo.imgUrl || require('../assets/placeholder.png')"
                  alt="Photo de profil"
                />
              </v-avatar>
            </router-link>
            <v-text-field
              hide-details
              append-outer-icon="mdi-send"
              class="rounded-lg"
              height="20"
              dense
              v-model="commentContent"
              flat
              solo
              @click:append-outer="sendComment"
              background-color="bg-light-grey"
              label="Poster un commentaire..."
            ></v-text-field>
          </div>
        </div>
      </v-card>
    </div>

    <v-overlay :z-index="999" opacity="0.90" :value="fullScreenImg" @click="toggleFullscreen()">
      <v-img max-height="90vh" max-width="90vw" contain :src="this.post.imgUrl"></v-img>
    </v-overlay>
    <v-snackbar v-model="snackbar" :timeout="4000" color="red darken-3">
      {{ snackbarMsg }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">Fermer</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    fullScreenImg: false,
    isEditing: false,
    editPostContent: "",
    postFile: null,
    commentContent: "",
    snackbar: false,
    snackbarMsg: "",
    loading: false,
  }),
  props: {
    post: {},
    index: null,
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  components: {},
  methods: {
    editPost(value) {
      if (value === 0) {
        this.isEditing = false;
      }
      if (value === 1) {
        this.isEditing = true;
        this.editPostContent = this.post.content;
      }
      if (value === 2) {
        console.log(this.editPostContent);
        if (!this.editPostContent.trim() || this.editPostContent.length < 6) {
          this.snackbarMsg =
            "Votre message doit comporter au moins 6 caractères";
          this.snackbar = true;
        } else {
          this.loading = true;
          var formData = new FormData();
          formData.append("content", this.editPostContent);
          if (this.postFile) {
            formData.append("image", this.postFile);
          }
          fetch(`${process.env.VUE_APP_ROOT_API}api/posts/${this.post.id}`, {
            method: "PUT",
            credentials: "include",
            body: formData,
          })
            .then((response) => {
              if (response.ok) {
                response.json().then((response) => {
                  console.log(response);
                  if (this.$route.name === "Home") {
                    this.$store.dispatch("getPosts");
                  }
                  if (this.$route.name === "Favorites") {
                    this.$store.dispatch(
                      "getFavoritesPosts",
                      this.$getCookie("ID")
                    );
                  }
                  if (this.$route.name === "Pictures") {
                    this.$store.dispatch("getPicsPosts");
                  }
                  //if (this.$route.name === "User") { this.$store.dispatch("getPicsPosts"); }
                  //if (this.$route.name === "Post") { this.$store.dispatch("getPicsPosts"); }
                  this.isEditing = false;
                  this.postFile = null;
                  this.loading = false;
                });
              } else {
                response.json().then((error) => {
                  console.log(error);
                  this.loading = false;
                  this.snackbarMsg = error.message;
                  this.snackbar = true;
                });
              }
            })
            .catch((error) => {
              console.log("Erreur lors du fetch : " + error.message);
              this.loading = false;
              this.snackbarMsg = "Une erreur serveur est survenue";
              this.snackbar = true;
            });
        }
      }
    },

    reportPost() {
      this.snackbar = true;
      this.snackbarMsg = "Post signalé (ou pas)";
    },

    deletePost() {
      let postId = this.post.id;
      let index = this.index;
      this.$store.dispatch("deletePost", { postId, index });
    },

    toggleFullscreen(param) {
      if (param) {
        this.fullScreenImg = true;
      } else {
        this.fullScreenImg = false;
      }
    },

    likePost() {
      let currentPage = this.$route.name;
      let postId = this.post.id;
      let ID = this.$getCookie("ID");
      this.$store.dispatch("likePost", { postId, currentPage, ID });
    },

    sendComment() {
      if (this.commentContent) {
        let content = this.commentContent;
        let postId = this.post.id;
        this.$store.dispatch("sendComment", { postId, content });
        this.commentContent = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.usersPosts {
  &__heading {
    display: flex;
    align-items: center;
    &__text {
      flex-grow: 1;
    }
  }
  &__content {
    white-space: pre-line;
  }
  &__img {
    cursor: pointer;
  }
  &__subContent {
    &__heading {
      border-top: 1px solid #f2f3f7;
      border-bottom: 1px solid #f2f3f7;
    }
  }
}
</style>