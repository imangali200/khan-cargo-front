<template>
    <div class="branch-management animate-slide-up">
        <!-- Header -->
        <header class="page-header">
            <div class="title-section">
                <h1>Branches Management</h1>
                <p class="subtitle">Manage, monitor, and configure your global warehouse network.</p>
            </div>
            <button @click="openCreateModal" class="add-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Add New Branch
            </button>
        </header>

        <!-- Search & Filters -->
        <div class="filters-bar">
            <div class="search-box">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" v-model="searchValue" @input="handleSearch"
                    placeholder="Search by branch name, location or manager..." />
            </div>
            <div class="filter-controls">
                <select v-model="statusFilter" @change="handleSearch" class="status-select">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button class="filter-btn" @click="resetFilters">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                    </svg>
                    Filters
                </button>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading branches...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredBranches.length === 0 && !loading" class="empty-state">
            <div class="empty-icon">🏢</div>
            <h3>No branches found</h3>
            <p>Add a new branch to get started or clear your search filters.</p>
            <button @click="openCreateModal" class="add-btn">Create Branch</button>
        </div>

        <!-- Table -->
        <div v-else class="table-container">
            <div class="table-wrapper">
                <table class="premium-table">
                    <thead>
                        <tr>
                            <th>BRANCH NAME</th>
                            <th>LOCATION</th>
                            <th>MANAGER</th>
                            <th>CONTACT</th>
                            <th>STATUS</th>
                            <th class="actions-th">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="branch in paginatedBranches" :key="branch.id" class="table-row">
                            <td>
                                <div class="branch-name-cell">
                                    <div class="branch-dot"></div>
                                    <span class="branch-name">{{ branch.name }}</span>
                                </div>
                            </td>
                            <td class="location-td">{{ branch.address || '—' }}</td>
                            <td class="manager-td">
                                <span v-if="branch.admin">{{ branch.admin.name }} {{ branch.admin.lastName }}</span>
                                <span v-else class="no-data">Not assigned</span>
                            </td>
                            <td class="contact-td">
                                <span v-if="branch.admin?.phoneNumber">{{ formatPhone(branch.admin.phoneNumber)
                                }}</span>
                                <span v-else class="no-data">—</span>
                            </td>
                            <td>
                                <span class="status-pill" :class="branch.isActive ? 'active' : 'inactive'">
                                    <span class="status-dot-inner"></span>
                                    {{ branch.isActive ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="actions-td">
                                <div class="btn-group">
                                    <button @click="openEditModal(branch)" class="icon-btn edit" title="Edit">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M12 20h9"></path>
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                        </svg>
                                    </button>
                                    <button @click="deleteBranch(branch)" class="icon-btn delete" title="Delete">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path
                                                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                            </path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="table-footer">
                <span class="showing-text">Showing <strong>{{ getShowingRange() }}</strong> of <strong>{{
                    filteredBranches.length }}</strong> branches</span>
                <div v-if="totalPages > 1" class="pagination">
                    <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn-nav">Previous</button>
                    <div class="page-numbers">
                        <button v-for="p in visiblePages" :key="p" @click="currentPage = p"
                            :class="['num-btn', { active: currentPage === p }]">{{ p }}</button>
                    </div>
                    <button @click="currentPage++" :disabled="currentPage === totalPages"
                        class="page-btn-nav">Next</button>
                </div>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <span class="stat-label">TOTAL BRANCHES</span>
                <span class="stat-value">{{ branchData.length }}</span>
                <span class="stat-sub positive" v-if="branchData.length > 0">Active network</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">ACTIVE STATUS</span>
                <span class="stat-value">{{ activeBranches }}</span>
                <span class="stat-sub">{{ activePercentage }}% operational</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">MANAGERS ASSIGNED</span>
                <span class="stat-value">{{ assignedManagers }}</span>
                <span class="stat-sub" :class="unassignedCount > 0 ? 'warning' : 'positive'">
                    {{ unassignedCount > 0 ? `${unassignedCount} unassigned` : 'All assigned' }}
                </span>
            </div>
            <div class="stat-card">
                <span class="stat-label">INACTIVE</span>
                <span class="stat-value">{{ inactiveBranches }}</span>
                <span class="stat-sub">Awaiting activation</span>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <Teleport to="body">
            <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
                <div class="modal-card">
                    <div class="modal-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path
                                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z">
                            </path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                    <h3>Are you sure you want to delete this branch?</h3>
                    <p class="modal-description">This action cannot be undone. The branch <strong>{{
                        deleteTargetBranch?.name }}</strong> will be permanently removed from the system.</p>
                    <div class="modal-actions">
                        <button class="modal-btn cancel" @click="showDeleteModal = false">Cancel</button>
                        <button class="modal-btn confirm-delete" @click="confirmDelete">Delete Branch</button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Edit Branch Modal -->
        <Teleport to="body">
            <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
                <div class="edit-modal-card">
                    <div class="edit-modal-header">
                        <h3>Edit Branch</h3>
                        <button class="close-modal-btn" @click="showEditModal = false">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="confirmEdit">
                        <div class="edit-form-group">
                            <label>Branch Name</label>
                            <input v-model="editName" type="text" placeholder="Branch name" class="edit-input" />
                        </div>

                        <div class="edit-form-group">
                            <label>Responsible Administrator</label>
                            <div class="edit-select-wrapper">
                                <select v-model="editAdminId" class="edit-input edit-select">
                                    <option value="" disabled>Select administrator</option>
                                    <option v-for="admin in availableAdmins" :key="admin.id" :value="admin.id">
                                        {{ admin.name }} {{ admin.lastName }}
                                    </option>
                                    <option
                                        v-if="editAdminId && !adminList.find(a => a.id === editAdminId) && editTargetBranch?.admin"
                                        :value="editAdminId">
                                        {{ editTargetBranch.admin.name }} {{ editTargetBranch.admin.lastName }}
                                        (current)
                                    </option>
                                </select>
                                <svg class="edit-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                        </div>

                        <div class="edit-form-group">
                            <label>Status</label>
                            <div class="status-toggle">
                                <button type="button" @click="editIsActive = true"
                                    :class="['toggle-option', { active: editIsActive }]">
                                    <span class="toggle-dot active-dot"></span>
                                    Active
                                </button>
                                <button type="button" @click="editIsActive = false"
                                    :class="['toggle-option', { active: !editIsActive }]">
                                    <span class="toggle-dot inactive-dot"></span>
                                    Inactive
                                </button>
                            </div>
                        </div>

                        <div v-if="editError" class="edit-error">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <span>{{ editError }}</span>
                        </div>

                        <div class="modal-actions">
                            <button type="button" class="modal-btn cancel"
                                @click="showEditModal = false">Cancel</button>
                            <button type="submit" class="modal-btn confirm-edit" :disabled="editSubmitting">
                                <div v-if="editSubmitting" class="btn-spinner-sm"></div>
                                {{ editSubmitting ? 'Saving...' : 'Save Changes' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Create Branch Modal -->
        <Teleport to="body">
            <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
                <div class="edit-modal-card">
                    <div class="edit-modal-header">
                        <h3>Add New Branch</h3>
                        <button class="close-modal-btn" @click="showCreateModal = false">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="confirmCreate">
                        <div class="edit-form-group">
                            <label>Branch Name</label>
                            <input v-model="createName" type="text" placeholder="e.g. China Warehouse"
                                class="edit-input" />
                        </div>

                        <div class="edit-form-group">
                            <label>Responsible Administrator</label>
                            <div class="edit-select-wrapper">
                                <select v-model="createAdminId" class="edit-input edit-select">
                                    <option value="" disabled>Select administrator</option>
                                    <option v-for="admin in availableAdmins" :key="admin.id" :value="admin.id">
                                        {{ admin.name }} {{ admin.lastName }}
                                    </option>
                                </select>
                                <svg class="edit-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                        </div>

                        <div v-if="createError" class="edit-error">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <span>{{ createError }}</span>
                        </div>

                        <div class="modal-actions">
                            <button type="button" class="modal-btn cancel"
                                @click="showCreateModal = false">Cancel</button>
                            <button type="submit" class="modal-btn confirm-create" :disabled="createSubmitting">
                                <div v-if="createSubmitting" class="btn-spinner-sm"></div>
                                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                {{ createSubmitting ? 'Creating...' : 'Create Branch' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'super-admin'
})

import { useToast } from '~/composables/useToast'
import type { Branch, User } from '~/types'

const toast = useToast()
const api = useApi()

const branchData = ref<Branch[]>([])
const loading = ref(false)
const searchValue = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const perPage = 5
const showDeleteModal = ref(false)
const deleteTargetBranch = ref<Branch | null>(null)

// Edit modal state
const showEditModal = ref(false)
const editTargetBranch = ref<Branch | null>(null)
const editName = ref('')
const editAdminId = ref<number | string>('')
const editIsActive = ref(true)
const editError = ref('')
const editSubmitting = ref(false)
const adminList = ref<User[]>([])

// Create modal state
const showCreateModal = ref(false)
const createName = ref('')
const createAdminId = ref<number | string>('')
const createError = ref('')
const createSubmitting = ref(false)

const filteredBranches = computed(() => {
    let result = branchData.value
    if (searchValue.value) {
        const q = searchValue.value.toLowerCase()
        result = result.filter(b =>
            b.name.toLowerCase().includes(q) ||
            (b.address && b.address.toLowerCase().includes(q)) ||
            (b.admin && `${b.admin.name} ${b.admin.lastName}`.toLowerCase().includes(q))
        )
    }
    if (statusFilter.value === 'active') {
        result = result.filter(b => b.isActive)
    } else if (statusFilter.value === 'inactive') {
        result = result.filter(b => !b.isActive)
    }
    return result
})

const totalPages = computed(() => Math.ceil(filteredBranches.value.length / perPage) || 1)

const paginatedBranches = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return filteredBranches.value.slice(start, start + perPage)
})

const visiblePages = computed(() => {
    const pages: number[] = []
    for (let i = 1; i <= Math.min(totalPages.value, 5); i++) pages.push(i)
    return pages
})

const activeBranches = computed(() => branchData.value.filter(b => b.isActive).length)
const inactiveBranches = computed(() => branchData.value.filter(b => !b.isActive).length)
const activePercentage = computed(() => {
    if (branchData.value.length === 0) return 0
    return ((activeBranches.value / branchData.value.length) * 100).toFixed(1)
})
const assignedManagers = computed(() => branchData.value.filter(b => b.admin).length)
const unassignedCount = computed(() => branchData.value.filter(b => !b.admin).length)

const getShowingRange = () => {
    if (filteredBranches.value.length === 0) return '0-0'
    const start = (currentPage.value - 1) * perPage + 1
    const end = Math.min(currentPage.value * perPage, filteredBranches.value.length)
    return `${start}-${end}`
}

const formatPhone = (phone: string) => {
    if (!phone) return '—'
    if (phone.length === 11 && phone.startsWith('7')) {
        return `+${phone.slice(0, 1)} (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 11)}`
    }
    return phone
}

const handleSearch = () => {
    currentPage.value = 1
}

const resetFilters = () => {
    searchValue.value = ''
    statusFilter.value = ''
    currentPage.value = 1
}

const fetchBranches = async () => {
    loading.value = true
    try {
        const { data } = await api.branches.findAll()
        branchData.value = data
    } catch {
        toast.error('Error loading branches')
    } finally {
        loading.value = false
    }
}

const loadAdmins = async () => {
    try {
        const { data } = await api.admin.getUsers({ role: 'ADMIN', limit: 100 })
        adminList.value = data.data
    } catch { }
}

// Admins available for selection (exclude those already assigned to other branches)
const availableAdmins = computed(() => {
    const assignedAdminIds = branchData.value
        .filter(b => b.admin?.id)
        .map(b => b.admin!.id)

    return adminList.value.filter(admin => {
        // Always show the current branch's admin when editing
        if (editTargetBranch.value && admin.id === editTargetBranch.value.admin?.id) return true
        // Exclude admins already assigned to another branch
        return !assignedAdminIds.includes(admin.id)
    })
})

const deleteBranch = (branch: Branch) => {
    deleteTargetBranch.value = branch
    showDeleteModal.value = true
}

const confirmDelete = async () => {
    if (!deleteTargetBranch.value) return
    try {
        await api.branches.remove(deleteTargetBranch.value.id)
        toast.success('Branch deleted successfully')
        showDeleteModal.value = false
        deleteTargetBranch.value = null
        fetchBranches()
    } catch {
        toast.error('Error deleting branch')
    }
}

// Edit modal functions
const openEditModal = (branch: Branch) => {
    editTargetBranch.value = branch
    editName.value = branch.name
    editAdminId.value = branch.admin?.id || ''
    editIsActive.value = branch.isActive
    editError.value = ''
    editSubmitting.value = false
    showEditModal.value = true
}

const confirmEdit = async () => {
    if (!editTargetBranch.value) return
    if (!editName.value.trim()) {
        editError.value = 'Branch name is required.'
        return
    }

    editSubmitting.value = true
    editError.value = ''

    try {
        const updateData: any = {
            name: editName.value,
            isActive: editIsActive.value,
        }
        if (editAdminId.value) {
            updateData.adminId = Number(editAdminId.value)
        }

        await api.branches.update(editTargetBranch.value.id, updateData)
        toast.success('Branch updated successfully')
        showEditModal.value = false
        editTargetBranch.value = null
        fetchBranches()
    } catch (error: any) {
        editError.value = error.response?.data?.message || 'Error updating branch'
    } finally {
        editSubmitting.value = false
    }
}

// Create modal functions
const openCreateModal = () => {
    createName.value = ''
    createAdminId.value = ''
    createError.value = ''
    createSubmitting.value = false
    showCreateModal.value = true
}

const confirmCreate = async () => {
    if (!createName.value.trim()) {
        createError.value = 'Branch name is required.'
        return
    }
    if (!createAdminId.value) {
        createError.value = 'Please select an administrator.'
        return
    }

    createSubmitting.value = true
    createError.value = ''

    try {
        await api.branches.create({
            name: createName.value,
            adminId: Number(createAdminId.value)
        })
        toast.success('Branch created successfully')
        showCreateModal.value = false
        fetchBranches()
    } catch (error: any) {
        createError.value = error.response?.data?.message || 'Error creating branch'
    } finally {
        createSubmitting.value = false
    }
}

watch(currentPage, () => {
    if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value
    }
})

onMounted(() => {
    fetchBranches()
    loadAdmins()
})
</script>

<style scoped>
.branch-management {
    padding: 32px 40px;
    max-width: 1200px;
    margin: 0;
    color: #fff;
    font-family: 'Inter', -apple-system, sans-serif;
    display: flex;
    flex-direction: column;
    min-height: 100%;
}

.animate-slide-up {
    animation: slideUp 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Header */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 28px;
}

.title-section h1 {
    font-size: 26px;
    font-weight: 800;
    margin: 0;
    color: white;
    letter-spacing: -0.5px;
}

.subtitle {
    font-size: 14px;
    color: #71717a;
    margin: 6px 0 0;
}

.add-btn {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #fff;
    padding: 12px 22px;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 700;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(34, 197, 94, 0.25);
    border: none;
    cursor: pointer;
}

.add-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.35);
}

