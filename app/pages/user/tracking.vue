<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import type { TrackingItem } from '~/types'

definePageMeta({
    layout: 'user'
})

const api = useApi()
const toast = useToast()
const token = useCookie('token')
const router = useRouter()

const allProducts = ref<TrackingItem[]>([])
const archiveProducts = ref<TrackingItem[]>([])
const loading = ref(true)
const activeTab = ref<'active' | 'archive'>('active')
const showAddModal = ref(false)
const newTrackCode = ref('')
const newDescription = ref('')
const addLoading = ref(false)

// Edit Modal State
const showEditModal = ref(false)
const editLoading = ref(false)
const editData = ref({
    id: 0,
    trackingCode: '',
    description: ''
})

const isLoggedIn = computed(() => !!token.value)
const products = computed(() => activeTab.value === 'active' ? allProducts.value : archiveProducts.value)

async function getProducts() {
    try {
        const { data } = await api.profile.getMyTracking()
        allProducts.value = data.data
    } catch { }
}

async function getArchiveProducts() {
    try {
        const { data } = await api.profile.getMyArchiveTracking()
        archiveProducts.value = data.data
    } catch { }
}

async function addProduct() {
    if (!newTrackCode.value.trim()) {
        toast.warning('Введите трек-код')
        return
    }

    addLoading.value = true
    try {
        const { data } = await api.tracking.create({
            trackingCode: newTrackCode.value.trim(),
            description: newDescription.value.trim() || 'Новый груз'
        })
        allProducts.value.unshift(data)
        newTrackCode.value = ''
        newDescription.value = ''
        showAddModal.value = false
        toast.success('Трек успешно добавлен!')
    } catch (e: any) {
        toast.error(e.response?.data?.message || 'Ошибка при добавлении')
    } finally {
        addLoading.value = false
    }
}

async function deleteProduct(productId: number) {
    const isArchive = activeTab.value === 'archive'
    const confirmMsg = isArchive
        ? 'Действительно удалить этот трек полностью?'
        : 'Отправить этот трек в архив?'

    if (!confirm(confirmMsg)) return

    try {
        if (isArchive) {
            await api.tracking.remove(productId)
            toast.success('Трек полностью удален')
            await getArchiveProducts()
        } else {
            await api.tracking.softDelete(productId)
            toast.success('Трек отправлен в архив')
            await getProducts()
        }
    } catch (e: any) {
        toast.error(e.response?.data?.message || 'Ошибка при удалении')
    }
}

async function restoreProduct(productId: number) {
    try {
        await api.tracking.restore(productId)
        toast.success('Трек восстановлен')
        await getArchiveProducts()
        await getProducts()
    } catch (e: any) {
        toast.error(e.response?.data?.message || 'Ошибка при восстановлении')
    }
}

function editProduct(product: TrackingItem) {
    editData.value = {
        id: product.id,
        trackingCode: product.trackingCode,
        description: product.description || ''
    }
    showEditModal.value = true
}

async function saveEditProduct() {
    if (!editData.value.trackingCode.trim()) {
        toast.warning('Введите трек-код')
        return
    }

    editLoading.value = true
    try {
        const { data } = await api.tracking.update(editData.value.id, {
            trackingCode: editData.value.trackingCode.trim(),
            description: editData.value.description.trim()
        })

        // Immediately refetch to show changes
        if (activeTab.value === 'active') {
            await getProducts()
        } else {
            await getArchiveProducts()
        }

        showEditModal.value = false
        toast.success('Трек успешно обновлен!')
    } catch (e: any) {
        toast.error(e.response?.data?.message || 'Ошибка при обновлении')
    } finally {
        editLoading.value = false
    }
}

function getStatusLabel(product: TrackingItem) {
    const statusMap: Record<string, string> = {
        'REGISTERED': 'Зарегистрирован',
        'ARRIVED_CHINA_WAREHOUSE': 'Склад в Китае',
        'ARRIVED_BRANCH': 'Khan Cargo',
        'PICKED_UP': 'Забран'
    }
    return statusMap[product.currentStatus] || product.currentStatus || 'Зарегистрирован'
}

function getStatusStep(product: TrackingItem) {
    const stepMap: Record<string, number> = {
        'REGISTERED': 0,
        'ARRIVED_CHINA_WAREHOUSE': 1,
        'ARRIVED_BRANCH': 2,
        'PICKED_UP': 3
    }
    return stepMap[product.currentStatus] ?? 0
}

