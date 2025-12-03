import { ref, computed } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'
import { useUserStore } from '../store'

export const useAuth = () => {
  const userStore = useUserStore()
  const loading = ref(true)

  // No usar onMounted aquí, solo proveer las referencias
  const initAuth = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        userStore.setUser(user)
        await userStore.fetchUserData(user.uid)
      } else {
        userStore.clearUser()
      }
      loading.value = false
    })
  }

  return {
    loading,
    user: computed(() => userStore.user),
    userData: computed(() => userStore.userData),
    isAuthenticated: computed(() => userStore.isAuthenticated),
    initAuth
  }
}
