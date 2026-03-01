<template>
    <div class="user-management animate-slide-up">
        <!-- Premium Header Area -->
        <header class="page-header">
            <div class="title-section">
                <h1>Users Management</h1>
            </div>

            <div class="actions-section">
                <div class="search-box">
                    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" v-model="searchValue" @input="handleSearch"
                        placeholder="Search by name, ID or role..." />
                </div>
                <router-link to="/superAdmin/create" class="add-btn">
                    <span class="plus">+</span> Add New User
                </router-link>
            </div>
        </header>

        <!-- Desktop Users Table -->
        <div class="table-container desktop-only">
            <div class="table-wrapper">
                <table class="premium-table">
                    <thead>
                        <tr>
                            <th>AVATAR</th>
                            <th>NAME</th>
                            <th>USER CODE</th>
                            <th>PHONE NUMBER</th>
                            <th>ROLE</th>
                            <th>TELEGRAM</th>
                            <th class="actions-th">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id" class="table-row">
                            <td class="avatar-cell">
                                <div class="avatar-circle" :class="getRoleClass(user.role)">
                                    <img v-if="user.avatar" :src="user.avatar" alt="Avatar" />
                                    <span v-else>{{ user.name.charAt(0) }}{{ user.lastName.charAt(0) }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="u-info">
                                    <span class="u-name">{{ user.name }} {{ user.lastName }}</span>
                                </div>
                            </td>
                            <td>
                                <span class="user-code-pill">{{ user.userCode || '—' }}</span>
                            </td>
                            <td class="tel-td">{{ formatPhone(user.phoneNumber) }}</td>
                            <td>
                                <span class="role-pill" :class="getRoleClass(user.role)">{{ formatRole(user.role)
                                }}</span>
                            </td>
                            <td class="telegram-td">
                                <span v-if="user.telegramUsername" class="telegram-name">{{ user.telegramUsername
                                }}</span>
                                <span v-else class="no-telegram">—</span>
                            </td>
                            <td class="actions-td">
                                <div class="btn-group">
                                    <button v-if="user.role === 'user'" @click="toggleActivation(user.id)"
                                        class="icon-btn" :class="user.isActive ? 'deact' : 'act'"
                                        :title="user.isActive ? 'Деактивировать' : 'Активировать'">
                                        <svg v-if="user.isActive" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                                        </svg>
                                    </button>
                                    <button @click="openEditUserModal(user)" class="icon-btn edit"
                                        title="Редактировать">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M12 20h9"></path>
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                        </svg>
                                    </button>
                                    <button @click="deleteUser(user.id)" class="icon-btn delete" title="Удалить">
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
                <span class="showing-text">Showing <strong>{{ getShowingRange() }}</strong> of <strong>{{ totalItems
                }}</strong> users</span>
                <div v-if="totalPages > 1" class="pagination">
                    <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <div class="page-numbers">
                        <button v-for="p in visiblePages" :key="p" @click="currentPage = p"
                            :class="['num-btn', { active: currentPage === p }]">{{ p }}</button>
                    </div>
                    <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div class="page-status-footer">
            <div class="stats">
                <span>Total Users: <strong>{{ totalItems }}</strong></span>
                <span class="divider"></span>
                <span class="active-count">Active Now: <span class="dot"></span> <strong>{{ activeUsersCount
                }}</strong></span>
            </div>
            <div class="system-sync">
                <span>SYSTEM V4.2.0 • LAST SYNC: JUST NOW</span>
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
                    <h3>Are you sure you want to delete this user?</h3>
                    <p class="modal-description">This action cannot be undone. All data associated with <strong>{{
                        deleteTargetUser?.name }} {{ deleteTargetUser?.lastName }}</strong> will be permanently
                        removed from our servers.</p>
                    <div class="modal-actions">
                        <button class="modal-btn cancel" @click="showDeleteModal = false">Cancel</button>
                        <button class="modal-btn confirm-delete" @click="confirmDeleteUser">Delete User</button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Edit User Modal -->
        <Teleport to="body">
            <div v-if="showEditUserModal" class="modal-overlay" @click.self="showEditUserModal = false">
                <div class="edit-user-modal">
                    <div class="eu-modal-header">
                        <h3>Edit User</h3>
                        <button class="eu-close-btn" @click="showEditUserModal = false">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div v-if="editUserLoading" class="eu-loading">
                        <div class="eu-spinner"></div>
                    </div>

                    <form v-else @submit.prevent="confirmEditUser">
                        <div class="eu-row">
                            <div class="eu-field">
                                <label>First Name</label>
                                <input v-model="editUserName" type="text" placeholder="Name" class="eu-input" />
                            </div>
                            <div class="eu-field">
                                <label>Last Name</label>
                                <input v-model="editUserSurname" type="text" placeholder="Last name" class="eu-input" />
                            </div>
                        </div>

                        <div class="eu-row">
                            <div class="eu-field">
                                <label>Phone Number</label>
                                <input v-model="editUserPhone" type="text" placeholder="+7 (555) 000-0000"
                                    class="eu-input" />
                            </div>
                            <div class="eu-field">
                                <label>Telegram</label>
                                <input v-model="editUserTelegram" type="text" placeholder="@username"
                                    class="eu-input" />
                            </div>
                        </div>

                        <div class="eu-field">
                            <label>User Code</label>
                            <input v-model="editUserCode" type="text" placeholder="e.g. Khan-123" class="eu-input" />
                        </div>

                        <div class="eu-row">
                            <div class="eu-field">
                                <label>Role</label>
                                <div class="eu-select-wrap">
                                    <select v-model="editUserRole" class="eu-input eu-select">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="superAdmin">Super Admin</option>
                                    </select>
                                    <svg class="eu-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                            </div>
                            <div class="eu-field">
                                <label>Branch</label>
                                <div class="eu-select-wrap">
                                    <select v-model="editUserBranch" class="eu-input eu-select">
                                        <option value="">Not selected</option>
                                        <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
                                    </select>
                                    <svg class="eu-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div class="eu-field">
                            <label>New Password <span class="eu-hint">(leave empty to keep current)</span></label>
                            <input v-model="editUserPassword" type="text" placeholder="Enter new password"
                                class="eu-input" />
                        </div>

                        <div v-if="editUserError" class="eu-error">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <span>{{ editUserError }}</span>
                        </div>

                        <div class="modal-actions">
                            <button type="button" class="modal-btn cancel"
                                @click="showEditUserModal = false">Cancel</button>
                            <button type="submit" class="modal-btn eu-save" :disabled="editUserSubmitting">
                                <div v-if="editUserSubmitting" class="eu-btn-spin"></div>
                                {{ editUserSubmitting ? 'Saving...' : 'Save Changes' }}
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

import type { User, Branch } from '~/types'
import { useToast } from '~/composables/useToast'

const toast = useToast()
const router = useRouter()
const api = useApi()

const users = ref<User[]>([])
const branches = ref<Branch[]>([])

const searchValue = ref('')
const selectedBranch = ref<number | ''>('')
const currentPage = ref(1)
const perPage = 10
const totalPages = ref(1)
const loading = ref(false)
const totalItems = ref(0)
const activeUsersCount = ref(84)
const showDeleteModal = ref(false)
const deleteTargetUser = ref<User | null>(null)

// Edit user modal state
const showEditUserModal = ref(false)
const editUserTarget = ref<User | null>(null)
const editUserName = ref('')
const editUserSurname = ref('')
const editUserPhone = ref('')
const editUserTelegram = ref('')
const editUserCode = ref('')
const editUserRole = ref('user')
const editUserBranch = ref<number | string>('')
const editUserPassword = ref('')
const editUserError = ref('')
const editUserSubmitting = ref(false)
const editUserLoading = ref(false)

const loadData = async () => {
    loading.value = true
    try {
        const { data } = await api.admin.getUsers({
            page: currentPage.value,
            limit: perPage,
            search: searchValue.value || undefined,
            branchId: selectedBranch.value || undefined
        })
        users.value = data.data
        totalItems.value = data.meta.total
        totalPages.value = Math.ceil(data.meta.total / perPage) || 1

        // Count actives roughly based on loaded page or overall if from backend
        activeUsersCount.value = Math.max(0, totalItems.value - 2) // Just a visual mock calculation
    } catch {
        users.value = []
    } finally {
        loading.value = false
    }
}

const loadBranches = async () => {
    try {
        const { data } = await api.branches.findAll()
        branches.value = data
    } catch { }
}

const visiblePages = computed(() => {
    const pages: number[] = []
    for (let i = 1; i <= Math.min(totalPages.value, 4); i++) pages.push(i)
    if (totalPages.value > 5) pages.push(totalPages.value)
    return pages
})

const getShowingRange = () => {
    if (totalItems.value === 0) return '0-0'
    const start = (currentPage.value - 1) * perPage + 1
    const end = Math.min(currentPage.value * perPage, totalItems.value)
    return `${start}-${end}`
}

const openEditUserModal = async (user: User) => {
    editUserTarget.value = user
    editUserName.value = user.name
    editUserSurname.value = user.lastName
    editUserPhone.value = user.phoneNumber
    editUserTelegram.value = user.telegramUsername || ''
    editUserCode.value = user.userCode || ''
    editUserRole.value = user.role?.toLowerCase() || 'user'
    editUserBranch.value = user.branchId || ''
    editUserPassword.value = ''
    editUserError.value = ''
    editUserSubmitting.value = false
    showEditUserModal.value = true
}

const confirmEditUser = async () => {
    if (!editUserTarget.value) return
    if (!editUserName.value || !editUserSurname.value || !editUserPhone.value) {
        editUserError.value = 'Name, surname and phone are required.'
        return
    }

    editUserSubmitting.value = true
    editUserError.value = ''

    try {
        await api.admin.updateUser(editUserTarget.value.id, {
            phoneNumber: editUserPhone.value,
            userCode: editUserCode.value || undefined,
            name: editUserName.value,
            lastName: editUserSurname.value,
            role: editUserRole.value,
            branchId: Number(editUserBranch.value) || undefined,
            telegramUsername: editUserTelegram.value || undefined,
        })

        if (editUserPassword.value) {
            await api.admin.resetPassword(editUserTarget.value.id, { newPassword: editUserPassword.value })
        }

        toast.success('User updated successfully')
        showEditUserModal.value = false
        editUserTarget.value = null
        loadData()
    } catch (error: any) {
        editUserError.value = error.response?.data?.message || 'Error updating user'
    } finally {
        editUserSubmitting.value = false
    }
}

const toggleActivation = async (id: number) => {
    try {
        await api.admin.toggleStatus(id)
        toast.success('Статус пользователя изменен')
        loadData()
    } catch {
        toast.error('Ошибка изменения статуса')
    }
}

const deleteUser = (id: number) => {
    const user = users.value.find(u => u.id === id)
    if (user) {
        deleteTargetUser.value = user
        showDeleteModal.value = true
    }
}

const confirmDeleteUser = async () => {
    if (!deleteTargetUser.value) return
    try {
        await api.admin.deleteUser(deleteTargetUser.value.id)
        toast.success('Пользователь удалён')
        showDeleteModal.value = false
        deleteTargetUser.value = null
        loadData()
    } catch {
        toast.error('Ошибка удаления пользователя')
    }
}

const getRoleClass = (role: string) => {
    if (role === 'superAdmin') return 'system'
    if (role === 'admin') return 'admin'
    return 'user'
}

const formatRole = (role: string) => {
    if (role === 'superAdmin') return 'SuperAdmin'
    if (role === 'admin') return 'Admin'
    return 'User'
}


const formatPhone = (phone: string) => {
    // Format to +1 (555) 010-1234 format if possible, otherwise return original
    if (!phone) return '—'
    if (phone.length === 11 && phone.startsWith('7')) {
        return `+${phone.slice(0, 1)} (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 11)}`
    }
    return phone
}

const handleSearch = () => {
    currentPage.value = 1
    loadData()
}

watch(currentPage, () => {
    loadData()
})

onMounted(() => {
    loadBranches()
    loadData()
})
</script>

<style scoped>
.user-management {
    padding: 32px 40px;
    max-width: 1200px;
    margin: 0;
    color: #fff;
    font-family: 'Inter', -apple-system, sans-serif;
    display: flex;
    flex-direction: column;
    height: 100%;
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

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
}

.title-section h1 {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    color: white;
}

.actions-section {
    display: flex;
    align-items: center;
    gap: 16px;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #18181b;
    border: 1px solid #27272a;
    padding: 10px 16px;
    border-radius: 8px;
    width: 320px;
    transition: border-color 0.2s;
}

.search-box:focus-within {
    border-color: #3b82f6;
}

.search-icon {
    width: 16px;
    height: 16px;
    color: #71717a;
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
    color: #71717a;
}

.add-btn {
    background: #3b82f6;
    color: #fff;
    padding: 10px 18px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s;
}

.add-btn:hover {
    background: #2563eb;
}

.plus {
    font-size: 16px;
    line-height: 1;
}

.table-container {
    background-color: #18181b;
    border: 1px solid #27272a;
    border-radius: 12px;
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.table-wrapper {
    overflow-x: auto;
    flex: 1;
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
    padding: 16px 24px;
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

.avatar-cell {
    width: 72px;
}

.avatar-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    overflow: hidden;
}

.avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-circle.admin {
    background-color: #d1fae5;
    color: #064e3b;
}

.avatar-circle.user {
    background-color: #ffedd5;
    color: #7c2d12;
}

.avatar-circle.system {
    background-color: #e0e7ff;
    color: #312e81;
}

.u-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.u-name {
    font-weight: 600;
    font-size: 14px;
    color: #e4e4e7;
}

.u-email {
    font-size: 12px;
    color: #71717a;
}

.user-code-pill {
    background-color: #27272a;
    color: #a1a1aa;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
}

.tel-td {
    font-size: 13px;
    color: #a1a1aa;
}

.role-pill {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    border: 1px solid transparent;
}

.role-pill.admin {
    border-color: rgba(59, 130, 246, 0.3);
    color: #60a5fa;
}

.role-pill.user {
    border-color: #27272a;
    color: #a1a1aa;
}

.role-pill.system {
    border-color: rgba(168, 85, 247, 0.3);
    color: #c084fc;
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
}

.status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
}

.status-dot.active {
    background-color: #22c55e;
    box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
}

.status-dot.inactive {
    background-color: #71717a;
}

.status-text {
    font-size: 12px;
    font-weight: 500;
}

.status-text.active {
    color: #22c55e;
}

.status-text.inactive {
    color: #71717a;
}

.actions-td {
    text-align: right;
}

.btn-group {
    display: flex;
    gap: 12px;
    justify-content: flex-start;
}

.icon-btn {
    background: none;
    border: none;
    color: #71717a;
    cursor: pointer;
    padding: 4px;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-btn svg {
    width: 16px;
    height: 16px;
}

.icon-btn:hover.edit {
    color: #e4e4e7;
}

.icon-btn:hover.delete {
    color: #ef4444;
}

.icon-btn.act {
    color: #22c55e;
}

.icon-btn.act:hover {
    color: #4ade80;
}

.icon-btn.deact {
    color: #f97316;
}

.icon-btn.deact:hover {
    color: #fb923c;
}

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

.page-btn,
.num-btn {
    height: 32px;
    min-width: 32px;
    border-radius: 6px;
    border: none;
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

.page-btn svg {
    width: 14px;
    height: 14px;
}

.num-btn:hover:not(.active),
.page-btn:hover:not(:disabled) {
    background-color: #27272a;
    color: #e4e4e7;
}

.num-btn.active {
    background-color: #3b82f6;
    color: #fff;
}

.page-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.page-status-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 0 0;
    margin-top: auto;
}

.stats {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 12px;
    color: #71717a;
}

.stats strong {
    color: #e4e4e7;
    font-weight: 600;
}

.divider {
    width: 1px;
    height: 12px;
    background-color: #27272a;
}

.active-count {
    display: flex;
    align-items: center;
    gap: 6px;
}

.active-count .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #22c55e;
    box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
    display: inline-block;
    margin-left: 4px;
}

.system-sync {
    font-size: 10px;
    font-weight: 700;
    color: #52525b;
    letter-spacing: 0.5px;
}

/* Telegram Column */
.telegram-td {
    font-size: 13px;
}

.telegram-name {
    color: #60a5fa;
    font-weight: 500;
}

.no-telegram {
    color: #52525b;
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
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: rgba(239, 68, 68, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}

.modal-icon svg {
    width: 24px;
    height: 24px;
    color: #ef4444;
}

.modal-card h3 {
    font-size: 18px;
    font-weight: 700;
    color: #e4e4e7;
    margin: 0 0 12px;
}

.modal-description {
    font-size: 14px;
    color: #71717a;
    line-height: 1.6;
    margin: 0 0 24px;
}

.modal-description strong {
    color: #e4e4e7;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.modal-btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
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
    color: white;
}

.modal-btn.confirm-delete:hover {
    background-color: #dc2626;
}

/* Edit User Modal */
.edit-user-modal {
    background-color: #1c1c1e;
    border: 1px solid #27272a;
    border-radius: 16px;
    padding: 32px;
    max-width: 600px;
    width: 94%;
    animation: scaleIn 0.2s ease;
    max-height: 90vh;
    overflow-y: auto;
}

.eu-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.eu-modal-header h3 {
    font-size: 20px;
    font-weight: 700;
    color: #e4e4e7;
    margin: 0;
}

.eu-close-btn {
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

.eu-close-btn svg {
    width: 16px;
    height: 16px;
}

.eu-close-btn:hover {
    background-color: #27272a;
    color: #e4e4e7;
}

.eu-loading {
    display: flex;
    justify-content: center;
    padding: 40px;
}

.eu-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #27272a;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.eu-row {
    display: flex;
    gap: 12px;
}

.eu-row .eu-field {
    flex: 1;
}

.eu-field {
    margin-bottom: 16px;
}

.eu-field label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #a1a1aa;
    margin-bottom: 6px;
}

.eu-hint {
    font-weight: 400;
    color: #52525b;
    font-size: 11px;
}

.eu-input {
    width: 100%;
    height: 42px;
    padding: 0 12px;
    background-color: #0d0d0d;
    border: 1px solid #27272a;
    border-radius: 10px;
    color: #e4e4e7;
    font-size: 13px;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
}

.eu-input::placeholder {
    color: #52525b;
}

.eu-input:focus {
    border-color: #3b82f6;
    background-color: #111;
}

.eu-select-wrap {
    position: relative;
}

.eu-select {
    appearance: none;
    cursor: pointer;
    padding-right: 36px !important;
}

.eu-select option {
    background: #18181b;
    color: #e4e4e7;
}

.eu-chevron {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    color: #52525b;
    pointer-events: none;
}

.eu-error {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 10px;
    padding: 10px 12px;
    margin-bottom: 16px;
}

.eu-error svg {
    width: 16px;
    height: 16px;
    color: #ef4444;
    flex-shrink: 0;
}

.eu-error span {
    font-size: 13px;
    color: #ef4444;
    font-weight: 500;
}

.modal-btn.eu-save {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
}

.modal-btn.eu-save:hover:not(:disabled) {
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
}

.modal-btn.eu-save:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.eu-btn-spin {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@media (max-width: 640px) {
    .eu-row {
        flex-direction: column;
        gap: 0;
    }

    .edit-user-modal {
        padding: 20px;
    }
}
</style>
