<template>
  <div class="reports-container">
    <div class="reports-header">
      <div>
        <h2 class="mb-1">Reportes y Estadísticas</h2>
        <p class="text-muted mb-0">Análisis detallado de tu clínica</p>
      </div>
      <div class="header-actions">
        <select class="form-select" v-model="selectedPeriod" @change="loadReports">
          <option value="week">Esta Semana</option>
          <option value="month">Este Mes</option>
          <option value="year">Este Año</option>
          <option value="custom">Personalizado</option>
        </select>
        <button class="btn btn-primary" @click="exportReport">
          <i class="bi bi-download me-2"></i>Exportar PDF
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else>
      <!-- Resumen Ejecutivo -->
      <div class="executive-summary">
        <div class="summary-card">
          <div class="summary-header">
            <i class="bi bi-graph-up-arrow"></i>
            <span>Tasa de Ocupación</span>
          </div>
          <div class="summary-value">{{ occupancyRate }}%</div>
          <div class="summary-trend positive">
            <i class="bi bi-arrow-up"></i> +5% vs período anterior
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-header">
            <i class="bi bi-cash-coin"></i>
            <span>Ingresos Estimados</span>
          </div>
          <div class="summary-value">${{ formatMoney(estimatedRevenue) }}</div>
          <div class="summary-trend positive">
            <i class="bi bi-arrow-up"></i> +12% vs período anterior
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-header">
            <i class="bi bi-person-check"></i>
            <span>Tasa de Retención</span>
          </div>
          <div class="summary-value">{{ retentionRate }}%</div>
          <div class="summary-trend positive">
            <i class="bi bi-arrow-up"></i> +3% vs período anterior
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-header">
            <i class="bi bi-star-fill"></i>
            <span>Satisfacción Promedio</span>
          </div>
          <div class="summary-value">{{ averageSatisfaction }}/5</div>
          <div class="summary-info">Basado en {{ totalReviews }} opiniones</div>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="charts-grid">
        <!-- Citas por Estado -->
        <div class="chart-card">
          <div class="chart-header">
            <h5>Citas por Estado</h5>
            <select class="form-select form-select-sm" style="width: auto;">
              <option>Último Mes</option>
              <option>Últimos 3 Meses</option>
              <option>Último Año</option>
            </select>
          </div>
          <div class="chart-body">
            <canvas ref="appointmentStatusChart"></canvas>
          </div>
        </div>

        <!-- Consultas por Día -->
        <div class="chart-card">
          <div class="chart-header">
            <h5>Consultas por Día de la Semana</h5>
          </div>
          <div class="chart-body">
            <canvas ref="appointmentsByDayChart"></canvas>
          </div>
        </div>

        <!-- Pacientes Nuevos vs Recurrentes -->
        <div class="chart-card">
          <div class="chart-header">
            <h5>Pacientes Nuevos vs Recurrentes</h5>
          </div>
          <div class="chart-body">
            <canvas ref="patientsTypeChart"></canvas>
          </div>
        </div>

        <!-- Top Diagnósticos -->
        <div class="chart-card">
          <div class="chart-header">
            <h5>Diagnósticos Más Frecuentes</h5>
          </div>
          <div class="chart-body">
            <div class="top-items-list">
              <div v-for="(diagnosis, index) in topDiagnoses" :key="index" class="top-item">
                <div class="top-item-info">
                  <span class="top-item-rank">{{ index + 1}}</span>
                  <span class="top-item-name">{{ diagnosis.name }}</span>
                </div>
                <div class="top-item-count">{{ diagnosis.count }} casos</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Horarios Pico -->
        <div class="chart-card">
          <div class="chart-header">
            <h5>Horarios de Mayor Demanda</h5>
          </div>
          <div class="chart-body">
            <div class="heatmap">
              <div v-for="hour in peakHours" :key="hour.time" class="heatmap-item">
                <div class="heatmap-label">{{ hour.time }}</div>
                <div class="heatmap-bar" :style="{ width: hour.percentage + '%' }">
                  <span>{{ hour.count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Edad de Pacientes -->
        <div class="chart-card">
          <div class="chart-header">
            <h5>Distribución por Edad</h5>
          </div>
          <div class="chart-body">
            <canvas ref="ageDistributionChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Tabla Detallada -->
      <div class="detailed-report-card">
        <div class="card-header-custom">
          <h5 class="mb-0">
            <i class="bi bi-table me-2"></i>Reporte Detallado de Consultas
          </h5>
          <button class="btn btn-sm btn-outline-primary" @click="exportTable">
            <i class="bi bi-file-excel me-1"></i>Exportar Excel
          </button>
        </div>
        <div class="card-body-custom">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Paciente</th>
                  <th>Tipo de Consulta</th>
                  <th>Diagnóstico</th>
                  <th>Duración</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in detailedRecords" :key="record.id">
                  <td>{{ formatDate(record.date) }}</td>
                  <td>{{ record.patientName }}</td>
                  <td>{{ record.consultationType }}</td>
                  <td>{{ truncateText(record.diagnosis, 40) }}</td>
                  <td>{{ record.duration }} min</td>
                  <td>
                    <span class="badge" :class="getStatusClass(record.status)">
                      {{ record.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../store'
import { getAppointments } from '../services/appointmentService'
import { getPatients } from '../services/patientService'
import { getMedicalRecords } from '../services/medicalRecordService'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const userStore = useUserStore()
const loading = ref(true)
const selectedPeriod = ref('month')
const appointments = ref([])
const patients = ref([])
const records = ref([])

const occupancyRate = computed(() => 78)
const estimatedRevenue = computed(() => 45000)
const retentionRate = computed(() => 85)
const averageSatisfaction = computed(() => 4.5)
const totalReviews = computed(() => 120)

const topDiagnoses = computed(() => [
  { name: 'Hipertensión Arterial', count: 45 },
  { name: 'Diabetes Mellitus Tipo 2', count: 38 },
  { name: 'Infección Respiratoria', count: 32 },
  { name: 'Gastritis', count: 28 },
  { name: 'Control Prenatal', count: 25 }
])

const peakHours = computed(() => [
  { time: '08:00 - 09:00', count: 12, percentage: 60 },
  { time: '09:00 - 10:00', count: 18, percentage: 90 },
  { time: '10:00 - 11:00', count: 20, percentage: 100 },
  { time: '11:00 - 12:00', count: 15, percentage: 75 },
  { time: '14:00 - 15:00', count: 16, percentage: 80 },
  { time: '15:00 - 16:00', count: 14, percentage: 70 },
  { time: '16:00 - 17:00', count: 10, percentage: 50 }
])

const detailedRecords = computed(() => {
  return records.value.slice(0, 10).map(record => ({
    ...record,
    consultationType: 'Consulta General',
    duration: 30,
    status: 'Completada'
  }))
})

const formatMoney = (value) => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
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

const getStatusClass = (status) => {
  const classes = {
    'Completada': 'bg-success',
    'Pendiente': 'bg-warning text-dark',
    'Cancelada': 'bg-danger'
  }
  return classes[status] || 'bg-secondary'
}

const loadReports = async () => {
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
    console.error('Error loading reports:', error)
  } finally {
    loading.value = false
  }
}

const exportReport = () => {
  alert('Exportando reporte en PDF...')
}

const exportTable = () => {
  alert('Exportando tabla en Excel...')
}

onMounted(() => {
  loadReports()
})
</script>

<style scoped>
.reports-container {
  padding: 2rem;
}

.reports-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.executive-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.summary-header i {
  font-size: 1.25rem;
}

.summary-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.summary-trend {
  font-size: 0.85rem;
}

.summary-trend.positive {
  color: #48bb78;
}

.summary-info {
  font-size: 0.85rem;
  color: #718096;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.chart-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h5 {
  margin: 0;
  font-size: 1.1rem;
  color: #2d3748;
}

.chart-body {
  padding: 1.5rem;
}

.top-items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.top-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.top-item-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.top-item-rank {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.top-item-name {
  font-weight: 600;
  color: #2d3748;
}

.top-item-count {
  color: #718096;
  font-size: 0.9rem;
}

.heatmap {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.heatmap-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.heatmap-label {
  min-width: 120px;
  font-size: 0.9rem;
  color: #4a5568;
}

.heatmap-bar {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  transition: width 0.3s ease;
}

.detailed-report-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
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

@media (max-width: 768px) {
  .reports-container {
    padding: 1rem;
  }

  .reports-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
