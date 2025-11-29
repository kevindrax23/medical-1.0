<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <div>
        <h2 class="mb-1">Dashboard</h2>
        <p class="text-muted mb-0">Bienvenido, {{ userData?.name }}</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline-primary" @click="refreshData">
          <i class="bi bi-arrow-clockwise me-2"></i>Actualizar
        </button>
        <button class="btn btn-primary" @click="$router.push('/appointments')">
          <i class="bi bi-plus-circle me-2"></i>Nueva Cita
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else>
      <!-- Tarjetas de Estadísticas -->
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">
            <i class="bi bi-calendar-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.todayAppointments }}</div>
            <div class="stat-label">Citas Hoy</div>
            <div class="stat-trend positive" v-if="trends.appointments > 0">
              <i class="bi bi-arrow-up"></i> +{{ trends.appointments }}% vs ayer
            </div>
          </div>
        </div>

        <div class="stat-card success">
          <div class="stat-icon">
            <i class="bi bi-people"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalPatients }}</div>
            <div class="stat-label">Total Pacientes</div>
            <div class="stat-trend positive" v-if="trends.patients > 0">
              <i class="bi bi-arrow-up"></i> +{{ trends.patients }} este mes
            </div>
          </div>
        </div>

        <div class="stat-card warning">
          <div class="stat-icon">
            <i class="bi bi-clock-history"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.pendingAppointments }}</div>
            <div class="stat-label">Citas Pendientes</div>
            <div class="stat-info">
              {{ stats.confirmedToday }} confirmadas hoy
            </div>
          </div>
        </div>

        <div class="stat-card info">
          <div class="stat-icon">
            <i class="bi bi-graph-up-arrow"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.monthlyRevenue }}</div>
            <div class="stat-label">Consultas del Mes</div>
            <div class="stat-trend positive">
              <i class="bi bi-arrow-up"></i> +12% vs mes anterior
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos y Tablas -->
      <div class="dashboard-grid">
        <!-- Calendario de Citas -->
        <div class="dashboard-card large">
          <div class="card-header-custom">
            <h5 class="mb-0">
              <i class="bi bi-calendar3 me-2"></i>Citas de la Semana
            </h5>
            <div class="card-actions">
              <button class="btn btn-sm btn-outline-primary" @click="$router.push('/appointments')">
                Ver Todas
              </button>
            </div>
          </div>
          <div class="card-body-custom">
            <AppointmentCalendar 
              :appointments="upcomingAppointments"
              :patients="patients"
              @select-appointment="viewAppointment"
            />
          </div>
        </div>

        <!-- Próximas Citas -->
        <div class="dashboard-card">
          <div class="card-header-custom">
            <h5 class="mb-0">
              <i class="bi bi-clock me-2"></i>Próximas Citas
            </h5>
          </div>
          <div class="card-body-custom">
            <div v-if="todayAppointments.length === 0" class="empty-state">
              <i class="bi bi-calendar-x fs-1 text-muted"></i>
              <p class="text-muted mt-2">No hay citas para hoy</p>
            </div>
            <div v-else class="appointments-list">
              <div 
                v-for="appointment in todayAppointments" 
                :key="appointment.id"
                class="appointment-item"
                @click="viewAppointment(appointment)"
              >
                <div class="appointment-time">
                  <i class="bi bi-clock"></i>
                  {{ appointment.time }}
                </div>
                <div class="appointment-details">
                  <div class="appointment-patient">{{ appointment.patientName }}</div>
                  <div class="appointment-reason">{{ appointment.reason || 'Consulta general' }}</div>
                </div>
                <span class="badge" :class="getStatusClass(appointment.status)">
                  {{ appointment.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pacientes Recientes -->
        <div class="dashboard-card">
          <div class="card-header-custom">
            <h5 class="mb-0">
              <i class="bi bi-person-plus me-2"></i>Pacientes Recientes
            </h5>
            <router-link to="/patients" class="text-decoration-none">
              Ver Todos
            </router-link>
          </div>
          <div class="card-body-custom">
            <div class="patients-list">
              <div 
                v-for="patient in recentPatients" 
                :key="patient.id"
                class="patient-item"
              >
                <div class="patient-avatar">
                  <i class="bi bi-person-circle"></i>
                </div>
                <div class="patient-info">
                  <div class="patient-name">{{ patient.name }}</div>
                  <div class="patient-meta">
                    {{ calculateAge(patient.birthDate) }} años · {{ patient.gender }}
                  </div>
                </div>
                <button class="btn btn-sm btn-outline-primary" @click="viewPatient(patient)">
                  <i class="bi bi-eye"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Estadísticas Mensuales -->
        <div class="dashboard-card">
          <div class="card-header-custom">
            <h5 class="mb-0">
              <i class="bi bi-bar-chart me-2"></i>Estadísticas del Mes
            </h5>
          </div>
          <div class="card-body-custom">
            <div class="stats-list">
              <div class="stats-item">
                <div class="stats-item-label">
                  <i class="bi bi-check-circle text-success"></i>
                  Citas Completadas
                </div>
                <div class="stats-item-value">{{ monthlyStats.completed }}</div>
              </div>
              <div class="stats-item">
                <div class="stats-item-label">
                  <i class="bi bi-x-circle text-danger"></i>
                  Citas Canceladas
                </div>
                <div class="stats-item-value">{{ monthlyStats.cancelled }}</div>
              </div>
              <div class="stats-item">
                <div class="stats-item-label">
                  <i class="bi bi-file-medical text-info"></i>
                  Historias Creadas
                </div>
                <div class="stats-item-value">{{ monthlyStats.records }}</div>
              </div>
              <div class="stats-item">
                <div class="stats-item-label">
                  <i class="bi bi-person-plus-fill text-primary"></i>
                  Nuevos Pacientes
                </div>
                <div class="stats-item-value">{{ monthlyStats.newPatients }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Accesos Rápidos -->
        <div class="dashboard-card">
          <div class="card-header-custom">
            <h5 class="mb-0">
              <i class="bi bi-lightning me-2"></i>Accesos Rápidos
            </h5>
          </div>
          <div class="card-body-custom">
            <div class="quick-actions">
              <button class="quick-action-btn" @click="$router.push('/appointments')">
                <i class="bi bi-calendar-plus"></i>
                <span>Nueva Cita</span>
              </button>
              <button class="quick-action-btn" @click="$router.push('/patients')">
                <i class="bi bi-person-plus"></i>
                <span>Nuevo Paciente</span>
              </button>
              <button class="quick-action-btn" @click="$router.push('/medical-records')">
                <i class="bi bi-file-earmark-plus"></i>
                <span>Nueva Historia</span>
              </button>
              <button class="quick-action-btn" @click="$router.push('/reports')">
                <i class="bi bi-file-text"></i>
                <span>Reportes</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Información de la Clínica -->
        <div class="dashboard-card">
          <div class="card-header-custom">
            <h5 class="mb-0">
              <i class="bi bi-hospital me-2"></i>Mi Clínica
            </h5>
          </div>
          <div class="card-body-custom">
            <div class="clinic-info">
              <div class="clinic-detail">
                <i class="bi bi-building"></i>
                <div>
                  <div class="clinic-label">Nombre</div>
                  <div class="clinic-value">{{ userData?.clinicName }}</div>
                </div>
              </div>
              <div class="clinic-detail">
                <i class="bi bi-heart-pulse"></i>
                <div>
                  <div class="clinic-label">Especialidad</div>
                  <div class="clinic-value">{{ userData?.specialty }}</div>
                </div>
              </div>
              <div class="clinic-detail">
                <i class="bi bi-envelope"></i>
                <div>
                  <div class="clinic-label">Email</div>
                  <div class="clinic-value">{{ userData?.email }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store'
import { getAppointments } from '../services/appointmentService'
import { getPatients } from '../services/patientService'
import { getMedicalRecords } from '../services/medicalRecordService'
import AppointmentCalendar from '../components/appointments/AppointmentCalendar.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import { format, startOfMonth, endOfMonth } from 'date-fns'

const router = useRouter()
const userStore = useUserStore()
const userData = computed(() => userStore.userData)
const loading = ref(true)
const appointments = ref([])
const patients = ref([])
const records = ref([])

const stats = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.value.filter(a => a.date === today).length
  const pendingAppointments = appointments.value.filter(a => a.status === 'Pendiente').length
  const confirmedToday = appointments.value.filter(a => a.date === today && a.status === 'Confirmada').length
  
  const startMonth = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  const monthlyRevenue = appointments.value.filter(a => a.date >= startMonth && a.status === 'Completada').length
  
  return {
    todayAppointments,
    totalPatients: patients.value.length,
    pendingAppointments,
    confirmedToday,
    monthlyRevenue
  }
})

const trends = computed(() => ({
  appointments: 15,
  patients: 8
}))

const todayAppointments = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return appointments.value
    .filter(a => a.date === today)
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 5)
})

