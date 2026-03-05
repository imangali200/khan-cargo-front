<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import type { User, Post } from '~/types'

definePageMeta({
    layout: 'profile'
})

const token = useCookie('token')
const refreshToken = useCookie('refreshToken')
const toast = useToast()
const router = useRouter()
const api = useApi()

const profile = ref<User | null>(null)
const likedPosts = ref<Post[]>([])
const myPosts = ref<Post[]>([])
const loading = ref(true)
const activeTab = ref<'posts' | 'likes'>('posts')

const expandedComments = ref<Set<number>>(new Set())
const commentText = ref<{ [key: number]: string }>({})

const isLoggedIn = computed(() => !!token.value)

const displayPosts = computed(() => activeTab.value === 'posts' ? myPosts.value : likedPosts.value)

async function logout() {
    token.value = null
    refreshToken.value = null
    toast.success('Вы вышли из системы')
    router.push('/auth/login')
}

async function loadProfile() {
    if (!isLoggedIn.value) {
        loading.value = false
        return
    }
    try {
        const { data } = await api.profile.getProfile()
        profile.value = data

        const [postsRes, likedRes] = await Promise.all([
            api.profile.getMyPosts(),
            api.profile.getLikedPosts()
        ])

        myPosts.value = postsRes.data.data
        likedPosts.value = likedRes.data.data

    } catch (e: any) {
        console.error('Profile loading error:', e)
        if (e.response?.status === 401) {
            logout()
        }
    } finally {
        loading.value = false
    }
}

async function toggleLike(postId: number) {
    const post = displayPosts.value.find(p => p.id === postId)
    if (!post) return

    // Optimistic update
    const previousIsLiked = post.isLikedByMe
    const previousLikesCount = post.likesCount

    post.isLikedByMe = !post.isLikedByMe
    post.likesCount += post.isLikedByMe ? 1 : -1

    try {
        await api.feed.toggleLike(postId)
    } catch (error) {
        // Revert on failure
        post.isLikedByMe = previousIsLiked
        post.likesCount = previousLikesCount
        toast.error('Ошибка при лайке')
    }
}

async function deletePost(postId: number) {
    if (!confirm('Действительно удалить пост?')) return
    try {
        await api.feed.deletePost(postId)
        myPosts.value = myPosts.value.filter(p => p.id !== postId)
        toast.success('Пост удален')
    } catch {
        toast.error('Ошибка при удалении поста')
    }
}

