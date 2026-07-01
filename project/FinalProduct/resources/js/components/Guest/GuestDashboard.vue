<template>
  <div class="guest-layout">
    <Sidebar :is-open="sidebarOpen" @close-sidebar="sidebarOpen = false" />
    
    <div class="main-content">
      <Navbar 
        title="Dashboard" 
        :show-menu-toggle="true"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />
      
      <div class="dashboard-content">
        <div class="welcome-section">
          <h2>Welcome back, {{ authStore.user?.name }}!</h2>
          <p>Here's an overview of your current tasks</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalTasks }}</div>
            <div class="stat-label">Total Tasks</div>
          </div>
          
          <div class="stat-card pending">
            <div class="stat-number">{{ stats.pendingTasks }}</div>
            <div class="stat-label">Pending Tasks</div>
          </div>
          
          <div class="stat-card progress">
            <div class="stat-number">{{ stats.inProgressTasks }}</div>
            <div class="stat-label">In Progress</div>
          </div>
          
          <div class="stat-card completed">
            <div class="stat-number">{{ stats.completedTasks }}</div>
            <div class="stat-label">Completed</div>
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
                  to="/tasks" 
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
                <div class="empty-icon">📋</div>
                <h4>No tasks assigned</h4>
                <p>You don't have any tasks assigned yet.</p>
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
                    <div class="task-description">{{ task.description }}</div>
                    <div class="task-deadline">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                      </svg>
                      Due: {{ formatDate(task.deadline) }}
                    </div>
                  </div>
                  <div class="task-actions" @click.stop>
                    <span class="badge" :class="getBadgeClass(task.status)">
                      {{ formatStatus(task.status) }}
                    </span>
                    <div class="task-controls">
                      <button 
                        v-if="task.status === 'pending'"
                        @click="updateTaskStatus(task.id, 'in_progress')"
                        class="btn btn-primary btn-sm"
                        title="Start Task"
                      >
                        Start
                      </button>
                      <button 
                        v-if="task.status === 'in_progress'"
                        @click="updateTaskStatus(task.id, 'completed')"
                        class="btn btn-success btn-sm"
                        title="Complete Task"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h3>Quick Actions</h3>
            </div>
            
            <div class="quick-actions">
              <div class="action-item">
                <div class="action-icon">📊</div>
                <div class="action-info">
                  <div class="action-title">Create Report</div>
                  <div class="action-desc">Generate task reports</div>
                </div>
              </div>
              
              <div class="action-item">
                <div class="action-icon">📈</div>
                <div class="action-info">
                  <div class="action-title">View Analytics</div>
                  <div class="action-desc">Check your performance</div>
                </div>
              </div>
              
              <div class="action-item">
                <div class="action-icon">⚙️</div>
                <div class="action-info">
                  <div class="action-title">Settings</div>
                  <div class="action-desc">Manage preferences</div>
                </div>
              </div>
              
              <div class="action-item">
                <div class="action-icon">💬</div>
                <div class="action-info">
                  <div class="action-title">Messages</div>
                  <div class="action-desc">Team communications</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dashboard-grid">
          <div class="card">
            <div class="card-header">
              <h3>Recent Activity</h3>
            </div>
            
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon completed">✓</div>
                <div class="activity-info">
                  <div class="activity-text">Completed "Design Homepage"</div>
                  <div class="activity-time">2 hours ago</div>
                </div>
              </div>
              
              <div class="activity-item">
                <div class="activity-icon progress">⏳</div>
                <div class="activity-info">
                  <div class="activity-text">Started "API Integration"</div>
                  <div class="activity-time">4 hours ago</div>
                </div>
              </div>
              
              <div class="activity-item">
                <div class="activity-icon pending">📋</div>
                <div class="activity-info">
                  <div class="activity-text">Assigned "User Testing"</div>
                  <div class="activity-time">1 day ago</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h3>Notifications</h3>
            </div>
            
            <div class="notification-list">
              <div class="notification-item">
                <div class="notification-icon">🔔</div>
                <div class="notification-info">
                  <div class="notification-text">Task deadline approaching</div>
                  <div class="notification-time">30 minutes ago</div>
                </div>
              </div>
              
              <div class="notification-item">
                <div class="notification-icon">✅</div>
                <div class="notification-info">
                  <div class="notification-text">Task completed successfully</div>
                  <div class="notification-time">2 hours ago</div>
                </div>
              </div>
              
              <div class="notification-item">
                <div class="notification-icon">📝</div>
                <div class="notification-info">
                  <div class="notification-text">New task assigned</div>
                  <div class="notification-time">5 hours ago</div>
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
          <label class="detail-label">Assigned By</label>
          <div class="detail-value">{{ selectedTask.assignedBy?.name || 'N/A' }}</div>
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTasksStore } from '../../stores/tasks'
import { useAuthStore } from '../../stores/auth'
import Sidebar from '../common/Sidebar.vue'
import Navbar from '../common/Navbar.vue'

