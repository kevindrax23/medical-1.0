<template>
  <div class="patients-container">
    <div class="patients-header">
      <div>
        <h2 class="mb-1">Gestión de Pacientes</h2>
        <p class="text-muted mb-0">Administra la información de tus pacientes</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline-primary" @click="importPatients">
          <i class="bi bi-upload me-2"></i>Importar
        </button>
        <button class="btn btn-primary" @click="openCreateModal">
          <i class="bi bi-plus-circle me-2"></i>Nuevo Paciente
        </button>
      </div>
    </div>

    <!-- Filtros Avanzados -->
    <div class="filters-card">
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label small">Buscar</label>
          <div class="search-input">
            <i class="bi bi-search"></i>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Nombre, email, teléfono..."
              v-model="searchQuery"
            >
          </div>
        </div>
        <div class="col-md-2">
          <label class="form-label small">Género</label>
          <select class="form-select" v-model="filterGender">
            <option value="">Todos</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div class="col-md-2">
          <label class="form-label small">Tipo de Sangre</label>
          <select class="form-select" v-model="filterBloodType">
            <option value="">Todos</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div class="col-md-2">
          <label class="form-label small">Rango de Edad</label>
          <select class="form-select" v-model="filterAgeRange">
            <option value="">Todos</option>
            <option value="0-18">0-18 años</option>
            <option value="19-35">19-35 años</option>
            <option value="36-60">36-60 años</option>
            <option value="60+">60+ años</option>
          </select>
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <button class="btn btn-outline-secondary w-100" @click="clearFilters">
            <i class="bi bi-x-circle me-1"></i>Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Estadísticas Rápidas -->
    <div class="quick-stats">
      <div class="stat-card">
        <div class="stat-icon bg-primary">
          <i class="bi bi-people-fill"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">Total Pacientes</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-success">
          <i class="bi bi-person-plus-fill"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.newThisMonth }}</div>
          <div class="stat-label">Nuevos Este Mes</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-warning">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.withAllergies }}</div>
          <div class="stat-label">Con Alergias</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-info">
          <i class="bi bi-heart-pulse-fill"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.chronic }}</div>
          <div class="stat-label">Enf. Crónicas</div>
        </div>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <!-- Vista de Tarjetas o Lista -->
    <div v-else>
      <div class="view-options">
        <div class="view-buttons">
          <button 
            class="view-btn" 
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          >
            <i class="bi bi-grid-3x3-gap"></i>
          </button>
          <button 
            class="view-btn" 
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            <i class="bi bi-list-ul"></i>
          </button>
        </div>
        <div class="sort-options">
          <label class="small me-2">Ordenar:</label>
          <select class="form-select form-select-sm" v-model="sortBy" style="width: auto;">
            <option value="name">Nombre</option>
            <option value="recent">Más Recientes</option>
            <option value="age">Edad</option>
          </select>
        </div>
      </div>

      <!-- Vista en Tarjetas -->
      <div v-if="viewMode === 'grid'" class="patients-grid">
        <div 
          v-for="patient in filteredPatients" 
          :key="patient.id"
          class="patient-card"
          @click="viewPatient(patient)"
        >
          <div class="patient-card-header">
            <div class="patient-avatar-large">
              {{ getInitials(patient.name) }}
            </div>
            <div class="patient-actions">
              <button class="btn-icon" @click.stop="openEditModal(patient)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn-icon" @click.stop="confirmDelete(patient)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          <div class="patient-card-body">
            <h6 class="patient-name">{{ patient.name }}</h6>
            <div class="patient-info">
              <span><i class="bi bi-calendar3 me-1"></i>{{ calculateAge(patient.birthDate) }} años</span>
              <span><i class="bi bi-gender-ambiguous me-1"></i>{{ patient.gender }}</span>
            </div>
            <div class="patient-info">
              <span><i class="bi bi-telephone me-1"></i>{{ patient.phone }}</span>
            </div>
            <div v-if="patient.bloodType" class="patient-blood">
              <span class="badge bg-danger">{{ patient.bloodType }}</span>
            </div>
            <div v-if="patient.allergies" class="patient-alert">
              <i class="bi bi-exclamation-triangle-fill text-warning me-1"></i>
              <small>Tiene alergias</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista en Lista -->
      <div v-if="viewMode === 'list'" class="card">
        <div class="card-body-custom">
          <PatientList 
            :patients="filteredPatients"
            @edit="openEditModal"
            @delete="confirmDelete"
            @view="viewPatient"
          />
        </div>
      </div>
    </div>

    <PatientForm 
      :show="showModal"
      :patient="selectedPatient"
      :mode="modalMode"
      @close="closeModal"
      @save="savePatient"
      @edit="openEditModal"
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
import { startOfMonth } from 'date-fns'

