<template>
  <v-col cols="3" id="leftSidebar" class="leftSidebar mt-4 d-none d-lg-block">
    <v-card class="rounded-lg boxShadowed">
      <div class="leftSidebar__userCard px-6">
        <router-link :to="'/user/'+this.$store.state.userInfo.id">
        <v-avatar class="rounded-lg" size="42">
          <img
            :src="this.$store.state.userInfo.imgUrl ? this.$store.state.userInfo.imgUrl : require('../assets/placeholder.png')"
            alt="Photo de profil"
          />
        </v-avatar></router-link>
        <div class="leftSidebar__userCard__text">
          <v-card-title>{{ this.$store.state.userInfo.nickname }}</v-card-title>
          <v-card-subtitle>{{ this.$store.state.userInfo.nickname }}</v-card-subtitle>
        </div>
      </div>
    </v-card>

    <v-card class="rounded-lg boxShadowed mt-6">
      <v-navigation-drawer floating width="auto" class="rounded-lg mt-6">
        <v-list class="pa-0">
          <v-list-item color="primary" link to="/" class="pl-8">
            <v-list-item-icon>
              <v-icon>mdi-home-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Accueil</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item color="primary" link to="/about" class="pl-8">
            <v-list-item-icon>
              <v-icon>mdi-star-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Favoris</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item color="primary" link to="/user/64" class="pl-8">
            <v-list-item-icon>
              <v-icon>mdi-panorama-variant-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Photos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item color="primary" link to="/user/65" class="pl-8">
            <v-list-item-icon>
              <v-icon>mdi-account-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Profil</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item color="primary" link to="" class="pl-8">
            <v-list-item-icon>
              <v-icon>mdi-cog-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Paramètres</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item color="primary" link class="pl-8" @click="logOut()">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Deconnexion</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>
  </v-col>
</template>

<script>
export default {
  data: () => ({}),
  methods: {
    leftSidebardynamicHeight() {
      let scrollPos = document.documentElement.scrollTop - 91;
      if (scrollPos > 0) {
        document.getElementById("leftSidebar").style.height = "100vh";
      } else {
        document.getElementById("leftSidebar").style.height =
          "calc(100vh + " + scrollPos + "px)";
      }
    },
    logOut() {
      fetch(`${process.env.VUE_APP_ROOT_API}api/user/auth/logout`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          this.$router.push({ name: "Login" });
        })
        .catch((error) => {
          console.log("Erreur lors du fetch : " + error.message);
        });
    },
  },
  created() {
    window.addEventListener("scroll", this.leftSidebardynamicHeight);
  },
  destroyed() {
    window.removeEventListener("scroll", this.leftSidebardynamicHeight);
  },
};
</script>

<style lang="scss" scoped>
.leftSidebar {
  position: sticky;
  height: calc(100vh + -91px);
  top: 0px;
  &__userCard {
    display: flex;
    align-items: center;
  }
}
</style>