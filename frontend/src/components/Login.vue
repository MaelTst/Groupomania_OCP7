<!-- Composant Inscription / Connexion -->
<template>
  <v-card class="loginForm rounded-lg boxShadowed">
    <v-tabs icons-and-text class="pa-2" v-model="tabs" fixed-tabs>
      <v-tab active-class="loginForm__TabActive1">
        Connexion
        <v-icon>login</v-icon>
      </v-tab>
      <v-tab active-class="loginForm__TabActive2">
        Inscription
        <v-icon>app_registration</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <div class="pa-5 pb-7">
          <v-form ref="formLogin" v-model="validLoginForm" lazy-validation>
            <v-text-field
              autocomplete="off"
              class="mb-2"
              prepend-inner-icon="alternate_email"
              dense
              rounded
              background-color="bg-light-grey"
              v-model="emailLogin"
              :rules="emailRules"
              label="E-mail"
              required
              filled
              @keydown.enter="login"
            ></v-text-field>
            <v-text-field
              class="mb-2"
              prepend-inner-icon="lock"
              dense
              rounded
              background-color="bg-light-grey"
              v-model="passwordLogin"
              :append-icon="showLoginPassword ? 'visibility' : 'visibility_off'"
              :type="showLoginPassword ? 'text' : 'password'"
              @click:append="showLoginPassword = !showLoginPassword"
              :rules="passwordRules"
              label="Mot de passe"
              required
              filled
              @keydown.enter="login"
            ></v-text-field>
            <v-btn
              :loading="loadingLogin"
              block
              :disabled="!validLoginForm || loadingLogin"
              color="primary"
              class="mr-4 mt-5"
              @click="login"
            >Connexion</v-btn>
          </v-form>
        </div>
      </v-tab-item>
      <v-tab-item>
        <div class="pa-5 pb-7">
          <v-form ref="formSignup" v-model="validSignupForm" lazy-validation>
            <v-text-field
              autocomplete="off"
              class="mb-2"
              prepend-inner-icon="alternate_email"
              dense
              rounded
              background-color="bg-light-grey"
              v-model="emailSignup"
              :rules="emailRules"
              label="E-mail"
              required
              filled
              @keydown.enter="signup"
            ></v-text-field>
            <v-text-field
              class="mb-2"
              prepend-inner-icon="lock"
              dense
              rounded
              background-color="bg-light-grey"
              v-model="passwordSignup"
              :append-icon="showSignupPassword ? 'visibility' : 'visibility_off'"
              :type="showSignupPassword ? 'text' : 'password'"
              @click:append="showSignupPassword = !showSignupPassword"
              :rules="passwordRules"
              label="Mot de passe"
              required
              filled
              @keydown.enter="signup"
            ></v-text-field>
            <v-text-field
              class="mb-2"
              prepend-inner-icon="person"
              dense
              rounded
              background-color="bg-light-grey"
              v-model="nameSignup"
              :counter="30"
              maxlength="30"
              :rules="nameRules"
              label="Nom d'affichage"
              required
              filled
              @keydown.enter="signup"
            ></v-text-field>
            <v-btn
              block
              :loading="loadingSignup"
              :disabled="!validSignupForm || loadingSignup"
              color="primary"
              class="mr-4 mt-5"
              @click="signup"
            >S'inscrire</v-btn>
          </v-form>
        </div>
      </v-tab-item>
    </v-tabs-items>
    <v-snackbar v-model="snackbar" :timeout="4000" color="red darken-3">
      {{ snackbarMsg }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">Fermer</v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    validLoginForm: true,
    validSignupForm: true,
    loadingLogin: false,
    loadingSignup: false,
    snackbar: false,
    snackbarMsg: "",
    nameSignup: "",
    nameRules: [
      (v) =>
        v.trim().length >= 6 ||
        "Votre nom d'affichage doit contenir au moins 6 caractères",
      (v) =>
        /^[A-Za-z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\s]+[A-Za-z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\s]+$(\.0-9+)?/.test(
          v
        ) || "Les caractères spéciaux ne sont pas autorisés",
    ],
    emailSignup: "",
    emailLogin: "",
    emailRules: [
      (v) => /.+@.+\..+/.test(v) || "L'adresse email doit être valide",
    ],
    passwordSignup: "",
    passwordLogin: "",
    passwordRules: [
      (v) =>
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(v) ||
        "Votre mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre",
    ],
    tabs: null,
    showLoginPassword: false,
    showSignupPassword: false,
  }),

  methods: {
    // Envoi les données de connexion à l'API et gère les potentielles erreurs retournées
    login() {
      this.$refs.formLogin.validate();
      if (this.validLoginForm && this.emailLogin && this.passwordLogin) {
        this.loadingLogin = true;
        let loginData = {
          email: this.emailLogin,
          password: this.passwordLogin,
        };
        fetch(`${process.env.VUE_APP_ROOT_API}api/user/auth/login`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        })
          .then((response) => {
            if (response.ok) {
              response.json().then((response) => {
                this.$store.dispatch("logIn", response);
                this.$router.push({ name: "Home" });
              });
            } else {
              response.json().then((error) => {
                switch (error.code) {
                  case 1:
                    this.emailLogin = "";
                    this.snackbarMsg = error.message;
                    this.snackbar = true;
                    break;
                  case 2:
                    this.passwordLogin = "";
                    this.snackbarMsg = error.message;
                    this.snackbar = true;
                    break;
                  default:
                    this.snackbarMsg =
                      error.message || "Une erreur est survenue";
                    this.snackbar = true;
                    break;
                }
              });
            }
            this.loadingLogin = false;
          })
          .catch((error) => {
            this.snackbarMsg = error.message || "Une erreur est survenue";
            this.snackbar = true;
            this.loadingLogin = false;
          });
      }
    },

    // Envoi les données d'inscription à l'API et gère les potentielles erreurs retournées
    signup() {
      this.$refs.formSignup.validate();
      if (
        this.validSignupForm &&
        this.emailSignup &&
        this.passwordSignup &&
        this.nameSignup
      ) {
        this.loadingSignup = true;
        let signupData = {
          email: this.emailSignup,
          password: this.passwordSignup,
          nickname: this.nameSignup,
        };
        fetch(`${process.env.VUE_APP_ROOT_API}api/user/auth/signup`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signupData),
        })
          .then((response) => {
            if (response.ok) {
              response.json().then((response) => {
                this.$store.dispatch("logIn", response);
                this.$router.push({ name: "Home" });
              });
            } else {
              response.json().then((error) => {
                if (error.error.original.constraint) {
                  switch (error.error.original.constraint) {
                    case "users_nickname_key":
                      this.nameSignup = "";
                      this.snackbarMsg = "Ce nom d'affichage est déjà utilisé";
                      this.snackbar = true;
                      break;
                    case "users_email_key":
                      this.emailSignup = "";
                      this.snackbarMsg =
                        "Cette adresse email est déjà utilisée";
                      this.snackbar = true;
                      break;
                    default:
                      this.snackbarMsg = "Une erreur est survenue";
                      this.snackbar = true;
                      break;
                  }
                } else {
                  this.snackbarMsg = error.message || "Une erreur est survenue";
                  this.snackbar = true;
                  this.loadingLogin = false;
                }
              });
            }
            this.loadingSignup = false;
          })
          .catch((error) => {
            this.snackbarMsg = error.message || "Une erreur est survenue";
            this.snackbar = true;
            this.loadingSignup = false;
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.loginForm {
  max-width: 420px;
  margin: auto;
  &__TabActive1 {
    border-top-left-radius: 8px;
    &:before {
      border-top-left-radius: 8px;
      opacity: 0.14 !important;
    }
  }
  &__TabActive2 {
    border-top-right-radius: 8px;
    &:before {
      border-top-right-radius: 8px;
      opacity: 0.14 !important;
    }
  }
}
.v-text-field--rounded {
  border-radius: 4px !important;
}
</style>