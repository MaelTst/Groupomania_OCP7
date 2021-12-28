<template>
  <div class="d-flex flex-column mainContainer">

    <div class="header">
      <v-img
        alt="Groupomania Logo"
        class="shrink mr-2"
        contain
        to="/"
        :src="require('../assets/groupomania-logo-black.png')"
        transition="scale-transition"
        origin="center center"
        width="225"
      />
    </div>

    <div class="loginForm">
        <h1 class="text-center pa-10">Bienvenue sur le réseau social d'entreprise de Groupomania</h1>
        <Login />
        </div>

        <footer>Français (France)
English (US)
Español
Türkçe
Português (Portugal)
العربية
Italiano
Deutsch
हिन्दी
中文(简体)
日本語
</footer>
  </div>
</template>

<script>
import Login from "../components/Login.vue";

export default {
  name: "LoginView",

  components: {
    Login,
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200&family=Open+Sans:wght@300&display=swap');

.mainContainer {
    min-height: 100vh;
}

.header {
  max-width: 1200px;
  height: 80px;
  border-bottom: 1px solid #d5d5d5;
  padding: 25px;
}

footer {
  max-width: 1200px;
  height: 80px;
  border-top: 1px solid #d5d5d5 !important;
  padding: 25px;
  margin-top: auto;
}

.loginForm {
    max-width: 500px;
    margin: auto;
    h1 {
        font-family: 'Montserrat', sans-serif;
    }
}
</style>