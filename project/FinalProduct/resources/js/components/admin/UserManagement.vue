<template>
  <div class="admin-layout">
    <Sidebar :is-open="sidebarOpen" @close-sidebar="sidebarOpen = false" />
    
    <div class="main-content">
      <Navbar 
        title="User Management" 
        :show-menu-toggle="true"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />
      
      <div class="content">
        <div class="content-header">
          <h2>Users</h2>
          <div class="header-actions">
            <div v-if="selectedUsers.length > 0" class="bulk-actions">
              <span class="selected-count">{{ selectedUsers.length }} selected</span>
              <button @click="showBulkDeleteModal = true" class="btn btn-danger btn-sm">
                Delete Selected
              </button>
            </div>
            
            <button @click="showCreateModal = true" class="btn btn-primary">
              Add New User
            </button>
          </div>
        </div>
        
        <!-- Filters Section -->
        <div class="filters-section">
          <div class="filters-row">
            <div class="filter-group">
              <label for="search" class="filter-label">Search</label>
              <input
                id="search"
                v-model="filters.search"
                type="text"
                class="form-control filter-input"
                placeholder="Search by name or email..."
              />
            </div>
            
            <div class="filter-group">
              <label for="roleFilter" class="filter-label">Role</label>
              <select
                id="roleFilter"
                v-model="filters.role"
                class="form-control filter-input"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="guest">Guest</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label for="dateFrom" class="filter-label">Created From</label>
              <input
                id="dateFrom"
                v-model="filters.dateFrom"
                type="date"
                class="form-control filter-input"
              />
            </div>
            
            <div class="filter-group">
              <label for="dateTo" class="filter-label">Created To</label>
              <input
                id="dateTo"
                v-model="filters.dateTo"
                type="date"
                class="form-control filter-input"
              />
            </div>
            
            <div class="filter-group">
              <button @click="clearFilters" class="btn btn-secondary filter-clear-btn">
                Clear Filters
              </button>
            </div>
          </div>
          
          <div v-if="hasActiveFilters" class="active-filters">
            <span class="filter-info">
              Showing {{ filteredUsers.length }} of {{ usersStore.users.length }} users
            </span>
            <div class="filter-tags">
              <span v-if="filters.search" class="filter-tag">
                Search: "{{ filters.search }}"
                <button @click="filters.search = ''" class="filter-tag-remove">×</button>
              </span>
              <span v-if="filters.role" class="filter-tag">
                Role: {{ filters.role }}
                <button @click="filters.role = ''" class="filter-tag-remove">×</button>
              </span>
              <span v-if="filters.dateFrom" class="filter-tag">
                From: {{ formatDate(filters.dateFrom) }}
                <button @click="filters.dateFrom = ''" class="filter-tag-remove">×</button>
              </span>
              <span v-if="filters.dateTo" class="filter-tag">
                To: {{ formatDate(filters.dateTo) }}
                <button @click="filters.dateTo = ''" class="filter-tag-remove">×</button>
              </span>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div v-if="usersStore.loading" class="loading">
            <div class="spinner"></div>
            <span>Loading users...</span>
          </div>
          
          <div v-else>
            <div v-if="usersStore.users.length === 0" class="empty-state">
              <h3>No users found</h3>
              <p>Get started by adding your first user.</p>
              <button @click="showCreateModal = true" class="btn btn-primary">
                Add User
              </button>
            </div>
            
            <div v-else-if="filteredUsers.length === 0 && hasActiveFilters" class="empty-state">
              <h3>No users match your filters</h3>
              <p>Try adjusting your search criteria or clear the filters.</p>
              <button @click="clearFilters" class="btn btn-secondary">
                Clear Filters
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
                        :checked="selectedUsers.length === filteredUsers.length && filteredUsers.length > 0"
                      />
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in filteredUsers" :key="user.id">
                    <td>
                      <input 
                        type="checkbox" 
                        :value="user.id"
                        v-model="selectedUsers"
                      />
                    </td>
                    <td>
                      <div class="user-cell">
                        <div class="user-avatar">
                          {{ getUserInitials(user.name) }}
                        </div>
                        <span>{{ user.name }}</span>
                      </div>
                    </td>
                    <td>{{ user.email }}</td>
                    <td>
                      <span class="badge" :class="user.role === 'admin' ? 'badge-completed' : 'badge-pending'">
                        {{ user.role }}
                      </span>
                    </td>
                    <td>{{ formatDate(user.created_at) }}</td>
                    <td>
                      <div class="action-buttons">
                        <button 
                          @click="viewUser(user)" 
                          class="btn btn-secondary btn-sm"
                        >
                          View
                        </button>
                        <button 
                          @click="editUser(user)" 
                          class="btn btn-secondary btn-sm"
                        >
                          Edit
                        </button>
                        <button 
                          @click="deleteUser(user)" 
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

  <!-- Create/Edit User Modal -->
  <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModals">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>{{ showCreateModal ? 'Add New User' : 'Edit User' }}</h3>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name" class="form-label">Full Name</label>
            <input
              id="name"
              v-model="userForm.name"
              type="text"
              class="form-control"
              placeholder="Enter full name"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input
              id="email"
              v-model="userForm.email"
              type="email"
              class="form-control"
              placeholder="Enter email address"
              required
            />
          </div>
          
          <div v-if="showCreateModal" class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="userForm.password"
              type="password"
              class="form-control"
              placeholder="Enter password"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="role" class="form-label">Role</label>
            <select
              id="role"
              v-model="userForm.role"
              class="form-control"
              required
            >
              <option value="guest">Guest</option>
              <option value="admin">Admin</option>
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
          :disabled="usersStore.loading"
        >
          <span v-if="usersStore.loading" class="spinner"></span>
          <span v-else>{{ showCreateModal ? 'Create User' : 'Update User' }}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>Delete User</h3>
      </div>
      
      <div class="modal-body">
        <p>Are you sure you want to delete <strong>{{ userToDelete?.name }}</strong>?</p>
        <p class="text-danger">This action cannot be undone.</p>
      </div>
      
      <div class="modal-footer">
        <button @click="showDeleteModal = false" class="btn btn-secondary">
          Cancel
        </button>
        <button 
          @click="confirmDelete" 
          class="btn btn-danger"
          :disabled="usersStore.loading"
        >
          <span v-if="usersStore.loading" class="spinner"></span>
          <span v-else>Delete User</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Bulk Delete Confirmation Modal -->
  <div v-if="showBulkDeleteModal" class="modal-overlay" @click="showBulkDeleteModal = false">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>Delete Multiple Users</h3>
      </div>
      
      <div class="modal-body">
        <p>Are you sure you want to delete <strong>{{ selectedUsers.length }} users</strong>?</p>
        <p class="text-danger">This action cannot be undone.</p>
      </div>
      
      <div class="modal-footer">
        <button @click="showBulkDeleteModal = false" class="btn btn-secondary">
          Cancel
        </button>
        <button 
          @click="confirmBulkDelete" 
          class="btn btn-danger"
          :disabled="usersStore.loading"
        >
          <span v-if="usersStore.loading" class="spinner"></span>
          <span v-else>Delete Users</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '../../stores/users'
