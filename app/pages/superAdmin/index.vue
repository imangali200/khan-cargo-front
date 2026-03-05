<template>
    <div class="dashboard">
        <!-- Welcome -->
        <header class="dash-header">
            <div>
                <h1>Dashboard</h1>
                <p class="dash-subtitle">Welcome back. Here's your system overview.</p>
            </div>
            <div class="system-status">
                <span class="status-dot"></span>
                <span>System Online</span>
            </div>
        </header>

        <!-- Stats -->
        <div class="stats-row">
            <div class="stat-card">
                <div class="stat-icon blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </div>
                <div class="stat-body">
                    <span class="stat-num">{{ usersCount }}</span>
                    <span class="stat-label">Пользователей</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon purple">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"></path>
                        <path d="M1 21h22"></path>
                        <path d="M9 7h1m-1 4h1m4-4h1m-1 4h1"></path>
                    </svg>
                </div>
                <div class="stat-body">
                    <span class="stat-num">{{ branchesCount }}</span>
                    <span class="stat-label">Складов</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                </div>
                <div class="stat-body">
                    <span class="stat-num">{{ tracksCount }}</span>
                    <span class="stat-label">Треков</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path
                            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z">
                        </path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                </div>
                <div class="stat-body">
                    <span class="stat-num">{{ complaintsCount }}</span>
                    <span class="stat-label">Жалоб</span>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <h2 class="section-title">Quick Actions</h2>
        <div class="actions-grid">
            <router-link to="/superAdmin/users" class="action-card">
                <div class="ac-icon blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </div>
                <div class="ac-text">
                    <h3>Пользователи</h3>
                    <p>Управление пользователями и ролями</p>
                </div>
                <svg class="ac-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </router-link>

            <router-link to="/superAdmin/warehouses" class="action-card">
                <div class="ac-icon purple">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"></path>
                        <path d="M1 21h22"></path>
                        <path d="M9 7h1m-1 4h1m4-4h1m-1 4h1"></path>
                    </svg>
                </div>
                <div class="ac-text">
                    <h3>Склады</h3>
                    <p>Конфигурация филиалов и адресов</p>
                </div>
                <svg class="ac-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </router-link>



            <router-link to="/superAdmin/import" class="action-card">
                <div class="ac-icon orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                </div>
                <div class="ac-text">
                    <h3>Импорт</h3>
                    <p>Массовое обновление из Excel</p>
                </div>
                <svg class="ac-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </router-link>

            <router-link to="/superAdmin/history" class="action-card">
                <div class="ac-icon teal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </div>
                <div class="ac-text">
                    <h3>История</h3>
                    <p>Импортированные треки и статусы</p>
                </div>
                <svg class="ac-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </router-link>

            <router-link to="/superAdmin/settings" class="action-card">
                <div class="ac-icon gray">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path
                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
                        </path>
                    </svg>
                </div>
                <div class="ac-text">
                    <h3>Настройки</h3>
                    <p>Системные параметры и конфигурация</p>
                </div>
                <svg class="ac-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'super-admin'
})

const api = useApi()

const usersCount = ref(0)
const branchesCount = ref(0)
const tracksCount = ref(0)
const complaintsCount = ref(0)

onMounted(async () => {
    try {
        const usersRes = await api.admin.getUsers({ limit: 1 })
        usersCount.value = usersRes.data.meta.total

        const branchesRes = await api.branches.findAll()
        branchesCount.value = branchesRes.data.length

        const trackingRes = await api.tracking.dashboard()
        tracksCount.value = trackingRes.data.totalActive || Object.values(trackingRes.data).reduce((a, b) => a + Number(b), 0)
    } catch { }
})
</script>

<style scoped>
.dashboard {
    padding: 32px 40px;
    font-family: 'Inter', -apple-system, sans-serif;
    color: #e4e4e7;
    animation: slideUp 0.4s ease;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(12px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Header */
.dash-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
}

.dash-header h1 {
    font-size: 28px;
    font-weight: 700;
    color: white;
    margin: 0 0 6px;
}

.dash-subtitle {
    font-size: 14px;
    color: #71717a;
    margin: 0;
}

.system-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background-color: rgba(34, 197, 94, 0.08);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    color: #4ade80;
}

.status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #4ade80;
    box-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
    animation: pulse 2s infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

/* Stats Row */
.stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 40px;
}

.stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background-color: #18181b;
    border: 1px solid #27272a;
    border-radius: 12px;
    transition: border-color 0.2s;
}

.stat-card:hover {
    border-color: #3f3f46;
}

.stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.stat-icon svg {
    width: 20px;
    height: 20px;
}

.stat-icon.blue {
    background-color: rgba(59, 130, 246, 0.12);
    color: #60a5fa;
}

.stat-icon.purple {
    background-color: rgba(139, 92, 246, 0.12);
    color: #a78bfa;
}

.stat-icon.green {
    background-color: rgba(34, 197, 94, 0.12);
    color: #4ade80;
}

.stat-icon.orange {
    background-color: rgba(245, 158, 11, 0.12);
    color: #fbbf24;
}

.stat-body {
    display: flex;
    flex-direction: column;
}

.stat-num {
    font-size: 24px;
    font-weight: 700;
    color: white;
    line-height: 1;
}

.stat-label {
    font-size: 12px;
    color: #71717a;
    margin-top: 4px;
}

/* Section Title */
.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #a1a1aa;
    margin: 0 0 16px;
}

/* Actions Grid */
.actions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.action-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    background-color: #18181b;
    border: 1px solid #27272a;
    border-radius: 12px;
    text-decoration: none;
    color: #e4e4e7;
    transition: all 0.2s;
}

.action-card:hover {
    border-color: #3f3f46;
    background-color: #1c1c1f;
}

.action-card:hover .ac-arrow {
    opacity: 1;
    transform: translateX(0);
}

.ac-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.ac-icon svg {
    width: 18px;
    height: 18px;
}

.ac-icon.blue {
    background-color: rgba(59, 130, 246, 0.12);
    color: #60a5fa;
}

.ac-icon.purple {
    background-color: rgba(139, 92, 246, 0.12);
    color: #a78bfa;
}

.ac-icon.green {
    background-color: rgba(34, 197, 94, 0.12);
    color: #4ade80;
}

.ac-icon.orange {
    background-color: rgba(245, 158, 11, 0.12);
    color: #fbbf24;
}

.ac-icon.teal {
    background-color: rgba(20, 184, 166, 0.12);
    color: #2dd4bf;
}

.ac-icon.gray {
    background-color: rgba(113, 113, 122, 0.12);
    color: #a1a1aa;
}

.ac-text {
    flex: 1;
}

.ac-text h3 {
    font-size: 14px;
    font-weight: 600;
    color: white;
    margin: 0 0 2px;
}

.ac-text p {
    font-size: 12px;
    color: #52525b;
    margin: 0;
}

.ac-arrow {
    width: 16px;
    height: 16px;
    color: #52525b;
    opacity: 0;
    transform: translateX(-4px);
    transition: all 0.2s;
    flex-shrink: 0;
}

@media (max-width: 900px) {
    .dashboard {
        padding: 20px 16px;
    }

    .stats-row {
        grid-template-columns: repeat(2, 1fr);
    }

    .actions-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .stats-row {
        grid-template-columns: 1fr;
    }
}
</style>
