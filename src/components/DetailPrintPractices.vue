<template>
  <div v-if="type === 1" class="content">
    <div class="print">
      <div class="title"> PRACTICAS POR GRUPO </div>
      <div class="subtitle">
        Grupo: {{ newPrint[0].grupo }}
      </div>
      <div class="table">
        <div class="titulos">
          <div>Maestro F.</div>
          <div>Institución</div>
          <div>Sede</div>
          <div>Jornada</div>
          <div>Grupo</div>
          <div>Maestro T.</div>
        </div>
        <div class="titulos" v-for="item in newPrint" :key="item.id">
          <div>{{item.profesor}}</div>
          <div>{{item.institucion}}</div>
          <div>{{item.sede}}</div>
          <div>{{item.jornada}}</div>
          <div>{{item.grupo}}</div>
          <div>{{item.estudiante}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
      
<script>
import axios from "axios";

export default {
  data: () => ({
  }),
  props: {
    print: "",
    type: 0,
    newPrint: [],
    desserts: [],
  },
  methods: {    

    async getPractices() {
      let data = await axios.get("api/practices");
      this.desserts = await data.data.desserts;
    },

    async filterQueryPrint() {
      this.newPrint = this.desserts.filter(
        item => this.type === 1 ? 
        item.grupo_id === this.print : 
        this.type === 2 ? 
        item.institucion_id === this.print : 
        item.supervisor_id === this.print
      );
    },
  },
  async created() {    
    await this.getPractices();
    await this.filterQueryPrint();
  },
};
</script>
    