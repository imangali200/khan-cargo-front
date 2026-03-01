<script setup lang="ts">
definePageMeta({
    layout: 'super-admin'
})

import type { Branch } from '~/types'
import { useToast } from "~/composables/useToast";

const api = useApi()
const toast = useToast();
const router = useRouter()

const phoneNumber = ref('')
const selectBranch = ref('')
const codeUser = ref('')
const name = ref('')
const surname = ref('')
const password = ref('')
const confirmPassword = ref('')
const telegramUsername = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const role = ref('user')
const branches = ref<Branch[]>([])
const loading = ref(false)
const submitting = ref(false)

async function getBranches() {
    loading.value = true
    try {
        const res = await api.branches.findAll()
        branches.value = res.data
    } catch (error) {
        toast.error('Ошибка при загрузке складов')
    } finally {
        loading.value = false
    }
}

const createUser = async () => {
    if (!phoneNumber.value || !name.value || !surname.value || !role.value || !password.value) {
        errorMessage.value = 'Пожалуйста, заполните все обязательные поля'
        return
    }
    if (confirmPassword.value && password.value !== confirmPassword.value) {
        errorMessage.value = 'Пароли не совпадают'
        return
    }

    submitting.value = true
    errorMessage.value = ''

    try {
        await api.admin.createUser({
            phoneNumber: phoneNumber.value,
            userCode: codeUser.value || undefined,
            name: name.value,
            lastName: surname.value,
            role: role.value,
            branchId: Number(selectBranch.value) || undefined,
            telegramUsername: telegramUsername.value || undefined,
            password: password.value
        })

        toast.success('Пользователь успешно создан!')
        return navigateTo('/superAdmin/users')
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Ошибка при создании пользователя')
    } finally {
        submitting.value = false
    }
}

onMounted(() => {
    getBranches()
})
</script>

<template>
    <div class="create-page">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
            <router-link to="/superAdmin/users" class="bc-link">Users</router-link>
            <span class="bc-sep">›</span>
            <span class="bc-current">Create New User</span>
            <router-link to="/superAdmin/users" class="view-list-btn">View List</router-link>
        </div>

        <!-- Header -->
        <div class="page-header">
            <h1>Create New User</h1>
            <p>Register a new administrative user and assign permissions.</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-box">
            <div class="spinner"></div>
            <span>Загрузка...</span>
        </div>

        <!-- Form Card -->
        <form v-else @submit.prevent="createUser" class="form-card">
            <div class="card-header">
                <h2>Account Details</h2>
                <p>Basic information used for identification and access.</p>
            </div>

            <!-- Full Name + User Code -->
            <div class="field-row">
                <div class="field">
                    <label>Full Name</label>
                    <div class="name-inputs">
                        <input type="text" v-model="name" placeholder="Имя" class="input" />
                        <input type="text" v-model="surname" placeholder="Фамилия" class="input" />
                    </div>
                </div>
                <div class="field">
                    <label>User Code</label>
                    <input type="text" v-model="codeUser" placeholder="Khan-123" class="input" />
                </div>
            </div>

            <!-- Phone + Role -->
            <div class="field-row">
                <div class="field">
                    <label>Phone Number</label>
                    <input v-model="phoneNumber" type="text" placeholder="+7 (555) 000-0000" class="input" />
                </div>
                <div class="field">
                    <label>User Role</label>
                    <select v-model="role" class="select">
                        <option value="" disabled>Select Role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superAdmin">Super Admin</option>
                    </select>
                </div>
            </div>

            <!-- Password + Confirm -->
            <div class="field-row">
                <div class="field">
                    <label>Password</label>
                    <div class="password-wrap">
                        <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="••••••••"
                            class="input pw-input" />
                        <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                            <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path
                                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                                </path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="field">
                    <label>Confirm Password</label>
                    <input type="password" v-model="confirmPassword" placeholder="••••••••" class="input" />
                </div>
            </div>

            <!-- Склад + Telegram -->
            <div class="field-row">
                <div class="field">
                    <label>Склад</label>
                    <select v-model="selectBranch" class="select">
                        <option value="">Не выбран</option>
                        <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                            {{ branch.name }}
                        </option>
                    </select>
                </div>
                <div class="field">
                    <label>Telegram Name</label>
                    <input type="text" v-model="telegramUsername" placeholder="@username" class="input" />
                </div>
            </div>

            <!-- Error -->
            <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

            <!-- Actions -->
            <div class="actions">
                <button type="button" class="btn-cancel" @click="router.back()">Cancel</button>
                <button type="submit" :disabled="submitting" class="btn-create">
                    <svg v-if="!submitting" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        class="btn-icon">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                    <span v-if="!submitting">Create User</span>
                    <div v-else class="btn-spin"></div>
                </button>
            </div>
        </form>

        <!-- System Notification -->
        <div class="system-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="note-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <div>
                <strong>System Notification</strong>
                <p>Пользователь будет создан с указанными данными и сможет войти в систему используя номер телефона и
                    пароль.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.create-page {
    padding: 24px 40px 40px;
    max-width: 960px;
    font-family: 'Inter', -apple-system, sans-serif;
    color: #e4e4e7;
    animation: slideUp 0.4s ease;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(12px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Breadcrumb */
.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    margin-bottom: 20px;
}

.bc-link {
    color: #71717a;
    text-decoration: none;
    transition: color 0.2s;
}

.bc-link:hover {
    color: #a1a1aa;
}

.bc-sep {
    color: #3f3f46;
}

.bc-current {
    color: #a1a1aa;
}

.view-list-btn {
    margin-left: auto;
    padding: 8px 16px;
    background-color: #27272a;
    border: 1px solid #3f3f46;
    border-radius: 8px;
    color: #d4d4d8;
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s;
}

.view-list-btn:hover {
    background-color: #3f3f46;
}

/* Header */
.page-header {
    margin-bottom: 28px;
}

.page-header h1 {
    font-size: 28px;
    font-weight: 700;
    color: white;
    margin: 0 0 8px;
}

.page-header p {
    font-size: 14px;
    color: #71717a;
    margin: 0;
}

/* Loading */
.loading-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px;
    color: #71717a;
    gap: 12px;
}

