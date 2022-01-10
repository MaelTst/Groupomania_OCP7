<template>
  <v-form ref="formPost" v-model="validPostForm" lazy-validation>
    <v-card class="boxShadowed rounded-lg mt-6 d-flex flex-column flex-sm-row pa-4">
      <div class="d-flex flex-grow-1">
        <router-link :to="'/user/'+this.$store.state.userInfo.id">
          <v-avatar
            v-if="this.$store.state.userInfo.id ? true : false"
            class="rounded-lg mr-3"
            size="42"
          >
            <img
              :src="$store.state.userInfo.imgUrl ? $store.state.userInfo.imgUrl : require('../assets/placeholder.png')"
              alt="Photo de profil"
            />
          </v-avatar>
        </router-link>

        <v-textarea
          v-model="postContent"
          hide-details
          class="rounded-lg"
          rows="1"
          row-height="36"
          auto-grow
          :rules="postRules"
          dense
          flat
          solo
          background-color="#f4f5f8"
          :label="'Quoi de neuf, '+this.$store.state.userInfo.nickname + ' ?'"
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
          height="42"
          color="primary"
          class="ml-3 rounded-lg align-self-end"
          @click="sendPost"
        >Poster</v-btn>
      </div>
    </v-card>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    postContent: "",
    postFile: null,
    validPostForm: true,
    postRules: [
      (v) => !!v || "Veuillez renseigner votre nom d'affichage",
      (v) =>
        (v && v.length <= 30) ||
        "Le nom d'affichage doit contenir moins de 30 caractères",
    ],
  }),
  methods: {
    async sendPost() {
      this.$refs.formPost.validate();
      if (this.postContent) {
        let content = this.postContent;
        let file = this.postFile;
        this.$store.dispatch("sendPost", { content, file });
        this.postContent = "";
        this.postFile = null;
        this.$router.push({ name: "Home" });
      }
    },
  },
};
</script>