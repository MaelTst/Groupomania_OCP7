<template>
  <v-col cols="6" class="mt-4">
      <MostLikedPics/>
    <WritePost />

    <div class="usersList mt-6" v-for="post in posts" :key="post.id">
      <v-card class="rounded-lg boxShadowed">
          <div>
        
          <v-avatar class="rounded-lg" size="42">
            <img
              :src="post.user.imgUrl ? post.user.imgUrl : require('../assets/placeholder.png')"
              alt="Photo de profil"
            />
          </v-avatar>


        <v-card-title class="blue-grey--text text--darken-3 text-subtitle-2">
          {{ post.user.nickname }}
          <v-spacer></v-spacer>
            <v-icon color="#b9c4ce">mdi-square-edit-outline</v-icon>
        </v-card-title>
        <v-card-subtitle>{{ post.createdAt }}</v-card-subtitle>
        {{post.content}}
        </div>
      </v-card>
    </div>
  </v-col>
</template>

<script>
import WritePost from "../components/WritePost";
import MostLikedPics from "../components/MostLikedPics";
export default {
  data: () => ({
    posts: [],
  }),
  components: {
    WritePost,
    MostLikedPics
  },
  methods: {},
  beforeMount() {
    fetch("http://localhost:3000/api/posts/", {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        response.json().then((response) => {
          this.posts = response;
        });
      }
    });
  },
};
</script>