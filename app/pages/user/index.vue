<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import type { Post, User } from '~/types'

definePageMeta({
    layout: 'user'
})

const api = useApi()
const toast = useToast()

const userProfile = ref<User | null>(null)
const posts = ref<Post[]>([])
const loading = ref(false)
const hasMore = ref(false)
const limit = 20

const expandedComments = ref<Set<number>>(new Set())
const commentText = ref<{ [key: number]: string }>({})

async function getPosts(isLoadMore = false) {
    if (loading.value) return
    loading.value = true

    try {
        const page = isLoadMore ? Math.floor(posts.value.length / limit) + 1 : 1
        const response = await api.feed.getFeed({ page, limit })
        const newBatch = response.data.data

        if (newBatch.length < limit) hasMore.value = false
        else hasMore.value = true

        if (isLoadMore) {
            posts.value = [...posts.value, ...newBatch]
        } else {
            posts.value = newBatch
        }
    } catch (error) {
        console.error('Feed loading error:', error)
    } finally {
        loading.value = false
    }
}

async function loadUserProfile() {
    try {
        const { data } = await api.profile.getProfile()
        userProfile.value = data
    } catch (err) {
        console.error('Profile loading error:', err)
    }
}

async function likePost(postId: number) {
    const post = posts.value.find(p => p.id === postId)
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
        toast.error('Error liking post')
    }
}

async function loadComments(postId: number) {
    if (expandedComments.value.has(postId)) {
        expandedComments.value.delete(postId)
        return
    }
    expandedComments.value.add(postId)
    const post = posts.value.find(p => p.id === postId)
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
        const post = posts.value.find(p => p.id === postId)
        if (post) {
            if (!post.comments) post.comments = []
            post.comments.unshift(data)
            post.commentsCount++
        }
        commentText.value[postId] = ''
    } catch {
        toast.error('Error posting comment')
    }
}

