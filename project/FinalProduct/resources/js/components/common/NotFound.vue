<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div class="not-found-actions">
          <router-link to="/" class="btn btn-primary">
            Go Home
          </router-link>
          <button @click="$router.go(-1)" class="btn btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No JavaScript logic needed for this component
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.not-found-container {
  text-align: center;
  max-width: 500px;
}

.error-code {
  font-size: 6rem;
  font-weight: 700;
  color: var(--ms-primary);
  margin-bottom: 1rem;
}

.not-found-content h1 {
  font-size: 2rem;
  color: var(--ms-dark);
  margin-bottom: 1rem;
}

.not-found-content p {
  color: #666;
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.not-found-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

@media (max-width: 480px) {
  .error-code {
    font-size: 4rem;
  }
  
  .not-found-content h1 {
    font-size: 1.5rem;
  }
  
  .not-found-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>