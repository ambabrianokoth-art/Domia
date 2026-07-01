<template>
  <div class="new-password-page">
    <div class="new-password-container">
      <div class="new-password-card">
        <div class="new-password-header">
          <h1>Set New Password</h1>
          <p>Enter your new password below</p>
        </div>
        
        <form @submit.prevent="handleResetPassword" class="new-password-form">
          <div class="form-group">
            <label for="password" class="form-label">New Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="form-control"
              placeholder="Enter new password (min. 8 characters)"
              :class="{ 'is-invalid': errors.password }"
              required
            />
            <div v-if="errors.password" class="invalid-feedback">
              {{ errors.password }}
            </div>
          </div>
          
          <div class="form-group">
            <label for="password_confirmation" class="form-label">Confirm Password</label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              class="form-control"
              placeholder="Confirm new password"
              :class="{ 'is-invalid': errors.password_confirmation }"
              required
            />
            <div v-if="errors.password_confirmation" class="invalid-feedback">
              {{ errors.password_confirmation }}
            </div>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary btn-reset"
            :disabled="!isFormValid || authStore.loading"
          >
            <span v-if="authStore.loading" class="spinner"></span>
            <span v-else>Update Password</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  password: '',
  password_confirmation: ''
})

const errors = ref({
  password: '',
  password_confirmation: ''
})

const resetToken = ref('')

const isFormValid = computed(() => {
  return form.value.password.length >= 8 &&
         form.value.password === form.value.password_confirmation
})

onMounted(() => {
  resetToken.value = route.query.token || ''
  if (!resetToken.value) {
    router.push('/login')
  }
})

const validateForm = () => {
  errors.value = { password: '', password_confirmation: '' }
  let isValid = true
  
  if (!form.value.password) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
    isValid = false
  }
  
  if (form.value.password !== form.value.password_confirmation) {
    errors.value.password_confirmation = 'Passwords do not match'
    isValid = false
  }
  
  return isValid
}

const handleResetPassword = async () => {
  if (!validateForm()) return
  
  const result = await authStore.resetPassword(
    resetToken.value,
    form.value.password,
    form.value.password_confirmation
  )
  
  if (result.success) {
    router.push('/reset-success')
  }
}
</script>

<style scoped>
.new-password-page {
  min-height: 100vh;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.new-password-container {
  width: 100%;
  max-width: 400px;
}

.new-password-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 3rem 2rem;
  text-align: center;
}

.new-password-header {
  margin-bottom: 2rem;
}

.new-password-header h1 {
  color: var(--ms-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.new-password-header p {
  color: #666;
  font-size: 0.8rem;
}

.new-password-form {
  text-align: left;
}

.btn-reset {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
}

@media (max-width: 480px) {
  .new-password-card {
    padding: 2rem 1.5rem;
  }
}
</style>