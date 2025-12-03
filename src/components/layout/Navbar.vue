<template>
  <nav class="navbar">
    <div class="container-fluid">
      <button 
        class="btn btn-link d-lg-none me-2 mobile-menu-btn" 
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

      <div class="navbar-actions">
        <div class="dropdown">
          <button 
            class="btn-icon position-relative" 
            id="notificationsDropdown"
            data-bs-toggle="dropdown"
          >
            <i class="bi bi-bell fs-5"></i>
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
            class="btn-icon" 
            id="userDropdown"
            data-bs-toggle="dropdown"
          >
            <i class="bi bi-person-circle fs-5"></i>
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
  }
])

const notificationCount = computed(() => notifications.value.length)

const handleSearch = () => {
  console.log('Buscando:', searchQuery.value)
}

const toggleMobileSidebar = () => {
  const sidebar = document.querySelector('.sidebar')
  if (sidebar) {
    sidebar.classList.toggle('mobile-open')
  }
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
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 1040;
  border-bottom: 1px solid #e2e8f0;
}

.mobile-menu-btn {
  color: #4a5568;
  padding: 0.5rem;
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
  color: #a0aec0;
}

.search-wrapper .form-control {
  padding-left: 2.5rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f7fafc;
}

.search-wrapper .form-control:focus {
  background: white;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f7fafc;
  border: none;
  color: #4a5568;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: #edf2f7;
  color: #667eea;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #f56565;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.notifications-dropdown {
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
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
  color: #2d3748;
}

.notification-time {
  font-size: 0.75rem;
  color: #a0aec0;
}

@media (max-width: 768px) {
  .navbar-search {
    display: none;
  }
}
</style>
