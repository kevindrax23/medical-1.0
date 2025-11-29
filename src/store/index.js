import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUserData } from '../services/authService'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const userData = ref(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => user.value !== null)
  const userRole = computed(() => userData.value?.role || null)

  const setUser = (newUser) => {
    user.value = newUser
  }

  const setUserData = (data) => {
    userData.value = data
  }

  const fetchUserData = async (uid) => {
    loading.value = true
    try {
      const data = await getUserData(uid)
      userData.value = data
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      loading.value = false
    }
  }

  const clearUser = () => {
    user.value = null
    userData.value = null
  }

  return {
    user,
    userData,
    loading,
    isAuthenticated,
    userRole,
    setUser,
    setUserData,
    fetchUserData,
    clearUser
  }
})
