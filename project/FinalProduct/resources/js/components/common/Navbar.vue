<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="navbar-left">
        <button 
          v-if="showMenuToggle"
          @click="$emit('toggleSidebar')"
          class="menu-toggle"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 class="navbar-title">{{ title }}</h1>
      </div>
      
      <div class="navbar-right">
        <div class="user-info">
          <div class="user-details">
            <span class="user-name">{{ authStore.user?.name }}</span>
            <span class="user-role">{{ authStore.user?.role }}</span>
          </div>
          
          <div class="dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
            <button @click="showDropdown = !showDropdown" class="dropdown-toggle">
              <div class="user-avatar">
                {{ userInitials }}
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
            
            <div v-if="showDropdown" class="dropdown-menu">
              <router-link to="/" class="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9,22 9,12 15,12 15,22"></polyline>
                </svg>
                Home
              </router-link>
              <router-link 
                :to="authStore.isAdmin ? '/admin' : '/dashboard'" 
                class="dropdown-item"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Dashboard
              </router-link>
              <button @click="handleLogout" class="dropdown-item logout-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showMenuToggle: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggleSidebar'])

const router = useRouter()
const authStore = useAuthStore()
const showDropdown = ref(false)

const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const handleLogout = async () => {
  showDropdown.value = false
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  width: 100%;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  color: var(--ms-dark);
  display: none;
}

.menu-toggle:hover {
  background: var(--ms-light);
}

.navbar-title {
  color: var(--ms-primary);
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.user-name {
  font-weight: 600;
  color: var(--ms-dark);
  font-size: 0.8rem;
  line-height: 1.2;
}

.user-role {
  font-size: 0.7rem;
  color: #666;
  text-transform: capitalize;
  line-height: 1.2;
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.dropdown-toggle:hover {
  background: var(--ms-light);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--ms-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  overflow: hidden;
  z-index: 1000;
  margin-top: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--ms-dark);
  background: none;
  border: none;
  text-align: left;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background: var(--ms-light);
}

.logout-btn {
  color: var(--ms-danger);
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }
  
  .user-details {
    display: none;
  }
  
  .navbar-content {
    padding: 1rem;
  }
}
</style>