import Sidebar from '../common/Sidebar.vue'
import Navbar from '../common/Navbar.vue'

const sidebarOpen = ref(false)
const usersStore = useUsersStore()

const selectedUsers = ref([])

const filters = ref({
  search: '',
  role: '',
  dateFrom: '',
  dateTo: ''
})

const filteredUsers = computed(() => {
  let users = [...usersStore.users]
  
  // Search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    users = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    )
  }
  
  // Role filter
  if (filters.value.role) {
    users = users.filter(user => user.role === filters.value.role)
  }
  
  // Date range filter
  if (filters.value.dateFrom) {
    const fromDate = new Date(filters.value.dateFrom)
    users = users.filter(user => new Date(user.created_at) >= fromDate)
  }
  
  if (filters.value.dateTo) {
    const toDate = new Date(filters.value.dateTo)
    toDate.setHours(23, 59, 59, 999) // End of day
    users = users.filter(user => new Date(user.created_at) <= toDate)
  }
  
  return users
})

const hasActiveFilters = computed(() => {
  return filters.value.search || 
         filters.value.role || 
         filters.value.dateFrom || 
         filters.value.dateTo
})

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)

const userForm = ref({
  name: '',
  email: '',
  password: '',
  role: 'guest'
})

const editingUser = ref(null)
const userToDelete = ref(null)

const toggleSelectAll = () => {
  if (selectedUsers.value.length === filteredUsers.value.length) {
    selectedUsers.value = []
  } else {
    selectedUsers.value = filteredUsers.value.map(user => user.id)
  }
}

const clearFilters = () => {
  filters.value = {
    search: '',
    role: '',
    dateFrom: '',
    dateTo: ''
  }
  selectedUsers.value = []
}

const confirmBulkDelete = async () => {
  if (selectedUsers.value.length > 0) {
    for (const userId of selectedUsers.value) {
      await usersStore.deleteUser(userId)
    }
    selectedUsers.value = []
    showBulkDeleteModal.value = false
  }
}

const getUserInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  userForm.value = {
    name: '',
    email: '',
    password: '',
    role: 'guest'
  }
  editingUser.value = null
}

const editUser = (user) => {
  editingUser.value = user
  userForm.value = {
    name: user.name,
    email: user.email,
    password: '',
    role: user.role
  }
  showEditModal.value = true
}

const viewUser = (user) => {
  editingUser.value = user
  userForm.value = {
    name: user.name,
    email: user.email,
    password: '',
    role: user.role
  }
  // Set form to read-only mode for viewing
  showEditModal.value = true
}

const deleteUser = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const handleSubmit = async () => {
  if (showCreateModal.value) {
    const result = await usersStore.createUser(userForm.value)
    if (result.success) {
      closeModals()
    }
  } else if (showEditModal.value && editingUser.value) {
    const updateData = {
      name: userForm.value.name,
      email: userForm.value.email,
      role: userForm.value.role
    }
    const result = await usersStore.updateUser(editingUser.value.id, updateData)
    if (result.success) {
      closeModals()
    }
  }
}

const confirmDelete = async () => {
  if (userToDelete.value) {
    const result = await usersStore.deleteUser(userToDelete.value.id)
    if (result.success) {
      showDeleteModal.value = false
      userToDelete.value = null
    }
  }
}

onMounted(() => {
  // Load initial data
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

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
  
  .filters-row {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .filter-group {
    min-width: 100%;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .active-filters {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .filter-tags {
    flex-wrap: wrap;
  }
}

/* Filter Styles */
.filters-section {
  margin-bottom: 1.5rem;
}

.filters-row {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 180px;
}

.filter-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ms-dark);
}

.filter-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.8rem;
}

.filter-input:focus {
  outline: none;
  border-color: var(--ms-primary);
  box-shadow: 0 0 0 2px rgba(var(--ms-primary), 0.1);
}

.filter-clear-btn {
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}

.active-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--ms-light);
  border-radius: 4px;
  border-left: 3px solid var(--ms-primary);
}

.filter-info {
  font-size: 0.8rem;
  color: var(--ms-dark);
  font-weight: 600;
}

.filter-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: var(--ms-primary);
  color: white;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
}

.filter-tag-remove {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
  margin-left: 0.25rem;
  line-height: 1;
}

.filter-tag-remove:hover {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}
</style>