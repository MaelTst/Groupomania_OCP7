<template>
  <div>
    <div class="usersPosts mb-6">
      <v-card class="rounded-lg boxShadowed pa-6 pt-2">
        <div class="usersPosts__heading">
          <router-link aria-label="Profil utilisateur" :to="'/user/'+post.user.id">
            <v-avatar class="rounded-lg" size="42">
              <v-img
              v-ripple
                :src="post.user.imgUrl || require('../assets/placeholder.png')"
                alt="Photo de profil"
              />
            </v-avatar>
          </router-link>
          <div class="usersPosts__heading__text">
            <v-card-title
              class="text-subtitle-2"
            >{{ post.user.nickname }}</v-card-title>
            <v-card-subtitle
              :title="$moment(post.createdAt).calendar()"
            >{{ $moment(post.createdAt).subtract(30,'s').fromNow() }}</v-card-subtitle>
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
                <v-icon>more_horiz</v-icon>
              </v-btn>
            </template>
            <v-list nav dense>
              <v-list-item link @click="reportPost">
                <v-list-item-icon class="mr-3">
                  <v-icon>warning</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Signaler</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                link
                v-if="post.userId === userInfo.id || userInfo.isAdmin === true"
                @click="isEditing = true, editPostContent = post.content"
              >
                <v-list-item-icon class="mr-3">
                  <v-icon>edit</v-icon>
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
                  <v-icon>delete</v-icon>
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
              maxlength="300"
              auto-grow
              dense
              flat
              solo
              :label="'Quoi de neuf, '+userInfo.nickname + ' ?'"
              v-model="editPostContent"
              background-color="bg-light-grey"
            ></v-textarea>
            <div class="d-flex mt-6 justify-end align-center flex-wrap">
              <v-file-input
                aria-label="Joindre un fichier"
                v-model="postFile"
                accept="image/*"
                prepend-icon="attach_file"
                hide-details
                :clearable="false"
                small-chips
                dense
                flat
                class="flex-grow-0 mb-1"
              ></v-file-input>
              <v-btn
                depressed
                small
                dark
                color="secondary"
                class="ml-3 mb-1"
                @click="isEditing = false"
              >Annuler</v-btn>
              <v-btn
                depressed
                :loading="loading"
                :disabled="loading"
                small
                color="primary"
                class="ml-3 mb-1"
                @click="editPost"
              >Confirmer</v-btn>
            </div>
          </div>
          <v-img
          v-ripple
            v-show="!isEditing"
            class="usersPosts__img rounded-lg mt-6"
            v-if="post.imgUrl"
            :src="post.imgUrl"
            max-height="400"
            @click="fullScreenImg = true"
          ></v-img>
        </div>
        <div class="usersPosts__subContent mt-6">
          <div
            class="usersPosts__subContent__heading mb-4 pa-2 d-flex justify-space-between align-center"
          >
            <div class="d-flex">
              <v-btn
                text
                block
                :class="post.likes.map(like => like.userId).includes(userInfo.id) ? 'primary--text overline' : 'blue-grey--text text--darken-3 overline'"
                depressed
                @click="likePost"
              >
                <v-icon size="20" class="mr-1">thumb_up</v-icon>
                <span>{{post.likes.length}}</span>
                <span class="d-none d-sm-block ml-1">J'aime</span>
              </v-btn>
            </div>
            <div class="d-flex">
              <v-btn
                text
                block
                depressed
                @click="focusComment(post.id)"
                class="blue-grey--text text--darken-3 overline"
              >
                <v-icon size="20" class="mr-1">question_answer</v-icon>
                <span>{{ post.comments.length }}</span>
                <span
                  class="d-none d-sm-block ml-1"
                >{{ post.comments.length > 1 ? "commentaires" : "commentaire" }}</span>
              </v-btn>
            </div>
          </div>
          <Comment
            v-for="(comment, commentIndex) in post.comments"
            :key="comment.id"
            :comment="comment"
            :commentIndex="commentIndex"
            :post="post"
            :postIndex="index"
          />
          <div class="usersPosts__subContent__textfield d-flex align-center mt-4">
            <router-link aria-label="Profil utilisateur" :to="'/user/'+userInfo.id">
              <v-avatar class="rounded-lg d-none d-sm-flex" size="32">
                <v-img
                v-ripple
                  :src="userInfo.imgUrl || require('../assets/placeholder.png')"
                  alt="Photo de profil"
                />
              </v-avatar>
            </router-link>
            <v-text-field
              :id="'sendComment'+post.id"
              hide-details
              append-outer-icon="send"
              class="rounded-lg ml-3"
              height="20"
              dense
              maxlength="300"
              v-model="commentContent"
              flat
              autocomplete="off"
              solo
              @click:append-outer="sendComment"
              @keydown.enter="sendComment"
              background-color="bg-light-grey"
              label="Poster un commentaire..."
            ></v-text-field>
          </div>
        </div>
      </v-card>
    </div>
    <v-overlay :z-index="999" opacity="0.90" :value="fullScreenImg">
      <v-btn class="d-flex ml-auto overlayBtn mb-1" aria-label="Quitter le mode plein écran" icon @click="fullScreenImg = false"><v-icon>close</v-icon></v-btn>
      <v-img max-height="90vh" max-width="90vw" contain :src="this.post.imgUrl"></v-img>
    </v-overlay>
    <v-snackbar v-model="snackbar" :timeout="4000" :color="snackbarColor">
      {{ snackbarMsg }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">Fermer</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import Comment from "../components/Comment";

export default {
  data: () => ({
    fullScreenImg: false,
    isEditing: false,
    editPostContent: "",
    postFile: null,
    commentContent: "",
    snackbar: false,
    snackbarColor: "red darken-3",
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

  components: {
    Comment,
  },

  methods: {
    editPost() {
      if (!this.editPostContent.trim() || this.editPostContent.length < 6) {
        this.snackbarMsg = "Votre message doit comporter au moins 6 caractères";
        this.snackbar = true;
      } else {
        this.loading = true;
        let postId = this.post.id;
        let postIndex = this.index
        var formData = new FormData();
        formData.append("content", this.editPostContent);
        if (this.postFile) { formData.append("image", this.postFile); }
        this.$store.dispatch("editPost", { formData, postId, postIndex }).then(
          () => {
            this.isEditing = false;
            this.postFile = null;
            this.loading = false;
            this.snackbarColor = "primary"
            this.snackbarMsg = "Post modifié"
            this.snackbar = true
          },
          (error) => {
            this.loading = false;
            this.snackbarColor = "red darken-3"
            this.snackbarMsg = error.message || "Une erreur est survenue";
            this.snackbar = true;
          }
        );
      }
    },

    reportPost() {
      this.snackbarMsg = "Post signalé (placeholder)";
      this.snackbarColor = "primary";
      this.snackbar = true;
    },

    deletePost() {
      let postId = this.post.id;
      let index = this.index;
      this.$store.dispatch("deletePost", { postId, index }).then(
          (error) => {
            this.loading = false;
            this.snackbarColor = "red darken-3"
            this.snackbarMsg = error.message || "Une erreur est survenue";
            this.snackbar = true;
          }
        );
    },

    likePost() {
      let postId = this.post.id;
      let postIndex = this.index;
      let currentRoute = this.$route.name;
      let ID = this.$getCookie("ID");
      this.$store.dispatch("likePost", { postId, postIndex, currentRoute, ID }).then(
          (error) => {
            this.loading = false;
            this.snackbarColor = "red darken-3"
            this.snackbarMsg = error.message || "Une erreur est survenue";
            this.snackbar = true;
          }
        );
    },

    sendComment() {
      if (!this.commentContent.trim() || this.commentContent.length < 6) {
        this.snackbarMsg = "Votre commentaire doit comporter au moins 6 caractères";
        this.snackbar = true;
      } else {
        let content = this.commentContent;
        let postId = this.post.id;
        let postIndex = this.index;
        this.$store.dispatch("sendComment", { postId, postIndex, content }).then(
          () => { this.commentContent = ""; },
          (error) => {
            this.loading = false;
            this.snackbarColor = "red darken-3"
            this.snackbarMsg = error.message || "Une erreur est survenue";
            this.snackbar = true;
          }
        );
      }
    },

    focusComment(postId) {
      document.getElementById("sendComment" + postId).focus();
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
.overlayBtn {
  background-color: rgb(0,0,0,0.2)
}
</style>