.add-btn svg {
    width: 18px;
    height: 18px;
}

/* Filters Bar */
.filters-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #18181b;
    border: 1px solid #27272a;
    padding: 12px 16px;
    border-radius: 10px;
    flex: 1;
    max-width: 520px;
    transition: border-color 0.2s;
}

.search-box:focus-within {
    border-color: #3b82f6;
}

.search-icon {
    width: 16px;
    height: 16px;
    color: #71717a;
    flex-shrink: 0;
}

.search-box input {
    background: transparent;
    border: none;
    outline: none;
    color: #e4e4e7;
    width: 100%;
    font-size: 13px;
}

.search-box input::placeholder {
    color: #52525b;
}

.filter-controls {
    display: flex;
    align-items: center;
    gap: 12px;
}

.status-select {
    background: #18181b;
    border: 1px solid #27272a;
    color: #a1a1aa;
    padding: 12px 36px 12px 16px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    transition: border-color 0.2s;
}

.status-select:focus {
    border-color: #3b82f6;
}

.status-select option {
    background: #18181b;
    color: #e4e4e7;
}

.filter-btn {
    background: #18181b;
    border: 1px solid #27272a;
    color: #a1a1aa;
    padding: 12px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
}

.filter-btn svg {
    width: 14px;
    height: 14px;
}

