<template>
    <div class="user-management animate-slide-up">
        <!-- Premium Header Area -->
        <header class="page-header">
            <div class="breadcrumb">
                <router-link to="/superAdmin">Главная</router-link>
                <span class="sep">/</span>
                <span class="current">Пользователи</span>
            </div>
            <div class="title-section">
                <h1>Управление пользователями</h1>
                <p class="subtitle">Управление доступом, ролями и статусами активации</p>
            </div>
        </header>

        <!-- Search & Actions Bar -->
        <section class="actions-bar glass-card">
            <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" v-model="searchValue" @input="handleSearch" placeholder="Поиск по имени, коду или телефону..." />
            </div>
            
            <div class="filters-actions">
                <select v-model="selectedBranch" class="premium-select">
                    <option value="">Все склады</option>
                    <option v-for="b in branches" :key="b.id" :value="b.name">{{ b.name }}</option>
                </select>
                
                <router-link to="/superAdmin/create" class="add-btn">
                    <span class="plus">+</span> Добавить
                </router-link>
            </div>
        </section>

        <!-- Desktop Users Table -->
        <div class="table-container glass-card desktop-only">
            <div class="table-header">
                <h2>База данных пользователей</h2>
                <span class="count">{{ filteredUsers.length }} пользователей</span>
            </div>
            <div class="table-wrapper">
                <table class="premium-table">
                    <thead>
                        <tr>
                            <th>Пользователь</th>
                            <th>Роль</th>
                            <th>Код</th>
                            <th>Телефон</th>
                            <th>Пароль</th>
                            <th>Филиал / Дата</th>
                            <th>Статус</th>
                            <th class="actions-th">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in paginatedUsers" :key="user.id" class="table-row">
                            <td>
                                <div class="user-cell">
                                    <div :class="['avatar', getRoleClass(user.role)]">
                                        {{ user.name.charAt(0) }}{{ user.surname.charAt(0) }}
                                    </div>
                                    <div class="u-info">
                                        <span class="u-name">{{ user.name }} {{ user.surname }}</span>
                                        <span class="u-id">ID: {{ user.id }}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span :class="['role-badge', getRoleClass(user.role)]">{{ user.role }}</span>
                            </td>
                            <td class="mono-td">{{ user.code || '—' }}</td>
                            <td class="tel-td">{{ user.phoneNumber }}</td>
                            <td class="pass-td">{{ user.password }}</td>
                            <td class="branch-td">
                                <span>{{ user.branch || formatDate(user.createAt) }}</span>
                            </td>
                            <td>
                                <span v-if="user.role === 'user'" 
                                      :class="['status-badge', user.isActive ? 'active' : 'inactive']">
                                    {{ user.isActive ? 'Активен' : 'Неактивен' }}
                                </span>
                                <span v-else class="status-badge system">Система</span>
                            </td>
                            <td class="actions-td">
                                <div class="btn-group">
                                    <button v-if="user.role === 'user'" 
                                            @click="toggleActivation(user.id)"
                                            :class="['icon-btn', user.isActive ? 'deact' : 'act']">
                                        {{ user.isActive ? '🔒' : '🔓' }}
                                    </button>
                                    <button @click="routeToEdit(user.id)" class="icon-btn edit">✏️</button>
                                    <button @click="deleteUserLocal(user.id)" class="icon-btn delete">🗑️</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Mobile View Cards -->
        <div class="mobile-only mobile-cards">
            <div v-for="user in paginatedUsers" :key="'m-' + user.id" class="user-card glass-card">
                <div class="card-header">
                    <div class="avatar-small" :class="getRoleClass(user.role)">
                        {{ user.name.charAt(0) }}{{ user.surname.charAt(0) }}
                    </div>
                    <div class="m-info">
                        <h3>{{ user.name }} {{ user.surname }}</h3>
                        <span class="role-text">{{ user.role }}</span>
                    </div>
                    <span v-if="user.role === 'user'" :class="['status-dot', user.isActive ? 'active' : 'inactive']"></span>
                </div>
                <div class="card-body">
                    <div class="data-row"><span>Код:</span> <strong>{{ user.code || '—' }}</strong></div>
                    <div class="data-row"><span>Тел:</span> <strong>{{ user.phoneNumber }}</strong></div>
                    <div class="data-row"><span>Пароль:</span> <strong>{{ user.password }}</strong></div>
                </div>
                <div class="card-footer">
                    <button v-if="user.role === 'user'" @click="toggleActivation(user.id)" class="m-btn deact">Статус</button>
                    <button @click="routeToEdit(user.id)" class="m-btn edit">Изменить</button>
                    <button @click="deleteUserLocal(user.id)" class="m-btn delete">Удалить</button>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
            <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">←</button>
            <div class="page-numbers">
                <button v-for="p in visiblePages" :key="p" @click="currentPage = p" :class="['num-btn', { active: currentPage === p }]">{{ p }}</button>
            </div>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">→</button>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'superAdmin'
})

