<script setup lang="ts">
definePageMeta({
    layout: 'super-admin'
})

import { useToast } from '~/composables/useToast'

interface Setting {
    id: number
    pricePerKg: number
    courseUSD: number
}

const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()

const settings = ref<Setting | null>(null)
const loading = ref(false)
const saving = ref(false)

const pricePerKg = ref<number>(0)
const courseUSD = ref<number>(0)

// Track if values changed
const hasChanges = computed(() => {
    const origPrice = settings.value ? (Number(settings.value.pricePerKg) || 0) : 0
    const origCourse = settings.value ? (Number(settings.value.courseUSD) || 0) : 0
    const currPrice = Number(pricePerKg.value) || 0
    const currCourse = Number(courseUSD.value) || 0

    return currPrice !== origPrice || currCourse !== origCourse
})

async function loadSettings() {
    loading.value = true
    try {
        const response = await $axios.get('admin/settings', {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        const data = response.data
        if (Array.isArray(data) && data.length > 0) {
            settings.value = data[0]
            pricePerKg.value = data[0].pricePerKg ?? 0
            courseUSD.value = data[0].courseUSD ?? 0
        }
    } catch (error: any) {
        console.error(error)
        toast.error('Ошибка загрузки настроек', { position: 'top-center' })
    } finally {
        loading.value = false
    }
}

async function saveSettings() {
    if (saving.value) return
    saving.value = true
    try {
        const payload = {
            pricePerKg: Number(pricePerKg.value),
            courseUSD: Number(courseUSD.value)
        }

        // If settings already exist, patch them. Otherwise, create new ones.
        const response = settings.value
            ? await $axios.patch(`admin/settings/${settings.value.id}`, payload, {
                headers: { 'Authorization': `Bearer ${token.value}` }
            })
            : await $axios.post(`admin/settings`, payload, {
                headers: { 'Authorization': `Bearer ${token.value}` }
            })

        settings.value = response.data
        toast.success('Настройки сохранены!', { position: 'top-center' })
    } catch (error: any) {
        console.error(error)
        toast.error('Ошибка при сохранении', { position: 'top-center' })
    } finally {
        saving.value = false
    }
}

function resetValues() {
    if (!settings.value) {
        pricePerKg.value = 0
        courseUSD.value = 0
        return
    }
    pricePerKg.value = settings.value.pricePerKg
    courseUSD.value = settings.value.courseUSD
}

onMounted(() => {
    loadSettings()
})
</script>

<template>
    <div class="settings-page">
        <!-- Header -->
        <div class="page-header">
            <div class="header-content">
                <div class="header-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path
                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
                        </path>
                    </svg>
                </div>
                <div>
                    <h1 class="page-title">System Settings</h1>
                    <p class="page-subtitle">Manage global pricing and currency exchange parameters</p>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Загрузка настроек...</p>
        </div>

        <div v-else class="settings-content">
            <!-- Main Settings Card -->
            <div class="settings-card">
                <div class="card-header">
                    <div class="card-header-left">
                        <div class="card-icon pricing-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 class="card-title">Pricing & Exchange Rates</h2>
                            <p class="card-desc">Configure shipping costs and currency conversion</p>
                        </div>
                    </div>
                    <div v-if="hasChanges" class="unsaved-badge">
                        <span class="pulse-dot"></span>
                        Unsaved changes
                    </div>
                </div>

                <div class="fields-grid">
                    <!-- Price per KG -->
                    <div class="field-group">
                        <label class="field-label">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                class="label-icon">
                                <path
                                    d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z">
                                </path>
                                <line x1="7" y1="7" x2="7.01" y2="7"></line>
                            </svg>
                            Price per Kg
                        </label>
                        <p class="field-hint">Cost per kilogram in US dollars</p>
                        <div class="input-wrapper">
                            <span class="input-prefix">$</span>
                            <input type="number" v-model.number="pricePerKg" step="0.01" min="0" placeholder="0.00"
                                class="settings-input" />
                            <span class="input-suffix">USD</span>
                        </div>
                    </div>

                    <!-- Exchange Rate -->
                    <div class="field-group">
                        <label class="field-label">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                class="label-icon">
                                <polyline points="17 1 21 5 17 9"></polyline>
                                <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                                <polyline points="7 23 3 19 7 15"></polyline>
                                <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                            </svg>
                            USD → KZT Rate
                        </label>
                        <p class="field-hint">Exchange rate from US Dollar to Kazakhstani Tenge</p>
                        <div class="input-wrapper">
                            <span class="input-prefix">₸</span>
                            <input type="number" v-model.number="courseUSD" step="0.01" min="0" placeholder="0.00"
                                class="settings-input" />
                            <span class="input-suffix">KZT</span>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="card-actions">
                    <button @click="resetValues" class="btn-reset" :disabled="!hasChanges">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                            <polyline points="1 4 1 10 7 10"></polyline>
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                        </svg>
                        Reset
                    </button>
                    <button @click="saveSettings" class="btn-save" :disabled="!hasChanges || saving">
                        <svg v-if="!saving" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            class="btn-icon">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        <div v-else class="btn-spinner"></div>
                        {{ saving ? 'Saving...' : 'Save Changes' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.settings-page {
    padding: 32px 40px;
    max-width: 900px;
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

/* Header */
.page-header {
    margin-bottom: 32px;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 16px;
}

.header-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.25);
}

.header-icon svg {
    width: 24px;
    height: 24px;
    color: white;
}

.page-title {
    font-size: 24px;
    font-weight: 800;
    color: #f4f4f5;
    margin: 0;
    letter-spacing: -0.3px;
}

.page-subtitle {
    font-size: 14px;
    color: #71717a;
    margin: 4px 0 0;
}

/* Loading */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
    gap: 16px;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #27272a;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading-state p {
    color: #71717a;
    font-size: 14px;
}

/* Content */
.settings-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Cards */
.settings-card {
    background-color: #161618;
    border: 1px solid #27272a;
    border-radius: 16px;
    overflow: hidden;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 28px 0;
}

.card-header-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.card-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.card-icon svg {
    width: 20px;
    height: 20px;
    color: white;
}

.pricing-icon {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25);
}

.card-title {
    font-size: 16px;
    font-weight: 700;
    color: #f4f4f5;
    margin: 0;
}

.card-desc {
    font-size: 13px;
    color: #71717a;
    margin: 2px 0 0;
}

.unsaved-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    color: #fbbf24;
    background-color: rgba(251, 191, 36, 0.08);
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid rgba(251, 191, 36, 0.2);
}

