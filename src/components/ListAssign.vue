<template>
  <v-data-table :headers="headers" :items="desserts" :search="search" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-text-field v-model="search" clearable append-icon="mdi-magnify" label="Filtrar" single-line
          hide-details></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialogCreate" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn rounded color="blue darken-3" dark class="mb-2" v-bind="attrs" v-on="on">
              <v-icon>person_remove</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Nueva Practica</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete :items="itemsCampus" return-object label="Sede*" item-value="value" item-text="sede"
                      no-data-text="Institución no registrada" :menu-props="{ maxHeight: 100 }"
                      v-model="campusSelected" @change="(event) => getData(event)"></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete :items="itemsTeachers" return-object label="Maestro titular*" item-value="value" item-text="nombre"
                      no-data-text="Maestro titular no registrado" :menu-props="{ maxHeight: 100 }"
                      v-model="teacherSelect"></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete :items="itemsDegrees" return-object label="Grado*" item-value="value" item-text="grado"
                      no-data-text="Grado no registrado" :menu-props="{ maxHeight: 100 }"
                      v-model="degreeSelected" @change="(event) => getGroupsByDegree(event)"></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete :items="itemsGroups" return-object label="Grupo*" item-value="value" item-text="grupo"
                      no-data-text="Grupo no registrado" :menu-props="{ maxHeight: 100 }"
                      v-model="groupSelected"></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete :items="itemsJornada" return-object label="Jornada*" item-value="value" item-text="jornada"
                      no-data-text="Jornada no registrado" :menu-props="{ maxHeight: 100 }"
                      v-model="jornadaSelected"></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Detalle" v-model="detail"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDialogCreate">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" :disabled="disabledFormCreate()" text @click="savePractice"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Asignar Practica</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete :items="items" return-object label="Maestro en formación*" item-value="value"
                      item-text="nombre" no-data-text="Maestro en formación no registrado"
                      @change="(event) => setValues(event)" :menu-props="{ maxHeight: 100 }"
                      v-model="studentSelected.maestro"></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Grupo" v-model="studentSelected.grupo"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Teléfono" v-model="studentSelected.telefono"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete :items="itemsTypes" return-object label="Tipo de practica*" item-value="value" item-text="tipo"
                      no-data-text="Tipo de practica no registrado" :menu-props="{ maxHeight: 100 }"
                      v-model="typeSelected"></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" :disabled="disabledForm()" text @click="save"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Esta seguro de eliminar esta practica por asignar?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">Eliminar</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">how_to_reg</v-icon>
      <v-icon small class="mr-2" @click="deleteItem(item)"> delete </v-icon>
    </template>
  </v-data-table>
</template>
      
<script>
const shortid = require("shortid");
import axios from "axios";

export default {
  data: () => ({
    items: [],
    itemsCampus: [],
    itemsDegrees: [],
    itemsTeachers: [],
    itemsGroups: [],
    itemsJornada: [],
    itemsTypes: [],
    listSector: ['OFICIAL', 'PRIVADO'],
    headers: [
      { text: "Institución", value: "institucion" },
      { text: "Sede", value: "sede" },
      { text: "Jornada", value: "jornada" },
      { text: "Grado", value: "grado" },
      { text: "Grupo", value: "grupo" },
      { text: "Maestro T", value: "nombre" },
      { text: "Teléfono", value: "telefono" },
      { text: "Acción", value: "actions", sortable: false },
    ],
    search: "",
    dialog: false,
    dialogCreate: false,
    dialogDelete: false,
    desserts: [],
    listCampusByInstitution: [],
    editedItem: {},
    studentSelected: {},
    campusSelected: {},
    teacherSelect: {},
    degreeSelected: {},
    groupSelected: {},
    jornadaSelected: {},
    typeSelected: {},
    detail: "",
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

    async getData(event) {
      let dataTeachers = await axios.get(`api/campus/getTeachersByCampus/${event.id}`);
      this.itemsTeachers = await dataTeachers.data.desserts;
      let dataDegree = await axios.get(`api/campus/getDegreesByCampus/${event.id}`);
      this.itemsDegrees = await dataDegree.data.desserts;
      let dataJornada = await axios.get(`api/campus/getJornadas`);
      this.itemsJornada = await dataJornada.data.desserts;
    },

    async getGroupsByDegree(event) {
      console.log(event);
      let data = await axios.get(`api/campus/getGroupsByDegree/${event.id}/sede/${this.campusSelected.id}`);
      this.itemsGroups = await data.data.desserts;
    },

    async getListCampusByInstitutionCampus() {
      let data = await axios.get("api/campus/listCampusByInstitution");
      this.itemsCampus = await data.data.desserts;
    },

    async getPracticesAssign() {
      let data = await axios.get("api/practices/getPracticesAssign");
      this.desserts = await data.data.desserts;
    },

    async getListStudentsAvailable() {
      let data = await axios.get("api/practices/getListStudentsAvailable");
      this.items = await data.data.desserts;
    },

    async getTypePractice() {
      let dataTypes = await axios.get(`api/practices/getTypePractice`);
      this.itemsTypes = await dataTypes.data.desserts;
    },

    setValues(event) {
      this.studentSelected = event;
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
      this.deleteAssign(this.editedItem);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
    },

    closeDialogCreate() {
      this.dialogCreate = false;
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
    },

    save() {
      this.setAssign(this.studentSelected)
      this.close();
    },

    savePractice() {
      this.setPractice()
      this.closeDialogCreate();
    },

    async deleteAssign(editedItem) {
      axios
        .delete(`api/practices/${editedItem.id}`)
        .then(() => {
          this.getPracticesAssign();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async setAssign(item) {
      axios
        .post(`api/practices/saveAssign`, {
          solicitud_id: this.editedItem.id,
          estudiante_id: item.id,
          tipopractica_id: this.typeSelected.id,
          semestre_id: item.semestre_id,
          periodo_id: item.periodo_id,
        })
        .then(() => {
          this.getPracticesAssign();
          this.getListStudentsAvailable();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async setPractice() {
      axios
        .post(`api/practices/savePractice`, {
          sede_id: this.campusSelected.id,
          jornada_id: this.jornadaSelected.id,
          detallegrupoc_id: this.groupSelected.id,
          detalle: this.detail,
          docente_id: this.teacherSelect.id,
        })
        .then(() => {
          this.getPracticesAssign();
          this.getListStudentsAvailable();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    disabledForm() {
      if (
        Object.keys(this.studentSelected).length === 0 ||
        Object.keys(this.typeSelected).length === 0
      ) {
        return true;
      }
    },

    disabledFormCreate() {
      if (
        Object.keys(this.campusSelected).length === 0 ||
        Object.keys(this.teacherSelect).length === 0 ||
        Object.keys(this.degreeSelected).length === 0 ||
        Object.keys(this.groupSelected).length === 0 ||
        Object.keys(this.jornadaSelected).length === 0 
      ) {
        return true;
      }
    },

  },
  created() {
    this.getListCampusByInstitutionCampus();
    this.getPracticesAssign();
    this.getListStudentsAvailable();
    this.getTypePractice();
  },
};
</script>

<style>
.container {
  max-width: 3000px;
}
</style>
