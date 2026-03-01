<template>
    <div class="branches-page">
        <div class="container">
            <header class="page-header">
                <button @click="$router.back()" class="back-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Назад
                </button>
                <h1 class="page-title">Наши филиалы</h1>
                <p class="page-subtitle">Выберите ближайший к вам склад для получения или отправки грузов.</p>
            </header>

            <div v-if="isLoading" class="loading-state">
                <div class="loader"></div>
                <p>Загрузка филиалов...</p>
            </div>

            <div v-else-if="branches.length === 0" class="empty-state">
                <p>Филиалы не найдены.</p>
            </div>

            <div v-else class="branches-grid">
                <div v-for="branch in branches" :key="branch.id" class="branch-card">
                    <div class="branch-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </div>
                    <div class="branch-info">
                        <h2 class="branch-name">{{ branch.name }}</h2>
                        <p class="branch-address" v-if="branch.address">{{ branch.address }}</p>
                        <p class="branch-address placeholder" v-else>Адрес не указан</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Branch } from '~/types';

definePageMeta({
    layout: false,
});

const branches = ref<Branch[]>([]);
const isLoading = ref(true);

async function fetchBranches() {
    try {
        const res = await useApi().branches.findAll();
        branches.value = res.data;
    } catch (err) {
        console.error('Failed to fetch branches:', err);
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    fetchBranches();
});
</script>

<style scoped>
.branches-page {
    min-height: 100vh;
    background-color: #0d1117;
    color: #ffffff;
    padding: 40px 20px;
    font-family: 'Inter', sans-serif;
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

.page-header {
    margin-bottom: 40px;
}

.back-btn {
    background: none;
    border: none;
    color: #2563eb;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 24px;
    padding: 0;
}

.page-title {
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 12px;
}

.page-subtitle {
    font-size: 16px;
    color: #8b949e;
    line-height: 1.5;
}

.branches-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

.branch-card {
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    align-items: flex-start;
    gap: 20px;
    transition: transform 0.2s ease, border-color 0.2s ease;
}

.branch-card:hover {
    transform: translateY(-2px);
    border-color: #2563eb;
}

.branch-icon {
    width: 48px;
    height: 48px;
    background-color: rgba(37, 99, 235, 0.1);
    color: #2563eb;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.branch-icon svg {
    width: 24px;
    height: 24px;
}

.branch-info {
    flex: 1;
}

.branch-name {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 4px;
}

.branch-address {
    font-size: 15px;
    color: #8b949e;
    margin: 0;
}

.branch-address.placeholder {
    font-style: italic;
    opacity: 0.6;
}

.loading-state,
.empty-state {
    text-align: center;
    padding: 60px 0;
    color: #8b949e;
}

.loader {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(37, 99, 235, 0.1);
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 640px) {
    .page-title {
        font-size: 26px;
    }

    .branch-card {
        padding: 20px;
    }
}
</style>
