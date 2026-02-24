<script setup lang="ts">
definePageMeta({
    layout: 'admin',
    middleware: 'auth'
})

import type { Branch } from '../auth/register.vue'
import { useToast } from "~/composables/useToast";

const { $axios } = useNuxtApp()
const toast = useToast();
const token = useCookie('token')
const router = useRouter()

const phoneNumber = ref('')
const selectBranch = ref('')
const codeUser = ref('')
const name = ref('')
const surname = ref('')
const password = ref('')
const errorMessage = ref('')
const role = ref('user')
const branches = ref<Branch[]>([])
const loading = ref(false)
const submitting = ref(false)

const goToBack = () => {
    router.back()
}

async function getBranches() {
    loading.value = true
    try {
        const res = await $axios.get('branch')
        branches.value = res.data
    } catch (error) {
        console.error(error)
        toast.error('Ошибка при загрузке складов', { position: 'top-center'  })
    } finally {
        loading.value = false
    }
}

const createUser = async () => {
    if (!phoneNumber.value || !name.value || !surname.value || !role.value || !password.value) {
        errorMessage.value = 'Пожалуйста, заполните все обязательные поля'
        return
    }

    submitting.value = true
    errorMessage.value = ''

    try {
        await $axios.post('admin/createuser', {
            phoneNumber: phoneNumber.value,
            code: codeUser.value || '',
            name: name.value,
            surname: surname.value,
            role: role.value,
            branch: selectBranch.value || null,
            password: password.value
        }, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })

        toast.success('Пользователь успешно создан!', { position: "top-center" , timeout: 3000 })
        return navigateTo('/superAdmin/users')
    } catch (error: any) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Ошибка при создании пользователя', { position: 'top-center'  })
    } finally {
        submitting.value = false
    }
}

onMounted(() => {
    getBranches()
})
</script>

