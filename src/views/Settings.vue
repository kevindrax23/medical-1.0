<template>
  <div class="settings-container">
    <div class="settings-header">
      <div>
        <h2 class="mb-1">Configuración</h2>
        <p class="text-muted mb-0">Personaliza tu perfil y las opciones de la clínica</p>
      </div>
    </div>

    <div class="settings-content">
      <!-- Sidebar de Navegación -->
      <div class="settings-sidebar">
        <div class="settings-menu">
          <button 
            class="settings-menu-item"
            :class="{ active: activeTab === 'profile' }"
            @click="activeTab = 'profile'"
          >
            <i class="bi bi-person-circle"></i>
            <span>Perfil Personal</span>
          </button>
          <button 
            class="settings-menu-item"
            :class="{ active: activeTab === 'clinic' }"
            @click="activeTab = 'clinic'"
          >
            <i class="bi bi-hospital"></i>
            <span>Configuración de Clínica</span>
          </button>
          <button 
            class="settings-menu-item"
            :class="{ active: activeTab === 'notifications' }"
            @click="activeTab = 'notifications'"
          >
            <i class="bi bi-bell"></i>
            <span>Notificaciones</span>
          </button>
          <button 
            class="settings-menu-item"
            :class="{ active: activeTab === 'security' }"
            @click="activeTab = 'security'"
          >
            <i class="bi bi-shield-lock"></i>
            <span>Seguridad</span>
          </button>
          <button 
            class="settings-menu-item"
            :class="{ active: activeTab === 'preferences' }"
            @click="activeTab = 'preferences'"
          >
            <i class="bi bi-sliders"></i>
            <span>Preferencias</span>
          </button>
          <button 
            class="settings-menu-item"
            :class="{ active: activeTab === 'backup' }"
            @click="activeTab = 'backup'"
          >
            <i class="bi bi-cloud-arrow-up"></i>
            <span>Respaldo y Exportación</span>
          </button>
        </div>
      </div>

      <!-- Contenido Principal -->
      <div class="settings-main">
        <!-- Perfil Personal -->
        <div v-if="activeTab === 'profile'" class="settings-panel">
          <h4 class="panel-title">Perfil Personal</h4>
          <UserSettings />
        </div>

        <!-- Configuración de Clínica -->
        <div v-if="activeTab === 'clinic'" class="settings-panel">
          <h4 class="panel-title">Configuración de la Clínica</h4>
          <ClinicSettings />
        </div>

        <!-- Notificaciones -->
        <div v-if="activeTab === 'notifications'" class="settings-panel">
          <h4 class="panel-title">Preferencias de Notificaciones</h4>
          <div class="notification-settings">
            <div class="notification-group">
              <h6 class="mb-3">Notificaciones por Email</h6>
              <div class="notification-item">
                <div class="notification-info">
                  <i class="bi bi-calendar-check text-primary"></i>
                  <div>
                    <div class="notification-label">Recordatorio de Citas</div>
                    <small class="text-muted">Recibe un email antes de cada cita</small>
                  </div>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" v-model="notifications.appointmentReminders">
                </div>
              </div>

              <div class="notification-item">
                <div class="notification-info">
                  <i class="bi bi-person-plus text-success"></i>
                  <div>
                    <div class="notification-label">Nuevos Pacientes</div>
                    <small class="text-muted">Notificación cuando se registra un nuevo paciente</small>
                  </div>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" v-model="notifications.newPatients">
                </div>
              </div>

              <div class="notification-item">
                <div class="notification-info">
                  <i class="bi bi-x-circle text-danger"></i>
                  <div>
                    <div class="notification-label">Citas Canceladas</div>
                    <small class="text-muted">Alerta cuando una cita es cancelada</small>
                  </div>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" v-model="notifications.cancelledAppointments">
                </div>
              </div>
            </div>

            <div class="notification-group">
              <h6 class="mb-3">Reportes Automáticos</h6>
              <div class="notification-item">
                <div class="notification-info">
                  <i class="bi bi-graph-up text-info"></i>
                  <div>
                    <div class="notification-label">Reporte Semanal</div>
                    <small class="text-muted">Resumen de actividades cada lunes</small>
                  </div>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" v-model="notifications.weeklyReport">
                </div>
              </div>

              <div class="notification-item">
                <div class="notification-info">
                  <i class="bi bi-calendar-month text-warning"></i>
                  <div>
                    <div class="notification-label">Reporte Mensual</div>
                    <small class="text-muted">Estadísticas mensuales el primer día del mes</small>
                  </div>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" v-model="notifications.monthlyReport">
                </div>
              </div>
            </div>

            <button class="btn btn-primary mt-3" @click="saveNotifications">
              <i class="bi bi-check-circle me-2"></i>Guardar Preferencias
            </button>
          </div>
        </div>

        <!-- Seguridad -->
        <div v-if="activeTab === 'security'" class="settings-panel">
          <h4 class="panel-title">Seguridad de la Cuenta</h4>
          <div class="security-settings">
            <div class="security-section">
              <h6 class="mb-3">Cambiar Contraseña</h6>
              <form @submit.prevent="changePassword">
                <div class="mb-3">
                  <label class="form-label">Contraseña Actual</label>
                  <input type="password" class="form-control" v-model="passwordForm.current">
                </div>
                <div class="mb-3">
                  <label class="form-label">Nueva Contraseña</label>
                  <input type="password" class="form-control" v-model="passwordForm.new">
                </div>
                <div class="mb-3">
                  <label class="form-label">Confirmar Nueva Contraseña</label>
                  <input type="password" class="form-control" v-model="passwordForm.confirm">
                </div>
                <button type="submit" class="btn btn-primary">
                  <i class="bi bi-shield-check me-2"></i>Cambiar Contraseña
                </button>
              </form>
            </div>

            <div class="security-section">
              <h6 class="mb-3">Sesiones Activas</h6>
              <div class="session-item">
                <div class="session-info">
                  <i class="bi bi-laptop text-primary"></i>
                  <div>
                    <div class="session-device">Windows - Chrome</div>
                    <small class="text-muted">Tu sesión actual</small>
                  </div>
                </div>
                <span class="badge bg-success">Activa</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Preferencias -->
        <div v-if="activeTab === 'preferences'" class="settings-panel">
          <h4 class="panel-title">Preferencias del Sistema</h4>
          <div class="preferences-settings">
            <div class="preference-group">
              <h6 class="mb-3">Apariencia</h6>
              <div class="mb-3">
                <label class="form-label">Tema</label>
                <select class="form-select" v-model="preferences.theme">
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Idioma</label>
                <select class="form-select" v-model="preferences.language">
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div class="preference-group">
              <h6 class="mb-3">Formato de Fecha y Hora</h6>
              <div class="mb-3">
                <label class="form-label">Formato de Fecha</label>
                <select class="form-select" v-model="preferences.dateFormat">
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Formato de Hora</label>
                <select class="form-select" v-model="preferences.timeFormat">
                  <option value="12">12 horas (AM/PM)</option>
                  <option value="24">24 horas</option>
                </select>
              </div>
            </div>

            <button class="btn btn-primary" @click="savePreferences">
              <i class="bi bi-check-circle me-2"></i>Guardar Preferencias
            </button>
          </div>
        </div>

        <!-- Respaldo y Exportación -->
        <div v-if="activeTab === 'backup'" class="settings-panel">
          <h4 class="panel-title">Respaldo y Exportación de Datos</h4>
          <div class="backup-settings">
            <div class="backup-option">
              <div class="backup-icon">
                <i class="bi bi-file-earmark-arrow-down"></i>
              </div>
              <div class="backup-info">
                <h6>Exportar Todos los Datos</h6>
                <p class="text-muted mb-2">Descarga una copia completa de todos tus datos en formato JSON</p>
                <button class="btn btn-outline-primary btn-sm" @click="exportAllData">
                  <i class="bi bi-download me-1"></i>Exportar JSON
                </button>
              </div>
            </div>

            <div class="backup-option">
              <div class="backup-icon">
                <i class="bi bi-file-excel"></i>
              </div>
              <div class="backup-info">
                <h6>Exportar Reportes</h6>
                <p class="text-muted mb-2">Genera reportes en Excel de pacientes, citas e historias clínicas</p>
                <button class="btn btn-outline-success btn-sm" @click="exportToExcel">
                  <i class="bi bi-file-excel me-1"></i>Exportar Excel
                </button>
              </div>
            </div>

            <div class="backup-option">
              <div class="backup-icon">
                <i class="bi bi-cloud-upload"></i>
              </div>
              <div class="backup-info">
                <h6>Respaldo Automático</h6>
                <p class="text-muted mb-2">Configura respaldos automáticos en la nube</p>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" v-model="autoBackup">
                  <label class="form-check-label">Activar respaldo automático</label>
                </div>
              </div>
            </div>

            <div class="alert alert-info mt-3">
              <i class="bi bi-info-circle me-2"></i>
              <strong>Último respaldo:</strong> Nunca
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserSettings from '../components/settings/UserSettings.vue'
import ClinicSettings from '../components/settings/ClinicSettings.vue'

