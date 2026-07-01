<template>
  <div class="forgot-password-page">
    <div class="forgot-password-container">
      <div class="forgot-password-card">
        <div class="forgot-password-header">
          <h1>Reset Password</h1>
          <p>Enter your email address and we'll send you a reset link</p>
        </div>
        
        <form @submit.prevent="handleForgotPassword" class="forgot-password-form">
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-control"
              placeholder="Enter your email address"
              :class="{ 'is-invalid': errors.email }"
              required
            />
            <div v-if="errors.email" class="invalid-feedback">
              {{ errors.email }}
            </div>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary btn-reset"
            :disabled="!isFormValid || authStore.loading"
          >
            <span v-if="authStore.loading" class="spinner"></span>
            <span v-else>Send Reset Link</span>
          </button>
        </form>
        
        <div class="forgot-password-footer">
          <router-link to="/login" class="link">
            Back to Sign In
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: ''
})

const errors = ref({
  email: ''
})

const isFormValid = computed(() => {
  return form.value.email.includes('@')
})

const validateForm = () => {
  errors.value = { email: '' }
  let isValid = true
  
  if (!form.value.email) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!form.value.email.includes('@')) {
    errors.value.email = 'Please enter a valid email'
    isValid = false
  }
  
  return isValid
}

const handleForgotPassword = async () => {
  if (!validateForm()) return
  
  const result = await authStore.forgotPassword(form.value.email)
  
  if (result.success) {
    router.push('/login')
  }
}
</script>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.forgot-password-container {
  width: 100%;
  max-width: 400px;
}

.forgot-password-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 3rem 2rem;
  text-align: center;
}

.forgot-password-header {
  margin-bottom: 2rem;
}

.forgot-password-header h1 {
  color: var(--ms-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.forgot-password-header p {
  color: #666;
  font-size: 0.8rem;
}

.forgot-password-form {
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

.forgot-password-footer {
  margin-top: 2rem;
  text-align: center;
}

.link {
  color: var(--ms-primary);
  text-decoration: none;
  font-size: 0.8rem;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .forgot-password-card {
    padding: 2rem 1.5rem;
  }
}
</style>