<template>
    <header class="marketplace-header">
        <div class="header-container">
            <div class="header-main">
                <a href="#" @click.prevent="goToHome" class="logo-link">
                    <div class="logo-wrapper">
                        <img src="/images/ai-market-logo.jpg" alt="Ai-Market" class="logo-img" />
                    </div>
                    <span class="brand-name">Ai-Market</span>
                </a>

                <div class="header-actions">
                    <div v-if="isLoggedIn" class="search-compact" @click="goToSearch">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </div>

                    <button v-if="!isLoggedIn" @click="goToLogin" class="auth-btn">
                        Войти
                    </button>
                    
                    <button v-if="isLoggedIn" @click="goToSearch" class="search-full">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <span>Поиск товаров...</span>
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
    role: 'user' | 'admin' | 'superAdmin'
}

const router = useRouter()
const token = useCookie('token')

const isLoggedIn = computed(() => !!token.value)

function goToHome() {
    if (!token.value) {
        router.push('/')
        return
    }

    try {
        const payload = jwtDecode<JwtPayload>(token.value)
        if (payload.role === 'admin') {
            router.push('/admin')
        } else if (payload.role === 'superAdmin') {
            router.push('/superAdmin')
        } else {
            router.push('/user')
        }
    } catch {
        router.push('/')
    }
}

function goToLogin() {
    router.push('/auth/login')
}

function goToSearch() {
    router.push('/user/search')
}
</script>

<style scoped>
.marketplace-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(102, 126, 234, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
}

.header-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
    gap: 20px;
}

.logo-link {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
}

.logo-wrapper {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea, #764ba2);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.25);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 2px solid rgba(255, 255, 255, 0.5);
}

.logo-link:hover .logo-wrapper {
    transform: scale(1.08) rotate(-3deg);
}

.logo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.brand-name {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    justify-content: flex-end;
}

.search-full {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(0, 0, 0, 0.03);
    border: 1.5px solid rgba(102, 126, 234, 0.15);
    color: #999;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    padding: 10px 18px;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
    max-width: 400px;
}

.search-full:hover {
    background: rgba(102, 126, 234, 0.08);
    border-color: #667eea;
}

.search-compact {
    display: none;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(102, 126, 234, 0.1);
    align-items: center;
    justify-content: center;
    color: #667eea;
    cursor: pointer;
    border: 1px solid rgba(102, 126, 234, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-btn {
    padding: 10px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(102, 126, 234, 0.3);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    white-space: nowrap;
    letter-spacing: 0.3px;
}

.auth-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.auth-btn:active {
    transform: translateY(-1px);
}

@media (max-width: 768px) {
    .search-full {
        display: none;
    }
    .search-compact {
        display: flex;
    }
    .brand-name {
        font-size: 18px;
    }
}

@media (max-width: 480px) {
    .brand-name {
        display: none;
    }
}
</style>
