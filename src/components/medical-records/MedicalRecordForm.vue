<template>
  <div 
    class="modal fade" 
    :class="{ show: show, 'd-block': show }"
    :style="{ display: show ? 'block' : 'none' }"
    tabindex="-1"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ mode === 'create' ? 'Nueva Historia Clínica' : mode === 'edit' ? 'Editar Historia Clínica' : 'Historia Clínica' }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit" v-if="mode !== 'view'">
          <div class="modal-body">
            <div class="row g-4">
              <!-- Información Básica -->
              <div class="col-12">
                <h6 class="border-bottom pb-2">Información Básica</h6>
              </div>

              <div class="col-md-6">
                <label for="patientId" class="form-label">Paciente *</label>
                <select 
                  class="form-select" 
                  id="patientId" 
                  v-model="formData.patientId"
                  required
                >
                  <option value="">Seleccione un paciente...</option>
                  <option 
                    v-for="patient in patients" 
                    :key="patient.id" 
                    :value="patient.id"
                  >
                    {{ patient.name }}
                  </option>
                </select>
              </div>

              <div class="col-md-6">
                <label for="date" class="form-label">Fecha de Consulta *</label>
                <input 
                  type="date" 
                  class="form-control" 
                  id="date" 
                  v-model="formData.date"
                  required
                >
              </div>

              <!-- Motivo de Consulta -->
              <div class="col-12">
                <h6 class="border-bottom pb-2 mt-3">Motivo de Consulta</h6>
              </div>

              <div class="col-12">
                <label for="chiefComplaint" class="form-label">Motivo Principal *</label>
                <textarea 
                  class="form-control" 
                  id="chiefComplaint" 
                  rows="2"
                  v-model="formData.chiefComplaint"
                  required
                ></textarea>
              </div>

              <!-- Signos Vitales -->
              <div class="col-12">
                <h6 class="border-bottom pb-2 mt-3">Signos Vitales</h6>
              </div>

              <div class="col-md-3">
                <label for="temperature" class="form-label">Temperatura (°C)</label>
                <input 
                  type="number" 
                  step="0.1"
                  class="form-control" 
                  id="temperature" 
                  v-model="formData.vitals.temperature"
                  placeholder="36.5"
                >
              </div>

              <div class="col-md-3">
                <label for="bloodPressure" class="form-label">Presión Arterial</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="bloodPressure" 
                  v-model="formData.vitals.bloodPressure"
                  placeholder="120/80"
                >
              </div>

              <div class="col-md-3">
                <label for="heartRate" class="form-label">Frecuencia Cardíaca</label>
                <input 
                  type="number" 
                  class="form-control" 
                  id="heartRate" 
                  v-model="formData.vitals.heartRate"
                  placeholder="70"
                >
              </div>

              <div class="col-md-3">
                <label for="weight" class="form-label">Peso (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  class="form-control" 
                  id="weight" 
                  v-model="formData.vitals.weight"
                  placeholder="70.5"
                >
              </div>

              <div class="col-md-3">
                <label for="height" class="form-label">Altura (cm)</label>
                <input 
                  type="number" 
                  class="form-control" 
                  id="height" 
                  v-model="formData.vitals.height"
                  placeholder="170"
                >
              </div>

              <div class="col-md-3">
                <label for="oxygenSaturation" class="form-label">Saturación O₂ (%)</label>
                <input 
                  type="number" 
                  class="form-control" 
                  id="oxygenSaturation" 
                  v-model="formData.vitals.oxygenSaturation"
                  placeholder="98"
                >
              </div>

              <!-- Examen Físico -->
              <div class="col-12">
                <h6 class="border-bottom pb-2 mt-3">Examen Físico</h6>
              </div>

              <div class="col-12">
                <label for="physicalExam" class="form-label">Hallazgos del Examen Físico</label>
                <textarea 
                  class="form-control" 
                  id="physicalExam" 
                  rows="3"
                  v-model="formData.physicalExam"
                ></textarea>
              </div>

              <!-- Diagnóstico -->
              <div class="col-12">
                <h6 class="border-bottom pb-2 mt-3">Diagnóstico y Tratamiento</h6>
              </div>

              <div class="col-12">
                <label for="diagnosis" class="form-label">Diagnóstico *</label>
                <textarea 
                  class="form-control" 
                  id="diagnosis" 
                  rows="3"
                  v-model="formData.diagnosis"
                  required
                ></textarea>
              </div>

              <div class="col-12">
                <label for="treatment" class="form-label">Plan de Tratamiento *</label>
                <textarea 
                  class="form-control" 
                  id="treatment" 
                  rows="3"
                  v-model="formData.treatment"
                  required
                ></textarea>
              </div>

              <!-- Prescripción -->
              <div class="col-12">
                <label for="prescription" class="form-label">Medicamentos Prescritos</label>
                <textarea 
                  class="form-control" 
                  id="prescription" 
                  rows="4"
                  v-model="formData.prescription"
                  placeholder="Medicamento - Dosis - Frecuencia - Duración"
                ></textarea>
              </div>

              <!-- Exámenes de Laboratorio -->
              <div class="col-12">
                <label for="labTests" class="form-label">Exámenes de Laboratorio Solicitados</label>
                <textarea 
                  class="form-control" 
                  id="labTests" 
                  rows="2"
                  v-model="formData.labTests"
                ></textarea>
              </div>

              <!-- Notas Adicionales -->
              <div class="col-12">
                <label for="notes" class="form-label">Notas Adicionales</label>
                <textarea 
                  class="form-control" 
                  id="notes" 
                  rows="2"
                  v-model="formData.notes"
                ></textarea>
              </div>

              <!-- Próxima Cita -->
              <div class="col-md-6">
                <label for="followUpDate" class="form-label">Fecha de Seguimiento</label>
                <input 
                  type="date" 
                  class="form-control" 
                  id="followUpDate" 
                  v-model="formData.followUpDate"
                >
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              {{ mode === 'create' ? 'Crear Historia' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>

        <!-- Vista de Solo Lectura -->
        <div v-else>
          <div class="modal-body">
            <MedicalRecordView :record="record" :patients="patients" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="show" class="modal-backdrop fade show"></div>
</template>

<script setup>
import { ref, watch } from 'vue'
import MedicalRecordView from './MedicalRecordView.vue'

const props = defineProps({
  show: Boolean,
  record: Object,
  patients: Array,
  mode: {
    type: String,
    default: 'create'
  }
})

const emit = defineEmits(['close', 'save'])

const formData = ref({
  patientId: '',
  date: '',
  chiefComplaint: '',
  vitals: {
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    weight: '',
    height: '',
    oxygenSaturation: ''
  },
  physicalExam: '',
  diagnosis: '',
  treatment: '',
  prescription: '',
  labTests: '',
  notes: '',
  followUpDate: ''
})

watch(() => props.record, (newRecord) => {
  if (newRecord && props.mode === 'edit') {
    formData.value = {
      ...newRecord,
      vitals: newRecord.vitals || {
        temperature: '',
        bloodPressure: '',
        heartRate: '',
        weight: '',
        height: '',
        oxygenSaturation: ''
      }
    }
  } else if (props.mode === 'create') {
    formData.value = {
      patientId: '',
      date: new Date().toISOString().split('T')[0],
      chiefComplaint: '',
      vitals: {
        temperature: '',
        bloodPressure: '',
        heartRate: '',
        weight: '',
        height: '',
        oxygenSaturation: ''
      },
      physicalExam: '',
      diagnosis: '',
      treatment: '',
      prescription: '',
      labTests: '',
      notes: '',
      followUpDate: ''
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('save', formData.value)
}
</script>
