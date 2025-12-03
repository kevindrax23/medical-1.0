<template>
  <div class="records-container">
    <div class="records-header">
      <div>
        <h2 class="mb-1">Historias Clínicas</h2>
        <p class="text-muted mb-0">Gestiona los registros médicos de tus pacientes</p>
      </div>
      <button class="btn btn-primary" @click="openCreateModal">
        <i class="bi bi-plus-circle me-2"></i>Nueva Historia Clínica
      </button>
    </div>

    <!-- Filtros -->
    <div class="filters-card">
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label small">Buscar</label>
          <div class="search-input">
            <i class="bi bi-search"></i>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Paciente, diagnóstico..."
              v-model="searchQuery"
            >
          </div>
        </div>
        <div class="col-md-3">
          <label class="form-label small">Paciente</label>
          <select class="form-select" v-model="selectedPatientFilter">
            <option value="">Todos los pacientes</option>
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">
              {{ patient.name }}
            </option>
          </select>
        </div>
        <div class="col-md-2">
          <label class="form-label small">Fecha Desde</label>
          <input type="date" class="form-control" v-model="dateFrom">
        </div>
        <div class="col-md-2">
          <label class="form-label small">Fecha Hasta</label>
          <input type="date" class="form-control" v-model="dateTo">
        </div>
        <div class="col-md-1 d-flex align-items-end">
          <button class="btn btn-outline-secondary w-100" @click="clearFilters">
            <i class="bi bi-x-circle"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="records-stats">
      <div class="stat-box">
        <i class="bi bi-file-medical-fill text-primary"></i>
        <div>
          <div class="stat-number">{{ stats.total }}</div>
          <div class="stat-text">Total Historias</div>
        </div>
      </div>
      <div class="stat-box">
        <i class="bi bi-calendar-week text-success"></i>
        <div>
          <div class="stat-number">{{ stats.thisWeek }}</div>
          <div class="stat-text">Esta Semana</div>
        </div>
      </div>
      <div class="stat-box">
        <i class="bi bi-capsule text-warning"></i>
        <div>
          <div class="stat-number">{{ stats.withPrescriptions }}</div>
          <div class="stat-text">Con Recetas</div>
        </div>
      </div>
      <div class="stat-box">
        <i class="bi bi-clipboard-data text-info"></i>
        <div>
          <div class="stat-number">{{ stats.withLabTests }}</div>
          <div class="stat-text">Con Exámenes</div>
        </div>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else>
      <!-- Tabs de Vista -->
      <div class="view-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: viewMode === 'cards' }"
          @click="viewMode = 'cards'"
        >
          <i class="bi bi-card-list me-2"></i>Tarjetas
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: viewMode === 'table' }"
          @click="viewMode = 'table'"
        >
          <i class="bi bi-table me-2"></i>Tabla
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: viewMode === 'timeline' }"
          @click="viewMode = 'timeline'"
        >
          <i class="bi bi-clock-history me-2"></i>Cronología
        </button>
      </div>

      <!-- Vista de Tarjetas -->
      <div v-if="viewMode === 'cards'" class="records-grid">
        <div 
          v-for="record in filteredRecords" 
          :key="record.id"
          class="record-card"
          @click="viewRecord(record)"
        >
          <div class="record-card-header">
            <div class="record-date">
              <i class="bi bi-calendar3"></i>
              {{ formatDate(record.date) }}
            </div>
            <div class="record-actions">
              <button class="btn-icon" @click.stop="openEditModal(record)" title="Editar">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn-icon" @click.stop="printRecord(record)" title="Imprimir">
                <i class="bi bi-printer"></i>
              </button>
              <button class="btn-icon text-danger" @click.stop="confirmDelete(record)" title="Eliminar">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          <div class="record-card-body">
            <div class="record-patient">
              <div class="patient-avatar-sm">
                {{ getInitials(getPatientName(record.patientId)) }}
              </div>
              <div>
                <h6 class="mb-0">{{ getPatientName(record.patientId) }}</h6>
                <small class="text-muted">{{ calculateAge(getPatientBirthDate(record.patientId)) }} años</small>
              </div>
            </div>
            
            <div class="record-section">
              <div class="section-label">
                <i class="bi bi-clipboard-pulse me-1"></i>Motivo de Consulta
              </div>
              <p class="section-content">{{ truncateText(record.chiefComplaint, 60) }}</p>
            </div>

            <div class="record-section">
              <div class="section-label">
                <i class="bi bi-stethoscope me-1"></i>Diagnóstico
              </div>
              <p class="section-content">{{ truncateText(record.diagnosis, 80) }}</p>
            </div>

            <div class="record-badges">
              <span v-if="record.prescription" class="record-badge bg-success">
                <i class="bi bi-capsule me-1"></i>Con Receta
              </span>
              <span v-if="record.labTests" class="record-badge bg-info">
                <i class="bi bi-clipboard-data me-1"></i>Con Exámenes
              </span>
              <span v-if="record.followUpDate" class="record-badge bg-warning text-dark">
                <i class="bi bi-calendar-check me-1"></i>Seguimiento
              </span>
            </div>

            <div v-if="record.vitals" class="vitals-summary">
              <div class="vital-item" v-if="record.vitals.temperature">
                <i class="bi bi-thermometer-half"></i>
                <span>{{ record.vitals.temperature }}°C</span>
              </div>
              <div class="vital-item" v-if="record.vitals.bloodPressure">
                <i class="bi bi-heart-pulse"></i>
                <span>{{ record.vitals.bloodPressure }}</span>
              </div>
              <div class="vital-item" v-if="record.vitals.heartRate">
                <i class="bi bi-activity"></i>
                <span>{{ record.vitals.heartRate }} bpm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista de Tabla -->
      <div v-if="viewMode === 'table'" class="card">
        <div class="card-body-custom">
          <div class="table-actions">
            <button class="btn btn-sm btn-outline-primary" @click="exportToExcel">
              <i class="bi bi-file-excel me-1"></i>Exportar Excel
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="exportToPDF">
              <i class="bi bi-file-pdf me-1"></i>Exportar PDF
            </button>
          </div>
          <MedicalRecordsList 
            :records="filteredRecords"
            :patients="patients"
            @edit="openEditModal"
            @delete="confirmDelete"
            @view="viewRecord"
          />
        </div>
      </div>

      <!-- Vista de Cronología -->
      <div v-if="viewMode === 'timeline'" class="timeline-view">
        <div v-for="(group, patientId) in recordsByPatient" :key="patientId" class="patient-timeline">
          <div class="patient-timeline-header">
            <div class="patient-avatar-md">
              {{ getInitials(getPatientName(patientId)) }}
            </div>
            <div>
              <h5 class="mb-0">{{ getPatientName(patientId) }}</h5>
              <p class="text-muted mb-0 small">{{ group.length }} registro(s)</p>
            </div>
          </div>
          <div class="timeline-line">
            <div 
              v-for="record in group" 
              :key="record.id"
              class="timeline-record"
              @click="viewRecord(record)"
            >
              <div class="timeline-dot"></div>
              <div class="timeline-record-content">
                <div class="timeline-record-date">{{ formatDate(record.date) }}</div>
                <div class="timeline-record-diagnosis">{{ record.diagnosis }}</div>
                <div class="timeline-record-treatment">{{ truncateText(record.treatment, 100) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar -->
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
import { format, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import { generateMedicalRecordPDF } from '../utils/pdfGenerator'

const userStore = useUserStore()
const loading = ref(true)
const records = ref([])
const patients = ref([])
const searchQuery = ref('')
const selectedPatientFilter = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const viewMode = ref('cards')
const showModal = ref(false)
const selectedRecord = ref(null)
const modalMode = ref('create')
const recordToDelete = ref(null)

const filteredRecords = computed(() => {
  let filtered = records.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(record => 
      getPatientName(record.patientId).toLowerCase().includes(query) ||
      record.diagnosis?.toLowerCase().includes(query) ||
      record.chiefComplaint?.toLowerCase().includes(query)
    )
  }

  if (selectedPatientFilter.value) {
    filtered = filtered.filter(record => record.patientId === selectedPatientFilter.value)
  }

  if (dateFrom.value) {
    filtered = filtered.filter(record => record.date >= dateFrom.value)
  }

  if (dateTo.value) {
    filtered = filtered.filter(record => record.date <= dateTo.value)
  }

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const recordsByPatient = computed(() => {
  const grouped = {}
  filteredRecords.value.forEach(record => {
    if (!grouped[record.patientId]) {
      grouped[record.patientId] = []
    }
    grouped[record.patientId].push(record)
  })
  return grouped
})

const stats = computed(() => {
  const weekStart = startOfWeek(new Date()).toISOString().split('T')[0]
  
  return {
    total: records.value.length,
    thisWeek: records.value.filter(r => r.date >= weekStart).length,
    withPrescriptions: records.value.filter(r => r.prescription).length,
    withLabTests: records.value.filter(r => r.labTests).length
  }
})

const getPatientName = (patientId) => {
  const patient = patients.value.find(p => p.id === patientId)
  return patient ? patient.name : 'Desconocido'
}

const getPatientBirthDate = (patientId) => {
  const patient = patients.value.find(p => p.id === patientId)
  return patient ? patient.birthDate : null
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

const getInitials = (name) => {
  if (!name) return '??'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0]
  }
  return name.substring(0, 2).toUpperCase()
}

const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es })
  } catch {
    return dateString
  }
}

