<template>
  <div class="signup-page">
    <div class="signup-container">
      <div class="signup-card">
        <div class="signup-header">
          <h1>Create Account</h1>
          <p>Join our task management platform</p>
        </div>
        
        <form @submit.prevent="handleSignup" class="signup-form">
          <div class="form-group">
            <label for="name" class="form-label">Full Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="form-control"
              placeholder="Enter your full name"
              :class="{ 'is-invalid': errors.name }"
              required
            />
            <div v-if="errors.name" class="invalid-feedback">
              {{ errors.name }}
            </div>
          </div>
          
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
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="password-input-wrapper">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Create a password (min. 8 characters)"
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
          
          <div class="form-group">
            <label for="password_confirmation" class="form-label">Confirm Password</label>
            <div class="password-input-wrapper">
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Confirm your password"
              :class="{ 'is-invalid': errors.password_confirmation }"
              required
            />
              <button 
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="password-toggle"
              >
                <svg v-if="showConfirmPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
            <div v-if="errors.password_confirmation" class="invalid-feedback">
              {{ errors.password_confirmation }}
            </div>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary btn-signup"
            :disabled="!isFormValid || authStore.loading"
          >
            <span v-if="authStore.loading" class="spinner"></span>
            <span v-else>Create Account</span>
          </button>
        </form>
        
        <div class="signup-footer">
          <div class="signin-link">
            Already have an account? 
            <router-link to="/login" class="link">Sign in</router-link>
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
const showConfirmPassword = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const errors = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const isFormValid = computed(() => {
  return form.value.name.length >= 2 &&
         form.value.email.includes('@') && 
         form.value.password.length >= 8 &&
         form.value.password === form.value.password_confirmation
})

const validateForm = () => {
  errors.value = { name: '', email: '', password: '', password_confirmation: '' }
  let isValid = true
  
  if (!form.value.name || form.value.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
    isValid = false
  }
  
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
  
  if (form.value.password !== form.value.password_confirmation) {
    errors.value.password_confirmation = 'Passwords do not match'
    isValid = false
  }
  
  return isValid
}

const handleSignup = async () => {
  if (!validateForm()) return
  
  const result = await authStore.register(form.value)
  
  if (result.success) {
    router.push('/login')
  }
}
</script>

<style scoped>
.signup-page {
  min-height: 100vh;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.signup-container {
  width: 100%;
  max-width: 400px;
}

.signup-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 3rem 2rem;
  text-align: center;
}

.signup-header {
  margin-bottom: 2rem;
}

.signup-header h1 {
  color: var(--ms-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.signup-header p {
  color: #666;
  font-size: 0.8rem;
}

.signup-form {
  text-align: left;
}

.btn-signup {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
}

.signup-footer {
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

.signin-link {
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
  .signup-card {
    padding: 2rem 1.5rem;
  }
}
</style>