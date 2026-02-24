<template>
  <div class="admin-history animate-slide-up">
    <!-- Premium Header -->
    <header class="history-header">
      <div class="breadcrumb">
        <router-link to="/admin">Рабочий стол</router-link>
        <span class="sep">/</span>
        <span class="current">История сканов</span>
      </div>
      <div class="title-section">
          <h1>История сканов</h1>
          <p class="subtitle">Управление и отслеживание всех импортированных трек-кодов</p>
      </div>
    </header>

    <!-- Interactive Filters -->
    <section class="filters-section glass-card">
      <div class="tabs-container">
        <button v-for="tab in tabs" :key="tab.value" 
                @click="activeTab = tab.value"
                :class="['tab-btn', { active: activeTab === tab.value }]">
          {{ tab.label }}
        </button>
      </div>
      <div class="search-container">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" v-model="searchQuery" placeholder="Поиск по треку, имени или коду..." />
        </div>
      </div>
    </section>

    <!-- Stats Row -->
    <div class="stats-row">
      <div class="mini-stat glass-card">
        <span class="val">{{ stats.total }}</span>
        <span class="lab">Всего</span>
      </div>
      <div class="mini-stat glass-card amber">
        <span class="val">{{ stats.inChina }}</span>
        <span class="lab">В Китае</span>
      </div>
      <div class="mini-stat glass-card cyan">
        <span class="val">{{ stats.atWarehouse }}</span>
        <span class="lab">На складе</span>
      </div>
      <div class="mini-stat glass-card emerald">
        <span class="val">{{ stats.completed }}</span>
        <span class="lab">Выдано</span>
      </div>
    </div>

    <!-- History Data Table -->
    <div class="history-container glass-card">
        <div class="table-header">
            <h2>Список записей</h2>
            <span class="count">{{ filteredProducts.length }} найдено</span>
        </div>
        
        <div class="table-wrapper">
            <table class="premium-table">
                <thead>
                    <tr>
                        <th>Трек-код</th>
                        <th>Клиент</th>
                        <th>Статус</th>
                        <th>🇨🇳 Китай</th>
                        <th>📦 Склад</th>
                        <th>✅ Выдан</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in paginatedProducts" :key="item.id" class="table-row">
                        <td class="mono-td">{{ item.productId }}</td>
                        <td>
                            <div v-if="item.user" class="user-cell">
                                <span class="u-name">{{ item.user.name }} {{ item.user.surname }}</span>
                                <span class="u-code">{{ item.user.code }}</span>
                            </div>
                            <span v-else class="empty-cell">Не привязан</span>
                        </td>
                        <td>
                            <span :class="['status-badge', getStatusClass(item)]">
                                {{ getStatusLabel(item) }}
                            </span>
                        </td>
                        <td class="date-td">{{ formatDate(item.china_warehouse) }}</td>
                        <td class="date-td text-cyan">{{ formatDate(item.aicargo) }}</td>
                        <td class="date-td text-emerald">{{ formatDate(item.given_to_client) }}</td>
                    </tr>
                    <tr v-if="filteredProducts.length === 0">
                        <td colspan="6" class="empty-state">
                            Нет данных для отображения
                        </td>
                    </tr>
                </tbody>
            </table>
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'admin'
})

const activeTab = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = 10

const tabs = [
  { label: 'Все', value: 'all' },
  { label: '🇨🇳 В Китае', value: 'china' },
  { label: '📦 На складе', value: 'warehouse' },
  { label: '✅ Выдано', value: 'completed' }
]

const products = ref([
    { id: 1, productId: '880123456789', china_warehouse: '2024-03-15T10:00:00Z', aicargo: '2024-03-20T12:00:00Z', given_to_client: null, user: { name: 'Александр', surname: 'Ким', code: 'Ai-123' } },
    { id: 2, productId: '880987654321', china_warehouse: '2024-03-18T09:00:00Z', aicargo: null, given_to_client: null, user: { name: 'Мария', surname: 'Иванова', code: 'Ai-456' } },
    { id: 3, productId: '880223344556', china_warehouse: '2024-03-10T08:00:00Z', aicargo: '2024-03-14T15:00:00Z', given_to_client: '2024-03-16T11:00:00Z', user: { name: 'Даурен', surname: 'Мурат', code: 'Ai-789' } },
    { id: 4, productId: '880556677889', china_warehouse: '2024-03-20T14:30:00Z', aicargo: null, given_to_client: null, user: null },
    { id: 5, productId: '880112233445', china_warehouse: '2024-03-21T11:15:00Z', aicargo: null, given_to_client: null, user: { name: 'Елена', surname: 'Ли', code: 'Ai-012' } },
    ...Array.from({ length: 15 }, (_, i) => ({
        id: 10 + i,
        productId: `880${1000000 + i}`,
        china_warehouse: '2024-03-19T10:00:00Z',
        aicargo: i % 2 === 0 ? '2024-03-21T12:00:00Z' : null,
        given_to_client: i % 4 === 0 ? '2024-03-22T09:00:00Z' : null,
        user: { name: 'Тест', surname: 'Пользователь', code: `T-${100 + i}` }
    }))
])

