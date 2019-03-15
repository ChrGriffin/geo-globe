<template>
  <div id="app">
    <globe></globe>
  </div>
</template>

<script>
import Globe from './components/Globe.vue'

export default {
  name: 'app',
  components: {
    Globe
  }
}
</script>

<style>
  body {
    background-color: #f9f9f9;
  }
</style>
