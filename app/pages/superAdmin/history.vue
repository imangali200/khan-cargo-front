<template>
  <div class="tw-py-6 animate-fadeIn">
    <!-- Header -->
    <div class="tw-mb-6">
      <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-mb-4">
        <router-link class="tw-text-cyan-400 hover:tw-text-cyan-300 tw-transition-colors" to="/superAdmin">Главная</router-link>
        <span class="tw-text-white/60">→</span>
        <span class="tw-text-white/60">Импортированные треки</span>
      </div>
      <h1 class="tw-text-2xl tw-font-bold tw-text-white tw-mb-2">Импортированные треки</h1>
      <p class="tw-text-white/60">Все импортированные треки и их статусы</p>
    </div>

    <!-- Filters -->
    <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-4 tw-mb-6">
      <div class="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 tw-items-start sm:tw-items-center tw-justify-between">
        <!-- Tab Filters -->
        <div class="tw-flex tw-flex-wrap tw-gap-2">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="[
              'tw-px-4 tw-py-2 tw-rounded-xl tw-text-sm tw-font-medium tw-transition-all',
              activeTab === tab.value 
                ? 'tw-bg-cyan-500 tw-text-white tw-shadow-lg tw-shadow-cyan-500/30' 
                : 'tw-bg-white/5 tw-text-white/60 hover:tw-bg-white/10'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Search -->
        <div class="tw-flex tw-items-center tw-gap-2">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Поиск по трек-коду, имя, телефон, код..."
            class="tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-px-3 tw-py-2 tw-text-white tw-text-sm tw-outline-none focus:tw-border-cyan-500/50 placeholder:tw-text-white/60"
          >
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-4 tw-gap-4 tw-mb-6">
      <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-xl tw-p-4 tw-text-center">
        <p class="tw-text-2xl tw-font-bold tw-text-white">{{ stats.total }}</p>
        <p class="tw-text-white/60 tw-text-sm">Все</p>
      </div>
      <div class="tw-bg-amber-500/10 tw-border tw-border-amber-500/20 tw-rounded-xl tw-p-4 tw-text-center">
        <p class="tw-text-2xl tw-font-bold tw-text-amber-400">{{ stats.inChina }}</p>
        <p class="tw-text-amber-400/70 tw-text-sm">🇨🇳 В Китае</p>
      </div>
      <div class="tw-bg-cyan-500/10 tw-border tw-border-cyan-500/20 tw-rounded-xl tw-p-4 tw-text-center">
        <p class="tw-text-2xl tw-font-bold tw-text-cyan-400">{{ stats.atWarehouse }}</p>
        <p class="tw-text-cyan-400/70 tw-text-sm">📦 На складе</p>
      </div>
      <div class="tw-bg-emerald-500/10 tw-border tw-border-emerald-500/20 tw-rounded-xl tw-p-4 tw-text-center">
        <p class="tw-text-2xl tw-font-bold tw-text-emerald-400">{{ stats.completed }}</p>
        <p class="tw-text-emerald-400/70 tw-text-sm">✅ Выдано</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="tw-text-center tw-py-16">
      <div class="tw-w-12 tw-h-12 tw-border-4 tw-border-cyan-500/20 tw-border-t-cyan-500 tw-rounded-full tw-animate-spin tw-mx-auto"></div>
      <p class="tw-mt-4 tw-text-white/60">Загрузка...</p>
    </div>

    <!-- History List -->
    <div v-else class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-overflow-hidden">
      <div class="tw-px-5 tw-py-4 tw-border-b tw-border-white/10 tw-flex tw-items-center tw-justify-between">
        <h2 class="tw-text-lg tw-font-semibold tw-text-white">Список треков</h2>
        <span class="tw-text-white/60 tw-text-sm">{{ filteredProducts.length }} записей</span>
      </div>
      
      <!-- Table Header -->
      <div class="tw-hidden lg:tw-grid tw-grid-cols-12 tw-gap-4 tw-px-5 tw-py-3 tw-bg-white/[0.02] tw-border-b tw-border-white/10">
        <span class="tw-col-span-2 tw-text-white/60 tw-text-sm tw-font-medium">Трек-код</span>
        <span class="tw-col-span-3 tw-text-white/60 tw-text-sm tw-font-medium">Клиент</span>
        <span class="tw-col-span-2 tw-text-white/60 tw-text-sm tw-font-medium">Статус</span>
        <span class="tw-col-span-2 tw-text-white/60 tw-text-sm tw-font-medium">🇨🇳 В Китае</span>
        <span class="tw-col-span-2 tw-text-white/60 tw-text-sm tw-font-medium">📦 На складе</span>
        <span class="tw-col-span-1 tw-text-white/60 tw-text-sm tw-font-medium">✅ Выдан</span>
      </div>

      <!-- Table Body -->
      <div class="tw-divide-y tw-divide-white/5">
        <div 
          v-for="item in paginatedProducts" 
          :key="item.id" 
          class="tw-px-5 tw-py-4 hover:tw-bg-white/[0.02] tw-transition-colors"
        >
          <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-2 lg:tw-gap-4 tw-items-center">
            <!-- Track Code -->
            <div class="tw-col-span-2">
              <span class="tw-text-white/60 tw-text-xs lg:tw-hidden">Трек-код: </span>
              <span class="tw-text-white tw-font-mono tw-font-medium tw-text-sm">{{ item.productId }}</span>
            </div>
            
            <!-- Client Info -->
            <div class="tw-col-span-3">
              <span class="tw-text-white/60 tw-text-xs lg:tw-hidden">Клиент: </span>
              <div v-if="item.user" class="tw-flex tw-flex-col">
                <span class="tw-text-white tw-text-sm tw-font-medium">{{ item.user.name }} {{ item.user.surname }}</span>
                <div class="tw-flex tw-items-center tw-gap-2 tw-text-xs tw-text-white/50">
                  <span>📱 {{ item.user.phoneNumber }}</span>
                  <span class="tw-px-1.5 tw-py-0.5 tw-bg-purple-500/20 tw-text-purple-400 tw-rounded">{{ item.user.code }}</span>
                </div>
              </div>
              <span v-else class="tw-text-white/40 tw-text-sm tw-italic">Не привязан</span>
            </div>
            
            <!-- Status -->
            <div class="tw-col-span-2">
              <span 
                :class="[
                  'tw-px-2.5 tw-py-1 tw-rounded-lg tw-text-xs tw-font-medium',
                  getStatusStyle(item)
                ]"
              >
                {{ getStatusLabel(item) }}
              </span>
            </div>
            
            <!-- China Date -->
            <div class="tw-col-span-2">
              <span class="tw-text-white/60 tw-text-xs lg:tw-hidden">🇨🇳 В Китае: </span>
              <span class="tw-text-amber-400/80 tw-text-sm">{{ formatDate(item.china_warehouse) }}</span>
            </div>
            
            <!-- Warehouse Date -->
            <div class="tw-col-span-2">
              <span class="tw-text-white/60 tw-text-xs lg:tw-hidden">📦 На складе: </span>
              <span class="tw-text-cyan-400/80 tw-text-sm">{{ formatDate(item.aicargo) }}</span>
            </div>
            
            <!-- Given Date -->
            <div class="tw-col-span-1">
              <span class="tw-text-white/60 tw-text-xs lg:tw-hidden">✅ Выдан: </span>
              <span class="tw-text-emerald-400/80 tw-text-sm">{{ formatDate(item.given_to_client) }}</span>
            </div>
          </div>

          <!-- Timeline (mobile) -->
          <div class="tw-mt-3 tw-flex tw-flex-wrap tw-gap-2 lg:tw-hidden">
            <span v-if="item.china_warehouse" class="tw-px-2 tw-py-0.5 tw-bg-amber-500/20 tw-text-amber-400 tw-text-xs tw-rounded">🇨🇳 В Китае</span>
            <span v-if="item.aicargo" class="tw-px-2 tw-py-0.5 tw-bg-cyan-500/20 tw-text-cyan-400 tw-text-xs tw-rounded">📦 На складе</span>
            <span v-if="item.given_to_client" class="tw-px-2 tw-py-0.5 tw-bg-emerald-500/20 tw-text-emerald-400 tw-text-xs tw-rounded">✅ Выдано</span>
            <span v-if="item.user" class="tw-px-2 tw-py-0.5 tw-bg-purple-500/20 tw-text-purple-400 tw-text-xs tw-rounded">👤 {{ item.user.code }}</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="paginatedProducts.length === 0" class="tw-px-5 tw-py-16 tw-text-center">
          <div class="tw-w-16 tw-h-16 tw-rounded-2xl tw-bg-white/5 tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4">
            <svg class="tw-w-8 tw-h-8 tw-text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <p class="tw-text-white/60">Треки не найдены</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="tw-px-5 tw-py-4 tw-border-t tw-border-white/10 tw-flex tw-items-center tw-justify-between">
        <div class="tw-text-white/60 tw-text-sm">
          Страница {{ currentPage }} из {{ totalPages }} ({{ filteredProducts.length }} записей)
        </div>
        <div class="tw-flex tw-items-center tw-gap-2">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            :class="[
              'tw-px-3 tw-py-2 tw-rounded-lg tw-text-sm tw-font-medium tw-transition-all',
              currentPage === 1 
                ? 'tw-bg-white/5 tw-text-white/30 tw-cursor-not-allowed' 
                : 'tw-bg-white/10 tw-text-white hover:tw-bg-white/20'
            ]"
          >
            ← Назад
          </button>
          
          <div class="tw-flex tw-items-center tw-gap-1">
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="currentPage = page"
              :class="[
                'tw-w-10 tw-h-10 tw-rounded-lg tw-text-sm tw-font-medium tw-transition-all',
                currentPage === page 
                  ? 'tw-bg-cyan-500 tw-text-white tw-shadow-lg tw-shadow-cyan-500/30' 
                  : 'tw-bg-white/5 tw-text-white/60 hover:tw-bg-white/10'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            :class="[
              'tw-px-3 tw-py-2 tw-rounded-lg tw-text-sm tw-font-medium tw-transition-all',
              currentPage === totalPages 
                ? 'tw-bg-white/5 tw-text-white/30 tw-cursor-not-allowed' 
                : 'tw-bg-white/10 tw-text-white hover:tw-bg-white/20'
            ]"
          >
            Вперед →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'admin',
    middleware: 'auth'
})

