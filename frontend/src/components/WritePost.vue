<template>
<v-card class="boxShadowed rounded-lg mt-6">
   
  <v-text-field :append-outer-icon="message ? 'mdi-send' : 'mdi-microphone'" single-line class="pa-5 pt-10"  :label="'Quoi de neuf, '+this.$store.state.userInfo.nickname + ' ?'" type="text">
  </v-text-field>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    message: "Hey!",
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
  },
};
</script>