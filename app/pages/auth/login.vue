<template>
    <div class="auth-page">
        <div class="auth-card">
            <header class="auth-header">
                <div class="logo-circle">
                    <img src="/images/ai-market-logo.jpg" alt="Logo" />
                </div>
                <h1 class="brand-title">Ai-Market</h1>
                <p class="brand-subtitle">Ваш проводник в мире маркетплейсов</p>
            </header>

            <main class="auth-body">
                <div class="tabs">
                    <button class="auth-tab active">Вход</button>
                    <RouterLink to="/auth/register" class="auth-tab">Регистрация</RouterLink>
                </div>

                <form @submit.prevent="postLogin" class="form-container">
                    <div class="input-wrapper" :class="{ error: errorPhoneNumber }">
                        <label>Номер телефона</label>
                        <div class="input-inner">
                            <span class="prefix">🇰🇿</span>
                            <input ref="phoneInput" type="text" placeholder="8 (000) 000-00-00" />
                        </div>
                        <span v-if="errorPhoneNumber" class="error-msg">{{ errorPhoneNumber }}</span>
                    </div>

                    <div class="input-wrapper" :class="{ error: errorMessage && !errorPhoneNumber }">
                        <label>Пароль</label>
                        <div class="input-inner">
                            <input v-model="passwordValue" :type="showPassword ? 'text' : 'password'" placeholder="Введите пароль" />
                            <button type="button" class="toggle-pass" @click="showPassword = !showPassword">
                                {{ showPassword ? '🙈' : '👁️' }}
                            </button>
                        </div>
                        <span v-if="errorMessage && !errorPhoneNumber" class="error-msg">{{ errorMessage }}</span>
                    </div>

                    <button type="submit" class="submit-btn" :disabled="isLoading">
                        <span v-if="!isLoading">Продолжить</span>
                        <div v-else class="loader"></div>
                    </button>
                </form>

                <div class="help-section">
                    <p>Забыли пароль? <a href="#">Восстановить</a></p>
                </div>
            </main>

            <footer class="auth-footer">
                <p>При входе вы соглашаетесь с <a href="#">правилами пользования</a> и <a href="#">политикой конфиденциальности</a></p>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import IMask from "imask";
import { jwtDecode } from "jwt-decode";

definePageMeta({
    layout: false, // Using custom layout for auth
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
        const res = await $axios.post("auth/login", {
            phoneNumber: cleanPhone,
            password: passwordValue.value,
        });

        if (res.data.accessToken) {
            const token = useCookie("token", { maxAge: 15 * 60, path: '/' });
            const refreshToken = useCookie("refreshToken", { maxAge: 21 * 24 * 60 * 60, path: '/' });
            token.value = res.data.accessToken;
            refreshToken.value = res.data.refreshToken;

            // Decode token to determine role-based redirect
            try {
                const payload = jwtDecode<myJwtPayload>(res.data.accessToken);
                const redirectPath = getRedirectByRole(payload.role);
                setTimeout(() => {
                    navigateTo(redirectPath);
                }, 100);
            } catch {
                // Fallback to /user if token decode fails
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
}

.auth-page::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    border-radius: 50%;
    top: -200px;
    right: -200px;
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(30px); }
}

.auth-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    width: 100%;
    max-width: 420px;
    border-radius: 24px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    padding: 40px 32px;
    animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    z-index: 1;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
}

.auth-header {
    text-align: center;
    margin-bottom: 36px;
}

.logo-circle {
    width: 72px;
    height: 72px;
    border-radius: 18px;
    overflow: hidden;
    margin: 0 auto 20px;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    border: 3px solid rgba(255, 255, 255, 0.5);
}

.logo-circle img { width: 100%; height: 100%; object-fit: cover; }

.brand-title { 
    font-size: 32px; 
    font-weight: 900; 
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 8px; 
    letter-spacing: -0.5px; 
}

.brand-subtitle { font-size: 14px; color: #757575; font-weight: 500; margin: 0; }

.tabs {
    display: flex;
    background: rgba(0, 0, 0, 0.04);
    padding: 5px;
    border-radius: 14px;
    margin-bottom: 32px;
    gap: 8px;
}

.auth-tab {
    flex: 1;
    padding: 12px 16px;
    text-align: center;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    color: #999;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid transparent;
}

.auth-tab.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: #fff;
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.form-container { display: flex; flex-direction: column; gap: 18px; }

.input-wrapper { display: flex; flex-direction: column; gap: 8px; }
.input-wrapper label { font-size: 13px; font-weight: 700; color: #333; margin-left: 2px; text-transform: uppercase; letter-spacing: 0.5px; }

.input-inner {
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.02);
    border: 2px solid rgba(0, 0, 0, 0.08);
    border-radius: 14px;
    padding: 0 16px;
    height: 54px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-inner:focus-within { 
    border-color: #667eea; 
    background: rgba(102, 126, 234, 0.05); 
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); 
}

.prefix { font-size: 18px; margin-right: 12px; }
.input-inner input { flex: 1; background: none; border: none; outline: none; font-size: 16px; font-weight: 600; color: #333; }
.input-inner input::placeholder { color: #ccc; }

.toggle-pass { background: none; border: none; font-size: 20px; cursor: pointer; padding: 0 4px; transition: transform 0.2s; }
.toggle-pass:hover { transform: scale(1.1); }

.error-msg { font-size: 12px; color: #ef4444; font-weight: 700; margin-left: 2px; }
.input-wrapper.error .input-inner { border-color: #fca5a5; background: rgba(239, 68, 68, 0.03); }

.submit-btn {
    height: 58px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border: none;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
    margin-top: 8px;
    box-shadow: 0 12px 30px rgba(102, 126, 234, 0.35);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.5px;
}

.submit-btn:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(102, 126, 234, 0.45); }
.submit-btn:active { transform: translateY(-1px); }
.submit-btn:disabled { opacity: 0.6; transform: none; box-shadow: none; cursor: not-allowed; }

.loader { width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.help-section { text-align: center; margin-top: 28px; }
.help-section p { font-size: 14px; color: #757575; margin: 0; }
.help-section a { color: #667eea; font-weight: 700; text-decoration: none; transition: color 0.2s; }
.help-section a:hover { color: #764ba2; }

.auth-footer { margin-top: 36px; text-align: center; padding-top: 24px; border-top: 1px solid rgba(0, 0, 0, 0.06); }
.auth-footer p { font-size: 12px; color: #999; line-height: 1.6; margin: 0; }
.auth-footer a { color: #667eea; text-decoration: none; transition: color 0.2s; }
.auth-footer a:hover { color: #764ba2; }

@media (max-width: 480px) {
    .auth-card { padding: 28px 24px; }
    .brand-title { font-size: 28px; }
}
</style>
