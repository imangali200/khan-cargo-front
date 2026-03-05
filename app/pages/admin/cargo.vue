<script setup lang="ts">
definePageMeta({
    layout: 'admin'
})

import { useToast } from '~/composables/useToast'

const toast = useToast()
const api = useApi()

const trackCodeInput = ref<HTMLInputElement | null>(null)
const trackCode = ref('')
const weight = ref('')
const sending = ref(false)
const addingItem = ref(false)

interface SessionItem {
    id: number
    time: string
    trackCode: string
    weight: number
    status: 'success' | 'error'
    errorMsg?: string
}

let nextId = 1
const sessionItems = ref<SessionItem[]>([])

const totalWeight = computed(() => {
    return sessionItems.value
        .filter(i => i.status === 'success')
        .reduce((sum, i) => sum + i.weight, 0)
})

const successCount = computed(() => sessionItems.value.filter(i => i.status === 'success').length)

const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

onMounted(() => {
    trackCodeInput.value?.focus()
})

const handleSubmit = async () => {
    const code = trackCode.value.trim()
    const w = parseFloat(weight.value) || 0

    if (!code) {
        toast.error('Введите трек-код')
        return
    }

    addingItem.value = true

    try {
        await api.tracking.quickUpdate({
            trackingCode: code,
            weight: w > 0 ? w : undefined,
        })

        sessionItems.value.unshift({
            id: nextId++,
            time: new Date().toISOString(),
            trackCode: code,
            weight: w,
            status: 'success',
        })

        toast.success(`${code} — добавлен`)
    } catch (err: any) {
        const msg = err.response?.data?.message || 'Ошибка'
        sessionItems.value.unshift({
            id: nextId++,
            time: new Date().toISOString(),
            trackCode: code,
            weight: w,
            status: 'error',
            errorMsg: msg,
        })
        toast.error(msg)
    } finally {
        addingItem.value = false
        trackCode.value = ''
        weight.value = ''
        trackCodeInput.value?.focus()
    }
}

const removeItem = (id: number) => {
    sessionItems.value = sessionItems.value.filter(i => i.id !== id)
}

const clearSession = () => {
    sessionItems.value = []
    trackCode.value = ''
    weight.value = ''
    trackCodeInput.value?.focus()
}

const sendToTelegram = async () => {
    if (successCount.value === 0) {
        toast.error('Нет данных для отправки')
        return
    }

    sending.value = true
    try {
        const result = await api.tracking.notifyArrivals()
        const data = result.data as any
        toast.success(`Отправлено в Telegram! Пользователей: ${data.usersNotified}, товаров: ${data.itemsNotified}`)
    } catch (err: any) {
        toast.error(err.response?.data?.message || 'Ошибка отправки в Telegram')
    } finally {
        sending.value = false
    }
}

// Keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
    // ALT+T = Send to Telegram
    if (e.altKey && e.key === 't') {
        e.preventDefault()
        sendToTelegram()
    }
    // ESC = Clear/Cancel
    if (e.key === 'Escape') {
        trackCode.value = ''
        weight.value = ''
        trackCodeInput.value?.focus()
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <div class="cargo-page">
        <!-- Header -->
        <div class="cargo-header">
            <div class="header-left">
                <h1 class="cargo-title">Shipment Intake Session</h1>
                <span class="session-badge active">ACTIVE</span>
            </div>

            <div class="header-right">
                <button class="telegram-btn" @click="sendToTelegram" :disabled="sending || successCount === 0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" width="16" height="16">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    <span v-if="sending">Отправка...</span>
                    <span v-else>Send to Telegram</span>
                </button>
                <div class="header-icons">
                    <button class="icon-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                    </button>
                    <button class="icon-btn avatar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Process New Item Card -->
        <div class="process-card">
            <div class="process-header">
                <h2>Process New Item</h2>
                <p class="process-subtitle">Scan barcodes and record weights for the current cargo batch.</p>
            </div>

            <form @submit.prevent="handleSubmit" class="process-form">
                <div class="form-row">
                    <div class="input-group track-input-group">
                        <label>Track Code (Barcode)</label>
                        <div class="input-wrapper">
                            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M4 7V4h3m14 3V4h-3M4 17v3h3m14-3v3h-3M9 8h.01M12 8h.01M15 8h.01M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01">
                                </path>
                            </svg>
                            <input ref="trackCodeInput" v-model="trackCode" type="text"
                                placeholder="Scan or Enter Code..." autofocus />
                            <span class="auto-next-badge">AUTO-NEXT</span>
                        </div>
                    </div>

                    <div class="input-group weight-input-group">
                        <label>Weight (kg)</label>
                        <input v-model="weight" type="number" step="0.01" min="0" placeholder="0.00" />
                    </div>

                    <button type="submit" class="add-btn" :disabled="addingItem || !trackCode.trim()">
                        <span v-if="addingItem" class="btn-spinner"></span>
                        <template v-else>
                            ADD
                            <small>← ENTER</small>
                        </template>
                    </button>
                </div>
            </form>
        </div>

        <!-- Session History -->
        <div class="session-card">
            <div class="session-header">
                <div class="session-title-row">
                    <h3>SESSION HISTORY</h3>
                    <span class="item-count">{{ sessionItems.length }} Items</span>
                </div>
                <button class="clear-btn" @click="clearSession" v-if="sessionItems.length > 0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Clear Session
                </button>
            </div>

            <div class="session-table-wrap">
                <table class="session-table">
                    <thead>
                        <tr>
                            <th width="15%">TIME</th>
                            <th width="50%">TRACK CODE</th>
                            <th width="20%">WEIGHT</th>
                            <th width="15%" class="text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in sessionItems" :key="item.id"
                            :class="{ 'error-row': item.status === 'error' }">
                            <td class="time-td">{{ formatTime(item.time) }}</td>
                            <td class="code-td">
                                <span class="code-text">{{ item.trackCode }}</span>
                                <span v-if="item.status === 'error'" class="error-badge">ERR</span>
                                <span v-if="item.errorMsg" class="error-msg">{{ item.errorMsg }}</span>
                                <!-- Optional: Status badge like "AIR" or "SEA" could go here if available -->
                            </td>
                            <td class="weight-td">{{ item.weight > 0 ? item.weight.toFixed(2) + ' kg' : '—' }}</td>
                            <td class="action-td text-right">
                                <button class="delete-item-btn" @click="removeItem(item.id)" title="Удалить">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path
                                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                        </path>
                                    </svg>
                                </button>
                            </td>
                        </tr>

                        <tr v-if="sessionItems.length === 0" class="empty-row">
                            <td colspan="4" class="empty-cell">
                                Scanned items will appear here
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Total -->
            <div class="session-total">
                <span class="total-label">SESSION TOTAL WEIGHT</span>
                <span class="total-value">{{ totalWeight.toFixed(2) }} kg</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.cargo-page {
    font-family: 'Inter', -apple-system, sans-serif;
    color: #e2e8f0;
}

/* Header */
.cargo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.cargo-title {
    font-size: 18px;
    font-weight: 700;
    color: #f8fafc;
    margin: 0;
}

.session-badge {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
    padding: 3px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.telegram-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.telegram-btn:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
}

.telegram-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.header-icons {
    display: flex;
    align-items: center;
    gap: 12px;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    padding-left: 16px;
}

.icon-btn {
    background: none;
    border: none;
    color: #94a3b8;
    padding: 4px;
    cursor: pointer;
    transition: color 0.2s;
}

.icon-btn:hover {
    color: #f8fafc;
}

.icon-btn svg {
    width: 20px;
    height: 20px;
}

.icon-btn.avatar {
    color: #cbd5e1;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

/* Process Card */
.process-card {
    background: #161824;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.process-header h2 {
    font-size: 16px;
    font-weight: 600;
    color: #f8fafc;
    margin: 0 0 4px;
}

.process-subtitle {
    font-size: 13px;
    color: #94a3b8;
    margin: 0 0 20px;
}

.process-form {
    width: 100%;
}

.form-row {
    display: flex;
    align-items: flex-end;
    gap: 16px;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.input-group label {
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
}

.track-input-group {
    flex: 1;
}

.weight-input-group {
    width: 160px;
}

.input-wrapper {
    display: flex;
    align-items: center;
    background: #1e2130;
    border: 1px solid #3b82f6;
    border-radius: 8px;
    padding: 0 12px;
    transition: all 0.2s;
    height: 44px;
    gap: 8px;
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.5);
}

.input-wrapper:focus-within {
    border-color: #60a5fa;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.input-icon {
    width: 18px;
    height: 18px;
    color: #3b82f6;
}

.input-wrapper input {
    all: unset;
    flex: 1;
    font-size: 14px;
    color: #f8fafc;
    height: 100%;
}

.input-wrapper input::placeholder {
    color: #64748b;
}

.auto-next-badge {
    font-size: 9px;
    font-weight: 700;
    color: #94a3b8;
    background: rgba(255, 255, 255, 0.05);
    padding: 3px 6px;
    border-radius: 4px;
}

.weight-input-group input {
    all: unset;
    width: 100%;
    height: 44px;
    padding: 0 14px;
    font-size: 14px;
    color: #f8fafc;
    background: #1e2130;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    transition: all 0.2s;
    box-sizing: border-box;
}

.weight-input-group input:focus {
    border-color: #3b82f6;
}

.weight-input-group input::placeholder {
    color: #64748b;
}

.add-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 44px;
    padding: 0 24px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 100px;
}

.add-btn small {
    font-size: 9px;
    opacity: 0.8;
    margin-top: 2px;
}

.add-btn:hover:not(:disabled) {
    background: #2563eb;
}

.add-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Session Card */
.session-card {
    background: #161824;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.session-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
}

.session-title-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.session-title-row h3 {
    font-size: 12px;
    font-weight: 700;
    color: #94a3b8;
    letter-spacing: 0.5px;
    margin: 0;
}

.item-count {
    font-size: 11px;
    font-weight: 600;
    color: #cbd5e1;
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 8px;
    border-radius: 10px;
}

.clear-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    color: #60a5fa;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s;
}

