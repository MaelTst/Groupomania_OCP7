<template>
  <div>
    <div class="usersPosts mt-6" v-for="(post, index) in $store.state.posts" :key="post.id">
      <v-card class="rounded-lg boxShadowed pa-6 pt-2">
        <div class="usersPosts__heading">
          <v-avatar class="rounded-lg" size="42">
            <img
              :src="post.user.imgUrl ? post.user.imgUrl : require('../assets/placeholder.png')"
              alt="Photo de profil"
            />
          </v-avatar>
          <div class="usersPosts__heading__text">
            <v-card-title
              class="blue-grey--text text--darken-3 text-subtitle-2"
            >{{ post.user.nickname }}</v-card-title>
            <v-card-subtitle>{{ post.createdAt }}</v-card-subtitle>
          </div>
          <v-icon color="#b9c4ce">mdi-dots-horizontal</v-icon>
          <v-btn
            v-if="post.userId === $store.state.userInfo.id || $store.state.userInfo.isAdmin === true"
            @click="deletePost(post.id, index)"
          >delete</v-btn>
        </div>
        <div class="usersPosts__content mt-2">
          {{post.content}}
          <v-img
            class="usersPosts__img rounded-lg mt-6"
            v-if="post.imgUrl"
            :src="post.imgUrl"
            max-height="400"
            @click="toggleFullscreen(1, post.imgUrl)"
          ></v-img>
        </div>

        <div class="usersPosts__subContent mt-6">
          <div class="usersPosts__subContent__heading pa-3">{{ post.comments.length }} {{ post.comments.length > 1 ? "commentaires" : "commentaire" }}</div>
          <div v-for="comment in post.comments" :key="comment.id">
            <div class="usersPosts__subContent__comment d-flex">
              <v-avatar class="rounded-lg" size="32">
                <img
                  :src="comment.user.imgUrl ? comment.user.imgUrl : require('../assets/placeholder.png')"
                  alt="Photo de profil"
                />
              </v-avatar>
              <div>{{ comment.content }}</div>
            </div>
          </div>

            <div class="usersPosts__subContent__textfield d-flex align-center mt-6">
                <v-avatar class="rounded-lg d-none d-sm-flex mr-3" size="32">
      <img
        :src="$store.state.userInfo.imgUrl ? $store.state.userInfo.imgUrl : require('../assets/placeholder.png')"
        alt="Photo de profil"
      />
    </v-avatar>
    <v-text-field hide-details
    append-outer-icon="mdi-send"
        class="rounded-lg"
        height="20"
        dense
        flat
        solo
        @click:append-outer="deletePost"
        background-color="#f4f5f8"
            label="Poster un commentaire..."
          ></v-text-field>
            </div>
        </div>
      </v-card>
    </div>

    <v-overlay :z-index="999" opacity="0.90" :value="fullScreenImg" @click="toggleFullscreen()">
      <v-img max-height="90vh" max-width="90vw" contain :src="fullScreenImgUrl"></v-img>
    </v-overlay>
  </div>
</template>

<script>
export default {
  data: () => ({
    fullScreenImg: false,
    fullScreenImgUrl: null,
  }),
  components: {},
  methods: {
    deletePost(postId, index) {
      this.$store.dispatch("deletePost", { postId, index });
    },
    toggleFullscreen(on, imgUrl) {
      if (on === 1 && imgUrl) {
        (this.fullScreenImg = true), (this.fullScreenImgUrl = imgUrl);
      } else {
        (this.fullScreenImg = false), (this.fullScreenImgUrl = null);
      }
    },
  },

  beforeMount() {
    this.$store.dispatch("getPosts");
  },
};
</script>

<style lang="scss" scoped>
.usersPosts {
  &__heading {
    display: flex;
    align-items: center;
    &__text {
      flex-grow: 1;
    }
  }
  &__subContent {
    &__heading {
      border-top: 1px solid #f2f3f7;
      border-bottom: 1px solid #f2f3f7;
    }
  }
}
</style>