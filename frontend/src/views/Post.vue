<template>
  <v-col lg="6" md="9" cols="12" class="mt-4">
    <MostLikedPics />
    <WritePost />
    <Post v-for="(post, index) in uniquePost" :key="post.id" :post="post" :index="index" />
  </v-col>
</template>

<script>
import MostLikedPics from "../components/MostLikedPics";
import WritePost from "../components/WritePost";
import Post from "../components/Post";

export default {
  name: "PostView",

  components: {
    MostLikedPics,
    WritePost,
    Post,
  },

  computed: {
    uniquePost() {
      return this.$store.state.posts;
    },
  },

  watch: {
    "$route.params.id": function () {
      this.$store.dispatch("getUniquePost", this.$route.params.id);
    },
  },

  beforeCreate() {
    this.$store.dispatch("getUniquePost", this.$route.params.id);
  },
};
</script>
