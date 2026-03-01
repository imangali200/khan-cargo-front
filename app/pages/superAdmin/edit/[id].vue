<script setup lang="ts">
definePageMeta({
    layout: 'super-admin',
    middleware: 'auth'
})

import type { Branch } from '~/types'
import type { User } from "~/types";
import { useToast } from "~/composables/useToast";

const api = useApi()
const toast = useToast();
const router = useRouter()
const route = useRoute()
const id = route.params.id

const phoneNumber = ref('')
const selectBranch = ref('')
const codeUser = ref('')
const name = ref('')
const surname = ref('')
const password = ref('')
const telegramUsername = ref('')
const role = ref('user')
const branches = ref<Branch[]>([])
const oldData = ref<User | null>(null)

const loading = ref(false)
const submitting = ref(false)
const errorMessage = ref('')

async function getBranches() {
    try {
        const res = await api.branches.findAll()
        branches.value = res.data
    } catch (error) {
        toast.error('Ошибка при загрузке складов')
    }
}

async function getUserById() {
    loading.value = true
    try {
        const userData = await api.admin.getUser(Number(id))
        const user = userData.data
        codeUser.value = user.userCode || ''
        phoneNumber.value = user.phoneNumber || ''
        name.value = user.name || ''
        surname.value = user.lastName || ''
        selectBranch.value = user.branch?.id?.toString() || ''
        role.value = user.role || 'user'
        telegramUsername.value = user.telegramUsername || ''
        oldData.value = user
    } catch (error: any) {
        toast.error('Ошибка при загрузке пользователя')
    } finally {
        loading.value = false
    }
}

const updateUser = async () => {
    if (!phoneNumber.value || !name.value || !surname.value) {
        errorMessage.value = 'Заполните обязательные поля'
        return
    }

    submitting.value = true
    errorMessage.value = ''

    try {
        await api.admin.updateUser(Number(id), {
            phoneNumber: phoneNumber.value,
            userCode: codeUser.value || undefined,
            name: name.value,
            lastName: surname.value,
            role: role.value,
            branchId: Number(selectBranch.value) || undefined,
            telegramUsername: telegramUsername.value || undefined,
        })

        if (password.value) {
            await api.admin.resetPassword(Number(id), { newPassword: password.value })
        }

        toast.success('Пользователь успешно обновлён')
        return navigateTo('/superAdmin/users')
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Ошибка при обновлении')
    } finally {
        submitting.value = false
    }
}

onMounted(() => {
    getUserById()
    getBranches()
})
</script>

<template>
    <div class="edit-page">
        <!-- Header -->
        <div class="edit-header">
            <h1>User Details</h1>
            <p>Add or edit user information and account permissions.</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-box">
            <div class="spinner"></div>
            <span>Загрузка...</span>
        </div>

        <!-- Form Card -->
        <form v-else @submit.prevent="updateUser" class="form-card">
            <!-- Full Name -->
            <div class="field">
                <label>Full Name</label>
                <div class="name-row">
                    <input type="text" v-model="name" placeholder="Имя" class="input" />
                    <input type="text" v-model="surname" placeholder="Фамилия" class="input" />
                </div>
            </div>

            <!-- Phone Number + Telegram -->
            <div class="field-row">
                <div class="field">
                    <label>Phone Number</label>
                    <input v-model="phoneNumber" type="text" placeholder="+7 (555) 000-0000" class="input" />
                </div>
                <div class="field">
                    <label>Telegram Name</label>
                    <input type="text" v-model="telegramUsername" placeholder="@username" class="input" />
                </div>
            </div>

            <!-- User Code -->
            <div class="field">
                <label>User Code</label>
                <input type="text" v-model="codeUser" placeholder="Например: Khan-123" class="input" />
            </div>

            <!-- User Role & Склад -->
            <div class="field-row">
                <div class="field">
                    <label>User Role</label>
                    <select v-model="role" class="select">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superAdmin">Super Admin</option>
                    </select>
                </div>
                <div class="field">
                    <label>Склад</label>
                    <select v-model="selectBranch" class="select">
                        <option value="">Не выбран</option>
                        <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                            {{ branch.name }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Password -->
            <div class="field">
                <label>New Password <span class="hint">(оставьте пустым, чтобы не менять)</span></label>
                <input type="text" v-model="password" placeholder="Введите новый пароль" class="input" />
            </div>

            <!-- Error -->
            <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

            <!-- Divider -->
            <div class="divider"></div>

            <!-- Actions -->
            <div class="actions">
                <button type="button" class="btn-cancel" @click="router.back()">Cancel</button>
                <button type="submit" :disabled="submitting" class="btn-save">
                    <span v-if="!submitting">Save Changes</span>
                    <div v-else class="btn-spin"></div>
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.edit-page {
    padding: 40px 48px;
    max-width: 760px;
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

.edit-header {
    margin-bottom: 32px;
}

.edit-header h1 {
    font-size: 26px;
    font-weight: 700;
    color: white;
    margin: 0 0 8px;
}

.edit-header p {
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
    padding: 36px;
    background-color: transparent;
}

/* Fields */
.field {
    margin-bottom: 24px;
}

.field label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #d4d4d8;
    margin-bottom: 10px;
}

.hint {
    font-weight: 400;
    color: #52525b;
    font-size: 11px;
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

/* Name row */
.name-row {
    display: flex;
    gap: 12px;
}

.name-row .input {
    flex: 1;
}

/* Field row (two columns) */
.field-row {
    display: flex;
    gap: 16px;
    margin-bottom: 0;
}

.field-row .field {
    flex: 1;
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

/* Divider */
.divider {
    height: 1px;
    background-color: #27272a;
    margin: 28px 0;
}

/* Actions */
.actions {
    display: flex;
    justify-content: center;
    gap: 16px;
}

.btn-cancel,
.btn-save {
    padding: 12px 32px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-cancel {
    background-color: #27272a;
    color: #d4d4d8;
    border: 1px solid #3f3f46;
}

.btn-cancel:hover {
    background-color: #3f3f46;
}

.btn-save {
    background-color: #ef4444;
    color: white;
    min-width: 160px;
}

.btn-save:hover {
    background-color: #dc2626;
}

.btn-save:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-spin {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@media (max-width: 640px) {
    .edit-page {
        padding: 20px 16px;
    }

    .form-card {
        padding: 24px 20px;
    }

    .name-row,
    .field-row {
        flex-direction: column;
    }
}
</style>
