<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
        <transition name="modal-slide">
          <div v-if="show" class="modal-content" @click.stop>
            <div class="modal-icon">
              <i class="bi bi-box-arrow-right"></i>
            </div>
            
            <div class="modal-body">
              <h3 class="modal-title">¿Cerrar Sesión?</h3>
              <p class="modal-message">
                ¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder al sistema.
              </p>
            </div>
            
            <div class="modal-actions">
              <button 
                class="btn btn-cancel" 
                @click="$emit('close')"
                type="button"
              >
                <i class="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
              <button 
                class="btn btn-confirm" 
                @click="$emit('confirm')"
                type="button"
              >
                <i class="bi bi-check-circle me-2"></i>
                Sí, Cerrar Sesión
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

const handleOverlayClick = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: 100%;
  overflow: hidden;
  animation: modalBounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes modalBounce {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-icon {
  background: linear-gradient(135deg, #fc8181 0%, #e53e3e 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon i {
  font-size: 4rem;
  color: white;
  animation: iconPulse 2s infinite;
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.modal-body {
  padding: 2rem;
  text-align: center;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.modal-message {
  color: #718096;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 0 2rem 2rem;
}

.btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-cancel {
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-confirm {
  background: linear-gradient(135deg, #fc8181 0%, #e53e3e 100%);
  color: white;
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(229, 62, 62, 0.4);
}

.btn-confirm:active {
  transform: translateY(0);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active {
  transition: all 0.3s ease;
}

.modal-slide-leave-active {
  transition: all 0.2s ease;
}

.modal-slide-enter-from {
  transform: translateY(-50px);
  opacity: 0;
}

.modal-slide-leave-to {
  transform: translateY(50px);
  opacity: 0;
}

@media (max-width: 576px) {
  .modal-content {
    border-radius: 16px;
  }

  .modal-icon {
    padding: 1.5rem;
  }

  .modal-icon i {
    font-size: 3rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-message {
    font-size: 0.9rem;
  }

  .modal-actions {
    flex-direction: column;
    padding: 0 1.5rem 1.5rem;
  }

  .btn {
    padding: 0.75rem 1rem;
  }
}
</style>
