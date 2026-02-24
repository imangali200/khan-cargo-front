<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

// ... interfaces ...

const allMockPosts = [
    {
        id: 1,
        link: 'https://wildberries.ru/catalog/123/detail.aspx',
        review: 'Отличные кроссовки! Качество на высоте, оригинал.',
        likesCount: 124,
        isLiked: true,
        createAt: new Date().toISOString(),
        author: { id: 101, name: 'Александр', surname: 'Ким', code: 'Ai-888' }
    },
    {
        id: 2,
        link: 'https://kaspi.kz/',
        review: 'Наконец-то приехал мой iPhone! В Алматы доставили за 10 дней.',
        likesCount: 89,
        isLiked: false,
        createAt: new Date().toISOString(),
        author: { id: 103, name: 'Елена', surname: 'Ибрагимова', code: 'Ai-777' }
    },
    {
        id: 3,
        link: 'https://ozon.ru/',
        review: 'Робот-пылесос Xiaomi. Очень доволен покупкой.',
        likesCount: 45,
        isLiked: false,
        createAt: new Date().toISOString(),
        author: { id: 104, name: 'Даурен', surname: 'Мурат', code: 'Ai-555' }
    }
]

const searchQuery = ref('')
const posts = ref<Post[]>([])
const loading = ref(false)
const searched = ref(false)

async function searchPosts() {
    if (!searchQuery.value.trim()) {
        posts.value = []
        searched.value = false
        return
    }
    
    loading.value = true
    searched.value = true
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 400))
    
    const query = searchQuery.value.toLowerCase()
    posts.value = allMockPosts.filter(p => 
        p.review.toLowerCase().includes(query) || 
        p.author.name.toLowerCase().includes(query)
    )
    
    loading.value = false
}

async function likePost(postId: number) {
    const post = posts.value.find(p => p.id === postId)
    if (!post) return
    post.isLiked = !post.isLiked
    post.likesCount = post.isLiked ? post.likesCount + 1 : post.likesCount - 1
}

function formatDate(date: string) {
    const now = new Date()
    const postDate = new Date(date)
    const diff = Math.floor((now.getTime() - postDate.getTime()) / 1000)
    
    if (diff < 60) return 'только что'
    if (diff < 3600) return Math.floor(diff / 60) + ' мин.'
    if (diff < 86400) return Math.floor(diff / 3600) + ' ч.'
    if (diff < 604800) return Math.floor(diff / 86400) + ' дн.'
    return postDate.toLocaleDateString('ru-RU')
}

function goToProfile(authorId: number | undefined) {
    if (authorId) router.push('/user/profile/' + authorId)
}

function clearSearch() {
    searchQuery.value = ''
    posts.value = []
    searched.value = false
}
</script>

<template>
    <div class="search-page">
        <!-- Search Header -->
        <div class="search-header">
            <div class="search-input-wrapper">
                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input 
                    v-model="searchQuery" 
                    @keyup.enter="searchPosts" 
                    type="text" 
                    placeholder="Поиск постов..." 
                    class="search-input"
                    autofocus
                />
                <button v-if="searchQuery" @click="clearSearch" class="search-clear">✕</button>
            </div>
            <button @click="searchPosts" class="search-btn" :disabled="!searchQuery.trim()">Найти</button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading">
            <div class="spinner"></div>
        </div>

        <!-- Results -->
        <div v-else-if="searched" class="search-results">
            <div v-if="!posts.length" class="empty">
                <div class="empty-icon">🔍</div>
                <h3>Ничего не найдено</h3>
                <p>Попробуйте изменить запрос</p>
            </div>

            <div v-else>
                <p class="results-count">Найдено: {{ posts.length }}</p>
                
                <div class="posts-list">
                    <div v-for="post in posts" :key="post.id" class="post-item">
                        <div class="post-avatar" @click="goToProfile(post.author?.id)">
                            {{ post.author?.name?.charAt(0).toUpperCase() || 'U' }}
                        </div>
                        <div class="post-content">
                            <div class="post-header" @click="goToProfile(post.author?.id)">
                                <span class="post-author">{{ post.author?.name || 'User' }}</span>
                                <span class="post-time">{{ formatDate(post.createAt) }}</span>
                            </div>
                            <p class="post-text">{{ post.review }}</p>
                            <a v-if="post.link" :href="post.link.startsWith('http') ? post.link : 'https://' + post.link" target="_blank" class="post-link">
                                🔗 {{ post.link }}
                            </a>
                            <div class="post-actions">
                                <button class="action-btn" :class="{ liked: post.isLiked }" @click="likePost(post.id)">
                                    {{ post.isLiked ? '❤️' : '♡' }} {{ post.likesCount }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Initial State -->
        <div v-else class="initial-state">
            <div class="initial-icon">🔍</div>
            <h3>Поиск постов</h3>
            <p>Введите текст для поиска</p>
        </div>
    </div>
</template>

<style scoped>
.search-page { padding: 16px 0; }

.search-header { display: flex; gap: 12px; margin-bottom: 20px; }
.search-input-wrapper { flex: 1; display: flex; align-items: center; gap: 12px; padding: 0 16px; background: #111; border: 1px solid #333; border-radius: 12px; }
.search-icon { color: #555; flex-shrink: 0; }
.search-input { flex: 1; height: 48px; background: transparent; border: none; outline: none; color: #fff; font-size: 16px; }
.search-input::placeholder { color: #555; }
.search-clear { background: transparent; border: none; color: #555; cursor: pointer; padding: 8px; font-size: 16px; }
.search-btn { padding: 0 20px; background: #fff; border: none; border-radius: 12px; color: #000; font-size: 15px; font-weight: 600; cursor: pointer; }
.search-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.search-btn:hover:not(:disabled) { background: #e5e5e5; }

.loading { display: flex; justify-content: center; padding: 60px 0; }
.spinner { width: 24px; height: 24px; border: 2px solid #333; border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty, .initial-state { text-align: center; padding: 80px 20px; }
.empty-icon, .initial-icon { font-size: 64px; margin-bottom: 20px; }
.empty h3, .initial-state h3 { font-size: 20px; font-weight: 600; color: #fff; margin: 0 0 8px; }
.empty p, .initial-state p { font-size: 15px; color: #666; margin: 0; }

.results-count { font-size: 14px; color: #666; margin-bottom: 16px; }

.posts-list { display: flex; flex-direction: column; }
.post-item { display: flex; gap: 12px; padding: 16px 0; border-bottom: 1px solid #222; }
.post-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; color: #fff; flex-shrink: 0; cursor: pointer; }
.post-content { flex: 1; }
.post-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; cursor: pointer; }
.post-author { font-size: 15px; font-weight: 600; color: #fff; }
.post-time { font-size: 14px; color: #555; }
.post-text { font-size: 15px; color: #fff; line-height: 1.5; margin: 0 0 8px; white-space: pre-wrap; }
.post-link { display: inline-block; font-size: 14px; color: #1d9bf0; text-decoration: none; margin-bottom: 12px; }
.post-link:hover { text-decoration: underline; }
.post-actions { display: flex; gap: 16px; margin-top: 8px; }
.action-btn { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: transparent; border: none; color: #666; cursor: pointer; border-radius: 20px; font-size: 14px; }
.action-btn:hover { background: #111; color: #fff; }
.action-btn.liked { color: #f91880; }
</style>
