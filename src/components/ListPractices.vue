<template>
    <v-data-table :headers="headers" :items="desserts" :search="search" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field v-model="search" clearable append-icon="mdi-magnify" label="Filtrar" single-line hide-details></v-text-field>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" v-if="editedIndex === -1">
                      <v-autocomplete :items="items" return-object label="Sede*" item-value="value" item-text="sede"
                        no-data-text="Institución no registrada" :menu-props="{ maxHeight: 100 }"
                        v-model="editedItem.sede"></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="Nombre" v-model="editedItem.nombre" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="Teléfono" v-model="editedItem.telefono"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="Correo" v-model="editedItem.correo"></v-text-field>
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
    </v-data-table>
  </template>
      
  <script>
  const shortid = require("shortid");
  import axios from "axios";
  
  export default {
    data: () => ({
      items: [],
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
  
      async getPractices() {
        let data = await axios.get("api/practices");
        this.desserts = await data.data.desserts;
      },

      async getListCampusByInstitutionCampus() {
        let data = await axios.get("api/campus/listCampusByInstitution");
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
  
    },
    created() {
      this.getPractices();
      this.getListCampusByInstitutionCampus();
    },
  };
  </script>

  <style>
    .container {
        max-width: 3000px;
    }
  </style>
