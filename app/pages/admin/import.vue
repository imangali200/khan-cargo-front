<template>
  <div class="import-center animate-slide-up">
    <!-- Premium Header Area -->
    <header class="page-header">
      <div class="title-section">
        <h1>Приём товара (Импорт)</h1>
        <p class="subtitle">Массовое добавление трек-кодов со статусом "Принят на складе (РК)"</p>
      </div>
    </header>

    <!-- Upload Zone -->
    <div class="upload-area glass-card" :class="{ dragging: isDragging }" @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop">
      <div class="upload-content" v-if="!uploading && !importComplete">
        <div class="upload-icon taraz">
          📦
        </div>
        <h2>Перетащите файл сюда</h2>
        <p>Поддерживаемые форматы: <strong>.xlsx, .csv, .txt</strong></p>
        <input type="file" ref="fileInput" class="hidden-input" @change="handleFileSelect" accept=".xlsx,.csv,.txt" />
        <button class="select-btn" @click="fileInput?.click()">Выбрать файл на компьютере</button>
      </div>

      <!-- Upload Progress -->
      <div class="progress-container" v-if="uploading">
        <div class="spinner"></div>
        <h3>Обработка данных...</h3>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="progress-text">Загрузка трек-кодов: {{ progress }}%</p>
      </div>

      <!-- Success State -->
      <div class="success-state" v-if="importComplete">
        <div class="success-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="#fbbf24" />
            <path d="M6 4L6.8 6.4L9 7L6.8 7.6L6 10L5.2 7.6L3 7L5.2 6.4L6 4Z" fill="#fbbf24" />
            <path d="M19 18L19.5 19.5L21 20L19.5 20.5L19 22L18.5 20.5L17 20L18.5 19.5L19 18Z" fill="#fbbf24" />
          </svg>
        </div>
        <h2>Импорт завершен!</h2>
        <p>Трек-коды успешно приняты на склад.</p>
        <div class="success-actions">
          <router-link to="/admin/cargo" class="view-btn">Перейти к сканеру</router-link>
          <button class="retry-btn" @click="resetImport">Загрузить еще</button>
        </div>
      </div>
    </div>

    <!-- Limits Warning -->
    <div class="limit-warning glass-card">
      <span class="l-icon">⚠️</span>
      <div class="l-txt">
        <strong>Лимит обработки: 900 кодов</strong>
        <p>Для стабильной работы системы объем одного файла не должен превышать 900 записей.</p>
      </div>
    </div>

    <!-- Information Guide -->
    <section class="guide-section">
      <h3>Инструкция по загрузке</h3>
      <div class="guide-grid">
        <div class="guide-item glass-card">
          <span class="g-num">01</span>
          <p>Подготовьте Excel файл с трек-кодами в первом столбце (А)</p>
        </div>
        <div class="guide-item glass-card">
          <span class="g-num">02</span>
          <p>Загрузите файл в окно выше</p>
        </div>
        <div class="guide-item glass-card">
          <span class="g-num">03</span>
          <p>Все трек-коды автоматически получат статус "Принят на складе"</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

import { useToast } from '~/composables/useToast'
const toast = useToast()
const api = useApi()

const isDragging = ref(false)
const uploading = ref(false)
const progress = ref(0)
const importComplete = ref(false)
const importedCount = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileSelect = (e: any) => {
  const file = e.target.files[0]
  if (file) uploadFile(file)
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) uploadFile(file)
}

const uploadFile = async (file: File) => {
  uploading.value = true
  progress.value = 50 // Mocking progress visually

  const targetStatus = 'ARRIVED_BRANCH';

  const formData = new FormData()
  formData.append('file', file)
  formData.append('targetStatus', targetStatus)

  try {
    const { data } = await api.tracking.importExcel(formData)
    progress.value = 100

    setTimeout(() => {
      uploading.value = false
      importComplete.value = true
      importedCount.value = data?.updatedCount || 0
      toast.success('Данные успешно импортированы')
    }, 500)
  } catch (err: any) {
    uploading.value = false
    const msg = err.response?.data?.message || 'Произошла ошибка при импорте';
    toast.error(msg, { position: 'top-center' })
  }
}

const resetImport = () => {
  importComplete.value = false
  progress.value = 0
  importedCount.value = 0
}
</script>

<style scoped>
.import-center {
  padding: 0;
  max-width: 1000px;
  margin: 0 auto;
  color: #fff;
  font-family: 'Inter', -apple-system, sans-serif;
}

.animate-slide-up {
  animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header {
  margin-bottom: 24px;
}

.title-section h1 {
  font-size: 24px;
  font-weight: 800;
  margin: 0;
  color: #f8fafc;
}

.subtitle {
  color: #94a3b8;
  font-size: 14px;
  margin-top: 6px;
}

.glass-card {
  background: #161824;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.upload-area {
  min-height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
  transition: all 0.3s;
  border-radius: 12px;
  background: #161824;
}

.upload-area.dragging {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
  transform: scale(1.01);
}

.upload-icon {
  font-size: 48px;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  background: rgba(255, 255, 255, 0.05);
}

.upload-icon.taraz {
  background: rgba(59, 130, 246, 0.1);
}

.upload-content h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #f8fafc;
}

.upload-content p {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 24px;
}

.hidden-input {
  display: none;
}

.select-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.select-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
}

.progress-container {
  width: 100%;
  max-width: 400px;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.progress-bar-bg {
  height: 8px;
  background: #1e2130;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s;
}

.progress-text {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
}

.success-state {
  padding: 40px;
}

.success-icon {
  font-size: 48px;
  margin-bottom: 16px;
  animation: bounce 1s infinite alternate;
}

@keyframes bounce {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.1);
  }
}

.success-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
}

.view-btn {
  padding: 12px 20px;
  border-radius: 8px;
  background: #3b82f6;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s;
}

.view-btn:hover {
  background: #2563eb;
}

.retry-btn {
  padding: 12px 20px;
  border-radius: 8px;
  background: #1e2130;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.limit-warning {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  align-items: center;
  border-left: 4px solid #f59e0b;
  margin-bottom: 32px;
}

.l-icon {
  font-size: 24px;
}

.l-txt strong {
  display: block;
  font-size: 14px;
  color: #fbbf24;
}

.l-txt p {
  font-size: 13px;
  color: #94a3b8;
  margin: 4px 0 0;
}

.guide-section h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #f8fafc;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.guide-item {
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.g-num {
  font-size: 24px;
  font-weight: 800;
  color: #3b82f6;
  opacity: 0.5;
}

.guide-item p {
  font-size: 13px;
  color: #94a3b8;
  margin: 4px 0 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .guide-grid {
    grid-template-columns: 1fr;
  }
}
</style>
