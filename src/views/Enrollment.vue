<template>
    <v-container>
      <v-card class="cards" elevation="5">
        <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
          >Matriculas</v-banner
        >
      <ListEnrollment class="top"/>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import ListEnrollment from "../components/ListEnrollment.vue";
  
  export default {
    data() {
        return {}
    },
    components: {
      ListEnrollment,
    },
  };
  </script>
  
  <style>
  .top {
    margin-top: 20px;
  }
  </style>