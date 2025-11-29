<template>
  <div class="container">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-md-5">
        <div class="card p-4">
          <div class="card-body">
            <h2 class="text-center mb-4">Iniciar Sesión</h2>
            
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="email"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  v-model="password"
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
                {{ isLoading ? 'Cargando...' : 'Iniciar Sesión' }}
              </button>
              
              <p class="text-center mb-0">
                ¿No tienes cuenta? 
                <router-link to="/register" class="text-decoration-none">
                  Regístrate aquí
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
import { loginUser } from '../../services/authService'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await loginUser(email.value, password.value)
    router.push('/')
  } catch (error) {
    errorMessage.value = 'Credenciales incorrectas'
  } finally {
    isLoading.value = false
  }
}
</script>
