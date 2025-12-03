<template>
  <div class="appointments-container">
    <div class="appointments-header">
      <div>
        <h2 class="mb-1">Gestión de Citas</h2>
        <p class="text-muted mb-0">Administra tus citas médicas</p>
      </div>
      <button class="btn btn-primary" @click="openCreateModal">
        <i class="bi bi-plus-circle me-2"></i>Nueva Cita
      </button>
    </div>

    <!-- Filtros Avanzados -->
    <div class="filters-card">
      <div class="row g-3">
        <div class="col-md-3">
          <label class="form-label small">Buscar Paciente</label>
          <div class="search-input">
            <i class="bi bi-search"></i>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Nombre del paciente..."
              v-model="searchQuery"
            >
          </div>
        </div>
        <div class="col-md-2">
          <label class="form-label small">Fecha</label>
          <input 
            type="date" 
            class="form-control" 
            v-model="filterDate"
          >
        </div>
        <div class="col-md-2">
          <label class="form-label small">Estado</label>
          <select class="form-select" v-model="filterStatus">
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
        <div class="col-md-2">
          <label class="form-label small">Paciente</label>
          <select class="form-select" v-model="filterPatient">
            <option value="">Todos</option>
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">
              {{ patient.name }}
            </option>
          </select>
        </div>
        <div class="col-md-3 d-flex align-items-end">
          <button class="btn btn-outline-secondary me-2" @click="clearFilters">
            <i class="bi bi-x-circle me-1"></i>Limpiar
          </button>
          <button class="btn btn-outline-primary" @click="exportAppointments">
            <i class="bi bi-download me-1"></i>Exportar
          </button>
        </div>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else>
      <!-- Vista de Calendario -->
      <div class="view-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: currentView === 'calendar' }"
          @click="currentView = 'calendar'"
        >
          <i class="bi bi-calendar3 me-2"></i>Calendario
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: currentView === 'list' }"
          @click="currentView = 'list'"
        >
          <i class="bi bi-list-ul me-2"></i>Lista
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: currentView === 'timeline' }"
          @click="currentView = 'timeline'"
        >
          <i class="bi bi-clock-history me-2"></i>Línea de Tiempo
        </button>
      </div>

      <!-- Calendario View -->
      <div v-if="currentView === 'calendar'" class="dashboard-card">
        <div class="card-body-custom">
          <AppointmentCalendar 
            :appointments="filteredAppointments"
            :patients="patients"
            @select-appointment="openEditModal"
          />
        </div>
      </div>

      <!-- Lista View -->
      <div v-if="currentView === 'list'" class="dashboard-card">
        <div class="card-body-custom">
          <AppointmentList 
            :appointments="filteredAppointments"
            @edit="openEditModal"
            @delete="confirmDelete"
            @complete="markAsComplete"
          />
        </div>
      </div>

      <!-- Timeline View -->
      <div v-if="currentView === 'timeline'" class="dashboard-card">
        <div class="card-body-custom">
          <AppointmentTimeline 
            :appointments="filteredAppointments"
            @select="openEditModal"
          />
        </div>
      </div>

      <!-- Estadísticas Rápidas -->
      <div class="quick-stats">
        <div class="stat-item">
          <i class="bi bi-calendar-check text-success"></i>
          <div>
            <div class="stat-value">{{ stats.confirmed }}</div>
            <div class="stat-label">Confirmadas</div>
          </div>
        </div>
        <div class="stat-item">
          <i class="bi bi-clock text-warning"></i>
          <div>
            <div class="stat-value">{{ stats.pending }}</div>
            <div class="stat-label">Pendientes</div>
          </div>
        </div>
        <div class="stat-item">
          <i class="bi bi-check-circle text-info"></i>
          <div>
            <div class="stat-value">{{ stats.completed }}</div>
            <div class="stat-label">Completadas</div>
          </div>
        </div>
        <div class="stat-item">
          <i class="bi bi-x-circle text-danger"></i>
          <div>
            <div class="stat-value">{{ stats.cancelled }}</div>
            <div class="stat-label">Canceladas</div>
          </div>
        </div>
      </div>
    </div>

    <AppointmentForm 
      :show="showModal"
      :appointment="selectedAppointment"
      :patients="patients"
      :mode="modalMode"
      @close="closeModal"
      @save="saveAppointment"
    />

    <ConfirmModal 
      modal-id="deleteAppointmentModal"
      title="Cancelar Cita"
      message="¿Está seguro de que desea cancelar esta cita?"
      @confirm="deleteAppointment"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../store'
