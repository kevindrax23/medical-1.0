<template>
  <aside class="sidebar" :class="{ collapsed: !sidebarExpanded }">
    <div class="sidebar-header">
      <transition name="fade" mode="out-in">
        <div v-if="sidebarExpanded" class="logo-section" key="expanded">
          <i class="bi bi-heart-pulse-fill"></i>
          <span class="logo-text">MediSystem</span>
        </div>
        <div v-else class="logo-icon" key="collapsed">
          <i class="bi bi-heart-pulse-fill"></i>
        </div>
      </transition>
    </div>

    <nav class="sidebar-nav">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :title="!sidebarExpanded ? item.label : ''"
      >
        <i :class="item.icon"></i>
        <transition name="fade">
          <span v-if="sidebarExpanded" class="nav-text">{{ item.label }}</span>
        </transition>
      </router-link>

      <!-- Separador -->
      <div class="nav-divider"></div>

      <!-- Botón de Cerrar Sesión -->
      <button 
        class="nav-item nav-logout"
        @click="showLogoutModal = true"
        :title="!sidebarExpanded ? 'Cerrar Sesión' : ''"
      >
        <i class="bi bi-box-arrow-right"></i>
        <transition name="fade">
          <span v-if="sidebarExpanded" class="nav-text">Cerrar Sesión</span>
        </transition>
      </button>
    </nav>

    <div class="sidebar-footer">
      <transition name="fade">
        <div v-if="sidebarExpanded && userData" class="user-info">
          <div class="user-avatar">
            <i class="bi bi-person-circle"></i>
          </div>
          <div class="user-details">
            <div class="user-name">{{ userData.name }}</div>
            <div class="user-role">{{ userData.specialty }}</div>
          </div>
        </div>
      </transition>
      <button class="toggle-btn" @click="toggleSidebar" :title="sidebarExpanded ? 'Contraer' : 'Expandir'">
        <i class="bi" :class="sidebarExpanded ? 'bi-chevron-left' : 'bi-chevron-right'"></i>
      </button>
    </div>

    <!-- Modal de Confirmación de Cerrar Sesión -->
    <LogoutModal 
      :show="showLogoutModal"
      @close="showLogoutModal = false"
      @confirm="handleLogout"
    />
  </aside>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store'
import { logoutUser } from '../../services/authService'
import LogoutModal from '../common/LogoutModal.vue'

const router = useRouter()
const userStore = useUserStore()
const userData = computed(() => userStore.userData)
const sidebarExpanded = inject('sidebarExpanded')
const toggleSidebar = inject('toggleSidebar')
const showLogoutModal = ref(false)

const menuItems = [
  { path: '/', icon: 'bi bi-speedometer2', label: 'Dashboard' },
  { path: '/appointments', icon: 'bi bi-calendar-check', label: 'Citas' },
  { path: '/patients', icon: 'bi bi-people', label: 'Pacientes' },
  { path: '/medical-records', icon: 'bi bi-file-medical', label: 'Historias Clínicas' },
  { path: '/reports', icon: 'bi bi-graph-up', label: 'Reportes' },
  { path: '/settings', icon: 'bi bi-gear', label: 'Configuración' }
]

const handleLogout = async () => {
  try {
    await logoutUser()
    userStore.clearUser()
    showLogoutModal.value = false
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    alert('Error al cerrar sesión. Por favor intenta nuevamente.')
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 250px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.08);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1050;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-section i {
  font-size: 2rem;
  color: white;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon i {
  font-size: 2rem;
  color: white;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  white-space: nowrap;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: #6c757d;
  text-decoration: none;
  transition: all 0.2s ease;
  gap: 1rem;
  white-space: nowrap;
  position: relative;
  border: none;
  background: transparent;
  width: 100%;
  cursor: pointer;
  text-align: left;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 1rem 0;
}

.nav-item i {
  font-size: 1.25rem;
  min-width: 24px;
  text-align: center;
}

.nav-item:hover {
  background-color: #f7fafc;
  color: #667eea;
}

.nav-item.router-link-active {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%);
  color: #667eea;
  border-left: 3px solid #667eea;
  font-weight: 600;
}

.nav-text {
  font-weight: 500;
}

.nav-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0.75rem 1rem;
}

.nav-logout {
  color: #e53e3e;
  margin-top: auto;
}

.nav-logout:hover {
  background-color: #fff5f5;
  color: #c53030;
}

.nav-logout i {
  color: inherit;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  background: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.user-avatar i {
  font-size: 2rem;
  color: #667eea;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: #2d3748;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: #718096;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toggle-btn {
  width: 100%;
  padding: 0.75rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn:hover {
  background: #edf2f7;
  border-color: #667eea;
}

.toggle-btn i {
  font-size: 1.1rem;
  color: #4a5568;
  transition: transform 0.2s ease;
}

.toggle-btn:hover i {
  color: #667eea;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.mobile-open {
    transform: translateX(0);
  }
}
</style>