.filter-btn:hover {
    border-color: #3b82f6;
    color: #e4e4e7;
}

/* Loading */
.loading-state {
    text-align: center;
    padding: 64px;
    color: #71717a;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #27272a;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 64px;
    background-color: #18181b;
    border: 1px solid #27272a;
    border-radius: 12px;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
}

.empty-state h3 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #e4e4e7;
}

.empty-state p {
    color: #71717a;
    margin-bottom: 24px;
    font-size: 14px;
}

/* Table */
.table-container {
    background-color: #18181b;
    border: 1px solid #27272a;
    border-radius: 12px;
    overflow: hidden;
}

.table-wrapper {
    overflow-x: auto;
}

.premium-table {
    width: 100%;
    border-collapse: collapse;
}

.premium-table th {
    text-align: left;
    padding: 16px 24px;
    font-size: 11px;
    color: #71717a;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #27272a;
    background-color: #18181b;
}

.premium-table td {
    padding: 18px 24px;
    border-bottom: 1px solid #27272a;
    background-color: #18181b;
    vertical-align: middle;
}

.table-row:last-child td {
    border-bottom: none;
}

.table-row:hover td {
    background-color: #1f1f22;
}

.branch-name-cell {
    display: flex;
    align-items: center;
    gap: 12px;
}

