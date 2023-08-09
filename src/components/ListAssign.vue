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
              <v-icon>person_remove</v-icon>
            </v-btn>
          </template>
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
                    <v-select :items="listType" density="compact" item-text="value" item-value="id"
                      v-model="defaultSelected" label="Tipo practica"></v-select>
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
    listSector: ['OFICIAL', 'PRIVADO'],
    defaultSelected: {
      id: "1",
      value: "INICIAL"
    },
    listType: [
      {
        id: "1",
        value: "INICIAL"
      },
      {
        id: "2",
        value: "INTERMEDIA"
      },
      {
        id: "3",
        value: "AVANZADA"
      }
    ],
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
    dialogDelete: false,
    desserts: [],
    listCampusByInstitution: [],
    editedItem: {},
    studentSelected: {}
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

    async getPracticesAssign() {
      let data = await axios.get("api/practices/getPracticesAssign");
      this.desserts = await data.data.desserts;
    },

    async getListStudentsAvailable() {
      let data = await axios.get("api/practices/getListStudentsAvailable");
      this.items = await data.data.desserts;
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

    async updateTeacher(editedItem) {
      axios
        .put(`api/teachers/update/${editedItem.id}`, {
          nombre: editedItem.nombre,
          telefono: editedItem.telefono,
          correo: editedItem.correo,
        })
        .then(() => {
          this.getPracticesAssign();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async setAssign(item) {
      axios
        .post(`api/practices`, {
          solicitud_id: this.editedItem.id,
          estudiante_id: item.id,
          tipopractica_id: this.defaultSelected,
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


    disabledForm() {
      if (
        Object.keys(this.studentSelected).length === 0
      ) {
        return true;
      }
    },

  },
  created() {
    this.getPracticesAssign();
    this.getListStudentsAvailable();
  },
};
</script>

<style>
.container {
  max-width: 3000px;
}
</style>
