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
    imgUrl?: string
    likesCount: number
    isLiked?: boolean
    isSaved?: boolean
    createAt: string
    author?: Author
    comments?: Comment[]
    commentsCount?: number
}

interface UserProfile {
    id: number
    phoneNumber: string
    name: string
    surname: string
    code: string
    isActive: boolean
}

const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()
const router = useRouter()

const userProfile = ref<UserProfile | null>({
    id: 1,
    name: 'Пользователь',
    surname: 'Ai-Market',
    code: 'Ai-123',
    phoneNumber: '87776665544',
    isActive: true
})
const isLoggedIn = computed(() => true)

const posts = ref<Post[]>([
    {
        id: 1,
        link: 'https://wildberries.ru/catalog/123/detail.aspx',
        review: 'Отличные кроссовки! Качество на высоте, оригинал. Доставили очень быстро через Ai-Cargo.',
        imgUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop',
        likesCount: 124,
        isLiked: true,
        createAt: new Date().toISOString(),
        author: { id: 101, name: 'Александр', surname: 'Ким', code: 'Ai-888' },
        comments: [
            { id: 1, text: 'Где заказывали?', createAt: new Date().toISOString(), author: { id: 102, name: 'Мария', surname: '', code: 'Ai-999' } }
        ],
        commentsCount: 1
    },
    {
        id: 2,
        link: 'https://kaspi.kz/shop/p/apple-iphone-15-pro-max-256gb-dual-sim-black-titanium-113138420/',
        review: 'Наконец-то приехал мой iPhone! В Алматы доставили за 10 дней. Упаковка целая, все супер.',
        imgUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&auto=format&fit=crop',
        likesCount: 89,
        isLiked: false,
        createAt: new Date(Date.now() - 3600000).toISOString(),
        author: { id: 103, name: 'Елена', surname: 'Ибрагимова', code: 'Ai-777' }
    },
    {
        id: 3,
        link: 'https://ozon.ru/product/robot-pylesos-mi-robot-vacuum-mop-2-lite-white-1234567/',
        review: 'Робот-пылесос Xiaomi. Очень доволен покупкой. В приложении Ai-Market удобно отслеживать посылку.',
        imgUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&auto=format&fit=crop',
        likesCount: 45,
        isLiked: false,
        createAt: new Date(Date.now() - 86400000).toISOString(),
        author: { id: 104, name: 'Даурен', surname: 'Мурат', code: 'Ai-555' }
    },
    {
        id: 4,
        link: 'https://amazon.com/dp/B08N5KWBKK',
        review: 'MacBook Air M1. Это просто космос! Самая быстрая доставка из Китая.',
        imgUrl: 'https://images.unsplash.com/photo-1611186871348-b1ec696e52c9?w=800&auto=format&fit=crop',
        likesCount: 231,
        isLiked: true,
        createAt: new Date(Date.now() - 172800000).toISOString(),
        author: { id: 105, name: 'Нурсултан', surname: 'А.', code: 'Ai-111' }
    }
])
const loading = ref(false)
const offset = ref(posts.value.length)
const limit = 20
const hasMore = ref(false)

const expandedComments = ref<Set<number>>(new Set())
const commentText = ref<{ [key: number]: string }>({})

async function getPosts(isLoadMore = false) {
    if (loading.value) return
    loading.value = true

    try {
        const response = await $axios.get('post', {
            params: { limit, offset: offset.value }
        })

        const newBatch: Post[] = Array.isArray(response.data) ? response.data : [response.data]

        if (newBatch.length < limit) hasMore.value = false

        if (isLoadMore) {
            posts.value = [...posts.value, ...newBatch]
        } else {
            posts.value = newBatch
        }

        offset.value += newBatch.length
    } catch (error) {
        if (!isLoadMore) posts.value = []
    } finally {
        loading.value = false
    }
}

async function loadMore() {
    if (hasMore.value && !loading.value) {
        await getPosts(true)
    }
}

