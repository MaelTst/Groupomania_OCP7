<template>
  <v-col lg="6" md="9" cols="12" class="mt-4">
    <MostLikedPics />
    <WritePost />
    <div class="px-3 pb-3">
      <h1 class="overline">{{ this[this.$route.name] }}</h1>
    </div>
    <Post v-for="(post, index) in Posts" :key="post.id" :post="post" :index="index" />
    <v-card v-if="Posts.length === 0" class="rounded-lg boxShadowed pa-7 pb-3 text-center">
      <v-icon size="32" color="primary">error_outline</v-icon>
      <v-card-title class="d-block pt-1">Oups</v-card-title>
      <v-card-subtitle class="text-subtitle-2">il n'y a rien à voir ici pour le moment.</v-card-subtitle>
    </v-card>
    <v-card v-else class="rounded-lg boxShadowed pa-7 pb-3 text-center">
      <v-icon size="32" color="primary">task_alt</v-icon>
      <v-card-title class="d-block pt-1">Félicitation</v-card-title>
      <v-card-subtitle class="text-subtitle-2">il n'y a rien de plus à voir ici.</v-card-subtitle>
    </v-card>
  </v-col>
</template>

<script>
import MostLikedPics from "../components/MostLikedPics";
import WritePost from "../components/WritePost";
import Post from "../components/Post";

export default {
  name: "HomeView",

  data: () => ({
    Home: "Publications récentes",
    Favorites: "Publications favorites",
    Pictures: "Médias",
    Post: "Publication d'un utilisateur",
  }),

  components: {
    MostLikedPics,
    WritePost,
    Post,
  },

  computed: {
    Posts() {
      return this.$store.state.posts;
    },
  },

  watch: {
    "$route.name": function () {
      let currentRoute = this.$route.name;
      let ID = this.$getCookie("ID");
      let postId = this.$route.params.id;
      this.$store.dispatch("refreshPosts", { currentRoute, ID, postId });
    },

    "$route.params.id": function () {
      let currentRoute = this.$route.name;
      let ID = this.$getCookie("ID");
      let postId = this.$route.params.id;
      this.$store.dispatch("refreshPosts", { currentRoute, ID, postId });
    },
  },

  beforeCreate() {
    let currentRoute = this.$route.name;
    let ID = this.$getCookie("ID");
    let postId = this.$route.params.id;
    this.$store.dispatch("refreshPosts", { currentRoute, ID, postId });
  },
};
</script>