.branch-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #3b82f6;
    flex-shrink: 0;
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
}

.branch-name {
    font-weight: 600;
    font-size: 14px;
    color: #e4e4e7;
}

.location-td,
.contact-td {
    font-size: 13px;
    color: #a1a1aa;
}

.manager-td {
    font-size: 14px;
    color: #e4e4e7;
    font-weight: 500;
}

.no-data {
    color: #52525b;
    font-style: italic;
}

.status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}

.status-pill.active {
    color: #22c55e;
    background-color: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.2);
}

.status-pill.inactive {
    color: #f97316;
    background-color: rgba(249, 115, 22, 0.1);
    border: 1px solid rgba(249, 115, 22, 0.2);
}

.status-dot-inner {
    width: 6px;
    height: 6px;
    border-radius: 50%;
}

.status-pill.active .status-dot-inner {
    background-color: #22c55e;
    box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
}

.status-pill.inactive .status-dot-inner {
    background-color: #f97316;
}

/* Actions */
.actions-td {
    text-align: right;
}

.btn-group {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.icon-btn {
    background: none;
    border: none;
    color: #71717a;
    cursor: pointer;
    padding: 6px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    text-decoration: none;
}

.icon-btn svg {
    width: 16px;
    height: 16px;
}

.icon-btn.edit:hover {
    color: #e4e4e7;
    background-color: #27272a;
}

.icon-btn.delete:hover {
    color: #ef4444;
    background-color: rgba(239, 68, 68, 0.1);
}

/* Table Footer */
.table-footer {
    padding: 16px 24px;
    border-top: 1px solid #27272a;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #18181b;
}

.showing-text {
    font-size: 12px;
    color: #71717a;
}

.showing-text strong {
    color: #e4e4e7;
    font-weight: 600;
}

.pagination {
    display: flex;
    align-items: center;
    gap: 4px;
}

.page-btn-nav {
    height: 32px;
    padding: 0 14px;
    border-radius: 6px;
    border: 1px solid #27272a;
    background: transparent;
    color: #a1a1aa;
    cursor: pointer;
    font-weight: 500;
    font-size: 13px;
    transition: all 0.2s;
}

.page-btn-nav:hover:not(:disabled) {
    background-color: #27272a;
    color: #e4e4e7;
}

.page-btn-nav:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    gap: 4px;
}