.clear-btn:hover {
    background: rgba(59, 130, 246, 0.1);
}

/* Session Table */
.session-table-wrap {
    overflow-x: auto;
}

.session-table {
    width: 100%;
    border-collapse: collapse;
}

.session-table th {
    padding: 12px 24px;
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.session-table th.text-right {
    text-align: right;
}

.session-table td {
    padding: 16px 24px;
    font-size: 13px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.session-table td.text-right {
    text-align: right;
    display: flex;
    justify-content: flex-end;
}

.time-td {
    color: #94a3b8;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 12px;
}

.code-td {
    display: flex;
    align-items: center;
    gap: 10px;
}

.code-text {
    font-weight: 700;
    color: #f8fafc;
}

.error-badge {
    font-size: 9px;
    font-weight: 700;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.15);
    padding: 2px 6px;
    border-radius: 4px;
}

.error-msg {
    font-size: 11px;
    color: #ef4444;
}

.weight-td {
    font-weight: 700;
    color: #f8fafc;
}

.delete-item-btn {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
    padding: 4px;
}

.delete-item-btn svg {
    width: 16px;
    height: 16px;
}

.delete-item-btn:hover {
    color: #ef4444;
}

.empty-cell {
    text-align: center;
    padding: 32px 24px !important;
    color: #64748b;
    font-style: italic;
}

/* Total */
.session-total {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 32px;
    padding: 24px;
    background: #13151f;
}

.total-label {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: 0.5px;
}

.total-value {
    font-size: 18px;
    font-weight: 700;
    color: #3b82f6;
}

/* Responsive */
@media (max-width: 768px) {
    .cargo-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .form-row {
        flex-direction: column;
    }

    .weight-input-group {
        width: 100%;
    }

    .add-btn {
        width: 100%;
    }
}
</style>
