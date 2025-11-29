<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white">
    <div class="container-fluid">
      <button 
        class="btn btn-link d-lg-none me-2" 
        @click="toggleMobileSidebar"
      >
        <i class="bi bi-list fs-4"></i>
      </button>

      <div class="navbar-search flex-grow-1">
        <div class="search-wrapper">
          <i class="bi bi-search"></i>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Buscar pacientes, citas..."
            v-model="searchQuery"
            @input="handleSearch"
          >
        </div>
      </div>

      <div class="navbar-actions d-flex align-items-center gap-3">
        <div class="dropdown">
          <button 
            class="btn btn-link position-relative" 
            id="notificationsDropdown"
            data-bs-toggle="dropdown"
          >
            <i class="bi bi-bell fs-4"></i>
            <span class="notification-badge" v-if="notificationCount > 0">
              {{ notificationCount }}
            </span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end notifications-dropdown">
            <li class="dropdown-header">
              Notificaciones
            </li>
            <li v-for="notification in notifications" :key="notification.id">
              <a class="dropdown-item" href="#">
                <div class="notification-item">
                  <i :class="notification.icon" class="text-primary"></i>
                  <div>
                    <div class="notification-title">{{ notification.title }}</div>
                    <div class="notification-time">{{ notification.time }}</div>
                  </div>
                </div>
              </a>
            </li>
            <li v-if="notifications.length === 0">
              <div class="dropdown-item text-center text-muted">
                No hay notificaciones
              </div>
            </li>
          </ul>
        </div>

        <div class="dropdown">
          <button 
            class="btn btn-link" 
            id="userDropdown"
            data-bs-toggle="dropdown"
          >
            <i class="bi bi-person-circle fs-4"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li class="dropdown-header">
              {{ userData?.name }}
            </li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <router-link to="/settings" class="dropdown-item">
                <i class="bi bi-gear me-2"></i>Configuración
              </router-link>
            </li>
            <li>
              <a class="dropdown-item text-danger" href="#" @click.prevent="handleLogout">
                <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store'
import { logoutUser } from '../../services/authService'

const router = useRouter()
const userStore = useUserStore()
const userData = computed(() => userStore.userData)
const searchQuery = ref('')

const notifications = ref([
  {
    id: 1,
    icon: 'bi bi-calendar-check',
    title: 'Cita próxima en 30 minutos',
    time: 'Hace 5 min'
  },
  {
    id: 2,
    icon: 'bi bi-person-plus',
    title: 'Nuevo paciente registrado',
    time: 'Hace 1 hora'
  }
])

const notificationCount = computed(() => notifications.value.length)

const handleSearch = () => {
  // Implementar búsqueda global
  console.log('Buscando:', searchQuery.value)
}

const toggleMobileSidebar = () => {
  // Implementar toggle para móvil
}

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

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 999;
}

.navbar-search {
  max-width: 500px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-wrapper i {
  position: absolute;
  left: 1rem;
  color: #6c757d;
}

.search-wrapper .form-control {
  padding-left: 2.5rem;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
}

.search-wrapper .form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notifications-dropdown {
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.notification-item i {
  font-size: 1.5rem;
}

.notification-title {
  font-weight: 500;
  font-size: 0.9rem;
}

.notification-time {
  font-size: 0.75rem;
  color: #6c757d;
}

.btn-link {
  color: #6c757d;
  text-decoration: none;
}

.btn-link:hover {
  color: #0d6efd;
}
</style>
