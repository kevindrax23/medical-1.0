<template>
  <div 
    class="modal fade" 
    :id="modalId" 
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          {{ message }}
        </div>
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-secondary" 
            data-bs-dismiss="modal"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            class="btn btn-danger" 
            @click="handleConfirm"
            data-bs-dismiss="modal"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
  }
})

const emit = defineEmits(['confirm'])

const handleConfirm = () => {
  emit('confirm')
}
</script>
