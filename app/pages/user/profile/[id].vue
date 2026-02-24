<script setup lang="ts">
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'default'
})

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
    isLiked?: boolean
    isSaved?: boolean
}

interface Profile {
    id: number
    name: string
    surname: string
    code: string
    branch: string
    phoneNumber: string
    isActive: boolean
    role: string
    createAt: string
    posts: Post[]
    postLikes: number[]
    saved: number[]
}

const route = useRoute()
const router = useRouter()
const userId = computed(() => route.params.id)
const toast = useToast()

const profile = ref<Profile | null>({
    id: 101,
    name: 'Александр',
    surname: 'Ким',
    code: 'Ai-888',
    branch: 'Алматы',
    phoneNumber: '87776665544',
    isActive: true,
    role: 'user',
    createAt: new Date().toISOString(),
    posts: [
        {
            id: 1,
            link: 'https://wildberries.ru',
            review: 'Мои новые кроссовки! Качество топ.',
            imgUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop',
            likesCount: 154,
            createAt: new Date().toISOString(),
            isLiked: false,
            isSaved: false,
            author: { id: 101, name: 'Александр', surname: 'Ким', code: 'Ai-888' },
            comments: [
                { id: 101, text: 'Круто!', createAt: new Date().toISOString(), author: { id: 102, name: 'Мария', surname: 'Иванова', code: 'Mi-123' } }
            ]
        },
        {
            id: 2,
            link: 'https://kaspi.kz',
            review: 'Чехол на айфон, пришел быстро.',
            imgUrl: null,
            likesCount: 12,
            createAt: new Date().toISOString(),
            isLiked: true,
            isSaved: false,
            author: { id: 101, name: 'Александр', surname: 'Ким', code: 'Ai-888' },
            comments: []
        }
    ],
    postLikes: [],
    saved: []
})

const loading = ref(false)
const currentUser = ref<any>({
    id: 101,
    name: 'Александр',
    surname: 'Ким',
    code: 'Ai-888'
})

// Comment states
const expandedPosts = ref<Set<number>>(new Set())
const commentText = ref<{ [key: number]: string }>({})
const sendingComment = ref<{ [key: number]: boolean }>({})

const activeTab = ref<'posts' | 'likes' | 'saved'>('posts')

// Toggle comments expansion
function toggleComments(postId: number) {
    if (expandedPosts.value.has(postId)) {
        expandedPosts.value.delete(postId)
    } else {
        expandedPosts.value.add(postId)
        if (!commentText.value[postId]) {
            commentText.value[postId] = ''
        }
    }
}

// Send comment
async function sendComment(postId: number) {
    const text = commentText.value[postId]?.trim()
    if (!text) return

    sendingComment.value[postId] = true
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 400))
    
    const post = posts.value.find(p => p.id === postId)
    if (post) {
        if (!post.comments) post.comments = []
        post.comments.push({
            id: Date.now(),
            text: text,
            createAt: new Date().toISOString(),
            author: {
                id: currentUser.value?.id || 0,
                name: currentUser.value?.name || '',
                surname: currentUser.value?.surname || '',
                code: currentUser.value?.code || ''
            }
        })
    }
    
    commentText.value[postId] = ''
    sendingComment.value[postId] = false
    toast.success('Комментарий добавлен')
}

function formatDate(date: string) {
    const postDate = new Date(date)
    return postDate.toLocaleDateString('ru-RU')
}

function formatTime(date: string) {
    return new Date(date).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

async function likePost(postId: number) {
    const post = posts.value.find(p => p.id === postId)
    if (!post) return
    
    post.isLiked = !post.isLiked
    post.likesCount = post.isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1)
}

function goBack() {
    router.back()
}

const posts = computed(() => profile.value?.posts || [])

onMounted(() => {
    // Mock data ready
})
</script>

