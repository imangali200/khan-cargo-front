<script setup lang="ts">
import type { TrackingItem } from '~/types'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'user'
})

const api = useApi()
const toast = useToast()
const searchQuery = ref('')
const result = ref<TrackingItem | null>(null)
const loading = ref(false)
const searched = ref(false)

async function searchTrack() {
    if (!searchQuery.value.trim()) {
        result.value = null
        searched.value = false
        return
    }

    loading.value = true
    searched.value = true

    try {
        const { data } = await api.tracking.searchByCode(searchQuery.value.trim())
        result.value = data
    } catch (e: any) {
        result.value = null
        if (e.response?.status !== 404) {
            toast.error('Ошибка поиска')
        }
    } finally {
        loading.value = false
    }
}

function getProgress(item: TrackingItem) {
    return [item.createAt, item.chinaArrivalDate, item.aicargoArrivalDate].filter(Boolean).length
}

function clearSearch() {
    searchQuery.value = ''
    result.value = null
    searched.value = false
}
</script>

<template>
    <div class="search-page">
        <div class="search-container">
            <!-- Search Header -->
            <div class="search-title-row">
                <h1>Поиск</h1>
            </div>
            <div class="search-header">
                <div class="search-input-box">
                    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input v-model="searchQuery" @keyup.enter="searchTrack" type="text"
                        placeholder="Поиск груза или трек-кода..." class="search-input" autofocus />
                    <button v-if="searchQuery" @click="clearSearch" class="search-clear">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="3">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <button @click="searchTrack" class="search-submit-btn" :disabled="!searchQuery.trim() || loading">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </button>
            </div>

            <!-- Content Area -->
            <div class="content-area">
                <div v-if="loading" class="loading-state">
                    <div class="loader"></div>
                </div>

                <div v-else-if="searched" class="search-results">
                    <div v-if="!result" class="empty-results">
                        <div class="empty-icon">🔎</div>
                        <h3>Код не найден</h3>
                        <p>Мы не смогли найти груз с таким трек-кодом. Пожалуйста, проверьте и попробуйте снова.</p>
                    </div>

                    <div v-else class="result-box">
                        <h2 class="section-title">Результат поиска</h2>

                        <div class="tracking-card">
                            <div class="card-header">
                                <div class="code-badge">
                                    <span class="label">ТРЕК-КОД</span>
                                    <span class="code">{{ result.trackingCode }}</span>
                                </div>
                                <div class="status-indicator" :class="{ completed: getProgress(result) === 3 }">
                                    {{ getProgress(result) === 3 ? 'Доставлен' : 'В пути' }}
                                </div>
                            </div>

                            <div class="card-content">
                                <h3 class="cargo-desc">{{ result.description || 'Доставка груза' }}</h3>

                                <div class="tracking-progress">
                                    <div class="progress-track">
                                        <div class="progress-fill"
                                            :style="{ width: (getProgress(result) / 3 * 100) + '%' }"></div>
                                    </div>
                                    <div class="progress-steps">
                                        <div class="step" :class="{ active: !!result.createAt }">
                                            <div class="dot"></div>
                                            <span>Зарегистрирован</span>
                                        </div>
                                        <div class="step" :class="{ active: !!result.chinaArrivalDate }">
                                            <div class="dot"></div>
                                            <span>В Китае</span>
                                        </div>
                                        <div class="step" :class="{ active: !!result.aicargoArrivalDate }">
                                            <div class="dot"></div>
                                            <span>Главный хаб</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card-footer">
                                <button class="details-btn">
                                    Посмотреть историю
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Initial State -->
                <div v-else class="initial-state">
                    <div class="illustration">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#30363d" stroke-width="1">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p class="initial-hint">Введите трек-код для начала</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.search-page {
    background-color: #0d1117;
    min-height: calc(100vh - 64px);
    color: #e6edf3;
    padding-bottom: 80px;
    font-family: 'Inter', -apple-system, sans-serif;
}

.search-container {
    max-width: 680px;
    margin: 0 auto;
    padding: 24px 16px;
}

.search-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.search-title-row h1 {
    font-size: 24px;
    font-weight: 800;
    color: white;
    margin: 0;
}

/* Header */
.search-header {
    display: flex;
    gap: 12px;
    margin-bottom: 32px;
}

.search-input-box {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px;
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 16px;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input-box:focus-within {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-icon {
    color: #8b949e;
    flex-shrink: 0;
}

.search-input {
    flex: 1;
    height: 52px;
    background: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 16px;
}

.search-clear {
    background: none;
    border: none;
    color: #8b949e;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
}

.search-submit-btn {
    width: 52px;
    height: 52px;
    flex-shrink: 0;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
}

.search-submit-btn:disabled {
    background-color: #30363d;
    color: #8b949e;
    cursor: not-allowed;
}

/* Results */
.section-title {
    font-size: 14px;
    font-weight: 800;
    color: #8b949e;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
    text-transform: uppercase;
}

.tracking-card {
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-header {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #30363d;
}

.code-badge {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.code-badge .label {
    font-size: 9px;
    font-weight: 800;
    color: #8b949e;
    letter-spacing: 1px;
}

.code-badge .code {
    font-size: 18px;
    font-weight: 900;
    color: white;
    letter-spacing: 0.5px;
}

.status-indicator {
    padding: 6px 12px;
    background-color: #2563eb;
    color: white;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 800;
}

.status-indicator.completed {
    background-color: #10b981;
}

.card-content {
    padding: 24px 20px;
}

.cargo-desc {
    font-size: 20px;
    font-weight: 800;
    color: white;
    margin: 0 0 24px;
}

.tracking-progress {
    margin-top: 12px;
}

.progress-track {
    height: 8px;
    background-color: #0d1117;
    border-radius: 4px;
    margin-bottom: 16px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background-color: #2563eb;
    border-radius: 4px;
    transition: width 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.progress-steps {
    display: flex;
    justify-content: space-between;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.step .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #30363d;
    border: 2px solid #161b22;
    z-index: 2;
}

.step.active .dot {
    background-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}

.step span {
    font-size: 11px;
    font-weight: 700;
    color: #8b949e;
}

.step.active span {
    color: white;
}

.card-footer {
    padding: 16px 20px;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
}

.details-btn {
    background: none;
    border: none;
    color: #2563eb;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

/* States */
.loading-state {
    padding: 80px 0;
    display: flex;
    justify-content: center;
}

.loader {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(37, 99, 235, 0.1);
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.initial-state {
    text-align: center;
    padding: 100px 24px;
}

.empty-results {
    text-align: center;
    padding: 80px 24px;
}

.illustration {
    margin-bottom: 24px;
    opacity: 0.15;
    display: flex;
    justify-content: center;
}

.illustration svg {
    width: 64px;
    height: 64px;
}

.initial-hint {
    font-size: 15px;
    color: #555;
    margin-top: 16px;
}

.initial-state h3,
.empty-results h3 {
    font-size: 20px;
    font-weight: 800;
    color: white;
    margin: 0 0 12px;
}

.initial-state p,
.empty-results p {
    font-size: 15px;
    color: #8b949e;
    line-height: 1.6;
    max-width: 360px;
    margin: 0 auto;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 24px;
}
</style>
