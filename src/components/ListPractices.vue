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
              <v-icon>print</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Opciones de impresión</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="4" class="d-flex justify-center">
                    <v-btn rounded color="blue darken-3" dark class="mb-2" @click="typeSearch = 1">
                      <v-icon>supervised_user_circle</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="4" class="d-flex justify-center">
                    <v-btn rounded color="blue darken-3" dark class="mb-2" @click="typeSearch = 2">
                      <v-icon>maps_home_work</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="4" class="d-flex justify-center">
                    <v-btn rounded color="blue darken-3" dark class="mb-2" @click="typeSearch = 3">
                      <v-icon>person</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" v-if="typeSearch === 1">
                    <v-autocomplete append-icon="print" @click:append="filterQueryPrint(1)" :items="itemsGrupo"
                      return-object label="Grupo*" item-value="value" item-text="grupo" no-data-text="Grupo no registrado"
                      :menu-props="{ maxHeight: 100 }" v-model="grupo"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" v-if="typeSearch === 2">
                    <v-autocomplete append-icon="print" @click:append="filterQueryPrint(2)" :items="itemsInstitucion"
                      return-object label="Institución*" item-value="value" item-text="institucion"
                      no-data-text="Institución no registrada" :menu-props="{ maxHeight: 100 }"
                      v-model="institucion"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" v-if="typeSearch === 3">
                    <v-autocomplete append-icon="print" @click:append="filterQueryPrint(3)" :items="itemsSupervisor"
                      return-object item-value="value" item-text="supervisor" no-data-text="Supervisor no registrado"
                      label="Supervisor" :menu-props="{ maxHeight: 100 }" v-model="supervisor"></v-autocomplete>
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
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Esta seguro de eliminar este maestro?</v-card-title>
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
      <v-icon small class="mr-2" @click="deleteItem(item)"> delete </v-icon>
    </template>
    <div id="printSection">
      <h1>HOLA MUNDO</h1>
    </div>
  </v-data-table>
</template>
      
<script>
const shortid = require("shortid");
import axios from "axios";

export default {
  data: () => ({
    grupo: "",
    institucion: "",
    supervisor: "",
    items: [],
    itemsGrupo: [],
    itemsInstitucion: [],
    itemsSupervisor: [],
    typeSearch: 1,
    listSector: ['OFICIAL', 'PRIVADO'],
    headers: [
      {
        text: "Maestro F",
        align: "start",
        sortable: false,
        value: "estudiante",
      },
      { text: "Grupo", value: "grupoxsemestre" },
      { text: "Institución", value: "institucion" },
      { text: "Sede", value: "sede" },
      { text: "Jornada", value: "jornada" },
      { text: "Grado", value: "grado" },
      { text: "Grupo", value: "grupo" },
      { text: "Tipo", value: "tipo" },
      { text: "Maestro T", value: "profesor" },
      { text: "Supervisor", value: "supervisor" },
      { text: "Acción", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    search: "",
    dialog: false,
    dialogDelete: false,
    desserts: [],
    listCampusByInstitution: [],
    editedItem: {},
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Institución" : "Editar Institución";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {

    async getGroups() {
      let data = await axios.get("api/students/getGroups");
      this.itemsGrupo = await data.data.desserts;
    },

    async getInstitutions() {
      let data = await axios.get("api/institutions");
      this.itemsInstitucion = await data.data.desserts;
    },

    async getSupervisors() {
      let data = await axios.get("api/campus/getSupervisors");
      this.itemsSupervisor = await data.data.desserts;
    },

    async getPractices() {
      let data = await axios.get("api/practices");
      this.desserts = await data.data.desserts;
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
      if (this.editedIndex > -1) {
        this.updateTeacher(this.editedItem);
      } else {
        this.setTeacher(this.editedItem);
      }
      this.close();
    },

    async deleteTeacher(editedItem) {
      axios
        .put(`api/teachers/inactivate/${editedItem.id}`)
        .then(() => {
          this.getPractices();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async updateTeacher(editedItem) {
      axios
        .put(`api/teachers/update/${editedItem.id}`, {
          nombre: editedItem.nombre,
          telefono: editedItem.telefono,
          correo: editedItem.correo,
        })
        .then(() => {
          this.getPractices();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async setTeacher(editedItem) {
      axios
        .post(`api/teachers`, {
          nombre: editedItem.nombre,
          telefono: editedItem.telefono,
          correo: editedItem.correo,
          sede_id: editedItem.sede.id,
        })
        .then(() => {
          this.getPractices();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    filterQueryPrint(typeFilter) {
      let searchBy = typeFilter === 1 ? this.grupo.id : typeFilter === 2 ? this.institucion.id : this.supervisor.id;
      window.open("https://frontnormalsuperior-production.up.railway.app/print-practices/"+searchBy+"/type/"+typeFilter , 'ventana1' , 'width=1800,height=800,scrollbars=yes');
    },

  },
  created() {
    this.getPractices();
    this.getGroups();
    this.getInstitutions();
    this.getSupervisors();
  },
};
</script>

<style>
.container {
  max-width: 3000px;
}
</style>
