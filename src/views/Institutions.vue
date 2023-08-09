<template>
    <v-container>
      <v-card class="cards" elevation="5">
        <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
          >Instituciones</v-banner
        >
      <ListInstitutions class="top"/>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import ListInstitutions from "../components/ListInstitutions.vue";
  
  export default {
    data() {
        return {}
    },
    components: {
      ListInstitutions,
    },
  };
  </script>
  
  <style>
  .top {
    margin-top: 20px;
  }
  </style>
  