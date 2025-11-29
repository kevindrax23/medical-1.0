<template>
  <div class="sidebar" :class="{ collapsed: !sidebarExpanded }">
    <div class="sidebar-header">
      <div class="logo-section" v-if="sidebarExpanded">
        <i class="bi bi-heart-pulse-fill"></i>
        <span class="logo-text">MediSystem</span>
      </div>
      <i v-else class="bi bi-heart-pulse-fill text-primary fs-3"></i>
    </div>

    <nav class="sidebar-nav">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path"
        class="nav-item"
      >
        <i :class="item.icon"></i>
        <span v-if="sidebarExpanded" class="nav-text">{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info" v-if="sidebarExpanded && userData">
        <div class="user-avatar">
          <i class="bi bi-person-circle"></i>
        </div>
        <div class="user-details">
          <div class="user-name">{{ userData.name }}</div>
          <div class="user-role">{{ userData.specialty }}</div>
        </div>
      </div>
      <button class="toggle-btn" @click="toggleSidebar">
        <i class="bi" :class="sidebarExpanded ? 'bi-chevron-left' : 'bi-chevron-right'"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useUserStore } from '../../store'

const userStore = useUserStore()
const userData = computed(() => userStore.userData)
const sidebarExpanded = inject('sidebarExpanded')
const toggleSidebar = inject('toggleSidebar')

const menuItems = [
  { path: '/', icon: 'bi bi-speedometer2', label: 'Dashboard' },
  { path: '/appointments', icon: 'bi bi-calendar-check', label: 'Citas' },
  { path: '/patients', icon: 'bi bi-people', label: 'Pacientes' },
  { path: '/medical-records', icon: 'bi bi-file-medical', label: 'Historias Clínicas' },
  { path: '/settings', icon: 'bi bi-gear', label: 'Configuración' }
]
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 250px;
  background: #ffffff;
  border-right: 1px solid #dee2e6;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  transition: width 0.3s ease;
  z-index: 1040;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
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

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
  overflow-x: hidden;
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
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 1rem 0.5rem;
}

.nav-item i {
  font-size: 1.25rem;
  min-width: 24px;
}

.nav-item:hover {
  background-color: #f8f9fa;
  color: #0d6efd;
}

.nav-item.router-link-active {
  background: linear-gradient(90deg, rgba(13, 110, 253, 0.1) 0%, transparent 100%);
  color: #0d6efd;
  border-left: 3px solid #0d6efd;
}

.nav-text {
  font-weight: 500;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #dee2e6;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
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
  color: #212529;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: #6c757d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toggle-btn {
  width: 100%;
  padding: 0.5rem;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background-color: #f8f9fa;
  border-color: #0d6efd;
}

.toggle-btn i {
  font-size: 1rem;
  color: #6c757d;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.show {
    transform: translateX(0);
  }
}
</style>
