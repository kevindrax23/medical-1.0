<template>
  <div 
    class="modal fade" 
    :class="{ show: show, 'd-block': show }"
    :style="{ display: show ? 'block' : 'none' }"
    tabindex="-1"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ mode === 'create' ? 'Nueva Cita' : 'Editar Cita' }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-12">
                <label for="patientId" class="form-label">Paciente *</label>
                <select 
                  class="form-select" 
                  id="patientId" 
                  v-model="formData.patientId"
                  required
                  @change="updatePatientName"
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
                <label for="date" class="form-label">Fecha *</label>
                <input 
                  type="date" 
                  class="form-control" 
                  id="date" 
                  v-model="formData.date"
                  :min="minDate"
                  required
                >
              </div>

              <div class="col-md-6">
                <label for="time" class="form-label">Hora *</label>
                <input 
                  type="time" 
                  class="form-control" 
                  id="time" 
                  v-model="formData.time"
                  required
                >
              </div>

              <div class="col-md-6">
                <label for="duration" class="form-label">Duración (minutos) *</label>
                <select class="form-select" id="duration" v-model="formData.duration" required>
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="90">1.5 horas</option>
                  <option value="120">2 horas</option>
                </select>
              </div>

              <div class="col-md-6">
                <label for="status" class="form-label">Estado *</label>
                <select class="form-select" id="status" v-model="formData.status" required>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Completada">Completada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              <div class="col-12">
                <label for="reason" class="form-label">Motivo de la Consulta</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="reason" 
                  v-model="formData.reason"
                  placeholder="Ej: Consulta general, revisión, etc."
                >
              </div>

              <div class="col-12">
                <label for="notes" class="form-label">Notas Adicionales</label>
                <textarea 
                  class="form-control" 
                  id="notes" 
                  rows="3"
                  v-model="formData.notes"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              {{ mode === 'create' ? 'Crear Cita' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div v-if="show" class="modal-backdrop fade show"></div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: Boolean,
  appointment: Object,
  patients: Array,
  mode: {
    type: String,
    default: 'create'
  }
})

const emit = defineEmits(['close', 'save'])

const formData = ref({
  patientId: '',
  patientName: '',
  date: '',
  time: '',
  duration: '30',
  status: 'Pendiente',
  reason: '',
  notes: ''
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

watch(() => props.appointment, (newAppointment) => {
  if (newAppointment && props.mode === 'edit') {
    formData.value = { ...newAppointment }
  } else if (props.mode === 'create') {
    formData.value = {
      patientId: '',
      patientName: '',
      date: '',
      time: '',
      duration: '30',
      status: 'Pendiente',
      reason: '',
      notes: ''
    }
  }
}, { immediate: true })

const updatePatientName = () => {
  const selectedPatient = props.patients.find(p => p.id === formData.value.patientId)
  if (selectedPatient) {
    formData.value.patientName = selectedPatient.name
  }
}

const handleSubmit = () => {
  emit('save', formData.value)
}
</script>
