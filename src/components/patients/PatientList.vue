<template>
  <div>
    <div v-if="patients.length === 0" class="text-center py-5">
      <i class="bi bi-people fs-1 text-muted"></i>
      <p class="text-muted mt-3">No hay pacientes registrados</p>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Fecha de Nacimiento</th>
            <th>Tipo de Sangre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in patients" :key="patient.id">
            <td>
              <strong>{{ patient.name }}</strong>
            </td>
            <td>{{ patient.email || 'N/A' }}</td>
            <td>{{ patient.phone || 'N/A' }}</td>
            <td>{{ formatDate(patient.birthDate) }}</td>
            <td>
              <span class="badge bg-info">{{ patient.bloodType || 'N/A' }}</span>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button 
                  class="btn btn-outline-primary" 
                  @click="$emit('view', patient)"
                  title="Ver detalles"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button 
                  class="btn btn-outline-success" 
                  @click="$emit('edit', patient)"
                  title="Editar"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button 
                  class="btn btn-outline-danger" 
                  @click="$emit('delete', patient)"
                  title="Eliminar"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

defineProps({
  patients: {
    type: Array,
    required: true
  }
})

defineEmits(['edit', 'delete', 'view'])

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es })
  } catch {
    return dateString
  }
}
</script>
