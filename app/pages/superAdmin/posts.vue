<template>
    <div class="posts-management animate-slide-up">
        <!-- Header -->
        <header class="page-header">
            <div class="title-section">
                <h1>Posts Management</h1>
                <p class="subtitle">View and manage all posts across the platform.</p>
            </div>
        </header>

        <!-- Search & Filters -->
        <div class="filters-bar">
            <div class="search-box">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" v-model="searchValue" @input="handleSearch"
                    placeholder="Search posts by content..." />
            </div>
            <button class="filter-btn" @click="resetFilters">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
                Reset
            </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading posts...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="posts.length === 0 && !loading" class="empty-state">
            <div class="empty-icon">📝</div>
            <h3>No posts found</h3>
            <p>There are no posts matching your search criteria.</p>
        </div>

        <!-- Posts Table -->
        <div v-else class="table-container">
            <div class="table-wrapper">
                <table class="premium-table">
                    <thead>
                        <tr>
                            <th>AUTHOR</th>
                            <th>CONTENT</th>
                            <th>IMAGE</th>
                            <th>PRICE</th>
                            <th class="center-th">LIKES</th>
                            <th class="center-th">COMMENTS</th>
                            <th>DATE</th>
                            <th class="actions-th">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="post in posts" :key="post.id" class="table-row">
                            <td>
                                <div class="author-cell">
                                    <div class="author-avatar">{{ getInitials(post.author) }}</div>
                                    <div class="author-info">
                                        <span class="author-name">{{ post.author?.name || '—' }} {{
                                            post.author?.lastName || '' }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="content-td">
                                <span class="content-text">{{ truncate(post.content, 60) }}</span>
                            </td>
                            <td>
                                <img v-if="post.imageUrl" :src="post.imageUrl" class="post-thumb"
                                    @click="openImagePreview(post.imageUrl)" />
                                <span v-else class="no-data">—</span>
                            </td>
                            <td>
                                <span v-if="post.price" class="price-badge">{{ formatPrice(post.price) }} ₸</span>
                                <span v-else class="no-data">—</span>
                            </td>
                            <td class="center-td">
                                <span class="stat-chip likes">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path
                                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                        </path>
                                    </svg>
                                    {{ post.likesCount }}
                                </span>
                            </td>
                            <td class="center-td">
                                <span class="stat-chip comments">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z">
                                        </path>
                                    </svg>
                                    {{ post.commentsCount }}
                                </span>
                            </td>
                            <td class="date-td">{{ formatDate(post.createdAt || post.createAt) }}</td>
                            <td class="actions-td">
                                <div class="btn-group">
                                    <button v-if="post.externalLink" @click="openLink(post.externalLink)"
                                        class="icon-btn link" title="Open link">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6">
                                            </path>
                                            <polyline points="15 3 21 3 21 9"></polyline>
                                            <line x1="10" y1="14" x2="21" y2="3"></line>
                                        </svg>
                                    </button>
                                    <button @click="deletePost(post)" class="icon-btn delete" title="Delete">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path
                                                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                            </path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="table-footer">
                <span class="showing-text">Showing <strong>{{ getShowingRange() }}</strong> of
                    <strong>{{ totalPosts }}</strong> posts</span>
                <div v-if="totalPages > 1" class="pagination">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        class="page-btn-nav">Previous</button>
                    <div class="page-numbers">
                        <button v-for="p in visiblePages" :key="p" @click="changePage(p)"
                            :class="['num-btn', { active: currentPage === p }]">{{ p }}</button>
                    </div>
                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="page-btn-nav">Next</button>
                </div>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <span class="stat-label">TOTAL POSTS</span>
                <span class="stat-value">{{ totalPosts }}</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">CURRENT PAGE</span>
                <span class="stat-value">{{ currentPage }} / {{ totalPages }}</span>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <Teleport to="body">
            <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
                <div class="modal-card">
                    <div class="modal-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path
                                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z">
                            </path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                    <h3>Are you sure you want to delete this post?</h3>
                    <p class="modal-description">This action cannot be undone. The post by <strong>{{
                        deleteTargetPost?.author?.name }} {{ deleteTargetPost?.author?.lastName }}</strong> will be
                        permanently removed.</p>
                    <div v-if="deleteTargetPost?.content" class="modal-preview">
                        "{{ truncate(deleteTargetPost.content, 100) }}"
                    </div>
                    <div class="modal-actions">
                        <button class="modal-btn cancel" @click="showDeleteModal = false">Cancel</button>
                        <button class="modal-btn confirm-delete" @click="confirmDelete" :disabled="deleteSubmitting">
                            <div v-if="deleteSubmitting" class="btn-spinner-sm"></div>
                            {{ deleteSubmitting ? 'Deleting...' : 'Delete Post' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Image Preview Modal -->
        <Teleport to="body">
            <div v-if="previewImage" class="modal-overlay image-preview-overlay" @click.self="previewImage = ''">
                <div class="image-preview-card">
                    <button class="close-preview-btn" @click="previewImage = ''">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <img :src="previewImage" class="preview-img" />
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'super-admin'
})

import { useToast } from '~/composables/useToast'
import type { Post } from '~/types'

const toast = useToast()
const api = useApi()

const posts = ref<Post[]>([])
const loading = ref(false)
const searchValue = ref('')
const currentPage = ref(1)
const perPage = 10
const totalPosts = ref(0)
const totalPages = ref(1)

// Delete modal state
const showDeleteModal = ref(false)
const deleteTargetPost = ref<Post | null>(null)
const deleteSubmitting = ref(false)

// Image preview
const previewImage = ref('')

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const visiblePages = computed(() => {
    const pages: number[] = []
    const start = Math.max(1, currentPage.value - 2)
    const end = Math.min(totalPages.value, start + 4)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
})

const getShowingRange = () => {
    if (totalPosts.value === 0) return '0-0'
    const start = (currentPage.value - 1) * perPage + 1
    const end = Math.min(currentPage.value * perPage, totalPosts.value)
    return `${start}-${end}`
}

const truncate = (text: string, max: number) => {
    if (!text) return '—'
    return text.length > max ? text.slice(0, max) + '…' : text
}

const getInitials = (author: any) => {
    if (!author) return 'U'
    const n = author.name?.charAt(0)?.toUpperCase() || ''
    const l = author.lastName?.charAt(0)?.toUpperCase() || ''
    return n + l || 'U'
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price)
}