.spinner {
    width: 28px;
    height: 28px;
    border: 3px solid #27272a;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Form Card */
.form-card {
    border: 1px dashed #334155;
    border-radius: 16px;
    padding: 32px 36px;
    background-color: transparent;
}

.card-header {
    margin-bottom: 28px;
}

.card-header h2 {
    font-size: 16px;
    font-weight: 700;
    color: white;
    margin: 0 0 6px;
}

.card-header p {
    font-size: 13px;
    color: #64748b;
    margin: 0;
}

/* Fields */
.field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
}

.field label {
    font-size: 13px;
    font-weight: 600;
    color: #d4d4d8;
}

.field-row {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
}

.half-field {
    max-width: calc(50% - 10px);
    margin-bottom: 24px;
}

.name-inputs {
    display: flex;
    gap: 10px;
}

.name-inputs .input {
    flex: 1;
}

.input,
.select {
    width: 100%;
    height: 48px;
    padding: 0 16px;
    background-color: #1e293b;
    border: 1px solid #334155;
    border-radius: 10px;
    color: #e2e8f0;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
}

.input:focus,
.select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.input::placeholder {
    color: #64748b;
}

.select {
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    padding-right: 40px;
}

.select option {
    background-color: #1e293b;
    color: #e2e8f0;
}

/* Password */
.password-wrap {
    position: relative;
}

.pw-input {
    padding-right: 48px;
}

.eye-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 4px;
    transition: color 0.2s;
}

.eye-btn:hover {
    color: #94a3b8;
}

.eye-btn svg {
    width: 18px;
    height: 18px;
}

/* Error */
.error-msg {
    padding: 12px 16px;
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 10px;
    color: #ef4444;
    font-size: 13px;
    margin-bottom: 8px;
}

/* Actions */
.actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    margin-top: 28px;
    padding-top: 24px;
    border-top: 1px solid #27272a;
}

.btn-cancel {
    background: none;
    border: none;
    color: #a1a1aa;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 10px 20px;
    transition: color 0.2s;
}

.btn-cancel:hover {
    color: #e4e4e7;
}

.btn-create {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-create:hover {
    background-color: #2563eb;
}

.btn-create:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-icon {
    width: 16px;
    height: 16px;
}

.btn-spin {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

/* System Note */
.system-note {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    margin-top: 24px;
    padding: 18px 20px;
    background-color: rgba(59, 130, 246, 0.08);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 12px;
}

.note-icon {
    width: 20px;
    height: 20px;
    color: #3b82f6;
    flex-shrink: 0;
    margin-top: 2px;
}

.system-note strong {
    font-size: 13px;
    color: #93c5fd;
    display: block;
    margin-bottom: 4px;
}

.system-note p {
    font-size: 12px;
    color: #64748b;
    margin: 0;
    line-height: 1.5;
}

@media (max-width: 640px) {
    .create-page {
        padding: 20px 16px;
    }

    .form-card {
        padding: 24px 20px;
    }

    .field-row {
        flex-direction: column;
    }

    .half-field {
        max-width: 100%;
    }

    .name-inputs {
        flex-direction: column;
    }
}
</style>
