<template>
    <div class="preview-hub">
        <header class="hub-header">
            <div class="logo">Ai</div>
            <h1>Ai-Market Ecosystem</h1>
            <p>Центральный хаб предпросмотра обновленного интерфейса. Система авторизации отключена для удобства тестирования.</p>
        </header>

        <main class="hub-container">
            <!-- User Section -->
            <section class="hub-section">
                <h2 class="section-title">📱 Интерфейс Пользователя</h2>
                <div class="hub-grid">
                    <NuxtLink to="/user" class="hub-card user">
                        <div class="card-icon">🏠</div>
                        <div class="card-info">
                            <h3>Dashboard</h3>
                            <p>Лента постов и глобальная статистика</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/user/products" class="hub-card user">
                        <div class="card-icon">📦</div>
                        <div class="card-info">
                            <h3>My Products</h3>
                            <p>Трекинг и управление посылками</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/user/me" class="hub-card user">
                        <div class="card-icon">👤</div>
                        <div class="card-info">
                            <h3>Account</h3>
                            <p>Профиль и персональные настройки</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/user/feed" class="hub-card user">
                        <div class="card-icon">🎬</div>
                        <div class="card-info">
                            <h3>Reels Feed</h3>
                            <p>Полноэкранные видео-отзывы</p>
                        </div>
                    </NuxtLink>
                </div>
            </section>

            <!-- Admin Section -->
            <section class="hub-section">
                <h2 class="section-title">🏢 Администратор филиала</h2>
                <div class="hub-grid">
                    <NuxtLink to="/admin" class="hub-card admin">
                        <div class="card-icon">⚡</div>
                        <div class="card-info">
                            <h3>Admin Console</h3>
                            <p>Приемка и выдача товаров на складе</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/admin/history" class="hub-card admin">
                        <div class="card-icon">📜</div>
                        <div class="card-info">
                            <h3>Warehouse History</h3>
                            <p>Логи перемещения и выдачи товаров</p>
                        </div>
                    </NuxtLink>
                </div>
            </section>

            <!-- Super Admin Section -->
            <section class="hub-section">
                <h2 class="section-title">👑 Super Admin (Global Control)</h2>
                <div class="hub-grid">
                    <NuxtLink to="/superAdmin" class="hub-card s-admin">
                        <div class="card-icon">🏛️</div>
                        <div class="card-info">
                            <h3>Global Dashboard</h3>
                            <p>Глобальная статистика всей сети</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/superAdmin/users" class="hub-card s-admin">
                        <div class="card-info">
                            <h3>User Control</h3>
                            <p>Управление персоналом и клиентами</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/superAdmin/warehouses" class="hub-card s-admin">
                        <div class="card-info">
                            <h3>Branch Control</h3>
                            <p>Управление филиалами (складами)</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/superAdmin/tracks" class="hub-card s-admin">
                        <div class="card-info">
                            <h3>Global Tracking</h3>
                            <p>Мониторинг всех посылок в системе</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/superAdmin/import" class="hub-card s-admin">
                        <div class="card-info">
                            <h3>Data Import</h3>
                            <p>Массовая загрузка трек-кодов</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/superAdmin/trash" class="hub-card s-admin">
                        <div class="card-info">
                            <h3>Trash Bin</h3>
                            <p>Архив удаленных пользователей</p>
                        </div>
                    </NuxtLink>
                </div>
            </section>

            <!-- Auth Section -->
            <section class="hub-section">
                <h2 class="section-title">🔐 Вход в систему</h2>
                <div class="hub-grid">
                    <NuxtLink to="/auth/login" class="hub-card auth">
                        <div class="card-icon">🔑</div>
                        <div class="card-info">
                            <h3>Login Page</h3>
                            <p>Экран входа (ультра-премиум дизайн)</p>
                        </div>
                    </NuxtLink>
                </div>
            </section>
        </main>

        <div class="hub-footer">
            <p>© 2024 Ai-Market Engineering • Preview Hub v2.0</p>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: false
})
</script>

<style scoped>
.preview-hub {
    min-height: 100vh;
    background: #0f172a;
    padding: 60px 20px;
    font-family: 'Outfit', sans-serif;
    color: #fff;
}

.hub-header { text-align: center; margin-bottom: 60px; max-width: 700px; margin-inline: auto; }
.logo {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, #8e2de2, #4a00e0);
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    font-size: 30px; font-weight: 900;
    margin: 0 auto 24px;
    box-shadow: 0 12px 30px rgba(142, 45, 226, 0.3);
}
.hub-header h1 { font-size: 42px; font-weight: 900; margin: 0 0 16px; letter-spacing: -1.5px; }
.hub-header p { font-size: 16px; color: rgba(255,255,255,0.4); line-height: 1.6; }

.hub-container { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 60px; }

.section-title { font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.3); margin-bottom: 24px; padding-left: 10px; border-left: 3px solid #8e2de2; }

.hub-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }

.hub-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 24px;
    border-radius: 24px;
    text-decoration: none;
    display: flex; align-items: center; gap: 20px;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    backdrop-filter: blur(10px);
}

.hub-card:hover { transform: translateY(-4px); background: rgba(255,255,255,0.06); border-color: rgba(142, 45, 226, 0.3); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }

.card-icon { font-size: 28px; width: 56px; height: 56px; background: rgba(255,255,255,0.05); border-radius: 16px; display: flex; align-items: center; justify-content: center; }

.card-info h3 { font-size: 17px; font-weight: 800; color: #fff; margin: 0 0 4px; }
.card-info p { font-size: 13px; color: rgba(255,255,255,0.4); margin: 0; }

/* Custom Themes per section */
.hub-card.admin:hover { border-color: rgba(52, 152, 219, 0.4); }
.hub-card.s-admin:hover { border-color: rgba(241, 196, 15, 0.4); }
.hub-card.user:hover { border-color: rgba(142, 45, 226, 0.4); }

.hub-footer { margin-top: 100px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 40px; }
.hub-footer p { font-size: 12px; color: rgba(255,255,255,0.2); font-weight: 700; }

@media (max-width: 600px) {
    .hub-grid { grid-template-columns: 1fr; }
    .hub-header h1 { font-size: 32px; }
}
</style>