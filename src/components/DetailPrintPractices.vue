<template>
  <div>
    <div v-if="desserts.length === 0">
      <h3>¡No existen registros para mostrar!</h3>
    </div>
    <div class="print" v-if="desserts.length > 0">
      <div v-if="type === '1'">
        <div class="title"> PRACTICAS POR GRUPO </div>
        <div class="mt-5">
          Grupo: {{ desserts[0].grupoxsemestre }}
        </div>
      </div>
      <div v-if="type === '2'">
        <div class="title"> PRACTICAS POR INSTITUCIÓN </div>
        <div class="mt-5">
          Institución: {{ desserts[0].institucion }}
        </div>
      </div>
      <div v-if="type === '3'">
        <div class="title"> PRACTICAS POR SUPERVISOR </div>
        <div class="mt-5">
          Supervisor: {{ desserts[0].supervisor }}
        </div>
      </div>
      <div class="mt-1">
        Total: {{ desserts.length }}
      </div>
      <div class="table">
        <v-data-table
          :headers="this.type === '1' ? headersGroup : this.type === '2' ? headersInstitution : headersSupervisor"
          :items="desserts"
          class="elevation-1"
          disable-pagination
          hide-default-footer
        ></v-data-table>
      </div>
    </div>
  </div>
</template>
      
<script>
import axios from "axios";

export default {
  data: () => ({
    newPrint: [],
    desserts: [],
    headersGroup: [
      { text: "Maestro F", value: "estudiante" },
      { text: "Institución", value: "institucion" },
      { text: "Sede", value: "sede" },
      { text: "Jornada", value: "jornada" },
      { text: "Grado", value: "grado" },
      { text: "Grupo", value: "grupo" },
      { text: "Maestro T", value: "profesor" },
    ],
    headersInstitution: [
      { text: "Sede", value: "sede" },
      { text: "Jornada", value: "jornada" },
      { text: "Grado", value: "grado" },
      { text: "Grupo", value: "grupo" },
      { text: "Maestro T", value: "profesor" },
      { text: "Maestro F", value: "estudiante" },
      { text: "Grupo", value: "grupoxsemestre" },
      { text: "Tipo", value: "tipo" },
    ],
    headersSupervisor: [
      { text: "Maestro F", value: "estudiante" },
      { text: "Telefono", value: "telefonomf" },
      { text: "Institución", value: "institucion" },
      { text: "Sede", value: "sede" },
      { text: "Jornada", value: "jornada" },
      { text: "Grado", value: "grado" },
      { text: "Grupo", value: "grupo" },
      { text: "Maestro T", value: "profesor" },
      { text: "Telefono", value: "telefonomt" },
    ],
  }),
  props: {
    print: "",
    type: "",
  },
  methods: { 
    
    async getPractices() {
      this.type === '1' ? this.getPracticesByGroup() : this.type === '2' ? this.getPracticesByInstitution() : this.getPracticesBySupervisor();
    },

    async getPracticesByGroup() {
      let data = await axios.get(`api/practices/getPracticesByGroup/${this.print}`);
      this.desserts = await data.data.desserts;
    },   

    async getPracticesByInstitution() {
      let data = await axios.get(`api/practices/getPracticesByInstitution/${this.print}`);
      this.desserts = await data.data.desserts;
    },   

    async getPracticesBySupervisor() {
      let data = await axios.get(`api/practices/getPracticesBySupervisor/${this.print}`);
      this.desserts = await data.data.desserts;
    },

  },
  created() {    
    this.getPractices();
  },
};
</script>

<style lang="scss">

.print {
  width: 100%;
  padding: 20px;
}

.table {
  margin-top: 30px;
}

</style>
    