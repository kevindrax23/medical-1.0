<template>
  <div class="medical-record-view">
    <div class="row g-4">
      <!-- Encabezado -->
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h4 class="mb-1">{{ getPatientName(record?.patientId) }}</h4>
            <p class="text-muted mb-0">Fecha: {{ formatDate(record?.date) }}</p>
          </div>
          <button class="btn btn-outline-primary btn-sm" @click="printRecord">
            <i class="bi bi-printer me-2"></i>Imprimir
          </button>
        </div>
      </div>

      <!-- Motivo de Consulta -->
      <div class="col-12">
        <div class="section-card">
          <h6 class="section-title">Motivo de Consulta</h6>
          <p>{{ record?.chiefComplaint }}</p>
        </div>
      </div>

      <!-- Signos Vitales -->
      <div class="col-12">
        <div class="section-card">
          <h6 class="section-title">Signos Vitales</h6>
          <div class="row g-3">
            <div class="col-md-4">
              <small class="text-muted">Temperatura</small>
              <p class="mb-0 fw-bold">{{ record?.vitals?.temperature || 'N/A' }} °C</p>
            </div>
            <div class="col-md-4">
              <small class="text-muted">Presión Arterial</small>
              <p class="mb-0 fw-bold">{{ record?.vitals?.bloodPressure || 'N/A' }}</p>
            </div>
            <div class="col-md-4">
              <small class="text-muted">Frecuencia Cardíaca</small>
              <p class="mb-0 fw-bold">{{ record?.vitals?.heartRate || 'N/A' }} bpm</p>
            </div>
            <div class="col-md-4">
              <small class="text-muted">Peso</small>
              <p class="mb-0 fw-bold">{{ record?.vitals?.weight || 'N/A' }} kg</p>
            </div>
            <div class="col-md-4">
              <small class="text-muted">Altura</small>
              <p class="mb-0 fw-bold">{{ record?.vitals?.height || 'N/A' }} cm</p>
            </div>
            <div class="col-md-4">
              <small class="text-muted">Saturación O₂</small>
              <p class="mb-0 fw-bold">{{ record?.vitals?.oxygenSaturation || 'N/A' }} %</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Examen Físico -->
      <div class="col-12" v-if="record?.physicalExam">
        <div class="section-card">
          <h6 class="section-title">Examen Físico</h6>
          <p>{{ record?.physicalExam }}</p>
        </div>
      </div>

      <!-- Diagnóstico -->
      <div class="col-12">
        <div class="section-card bg-light">
          <h6 class="section-title">Diagnóstico</h6>
          <p>{{ record?.diagnosis }}</p>
        </div>
      </div>

      <!-- Tratamiento -->
      <div class="col-12">
        <div class="section-card">
          <h6 class="section-title">Plan de Tratamiento</h6>
          <p>{{ record?.treatment }}</p>
        </div>
      </div>

      <!-- Prescripción -->
      <div class="col-12" v-if="record?.prescription">
        <div class="section-card">
          <h6 class="section-title">
            <i class="bi bi-capsule me-2 text-primary"></i>Medicamentos Prescritos
          </h6>
          <pre class="prescription-text">{{ record?.prescription }}</pre>
        </div>
      </div>

      <!-- Exámenes de Laboratorio -->
      <div class="col-12" v-if="record?.labTests">
        <div class="section-card">
          <h6 class="section-title">Exámenes de Laboratorio</h6>
          <p>{{ record?.labTests }}</p>
        </div>
      </div>

      <!-- Notas -->
      <div class="col-12" v-if="record?.notes">
        <div class="section-card">
          <h6 class="section-title">Notas Adicionales</h6>
          <p>{{ record?.notes }}</p>
        </div>
      </div>

      <!-- Seguimiento -->
      <div class="col-12" v-if="record?.followUpDate">
        <div class="alert alert-info">
          <i class="bi bi-calendar-event me-2"></i>
          <strong>Próxima Cita:</strong> {{ formatDate(record?.followUpDate) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const props = defineProps({
  record: Object,
  patients: Array
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es })
  } catch {
    return dateString
  }
}

const getPatientName = (patientId) => {
  const patient = props.patients.find(p => p.id === patientId)
  return patient ? patient.name : 'Desconocido'
}

const printRecord = () => {
  window.print()
}
</script>

<style scoped>
.section-card {
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background-color: #fff;
}

.section-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.prescription-text {
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin: 0;
}

@media print {
  .btn {
    display: none;
  }
}
</style>
