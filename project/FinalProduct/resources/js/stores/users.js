import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiService } from '../services/api'
import { useNotificationStore } from './notifications'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const loading = ref(false)
  const notificationStore = useNotificationStore()

  const fetchUsers = async () => {
    loading.value = true
    try {
      const response = await apiService.get('/users')
      
      if (response.result_code === 1) {
        users.value = response.data
      } else {
        notificationStore.showError(response.message || 'Failed to fetch users')
      }
    } catch (error) {
      notificationStore.showError(error.message || 'Failed to fetch users')
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData) => {
    loading.value = true
    try {
      const response = await apiService.post('/users', userData)
      
      if (response.result_code === 1) {
        users.value.push(response.data)
        notificationStore.showSuccess(response.message || 'User created successfully')
        return { success: true }
      } else {
        notificationStore.showError(response.message || 'Failed to create user')
        return { success: false, message: response.message }
      }
    } catch (error) {
      notificationStore.showError(error.message || 'Failed to create user')
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id, userData) => {
    loading.value = true
    try {
      const response = await apiService.put(`/users/${id}`, userData)
      
      if (response.result_code === 1) {
        const index = users.value.findIndex(u => u.id === id)
        if (index !== -1) {
          users.value[index] = response.data
        }
        notificationStore.showSuccess(response.message || 'User updated successfully')
        return { success: true }
      } else {
        notificationStore.showError(response.message || 'Failed to update user')
        return { success: false, message: response.message }
      }
    } catch (error) {
      notificationStore.showError(error.message || 'Failed to update user')
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id) => {
    loading.value = true
    try {
      const response = await apiService.delete(`/users/${id}`)
      
      if (response.result_code === 1) {
        users.value = users.value.filter(u => u.id !== id)
        notificationStore.showSuccess(response.message || 'User deleted successfully')
        return { success: true }
      } else {
        notificationStore.showError(response.message || 'Failed to delete user')
        return { success: false, message: response.message }
      }
    } catch (error) {
      notificationStore.showError(error.message || 'Failed to delete user')
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  }
})