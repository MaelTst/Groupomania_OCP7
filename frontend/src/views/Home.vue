<template>
<v-col lg="6" md="9" cols="12" class="mt-4">
    <MostLikedPics />
    <WritePost />
  <HomeFeed/>
</v-col>
</template>

<script>
  import HomeFeed from '../components/HomeFeed'
  import WritePost from "../components/WritePost";
import MostLikedPics from "../components/MostLikedPics";

  export default {
    name: 'Home',

    components: {
      HomeFeed,
      WritePost,
    MostLikedPics,
    },
  }
</script>
