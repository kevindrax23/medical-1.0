<template>
  <div id="app">
    <LoadingSpinner v-if="loading" fullScreen />
    
    <template v-else>
      <!-- Vista con Sidebar y Navbar (solo para usuarios autenticados) -->
      <template v-if="isAuthenticated">
        <Sidebar />
        <div class="main-wrapper">
          <Navbar />
          <div class="main-content">
            <router-view />
          </div>
        </div>
      </template>
      
      <!-- Vista sin Sidebar (para Login y Register) -->
      <template v-else>
        <router-view />
      </template>
    </template>
  </div>
</template>

<script setup>
import { provide, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import Sidebar from './components/layout/Sidebar.vue'
import LoadingSpinner from './components/common/LoadingSpinner.vue'
import { useUserStore } from './store'
import { auth } from './services/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const router = useRouter()
const userStore = useUserStore()
const sidebarExpanded = ref(true)
const loading = ref(true)
const isAuthenticated = ref(false)

const toggleSidebar = () => {
  sidebarExpanded.value = !sidebarExpanded.value
}

provide('sidebarExpanded', sidebarExpanded)
provide('toggleSidebar', toggleSidebar)

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    loading.value = true
    
    if (user) {
      console.log('Usuario autenticado:', user.email)
      userStore.setUser(user)
      await userStore.fetchUserData(user.uid)
      isAuthenticated.value = true
      
      // Si está en login/register, redirigir al dashboard
      if (router.currentRoute.value.path === '/login' || 
          router.currentRoute.value.path === '/register') {
        router.push('/')
      }
    } else {
      console.log('Usuario no autenticado')
      userStore.clearUser()
      isAuthenticated.value = false
      
      // Si está en una ruta protegida, redirigir al login
      if (router.currentRoute.value.meta.requiresAuth) {
        router.push('/login')
      }
    }
    
    loading.value = false
  })
})

watch(sidebarExpanded, (newVal) => {
  if (newVal) {
    document.documentElement.style.setProperty('--sidebar-width', '250px')
  } else {
    document.documentElement.style.setProperty('--sidebar-width', '80px')
  }
})
</script>

<style>
:root {
  --sidebar-width: 250px;
}

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
  position: relative;
}

.main-wrapper {
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.main-content {
  min-height: calc(100vh - 80px);
}

@media (max-width: 768px) {
  .main-wrapper {
    margin-left: 0 !important;
  }
}
</style>
