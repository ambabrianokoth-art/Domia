import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref([])

  const addNotification = (notification) => {
    const id = Date.now().toString()
    const newNotification = {
      id,
      duration: 5000,
      ...notification
    }
    
    notifications.value.push(newNotification)
    
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
    
    return id
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const showSuccess = (title, message) => {
    return addNotification({ 
      type: 'success', 
      title: message ? title : null,
      message: message || title || 'Success'
    })
  }

  const showError = (title, message) => {
    return addNotification({ 
      type: 'error', 
      title: message ? title : null,
      message: message || title || 'Error'
    })
  }

  const showWarning = (title, message) => {
    return addNotification({ 
      type: 'warning', 
      title: message ? title : null,
      message: message || title || 'Warning'
    })
  }

  const showInfo = (title, message) => {
    return addNotification({ 
      type: 'info', 
      title: message ? title : null,
      message: message || title || 'Info'
    })
  }

  const clearAll = () => {
    notifications.value = []
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll
  }
})