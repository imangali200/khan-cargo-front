<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

import { useToast } from '~/composables/useToast'

const toast = useToast()
const router = useRouter()

const warehouseAddress = '15046378819 浙江省义乌市北苑街道莲塘二区7幢嘉宏仓库 (刘备 Al-код TARAZ)'
const copied = ref(false)

async function copyAddress() {
    try {
        await navigator.clipboard.writeText(warehouseAddress)
        copied.value = true
        toast.success('Адрес скопирован!', { position: 'top-center' })
        setTimeout(() => { copied.value = false }, 2000)
    } catch (error) {
        toast.error('Ошибка при копировании', { position: 'top-center' })
    }
}

function goBack() {
    router.back()
}
</script>

<template>
    <div class="threads-container">
        <!-- Header -->
        <div class="threads-header">
            <button @click="goBack" class="threads-back-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </button>
            <h1 class="threads-title">Информация</h1>
            <div class="threads-header-spacer"></div>
        </div>

        <!-- Main Content -->
        <div class="threads-content">
            <!-- Warehouse Card -->
            <div class="threads-card">
                <div class="threads-card-header">
                    <div class="threads-avatar">
                        <span>🇨🇳</span>
                    </div>
                    <div class="threads-card-info">
                        <span class="threads-card-title">Склад в Китае</span>
                        <span class="threads-card-subtitle">Адрес для доставки</span>
                    </div>
                </div>
                
                <div class="threads-address-box">
                    <p class="threads-address-text">{{ warehouseAddress }}</p>
                </div>

                <button @click="copyAddress" class="threads-copy-btn" :class="{ 'copied': copied }">
                    <svg v-if="!copied" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span>{{ copied ? 'Скопировано' : 'Копировать адрес' }}</span>
                </button>
            </div>

            <!-- Divider -->
            <div class="threads-divider"></div>

            <!-- Instructions -->
            <div class="threads-section">
                <h2 class="threads-section-title">Как заказать</h2>
                
                <div class="threads-steps">
                    <div class="threads-step">
                        <div class="threads-step-number">1</div>
                        <div class="threads-step-content">
                            <span class="threads-step-title">Скопируйте адрес</span>
                            <span class="threads-step-desc">Нажмите кнопку выше</span>
                        </div>
                    </div>

                    <div class="threads-step">
                        <div class="threads-step-number">2</div>
                        <div class="threads-step-content">
                            <span class="threads-step-title">Закажите товар</span>
                            <span class="threads-step-desc">Укажите адрес при заказе в Китае</span>
                        </div>
                    </div>

                    <div class="threads-step">
                        <div class="threads-step-number">3</div>
                        <div class="threads-step-content">
                            <span class="threads-step-title">Добавьте трек-код</span>
                            <span class="threads-step-desc">В приложении AI-Cargo</span>
                        </div>
                    </div>

                    <div class="threads-step">
                        <div class="threads-step-number">4</div>
                        <div class="threads-step-content">
                            <span class="threads-step-title">Отслеживайте</span>
                            <span class="threads-step-desc">Мы уведомим о прибытии</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Divider -->
            <div class="threads-divider"></div>

            <!-- Back Button -->
            <button @click="goBack" class="threads-secondary-btn">
                Назад
            </button>
        </div>
    </div>
</template>

<style scoped>
.threads-container {
    min-height: 100vh;
    background: #000;
    padding-bottom: 40px;
}

.threads-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #222;
    position: sticky;
    top: 0;
    background: #000;
    z-index: 100;
}

.threads-back-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.2s;
}

.threads-back-btn:hover {
    background: #222;
}

.threads-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin: 0;
}

.threads-header-spacer {
    width: 40px;
}

.threads-content {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
}

.threads-card {
    background: #000;
    border: 1px solid #333;
    border-radius: 16px;
    padding: 20px;
}

.threads-card-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
}

.threads-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #222;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.threads-card-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.threads-card-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
}

.threads-card-subtitle {
    font-size: 14px;
    color: #777;
}

.threads-address-box {
    background: #111;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
}

.threads-address-text {
    font-size: 15px;
    color: #fff;
    line-height: 1.5;
    margin: 0;
    word-break: break-all;
}

.threads-copy-btn {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: #fff;
    border: none;
    border-radius: 12px;
    color: #000;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.threads-copy-btn:hover {
    background: #e5e5e5;
}

.threads-copy-btn.copied {
    background: #222;
    color: #fff;
}

.threads-divider {
    height: 1px;
    background: #222;
    margin: 24px 0;
}

.threads-section {
    padding: 0;
}

.threads-section-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 20px 0;
}

.threads-steps {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.threads-step {
    display: flex;
    align-items: flex-start;
    gap: 14px;
}

.threads-step-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #222;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    flex-shrink: 0;
}

.threads-step-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 4px;
}

.threads-step-title {
    font-size: 15px;
    font-weight: 500;
    color: #fff;
}

.threads-step-desc {
    font-size: 14px;
    color: #777;
}

.threads-secondary-btn {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid #333;
    border-radius: 12px;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.threads-secondary-btn:hover {
    background: #111;
    border-color: #444;
}
</style>
