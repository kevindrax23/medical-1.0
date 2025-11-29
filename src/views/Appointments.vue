<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-md-6">
        <h2>Gestión de Citas</h2>
      </div>
      <div class="col-md-6 text-end">
        <button class="btn btn-primary" @click="openCreateModal">
          <i class="bi bi-plus-circle me-2"></i>Nueva Cita
        </button>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-md-4">
        <input 
          type="date" 
          class="form-control" 
          v-model="filterDate"
        >
      </div>
      <div class="col-md-4">
        <select class="form-select" v-model="filterStatus">
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Confirmada">Confirmada</option>
          <option value="Completada">Completada</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else>
      <div class="row mb-4">
        <div class="col-12">
          <AppointmentCalendar 
            :appointments="appointments"
            :patients="patients"
            @select-appointment="openEditModal"
          />
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <AppointmentList 
            :appointments="filteredAppointments"
            @edit="openEditModal"
            @delete="confirmDelete"
          />
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
import ConfirmModal from '../components/common/ConfirmModal.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import { Modal } from 'bootstrap'

const userStore = useUserStore()
const loading = ref(true)
const appointments = ref([])
const patients = ref([])
const filterDate = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const selectedAppointment = ref(null)
const modalMode = ref('create')
const appointmentToDelete = ref(null)

const filteredAppointments = computed(() => {
  let filtered = appointments.value

  if (filterDate.value) {
    filtered = filtered.filter(apt => apt.date === filterDate.value)
  }

  if (filterStatus.value) {
    filtered = filtered.filter(apt => apt.status === filterStatus.value)
  }

  return filtered
})

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

onMounted(() => {
  loadData()
})
</script>
