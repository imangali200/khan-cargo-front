<template>
    <header class="cargo-header">
        <div class="header-container">
            <div class="header-main">
                <div class="brand-group">
                    <div class="logo-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="truck-icon">
                            <rect x="1" y="3" width="15" height="13"></rect>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                    </div>
                    <span class="brand-name">CargoFlow</span>
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
const userAvatar = ref<string | null>(null)

const isLoggedIn = computed(() => !!token.value)
</script>

<style scoped>
.cargo-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: #0d1117;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding: 0 16px;
}

.header-container {
    max-width: 680px;
    margin: 0 auto;
}

.header-main {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
}

.brand-group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.logo-box {
    width: 32px;
    height: 32px;
    background-color: #2563eb;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.truck-icon {
    width: 20px;
    height: 20px;
}

.brand-name {
    font-size: 18px;
    font-weight: 700;
    color: white;
    letter-spacing: -0.5px;
}



@media (max-width: 480px) {
    .brand-name {
        font-size: 16px;
    }
}
</style>
