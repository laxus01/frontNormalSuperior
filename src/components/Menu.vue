<template>
  <v-list dense>
    <template>
      <v-list dense>
        <template>
          <div v-for="item in items" :key="item.title">
            <v-list-group
              v-if="item.items"
              v-model="item.active"
              :prepend-icon="item.action"
              no-action
              link
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="subItem in item.items"
                :key="subItem.title"
                :to="subItem.to"
              >
                <v-list-item-icon>
                  <v-icon v-text="subItem.action"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="subItem.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
            <v-list-item v-else :to="item.to" link>
              <v-list-item-icon>
                <v-icon v-text="item.action"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </template>
      </v-list>
    </template>
  </v-list>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      items: [   
        {
          action: "inventory",
          title: "Registros",
          items: [
            {
              action: "wb_shade",
              title: "Sedes",
              to: "/campus",
            },
            {
              action: "supervised_user_circle",
              title: "Grupos",
              to: "/groups",
            },
            {
              action: "folder_shared",
              title: "Matriculas",
              to: "/enrollment",
            },
            {
              action: "maps_home_work",
              title: "Instituciones",
              to: "/institutions",
            },
            {
              action: "face",
              title: "Maestros titulares",
              to: "/teachers",
            },
            {
              action: "face_6",
              title: "Maestros en formación",
              to: "/students",
            },
          ],
        },  
        {
          action: "assignment_ind",
          title: "Practicas",
          items: [
            {
              action: "how_to_reg",
              title: "Asignadas",
              to: "/practices",
            },
            {
              action: "person_remove",
              title: "Por asignar",
              to: "/assign",
            },
          ],
        },   
        {
          action: "assignment",
          title: "Informes",
          items: [
            {
              action: "checklist",
              title: "Consolidado notas",
              to: "/consolidated-ratings",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped></style>