async function likePost(postId: number) {
    const post = posts.value.find(p => p.id === postId)
    if (!post) return

    post.isLiked = !post.isLiked
    post.likesCount = post.isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1)
    
    toast.success(post.isLiked ? 'Понравилось!' : 'Удалено из лайков')
}

async function addComment(postId: number) {
    const text = commentText.value[postId]?.trim()
    if (!text) return

    const post = posts.value.find(p => p.id === postId)
    if (!post) return

    if (!post.comments) post.comments = []
    
    post.comments.push({
        id: Date.now(),
        text: text,
        createAt: new Date().toISOString(),
        author: { id: 1, name: 'Вы', surname: '(Тест)', code: 'Ai-123' }
    })
    
    post.commentsCount = (post.commentsCount || 0) + 1
    commentText.value[postId] = ""
    toast.success('Комментарий добавлен')
}

async function submitComment(postId: number) {
    const text = commentText.value[postId]?.trim()
    if (!text || !token.value) return

    const post = posts.value.find(p => p.id === postId)
    const newComment: Comment = {
        id: Date.now(),
        text: text,
        createAt: new Date().toISOString(),
        author: {
            id: userProfile.value?.id || 0,
            name: userProfile.value?.name || 'User',
            surname: userProfile.value?.surname || '',
            code: userProfile.value?.code || ''
        }
    }

    if (post) {
        if (!post.comments) post.comments = []
        post.comments.push(newComment)
    }

    commentText.value[postId] = ''

    try {
        await $axios.post('post/comment', { postId, text }, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
    } catch {
        if (post && post.comments) {
            post.comments = post.comments.filter(c => c.id !== newComment.id)
        }
    }
}

function formatDate(date: string) {
    const now = new Date()
    const postDate = new Date(date)
    const diff = Math.floor((now.getTime() - postDate.getTime()) / 1000)
    if (diff < 60) return 'сейчас'
    if (diff < 3600) return Math.floor(diff / 60) + ' мин'
    if (diff < 86400) return Math.floor(diff / 3600) + ' ч'
    return postDate.toLocaleDateString('ru-RU')
}

async function loadUserProfile() {
    if (token.value) {
        try {
            const response = await $axios.get('profile', {
                headers: { 'Authorization': `Bearer ${token.value}` }
            })
            userProfile.value = response.data
        } catch { }
    }
}

onMounted(() => {
    getPosts()
    loadUserProfile()
})
</script>

<template>
    <div class="feed">
        <div v-if="loading && !posts.length" class="loading-inline">
            <div class="spinner"></div>
        </div>

        <div v-else-if="!posts.length" class="empty-feed">
            <div class="empty-icon">📝</div>
            <h3>Нет постов</h3>
        </div>

        <div v-else class="posts">
            <div v-for="post in posts" :key="post.id" class="post-card">
                <div class="post-header">
                    <div class="post-avatar">
                        {{ post.author?.name?.charAt(0).toUpperCase() || 'U' }}
                    </div>
                    <div class="post-user-info">
                        <span class="post-name">{{ post.author?.name || 'user' }} {{ post.author?.surname || '' }}</span>
                        <span class="post-time">{{ formatDate(post.createAt) }}</span>
                    </div>
                </div>

                <div class="post-body">
                    <p class="post-text">{{ post.review }}</p>
                    <a v-if="post.link" :href="post.link.startsWith('http') ? post.link : 'https://' + post.link"
                        target="_blank" class="post-link">🔗 {{ post.link }}</a>
                </div>

                <div v-if="post.imgUrl" class="post-media">
                    <img :src="post.imgUrl" alt="Post" loading="lazy" />
                </div>

                <div class="post-actions">
                    <div class="actions-left">
                        <button class="action-btn" :class="{ liked: post.isLiked }" @click="likePost(post.id)">
                            <svg width="22" height="22" viewBox="0 0 24 24" :fill="post.isLiked ? '#ff3040' : 'none'"
                                :stroke="post.isLiked ? '#ff3040' : 'currentColor'" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            <span class="action-count">{{ post.likesCount }}</span>
                        </button>
                        <button class="action-btn" @click="toggleComments(post.id)">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                        </button>
                    </div>
                    <button class="action-btn" :class="{ saved: post.isSaved }" @click="savePost(post.id)">
                        <svg width="22" height="22" viewBox="0 0 24 24" :fill="post.isSaved ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                    </button>
                </div>

                <div v-if="expandedComments.has(post.id)" class="comments-area">
                    <div v-if="isLoggedIn" class="comment-composer">
                        <input v-model="commentText[post.id]" @keyup.enter="submitComment(post.id)" type="text"
                            placeholder="Ваш комментарий..." class="comment-field" />
                        <button @click="submitComment(post.id)" :disabled="!commentText[post.id]?.trim()" class="send-btn">
                            Отправить
                        </button>
                    </div>
                    <div v-if="post.comments?.length" class="comments-list">
                        <div v-for="comment in post.comments" :key="comment.id" class="comment-bubble">
                            <div class="bubble-header">
                                <span class="bubble-name">{{ comment.author?.name || 'user' }}</span>
                                <span class="bubble-time">{{ formatDate(comment.createAt) }}</span>
                            </div>
                            <p class="bubble-text">{{ comment.text }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="hasMore" class="pagination">
                <button @click="loadMore" class="p-btn" :disabled="loading">
                    {{ loading ? 'Загрузка...' : 'Загрузить еще' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.feed { max-width: 680px; margin: 0 auto; padding: 16px 0; }
.loading-inline { display: flex; justify-content: center; padding: 40px; }
.spinner { width: 32px; height: 32px; border: 3px solid #f3f3f7; border-top-color: #cb11ab; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.post-card { background: #fff; border-radius: 20px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eee; overflow: hidden; }
.post-header { padding: 16px; display: flex; align-items: center; gap: 12px; }
.post-avatar { width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #cb11ab, #481173); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; }
.post-name { font-weight: 700; color: #242424; display: block; }
.post-time { font-size: 12px; color: #888; }
.post-body { padding: 0 16px 16px; }
.post-text { font-size: 15px; line-height: 1.5; color: #333; margin-bottom: 8px; }
.post-link { color: #cb11ab; text-decoration: none; font-weight: 600; font-size: 14px; }
.post-media { width: 100%; border-top: 1px solid #eee; }
.post-media img { width: 100%; display: block; }
.post-actions { padding: 12px 16px; border-top: 1px solid #eee; display: flex; justify-content: space-between; }
.actions-left { display: flex; gap: 16px; }
.action-btn { background: none; border: none; color: #666; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 4px; border-radius: 8px; transition: background 0.2s; }
.action-btn:hover { background: #f5f5z7; }
.action-btn.liked { color: #ff3040; }
.action-btn.saved { color: #cb11ab; }
.comments-area { background: #fafafa; padding: 16px; border-top: 1px solid #eee; }
.comment-composer { display: flex; gap: 8px; margin-bottom: 12px; }
.comment-field { flex: 1; padding: 10px; border-radius: 10px; border: 1px solid #eee; outline: none; }
.send-btn { background: #cb11ab; color: #fff; border: none; padding: 0 16px; border-radius: 10px; cursor: pointer; font-weight: 600; }
.comment-bubble { background: #fff; padding: 10px; border-radius: 12px; margin-bottom: 8px; border: 1px solid #f0f0f0; }
.bubble-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
.bubble-name { font-weight: 700; font-size: 13px; }
.bubble-time { font-size: 11px; color: #aaa; }
.bubble-text { font-size: 14px; color: #444; margin: 0; }
.pagination { display: flex; justify-content: center; padding: 20px; }
.p-btn { padding: 10px 24px; border-radius: 12px; border: 1px solid #eee; background: #fff; cursor: pointer; font-weight: 700; }
</style>
