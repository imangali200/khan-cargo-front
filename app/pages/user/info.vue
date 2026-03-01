<script setup lang="ts">
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'user'
})

const toast = useToast()
const router = useRouter()

const warehouseAddress = '15046378819 浙江省义乌市北苑街道莲塘二区7幢嘉宏仓库 (刘备 Al-код TARAZ)'
const copied = ref(false)

async function copyAddress() {
    try {
        await navigator.clipboard.writeText(warehouseAddress)
        copied.value = true
        toast.success('Адрес скопирован!')
        setTimeout(() => { copied.value = false }, 2000)
    } catch (error) {
        toast.error('Ошибка копирования')
    }
}

function goBack() {
    router.back()
}
</script>

<template>
    <div class="info-page">
        <div class="info-container">
            <!-- Header -->
            <div class="info-header">
                <button @click="goBack" class="back-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 class="header-title">Информация о складе</h1>
                <div class="header-spacer"></div>
            </div>

            <!-- Content -->
            <div class="info-content">
                <!-- Warehouse Card -->
                <div class="warehouse-card">
                    <div class="card-top">
                        <div class="flag-icon">🇨🇳</div>
                        <div class="title-info">
                            <span class="main-title">Склад в Китае</span>
                            <span class="sub-title">Адрес доставки</span>
                        </div>
                    </div>

                    <div class="address-display">
                        <p class="address-text">{{ warehouseAddress }}</p>
                    </div>

                    <button @click="copyAddress" class="copy-action-btn" :class="{ 'copied': copied }">
                        <svg v-if="!copied" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                        <span>{{ copied ? 'Скопирован в буфер' : 'Скопировать адрес' }}</span>
                    </button>
                </div>

                <!-- How to Order -->
                <div class="instructions-section">
                    <h2 class="section-title">Как заказать</h2>

                    <div class="guide-steps">
                        <div class="guide-step">
                            <div class="step-num">01</div>
                            <div class="step-text">
                                <span class="step-title">Скопируйте адрес склада</span>
                                <p class="step-desc">Используйте китайский адрес, указанный выше, для ваших заказов.</p>
                            </div>
                        </div>

                        <div class="guide-step">
                            <div class="step-num">02</div>
                            <div class="step-text">
                                <span class="step-title">Сделайте заказ</span>
                                <p class="step-desc">Укажите этот склад в качестве пункта доставки в Китае.</p>
                            </div>
                        </div>

                        <div class="guide-step">
                            <div class="step-num">03</div>
                            <div class="step-text">
                                <span class="step-title">Зарегистрируйте трек-код</span>
                                <p class="step-desc">Добавьте трек-номер на вкладке «Трекинг», чтобы отслеживать его.</p>
                            </div>
                        </div>

                        <div class="guide-step">
                            <div class="step-num">04</div>
                            <div class="step-text">
                                <span class="step-title">Получайте уведомления</span>
                                <p class="step-desc">Мы уведомим вас, как только ваш груз прибудет на наш хаб.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button @click="goBack" class="bottom-back-btn">Вернуться в приложение</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.info-page {
    background-color: #0d1117;
    min-height: 100vh;
    color: #e6edf3;
    font-family: 'Inter', -apple-system, sans-serif;
    padding-bottom: 60px;
}

.info-container {
    max-width: 600px;
    margin: 0 auto;
}

.info-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background-color: #0d1117;
    position: sticky;
    top: 0;
    z-index: 100;
}

.back-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 50%;
}

.back-btn:hover {
    background-color: #161b22;
}

.header-title {
    font-size: 17px;
    font-weight: 800;
    margin: 0;
}

.header-spacer {
    width: 40px;
}

.info-content {
    padding: 24px 16px;
}

/* Warehouse Card */
.warehouse-card {
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 40px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-top {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
}

.flag-icon {
    width: 52px;
    height: 52px;
    background-color: #0d1117;
    border: 1px solid #30363d;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.title-info {
    display: flex;
    flex-direction: column;
}

.main-title {
    font-size: 18px;
    font-weight: 800;
    color: white;
}

.sub-title {
    font-size: 14px;
    color: #8b949e;
    font-weight: 600;
}

.address-display {
    background-color: #0d1117;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    border: 1px solid #30363d;
}

.address-text {
    font-size: 15px;
    line-height: 1.6;
    color: white;
    margin: 0;
    word-break: break-all;
}

.copy-action-btn {
    width: 100%;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
}

.copy-action-btn.copied {
    background-color: #10b981;
}

/* Guide Section */
.section-title {
    font-size: 14px;
    font-weight: 800;
    color: #8b949e;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 24px;
}

.guide-steps {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.guide-step {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}

.step-num {
    font-size: 24px;
    font-weight: 900;
    color: #2563eb;
    opacity: 0.5;
    font-family: monospace;
}

.step-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.step-title {
    font-size: 16px;
    font-weight: 800;
    color: white;
}

.step-desc {
    font-size: 14px;
    color: #8b949e;
    line-height: 1.5;
    margin: 0;
}

.bottom-back-btn {
    width: 100%;
    height: 52px;
    background: transparent;
    border: 1px solid #30363d;
    border-radius: 12px;
    color: #8b949e;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    margin-top: 48px;
    transition: all 0.2s;
}

.bottom-back-btn:hover {
    border-color: #444;
    color: white;
}
</style>
