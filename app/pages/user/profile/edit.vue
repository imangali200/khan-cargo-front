<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import type { User } from '~/types'

definePageMeta({
    layout: 'profile'
})

const api = useApi()
const toast = useToast()
const router = useRouter()

const profile = ref<User | null>(null)
const loading = ref(true)
const saving = ref(false)

const editData = ref({
    name: '',
    lastName: '',
    telegramUsername: '',
    email: '',
    branchId: null as number | null,
})

const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)

async function loadProfile() {
    try {
        const { data } = await api.profile.getProfile()
        profile.value = data
        editData.value.name = data.name || ''
        editData.value.lastName = data.lastName || ''
        editData.value.telegramUsername = data.telegramUsername || ''
        editData.value.email = data.email || ''
        editData.value.branchId = data.branchId || null
        if (data.profilePhotoUrl) {
            avatarPreview.value = data.profilePhotoUrl
        }
    } catch {
        toast.error('Ошибка при загрузке профиля')
        router.push('/user/me')
    } finally {
        loading.value = false
    }
}

function onAvatarChange(e: Event) {
    const target = e.target as HTMLInputElement
    if (target.files && target.files[0]) {
        avatarFile.value = target.files[0]
        const reader = new FileReader()
        reader.onload = (ev) => {
            avatarPreview.value = ev.target?.result as string
        }
        reader.readAsDataURL(target.files[0])
    }
}

async function saveProfile() {
    saving.value = true
    try {
        await api.profile.updateProfile({
            name: editData.value.name,
            lastName: editData.value.lastName,
            telegramUsername: editData.value.telegramUsername || undefined,
            email: editData.value.email || undefined,
            branchId: editData.value.branchId || undefined,
        })

        if (avatarFile.value) {
            const formData = new FormData()
            formData.append('photo', avatarFile.value)
            await api.profile.uploadProfilePhoto(formData)
        }

        toast.success('Профиль успешно обновлен')
        router.push('/user/me')
    } catch (e: any) {
        toast.error(e.response?.data?.message || 'Ошибка при обновлении')
    } finally {
        saving.value = false
    }
}

function copyId() {
    if (profile.value?.userCode) {
        navigator.clipboard.writeText(profile.value.userCode)
        toast.success('ID скопирован')
    }
}

onMounted(() => {
    loadProfile()
})
</script>

<template>
    <div class="edit-profile-page">
        <div class="header">
            <button @click="router.back()" class="back-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
            </button>
            <h1>Редактировать профиль</h1>
            <div class="spacer"></div>
        </div>

        <div v-if="loading" class="loading-wrap">
            <div class="spinner"></div>
        </div>

        <div v-else class="content">
            <!-- Avatar Section -->
            <div class="avatar-section">
                <div class="avatar-container">
                    <div class="avatar-wrap">
                        <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar" />
                        <span v-else class="initial">{{ profile?.name?.charAt(0).toUpperCase() }}</span>
                    </div>
                    <label class="avatar-edit-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path
                                d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                        </svg>
                        <input type="file" accept="image/*" @change="onAvatarChange" hidden />
                    </label>
                </div>
            </div>

            <!-- Form Fields -->
            <div class="form-group">
                <label class="field-label">ИДЕНТИФИКАЦИЯ ПОЛЬЗОВАТЕЛЯ</label>
                <div class="input-wrap readonly" @click="copyId">
                    <input type="text" :value="profile?.userCode" readonly />
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                </div>
            </div>

            <div class="form-group">
                <label class="field-label">ИМЯ</label>
                <div class="input-wrap">
                    <input v-model="editData.name" type="text" placeholder="Введите имя" />
                </div>
            </div>

            <div class="form-group">
                <label class="field-label">ФАМИЛИЯ</label>
                <div class="input-wrap">
                    <input v-model="editData.lastName" type="text" placeholder="Введите фамилию" />
                </div>
            </div>

            <div class="form-group">
                <label class="field-label">TELEGRAM USERNAME</label>
                <div class="input-wrap">
                    <input v-model="editData.telegramUsername" type="text" placeholder="Введите username" />
                </div>
            </div>

            <div class="form-group">
                <label class="field-label">EMAIL</label>
                <div class="input-wrap">
                    <input v-model="editData.email" type="email" placeholder="Введите email" />
                </div>
            </div>

            <div class="form-group">
                <label class="field-label">ID ФИЛИАЛА</label>
                <div class="input-wrap">
                    <input v-model.number="editData.branchId" type="number" placeholder="Введите ID филиала" />
                </div>
            </div>

            <div class="form-group">
                <label class="field-label">НОМЕР ТЕЛЕФОНА</label>
                <div class="input-wrap readonly">
                    <input type="text" :value="profile?.phoneNumber" readonly />
                </div>
            </div>

            <!-- Note: Bio is omitted as per previous user request, though present in teaser mockup -->

            <div class="bottom-action">
                <button @click="saveProfile" :disabled="saving" class="save-btn">
                    {{ saving ? 'Сохранение...' : 'Сохранить изменения' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.edit-profile-page {
    background-color: #000000;
    min-height: 100vh;
    color: #ffffff;
    font-family: 'Golos Text', 'Inter', -apple-system, sans-serif;
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
}

.header h1 {
    font-size: 18px;
    font-weight: 800;
}

.back-btn {
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.spacer {
    width: 40px;
}

.content {
    flex: 1;
    padding: 24px 20px 120px;
    max-width: 440px;
    margin: 0 auto;
    width: 100%;
}

/* Avatar */
.avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32px;
}

.avatar-container {
    position: relative;
    display: inline-block;
}

.avatar-wrap {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #1e40af);
    border: 4px solid #111;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px rgba(37, 99, 235, 0.15);
}

.avatar-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.initial {
    font-size: 34px;
    font-weight: 900;
}

.avatar-edit-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #2563eb;
    border: 3px solid #000;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s;
}

.avatar-edit-btn:active {
    transform: scale(0.9);
}

/* Form */
.form-group {
    margin-bottom: 20px;
}

.field-label {
    display: block;
    font-size: 11px;
    font-weight: 800;
    color: #444;
    letter-spacing: 0.8px;
    margin-bottom: 8px;
    padding-left: 4px;
}

.input-wrap {
    background-color: #0d0d0d;
    border: 1px solid #161616;
    border-radius: 16px;
    height: 54px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    transition: all 0.2s;
}

.input-wrap:focus-within {
    border-color: #2563eb;
    background-color: #111;
}

.input-wrap input {
    flex: 1;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    outline: none;
    width: 100%;
}

.input-wrap.readonly {
    cursor: default;
}

.input-wrap.readonly input {
    color: #444;
}

/* Bottom Action */
.bottom-action {
    position: fixed;
    bottom: calc(85px + env(safe-area-inset-bottom, 0px));
    /* Clear bottom nav */
    left: 0;
    right: 0;
    padding: 24px 20px 24px;
    background: linear-gradient(0deg, #000 70%, rgba(0, 0, 0, 0) 100%);
    display: flex;
    justify-content: center;
    z-index: 10;
}

.save-btn {
    width: 100%;
    max-width: 400px;
    height: 56px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
    transition: all 0.2s;
}

.save-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #222;
    box-shadow: none;
}

.save-btn:active {
    transform: scale(0.98);
}

.loading-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #111;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: rotate 0.8s linear infinite;
}

@keyframes rotate {
    to {
        transform: rotate(360deg);
    }
}
</style>