<template>
    <div class="profile-page">
        <!-- Loading -->
        <div v-if="loading" class="loading">
            <div class="spinner"></div>
        </div>

        <div v-else-if="profile" class="profile-content">

            <!-- Profile Header -->
            <div class="profile-header">
                <div class="profile-left">
                    <h1 class="profile-name">{{ profile.name }} {{ profile.surname }}</h1>
                </div>
                <div class="profile-avatar">
                    {{ profile.name?.charAt(0).toUpperCase() || 'U' }}
                </div>
            </div>

            <!-- Stats Row -->
            <div class="profile-stats">
                <span class="stat">{{ posts.length }} постов</span>
            </div>

            <!-- Action Button -->
            <button @click="goBack" class="back-button">← Назад</button>

            <!-- Tabs -->
            <div class="profile-tabs">
                <button class="tab active">Посты</button>
            </div>

            <!-- Tab Content -->
            <div class="tab-content">
                <div v-if="!posts.length" class="empty-state">
                    <p>Нет постов</p>
                </div>
                <div v-else class="posts-list">
                    <div v-for="post in posts" :key="post.id" class="post-item">
                        <div class="post-avatar">{{ profile.name?.charAt(0).toUpperCase() }}</div>
                        <div class="post-content">
                            <div class="post-header">
                                <div class="post-avatar">{{ post.author?.name?.charAt(0).toUpperCase() || 'U' }}</div>
                                <div class="post-user-info">
                                    <span class="post-name">{{ post.author?.name }} {{ post.author?.surname }}</span>
                                    <span class="post-time">{{ formatDate(post.createAt) }}</span>
                                </div>
                            </div>
                            <div v-if="post.imgUrl" class="post-image">
                                <img :src="post.imgUrl" :alt="post.review" loading="lazy">
                            </div>
                            <p class="post-text">{{ post.review }}</p>
                            <a v-if="post.link"
                                :href="post.link.startsWith('http') ? post.link : 'https://' + post.link"
                                target="_blank" class="post-link">
                                🔗 {{ post.link }}
                            </a>
                            <div class="post-actions">
                                <button class="action-btn" @click="likePost(post.id)">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path
                                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                    <span>{{ post.likesCount }}</span>
                                </button>
                                <button class="action-btn" @click="toggleComments(post.id)">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path
                                            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                    </svg>
                                </button>
                            </div>

                            <!-- Inline Comments -->
                            <div v-if="expandedPosts.has(post.id)" class="comments-section">
                                <div class="comment-input-row">
                                    <div class="comment-avatar">{{ currentUser?.name?.charAt(0).toUpperCase() || 'U' }}
                                    </div>
                                    <input v-model="commentText[post.id]" @keyup.enter="sendComment(post.id)"
                                        type="text" placeholder="Оставьте комментарий..." class="comment-input" />
                                    <button @click="sendComment(post.id)"
                                        :disabled="!commentText[post.id]?.trim() || sendingComment[post.id]"
                                        class="comment-submit">
                                        {{ sendingComment[post.id] ? '...' : 'Отправить' }}
                                    </button>
                                </div>
                                <div v-if="post.comments?.length" class="comments-list">
                                    <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
                                        <div class="comment-avatar small">{{
                                            comment.author?.name?.charAt(0).toUpperCase() || 'U' }}</div>
                                        <div class="comment-content">
                                            <div class="comment-header-small">
                                                <span class="comment-author-name">@{{ comment.author?.name || 'user'
                                                    }}</span>
                                                <span class="comment-time">{{ formatTime(comment.createAt) }}</span>
                                            </div>
                                            <p class="comment-text-small">{{ comment.text }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="no-comments">
                                    <p>Комментариев пока нет</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error -->
        <div v-else class="empty-state">
            <span class="empty-icon">😕</span>
            <h3>Профиль не найден</h3>
            <button @click="goBack" class="btn">← Назад</button>
        </div>
    </div>
</template>

<style scoped>
.profile-page {
    padding: 8px 0;
}

.loading {
    display: flex;
    justify-content: center;
    padding: 60px 0;
}

.spinner {
    width: 24px;
    height: 24px;
    border: 2px solid #333;
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.profile-content {}

/* Header */
.profile-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.profile-left {
    flex: 1;
}

.profile-name {
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 2px;
}

.profile-username {
    font-size: 15px;
    color: #ccc;
    margin: 0;
}

.profile-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 600;
    color: #fff;
    flex-shrink: 0;
}

/* Stats */
.profile-stats {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 16px;
}

.stat {
    font-size: 15px;
    color: #ccc;
}

/* Back Button */
.back-button {
    width: 100%;
    padding: 14px;
    background: transparent;
    border: 1px solid #333;
    border-radius: 12px;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 24px;
}

.back-button:hover {
    background: #111;
}

/* Tabs */
.profile-tabs {
    display: flex;
    border-bottom: 1px solid #222;
    margin-bottom: 0;
}

.tab {
    flex: 1;
    padding: 16px 0;
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    color: #bbb;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
}

.tab.active {
    color: #fff;
    border-bottom-color: #fff;
}

/* Tab Content */
.tab-content {
    min-height: 200px;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
}

.empty-icon {
    font-size: 48px;
    display: block;
    margin-bottom: 16px;
}

.empty-state h3 {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 8px;
}

.empty-state p {
    font-size: 15px;
    color: #888;
    margin: 0;
}

.btn {
    padding: 12px 24px;
    background: #fff;
    border: none;
    border-radius: 20px;
    color: #000;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 16px;
}

/* Posts List */
.posts-list {}

.post-item {
    display: flex;
    gap: 12px;
    padding: 16px 0;
    border-bottom: 1px solid #222;
}

.post-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    flex-shrink: 0;
}

