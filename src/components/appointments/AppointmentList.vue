<template>
  <div>
    <div v-if="appointments.length === 0" class="empty-state">
      <i class="bi bi-calendar-x fs-1 text-muted"></i>
      <p class="text-muted mt-3">No hay citas registradas</p>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>
              <input type="checkbox" class="form-check-input" @change="toggleSelectAll" v-model="selectAll">
            </th>
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
              <input type="checkbox" class="form-check-input" v-model="selectedItems" :value="appointment.id">
            </td>
            <td>
              <div class="patient-cell">
                <div class="patient-avatar">
                  {{ getInitials(appointment.patientName) }}
                </div>
                <strong>{{ appointment.patientName }}</strong>
              </div>
            </td>
            <td>
              <div class="date-cell">
                <i class="bi bi-calendar3 me-2 text-primary"></i>
                {{ formatDate(appointment.date) }}
              </div>
            </td>
            <td>
              <div class="time-cell">
                <i class="bi bi-clock me-2 text-primary"></i>
                {{ appointment.time }}
              </div>
            </td>
            <td>
              <span class="duration-badge">{{ appointment.duration }} min</span>
            </td>
            <td>
              <span class="badge" :class="getStatusClass(appointment.status)">
                <i :class="getStatusIcon(appointment.status)" class="me-1"></i>
                {{ appointment.status }}
              </span>
            </td>
            <td>
              <div class="reason-cell">
                {{ appointment.reason || 'Consulta general' }}
              </div>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button 
                  class="btn btn-outline-primary" 
                  @click="$emit('edit', appointment)"
                  title="Editar"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button 
                  v-if="appointment.status !== 'Completada'"
                  class="btn btn-outline-success" 
                  @click="$emit('complete', appointment)"
                  title="Marcar como completada"
                >
                  <i class="bi bi-check-circle"></i>
                </button>
                <button 
                  class="btn btn-outline-info" 
                  @click="sendReminder(appointment)"
                  title="Enviar recordatorio"
                >
                  <i class="bi bi-bell"></i>
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

      <!-- Acciones en Lote -->
      <div v-if="selectedItems.length > 0" class="bulk-actions">
        <div class="bulk-actions-info">
          <i class="bi bi-check-circle me-2"></i>
          {{ selectedItems.length }} cita(s) seleccionada(s)
        </div>
        <div class="bulk-actions-buttons">
          <button class="btn btn-sm btn-outline-success" @click="bulkConfirm">
            <i class="bi bi-check-all me-1"></i>Confirmar Todas
          </button>
          <button class="btn btn-sm btn-outline-info" @click="bulkSendReminders">
            <i class="bi bi-bell me-1"></i>Enviar Recordatorios
          </button>
          <button class="btn btn-sm btn-outline-danger" @click="bulkCancel">
            <i class="bi bi-x-circle me-1"></i>Cancelar Todas
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

defineProps({
  appointments: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'complete'])

const selectAll = ref(false)
const selectedItems = ref([])

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedItems.value = props.appointments.map(a => a.id)
  } else {
    selectedItems.value = []
  }
}

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

const getStatusIcon = (status) => {
  const icons = {
    'Pendiente': 'bi-hourglass-split',
    'Confirmada': 'bi-check-circle-fill',
    'Cancelada': 'bi-x-circle-fill',
    'Completada': 'bi-check-all'
  }
  return icons[status] || 'bi-circle'
}

const getInitials = (name) => {
  if (!name) return '??'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0]
  }
  return name.substring(0, 2).toUpperCase()
}

const sendReminder = (appointment) => {
  alert(`Enviando recordatorio a ${appointment.patientName}...`)
}

const bulkConfirm = () => {
  alert(`Confirmando ${selectedItems.value.length} citas...`)
  selectedItems.value = []
}

const bulkSendReminders = () => {
  alert(`Enviando recordatorios a ${selectedItems.value.length} pacientes...`)
}

const bulkCancel = () => {
  if (confirm(`¿Está seguro de cancelar ${selectedItems.value.length} citas?`)) {
    selectedItems.value = []
  }
}
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 4rem 1rem;
}

.patient-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.patient-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
}

.date-cell, .time-cell {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.duration-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #f8f9fa;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #495057;
}

.reason-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #718096;
}

.bulk-actions {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 2rem;
  z-index: 1000;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.bulk-actions-info {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #2d3748;
}

.bulk-actions-buttons {
  display: flex;
  gap: 0.5rem;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  color: #4a5568;
  border-bottom: 2px solid #e2e8f0;
}

.table tbody tr {
  transition: all 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
  transform: translateX(2px);
}

@media (max-width: 768px) {
  .bulk-actions {
    flex-direction: column;
    gap: 1rem;
    width: 90%;
  }
  
  .bulk-actions-buttons {
    width: 100%;
    justify-content: center;
  }
}
</style>
