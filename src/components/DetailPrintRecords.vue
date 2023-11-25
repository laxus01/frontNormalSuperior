<template>
    <div>
        <div v-if="desserts.length === 0">
            <h3>¡No existen registros para mostrar!</h3>
        </div>
        <div class="print" v-if="desserts.length > 0">
            <div>
                <div class="title"> CONSOLIDADO DE NOTAS </div>
                <div class="mt-5">
                    Grupo: {{ this.desserts[0].grupo }}
                </div>
            </div>
            <div class="mt-1">
                Total: {{ desserts.length }}
            </div>
            <div class="table">
                <v-data-table :headers="headers" :items="desserts" class="elevation-1" disable-pagination
                    hide-default-footer></v-data-table>
            </div>
        </div>
    </div>
</template>
        
<script>
import axios from "axios";

export default {
    data: () => ({
        headers: [
            {
                text: "Nombre",
                align: "start",
                sortable: false,
                value: "nombre",
            },
            { text: "Grupo", value: "grupo" },
            { text: "P.P.I", value: "nota_ppi", align: "center" },
            { text: "INVESTIGACIÓN", value: "nota_investigacion", align: "center" },
            { text: "MAESTRO TITULAR", value: "nota_maestrotitular", align: "center" },
            { text: "SUPERVISOR", value: "nota_supervisor", align: "center" },
            { text: "DEFINITIVA", value: "definitiva", align: "center" },
            /* { text: "Acción", value: "actions", sortable: false }, */
        ],
        desserts: [],
    }),
    props: {
        print: "",
        grupo: "",
    },
    methods: {

        async getRecordsBygroup() {
            let data = await axios.get(`api/practices/getConsolidateRecordsByGroup/${this.print}`);
            let records = await data.data.desserts;
            records.forEach((records) => {
                this.desserts.push({
                    nombre: records.nombre,
                    grupo: records.grupo,
                    nota_ppi: records.nota_ppi,
                    nota_investigacion: records.nota_investigacion,
                    nota_maestrotitular: records.nota_maestrotitular,
                    nota_supervisor: records.nota_supervisor,
                    definitiva: ((records.nota_ppi * 0.3) + (records.nota_investigacion * 0.3) + (records.nota_maestrotitular * 0.2) + (records.nota_supervisor * 0.2)).toFixed(1),
                });
            });

        },

    },
    created() {
        this.getRecordsBygroup();
    }
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