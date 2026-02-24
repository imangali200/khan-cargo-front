<script setup lang="ts">
definePageMeta({
    layout: 'admin',
    middleware: 'auth'
})

import type { Branch } from "~/pages/auth/register.vue";
import type { User } from "../users.vue";
import { useToast } from "~/composables/useToast";

const { $axios } = useNuxtApp()
const toast = useToast();
const token = useCookie('token')
const router = useRouter()
const route = useRoute()
const id = route.params.id

const phoneNumber = ref('')
const selectBranch = ref('')
const codeUser = ref('')
const name = ref('')
const surname = ref('')
const password = ref('')
const role = ref('user')
const branches = ref<Branch[]>([])
const oldData = ref<User | null>(null)

const loading = ref(false)
const submitting = ref(false)
const errorMessage = ref('')

const goToBack = () => {
    router.back()
}

async function getBranches() {
    try {
        const res = await $axios.get('branch')
        branches.value = res.data
    } catch (error) {
        console.error(error)
    }
}

async function getUserById() {
    loading.value = true
    try {
        const userData = await $axios.get(`user/id/${id}`, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })

        const user = userData.data
        codeUser.value = user.code || ''
        phoneNumber.value = user.phoneNumber || ''
        name.value = user.name || ''
        surname.value = user.surname || ''
        selectBranch.value = user.branch || ''
        role.value = user.role || 'user'
        oldData.value = user
    } catch (error: any) {
        console.error(error)
        toast.error('Ошибка при загрузке пользователя', { position: 'top-center'  })
    } finally {
        loading.value = false
    }
}

const updateUser = async () => {
    if (!phoneNumber.value || !name.value || !surname.value) {
        errorMessage.value = 'Заполните обязательные поля'
        return
    }

    submitting.value = true
    errorMessage.value = ''

    try {
        await $axios.put(`user/${id}`, {
            phoneNumber: phoneNumber.value,
            code: codeUser.value || null,
            name: name.value,
            surname: surname.value,
            role: role.value,
            branch: selectBranch.value || null,
            password: password.value || oldData.value?.password
        }, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })

        toast.success('Пользователь успешно обновлён', { position: 'top-center'  })
        return navigateTo('/superAdmin/users')
    } catch (error: any) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Ошибка при обновлении', { position: 'top-center'  })
    } finally {
        submitting.value = false
    }
}

onMounted(() => {
    getUserById()
    getBranches()
})
</script>

