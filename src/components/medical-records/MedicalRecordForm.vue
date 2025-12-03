<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="show" class="custom-modal-overlay" @click="handleBackdropClick">
        <div class="custom-modal-dialog" @click.stop>
          <!-- Header -->
          <div class="custom-modal-header">
            <div>
              <h5 class="custom-modal-title">
                <i class="bi bi-file-medical me-2"></i>
                {{ mode === 'create' ? 'Nueva Historia Clínica' : mode === 'edit' ? 'Editar Historia Clínica' : 'Ver Historia Clínica' }}
              </h5>
              <small class="text-muted" v-if="record && record.date">
                Creada el {{ formatDate(record.date) }}
              </small>
            </div>
            <button 
              type="button" 
              class="custom-modal-close" 
              @click="$emit('close')"
              aria-label="Close"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Body con Scroll -->
          <div class="custom-modal-body">
            <form @submit.prevent="submitForm">
              <!-- Selección de Paciente -->
              <div class="form-section">
                <h6 class="section-title">
                  <i class="bi bi-person-fill me-2"></i>Información del Paciente
                </h6>
                <div class="mb-3">
                  <label class="form-label">Paciente *</label>
                  <select 
                    class="form-select" 
                    v-model="formData.patientId" 
                    required
                    :disabled="mode === 'view'"
                  >
                    <option value="">Seleccionar paciente...</option>
                    <option v-for="patient in patients" :key="patient.id" :value="patient.id">
                      {{ patient.name }} ({{ patient.phone }})
                    </option>
                  </select>
                </div>
              </div>

              <!-- Fecha y Hora -->
              <div class="form-section">
                <h6 class="section-title">
                  <i class="bi bi-calendar-fill me-2"></i>Fecha de Consulta
                </h6>
                <div class="row">
                  <div class="col-md-6">
                    <label class="form-label">Fecha *</label>
                    <input 
                      type="date" 
                      class="form-control" 
                      v-model="formData.date"
                      required
                      :disabled="mode === 'view'"
                    >
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Hora</label>
                    <input 
                      type="time" 
                      class="form-control" 
                      v-model="formData.time"
                      :disabled="mode === 'view'"
                    >
                  </div>
                </div>
              </div>

              <!-- Signos Vitales -->
              <div class="form-section">
                <h6 class="section-title">
                  <i class="bi bi-heart-pulse me-2"></i>Signos Vitales
                </h6>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Temperatura (°C)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      class="form-control" 
                      v-model="formData.vitals.temperature"
                      placeholder="36.5"
                      :disabled="mode === 'view'"
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Presión Arterial (mmHg)</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="formData.vitals.bloodPressure"
                      placeholder="120/80"
                      :disabled="mode === 'view'"
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Frecuencia Cardíaca (bpm)</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model="formData.vitals.heartRate"
                      placeholder="72"
                      :disabled="mode === 'view'"
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Peso (kg)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      class="form-control" 
                      v-model="formData.vitals.weight"
                      placeholder="70"
                      :disabled="mode === 'view'"
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Altura (cm)</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model="formData.vitals.height"
                      placeholder="170"
                      :disabled="mode === 'view'"
                    >
                  </div>
                </div>
              </div>

              <!-- Motivo de Consulta -->
              <div class="form-section">
                <h6 class="section-title">
                  <i class="bi bi-chat-dots-fill me-2"></i>Motivo de la Consulta
                </h6>
                <div class="mb-3">
                  <label class="form-label">Queja Principal *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="formData.chiefComplaint"
                    placeholder="Ej: Dolor de cabeza"
                    required
                    :disabled="mode === 'view'"
                  >
                </div>
                <div class="mb-3">
                  <label class="form-label">Enfermedad Actual</label>
                  <textarea 
                    class="form-control" 
                    rows="3"
                    v-model="formData.presentIllness"
                    placeholder="Descripción detallada de los síntomas..."
                    :disabled="mode === 'view'"
                  ></textarea>
                </div>
              </div>

              <!-- Examen Físico -->
              <div class="form-section">
                <h6 class="section-title">
                  <i class="bi bi-search me-2"></i>Examen Físico
                </h6>
                <div class="mb-3">
                  <label class="form-label">Hallazgos del Examen Físico</label>
                  <textarea 
                    class="form-control" 
                    rows="3"
                    v-model="formData.physicalExam"
                    placeholder="Observaciones del examen físico..."
                    :disabled="mode === 'view'"
                  ></textarea>
                </div>
              </div>

              <!-- Diagnóstico -->
              <div class="form-section">
                <h6 class="section-title">
                  <i class="bi bi-clipboard-check me-2"></i>Diagnóstico
                </h6>
                <div class="mb-3">
                  <label class="form-label">Diagnóstico Clínico *</label>
                  <textarea 
                    class="form-control" 
                    rows="3"
                    v-model="formData.diagnosis"
                    placeholder="Diagnóstico principal y secundarios..."
                    required
                    :disabled="mode === 'view'"
                  ></textarea>
                </div>
              </div>

              <!-- Tratamiento -->
              <div class="form-section">
                <h6 class="section-title">
                  <i class="bi bi-prescription2 me-2"></i>Tratamiento
                </h6>
                <div class="mb-3">
                  <label class="form-label">Plan de Tratamiento</label>
                  <textarea 
                    class="form-control" 
                    rows="3"
                    v-model="formData.treatment"
                    placeholder="Indicaciones y tratamiento recomendado..."
                    :disabled="mode === 'view'"
                  ></textarea>
                </div>
              </div>

              <!-- Receta Médica -->
              <div class="form-section">
                <h6 class="section-title">
                  <i class="bi bi-capsule me-2"></i>Receta Médica
                </h6>
                <div class="mb-3">
                  <label class="form-label">Medicamentos Prescritos</label>
                  <textarea 
                    class="form-control" 
                    rows="4"
                    v-model="formData.prescription"
                    placeholder="Medicamento - Dosis - Duración&#10;Ej: Amoxicilina 500mg - 1 tableta cada 8 horas - 7 días"
                    :disabled="mode === 'view'"
                  ></textarea>
                </div>
              </div>

              <!-- Exámenes de Laboratorio -->
              <div class="form-section">
                <h6 class="section-title">
                  <i class="bi bi-graph-up me-2"></i>Exámenes de Laboratorio
                </h6>
                <div class="mb-3">
                  <label class="form-label">Exámenes Solicitados</label>
                  <textarea 
                    class="form-control" 
                    rows="2"
                    v-model="formData.labTests"
                    placeholder="Exámenes de laboratorio recomendados..."
                    :disabled="mode === 'view'"
                  ></textarea>
                </div>
              </div>

              <!-- Seguimiento -->
              <div class="form-section">
                <h6 class="section-title">
                  <i class="bi bi-calendar-check-fill me-2"></i>Seguimiento
                </h6>
                <div class="mb-3">
                  <label class="form-label">Fecha de Seguimiento</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    v-model="formData.followUpDate"
                    :disabled="mode === 'view'"
                  >
                </div>
              </div>

              <!-- Notas Adicionales -->
              <div class="form-section">
                <h6 class="section-title">
                  <i class="bi bi-pencil-fill me-2"></i>Notas Adicionales
                </h6>
                <div class="mb-3">
                  <label class="form-label">Observaciones</label>
                  <textarea 
                    class="form-control" 
                    rows="2"
                    v-model="formData.notes"
                    placeholder="Cualquier nota adicional importante..."
                    :disabled="mode === 'view'"
                  ></textarea>
                </div>
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="custom-modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="$emit('close')"
            >
              {{ mode === 'view' ? 'Cerrar' : 'Cancelar' }}
            </button>
            <button 
              v-if="mode === 'view'"
              type="button" 
              class="btn btn-primary" 
              @click="printRecord"
            >
              <i class="bi bi-printer me-2"></i>Imprimir PDF
            </button>
            <button 
              v-else-if="mode === 'edit'"
              type="button" 
              class="btn btn-warning" 
              @click="$emit('edit', record)"
            >
              <i class="bi bi-pencil me-2"></i>Editar
            </button>
            <button 
              v-else
              type="button" 
              class="btn btn-primary" 
              @click="submitForm"
            >
              <i class="bi bi-check-circle me-2"></i>Guardar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { generateMedicalRecordPDF } from '../../utils/pdfGenerator'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  record: {
    type: Object,
    default: null
  },
  patients: {
    type: Array,
    required: true
  },
  mode: {
    type: String,
    default: 'create'
  }
})

