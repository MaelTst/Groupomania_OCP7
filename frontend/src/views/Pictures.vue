<template>
  <v-col lg="6" md="9" cols="12" class="mt-4">
    <MostLikedPics />
    <WritePost />
    <Post v-for="(post, index) in picsPost" :key="post.id"  :post="post" :index="index" />
  </v-col>
</template>

<script>
import MostLikedPics from "../components/MostLikedPics";
import WritePost from "../components/WritePost";
import Post from "../components/Post";

export default {
  name: "PicturesView",

  components: {
    MostLikedPics,
    WritePost,
    Post,
  },

  computed: {
    picsPost() {
      return this.$store.state.posts
    }
  },

  beforeMount() {
    this.$store.dispatch("getPicsPosts");
  }
};
</script>
