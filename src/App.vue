<template>
  <div id="app">
    <template v-if="isAuthenticated">
      <Sidebar />
      <div class="main-wrapper">
        <Navbar />
        <div class="main-content">
          <router-view />
        </div>
      </div>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script setup>
import { computed, provide, ref } from 'vue'
import Navbar from './components/layout/Navbar.vue'
import Sidebar from './components/layout/Sidebar.vue'
import { useAuth } from './composables/useAuth'

const { isAuthenticated } = useAuth()
const sidebarExpanded = ref(true)

const toggleSidebar = () => {
  sidebarExpanded.value = !sidebarExpanded.value
}

provide('sidebarExpanded', sidebarExpanded)
provide('toggleSidebar', toggleSidebar)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-wrapper {
  margin-left: 250px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.main-content {
  flex: 1;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .main-wrapper {
    margin-left: 0 !important;
  }
}
</style>
