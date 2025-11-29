<template>
  <div>
    <div v-if="appointments.length === 0" class="text-center py-5">
      <i class="bi bi-calendar-x fs-1 text-muted"></i>
      <p class="text-muted mt-3">No hay citas registradas</p>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Duración</th>
            <th>Estado</th>
            <th>Motivo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appointment in appointments" :key="appointment.id">
            <td>
              <strong>{{ appointment.patientName }}</strong>
            </td>
            <td>{{ formatDate(appointment.date) }}</td>
            <td>{{ appointment.time }}</td>
            <td>{{ appointment.duration }} min</td>
            <td>
              <span class="badge" :class="getStatusClass(appointment.status)">
                {{ appointment.status }}
              </span>
            </td>
            <td>{{ appointment.reason || 'N/A' }}</td>
            <td>
              <div class="btn-group btn-group-sm">
                <button 
                  class="btn btn-outline-success" 
                  @click="$emit('edit', appointment)"
                  title="Editar"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button 
                  class="btn btn-outline-danger" 
                  @click="$emit('delete', appointment)"
                  title="Cancelar"
                >
                  <i class="bi bi-x-circle"></i>
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
  appointments: {
    type: Array,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es })
  } catch {
    return dateString
  }
}

const getStatusClass = (status) => {
  const classes = {
    'Pendiente': 'bg-warning text-dark',
    'Confirmada': 'bg-success',
    'Cancelada': 'bg-danger',
    'Completada': 'bg-info'
  }
  return classes[status] || 'bg-secondary'
}
</script>