const upcomingAppointments = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return appointments.value.filter(a => a.date >= today)
})

const recentPatients = computed(() => {
  return patients.value
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

const monthlyStats = computed(() => {
  const startMonth = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  const endMonth = format(endOfMonth(new Date()), 'yyyy-MM-dd')
  
  const monthAppointments = appointments.value.filter(a => a.date >= startMonth && a.date <= endMonth)
  const monthPatients = patients.value.filter(p => p.createdAt >= startMonth)
  const monthRecords = records.value.filter(r => r.date >= startMonth && r.date <= endMonth)
  
  return {
    completed: monthAppointments.filter(a => a.status === 'Completada').length,
    cancelled: monthAppointments.filter(a => a.status === 'Cancelada').length,
    records: monthRecords.length,
    newPatients: monthPatients.length
  }
})

const loadData = async () => {
  loading.value = true
  try {
    const userId = userStore.user.uid
    const [appointmentsData, patientsData, recordsData] = await Promise.all([
      getAppointments(userId),
      getPatients(userId),
      getMedicalRecords(userId)
    ])
    
    appointments.value = appointmentsData
    patients.value = patientsData
    records.value = recordsData
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadData()
}

const getStatusClass = (status) => {
  const classes = {
    'Pendiente': 'bg-warning text-dark',
    'Confirmada': 'bg-success',
    'Cancelada': 'bg-danger',
    'Completada': 'bg-info'
  }
  return classes[status] || 'bg-secondary'
}

const calculateAge = (birthDate) => {
  if (!birthDate) return 0
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

const viewAppointment = (appointment) => {
  router.push(`/appointments?id=${appointment.id}`)
}

const viewPatient = (patient) => {
  router.push(`/patients?id=${patient.id}`)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-card.primary .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.success .stat-icon {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.stat-card.warning .stat-icon {
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
}

.stat-card.info .stat-icon {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-trend, .stat-info {
  font-size: 0.8rem;
  color: #48bb78;
}

.stat-trend.positive {
  color: #48bb78;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  grid-column: span 4;
}

.dashboard-card.large {
  grid-column: span 8;
}

.card-header-custom {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body-custom {
  padding: 1.5rem;
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.appointment-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.appointment-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.appointment-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #0d6efd;
  min-width: 80px;
}

.appointment-details {
  flex: 1;
}

.appointment-patient {
  font-weight: 600;
  color: #2d3748;
}

.appointment-reason {
  font-size: 0.85rem;
  color: #718096;
}

.patients-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.patient-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.patient-item:hover {
  background: #f8f9fa;
}

.patient-avatar i {
  font-size: 2.5rem;
  color: #667eea;
}

.patient-info {
  flex: 1;
}

.patient-name {
  font-weight: 600;
  color: #2d3748;
}

.patient-meta {
  font-size: 0.85rem;
  color: #718096;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stats-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stats-item-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.stats-item-value {
  font-weight: 700;
  font-size: 1.25rem;
  color: #2d3748;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.quick-action-btn i {
  font-size: 1.5rem;
}

.clinic-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.clinic-detail {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.clinic-detail i {
  font-size: 1.5rem;
  color: #667eea;
}

.clinic-label {
  font-size: 0.8rem;
  color: #718096;
}

.clinic-value {
  font-weight: 600;
  color: #2d3748;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

@media (max-width: 1200px) {
  .dashboard-card.large {
    grid-column: span 12;
  }
  
  .dashboard-card {
    grid-column: span 6;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-card {
    grid-column: span 12;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
