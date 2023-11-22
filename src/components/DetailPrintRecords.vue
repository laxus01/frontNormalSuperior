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
            this.desserts = await data.data.desserts;
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