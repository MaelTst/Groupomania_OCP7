<template>
  <v-col lg="6" md="9" cols="12" class="mt-4">
    <MostLikedPics />
    <WritePost />
    <Post v-for="(post, index) in Posts" :key="post.id" :post="post" :index="index" />
  </v-col>
</template>

<script>
import MostLikedPics from "../components/MostLikedPics";
import WritePost from "../components/WritePost";
import Post from "../components/Post";

export default {
  name: "HomeView",

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
