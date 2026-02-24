<template>
    <div class="admin-app">
        <header class="admin-header">
            <div class="admin-header-content">
                <router-link to="/superAdmin" class="admin-logo">
                     <span class="logo-text">SuperAdmin</span>
                 </router-link>
                
                <!-- Desktop Navigation -->
                <nav class="admin-nav desktop-nav">
                    <router-link to="/superAdmin" class="nav-link">Главная</router-link>
                    <router-link to="/superAdmin/users" class="nav-link">Пользователи</router-link>
                    <router-link to="/superAdmin/history" class="nav-link">История</router-link>
                    <router-link to="/superAdmin/warehouses" class="nav-link">Склады</router-link>
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
                    <router-link to="/superAdmin" class="mobile-link" @click="menuOpen = false">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                        Главная
                    </router-link>
                    <router-link to="/superAdmin/users" class="mobile-link" @click="menuOpen = false">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        Пользователи
                    </router-link>
                    <router-link to="/superAdmin/tracks" class="mobile-link" @click="menuOpen = false">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                        Треки
                    </router-link>
                    <router-link to="/superAdmin/warehouses" class="mobile-link" @click="menuOpen = false">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        Склады
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
    background: #0a0a0a;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.admin-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #000;
    border-bottom: 1px solid #222;
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
