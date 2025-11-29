<template>
  <div class="container">
    <div class="row justify-content-center align-items-center min-vh-100 py-5">
      <div class="col-md-6">
        <div class="card p-4">
          <div class="card-body">
            <h2 class="text-center mb-4">Registro</h2>
            
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="name" class="form-label">Nombre Completo</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="name" 
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
                  required
                >
              </div>
              
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
                <label for="specialty" class="form-label">Especialidad</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="specialty" 
                  v-model="formData.specialty"
                  placeholder="Ej: Medicina General"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  v-model="formData.password"
                  minlength="6"
                  required
                >
              </div>
              
              <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
              </div>
              
              <button 
                type="submit" 
                class="btn btn-primary w-100 mb-3"
                :disabled="isLoading"
              >
                {{ isLoading ? 'Cargando...' : 'Registrarse' }}
              </button>
              
              <p class="text-center mb-0">
                ¿Ya tienes cuenta? 
                <router-link to="/login" class="text-decoration-none">
                  Inicia sesión aquí
                </router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '../../services/authService'

const router = useRouter()
const errorMessage = ref('')
const isLoading = ref(false)

const formData = ref({
  name: '',
  email: '',
  clinicName: '',
  specialty: '',
  password: ''
})

const handleRegister = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await registerUser(formData.value.email, formData.value.password, {
      name: formData.value.name,
      clinicName: formData.value.clinicName,
      specialty: formData.value.specialty
    })
    router.push('/')
  } catch (error) {
    errorMessage.value = 'Error al registrar usuario'
  } finally {
    isLoading.value = false
  }
}
</script>