<template>
    <div class="tw-py-6 animate-fadeIn">
        <!-- Breadcrumb -->
        <div class="tw-flex tw-items-center tw-gap-2 tw-flex-wrap tw-text-sm tw-mb-6">
            <router-link class="tw-text-cyan-400 hover:tw-text-cyan-300 tw-transition-colors" to="/superAdmin">Главная</router-link>
            <span class="tw-text-white/30">→</span>
            <router-link class="tw-text-cyan-400 hover:tw-text-cyan-300 tw-transition-colors" to="/superAdmin/users">Пользователи</router-link>
            <span class="tw-text-white/30">→</span>
            <span class="tw-text-white/50">Редактировать: {{ name || '...' }}</span>
        </div>

        <!-- Header -->
        <div class="tw-flex tw-items-center tw-justify-between tw-mb-6 tw-pb-5 tw-border-b tw-border-white/10">
            <h1 class="tw-text-xl tw-font-bold tw-text-white">Редактировать пользователя</h1>
            <button @click="goToBack" class="tw-px-5 tw-py-2.5 tw-bg-red-500/20 tw-border tw-border-red-500/30 tw-rounded-xl tw-text-red-400 tw-font-medium hover:tw-bg-red-500/30 tw-transition-all">
                Назад
            </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="tw-text-center tw-py-12">
            <div class="tw-w-10 tw-h-10 tw-border-4 tw-border-cyan-500/20 tw-border-t-cyan-500 tw-rounded-full tw-animate-spin tw-mx-auto"></div>
            <p class="tw-mt-3 tw-text-white/50">Загрузка...</p>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="updateUser" class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-6 tw-flex tw-flex-col tw-gap-5">
            <!-- Код -->
            <div class="tw-flex tw-flex-col tw-gap-2">
                <label class="tw-text-sm tw-text-white/60" for="code">Код (для клиентов)</label>
                <input type="text" id="code" v-model="codeUser" placeholder="Например: KZ001" class="tw-h-12 tw-px-4 tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-text-white placeholder:tw-text-white/30 tw-outline-none focus:tw-border-cyan-500 tw-transition-all">
            </div>

            <!-- Телефон -->
            <div class="tw-flex tw-flex-col tw-gap-2">
                <label class="tw-text-sm tw-text-white/60" for="phoneNumber">
                    Телефон <span class="tw-text-red-400">*</span>
                </label>
                <input v-model="phoneNumber" type="text" id="phoneNumber" placeholder="8701 001 0101" class="tw-h-12 tw-px-4 tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-text-white placeholder:tw-text-white/30 tw-outline-none focus:tw-border-cyan-500 tw-transition-all">
            </div>

            <!-- Имя -->
            <div class="tw-flex tw-flex-col tw-gap-2">
                <label class="tw-text-sm tw-text-white/60" for="name">
                    Имя <span class="tw-text-red-400">*</span>
                </label>
                <input id="name" type="text" v-model="name" placeholder="Ivan" class="tw-h-12 tw-px-4 tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-text-white placeholder:tw-text-white/30 tw-outline-none focus:tw-border-cyan-500 tw-transition-all">
            </div>

            <!-- Фамилия -->
            <div class="tw-flex tw-flex-col tw-gap-2">
                <label class="tw-text-sm tw-text-white/60" for="surname">
                    Фамилия <span class="tw-text-red-400">*</span>
                </label>
                <input type="text" id="surname" v-model="surname" placeholder="Ivanov" class="tw-h-12 tw-px-4 tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-text-white placeholder:tw-text-white/30 tw-outline-none focus:tw-border-cyan-500 tw-transition-all">
            </div>

            <!-- Роль -->
            <div class="tw-flex tw-flex-col tw-gap-2 tw-w-full sm:tw-w-[280px]">
                <label class="tw-text-sm tw-text-white/60" for="role">Роль</label>
                <select id="role" v-model="role" class="tw-h-12 tw-px-4 tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-text-white tw-outline-none focus:tw-border-cyan-500 tw-transition-all tw-cursor-pointer">
                    <option value="user" class="tw-bg-[#1e293b]">Пользователь</option>
                    <option value="admin" class="tw-bg-[#1e293b]">Администратор</option>
                    <option value="superAdmin" class="tw-bg-[#1e293b]">Super Admin</option>
                </select>
            </div>

            <!-- Склад -->
            <div class="tw-flex tw-flex-col tw-gap-2 tw-w-full sm:tw-w-[320px]">
                <label class="tw-text-sm tw-text-white/60" for="branch">Склад</label>
                <select id="branch" v-model="selectBranch" class="tw-h-12 tw-px-4 tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-text-white tw-outline-none focus:tw-border-cyan-500 tw-transition-all tw-cursor-pointer">
                    <option value="" class="tw-bg-[#1e293b]">Не выбран</option>
                    <option v-for="branch in branches" :key="branch.id" :value="branch.branchName" class="tw-bg-[#1e293b]">
                        {{ branch.branchName }}
                    </option>
                </select>
            </div>

            <!-- Пароль -->
            <div class="tw-flex tw-flex-col tw-gap-2">
                <label class="tw-text-sm tw-text-white/60" for="userPassword">
                    Новый пароль <span class="tw-text-white/30 tw-text-xs">(оставьте пустым, чтобы не менять)</span>
                </label>
                <input type="text" id="userPassword" v-model="password" placeholder="Введите новый пароль" class="tw-h-12 tw-px-4 tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-text-white placeholder:tw-text-white/30 tw-outline-none focus:tw-border-cyan-500 tw-transition-all">
            </div>

            <!-- Error message -->
            <p v-if="errorMessage" class="tw-text-red-400 tw-text-sm tw-bg-red-500/10 tw-border tw-border-red-500/20 tw-rounded-xl tw-px-4 tw-py-3">{{ errorMessage }}</p>

            <!-- Submit -->
            <button type="submit" :disabled="submitting" class="tw-h-12 tw-w-full sm:tw-w-[220px] tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-rounded-xl tw-text-white tw-font-semibold hover:tw-from-cyan-600 hover:tw-to-cyan-700 hover:tw-shadow-lg hover:tw-shadow-cyan-500/30 tw-transition-all disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-flex tw-items-center tw-justify-center tw-gap-2">
                <span v-if="!submitting">Сохранить изменения</span>
                <div v-else class="tw-w-5 tw-h-5 tw-border-2 tw-border-white/30 tw-border-t-white tw-rounded-full tw-animate-spin"></div>
            </button>
        </form>
    </div>
</template>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
