<template>
  <v-data-table :headers="headers" :items="desserts" :search="search" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-text-field v-model="search" clearable append-icon="mdi-magnify" label="Filtrar" single-line hide-details></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialogEnrollGruup" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Matriculas por grupo</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete :items="items" return-object label="Grupo Anterior*" item-value="value" item-text="grupo"
                      no-data-text="Grupo no registrado" :menu-props="{ maxHeight: 100 }"
                      v-model="grupoAnterior"></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete :items="items" return-object label="Grupo Actual*" item-value="value" item-text="grupo"
                      no-data-text="Grupo no registrado" :menu-props="{ maxHeight: 100 }"
                      v-model="grupoActual"></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text  @click="dialogEnrollGruup = false">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="saveEnrollGroup"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn rounded color="blue darken-3" dark class="mb-2" @click="dialogEnrollGruup = true">
              <v-icon>group</v-icon>
            </v-btn>
            <v-btn rounded color="blue darken-3" dark class="mb-2 mr-5" v-bind="attrs" v-on="on">
              <v-icon>person</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" v-if="editedIndex === -1">
                    <v-autocomplete :items="listStudents" return-object label="Maestro en formación*" item-value="value" item-text="nombre"
                      no-data-text="Maestro no registrado" :menu-props="{ maxHeight: 100 }"
                      v-model="editedItem.nombre2"></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete :items="items" return-object label="Grupo*" item-value="value" item-text="grupo"
                      no-data-text="Grupo no registrado" :menu-props="{ maxHeight: 100 }"
                      v-model="editedItem.grupo2"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" v-if="editedIndex !== -1">
                    <v-text-field label="Nombre" v-model="editedItem.nombre" disabled></v-text-field>
                  </v-col>
                  <v-col cols="12" v-if="editedIndex !== -1">
                    <v-text-field label="Grupo" v-model="editedItem.grupo" disabled></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Esta seguro de eliminar esta matricula?</v-card-title>
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
      <v-icon small class="mr-2" @click="editItem(item)"> edit </v-icon>
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
    dialogEnrollGruup: false,
    listSector: ['OFICIAL', 'PRIVADO'],
    headers: [
      {
        text: "Nombre",
        align: "start",
        sortable: false,
        value: "nombre",
      },
      { text: "Identificación", value: "identificacion" },
      { text: "Grupo", value: "grupo" },
      { text: "Acción", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    search: "",
    dialog: false,
    desserts: [],
    listStudents: [],
    listCampusByInstitution: [],
    editedItem: {},
    grupoAnterior: {},
    grupoActual: {},
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Matricular maestro en formación" : "Cambiar grupo";
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
  
    async getStudents() {
      let data = await axios.get("api/students");
      this.listStudents = await data.data.desserts;
    },

    async getStudentEnrroll() {
      let data = await axios.get("api/students/getStudentEnrroll");
      this.desserts = await data.data.desserts;
    },

    async getGroups() {
      let data = await axios.get("api/students/getGroups");
      this.items = await data.data.desserts;
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
      this.deleteEnroll(this.editedItem);
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
        this.updateEnroll(this.editedItem);
      } else {
        this.setEnroll(this.editedItem);
      }
      this.close();
    },

    async deleteEnroll(editedItem) {
      axios
        .delete(`api/students/${editedItem.id}`)
        .then(() => {
          this.getStudentEnrroll();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async updateEnroll(editedItem) {
      axios
        .put(`api/students/updateEnroll/${editedItem.id}`, {
          grupo_id: editedItem.grupo2.id,
        })
        .then(() => {
          this.getStudentEnrroll();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async setEnroll(editedItem) {
      axios
        .post(`api/students/saveEnroll`, {
          estudiante_id: editedItem.nombre2.id,
          grupo_id: editedItem.grupo2.id,
          periodo_id: 4,
        })
        .then(() => {
          this.getStudentEnrroll();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async saveEnrollGroup() {
      axios
        .post(`api/students/saveEnrollGroup`, {
          grupo_anterior: this.grupoAnterior.id,
          grupo_actual: this.grupoActual.id,
          periodo_id: 4,
        })
        .then(() => {
          this.getStudentEnrroll();
          this.dialogEnrollGruup = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

  },
  created() {
    this.getStudentEnrroll();
    this.getGroups();
    this.getStudents();
  },
};
</script>