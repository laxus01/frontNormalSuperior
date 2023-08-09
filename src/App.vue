<template>
  <v-app id="inspire">
    <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>
  </v-app>
</template>

<script>
import Menu from "./components/Menu.vue";

export default {
  name: "App",
  data() {
    return {
      drawer: null,
      token: ""
    };
  },
  components: {
    Menu,
  },
};
</script>

<style module>
.container {
  height: 650px;
  margin-top: 80px;
}
</style>
