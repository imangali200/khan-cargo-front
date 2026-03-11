<script setup lang="ts">
definePageMeta({
    layout: 'user'
})

import { useToast } from '~/composables/useToast'
import type { User } from '~/types'

const WHATSAPP_NUMBER = "77083791496"
const token = useCookie('token')
const toast = useToast()
const router = useRouter()
const api = useApi()

const profile = ref<User | null>(null)
const whatsappLink = computed(() => `https://wa.me/${WHATSAPP_NUMBER}`)
const link = ref('')
const review = ref('')
const photo = ref<File | null>(null)
const photoPreview = ref<string | null>(null)
const submitting = ref(false)
const loading = ref(false)
const isLoggedIn = computed(() => !!token.value)

async function compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
            const img = new Image()
            img.src = event.target?.result as string
            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height
                const MAX_WIDTH = 1920
                const MAX_HEIGHT = 1920
                if (width > height) {
                    if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                } else {
                    if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                }
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                ctx?.drawImage(img, 0, 0, width, height)
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob)
                    else reject(new Error('Canvas conversion failed'))
                }, 'image/jpeg', 0.8)
            }
            img.onerror = (e) => reject(e)
        }
        reader.onerror = (e) => reject(e)
    })
}

async function handlePhotoSelect(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
        const file = input.files[0]
        if (!file.type.startsWith('image/')) {
            toast.warning('Пожалуйста, выберите изображение')
            return
        }
        try {
            loading.value = true
            let finalImage: Blob | File = file
            if (file.size > 1 * 1024 * 1024) { finalImage = await compressImage(file) }
            photo.value = new File([finalImage], file.name, { type: 'image/jpeg' })
            photoPreview.value = URL.createObjectURL(finalImage)
        } catch (error) {
            toast.error('Ошибка обработки фото')
        } finally {
            loading.value = false
        }
    }
}

function removePhoto() {
    photo.value = null
    photoPreview.value = null
}

async function createPost() {
    if (!link.value.trim()) {
        toast.warning('Пожалуйста, введите ссылку')
        return
    }
    if (!review.value.trim()) {
        toast.warning('Пожалуйста, введите отзыв')
        return
    }

    submitting.value = true
    try {
        const formData = new FormData()
        formData.append('content', review.value.trim())
        if (link.value.trim()) {
            formData.append('externalLink', link.value.trim())
        }
        if (photo.value) {
            formData.append('image', photo.value)
        }

        await api.feed.createPost(formData)
        toast.success('Пост опубликован!')
        router.push('/user')
    } catch (e: any) {
        toast.error(e.response?.data?.message || 'Ошибка при создании поста')
    } finally {
        submitting.value = false
    }
}

function goBack() {
    router.back()
}

function goToLogin() {
    router.push('/auth/login')
}

const refreshToken = useCookie('refreshToken')

function logout() {
    token.value = null
    refreshToken.value = null
    router.push('/auth/login')
}

onMounted(async () => {
    if (isLoggedIn.value) {
        try {
            const { data } = await api.profile.getProfile()
            profile.value = data
        } catch { }
    }
})
</script>

<template>
    <div v-if="!isLoggedIn" class="login-required">
        <div class="login-card">
            <div class="login-icon">✏️</div>
            <h2>Создать пост</h2>
            <p>Пожалуйста, войдите, чтобы делиться обновлениями</p>
            <button class="login-btn" @click="goToLogin">Войти</button>
        </div>
    </div>

    <div v-else-if="loading" class="loading-screen">
        <div class="loader"></div>
    </div>



    <div v-else class="create-post-container">
        <div class="create-header">
            <button @click="goBack" class="cancel-btn">Отмена</button>
            <h1 class="header-title">Новый пост</h1>
            <button @click="createPost" :disabled="submitting || !link.trim() || !review.trim()"
                class="post-submit-btn">
                {{ submitting ? 'Публикация...' : 'Опубликовать' }}
            </button>
        </div>

        <div class="create-form">
            <!-- Photo Upload -->
            <div class="form-group">
                <label>ФОТО ГРУЗА</label>
                <div v-if="!photoPreview" class="photo-upload" @click="($refs.photoInput as HTMLInputElement).click()">
                    <input ref="photoInput" type="file" accept="image/*" @change="handlePhotoSelect" hidden />
                    <div class="upload-icon">📷</div>
                    <span>Выберите изображение груза</span>
                </div>
                <div v-else class="photo-preview">
                    <img :src="photoPreview" alt="Preview" />
                    <button type="button" class="remove-photo" @click="removePhoto">✕</button>
                </div>
            </div>

            <div class="form-group">
                <label>ССЫЛКА НА ТРЕКИНГ</label>
                <input v-model="link" type="url" placeholder="https://tracking.example.com/item" class="form-input" />
            </div>

            <div class="form-group">
                <label>ДЕТАЛИ ГРУЗА И ОТЗЫВ</label>
                <textarea v-model="review" placeholder="Опишите груз и ваши впечатления..."
                    class="form-textarea"></textarea>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-required {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background-color: #0d1117;
}

