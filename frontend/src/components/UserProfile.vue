<template>
  <div>
    <v-card class="rounded-lg boxShadowed pa-2 mb-4">
      <div class="userProfile__banner">
        <v-img
          height="250"
          gradient="to bottom, rgba(0,0,0,.2), rgba(0,0,0,.0)"
          :src="userProfile.bannerUrl || require('../assets/bannerPlaceholder.jpg')"
        >
          <v-avatar class="rounded-lg ml-6 userProfile__banner__avatar" size="92">
            <v-img
              :src="userProfile.imgUrl || require('../assets/placeholder.png')"
              alt="Photo de profil"
            />
            <div
              tabindex="0"
              role="button"
              aria-label="Modifier l'avatar"
              v-if="userInfo.id === userProfile.id"
              @click="toggleInput('avatarInput')"
              @keydown.enter="toggleInput('avatarInput')"
              class="userProfile__banner__avatarFileInput"
            >
              <v-icon class="userProfile__banner__avatarFileInput__btn">photo_camera</v-icon>
              <v-file-input
                class="d-none"
                accept="image/*"
                v-model="avatarFile"
                id="avatarInput"
                label="Modifier l'avatar"
                @change="updateUserAvatar"
              ></v-file-input>
            </div>
          </v-avatar>
          <div class="d-flex align-center justify-end ma-4">
            <v-file-input
              class="d-none"
              accept="image/*"
              v-model="bannerFile"
              id="bannerInput"
              label="Modifier la photo de couverture"
              @change="updateUserBanner"
            ></v-file-input>

            <v-menu
              content-class="elevation-2 rounded-lg"
              transition="slide-y-transition"
              bottom
              right
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  class="ml-2 userProfile__banner__top"
                  aria-label="Options du contact"
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>more_horiz</v-icon>
                </v-btn>
              </template>
              <v-list nav dense>
                <v-list-item link v-if="userInfo.id != userProfile.id" @click="placeholder">
                  <v-list-item-icon class="mr-3">
                    <v-icon>textsms</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Envoyer un message</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="userInfo.id != userProfile.id" link @click="placeholder">
                  <v-list-item-icon class="mr-3">
                    <v-icon>rss_feed</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Suivre</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  v-if="userInfo.id === userProfile.id"
                  link
                  @click="toggleInput('bannerInput')"
                >
                  <v-list-item-icon class="mr-3">
                    <v-icon>photo_camera</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Modifier la couverture</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  link
                  v-if="userInfo.isAdmin === true && userInfo.id != userProfile.id"
                  @click="banUserDialog = true, banMode = null"
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
        </v-img>
      </div>
      <div class="userProfile__content pa-4 pt-1 pb-0 d-flex flex-row">
        <v-row>
          <v-col sm="4" cols="8">
            <v-card-title class="px-0 pt-2 d-block ellipsis">{{ userProfile.nickname }}</v-card-title>
            <v-card-subtitle class="px-0 pb-2">
              <span v-show="!isEditingJob">
                {{ userProfile.job || "Poste inconnu" }}
                <v-btn
                  v-if="userInfo.id === userProfile.id"
                  x-small
                  @click="isEditingJob = true, editUserJob = userInfo.job || ''"
                  aria-label="Modifier le poste"
                  icon
                >
                  <v-icon x-small>edit</v-icon>
                </v-btn>
              </span>
              <v-text-field
                v-show="isEditingJob"
                hide-details
                class="rounded-lg"
                maxlength="30"
                dense
                append-outer-icon="check"
                append-icon="close"
                height="20"
                flat
                solo
                label="Poste"
                v-model="editUserJob"
                background-color="bg-light-grey"
                @click:append="isEditingJob = false"
                @click:append-outer="updateUserJob"
                @keydown.enter="updateUserJob"
              ></v-text-field>
            </v-card-subtitle>
          </v-col>
          <v-col cols="4" class="text-right text-sm-center flex-column">
            <v-card-title class="d-block px-0 pt-2">{{ this.$store.state.posts.length }}</v-card-title>
            <v-card-subtitle class="d-block ellipsis px-0 pb-2">Publications</v-card-subtitle>
          </v-col>
          <v-col sm="4" class="d-none d-sm-flex text-right flex-column">
            <v-card-title class="d-block px-0 pt-2">Inscrit</v-card-title>
            <v-card-subtitle
              class="d-block px-0 pb-2 ellipsis"
            >{{ $moment(userProfile.createdAt).calendar() }}</v-card-subtitle>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <v-dialog v-model="banUserDialog" width="500">
      <v-card>
        <v-card-title class="grey lighten-2">Bannissement d'un utilisateur</v-card-title>
        <v-card-text class="pt-6">
          Veuillez choisir le type de bannissement à appliquer pour l'utilisateur
          <strong>{{ userProfile.nickname }}</strong>
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
  </div>
