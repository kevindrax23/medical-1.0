<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h2>Configuración</h2>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <div class="card mb-4">
          <div class="card-header bg-white">
            <h5 class="mb-0">Información Personal</h5>
          </div>
          <div class="card-body">
            <UserSettings />
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card">
          <div class="card-header bg-white">
            <h5 class="mb-0">Configuración de la Clínica</h5>
          </div>
          <div class="card-body">
            <ClinicSettings />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserSettings from '../components/settings/UserSettings.vue'
import ClinicSettings from '../components/settings/ClinicSettings.vue'
</script>
