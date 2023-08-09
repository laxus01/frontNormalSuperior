<template>
    <v-container>
      <v-card class="cards" elevation="5">
        <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
          >Grupos</v-banner
        >
      <ListGroups class="top"/>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import ListGroups from "../components/ListGroups.vue";
  
  export default {
    data() {
        return {}
    },
    components: {
      ListGroups,
    },
  };
  </script>
  
  <style>
  .top {
    margin-top: 20px;
  }
  </style>
  