import { getAppointments, createAppointment, updateAppointment, deleteAppointment as deleteAppointmentService } from '../services/appointmentService'
import { getPatients } from '../services/patientService'
import AppointmentList from '../components/appointments/AppointmentList.vue'
import AppointmentForm from '../components/appointments/AppointmentForm.vue'
import AppointmentCalendar from '../components/appointments/AppointmentCalendar.vue'
import AppointmentTimeline from '../components/appointments/AppointmentTimeline.vue'
import ConfirmModal from '../components/common/ConfirmModal.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import { Modal } from 'bootstrap'

const userStore = useUserStore()
const loading = ref(true)
const appointments = ref([])
const patients = ref([])
const searchQuery = ref('')
const filterDate = ref('')
const filterStatus = ref('')
const filterPatient = ref('')
const currentView = ref('calendar')
const showModal = ref(false)
const selectedAppointment = ref(null)
const modalMode = ref('create')
const appointmentToDelete = ref(null)

const filteredAppointments = computed(() => {
  let filtered = appointments.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(apt => 
      apt.patientName?.toLowerCase().includes(query) ||
      apt.reason?.toLowerCase().includes(query)
    )
  }

  if (filterDate.value) {
    filtered = filtered.filter(apt => apt.date === filterDate.value)
  }

  if (filterStatus.value) {
    filtered = filtered.filter(apt => apt.status === filterStatus.value)
  }

  if (filterPatient.value) {
    filtered = filtered.filter(apt => apt.patientId === filterPatient.value)
  }

  return filtered
})

const stats = computed(() => ({
  confirmed: appointments.value.filter(a => a.status === 'Confirmada').length,
  pending: appointments.value.filter(a => a.status === 'Pendiente').length,
  completed: appointments.value.filter(a => a.status === 'Completada').length,
  cancelled: appointments.value.filter(a => a.status === 'Cancelada').length
}))

const loadData = async () => {
  loading.value = true
  try {
    const userId = userStore.user.uid
    const [appointmentsData, patientsData] = await Promise.all([
      getAppointments(userId),
      getPatients(userId)
    ])
    
    appointments.value = appointmentsData
    patients.value = patientsData
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  filterDate.value = ''
  filterStatus.value = ''
  filterPatient.value = ''
}

const exportAppointments = () => {
  alert('Exportando citas...')
}

const openCreateModal = () => {
  modalMode.value = 'create'
  selectedAppointment.value = null
  showModal.value = true
}

const openEditModal = (appointment) => {
  modalMode.value = 'edit'
  selectedAppointment.value = { ...appointment }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedAppointment.value = null
}

const saveAppointment = async (appointmentData) => {
  try {
    const userId = userStore.user.uid
    
    if (modalMode.value === 'create') {
      await createAppointment(userId, appointmentData)
    } else {
      await updateAppointment(userId, selectedAppointment.value.id, appointmentData)
    }
    
    await loadData()
    closeModal()
  } catch (error) {
    console.error('Error saving appointment:', error)
  }
}

const confirmDelete = (appointment) => {
  appointmentToDelete.value = appointment
  const modal = new Modal(document.getElementById('deleteAppointmentModal'))
  modal.show()
}

const deleteAppointment = async () => {
  if (!appointmentToDelete.value) return
  
  try {
    const userId = userStore.user.uid
    await deleteAppointmentService(userId, appointmentToDelete.value.id)
    await loadData()
    appointmentToDelete.value = null
  } catch (error) {
    console.error('Error deleting appointment:', error)
  }
}

const markAsComplete = async (appointment) => {
  try {
    const userId = userStore.user.uid
    await updateAppointment(userId, appointment.id, {
      ...appointment,
      status: 'Completada'
    })
    await loadData()
  } catch (error) {
    console.error('Error updating appointment:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.appointments-container {
  padding: 2rem;
}

.appointments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filters-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.search-input {
  position: relative;
}

.search-input i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-input .form-control {
  padding-left: 2.5rem;
}

.view-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: white;
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  color: #6c757d;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tab-btn:hover {
  background: #f8f9fa;
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.stat-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-item i {
  font-size: 2rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  font-size: 0.85rem;
  color: #718096;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-body-custom {
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .appointments-container {
    padding: 1rem;
  }

  .appointments-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .view-tabs {
    flex-direction: column;
  }
}
</style>
