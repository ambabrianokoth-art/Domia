<template>
  <div class="sidebar" :class="{ 'open': isOpen }">
    <div class="sidebar-header">
      <router-link to="/" class="sidebar-brand">
        <div class="brand-icon"></div>
        <h1 style="color: var(--ms-primary)">Cytonn System</h1>
      </router-link>
      <button 
        v-if="isOpen" 
        @click="$emit('close-sidebar')" 
        class="close-btn"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
      <router-link 
        :to="authStore.isAdmin ? '/admin' : '/dashboard'" 
        class="nav-item"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>Dashboard</span>
      </router-link>
      
      <router-link v-if="authStore.isGuest" to="/tasks" class="nav-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10,9 9,9 8,9"></polyline>
        </svg>
        <span>My Tasks</span>
      </router-link>
      
      <router-link v-if="authStore.isAdmin" to="/admin/users" class="nav-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Users</span>
      </router-link>
      
      <router-link v-if="authStore.isAdmin" to="/admin/tasks" class="nav-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10,9 9,9 8,9"></polyline>
        </svg>
        <span>Tasks</span>
      </router-link>
      <nav class="sidebar-nav">
      <router-link to="/" class="nav-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9,22 9,12 15,12 15,22"></polyline>
        </svg>
        <span>Home Page</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close-sidebar'])

const authStore = useAuthStore()
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: transform 0.3s ease;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e1e1e1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--ms-primary);
  transition: color 0.2s ease;
}

.sidebar-brand:hover {
  color: var(--ms-secondary);
}

.brand-icon {
  font-size: 1.5rem;
}

.sidebar-brand h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  color: #666;
  display: none;
}

.close-btn:hover {
  background: var(--ms-light);
}

.sidebar-nav {
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: var(--ms-dark);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  font-weight: 500;
}

.nav-item:hover {
  background: var(--ms-light);
  color: var(--ms-primary);
}

.nav-item.router-link-active {
  background: var(--ms-light);
  color: var(--ms-primary);
  border-right: 3px solid var(--ms-primary);
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .close-btn {
    display: block;
  }
}
</style>