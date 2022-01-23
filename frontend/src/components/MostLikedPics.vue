<template>
  <div class="d-none d-sm-flex justify-space-between mb-6">
    <v-card
      :to="'/post/'+image.id"
      class="likedPicture rounded-lg boxShadowed"
      v-for="image in Pics"
      :key="image.id"
    >
      <v-img
        class="secondary lighten-2 likedPicture__bg"
        gradient="to top, rgba(0,0,0,.5), rgba(0,0,0,.0)"
        :src="image.imgUrl"
        content-class="d-flex flex-column justify-space-between"
      >
        <v-avatar class="likedPicture__avatar rounded-lg mt-4 ml-4" size="32">
          <v-img
            :src="image.user.imgUrl || require('../assets/placeholder.png')"
            alt="Photo de profil"
          />
        </v-avatar>
        <p class="text-subtitle-2 white--text text-center">{{ image.user.nickname }}</p>
      </v-img>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({}),

  computed: {
    Pics() {
      return this.$store.state.mostLikedPics;
    },
  },

  beforeCreate() {
    this.$store.dispatch("getMostLikedPics");
  },
};
</script>

<style lang="scss">
.likedPicture {
  max-width: 18%;
  min-width: 18%;
  height: 200px;
  overflow: hidden;
  display: flex;
  &__avatar {
    border: 2px solid #ffffff;
  }
}
</style>