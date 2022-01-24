<template>
  <v-form>
    <v-card class="boxShadowed rounded-lg d-flex flex-column flex-sm-row pa-4 mb-3">
      <div class="d-flex flex-grow-1">
        <router-link aria-label="Profil utilisateur" :to="'/user/'+userInfo.id">
          <v-avatar class="rounded-lg" size="42">
            <v-img
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
          prepend-icon="attach_file"
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
          small
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
        <v-btn text v-bind="attrs" @click="snackbar = false">Fermer</v-btn>
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
        this.$store.dispatch("sendPost", formData).then(
          () => {
            this.postContent = "";
            if (this.postFile) {
            this.$store.dispatch("getMostLikedPics")
            this.postFile = null;
            }
            this.loading = false;
            if (this.$route.name != "Home") {
              this.$router.push({ name: "Home" });
            }
          },
          (error) => {
            this.loading = false;
            this.snackbarMsg = error.message;
            this.snackbar = true;
          }
        );
      }
    },
  },
};
</script>