const formatDate = (date: string) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const openLink = (url: string) => {
    window.open(url, '_blank')
}

const openImagePreview = (url: string) => {
    previewImage.value = url
}

const handleSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        currentPage.value = 1
        fetchPosts()
    }, 400)
}

const resetFilters = () => {
    searchValue.value = ''
    currentPage.value = 1
    fetchPosts()
}

const changePage = (page: number) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    fetchPosts()
}

const fetchPosts = async () => {
    loading.value = true
    try {
        if (searchValue.value.trim()) {
            const { data } = await api.feed.searchPosts(searchValue.value.trim())
            posts.value = data.data
            totalPosts.value = data.meta.total
            totalPages.value = data.meta.lastPage || 1
        } else {
            const { data } = await api.feed.getFeed({ page: currentPage.value, limit: perPage })
            posts.value = data.data
            totalPosts.value = data.meta.total
            totalPages.value = data.meta.lastPage || 1
        }
    } catch {
        toast.error('Error loading posts')
    } finally {
        loading.value = false
    }
}

const deletePost = (post: Post) => {
    deleteTargetPost.value = post
    showDeleteModal.value = true
}

const confirmDelete = async () => {
    if (!deleteTargetPost.value) return
    deleteSubmitting.value = true
    try {
        await api.feed.deletePost(deleteTargetPost.value.id)
        toast.success('Post deleted successfully')
        showDeleteModal.value = false
        deleteTargetPost.value = null
        fetchPosts()
    } catch {
        toast.error('Error deleting post')
    } finally {
        deleteSubmitting.value = false
    }
}