const activeTab = ref('profile')
const notifications = ref({
  appointmentReminders: true,
  newPatients: true,
  cancelledAppointments: true,
  weeklyReport: false,
  monthlyReport: true
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const preferences = ref({
  theme: 'light',
  language: 'es',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24'
})

const autoBackup = ref(false)

const saveNotifications = () => {
  alert('Preferencias de notificaciones guardadas')
}

const changePassword = () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert('Las contraseñas no coinciden')
    return
  }
  alert('Contraseña cambiada exitosamente')
  passwordForm.value = { current: '', new: '', confirm: '' }
}

const savePreferences = () => {
  alert('Preferencias guardadas')
}

const exportAllData = () => {
  alert('Exportando todos los datos...')
}

const exportToExcel = () => {
  alert('Exportando a Excel...')
}
</script>

<style scoped>
.settings-container {
  padding: 2rem;
}

.settings-header {
  margin-bottom: 2rem;
}

.settings-content {
  display: flex;
  gap: 2rem;
}

.settings-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.settings-menu {
  background: white;
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 2rem;
}

.settings-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6c757d;
  font-weight: 500;
}

.settings-menu-item i {
  font-size: 1.25rem;
}

.settings-menu-item:hover {
  background: #f8f9fa;
}

.settings-menu-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.settings-main {
  flex: 1;
}

.settings-panel {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.panel-title {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
  color: #2d3748;
}

.notification-group, .security-section, .preference-group {
  margin-bottom: 2rem;
}

.notification-item, .session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.notification-info, .session-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notification-info i, .session-info i {
  font-size: 1.5rem;
}

.notification-label, .session-device {
  font-weight: 600;
  color: #2d3748;
}

.form-check-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.backup-option {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.backup-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.75rem;
  flex-shrink: 0;
}

.backup-info h6 {
  margin-bottom: 0.5rem;
  color: #2d3748;
}

@media (max-width: 768px) {
  .settings-container {
    padding: 1rem;
  }

  .settings-content {
    flex-direction: column;
  }

  .settings-sidebar {
    width: 100%;
  }

  .settings-menu {
    position: relative;
    top: 0;
  }
}
</style>
