<template>
  <v-data-table :headers="headers" :items="desserts" :search="search" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-text-field v-model="search" clearable append-icon="mdi-magnify" label="Filtrar" single-line hide-details></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialogSupervisor" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Nuevo Supervisor</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field label="Nombre*" v-model="newSupervisor.supervisor"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Teléfono*" v-model="newSupervisor.telefono"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="changeDialog">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="saveSupervisor"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn rounded color="blue darken-3" dark class="mb-2" v-bind="attrs" v-on="on">
              <v-icon>add</v-icon><v-icon>wb_shade</v-icon>
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
                    <v-col cols="12">
                      <v-autocomplete :items="items" return-object label="Institución*" item-value="value"
                        item-text="institucion" no-data-text="Institución no registrada" :menu-props="{ maxHeight: 100 }"
                        v-model="editedItem.institucion"></v-autocomplete>
                    </v-col>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Sede*" v-model="editedItem.sede" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Coordinador" v-model="editedItem.coordinador"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Teléfono" v-model="editedItem.telefono"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Dirección" v-model="editedItem.direccion"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete prepend-icon="person_add_alt" @click:prepend="changeDialog"
                      :items="itemsSupervisor" return-object item-value="value" item-text="supervisor"
                      no-data-text="Supervisor no registrado" label="Supervisor" :menu-props="{ maxHeight: 100 }"
                      v-model="editedItem.supervisor"></v-autocomplete>
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
            <v-card-title class="text-h5">Esta seguro de eliminar esta sede?</v-card-title>
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
    dialogSupervisor: false,
    itemsSupervisor: [],
    newSupervisor: {},
    defaultItem: {
      sede: "",
      coordinador: "",
      telefono: "",
    },
    defaultNewSupervisor: {
      supervisor: "",
      telefono: "",
    },
    headers: [
      { text: "Institución", align: "start", value: "institucion", width: "30%" },
      { text: "Sede", value: "sede", width: "20%" },
      { text: "Coordinador", value: "coordinador", width: "10%" },
      { text: "Telefono", value: "telefono", width: "10%" },
      { text: "Dirección", value: "direccion", width: "10%" },
      { text: "Supervisor", value: "supervisor", width: "10%" },
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
      return this.editedIndex === -1 ? "Nuevo Sede" : "Editar Sede";
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
      this.dialogSupervisor = !this.dialogSupervisor;
    },

    saveSupervisor() {
      this.setSupervisor(this.newSupervisor);
    },

    async getInstitutions() {
      let data = await axios.get("api/institutions");
      this.items = await data.data.desserts;
    },

    async getSupervisors() {
      let data = await axios.get("api/campus/getSupervisors");
      this.itemsSupervisor = await data.data.desserts;
    },

    async getCampus() {
      let data = await axios.get("api/campus");
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
      this.deleteCampus(this.editedItem);
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
        this.updateCampus(this.editedItem);
      } else {
        this.setCampus(this.editedItem);
      }
      this.close();
    },

    async deleteCampus(editedItem) {
      axios
        .put(`api/campus/inactivate/${editedItem.id}`)
        .then(() => {
          this.getCampus();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async updateCampus(editedItem) {
      axios
        .put(`api/campus/update/${editedItem.id}`, {
          sede: editedItem.sede,
          coordinador: editedItem.coordinador,
          telefono: editedItem.telefono,
          direccion: editedItem.direccion,
          supervisor_id: editedItem.supervisor.id,
        })
        .then(() => {
          this.getCampus();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async setCampus(editedItem) {
      axios
        .post(`api/campus`, {
          sede: editedItem.sede,
          coordinador: editedItem.coordinador,
          telefono: editedItem.telefono,
          direccion: editedItem.direccion,
          institucion_id: editedItem.institucion.id,
          supervisor_id: editedItem.supervisor.id,
        })
        .then(() => {
          this.getCampus();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async setSupervisor(supervisorItem) {
      axios
        .post(`api/campus/saveSupervisor`, {
          supervisor: supervisorItem.supervisor,
          telefono: supervisorItem.telefono,
        })
        .then(() => {
          this.getSupervisors();
          this.changeDialog();
          this.newSupervisor = Object.assign({}, this.defaultNewSupervisor);
        })
        .catch((err) => {
          console.log(err);
        });
    },

  },
  created() {
    this.getCampus();
    this.getInstitutions();
    this.getSupervisors();
  },
};
</script>
  