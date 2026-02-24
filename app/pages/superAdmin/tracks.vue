<template>
    <div class="global-tracks animate-slide-up">
        <!-- Premium Header Area -->
        <header class="page-header">
            <div class="breadcrumb">
                <router-link to="/superAdmin">Главная</router-link>
                <span class="sep">/</span>
                <span class="current">Все товары</span>
            </div>
            <div class="title-section">
                <h1>Глобальный реестр грузов</h1>
                <p class="subtitle">Мониторинг всех отправлений в системе AiCargo</p>
            </div>
        </header>

        <!-- Search & Filter Bar -->
        <section class="search-bar glass-card">
            <div class="search-input-group">
                <span class="icon">🔍</span>
                <input type="text" v-model="searchValue" @input="handleSearch" placeholder="Поиск по трек-коду или ID..." />
            </div>
            <div class="bar-stats">
                <div class="b-stat">
                    <span class="label">Всего</span>
                    <span class="val">{{ products.length }}</span>
                </div>
            </div>
        </section>

        <!-- Desktop Table View -->
        <div class="table-container glass-card desktop-only">
            <table class="premium-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Трек-код</th>
                        <th>Статус</th>
                        <th>Дата регистрации</th>
                        <th>Обновлено</th>
                        <th class="actions-th">История</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in paginatedProducts" :key="product.id" class="table-row">
                        <td class="id-td">#{{ product.id }}</td>
                        <td class="track-td">
                            <span class="track-id">{{ product.productId }}</span>
                        </td>
                        <td>
                            <div class="status-cell">
                                <span :class="['status-badge', getProductStatus(product).class]">
                                    {{ getProductStatus(product).text }}
                                </span>
                            </div>
                        </td>
                        <td class="date-td">{{ formatDate(product.client_registered) }}</td>
                        <td class="date-td">{{ formatDate(getProductStatus(product).date) }}</td>
                        <td class="actions-td">
                            <button @click="toHistory(product.productId)" class="hist-btn">
                                Детали →
                            </button>
                        </td>
                    </tr>
                    <tr v-if="filteredProducts.length === 0">
                        <td colspan="6" class="empty-td">
                            <div class="empty-msg">
                                <span>📦</span>
                                <p>Товары не найдены</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Mobile View Cards -->
        <div class="mobile-only mobile-cards">
            <div v-for="product in paginatedProducts" :key="'m-' + product.id" class="track-card glass-card">
                <div class="card-head">
                    <span class="id-tag">#{{ product.id }}</span>
                    <span :class="['card-badge', getProductStatus(product).class]">
                        {{ getProductStatus(product).text }}
                    </span>
                </div>
                <div class="card-main">
                    <h3 class="track-id">{{ product.productId }}</h3>
                    <div class="timestamps">
                        <div class="ts">
                            <span class="lbl">Регистрация:</span>
                            <span class="val">{{ formatDate(product.client_registered) }}</span>
                        </div>
                        <div class="ts">
                            <span class="lbl">Обновлено:</span>
                            <span class="val">{{ formatDate(getProductStatus(product).date) }}</span>
                        </div>
                    </div>
                </div>
                <button @click="toHistory(product.productId)" class="m-hist-btn">
                    Подробная история
                </button>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
            <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">←</button>
            <div class="page-numbers">
                <button v-for="p in visiblePages" :key="p" @click="currentPage = p" :class="['num-btn', { active: currentPage === p }]">{{ p }}</button>
            </div>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">→</button>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'superAdmin'
})

import { useToast } from '~/composables/useToast'
const toast = useToast()
const router = useRouter()

const products = ref([
    { id: 2541, productId: 'CN-880192345678', productName: 'Electronics', client_registered: '2024-03-01T10:00:00Z', china_warehouse: '2024-03-05T12:00:00Z', aicargo: '2024-03-10T09:00:00Z', given_to_client: '2024-03-15T15:00:00Z' },
    { id: 2542, productId: 'CN-880192345679', productName: 'Clothing', client_registered: '2024-03-02T11:00:00Z', china_warehouse: '2024-03-06T13:00:00Z', aicargo: '2024-03-11T10:00:00Z', given_to_client: null },
    { id: 2543, productId: 'CN-880192345680', productName: 'Home Decor', client_registered: '2024-03-03T12:00:00Z', china_warehouse: '2024-03-07T14:00:00Z', aicargo: null, given_to_client: null },
    { id: 2544, productId: 'CN-880192345681', productName: 'Gadgets', client_registered: '2024-03-04T13:00:00Z', china_warehouse: null, aicargo: null, given_to_client: null },
    ...Array.from({ length: 24 }, (_, i) => ({
        id: 2545 + i,
        productId: `CN-9901${100000 + i}`,
        productName: `Product ${i + 1}`,
        client_registered: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
        china_warehouse: i > 5 ? new Date(Date.now() - i * 43200000).toISOString() : null,
        aicargo: i > 12 ? new Date(Date.now() - i * 21600000).toISOString() : null,
        given_to_client: i > 20 ? new Date(Date.now() - i * 10800000).toISOString() : null
    }))
])

const searchValue = ref('')
const currentPage = ref(1)
const perPage = 10

