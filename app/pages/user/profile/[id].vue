<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import type { User, Post } from '~/types'

definePageMeta({
    layout: 'profile'
})

const route = useRoute()
const router = useRouter()
const api = useApi()
const toast = useToast()

const userId = computed(() => Number(route.params.id))
const profile = ref<User | null>(null)
const posts = ref<Post[]>([])
const loading = ref(true)

async function loadProfile() {
    loading.value = true
    try {
        const { data } = await api.users.getPublicProfile(userId.value)
        profile.value = data.user || data
        posts.value = data.posts || []
    } catch (e: any) {
        console.error('Profile load error:', e)
        toast.error('Профиль не найден')
    } finally {
        loading.value = false
    }
}

function formatDate(dateStr?: string) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'только что'
    if (hours < 24) return `${hours} ч. назад`
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function parseContent(content: string) {
    const lines = content.split('\n').filter(l => l.trim().length > 0)
    if (lines.length > 1) {
        return { title: lines[0], body: lines.slice(1).join('\n') }
    }
    if (content.length > 40) {
        const index = content.indexOf('.')
        if (index > 0 && index < 80) {
            return { title: content.substring(0, index + 1), body: content.substring(index + 1).trim() }
        }
    }
    return { title: content, body: '' }
}

function getStatusText(postId: number) {
    const statuses = ['В ПУТИ', 'НА ТАМОЖНЕ']
    return statuses[postId % 2]
}

function getStatusClass(postId: number) {
    const classes = ['transit', 'customs']
    return classes[postId % 2]
}

onMounted(() => {
    loadProfile()
})
</script>

<template>
    <div class="profile-container">
        <div v-if="loading" class="loading-state">
            <div class="loader"></div>
        </div>

        <div v-else-if="profile" class="profile-page">
            <header class="profile-masthead">
                <div class="top-bar">
                    <button @click="router.back()" class="icon-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 class="top-bar-title">Профиль</h1>
                    <!-- Keep right side spacing equal but no settings for public profile -->
                    <div class="spacer"></div>
                </div>

                <div class="avatar-center">
                    <div class="avatar-circle">
                        <img v-if="profile?.avatar" :src="profile.avatar" alt="Avatar" />
                        <span v-else>{{ profile?.name?.charAt(0).toUpperCase() || 'U' }}</span>
                    </div>
                </div>

                <div class="info-center">
                    <h1 class="fullname">{{ profile?.name || 'Пользователь' }} {{ profile?.lastName || 'Имя' }}</h1>
                    <p class="phone-number">{{ profile?.phoneNumber || '+7 999 999 9999' }}</p>
                    <div class="badge-pill">{{ profile?.userCode || 'КГ-8892' }}</div>
                </div>

                <div class="stats-row">
                    <div class="stat-box">
                        <span class="stat-num">{{ posts.length || '124' }}</span>
                        <span class="stat-label">ПОСТЫ</span>
                    </div>
                </div>
            </header>

            <nav class="tabs-nav">
                <button class="tab-btn active">Посты</button>
            </nav>

            <section class="feed-section">
                <div v-if="!posts.length" class="empty-feed">
                    <div class="empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#27272A" stroke-width="1.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <line x1="10" y1="9" x2="8" y2="9" />
                        </svg>
                    </div>
                    <p>Пока нет постов</p>
                    <span class="empty-subtext">Здесь появятся публикации.</span>
                </div>

                <div v-for="post in posts" :key="post.id" class="feed-card">
                    <div class="card-header">
                        <div class="author-info">
                            <div class="author-avatar">
                                <img v-if="profile?.avatar" :src="profile.avatar" alt="" />
                                <span v-else>{{ profile?.name?.charAt(0).toUpperCase() }}</span>
                            </div>
                            <div class="author-meta">
                                <span class="author-name">{{ profile?.name }} {{ profile?.lastName }}</span>
                                <span class="post-time">{{ formatDate(post.createAt || post.createdAt) || '2 ч. назад' }} • {{ post.branch?.name || 'Главный хаб' }}</span>
                            </div>
                        </div>
                        <button class="more-options-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="5" r="1.5" />
                                <circle cx="12" cy="12" r="1.5" />
                                <circle cx="12" cy="19" r="1.5" />
                            </svg>
                        </button>
                    </div>

                    <div class="card-body">
                        <h2 class="post-title">{{ parseContent(post.content).title }}</h2>
                        <p class="post-desc" v-if="parseContent(post.content).body">{{ parseContent(post.content).body }}</p>
                    </div>

                    <div v-if="post.imageUrl || true" class="card-media">
                        <div class="status-badge" :class="getStatusClass(post.id)">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                            </svg>
                            {{ getStatusText(post.id) }}
                        </div>
                        <img :src="post.imageUrl" alt="Изображение груза" v-if="post.imageUrl" />
                        <img v-else src="https://images.unsplash.com/photo-1586528116311-ad8ed7c1590a?q=80&w=800&auto=format&fit=crop" alt="Демо груза" />

                        <div class="value-tag">
                            <span class="value-lbl">ЦЕНА</span>
                            <span class="value-amt">${{ (post.price || 450000).toLocaleString('ru-RU') }}</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div v-else class="empty-feed" style="padding-top: 100px;">
            <p>Профиль не найден</p>
            <button @click="router.back()" style="margin-top:20px; padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 8px;">Вернуться назад</button>
        </div>

        <div class="padding-bottom"></div>
    </div>
