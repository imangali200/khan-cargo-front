<script setup lang="ts">
definePageMeta({
    layout: 'admin',
    middleware: 'auth'
})

interface Post {
    id: number
    link: string
    review: string
    likesCount: number
    createAt: string
}

interface Profile {
    id: number
    name: string
    surname: string
    phoneNumber?: string
    code?: string
    branch?: string
    role?: string
    isActive?: boolean
    posts: Post[]
}

const { $axios } = useNuxtApp()
const token = useCookie('token')
const route = useRoute()
const router = useRouter()

const profile = ref<Profile | null>(null)
const loading = ref(false)

const userId = computed(() => route.params.id as string)

async function getUserProfile() {
    loading.value = true
    try {
        const response = await $axios.get(`profile/${userId.value}`, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        profile.value = response.data
    } catch (error: any) {
        console.error('Profile error:', error.response?.data || error)
    } finally {
        loading.value = false
    }
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    })
}

function goBack() {
    router.back()
}

function getRoleBadge(role: string) {
    switch (role) {
        case 'superAdmin':
            return { text: '👑 SuperAdmin', class: 'tw-from-violet-500 tw-to-purple-500', shadow: 'tw-shadow-violet-500/30' }
        case 'admin':
            return { text: '⭐ Admin', class: 'tw-from-amber-500 tw-to-orange-500', shadow: 'tw-shadow-amber-500/30' }
        default:
            return { text: '👤 User', class: 'tw-from-cyan-500 tw-to-cyan-600', shadow: 'tw-shadow-cyan-500/30' }
    }
}

const posts = computed(() => profile.value?.posts || [])

watch(userId, (newId) => {
    if (newId) getUserProfile()
}, { immediate: true })
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
                        {{ profile.name?.charAt(0).toUpperCase() || 'U' }}
                    </div>

                    <!-- Info -->
                    <div class="tw-flex-1">
                        <div class="tw-flex tw-items-center tw-gap-3 tw-mb-2 tw-flex-wrap">
                            <h1 class="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-white">
                                {{ profile.name }} {{ profile.surname }}
                            </h1>
                            <span 
                                v-if="profile.role"
                                class="tw-px-3 tw-py-1 tw-bg-gradient-to-r tw-text-white tw-text-xs tw-font-bold tw-rounded-full tw-shadow-lg"
                                :class="[getRoleBadge(profile.role).class, getRoleBadge(profile.role).shadow]"
                            >
                                {{ getRoleBadge(profile.role).text }}
                            </span>
                        </div>

                        <p class="tw-text-white/50 tw-text-sm tw-mb-3">@{{ profile.name?.toLowerCase() || 'user' }}</p>

                        <button @click="goBack" class="tw-px-4 tw-py-2 tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-text-white/70 tw-font-medium tw-text-sm hover:tw-bg-white/10 tw-transition-all tw-flex tw-items-center tw-gap-2 tw-mb-4">
                            <span>←</span> Назад
                        </button>

                        <!-- Stats -->
                        <div class="tw-flex tw-gap-4 tw-mb-4">
                            <div class="tw-flex tw-items-center tw-gap-1.5">
                                <span class="tw-font-bold tw-text-white">{{ posts.length }}</span>
                                <span class="tw-text-white/50 tw-text-sm">Постов</span>
                            </div>
                        </div>

                        <!-- Additional Info -->
                        <div v-if="profile.phoneNumber || profile.branch" class="tw-text-white/60 tw-text-sm tw-space-y-1">
                            <p v-if="profile.phoneNumber">📱 {{ profile.phoneNumber }}</p>
                            <p v-if="profile.branch">📍 {{ profile.branch }} <span v-if="profile.code">• Код: {{ profile.code }}</span></p>
                            <p v-if="profile.isActive !== undefined" :class="profile.isActive ? 'tw-text-emerald-400' : 'tw-text-red-400'">
                                {{ profile.isActive ? '✅ Активен' : '❌ Неактивен' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Posts Section -->
            <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-overflow-hidden">
                <div class="tw-py-4 tw-px-5 tw-border-b tw-border-white/10 tw-flex tw-items-center tw-gap-2">
                    <span class="tw-text-lg">📝</span>
                    <span class="tw-font-semibold tw-text-white">Посты</span>
                </div>

                <div class="tw-min-h-[200px]">
                    <div v-if="!posts.length" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-16">
                        <div class="tw-w-20 tw-h-20 tw-rounded-2xl tw-bg-white/5 tw-flex tw-items-center tw-justify-center tw-mb-4">
                            <span class="tw-text-4xl">📝</span>
                        </div>
                        <h3 class="tw-text-xl tw-font-bold tw-text-white tw-mb-2">Нет постов</h3>
                        <p class="tw-text-white/50 tw-text-sm">У пользователя пока нет постов</p>
                    </div>
                    
                    <div v-else class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4 tw-p-4">
                        <div v-for="post in posts" :key="post.id" class="tw-bg-white/[0.03] tw-border tw-border-white/10 tw-rounded-xl tw-overflow-hidden hover:tw-border-violet-500/30 tw-transition-all tw-cursor-pointer">
                            <div class="tw-p-4 tw-bg-gradient-to-r tw-from-violet-500 tw-to-purple-600 tw-text-white">
                                <div class="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                                    <span class="tw-text-lg">📝</span>
                                    <span class="tw-font-bold tw-text-sm">Пост #{{ post.id }}</span>
                                </div>
                                <p class="tw-text-white/70 tw-text-xs">{{ formatDate(post.createAt) }}</p>
                            </div>
                            
                            <div class="tw-p-4">
                                <div class="tw-mb-3">
                                    <p class="tw-text-xs tw-text-white/40 tw-mb-1">Ссылка:</p>
                                    <a :href="post.link.startsWith('http') ? post.link : `https://${post.link}`" target="_blank" class="tw-text-violet-400 tw-text-sm tw-underline tw-break-all tw-line-clamp-2">
                                        {{ post.link }}
                                    </a>
                                </div>
                                
                                <div class="tw-mb-3">
                                    <p class="tw-text-xs tw-text-white/40 tw-mb-1">Отзыв:</p>
                                    <p class="tw-text-white/80 tw-text-sm tw-line-clamp-3">{{ post.review }}</p>
                                </div>
                                
                                <div class="tw-flex tw-items-center tw-gap-2 tw-pt-3 tw-border-t tw-border-white/10">
                                    <span>❤️</span>
                                    <span class="tw-font-bold tw-text-white">{{ post.likesCount }}</span>
                                    <span class="tw-text-white/40 tw-text-sm">лайков</span>
                                </div>
                            </div>
                        </div>
                    </div>
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