</template>

<script>
export default {
  data: () => ({
    isEditingJob: false,
    editUserJob: "",
    avatarFile: null,
    bannerFile: null,
    snackbar: false,
    snackbarColor: "",
    snackbarMsg: "",
    banUserDialog: false,
    banMode: null,
    loading: false,
  }),

  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },

  props: {
    userProfile: {},
  },

  methods: {
    updateUserAvatar() {
      let formData = new FormData();
      let ID = this.$getCookie("ID");
      let avatarFile = this.avatarFile;
      if (avatarFile) {
        formData.append("image", avatarFile);
        this.$store.dispatch("updateUserAvatar", { ID, formData }).then(
          () => {
            this.snackbarColor = "primary";
            this.snackbarMsg = "Avatar modifié";
            this.snackbar = true;
          },
          (error) => {
            console.log(error);
            this.snackbarColor = "red darken-3";
            this.snackbarMsg = error.message || "Une erreur est survenue";
            this.snackbar = true;
          }
        );
      }
    },

    updateUserBanner() {
      let formData = new FormData();
      let ID = this.$getCookie("ID");
      let bannerFile = this.bannerFile;
      if (bannerFile) {
        formData.append("image", bannerFile);
        this.$store.dispatch("updateUserBanner", { ID, formData }).then(
          () => {
            this.snackbarColor = "primary";
            this.snackbarMsg = "Photo de couverture modifiée";
            this.snackbar = true;
          },
          (error) => {
            console.log(error);
            this.snackbarColor = "red darken-3";
            this.snackbarMsg = error.message || "Une erreur est survenue";
            this.snackbar = true;
          }
        );
      }
    },

    toggleInput(form) {
      document.getElementById(form).click();
    },

    updateUserJob() {
      if (!this.editUserJob.trim() || this.editUserJob.length < 2) {
        this.snackbarColor = "red darken-3";
        this.snackbarMsg = "Votre poste doit comporter au moins 2 caractères";
        this.snackbar = true;
      } else {
        let ID = this.$getCookie("ID");
        let userId = this.userProfile.id;
        let job = this.editUserJob;
        this.$store
          .dispatch("updateUser", {
            ID,
            userId,
            job,
          })
          .then(
            () => {
              this.isEditingJob = false;
              this.editUserJob = "";
              this.snackbarColor = "primary";
              this.snackbarMsg = "Poste modifié";
              this.snackbar = true;
            },
            (error) => {
              this.snackbarMsg = error.message || "Une erreur est survenue";
              this.snackbarColor = "red darken-3";
              this.snackbar = true;
            }
          );
      }
    },

    placeholder() {
      this.snackbarColor = "primary";
      this.snackbar = true;
      this.snackbarMsg = "Placeholder";
    },

    banUser() {
      let ID = this.userProfile.id;
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
            this.loading = false;
          },
          (error) => {
            console.log(error);
            this.snackbarColor = "red darken-3";
            this.snackbar = true;
            this.snackbarMsg = "Une erreur est survenue";
            this.banUserDialog = false;
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
            this.loading = false;
          },
          (error) => {
            console.log(error);
            this.snackbarColor = "red darken-3";
            this.snackbar = true;
            this.snackbarMsg = "Une erreur est survenue";
            this.banUserDialog = false;
            this.loading = false;
          }
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.userProfile {
  &__banner {
    position: relative;
    &__top {
      background-color: rgba(255, 255, 255, 0.7);
    }
    & .v-image {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    &__avatarFileInput {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 84px;
      height: 84px;
      cursor: pointer;
      &__btn {
        display: flex;
        opacity: 0;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        transition: all 0.5;
      }
      &:hover &__btn {
        opacity: 1;
      }
    }
    &__avatar {
      position: absolute;
      bottom: 8%;
      z-index: 999;
      border: 4px solid white;
    }
  }
}
</style>