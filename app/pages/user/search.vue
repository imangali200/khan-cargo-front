<script setup lang="ts">
import type { Post } from '~/types'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'

definePageMeta({
    layout: 'user'
})

const api = useApi()
const toast = useToast()
const searchQuery = ref('')
const results = ref<Post[]>([])
const loading = ref(false)
const searched = ref(false)

const expandedComments = ref<Set<number>>(new Set())
const commentText = ref<{ [key: number]: string }>({})

async function searchPosts() {
    if (!searchQuery.value.trim()) {
        results.value = []
        searched.value = false
        return
    }

    loading.value = true
    searched.value = true

    try {
        const { data } = await api.feed.searchPosts(searchQuery.value.trim())
        results.value = data.data || []
    } catch (e: any) {
        results.value = []
        toast.error('Ошибка поиска')
    } finally {
        loading.value = false
    }
}

function clearSearch() {
    searchQuery.value = ''
    results.value = []
    searched.value = false
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

async function likePost(postId: number) {
    const post = results.value.find(p => p.id === postId)
    if (!post) return

    // Optimistic update
    const previousIsLiked = post.isLikedByMe
    const previousLikesCount = post.likesCount

    post.isLikedByMe = !post.isLikedByMe
    post.likesCount += post.isLikedByMe ? 1 : -1

    try {
        const res = await api.feed.toggleLike(postId)
        // Sync with backend truth
        post.isLikedByMe = res.data.liked
        post.likesCount = res.data.likesCount
    } catch {
        // Revert on error
        post.isLikedByMe = previousIsLiked
        post.likesCount = previousLikesCount
        toast.error('Ошибка')
    }
}

async function loadComments(postId: number) {
    if (expandedComments.value.has(postId)) {
        expandedComments.value.delete(postId)
        return
    }
    expandedComments.value.add(postId)
    const post = results.value.find(p => p.id === postId)
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
        const post = results.value.find(p => p.id === postId)
        if (post) {
            if (!post.comments) post.comments = []
            post.comments.unshift(data)
            post.commentsCount++
        }
        commentText.value[postId] = ''
    } catch {
        toast.error('Ошибка добавления комментария')
    }
}
</script>

<template>
    <div class="search-page">
        <div class="search-container">
            <!-- Search Header -->
            <div class="search-title-row">
                <h1>Поиск постов</h1>
            </div>
            <div class="search-header">
                <div class="search-input-box">
                    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input v-model="searchQuery" @keyup.enter="searchPosts" type="text" placeholder="Найти посты..."
                        class="search-input" autofocus />
                    <button v-if="searchQuery" @click="clearSearch" class="search-clear">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="3">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <button @click="searchPosts" class="search-submit-btn" :disabled="!searchQuery.trim() || loading">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </button>
            </div>

            <!-- Content Area -->
            <div class="content-area">
                <div v-if="loading" class="loading-state">
                    <div class="loader"></div>
                </div>

                <div v-else-if="searched" class="search-results">
                    <div v-if="results.length === 0" class="empty-results">
                        <div class="empty-icon">🔎</div>
                        <h3>Посты не найдены</h3>
                        <p>Мы не смогли найти посты с таким текстом.</p>
                    </div>

                    <div v-else class="posts-list">
                        <h2 class="section-title">Результат поиска</h2>

                        <div v-for="post in results" :key="post.id" class="post-card">
                            <div class="post-header">
                                <NuxtLink :to="'/user/profile/' + post.author?.id" class="author-info author-link">
                                    <div class="author-avatar">
                                        <img v-if="post.author?.profilePhotoUrl" :src="post.author.profilePhotoUrl"
                                            alt="Avatar" />
                                        <div v-else class="avatar-placeholder-small">
                                            {{ post.author?.name?.charAt(0).toUpperCase() || 'U' }}
                                        </div>
                                    </div>
                                    <div class="author-details">
                                        <div class="author-name-row">
                                            <span class="author-name">{{ post.author?.name }} {{ post.author?.lastName
                                                }}</span>
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
                                            :fill="post.isLikedByMe ? '#ef4444' : 'none'"
                                            :stroke="post.isLikedByMe ? '#ef4444' : 'currentColor'" stroke-width="2">
                                            <path
                                                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                        <span class="action-num">{{ post.likesCount }}</span>
                                    </button>
                                    <button class="footer-action-btn" @click="loadComments(post.id)">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
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
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2.5">
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                    </button>
                                </div>
                                <div v-if="post.comments?.length" class="comments-list">
                                    <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
                                        <NuxtLink v-if="comment.author?.id" :to="'/user/profile/' + comment.author.id"
                                            class="comment-avatar-link">
                                            <div class="comment-avatar">
                                                {{ comment.author?.name?.charAt(0).toUpperCase() || 'U' }}
                                            </div>
                                        </NuxtLink>
                                        <div class="comment-avatar" v-else>
                                            {{ comment.author?.name?.charAt(0).toUpperCase() || 'U' }}
                                        </div>
                                        <div class="comment-body">
                                            <NuxtLink v-if="comment.author?.id"
                                                :to="'/user/profile/' + comment.author.id" class="comment-user-link">
                                                {{ comment.author?.name }} {{ comment.author?.lastName }}
                                            </NuxtLink>
                                            <span v-else class="comment-user">{{ comment.author?.name }}:</span>
                                            <span class="comment-text">{{ comment.content }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Initial State -->
                <div v-else class="initial-state">
                    <div class="illustration">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#30363d" stroke-width="1">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p class="initial-hint">Введите текст для начала</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.search-page {
    background-color: #0d1117;
    min-height: calc(100vh - 64px);
    color: #e6edf3;
    padding-bottom: 80px;
    font-family: 'Inter', -apple-system, sans-serif;
}

