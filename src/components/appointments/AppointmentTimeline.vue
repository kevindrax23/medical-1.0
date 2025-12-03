<template>
  <div class="timeline-container">
    <div v-if="appointments.length === 0" class="empty-state">
      <i class="bi bi-calendar-x fs-1 text-muted"></i>
      <p class="text-muted mt-3">No hay citas registradas</p>
    </div>

    <div v-else class="timeline">
      <div v-for="(group, date) in groupedAppointments" :key="date" class="timeline-group">
        <div class="timeline-date">
          <i class="bi bi-calendar3"></i>
          <span>{{ formatDateHeader(date) }}</span>
        </div>

        <div class="timeline-items">
          <div 
            v-for="appointment in group" 
            :key="appointment.id"
            class="timeline-item"
            @click="$emit('select', appointment)"
          >
            <div class="timeline-marker" :class="getMarkerClass(appointment.status)"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <div class="timeline-time">
                  <i class="bi bi-clock"></i>
                  {{ appointment.time }}
                </div>
                <span class="badge" :class="getStatusClass(appointment.status)">
                  {{ appointment.status }}
                </span>
              </div>
              <div class="timeline-body">
                <h6 class="timeline-patient">{{ appointment.patientName }}</h6>
                <p class="timeline-reason">{{ appointment.reason || 'Consulta general' }}</p>
                <div class="timeline-meta">
                  <span><i class="bi bi-hourglass-split me-1"></i>{{ appointment.duration }} min</span>
                  <span v-if="appointment.notes">
                    <i class="bi bi-chat-dots me-1"></i>Con notas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

const props = defineProps({
  appointments: {
    type: Array,
    required: true
  }
})

defineEmits(['select'])

const groupedAppointments = computed(() => {
  const groups = {}
  
  props.appointments
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date)
      if (dateCompare !== 0) return dateCompare
      return a.time.localeCompare(b.time)
    })
    .forEach(appointment => {
      if (!groups[appointment.date]) {
        groups[appointment.date] = []
      }
      groups[appointment.date].push(appointment)
    })
  
  return groups
})

const formatDateHeader = (dateString) => {
  try {
    const date = parseISO(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Hoy, ' + format(date, "d 'de' MMMM", { locale: es })
    } else if (format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) {
      return 'Mañana, ' + format(date, "d 'de' MMMM", { locale: es })
    } else {
      return format(date, "EEEE, d 'de' MMMM", { locale: es })
    }
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

const getMarkerClass = (status) => {
  const classes = {
    'Pendiente': 'marker-warning',
    'Confirmada': 'marker-success',
    'Cancelada': 'marker-danger',
    'Completada': 'marker-info'
  }
  return classes[status] || 'marker-secondary'
}
</script>

<style scoped>
.timeline-container {
  min-height: 400px;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
}

.timeline {
  position: relative;
}

.timeline-group {
  margin-bottom: 2rem;
}

.timeline-date {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.timeline-date i {
  color: #667eea;
  font-size: 1.25rem;
}

.timeline-items {
  position: relative;
  padding-left: 2rem;
}

.timeline-items::before {
  content: '';
  position: absolute;
  left: 0.5rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #e2e8f0 0%, transparent 100%);
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
  cursor: pointer;
}

.timeline-marker {
  position: absolute;
  left: -1.5rem;
  top: 0.5rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 2px currentColor;
}

.marker-warning {
  color: #ed8936;
  background: #ed8936;
}

.marker-success {
  color: #48bb78;
  background: #48bb78;
}

.marker-danger {
  color: #f56565;
  background: #f56565;
}

.marker-info {
  color: #4299e1;
  background: #4299e1;
}

.timeline-content {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.timeline-content:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateX(4px);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.timeline-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #667eea;
  font-size: 0.95rem;
}

.timeline-body h6 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1rem;
}

.timeline-reason {
  color: #718096;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}

.timeline-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #a0aec0;
}

@media (max-width: 768px) {
  .timeline-items {
    padding-left: 1.5rem;
  }
  
  .timeline-marker {
    left: -1.25rem;
  }
}
</style>
