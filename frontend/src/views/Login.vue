<template>
  <v-col cols="12" class="pb-0">
    <div class="d-flex flex-column mainContainer px-5">
      <div class="header d-flex">
        <v-img
          alt="Logo Groupomania"
          class="flex-grow-0"
          contain
          :src="require('../assets/groupomania-logo-black.png')"
          transition="scale-transition"
          origin="center center"
          width="225"
        />
      </div>

      <div class="loginContainer py-10">
        <h1
          class="text-center px-5 pb-10 text-h4 text-md-h3"
        >Bienvenue sur votre réseau social d'entreprise</h1>
        <Login />
      </div>

      <footer class="d-flex justify-space-between align-center">
        <ul class="d-flex d-sm-inline-flex flex-wrap footerList pa-0">
          <li>
            <a href="#">À propos</a>
          </li>
          <li>
            <a href="#">Mentions légales</a>
          </li>
          <li>
            <a href="#">Aide</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
        <span class="d-none d-sm-block">Groupomania © {{ new Date().getFullYear() }}</span>
      </footer>
    </div>
  </v-col>
</template>

<script>
import Login from "../components/Login.vue";

export default {
  name: "LoginView",

  components: {
    Login,
  },
  beforeCreate() {
    if (this.$store.state.isLoggedIn) {
      this.$router.push({ name: "Home" });
    }
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@200&family=Open+Sans:wght@300&display=swap");

.mainContainer {
  min-height: 100vh;
}

.header {
  max-width: 1200px;
  height: 80px;
  border-bottom: 1px solid #d5d5d5;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

footer {
  max-width: 1200px;
  min-height: 80px;
  border-top: 1px solid #d5d5d5 !important;
  margin-top: auto;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
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

.footerList {
  list-style: none;
  li {
    padding-right: 20px;
    a {
      text-decoration: none;
      color: rgba(0, 0, 0, 0.87);
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>