function formatDate(dateStr?: string) {
    if (!dateStr) return 'сейчас'
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return 'сейчас'
    if (diff < 3600) return Math.floor(diff / 60) + ' м'
    if (diff < 86400) return Math.floor(diff / 3600) + ' ч'
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

async function loadComments(postId: number) {
    if (expandedComments.value.has(postId)) {
        expandedComments.value.delete(postId)
        return
    }
    expandedComments.value.add(postId)
    const post = displayPosts.value.find(p => p.id === postId)
    if (post && !post.comments) {
        try {
            const res = await api.feed.getComments(postId)
            post.comments = res.data.data
        } catch { }
    }
}

async function submitComment(postId: number) {
    const content = commentText.value[postId]?.trim()
    if (!content) return
    try {
        const { data } = await api.feed.createComment(postId, { content })
        const post = displayPosts.value.find(p => p.id === postId)
        if (post) {
            if (!post.comments) post.comments = []
            post.comments.push(data)
            post.commentsCount++
        }
        commentText.value[postId] = ''
    } catch {
        toast.error('Ошибка при отправке комментария')
    }
}

// Split content to simulate Bold Title and grey description
function parseContent(content: string) {
    const lines = content.split('\n').filter(l => l.trim().length > 0)
    if (lines.length > 1) {
        return { title: lines[0], body: lines.slice(1).join('\n') }
    }
    // If only one line, just make it all title if short, or split by first dot
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
        <!-- Header Masthead -->
        <header class="profile-masthead">
            <div class="top-bar">
                <button @click="router.back()" class="icon-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 class="top-bar-title">Профиль</h1>
                <button @click="logout" class="icon-btn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </button>
            </div>

            <div class="avatar-center">
                <div class="avatar-circle">
                    <img v-if="profile?.profilePhotoUrl" :src="profile.profilePhotoUrl ?? undefined" alt="Avatar" />
                    <span v-else class="initial">{{ profile?.name?.charAt(0).toUpperCase() || 'U' }}</span>
                </div>
            </div>

            <div class="info-center">
                <h1 class="fullname">{{ profile?.name || 'Пользователь' }} {{ profile?.lastName || 'Имя' }}</h1>
                <p class="phone-number">{{ profile?.phoneNumber || '+1 234 567 890' }}</p>
                <div class="badge-pill">{{ profile?.userCode || 'CF-8892' }}</div>
            </div>

            <div class="stats-row">
                <div class="stat-box">
                    <span class="stat-num">{{ myPosts.length || '124' }}</span>
                    <span class="stat-label">ПОСТЫ</span>
                </div>
                <div class="stat-box">
                    <span class="stat-num">{{ likedPosts.length || '1.2k' }}</span>
                    <span class="stat-label">ЛАЙКИ</span>
                </div>
            </div>

            <div class="action-row">
                <button class="btn-dark" @click="router.push('/user/profile/edit')">Редактировать профиль</button>
                <button class="btn-blue">Поделиться профилем</button>
            </div>
        </header>

        <!-- Tabs -->
        <nav class="tabs-nav">
            <button class="tab-btn" :class="{ active: activeTab === 'posts' }"
                @click="activeTab = 'posts'">Посты</button>
            <button class="tab-btn" :class="{ active: activeTab === 'likes' }"
                @click="activeTab = 'likes'">Лайки</button>
        </nav>

        <!-- Body / Feed -->
        <section class="feed-section">
            <div v-if="!displayPosts.length && !loading" class="empty-feed">
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
                <span class="empty-subtext">Здесь появятся ваши публикации.</span>
            </div>

            <div v-for="post in displayPosts" :key="post.id" class="post-card">
                <div class="post-header">
                    <NuxtLink
                        :to="(post.author?.id === profile?.id || !post.author?.id) ? '/user/me' : '/user/profile/' + post.author?.id"
                        class="author-info author-link">
                        <div class="author-avatar">
                            <img v-if="post.author?.profilePhotoUrl || profile?.profilePhotoUrl"
                                :src="(post.author?.profilePhotoUrl || profile?.profilePhotoUrl) ?? undefined"
                                alt="Avatar" />
                            <div v-else class="avatar-placeholder-small">
                                {{ (post.author?.name || profile?.name)?.charAt(0).toUpperCase() || 'U' }}
                            </div>
                        </div>
                        <div class="author-details">
                            <div class="author-name-row">
                                <span class="author-name">{{ post.author?.name || profile?.name }} {{
                                    post.author?.lastName || profile?.lastName }}</span>
                            </div>
                            <span class="post-meta">{{ formatDate(post.createAt || post.createdAt) }} • {{
                                post.branch?.name || 'Главный хаб' }}</span>
                        </div>
                    </NuxtLink>
                    <button class="more-options-btn" @click.prevent="deletePost(post.id)">
                        <!-- three vertical dots -->
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <circle cx="12" cy="5" r="1.5" />
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="12" cy="19" r="1.5" />
                        </svg>
                    </button>
                </div>

                <div class="post-content">
                    <p class="post-text">{{ post.content }}</p>
                </div>

                <div v-if="post.price" class="post-price-row">
                    <span class="price-label">Цена:</span>
                    <span class="price-amount">${{ post.price.toLocaleString() }}</span>
                </div>

                <div v-if="post.imageUrl" class="post-media-container">
                    <img :src="post.imageUrl ?? undefined" alt="Cargo" class="post-image" loading="lazy" />
                </div>

                <div class="post-footer">
                    <div class="main-actions">
                        <button class="footer-action-btn" :class="{ active: post.isLikedByMe }"
                            @click="toggleLike(post.id)">
                            <svg width="20" height="20" viewBox="0 0 24 24"
                                :fill="post.isLikedByMe ? 'currentColor' : 'none'" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            <span class="action-num">{{ post.likesCount }}</span>
                        </button>
                        <button class="footer-action-btn" @click="loadComments(post.id)">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                            <span class="action-num">{{ post.commentsCount }}</span>
                        </button>
                    </div>
                </div>

                <!-- Comments Area (Threads Style) -->
                <div v-if="expandedComments.has(post.id)" class="comments-area">
                    <div v-if="post.comments?.length" class="comments-list">
                        <div v-for="(comment, idx) in post.comments" :key="comment.id" class="comment-item">
                            <div class="thread-column">
                                <NuxtLink v-if="comment.author?.id"
                                    :to="(comment.author.id === profile?.id) ? '/user/me' : '/user/profile/' + comment.author.id"
                                    class="comment-avatar-link">
                                    <div class="comment-avatar">
                                        {{ (comment.author?.name || 'U').charAt(0).toUpperCase() }}
                                    </div>
                                </NuxtLink>
                                <div v-else class="comment-avatar">
                                    {{ (comment.author?.name || 'U').charAt(0).toUpperCase() }}
                                </div>
                                <div v-if="idx !== post.comments.length - 1" class="thread-line"></div>
                            </div>
                            <div class="comment-body">
                                <div class="comment-header">
                                    <NuxtLink v-if="comment.author?.id"
                                        :to="(comment.author.id === profile?.id) ? '/user/me' : '/user/profile/' + comment.author.id"
                                        class="comment-user-link">
                                        {{ comment.author?.name }}
                                    </NuxtLink>
                                    <span v-else class="comment-user">{{ comment.author?.name }}</span>
                                </div>
                                <p class="comment-text">{{ comment.content }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="comment-input-row">
                        <div class="user-avatar-tiny">
                            <img v-if="profile?.profilePhotoUrl" :src="profile.profilePhotoUrl ?? undefined"
                                alt="Avatar" />
                            <div v-else class="avatar-placeholder-tiny">
                                {{ profile?.name?.charAt(0).toUpperCase() || 'U' }}
                            </div>
                        </div>
                        <div class="comment-input-box">
                            <input v-model="commentText[post.id]" placeholder="Написать ответ..."
                                @keyup.enter="submitComment(post.id)" />
                            <button @click="submitComment(post.id)" class="send-comment-btn"
                                :disabled="!commentText[post.id]?.trim()">
                                Опубликовать
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

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

.avatar-center {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    /* Removed the orange ring */
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
    flex: 1;
    background-color: #121212;
    border-radius: 16px;
    padding: 12px 0;
    /* Reduced padding to lower height */
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

.action-row {
    display: flex;
    gap: 12px;
}

.btn-dark {
    flex: 1;
    background-color: #18181b;
    color: #ffffff;
    height: 44px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
}

.btn-blue {
    flex: 1;
    background-color: #2563eb;
    color: #ffffff;
    height: 44px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
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

/* Post Card exact copy from index.vue */
.post-card {
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 12px;
    margin-bottom: 16px;
    overflow: hidden;
}

.post-header {
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.author-info {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
}

.author-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
}

.author-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-placeholder-small {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #2563eb, #1e40af);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
}

.author-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.author-name-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 2px;
}

.author-name {
    font-size: 15px;
    font-weight: 700;
    color: white;
    line-height: 1.2;
}

.post-meta {
    font-size: 13px;
    color: #8b949e;
    line-height: 1.2;
}

.post-price-row {
    padding: 0 16px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.price-label {
    font-size: 13px;
    color: #8b949e;
    font-weight: 600;
}

.price-amount {
    font-size: 16px;
    font-weight: 800;
    color: #10b981;
}

.more-options-btn {
    background: none;
    border: none;
    color: #8b949e;
    cursor: pointer;
    padding: 4px;
}

.post-content {
    padding: 0 16px 16px;
}

.post-title {
    font-size: 17px;
    font-weight: 800;
    color: white;
    margin: 0 0 8px;
}

.post-text {
    font-size: 14px;
    line-height: 1.5;
    color: #8b949e;
    margin: 0;
}

.post-media-container {
    position: relative;
    width: 100%;
}

.post-image {
    width: 100%;
    display: block;
}

.post-footer {
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.main-actions {
    display: flex;
    gap: 16px;
}

.footer-action-btn {
    background: none;
    border: none;
    color: #8b949e;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    transition: color 0.2s;
}

.footer-action-btn:hover {
    color: white;
}

.footer-action-btn.active {
    color: #ef4444;
}

.footer-action-btn.active svg {
    fill: #ef4444;
    stroke: #ef4444;
}

.action-num {
    font-size: 13px;
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
    background-color: rgba(24, 24, 27, 0.85);
    /* #18181b with opacity */
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

/* Threads Style Comments */
.comments-area {
    padding: 16px;
    border-top: 1px solid #30363d;
    background-color: transparent;
}

.comments-list {
    margin-bottom: 20px;
}

.comment-item {
    display: flex;
    gap: 12px;
    margin-bottom: 0;
}

.thread-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 32px;
}

.comment-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #30363d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
    z-index: 1;
}

.comment-avatar-link {
    text-decoration: none;
}

.thread-line {
    width: 2px;
    background-color: #30363d;
    flex-grow: 1;
    margin: 4px 0;
}

.comment-body {
    flex: 1;
    padding-bottom: 20px;
}

.comment-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
}

.comment-user-link,
.comment-user {
    font-weight: 700;
    font-size: 15px;
    color: white;
    text-decoration: none;
}

.comment-user-link:hover {
    text-decoration: underline;
}

.comment-time {
    font-size: 14px;
    color: #8b949e;
}

.comment-text {
    color: #e6edf3;
    font-size: 14px;
    line-height: 1.4;
    margin: 0;
}

.comment-input-row {
    display: flex;
    gap: 12px;
    align-items: center;
}

.user-avatar-tiny {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #30363d;
    flex-shrink: 0;
}

.user-avatar-tiny img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-placeholder-tiny {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #8b949e;
    font-size: 12px;
}

.comment-input-box {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #0d1117;
    border: 1px solid #30363d;
    border-radius: 20px;
    padding: 2px 4px 2px 14px;
}

.comment-input-box:focus-within {
    border-color: #8b949e;
}

.comment-input-box input {
    flex: 1;
    background: transparent;
    border: none;
    color: white;
    font-size: 14px;
    outline: none;
    padding: 8px 0;
}

.send-comment-btn {
    background: transparent;
    border: none;
    color: #2563eb;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 12px;
}

.send-comment-btn:disabled {
    color: #30363d;
    cursor: not-allowed;
}

.send-comment-btn:hover:not(:disabled) {
    color: #3b82f6;
}

.padding-bottom {
    height: 100px;
}
</style>
