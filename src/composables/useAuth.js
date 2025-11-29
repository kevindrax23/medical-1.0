import { ref, onMounted } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'
import { useUserStore } from '../store'

export const useAuth = () => {
  const userStore = useUserStore()
  const loading = ref(true)

  onMounted(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        userStore.setUser(user)
        await userStore.fetchUserData(user.uid)
      } else {
        userStore.clearUser()
      }
      loading.value = false
    })
  })

  return {
    loading,
    user: userStore.user,
    userData: userStore.userData,
    isAuthenticated: userStore.isAuthenticated
  }
}