.post-content {
    flex: 1;
}

.post-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.post-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
    flex-shrink: 0;
    border: 2px solid #333;
}

.post-user-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
}

.post-name {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
}

.post-time {
    font-size: 14px;
    color: #737373;
}

.post-text {
    font-size: 15px;
    color: #fff;
    line-height: 1.4;
    margin: 0 0 12px;
}

.post-link {
    display: inline-block;
    font-size: 14px;
    color: #7dd3fc;
    text-decoration: none;
    margin-bottom: 12px;
    font-weight: 500;
}

.post-link:hover {
    text-decoration: underline;
    color: #fff;
}

.post-image {
    margin-bottom: 12px;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #262626;
}

.post-image img {
    width: 100%;
    max-height: 600px;
    object-fit: contain;
    display: block;
    background: #000;
}

/* Comments Section (Inline) */
.comments-section {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #262626;
}

.comment-input-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    border-bottom: 1px solid #222;
    padding-bottom: 12px;
}

.comment-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #333, #555);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    color: #888;
    flex-shrink: 0;
}

.comment-avatar.small {
    width: 28px;
    height: 28px;
    font-size: 11px;
    background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
    color: #fff;
    border: 1px solid #333;
}

.comment-input {
    flex: 1;
    height: 40px;
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-size: 14px;
}

.comment-input::placeholder {
    color: #555;
}

.comment-submit {
    padding: 8px 16px;
    background: transparent;
    border: 1px solid #333;
    border-radius: 20px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.comment-submit:hover:not(:disabled) {
    background: #fff;
    color: #000;
}

.comment-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.comment-item {
    display: flex;
    gap: 10px;
}

.comment-avatar-small {
    display: none;
}

/* Replaced by .comment-avatar.small */

.comment-header-small {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
}

.comment-author-name {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
}

.comment-time {
    font-size: 13px;
    color: #555;
}

.comment-text-small {
    font-size: 14px;
    color: #ccc;
    line-height: 1.4;
    margin: 0;
}

.no-comments {
    padding: 20px 0;
    text-align: center;
}

.no-comments p {
    font-size: 14px;
    color: #555;
    margin: 0;
}

.post-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 12px;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 0;
    background: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.action-btn:hover {
    opacity: 0.7;
}

.action-btn svg {
    width: 24px;
    height: 24px;
}
</style>
