<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <div class="logo">
          <i class="bi bi-heart-pulse-fill"></i>
        </div>
        <h2>Registro</h2>
        <p class="text-muted">Crea tu cuenta en MediSystem</p>
      </div>
      
      <form @submit.prevent="handleRegister">
        <div class="row g-3">
          <div class="col-12">
            <label for="name" class="form-label">Nombre Completo</label>
            <input 
              type="text" 
              class="form-control" 
              id="name" 
              v-model="formData.name"
              required
            >
          </div>
          
          <div class="col-12">
            <label for="email" class="form-label">Correo Electrónico</label>
            <input 
              type="email" 
              class="form-control" 
              id="email" 
              v-model="formData.email"
              required
            >
          </div>
          
          <div class="col-12">
            <label for="clinicName" class="form-label">Nombre de la Clínica</label>
            <input 
              type="text" 
              class="form-control" 
              id="clinicName" 
              v-model="formData.clinicName"
              required
            >
          </div>
          
          <div class="col-12">
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
          
          <div class="col-12">
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
        </div>
        
        <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
          {{ errorMessage }}
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary w-100 mt-3 mb-3"
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

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.register-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo i {
  font-size: 2.5rem;
  color: white;
}

.register-header h2 {
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.register-header p {
  margin: 0;
  font-size: 0.95rem;
}

.form-label {
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.form-control {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-primary {
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 576px) {
  .register-card {
    padding: 2rem 1.5rem;
  }
}
</style>