import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '~/composables/useToast'

const toast = useToast()
const { $axios } = useNuxtApp()
const token = useCookie('token')

const loading = ref(false)
const activeTab = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = 20

const tabs = [
  { label: 'Все', value: 'all' },
  { label: '🇨🇳 В Китае', value: 'china' },
  { label: '📦 На складе', value: 'warehouse' },
  { label: '✅ Выдано', value: 'completed' }
]

interface User {
  id: number
  phoneNumber: string
  name: string
  surname: string
  code: string
  branch: string
}

interface Product {
  id: number
  productId: string
  china_warehouse: string | null
  aicargo: string | null
  given_to_client: string | null
  user: User | null
  createdAt: string
  updatedAt: string
}

const products = ref<Product[]>([])

const stats = computed(() => ({
  total: products.value.length,
  inChina: products.value.filter(p => p.china_warehouse && !p.aicargo && !p.given_to_client).length,
  atWarehouse: products.value.filter(p => p.aicargo && !p.given_to_client).length,
  completed: products.value.filter(p => p.given_to_client).length
}))

const filteredProducts = computed(() => {
  let result = products.value

  // Filter by tab
  if (activeTab.value === 'china') {
    result = result.filter(p => p.china_warehouse && !p.aicargo && !p.given_to_client)
  } else if (activeTab.value === 'warehouse') {
    result = result.filter(p => p.aicargo && !p.given_to_client)
  } else if (activeTab.value === 'completed') {
    result = result.filter(p => p.given_to_client)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.productId.toLowerCase().includes(query) || 
      (p.user?.name && p.user.name.toLowerCase().includes(query)) ||
      (p.user?.phoneNumber && p.user.phoneNumber.includes(query)) ||
      (p.user?.code && p.user.code.toLowerCase().includes(query))
    )
  }

  return result
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / perPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return filteredProducts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Reset page when filters change
watch([activeTab, searchQuery], () => {
  currentPage.value = 1
})

const getStatusLabel = (item: Product) => {
  if (item.given_to_client) return '✅ Выдано'
  if (item.aicargo) return '📦 На складе'
  if (item.china_warehouse) return '🇨🇳 В Китае'
  return '⏳ Ожидание'
}

const getStatusStyle = (item: Product) => {
  if (item.given_to_client) return 'tw-bg-emerald-500/20 tw-text-emerald-400'
  if (item.aicargo) return 'tw-bg-cyan-500/20 tw-text-cyan-400'
  if (item.china_warehouse) return 'tw-bg-amber-500/20 tw-text-amber-400'
  return 'tw-bg-gray-500/20 tw-text-gray-400'
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchProducts = async () => {
  loading.value = true
  
  try {
    const res = await $axios.get('admin/imported-tracks', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    products.value = res.data || []
    
  } catch (err: any) {
    console.error('Products fetch error:', err)
    toast.error('Ошибка при загрузке треков', { position: 'top-center' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

