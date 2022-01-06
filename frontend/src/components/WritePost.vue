<template>
<v-card class="boxShadowed rounded-lg mt-6">
  <v-text-field v-model="postContent" @click:append-outer="sendPost" @keydown.enter="sendPost" hide-details append-icon="mdi-camera" :append-outer-icon="postContent ? 'mdi-send' : ''" single-line class="pa-6"  :label="'Quoi de neuf, '+this.$store.state.userInfo.nickname + ' ?'" type="text">
  </v-text-field>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    postContent: "",
    loading: false,
  }),
  methods: {
    clickMe() {
      this.loading = true;
      this.message = "Wait for it...";
      setTimeout(() => {
        this.loading = false;
        this.message = `You've clicked me!`;
      }, 2000);
    },

    sendPost() {
      if (this.postContent) {
          this.$store.dispatch('sendPost', this.postContent)
          this.postContent = ""
      }
    },



  },
};
</script>