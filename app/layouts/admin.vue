<template>
    <div class="admin-app">
        <!-- Sidebar -->
        <aside class="sidebar" :class="{ 'mobile-open': menuOpen }">
            <div class="sidebar-header">
                <div class="logo-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="8" width="18" height="12" rx="2"></rect>
                        <path d="M16 8V6a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2v2"></path>
                    </svg>
                </div>
                <div class="logo-text">
                    <span class="title">Админ-панель</span>
                    <span class="subtitle">Управление филиалом</span>
                </div>
                <!-- Close btn for mobile -->
                <button class="mobile-close-btn" @click="menuOpen = false">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <nav class="sidebar-nav">
                <router-link to="/admin" class="nav-link" exact-active-class="active" @click="menuOpen = false">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span>Рабочий стол</span>
                </router-link>

                <router-link to="/admin/cargo" class="nav-link" active-class="active" @click="menuOpen = false">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path
                            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                        </path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    <span>Принять товары</span>
                </router-link>



                <router-link to="/admin/import" class="nav-link" active-class="active" @click="menuOpen = false">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>Импорт данных</span>
                </router-link>

                <router-link to="/admin/history" class="nav-link" active-class="active" @click="menuOpen = false">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    <span>История сканов</span>
                </router-link>
            </nav>

            <div class="sidebar-footer">
                <button class="nav-link logout-btn" @click="logout">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"></path>
                    </svg>
                    <span>Выйти</span>
                </button>
            </div>
        </aside>

        <!-- Overlay for mobile -->
        <div v-if="menuOpen" class="mobile-overlay" @click="menuOpen = false"></div>

        <!-- Main Content Area -->
        <div class="main-wrapper">
            <!-- Topbar for mobile -->
            <header class="mobile-topbar d-md-none">
                <button class="burger-menu-btn" @click="menuOpen = true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <div class="topbar-title">Панель Управления</div>
            </header>

            <main class="content-area">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const token = useCookie('token')
const refreshToken = useCookie('refreshToken')
const router = useRouter()
const menuOpen = ref(false)

function logout() {
    token.value = null
    refreshToken.value = null
    menuOpen.value = false
    router.push('/auth/login')
}
</script>

<style scoped>
.admin-app {
    display: flex;
    min-height: 100vh;
    background-color: #0f111a;
    /* Very dark rich blue background, matching screenshot */
    color: #e2e8f0;
    font-family: 'Inter', -apple-system, sans-serif;
}

/* Sidebar */
.sidebar {
    width: 260px;
    background-color: #161824;
    /* Sidebar background */
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    overflow-y: auto;
    z-index: 100;
    transition: transform 0.3s ease;
}

.sidebar-header {
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.logo-box {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.logo-box svg {
    width: 20px;
    height: 20px;
}

.logo-text {
    display: flex;
    flex-direction: column;
}

.title {
    font-size: 14px;
    font-weight: 700;
    color: #f8fafc;
    letter-spacing: -0.2px;
}

.subtitle {
    font-size: 11px;
    font-weight: 500;
    color: #94a3b8;
}

.mobile-close-btn {
    display: none;
    background: none;
    border: none;
    color: #94a3b8;
    margin-left: auto;
    padding: 0;
}

.sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 16px;
    flex: 1;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 10px;
    color: #94a3b8;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    border: none;
    background: transparent;
    cursor: pointer;
    width: 100%;
}

.nav-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    opacity: 0.8;
}

.nav-link:hover {
    color: #f8fafc;
    background-color: rgba(255, 255, 255, 0.03);
}

.nav-link.active {
    color: white;
    background: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.nav-link.active .nav-icon {
    opacity: 1;
}

.sidebar-footer {
    padding: 16px;
    margin-top: auto;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.logout-btn {
    justify-content: flex-start;
}

.logout-btn:hover {
    color: #ef4444;
    background-color: rgba(239, 68, 68, 0.1);
}

/* Main Area */
.main-wrapper {
    flex: 1;
    margin-left: 260px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.mobile-topbar {
    display: none;
    align-items: center;
    padding: 16px 20px;
    background-color: #161824;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    gap: 16px;
}

.burger-menu-btn {
    background: none;
    border: none;
    color: #f8fafc;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.topbar-title {
    font-size: 15px;
    font-weight: 600;
    color: #f8fafc;
}

.content-area {
    flex: 1;
    padding: 32px 40px;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
}

.mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 90;
    display: none;
}

/* Responsive */
@media (max-width: 991px) {
    .sidebar {
        transform: translateX(-100%);
    }

    .sidebar.mobile-open {
        transform: translateX(0);
    }

    .mobile-close-btn {
        display: block;
    }

    .main-wrapper {
        margin-left: 0;
    }

    .mobile-topbar {
        display: flex;
    }

    .mobile-overlay {
        display: block;
    }

    .content-area {
        padding: 20px;
    }
}
</style>
