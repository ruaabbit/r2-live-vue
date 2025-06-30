<script setup lang="ts">
import HLSPlayer from "./components/HLSPlayer.vue";
</script>

<template>
  <div id="app">
    <HLSPlayer />
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  width: 100%;
  height: 100vh;
  background-color: #000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    sans-serif;
}
</style>
