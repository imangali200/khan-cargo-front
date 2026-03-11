<template>
    <div class="admin-dashboard animate-slide-up">
        <!-- Premium Header Area -->
        <header class="dashboard-header">
            <div class="welcome-section">
                <span class="badge">Админ-панель</span>
                <h1>Рабочий стол</h1>
                <p class="subtitle">Добро пожаловать, <span class="highlight">{{ profileData?.name || '' }}</span>!
                    Управление складом под вашим контролем.</p>
            </div>
            <div class="header-stats" v-if="profileData?.branch">
                <div class="h-stat">
                    <span class="label">Филиал</span>
                    <span class="value">{{ profileData.branch.name }}</span>
                </div>
            </div>
        </header>

        <!-- Dynamic Stats Grid -->
        <div class="stats-grid">
            <div class="glass-card stat-item">
                <div class="card-icon cyan">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path
                            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                        </path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                </div>
                <div class="card-info">
                    <span class="stat-value">{{ dashboardStats?.totalAcceptedToday || 0 }}</span>
                    <span class="stat-label">Принято сегодня</span>
                </div>
            </div>
            <div class="glass-card stat-item">
                <div class="card-icon violet">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.27l-3.42-3.41"></path>
                        <line x1="12" y1="2" x2="12" y2="12"></line>
                    </svg>
                </div>
                <div class="card-info">
                    <span class="stat-value">{{ dashboardStats?.inProcessing || 0 }}</span>
                    <span class="stat-label">В обработке</span>
                </div>
            </div>
            <div class="glass-card stat-item">
                <div class="card-icon amber">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path
                            d="M3 17h1v4H3v-4zM7 17h1v4H7v-4zM11 17h1v4h-1v-4zM15 17h1v4h-1v-4zM19 17h1v4h-1v-4zM3 13V9a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2zM7 3h10v4H7V3z">
                        </path>
                    </svg>
                </div>
                <div class="card-info">
                    <span class="stat-value">{{ dashboardStats?.totalActive || 0 }}</span>
                    <span class="stat-label">Всего товаров</span>
                </div>
            </div>
        </div>

        <!-- Main Actions Navigation -->
        <div class="actions-grid">
            <router-link to="/admin/cargo" class="glass-card action-card group">
                <div class="action-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path
                            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                        </path>
                    </svg>
                </div>
                <div class="action-details">
                    <h3>Принять товары</h3>
                    <p>Сканирование и регистрация новых прибытий</p>
                </div>
            </router-link>

            <router-link to="/admin/history" class="glass-card action-card group">
                <div class="action-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </div>
                <div class="action-details">
                    <h3>История сканов</h3>
                    <p>Просмотр логов и последних действий</p>
                </div>
            </router-link>

            <router-link to="/admin/import" class="glass-card action-card group">
                <div class="action-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                </div>
                <div class="action-details">
                    <h3>Импорт данных</h3>
                    <p>Загрузка Excel файлов со статусами</p>
                </div>
            </router-link>
        </div>

        <!-- Recent Activity Preview -->
        <section class="recent-activity glass-card">
            <div class="section-header">
                <h2>Последняя активность</h2>
                <router-link to="/admin/history" class="view-all">Все записи</router-link>
            </div>
            <div class="activity-list">
                <div v-for="item in recentItems" :key="item.id" class="activity-row">
                    <div class="activity-indicator"></div>
                    <div class="activity-main">
                        <span class="activity-title">Отсканирован товар <span class="mono">{{ item.trackingCode
                                }}</span></span>
                        <span class="activity-desc">Статус: {{ item.currentStatus }}</span>
                    </div>
                </div>
                <div v-if="recentItems.length === 0" class="tw-text-white/50 tw-text-sm" style="color: #94a3b8">Нет
                    активности</div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import type { User, DashboardStats, TrackingItem } from '~/types'

definePageMeta({
    layout: 'admin'
})

const api = useApi()
const profileData = ref<User | null>(null)
const dashboardStats = ref<DashboardStats | null>(null)
const recentItems = ref<TrackingItem[]>([])

const loadData = async () => {
    try {
        const profileRes = await api.profile.getProfile()
        profileData.value = profileRes.data

        const dashboardRes = await api.tracking.dashboard()
        dashboardStats.value = dashboardRes.data

        const trackingRes = await api.tracking.findAll({ limit: 3 })
        recentItems.value = trackingRes.data.data
    } catch { }
}

onMounted(() => {
    loadData()
})
</script>

<style scoped>
.admin-dashboard {
    padding: 0;
    max-width: 1000px;
    margin: 0 auto;
    color: #e2e8f0;
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

.dashboard-header {
    margin-bottom: 32px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.welcome-section .badge {
    display: inline-block;
    padding: 4px 12px;
    background: rgba(59, 130, 246, 0.15);
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #3b82f6;
}

.welcome-section h1 {
    font-size: 32px;
    font-weight: 800;
    margin: 0 0 8px;
    color: #f8fafc;
}

.subtitle {
    color: #94a3b8;
    margin: 0;
    font-size: 14px;
}

.highlight {
    color: #f8fafc;
    font-weight: 700;
}

.header-stats .h-stat {
    background: #161824;
    padding: 12px 20px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
}

.h-stat .label {
    font-size: 11px;
    color: #94a3b8;
}

.h-stat .value {
    font-size: 16px;
    font-weight: 700;
    color: #f8fafc;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 32px;
}

.glass-card {
    background: #161824;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
}

.stat-item {
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
}

.card-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.card-icon svg {
    width: 24px;
    height: 24px;
    color: white;
}

.card-icon.cyan {
    background: #3b82f6;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.card-icon.violet {
    background: #8b5cf6;
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.card-icon.amber {
    background: #f59e0b;
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.card-info {
    flex: 1;
}

.stat-value {
    font-size: 24px;
    font-weight: 800;
    display: block;
    color: #f8fafc;
}

.stat-label {
    font-size: 13px;
    color: #94a3b8;
    font-weight: 600;
}

.actions-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 32px;
}

.action-card {
    padding: 32px 24px;
    text-decoration: none;
    color: #f8fafc;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
    transition: all 0.2s;
    height: 100%;
}

.action-card:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.1);
    background: #1c1f2e;
}

.action-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    transition: all 0.2s;
}

.action-card:hover .action-icon {
    color: #f8fafc;
    background: rgba(255, 255, 255, 0.08);
}

.action-details h3 {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 8px;
    color: #f8fafc;
}

.action-details p {
    font-size: 13px;
    color: #94a3b8;
    margin: 0;
    line-height: 1.5;
}

.recent-activity {
    padding: 24px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.section-header h2 {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    color: #f8fafc;
}

.view-all {
    font-size: 13px;
    color: #3b82f6;
    font-weight: 600;
    text-decoration: none;
}

.view-all:hover {
    text-decoration: underline;
}

.activity-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.activity-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 12px;
    background: #1e2130;
    border: 1px solid rgba(255, 255, 255, 0.02);
}

.activity-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #0ea5e9;
    box-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
    flex-shrink: 0;
}

.activity-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.activity-title {
    font-size: 14px;
    font-weight: 600;
    color: #f8fafc;
}

.activity-desc {
    font-size: 12px;
    color: #64748b;
}

.mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #f8fafc;
    background: rgba(255, 255, 255, 0.05);
    padding: 2px 6px;
    border-radius: 4px;
}

@media (max-width: 768px) {

    .stats-grid,
    .actions-grid {
        grid-template-columns: 1fr;
    }

    .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }
}
</style>
