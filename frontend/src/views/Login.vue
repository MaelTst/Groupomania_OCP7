<!-- Vue Inscription / Connexion -->
<template>
  <v-col cols="12" class="pa-0">
    <div class="d-flex flex-column loginMainContainer px-5">
      <div class="loginContainer py-10">
        <h1 class="text-center px-5 pb-10 text-h4">Bienvenue sur votre réseau social d'entreprise</h1>
        <Login />
      </div>
    </div>
  </v-col>
</template>

<script>
import Login from "../components/Login";

export default {
  name: "LoginView",

  components: {
    Login,
  },

  beforeCreate() {
    // Redirige l'utilisateur vers la vue Home si le cookie "isLoggedIn" est true
    if (this.$getCookie("isLoggedIn")) {
      this.$router.push({ name: "Home" });
    }
  },
};
</script>

<style lang="scss" scoped>
.loginMainContainer {
  min-height: calc(100vh - 148px);
}
.loginContainer {
  max-width: 500px;
  margin: auto;
  h1 {
    font-weight: 300 !important;
    line-height: 60px !important;
  }
}
</style>