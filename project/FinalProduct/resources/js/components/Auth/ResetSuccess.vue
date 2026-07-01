<template>
  <div class="reset-success-page">
    <div class="reset-success-container">
      <div class="reset-success-card">
        <div class="success-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22,4 12,14.01 9,11.01"></polyline>
          </svg>
        </div>
        
        <div class="reset-success-content">
          <h1>Password Reset Successful</h1>
          <p>Your password has been successfully updated. You can now sign in with your new password.</p>
        </div>
        
        <div class="reset-success-actions">
          <router-link to="/login" class="btn btn-primary">
            Sign In
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No JavaScript logic needed for this component
</script>

<style scoped>
.reset-success-page {
  min-height: 100vh;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.reset-success-container {
  width: 100%;
  max-width: 400px;
}

.reset-success-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 3rem 2rem;
  text-align: center;
}

.success-icon {
  color: var(--ms-success);
  margin-bottom: 2rem;
}

.reset-success-content h1 {
  color: var(--ms-dark);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.reset-success-content p {
  color: #666;
  font-size: 0.8rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.reset-success-actions .btn {
  padding: 0.75rem 2rem;
}

@media (max-width: 480px) {
  .reset-success-card {
    padding: 2rem 1.5rem;
  }
}
</style>