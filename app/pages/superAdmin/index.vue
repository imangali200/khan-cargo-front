<template>
    <div class="super-admin-dashboard animate-slide-up">
        <!-- Premium Header Area -->
        <header class="dashboard-header">
            <div class="welcome-section">
                <span class="badge">Супер-админ</span>
                <h1>Панель управления</h1>
                <p class="subtitle">Полный контроль над всей системой и логистикой.</p>
            </div>
            <div class="header-stats">
                <div class="h-stat">
                    <span class="label">Статус системы</span>
                    <span class="value success">Active</span>
                </div>
            </div>
        </header>

        <!-- Global Stats Row -->
        <div class="stats-grid">
            <div class="glass-card stat-item">
                <div class="card-icon cyan">👥</div>
                <div class="card-info">
                    <span class="stat-value">1,248</span>
                    <span class="stat-label">Всего клиентов</span>
                </div>
            </div>
            <div class="glass-card stat-item">
                <div class="card-icon violet">🏢</div>
                <div class="card-info">
                    <span class="stat-value">12</span>
                    <span class="stat-label">Складов в сети</span>
                </div>
            </div>
            <div class="glass-card stat-item">
                <div class="card-icon emerald">📦</div>
                <div class="card-info">
                    <span class="stat-value">15.4k</span>
                    <span class="stat-label">Завершено треков</span>
                </div>
            </div>
            <div class="glass-card stat-item">
                <div class="card-icon amber">⚠️</div>
                <div class="card-info">
                    <span class="stat-value">3</span>
                    <span class="stat-label">Активных жалоб</span>
                </div>
            </div>
        </div>
        
        <!-- Navigation Actions -->
        <div class="actions-grid">
            <router-link to="/superAdmin/users" class="glass-card action-card cyan group">
                <div class="action-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                    </svg>
                </div>
                <div class="action-details">
                    <h3>Пользователи</h3>
                    <p>Управление доступом, ролями и активацией</p>
                </div>
                <div class="arrow">→</div>
            </router-link>

            <router-link to="/superAdmin/warehouses" class="glass-card action-card violet group">
                <div class="action-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                </div>
                <div class="action-details">
                    <h3>Склады</h3>
                    <p>Конфигурация филиалов и адресных данных</p>
                </div>
                <div class="arrow">→</div>
            </router-link>

            <router-link to="/superAdmin/tracks" class="glass-card action-card emerald group">
                <div class="action-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                </div>
                <div class="action-details">
                    <h3>Трек-коды</h3>
                    <p>Общий список и поиск по всем отправлениям</p>
                </div>
                <div class="arrow">→</div>
            </router-link>

            <router-link to="/superAdmin/import" class="glass-card action-card amber group">
                <div class="action-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                </div>
                <div class="action-details">
                    <h3>Импорт</h3>
                    <p>Массовое обновление статусов из Excel</p>
                </div>
                <div class="arrow">→</div>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'admin'
})
</script>

<style scoped>
.super-admin-dashboard { padding: 20px; max-width: 1200px; margin: 0 auto; color: #fff; }
.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1); }

@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.dashboard-header { margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end; }
.welcome-section .badge { display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.1); border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 12px; color: #ff007a; }
.welcome-section h1 { font-size: 32px; font-weight: 900; margin: 0 0 8px; letter-spacing: -1px; }
.subtitle { color: rgba(255,255,255,0.6); margin: 0; }

.header-stats .h-stat { background: rgba(255,255,255,0.05); padding: 12px 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; }
.h-stat .label { font-size: 12px; color: rgba(255,255,255,0.5); }
.h-stat .value.success { color: #2ecc71; font-weight: 800; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
.glass-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; }
.stat-item { padding: 20px; display: flex; align-items: center; gap: 16px; }
.card-icon { width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.card-icon.cyan { background: rgba(0, 210, 255, 0.1); color: #00d2ff; }
.card-icon.violet { background: rgba(142, 45, 226, 0.1); color: #8e2de2; }
.card-icon.emerald { background: rgba(46, 204, 113, 0.1); color: #2ecc71; }
.card-icon.amber { background: rgba(242, 153, 74, 0.1); color: #f2994a; }
.stat-value { font-size: 22px; font-weight: 800; display: block; }
.stat-label { font-size: 12px; color: rgba(255,255,255,0.5); font-weight: 600; }

.actions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.action-card { padding: 32px; text-decoration: none; color: #fff; display: flex; align-items: center; gap: 24px; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; }
.action-card:hover { transform: translateY(-8px); border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.06); }
.action-icon { width: 72px; height: 72px; border-radius: 20px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
.action-card.cyan:hover .action-icon { background: #00d2ff; color: #fff; box-shadow: 0 10px 20px rgba(0, 210, 255, 0.3); }
.action-card.violet:hover .action-icon { background: #8e2de2; color: #fff; box-shadow: 0 10px 20px rgba(142, 45, 226, 0.3); }
.action-card.emerald:hover .action-icon { background: #2ecc71; color: #fff; box-shadow: 0 10px 20px rgba(46, 204, 113, 0.3); }
.action-card.amber:hover .action-icon { background: #f2994a; color: #fff; box-shadow: 0 10px 20px rgba(242, 153, 74, 0.3); }

.action-details h3 { font-size: 20px; font-weight: 800; margin: 0 0 6px; }
.action-details p { font-size: 14px; color: rgba(255,255,255,0.5); margin: 0; line-height: 1.5; }
.arrow { position: absolute; right: 32px; font-size: 24px; opacity: 0; transform: translateX(-10px); transition: all 0.3s; }
.action-card:hover .arrow { opacity: 1; transform: translateX(0); }

@media (max-width: 900px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .actions-grid { grid-template-columns: 1fr; }
}
</style>
