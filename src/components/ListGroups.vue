<template>
  <v-data-table :headers="headers" :items="desserts" :search="search" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-text-field v-model="search" clearable append-icon="mdi-magnify" label="Filtrar" single-line hide-details></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialogDegree" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Nuevo Grado</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field label="Grado*" v-model="newDegree.grado"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="changeDialog">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="saveDegree"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn rounded color="blue darken-3" dark class="mb-2" v-bind="attrs" v-on="on">
              <v-icon>add</v-icon><v-icon>supervised_user_circle</v-icon>
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
                    <v-autocomplete :items="items" return-object label="Sede*" item-value="value" item-text="sede"
                      no-data-text="Institución no registrada" :menu-props="{ maxHeight: 100 }"
                      v-model="editedItem.sede"></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete prepend-icon="school" @click:prepend="changeDialog" :items="itemsDegree" return-object
                      item-value="value" item-text="grado" no-data-text="Grado no registrado" label="Grado"
                      :menu-props="{ maxHeight: 100 }" v-model="editedItem.grado"></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Grupo" v-model="editedItem.grupo"></v-text-field>
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
            <v-card-title class="text-h5">Esta seguro de eliminar este grupo?</v-card-title>
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
    dialogDegree: false,
    itemsDegree: [],
    newDegree: {},
    listCampusByInstitution: [],
    defaultItem: {
      sede: "",
      coordinador: "",
      telefono: "",
    },
    defaultNewDegree: {
      grado: "",
    },
    headers: [
      { text: "Institución", align: "start", value: "institucion", width: "30%" },
      { text: "Sede", value: "sede", width: "30%" },
      { text: "Grado", value: "grado", width: "15%" },
      { text: "Grupo", value: "grupo", width: "15%" },
      { text: "Acción", value: "actions", width: "10%", sortable: false },
    ],
    editedIndex: -1,
    search: "",
    dialog: false,
    desserts: [],
    editedItem: {},
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Grupo" : "Editar Grupo";
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

    changeDialog() {
      this.dialog = !this.dialog
      this.dialogDegree = !this.dialogDegree;
    },

    saveDegree() {
      this.setDegree(this.newDegree);
    },

    async getDegrees() {
      let data = await axios.get("api/campus/getDegrees");
      this.itemsDegree = await data.data.desserts;
    },

    async getListCampusByInstitutionCampus() {
      let data = await axios.get("api/campus/listCampusByInstitution");
      this.items = await data.data.desserts;
    },

    async getInstitutions() {
      let data = await axios.get("api/institutions");
      this.items = await data.data.desserts;
    },

    async getGroups() {
      let data = await axios.get("api/campus/getGroups");
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
      this.deleteGroup(this.editedItem);
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
        this.updateGroup(this.editedItem);
      } else {
        this.setGroup(this.editedItem);
      }
      this.close();
    },

    async deleteGroup(editedItem) {
      axios
        .put(`api/campus/inactivateGroup/${editedItem.id}`)
        .then(() => {
          this.getGroups();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async updateGroup(editedItem) {
      axios
        .put(`api/campus/updateGroup/${editedItem.id}`, {
          grado_id: editedItem.grado.id,
          grupo: editedItem.grupo,
        })
        .then(() => {
          this.getGroups();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async setGroup(editedItem) {
      axios
        .post(`api/campus/saveGroup`, {
          sede_id: editedItem.sede.id,
          grado_id: editedItem.grado.id,
          grupo: editedItem.grupo,
        })
        .then(() => {
          this.getGroups();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async setDegree(degreeItems) {
      axios
        .post(`api/campus/saveDegree`, {
          grado: degreeItems.grado,
        })
        .then(() => {
          this.getDegrees();
          this.changeDialog();
          this.newDegree = Object.assign({}, this.defaultNewDegree);
        })
        .catch((err) => {
          console.log(err);
        });
    },

  },
  created() {
    this.getGroups();
    this.getListCampusByInstitutionCampus();
    this.getDegrees();
  },
};
</script>  