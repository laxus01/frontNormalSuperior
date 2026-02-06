<template>
  <v-app id="inspire">
    <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>
  </v-app>
</template>

<script>
import Menu from "./components/Menu.vue";

export default {
  name: "App",
  data() {
    return {
      drawer: null,
      token: "",
      currentBuildTimestamp: typeof __BUILD_TIMESTAMP__ !== 'undefined' ? __BUILD_TIMESTAMP__ : null
    };
  },
  components: {
    Menu,
  },
  methods: {
    async checkForUpdates() {
      try {
        const response = await fetch(window.location.origin + '/?_t=' + Date.now(), {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        const html = await response.text()
        const currentScripts = document.querySelectorAll('script[src]')
        const currentSrcs = Array.from(currentScripts).map(s => s.getAttribute('src'))
        const hasNewVersion = currentSrcs.some(src => src && !html.includes(src))
        if (hasNewVersion) {
          window.location.reload(true)
        }
      } catch (e) {
        // Silenciar errores de red
      }
    }
  },
  mounted() {
    // Verificar si hay nueva versión cada 5 minutos
    this._updateInterval = setInterval(() => {
      this.checkForUpdates()
    }, 5 * 60 * 1000)
  },
  beforeDestroy() {
    if (this._updateInterval) {
      clearInterval(this._updateInterval)
    }
  }
};
</script>

<style module>
.container {
  height: 650px;
  margin-top: 80px;
}
</style>
