import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService } from '../services/api'
import { useNotificationStore } from './notifications'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const notificationStore = useNotificationStore()

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isGuest = computed(() => user.value?.role === 'guest')

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      apiService.setAuthToken(savedToken)
    }
  }

  const login = async (credentials) => {
    loading.value = true
    try {
      const response = await apiService.post('/auth/login', credentials)
      
      if (response.result_code === 1) {
        token.value = response.data.token
        user.value = response.data.user
        
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        apiService.setAuthToken(response.data.token)
        notificationStore.showSuccess(response.message || 'Login successful')
        
        return { success: true, user: response.data.user }
      } else {
        notificationStore.showError(response.message || 'Login failed')
        return { success: false, message: response.message }
      }
    } catch (error) {
      notificationStore.showError(error.message || 'Login failed')
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  const register = async (data) => {
    loading.value = true
    try {
      const response = await apiService.post('/auth/register', data)
      
      if (response.result_code === 1) {
        notificationStore.showSuccess(response.message || 'Registration successful')
        return { success: true }
      } else {
        notificationStore.showError(response.message || 'Registration failed')
        return { success: false, message: response.message }
      }
    } catch (error) {
      notificationStore.showError(error.message || 'Registration failed')
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await apiService.post('/auth/logout')
    } catch (error) {
      // Continue with logout even if API call fails
    }
    
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    apiService.setAuthToken(null)
    notificationStore.showSuccess('Logged out successfully')
  }

  const forgotPassword = async (email) => {
    loading.value = true
    try {
      const response = await apiService.post('/auth/forgot-password', { email })
      
      if (response.result_code === 1) {
        notificationStore.showSuccess(response.message || 'Password reset email sent')
        return { success: true }
      } else {
        notificationStore.showError(response.message || 'Failed to send reset email')
        return { success: false, message: response.message }
      }
    } catch (error) {
      notificationStore.showError(error.message || 'Failed to send reset email')
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (token, password, passwordConfirmation) => {
    loading.value = true
    try {
      const response = await apiService.post('/auth/reset-password', {
        token,
        password,
        password_confirmation: passwordConfirmation
      })
      
      if (response.result_code === 1) {
        notificationStore.showSuccess(response.message || 'Password reset successful')
        return { success: true }
      } else {
        notificationStore.showError(response.message || 'Password reset failed')
        return { success: false, message: response.message }
      }
    } catch (error) {
      notificationStore.showError(error.message || 'Password reset failed')
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    isGuest,
    initializeAuth,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword
  }
})