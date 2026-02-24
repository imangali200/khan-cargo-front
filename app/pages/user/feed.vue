<script setup lang="ts">
definePageMeta({
    layout: 'post'
})

interface Author {
    id: number;
    name: string;
    surname: string;
    code: string;
    phoneNumber: string;
}

interface Comment {
    id: number;
    text: string;
    createAt: string;
    author?: Author;
}

interface Post {
    id: number;
    link: string;
    review: string;
    imgUrl?: string;
    likesCount: number;
    isLiked: boolean;
    createAt: string;
    author: Author;
    comments?: Comment[];
}

const posts = ref<Post[]>([
    {
        id: 1,
        link: 'https://wildberries.ru/catalog/123/detail.aspx',
        review: 'Эти кроссовки просто огонь! 🔥 Заказал через Ai-Cargo, приехали за неделю.',
        imgUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop',
        likesCount: 1240,
        isLiked: true,
        createAt: new Date().toISOString(),
        author: { id: 101, name: 'Александр', surname: 'Ким', code: 'Ai-123', phoneNumber: '' },
        comments: [
            { id: 1, text: 'Где брал?', createAt: new Date().toISOString(), author: { id: 102, name: 'Мария', surname: '', code: 'Ai-999', phoneNumber: '' } }
        ]
    },
    {
        id: 2,
        link: 'https://amazon.com',
        review: 'Новый iPhone 15 Pro. Камера просто нереальная. Доставка в Алматы очень быстрая.',
        imgUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&auto=format&fit=crop',
        likesCount: 850,
        isLiked: false,
        createAt: new Date().toISOString(),
        author: { id: 103, name: 'Дамир', surname: 'С.', code: 'Ai-777', phoneNumber: '' },
        comments: []
    },
    {
        id: 3,
        link: 'https://ozon.ru',
        review: 'Клавиатура Keychron. Тайпинг одно удовольствие! Рекомендую всем.',
        imgUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop',
        likesCount: 420,
        isLiked: false,
        createAt: new Date().toISOString(),
        author: { id: 104, name: 'Анна', surname: 'Ли', code: 'Ai-555', phoneNumber: '' }
    }
])

const loading = ref(false)
const currentUser = ref<Author | null>({ id: 1, name: 'Вы', surname: '(Тест)', code: 'Ai-123', phoneNumber: '' })
const feedMode = ref<'trending' | 'recent'>('trending')
const showComments = ref(false)
const newComment = ref('')
const activePostId = ref<number | null>(null)
const sendingComment = ref(false)

const sortedPosts = computed(() => {
    if (feedMode.value === 'trending') {
        return [...posts.value].sort((a, b) => b.likesCount - a.likesCount)
    }
    return [...posts.value].sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime())
})

const activePost = computed(() => {
    return posts.value.find(p => p.id === activePostId.value) || null
})

function goBack() {
    useRouter().back()
}

function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

