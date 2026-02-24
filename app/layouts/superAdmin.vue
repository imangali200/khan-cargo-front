<template>
    <div class="superadmin-app">
        <header class="superadmin-header">
            <div class="header-content">
                <router-link to="/superAdmin" class="logo">
                    <span>🔐 SuperAdmin</span>
                </router-link>
                
                <!-- Desktop Navigation -->
                <nav class="desktop-nav">
                    <router-link to="/superAdmin" class="nav-link">Главная</router-link>
                    <router-link to="/superAdmin/users" class="nav-link">Пользователи</router-link>
                    <router-link to="/superAdmin/history" class="nav-link">История</router-link>
                    <router-link to="/superAdmin/warehouses" class="nav-link">Склады</router-link>
                    <router-link to="/superAdmin/tracks" class="nav-link">Треки</router-link>
                    <router-link to="/superAdmin/trash" class="nav-link">Корзина</router-link>
                </nav>

                <button @click="logout" class="logout-btn">Выход</button>

                <!-- Mobile Menu -->
                <button @click="mobileMenuOpen = !mobileMenuOpen" class="mobile-toggle">
                    <svg v-if="!mobileMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12h18M3 6h18M3 18h18"/>
                    </svg>
                    <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <nav v-if="mobileMenuOpen" class="mobile-nav">
                <router-link to="/superAdmin" class="mobile-link" @click="mobileMenuOpen = false">Главная</router-link>
                <router-link to="/superAdmin/users" class="mobile-link" @click="mobileMenuOpen = false">Пользователи</router-link>
                <router-link to="/superAdmin/history" class="mobile-link" @click="mobileMenuOpen = false">История</router-link>
                <router-link to="/superAdmin/warehouses" class="mobile-link" @click="mobileMenuOpen = false">Склады</router-link>
                <router-link to="/superAdmin/tracks" class="mobile-link" @click="mobileMenuOpen = false">Треки</router-link>
                <router-link to="/superAdmin/trash" class="mobile-link" @click="mobileMenuOpen = false">Корзина</router-link>
                <button @click="logout; mobileMenuOpen = false" class="mobile-logout">Выход</button>
            </nav>
        </header>

        <main class="superadmin-main">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)

function logout() {
    const token = useCookie('token')
    token.value = null
    navigateTo('/auth/login')
}
</script>

<style scoped>
.superadmin-app {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1f3a 0%, #16213e 100%);
    color: #fff;
}

.superadmin-header {
    background: rgba(26, 31, 58, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(102, 126, 234, 0.1);
    padding: 0;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    font-size: 20px;
    font-weight: 900;
    color: #667eea;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;
}

.logo:hover { transform: scale(1.05); color: #764ba2; }

.desktop-nav {
    display: flex;
    gap: 8px;
    flex: 1;
    margin-left: 40px;
}

.nav-link {
    padding: 8px 16px;
    color: #999;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s;
    font-weight: 600;
    font-size: 14px;
}

.nav-link:hover,
.nav-link.router-link-active {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
}

.logout-btn {
    padding: 8px 18px;
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
}

.logout-btn:hover {
    background: rgba(239, 68, 68, 0.3);
    border-color: rgba(239, 68, 68, 0.5);
}

.mobile-toggle {
    display: none;
    background: none;
    border: none;
    color: #667eea;
    cursor: pointer;
}

.mobile-nav {
    display: none;
    background: rgba(0, 0, 0, 0.5);
    padding: 16px 24px;
    flex-direction: column;
    gap: 8px;
}

.mobile-link {
    padding: 12px 16px;
    color: #999;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s;
}

.mobile-link:hover,
.mobile-link.router-link-active {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
}

.mobile-logout {
    padding: 12px 16px;
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 8px;
}

.superadmin-main {
    max-width: 1400px;
    margin: 0 auto;
    padding: 32px 24px;
}

@media (max-width: 768px) {
    .desktop-nav { display: none; }
    .logout-btn { display: none; }
    .mobile-toggle { display: block; }
    .header-content { gap: 16px; }
    .superadmin-main { padding: 24px 16px; }
}
</style>
