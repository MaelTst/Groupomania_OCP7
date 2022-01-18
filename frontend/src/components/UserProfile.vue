<template>
  <div>
    <v-card v-if="userProfile.id ? true : false" class="rounded-lg boxShadowed pa-2 mb-4">
      <div class="userProfile__banner">
        <v-img
          height="250"
          gradient="to bottom, rgba(0,0,0,.4), rgba(0,0,0,.0)"
          :src="userProfile.bannerImg || ''"
        >
          <v-avatar class="rounded-lg ml-6 userProfile__banner__avatar" size="92" :right="true">
            <img
              :src="userProfile.imgUrl || require('../assets/placeholder.png')"
              alt="Photo de profil"
            />
          </v-avatar>
          <v-file-input></v-file-input>
        </v-img>
      </div>
      <div class="userProfile__content pa-3 pt-1 pb-0 d-flex flex-row">
          <div class="userProfile__content__left">
          <v-card-title>{{ userProfile.nickname }}</v-card-title>
          <v-card-subtitle><span v-show="!isEditingJob">{{ userProfile.job || "Poste inconnu" }} <v-btn v-if="this.$store.state.userInfo.id === userProfile.id" small @click="isEditingJob = true" aria-label="Modifier le poste" icon>
                <v-icon small>mdi-pencil</v-icon>
              </v-btn></span>
          <v-textarea v-show="isEditingJob"
              hide-details
              class="rounded-lg"
              rows="1"
              row-height="36"
              auto-grow
              dense
              flat
              solo
              label="Renseignez votre poste"
              v-model="userProfile.job"
              background-color="bg-light-grey"
            ></v-textarea></v-card-subtitle>
          </div>
          <div class="userProfile__content__mid text-center"><v-card-title class="d-block">{{ this.$store.state.posts.length }}</v-card-title><v-card-subtitle>Publications</v-card-subtitle></div>
          <div class="userProfile__content__right text-center"><v-card-title class="d-block">Membre depuis</v-card-title><v-card-subtitle>{{ $moment(userProfile.createdAt).calendar() }}</v-card-subtitle></div>
          </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
      isEditingJob: false,
  }),

  props: {
    userProfile: {},
  },
};
</script>

<style lang="scss">
.userProfile {
  &__banner {
    position: relative;
    & .v-image {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    }
    &__avatar {
      position: absolute;
      bottom: 8%;
      z-index: 999;
      border: 4px solid white;
    }
  }
  &__content {
      &__left, &__mid, &__right {
          width: 33.3%;
      }
  }
}
</style>