const sidebarOpen = ref(false)
const tasksStore = useTasksStore()
const authStore = useAuthStore()

const taskStatusFilter = ref('')
const taskSortOrder = ref('desc')
const showTaskModal = ref(false)
const selectedTask = ref(null)

const stats = computed(() => ({
  totalTasks: tasksStore.userTasks.length,
  pendingTasks: tasksStore.userTasks.filter(t => t.status === 'pending').length,
  inProgressTasks: tasksStore.userTasks.filter(t => t.status === 'in_progress').length,
  completedTasks: tasksStore.userTasks.filter(t => t.status === 'completed').length
}))

const filteredTasks = computed(() => {
  let filtered = tasksStore.userTasks
  
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

const viewTaskDetails = (task) => {
  selectedTask.value = task
  showTaskModal.value = true
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

const updateTaskStatus = async (taskId, status) => {
  await tasksStore.updateTaskStatus(taskId, status)
}

onMounted(() => {
  // Only fetch if not already loaded
  if (tasksStore.userTasks.length === 0) {
    tasksStore.fetchUserTasks()
  }
})
</script>

<style scoped>
.guest-layout {
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

.welcome-section {
  margin-bottom: 2rem;
}

.welcome-section h2 {
  color: var(--ms-dark);
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
}

.welcome-section p {
  color: #666;
  font-size: 0.8rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
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
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h4 {
  color: var(--ms-dark);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  font-size: 0.8rem;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.task-item:hover {
  background: var(--ms-light);
  border-color: var(--ms-primary);
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
  margin-bottom: 0.5rem;
}

.task-description {
  color: #666;
  font-size: 0.7rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.task-deadline {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  font-size: 0.7rem;
}

.task-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.task-controls {
  display: flex;
  gap: 0.5rem;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.action-item:hover {
  background: var(--ms-light);
  border-color: var(--ms-primary);
}

.action-icon {
  font-size: 1.5rem;
}

.action-info {
  flex: 1;
}

.action-title {
  font-weight: 600;
  color: var(--ms-dark);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.action-desc {
  color: #666;
  font-size: 0.7rem;
}

.activity-list,
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item,
.notification-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
}

.activity-icon,
.notification-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.activity-icon.completed {
  background: var(--ms-success);
  color: white;
}

.activity-icon.progress {
  background: var(--ms-primary);
  color: white;
}

.activity-icon.pending {
  background: var(--ms-warning);
  color: white;
}

.notification-icon {
  background: var(--ms-light);
  color: var(--ms-primary);
}

.activity-info,
.notification-info {
  flex: 1;
}

.activity-text,
.notification-text {
  font-weight: 500;
  color: var(--ms-dark);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.activity-time,
.notification-time {
  color: #666;
  font-size: 0.7rem;
}

.stat-card.pending {
  border-left: 4px solid var(--ms-warning);
}

.stat-card.progress {
  border-left: 4px solid var(--ms-primary);
}

.stat-card.completed {
  border-left: 4px solid var(--ms-success);
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
  
  .task-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .task-actions {
    align-items: flex-start;
    flex-direction: row;
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