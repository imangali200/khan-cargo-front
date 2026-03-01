<template>
    <div class="warehouse-management animate-slide-up">
        <!-- Premium Header Area -->
        <header class="page-header">
            <div class="breadcrumb">
                <router-link to="/superAdmin">Главная</router-link>
                <span class="sep">/</span>
                <span class="current">Склады</span>
            </div>
            <div class="title-section">
                <h1>Управление складами</h1>
                <p class="subtitle">Конфигурация филиалов и ответственных лиц</p>
            </div>
        </header>

        <!-- Actions Bar -->
        <section class="actions-bar glass-card">
            <div class="bar-info">
                <span class="count-badge">{{ branchData.length }} филиалов</span>
            </div>
            <div class="bar-actions">
                <router-link to="/superAdmin/warehouses/trash" class="trash-btn">
                    🗑️ Корзина
                </router-link>
                <router-link to="/superAdmin/warehouses/create" class="add-btn">
                    + Добавить склад
                </router-link>
            </div>
        </section>

        <!-- Warehouses Grid -->
        <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Загрузка данных...</p>
        </div>

        <div v-else-if="branchData.length === 0" class="empty-state glass-card">
            <div class="empty-icon">🏢</div>
            <h3>Нет активных складов</h3>
            <p>Добавьте первый склад в систему для начала работы</p>
            <router-link to="/superAdmin/warehouses/create" class="add-btn large">Создать склад</router-link>
        </div>

        <div v-else class="warehouses-grid">
            <div v-for="branch in branchData" :key="branch.id" class="branch-card glass-card group">
                <div class="card-glow"></div>
                <div class="card-head">
                    <div class="id-tag">#{{ branch.id }}</div>
                    <div class="status-indicator">Active</div>
                </div>

                <div class="card-main">
                    <div class="icon-box">🏢</div>
                    <div class="content">
                        <h3>{{ branch.name }}</h3>
                        <p class="resp">Ответственный: <span>{{ branch.admin ? `${branch.admin.name}
                                ${branch.admin.lastName}` : 'Не назначен' }}</span></p>
                    </div>
                </div>

                <div class="card-stats">
                    <div class="stat">
                        <span class="val">1,2k</span>
                        <span class="lbl">Посылок</span>
                    </div>
                    <div class="stat">
                        <span class="val">8</span>
                        <span class="lbl">Сотрудников</span>
                    </div>
                </div>

                <div class="card-actions">
                    <router-link :to="`/superAdmin/warehouses/edit/${branch.id}`" class="action-btn edit">
                        Изменить
                    </router-link>
                    <button @click="removeBranch(branch.id)" class="action-btn delete">
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'admin'
})

import { useToast } from '~/composables/useToast'
import type { Branch } from '~/types'

const toast = useToast()
const api = useApi()

const branchData = ref<Branch[]>([])
const loading = ref(false)

const fetchBranches = async () => {
    loading.value = true
    try {
        const { data } = await api.branches.findAll()
        branchData.value = data
    } catch {
        toast.error('Ошибка при загрузке складов')
    } finally {
        loading.value = false
    }
}

const removeBranch = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот склад из системы?')) return
    try {
        await api.branches.remove(id)
        toast.success('Склад успешно удален')
        fetchBranches()
    } catch {
        toast.error('Ошибка при удалении склада')
    }
}

onMounted(() => {
    fetchBranches()
})
</script>

<style scoped>
.warehouse-management {
    padding: 20px;
    max-width: 1200px;
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

.page-header {
    margin-bottom: 24px;
}

.breadcrumb {
    display: flex;
    gap: 8px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 8px;
}

.breadcrumb a {
    color: #8e2de2;
    text-decoration: none;
    font-weight: 600;
}

.title-section h1 {
    font-size: 28px;
    font-weight: 900;
    margin: 0;
    letter-spacing: -1px;
}

.subtitle {
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    margin-top: 4px;
}

.glass-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
}

.actions-bar {
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
}

.count-badge {
    background: rgba(142, 45, 226, 0.1);
    color: #8e2de2;
    padding: 6px 14px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 800;
    border: 1px solid rgba(142, 45, 226, 0.2);
}

.bar-actions {
    display: flex;
    gap: 12px;
}

.trash-btn {
    padding: 10px 18px;
    border-radius: 12px;
    background: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
    border: 1px solid rgba(231, 76, 60, 0.2);
    transition: all 0.2s;
}

.add-btn {
    padding: 10px 20px;
    border-radius: 12px;
    background: linear-gradient(135deg, #8e2de2, #4a00e0);
    color: #fff;
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
    box-shadow: 0 4px 15px rgba(142, 45, 226, 0.3);
    transition: all 0.2s;
}

.add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(142, 45, 226, 0.4);
}

.warehouses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
}

.branch-card {
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.branch-card:hover {
    transform: translateY(-8px);
    border-color: rgba(142, 45, 226, 0.4);
    background: rgba(255, 255, 255, 0.05);
}

.card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.id-tag {
    font-size: 11px;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.05);
    padding: 4px 8px;
    border-radius: 6px;
}

.status-indicator {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    color: #2ecc71;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.status-indicator::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #2ecc71;
    border-radius: 50%;
    box-shadow: 0 0 10px #2ecc71;
}

.card-main {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-bottom: 24px;
}

.icon-box {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(142, 45, 226, 0.2), rgba(74, 0, 224, 0.2));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #8e2de2;
    border: 1px solid rgba(142, 45, 226, 0.2);
}

.content h3 {
    font-size: 20px;
    font-weight: 800;
    margin: 0 0 4px;
    letter-spacing: -0.5px;
}

.resp {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    margin: 0;
}

.resp span {
    color: rgba(255, 255, 255, 0.8);
    font-weight: 600;
}

.card-stats {
    display: flex;
    gap: 20px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 14px;
    margin-bottom: 24px;
}

.stat {
    display: flex;
    flex-direction: column;
}

.stat .val {
    font-size: 16px;
    font-weight: 800;
    color: #fff;
}

.stat .lbl {
    font-size: 10px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
}

.card-actions {
    display: flex;
    gap: 10px;
}

.action-btn {
    flex: 1;
    padding: 12px;
    border-radius: 10px;
    border: none;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    text-decoration: none;
}

.action-btn.edit {
    background: rgba(142, 45, 226, 0.1);
    color: #8e2de2;
}

.action-btn.edit:hover {
    background: #8e2de2;
    color: #fff;
}

.action-btn.delete {
    background: rgba(231, 76, 60, 0.05);
    color: #e74c3c;
}

.action-btn.delete:hover {
    background: #e74c3c;
    color: #fff;
}

.loading-state {
    text-align: center;
    padding: 64px;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(142, 45, 226, 0.1);
    border-top-color: #8e2de2;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.empty-state {
    padding: 64px;
    text-align: center;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
}

.empty-state h3 {
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 8px;
}

.empty-state p {
    opacity: 0.5;
    margin-bottom: 24px;
}
</style>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>
