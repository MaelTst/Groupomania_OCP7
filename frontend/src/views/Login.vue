<template>
  <v-col cols="12" class="pa-0">
    <div class="d-flex flex-column mainContainer px-5">
      <div class="loginContainer py-10">
        <h1
          class="text-center px-5 pb-10 text-h4 text-md-h3"
        >Bienvenue sur votre réseau social d'entreprise</h1>
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
    if (this.$getCookie("isLoggedIn")) {
      this.$router.push({ name: "Home" });
    }
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@200&family=Open+Sans:wght@300&display=swap");

.mainContainer {
  min-height: calc(100vh - 148px);
}

.loginContainer {
  max-width: 500px;
  margin: auto;
  h1 {
    font-family: "Montserrat", sans-serif !important;
    font-weight: 600 !important;
    line-height: 60px !important;
  }
}
</style>