const stats = computed(() => ({
  total: products.value.length,
  inChina: products.value.filter(p => p.china_warehouse && !p.aicargo && !p.given_to_client).length,
  atWarehouse: products.value.filter(p => p.aicargo && !p.given_to_client).length,
  completed: products.value.filter(p => p.given_to_client).length
}))

const filteredProducts = computed(() => {
  let result = products.value
  if (activeTab.value === 'china') result = result.filter(p => p.china_warehouse && !p.aicargo)
  else if (activeTab.value === 'warehouse') result = result.filter(p => p.aicargo && !p.given_to_client)
  else if (activeTab.value === 'completed') result = result.filter(p => p.given_to_client)

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.productId.toLowerCase().includes(q) || 
      p.user?.name.toLowerCase().includes(q) || 
      p.user?.code.toLowerCase().includes(q)
    )
  }
  return result
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

const getStatusLabel = (item: any) => {
  if (item.given_to_client) return '✅ Выдано'
  if (item.aicargo) return '📦 Склад'
  return '🇨🇳 Китай'
}

const getStatusClass = (item: any) => {
  if (item.given_to_client) return 'emerald'
  if (item.aicargo) return 'cyan'
  return 'amber'
}

const formatDate = (date: string | null) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

watch([activeTab, searchQuery], () => currentPage.value = 1)
</script>

<style scoped>
.admin-history { padding: 20px; max-width: 1000px; margin: 0 auto; color: #fff; }
.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1); }

@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.history-header { margin-bottom: 32px; }
.breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 12px; }
.breadcrumb a { color: #00d2ff; text-decoration: none; font-weight: 600; }
.breadcrumb .current { color: rgba(255,255,255,0.6); }

.title-section h1 { font-size: 32px; font-weight: 900; margin: 0 0 8px; letter-spacing: -1px; }
.subtitle { color: rgba(255,255,255,0.6); margin: 0; }

.glass-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; }

.filters-section { padding: 8px; display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 24px; }
.tabs-container { display: flex; gap: 4px; }
.tab-btn { padding: 10px 16px; border-radius: 16px; border: none; background: transparent; color: rgba(255,255,255,0.5); font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; }
.tab-btn.active { background: rgba(255,255,255,0.1); color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

.search-container { flex: 1; max-width: 400px; }
.search-box { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.search-box input { background: transparent; border: none; outline: none; color: #fff; width: 100%; font-size: 14px; font-weight: 600; }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
.mini-stat { padding: 16px; text-align: center; }
.mini-stat .val { font-size: 20px; font-weight: 800; display: block; }
.mini-stat .lab { font-size: 12px; color: rgba(255,255,255,0.5); font-weight: 700; }
.mini-stat.amber .val { color: #f2994a; }
.mini-stat.cyan .val { color: #00d2ff; }
.mini-stat.emerald .val { color: #2ecc71; }

.history-container { overflow: hidden; }
.table-header { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; }
.table-header h2 { font-size: 18px; font-weight: 800; margin: 0; }
.table-header .count { font-size: 12px; color: rgba(255,255,255,0.4); font-weight: 700; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 10px; }

.table-wrapper { overflow-x: auto; }
.premium-table { width: 100%; border-collapse: collapse; }
.premium-table th { text-align: left; padding: 16px 24px; background: rgba(255,255,255,0.02); font-size: 12px; color: rgba(255,255,255,0.3); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
.premium-table td { padding: 16px 24px; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); }

.mono-td { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #00d2ff; }
.user-cell { display: flex; flex-direction: column; gap: 2px; }
.u-name { font-weight: 700; }
.u-code { font-size: 12px; color: rgba(255,255,255,0.4); font-weight: 600; }
.empty-cell { font-style: italic; color: rgba(255,255,255,0.2); }

.status-badge { padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 700; }
.status-badge.emerald { background: rgba(46, 204, 113, 0.15); color: #2ecc71; }
.status-badge.cyan { background: rgba(0, 210, 255, 0.15); color: #00d2ff; }
.status-badge.amber { background: rgba(242, 153, 74, 0.15); color: #f2994a; }

.date-td { color: rgba(255,255,255,0.5); font-weight: 600; font-size: 13px; }
.text-cyan { color: #00d2ff; }
.text-emerald { color: #2ecc71; }

.pagination { padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; }
.page-numbers { display: flex; gap: 6px; }
.page-btn, .num-btn { width: 36px; height: 36px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; font-weight: 700; }
.num-btn.active { background: #00d2ff; border-color: #00d2ff; box-shadow: 0 4px 10px rgba(0, 210, 255, 0.3); }
.page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

@media (max-width: 768px) {
    .filters-section { flex-direction: column; align-items: stretch; }
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .premium-table th:nth-child(4), .premium-table td:nth-child(4),
    .premium-table th:nth-child(5), .premium-table td:nth-child(5),
    .premium-table th:nth-child(6), .premium-table td:nth-child(6) { display: none; }
}
</style>
