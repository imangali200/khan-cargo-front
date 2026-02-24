<script setup lang="ts">
definePageMeta({
    layout: 'admin',
    middleware: 'auth'
})
import type { User } from '../users.vue'
import { useToast } from '~/composables/useToast'
const toast = useToast()
const router = useRouter()
const { $axios } = useNuxtApp()
const token = useCookie('token')
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
        const admins = await $axios.get('user/admins', {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        adminList.value = admins.data
    } catch (error: any) {
        // console.error(error)
        if (error.response?.status === 404) {
            adminList.value = []
        } else {
            toast.error('Ошибка при загрузке администраторов', {
                position: 'top-center'             })
        }
    } finally {
        loading.value = false
    }
}

const createBranch = async () => {
    if (!selectAdmin.value || !branchName.value) {
        errorMessage.value = 'Необходимо заполнить все поля.'
        return
    }
    
    submitting.value = true
    errorMessage.value = ''
    
    try {
        const resBranch = await $axios.post('branch', {
            branchName: branchName.value,
            responsibleName: selectAdmin.value
        }, {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        
        toast.success('Филиал успешно создан', {
            position: 'top-center'         })
        return navigateTo('/superAdmin/warehouses')
    } catch (error: any) {
        // console.error(error)
        toast.error(error.response?.data?.message || 'Ошибка при создании филиала', {
            position: 'top-center'         })
    } finally {
        submitting.value = false
    }
}

onMounted(() => {
    getFreeAdmins()
})
</script>
<template>
    <div class="tw-py-6 animate-fadeIn">
        <!-- Breadcrumb -->
        <nav class="tw-flex tw-items-center tw-gap-3 tw-mb-6 tw-flex-wrap">
            <router-link to="/superAdmin" class="tw-flex tw-items-center tw-gap-2 tw-text-cyan-400 tw-no-underline hover:tw-text-cyan-300 tw-transition-colors tw-text-sm">
                <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                Главная
            </router-link>
            <span class="tw-text-white/30">→</span>
            <router-link to="/superAdmin/warehouses" class="tw-text-cyan-400 tw-no-underline hover:tw-text-cyan-300 tw-transition-colors tw-text-sm">
                Склады
            </router-link>
            <span class="tw-text-white/30">→</span>
            <span class="tw-text-white/60 tw-text-sm">Добавить склад</span>
        </nav>

        <!-- Header Card -->
        <div class="tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-rounded-2xl tw-p-6 tw-mb-6 tw-shadow-lg tw-shadow-cyan-500/20">
            <div class="tw-flex tw-items-center tw-justify-between tw-flex-wrap tw-gap-4">
                <div class="tw-flex tw-items-center tw-gap-4">
                    <div class="tw-bg-white/20 tw-backdrop-blur-sm tw-p-3 tw-rounded-xl">
                        <svg class="tw-w-8 tw-h-8 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                    </div>
                    <div>
                        <h1 class="tw-text-2xl tw-font-bold tw-text-white">Новый склад</h1>
                        <p class="tw-text-white/80 tw-text-sm">Заполните информацию о складе</p>
                    </div>
                </div>
                <button 
                    @click="goBack()"
                    class="tw-flex tw-items-center tw-gap-2 tw-bg-white/20 tw-backdrop-blur-sm tw-text-white tw-px-5 tw-py-2.5 tw-rounded-xl hover:tw-bg-white/30 tw-transition-all tw-duration-200 tw-border-0 tw-cursor-pointer"
                >
                    <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    Назад
                </button>
            </div>
        </div>
        
        <!-- Loading -->
        <div v-if="loading" class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-12 tw-text-center">
            <div class="tw-inline-flex tw-items-center tw-justify-center tw-w-16 tw-h-16 tw-bg-cyan-500/20 tw-rounded-full tw-mb-4">
                <div class="tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-4 tw-border-cyan-500 tw-border-t-transparent"></div>
            </div>
            <p class="tw-text-white/50 tw-font-medium">Загрузка данных...</p>
        </div>

        <!-- Form Card -->
        <div v-else class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-overflow-hidden">
            <div class="tw-p-8">
                <form class="tw-space-y-6" @submit.prevent='createBranch'>
                    <!-- Warehouse Name -->
                    <div class="tw-space-y-2">
                        <label class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-white/80" for="nameBranch">
                            <svg class="tw-w-5 tw-h-5 tw-text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                            </svg>
                            Название склада
                        </label>
                        <input 
                            v-model="branchName" 
                            type="text" 
                            id="nameBranch" 
                            placeholder="Например: Склад в Китае"
                            class="tw-w-full tw-border-2 tw-border-white/10 tw-rounded-xl tw-h-12 tw-px-4 tw-bg-white/5 tw-text-white placeholder:tw-text-white/30 focus:tw-bg-white/10 focus:tw-border-cyan-500/50 tw-transition-all tw-duration-200 tw-outline-none" 
                        />
                    </div>

                    <!-- Admin Select -->
                    <div class="tw-space-y-2">
                        <label class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-white/80" for="selectAdmin">
                            <svg class="tw-w-5 tw-h-5 tw-text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            Ответственный администратор
                        </label>
                        <div class="tw-relative">
                            <select 
                                id="selectAdmin"
                                class="tw-w-full tw-h-12 tw-border-2 tw-border-white/10 tw-rounded-xl tw-px-4 tw-bg-white/5 tw-text-white focus:tw-bg-white/10 focus:tw-border-cyan-500/50 tw-transition-all tw-duration-200 tw-outline-none tw-appearance-none tw-cursor-pointer"
                                v-model="selectAdmin"
                            >
                                <option value="" disabled class="tw-bg-gray-800">Выберите администратора</option>
                                <option v-for="admin in adminList" :key="admin.id" :value="admin.name + ' ' + admin.surname" class="tw-bg-gray-800">
                                    {{ admin.name }} {{ admin.surname }}
                                </option>
                            </select>
                            <svg class="tw-absolute tw-right-4 tw-top-1/2 tw--translate-y-1/2 tw-w-5 tw-h-5 tw-text-white/40 tw-pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </div>
                        
                        <!-- No Admins Warning -->
                        <div v-if="!adminList?.length" class="tw-flex tw-items-start tw-gap-3 tw-bg-amber-500/10 tw-border tw-border-amber-500/30 tw-rounded-xl tw-p-4 tw-mt-3">
                            <svg class="tw-w-5 tw-h-5 tw-text-amber-400 tw-flex-shrink-0 tw-mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                            <div>
                                <p class="tw-text-amber-300 tw-font-medium tw-text-sm">Нет доступных администраторов</p>
                                <p class="tw-text-amber-300/70 tw-text-sm tw-mt-1">
                                    Сначала нужно 
                                    <router-link class="tw-text-cyan-400 hover:tw-underline tw-font-medium" to="/superAdmin/create">
                                        добавить администратора
                                    </router-link>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Error Message -->
                    <div v-if="errorMessage" class="tw-flex tw-items-center tw-gap-3 tw-bg-red-500/10 tw-border tw-border-red-500/30 tw-rounded-xl tw-p-4">
                        <svg class="tw-w-5 tw-h-5 tw-text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p class="tw-text-red-400 tw-font-medium">{{ errorMessage }}</p>
                    </div>

                    <!-- Submit Button -->
                    <div class="tw-pt-4">
                        <button 
                            type="submit"
                            :disabled="submitting"
                            class="tw-w-full tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-text-white tw-font-semibold tw-rounded-xl tw-h-14 hover:tw-shadow-lg hover:tw-shadow-cyan-500/30 hover:tw-translate-y-[-2px] tw-transition-all tw-duration-300 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed disabled:hover:tw-shadow-none disabled:hover:tw-translate-y-0 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-border-0 tw-cursor-pointer"
                        >
                            <svg v-if="!submitting" class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            <div v-else class="tw-animate-spin tw-rounded-full tw-h-5 tw-w-5 tw-border-2 tw-border-white tw-border-t-transparent"></div>
                            {{ submitting ? 'Сохранение...' : 'Создать склад' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
