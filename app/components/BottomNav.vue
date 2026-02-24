<template>
    <nav class="marketplace-bottom-nav">
        <router-link to="/user" class="nav-item" :class="{ active: isActive('/user') }">
            <div class="icon-container">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
            </div>
            <span class="nav-label">Главная</span>
        </router-link>
        
        <router-link to="/user/search" class="nav-item" :class="{ active: isActive('/user/search') }">
            <div class="icon-container">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                </svg>
            </div>
            <span class="nav-label">Поиск</span>
        </router-link>

        <router-link to="/user/create-post" class="nav-item nav-special">
            <div class="special-icon-wrapper">
                <svg class="nav-icon special-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
            </div>
            <span class="nav-label">Создать</span>
        </router-link>

        <router-link to="/user/products" class="nav-item" :class="{ active: isActive('/user/products') }">
            <div class="icon-container">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
            </div>
            <span class="nav-label">Товары</span>
        </router-link>

        <router-link to="/user/me" class="nav-item" :class="{ active: isActive('/user/me') }">
            <div class="icon-container">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            </div>
            <span class="nav-label">Профиль</span>
        </router-link>
    </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const isActive = (path: string) => route.path === path
</script>

<style scoped>
.marketplace-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border-top: 1px solid rgba(102, 126, 234, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 8px 0;
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.12);
}

.nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    gap: 6px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: #999;
    padding: 8px 0;
}

.nav-item.active {
    color: #667eea;
}

.icon-container {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.nav-item.active .icon-container {
    background: rgba(102, 126, 234, 0.1);
    border-radius: 12px;
    color: #667eea;
}

.nav-item:active .icon-container {
    transform: scale(0.85);
}

.nav-icon {
    width: 22px;
    height: 22px;
}

.nav-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: -0.2px;
}

.nav-item.active {
    color: #667eea;
}

.nav-item.active .nav-icon {
    stroke: #667eea;
    filter: drop-shadow(0 0 4px rgba(102, 126, 234, 0.2));
}

.nav-special {
    position: relative;
    top: -16px;
}

.special-icon-wrapper {
    width: 54px;
    height: 54px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    margin-bottom: -4px;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 3px solid #fff;
}

.nav-item.nav-special:hover .special-icon-wrapper {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
}

.special-icon {
    color: #fff;
    width: 28px;
    height: 28px;
}

.nav-special .nav-label {
    margin-top: 10px;
    font-weight: 700;
}
</style>
