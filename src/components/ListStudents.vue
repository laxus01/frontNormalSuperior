<template>
    <v-data-table :headers="headers" :items="desserts" :search="search" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field v-model="search" clearable append-icon="mdi-magnify" label="Filtrar" single-line hide-details></v-text-field>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn rounded color="blue darken-3" dark class="mb-2" v-bind="attrs" v-on="on">
                <v-icon>add</v-icon><v-icon>face_6</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field label="Identificación" v-model="editedItem.identificacion" required></v-text-field>
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
              <v-card-title class="text-h5">Esta seguro de realizar esta acción?</v-card-title>
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
        <v-icon small class="mr-2" @click="deleteItem(item)"> 
          {{ item.estado === 'RETIRADO' ? 'how_to_reg' : item.estado === 'ACTIVO' && 'person_remove' }}  
        </v-icon>
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
          text: "Nombre",
          align: "start",
          sortable: false,
          value: "nombre",
        },
        { text: "Identificación", value: "identificacion" },
        { text: "Telefono", value: "telefono" },
        { text: "Correo", value: "correo" },
        { text: "Estado", value: "estado" },
        { text: "Acción", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      search: "",
      dialog: false,
      desserts: [],
      listCampusByInstitution: [],
      editedItem: {},
    }),
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? "Nuevo maestro en formación" : "Editar maestro en formación";
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
        this.deleteStudent(this.editedItem);
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
          this.updateStudent(this.editedItem);
        } else {
          this.setStudent(this.editedItem);
        }
        this.close();
      },
  
      async deleteStudent(editedItem) {
        axios
          .put(`api/students/changeStateStudent/${editedItem.id}/state/${editedItem.estado}`)
          .then(() => {
            this.getStudents();
          })
          .catch((err) => {
            console.log(err);
          });
      },
  
      async updateStudent(editedItem) {
        axios
          .put(`api/students/update/${editedItem.id}`, {
            identificacion: editedItem.identificacion,
            nombre: editedItem.nombre,
            telefono: editedItem.telefono,
            correo: editedItem.correo,
          })
          .then(() => {
            this.getStudents();
          })
          .catch((err) => {
            console.log(err);
          });
      },
  
      async setStudent(editedItem) {
        axios
          .post(`api/students`, {
            identificacion: editedItem.identificacion,
            nombre: editedItem.nombre,
            telefono: editedItem.telefono,
            correo: editedItem.correo,
          })
          .then(() => {
            this.getStudents();
          })
          .catch((err) => {
            console.log(err);
          });
      },
  
    },
    created() {
      this.getStudents();
    },
  };
  </script>
    