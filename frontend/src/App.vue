<template>
  <v-app>
    <v-main>
      <Header v-if="this.$store.state.isLoggedIn"/>
      <v-container fluid class="pa-0">
        <v-row>
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