function formatStatusDate(dateStr?: string) {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function formatStatusTime(dateStr?: string) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

watch(activeTab, (val) => {
    val === 'active' ? getProducts() : getArchiveProducts()
})

onMounted(async () => {
    if (token.value) {
        await getProducts()
    }
    loading.value = false
})
</script>

<template>
    <div class="shipments-page">
        <div class="shipments-container">
            <!-- Header -->
            <div class="shipments-header">
                <div class="header-text">
                    <h1>Мои отправления</h1>
                    <p class="stats-text">Всего: {{ products.length }}</p>
                </div>
                <button @click="showAddModal = true" class="plus-fab-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
            </div>

            <!-- Tabs -->
            <div class="pill-nav-container">
                <div class="pill-nav">
                    <button class="pill-btn" :class="{ active: activeTab === 'active' }" @click="activeTab = 'active'">
                        Активные <span v-if="activeTab === 'active'" class="active-dot"></span>
                    </button>
                    <button class="pill-btn" :class="{ active: activeTab === 'archive' }"
                        @click="activeTab = 'archive'">
                        Архив
                    </button>
                </div>
            </div>

            <div v-if="loading" class="loading-wrap">
                <div class="simple-loader"></div>
            </div>

            <div v-else class="shipments-list">
                <div v-if="!products.length" class="empty-view">
                    <div class="empty-emoji">📦</div>
                    <p>{{ activeTab === 'active' ? 'Отправления не найдены' : 'Нет отправлений в архиве' }}</p>
                </div>

                <div v-for="product in products" :key="product.id" class="shipment-card">
                    <div class="card-top">
                        <div class="track-info">
                            <span class="track-label">ТРЕК-НОМЕР</span>
                            <span class="track-id">#{{ product.trackingCode }}</span>
                        </div>
                        <div class="card-actions">
                            <button v-if="activeTab === 'active'" @click="editProduct(product)"
                                class="action-icon-btn edit-btn" title="Редактировать">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </button>
                            <button v-if="activeTab === 'archive'" @click="restoreProduct(product.id)"
                                class="action-icon-btn restore-btn" title="Восстановить">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <polyline points="1 4 1 10 7 10" />
                                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                                </svg>
                            </button>
                            <button @click="deleteProduct(product.id)" class="action-icon-btn trash-btn"
                                title="Удалить">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path
                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="card-status-info">
                        <h2>{{ getStatusLabel(product) }}</h2>
                        <p v-if="product.description" class="cargo-description">{{ product.description }}</p>
                    </div>

                    <!-- Progress Stepper -->
                    <div class="stepper-visual">
                        <div class="progress-line-bg">
                            <div class="progress-line-fill"
                                :style="{ width: (getStatusStep(product) / 2 * 100) + '%' }">
                            </div>
                        </div>
                        <div class="milestones">
                            <div class="milestone-point" :class="{ reached: getStatusStep(product) >= 0 }">
                                <div class="dot"></div>
                                <span class="label">Зарегистрирован</span>
                                <span class="date-label">{{ formatStatusDate(product.createAt) }}</span>
                            </div>
                            <div class="milestone-point" :class="{ reached: getStatusStep(product) >= 1 }">
                                <div class="dot"></div>
                                <span class="label">Китай</span>
                                <span class="date-label">{{ formatStatusDate(product.chinaArrivalDate) }}</span>
                            </div>
                            <div class="milestone-point" :class="{ reached: getStatusStep(product) >= 2 }">
                                <div class="dot"></div>
                                <span class="label">Khan Cargo</span>
                                <p class="date-time">
                                    <span class="date-label">{{ formatStatusDate(product.khanCargoArrivalDate) }}</span>
                                    <span class="time-label">{{ formatStatusTime(product.khanCargoArrivalDate) }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add Modal -->
            <Teleport to="body">
                <div v-if="showAddModal" class="modal-root" @click="showAddModal = false">
                    <div class="modal-box" @click.stop>
                        <div class="modal-top">
                            <h3>Добавить трек</h3>
                            <button @click="showAddModal = false" class="close-x">✕</button>
                        </div>
                        <div class="modal-body">
                            <div class="field-wrap">
                                <label>ТРЕК-КОД</label>
                                <input v-model="newTrackCode" placeholder="Введите трек-код..." autofocus />
                            </div>
                            <div class="field-wrap">
                                <label>ОПИСАНИЕ</label>
                                <input v-model="newDescription" placeholder="напр. Обувь, Электроника..." />
                            </div>
                            <button @click="addProduct" :disabled="addLoading" class="reg-btn">
                                {{ addLoading ? 'Добавление...' : 'Добавить трек' }}
                            </button>
                        </div>
                    </div>
                </div>
            </Teleport>

            <!-- Edit Modal -->
            <Teleport to="body">
                <div v-if="showEditModal" class="modal-root" @click="showEditModal = false">
                    <div class="modal-box" @click.stop>
                        <div class="modal-top">
                            <h3>Редактировать трек</h3>
                            <button @click="showEditModal = false" class="close-x">✕</button>
                        </div>
                        <div class="modal-body">
                            <div class="field-wrap">
                                <label>ТРЕК-КОД</label>
                                <input v-model="editData.trackingCode" placeholder="Введите трек-код..." autofocus />
                            </div>
                            <div class="field-wrap">
                                <label>ОПИСАНИЕ</label>
                                <input v-model="editData.description" placeholder="напр. Обувь, Электроника..." />
                            </div>
                            <button @click="saveEditProduct" :disabled="editLoading" class="reg-btn">
                                {{ editLoading ? 'Сохранение...' : 'Сохранить изменения' }}
                            </button>
                        </div>
                    </div>
                </div>
            </Teleport>

            <div class="bottom-safe-spacer"></div>
        </div>
    </div>
</template>

<style scoped>
.shipments-page {
    background-color: transparent;
    min-height: 100vh;
    color: #ffffff;
    font-family: 'Inter', -apple-system, sans-serif;
    padding-bottom: 90px;
}

.shipments-container {
    max-width: 680px;
    margin: 0 auto;
    padding: 32px 20px;
}

.shipments-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
}

.header-text h1 {
    font-size: 24px;
    font-weight: 800;
    margin: 0 0 4px;
}

.stats-text {
    font-size: 14px;
    color: #555;
    font-weight: 600;
}

.plus-fab-btn {
    width: 44px;
    height: 44px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
    transition: transform 0.2s;
}

.plus-fab-btn:active {
    transform: scale(0.92);
}

/* Nav Pills */
.pill-nav-container {
    margin-bottom: 32px;
}

.pill-nav {
    display: flex;
    background-color: #0d0d0d;
    border: 1px solid #1a1a1a;
    border-radius: 14px;
    padding: 6px;
}

.pill-btn {
    flex: 1;
    height: 44px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: #555;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
}

.pill-btn.active {
    background-color: #2563eb;
    color: white;
}

.active-dot {
    width: 5px;
    height: 5px;
    background-color: #a5b4fc;
    border-radius: 50%;
}

/* Shipment Cards */
.shipments-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.shipment-card {
    background-color: #0d0d0d;
    border: 1px solid #1a1a1a;
    border-radius: 24px;
    padding: 24px;
}

.card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
}