</template>

<style scoped>
.profile-container {
    background-color: #000000;
    min-height: 100vh;
    color: #ffffff;
    font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.profile-masthead {
    padding: 16px 20px 24px;
    max-width: 500px;
    margin: 0 auto;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
}

.top-bar-title {
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
}

.icon-btn {
    width: 36px;
    height: 36px;
    background: transparent;
    border: none;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
}

.spacer { width: 36px; }

.avatar-center {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.avatar-circle {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    font-weight: 700;
    color: #000;
    overflow: hidden;
}

.avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.info-center {
    text-align: center;
    margin-bottom: 24px;
}

.fullname {
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 6px;
}

.phone-number {
    font-size: 13px;
    color: #A1A1AA;
    margin: 0 0 12px;
}

.badge-pill {
    display: inline-block;
    background-color: rgba(37, 99, 235, 0.15);
    color: #60A5FA;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
}

.stats-row {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 24px;
}

.stat-box {
    width: 50%;
    max-width: 200px;
    background-color: #121212;
    border-radius: 16px;
    padding: 12px 0; /* Reduced padding to lower height */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.stat-num {
    font-size: 22px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 11px;
    font-weight: 600;
    color: #71717A;
    letter-spacing: 0.5px;
}

/* Tabs */
.tabs-nav {
    display: flex;
    border-bottom: 1px solid #27272A;
    max-width: 500px;
    margin: 0 auto;
}

.tab-btn {
    flex: 1;
    padding: 16px 0;
    background: transparent;
    border: none;
    color: #71717A;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    text-align: center;
}

.tab-btn.active {
    color: #ffffff;
}

.tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #ffffff;
}

/* Feed */
.feed-section {
    padding: 24px 20px;
    max-width: 500px;
    margin: 0 auto;
}

.feed-card {
    background-color: #121212;
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 24px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 16px;
}

.author-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.author-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #E7E5E4; /* Light tone for generic */
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #d97706;
}

.author-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.author-meta {
    display: flex;
    flex-direction: column;
}

.author-name {
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
}

.post-time {
    color: #A1A1AA;
    font-size: 13px;
}

.more-options-btn {
    background: transparent;
    border: none;
    color: #71717A;
    padding: 4px;
    cursor: pointer;
}

.card-body {
    padding: 0 16px 16px;
}

.post-title {
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 6px 0;
}

.post-desc {
    color: #A1A1AA;
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
}

/* Media */
.card-media {
    position: relative;
    width: 100%;
    /* No padding, flush to edges of card */
}

.card-media img {
    width: 100%;
    display: block;
    object-fit: cover;
    aspect-ratio: 1.2;
}

.status-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
}

.status-badge.transit {
    background-color: #3B82F6;
    color: #ffffff;
}

.status-badge.customs {
    background-color: #F59E0B;
    color: #ffffff;
}

.value-tag {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: rgba(24, 24, 27, 0.85); /* #18181b with opacity */
    backdrop-filter: blur(8px);
    padding: 10px 16px;
    border-top-left-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.value-lbl {
    font-size: 9px;
    font-weight: 600;
    color: #A1A1AA;
    letter-spacing: 1px;
}

.value-amt {
    font-size: 18px;
    font-weight: 800;
    color: #ffffff;
}

.empty-feed {
    text-align: center;
    padding: 60px 0;
    color: #A1A1AA;
    font-family: 'Golos Text', 'Inter', sans-serif;
}

.empty-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    opacity: 0.8;
}

.empty-feed p {
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 8px 0;
}

.empty-subtext {
    font-size: 14px;
    color: #71717A;
}

.loading-state {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loader {
    width: 32px;
    height: 32px;
    border: 3px solid #111;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.padding-bottom {
    height: 100px;
}
</style>
