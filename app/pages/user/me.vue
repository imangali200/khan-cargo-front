<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

import { useToast } from '~/composables/useToast'

interface Author {
    id: number
    name: string
    surname: string
    code: string
}

interface Comment {
    id: number
    text: string
    createAt: string
    author?: Author
}

interface Post {
    id: number
    link: string
    review: string
    imgUrl: string | null
    likesCount: number
    comments?: Comment[]
    createAt: string
    author?: Author
}

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
    posts: Post[]
    postLikes: Post[]
    saved: Post[]
}

const WHATSAPP_NUMBER = "77083791496"

const { $axios } = useNuxtApp()
const token = useCookie('token')
const refreshToken = useCookie('refreshToken')
const toast = useToast()
const router = useRouter()

const profile = ref<Profile | null>({
    id: 1,
    name: 'Александр',
    surname: 'Ким',
    code: 'Ai-123',
    branch: 'Алматы',
    phoneNumber: '87776665544',
    isActive: true,
    role: 'user',
    createAt: new Date().toISOString(),
    posts: [
        { id: 1, link: 'https://wb.ru', review: 'Мой первый пост! Кроссовки супер.', imgUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', likesCount: 5, createAt: new Date().toISOString() }
    ],
    postLikes: [
        { id: 2, link: 'https://kaspi.kz', review: 'Классный чехол!', imgUrl: null, likesCount: 12, createAt: new Date().toISOString() }
    ],
    saved: [
        { id: 3, link: 'https://amazon.com', review: 'Набор инструментов.', imgUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800', likesCount: 45, createAt: new Date().toISOString() }
    ]
})
const likedPosts = computed(() => profile.value?.postLikes || [])
const savedPosts = computed(() => profile.value?.saved || [])
const loading = ref(false)
const activeTab = ref<'posts' | 'likes' | 'saved'>('posts')
const isLoggedIn = computed(() => !!token.value)

async function logout() {
    token.value = null
    refreshToken.value = null
    toast.success('Вы успешно вышли из системы')
    router.push('/auth/login')
}

async function deletePost(postId: number) {
    if (!confirm('Удалить этот пост?')) return
    
    if (profile.value) {
        profile.value.posts = profile.value.posts.filter(p => p.id !== postId)
        toast.success('Пост удален', { position: 'top-center' })
    }
}

onMounted(() => {
    // Mock data initialized
})
</script>

<template>
    <div v-if="loading" class="loading-screen">
        <div class="spinner"></div>
    </div>

    <div v-else-if="!isLoggedIn" class="login-required">
        <div class="login-card">
            <div class="login-icon">👤</div>
            <h2>Профиль</h2>
            <p>Войдите, чтобы просмотреть ваш профиль</p>
            <button @click="router.push('/auth/login')" class="login-btn">Войти</button>
        </div>
    </div>

    <div v-else-if="profile && !profile.isActive" class="activation-page">
        <div class="activation-card">
            <div class="activation-icon">🛡️</div>
            <h2>Активация аккаунта</h2>
            <p>Ваш аккаунт ожидает проверки администратором.</p>
            <div class="user-code">
                <span class="code-label">Ваш код:</span>
                <span class="code-value">{{ profile.code }}</span>
            </div>
            <a :href="whatsappLink" target="_blank" class="whatsapp-btn">
                Написать в WhatsApp
            </a>
            <button @click="logout" class="logout-btn">Выйти</button>
        </div>
    </div>

    <div v-else class="profile-page">
        <header class="profile-masthead">
            <div class="profile-card">
                <div class="profile-info-grid">
                    <div class="avatar-col">
                        <div class="profile-avatar">
                            {{ profile?.name?.charAt(0).toUpperCase() || 'U' }}
                            <div class="online-indicator"></div>
                        </div>
                    </div>
                    <div class="details-col">
                        <h1 class="user-fullname">{{ profile?.name || 'Загрузка...' }} {{ profile?.surname || '' }}</h1>
                        <p class="user-handle">{{ profile?.code ? '@' + profile.code : 'Пользователь Ai-Market' }}</p>
                        
                        <div class="user-stats">
                            <div class="stat-item">
                                <span class="stat-value">{{ profile?.posts?.length || 0 }}</span>
                                <span class="stat-label">Постов</span>
                            </div>
                            <div class="stat-divider"></div>
                            <div class="stat-item">
                                <span class="stat-value">{{ likedPosts.length }}</span>
                                <span class="stat-label">Лайков</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="profile-actions">
                    <button @click="logout" class="p-btn logout">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                        </svg>
                        <span>Выйти</span>
                    </button>
                </div>
            </div>
        </header>

        <section class="profile-content">
            <div class="tabs-nav">
                <button v-for="tab in ['posts', 'likes', 'saved']" :key="tab"
                    @click="activeTab = tab" class="tab-btn" :class="{ active: activeTab === tab }">
                    <span class="tab-label">{{ tab === 'posts' ? 'Мои посты' : (tab === 'likes' ? 'Лайкнуто' : 'Сохранено') }}</span>
                    <span class="tab-pill">{{ tab === 'posts' ? profile?.posts?.length : (tab === 'likes' ? likedPosts?.length : savedPosts?.length) || 0 }}</span>
                </button>
            </div>

            <div v-if="activeTab === 'posts'" class="tab-pane">
                <div v-if="profile?.posts?.length" class="post-grid">
                    <div v-for="post in profile.posts" :key="post.id" class="post-mini-card">
                        <div v-if="post.imgUrl" class="post-thumb">
                            <img :src="post.imgUrl" alt="" />
                            <div class="thumb-overlay">
                                <div class="overlay-stat">
                                    <span>❤️ {{ post.likesCount }}</span>
                                </div>
                            </div>
                        </div>
                        <div v-else class="post-text-thumb">
                            <p>{{ post.review }}</p>
                        </div>
                        <button @click="deletePost(post.id)" class="mini-delete-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div v-else class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>У вас пока нет постов</h3>
                </div>
            </div>

            <div v-if="activeTab === 'likes'" class="tab-pane">
                <div v-if="likedPosts.length" class="post-grid">
                    <div v-for="post in likedPosts" :key="post.id" class="post-mini-card">
                        <div v-if="post.imgUrl" class="post-thumb">
                            <img :src="post.imgUrl" alt="" />
                        </div>
                        <div v-else class="post-text-thumb">
                            <p>{{ post.review }}</p>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-state">
                    <div class="empty-icon">❤️</div>
                    <h3>Список пуст</h3>
                </div>
            </div>

            <div v-if="activeTab === 'saved'" class="tab-pane">
                <div v-if="savedPosts.length" class="post-grid">
                    <div v-for="post in savedPosts" :key="post.id" class="post-mini-card">
                        <div v-if="post.imgUrl" class="post-thumb">
                            <img :src="post.imgUrl" alt="" />
                        </div>
                        <div v-else class="post-text-thumb">
                            <p>{{ post.review }}</p>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-state">
                    <div class="empty-icon">🔖</div>
                    <h3>Ничего не сохранено</h3>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.profile-page { padding-bottom: 80px; }
.profile-masthead { background: linear-gradient(135deg, #fdf0fa 0%, #fff 100%); padding: 30px 16px; border-bottom: 1px solid #f0f0f5; }
.profile-card { max-width: 600px; margin: 0 auto; }
.profile-info-grid { display: flex; gap: 24px; align-items: center; margin-bottom: 24px; }
.profile-avatar { width: 90px; height: 90px; border-radius: 30px; background: linear-gradient(135deg, #cb11ab 0%, #481173 100%); display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 800; color: #fff; position: relative; box-shadow: 0 10px 25px rgba(203, 17, 171, 0.25); border: 4px solid #fff; }
.online-indicator { position: absolute; bottom: -2px; right: -2px; width: 20px; height: 20px; background: #22c55e; border: 4px solid #fff; border-radius: 50%; }
.user-fullname { font-size: 24px; font-weight: 900; color: #242424; margin: 0 0 4px; letter-spacing: -0.5px; }
.user-handle { font-size: 14px; color: #8e8e93; margin: 0 0 16px; font-weight: 600; }
.user-stats { display: flex; align-items: center; gap: 20px; }
.stat-value { font-size: 18px; font-weight: 800; color: #242424; }
.stat-label { font-size: 12px; color: #8e8e93; font-weight: 600; }
.stat-divider { width: 1px; height: 24px; background: #eee; }
.profile-actions { display: flex; gap: 12px; }
.p-btn { flex: 1; height: 48px; display: flex; align-items: center; justify-content: center; gap: 8px; border-radius: 14px; font-size: 14px; font-weight: 700; cursor: pointer; text-decoration: none; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: none; }
.p-btn.logout { background: #fff; color: #ef4444; border: 1.5px solid #fef2f2; }
.profile-content { max-width: 800px; margin: 0 auto; padding: 24px 16px; }
.tabs-nav { display: flex; gap: 8px; margin-bottom: 24px; }
.tab-btn { flex: 1; padding: 12px; background: #fff; border: 1px solid #f0f0f5; border-radius: 14px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; transition: all 0.2s; }
.tab-btn.active { background: #242424; border-color: #242424; }
.tab-label { font-size: 12px; font-weight: 700; color: #8e8e93; }
.tab-btn.active .tab-label { color: rgba(255, 255, 255, 0.7); }
.tab-pill { font-size: 14px; font-weight: 800; color: #242424; }
.tab-btn.active .tab-pill { color: #fff; }
.post-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.post-mini-card { aspect-ratio: 1; background: #f8f8fb; border-radius: 12px; overflow: hidden; position: relative; cursor: pointer; }
.post-thumb { width: 100%; height: 100%; }
.post-thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.3); opacity: 0; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s; }
.post-mini-card:hover .thumb-overlay { opacity: 1; }
.overlay-stat { color: #fff; font-weight: 700; font-size: 14px; }
.post-text-thumb { padding: 12px; font-size: 11px; color: #8e8e93; overflow: hidden; height: 100%; display: -webkit-box; -webkit-line-clamp: 6; -webkit-box-orient: vertical; }
.mini-delete-btn { position: absolute; top: 6px; right: 6px; width: 24px; height: 24px; background: rgba(255,255,255,0.9); border-radius: 8px; border: none; display: flex; align-items: center; justify-content: center; color: #ef4444; opacity: 0; transition: opacity 0.2s; }
.post-mini-card:hover .mini-delete-btn { opacity: 1; }
.empty-state { text-align: center; padding: 60px 24px; color: #8e8e93; }
.loading-screen { min-height: 50vh; display: flex; align-items: center; justify-content: center; }
.spinner { width: 32px; height: 32px; border: 3px solid #333; border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.login-required { min-height: 70vh; display: flex; align-items: center; justify-content: center; }
.login-card { text-align: center; padding: 40px; border: 1px solid #eee; border-radius: 20px; }
.login-btn { width: 100%; padding: 14px; background: #cb11ab; color: #fff; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; margin-top: 20px; }

.activation-page { min-height: 70vh; display: flex; align-items: center; justify-content: center; }
.activation-card { text-align: center; padding: 40px; border: 1px solid #eee; border-radius: 24px; max-width: 400px; }
.user-code { background: #f6f6f9; padding: 16px; border-radius: 12px; margin: 20px 0; display: flex; justify-content: space-between; align-items: center; }
.code-value { font-weight: 800; color: #cb11ab; }
.whatsapp-btn { display: block; background: #25D366; color: #fff; padding: 16px; border-radius: 12px; text-decoration: none; font-weight: 700; margin-bottom: 20px; }
.logout-btn { background: none; border: 1px solid #eee; padding: 12px; border-radius: 12px; cursor: pointer; width: 100%; }
</style>
