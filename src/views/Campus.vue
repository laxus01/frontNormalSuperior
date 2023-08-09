<template>
    <v-container>
      <v-card class="cards" elevation="5">
        <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
          >Sedes</v-banner
        >
      <ListCampus class="top"/>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import ListCampus from "../components/ListCampus.vue";
  
  export default {
    data() {
        return {}
    },
    components: {
      ListCampus,
    },
  };
  </script>
  
  <style>
  .top {
    margin-top: 20px;
  }
  </style>
  