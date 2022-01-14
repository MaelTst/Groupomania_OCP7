<template>
  <div class="picContainer">
    <v-img
      class="picContainer__picture rounded-lg boxShadowed secondary lighten-2"
      gradient="to top, rgba(0,0,0,.5), rgba(0,0,0,.0)"
      v-for="image in this.$store.state.mostLikedPics"
      :key="image.id"
      :src="image.imgUrl"
      content-class="picContainer__picture__bg"
    ><router-link :to="'/post/'+image.id">
      <v-avatar class="picContainer__avatar rounded-lg mt-4 ml-4" size="32">
        <img
          :src="image.user.imgUrl ? image.user.imgUrl : require('../assets/placeholder.png')"
          alt="Photo de profil"
        />
      </v-avatar>
      <p
        class="picContainer__author text-subtitle-2 white--text text-center"
      >{{ image.user.nickname }}</p>
      </router-link>
    </v-img>
  </div>
</template>

<script>
export default {
  data: () => ({
    images: [],
  }),
  methods: {},
  beforeMount() {
    this.$store.dispatch("getMostLikedPics");
  },
};
</script>

<style lang="scss" scoped>
.picContainer {
  display: flex;
  justify-content: space-between;
  &__picture {
    max-width: 18%;
    height: 200px;
    overflow: hidden;
  }
  &__avatar {
    border: 2px solid #ffffff;
  }
  &__author {
    margin-top: 120px;
  }
}
</style>