const emit = defineEmits(['close', 'save', 'edit'])

const formData = ref({
  patientId: '',
  date: new Date().toISOString().split('T')[0],
  time: '',
  chiefComplaint: '',
  presentIllness: '',
  physicalExam: '',
  diagnosis: '',
  treatment: '',
  prescription: '',
  labTests: '',
  followUpDate: '',
  notes: '',
  vitals: {
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    weight: '',
    height: ''
  }
})

const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es })
  } catch {
    return dateString
  }
}

const handleBackdropClick = () => {
  if (props.mode === 'view') {
    emit('close')
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden'
    
    if (props.record && props.mode !== 'create') {
      formData.value = {
        patientId: props.record.patientId || '',
        date: props.record.date || new Date().toISOString().split('T')[0],
        time: props.record.time || '',
        chiefComplaint: props.record.chiefComplaint || '',
        presentIllness: props.record.presentIllness || '',
        physicalExam: props.record.physicalExam || '',
        diagnosis: props.record.diagnosis || '',
        treatment: props.record.treatment || '',
        prescription: props.record.prescription || '',
        labTests: props.record.labTests || '',
        followUpDate: props.record.followUpDate || '',
        notes: props.record.notes || '',
        vitals: {
          temperature: props.record.vitals?.temperature || '',
          bloodPressure: props.record.vitals?.bloodPressure || '',
          heartRate: props.record.vitals?.heartRate || '',
          weight: props.record.vitals?.weight || '',
          height: props.record.vitals?.height || ''
        }
      }
    } else {
      // Reset form para crear nueva historia
      formData.value = {
        patientId: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        chiefComplaint: '',
        presentIllness: '',
        physicalExam: '',
        diagnosis: '',
        treatment: '',
        prescription: '',
        labTests: '',
        followUpDate: '',
        notes: '',
        vitals: {
          temperature: '',
          bloodPressure: '',
          heartRate: '',
          weight: '',
          height: ''
        }
      }
    }
  } else {
    // Desbloquear scroll del body
    document.body.style.overflow = ''
  }
})

