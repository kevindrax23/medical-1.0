<template>
  <div class="loading-spinner" :class="{ 'full-screen': fullScreen }">
    <div class="spinner-container">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  fullScreen: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Cargando...'
  }
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
}

.loading-spinner.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 9999;
}

.spinner-container {
  text-align: center;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.3rem;
}

.full-screen .spinner-border {
  border-color: rgba(255, 255, 255, 0.3);
  border-top-color: white;
}

.loading-message {
  margin-top: 1rem;
  color: #6c757d;
  font-weight: 500;
}

.full-screen .loading-message {
  color: white;
  font-size: 1.1rem;
}
</style>
