<template>
  <v-col lg="6" md="9" cols="12" class="mt-4">
    <UserProfile :userProfile="userProfile" />
    <div class="blue-grey--text px-3 pb-3">
      <h1 class="overline">Publications de {{ userProfile.nickname }}</h1>
    </div>
    <Post v-for="(post, index) in Posts" :key="post.id" :post="post" :index="index" />
    <v-card class="rounded-lg boxShadowed pa-7 pb-3 text-center">
      <div v-if="Posts.length === 0">
        <v-icon size="32" color="primary">mdi-alert-circle-outline</v-icon>
        <v-card-subtitle class="text-subtitle-2">{{ userProfile.nickname }} n'a encore rien publié</v-card-subtitle>
      </div>
      <div v-else>
        <v-icon size="32" color="primary">mdi-check-circle-outline</v-icon>
        <v-card-subtitle class="text-subtitle-2">Félicitation, il n'y a rien de plus à voir ici.</v-card-subtitle>
      </div>
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
    }
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
  }
};
</script>