onMounted(() => {
    fetchPosts()
})
</script>

<style scoped>
.posts-management {
    padding: 32px 40px;
    max-width: 1400px;
    margin: 0;
    color: #fff;
    font-family: 'Inter', -apple-system, sans-serif;
    display: flex;
    flex-direction: column;
    min-height: 100%;
}

.animate-slide-up {
    animation: slideUp 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Header */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 28px;
}

.title-section h1 {
    font-size: 26px;
    font-weight: 800;
    margin: 0;
    color: white;
    letter-spacing: -0.5px;
}

.subtitle {
    font-size: 14px;
    color: #71717a;
    margin: 6px 0 0;
}

/* Filters Bar */
.filters-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #18181b;
    border: 1px solid #27272a;
    padding: 12px 16px;
    border-radius: 10px;
    flex: 1;
    max-width: 520px;
    transition: border-color 0.2s;
}

.search-box:focus-within {
    border-color: #3b82f6;
}

.search-icon {
    width: 16px;
    height: 16px;
    color: #71717a;
    flex-shrink: 0;
}

.search-box input {
    background: transparent;
    border: none;
    outline: none;
    color: #e4e4e7;
    width: 100%;
    font-size: 13px;
}

.search-box input::placeholder {
    color: #52525b;
}

.filter-btn {
    background: #18181b;
    border: 1px solid #27272a;
    color: #a1a1aa;
    padding: 12px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
}

.filter-btn svg {
    width: 14px;
    height: 14px;
}

.filter-btn:hover {
    border-color: #3b82f6;
    color: #e4e4e7;
}

/* Loading */
.loading-state {
    text-align: center;
    padding: 64px;
    color: #71717a;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #27272a;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 64px;
    background-color: #18181b;
    border: 1px solid #27272a;
    border-radius: 12px;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
}

.empty-state h3 {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 8px;
}

.empty-state p {
    color: #71717a;
    font-size: 14px;
}

/* Table */
.table-container {
    background: #18181b;
    border: 1px solid #27272a;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 24px;
}

.table-wrapper {
    overflow-x: auto;
}

.premium-table {
    width: 100%;
    border-collapse: collapse;
}

.premium-table thead {
    background: #1e1e20;
}

.premium-table th {
    padding: 14px 20px;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    color: #71717a;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #27272a;
    white-space: nowrap;
}

.premium-table th.center-th {
    text-align: center;
}

.premium-table td {
    padding: 14px 20px;
    font-size: 13px;
    color: #a1a1aa;
    border-bottom: 1px solid rgba(39, 39, 42, 0.5);
    vertical-align: middle;
}

.table-row {
    transition: background 0.15s;
}

.table-row:hover {
    background: rgba(59, 130, 246, 0.04);
}

/* Author Cell */
.author-cell {
    display: flex;
    align-items: center;
    gap: 10px;
}

.author-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 800;
    flex-shrink: 0;
}

.author-name {
    font-weight: 600;
    color: #e4e4e7;
    white-space: nowrap;
}

/* Content */
.content-td {
    max-width: 280px;
}

.content-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
}

/* Thumbnail */
.post-thumb {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid #27272a;
    cursor: pointer;
    transition: transform 0.2s, border-color 0.2s;
}

.post-thumb:hover {
    transform: scale(1.1);
    border-color: #3b82f6;
}

/* Price badge */
.price-badge {
    background: rgba(34, 197, 94, 0.12);
    color: #4ade80;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
}

/* Stat chips */
.center-td {
    text-align: center;
}

.stat-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
}

.stat-chip svg {
    width: 13px;
    height: 13px;
}

.stat-chip.likes {
    background: rgba(239, 68, 68, 0.1);
    color: #f87171;
}

.stat-chip.comments {
    background: rgba(59, 130, 246, 0.1);
    color: #60a5fa;
}

/* Date */
.date-td {
    white-space: nowrap;
    font-size: 12px;
}

/* No data */
.no-data {
    color: #3f3f46;
}

/* Actions */
.actions-th {
    text-align: right;
}

.actions-td {
    text-align: right;
}

