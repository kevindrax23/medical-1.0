<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold" href="#">
        <i class="bi bi-heart-pulse-fill text-primary me-2"></i>
        MediSystem
      </a>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item">
            <router-link to="/" class="nav-link">
              <i class="bi bi-house-door me-1"></i> Dashboard
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/appointments" class="nav-link">
              <i class="bi bi-calendar-check me-1"></i> Citas
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/patients" class="nav-link">
              <i class="bi bi-people me-1"></i> Pacientes
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/medical-records" class="nav-link">
              <i class="bi bi-file-medical me-1"></i> Historias
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              id="userDropdown" 
              role="button" 
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-person-circle me-1"></i>
              {{ userData?.name || 'Usuario' }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <router-link to="/settings" class="dropdown-item">
                  <i class="bi bi-gear me-2"></i>Configuración
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item text-danger" href="#" @click.prevent="handleLogout">
                  <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store'
import { logoutUser } from '../../services/authService'
import { computed } from 'vue'

const router = useRouter()
const userStore = useUserStore()
const userData = computed(() => userStore.userData)

const handleLogout = async () => {
  try {
    await logoutUser()
    userStore.clearUser()
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
</script>
