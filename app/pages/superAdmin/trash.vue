<template>
    <div class="user-archive animate-slide-up">
        <!-- Premium Header Area -->
        <header class="page-header">
            <div class="breadcrumb">
                <router-link to="/superAdmin">Главная</router-link>
                <span class="sep">/</span>
                <router-link to="/superAdmin/users">Пользователи</router-link>
                <span class="sep">/</span>
                <span class="current">Архив</span>
            </div>
            <div class="title-section">
                <h1>Архив пользователей</h1>
                <p class="subtitle">Управление удаленными аккаунтами и их восстановление</p>
            </div>
        </header>

        <!-- Stats Bar -->
        <section class="stats-bar glass-card border-red">
            <div class="stat-info">
                <span class="count-badge red">{{ archiveUsers.length }} удаленных</span>
                <p class="info-text">Данные хранятся 30 дней перед окончательным удалением</p>
            </div>
            <button @click="router.back()" class="back-btn">← Назад</button>
        </section>

        <!-- Empty State -->
        <div v-if="archiveUsers.length === 0" class="empty-state glass-card">
            <div class="empty-icon">🗑️</div>
            <h3>Корзина пуста</h3>
            <p>У вас нет недавно удаленных пользователей</p>
            <router-link to="/superAdmin/users" class="back-link">Вернуться в управление</router-link>
        </div>

        <!-- Desktop Table -->
        <div v-else class="table-container glass-card desktop-only">
            <table class="archive-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Код</th>
                        <th>ФИО</th>
                        <th>Роль</th>
                        <th>Дата удаления</th>
                        <th class="actions-th">Управление</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in archiveUsers" :key="user.id" class="table-row">
                        <td class="id-td">#{{ user.id }}</td>
                        <td class="code-td">{{ user.code || '—' }}</td>
                        <td class="name-td">
                            <div class="user-info">
                                <div class="avatar">{{ user.name[0] }}{{ user.surname[0] }}</div>
                                <div class="names">
                                    <span class="full">{{ user.name }} {{ user.surname }}</span>
                                    <span class="phone">{{ user.phoneNumber }}</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span :class="['role-badge', user.role]">{{ user.role }}</span>
                        </td>
                        <td class="date-td">{{ formatDate(user.deletedAt) }}</td>
                        <td class="actions-td">
                            <button @click="restoreUserLocal(user.id)" class="restore-btn">
                                Восстановить ✨
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Mobile Cards -->
        <div class="mobile-only mobile-cards">
            <div v-for="user in archiveUsers" :key="'m-' + user.id" class="archive-card glass-card">
                <div class="card-head">
                    <span class="id-tag">#{{ user.id }}</span>
                    <span :class="['badge', user.role]">{{ user.role }}</span>
                </div>
                <div class="card-main">
                    <div class="user-box">
                        <div class="avatar-m">{{ user.name[0] }}{{ user.surname[0] }}</div>
                        <div class="names">
                            <h3>{{ user.name }} {{ user.surname }}</h3>
                            <p>{{ user.phoneNumber }}</p>
                        </div>
                    </div>
                    <div class="del-info">
                        <span>Удален:</span>
                        <strong>{{ formatDate(user.deletedAt) }}</strong>
                    </div>
                </div>
                <button @click="restoreUserLocal(user.id)" class="m-restore-btn">Восстановить аккаунт</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'admin'
})

import { useToast } from '~/composables/useToast'
const toast = useToast()
const router = useRouter()

const archiveUsers = ref([
    { id: 105, name: 'Евгений', surname: 'Пропащий', phoneNumber: '+77771234567', role: 'user', code: 'Ai-999', deletedAt: '2024-03-10T14:20:00Z' },
    { id: 108, name: 'Кристина', surname: 'Удаленная', phoneNumber: '+77015556677', role: 'admin', code: 'A-12', deletedAt: '2024-03-12T09:30:00Z' },
    { id: 112, name: 'Дамир', surname: 'Бывший', phoneNumber: '+77078881122', role: 'user', code: 'Ai-444', deletedAt: '2024-03-14T18:45:00Z' }
])

const formatDate = (time: string | null) => {
    if (!time) return '—'
    return new Date(time).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
}

const restoreUserLocal = (id: number) => {
    if (!confirm('Восстановить этого пользователя и вернуть ему доступ к системе?')) return
    archiveUsers.value = archiveUsers.value.filter(u => u.id !== id)
    toast.success('Пользователь успешно восстановлен (локально)')
}
</script>

