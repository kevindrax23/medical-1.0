<template>
  <div 
    class="modal fade" 
    :class="{ show: show, 'd-block': show }"
    :style="{ display: show ? 'block' : 'none' }"
    tabindex="-1"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ mode === 'create' ? 'Nuevo Paciente' : mode === 'edit' ? 'Editar Paciente' : 'Detalles del Paciente' }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit" v-if="mode !== 'view'">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="name" class="form-label">Nombre Completo *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="name" 
                  v-model="formData.name"
                  required
                >
              </div>

              <div class="col-md-6">
                <label for="birthDate" class="form-label">Fecha de Nacimiento *</label>
                <input 
                  type="date" 
                  class="form-control" 
                  id="birthDate" 
                  v-model="formData.birthDate"
                  required
                >
              </div>

              <div class="col-md-6">
                <label for="email" class="form-label">Correo Electrónico</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="formData.email"
                >
              </div>

              <div class="col-md-6">
                <label for="phone" class="form-label">Teléfono *</label>
                <input 
                  type="tel" 
                  class="form-control" 
                  id="phone" 
                  v-model="formData.phone"
                  required
                >
              </div>

              <div class="col-md-6">
                <label for="gender" class="form-label">Género *</label>
                <select class="form-select" id="gender" v-model="formData.gender" required>
                  <option value="">Seleccione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div class="col-md-6">
                <label for="bloodType" class="form-label">Tipo de Sangre</label>
                <select class="form-select" id="bloodType" v-model="formData.bloodType">
                  <option value="">Seleccione...</option>
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

              <div class="col-md-6">
                <label for="idNumber" class="form-label">Número de Identificación</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="idNumber" 
                  v-model="formData.idNumber"
                >
              </div>

              <div class="col-md-6">
                <label for="occupation" class="form-label">Ocupación</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="occupation" 
                  v-model="formData.occupation"
                >
              </div>

              <div class="col-12">
                <label for="address" class="form-label">Dirección</label>
                <textarea 
                  class="form-control" 
                  id="address" 
                  rows="2"
                  v-model="formData.address"
                ></textarea>
              </div>

              <div class="col-md-6">
                <label for="emergencyContact" class="form-label">Contacto de Emergencia</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="emergencyContact" 
                  v-model="formData.emergencyContact"
                  placeholder="Nombre completo"
                >
              </div>

              <div class="col-md-6">
                <label for="emergencyPhone" class="form-label">Teléfono de Emergencia</label>
                <input 
                  type="tel" 
                  class="form-control" 
                  id="emergencyPhone" 
                  v-model="formData.emergencyPhone"
                >
              </div>

              <div class="col-md-6">
                <label for="emergencyRelationship" class="form-label">Relación con Contacto</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="emergencyRelationship" 
                  v-model="formData.emergencyRelationship"
                  placeholder="Ej: Esposo/a, Hijo/a, Hermano/a"
                >
              </div>

              <div class="col-md-6">
                <label for="insuranceProvider" class="form-label">Aseguradora</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="insuranceProvider" 
                  v-model="formData.insuranceProvider"
                >
              </div>

              <div class="col-12">
                <label for="allergies" class="form-label">Alergias</label>
                <textarea 
                  class="form-control" 
                  id="allergies" 
                  rows="2"
                  v-model="formData.allergies"
                  placeholder="Separe las alergias con comas"
                ></textarea>
              </div>

              <div class="col-12">
                <label for="chronicDiseases" class="form-label">Enfermedades Crónicas</label>
                <textarea 
                  class="form-control" 
                  id="chronicDiseases" 
                  rows="2"
                  v-model="formData.chronicDiseases"
                  placeholder="Diabetes, Hipertensión, etc."
                ></textarea>
              </div>

              <div class="col-12">
                <label for="currentMedications" class="form-label">Medicamentos Actuales</label>
                <textarea 
                  class="form-control" 
                  id="currentMedications" 
                  rows="2"
                  v-model="formData.currentMedications"
                ></textarea>
              </div>

              <div class="col-12">
                <label for="medicalHistory" class="form-label">Antecedentes Médicos</label>
                <textarea 
                  class="form-control" 
                  id="medicalHistory" 
                  rows="3"
                  v-model="formData.medicalHistory"
                  placeholder="Cirugías previas, hospitalizaciones, etc."
                ></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              {{ mode === 'create' ? 'Crear Paciente' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>

        <div v-else>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-12">
                <div class="text-center mb-4">
                  <div class="avatar-circle-large mx-auto mb-3">
                    <i class="bi bi-person-fill"></i>
                  </div>
                  <h4 class="mb-1">{{ patient?.name }}</h4>
                  <p class="text-muted">{{ calculateAge(patient?.birthDate) }} años</p>
                </div>
              </div>

              <div class="col-md-6">
                <p class="mb-1 text-muted small">Fecha de Nacimiento</p>
                <p class="fw-bold">{{ formatDate(patient?.birthDate) }}</p>
              </div>

              <div class="col-md-6">
                <p class="mb-1 text-muted small">Género</p>
                <p class="fw-bold">{{ patient?.gender }}</p>
              </div>

              <div class="col-md-6">
                <p class="mb-1 text-muted small">Tipo de Sangre</p>
                <span class="badge bg-danger">{{ patient?.bloodType || 'N/A' }}</span>
              </div>

              <div class="col-md-6">
                <p class="mb-1 text-muted small">Identificación</p>
                <p>{{ patient?.idNumber || 'N/A' }}</p>
              </div>

              <div class="col-md-6">
                <p class="mb-1 text-muted small">Correo Electrónico</p>
                <p>{{ patient?.email || 'N/A' }}</p>
              </div>

              <div class="col-md-6">
                <p class="mb-1 text-muted small">Teléfono</p>
                <p>{{ patient?.phone || 'N/A' }}</p>
              </div>

              <div class="col-md-6">
                <p class="mb-1 text-muted small">Ocupación</p>
                <p>{{ patient?.occupation || 'N/A' }}</p>
              </div>

              <div class="col-md-6">
                <p class="mb-1 text-muted small">Aseguradora</p>
                <p>{{ patient?.insuranceProvider || 'N/A' }}</p>
              </div>

              <div class="col-12">
                <p class="mb-1 text-muted small">Dirección</p>
                <p>{{ patient?.address || 'N/A' }}</p>
              </div>

              <div class="col-12">
                <hr>
                <h6 class="mb-3">Información de Emergencia</h6>
              </div>

              <div class="col-md-4">
                <p class="mb-1 text-muted small">Contacto de Emergencia</p>
                <p>{{ patient?.emergencyContact || 'N/A' }}</p>
              </div>

              <div class="col-md-4">
                <p class="mb-1 text-muted small">Teléfono de Emergencia</p>
                <p>{{ patient?.emergencyPhone || 'N/A' }}</p>
              </div>

              <div class="col-md-4">
                <p class="mb-1 text-muted small">Relación</p>
                <p>{{ patient?.emergencyRelationship || 'N/A' }}</p>
              </div>

              <div class="col-12">
                <hr>
                <h6 class="mb-3">Información Médica</h6>
              </div>

              <div class="col-12">
                <p class="mb-1 text-muted small">Alergias</p>
                <div class="alert alert-warning" v-if="patient?.allergies">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  {{ patient?.allergies }}
                </div>
                <p v-else>Ninguna alergia registrada</p>
              </div>

              <div class="col-12">
                <p class="mb-1 text-muted small">Enfermedades Crónicas</p>
                <p>{{ patient?.chronicDiseases || 'Ninguna registrada' }}</p>
              </div>

              <div class="col-12">
                <p class="mb-1 text-muted small">Medicamentos Actuales</p>
                <p>{{ patient?.currentMedications || 'Ninguno' }}</p>
              </div>

              <div class="col-12">
                <p class="mb-1 text-muted small">Antecedentes Médicos</p>
                <p>{{ patient?.medicalHistory || 'N/A' }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Cerrar
            </button>
            <button type="button" class="btn btn-primary" @click="$emit('edit', patient)">
              <i class="bi bi-pencil me-2"></i>Editar
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
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const props = defineProps({
  show: Boolean,
  patient: Object,
  mode: {
    type: String,
    default: 'create'
  }
})

const emit = defineEmits(['close', 'save', 'edit'])

const formData = ref({
  name: '',
  birthDate: '',
  email: '',
  phone: '',
  gender: '',
  bloodType: '',
  idNumber: '',
  occupation: '',
  address: '',
  emergencyContact: '',
  emergencyPhone: '',
  emergencyRelationship: '',
  insuranceProvider: '',
  allergies: '',
  chronicDiseases: '',
  currentMedications: '',
  medicalHistory: ''
})

watch(() => props.patient, (newPatient) => {
  if (newPatient && props.mode === 'edit') {
    formData.value = { ...newPatient }
  } else if (props.mode === 'create') {
    formData.value = {
      name: '',
      birthDate: '',
      email: '',
      phone: '',
      gender: '',
      bloodType: '',
      idNumber: '',
      occupation: '',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      emergencyRelationship: '',
      insuranceProvider: '',
      allergies: '',
      chronicDiseases: '',
      currentMedications: '',
      medicalHistory: ''
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('save', formData.value)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es })
  } catch {
    return dateString
  }
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
</script>

<style scoped>
.avatar-circle-large {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

.alert-warning {
  background-color: #fff3cd;
  border-color: #ffc107;
}
</style>