.pulse-dot {
    width: 6px;
    height: 6px;
    background-color: #fbbf24;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.5;
        transform: scale(0.8);
    }
}

/* Fields */
.fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    padding: 28px;
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    color: #d4d4d8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.label-icon {
    width: 14px;
    height: 14px;
    opacity: 0.6;
}

.field-hint {
    font-size: 12px;
    color: #52525b;
    margin: 0 0 4px;
}

.input-wrapper {
    display: flex;
    align-items: center;
    background-color: #09090b;
    border: 1px solid #27272a;
    border-radius: 10px;
    overflow: hidden;
    transition: all 0.2s;
}

.input-wrapper:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.input-prefix {
    padding: 0 0 0 14px;
    font-size: 16px;
    font-weight: 700;
    color: #3b82f6;
    user-select: none;
}

.settings-input {
    flex: 1;
    padding: 14px 12px;
    background: transparent;
    border: none;
    outline: none;
    font-size: 18px;
    font-weight: 600;
    color: #f4f4f5;
    font-family: 'Inter', monospace;
}

.settings-input::placeholder {
    color: #3f3f46;
}

/* Remove number input arrows */
.settings-input::-webkit-outer-spin-button,
.settings-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.settings-input[type=number] {
    -moz-appearance: textfield;
}

.input-suffix {
    padding: 0 14px 0 0;
    font-size: 12px;
    font-weight: 700;
    color: #52525b;
    letter-spacing: 0.5px;
    user-select: none;
}

/* Actions */
.card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 0 28px 24px;
}

.btn-reset,
.btn-save {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
}

.btn-icon {
    width: 16px;
    height: 16px;
}

.btn-reset {
    background-color: #1e1e20;
    color: #a1a1aa;
    border: 1px solid #27272a;
}

.btn-reset:hover:not(:disabled) {
    background-color: #27272a;
    color: #e4e4e7;
}

.btn-reset:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.btn-save {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
}

.btn-save:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-save:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.btn-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

/* Responsive */
@media (max-width: 640px) {
    .settings-page {
        padding: 20px 16px;
    }

    .fields-grid {
        grid-template-columns: 1fr;
        padding: 20px;
    }

    .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .card-actions {
        flex-direction: column;
        padding: 0 20px 20px;
    }

    .btn-reset,
    .btn-save {
        justify-content: center;
    }
}
</style>
