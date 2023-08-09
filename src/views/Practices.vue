<template>
    <v-container>
      <v-card class="cards" elevation="5">
        <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
          >Practicas asignadas</v-banner
        >
      <ListPractices class="top"/>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import ListPractices from "../components/ListPractices.vue";
  
  export default {
    data() {
        return {}
    },
    components: {
      ListPractices,
    },
  };
  </script>
  
  <style>
  .top {
    margin-top: 20px;
  }
  </style>
