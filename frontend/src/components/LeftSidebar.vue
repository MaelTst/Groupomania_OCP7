<template>
  <v-col cols="3" class="mt-4 d-none d-md-block leftSidebar" id="leftSidebar">
    <v-card class="rounded-lg boxShadowed">
      <div class="leftSidebar__userCard px-6">
        <router-link aria-label="Profil utilisateur" :to="'/user/'+user.id">
          <v-avatar class="rounded-lg" size="42">
            <v-img
              :src="user.imgUrl || require('../assets/placeholder.png')"
              alt="Photo de profil"
            />
          </v-avatar>
        </router-link>
        <div class="leftSidebar__userCard__text">
          <v-card-title>{{ user.nickname }}</v-card-title>
          <v-card-subtitle>{{ user.job || "Poste inconnu" }}</v-card-subtitle>
        </div>
      </div>
    </v-card>
    <div class="blue-grey--text text--darken-3 px-3 pb-3 mt-4">
      <h1 class="overline">Navigation</h1>
    </div>
    <v-card class="rounded-lg boxShadowed">
      <v-list nav dense>
        <v-list-item-group active-class="primary--text">
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
            <v-list-item-content class="blue-grey--text text--darken-3 text-subtitle-2">Paramètres</v-list-item-content>
          </v-list-item>
          <v-list-item color="primary" class="pl-8 pa-1" @click="logOut">
            <v-list-item-icon>
              <v-icon>logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="blue-grey--text text--darken-3 text-subtitle-2">Deconnexion</v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-col>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.userInfo;
    },
  },

  methods: {
    logOut() {
      this.$store.dispatch("logOut");
    },
  },
};
</script>

<style lang="scss" scoped>
.leftSidebar {
  position: sticky;
  height: calc(100vh - 91px);
  top: 0px;
  &__userCard {
    display: flex;
    align-items: center;
    &__text {
      overflow: hidden;
      & .v-card__title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }
    }
  }
}
</style>