<style scoped>
.user-archive { padding: 20px; max-width: 1000px; margin: 0 auto; color: #fff; }
.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1); }

@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.page-header { margin-bottom: 24px; }
.breadcrumb { display: flex; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
.breadcrumb a { color: #e74c3c; text-decoration: none; font-weight: 600; }
.title-section h1 { font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -1px; }
.subtitle { color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 4px; }

.glass-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; }
.glass-card.border-red { border-color: rgba(231, 76, 60, 0.2); }

.stats-bar { padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.stat-info { display: flex; flex-direction: column; gap: 4px; }
.count-badge.red { background: rgba(231, 76, 60, 0.1); color: #e74c3c; padding: 4px 12px; border-radius: 10px; font-size: 12px; font-weight: 800; border: 1px solid rgba(231, 76, 60, 0.2); width: fit-content; }
.info-text { font-size: 12px; color: rgba(255,255,255,0.4); margin: 0; }
.back-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 10px 20px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.back-btn:hover { background: rgba(255,255,255,0.1); transform: translateX(-4px); }

.archive-table { width: 100%; border-collapse: collapse; }
.archive-table th { text-align: left; padding: 16px 20px; background: rgba(255,255,255,0.02); font-size: 11px; color: rgba(255,255,255,0.3); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
.archive-table td { padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); }

.id-td { font-size: 12px; color: rgba(255,255,255,0.3); font-weight: 700; }
.code-td { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #fff; opacity: 0.8; }

.user-info { display: flex; gap: 14px; align-items: center; }
.avatar { width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #e74c3c, #c0392b); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: #fff; }
.names { display: flex; flex-direction: column; }
.full { font-weight: 700; font-size: 14px; }
.phone { font-size: 12px; color: rgba(255,255,255,0.4); }

.role-badge { padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 900; text-transform: uppercase; }
.role-badge.superAdmin { background: rgba(241, 196, 15, 0.1); color: #f1c40f; }
.role-badge.admin { background: rgba(155, 89, 182, 0.1); color: #9b59b6; }
.role-badge.user { background: rgba(52, 152, 219, 0.1); color: #3498db; }

.date-td { font-size: 12px; color: rgba(255,255,255,0.5); }

.restore-btn { background: rgba(46, 204, 113, 0.1); border: 1px solid rgba(46, 204, 113, 0.2); color: #2ecc71; padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
.restore-btn:hover { background: #2ecc71; color: #fff; font-weight: 900; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3); }

.empty-state { padding: 64px; text-align: center; }
.empty-icon { font-size: 48px; margin-bottom: 20px; opacity: 0.3; }
.empty-state h3 { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
.empty-state p { opacity: 0.4; margin-bottom: 24px; }
.back-link { color: #e74c3c; text-decoration: none; font-weight: 700; }

.mobile-only { display: none; }
@media (max-width: 850px) {
    .desktop-only { display: none; }
    .mobile-only { display: block; }
}

.mobile-cards { display: grid; gap: 16px; }
.archive-card { padding: 20px; border-color: rgba(231, 76, 60, 0.15); }
.card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.id-tag { font-size: 11px; font-weight: 800; opacity: 0.3; }
.badge { padding: 4px 8px; border-radius: 6px; font-size: 9px; font-weight: 900; text-transform: uppercase; }
.badge.superAdmin { background: #f1c40f22; color: #f1c40f; }
.badge.admin { background: #9b59b622; color: #9b59b6; }
.badge.user { background: #3498db22; color: #3498db; }

.user-box { display: flex; gap: 14px; align-items: center; margin-bottom: 20px; }
.avatar-m { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #e74c3c, #c0392b); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; color: #fff; }
.names h3 { font-size: 16px; font-weight: 800; margin: 0; }
.names p { font-size: 12px; color: rgba(255,255,255,0.4); margin: 2px 0 0; }

.del-info { background: rgba(0,0,0,0.2); padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; margin-bottom: 20px; }
.del-info span { opacity: 0.4; }
.del-info strong { color: #e74c3c; }

.m-restore-btn { width: 100%; padding: 12px; border-radius: 12px; border: none; background: #2ecc71; color: #fff; font-weight: 800; font-size: 14px; cursor: pointer; }
</style>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
