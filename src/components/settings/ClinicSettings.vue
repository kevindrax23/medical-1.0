<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="clinicName" class="form-label">Nombre de la Clínica</label>
        <input 
          type="text" 
          class="form-control" 
          id="clinicName" 
          v-model="formData.clinicName"
          required
        >
      </div>

      <div class="mb-3">
        <label for="appointmentDuration" class="form-label">Duración por Defecto de Citas (minutos)</label>
        <select class="form-select" id="appointmentDuration" v-model="formData.appointmentDuration">
          <option value="15">15 minutos</option>
          <option value="30">30 minutos</option>
          <option value="45">45 minutos</option>
          <option value="60">60 minutos</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Horario de Trabajo</label>
        <div class="row">
          <div class="col-md-6 mb-2">
            <label for="workingHoursStart" class="form-label small">Hora de Inicio</label>
            <input 
              type="time" 
              class="form-control" 
              id="workingHoursStart" 
              v-model="formData.workingHours.start"
            >
          </div>
          <div class="col-md-6 mb-2">
            <label for="workingHoursEnd" class="form-label small">Hora de Fin</label>
            <input 
              type="time" 
              class="form-control" 
              id="workingHoursEnd" 
              v-model="formData.workingHours.end"
            >
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Días Laborables</label>
        <div class="form-check" v-for="(day, index) in weekDays" :key="index">
          <input 
            class="form-check-input" 
            type="checkbox" 
            :id="'day' + index"
            :value="index"
            v-model="formData.workingDays"
          >
          <label class="form-check-label" :for="'day' + index">
            {{ day }}
          </label>
        </div>
      </div>

      <div v-if="successMessage" class="alert alert-success" role="alert">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <button 
        type="submit" 
        class="btn btn-primary"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Guardando...' : 'Guardar Configuración' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../store'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'

const userStore = useUserStore()
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const formData = ref({
  clinicName: '',
  appointmentDuration: 30,
  workingHours: {
    start: '09:00',
    end: '18:00'
  },
  workingDays: [1, 2, 3, 4, 5]
})

onMounted(() => {
  if (userStore.userData) {
    formData.value = {
      clinicName: userStore.userData.clinicName || '',
      appointmentDuration: userStore.userData.settings?.appointmentDuration || 30,
      workingHours: userStore.userData.settings?.workingHours || { start: '09:00', end: '18:00' },
      workingDays: userStore.userData.settings?.workingDays || [1, 2, 3, 4, 5]
    }
  }
})

const handleSubmit = async () => {
  isLoading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const userId = userStore.user.uid
    const userDocRef = doc(db, 'users', userId)
    
    await updateDoc(userDocRef, {
      clinicName: formData.value.clinicName,
      settings: {
        appointmentDuration: formData.value.appointmentDuration,
        workingHours: formData.value.workingHours,
        workingDays: formData.value.workingDays
      }
    })

    await userStore.fetchUserData(userId)
    successMessage.value = 'Configuración actualizada correctamente'
  } catch (error) {
    errorMessage.value = 'Error al actualizar la configuración'
    console.error('Error updating settings:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
