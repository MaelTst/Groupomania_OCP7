<template>
  <div class="py-4 header">
    <div class="header__content px-4">
      <router-link to="/" aria-label="Retour à l'accueil">
        <div class="header__content__leftSide">
          <v-img
            alt="Logo Groupomania"
            class="d-flex me-2"
            contain
            :src="require('../assets/logo_blue_rounded.png')"
            transition="scale-transition"
            origin="center center"
            width="42"
          />
          <v-img
            alt="Groupomania"
            class="d-none d-sm-flex me-2"
            contain
            :src="require('../assets/logo_blue_text.png')"
            transition="scale-transition"
            origin="center center"
            width="100"
          />
        </div>
      </router-link>
      <div v-if="user.id ? true : false" class="header__content__rightSide">
        <v-text-field
          hide-details
          class="rounded-lg mr-6"
          height="20"
          dense
          flat
          solo
          background-color="bg-light-grey"
          label="Rechercher"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
        <router-link :to="'/user/'+user.id">
          <v-avatar class="rounded-lg d-none d-lg-flex" size="42">
            <img :src="user.imgUrl || require('../assets/placeholder.png')" alt="Photo de profil" />
          </v-avatar>
        </router-link>
        <v-app-bar-nav-icon class="d-flex d-lg-none" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-navigation-drawer v-model="drawer" fixed temporary>
          <v-list nav>
            <v-list-item-group>
              <v-list-item color="primary" to="/" class="pl-8 pa-1">
                <v-list-item-icon>
                  <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="blue-grey--text text--darken-3 text-subtitle-2">Accueil</v-list-item-content>
              </v-list-item>
              <v-list-item color="primary" to="/favorites" class="pl-8 pa-1">
                <v-list-item-icon>
                  <v-icon>mdi-star</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="blue-grey--text text--darken-3 text-subtitle-2">Favoris</v-list-item-content>
              </v-list-item>
              <v-list-item color="primary" to="/pictures" class="pl-8 pa-1">
                <v-list-item-icon>
                  <v-icon>mdi-panorama-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="blue-grey--text text--darken-3 text-subtitle-2">Photos</v-list-item-content>
              </v-list-item>
              <v-list-item color="primary" :to="'/user/'+user.id" class="pl-8 pa-1">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="blue-grey--text text--darken-3 text-subtitle-2">Profil</v-list-item-content>
              </v-list-item>
              <v-list-item color="primary" to="/settings" class="pl-8 pa-1">
                <v-list-item-icon>
                  <v-icon>mdi-cog</v-icon>
                </v-list-item-icon>
                <v-list-item-content
                  class="blue-grey--text text--darken-3 text-subtitle-2"
                >Paramètres</v-list-item-content>
              </v-list-item>
              <v-list-item color="primary" class="pl-8 pa-1" @click="logOut()">
                <v-list-item-icon>
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-content
                  class="blue-grey--text text--darken-3 text-subtitle-2"
                >Deconnexion</v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
  }),

  methods: {
    logOut() {
      this.drawer = false;
      this.$store.dispatch("logOut");
    },
  },

  computed: {
    user() {
      return this.$store.state.userInfo;
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #f2f3f7 !important;
  width: 100%;
  z-index: 999;
  &__content {
    height: 100%;
    align-items: center;
    justify-content: space-between;
    display: flex;
    max-width: 1400px;
    &__rightSide,
    &__leftSide {
      align-items: center;
      display: flex;
    }
    margin: auto;
  }
}
@media screen and (max-width: 959px) {
  .header {
    position: fixed;
    box-shadow: 0px 0px 10px 5px rgb(0 0 0 / 15%) !important;
  }
}
</style>