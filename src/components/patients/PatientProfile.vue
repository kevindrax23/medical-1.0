<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex align-items-center mb-4">
        <div class="avatar-circle me-3">
          <i class="bi bi-person-fill fs-1"></i>
        </div>
        <div>
          <h4 class="mb-0">{{ patient?.name }}</h4>
          <p class="text-muted mb-0">{{ calculateAge(patient?.birthDate) }} años</p>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-md-6">
          <small class="text-muted">Tipo de Sangre</small>
          <p class="mb-0">
            <span class="badge bg-danger">{{ patient?.bloodType || 'N/A' }}</span>
          </p>
        </div>
        <div class="col-md-6">
          <small class="text-muted">Teléfono</small>
          <p class="mb-0">{{ patient?.phone }}</p>
        </div>
        <div class="col-12">
          <small class="text-muted">Alergias Conocidas</small>
          <p class="mb-0">{{ patient?.allergies || 'Ninguna' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  patient: Object
})

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
.avatar-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>
