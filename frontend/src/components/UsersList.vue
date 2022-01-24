<template>
  <v-col cols="3" class="mt-4 d-none d-lg-block" id="rightSidebar">
    <div class="usersList">
      <h1 class="usersList__heading blue-grey--text text--darken-3 px-3 pb-3 overline">Contacts</h1>
      <v-card class="usersList__list rounded-lg boxShadowed">
        <simplebar class="simplebarContainer" data-simplebar-auto-hide="true">
          <v-list nav dense>
            <div class="usersList__list__link" v-for="user in users" :key="user.id">
              <v-list-item
                active-class="primary--text"
                :to="'/user/'+user.id"
                class="px-2"
                :id="'userMenu'+user.id"
              >
                <v-list-item-avatar class="rounded-lg" size="42">
                  <v-img
                    :src="user.imgUrl || require('../assets/placeholder.png')"
                    alt="Photo de profil"
                  />
                </v-list-item-avatar>
                <v-list-item-content
                  class="blue-grey--text text--darken-3 text-subtitle-2"
                >{{ user.nickname }}</v-list-item-content>
              </v-list-item>
              <v-menu
                :attach="'#userMenu'+user.id"
                content-class="elevation-2 rounded-lg"
                transition="slide-y-transition"
                bottom
                left
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    aria-label="Options du contact"
                    absolute
                    icon
                    class="align-self-center usersList__list__btn"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>more_horiz</v-icon>
                  </v-btn>
                </template>
                <v-list nav dense>
                  <v-list-item @click.prevent="placeholder">
                    <v-list-item-icon class="mr-3">
                      <v-icon>textsms</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Envoyer un message</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click.prevent="placeholder">
                    <v-list-item-icon class="mr-3">
                      <v-icon>rss_feed</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Suivre</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="userInfo.isAdmin === true"
                    @click.prevent="banUserDialog = true, banUserInfo = user, banMode = null"
                  >
                    <v-list-item-icon class="mr-3">
                      <v-icon>block</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Bannir</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-list>
        </simplebar>
      </v-card>
    </div>
    <v-dialog v-model="banUserDialog" width="500">
      <v-card>
        <v-card-title class="grey lighten-2">Bannissement d'un utilisateur</v-card-title>
        <v-card-text class="pt-6">
          Veuillez choisir le type de bannissement à appliquer pour l'utilisateur
          <strong>{{ banUserInfo.nickname }}</strong>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-form class="d-flex w100 ma-auto flex-column align-center py-2">
            <v-radio-group label="Type de bannissement :" v-model="banMode" column>
              <v-radio
                class="py-2"
                label="L'utilisateur sera banni et ne pourra plus se connecter au réseau social. Son profil restera visible et ses publications, photos et commentaires seront conservés"
                value="ban"
              ></v-radio>
              <v-radio
                class="py-2"
                label="Le compte de l'utilisateur sera supprimé ainsi que tout contenu y étant associé (publications, photos, commentaires)"
                value="delete"
              ></v-radio>
            </v-radio-group>
            <v-btn
              :disabled="!banMode || loading"
              :loading="loading"
              depressed
              color="primary"
              @click="banUser()"
            >Appliquer</v-btn>
          </v-form>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :timeout="4000" :color="snackbarColor">
      {{ snackbarMsg }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">Fermer</v-btn>
      </template>
    </v-snackbar>
  </v-col>
</template>

<script>
import simplebar from "simplebar-vue";
import "simplebar/dist/simplebar.min.css";
export default {
  components: {
    simplebar,
  },

  data: () => ({
    snackbar: false,
    snackbarMsg: "",
    snackbarColor: "",
    banUserDialog: false,
    banUserInfo: {},
    banMode: null,
    loading: false,
  }),

  computed: {
    users() {
      return this.$store.state.users;
    },
    userInfo() {
      return this.$store.state.userInfo;
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

    placeholder() {
      this.snackbarColor = "primary";
      this.snackbar = true;
      this.snackbarMsg = "Placeholder";
    },

    banUser() {
      let ID = this.banUserInfo.id;
      let isAdminBan = true;
      let banned = 1;
      this.loading = true;
      if (this.banMode === "ban") {
        this.$store.dispatch("updateUser", { ID, banned }).then(
          (response) => {
            this.snackbarColor = "primary";
            this.snackbar = true;
            this.snackbarMsg = response.message;
            this.banUserDialog = false;
            this.banUserInfo = {};
            this.loading = false;
          },
          (error) => {
            this.snackbarColor = "red darken-3";
            this.snackbar = true;
            this.snackbarMsg = error.message || "Une erreur est survenue";
            this.banUserDialog = false;
            this.banUserInfo = {};
            this.loading = false;
          }
        );
      }
      if (this.banMode === "delete") {
        this.$store.dispatch("deleteUser", { ID, isAdminBan }).then(
          (response) => {
            this.snackbarColor = "primary";
            this.snackbar = true;
            this.snackbarMsg = response.message;
            this.banUserDialog = false;
            this.banUserInfo = {};
            this.loading = false;
          },
          (error) => {
            this.snackbarColor = "red darken-3";
            this.snackbar = true;
            this.snackbarMsg = error.message || "Une erreur est survenue";
            this.banUserDialog = false;
            this.banUserInfo = {};
            this.loading = false;
          }
        );
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
    &__link {
      position: relative;
    }
    &__btn {
      z-index: 7;
      top: 50%;
      right: 0px;
      transform: translate(-50%, -50%);
    }
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