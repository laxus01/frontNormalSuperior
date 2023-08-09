<template>
    <v-container>
      <v-card class="cards" elevation="5">
        <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
          >Practicas por asignar</v-banner
        >
      <ListAssign class="top"/>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import ListAssign from "../components/ListAssign.vue";
  
  export default {
    data() {
        return {}
    },
    components: {
      ListAssign,
    },
  };
  </script>
  
  <style>
  .top {
    margin-top: 20px;
  }
  </style>
