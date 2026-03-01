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
                <div class="card-icon cyan">📦</div>
                <div class="card-info">
                    <span class="stat-value">{{ dashboardStats?.totalAcceptedToday || 0 }}</span>
                    <span class="stat-label">Принято сегодня</span>
                </div>
                <div class="chart-mini cyan"></div>
            </div>
            <div class="glass-card stat-item">
                <div class="card-icon violet">🔄</div>
                <div class="card-info">
                    <span class="stat-value">{{ dashboardStats?.inProcessing || 0 }}</span>
                    <span class="stat-label">В обработке</span>
                </div>
                <div class="chart-mini violet"></div>
            </div>
            <div class="glass-card stat-item">
                <div class="card-icon amber">🚚</div>
                <div class="card-info">
                    <span class="stat-value">{{ dashboardStats?.totalActive || 0 }}</span>
                    <span class="stat-label">Всего товаров</span>
                </div>
                <div class="chart-mini amber"></div>
            </div>
        </div>

        <!-- Main Actions Navigation -->
        <div class="actions-grid">
            <router-link to="/admin/new-receipts" class="glass-card action-card group cyan">
                <div class="action-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <div class="action-details">
                    <h3>Принять товары</h3>
                    <p>Сканирование и регистрация новых прибытий</p>
                </div>
                <div class="arrow">→</div>
            </router-link>

            <router-link to="/admin/history" class="glass-card action-card group violet">
                <div class="action-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="action-details">
                    <h3>История сканов</h3>
                    <p>Просмотр логов и последних действий</p>
                </div>
                <div class="arrow">→</div>
            </router-link>

            <router-link to="/admin/import" class="glass-card action-card group amber">
                <div class="action-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                </div>
                <div class="action-details">
                    <h3>Импорт данных</h3>
                    <p>Загрузка Excel файлов со статусами</p>
                </div>
                <div class="arrow">→</div>
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
                <div v-if="recentItems.length === 0" class="tw-text-white/50 tw-text-sm">Нет активности</div>
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

.dashboard-header {
    margin-bottom: 32px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.welcome-section .badge {
    display: inline-block;
    padding: 4px 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #00d2ff;
}

.welcome-section h1 {
    font-size: 32px;
    font-weight: 900;
    margin: 0 0 8px;
    letter-spacing: -1px;
}

.subtitle {
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
}

.highlight {
    color: #fff;
    font-weight: 700;
}

.header-stats .h-stat {
    background: rgba(255, 255, 255, 0.05);
    padding: 12px 20px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
}

.h-stat .label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
}

.h-stat .value {
    font-size: 18px;
    font-weight: 800;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 32px;
}

.glass-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
}

.stat-item {
    padding: 4px;
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
    overflow: hidden;
    padding-right: 20px;
}

.card-icon {
    width: 56px;
    height: 56px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin: 10px;
}

.card-icon.cyan {
    background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
}

.card-icon.violet {
    background: linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%);
}

.card-icon.amber {
    background: linear-gradient(135deg, #f2994a 0%, #f2c94c 100%);
}

.card-info {
    flex: 1;
}

.stat-value {
    font-size: 24px;
    font-weight: 800;
    display: block;
}

.stat-label {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 600;
}

.actions-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 32px;
}

.action-card {
    padding: 24px;
    text-decoration: none;
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
}

.action-card:hover {
    transform: translateY(-8px);
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.06);
}

.action-icon {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.8);
    transition: all 0.3s;
}

.action-card.cyan:hover .action-icon {
    background: #00d2ff;
    color: #fff;
    box-shadow: 0 10px 20px rgba(0, 210, 255, 0.3);
}

.action-card.violet:hover .action-icon {
    background: #8e2de2;
    color: #fff;
    box-shadow: 0 10px 20px rgba(142, 45, 226, 0.3);
}

.action-card.amber:hover .action-icon {
    background: #f2994a;
    color: #fff;
    box-shadow: 0 10px 20px rgba(242, 153, 74, 0.3);
}

.action-details h3 {
    font-size: 18px;
    font-weight: 800;
    margin: 0 0 4px;
}

.action-details p {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
    line-height: 1.4;
}

.arrow {
    position: absolute;
    bottom: 24px;
    right: 24px;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s;
    font-size: 24px;
}

.action-card:hover .arrow {
    opacity: 1;
    transform: translateX(0);
}

.recent-activity {
    padding: 24px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.section-header h2 {
    font-size: 20px;
    font-weight: 800;
    margin: 0;
}

.view-all {
    font-size: 13px;
    color: #00d2ff;
    font-weight: 700;
    text-decoration: none;
}

.activity-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.activity-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.02);
}

.activity-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #00d2ff;
    box-shadow: 0 0 10px #00d2ff;
}

.activity-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.activity-title {
    font-size: 14px;
    font-weight: 700;
}

.activity-desc {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
}

.activity-time {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
    font-weight: 600;
}

.mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
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