.num-btn {
    height: 32px;
    min-width: 32px;
    border-radius: 6px;
    border: 1px solid #27272a;
    background: transparent;
    color: #a1a1aa;
    cursor: pointer;
    font-weight: 500;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.num-btn:hover:not(.active) {
    background-color: #27272a;
    color: #e4e4e7;
}

.num-btn.active {
    background-color: #3b82f6;
    border-color: #3b82f6;
    color: #fff;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-top: 24px;
}

.stat-card {
    background-color: #18181b;
    border: 1px solid #27272a;
    border-radius: 12px;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.stat-label {
    font-size: 11px;
    font-weight: 700;
    color: #71717a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stat-value {
    font-size: 28px;
    font-weight: 800;
    color: #e4e4e7;
    line-height: 1.2;
}

.stat-sub {
    font-size: 12px;
    color: #71717a;
    font-weight: 500;
}

.stat-sub.positive {
    color: #22c55e;
}

.stat-sub.warning {
    color: #f97316;
}

/* Delete Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.15s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.modal-card {
    background-color: #1c1c1e;
    border: 1px solid #27272a;
    border-radius: 16px;
    padding: 32px;
    max-width: 440px;
    width: 90%;
    animation: scaleIn 0.2s ease;
    text-align: center;
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.modal-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: rgba(239, 68, 68, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
}

.modal-icon svg {
    width: 28px;
    height: 28px;
    color: #ef4444;
}

.modal-card h3 {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 12px;
    color: #e4e4e7;
}

.modal-description {
    font-size: 14px;
    color: #71717a;
    margin: 0 0 24px;
    line-height: 1.5;
}

.modal-description strong {
    color: #e4e4e7;
}

.modal-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.modal-btn {
    padding: 10px 24px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.modal-btn.cancel {
    background-color: #27272a;
    color: #e4e4e7;
}

.modal-btn.cancel:hover {
    background-color: #3f3f46;
}

.modal-btn.confirm-delete {
    background-color: #ef4444;
    color: #fff;
}

.modal-btn.confirm-delete:hover {
    background-color: #dc2626;
}

/* Edit Modal */
.edit-modal-card {
    background-color: #1c1c1e;
    border: 1px solid #27272a;
    border-radius: 16px;
    padding: 32px;
    max-width: 500px;
    width: 90%;
    animation: scaleIn 0.2s ease;
}

.edit-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
}

.edit-modal-header h3 {
    font-size: 20px;
    font-weight: 700;
    color: #e4e4e7;
    margin: 0;
}

.close-modal-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid #27272a;
    color: #71717a;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.close-modal-btn svg {
    width: 16px;
    height: 16px;
}

