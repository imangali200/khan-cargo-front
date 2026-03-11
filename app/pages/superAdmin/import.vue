<template>
    <div class="import-center animate-slide-up">
        <!-- Premium Header Area -->
        <header class="page-header">
            <div class="breadcrumb">
                <router-link to="/superAdmin">Главная</router-link>
                <span class="sep">/</span>
                <span class="current">Массовый импорт</span>
            </div>
            <div class="title-section">
                <h1>Центр импорта данных</h1>
                <p class="subtitle">Массовое обновление статусов через Excel/CSV файлы</p>
            </div>
        </header>

        <!-- Import Mode Toggle -->
        <div class="mode-tabs glass-card">
            <button @click="activeTab = 'china'" :class="['mode-tab', { active: activeTab === 'china' }]">
                <span class="icon">🇨🇳</span>
                <div class="txt">
                    <span class="main">Китай</span>
                    <span class="sub">Склад в Китае</span>
                </div>
            </button>
            <button @click="activeTab = 'taraz'" :class="['mode-tab', { active: activeTab === 'taraz' }]">
                <span class="icon">📦</span>
                <div class="txt">
                    <span class="main">Khan Cargo</span>
                    <span class="sub">Склад выдачи</span>
                </div>
            </button>
        </div>

        <!-- Upload Zone -->
        <div class="upload-area glass-card" :class="{ dragging: isDragging }" @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop">
            <div class="upload-content" v-if="!uploading && !importComplete">
                <div class="upload-icon" :class="activeTab">
                    {{ activeTab === 'china' ? '🇨🇳' : '📦' }}
                </div>
                <h2>Перетащите файл сюда</h2>
                <p>Поддерживаемые форматы: <strong>.xlsx, .csv, .txt</strong></p>
                <input type="file" ref="fileInput" class="hidden-input" @change="handleFileSelect"
                    accept=".xlsx,.csv,.txt" />
                <button class="select-btn" @click="fileInput?.click()">Выбрать файл на компьютере</button>
            </div>

            <!-- Upload Progress -->
            <div class="progress-container" v-if="uploading">
                <div class="spinner"></div>
                <h3>Обработка данных...</h3>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
                </div>
                <p class="progress-text">Считывание трек-кодов: {{ progress }}%</p>
            </div>

            <!-- Success State -->
            <div class="success-state" v-if="importComplete">
                <div class="success-icon">✨</div>
                <h2>Импорт завершен!</h2>
                <p>Успешно обработано массовое обновление трек-кодов</p>
                <div class="success-actions">
                    <router-link to="/superAdmin" class="view-btn">Перейти к списку</router-link>
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
                    <p>Подготовьте файл с трек-кодами в первом столбце (А)</p>
                </div>
                <div class="guide-item glass-card">
                    <span class="g-num">02</span>
                    <p>Выберите нужный склад назначения в меню сверху</p>
                </div>
                <div class="guide-item glass-card">
                    <span class="g-num">03</span>
                    <p>Подтвердите операцию и дождитесь окончания обработки</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'super-admin'
})

import { useToast } from '~/composables/useToast'
const toast = useToast()
const api = useApi()

const activeTab = ref<'china' | 'taraz'>('china')
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

    const targetStatus = activeTab.value === 'china'
        ? 'ARRIVED_CHINA_WAREHOUSE'
        : 'ARRIVED_BRANCH'

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
    } catch {
        uploading.value = false
        toast.error('Произошла ошибка при импорте', { position: 'top-center' })
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
    padding: 20px;
    max-width: 1000px;
    margin: 0 auto;
    color: #fff;
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

.breadcrumb {
    display: flex;
    gap: 8px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 8px;
}

.breadcrumb a {
    color: #8e2de2;
    text-decoration: none;
    font-weight: 600;
}

.title-section h1 {
    font-size: 28px;
    font-weight: 900;
    margin: 0;
    letter-spacing: -1px;
}

.subtitle {
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    margin-top: 4px;
}

.glass-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
}

.mode-tabs {
    display: flex;
    padding: 6px;
    gap: 6px;
    margin-bottom: 24px;
}

.mode-tab {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 20px;
    border-radius: 14px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    transition: all 0.2s;
}

.mode-tab .icon {
    font-size: 24px;
}

.mode-tab .txt {
    text-align: left;
}

.mode-tab .main {
    display: block;
    font-size: 15px;
    font-weight: 800;
}

.mode-tab .sub {
    font-size: 11px;
    opacity: 0.6;
    font-weight: 600;
}

.mode-tab.active {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.mode-tab.active::after {
    content: '✓';
    margin-left: auto;
    font-weight: 900;
    color: #8e2de2;
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
}

.upload-area.dragging {
    border-color: #8e2de2;
    background: rgba(142, 45, 226, 0.05);
    transform: scale(1.01);
}

.upload-icon {
    font-size: 48px;
    width: 80px;
    height: 80px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    background: rgba(255, 255, 255, 0.05);
}

.upload-icon.china {
    background: rgba(231, 76, 60, 0.1);
}

.upload-icon.taraz {
    background: rgba(142, 45, 226, 0.1);
}

.upload-content h2 {
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 8px;
}

.upload-content p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 24px;
}

.hidden-input {
    display: none;
}

.select-btn {
    background: #fff;
    color: #000;
    border: none;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s;
}

.select-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
}

.progress-container {
    width: 100%;
    max-width: 400px;
    padding: 40px;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(142, 45, 226, 0.1);
    border-top-color: #8e2de2;
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
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 12px;
}

.progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #8e2de2, #4a00e0);
    transition: width 0.3s;
}

.progress-text {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    font-weight: 800;
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
    border-radius: 12px;
    background: #8e2de2;
    color: #fff;
    text-decoration: none;
    font-weight: 700;
    font-size: 14px;
}

.retry-btn {
    padding: 12px 20px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #fff;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
}

.limit-warning {
    display: flex;
    gap: 16px;
    padding: 16px 20px;
    align-items: center;
    border-color: rgba(241, 196, 15, 0.2);
    border-left: 4px solid #f1c40f;
    margin-bottom: 40px;
}

.l-icon {
    font-size: 24px;
}

.l-txt strong {
    display: block;
    font-size: 14px;
    color: #f1c40f;
}

.l-txt p {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    margin: 2px 0 0;
}

.guide-section h3 {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 16px;
    color: rgba(255, 255, 255, 0.6);
}

.guide-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
    font-weight: 900;
    color: #8e2de2;
    opacity: 0.5;
}

.guide-item p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin: 4px 0 0;
    line-height: 1.5;
}
</style>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
}
</style>