import { useToast } from '~/composables/useToast'
const toast = useToast()
const router = useRouter()

const users = ref([
    { id: 101, name: 'Алексей', surname: 'Верховный', phoneNumber: '+77012223344', password: 'root', role: 'superAdmin', code: 'SA-01', branch: 'Main Control', isActive: true, createAt: '2023-10-01T12:00:00Z' },
    { id: 102, name: 'Светлана', surname: 'Админова', phoneNumber: '+77773334455', password: 'pass', role: 'admin', code: 'A-02', branch: 'Алматы', isActive: true, createAt: '2023-11-01T10:00:00Z' },
    { id: 103, name: 'Иван', surname: 'Иванов', phoneNumber: '+77051112233', password: '123', role: 'user', code: 'Ai-555', branch: null, isActive: true, createAt: '2024-01-15T09:30:00Z' },
    { id: 104, name: 'Мария', surname: 'Ли', phoneNumber: '+77085556677', password: '888', role: 'user', code: 'Ai-888', branch: null, isActive: false, createAt: '2024-02-10T14:20:00Z' },
    ...Array.from({ length: 16 }, (_, i) => ({
        id: 110 + i,
        name: `Юзер-${i + 1}`,
        surname: 'Тестовый',
        phoneNumber: `+7707${1000000 + i}`,
        password: `p${100 + i}`,
        role: 'user',
        code: `Ai-${1000 + i}`,
        branch: null,
        isActive: i % 3 !== 0,
        createAt: new Date().toISOString()
    }))
])

const branches = ref([
    { id: 1, name: 'Алматы' },
    { id: 2, name: 'Шымкент' },
    { id: 3, name: 'Астана' }
])

const searchValue = ref('')
const selectedBranch = ref('')
const currentPage = ref(1)
const perPage = 8

const filteredUsers = computed(() => {
    let res = users.value
    if (selectedBranch.value) res = res.filter(u => u.branch === selectedBranch.value)
    if (searchValue.value) {
        const q = searchValue.value.toLowerCase()
        res = res.filter(u => 
            u.name.toLowerCase().includes(q) || 
            u.surname.toLowerCase().includes(q) || 
            u.phoneNumber.includes(q) || 
            (u.code && u.code.toLowerCase().includes(q))
        )
    }
    return res
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / perPage))
const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return filteredUsers.value.slice(start, start + perPage)
})

const visiblePages = computed(() => {
    const pages = []
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
    return pages
})

const routeToEdit = (id: number) => {
    toast.info('Переход к редактированию (симуляция)')
}

const toggleActivation = (id: number) => {
    const user = users.value.find(u => u.id === id)
    if (user) {
        user.isActive = !user.isActive
        toast.success(user.isActive ? 'Пользователь активирован' : 'Пользователь деактивирован')
    }
}

const deleteUserLocal = (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return
    users.value = users.value.filter(u => u.id !== id)
    toast.success('Пользователь удален')
}

const getRoleClass = (role: string) => {
    if (role === 'superAdmin') return 'amber'
    if (role === 'admin') return 'violet'
    return 'cyan'
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const handleSearch = () => currentPage.value = 1
watch(selectedBranch, () => currentPage.value = 1)
</script>

<style scoped>
.user-management { padding: 20px; max-width: 1200px; margin: 0 auto; color: #fff; }
.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1); }