.close-modal-btn:hover {
    background-color: #27272a;
    color: #e4e4e7;
}

.edit-form-group {
    margin-bottom: 20px;
}

.edit-form-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #a1a1aa;
    margin-bottom: 8px;
}

.edit-input {
    width: 100%;
    height: 44px;
    padding: 0 14px;
    background-color: #0d0d0d;
    border: 1px solid #27272a;
    border-radius: 10px;
    color: #e4e4e7;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
}

.edit-input::placeholder {
    color: #52525b;
}

.edit-input:focus {
    border-color: #3b82f6;
    background-color: #111;
}

.edit-select-wrapper {
    position: relative;
}

.edit-select {
    appearance: none;
    cursor: pointer;
    padding-right: 40px !important;
}

.edit-select option {
    background: #18181b;
    color: #e4e4e7;
}

.edit-chevron {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: #52525b;
    pointer-events: none;
}

/* Status Toggle */
.status-toggle {
    display: flex;
    gap: 8px;
}

.toggle-option {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 10px;
    background-color: #0d0d0d;
    border: 1px solid #27272a;
    color: #71717a;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.toggle-option.active {
    border-color: #3b82f6;
    color: #e4e4e7;
    background-color: rgba(59, 130, 246, 0.05);
}

.toggle-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.active-dot {
    background-color: #22c55e;
    box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
}

.inactive-dot {
    background-color: #f97316;
}

.edit-error {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 10px;
    padding: 12px;
    margin-bottom: 20px;
}

.edit-error svg {
    width: 16px;
    height: 16px;
    color: #ef4444;
    flex-shrink: 0;
}

.edit-error span {
    font-size: 13px;
    color: #ef4444;
    font-weight: 500;
}

.modal-btn.confirm-edit {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
}

.modal-btn.confirm-edit:hover:not(:disabled) {
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
}

.modal-btn.confirm-edit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-spinner-sm {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.modal-btn.confirm-create {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
}

.modal-btn.confirm-create svg {
    width: 16px;
    height: 16px;
}

.modal-btn.confirm-create:hover:not(:disabled) {
    box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);
}

.modal-btn.confirm-create:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
    .branch-management {
        padding: 20px 16px;
    }

    .page-header {
        flex-direction: column;
        gap: 16px;
    }

    .filters-bar {
        flex-direction: column;
    }

    .search-box {
        max-width: none;
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
