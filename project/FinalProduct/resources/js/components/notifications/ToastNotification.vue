<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div">
      <div
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        class="toast"
        :class="[notification.type]"
      >
        <div class="toast-content">
          <div class="toast-icon">
            <svg v-if="notification.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
            <svg v-else-if="notification.type === 'error'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <svg v-else-if="notification.type === 'warning'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div class="toast-body">
            <div v-if="notification.title && notification.message" class="toast-title">{{ notification.title }}</div>
            <div class="toast-message">{{ notification.message }}</div>
          </div>
          <button 
            @click="notificationStore.removeNotification(notification.id)"
            class="toast-close"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotificationStore } from '../../stores/notifications'

const notificationStore = useNotificationStore()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1050;
  max-width: 280px;
}

.toast {
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 0.5rem;
  border-left: 3px solid var(--ms-primary);
  overflow: hidden;
  font-size: 0.75rem;
}

.toast.success {
  border-left-color: var(--ms-success);
}

.toast.error {
  border-left-color: var(--ms-danger);
}

.toast.warning {
  border-left-color: var(--ms-warning);
}

.toast-content {
  display: flex;
  align-items: flex-start;
  padding: 0.75rem;
  gap: 0.5rem;
}

.toast-icon {
  flex-shrink: 0;
  color: var(--ms-primary);
  margin-top: 0.1rem;
}

.toast.success .toast-icon {
  color: var(--ms-success);
}

.toast.error .toast-icon {
  color: var(--ms-danger);
}

.toast.warning .toast-icon {
  color: var(--ms-warning);
}

.toast-body {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  color: var(--ms-dark);
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.toast-message {
  color: #666;
  font-size: 0.7rem;
  line-height: 1.3;
  word-wrap: break-word;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0.25rem;
  border-radius: 3px;
  transition: background-color 0.2s ease;
  margin-top: -0.1rem;
}

.toast-close:hover {
  background: rgba(0, 0, 0, 0.1);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 480px) {
  .toast-container {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}
</style>