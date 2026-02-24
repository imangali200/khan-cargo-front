<template>
    <div class="auth-page">
        <div class="auth-card">
            <header class="auth-header">
                <button @click="$router.back()" class="mini-back-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M19 12H5m7-7-7 7 7 7" />
                    </svg>
                </button>
                <h1 class="brand-title">Регистрация</h1>
                <p class="brand-subtitle">Создайте аккаунт в Ai-Market</p>
            </header>

            <main class="auth-body">
                <div class="tabs">
                    <RouterLink to="/auth/login" class="auth-tab">Вход</RouterLink>
                    <button class="auth-tab active">Регистрация</button>
                </div>

                <form @submit.prevent="postRegister" class="form-container">
                    <div class="input-wrapper">
                        <label>Номер телефона</label>
                        <div class="input-inner">
                            <span class="prefix">🇰🇿</span>
                            <input ref="phoneInput" type="text" placeholder="8 (000) 000-00-00" />
                        </div>
                    </div>

                    <div class="input-wrapper">
                        <label>Выберите склад</label>
                        <div class="input-inner select-inner">
                            <select v-model="selectBranch">
                                <option value="">Выберите город</option>
                                <option v-for="branch in branches" :key="branch.id" :value="branch.branchName">
                                    {{ branch.branchName }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="input-row">
                        <div class="input-wrapper">
                            <label>Ваш код</label>
                            <div class="input-inner">
                                <input v-model="codeUser" type="text" placeholder="Ai-000" @input="ensureAiPrefix" />
                            </div>
                        </div>
                        <div class="input-wrapper">
                            <label>Имя</label>
                            <div class="input-inner">
                                <input v-model="name" type="text" placeholder="Имя" />
                            </div>
                        </div>
                    </div>

                    <div class="input-wrapper">
                        <label>Фамилия</label>
                        <div class="input-inner">
                            <input v-model="surname" type="text" placeholder="Фамилия" />
                        </div>
                    </div>

                    <div class="input-wrapper" :class="{ error: errorMessage }">
                        <label>Пароль</label>
                        <div class="input-inner">
                            <input v-model="password" type="password" placeholder="Придумайте пароль" />
                        </div>
                        <span v-if="errorMessage" class="error-msg">{{ errorMessage }}</span>
                    </div>

                    <button type="submit" class="submit-btn" :disabled="isLoading">
                        <span v-if="!isLoading">Зарегистрироваться</span>
                        <div v-else class="loader"></div>
                    </button>
                </form>
            </main>

            <footer class="auth-footer">
                <p>Уже есть аккаунт? <RouterLink to="/auth/login">Войти</RouterLink></p>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import IMask from "imask";
import { jwtDecode } from "jwt-decode";
import type { myJwtPayload } from "~/pages/auth/login.vue";

definePageMeta({
    layout: false,
});

export interface Branch {
    branchName: string;
    id: number;
}

function getRedirectByRole(role: string): string {
    switch (role) {
        case 'admin': return '/admin';
        case 'superAdmin': return '/superAdmin';
        default: return '/user';
    }
}

const { $axios } = useNuxtApp();
const phoneNumber = ref<string>("");
const selectBranch = ref<string>("");
const codeUser = ref<string>("Ai-");
const name = ref<string>("");
const surname = ref<string>("");
const password = ref<string>("");
const errorMessage = ref<string>("");
const isLoading = ref<boolean>(false);
const branches = ref<Branch[]>([]);

function ensureAiPrefix() {
    if (!codeUser.value.startsWith("Ai-")) {
        codeUser.value = "Ai-" + codeUser.value.replace(/^Ai-?/i, "");
    }
}

async function getBranches() {
    try {
        const res = await $axios.get("branch");
        branches.value = res.data;
    } catch { }
}

async function postRegister() {
    if (!phoneNumber.value || !codeUser.value || !name.value || !surname.value || !selectBranch.value || !password.value) {
        errorMessage.value = "Заполните все поля";
        return;
    }

    isLoading.value = true;
    errorMessage.value = "";

    const cleanPhone = phoneNumber.value.replace(/\D/g, "");
    if (cleanPhone.length !== 11) {
        errorMessage.value = "Неверный формат телефона";
        isLoading.value = false;
        return;
    }

    try {
        const response = await $axios.post("auth/register", {
            phoneNumber: cleanPhone,
            code: codeUser.value,
            name: name.value,
            surname: surname.value,
            branch: selectBranch.value,
            password: password.value,
        });

        if (response.data.accessToken) {
            const token = useCookie("token", { maxAge: 15 * 60 });
            const refreshToken = useCookie("refreshToken", { maxAge: 21 * 24 * 60 * 60 });
            token.value = response.data.accessToken;
            refreshToken.value = response.data.refreshToken;

            // Decode token to determine role-based redirect
            try {
                const payload = jwtDecode<myJwtPayload>(response.data.accessToken);
                return navigateTo(getRedirectByRole(payload.role));
            } catch {
                return navigateTo("/user");
            }
        }
    } catch {
        errorMessage.value = "Ошибка при регистрации";
    } finally {
        isLoading.value = false;
    }
}

const phoneInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
    if (phoneInput.value) {
        const mask = IMask(phoneInput.value, {
            mask: "8 (000) 000-00-00",
            lazy: false
        });
        mask.on("accept", () => {
            phoneNumber.value = mask.value;
        });
    }
    getBranches();
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
    max-width: 460px;
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
    margin-bottom: 32px;
    position: relative;
}

.mini-back-btn {
    position: absolute;
    left: 0;
    top: -8px;
    background: rgba(102, 126, 234, 0.1);
    border: 1px solid rgba(102, 126, 234, 0.2);
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #667eea;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mini-back-btn:hover { background: rgba(102, 126, 234, 0.15); transform: translateX(-3px); }
.mini-back-btn:active { transform: translateX(-1px); }

.brand-title { 
    font-size: 28px; 
    font-weight: 900; 
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 8px; 
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

.input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

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

.select-inner select {
    width: 100%;
    background: none;
    border: none;
    outline: none;
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.select-inner select option { color: #333; background: #fff; }

.prefix { font-size: 16px; margin-right: 10px; }
.input-inner input { flex: 1; background: none; border: none; outline: none; font-size: 16px; font-weight: 600; color: #333; }
.input-inner input::placeholder { color: #ccc; }

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
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    letter-spacing: 0.5px;
}

.submit-btn:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(102, 126, 234, 0.45); }
.submit-btn:active { transform: translateY(-1px); }
.submit-btn:disabled { opacity: 0.6; transform: none; box-shadow: none; cursor: not-allowed; }

.loader { width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.error-msg { font-size: 12px; color: #ef4444; font-weight: 700; margin-left: 2px; }

.auth-footer { margin-top: 36px; text-align: center; padding-top: 24px; border-top: 1px solid rgba(0, 0, 0, 0.06); }
.auth-footer p { font-size: 14px; color: #757575; margin: 0; }
.auth-footer a { color: #667eea; font-weight: 700; text-decoration: none; transition: color 0.2s; }
.auth-footer a:hover { color: #764ba2; }

@media (max-width: 480px) {
    .auth-card { padding: 28px 24px; }
    .input-row { grid-template-columns: 1fr; }
    .brand-title { font-size: 24px; }
}
</style>
