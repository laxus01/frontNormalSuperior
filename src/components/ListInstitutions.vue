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
                <v-icon>add</v-icon><v-icon>maps_home_work</v-icon>
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
                      <v-text-field label="Institución*" v-model="editedItem.institucion" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="Rector" v-model="editedItem.rector" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="Teléfono" v-model="editedItem.telefono"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-select :items="listSector" v-model="editedItem.sector" density="compact" label="Sector"></v-select>
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
              <v-card-title class="text-h5">Esta seguro de eliminar esta institución?</v-card-title>
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
      listSector: ['OFICIAL', 'PRIVADO'],
      headers: [
        {
          text: "Institución",
          align: "start",
          sortable: false,
          value: "institucion",
        },
        { text: "Rector", value: "rector" },
        { text: "Telefono", value: "telefono" },
        { text: "Sector", value: "sector" },
        { text: "Acción", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      search: "",
      dialog: false,
      desserts: [],
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
  
      async getInstitutions() {
        let data = await axios.get("api/institutions");
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
        this.deleteInstitution(this.editedItem);
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
          this.updateInstitution(this.editedItem);
        } else {
          this.setInstitution(this.editedItem);
        }
        this.close();
      },
  
      async deleteInstitution(editedItem) {
        axios
          .put(`api/institutions/inactivate/${editedItem.id}`)
          .then(() => {
            this.getInstitutions();
          })
          .catch((err) => {
            console.log(err);
          });
      },
  
      async updateInstitution(editedItem) {
        axios
          .put(`api/institutions/update/${editedItem.id}`, {
            institucion: editedItem.institucion,
            rector: editedItem.rector,
            telefono: editedItem.telefono,
            sector: editedItem.sector,
          })
          .then(() => {
            this.getInstitutions();
          })
          .catch((err) => {
            console.log(err);
          });
      },
  
      async setInstitution(editedItem) {
        axios
          .post(`api/institutions`, {
            institucion: editedItem.institucion,
            rector: editedItem.rector,
            telefono: editedItem.telefono,
            sector: editedItem.sector,
          })
          .then(() => {
            this.getInstitutions();
          })
          .catch((err) => {
            console.log(err);
          });
      },
  
    },
    created() {
      this.getInstitutions();
    },
  };
  </script>
    