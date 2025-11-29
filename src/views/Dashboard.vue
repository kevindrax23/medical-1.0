<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h2>Dashboard</h2>
        <p class="text-muted">Bienvenido, {{ userData?.name }}</p>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="row g-4">
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="bi bi-calendar-check fs-1 text-primary mb-3"></i>
            <h3 class="mb-0">{{ stats.todayAppointments }}</h3>
            <p class="text-muted mb-0">Citas Hoy</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="bi bi-people fs-1 text-success mb-3"></i>
            <h3 class="mb-0">{{ stats.totalPatients }}</h3>
            <p class="text-muted mb-0">Total Pacientes</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="bi bi-clock-history fs-1 text-warning mb-3"></i>
            <h3 class="mb-0">{{ stats.pendingAppointments }}</h3>
            <p class="text-muted mb-0">Citas Pendientes</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="bi bi-file-medical fs-1 text-info mb-3"></i>
            <h3 class="mb-0">{{ stats.totalRecords }}</h3>
            <p class="text-muted mb-0">Historias Clínicas</p>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="card">
          <div class="card-header bg-white">
            <h5 class="mb-0">Próximas Citas</h5>
          </div>
          <div class="card-body">
            <div v-if="upcomingAppointments.length === 0" class="text-center py-4">
              <p class="text-muted">No hay citas próximas</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="appointment in upcomingAppointments" :key="appointment.id">
                    <td>{{ appointment.patientName }}</td>
                    <td>{{ formatDate(appointment.date) }}</td>
                    <td>{{ appointment.time }}</td>
                    <td>
                      <span class="badge" :class="getStatusClass(appointment.status)">
                        {{ appointment.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card">
          <div class="card-header bg-white">
            <h5 class="mb-0">Accesos Rápidos</h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <router-link to="/appointments" class="btn btn-outline-primary">
                <i class="bi bi-plus-circle me-2"></i>Nueva Cita
              </router-link>
              <router-link to="/patients" class="btn btn-outline-success">
                <i class="bi bi-person-plus me-2"></i>Nuevo Paciente
              </router-link>
              <router-link to="/medical-records" class="btn btn-outline-info">
                <i class="bi bi-file-earmark-plus me-2"></i>Nueva Historia
              </router-link>
            </div>
          </div>
        </div>

        <div class="card mt-4">
          <div class="card-header bg-white">
            <h5 class="mb-0">Mi Clínica</h5>
          </div>
          <div class="card-body">
            <p class="mb-2"><strong>Nombre:</strong> {{ userData?.clinicName }}</p>
            <p class="mb-2"><strong>Especialidad:</strong> {{ userData?.specialty }}</p>
            <p class="mb-0"><strong>Email:</strong> {{ userData?.email }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../store'
import { getAppointments } from '../services/appointmentService'
import { getPatients } from '../services/patientService'
import { getMedicalRecords } from '../services/medicalRecordService'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const userStore = useUserStore()
const userData = computed(() => userStore.userData)
const loading = ref(true)
const appointments = ref([])
const patients = ref([])
const records = ref([])

const stats = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.value.filter(a => a.date === today).length
  const pendingAppointments = appointments.value.filter(a => a.status === 'Pendiente').length
  
  return {
    todayAppointments,
    totalPatients: patients.value.length,
    pendingAppointments,
    totalRecords: records.value.length
  }
})

const upcomingAppointments = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return appointments.value
    .filter(a => a.date >= today)
    .slice(0, 5)
})

const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es })
  } catch {
    return dateString
  }
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

onMounted(async () => {
  try {
    const userId = userStore.user.uid
    const [appointmentsData, patientsData, recordsData] = await Promise.all([
      getAppointments(userId),
      getPatients(userId),
      getMedicalRecords(userId)
    ])
    
    appointments.value = appointmentsData
    patients.value = patientsData
    records.value = recordsData
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
})
</script>
