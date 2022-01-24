<template>
  <v-col lg="6" md="9" cols="12" class="mt-4">
    <v-card class="rounded-lg boxShadowed pa-6">
      <v-card-title class="pa-0 pb-6">
        <v-icon class="mr-3" size="32">settings</v-icon>Paramètres du compte
      </v-card-title>
      <div class="d-flex flex-row align-center">
        <v-card-subtitle class="flex-grow-1 py-3">Email du compte</v-card-subtitle>
        <span class="ellipsis">{{ userInfo.email }}</span>
      </div>
      <v-divider></v-divider>
      <div class="d-flex flex-row align-center">
        <v-card-subtitle class="flex-grow-1 py-3">Mot de passe</v-card-subtitle>
        <div>
          <v-btn
            depressed
            min-width="100"
            max-width="100"
            small
            color="primary"
            @click="editPasswordDialog = true"
          >Modifier</v-btn>
        </div>
      </div>
      <v-divider></v-divider>
      <div class="d-flex flex-row align-center">
        <v-card-subtitle class="flex-grow-1 py-3">Suppression du compte</v-card-subtitle>
        <v-btn
          aria-label="Supprimer mon compte"
          depressed
          small
          min-width="100"
          max-width="100"
          color="primary"
          @click="deleteAccountDialog = true"
        >Supprimer</v-btn>
      </div>
    </v-card>
    <v-dialog v-model="deleteAccountDialog" width="500">
      <v-card>
        <v-card-title class="grey lighten-2">Suppression de compte</v-card-title>
        <v-card-text class="pt-6">
          La suppression de votre compte entraînera la perte définitive de tous contenus y étant associés (publications, photos, commentaires[...]), de manière irréversible.
          <br />
          <br />Si vous souhaitez réellement supprimer votre compte, veuillez taper "Confirmer" dans le champs ci-dessous puis cliquer sur Supprimer
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-form v-model="validDeleteAccountForm" class="d-flex flex-row align-center py-2">
            <v-text-field
              hide-details
              dense
              flat
              solo
              label="Confirmer"
              background-color="bg-light-grey"
              :rules="[v => /Confirmer/.test(v)]"
              placeholder="Confirmer"
            ></v-text-field>
            <v-btn
              class="ml-3"
              :disabled="!validDeleteAccountForm"
              depressed
              color="error"
              @click="deleteAccount"
            >Supprimer</v-btn>
          </v-form>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editPasswordDialog" width="500">
      <v-card>
        <v-card-title class="grey lighten-2">Modification du mot de passe</v-card-title>
        <v-card-text
          class="pt-6"
        >Veuillez entrer votre nouveau mot de passe. Celui-ci remplacera votre mot de passe existant lors de vos futures connexions au réseau social Groupomania.</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-form
            v-model="validEditPasswordForm"
            class="d-flex w100 ma-auto flex-column align-center py-2"
          >
            <v-text-field
              class="w100"
              v-model="editPasswordValue"
              label="Nouveau mot de passe"
              dense
              flat
              solo
              background-color="bg-light-grey"
              :append-icon="showPassword ? 'visibility' : 'visibility_off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
              :rules="passwordRules"
            ></v-text-field>
            <v-btn
              :disabled="!validEditPasswordForm"
              depressed
              color="primary"
              @click="editAccount"
            >Valider</v-btn>
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
export default {
  name: "SettingsView",

  data: () => ({
    snackbar: false,
    snackbarMsg: "",
    snackbarColor: "",
    deleteAccountDialog: false,
    validDeleteAccountForm: false,
    editPasswordDialog: false,
    validEditPasswordForm: false,
    editPasswordValue: undefined,
    showPassword: false,
    passwordRules: [
      (v) => !!v || "Veuillez renseigner votre nouveau mot de passe",
      (v) =>
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/.test(v) ||
        "Votre mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre",
    ],
  }),

  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    deleteAccount() {
      let ID = this.$getCookie("ID");
      let isAdminBan = false;
      this.$store.dispatch("deleteUser", { ID, isAdminBan });
      this.$store.dispatch("logOut");
    },

    editAccount() {
      let ID = this.$getCookie("ID");
      let password = this.editPasswordValue;
      this.$store.dispatch("updateUser", { ID, password }).then(
        (response) => {
          this.snackbarColor = "primary";
          this.snackbar = true;
          this.snackbarMsg = response.message;
          this.editPasswordDialog = false;
          this.editPasswordValue = undefined;
        },
        (error) => {
          this.snackbarColor = "red darken-3";
          this.snackbar = true;
          this.snackbarMsg = error.message || "Une erreur est survenue";
          this.editPasswordValue = undefined;
        }
      );
    },
  },
};
</script>