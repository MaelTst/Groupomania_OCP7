<template>
  <div class="py-4 header">
      <div class="header__content px-4">
          <div class="header__content__leftSide">
    <v-img
      alt="Logo Groupomania"
      class="flex-grow-0 d-flex me-2"
      contain
      :src="require('../assets/logo_blue_rounded.png')"
      transition="scale-transition"
      origin="center center"
      width="42"
    />
    <v-img
      alt="Logo Groupomania"
      class="flex-grow-0 d-none d-sm-flex me-2"
      contain
      :src="require('../assets/logo_blue_text.png')"
      transition="scale-transition"
      origin="center center"
      width="100"
    />
          </div>
    <div class="header__content__rightSide">
        <v-text-field hide-details
        class="rounded-lg"
        height="20"
        dense
        flat
        solo
        background-color="#f4f5f8"
            label="Rechercher"
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
    <v-avatar class="rounded-lg d-none d-sm-flex ml-6" size="42">
      <img
        :src="this.$store.state.userInfo.imgUrl ? this.$store.state.userInfo.imgUrl : require('../assets/placeholder.png')"
        alt="Photo de profil"
      />
    </v-avatar></div>
      </div>
  </div>
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
  &__content {
      height: 100%;
      align-items: center;
      justify-content: space-between;
      display: flex;
      max-width: 1400px;
      &__rightSide, &__leftSide {
          align-items: center;
          display: flex;
      }
  margin: auto;
  }
  &__Btn {
    position: absolute;
    z-index: -10;
  }
}
</style>