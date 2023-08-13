<template>
    <DetailPrintPractices :print="$route.params.data" :type="$route.params.type"/>
  </template>
  
  <script>
  import DetailPrintPractices from "../components/DetailPrintPractices.vue";
  
  export default {
      name: 'CreatePayment',
    data() {
        return {}
    },
    components: {
      DetailPrintPractices,
    },
    props: {
  
    }
  };
  </script>