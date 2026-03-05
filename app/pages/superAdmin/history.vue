<template>
  <div class="history-page">
    <!-- Header -->
    <div class="page-top">
      <div class="page-title-area">
        <h1>Список треков <span class="record-badge">{{ filteredProducts.length }} записей</span></h1>
      </div>
      <router-link to="/superAdmin/create-track" class="add-track-btn" v-if="false">
        <span>+</span> Добавить трек
      </router-link>
    </div>

    <!-- Filters Row -->
    <div class="filters-row">
      <div class="tab-filters">
        <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
          :class="['tab-btn', { active: activeTab === tab.value }]">
          {{ tab.label }}
        </button>
      </div>
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" v-model="searchQuery" placeholder="Поиск по трек-коду или клиенту..." />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Загрузка...</p>
    </div>

    <!-- Table -->
    <div v-else class="table-container">
      <div class="table-wrapper">
        <table class="tracks-table">
          <thead>
            <tr>
              <th>ТРЕК-КОД</th>
              <th>КЛИЕНТ</th>
              <th>СТАТУС</th>
              <th>В КИТАЕ</th>
              <th>НА СКЛАДЕ</th>
              <th>ВЫДАН</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedProducts" :key="item.id" class="table-row">
              <td>
                <div class="track-code-cell">
                  <span class="track-code">{{ item.trackingCode }}</span>
                  <button class="copy-btn" @click="copyTrackCode(item.trackingCode)" title="Копировать">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
              </td>
              <td>
                <div v-if="item.clientName" class="client-cell">
                  <div class="client-avatar">{{ getInitials(item) }}</div>
                  <span class="client-name">{{ item.clientName }}</span>
                </div>
                <span v-else class="no-client">Не привязан</span>
              </td>
              <td>
                <span class="status-pill" :class="getStatusClass(item)">
                  <span class="status-dot-icon" :class="getStatusClass(item)"></span>
                  {{ getStatusLabel(item) }}
                </span>
              </td>
              <td class="date-cell">{{ formatDate(item.chinaArrivalDate) }}</td>
              <td class="date-cell">{{ formatDate(item.aicargoArrivalDate) }}</td>
              <td class="date-cell">{{ formatDate(item.deliveryDate) }}</td>
            </tr>

            <!-- Empty -->
            <tr v-if="paginatedProducts.length === 0">
              <td colspan="6" class="empty-state">
                <p>Треки не найдены</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="table-footer">
        <span class="showing-text">Показано <strong>{{ getShowingRange() }}</strong> из
          <strong>{{ filteredProducts.length }}</strong></span>
        <div v-if="totalPages > 1" class="pagination">
          <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div class="page-numbers">
            <button v-for="p in visiblePages" :key="p" @click="currentPage = p"
              :class="['num-btn', { active: currentPage === p }]">{{ p }}</button>
          </div>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'super-admin'
})

import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '~/composables/useToast'
import type { TrackingItem } from '~/types'

const toast = useToast()
const api = useApi()

const loading = ref(false)
const activeTab = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = 20

const tabs = [
  { label: 'Все', value: 'all' },
  { label: 'В пути', value: 'china' },
  { label: 'На складе', value: 'warehouse' },
  { label: 'Выдано', value: 'completed' }
]

const products = ref<TrackingItem[]>([])

const filteredProducts = computed(() => {
  let result = products.value

  if (activeTab.value === 'china') {
    result = result.filter(p => p.currentStatus === 'ARRIVED_CHINA_WAREHOUSE')
  } else if (activeTab.value === 'warehouse') {
    result = result.filter(p => p.currentStatus === 'ARRIVED_BRANCH')
  } else if (activeTab.value === 'completed') {
    result = result.filter(p => p.currentStatus === 'PICKED_UP')
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.trackingCode.toLowerCase().includes(query) ||
      (p.clientName && p.clientName.toLowerCase().includes(query)) ||
      (p.clientPhone && p.clientPhone.includes(query))
    )
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / perPage) || 1)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredProducts.value.slice(start, start + perPage)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

watch([activeTab, searchQuery], () => { currentPage.value = 1 })

const getStatusLabel = (item: TrackingItem) => {
  if (item.currentStatus === 'PICKED_UP') return 'Выдан'
  if (item.currentStatus === 'ARRIVED_BRANCH') return 'На складе'
  if (item.currentStatus === 'ARRIVED_CHINA_WAREHOUSE') return 'В пути'
  return 'Ожидание'
}

const getStatusClass = (item: TrackingItem) => {
  if (item.currentStatus === 'PICKED_UP') return 'st-completed'
  if (item.currentStatus === 'ARRIVED_BRANCH') return 'st-warehouse'
  if (item.currentStatus === 'ARRIVED_CHINA_WAREHOUSE') return 'st-transit'
  return 'st-pending'
}

