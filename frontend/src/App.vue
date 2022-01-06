<template>
  <v-app>
    <v-main class="mainContainer">
      <Header v-if="this.$getCookie('isLoggedIn')"/>
      <v-container fluid class="pa-0">
        <v-row class="content">
          <LeftSidebar v-if="this.$getCookie('isLoggedIn')"/>
          <router-view />
          <UsersList v-if="this.$getCookie('isLoggedIn')"/>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Header from './components/Header'
import LeftSidebar from './components/LeftSidebar'
import UsersList from './components/UsersList'

export default {
  name: "App",
  components: {
      Header,
      LeftSidebar,
      UsersList
    },
  data: () => ({
  }),
  methods: {
  },
  beforeCreate() {
    if (this.$getCookie('isLoggedIn')) {
      fetch("http://localhost:3000/api/user/"+this.$getCookie('ID'), {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          }
        })
          .then((response) => {
            if (response.ok) {
              response.json().then((response) => { 
                this.$store.dispatch('logIn', response);
                })
            } 
          })
          .catch((error) => {
            console.log("Erreur lors du fetch : " + error.message);
          });
    }
  },
};
</script>

<style lang="scss">
.mainContainer {
  background-color: #fafbfc;
}
.boxShadowed {
  box-shadow: 0px 0px 10px 5px rgb(0 0 0 / 2%) !important
}
.content {
  max-width: 1400px;
  margin: auto;
}
.simplebar-scrollbar:before {
  background-color: #aebec4 !important;
}
.simplebar-track {
  margin-right: 8px;
  margin-top: 12px;
  margin-bottom: 12px;
}
</style>