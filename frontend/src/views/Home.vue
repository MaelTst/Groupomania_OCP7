<template>
  <v-col lg="6" md="9" cols="12" class="mt-4">
    <MostLikedPics />
    <WritePost />
    <Post v-for="(post, index) in homePost" :key="post.id"  :post="post" :index="index" />
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
    homePost() {
      return this.$store.state.posts
    }
  },
  
  beforeCreate() {
    this.$store.dispatch("getPosts");
  }
};
</script>