@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.page-header { margin-bottom: 24px; }
.breadcrumb { display: flex; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
.breadcrumb a { color: #00d2ff; text-decoration: none; font-weight: 600; }
.title-section h1 { font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -1px; }
.subtitle { color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 4px; }

.glass-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; }

.actions-bar { padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 24px; }
.search-box { flex: 1; max-width: 400px; display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.05); padding: 10px 16px; border-radius: 12px; }
.search-box input { background: transparent; border: none; outline: none; color: #fff; width: 100%; font-size: 14px; font-weight: 600; }

.filters-actions { display: flex; gap: 12px; }
.premium-select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; padding: 10px 16px; font-size: 14px; outline: none; cursor: pointer; }
.add-btn { background: #00d2ff; color: #fff; padding: 10px 20px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3); transition: all 0.2s; }
.add-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 210, 255, 0.4); }

.table-header { padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; }
.table-header h2 { font-size: 18px; font-weight: 800; margin: 0; }
.count { background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 10px; font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.4); }

.premium-table { width: 100%; border-collapse: collapse; }
.premium-table th { text-align: left; padding: 16px 20px; background: rgba(255,255,255,0.02); font-size: 11px; color: rgba(255,255,255,0.3); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
.premium-table td { padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); }

.user-cell { display: flex; align-items: center; gap: 12px; }
.avatar { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: #fff; }
.avatar.amber { background: linear-gradient(135deg, #f2994a, #f2c94c); }
.avatar.violet { background: linear-gradient(135deg, #8e2de2, #4a00e0); }
.avatar.cyan { background: linear-gradient(135deg, #00d2ff, #3a7bd5); }

.u-name { display: block; font-weight: 700; font-size: 14px; }
.u-id { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 600; }

.role-badge { padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; text-transform: capitalize; }
.role-badge.amber { background: rgba(242, 153, 74, 0.15); color: #f2994a; }
.role-badge.violet { background: rgba(142, 45, 226, 0.15); color: #8e2de2; }
.role-badge.cyan { background: rgba(0, 210, 255, 0.15); color: #00d2ff; }

.mono-td { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #00d2ff; }
.tel-td { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.7); }
.pass-td { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: rgba(255,255,255,0.4); }
.branch-td { font-size: 13px; font-weight: 600; }

.status-badge { padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; }
.status-badge.active { background: rgba(46, 204, 113, 0.15); color: #2ecc71; }
.status-badge.inactive { background: rgba(231, 76, 60, 0.15); color: #e74c3c; }
.status-badge.system { background: rgba(255, 255, 255, 0.1); color: rgba(255,255,255,0.6); }

.btn-group { display: flex; gap: 8px; }
.icon-btn { width: 32px; height: 32px; border-radius: 8px; border: none; background: rgba(255,255,255,0.05); cursor: pointer; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.icon-btn:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); }
.icon-btn.act { color: #2ecc71; }
.icon-btn.deact { color: #e74c3c; }

.pagination { padding: 20px; display: flex; justify-content: center; align-items: center; gap: 12px; }
.page-numbers { display: flex; gap: 6px; }
.page-btn, .num-btn { width: 36px; height: 36px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: #fff; cursor: pointer; font-weight: 700; transition: all 0.2s; }
.num-btn.active { background: #00d2ff; border-color: #00d2ff; box-shadow: 0 4px 10px rgba(0, 210, 255, 0.3); }
.page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.mobile-only { display: none; }
@media (max-width: 1024px) {
    .desktop-only { display: none; }
    .mobile-only { display: block; }
    .actions-bar { flex-direction: column; align-items: stretch; }
}

.mobile-cards { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
.user-card { padding: 16px; }
.card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; position: relative; }
.avatar-small { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; }
.m-info h3 { font-size: 16px; margin: 0; font-weight: 800; }
.role-text { font-size: 11px; text-transform: uppercase; font-weight: 800; opacity: 0.5; }
.status-dot { width: 10px; height: 10px; border-radius: 50%; position: absolute; right: 0; top: 0; }
.status-dot.active { background: #2ecc71; box-shadow: 0 0 10px #2ecc71; }
.status-dot.inactive { background: #e74c3c; }

.card-body { display: grid; gap: 8px; font-size: 13px; margin-bottom: 16px; }
.data-row { display: flex; justify-content: space-between; }
.data-row span { opacity: 0.5; }

.card-footer { display: flex; gap: 8px; }
.m-btn { flex: 1; padding: 10px; border-radius: 10px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.m-btn.edit { background: rgba(0, 210, 255, 0.1); color: #00d2ff; }
.m-btn.delete { background: rgba(231, 76, 60, 0.1); color: #e74c3c; }
.m-btn.deact { background: rgba(255,255,255,0.05); color: #fff; }
</style>
