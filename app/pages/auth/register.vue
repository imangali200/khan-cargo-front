<template>
    <div class="auth-page">
        <div class="auth-card">
            <header class="auth-header">
                <div class="brand-group">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"
                        stroke-linejoin="round" class="truck-icon-small">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                    <h2 class="brand-name">CargoTrack</h2>
                </div>
                <h1 class="page-title">Регистрация</h1>
                <p class="page-subtitle">Создайте аккаунт для управления логистикой и отслеживания грузов.</p>
            </header>

            <main class="auth-body">
                <form @submit.prevent="postRegister" class="form-container">
                    <div class="input-row">
                        <div class="input-wrapper">
                            <label>Имя</label>
                            <div class="input-inner">
                                <span class="input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </span>
                                <input v-model="name" type="text" placeholder="Имя" />
                            </div>
                        </div>

                        <div class="input-wrapper">
                            <label>Фамилия</label>
                            <div class="input-inner">
                                <span class="input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </span>
                                <input v-model="surname" type="text" placeholder="Фамилия" />
                            </div>
                        </div>
                    </div>

                    <div class="input-wrapper">
                        <label>Номер телефона</label>
                        <div class="input-inner">
                            <span class="input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path
                                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                                    </path>
                                </svg>
                            </span>
                            <input ref="phoneInput" type="text" placeholder="8 (000) 000-00-00" />
                        </div>
                    </div>

                    <div class="input-row">
                        <div class="input-wrapper">
                            <label>Telegram ник</label>
                            <div class="input-inner">
                                <span class="input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M22 2L2 10.5L11 13L22 2Z" fill="currentColor"></path>
                                        <path d="M11 13L14 22L22 2L11 13Z" fill="currentColor"></path>
                                    </svg>
                                </span>
                                <input v-model="telegramUsername" type="text" placeholder="@username" />
                            </div>
                        </div>

                        <div class="input-wrapper">
                            <label>Ваш код</label>
                            <div class="input-inner">
                                <span class="input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                    </svg>
                                </span>
                                <input v-model="codeUser" type="text" placeholder="Код" @input="ensureKhanPrefix" />
                            </div>
                        </div>
                    </div>

                    <div class="input-wrapper">
                        <label>Пароль</label>
                        <div class="input-inner">
                            <span class="input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </span>
                            <input v-model="password" :type="showPassword ? 'text' : 'password'"
                                placeholder="Придумайте пароль" />
                            <button type="button" class="view-pass" @click="showPassword = !showPassword">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="input-wrapper">
                        <label>Выберите склад</label>
                        <div class="input-inner select-inner">
                            <span class="input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </span>
                            <select v-model="selectBranch">
                                <option value="">Выберите город</option>
                                <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                                    {{ branch.branchName }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" class="submit-btn" :disabled="isLoading">
                        <span v-if="!isLoading">Зарегистрироваться</span>
                        <svg v-if="!isLoading" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" class="btn-arrow">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                        <div v-else class="loader"></div>
                    </button>
                </form>
            </main>

            <footer class="auth-footer">
                <p>Уже есть аккаунт? <RouterLink to="/auth/login">Войти</RouterLink>
                </p>
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
const codeUser = ref<string>("Khan-");
const name = ref<string>("");
const surname = ref<string>("");
const telegramUsername = ref<string>("");
const password = ref<string>("");
const showPassword = ref<boolean>(false);
const errorMessage = ref<string>("");
const isLoading = ref<boolean>(false);
const branches = ref<Branch[]>([]);

function ensureKhanPrefix() {
    if (!codeUser.value.startsWith("Khan-")) {
        codeUser.value = "Khan-" + codeUser.value.replace(/^Khan-?/i, "");
    }
}

async function getBranches() {
    try {
        const res = await useApi().branches.findAll();
        branches.value = res.data.map(b => ({ id: b.id, branchName: b.name }));
    } catch { }
}

async function postRegister() {
    if (!phoneNumber.value || !name.value || !surname.value || !selectBranch.value || !password.value || !codeUser.value) {
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
        const response = await useApi().auth.signUp({
            name: name.value,
            lastName: surname.value,
            phoneNumber: cleanPhone,
            userCode: codeUser.value,
            password: password.value,
            role: "user",
            branchId: Number(selectBranch.value) || undefined,
            telegramUsername: telegramUsername.value,
        });

        if (response.data.accessToken) {
            const token = useCookie("token", { maxAge: 15 * 60, path: '/' });
            const refreshToken = useCookie("refreshToken", { maxAge: 21 * 24 * 60 * 60, path: '/' });
            token.value = response.data.accessToken;
            refreshToken.value = response.data.refreshToken;

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
    background-color: #0d1117;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.auth-card {
    width: 100%;
    max-width: 480px;
}

.auth-header {
    margin-bottom: 32px;
}

.brand-group {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
}

.truck-icon-small {
    width: 24px;
    height: 24px;
}

.brand-name {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
}

.page-title {
    font-size: 32px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 12px;
}

.page-subtitle {
    font-size: 15px;
    color: #8b949e;
    line-height: 1.5;
    margin: 0;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.input-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.input-wrapper label {
    font-size: 14px;
    font-weight: 500;
    color: #8b949e;
}

.input-inner {
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 8px;
    height: 48px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s ease;
}

.input-inner:focus-within {
    border-color: #2563eb;
    background-color: #1c2128;
}

.input-icon {
    color: #484f58;
    display: flex;
    align-items: center;
}

.input-inner input,
.input-inner select {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #ffffff;
    font-size: 14px;
}

.input-inner input::placeholder {
    color: #484f58;
}

.view-pass {
    background: none;
    border: none;
    color: #484f58;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.terms-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 8px 0;
}

.checkbox-wrapper {
    position: relative;
    width: 18px;
    height: 18px;
}

.checkbox-wrapper input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
    z-index: 2;
}

.checkbox-custom {
    position: absolute;
    top: 0;
    left: 0;
    height: 18px;
    width: 18px;
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 4px;
}

.checkbox-wrapper input:checked~.checkbox-custom {
    background-color: #2563eb;
    border-color: #2563eb;
}

.checkbox-wrapper input:checked~.checkbox-custom:after {
    content: "";
    position: absolute;
    left: 5px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.terms-row label {
    font-size: 13px;
    color: #8b949e;
}

.terms-row a {
    color: #2563eb;
    text-decoration: none;
}

.submit-btn {
    height: 52px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background-color 0.2s ease;
    margin-top: 10px;
}

.submit-btn:hover {
    background-color: #1d4ed8;
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.btn-arrow {
    transition: transform 0.2s ease;
}

.submit-btn:hover .btn-arrow {
    transform: translateX(3px);
}

.auth-footer {
    margin-top: 32px;
    text-align: center;
}

.auth-footer p {
    font-size: 14px;
    color: #8b949e;
}

.auth-footer a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
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
    .page-title {
        font-size: 26px;
    }

    .auth-card {
        padding: 28px 24px;
    }

    .input-row {
        grid-template-columns: 1fr;
    }

    .brand-title {
        font-size: 24px;
    }
}
</style>
