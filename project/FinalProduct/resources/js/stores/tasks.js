import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiService } from '../services/api'
import { useNotificationStore } from './notifications'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const userTasks = ref([])
  const loading = ref(false)
  const notificationStore = useNotificationStore()

  const fetchTasks = async () => {
    loading.value = true
    try {
      const response = await apiService.get('/tasks')
      
      if (response.result_code === 1) {
        tasks.value = response.data
      } else {
        notificationStore.showError(response.message || 'Failed to fetch tasks')
      }
    } catch (error) {
      notificationStore.showError(error.message || 'Failed to fetch tasks')
    } finally {
      loading.value = false
    }
  }

  const fetchUserTasks = async () => {
    loading.value = true
    try {
      const response = await apiService.get('/tasks/my-tasks')
      
      if (response.result_code === 1) {
        userTasks.value = response.data
      } else {
        notificationStore.showError(response.message || 'Failed to fetch your tasks')
      }
    } catch (error) {
      notificationStore.showError(error.message || 'Failed to fetch your tasks')
    } finally {
      loading.value = false
    }
  }

  const createTask = async (taskData) => {
    loading.value = true
    try {
      const response = await apiService.post('/tasks', taskData)
      
      if (response.result_code === 1) {
        tasks.value.push(response.data)
        notificationStore.showSuccess(response.message || 'Task created successfully')
        return { success: true }
      } else {
        notificationStore.showError(response.message || 'Failed to create task')
        return { success: false, message: response.message }
      }
    } catch (error) {
      notificationStore.showError(error.message || 'Failed to create task')
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (id, taskData) => {
    loading.value = true
    try {
      const response = await apiService.put(`/tasks/${id}`, taskData)
      
      if (response.result_code === 1) {
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tasks.value[index] = response.data
        }
        
        const userIndex = userTasks.value.findIndex(t => t.id === id)
        if (userIndex !== -1) {
          userTasks.value[userIndex] = response.data
        }
        
        notificationStore.showSuccess(response.message || 'Task updated successfully')
        return { success: true }
      } else {
        notificationStore.showError(response.message || 'Failed to update task')
        return { success: false, message: response.message }
      }
    } catch (error) {
      notificationStore.showError(error.message || 'Failed to update task')
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  const updateTaskStatus = async (id, status) => {
    return updateTask(id, { status })
  }

  const deleteTask = async (id) => {
    loading.value = true
    try {
      const response = await apiService.delete(`/tasks/${id}`)
      
      if (response.result_code === 1) {
        tasks.value = tasks.value.filter(t => t.id !== id)
        userTasks.value = userTasks.value.filter(t => t.id !== id)
        notificationStore.showSuccess(response.message || 'Task deleted successfully')
        return { success: true }
      } else {
        notificationStore.showError(response.message || 'Failed to delete task')
        return { success: false, message: response.message }
      }
    } catch (error) {
      notificationStore.showError(error.message || 'Failed to delete task')
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  const refreshTasks = async () => {
    // Only refresh when explicitly called (manual refresh button)
    await fetchTasks()
  }

  const refreshUserTasks = async () => {
    // Only refresh when explicitly called (manual refresh button)
    await fetchUserTasks()
  }

  return {
    tasks,
    userTasks,
    loading,
    fetchTasks,
    fetchUserTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    refreshTasks,
    refreshUserTasks
  }
})