<template>
  <div>
    <v-tabs v-model="tabs" fixed-tabs>
      <v-tab>Connexion</v-tab>
      <v-tab>Inscription</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <v-card flat class="pa-5">
          <v-form ref="form" v-model="validLoginForm" lazy-validation>
            <v-text-field v-model="emailLogin" :rules="emailRules" label="E-mail" required></v-text-field>
            <v-text-field v-model="passwordLogin" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" :rules="passwordRules" label="Mot de passe" required></v-text-field>

            <v-btn
              block
              :disabled="!validLoginForm"
              color="primary"
              class="mr-4 mt-5"
              @click="login(); validate();"
            >Connexion</v-btn>
          </v-form>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat class="pa-5">
          <v-form ref="form" v-model="validSignupForm" lazy-validation>
            

            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
<v-text-field v-model="password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" :rules="passwordRules" label="Mot de passe" required></v-text-field>
<v-text-field v-model="name" :counter="30" :rules="nameRules" label="Name" required></v-text-field>
            <v-btn
              block
              :disabled="!validSignupForm"
              color="primary"
              class="mr-4 mt-5"
              @click="validate();"
            >S'inscrire</v-btn>
          </v-form>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>


<script>
export default {
  data: () => ({
    validLoginForm: true,
    validSignupForm: true,
    name: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 20) || "Name must be less than 10 characters",
    ],
    email: "",
    emailLogin: "admin@groupomania.fr",
    emailRules: [
      (v) => !!v || "Veuillez renseigner votre adresse email",
      (v) => /.+@.+\..+/.test(v) || "L'adresse email doit être valide",
    ],
    password: "",
    passwordLogin: "",
    passwordRules: [
      (v) => !!v || "Veuillez renseigner votre mot de passe",
      (v) => (v && v.length >= 8) || "Votre mot de passe doit contenir au moins 8 caractères",
    ],
    select: null,
    items: ["Item 1", "Item 2", "Item 3", "Item 4"],
    checkbox: false,
    tabs: null,
    showPassword: false,
  }),

  methods: {
    validate() {
      this.$refs.form.validate();
    },
    login() {
        let loginData = {
            email: this.emailLogin,
            password: this.passwordLogin 
        }
        fetch("http://localhost:3000/api/user/auth/login", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        })
            .then((response) => {
                if (response.ok) {
                    this.$router.push({ name: 'Home' })
                } 
                else {
                    response.json()
                        .then((error) => { console.log(error.message) 
                        switch(error.message) {
                            case "Cet utilisateur n'existe pas": 
                            console.log(this)
                            this.email = ""
                            break;
                            case "Votre mot de passe est incorrect":
                            this.password = "" 
                            break;
                        }
                        })
                }
                
            })
            .catch((error) => {
                console.log('Erreur lors du fetch : ' + error.message)
            });
    }
  },
};
</script>