<template>
  <div class="admin-layout">
    <Sidebar :is-open="sidebarOpen" @close-sidebar="sidebarOpen = false" />
    
    <div class="main-content">
      <Navbar 
        title="Task Management" 
        :show-menu-toggle="true"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />
      
      <div class="content">
        <div class="content-header">
          <h2>Tasks</h2>
          <div class="header-actions">
            <div class="filter-controls">
              <select v-model="statusFilter" class="form-control filter-select">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              
              <select v-model="sortOrder" class="form-control filter-select">
                <option value="desc">Deadline: Latest First</option>
                <option value="asc">Deadline: Earliest First</option>
              </select>
            </div>
            
            <div v-if="showBulkActions" class="bulk-actions">
              <span class="selected-count">{{ selectedTasks.length }} selected</span>
              <button @click="bulkDeleteTasks" class="btn btn-danger btn-sm">
                Delete Selected
              </button>
            </div>
            
            <button @click="tasksStore.refreshTasks()" class="btn btn-secondary" :disabled="tasksStore.loading">
              <span v-if="tasksStore.loading" class="spinner"></span>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23,4 23,10 17,10"></polyline>
                <polyline points="1,20 1,14 7,14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.64A9 9 0 0 1 3.51 15"></path>
              </svg>
              Refresh
            </button>
            <button @click="showCreateModal = true" class="btn btn-primary">
              Create New Task
            </button>
          </div>
        </div>
        
        <div class="card">
          <div v-if="tasksStore.loading" class="loading">
            <div class="spinner"></div>
            <span>Loading tasks...</span>
          </div>
          
          <div v-else>
            <div v-if="filteredTasks.length === 0" class="empty-state">
              <h3>No tasks found</h3>
              <p>Get started by creating your first task.</p>
              <button @click="showCreateModal = true" class="btn btn-primary">
                Create Task
              </button>
            </div>
            
            <div v-else class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>
                      <input 
                        type="checkbox" 
                        @change="toggleSelectAll"
                        :checked="selectedTasks.length === filteredTasks.length && filteredTasks.length > 0"
                      />
                    </th>
                    <th>Title</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="task in filteredTasks" :key="task.id">
                    <td>
                      <input 
                        type="checkbox" 
                        :value="task.id"
                        v-model="selectedTasks"
                      />
                    </td>
                    <td>
                      <div class="task-title">{{ task.title }}</div>
                      <div class="task-description">{{ task.description }}</div>
                    </td>
                    <td>{{ task.user.name }}</td>
                    <td>
                      <span class="badge" :class="getBadgeClass(task.status)">
                        {{ formatStatus(task.status) }}
                      </span>
                    </td>
                    <td>{{ formatDate(task.deadline) }}</td>
                    <td>{{ formatDate(task.created_at) }}</td>
                    <td>
                      <div class="action-buttons">
                        <button 
                          @click="viewTask(task)" 
                          class="btn btn-secondary btn-sm"
                        >
                          View
                        </button>
                        <button 
                          @click="editTask(task)" 
                          class="btn btn-secondary btn-sm"
                        >
                          Edit
                        </button>
                        <button 
                          @click="deleteTask(task)" 
                          class="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create/Edit Task Modal -->
  <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModals">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>{{ showCreateModal ? 'Create New Task' : 'Edit Task' }}</h3>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="title" class="form-label">Title</label>
            <input
              id="title"
              v-model="taskForm.title"
              type="text"
              class="form-control"
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="description" class="form-label">Description</label>
            <textarea
              id="description"
              v-model="taskForm.description"
              class="form-control"
              placeholder="Enter task description"
              rows="3"
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="assigned_to" class="form-label">Assign To</label>
            <select
              id="assigned_to"
              v-model="taskForm.assigned_to"
              class="form-control"
              required
            >
              <option value="">Select a user</option>
              <option 
                v-for="user in usersStore.users" 
                :key="user.id" 
                :value="user.id"
              >
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="deadline" class="form-label">Deadline</label>
            <input
              id="deadline"
              v-model="taskForm.deadline"
              type="datetime-local"
              class="form-control"
              required
            />
          </div>
          
          <div v-if="showEditModal" class="form-group">
            <label for="status" class="form-label">Status</label>
            <select
              id="status"
              v-model="taskForm.status"
              class="form-control"
              required
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </form>
      </div>
      
      <div class="modal-footer">
        <button @click="closeModals" class="btn btn-secondary">
          Cancel
        </button>
        <button 
          @click="handleSubmit" 
          class="btn btn-primary"
          :disabled="tasksStore.loading"
        >
          <span v-if="tasksStore.loading" class="spinner"></span>
          <span v-else>{{ showCreateModal ? 'Create Task' : 'Update Task' }}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>Delete Task</h3>
      </div>
      
      <div class="modal-body">
        <p>Are you sure you want to delete <strong>{{ taskToDelete?.title }}</strong>?</p>
        <p class="text-danger">This action cannot be undone.</p>
      </div>
      
      <div class="modal-footer">
        <button @click="showDeleteModal = false" class="btn btn-secondary">
          Cancel
        </button>
        <button 
          @click="confirmDelete" 
          class="btn btn-danger"
          :disabled="tasksStore.loading"
        >
          <span v-if="tasksStore.loading" class="spinner"></span>
          <span v-else>Delete Task</span>
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

