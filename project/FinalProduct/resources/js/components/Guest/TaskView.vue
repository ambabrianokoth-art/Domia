<template>
  <div class="guest-layout">
    <Sidebar :is-open="sidebarOpen" @close-sidebar="sidebarOpen = false" />
    
    <div class="main-content">
      <Navbar 
        title="My Tasks" 
        :show-menu-toggle="true"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />
      
      <div class="content">
        <div class="content-header">
          <h2>My Tasks</h2>
          <div class="filter-section">
            <div class="task-stats">
              <span class="stat-item">
                <span class="stat-number">{{ tasksStore.userTasks.length }}</span>
                <span class="stat-label">Total</span>
              </span>
              <span class="stat-item pending">
                <span class="stat-number">{{ pendingCount }}</span>
                <span class="stat-label">Pending</span>
              </span>
              <span class="stat-item progress">
                <span class="stat-number">{{ progressCount }}</span>
                <span class="stat-label">In Progress</span>
              </span>
              <span class="stat-item completed">
                <span class="stat-number">{{ completedCount }}</span>
                <span class="stat-label">Completed</span>
              </span>
            </div>
            <select v-model="statusFilter" class="form-control filter-select">
              <option value="">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button @click="loadTasks" class="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23,4 23,10 17,10"></polyline>
                <polyline points="1,20 1,14 7,14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.64A9 9 0 0 1 3.51 15"></path>
              </svg>
              Refresh
            </button>
          </div>
        </div>
        
        <div class="tasks-container">
          <div v-if="tasksStore.loading" class="loading">
            <div class="spinner"></div>
            <span>Loading your tasks...</span>
          </div>
          
          <div v-else>
            <div v-if="filteredTasks.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <h3>{{ statusFilter ? `No ${formatStatus(statusFilter).toLowerCase()} tasks` : 'No tasks assigned' }}</h3>
              <p>{{ statusFilter ? 'Try changing the filter to see other tasks.' : 'You don\'t have any tasks assigned yet.' }}</p>
            </div>
            
            <div v-else class="tasks-grid">
              <div 
                v-for="task in filteredTasks" 
                :key="task.id" 
                class="task-card"
              >
                <div class="task-header">
                  <div class="task-title">{{ task.title }}</div>
                  <span class="badge" :class="getBadgeClass(task.status)">
                    {{ formatStatus(task.status) }}
                  </span>
                </div>
                
                <div class="task-body">
                  <p class="task-description">{{ task.description }}</p>
                  
                  <div class="task-meta">
                    <div class="meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                      </svg>
                      <span>Due: {{ formatDate(task.deadline) }}</span>
                    </div>
                    
                    <div class="meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>Assigned by: {{ task.assignedBy.name }}</span>
                    </div>
                    
                    <div class="meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>Created: {{ formatDate(task.created_at) }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="task-actions">
                  <button 
                    v-if="task.status === 'pending'"
                    @click="updateTaskStatus(task.id, 'in_progress')"
                    class="btn btn-primary"
                    :disabled="tasksStore.loading"
                  >
                    <span v-if="updatingTask === task.id" class="spinner"></span>
                    <span v-else>Start Task</span>
                  </button>
                  
                  <button 
                    v-if="task.status === 'in_progress'"
                    @click="updateTaskStatus(task.id, 'completed')"
                    class="btn btn-success"
                    :disabled="tasksStore.loading"
                  >
                    <span v-if="updatingTask === task.id" class="spinner"></span>
                    <span v-else>Mark Complete</span>
                  </button>
                  
                  <button 
                    v-if="task.status === 'in_progress'"
                    @click="updateTaskStatus(task.id, 'pending')"
                    class="btn btn-secondary"
                    :disabled="tasksStore.loading"
                  >
                    <span v-if="updatingTask === task.id" class="spinner"></span>
                    <span v-else>Move to Pending</span>
                  </button>
                  
                  <button 
                    v-if="task.status === 'completed'"
                    @click="updateTaskStatus(task.id, 'in_progress')"
                    class="btn btn-secondary"
                    :disabled="tasksStore.loading"
                  >
                    <span v-if="updatingTask === task.id" class="spinner"></span>
                    <span v-else>Reopen Task</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTasksStore } from '../../stores/tasks'
import Sidebar from '../common/Sidebar.vue'
import Navbar from '../common/Navbar.vue'

const sidebarOpen = ref(false)
const tasksStore = useTasksStore()
const statusFilter = ref('')
const updatingTask = ref(null)

const filteredTasks = computed(() => {
  if (!statusFilter.value) {
    return tasksStore.userTasks
  }
}
)

const pendingCount = computed(() => 
  tasksStore.userTasks.filter(t => t.status === 'pending').length
)

const progressCount = computed(() => 
  tasksStore.userTasks.filter(t => t.status === 'in_progress').length
)

const completedCount = computed(() => 
  tasksStore.userTasks.filter(t => t.status === 'completed').length
)

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
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const updateTaskStatus = async (taskId, status) => {
  updatingTask.value = taskId
  await tasksStore.updateTaskStatus(taskId, status)
  updatingTask.value = null
}

const loadTasks = () => {
  tasksStore.fetchUserTasks()
}
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

.content {
  padding: 1.5rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.content-header h2 {
  color: var(--ms-dark);
  margin: 0;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.task-stats {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 3px solid var(--ms-primary);
}

.stat-item.pending {
  border-left-color: var(--ms-warning);
}

.stat-item.progress {
  border-left-color: var(--ms-primary);
}

.stat-item.completed {
  border-left-color: var(--ms-success);
}

.stat-number {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--ms-dark);
}

.stat-label {
  font-size: 0.7rem;
  color: #666;
}

.filter-select {
  min-width: 150px;
}

.tasks-container {
  width: 100%;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 3rem;
  color: #666;
  font-size: 0.8rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--ms-dark);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  font-size: 0.8rem;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.task-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border: 1px solid #e1e1e1;
  transition: all 0.2s ease;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: var(--ms-primary);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.task-title {
  font-weight: 600;
  color: var(--ms-dark);
  font-size: 1.0rem;
  line-height: 1.3;
}

.task-body {
  margin-bottom: 1.5rem;
}

.task-description {
  color: #666;
  font-size: 0.8rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.task-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.7rem;
}

.meta-item svg {
  width: 14px;
  height: 14px;
  color: var(--ms-primary);
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.task-actions .btn {
  flex: 1;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .filter-section {
    flex-direction: column;
    width: 100%;
    align-items: stretch;
  }
  
  .task-stats {
    justify-content: space-between;
    flex-wrap: wrap;
  }
  
  .stat-item {
    flex: 1;
    min-width: 80px;
  }
  
  .filter-select {
    min-width: unset;
  }
  
  .tasks-grid {
    grid-template-columns: 1fr;
  }
  
  .task-actions {
    flex-direction: column;
  }
  
  .task-actions .btn {
    min-width: unset;
  }
}
</style>