const getInitials = (item: TrackingItem) => {
  if (!item.clientName) return '??'
  const parts = item.clientName.split(' ')
  const first = parts[0]?.charAt(0)?.toUpperCase() || ''
  const last = parts[1]?.charAt(0)?.toUpperCase() || ''
  return first + last
}

const copyTrackCode = (code: string) => {
  navigator.clipboard.writeText(code)
  toast.success('Трек-код скопирован')
}

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const getShowingRange = () => {
  if (filteredProducts.value.length === 0) return '0-0'
  const start = (currentPage.value - 1) * perPage + 1
  const end = Math.min(currentPage.value * perPage, filteredProducts.value.length)
  return `${start}-${end}`
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const { data } = await api.tracking.findAll({ limit: 1000 })
    products.value = data.data
  } catch (err: any) {
    toast.error('Ошибка при загрузке треков')
  } finally {
    loading.value = false
  }
}

onMounted(() => { fetchProducts() })
</script>

<style scoped>
.history-page {
  padding: 24px 32px;
  font-family: 'Inter', -apple-system, sans-serif;
  color: #e4e4e7;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.page-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title-area h1 {
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.record-badge {
  font-size: 12px;
  font-weight: 500;
  color: #a1a1aa;
  background-color: #27272a;
  padding: 4px 10px;
  border-radius: 6px;
}

.add-track-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s;
}

.add-track-btn:hover {
  background-color: #2563eb;
}

/* Filters */
.filters-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
}

.tab-filters {
  display: flex;
  gap: 4px;
}

.tab-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
  color: #71717a;
}

.tab-btn:hover {
  background-color: #27272a;
  color: #e4e4e7;
}

.tab-btn.active {
  background-color: #3b82f6;
  color: white;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box .search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #52525b;
}

.search-box input {
  width: 100%;
  height: 40px;
  padding: 0 12px 0 38px;
  background-color: #18181b;
  border: 1px solid #27272a;
  border-radius: 8px;
  color: #e4e4e7;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.search-box input:focus {
  border-color: #3b82f6;
}

.search-box input::placeholder {
  color: #52525b;
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 80px 0;
  color: #71717a;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #27272a;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 0 auto 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Table */
.table-container {
  background-color: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.tracks-table {
  width: 100%;
  border-collapse: collapse;
}

.tracks-table thead th {
  text-align: left;
  padding: 14px 20px;
  font-size: 11px;
  font-weight: 600;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #27272a;
  white-space: nowrap;
}

.tracks-table tbody tr {
  border-bottom: 1px solid #1e1e20;
  transition: background-color 0.15s;
}

.tracks-table tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

.tracks-table tbody tr:last-child {
  border-bottom: none;
}

.tracks-table td {
  padding: 16px 20px;
  font-size: 13px;
  vertical-align: middle;
  white-space: nowrap;
}

/* Track Code */
.track-code-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.track-code {
  color: #3b82f6;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
}

.copy-btn {
  background: none;
  border: none;
  color: #52525b;
  cursor: pointer;
  padding: 2px;
  transition: color 0.2s;
}

.copy-btn:hover {
  color: #a1a1aa;
}

.copy-btn svg {
  width: 14px;
  height: 14px;
}

/* Client */
.client-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.client-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #27272a;
  color: #a1a1aa;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.client-name {
  color: #e4e4e7;
  font-weight: 500;
}

.no-client {
  color: #52525b;
  font-style: italic;
}

/* Status */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.status-dot-icon {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.st-completed {
  background-color: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.st-completed.status-dot-icon {
  background-color: #4ade80;
}

.st-warehouse {
  background-color: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

.st-warehouse.status-dot-icon {
  background-color: #fbbf24;
}

.st-transit {
  background-color: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.st-transit.status-dot-icon {
  background-color: #60a5fa;
}

.st-pending {
  background-color: rgba(113, 113, 122, 0.15);
  color: #a1a1aa;
}

.st-pending.status-dot-icon {
  background-color: #a1a1aa;
}

/* Dates */
.date-cell {
  color: #a1a1aa;
  font-size: 13px;
}

/* Empty */
.empty-state {
  text-align: center;
  padding: 60px 20px !important;
  color: #52525b;
}

/* Footer / Pagination */
.table-footer {
  padding: 14px 20px;
  border-top: 1px solid #27272a;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.showing-text {
  font-size: 13px;
  color: #71717a;
}

.showing-text strong {
  color: #e4e4e7;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #27272a;
  border: none;
  border-radius: 6px;
  color: #71717a;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background-color: #3f3f46;
  color: #e4e4e7;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-btn svg {
  width: 14px;
  height: 14px;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.num-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #27272a;
  border: none;
  border-radius: 6px;
  color: #a1a1aa;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.num-btn:hover {
  background-color: #3f3f46;
}

.num-btn.active {
  background-color: #3b82f6;
  color: white;
}

@media (max-width: 768px) {
  .history-page {
    padding: 16px;
  }

  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    width: 100%;
  }

  .table-footer {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
