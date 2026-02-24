<template>
  <div class="tw-py-6 animate-fadeIn">
    <!-- Header -->
    <div class="tw-mb-6">
      <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-mb-4">
        <router-link class="tw-text-cyan-400 hover:tw-text-cyan-300 tw-transition-colors" to="/admin">Главная</router-link>
        <span class="tw-text-white/30">→</span>
        <span class="tw-text-white/50">Принять товары</span>
      </div>
      <h1 class="tw-text-2xl tw-font-bold tw-text-white tw-mb-2">Принять товары</h1>
      <p class="tw-text-white/50">Сканируйте штрих-код или введите трек-код вручную</p>
    </div>

    <!-- Scanner Card -->
    <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-5 tw-mb-4">
      <div class="tw-flex tw-items-center tw-justify-between tw-gap-4">
        <div class="tw-flex tw-items-center tw-gap-3 tw-flex-1">
          <div class="tw-w-12 tw-h-12 tw-rounded-xl tw-bg-gradient-to-br tw-from-emerald-500 tw-to-green-600 tw-flex tw-items-center tw-justify-center tw-text-white tw-flex-shrink-0">
            <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
            </svg>
          </div>
          <input
            ref="scannerInput"
            v-model="scannerCode"
            @keyup.enter="handleScannerInput"
            type="text"
            placeholder="Сканируйте штрих-код..."
            class="tw-flex-1 tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-px-4 tw-py-3 tw-text-white placeholder:tw-text-white/30 tw-outline-none focus:tw-border-emerald-500/50 tw-transition-colors"
            autofocus
          >
        </div>
        <button 
          @click="finishScanning"
          class="tw-px-5 tw-py-3 tw-bg-emerald-500/20 tw-border tw-border-emerald-500/30 tw-rounded-xl tw-text-emerald-400 tw-font-semibold hover:tw-bg-emerald-500/30 tw-transition-all tw-flex tw-items-center tw-gap-2"
        >
          <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Завершить
        </button>
      </div>
    </div>

    <!-- Manual Input -->
    <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-5 tw-mb-6">
      <p class="tw-text-white/50 tw-text-sm tw-mb-3">Или введите трек-код вручную</p>
      <div class="tw-flex tw-items-center tw-gap-3">
        <input
          v-model="manualCode"
          @keyup.enter="addManualCode"
          type="text"
          placeholder="Введите трек-код"
          class="tw-flex-1 sm:tw-max-w-xs tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-px-4 tw-py-3 tw-text-white placeholder:tw-text-white/30 tw-outline-none focus:tw-border-cyan-500/50 tw-transition-colors"
        >
        <button 
          @click="addManualCode"
          :disabled="!manualCode || loading"
          class="tw-px-5 tw-py-3 tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-rounded-xl tw-text-white tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-cyan-500/30 tw-transition-all disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-flex tw-items-center tw-gap-2"
        >
          <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Добавить
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 tw-gap-4 tw-mb-6" v-if="addedProducts.length > 0">
      <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-xl tw-p-4 tw-text-center">
        <p class="tw-text-2xl tw-font-bold tw-text-white">{{ addedProducts.length }}</p>
        <p class="tw-text-white/50 tw-text-sm">Всего</p>
      </div>
      <div class="tw-bg-emerald-500/10 tw-border tw-border-emerald-500/20 tw-rounded-xl tw-p-4 tw-text-center">
        <p class="tw-text-2xl tw-font-bold tw-text-emerald-400">{{ addedProducts.filter(p => p.success).length }}</p>
        <p class="tw-text-emerald-400/70 tw-text-sm">Успешно</p>
      </div>
      <div class="tw-bg-red-500/10 tw-border tw-border-red-500/20 tw-rounded-xl tw-p-4 tw-text-center">
        <p class="tw-text-2xl tw-font-bold tw-text-red-400">{{ addedProducts.filter(p => !p.success).length }}</p>
        <p class="tw-text-red-400/70 tw-text-sm">Ошибки</p>
      </div>
    </div>

    <!-- Products Table -->
    <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-overflow-hidden">
      <div class="tw-px-5 tw-py-4 tw-border-b tw-border-white/10">
        <h2 class="tw-text-lg tw-font-semibold tw-text-white">Добавленные товары</h2>
      </div>
      
      <!-- Table Header -->
      <div class="tw-hidden sm:tw-grid tw-grid-cols-2 tw-gap-4 tw-px-5 tw-py-3 tw-bg-white/[0.02] tw-border-b tw-border-white/10">
        <span class="tw-text-white/50 tw-text-sm tw-font-medium">Трек-код</span>
        <span class="tw-text-white/50 tw-text-sm tw-font-medium">Статус</span>
      </div>

      <!-- Table Body -->
      <div class="tw-divide-y tw-divide-white/5">
        <div 
          v-for="(item, index) in addedProducts" 
          :key="index" 
          class="tw-px-5 tw-py-4 hover:tw-bg-white/[0.02] tw-transition-colors"
        >
          <div class="tw-flex tw-flex-col sm:tw-grid sm:tw-grid-cols-2 tw-gap-2 sm:tw-gap-4">
            <div>
              <span class="tw-text-white/40 tw-text-xs sm:tw-hidden">Трек-код:</span>
              <p class="tw-text-white tw-font-mono">{{ item.trackCode }}</p>
            </div>
            <div class="tw-flex tw-items-center tw-gap-2">
              <span 
                :class="[
                  'tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium',
                  item.success 
                    ? 'tw-bg-emerald-500/20 tw-text-emerald-400' 
                    : 'tw-bg-red-500/20 tw-text-red-400'
                ]"
              >
                {{ item.success ? '✓' : '✗' }} {{ item.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="addedProducts.length === 0" class="tw-px-5 tw-py-16 tw-text-center">
          <div class="tw-w-16 tw-h-16 tw-rounded-2xl tw-bg-white/5 tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4">
            <svg class="tw-w-8 tw-h-8 tw-text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <p class="tw-text-white/50">Сканируйте или введите трек-код для начала</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'warehouse',
    middleware: 'auth'
})

