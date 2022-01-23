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
        <v-autocomplete
          :items="items"
          color="blue-grey lighten-2"
          placeholder="Chercher un utilisateur"
          hide-details
          hide-selected
          :search-input.sync="search"
          @click="items = []"
          :menu-props="{ closeOnContentClick: true, transition: 'slide-y-transition', rounded: true}"
          class="rounded-lg mr-6"
          dense
          flat
          solo
          append-icon
          hide-no-data
          no-data-text="Aucun résultat"
          background-color="bg-light-grey"
          label="Chercher un utilisateur"
          item-text="nickname"
          prepend-inner-icon="search"
        >
          <template v-slot:item="data">
            <v-list-item active-class="primary--text" :to="'/user/'+data.item.id">
              <v-list-item-avatar class="rounded-lg">
                <v-img :src="data.item.imgUrl || require('../assets/placeholder.png')"></v-img>
              </v-list-item-avatar>
              <v-list-item-content
                class="blue-grey--text text--darken-3 text-subtitle-2"
              >{{ data.item.nickname }}</v-list-item-content>
            </v-list-item>
          </template>
          <template v-slot:selection></template>
        </v-autocomplete>
        <router-link aria-label="Profil utilisateur" :to="'/user/'+user.id">
          <v-avatar class="rounded-lg d-none d-md-flex" size="42">
            <v-img
              :src="user.imgUrl || require('../assets/placeholder.png')"
              alt="Photo de profil"
            />
          </v-avatar>
        </router-link>
        <v-app-bar-nav-icon
          aria-label="Navigation"
          class="d-flex d-md-none"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <v-navigation-drawer v-model="drawer" fixed temporary>
          <v-list nav>
            <v-list-item-group>
              <v-list-item color="primary" to="/" class="pl-8 pa-1">
                <v-list-item-icon>
                  <v-icon>home</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="blue-grey--text text--darken-3 text-subtitle-2">Accueil</v-list-item-content>
              </v-list-item>
              <v-list-item color="primary" to="/favorites" class="pl-8 pa-1">
                <v-list-item-icon>
                  <v-icon>star</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="blue-grey--text text--darken-3 text-subtitle-2">Favoris</v-list-item-content>
              </v-list-item>
              <v-list-item color="primary" to="/pictures" class="pl-8 pa-1">
                <v-list-item-icon>
                  <v-icon>panorama</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="blue-grey--text text--darken-3 text-subtitle-2">Photos</v-list-item-content>
              </v-list-item>
              <v-list-item color="primary" :to="'/user/'+user.id" class="pl-8 pa-1">
                <v-list-item-icon>
                  <v-icon>person</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="blue-grey--text text--darken-3 text-subtitle-2">Profil</v-list-item-content>
              </v-list-item>
              <v-list-item color="primary" to="/settings" class="pl-8 pa-1">
                <v-list-item-icon>
                  <v-icon>settings</v-icon>
                </v-list-item-icon>
                <v-list-item-content
                  class="blue-grey--text text--darken-3 text-subtitle-2"
                >Paramètres</v-list-item-content>
              </v-list-item>
              <v-list-item color="primary" class="pl-8 pa-1" @click="logOut()">
                <v-list-item-icon>
                  <v-icon>logout</v-icon>
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
    search: null,
    items: [],
  }),

  methods: {
    logOut() {
      this.drawer = false;
      this.$store.dispatch("logOut");
    },

    searchBarFilter(val) {
      this.items = this.users
        .filter(function (item) {
          return item.nickname.toLowerCase().includes(val.toLowerCase());
        })
        .slice(0, 5);
    },
  },

  computed: {
    user() {
      return this.$store.state.userInfo;
    },
    users() {
      return this.$store.state.users;
    },
  },

  watch: {
    search(val) {
      this.searchBarFilter(val);
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
    &__rightSide {
      min-width: 30%;
    }
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