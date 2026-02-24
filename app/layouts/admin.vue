<template>
    <div class="admin-app">
        <header class="admin-header">
            <div class="admin-header-content">
                <router-link to="/admin" class="admin-logo">
                     <span class="logo-text">👨‍💼 Admin</span>
                 </router-link>
                
                <!-- Desktop Navigation -->
                <nav class="admin-nav desktop-nav">
                    <router-link to="/admin" class="nav-link">Главная</router-link>
                    <router-link to="/admin/history" class="nav-link">История</router-link>
                    <router-link to="/admin/import" class="nav-link">Импорт</router-link>
                    <router-link to="/admin/new-receipts" class="nav-link">Новые поступления</router-link>
                </nav>
                
                <button @click="logout" class="logout-btn desktop-logout">Выйти</button>
                
                <!-- Mobile Burger Button -->
                <button @click="menuOpen = !menuOpen" class="burger-btn">
                    <svg v-if="!menuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12h18M3 6h18M3 18h18"/>
                    </svg>
                    <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            
            <!-- Mobile Menu -->
            <div v-if="menuOpen" class="mobile-menu">
                <nav class="mobile-nav">
                    <router-link to="/admin" class="mobile-link" @click="menuOpen = false">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                        Главная
                    </router-link>
                    <router-link to="/admin/history" class="mobile-link" @click="menuOpen = false">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.313m0 0a2 2 0 0 0-1.172-1.778l-2.468-1.115a2 2 0 0 0-2.72 2.393v15.5"/></svg>
                        История
                    </router-link>
                    <router-link to="/admin/import" class="mobile-link" @click="menuOpen = false">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        Импорт
                    </router-link>
                    <router-link to="/admin/new-receipts" class="mobile-link" @click="menuOpen = false">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                        Новые поступления
                    </router-link>
                </nav>
                <button @click="logout" class="mobile-logout">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5-5-5m5 5H9"/></svg>
                    Выйти
                </button>
            </div>
        </header>
        <main class="admin-main">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
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

// Close menu on route change
watch(() => router.currentRoute.value.path, () => {
    menuOpen.value = false
})
</script>

<style scoped>
.admin-app {
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #1a2332 0%, #223451 100%);
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.admin-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(26, 35, 50, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.admin-header-content {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
}

.admin-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    text-decoration: none;
    font-size: 18px;
    font-weight: 700;
    flex-shrink: 0;
}

/* Desktop Navigation */
.desktop-nav {
    display: none;
    gap: 4px;
    flex: 1;
}

.nav-link {
    padding: 8px 14px;
    color: #888;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.2s;
    white-space: nowrap;
}

.nav-link:hover {
    background: #1a1a1a;
    color: #fff;
}

.nav-link.router-link-active {
    background: #222;
    color: #fff;
}

.desktop-logout {
    display: none;
    padding: 8px 20px;
    background: transparent;
    border: 1px solid #333;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
}

.desktop-logout:hover {
    background: #222;
}

/* Burger Button */
.burger-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: transparent;
    border: 1px solid #333;
    border-radius: 10px;
    color: #fff;
    cursor: pointer;
    margin-left: auto;
    transition: all 0.2s;
}

.burger-btn:hover {
    background: #222;
}

/* Mobile Menu */
.mobile-menu {
    background: #000;
    border-top: 1px solid #222;
    padding: 16px;
    animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.mobile-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.mobile-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    color: #888;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    border-radius: 12px;
    transition: all 0.2s;
}

.mobile-link:hover,
.mobile-link.router-link-active {
    background: #1a1a1a;
    color: #fff;
}

.mobile-logout {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 14px 16px;
    margin-top: 12px;
    background: transparent;
    border: 1px solid #333;
    border-radius: 12px;
    color: #ef4444;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.mobile-logout:hover {
    background: #1a1a1a;
}

.admin-main {
    padding: 16px;
}

/* Desktop styles */
@media (min-width: 768px) {
    .admin-header-content {
        padding: 12px 24px;
        gap: 24px;
    }
    
    .desktop-nav {
        display: flex;
    }
    
    .desktop-logout {
        display: block;
    }
    
    .burger-btn {
        display: none;
    }
    
    .mobile-menu {
        display: none;
    }
    
    .admin-main {
        padding: 24px;
    }
}
</style>
