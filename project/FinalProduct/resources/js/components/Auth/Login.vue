<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Sign In</h1>
          <p>Enter your credentials to continue</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email address</label>
            <div class="input-wrapper">
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-control"
                placeholder="Example: amba@example.com"
                :class="{ 'is-invalid': errors.email }"
                required
              />
              <div class="input-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 4l6 4 6-4v8H2V4zm0-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4a2 2 0 012-2z"/>
                </svg>
              </div>
            </div>
            <div v-if="errors.email" class="invalid-feedback">
              {{ errors.email }}
            </div>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="password-input-wrapper">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Enter your password"
              :class="{ 'is-invalid': errors.password }"
              required
            />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
              >
                <svg v-if="showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
            <div v-if="errors.password" class="invalid-feedback">
              {{ errors.password }}
            </div>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary btn-login"
            :class="{ 'btn-enabled': isFormValid }"
            :disabled="!isFormValid || authStore.loading"
          >
            <span v-if="authStore.loading" class="spinner"></span>
            <span v-else>Sign In</span>
            <svg v-if="!authStore.loading" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0l8 8-8 8v-6H0V6h8V0z"/>
            </svg>
          </button>
        </form>
        
        <div class="login-footer">
          <router-link to="/forgot-password" class="link">
            Forgot your password?
          </router-link>
          <div class="signup-link">
            Don't have an account? 
            <router-link to="/signup" class="link">Sign up</router-link>
          </div>
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

const showPassword = ref(false)

const form = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: '',
  password: ''
})

const isFormValid = computed(() => {
  return form.value.email.includes('@') && 
         form.value.password.length >= 8
})

const validateForm = () => {
  errors.value = { email: '', password: '' }
  let isValid = true
  
  if (!form.value.email) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!form.value.email.includes('@')) {
    errors.value.email = 'Please enter a valid email'
    isValid = false
  }
  
  if (!form.value.password) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
    isValid = false
  }
  
  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  const result = await authStore.login(form.value)
  
  if (result.success) {
    const redirectPath = authStore.isAdmin ? '/admin' : '/dashboard'
    router.push(redirectPath)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 3rem 2rem;
  text-align: center;
}

.login-header {
  margin-bottom: 2rem;
}

.login-header h1 {
  color: var(--ms-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #666;
  font-size: 0.8rem;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 1.5rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--ms-success);
  opacity: 0.7;
}

.form-control {
  padding-right: 2.5rem;
}

.btn-login {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #e1e1e1;
  color: #666;
  border: 1px solid #d1d1d1;
  transition: all 0.2s ease;
}

.btn-login.btn-enabled {
  background-color: var(--ms-primary);
  color: white;
  border-color: var(--ms-primary);
}

.btn-login.btn-enabled:hover:not(:disabled) {
  background-color: var(--ms-secondary);
  border-color: var(--ms-secondary);
}

.login-footer {
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

.signup-link {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #666;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0.25rem;
  border-radius: 3px;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: var(--ms-primary);
}

.password-input-wrapper .form-control {
  padding-right: 2.5rem;
}

@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
  }
}
</style>