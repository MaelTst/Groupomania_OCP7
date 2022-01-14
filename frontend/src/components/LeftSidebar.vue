<template>
  <v-col cols="3" class="mt-4 d-none d-md-block leftSidebar" id="leftSidebar">
    <v-card class="rounded-lg boxShadowed">
      <div class="leftSidebar__userCard px-6">
        <router-link :to="'/user/'+user.id">
          <v-avatar v-if="user.id ? true : false" class="rounded-lg" size="42">
            <img :src="user.imgUrl || require('../assets/placeholder.png')" alt="Photo de profil" />
          </v-avatar>
        </router-link>
        <div class="leftSidebar__userCard__text">
          <v-card-title>{{ user.nickname }}</v-card-title>
          <v-card-subtitle>{{ user.job || "Poste inconnu" }}</v-card-subtitle>
        </div>
      </div>
    </v-card>
    <div class="blue-grey--text px-3 pb-3 mt-4">
      <h1 class="overline">Navigation</h1>
    </div>
    <v-card class="rounded-lg boxShadowed">
      <v-list nav dense>
        <v-list-item-group active-class="primary--text">
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
            <v-list-item-content class="blue-grey--text text--darken-3 text-subtitle-2">Paramètres</v-list-item-content>
          </v-list-item>
          <v-list-item color="primary" class="pl-8 pa-1" @click="logOut()">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="blue-grey--text text--darken-3 text-subtitle-2">Deconnexion</v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
    <!-- <div class="eventsContainer__heading blue-grey--text px-3 pb-3 mt-4">
      <h1 class="overline">Evenements</h1>
    </div>
    <v-card class="eventsContainer d-flex flex-column rounded-lg boxShadowed pa-4">
      <v-img
        class="secondary lighten-2 rounded-lg"
        gradient="to top, rgba(0,0,0,.5), rgba(0,0,0,.0)"
        src="https://media.istockphoto.com/photos/epiphany-cake-picture-id627627198?k=20&m=627627198&s=612x612&w=0&h=auOmaRNoc9Zvn1-0959aL1yIi6hlo0JUCAZwTwFw9co="
        content-class="d-flex flex-column justify-space-between"
      >
        <v-avatar class="likedPicture__avatar rounded-lg mt-4 ml-4" size="32">
          <img :src="user.imgUrl || require('../assets/placeholder.png')" alt="Photo de profil" />
        </v-avatar>
        <p class="text-button ml-4 white--text">
          Galette des rois
          <br />12 Février 2022
        </p>
      </v-img>
      <v-btn depressed color="primary" class="mt-4 align-self-center">Participer</v-btn>
    </v-card>-->
  </v-col>
</template>

<script>
export default {
  data: () => ({}),

  computed: {
    user() {
      return this.$store.state.userInfo;
    },
  },

  methods: {
    leftSidebardynamicHeight() {
      let scrollPos = document.documentElement.scrollTop - 91;
      if (scrollPos > 0) {
        document.getElementById("leftSidebar").style.height = "100vh";
      } else {
        document.getElementById("leftSidebar").style.height =
          "calc(100vh + " + scrollPos + "px)";
      }
    },

    logOut() {
      this.$store.dispatch("logOut");
    },
  },

  created() {
    window.addEventListener("scroll", this.leftSidebardynamicHeight);
  },

  destroyed() {
    window.removeEventListener("scroll", this.leftSidebardynamicHeight);
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
.eventsContainer {
  height: calc(100% - 530px);
  max-height: 400px;
}

@media screen and (max-height: 930px) {
  .eventsContainer {
    display: none !important;
    &__heading {
      display: none !important;
    }
  }
}
</style>