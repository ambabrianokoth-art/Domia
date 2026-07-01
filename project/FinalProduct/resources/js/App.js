import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

// Import components
import Home from './components/Home.vue'
import Login from './components/Auth/Login.vue'
import SignUp from './components/Auth/SignUp.vue'
import ForgotPassword from './components/Auth/ForgotPassword.vue'
import NewPassword from './components/Auth/NewPassword.vue'
import ResetSuccess from './components/Auth/ResetSuccess.vue'
import AdminDashboard from './components/admin/AdminDashboard.vue'
import UserManagement from './components/admin/UserManagement.vue'
import TaskManagement from './components/admin/TaskManagement.vue'
import GuestDashboard from './components/Guest/GuestDashboard.vue'
import TaskView from './components/Guest/TaskView.vue'
import NotFound from './components/common/NotFound.vue'

// Store
import { useAuthStore } from './stores/auth'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/new-password', name: 'NewPassword', component: NewPassword },
  { path: '/reset-success', name: 'ResetSuccess', component: ResetSuccess },
  { 
    path: '/admin', 
    name: 'AdminDashboard', 
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }
  },
  { 
    path: '/admin/users', 
    name: 'UserManagement', 
    component: UserManagement,
    meta: { requiresAuth: true, role: 'admin' }
  },
  { 
    path: '/admin/tasks', 
    name: 'TaskManagement', 
    component: TaskManagement,
    meta: { requiresAuth: true, role: 'admin' }
  },
  { 
    path: '/dashboard', 
    name: 'GuestDashboard', 
    component: GuestDashboard,
    meta: { requiresAuth: true, role: 'guest' }
  },
  { 
    path: '/tasks', 
    name: 'TaskView', 
    component: TaskView,
    meta: { requiresAuth: true, role: 'guest' }
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.role && authStore.user?.role !== to.meta.role) {
    next('/login')
  } else {
    next()
  }
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')