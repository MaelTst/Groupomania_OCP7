<template>
  <v-col cols="3" class="mt-4 d-none d-lg-block" id="rightSidebar">
    <div class="usersList">
      <div class="usersList__heading blue-grey--text px-3 pb-3">
        <h1 class="overline">Contacts</h1>
        <span
          class="rounded-pill white--text blue-grey lighten-3 px-3 py-1 text-subtitle-2"
        >{{ users.length }}</span>
      </div>
      <v-card class="usersList__list rounded-lg boxShadowed">
        <simplebar class="simplebarContainer" data-simplebar-auto-hide="true">
          <v-list nav dense>
            <v-list-item-group active-class="primary--text">
              <v-list-item :to="'/user/'+user.id" class="px-2" v-for="user in users" :key="user.id">
                <v-list-item-avatar class="rounded-lg" size="42">
                  <img
                    :src="user.imgUrl || require('../assets/placeholder.png')"
                    alt="Photo de profil"
                  />
                </v-list-item-avatar>
                <v-list-item-content
                  class="blue-grey--text text--darken-3 text-subtitle-2"
                >{{ user.nickname }}</v-list-item-content>
                <v-list-item-icon class="align-self-center pr-3">
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </simplebar>
      </v-card>
    </div>
  </v-col>
</template>

<script>
import simplebar from "simplebar-vue";
import "simplebar/dist/simplebar.min.css";
export default {
  components: {
    simplebar,
  },
  data: () => ({}),

  computed: {
    users() {
      return this.$store.state.users;
    },
  },

  methods: {
    UsersListdynamicHeight() {
      let scrollPos = document.documentElement.scrollTop - 91;
      if (scrollPos > 0) {
        document.getElementById("rightSidebar").style.height = "100vh";
      } else {
        document.getElementById("rightSidebar").style.height =
          "calc(100vh + " + scrollPos + "px)";
      }
    },
  },

  created() {
    window.addEventListener("scroll", this.UsersListdynamicHeight);
  },

  destroyed() {
    window.removeEventListener("scroll", this.UsersListdynamicHeight);
  },

  beforeCreate() {
    this.$store.dispatch("getUsers");
  },
};
</script>

<style lang="scss" scoped>
.usersList {
  height: 100%;
  &__heading {
    display: flex;
    justify-content: space-between;
  }
  &__list {
    height: calc(100% - 43px);
    overflow: hidden;
  }
}
#rightSidebar {
  overflow: hidden;
  position: sticky;
  top: 0px;
  height: calc(100vh - 91px);
}
.simplebarContainer {
  height: 100%;
}
</style>