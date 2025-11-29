<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-md-6">
        <h2>Historias Clínicas</h2>
      </div>
      <div class="col-md-6 text-end">
        <button class="btn btn-primary" @click="openCreateModal">
          <i class="bi bi-plus-circle me-2"></i>Nueva Historia Clínica
        </button>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-md-6">
        <select class="form-select" v-model="selectedPatientFilter">
          <option value="">Todos los pacientes</option>
          <option v-for="patient in patients" :key="patient.id" :value="patient.id">
            {{ patient.name }}
          </option>
        </select>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="card">
      <div class="card-body">
        <MedicalRecordsList 
          :records="filteredRecords"
          :patients="patients"
          @edit="openEditModal"
          @delete="confirmDelete"
          @view="viewRecord"
        />
      </div>
    </div>

    <MedicalRecordForm 
      :show="showModal"
      :record="selectedRecord"
      :patients="patients"
      :mode="modalMode"
      @close="closeModal"
      @save="saveRecord"
    />

    <ConfirmModal 
      modal-id="deleteMedicalRecordModal"
      title="Eliminar Historia Clínica"
      message="¿Está seguro de que desea eliminar esta historia clínica?"
      @confirm="deleteRecord"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../store'
import { getMedicalRecords, createMedicalRecord, updateMedicalRecord, deleteMedicalRecord as deleteMedicalRecordService } from '../services/medicalRecordService'
import { getPatients } from '../services/patientService'
import MedicalRecordsList from '../components/medical-records/MedicalRecordsList.vue'
import MedicalRecordForm from '../components/medical-records/MedicalRecordForm.vue'
import ConfirmModal from '../components/common/ConfirmModal.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import { Modal } from 'bootstrap'

const userStore = useUserStore()
const loading = ref(true)
const records = ref([])
const patients = ref([])
const selectedPatientFilter = ref('')
const showModal = ref(false)
const selectedRecord = ref(null)
const modalMode = ref('create')
const recordToDelete = ref(null)

const filteredRecords = computed(() => {
  if (!selectedPatientFilter.value) return records.value
  return records.value.filter(record => record.patientId === selectedPatientFilter.value)
})

const loadData = async () => {
  loading.value = true
  try {
    const userId = userStore.user.uid
    const [recordsData, patientsData] = await Promise.all([
      getMedicalRecords(userId),
      getPatients(userId)
    ])
    
    records.value = recordsData
    patients.value = patientsData
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  modalMode.value = 'create'
  selectedRecord.value = null
  showModal.value = true
}

const openEditModal = (record) => {
  modalMode.value = 'edit'
  selectedRecord.value = { ...record }
  showModal.value = true
}

const viewRecord = (record) => {
  modalMode.value = 'view'
  selectedRecord.value = record
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedRecord.value = null
}

const saveRecord = async (recordData) => {
  try {
    const userId = userStore.user.uid
    
    if (modalMode.value === 'create') {
      await createMedicalRecord(userId, recordData)
    } else {
      await updateMedicalRecord(userId, selectedRecord.value.id, recordData)
    }
    
    await loadData()
    closeModal()
  } catch (error) {
    console.error('Error saving record:', error)
  }
}

const confirmDelete = (record) => {
  recordToDelete.value = record
  const modal = new Modal(document.getElementById('deleteMedicalRecordModal'))
  modal.show()
}

const deleteRecord = async () => {
  if (!recordToDelete.value) return
  
  try {
    const userId = userStore.user.uid
    await deleteMedicalRecordService(userId, recordToDelete.value.id)
    await loadData()
    recordToDelete.value = null
  } catch (error) {
    console.error('Error deleting record:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>
