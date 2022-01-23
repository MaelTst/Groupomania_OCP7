<template>
  <v-col lg="6" md="9" cols="12" class="mt-4">
    <v-card class="rounded-lg boxShadowed pa-7 text-center">
      <v-icon size="32" color="primary">error_outline</v-icon>
      <v-card-title class="d-block pt-1">Erreur 404</v-card-title>
      <v-card-subtitle
        class="text-subtitle-2"
      >On a beau chercher, il n'y a visiblement rien à cette adresse</v-card-subtitle>
      <v-btn depressed small color="primary" to="/">Retour à l'accueil</v-btn>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: "NotFoundView",
};
</script>
