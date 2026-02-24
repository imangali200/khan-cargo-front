<script setup lang="ts">
definePageMeta({
    layout: 'user'
})

import { useToast } from '~/composables/useToast'

interface Product {
    id: number
    productId: string
    productName: string | null
    client_registered: string | null
    china_warehouse: string | null
    aicargo: string | null
}

const WHATSAPP_NUMBER = "77083791496"
const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()
const router = useRouter()

const profile = ref<any>({
    id: 1,
    code: 'Ai-123',
    isActive: true
})
const allProducts = ref<Product[]>([
    { id: 1, productId: 'CN44556677', productName: 'Кроссовки Nike Air Max', client_registered: new Date().toISOString(), china_warehouse: null, aicargo: null },
    { id: 2, productId: 'CN88990011', productName: 'iPhone 15 Pro Max', client_registered: new Date().toISOString(), china_warehouse: new Date().toISOString(), aicargo: null }
])
const archiveProducts = ref<Product[]>([])
const loading = ref(false)
const activeTab = ref<'active' | 'archive'>('active')
const showAddModal = ref(false)
const newTrackCode = ref('')
const newDescription = ref('')
const addLoading = ref(false)

const isLoggedIn = computed(() => true)

const products = computed(() => activeTab.value === 'active' ? allProducts.value : archiveProducts.value)

async function getProfile() {
    try {
        const response = await $axios.get('profile', {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        profile.value = response.data
    } catch { }
}

async function getProducts() {
    try {
        const response = await $axios.get('products/my', {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        allProducts.value = response.data
    } catch { }
}

async function getArchiveProducts() {
    try {
        const response = await $axios.get('products/archive', {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        archiveProducts.value = response.data
    } catch { }
}

async function addProduct() {
    if (!newTrackCode.value.trim()) return

    addLoading.value = true
    setTimeout(() => {
        allProducts.value.unshift({
            id: Date.now(),
            productId: newTrackCode.value.trim(),
            productName: newDescription.value.trim() || 'Новый товар',
            client_registered: new Date().toISOString(),
            china_warehouse: null,
            aicargo: null
        })
        newTrackCode.value = ''
        newDescription.value = ''
        showAddModal.value = false
        addLoading.value = false
        toast.success('Товар успешно добавлен!')
    }, 600)
}

async function deleteProduct(productId: number) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return
    
    allProducts.value = allProducts.value.filter(p => p.id !== productId)
    toast.success('Товар удален')
}

async function restoreTrack(productId: string) {
    try {
        await $axios.post(`products/${productId}/restore`, {}, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        toast.success('Восстановлено')
        getArchiveProducts()
    } catch { }
}

function getProgress(product: Product) {
    return [product.client_registered, product.china_warehouse, product.aicargo].filter(Boolean).length
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
                    <span class="track-code">{{ product.productId }}</span>
                    <div class="actions">
                        <button v-if="activeTab === 'archive'" @click="restoreTrack(product.productId)" class="icon-btn">🔄</button>
                        <button @click="deleteTrack(product.productId)" class="icon-btn delete">🗑️</button>
                    </div>
                </div>
                <div class="card-body">
                    <h3 class="desc">{{ product.productName || 'Без описания' }}</h3>
                    <div class="progress-bar">
                        <div class="bar-fill" :style="{ width: (getProgress(product) * 33.3) + '%' }"></div>
                    </div>
                    <div class="steps">
                        <div class="step" :class="{ active: !!product.client_registered }">Принят</div>
                        <div class="step" :class="{ active: !!product.china_warehouse }">Китай</div>
                        <div class="step" :class="{ active: !!product.aicargo }">Пункт</div>
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
                    <button @click="addTrack" :disabled="addLoading" class="submit-btn">
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
