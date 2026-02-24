<script setup lang="ts">
definePageMeta({
    layout: 'warehouse',
    middleware: 'auth'
})

import { ref } from 'vue'
import { useToast } from '~/composables/useToast'

const toast = useToast()
const { $axios } = useNuxtApp()
const token = useCookie('token')

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const selectedTime = ref<string>(getDefaultTime())
const loading = ref<boolean>(false)

function getDefaultTime(): string {
  const now = new Date()
  return now.toISOString().slice(0, 16)
}

function formatTimeForApi(datetimeLocal: string): string {
  return datetimeLocal.replace("T", " ")
}

const openFilePicker = () => {
  fileInput.value?.click()
}

const onFileChange = (e: any) => {
  selectedFile.value = e.target.files[0]
}

const uploadFile = async () => {
  if (!selectedFile.value) {
    toast.error("Файл не выбран!", { position: 'top-center' })
    return
  }

  if (!selectedTime.value) {
    toast.error("Время не выбрано!", { position: 'top-center' })
    return
  }

  loading.value = true

  try {
    const formData = new FormData()
    formData.append("file", selectedFile.value)
    formData.append("time", formatTimeForApi(selectedTime.value))

    await $axios.post(
      "/admin/tracks/uploads-taraz",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "multipart/form-data"
        }
      }
    )

    toast.success("Файл успешно загружен!", { position: 'top-center' })
    selectedFile.value = null

  } catch (err) {
    toast.error("Ошибка при загрузке файла", { position: 'top-center' })
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="tw-py-6 animate-fadeIn">
    <div class="tw-mb-6">
      <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-mb-4">
        <router-link class="tw-text-amber-400 hover:tw-text-amber-300 tw-transition-colors" to="/admin">Главная</router-link>
        <span class="tw-text-white/60">→</span>
        <span class="tw-text-white/60">Импорт</span>
      </div>
      <h1 class="tw-text-2xl tw-font-bold tw-text-white tw-mb-2">Импорт трек-кодов</h1>
      <p class="tw-text-white/60">Загрузите файл с трек-кодами для массового добавления</p>
    </div>

    <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-6 tw-mb-6">
      <div class="tw-flex tw-items-center tw-gap-3 tw-mb-6">
        <div class="tw-w-12 tw-h-12 tw-rounded-xl tw-bg-gradient-to-br tw-from-amber-500 tw-to-orange-600 tw-flex tw-items-center tw-justify-center tw-text-white">
          <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
        </div>
        <div>
          <h2 class="tw-text-lg tw-font-semibold tw-text-white">Загрузка файла</h2>
          <p class="tw-text-white/60 tw-text-sm">Выберите файл .xlsx или .txt</p>
        </div>
      </div>

      <div class="tw-space-y-4">
        <div class="tw-flex tw-flex-col sm:tw-flex-row tw-gap-3 sm:tw-items-center">
          <label class="tw-text-white/70 tw-font-medium tw-w-24 tw-flex-shrink-0">Файл:</label>
          <div class="tw-flex tw-items-center tw-gap-3 tw-flex-1">
            <input ref="fileInput" type="file" accept=".xlsx,.txt" @change="onFileChange" class="tw-hidden">
            <button type="button" @click="openFilePicker" class="tw-px-4 tw-py-2.5 tw-bg-gradient-to-r tw-from-amber-500 tw-to-orange-500 tw-rounded-xl tw-text-white tw-font-medium tw-text-sm hover:tw-shadow-lg hover:tw-shadow-amber-500/30 tw-transition-all tw-flex tw-items-center tw-gap-2">
              <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
              </svg>
              Выбрать файл
            </button>
            <span class="tw-text-white/60 tw-text-sm tw-truncate">
              {{ selectedFile ? selectedFile.name : 'Файл не выбран' }}
            </span>
          </div>
        </div>

        <div class="tw-flex tw-flex-col sm:tw-flex-row tw-gap-3 sm:tw-items-center">
          <label class="tw-text-white/70 tw-font-medium tw-w-24 tw-flex-shrink-0">Время:</label>
          <input type="datetime-local" v-model="selectedTime" class="tw-flex-1 sm:tw-max-w-xs tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-px-4 tw-py-2.5 tw-text-white tw-outline-none focus:tw-border-amber-500/50 tw-transition-colors">
        </div>

        <div class="tw-flex tw-flex-col sm:tw-flex-row tw-gap-3 sm:tw-items-center tw-pt-2">
          <div class="tw-w-24 tw-hidden sm:tw-block"></div>
          <button @click="uploadFile" :disabled="loading || !selectedFile" class="tw-px-6 tw-py-3 tw-bg-gradient-to-r tw-from-emerald-500 tw-to-green-600 tw-rounded-xl tw-text-white tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-emerald-500/30 tw-transition-all disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-flex tw-items-center tw-justify-center tw-gap-2">
            <svg v-if="loading" class="tw-w-5 tw-h-5 tw-animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <svg v-else class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            {{ loading ? 'Загрузка...' : 'Загрузить' }}
          </button>
        </div>
      </div>
    </div>

    <div class="tw-bg-red-500/10 tw-border tw-border-red-500/20 tw-rounded-2xl tw-p-4 tw-mb-6">
      <div class="tw-flex tw-items-start tw-gap-3">
        <div class="tw-w-10 tw-h-10 tw-rounded-xl tw-bg-red-500/20 tw-flex tw-items-center tw-justify-center tw-text-red-400 tw-flex-shrink-0">
          <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <div>
          <p class="tw-text-red-400 tw-font-medium">Максимум 900 трек-кодов</p>
          <p class="tw-text-red-400/70 tw-text-sm">Если больше — разделите на части и импортируйте заново</p>
        </div>
      </div>
    </div>

    <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-5">
      <div class="tw-flex tw-items-center tw-gap-3 tw-mb-4">
        <div class="tw-w-10 tw-h-10 tw-rounded-xl tw-bg-amber-500/20 tw-flex tw-items-center tw-justify-center tw-text-amber-400">
          <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="tw-text-white tw-font-semibold">Инструкция</h3>
      </div>
      <ul class="tw-space-y-2 tw-text-white/60 tw-text-sm">
        <li class="tw-flex tw-items-start tw-gap-2">
          <span class="tw-text-amber-400">•</span>
          Трек-коды должны быть размещены начиная с первого столбца (A)
        </li>
        <li class="tw-flex tw-items-start tw-gap-2">
          <span class="tw-text-amber-400">•</span>
          Файл должен быть в формате .xlsx или .txt
        </li>
        <li class="tw-flex tw-items-start tw-gap-2">
          <span class="tw-text-amber-400">•</span>
          Каждый трек-код на отдельной строке
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>
