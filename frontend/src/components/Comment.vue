<template>
  <div class="usersPosts__subContent__comment d-flex flex-column flex-sm-row align-center py-2">
    <router-link aria-label="Profil utilisateur" :to="'/user/'+comment.user.id" class="d-none d-sm-block mr-3">
      <v-avatar class="rounded-lg" size="32">
        <v-img
          :src="comment.user.imgUrl || require('../assets/placeholder.png')"
          alt="Photo de profil"
        />
      </v-avatar>
    </router-link>
    <div v-show="!isEditing" class="rounded-lg bg-light-grey">
      <v-card-title class="blue-grey--text text--darken-3 text-subtitle-2 pt-1 px-3">
        {{ comment.user.nickname }}
        <span
          class="text-caption ml-1"
          :title="$moment(comment.createdAt).calendar()"
        >{{ $moment(comment.createdAt).subtract(30,'s').fromNow() }}</span>
      </v-card-title>
      <v-card-subtitle class="pb-1 px-3">{{ comment.content }}</v-card-subtitle>
    </div>
    <div class="flex-grow-1" v-show="isEditing">
      <v-text-field
        hide-details
        class="rounded-lg"
        append-outer-icon="check"
        append-icon="close"
        @click:append="isEditing = false"
        @click:append-outer="updateComment"
        @keydown.enter="updateComment"
        autocomplete="off"
        height="20"
        dense
        maxlength="300"
        flat
        solo
        label="Poster un commentaire..."
        v-model="editCommentContent"
        background-color="bg-light-grey"
      ></v-text-field>
    </div>
    <v-menu
      content-class="elevation-2 rounded-lg"
      transition="slide-y-transition"
      bottom
      right
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="ml-3" aria-label="Options du commentaire" icon v-bind="attrs" v-on="on">
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
          v-if="comment.userId === userInfo.id || userInfo.isAdmin === true"
          @click="isEditing = true, editCommentContent = comment.content"
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
          v-if="comment.userId === userInfo.id || userInfo.isAdmin === true"
          @click="deleteComment(comment.id, commentIndex)"
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
    <v-snackbar v-model="snackbar" :timeout="4000" :color="snackbarColor">
      {{ snackbarMsg }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Fermer</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    isEditing: false,
    editCommentContent: "",
    snackbar: false,
    snackbarMsg: "",
    snackbarColor: "red darken-3",
  }),
  props: {
    comment: {},
    commentIndex: null,
    post: null,
    postIndex: null,
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },

  methods: {
    reportPost() {
      this.snackbarMsg = "Commentaire signalé (placeholder)";
      this.snackbarColor = "primary";
      this.snackbar = true;
    },

    deleteComment(commentId, commentIndex) {
      let postId = this.post.id;
      let postIndex = this.postIndex;
      this.$store
        .dispatch("deleteComment", {
          postId,
          postIndex,
          commentId,
          commentIndex,
        })
        .then((error) => {
          this.snackbarMsg = error.message || "Une erreur est survenue";
          this.snackbarColor = "red darken-3";
          this.snackbar = true;
        });
    },

    updateComment() {
      if (
        !this.editCommentContent.trim() ||
        this.editCommentContent.length < 6
      ) {
        this.snackbarColor = "red darken-3";
        this.snackbarMsg =
          "Votre commentaire doit comporter au moins 6 caractères";
        this.snackbar = true;
      } else {
        let postId = this.post.id;
        let commentId = this.comment.id;
        let commentContent = this.editCommentContent;
        let currentRoute = this.$route.name;
        let ID = this.$getCookie("ID");
        let userId = this.post.userId;
        this.$store
          .dispatch("updateComment", {
            postId,
            commentId,
            commentContent,
            currentRoute,
            ID,
            userId,
          })
          .then(
            () => {
              this.isEditing = false;
              this.editCommentContent = "";
              this.snackbarColor = "primary";
              this.snackbarMsg = "Commentaire modifié";
              this.snackbar = true;
            },
            (error) => {
              this.snackbarMsg = error.message || "Une erreur est survenue";
              this.snackbarColor = "red darken-3";
              this.snackbar = true;
            }
          );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.usersPosts__subContent__comment {
  word-break: break-word;
}
</style>