function formatTime(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function goToUserProfile(userId?: number) {
    if (userId) useRouter().push(`/user/profile/${userId}`)
}

function goToCommentAuthorProfile(userId: number) {
    useRouter().push(`/user/profile/${userId}`)
}

function openComments(postId: number) {
    activePostId.value = postId
    showComments.value = true
}

function closeComments() {
    showComments.value = false
    activePostId.value = null
}

function savePost(postId: number) {
    console.log('Post saved:', postId)
}

async function likePost(postId: string) {
    const post = posts.value.find(p => p.id === Number(postId))
    if (!post) return
    post.isLiked = !post.isLiked
    post.likesCount = post.isLiked ? post.likesCount + 1 : post.likesCount - 1
}

async function sendComment() {
    if (!newComment.value.trim() || !activePostId.value) return
    sendingComment.value = true
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const post = posts.value.find(p => p.id === activePostId.value)
    if (post) {
        if (!post.comments) post.comments = []
        post.comments.push({
            id: Date.now(),
            text: newComment.value.trim(),
            createAt: new Date().toISOString(),
            author: currentUser.value || undefined
        })
    }
    newComment.value = ''
    sendingComment.value = false
}

onMounted(() => {
    // Mock data already initialized
})
</script>

<template>
    <!-- Full screen container -->
    <div class="tw-h-screen tw-overflow-hidden tw-bg-black tw-fixed tw-inset-0 tw-z-10">
        <!-- Loading -->
        <div v-if="loading" class="tw-h-full tw-flex tw-items-center tw-justify-center">
            <div class="tw-text-center">
                <div
                    class="tw-inline-block tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-4 tw-border-white tw-border-t-transparent">
                </div>
                <p class="tw-mt-4 tw-text-white">Загрузка...</p>
            </div>
        </div>

        <!-- Fixed Header with Tabs - Always visible when not loading -->
        <div v-if="!loading"
            class="tw-fixed tw-top-0 tw-left-0 tw-right-0 tw-z-30 tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-4">
            <!-- Back button -->
            <button @click="goBack"
                class="tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-white tw-text-lg hover:tw-scale-110 tw-transition-transform"
                style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);">
                ←
            </button>

            <!-- Feed Mode Tabs - TikTok style -->
            <div class="tw-flex tw-gap-6"
                style="background: rgba(0,0,0,0.3); backdrop-filter: blur(10px); padding: 8px 16px; border-radius: 20px;">
                <button @click="feedMode = 'trending'" :class="[
                    'tw-text-base tw-font-bold tw-transition-all tw-pb-1',
                    feedMode === 'trending'
                        ? 'tw-text-white tw-border-b-2 tw-border-white'
                        : 'tw-text-white/50'
                ]">
                    🔥 Рек
                </button>
                <button @click="feedMode = 'recent'" :class="[
                    'tw-text-base tw-font-bold tw-transition-all tw-pb-1',
                    feedMode === 'recent'
                        ? 'tw-text-white tw-border-b-2 tw-border-white'
                        : 'tw-text-white/50'
                ]">
                    🕐 Жаңа
                </button>
            </div>

            <!-- Spacer for balance -->
            <div class="tw-w-10"></div>
        </div>

        <!-- Empty state -->
        <div v-if="!loading && (!sortedPosts || !sortedPosts.length)" class="tw-h-full tw-flex tw-items-center tw-justify-center">
            <div class="tw-text-center">
                <div class="tw-text-6xl tw-mb-4">📝</div>
                <h3 class="tw-text-xl tw-font-bold tw-text-white tw-mb-2">Пост жоқ</h3>
                <p class="tw-text-gray-400 tw-mb-6">Бірінші болып пост жасаңыз!</p>
                <button @click="goBack"
                    class="tw-bg-[#0891B2] tw-text-white tw-px-6 tw-py-3 tw-rounded-xl tw-font-medium hover:tw-bg-[#0e7490] tw-transition-colors">
                    ← Артқа
                </button>
            </div>
        </div>

        <!-- Posts Feed (TikTok style) -->
        <div v-if="!loading && sortedPosts && sortedPosts.length" class="tw-h-full tw-overflow-y-scroll tw-snap-y tw-snap-mandatory"
            style="scroll-snap-type: y mandatory; -webkit-overflow-scrolling: touch;">
            <div v-for="(post, index) in sortedPosts" :key="post.id + '-' + feedMode" :id="`post-${index}`"
                class="tw-h-full tw-snap-start tw-snap-always tw-relative tw-flex tw-items-end tw-justify-center"
                style="scroll-snap-align: start; min-height: 100vh;">
                <!-- Background Image or Gradient - FULL SCREEN -->
                <div v-if="post.imgUrl" class="tw-absolute tw-inset-0">
                    <img :src="post.imgUrl" alt="Post" class="tw-w-full tw-h-full tw-object-cover" />
                    <div
                        class="tw-absolute tw-inset-0 tw-bg-gradient-to-t tw-from-black tw-via-transparent tw-to-black/50">
                    </div>
                </div>
                <div v-else class="tw-absolute tw-inset-0"
                    :style="`background: linear-gradient(135deg, hsl(${(post.id * 40) % 360}, 60%, 25%), hsl(${(post.id * 40 + 60) % 360}, 60%, 15%));`">
                </div>

                <!-- Content - Centered on desktop -->
                <div class="tw-relative tw-z-10 tw-w-full tw-max-w-2xl tw-px-5 tw-pb-8 tw-pr-20">
                    <!-- Author Info (clickable) -->
                    <div class="tw-flex tw-items-center tw-gap-3 tw-mb-4 tw-cursor-pointer group"
                        @click.stop="goToUserProfile(post.author?.id)">
                        <!-- Avatar with gradient border -->
                        <div class="tw-relative">
                            <div class="tw-w-12 tw-h-12 tw-rounded-full tw-p-[2px] group-hover:tw-scale-105 tw-transition-transform"
                                style="background: linear-gradient(135deg, #EC4899, #8B5CF6, #0EA5E9);">
                                <div class="tw-w-full tw-h-full tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-lg tw-font-bold tw-text-white"
                                    style="background: rgba(0,0,0,0.5);">
                                    {{ post.author?.name?.charAt(0).toUpperCase() || 'U' }}
                                </div>
                            </div>
                        </div>
                        <p class="tw-text-white tw-font-semibold group-hover:tw-underline">
                            {{ post.author?.name }} {{ post.author?.surname }}
                        </p>
                        <p class="tw-text-white/70 tw-text-xs">{{ formatDate(post.createAt) }}</p>
                    </div>

                    <!-- Review -->
                    <div class="tw-mb-3">
                        <p class="tw-text-white tw-text-base tw-leading-relaxed">
                            {{ post.review }}
                        </p>
                    </div>

                    <!-- Link -->
                    <div v-if="post.link">
                        <a :href="post.link.startsWith('http') ? post.link : `https://${post.link}`" target="_blank"
                            class="tw-inline-flex tw-items-center tw-gap-1 tw-text-[#38BDF8] tw-text-sm hover:tw-underline">
                            🔗 {{ post.link }}
                        </a>
                    </div>
                </div>

                <!-- Right Side Actions -->
                <div class="tw-absolute tw-right-4 tw-bottom-8 tw-flex tw-flex-col tw-items-center tw-gap-5 tw-z-10">
                    <!-- Like -->
                    <button @click="likePost(String(post.id))"
                        class="tw-flex tw-flex-col tw-items-center tw-gap-1 group">
                        <div class="tw-w-12 tw-h-12 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-2xl group-hover:tw-scale-110 tw-transition-all"
                            :style="post.isLiked ? 'background: rgba(239,68,68,0.3); backdrop-filter: blur(10px);' : 'background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);'">
                            {{ post.isLiked ? '❤️' : '🤍' }}
                        </div>
                        <span class="tw-text-white tw-text-xs tw-font-medium">{{ post.likesCount }}</span>
                    </button>

                    <!-- Comments -->
                    <button @click="openComments(post.id)" class="tw-flex tw-flex-col tw-items-center tw-gap-1 group">
                        <div class="tw-w-12 tw-h-12 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-2xl group-hover:tw-scale-110 tw-transition-all"
                            style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);">
                            💬
                        </div>
                        <span class="tw-text-white tw-text-xs tw-font-medium">{{ post.comments?.length || 0 }}</span>
                    </button>

                    <!-- Save -->
                    <button @click="savePost(post.id)" class="tw-flex tw-flex-col tw-items-center tw-gap-1 group">
                        <div class="tw-w-12 tw-h-12 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-2xl group-hover:tw-scale-110 tw-transition-all"
                            style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);">
                            🔖
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Comments Panel -->
        <Teleport to="body">
            <div v-if="showComments" class="tw-fixed tw-inset-0 tw-z-[100]">
                <!-- Overlay -->
                <div class="tw-absolute tw-inset-0 tw-bg-black/60" @click="closeComments"></div>

                <!-- Panel -->
                <div class="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-bg-white tw-h-[85vh] tw-flex tw-flex-col"
                    style="border-radius: 24px 24px 0 0; animation: slideUp 0.3s ease-out;">
                    <!-- Header -->
                    <div
                        class="tw-flex tw-items-center tw-justify-between tw-px-6 tw-py-4 tw-border-b tw-border-gray-100">
                        <h3 class="tw-text-lg tw-font-bold tw-text-gray-800">
                            💬 Комментарии
                            <span class="tw-text-gray-400 tw-font-normal tw-text-sm tw-ml-2">
                                {{ activePost?.comments?.length || 0 }}
                            </span>
                        </h3>
                        <button @click="closeComments"
                            class="tw-w-8 tw-h-8 tw-rounded-full tw-bg-gray-100 tw-flex tw-items-center tw-justify-center tw-text-gray-500 hover:tw-bg-gray-200 tw-transition-colors">
                            ✕
                        </button>
                    </div>

                    <!-- Comments List -->
                    <div class="tw-flex-1 tw-overflow-y-auto tw-px-6 tw-py-4">
                        <!-- Empty -->
                        <div v-if="!activePost?.comments?.length" class="tw-text-center tw-py-12">
                            <div class="tw-text-5xl tw-mb-4">💭</div>
                            <p class="tw-text-gray-500">Пока нет комментариев</p>
                            <p class="tw-text-gray-400 tw-text-sm">Будьте первым!</p>
                        </div>

                        <!-- Comments -->
                        <div v-else class="tw-space-y-4">
                            <div v-for="comment in activePost?.comments" :key="comment.id" class="tw-flex tw-gap-3">
                                <!-- Avatar (clickable) -->
                                <div @click="comment.author?.id && goToCommentAuthorProfile(comment.author.id)"
                                    class="tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-sm tw-font-bold tw-text-white tw-flex-shrink-0 tw-cursor-pointer hover:tw-scale-105 tw-transition-transform"
                                    style="background: linear-gradient(135deg, #0891B2, #0e7490);">
                                    {{ comment.author?.name?.charAt(0).toUpperCase() || 'U' }}
                                </div>

                                <!-- Content -->
                                <div class="tw-flex-1">
                                    <div class="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                                        <span @click="comment.author?.id && goToCommentAuthorProfile(comment.author.id)"
                                            class="tw-font-semibold tw-text-gray-800 tw-text-sm tw-cursor-pointer hover:tw-text-[#0891B2] hover:tw-underline">
                                            @{{ comment.author?.name || 'user' }}
                                        </span>
                                        <span v-if="comment.createAt" class="tw-text-gray-400 tw-text-xs">
                                            {{ formatTime(comment.createAt) }}
                                        </span>
                                    </div>
                                    <p class="tw-text-gray-600">{{ comment.text }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Input -->
                    <div class="tw-px-6 tw-py-4 tw-border-t tw-border-gray-100 tw-bg-gray-50">
                        <div class="tw-flex tw-gap-3">
                            <input v-model="newComment" type="text" placeholder="Напишите комментарий..."
                                class="tw-flex-1 tw-h-12 tw-px-4 tw-bg-white tw-border tw-border-gray-200 focus:tw-outline-none focus:tw-border-[#0891B2] tw-transition-colors"
                                style="border-radius: 24px;" @keyup.enter="sendComment">
                            <button @click="sendComment" :disabled="!newComment.trim() || sendingComment"
                                class="tw-w-12 tw-h-12 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-white disabled:tw-opacity-50 disabled:tw-cursor-not-allowed hover:tw-scale-105 tw-transition-transform"
                                style="background: linear-gradient(135deg, #0891B2, #0e7490);">
                                {{ sendingComment ? '...' : '➤' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
/* Hide scrollbar */
.tw-overflow-y-scroll::-webkit-scrollbar {
    display: none;
}

.tw-overflow-y-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}
</style>