const selectedTasks = ref([])
const statusFilter = ref('')
const sortOrder = ref('desc')

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const taskForm = ref({
  title: '',
  description: '',
  assigned_to: '',
  deadline: '',
  status: 'pending'
})

const editingTask = ref(null)
const taskToDelete = ref(null)

const showBulkActions = computed(() => selectedTasks.value.length > 0)

const filteredTasks = computed(() => {
  let filtered = tasksStore.tasks
  
  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(task => task.status === statusFilter.value)
  }
  
  // Sort by deadline
  filtered = filtered.sort((a, b) => {
    const dateA = new Date(a.deadline)
    const dateB = new Date(b.deadline)
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB
  })
  
  return filtered
})

const toggleSelectAll = () => {
  if (selectedTasks.value.length === filteredTasks.value.length) {
    selectedTasks.value = []
  } else {
    selectedTasks.value = filteredTasks.value.map(task => task.id)
  }
}

const bulkDeleteTasks = async () => {
  if (confirm(`Are you sure you want to delete ${selectedTasks.value.length} tasks?`)) {
    for (const taskId of selectedTasks.value) {
      await tasksStore.deleteTask(taskId)
    }
    selectedTasks.value = []
  }
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

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  taskForm.value = {
    title: '',
    description: '',
    assigned_to: '',
    deadline: '',
    status: 'pending'
  }
  editingTask.value = null
}

const editTask = (task) => {
  editingTask.value = task
  taskForm.value = {
    title: task.title,
    description: task.description,
    assigned_to: task.assigned_to,
    deadline: new Date(task.deadline).toISOString().slice(0, 16),
    status: task.status
  }
  showEditModal.value = true
}

const viewTask = (task) => {
  editingTask.value = task
  taskForm.value = {
    title: task.title,
    description: task.description,
    assigned_to: task.assigned_to,
    deadline: new Date(task.deadline).toISOString().slice(0, 16),
    status: task.status
  }
  // Set form to read-only mode for viewing
  showEditModal.value = true
}

const deleteTask = (task) => {
  taskToDelete.value = task
  showDeleteModal.value = true
}

const handleSubmit = async () => {
  if (showCreateModal.value) {
    const result = await tasksStore.createTask({
      title: taskForm.value.title,
      description: taskForm.value.description,
      assigned_to: Number(taskForm.value.assigned_to),
      deadline: taskForm.value.deadline
    })
    if (result.success) {
      closeModals()
    }
  } else if (showEditModal.value && editingTask.value) {
    const updateData = {
      title: taskForm.value.title,
      description: taskForm.value.description,
      assigned_to: Number(taskForm.value.assigned_to),
      deadline: taskForm.value.deadline,
      status: taskForm.value.status
    }
    const result = await tasksStore.updateTask(editingTask.value.id, updateData)
    if (result.success) {
      closeModals()
    }
  }
}

const confirmDelete = async () => {
  if (taskToDelete.value) {
    const result = await tasksStore.deleteTask(taskToDelete.value.id)
    if (result.success) {
      showDeleteModal.value = false
      taskToDelete.value = null
    }
  }
}

onMounted(() => {
  // Load initial data
  tasksStore.fetchTasks()
  usersStore.fetchUsers()
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

.content {
  padding: 1.5rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
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
  min-width: 150px;
  font-size: 0.8rem;
}

.bulk-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem;
  background: var(--ms-light);
  border-radius: 4px;
}

.selected-count {
  font-size: 0.8rem;
  color: var(--ms-primary);
  font-weight: 600;
}

.content-header h2 {
  color: var(--ms-dark);
  margin: 0;
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

.empty-state h3 {
  color: var(--ms-dark);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.table-container {
  overflow-x: auto;
}

.task-title {
  font-weight: 600;
  color: var(--ms-dark);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.task-description {
  color: #666;
  font-size: 0.7rem;
  line-height: 1.4;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
}

.text-danger {
  color: var(--ms-danger);
  font-size: 0.8rem;
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
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>