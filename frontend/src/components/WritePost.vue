<template>
  <v-form>
    <v-card class="boxShadowed rounded-lg d-flex flex-column flex-sm-row pa-4 mb-6">
      <div class="d-flex flex-grow-1">
        <router-link :to="'/user/'+userInfo.id">
          <v-avatar
            v-if="userInfo.id ? true : false"
            class="rounded-lg"
            size="42"
          >
            <img
              :src="userInfo.imgUrl || require('../assets/placeholder.png')"
              alt="Photo de profil"
            />
          </v-avatar>
        </router-link>
        <v-textarea
          maxlength="300"
          v-model="postContent"
          hide-details
          class="rounded-lg ml-3"
          rows="1"
          row-height="36"
          auto-grow
          dense
          flat
          solo
          background-color="bg-light-grey"
          :label="'Quoi de neuf, '+userInfo.nickname + ' ?'"
        ></v-textarea>
      </div>
      <div class="justify-end d-flex ml-3 mt-4 mt-sm-0">
        <v-file-input
          aria-label="Joindre un fichier"
          v-model="postFile"
          accept="image/*"
          icon="mdi-paperclip"
          hide-details
          truncate-length="10"
          :clearable="false"
          small-chips
          dense
          flat
          class="flex-grow-0 align-self-end mb-1"
        ></v-file-input>
        <v-btn
          depressed
          :loading="loading"
          :disabled="loading"
          height="42"
          color="primary"
          class="ml-3 rounded-lg align-self-end"
          @click="sendPost"
        >Poster</v-btn>
      </div>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="4000" color="red darken-3">
      {{ snackbarMsg }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">Fermer</v-btn>
      </template>
    </v-snackbar>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    postContent: "",
    postFile: null,
    loading: false,
    snackbar: false,
    snackbarMsg: "",
  }),

  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },

  methods: {
    sendPost() {
      if (!this.postContent.trim() || this.postContent.length < 6) {
        this.snackbarMsg = "Votre message doit comporter au moins 6 caractères";
        this.snackbar = true;
      } else {
        this.loading = true;
        var formData = new FormData();
        formData.append("content", this.postContent);
        if (this.postFile) {
          formData.append("image", this.postFile);
        }
        fetch(`${process.env.VUE_APP_ROOT_API}api/posts/`, {
          method: "POST",
          credentials: "include",
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              response.json().then((response) => {
                console.log(response);
                this.$store.dispatch("getPosts");
                this.postContent = "";
                this.postFile = null;
                this.loading = false;
                if (this.$route.name != "Home") {
                  this.$router.push({ name: "Home" });
                }
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
    },
  },
};
</script>