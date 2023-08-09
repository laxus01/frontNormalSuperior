<template>
    <v-container>
      <v-card class="cards" elevation="5">
        <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
          >Maestros titulares</v-banner
        >
      <ListTeachers class="top"/>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import ListTeachers from "../components/ListTeachers.vue";
  
  export default {
    data() {
        return {}
    },
    components: {
      ListTeachers,
    },
  };
  </script>
  
  <style>
  .top {
    margin-top: 20px;
  }
  </style>
  