.login-card {
    text-align: center;
    padding: 40px 32px;
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 24px;
    max-width: 340px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.login-icon {
    font-size: 56px;
    margin-bottom: 24px;
}

.login-card h2 {
    font-size: 26px;
    font-weight: 800;
    color: white;
    margin: 0 0 12px;
}

.login-card p {
    font-size: 15px;
    color: #8b949e;
    line-height: 1.5;
    margin: 0 0 32px;
}

.login-btn {
    width: 100%;
    padding: 16px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s;
}

.login-btn:active {
    transform: scale(0.98);
}

.loading-screen {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0d1117;
}

.loader {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(37, 99, 235, 0.1);
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Activation Page */
.activation-page {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background-color: #0d1117;
}

.activation-card {
    text-align: center;
    padding: 40px 32px;
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 24px;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.activation-icon {
    margin-bottom: 24px;
    display: flex;
    justify-content: center;
}

.activation-card h2 {
    font-size: 24px;
    font-weight: 800;
    color: white;
    margin: 0 0 12px;
}

.activation-card>p {
    font-size: 15px;
    color: #8b949e;
    line-height: 1.6;
    margin: 0 0 32px;
}

.user-id-box {
    background-color: #0d1117;
    border: 1px solid #30363d;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.id-label {
    font-size: 11px;
    font-weight: 800;
    color: #8b949e;
    letter-spacing: 1px;
}

.id-value {
    font-size: 24px;
    font-weight: 900;
    color: #2563eb;
    letter-spacing: 2px;
}

.whatsapp-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    padding: 16px;
    background-color: #10b981;
    color: white;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    text-decoration: none;
    transition: background 0.2s;
}

.whatsapp-btn:hover {
    background-color: #059669;
}

.logout-link-btn {
    margin-top: 24px;
    background: none;
    border: none;
    color: #8b949e;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
}

/* Create Post Page */
.create-post-container {
    background-color: #0d1117;
    min-height: 100vh;
    padding: 16px;
    color: #e6edf3;
    font-family: 'Inter', -apple-system, sans-serif;
}

.create-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0 24px;
    max-width: 600px;
    margin: 0 auto;
}

.header-title {
    font-size: 17px;
    font-weight: 800;
    margin: 0;
}

.cancel-btn {
    background: none;
    border: none;
    color: #8b949e;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
}

.post-submit-btn {
    padding: 8px 20px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
}

.post-submit-btn:disabled {
    background-color: #30363d;
    color: #8b949e;
    cursor: not-allowed;
}

.create-form {
    display: flex;
    flex-direction: column;
    gap: 32px;
    max-width: 600px;
    margin: 0 auto;
    padding-bottom: 100px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.form-group label {
    font-size: 12px;
    font-weight: 800;
    color: #8b949e;
    letter-spacing: 1px;
    padding-left: 4px;
}

.form-input,
.form-textarea {
    width: 100%;
    padding: 18px;
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 16px;
    color: white;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-textarea:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-textarea {
    resize: none;
    min-height: 160px;
}

/* Photo Upload */
.photo-upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    height: 200px;
    background-color: #161b22;
    border: 2px dashed #30363d;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s;
}

.photo-upload:hover {
    border-color: #2563eb;
    background-color: #1c2128;
}

.upload-icon {
    font-size: 40px;
}

.photo-upload span {
    font-size: 14px;
    color: #8b949e;
    font-weight: 600;
}

.photo-preview {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    aspect-ratio: 16/9;
}

.photo-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.remove-photo {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
