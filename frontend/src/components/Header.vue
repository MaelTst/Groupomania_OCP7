<template>
  <v-app-bar class="px-5 header" flat>
    <v-img
      alt="Logo Groupomania"
      class="flex-grow-0 d-none d-sm-flex me-2"
      contain
      :src="require('../assets/logo_blue_rounded.png')"
      transition="scale-transition"
      origin="center center"
      width="42"
    />
    <v-tabs class="px-5 header__Btn" centered absolute light mobile-breakpoint="500" icons-and-text>
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-1">
        Recents
        <v-icon>mdi-account-edit-outline</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        Favorites
        <v-icon>mdi-heart</v-icon>
      </v-tab>

      <v-tab href="#tab-3">
        Nearby
        <v-icon>mdi-account-box</v-icon>
      </v-tab>
    </v-tabs>
    <v-spacer></v-spacer>
    <v-avatar class="rounded-lg" size="42">
      <img
        :src="this.$store.state.userInfo.imgUrl ? this.$store.state.userInfo.imgUrl : require('../assets/placeholder.png')"
        alt="Photo de profil"
      />
    </v-avatar>
  </v-app-bar>
</template>

<script>
export default {
  data: () => ({}),
};
</script>

<style lang="scss" scoped>
.header {
  background-color: #ffffff !important;
  border-bottom: 1px solid #f2f3f7 !important;
  &__Btn {
    position: absolute;
    z-index: -10;
  }
}
</style>