import { ref, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'

const toast = useToast()
const { $axios } = useNuxtApp()
const token = useCookie('token')

const scannerInput = ref<HTMLInputElement | null>(null)
const scannerCode = ref('')
const manualCode = ref('')
const loading = ref(false)

interface AddedProduct {
  trackCode: string
  status: string
  success: boolean
}

const addedProducts = ref<AddedProduct[]>([])

onMounted(() => {
  scannerInput.value?.focus()
})

const handleScannerInput = async () => {
  if (!scannerCode.value.trim()) return
  
  await addProduct(scannerCode.value.trim())
  scannerCode.value = ''
  scannerInput.value?.focus()
}

const addManualCode = async () => {
  if (!manualCode.value.trim()) return
  
  await addProduct(manualCode.value.trim())
  manualCode.value = ''
}

const addProduct = async (trackCode: string) => {
  loading.value = true
  
  try {
    await $axios.post(
      '/admin/tracks',
      { productId: trackCode },
      {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }
    )
    
    addedProducts.value.unshift({
      trackCode,
      status: 'Добавлено',
      success: true
    })
    
    toast.success(`Товар ${trackCode} добавлен!`, { position: 'top-center' })
    
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Ошибка'
    
    addedProducts.value.unshift({
      trackCode,
      status: errorMessage,
      success: false
    })
    
    toast.error(`Ошибка: ${errorMessage}`, { position: 'top-center' })
  } finally {
    loading.value = false
  }
}

const finishScanning = () => {
  const successCount = addedProducts.value.filter(p => p.success).length
  toast.success(`Сканирование завершено. Добавлено: ${successCount} товаров`, { position: 'top-center' })
}
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
