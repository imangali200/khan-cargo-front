<script setup lang="ts">
definePageMeta({
    layout: 'user'
})

import { useToast } from '~/composables/useToast'

import type { TrackingItem } from '~/types'

const WHATSAPP_NUMBER = "77083791496"
const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()
const router = useRouter()
const api = useApi()

const profile = ref<any>({
    id: 1,
    code: 'Ai-123',
    isActive: true
})
const allProducts = ref<TrackingItem[]>([])
const archiveProducts = ref<TrackingItem[]>([])
const loading = ref(true)
const activeTab = ref<'active' | 'archive'>('active')
const showAddModal = ref(false)
const newTrackCode = ref('')
const newDescription = ref('')
const addLoading = ref(false)

const isLoggedIn = computed(() => !!token.value)

const products = computed(() => activeTab.value === 'active' ? allProducts.value : archiveProducts.value)

async function getProfile() {
    try {
        const { data } = await api.profile.getProfile()
        profile.value = data
    } catch { }
}

async function getProducts() {
    try {
        const { data } = await api.profile.getMyTracking({ isArchived: false })
        allProducts.value = data.data
    } catch { }
}

async function getArchiveProducts() {
    try {
        const { data } = await api.profile.getMyTracking({ isArchived: true })
        archiveProducts.value = data.data
    } catch { }
}

async function addProduct() {
    if (!newTrackCode.value.trim()) return

    addLoading.value = true
    try {
        const { data } = await api.tracking.create({
            trackingCode: newTrackCode.value.trim(),
            description: newDescription.value.trim() || 'Новый товар'
        })
        allProducts.value.unshift(data)
        newTrackCode.value = ''
        newDescription.value = ''
        showAddModal.value = false
        toast.success('Товар успешно добавлен!')
    } catch (e: any) {
        toast.error(e.response?.data?.message || 'Ошибка при добавлении')
    } finally {
        addLoading.value = false
    }
}

async function deleteProduct(productId: number) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return

    // Since there's no soft delete endpoint for tracking items yet, we remove it from view
    toast.info('Удаление трек-кода временно недоступно')
}

// Restore tracking item functionality - if no backend endpoint, simulate it or handle it
async function restoreTrack(productId: string) {
    toast.info('Функция восстановления в разработке')
}

const getProgress = (product: any) => {
    return [product.createAt, product.chinaArrivalDate, product.khanCargoArrivalDate].filter(Boolean).length
}

function formatDate(date: string | null) {
    if (!date) return '-'
    return new Date(date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

watch(activeTab, (val) => {
    val === 'active' ? getProducts() : getArchiveProducts()
})

onMounted(async () => {
    if (token.value) {
        await getProfile()
        await getProducts()
    }
    loading.value = false
})
</script>

<template>
    <div v-if="loading" class="loading-screen">
        <div class="spinner"></div>
    </div>

    <div v-else class="products-page">
        <div class="header-row">
            <h1>Мои товары</h1>
            <button @click="showAddModal = true" class="add-btn">+ Добавить</button>
        </div>

        <div class="tabs">
            <button :class="{ active: activeTab === 'active' }" @click="activeTab = 'active'">Активные</button>
            <button :class="{ active: activeTab === 'archive' }" @click="activeTab = 'archive'">Архив</button>
        </div>

        <div v-if="!products.length" class="empty-state">
            <div class="empty-icon">📦</div>
            <h3>Ничего не найдено</h3>
        </div>

        <div class="products-grid">
            <div v-for="product in products" :key="product.id" class="product-card">
                <div class="card-head">
                    <span class="track-code">{{ product.trackingCode }}</span>
                    <div class="actions">
                        <button v-if="activeTab === 'archive'" @click="restoreTrack(product.trackingCode)" class="icon-btn">🔄</button>
                        <button @click="deleteProduct(product.id)" class="icon-btn delete">🗑️</button>
                    </div>
                </div>
                <div class="card-body">
                    <h3 class="desc">{{ product.description || 'Без описания' }}</h3>
                    <div class="progress-bar">
                        <div class="bar-fill" :style="{ width: (getProgress(product) * 33.3) + '%' }"></div>
                    </div>
                    <div class="tracking-steps">
                        <div class="step" :class="{ active: !!product.createAt }">Рег</div>
                        <div class="step" :class="{ active: !!product.chinaArrivalDate }">Китай</div>
                        <div class="step" :class="{ active: !!product.khanCargoArrivalDate }">Пункт</div>
                        <div class="step" :class="{ active: product.currentStatus === 'PICKED_UP' }">Выдан</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Modal -->
        <div v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
            <div class="modal" @click.stop>
                <div class="modal-header">
                    <h3>Добавить трек-код</h3>
                    <button @click="showAddModal = false" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <input v-model="newTrackCode" placeholder="Трек-код" class="m-input" />
                    <input v-model="newDescription" placeholder="Описание (например, Кроссовки)" class="m-input" />
                    <button @click="addProduct" :disabled="addLoading" class="submit-btn">
                        {{ addLoading ? 'Загрузка...' : 'Добавить' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.products-page { padding: 20px 0; }
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.header-row h1 { font-size: 24px; font-weight: 800; color: #242424; margin: 0; }
.add-btn { background: #cb11ab; color: #fff; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; }
.tabs { display: flex; gap: 10px; margin-bottom: 24px; }
.tabs button { padding: 10px 20px; background: #fff; border: 1px solid #eee; border-radius: 10px; cursor: pointer; font-weight: 700; color: #888; }
.tabs button.active { background: #242424; color: #fff; border-color: #242424; }
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.product-card { background: #fff; border-radius: 20px; padding: 20px; border: 1px solid #eee; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.track-code { font-weight: 800; color: #cb11ab; font-size: 14px; }
.icon-btn { background: #f6f6f9; border: none; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; }
.desc { font-size: 16px; font-weight: 700; margin: 0 0 16px; color: #242424; }
.progress-bar { height: 6px; background: #f0f0f5; border-radius: 3px; margin-bottom: 8px; overflow: hidden; }
.bar-fill { height: 100%; background: linear-gradient(90deg, #cb11ab, #481173); border-radius: 3px; transition: width 0.5s; }
.steps { display: flex; justify-content: space-between; }
.step { font-size: 11px; font-weight: 700; color: #ccc; }
.step.active { color: #242424; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: #fff; border-radius: 24px; padding: 24px; width: 100%; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-header h3 { margin: 0; font-weight: 800; }
.close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #888; }
.m-input { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 12px; outline: none; }
.submit-btn { width: 100%; padding: 14px; background: #cb11ab; color: #fff; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; }
.loading-screen { min-height: 50vh; display: flex; align-items: center; justify-content: center; }
.spinner { width: 32px; height: 32px; border: 3px solid #eee; border-top-color: #cb11ab; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