<template>
    <div class="tw-py-6 animate-fadeIn">
        <!-- Breadcrumb -->
        <div class="tw-flex tw-items-center tw-gap-3 tw-mb-6 tw-flex-wrap">
            <router-link to="/superAdmin" class="tw-flex tw-items-center tw-gap-2 tw-text-cyan-400 tw-no-underline hover:tw-text-cyan-300 tw-transition-colors tw-text-sm">
                <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                Главная
            </router-link>
            <span class="tw-text-white/30">→</span>
            <router-link to="/superAdmin/users" class="tw-text-cyan-400 tw-no-underline hover:tw-text-cyan-300 tw-transition-colors tw-text-sm">Пользователи</router-link>
            <span class="tw-text-white/30">→</span>
            <span class="tw-text-white/60 tw-text-sm">Добавить</span>
        </div>

        <!-- Header -->
        <div class="tw-flex tw-justify-between tw-items-center tw-mb-6 tw-pb-6 tw-border-b tw-border-white/10">
            <h1 class="tw-text-2xl tw-font-bold tw-text-white">Добавить пользователя</h1>
            <button @click="goToBack" class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2.5 tw-bg-red-500/15 tw-border tw-border-red-500/30 tw-rounded-xl tw-text-red-400 tw-font-semibold tw-text-sm hover:tw-bg-red-500/25 tw-transition-all">
                <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                Назад
            </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="tw-text-center tw-py-16">
            <div class="tw-w-12 tw-h-12 tw-border-4 tw-border-cyan-500/20 tw-border-t-cyan-500 tw-rounded-full tw-animate-spin tw-mx-auto"></div>
            <p class="tw-mt-4 tw-text-white/50">Загрузка...</p>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="createUser" class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-6">
            <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-5">
                <!-- Код -->
                <div class="tw-flex tw-flex-col tw-gap-2">
                    <label class="tw-text-sm tw-text-white/70 tw-font-medium">Код (для клиентов)</label>
                    <div class="tw-flex tw-items-center tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl focus-within:tw-border-cyan-500 focus-within:tw-shadow-lg focus-within:tw-shadow-cyan-500/10 tw-transition-all">
                        <div class="tw-px-4 tw-text-white/40">
                            <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>
                        </div>
                        <input type="text" v-model="codeUser" placeholder="Например: KZ001" class="tw-flex-1 tw-h-[50px] tw-bg-transparent tw-border-none tw-outline-none tw-text-white placeholder:tw-text-white/30 tw-pr-4">
                    </div>
                </div>

                <!-- Телефон -->
                <div class="tw-flex tw-flex-col tw-gap-2">
                    <label class="tw-text-sm tw-text-white/70 tw-font-medium">Телефон <span class="tw-text-red-400">*</span></label>
                    <div class="tw-flex tw-items-center tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl focus-within:tw-border-cyan-500 focus-within:tw-shadow-lg focus-within:tw-shadow-cyan-500/10 tw-transition-all">
                        <div class="tw-px-4 tw-text-white/40">
                            <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        </div>
                        <input v-model="phoneNumber" type="text" placeholder="8701 001 0101" class="tw-flex-1 tw-h-[50px] tw-bg-transparent tw-border-none tw-outline-none tw-text-white placeholder:tw-text-white/30 tw-pr-4">
                    </div>
                </div>

                <!-- Имя -->
                <div class="tw-flex tw-flex-col tw-gap-2">
                    <label class="tw-text-sm tw-text-white/70 tw-font-medium">Имя <span class="tw-text-red-400">*</span></label>
                    <div class="tw-flex tw-items-center tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl focus-within:tw-border-cyan-500 focus-within:tw-shadow-lg focus-within:tw-shadow-cyan-500/10 tw-transition-all">
                        <div class="tw-px-4 tw-text-white/40">
                            <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        </div>
                        <input type="text" v-model="name" placeholder="Ivan" class="tw-flex-1 tw-h-[50px] tw-bg-transparent tw-border-none tw-outline-none tw-text-white placeholder:tw-text-white/30 tw-pr-4">
                    </div>
                </div>

                <!-- Фамилия -->
                <div class="tw-flex tw-flex-col tw-gap-2">
                    <label class="tw-text-sm tw-text-white/70 tw-font-medium">Фамилия <span class="tw-text-red-400">*</span></label>
                    <div class="tw-flex tw-items-center tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl focus-within:tw-border-cyan-500 focus-within:tw-shadow-lg focus-within:tw-shadow-cyan-500/10 tw-transition-all">
                        <div class="tw-px-4 tw-text-white/40">
                            <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        </div>
                        <input type="text" v-model="surname" placeholder="Ivanov" class="tw-flex-1 tw-h-[50px] tw-bg-transparent tw-border-none tw-outline-none tw-text-white placeholder:tw-text-white/30 tw-pr-4">
                    </div>
                </div>

                <!-- Роль -->
                <div class="tw-flex tw-flex-col tw-gap-2">
                    <label class="tw-text-sm tw-text-white/70 tw-font-medium">Роль <span class="tw-text-red-400">*</span></label>
                    <div class="tw-relative tw-flex tw-items-center tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl focus-within:tw-border-cyan-500 focus-within:tw-shadow-lg focus-within:tw-shadow-cyan-500/10 tw-transition-all">
                        <div class="tw-px-4 tw-text-white/40">
                            <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                        </div>
                        <select v-model="role" class="tw-flex-1 tw-h-[50px] tw-bg-transparent tw-border-none tw-outline-none tw-text-white tw-appearance-none tw-cursor-pointer tw-pr-10">
                            <option value="user" class="tw-bg-[#1e293b] tw-text-white">Пользователь</option>
                            <option value="admin" class="tw-bg-[#1e293b] tw-text-white">Администратор</option>
                            <option value="superAdmin" class="tw-bg-[#1e293b] tw-text-white">Super Admin</option>
                        </select>
                        <div class="tw-absolute tw-right-4 tw-text-white/40 tw-pointer-events-none">
                            <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                        </div>
                    </div>
                </div>

                <!-- Склад -->
                <div class="tw-flex tw-flex-col tw-gap-2">
                    <label class="tw-text-sm tw-text-white/70 tw-font-medium">Склад</label>
                    <div class="tw-relative tw-flex tw-items-center tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl focus-within:tw-border-cyan-500 focus-within:tw-shadow-lg focus-within:tw-shadow-cyan-500/10 tw-transition-all">
                        <div class="tw-px-4 tw-text-white/40">
                            <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        </div>
                        <select v-model="selectBranch" class="tw-flex-1 tw-h-[50px] tw-bg-transparent tw-border-none tw-outline-none tw-text-white tw-appearance-none tw-cursor-pointer tw-pr-10">
                            <option value="" class="tw-bg-[#1e293b] tw-text-white">Не выбран</option>
                            <option v-for="branch in branches" :key="branch.id" :value="branch.branchName" class="tw-bg-[#1e293b] tw-text-white">{{ branch.branchName }}</option>
                        </select>
                        <div class="tw-absolute tw-right-4 tw-text-white/40 tw-pointer-events-none">
                            <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                        </div>
                    </div>
                </div>

                <!-- Пароль -->
                <div class="tw-flex tw-flex-col tw-gap-2 sm:tw-col-span-2">
                    <label class="tw-text-sm tw-text-white/70 tw-font-medium">Пароль <span class="tw-text-red-400">*</span></label>
                    <div class="tw-flex tw-items-center tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl focus-within:tw-border-cyan-500 focus-within:tw-shadow-lg focus-within:tw-shadow-cyan-500/10 tw-transition-all">
                        <div class="tw-px-4 tw-text-white/40">
                            <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        </div>
                        <input type="text" v-model="password" placeholder="Введите пароль" class="tw-flex-1 tw-h-[50px] tw-bg-transparent tw-border-none tw-outline-none tw-text-white placeholder:tw-text-white/30 tw-pr-4">
                    </div>
                </div>
            </div>

            <!-- Error message -->
            <p v-if="errorMessage" class="tw-mt-4 tw-px-4 tw-py-3 tw-bg-red-500/10 tw-border tw-border-red-500/30 tw-rounded-xl tw-text-red-400 tw-text-sm">{{ errorMessage }}</p>

            <!-- Submit -->
            <button type="submit" :disabled="submitting" class="tw-mt-6 tw-w-full sm:tw-w-auto tw-h-[52px] tw-px-8 tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-rounded-xl tw-text-white tw-font-semibold hover:tw-from-cyan-600 hover:tw-to-cyan-700 hover:tw-translate-y-[-2px] hover:tw-shadow-lg hover:tw-shadow-cyan-500/30 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-transition-all tw-flex tw-items-center tw-justify-center tw-gap-2">
                <span v-if="!submitting">Сохранить</span>
                <div v-else class="tw-w-5 tw-h-5 tw-border-2 tw-border-white/30 tw-border-t-white tw-rounded-full tw-animate-spin"></div>
            </button>
        </form>
    </div>
</template>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
