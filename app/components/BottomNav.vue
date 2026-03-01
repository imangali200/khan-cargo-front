<template>
    <nav class="cargo-bottom-nav">
        <router-link to="/user" class="nav-item" :class="{ active: isActive('/user') }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span class="nav-label">Лента</span>
        </router-link>

        <router-link to="/user/search" class="nav-item" :class="{ active: isActive('/user/search') }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>
            <span class="nav-label">Поиск</span>
        </router-link>

        <div class="nav-special">
            <router-link to="/user/create-post" class="create-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </router-link>
            <span class="nav-label">Создать</span>
        </div>

        <router-link to="/user/tracking" class="nav-item" :class="{ active: isActive('/user/tracking') }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            <span class="nav-label">Трекинг</span>
        </router-link>

        <router-link to="/user/me" class="nav-item" :class="{ active: isActive('/user/me') }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
            <span class="nav-label">Профиль</span>
        </router-link>
    </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const isActive = (path: string) => route.path === path
</script>

<style scoped>
.cargo-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 680px;
    z-index: 1000;
    background: rgba(13, 17, 23, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 8px 0;
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
}

.nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-decoration: none;
    color: #8b949e;
    transition: all 0.2s ease;
}

.nav-item.active {
    color: #2563eb;
}

.nav-icon {
    width: 24px;
    height: 24px;
}

.nav-label {
    font-size: 10px;
    font-weight: 600;
}

.nav-special {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    position: relative;
    top: -12px;
}

.create-btn {
    width: 48px;
    height: 48px;
    background-color: #2563eb;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
    transition: transform 0.2s ease;
    text-decoration: none;
}

.create-btn:hover {
    transform: scale(1.05);
}

.nav-special .nav-label {
    position: relative;
    bottom: -4px;
    color: #8b949e;
}
</style>
