<template>
  <div class="d-flex justify-content-center align-items-center" :style="{ height: height }">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  height: {
    type: String,
    default: '200px'
  }
})
</script>