const userStore = useUserStore()
const loading = ref(true)
const patients = ref([])
const searchQuery = ref('')
const filterGender = ref('')
const filterBloodType = ref('')
const filterAgeRange = ref('')
const viewMode = ref('grid')
const sortBy = ref('name')
const showModal = ref(false)
const selectedPatient = ref(null)
const modalMode = ref('create')
const patientToDelete = ref(null)

const filteredPatients = computed(() => {
  let filtered = patients.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(patient => 
      patient.name.toLowerCase().includes(query) ||
      patient.email?.toLowerCase().includes(query) ||
      patient.phone?.includes(query)
    )
  }

  if (filterGender.value) {
    filtered = filtered.filter(patient => patient.gender === filterGender.value)
  }

  if (filterBloodType.value) {
    filtered = filtered.filter(patient => patient.bloodType === filterBloodType.value)
  }

  if (filterAgeRange.value) {
    filtered = filtered.filter(patient => {
      const age = calculateAge(patient.birthDate)
      if (filterAgeRange.value === '0-18') return age <= 18
      if (filterAgeRange.value === '19-35') return age >= 19 && age <= 35
      if (filterAgeRange.value === '36-60') return age >= 36 && age <= 60
      if (filterAgeRange.value === '60+') return age > 60
      return true
    })
  }

  // Ordenar
  if (sortBy.value === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'recent') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortBy.value === 'age') {
    filtered.sort((a, b) => calculateAge(a.birthDate) - calculateAge(b.birthDate))
  }

  return filtered
})

const stats = computed(() => {
  const startMonth = startOfMonth(new Date()).toISOString().split('T')[0]
  
  return {
    total: patients.value.length,
    newThisMonth: patients.value.filter(p => p.createdAt >= startMonth).length,
    withAllergies: patients.value.filter(p => p.allergies).length,
    chronic: patients.value.filter(p => p.chronicDiseases).length
  }
})

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

const getInitials = (name) => {
  if (!name) return '??'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0]
  }
  return name.substring(0, 2).toUpperCase()
}

const clearFilters = () => {
  searchQuery.value = ''
  filterGender.value = ''
  filterBloodType.value = ''
  filterAgeRange.value = ''
}

const importPatients = () => {
  alert('Función de importación en desarrollo...')
}

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

const viewPatient = (patient) => {
  modalMode.value = 'view'
  selectedPatient.value = patient
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

onMounted(() => {
  loadPatients()
})
</script>

<style scoped>
.patients-container {
  padding: 2rem;
}

.patients-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
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

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  font-size: 0.85rem;
  color: #718096;
}

.view-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-buttons {
  display: flex;
  gap: 0.5rem;
  background: white;
  padding: 0.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.view-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6c757d;
  font-size: 1.25rem;
}

.view-btn:hover {
  background: #f8f9fa;
}

.view-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.sort-options {
  display: flex;
  align-items: center;
}

.patients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.patient-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.patient-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.patient-card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.patient-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.patient-actions {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.3);
}

.patient-card-body {
  padding: 1.25rem;
}

.patient-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
  text-align: center;
}

.patient-info {
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 0.5rem;
}

.patient-blood {
  display: flex;
  justify-content: center;
  margin: 0.75rem 0;
}

.patient-alert {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #fff3cd;
  border-radius: 6px;
  margin-top: 0.75rem;
  font-size: 0.85rem;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-body-custom {
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .patients-container {
    padding: 1rem;
  }

  .patients-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .patients-grid {
    grid-template-columns: 1fr;
  }
}
</style>
