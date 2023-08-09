<template>
    <v-container>
      <v-card class="cards" elevation="5">
        <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
          >Maestros en formación</v-banner
        >
      <ListStudents class="top"/>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import ListStudents from "../components/ListStudents.vue";
  
  export default {
    data() {
        return {}
    },
    components: {
      ListStudents,
    },
  };
  </script>
  
  <style>
  .top {
    margin-top: 20px;
  }
  </style>
  