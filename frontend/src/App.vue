<!-- Racine de l'application -->
<template>
  <v-app>
    <v-main class="grey lighten-5">
      <Header />
      <v-container fluid class="mainContainer pa-0">
        <v-row class="content ma-auto">
          <LeftSidebar v-if="isLoggedIn()" />
          <router-view />
          <UsersList v-if="isLoggedIn()" />
        </v-row>
      </v-container>
      <Footer v-if="!isLoggedIn()" />
    </v-main>
  </v-app>
</template>

<script>
import Header from "./components/Header";
import LeftSidebar from "./components/LeftSidebar";
import UsersList from "./components/UsersList";
import Footer from "./components/Footer";

export default {
  name: "App",

  components: {
    Header,
    LeftSidebar,
    UsersList,
    Footer,
  },

  methods: {
    // Retourne la valeur du cookie "isLoggedIn"
    isLoggedIn() {
      return this.$getCookie("isLoggedIn");
    },
  },

  beforeCreate() {
    // Actualise les informations de l'utilisateur ayant pour ID la valeur du cookie "ID"
    if (this.$getCookie("isLoggedIn")) {
      this.$store.dispatch("refreshUserInfo", this.$getCookie("ID"));
    }
  },
};
</script>

<style lang="scss">
.boxShadowed {
  box-shadow: 0px 0px 10px 5px rgb(0 0 0 / 2%) !important;
}
.bg-light-grey {
  background-color: #f4f5f8 !important;
}
.w100 {
  width: 100%;
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.content {
  max-width: 1400px;
}
.simplebar-scrollbar:before {
  background-color: #aebec4 !important;
}
.simplebar-track {
  margin-right: 8px;
  margin-top: 12px;
  margin-bottom: 12px;
}
@media screen and (max-width: 959px) {
  .mainContainer {
    margin-top: 75px;
  }
}
</style>