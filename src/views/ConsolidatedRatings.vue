<template>
    <v-container>
      <v-card class="cards" elevation="5">
        <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
          >Consolidado de notas</v-banner
        >
      <ListConsolidateRecords class="top"/>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import ListConsolidateRecords from "../components/ListConsolidateRecords.vue";
  
  export default {
    data() {
        return {}
    },
    components: {
      ListConsolidateRecords,
    },
  };
  </script>
  
  <style>
  .top {
    margin-top: 20px;
  }
  </style>