const filteredProducts = computed(() => {
    if (!searchValue.value) return products.value
    const q = searchValue.value.toLowerCase()
    return products.value.filter(p => 
        p.productId.toLowerCase().includes(q) || 
        p.id.toString().includes(q)
    )
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / perPage))
const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return filteredProducts.value.slice(start, start + perPage)
})

const visiblePages = computed(() => {
    const pages = []
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
    return pages
})

const getProductStatus = (product: any) => {
    if (product.given_to_client) return { text: '✅ Выдано', date: product.given_to_client, class: 'emerald' }
    if (product.aicargo) return { text: '📦 На складе', date: product.aicargo, class: 'cyan' }
    if (product.china_warehouse) return { text: '🇨🇳 В Китае', date: product.china_warehouse, class: 'amber' }
    return { text: '📝 Ожидание', date: product.client_registered, class: 'gray' }
}

const formatDate = (time: string | null) => {
    if (!time) return '—'
    return new Date(time).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
}

const toHistory = (productId: string) => {
    router.push(`/superAdmin/track/${productId}`)
}

const handleSearch = () => currentPage.value = 1
</script>

<style scoped>
.global-tracks { padding: 20px; max-width: 1200px; margin: 0 auto; color: #fff; }
.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1); }

@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.page-header { margin-bottom: 24px; }
.breadcrumb { display: flex; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
.breadcrumb a { color: #00d2ff; text-decoration: none; font-weight: 600; }
.title-section h1 { font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -1px; }
.subtitle { color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 4px; }

.glass-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; }

.search-bar { padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 24px; }
.search-input-group { flex: 1; max-width: 400px; display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.05); padding: 10px 16px; border-radius: 12px; }
.search-input-group input { background: transparent; border: none; outline: none; color: #fff; width: 100%; font-size: 14px; font-weight: 600; }

.bar-stats .b-stat { display: flex; flex-direction: column; align-items: flex-end; }
.b-stat .label { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 700; text-transform: uppercase; }
.b-stat .val { font-size: 18px; font-weight: 800; color: #00d2ff; }

.premium-table { width: 100%; border-collapse: collapse; }
.premium-table th { text-align: left; padding: 16px 20px; background: rgba(255,255,255,0.02); font-size: 11px; color: rgba(255,255,255,0.3); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
.premium-table td { padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); }

.id-td { font-size: 12px; color: rgba(255,255,255,0.3); font-weight: 700; }
.track-td .track-id { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: #00d2ff; }

.status-badge { padding: 6px 12px; border-radius: 10px; font-size: 12px; font-weight: 800; }
.status-badge.emerald { background: rgba(46, 204, 113, 0.15); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.2); }
.status-badge.cyan { background: rgba(0, 210, 255, 0.15); color: #00d2ff; border: 1px solid rgba(0, 210, 255, 0.2); }
.status-badge.amber { background: rgba(242, 153, 74, 0.15); color: #f2994a; border: 1px solid rgba(242, 153, 74, 0.2); }
.status-badge.gray { background: rgba(255, 255, 255, 0.05); color: rgba(255,255,255,0.5); }

.date-td { font-size: 13px; color: rgba(255,255,255,0.6); font-weight: 500; }

.hist-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.hist-btn:hover { background: #00d2ff; color: #fff; transform: translateX(4px); box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3); }

.empty-td { padding: 64px 0; text-align: center; }
.empty-msg span { font-size: 48px; display: block; margin-bottom: 16px; opacity: 0.3; }
.empty-msg p { font-size: 16px; color: rgba(255,255,255,0.3); font-weight: 700; }

.pagination { padding: 20px; display: flex; justify-content: center; align-items: center; gap: 12px; }
.page-numbers { display: flex; gap: 6px; }
.page-btn, .num-btn { width: 36px; height: 36px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: #fff; cursor: pointer; font-weight: 700; transition: all 0.2s; }
.num-btn.active { background: #00d2ff; border-color: #00d2ff; box-shadow: 0 4px 10px rgba(0, 210, 255, 0.3); }
.page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.mobile-only { display: none; }
@media (max-width: 900px) {
    .desktop-only { display: none; }
    .mobile-only { display: block; }
    .search-bar { flex-direction: column; align-items: stretch; }
}

.mobile-cards { display: grid; gap: 16px; }
.track-card { padding: 20px; }
.card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.id-tag { font-size: 11px; font-weight: 800; opacity: 0.3; }
.card-badge { padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 900; text-transform: uppercase; }
.card-badge.emerald { background: rgba(46, 204, 113, 0.1); color: #2ecc71; }
.card-badge.cyan { background: rgba(0, 210, 255, 0.1); color: #00d2ff; }
.card-badge.amber { background: rgba(242, 153, 74, 0.1); color: #f2994a; }
.card-badge.gray { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.5); }

.track-id { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 800; color: #fff; margin: 0 0 16px; }

.timestamps { display: grid; gap: 8px; margin-bottom: 20px; }
.ts { display: flex; justify-content: space-between; font-size: 12px; }
.ts .lbl { opacity: 0.4; font-weight: 600; }
.ts .val { font-weight: 700; color: rgba(255,255,255,0.8); }

.m-hist-btn { width: 100%; padding: 12px; border-radius: 12px; border: none; background: rgba(255,255,255,0.05); color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; }
</style>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
