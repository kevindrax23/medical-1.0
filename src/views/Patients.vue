<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-md-6">
        <h2>Gestión de Pacientes</h2>
      </div>
      <div class="col-md-6 text-end">
        <button class="btn btn-primary" @click="openCreateModal">
          <i class="bi bi-plus-circle me-2"></i>Nuevo Paciente
        </button>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-md-6">
        <input 
          type="text" 
          class="form-control" 
          placeholder="Buscar paciente..."
          v-model="searchQuery"
        >
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="card">
      <div class="card-body">
        <PatientList 
          :patients="filteredPatients"
          @edit="openEditModal"
          @delete="confirmDelete"
          @view="viewPatient"
        />
      </div>
    </div>

    <PatientForm 
      :show="showModal"
      :patient="selectedPatient"
      :mode="modalMode"
      @close="closeModal"
      @save="savePatient"
    />

    <ConfirmModal 
      modal-id="deletePatientModal"
      title="Eliminar Paciente"
      message="¿Está seguro de que desea eliminar este paciente? Esta acción no se puede deshacer."
      @confirm="deletePatient"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../store'
import { getPatients, createPatient, updatePatient, deletePatient as deletePatientService } from '../services/patientService'
import PatientList from '../components/patients/PatientList.vue'
import PatientForm from '../components/patients/PatientForm.vue'
import ConfirmModal from '../components/common/ConfirmModal.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import { Modal } from 'bootstrap'

const userStore = useUserStore()
const loading = ref(true)
const patients = ref([])
const searchQuery = ref('')
const showModal = ref(false)
const selectedPatient = ref(null)
const modalMode = ref('create')
const patientToDelete = ref(null)

const filteredPatients = computed(() => {
  if (!searchQuery.value) return patients.value
  
  const query = searchQuery.value.toLowerCase()
  return patients.value.filter(patient => 
    patient.name.toLowerCase().includes(query) ||
    patient.email?.toLowerCase().includes(query) ||
    patient.phone?.includes(query)
  )
})

const loadPatients = async () => {
  loading.value = true
  try {
    const userId = userStore.user.uid
    patients.value = await getPatients(userId)
  } catch (error) {
    console.error('Error loading patients:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  modalMode.value = 'create'
  selectedPatient.value = null
  showModal.value = true
}

const openEditModal = (patient) => {
  modalMode.value = 'edit'
  selectedPatient.value = { ...patient }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedPatient.value = null
}

const savePatient = async (patientData) => {
  try {
    const userId = userStore.user.uid
    
    if (modalMode.value === 'create') {
      await createPatient(userId, patientData)
    } else {
      await updatePatient(userId, selectedPatient.value.id, patientData)
    }
    
    await loadPatients()
    closeModal()
  } catch (error) {
    console.error('Error saving patient:', error)
  }
}

const confirmDelete = (patient) => {
  patientToDelete.value = patient
  const modal = new Modal(document.getElementById('deletePatientModal'))
  modal.show()
}

const deletePatient = async () => {
  if (!patientToDelete.value) return
  
  try {
    const userId = userStore.user.uid
    await deletePatientService(userId, patientToDelete.value.id)
    await loadPatients()
    patientToDelete.value = null
  } catch (error) {
    console.error('Error deleting patient:', error)
  }
}

const viewPatient = (patient) => {
  modalMode.value = 'view'
  selectedPatient.value = patient
  showModal.value = true
}

onMounted(() => {
  loadPatients()
})
</script>
