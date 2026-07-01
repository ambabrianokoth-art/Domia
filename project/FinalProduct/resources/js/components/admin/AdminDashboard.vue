<template>
  <div class="admin-layout">
    <Sidebar :is-open="sidebarOpen" @close-sidebar="sidebarOpen = false" />
    
    <div class="main-content">
      <Navbar 
        title="Admin Dashboard" 
        :show-menu-toggle="true"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />
      
      <div class="dashboard-content">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalUsers }}</div>
            <div class="stat-label">Total Users</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalTasks }}</div>
            <div class="stat-label">Total Tasks</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-number">{{ stats.pendingTasks }}</div>
            <div class="stat-label">Pending Tasks</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-number">{{ stats.completedTasks }}</div>
            <div class="stat-label">Completed Tasks</div>
          </div>
        </div>
        
        <div class="dashboard-grid">
          <div class="card">
            <div class="card-header">
              <h3>Recent Tasks</h3>
              <div class="header-actions">
                <div class="filter-controls">
                  <select v-model="taskStatusFilter" class="form-control filter-select">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  
                  <select v-model="taskSortOrder" class="form-control filter-select">
                    <option value="desc">Deadline: Latest First</option>
                    <option value="asc">Deadline: Earliest First</option>
                  </select>
                </div>
                
                <router-link 
                  to="/admin/tasks" 
                  class="btn btn-secondary btn-sm"
                  v-if="filteredTasks.length >= 5"
                >
                  View All
                </router-link>
              </div>
            </div>
            
            <div v-if="tasksStore.loading" class="loading">
              <div class="spinner"></div>
              <span>Loading tasks...</span>
            </div>
            
            <div v-else>
              <div v-if="displayedTasks.length === 0" class="empty-state">
                No tasks found
              </div>
              <div v-else class="task-list">
                <div 
                  v-for="task in displayedTasks" 
                  :key="task.id" 
                  class="task-item"
                  @click="viewTaskDetails(task)"
                >
                  <div class="task-info">
                    <div class="task-title">{{ task.title }}</div>
                    <div class="task-user">Assigned to: {{ task.user?.name || 'N/A' }}</div>
                  </div>
                  <div class="task-meta">
                    <span class="badge" :class="getBadgeClass(task.status)">
                      {{ formatStatus(task.status) }}
                    </span>
                    <span class="task-date">{{ formatDate(task.deadline) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h3>Recent Users</h3>
              <router-link 
                to="/admin/users" 
                class="btn btn-secondary btn-sm"
                v-if="usersStore.users.length >= 5"
              >
                View All
              </router-link>
            </div>
            
            <div v-if="usersStore.loading" class="loading">
              <div class="spinner"></div>
              <span>Loading users...</span>
            </div>
            
            <div v-else>
              <div v-if="displayedUsers.length === 0" class="empty-state">
                No users found
              </div>
              <div v-else class="user-list">
                <div 
                  v-for="user in displayedUsers" 
                  :key="user.id" 
                  class="user-item"
                  @click="viewUserDetails(user)"
                >
                  <div class="user-avatar">
                    {{ getUserInitials(user.name) }}
                  </div>
                  <div class="user-info">
                    <div class="user-name">{{ user.name }}</div>
                    <div class="user-email">{{ user.email }}</div>
                  </div>
                  <div class="user-role">
                    <span class="badge badge-secondary">{{ user.role }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dashboard-grid">
          <div class="card">
            <div class="card-header">
              <h3>System Overview</h3>
            </div>
            
            <div class="system-stats">
              <div class="system-item">
                <div class="system-icon">🟢</div>
                <div class="system-info">
                  <div class="system-title">Server Status</div>
                  <div class="system-value">Online</div>
                </div>
              </div>
              
              <div class="system-item">
                <div class="system-icon">💾</div>
                <div class="system-info">
                  <div class="system-title">Database</div>
                  <div class="system-value">Connected</div>
                </div>
              </div>
              
              <div class="system-item">
                <div class="system-icon">🔄</div>
                <div class="system-info">
                  <div class="system-title">Last Backup</div>
                  <div class="system-value">2 hours ago</div>
                </div>
              </div>
              
              <div class="system-item">
                <div class="system-icon">📊</div>
                <div class="system-info">
                  <div class="system-title">Storage Used</div>
                  <div class="system-value">45%</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h3>Quick Admin Actions</h3>
            </div>
            
            <div class="admin-actions">
              <div class="admin-action-item">
                <div class="action-icon">👥</div>
                <div class="action-info">
                  <div class="action-title">Manage Users</div>
                  <div class="action-desc">Add, edit, or remove users</div>
                </div>
              </div>
              
              <div class="admin-action-item">
                <div class="action-icon">📈</div>
                <div class="action-info">
                  <div class="action-title">View Reports</div>
                  <div class="action-desc">System analytics and reports</div>
                </div>
              </div>
              
              <div class="admin-action-item">
                <div class="action-icon">⚙️</div>
                <div class="action-info">
                  <div class="action-title">System Settings</div>
                  <div class="action-desc">Configure system preferences</div>
                </div>
              </div>
              
              <div class="admin-action-item">
                <div class="action-icon">🔒</div>
                <div class="action-info">
                  <div class="action-title">Security Logs</div>
                  <div class="action-desc">Monitor security events</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Task Details Modal -->
  <div v-if="showTaskModal" class="modal-overlay" @click="showTaskModal = false">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>Task Details</h3>
        <button @click="showTaskModal = false" class="close-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="modal-body" v-if="selectedTask">
        <div class="detail-group">
          <label class="detail-label">Title</label>
          <div class="detail-value">{{ selectedTask.title }}</div>
        </div>
        
        <div class="detail-group">
          <label class="detail-label">Description</label>
          <div class="detail-value">{{ selectedTask.description }}</div>
        </div>
        
        <div class="detail-group">
          <label class="detail-label">Assigned To</label>
          <div class="detail-value">{{ selectedTask.user?.name || 'N/A' }}</div>
        </div>
        
        <div class="detail-group">
          <label class="detail-label">Status</label>
          <span class="badge" :class="getBadgeClass(selectedTask.status)">
            {{ formatStatus(selectedTask.status) }}
          </span>
        </div>
        
        <div class="detail-group">
          <label class="detail-label">Deadline</label>
          <div class="detail-value">{{ formatDate(selectedTask.deadline) }}</div>
        </div>
        
        <div class="detail-group">
          <label class="detail-label">Created</label>
          <div class="detail-value">{{ formatDate(selectedTask.created_at) }}</div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="showTaskModal = false" class="btn btn-secondary">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- User Details Modal -->
  <div v-if="showUserModal" class="modal-overlay" @click="showUserModal = false">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>User Details</h3>
        <button @click="showUserModal = false" class="close-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="modal-body" v-if="selectedUser">
        <div class="detail-group">
          <label class="detail-label">Name</label>
          <div class="detail-value">{{ selectedUser.name }}</div>
        </div>
        
        <div class="detail-group">
          <label class="detail-label">Email</label>
          <div class="detail-value">{{ selectedUser.email }}</div>
        </div>
        
        <div class="detail-group">
          <label class="detail-label">Role</label>
          <span class="badge badge-secondary">{{ selectedUser.role }}</span>
        </div>
        
        <div class="detail-group">
          <label class="detail-label">Created</label>
          <div class="detail-value">{{ formatDate(selectedUser.created_at) }}</div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="showUserModal = false" class="btn btn-secondary">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTasksStore } from '../../stores/tasks'
import { useUsersStore } from '../../stores/users'
import Sidebar from '../common/Sidebar.vue'
import Navbar from '../common/Navbar.vue'

const sidebarOpen = ref(false)
const tasksStore = useTasksStore()
const usersStore = useUsersStore()

const taskStatusFilter = ref('')
const taskSortOrder = ref('desc')
const showTaskModal = ref(false)
const showUserModal = ref(false)
const selectedTask = ref(null)
const selectedUser = ref(null)

const stats = computed(() => ({
  totalUsers: usersStore.users.length,
  totalTasks: tasksStore.tasks.length,
  pendingTasks: tasksStore.tasks.filter(t => t.status === 'pending').length,
  completedTasks: tasksStore.tasks.filter(t => t.status === 'completed').length
}))

const filteredTasks = computed(() => {
  let filtered = tasksStore.tasks
  
  // Filter by status
  if (taskStatusFilter.value) {
    filtered = filtered.filter(task => task.status === taskStatusFilter.value)
  }
  
  // Sort by deadline
  filtered = filtered.sort((a, b) => {
    const dateA = new Date(a.deadline)
    const dateB = new Date(b.deadline)
    return taskSortOrder.value === 'desc' ? dateB - dateA : dateA - dateB
  })
  
  return filtered
})

const displayedTasks = computed(() => 
  filteredTasks.value.slice(0, 5)
)

const displayedUsers = computed(() => 
  usersStore.users.slice(0, 5)
)

const viewTaskDetails = (task) => {
  selectedTask.value = task
  showTaskModal.value = true
}

const viewUserDetails = (user) => {
  selectedUser.value = user
  showUserModal.value = true
}

const getBadgeClass = (status) => {
  switch (status) {
    case 'pending': return 'badge-pending'
    case 'in_progress': return 'badge-progress'
    case 'completed': return 'badge-completed'
    default: return 'badge-pending'
  }
}

const formatStatus = (status) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const getUserInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

onMounted(() => {
  // Only fetch if not already loaded
  if (tasksStore.tasks.length === 0) {
    tasksStore.fetchTasks()
  }
  if (usersStore.users.length === 0) {
    usersStore.fetchUsers()
  }
})
</script>

<style scoped>
.admin-layout {
  display: flex;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  min-height: 100vh;
}

.dashboard-content {
  padding: 1.5rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-header h3 {
  margin: 0;
  color: var(--ms-dark);
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.filter-select {
  min-width: 120px;
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  color: #666;
  font-size: 0.8rem;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #666;
  font-size: 0.8rem;
}

.task-list,
.user-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-item,
.user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.task-item:hover,
.user-item:hover {
  background: var(--ms-light);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-info {
  flex: 1;
}

.task-title {
  font-weight: 600;
  color: var(--ms-dark);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.task-user {
  color: #666;
  font-size: 0.7rem;
}

.task-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.task-date {
  font-size: 0.7rem;
  color: #666;
}

.user-item {
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--ms-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: var(--ms-dark);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.user-email {
  color: #666;
  font-size: 0.7rem;
}

.badge-secondary {
  background-color: var(--ms-light);
  color: var(--ms-dark);
}

.system-stats,
.admin-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.system-item,
.admin-action-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.admin-action-item {
  cursor: pointer;
}

.admin-action-item:hover {
  background: var(--ms-light);
  border-color: var(--ms-primary);
}

.system-icon,
.action-icon {
  font-size: 1.5rem;
}

.system-info,
.action-info {
  flex: 1;
}

.system-title,
.action-title {
  font-weight: 600;
  color: var(--ms-dark);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.system-value,
.action-desc {
  color: #666;
  font-size: 0.7rem;
}

.detail-group {
  margin-bottom: 1rem;
}

.detail-label {
  display: block;
  font-weight: 600;
  color: var(--ms-dark);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.detail-value {
  color: #666;
  font-size: 0.8rem;
  line-height: 1.4;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  color: #666;
}

.close-btn:hover {
  background: var(--ms-light);
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .task-item,
  .user-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .task-meta {
    align-items: flex-start;
    flex-direction: row;
    gap: 0.5rem;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-select {
    min-width: unset;
  }
}
</style>