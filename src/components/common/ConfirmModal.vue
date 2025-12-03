<template>
  <teleport to="body">
    <div 
      class="modal fade" 
      :class="{ show: internalShow, 'd-block': internalShow }"
      :id="modalId"
      tabindex="-1"
      @click="handleBackdropClick"
    >
      <div class="modal-dialog modal-dialog-centered" @click.stop>
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" @click="handleClose"></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-3">
              <i class="bi bi-exclamation-triangle-fill text-warning" style="font-size: 3rem;"></i>
            </div>
            <p class="text-center">{{ message }}</p>
          </div>
          <div class="modal-footer border-0">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="handleClose"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="handleConfirm"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="internalShow" class="modal-backdrop fade show"></div>
  </teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modalId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Confirmar Acción'
  },
  message: {
    type: String,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'close'])

const internalShow = ref(false)

watch(() => props.show, (newVal) => {
  internalShow.value = newVal
})

const handleConfirm = () => {
  emit('confirm')
  handleClose()
}

const handleClose = () => {
  internalShow.value = false
  emit('close')
}

const handleBackdropClick = () => {
  handleClose()
}
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  border: none;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1.5rem 1.5rem 0.5rem;
}

.modal-body {
  padding: 1rem 1.5rem;
}

.modal-footer {
  padding: 0.5rem 1.5rem 1.5rem;
}
</style>
