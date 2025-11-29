import { ref } from 'vue'

export const useFirestore = () => {
  const loading = ref(false)
  const error = ref(null)

  const executeOperation = async (operation) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await operation()
      return result
    } catch (err) {
      error.value = err.message
      console.error('Firestore operation error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    executeOperation
  }
}
