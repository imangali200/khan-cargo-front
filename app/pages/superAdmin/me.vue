<script setup lang="ts">
definePageMeta({
    layout: 'admin',
    middleware: 'auth'
})

import { useToast } from '~/composables/useToast'

interface Profile {
    id: number
    phoneNumber: string
    name: string
    surname: string
    code: string
    branch: string
    isActive: boolean
    role: string
    createAt: string
}

const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()
const router = useRouter()

const profile = ref<Profile | null>(null)
const loading = ref(false)

async function getProfile() {
    loading.value = true
    try {
        const response = await $axios.get('profile', {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        profile.value = response.data
    } catch (error: any) {
        console.error(error)
        toast.error('Ошибка при загрузке профиля', { position: 'top-center'  })
    } finally {
        loading.value = false
    }
}

function goBack() {
    router.back()
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    })
}

onMounted(() => {
    getProfile()
})
</script>

<template>
    <div class="tw-py-6 animate-fadeIn">
        <!-- Loading -->
        <div v-if="loading" class="tw-text-center tw-py-16">
            <div class="tw-w-12 tw-h-12 tw-border-4 tw-border-violet-500/20 tw-border-t-violet-500 tw-rounded-full tw-animate-spin tw-mx-auto"></div>
            <p class="tw-mt-4 tw-text-white/50">Загрузка...</p>
        </div>

        <div v-else-if="profile">
            <!-- Profile Header -->
            <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-6 tw-mb-6">
                <div class="tw-flex tw-items-start tw-gap-5">
                    <!-- Avatar -->
                    <div class="tw-w-20 tw-h-20 md:tw-w-28 md:tw-h-28 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-text-3xl md:tw-text-4xl tw-font-bold tw-text-white tw-flex-shrink-0 tw-bg-gradient-to-br tw-from-violet-500 tw-to-purple-600 tw-shadow-lg tw-shadow-violet-500/30">
                        {{ profile.name?.charAt(0).toUpperCase() || 'S' }}
                    </div>

                    <!-- Info -->
                    <div class="tw-flex-1">
                        <div class="tw-flex tw-items-center tw-gap-3 tw-mb-3 tw-flex-wrap">
                            <h1 class="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-white">
                                {{ profile.name }} {{ profile.surname }}
                            </h1>
                            <span class="tw-px-3 tw-py-1 tw-bg-gradient-to-r tw-from-violet-500 tw-to-purple-500 tw-text-white tw-text-xs tw-font-bold tw-rounded-full tw-shadow-lg tw-shadow-violet-500/30">
                                👑 SuperAdmin
                            </span>
                        </div>

                        <!-- Buttons -->
                        <div class="tw-flex tw-gap-2 tw-mb-4 tw-flex-wrap">
                            <button @click="goBack" class="tw-px-4 tw-py-2 tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-text-white/70 tw-font-medium tw-text-sm hover:tw-bg-white/10 tw-transition-all tw-flex tw-items-center tw-gap-2">
                                <span>←</span> Назад
                            </button>
                        </div>

                        <!-- Contact Info -->
                        <div class="tw-text-white/60 tw-text-sm tw-space-y-1">
                            <p>📱 {{ profile.phoneNumber }}</p>
                            <p>📍 {{ profile.branch }} • Код: {{ profile.code }}</p>
                            <p>📅 Зарегистрирован: {{ formatDate(profile.createAt) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Admin Panel Section -->
            <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-6">
                <h2 class="tw-text-lg tw-font-bold tw-text-white tw-mb-5 tw-flex tw-items-center tw-gap-2">
                    <span>🛠️</span> Панель управления
                </h2>
                
                <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4">
                    <router-link to="/superAdmin/users" class="tw-bg-gradient-to-br tw-from-cyan-500 tw-to-cyan-600 tw-rounded-2xl tw-p-5 tw-text-white hover:tw-translate-y-[-4px] hover:tw-shadow-xl hover:tw-shadow-cyan-500/30 tw-transition-all tw-no-underline">
                        <div class="tw-text-3xl tw-mb-3">👥</div>
                        <h3 class="tw-font-bold tw-mb-1">Пользователи</h3>
                        <p class="tw-text-white/70 tw-text-sm">Управление пользователями</p>
                    </router-link>

                    <router-link to="/superAdmin/warehouses" class="tw-bg-gradient-to-br tw-from-emerald-500 tw-to-emerald-600 tw-rounded-2xl tw-p-5 tw-text-white hover:tw-translate-y-[-4px] hover:tw-shadow-xl hover:tw-shadow-emerald-500/30 tw-transition-all tw-no-underline">
                        <div class="tw-text-3xl tw-mb-3">🏭</div>
                        <h3 class="tw-font-bold tw-mb-1">Склады</h3>
                        <p class="tw-text-white/70 tw-text-sm">Управление складами</p>
                    </router-link>

                    <router-link to="/superAdmin/tracks" class="tw-bg-gradient-to-br tw-from-amber-500 tw-to-orange-500 tw-rounded-2xl tw-p-5 tw-text-white hover:tw-translate-y-[-4px] hover:tw-shadow-xl hover:tw-shadow-amber-500/30 tw-transition-all tw-no-underline">
                        <div class="tw-text-3xl tw-mb-3">📦</div>
                        <h3 class="tw-font-bold tw-mb-1">Товары</h3>
                        <p class="tw-text-white/70 tw-text-sm">Управление товарами</p>
                    </router-link>

                    <router-link to="/superAdmin/import" class="tw-bg-gradient-to-br tw-from-violet-500 tw-to-purple-600 tw-rounded-2xl tw-p-5 tw-text-white hover:tw-translate-y-[-4px] hover:tw-shadow-xl hover:tw-shadow-violet-500/30 tw-transition-all tw-no-underline">
                        <div class="tw-text-3xl tw-mb-3">📥</div>
                        <h3 class="tw-font-bold tw-mb-1">Импорт</h3>
                        <p class="tw-text-white/70 tw-text-sm">Қытай / Тараз импорт</p>
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-20">
            <div class="tw-text-5xl tw-mb-4">😕</div>
            <p class="tw-text-white/50 tw-mb-4">Профиль не найден</p>
            <button @click="goBack" class="tw-px-6 tw-py-3 tw-bg-gradient-to-r tw-from-violet-500 tw-to-purple-600 tw-rounded-xl tw-text-white tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-violet-500/30 tw-transition-all">
                ← Назад
            </button>
        </div>
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