.search-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 24px 16px;
}

.search-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.search-title-row h1 {
    font-size: 24px;
    font-weight: 800;
    color: white;
    margin: 0;
}

/* Header */
.search-header {
    display: flex;
    gap: 12px;
    margin-bottom: 32px;
}

.search-input-box {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px;
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 16px;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input-box:focus-within {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-icon {
    color: #8b949e;
    flex-shrink: 0;
}

.search-input {
    flex: 1;
    height: 52px;
    background: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 16px;
}

.search-clear {
    background: none;
    border: none;
    color: #8b949e;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
}

.search-submit-btn {
    width: 52px;
    height: 52px;
    flex-shrink: 0;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
}

.search-submit-btn:disabled {
    background-color: #30363d;
    color: #8b949e;
    cursor: not-allowed;
}

/* Results */
.section-title {
    font-size: 14px;
    font-weight: 800;
    color: #8b949e;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
    text-transform: uppercase;
}

/* Posts (Copied from feed) */
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
    color: inherit;
}

.author-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background-color: #30363d;
}

.author-avatar img {
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

.post-content {
    padding: 0 16px 16px;
}

.post-text {
    font-size: 14px;
    line-height: 1.5;
    color: #8b949e;
    margin: 0;
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

.send-comment-btn {
    background: transparent;
    border: none;
    color: #2563eb;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
}

.comments-list {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.comment-item {
    display: flex;
    gap: 8px;
}

.comment-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #30363d;
    color: #8b949e;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
}

.comment-body {
    background-color: #161b22;
    padding: 8px 12px;
    border-radius: 0 12px 12px 12px;
    font-size: 13px;
    line-height: 1.4;
    border: 1px solid #30363d;
}

.comment-user-link,
.comment-user {
    font-weight: 700;
    color: white;
    text-decoration: none;
    margin-right: 6px;
}

.comment-text {
    color: #c9d1d9;
}

/* States */
.loading-state {
    padding: 80px 0;
    display: flex;
    justify-content: center;
}

.loader {
    width: 32px;
    height: 32px;
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

.initial-state {
    text-align: center;
    padding: 100px 24px;
}

.empty-results {
    text-align: center;
    padding: 80px 24px;
}

.illustration {
    margin-bottom: 24px;
    opacity: 0.15;
    display: flex;
    justify-content: center;
}

.illustration svg {
    width: 64px;
    height: 64px;
}

.initial-hint {
    font-size: 15px;
    color: #555;
    margin-top: 16px;
}

.initial-state h3,
.empty-results h3 {
    font-size: 20px;
    font-weight: 800;
    color: white;
    margin: 0 0 12px;
}

.initial-state p,
.empty-results p {
    font-size: 15px;
    color: #8b949e;
    line-height: 1.6;
    max-width: 360px;
    margin: 0 auto;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 24px;
}
</style>
