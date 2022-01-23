<template>
  <v-col lg="6" md="9" cols="12" class="mt-4">
    <UserProfile :userProfile="userProfile" />
    <div class="blue-grey--text text--darken-3 px-3 pb-3">
      <h1 class="overline">Publications de {{ userProfile.nickname }}</h1>
    </div>
    <Post v-for="(post, index) in Posts" :key="post.id" :post="post" :index="index" />
    <v-card v-if="Posts.length === 0" class="rounded-lg boxShadowed pa-7 pb-3 text-center">
      <v-icon size="32" color="primary">error_outline</v-icon>
      <v-card-title class="d-block pt-1">Oups</v-card-title>
      <v-card-subtitle class="text-subtitle-2">{{ userProfile.nickname }} n'a encore rien publié</v-card-subtitle>
    </v-card>
    <v-card v-else class="rounded-lg boxShadowed pa-7 pb-3 text-center">
      <v-icon size="32" color="primary">task_alt</v-icon>
      <v-card-title class="d-block pt-1">Félicitation</v-card-title>
      <v-card-subtitle class="text-subtitle-2">il n'y a rien de plus à voir ici.</v-card-subtitle>
    </v-card>
  </v-col>
</template>

<script>
import UserProfile from "../components/UserProfile";
import Post from "../components/Post";

export default {
  name: "UserView",

  components: {
    UserProfile,
    Post,
  },

  computed: {
    Posts() {
      return this.$store.state.posts;
    },
    userProfile() {
      return this.$store.state.userProfile;
    },
  },

  watch: {
    "$route.params.id": function () {
      let currentRoute = this.$route.name;
      let ID = this.$getCookie("ID");
      let userId = this.$route.params.id;
      this.$store.dispatch("refreshPosts", { currentRoute, ID, userId });
      this.$store.dispatch("getUser", userId);
    },
  },

  beforeCreate() {
    let currentRoute = this.$route.name;
    let ID = this.$getCookie("ID");
    let userId = this.$route.params.id;
    this.$store.dispatch("refreshPosts", { currentRoute, ID, userId });
    this.$store.dispatch("getUser", userId);
  },
};
</script>
