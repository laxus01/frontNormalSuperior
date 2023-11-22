<template>
    <DetailPrintRecords :print="$route.params.data" :type="$route.params.type"/>
  </template>
  
  <script>
  import DetailPrintRecords from "../components/DetailPrintRecords.vue";
  
  export default {
      name: 'CreatePayment',
    data() {
        return {}
    },
    components: {
      DetailPrintRecords,
    },
    props: {
  
    }
  };
  </script>