<template>
  <v-data-table :headers="headers" :items="desserts" :search="search" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-text-field v-model="search" clearable append-icon="mdi-magnify" label="Filtrar" single-line
          hide-details></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn rounded color="blue darken-3" dark class="mb-2" v-bind="attrs" v-on="on">
              <v-icon>checklist</v-icon>
            </v-btn>
            <v-btn @click="dialogPrint = true" rounded color="blue darken-3" dark class="mb-2 mr-5">
              <v-icon>print</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Registrar Notas</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete :items="items" return-object label="Maestro en formación*" item-value="value"
                      item-text="nombre" no-data-text="Institución no registrada" :menu-props="{ maxHeight: 100 }"
                      v-model="studentSelected" @change="(event) => setData(event)"></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Grupo" v-model="group"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete :items="itemsJudgment" return-object label="Tipo calificación*" item-value="value"
                      item-text="juicio" no-data-text="Tipo calificación no registrada" :menu-props="{ maxHeight: 100 }"
                      v-model="judgmentSelected"></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Nota" v-model="record" class="centered-input"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-alert v-if="stateNota" type="success" dense>Registro exitoso</v-alert>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" :disabled="disabledForm()" text @click="save"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogPrint" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Imprimir consolidado de notas</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete append-icon="print" @click:append="filterQueryPrint" :items="itemsGrupo"
                      return-object label="Grupo*" item-value="value" item-text="grupo" no-data-text="Grupo no registrado"
                      :menu-props="{ maxHeight: 100 }" v-model="grupo"></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancelar
              </v-btn>
            </v-card-actions>
          </v-card>
          </v-dialog>
      </v-toolbar>
    </template>
    <!-- <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> edit </v-icon>
      <v-icon small class="mr-2" @click="deleteItem(item)"> delete </v-icon>
    </template> -->
  </v-data-table>
</template>
      
<script>
const shortid = require("shortid");
import axios from "axios";

export default {
  data: () => ({
    items: [],
    listSector: ['OFICIAL', 'PRIVADO'],
    activePeriodId: null,
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
    editedIndex: -1,
    search: "",
    dialog: false,
    dialogPrint: false,
    stateNota: false,
    desserts: [],
    listCampusByInstitution: [],
    itemsGrupo: [],
    editedItem: {},
    studentSelected: {},
    judgmentSelected: {},
    itemsJudgment: [],
    name: "",
    group: "",
    solicitud_id: "",
    record: "",
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {

    async getActivePeriod() {
      try {
        let data = await axios.get("api/periods/active");
        this.activePeriodId = data.data.data.periodo_id;
      } catch (error) {
        console.error("Error obteniendo periodo activo:", error);
      }
    },

    async getGroups() {
      let data = await axios.get("api/students/getGroups");
      this.itemsGrupo = await data.data.desserts;
    },

    async getConsolidateRecords() {
      let data = await axios.get("api/practices/getConsolidateRecords");
      this.desserts = await data.data.desserts;
    },

    async getStudentsByPracticeActive() {
      let data = await axios.get("api/students/getStudentsByPracticeActive");
      this.items = await data.data.desserts;
    },

    async getJudgments() {
      let data = await axios.get("api/practices/getJudgments");
      this.itemsJudgment = await data.data.desserts;
    },

    setData(event) {
      this.name = event.nombre;
      this.group = event.grupo;
      this.solicitud_id = event.id;
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteTeacher(this.editedItem);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.setRecord();
    },

    async deleteTeacher(editedItem) {
      axios
        .put(`api/teachers/inactivate/${editedItem.id}`)
        .then(() => {
          this.getConsolidateRecords();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async setRecord() {
      axios
        .post(`api/practices/saveRecord`, {
          solicitud_id: this.solicitud_id,
          periodo_id: this.activePeriodId,
          juicio_id: this.judgmentSelected.id,
          nota: this.record,
        })
        .then(() => {   
          this.getConsolidateRecords();       
          this.stateNota = true;
          setTimeout(() => {
          this.stateNota = false;
          }, "1000");
        })
        .catch((err) => {
          console.log(err);
        });
    },

    disabledForm() {
      if (
        Object.keys(this.studentSelected).length === 0 ||
        Object.keys(this.judgmentSelected).length === 0 ||
        this.record === ""
      ) {
        return true;
      }
    },

    filterQueryPrint() {
      this.$router.push(`/print-records/${this.grupo.id}`)
    },

  },
  created() {
    this.getActivePeriod();
    this.getConsolidateRecords();
    this.getJudgments();
    this.getStudentsByPracticeActive();
    this.getGroups();
  },
};
</script>

<style>
.centered-input input {
  text-align: center
}
</style>
    