.btn-group {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
}

.icon-btn {
    width: 34px;
    height: 34px;
    border: 1px solid #27272a;
    border-radius: 8px;
    background: #1e1e20;
    color: #a1a1aa;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.icon-btn svg {
    width: 15px;
    height: 15px;
}

.icon-btn.link:hover {
    border-color: #3b82f6;
    color: #60a5fa;
    background: rgba(59, 130, 246, 0.1);
}

.icon-btn.delete:hover {
    border-color: #ef4444;
    color: #f87171;
    background: rgba(239, 68, 68, 0.1);
}

/* Table Footer & Pagination */
.table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-top: 1px solid #27272a;
}

.showing-text {
    font-size: 13px;
    color: #71717a;
}

.showing-text strong {
    color: #a1a1aa;
}

.pagination {
    display: flex;
    align-items: center;
    gap: 8px;
}

.page-numbers {
    display: flex;
    gap: 4px;
}

.num-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid #27272a;
    background: transparent;
    color: #a1a1aa;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.num-btn:hover {
    border-color: #3b82f6;
    color: #e4e4e7;
}

.num-btn.active {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
}

.page-btn-nav {
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid #27272a;
    background: transparent;
    color: #a1a1aa;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.page-btn-nav:hover:not(:disabled) {
    border-color: #3b82f6;
    color: #e4e4e7;
}

.page-btn-nav:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 8px;
}

.stat-card {
    background: #18181b;
    border: 1px solid #27272a;
    border-radius: 12px;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.stat-label {
    font-size: 11px;
    font-weight: 700;
    color: #52525b;
    letter-spacing: 0.5px;
}

.stat-value {
    font-size: 28px;
    font-weight: 800;
    color: white;
    letter-spacing: -1px;
}

/* Delete Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.modal-card {
    background: #1e1e20;
    border: 1px solid #27272a;
    border-radius: 16px;
    padding: 32px;
    max-width: 420px;
    width: 90%;
    text-align: center;
    animation: scaleIn 0.2s ease;
}

@keyframes scaleIn {
    from {
        transform: scale(0.95);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.modal-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
}

.modal-icon svg {
    width: 24px;
    height: 24px;
    color: #ef4444;
}

.modal-card h3 {
    font-size: 18px;
    font-weight: 700;
    color: white;
    margin: 0 0 8px;
}

.modal-description {
    font-size: 14px;
    color: #71717a;
    line-height: 1.6;
    margin: 0 0 12px;
}

.modal-preview {
    font-size: 13px;
    color: #a1a1aa;
    font-style: italic;
    background: #161618;
    border: 1px solid #27272a;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 20px;
    line-height: 1.5;
}

.modal-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
}

.modal-btn {
    flex: 1;
    padding: 12px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.modal-btn.cancel {
    background: #27272a;
    color: #a1a1aa;
}

.modal-btn.cancel:hover {
    background: #3f3f46;
    color: white;
}

.modal-btn.confirm-delete {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
}

.modal-btn.confirm-delete:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    transform: translateY(-1px);
}

.modal-btn.confirm-delete:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-spinner-sm {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

/* Image Preview */
.image-preview-overlay {
    cursor: zoom-out;
}

.image-preview-card {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    animation: scaleIn 0.2s ease;
}

.preview-img {
    max-width: 90vw;
    max-height: 85vh;
    border-radius: 12px;
    object-fit: contain;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.close-preview-btn {
    position: absolute;
    top: -12px;
    right: -12px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #27272a;
    border: 1px solid #3f3f46;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    z-index: 1;
}

.close-preview-btn svg {
    width: 16px;
    height: 16px;
}

.close-preview-btn:hover {
    background: #ef4444;
    border-color: #ef4444;
}

/* Responsive */
@media (max-width: 768px) {
    .posts-management {
        padding: 20px;
    }

    .filters-bar {
        flex-direction: column;
    }

    .search-box {
        max-width: 100%;
    }

    .stats-grid {
        grid-template-columns: 1fr 1fr;
    }
}
</style>