const submitForm = () => {
  if (!formData.value.patientId || !formData.value.diagnosis) {
    alert('Por favor completa los campos requeridos (Paciente y Diagnóstico).')
    return
  }

  emit('save', formData.value)
}

const printRecord = async () => {
  if (!props.record) {
    alert('No hay datos para imprimir')
    return
  }

  try {
    const patientName = props.patients.find(p => p.id === props.record.patientId)?.name || 'Desconocido'
    const patientData = props.patients.find(p => p.id === props.record.patientId) || {}

    await generateMedicalRecordPDF({
      ...props.record,
      patientName,
      patientData
    })
  } catch (error) {
    console.error('Error al generar PDF:', error)
    alert('Error al generar el PDF')
  }
}
</script>

<style scoped>
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
}

.custom-modal-dialog {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.custom-modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.custom-modal-title {
  font-weight: 700;
  color: #2d3748;
  font-size: 1.25rem;
  margin: 0;
}

.custom-modal-close {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.custom-modal-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #2d3748;
}

.custom-modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.custom-modal-body::-webkit-scrollbar {
  width: 10px;
}

.custom-modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.custom-modal-body::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.section-title i {
  color: #667eea;
}

.form-label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control,
.form-select {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.95rem;
  width: 100%;
  transition: all 0.2s ease;
  background: white;
  color: #2d3748;
}

.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

.form-control:disabled,
.form-select:disabled {
  background: #f7fafc;
  cursor: not-allowed;
  opacity: 0.7;
}

.custom-modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8f9fa;
  border-radius: 0 0 16px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  border-radius: 8px;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.btn-warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .custom-modal-dialog {
    max-width: 95%;
    max-height: 95vh;
  }

  .custom-modal-body {
    padding: 1rem;
  }

  .custom-modal-footer {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .row > [class*='col-'] {
    margin-bottom: 1rem;
  }
}
</style>
