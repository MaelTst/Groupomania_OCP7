<template>
  <v-app>
    <v-main class="mainContainer">
      <Header v-if="this.$store.state.isLoggedIn"/>
      <v-container fluid class="pa-0">
        <v-row class="content">
          <NotificationList v-if="this.$store.state.isLoggedIn"/>
          <router-view />
          <UsersList v-if="this.$store.state.isLoggedIn"/>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Header from './components/Header'
import NotificationList from './components/NotificationList'
import UsersList from './components/UsersList'

export default {
  name: "App",
  components: {
      Header,
      NotificationList,
      UsersList
    },
  data: () => ({
  }),
};
</script>

<style lang="scss">
.mainContainer {
  background-color: #fafbfc;
}
.boxShadowed {
  box-shadow: 0px 0px 20px 5px rgb(0 0 0 / 2%) !important;
}
.content {
  max-width: 1400px;
  margin: auto;
}
</style>