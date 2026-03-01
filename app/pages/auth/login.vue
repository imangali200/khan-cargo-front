<template>
    <div class="auth-page">
        <div class="auth-card">
            <header class="auth-header">
                <div class="logo-box">
                    <img src="/logo.jpg" alt="Khan Cargo" class="logo-img" />
                </div>
                <h1 class="brand-title">Khan Cargo</h1>
            </header>

            <main class="auth-body">
                <form @submit.prevent="postLogin" class="form-container">
                    <div class="input-wrapper" :class="{ error: errorPhoneNumber }">
                        <label>Номер телефона</label>
                        <div class="input-inner">
                            <input ref="phoneInput" type="text" placeholder="8 (000) 000-00-00" />
                        </div>
                        <span v-if="errorPhoneNumber" class="error-msg">{{ errorPhoneNumber }}</span>
                    </div>

                    <div class="input-wrapper" :class="{ error: errorMessage && !errorPhoneNumber }">
                        <label>Пароль</label>
                        <div class="input-inner">
                            <input v-model="passwordValue" :type="showPassword ? 'text' : 'password'"
                                placeholder="Введите пароль" />
                            <button type="button" class="view-pass" @click="showPassword = !showPassword">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                        <span v-if="errorMessage && !errorPhoneNumber" class="error-msg">{{ errorMessage }}</span>
                    </div>

                    <button type="submit" class="submit-btn" :disabled="isLoading">
                        <span v-if="!isLoading">Войти</span>
                        <div v-else class="loader"></div>
                    </button>
                </form>

                <div class="register-section">
                    <p>Нет аккаунта? <RouterLink to="/auth/register">Регистрация</RouterLink>
                    </p>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import IMask from "imask";
import { jwtDecode } from "jwt-decode";

definePageMeta({
    layout: false,
});

export interface myJwtPayload {
    role: string;
    sub: number;
    iat: number;
    exp: number;
}

function getRedirectByRole(role: string): string {
    switch (role) {
        case 'admin': return '/admin';
        case 'superAdmin': return '/superAdmin';
        default: return '/user';
    }
}

const { $axios } = useNuxtApp();
const phoneInput = ref<HTMLInputElement | null>(null);
const phoneValue = ref<string>("");
const passwordValue = ref<string>("");
const errorMessage = ref<string>("");
const errorPhoneNumber = ref<string>("");
const showPassword = ref<boolean>(false);
const isLoading = ref<boolean>(false);

async function postLogin() {
    const cleanPhone = phoneValue.value.replace(/\D/g, "");
    if (cleanPhone.length !== 11) {
        errorPhoneNumber.value = "Введите полный номер телефона";
        return;
    }
    if (!passwordValue.value) {
        errorMessage.value = "Введите пароль";
        return;
    }

    isLoading.value = true;
    errorMessage.value = "";
    errorPhoneNumber.value = "";

    try {
        const res = await useApi().auth.signIn({
            phoneNumber: cleanPhone,
            password: passwordValue.value,
        });

        if (res.data.accessToken) {
            const token = useCookie("token", { maxAge: 15 * 60, path: '/' });
            const refreshToken = useCookie("refreshToken", { maxAge: 21 * 24 * 60 * 60, path: '/' });
            token.value = res.data.accessToken;
            refreshToken.value = res.data.refreshToken;

            try {
                const payload = jwtDecode<myJwtPayload>(res.data.accessToken);
                const redirectPath = getRedirectByRole(payload.role);
                setTimeout(() => {
                    navigateTo(redirectPath);
                }, 100);
            } catch {
                setTimeout(() => {
                    navigateTo("/user");
                }, 100);
            }
            return;
        }
    } catch (err: any) {
        errorMessage.value = err.response?.data?.message || "Неверный логин или пароль";
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    if (phoneInput.value) {
        const mask = IMask(phoneInput.value, {
            mask: "8 (000) 000-00-00",
            lazy: false
        });
        mask.on("accept", () => {
            phoneValue.value = mask.value;
        });
    }
});
</script>

<style scoped>
.auth-page {
    min-height: 100vh;
    background-color: #0d1117;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.auth-card {
    width: 100%;
    max-width: 400px;
    padding: 40px 20px;
}

.auth-header {
    text-align: center;
    margin-bottom: 40px;
}

.logo-box {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 16px;
}

.logo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.brand-title {
    font-size: 28px;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.input-wrapper label {
    font-size: 14px;
    font-weight: 500;
    color: #94a3b8;
}

.input-inner {
    background-color: #1e1e1e;
    border: 1px solid #2d2d2d;
    border-radius: 10px;
    height: 52px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    transition: all 0.2s ease;
}

.input-inner:focus-within {
    border-color: #2563eb;
    background-color: #262626;
}

.input-inner input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #ffffff;
    font-size: 15px;
}

.input-inner input::placeholder {
    color: #4b5563;
}

.view-pass {
    background: none;
    border: none;
    color: #4b5563;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 4px;
    transition: color 0.2s ease;
}

.view-pass:hover {
    color: #2563eb;
}

.submit-btn {
    height: 52px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
}

.submit-btn:hover {
    background-color: #1d4ed8;
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.register-section {
    margin-top: 32px;
    text-align: center;
}

.register-section p {
    color: #94a3b8;
    font-size: 14px;
}

.register-section a {
    color: #2563eb;
    font-weight: 600;
    text-decoration: none;
}

.error-msg {
    font-size: 12px;
    color: #ef4444;
    margin-top: 4px;
}

.input-wrapper.error .input-inner {
    border-color: #ef4444;
}

.loader {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 480px) {
    .auth-card {
        padding: 28px 24px;
    }

    .brand-title {
        font-size: 28px;
    }
}
</style>
