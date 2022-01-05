<template>
  <v-col cols="3" class="mt-4" id="rightSidebar">
    <div class="usersList">
      <div class="usersList__heading blue-grey--text px-3 pb-3">
        <h1 class="overline">Contacts</h1>
        <span class="rounded-pill white--text blue-grey lighten-3 px-3 py-1 text-subtitle-2">{{ users.length }}</span>
      </div>

      <v-card class="usersList__list rounded-lg boxShadowed py-3">
        <v-list class="pa-0">
          <v-list-item-group active-class="primary--text">
            <v-list-item class="px-6" v-for="user in users" :key="user.id">
                
              <v-list-item-avatar class="rounded-lg" size="42">
                <img
                  :src="user.imgUrl ? user.imgUrl : require('../assets/placeholder.png')"
                  alt="Photo de profil"
                />
              </v-list-item-avatar>
              <v-list-item-content class="blue-grey--text text--darken-3 text-subtitle-2">{{ user.nickname }}</v-list-item-content>
              <v-list-item-icon>
                <v-icon :color="user.isLoggedIn ? 'green' : 'grey'">mdi-dots-horizontal</v-icon>
              </v-list-item-icon>
            </v-list-item>

          </v-list-item-group>
        </v-list>
      </v-card>
    </div>
  </v-col>
</template>

<script>
export default {
  data: () => ({
    users: [],
  }),
  methods: {
      dynamicHeight() {
          let scrollPos = (document.documentElement.scrollTop - 100)
          if (scrollPos > -20) { 
              document.getElementById('rightSidebar').style.height = "100vh + -20px" } 
              else {
            document.getElementById('rightSidebar').style.height = "calc(100vh + "+scrollPos+"px)" }
      }
  },
  created () {
    window.addEventListener('scroll', this.dynamicHeight);
  },
  destroyed () {
    window.removeEventListener('scroll', this.dynamicHeight);
  },
  beforeMount() {
    fetch("http://localhost:3000/api/user/", {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        response.json().then((response) => {
          this.users = response;
        });
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.usersList {
    height: 100%;
    &__heading {
  display: flex;
  justify-content: space-between; }
  &__list {
      height: 100%;
      overflow: auto;
  }
}
#rightSidebar {
    overflow: hidden;
    position: sticky;
    top: 0px;
    height: calc(100vh + -100px);
}
</style>