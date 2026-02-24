<script setup lang="ts">
definePageMeta({
    layout: 'admin',
    middleware: 'auth'
})
import { useToast } from '~/composables/useToast';
interface Branch { id: number; name: string; branchName?: string; adminId: number; responsibleName?: string; deleteAt?: string }
const token = useCookie('token')
const { $axios } = useNuxtApp()
const toast = useToast()
const branchData = ref<Branch[]>([])
const loading = ref(false)

async function getBranches() {
    loading.value = true
    try {
        const res = await $axios.get('branch/trash', {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        branchData.value = res.data
    } catch (error) {
        console.error(error)
        toast.error('Ошибка при загрузке данных', {
            position: 'top-center'         })
    } finally {
        loading.value = false
    }
}

const restoreBranch = async (id: number) => {
    try {
        const branchRes = await $axios.put(`branch/restore/${id}`, {}, {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        toast.success('Филиал успешно восстановлен', {
            position: 'top-center'         })
        getBranches()
    } catch (error: any) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Ошибка при восстановлении филиала', {
            position: 'top-center'         })
    }
}

const formatData = (time: string) => {
    if (!time) return ''
    const date = new Date(time)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

onMounted(() => {
    getBranches()
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
            <span class="tw-text-white/60 tw-text-sm">Корзина</span>
        </nav>

        <!-- Header Card -->
        <div class="tw-bg-gradient-to-r tw-from-red-500 tw-to-red-600 tw-rounded-xl tw-p-4 tw-mb-6 tw-shadow-lg tw-shadow-red-500/20">
            <div class="tw-flex tw-items-center tw-justify-between tw-flex-wrap tw-gap-3">
                <div class="tw-flex tw-items-center tw-gap-3">
                    <div class="tw-bg-white/20 tw-backdrop-blur-sm tw-p-2 tw-rounded-lg">
                        <svg class="tw-w-5 tw-h-5 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </div>
                    <div>
                        <h1 class="tw-text-lg tw-font-bold tw-text-white">Корзина</h1>
                        <p class="tw-text-white/80 tw-text-xs">Удаленные склады</p>
                    </div>
                </div>
                <router-link 
                    to="/superAdmin/warehouses"
                    class="tw-flex tw-items-center tw-gap-1.5 tw-bg-white/20 tw-backdrop-blur-sm tw-text-white tw-px-3 tw-py-1.5 tw-rounded-lg tw-text-sm hover:tw-bg-white/30 tw-transition-all tw-duration-200 tw-no-underline"
                >
                    <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    Назад
                </router-link>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-12 tw-text-center">
            <div class="tw-inline-flex tw-items-center tw-justify-center tw-w-16 tw-h-16 tw-bg-red-500/20 tw-rounded-full tw-mb-4">
                <div class="tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-4 tw-border-red-500 tw-border-t-transparent"></div>
            </div>
            <p class="tw-text-white/50 tw-font-medium">Загрузка...</p>
        </div>

        <template v-else>
            <!-- Empty State -->
            <div v-if="!branchData.length" class="tw-text-center tw-py-16 tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl">
                <div class="tw-inline-flex tw-items-center tw-justify-center tw-w-20 tw-h-20 tw-bg-red-500/10 tw-rounded-full tw-mb-4">
                    <svg class="tw-w-10 tw-h-10 tw-text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </div>
                <h3 class="tw-text-xl tw-font-bold tw-text-white tw-mb-2">Корзина пуста</h3>
                <p class="tw-text-white/50 tw-mb-6">Нет удаленных складов</p>
                <router-link to="/superAdmin/warehouses" class="tw-inline-flex tw-items-center tw-gap-2 tw-px-6 tw-py-3 tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-rounded-xl tw-text-white tw-font-semibold tw-no-underline hover:tw-translate-y-[-2px] hover:tw-shadow-lg hover:tw-shadow-cyan-500/30 tw-transition-all">
                    <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    Вернуться к складам
                </router-link>
            </div>

            <!-- Trash Items -->
            <div v-else class="tw-space-y-4">
                <div 
                    v-for="data in branchData" 
                    :key="data.id" 
                    class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-overflow-hidden hover:tw-border-red-500/30 tw-transition-all tw-duration-300"
                >
                    <div class="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center tw-justify-between tw-p-5 tw-gap-4">
                        <!-- Info -->
                        <div class="tw-flex tw-items-center tw-gap-4">
                            <div class="tw-w-12 tw-h-12 tw-bg-red-500/20 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                                <svg class="tw-w-6 tw-h-6 tw-text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                </svg>
                            </div>
                            <div>
                                <div class="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                                    <span class="tw-px-2 tw-py-0.5 tw-bg-red-500/20 tw-rounded-lg tw-text-red-400 tw-font-semibold tw-text-xs">#{{ data.id }}</span>
                                    <h3 class="tw-text-lg tw-font-bold tw-text-white">{{ data.branchName }}</h3>
                                </div>
                                <p class="tw-text-white/50 tw-text-sm">
                                    <span class="tw-text-white/30">Ответственный:</span> {{ data.responsibleName }}
                                </p>
                            </div>
                        </div>

                        <!-- Delete Info & Action -->
                        <div class="tw-flex tw-flex-col sm:tw-flex-row tw-items-start sm:tw-items-center tw-gap-4">
                            <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-text-white/40">
                                <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>Удалено: {{ formatData(data.deleteAt || '') }}</span>
                            </div>
                            <button 
                                @click="restoreBranch(data.id)"
                                class="tw-flex tw-items-center tw-gap-2 tw-px-5 tw-py-2.5 tw-bg-gradient-to-r tw-from-emerald-500 tw-to-emerald-600 tw-rounded-xl tw-text-white tw-font-semibold tw-text-sm hover:tw-translate-y-[-2px] hover:tw-shadow-lg hover:tw-shadow-emerald-500/30 tw-transition-all tw-border-0 tw-cursor-pointer"
                            >
                                <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                </svg>
                                Восстановить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
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
