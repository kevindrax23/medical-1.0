<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="displayName" class="form-label">Nombre Completo</label>
        <input 
          type="text" 
          class="form-control" 
          id="displayName" 
          v-model="formData.name"
          required
        >
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Correo Electrónico</label>
        <input 
          type="email" 
          class="form-control" 
          id="email" 
          v-model="formData.email"
          disabled
        >
        <small class="text-muted">El correo no se puede modificar</small>
      </div>

      <div class="mb-3">
        <label for="specialty" class="form-label">Especialidad</label>
        <input 
          type="text" 
          class="form-control" 
          id="specialty" 
          v-model="formData.specialty"
        >
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
        {{ isLoading ? 'Guardando...' : 'Guardar Cambios' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../store'
import { updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../../services/firebase'

const userStore = useUserStore()
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const formData = ref({
  name: '',
  email: '',
  specialty: ''
})

onMounted(() => {
  if (userStore.userData) {
    formData.value = {
      name: userStore.userData.name || '',
      email: userStore.userData.email || '',
      specialty: userStore.userData.specialty || ''
    }
  }
})

const handleSubmit = async () => {
  isLoading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const currentUser = auth.currentUser
    
    if (currentUser) {
      await updateProfile(currentUser, {
        displayName: formData.value.name
      })

      const userDocRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userDocRef, {
        name: formData.value.name,
        specialty: formData.value.specialty
      })

      await userStore.fetchUserData(currentUser.uid)
      successMessage.value = 'Perfil actualizado correctamente'
    }
  } catch (error) {
    errorMessage.value = 'Error al actualizar el perfil'
    console.error('Error updating profile:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
