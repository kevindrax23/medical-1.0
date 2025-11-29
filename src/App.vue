<template>
  <div id="app">
    <Navbar v-if="isAuthenticated" />
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Navbar from './components/layout/Navbar.vue'
import { useAuth } from './composables/useAuth'

const { isAuthenticated } = useAuth()
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