.track-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.track-label {
    font-size: 10px;
    font-weight: 800;
    color: #444;
    letter-spacing: 0.8px;
}

.track-id {
    font-size: 14px;
    font-weight: 800;
    color: #2563eb;
}

.card-actions {
    display: flex;
    gap: 8px;
}

.action-icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid #1a1a1a;
    background: transparent;
    color: #555;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.action-icon-btn.edit-btn {
    color: #ffffff;
    border-color: #2563eb;
    background-color: #2563eb;
}

.action-icon-btn.edit-btn:hover {
    background-color: #1d4ed8;
    border-color: #1d4ed8;
}

.action-icon-btn.restore-btn:hover {
    color: #10b981;
    border-color: #10b981;
    background-color: rgba(16, 185, 129, 0.1);
}

.action-icon-btn.trash-btn:hover {
    color: #ef4444;
    border-color: #ef4444;
    background-color: rgba(239, 68, 68, 0.1);
}

.card-status-info h2 {
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 6px;
    color: white;
}

.cargo-description {
    font-size: 14px;
    font-weight: 600;
    color: #8b949e;
    margin: 0 0 24px;
}

/* Stepper Visual */
.stepper-visual {
    position: relative;
    padding-bottom: 8px;
    margin-top: 24px;
}

.progress-line-bg {
    position: absolute;
    top: 5px;
    left: 4px;
    right: 4px;
    height: 2px;
    background-color: #1a1a1a;
    z-index: 1;
}

.progress-line-fill {
    height: 100%;
    background-color: #2563eb;
    transition: width 0.6s ease-out;
}

.milestones {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
}

.milestone-point {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.milestone-point .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #1a1a1a;
    border: 2px solid #0d0d0d;
}

.milestone-point.reached .dot {
    background-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
}

.milestone-point .label {
    font-size: 10px;
    font-weight: 700;
    color: #444;
    white-space: nowrap;
}

.milestone-point.reached .label {
    color: #ffffff;
}

.milestone-point .date-label {
    font-size: 9px;
    font-weight: 600;
    color: #555;
}

.milestone-point.reached .date-label {
    color: #8b949e;
}

/* Modal */
.modal-root {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
}

.modal-box {
    background-color: #0d0d0d;
    border: 1px solid #1a1a1a;
    border-radius: 28px;
    width: 100%;
    max-width: 400px;
    padding: 32px;
}

.modal-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.modal-top h3 {
    font-size: 20px;
    font-weight: 800;
    margin: 0;
}

.close-x {
    background: transparent;
    border: none;
    color: #555;
    font-size: 18px;
    cursor: pointer;
}

.modal-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.field-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.field-wrap label {
    font-size: 10px;
    font-weight: 800;
    color: #444;
    letter-spacing: 0.8px;
}

.field-wrap input {
    background-color: #000;
    border: 1px solid #1a1a1a;
    border-radius: 12px;
    padding: 14px;
    color: white;
    font-size: 15px;
    outline: none;
}

.field-wrap input:focus {
    border-color: #2563eb;
}

.reg-btn {
    margin-top: 10px;
    height: 54px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
}

.bottom-safe-spacer {
    height: 40px;
}

.loading-wrap {
    display: flex;
    justify-content: center;
    padding: 60px 0;
}

.simple-loader {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(255, 255, 255, 0.05);
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.empty-view {
    text-align: center;
    padding: 60px 0;
    color: #444;
}

.empty-emoji {
    font-size: 40px;
    margin-bottom: 12px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