function formatDate(dateStr?: string) {
    if (!dateStr) return 'just now'
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return 'сейчас'
    if (diff < 3600) return Math.floor(diff / 60) + ' м'
    if (diff < 86400) return Math.floor(diff / 3600) + ' ч'
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

// Mock helpers for visual parity with mockup
function extractTitle(content: string) {
    const firstLine = content.split('\n')[0]
    return firstLine.length < 50 ? firstLine : 'Обновление груза'
}

function cleanContent(content: string) {
    const lines = content.split('\n')
    return lines.length > 1 ? lines.slice(1).join('\n') : content
}

function getStatusText(id: number) {
    const statuses = ['В пути', 'На таможне', 'Прибыл', 'Доставлен']
    return statuses[id % 4]
}

function getStatusClass(id: number) {
    const classes = ['transit', 'customs', 'arrived', 'delivered']
    return classes[id % 4]
}

function loadMore() {
    getPosts(true)
}

onMounted(() => {
    getPosts()
    loadUserProfile()
})
</script>

<template>
    <div class="cargo-feed">
        <div class="feed-container">
            <!-- Composer Card -->
            <div class="composer-card">
                <div class="composer-header">
                    <div class="user-avatar-small">
                        <img v-if="userProfile?.avatar" :src="userProfile.avatar" alt="Avatar" />
                        <div v-else class="avatar-placeholder-small">
                            {{ userProfile?.name?.charAt(0).toUpperCase() || 'U' }}
                        </div>
                    </div>
                    <div class="composer-input-box">
                        <input type="text" placeholder="Написать об обновлении груза..." readonly
                            @click="$router.push('/user/create-post')" />
                    </div>
                </div>
                <div class="composer-actions">
                    <button class="comp-action-btn" title="Image">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                    </button>
                    <button class="comp-action-btn" title="Location">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                    </button>
                    <button class="comp-action-btn" title="Value">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading && !posts.length" class="loading-inline">
                <div class="loader"></div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!posts.length" class="empty-feed">
                <div class="empty-icon">📦</div>
                <h3>Пока нет обновлений груза</h3>
            </div>

            <!-- Posts List -->
            <div v-else class="posts-list">
                <div v-for="post in posts" :key="post.id" class="post-card">
                    <div class="post-header">
                        <NuxtLink :to="'/user/profile/' + post.author?.id" class="author-info author-link">
                            <div class="author-avatar">
                                <img v-if="post.author?.avatar" :src="post.author.avatar" alt="Avatar" />
                                <div v-else class="avatar-placeholder-small">
                                    {{ post.author?.name?.charAt(0).toUpperCase() || 'U' }}
                                </div>
                            </div>
                            <div class="author-details">
                                <div class="author-name-row">
                                    <span class="author-name">{{ post.author?.name }} {{ post.author?.lastName }}</span>
                                </div>
                                <span class="post-meta">{{ formatDate(post.createAt || post.createdAt) }} • {{
                                    post.branch?.name || 'Главный хаб' }}</span>
                            </div>
                        </NuxtLink>
                    </div>

                    <div class="post-content">
                        <p class="post-text">{{ post.content }}</p>
                    </div>

                    <div v-if="post.price" class="post-price-row">
                        <span class="price-label">Цена:</span>
                        <span class="price-amount">${{ post.price.toLocaleString() }}</span>
                    </div>

                    <div v-if="post.imageUrl" class="post-media-container">
                        <img :src="post.imageUrl" alt="Cargo" class="post-image" loading="lazy" />
                    </div>

                    <div class="post-footer">
                        <div class="main-actions">
                            <button class="footer-action-btn" :class="{ active: post.isLikedByMe }"
                                @click="likePost(post.id)">
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

                    <!-- Comments Area -->
                    <div v-if="expandedComments.has(post.id)" class="comments-area">
                        <div class="comment-input-box">
                            <input v-model="commentText[post.id]" placeholder="Написать комментарий..."
                                @keyup.enter="submitComment(post.id)" />
                            <button @click="submitComment(post.id)" class="send-comment-btn"
                                :disabled="!commentText[post.id]?.trim()">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2.5">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                        <div v-if="post.comments?.length" class="comments-list">
                            <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
                                <NuxtLink v-if="comment.author?.id" :to="'/user/profile/' + comment.author.id" class="comment-avatar-link">
                                    <div class="comment-avatar">
                                        {{ comment.author?.name?.charAt(0).toUpperCase() || 'U' }}
                                    </div>
                                </NuxtLink>
                                <div class="comment-avatar" v-else>
                                    {{ comment.author?.name?.charAt(0).toUpperCase() || 'U' }}
                                </div>
                                <div class="comment-body">
                                    <NuxtLink v-if="comment.author?.id" :to="'/user/profile/' + comment.author.id" class="comment-user-link">
                                        {{ comment.author?.name }} {{ comment.author?.lastName }}
                                    </NuxtLink>
                                    <span v-else class="comment-user">{{ comment.author?.name }}:</span>
                                    <span class="comment-text">{{ comment.content }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="hasMore" class="load-more">
                    <button @click="loadMore" :disabled="loading">{{ loading ? 'Загрузка...' : 'Загрузить еще' }}</button>
                </div>
            </div>

            <div class="bottom-spacer"></div>
        </div>
    </div>
</template>

<style scoped>
.cargo-feed {
    background-color: #0d1117;
    min-height: calc(100vh - 64px);
    color: #e6edf3;
    font-family: 'Inter', -apple-system, sans-serif;
}

.feed-container {
    max-width: 680px;
    margin: 0 auto;
    padding: 16px;
}

/* Composer */
.composer-card {
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 24px;
}

.composer-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.user-avatar-small {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #30363d;
    overflow: hidden;
}

.user-avatar-small img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-placeholder-small {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #8b949e;
    font-size: 14px;
}

.composer-input-box {
    flex: 1;
}

.composer-input-box input {
    width: 100%;
    background-color: #0d1117;
    border: 1px solid #30363d;
    border-radius: 20px;
    padding: 10px 16px;
    color: #8b949e;
    cursor: pointer;
    font-size: 14px;
}

.composer-actions {
    display: flex;
    gap: 16px;
    padding-left: 48px;
}

.comp-action-btn {
    background: none;
    border: none;
    color: #2563eb;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background 0.2s;
}

.comp-action-btn:hover {
    background-color: rgba(37, 99, 235, 0.1);
}

/* Post Card */
.post-card {
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 12px;
    margin-bottom: 24px;
    overflow: hidden;
}

.post-header {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.author-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.author-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background-color: #30363d;
    overflow: hidden;
}

.author-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.author-details {
    display: flex;
    flex-direction: column;
}

.author-name-row {
    display: flex;
    align-items: center;
    gap: 4px;
}

.author-name {
    font-size: 14px;
    font-weight: 700;
    color: white;
}

.author-link {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
}

.author-link:hover .author-name {
    text-decoration: underline;
}

.post-meta {
    font-size: 12px;
    color: #8b949e;
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

.more-btn {
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


/* Comments */
.comments-area {
    padding: 12px 16px;
    border-top: 1px solid #30363d;
    background-color: #0d1117;
}

.comment-input-box {
    display: flex;
    gap: 8px;
    align-items: center;
}

.comment-input-box input {
    flex: 1;
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 8px;
    padding: 10px 12px;
    color: white;
    font-size: 13px;
    outline: none;
}

.comment-input-box input:focus {
    border-color: #2563eb;
}

.send-comment-btn {
    background: transparent;
    border: none;
    color: #2563eb;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    transition: all 0.2s;
}

.send-comment-btn:disabled {
    color: #30363d;
    cursor: not-allowed;
}

.send-comment-btn:hover:not(:disabled) {
    transform: scale(1.1) translateX(2px);
    color: #3b82f6;
}

.comments-list {
    margin-top: 12px;
}

.comment-item {
    font-size: 13px;
    margin-bottom: 6px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
}

.comment-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #1e40af);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
}

.comment-avatar-link {
    text-decoration: none;
}

.comment-body {
    flex: 1;
}

.comment-user-link {
    font-weight: 700;
    margin-right: 6px;
    color: #2563eb;
    text-decoration: none;
    font-size: 13px;
}

.comment-user-link:hover {
    text-decoration: underline;
}

.comment-text {
    color: #8b949e;
}

/* Utils */
.loading-inline {
    display: flex;
    justify-content: center;
    padding: 40px;
}

.loader {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(37, 99, 235, 0.1);
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.load-more {
    text-align: center;
    padding: 20px 0;
}

.load-more button {
    background-color: #161b22;
    border: 1px solid #30363d;
    padding: 10px 24px;
    border-radius: 8px;
    color: #2563eb;
    font-weight: 800;
    cursor: pointer;
}

.bottom-spacer {
    height: 60px;
}

.empty-feed {
    text-align: center;
    padding: 100px 0;
    color: #8b949e;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
}
</style>