const truncateText = (text, maxLength) => {
  if (!text) return 'N/A'
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedPatientFilter.value = ''
  dateFrom.value = ''
  dateTo.value = ''
}

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

const printRecord = async (record) => {
  try {
    const patientName = getPatientName(record.patientId)
    const patientData = patients.value.find(p => p.id === record.patientId) || {}

    await generateMedicalRecordPDF({
      ...record,
      patientName,
      patientData
    })
  } catch (error) {
    console.error('Error al generar PDF:', error)
    alert('Error al generar el PDF')
  }
}

const exportToExcel = () => {
  alert('Exportando a Excel...')
}

const exportToPDF = () => {
  alert('Exportando a PDF...')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.records-container {
  padding: 2rem;
}

.records-header {
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

.records-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-box {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-box i {
  font-size: 2rem;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-text {
  font-size: 0.85rem;
  color: #718096;
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

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.record-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.record-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.record-card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.record-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #667eea;
}

.record-actions {
  display: flex;
  gap: 0.25rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: white;
  color: #667eea;
}

.record-card-body {
  padding: 1.25rem;
}

.record-patient {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.patient-avatar-sm {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.record-section {
  margin-bottom: 1rem;
}

.section-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.25rem;
}

.section-content {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

.record-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.record-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.vitals-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.vital-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #4a5568;
}

.vital-item i {
  color: #667eea;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: flex-end;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-body-custom {
  padding: 1.5rem;
}

.timeline-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.patient-timeline {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.patient-timeline-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.patient-avatar-md {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
}

.timeline-line {
  position: relative;
  padding-left: 2rem;
}

.timeline-line::before {
  content: '';
  position: absolute;
  left: 0.5rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #667eea 0%, transparent 100%);
}

.timeline-record {
  position: relative;
  margin-bottom: 1.5rem;
  cursor: pointer;
}

.timeline-dot {
  position: absolute;
  left: -1.5rem;
  top: 0.5rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #667eea;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #667eea;
}

.timeline-record-content {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.timeline-record:hover .timeline-record-content {
  background: #e9ecef;
  transform: translateX(4px);
}

.timeline-record-date {
  font-weight: 600;
  color: #667eea;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.timeline-record-diagnosis {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.timeline-record-treatment {
  color: #718096;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .records-container {
    padding: 1rem;
  }

  .records-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .records-grid {
    grid-template-columns: 1fr;
  }
}
</style>
