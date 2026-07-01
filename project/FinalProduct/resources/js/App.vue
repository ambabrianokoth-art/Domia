<template>
  <div id="app">
    <div v-if="isLoading" class="page-loader">
      <div class="loader-content">
        <div class="loader-spinner"></div>
        <div class="loader-text">Loading...</div>
      </div>
    </div>
    <router-view />
    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import ToastNotification from './components/notifications/ToastNotification.vue'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)

// Show loader during route transitions
router.beforeEach((to, from, next) => {
  if (from.name && to.name !== from.name) {
    isLoading.value = true
  }
  next()
})

router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 500) // Show loader for at least 500ms for smooth transition
})

onMounted(() => {
  authStore.initializeAuth()
})
</script>

<style>
.page-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader-content {
  text-align: center;
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e1e1e1;
  border-top: 3px solid var(--ms-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loader-text {
  color: var(--ms-primary);
  font-size: 0.8rem;
  font-weight: 600;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>