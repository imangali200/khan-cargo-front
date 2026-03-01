<template>
    <div class="create-branch animate-slide-up">
        <!-- Header -->
        <header class="page-header">
            <div class="title-section">
                <div class="back-row">
                    <button @click="goBack" class="back-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <div>
                        <h1>Create New Branch</h1>
                        <p class="subtitle">Add a new branch to your warehouse network</p>
                    </div>
                </div>
            </div>
        </header>

        <!-- Loading -->
        <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading administrators...</p>
        </div>

        <!-- Form Card -->
        <div v-else class="form-card">
            <form @submit.prevent="createBranch">
                <div class="form-group">
                    <label for="nameBranch">Branch Name</label>
                    <div class="input-wrapper">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                            </path>
                        </svg>
                        <input v-model="branchName" type="text" id="nameBranch" placeholder="e.g. China Warehouse" />
                    </div>
                </div>

                <div class="form-group">
                    <label for="selectAdmin">Responsible Administrator</label>
                    <div class="input-wrapper select-wrapper">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <select id="selectAdmin" v-model="selectAdmin">
                            <option value="" disabled>Select an administrator</option>
                            <option v-for="admin in adminList" :key="admin.id" :value="admin.id">
                                {{ admin.name }} {{ admin.lastName }}
                            </option>
                        </select>
                        <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>

                    <!-- No Admins Warning -->
                    <div v-if="!adminList?.length" class="warning-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                            </path>
                        </svg>
                        <div>
                            <p class="warning-title">No administrators available</p>
                            <p class="warning-text">You need to
                                <router-link to="/superAdmin/create" class="warning-link">create an administrator
                                </router-link> first.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="error-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{{ errorMessage }}</span>
                </div>

                <!-- Actions -->
                <div class="form-actions">
                    <button type="button" @click="goBack" class="btn-cancel">Cancel</button>
                    <button type="submit" :disabled="submitting" class="btn-submit">
                        <div v-if="submitting" class="btn-spinner"></div>
                        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {{ submitting ? 'Creating...' : 'Create Branch' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'super-admin',
    middleware: 'auth'
})
import type { User } from '~/types'
import { useToast } from '~/composables/useToast'

const toast = useToast()
const api = useApi()
const router = useRouter()
const adminList = ref<User[]>([])

const selectAdmin = ref<string>('')
const branchName = ref<string>('')
const errorMessage = ref<string>('')
const loading = ref(false)
const submitting = ref(false)

const goBack = () => {
    router.back()
}

async function getFreeAdmins() {
    loading.value = true
    try {
        const { data } = await api.admin.getUsers({ role: 'ADMIN', limit: 100 })
        adminList.value = data.data
    } catch {
        toast.error('Error loading administrators')
    } finally {
        loading.value = false
    }
}

const createBranch = async () => {
    if (!selectAdmin.value || !branchName.value) {
        errorMessage.value = 'Please fill in all fields.'
        return
    }

    submitting.value = true
    errorMessage.value = ''

    try {
        await api.branches.create({
            name: branchName.value,
            adminId: Number(selectAdmin.value)
        })

        toast.success('Branch created successfully')
        return navigateTo('/superAdmin/warehouses')
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error creating branch')
    } finally {
        submitting.value = false
    }
}

onMounted(() => {
    getFreeAdmins()
})
</script>

<style scoped>
.create-branch {
    padding: 32px 40px;
    max-width: 640px;
    margin: 0;
    color: #fff;
    font-family: 'Inter', -apple-system, sans-serif;
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
    margin-bottom: 32px;
}

.back-row {
    display: flex;
    align-items: center;
    gap: 16px;
}

.back-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background-color: #18181b;
    border: 1px solid #27272a;
    color: #a1a1aa;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
}

.back-btn:hover {
    background-color: #27272a;
    color: #e4e4e7;
}

.back-btn svg {
    width: 18px;
    height: 18px;
}

.title-section h1 {
    font-size: 24px;
    font-weight: 800;
    margin: 0;
    color: white;
    letter-spacing: -0.5px;
}

.subtitle {
    font-size: 14px;
    color: #71717a;
    margin: 4px 0 0;
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

/* Form Card */
.form-card {
    background-color: #18181b;
    border: 1px solid #27272a;
    border-radius: 16px;
    padding: 32px;
}

.form-group {
    margin-bottom: 24px;
}

.form-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #a1a1aa;
    margin-bottom: 8px;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 14px;
    width: 18px;
    height: 18px;
    color: #52525b;
    pointer-events: none;
}

.input-wrapper input,
.input-wrapper select {
    width: 100%;
    height: 48px;
    padding: 0 16px 0 44px;
    background-color: #0d0d0d;
    border: 1px solid #27272a;
    border-radius: 10px;
    color: #e4e4e7;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
}

.input-wrapper input::placeholder {
    color: #52525b;
}

.input-wrapper input:focus,
.input-wrapper select:focus {
    border-color: #3b82f6;
    background-color: #111;
}

.select-wrapper select {
    appearance: none;
    cursor: pointer;
    padding-right: 40px;
}

.select-wrapper select option {
    background: #18181b;
    color: #e4e4e7;
}

.chevron-icon {
    position: absolute;
    right: 14px;
    width: 16px;
    height: 16px;
    color: #52525b;
    pointer-events: none;
}

/* Warning */
.warning-box {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background-color: rgba(245, 158, 11, 0.08);
    border: 1px solid rgba(245, 158, 11, 0.2);
    border-radius: 10px;
    padding: 14px;
    margin-top: 12px;
}

.warning-box>svg {
    width: 20px;
    height: 20px;
    color: #f59e0b;
    flex-shrink: 0;
    margin-top: 2px;
}

.warning-title {
    font-size: 13px;
    font-weight: 600;
    color: #f59e0b;
    margin: 0;
}

.warning-text {
    font-size: 13px;
    color: rgba(245, 158, 11, 0.7);
    margin: 4px 0 0;
}

.warning-link {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 600;
}

.warning-link:hover {
    text-decoration: underline;
}

/* Error */
.error-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 10px;
    padding: 14px;
    margin-bottom: 24px;
}

.error-box svg {
    width: 18px;
    height: 18px;
    color: #ef4444;
    flex-shrink: 0;
}

.error-box span {
    font-size: 14px;
    color: #ef4444;
    font-weight: 500;
}

/* Actions */
.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding-top: 8px;
}

.btn-cancel {
    padding: 12px 24px;
    border-radius: 10px;
    background-color: #27272a;
    color: #a1a1aa;
    font-weight: 600;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-cancel:hover {
    background-color: #3f3f46;
    color: #e4e4e7;
}

.btn-submit {
    padding: 12px 28px;
    border-radius: 10px;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: #fff;
    font-weight: 700;
    font-size: 14px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25);
}

.btn-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
}

.btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-submit svg {
    width: 16px;
    height: 16px;
}

.btn-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* Responsive */
@media (max-width: 768px) {
    .create-branch {
        padding: 20px 16px;
    }

    .form-card {
        padding: 20px;
    }
}
</style>
