<template>
  <div class="card">
    <div class="card-header bg-white">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Calendario de Citas</h5>
        <div class="btn-group">
          <button class="btn btn-sm btn-outline-primary" @click="previousWeek">
            <i class="bi bi-chevron-left"></i>
          </button>
          <button class="btn btn-sm btn-outline-primary" @click="currentWeek">
            Hoy
          </button>
          <button class="btn btn-sm btn-outline-primary" @click="nextWeek">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-bordered text-center">
          <thead>
            <tr>
              <th v-for="day in weekDays" :key="day.date" class="py-3">
                <div class="fw-bold">{{ day.name }}</div>
                <div class="text-muted small">{{ day.dateStr }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="day in weekDays" :key="day.date" class="align-top p-2" style="height: 200px;">
                <div class="d-flex flex-column gap-1">
                  <div 
                    v-for="appointment in getDayAppointments(day.date)" 
                    :key="appointment.id"
                    class="appointment-card"
                    :class="getStatusClass(appointment.status)"
                    @click="$emit('select-appointment', appointment)"
                  >
                    <small class="fw-bold">{{ appointment.time }}</small>
                    <small class="text-truncate">{{ appointment.patientName }}</small>
                  </div>
                  <div v-if="getDayAppointments(day.date).length === 0" class="text-muted small">
                    Sin citas
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format, addDays, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'

const props = defineProps({
  appointments: Array,
  patients: Array
})

defineEmits(['select-appointment'])

const currentDate = ref(new Date())

const weekDays = computed(() => {
  const start = startOfWeek(currentDate.value, { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i)
    return {
      name: format(date, 'EEEE', { locale: es }),
      dateStr: format(date, 'dd/MM'),
      date: format(date, 'yyyy-MM-dd')
    }
  })
})

const getDayAppointments = (date) => {
  return props.appointments.filter(apt => apt.date === date).sort((a, b) => {
    return a.time.localeCompare(b.time)
  })
}

const getStatusClass = (status) => {
  const classes = {
    'Pendiente': 'bg-warning',
    'Confirmada': 'bg-success',
    'Cancelada': 'bg-danger',
    'Completada': 'bg-info'
  }
  return classes[status] || 'bg-secondary'
}

const previousWeek = () => {
  currentDate.value = addDays(currentDate.value, -7)
}

const nextWeek = () => {
  currentDate.value = addDays(currentDate.value, 7)
}

const currentWeek = () => {
  currentDate.value = new Date()
}
</script>

<style scoped>
.appointment-card {
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
  color: white;
  display: flex;
  flex-direction: column;
}

.appointment-card:hover {
  opacity: 0.8;
}

.table td {
  vertical-align: top;
}
</style>
