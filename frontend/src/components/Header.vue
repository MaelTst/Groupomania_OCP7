<template>
  <v-app-bar color="#fff" elevation="3">
    <v-img
      alt="Logo Groupomania"
      class="flex-grow-0 d-none d-sm-flex me-2"
      contain
      :src="require('../assets/logo-blue-faded.png')"
      transition="scale-transition"
      origin="center center"
      width="36"
    />
    <v-responsive max-width="260">
      <v-text-field
        flat
        hide-details
        rounded
        background-color="#f0f2f5"
        placeholder="Rechercher"
        prepend-inner-icon="mdi-magnify"
        solo
      ></v-text-field>
    </v-responsive>
    <v-tabs class="px-5 headerBtn" centered absolute light mobile-breakpoint="500" icons-and-text>
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
    <v-avatar color="primary" size="42"></v-avatar>
  </v-app-bar>
</template>

<script>
export default {
  data: () => ({}),
};
</script>

<style lang="scss" scoped>
.headerBtn {
  position: absolute;
  z-index: -10;
}
</style>