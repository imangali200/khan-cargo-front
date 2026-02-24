<script setup lang="ts">
definePageMeta({
    layout: 'user'
})

import { useToast } from '~/composables/useToast'

interface Profile {
    id: number
    code: string
    isActive: boolean
}

const WHATSAPP_NUMBER = "77083791496"

const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()
const router = useRouter()

const profile = ref<Profile | null>({
    id: 1,
    code: 'Ai-123',
    isActive: true
})
const link = ref('')
const review = ref('')
const photo = ref<File | null>(null)
const photoPreview = ref<string | null>(null)
const submitting = ref(false)
const loading = ref(false)
const isLoggedIn = computed(() => true)

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
            toast.warning('Суретті таңдаңыз', { position: 'top-center' })
            return
        }
        try {
            loading.value = true
            let finalImage: Blob | File = file
            if (file.size > 1 * 1024 * 1024) { finalImage = await compressImage(file) }
            photo.value = new File([finalImage], file.name, { type: 'image/jpeg' })
            photoPreview.value = URL.createObjectURL(finalImage)
        } catch (error) {
            toast.error('Ошибка при обработке фото')
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
        toast.warning('Введите ссылку', { position: 'top-center' })
        return
    }
    if (!review.value.trim()) {
        toast.warning('Введите отзыв', { position: 'top-center' })
        return
    }
    if (!photo.value) {
        toast.warning('Добавьте фото', { position: 'top-center' })
        return
    }

    submitting.value = true
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1000))
    
    toast.success('Пост опубликован! (симуляция)', { position: 'top-center' })
    router.push('/user')
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

onMounted(() => {
    // Ready to create post
})
</script>

<template>
    <div v-if="!isLoggedIn" class="login-required">
        <div class="login-card">
            <div class="login-icon">✏️</div>
            <h2>Создать пост</h2>
            <p>Войдите, чтобы создать пост</p>
            <button class="login-btn" @click="goToLogin">Войти</button>
        </div>
    </div>

    <div v-else-if="loading" class="loading-screen">
        <div class="spinner"></div>
    </div>

    <!-- Если isActive = false -->
    <div v-else-if="profile && !profile.isActive" class="activation-page">
        <div class="activation-card">
            <div class="activation-icon">⏳</div>
            <h2>Аккаунт не активирован</h2>
            <p>Ваш аккаунт ожидает активации администратором. Отправьте заявку через WhatsApp для быстрой активации.</p>
            
            <div class="user-code">
                <span class="code-label">Ваш код:</span>
                <span class="code-value">{{ profile.code }}</span>
            </div>

            <a :href="whatsappLink" target="_blank" class="whatsapp-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Отправить в WhatsApp
            </a>

            <p class="hint-text">После подтверждения администратором ваш аккаунт будет активирован</p>

            <button class="logout-btn" @click="logout">Выйти</button>
        </div>
    </div>

    <div v-else class="create-page">
        <div class="create-header">
            <button @click="goBack" class="cancel-btn">Отмена</button>
            <button @click="createPost" :disabled="submitting || !link.trim() || !review.trim() || !photo" class="submit-btn">
                {{ submitting ? 'Жүктелуде...' : 'Жариялау' }}
            </button>
        </div>

        <div class="create-form">
            <!-- Photo Upload -->
            <div class="form-group">
                <label>Фото</label>
                <div v-if="!photoPreview" class="photo-upload" @click="($refs.photoInput as HTMLInputElement).click()">
                    <input ref="photoInput" type="file" accept="image/*" @change="handlePhotoSelect" hidden />
                    <div class="upload-icon">📷</div>
                    <span>Нажмите, чтобы выбрать фото</span>
                </div>
                <div v-else class="photo-preview">
                    <img :src="photoPreview" alt="Preview" />
                    <button type="button" class="remove-photo" @click="removePhoto">✕</button>
                </div>
            </div>

            <div class="form-group">
                <label>Ссылка</label>
                <input v-model="link" type="url" placeholder="https://example.com/product" class="form-input" />
            </div>

            <div class="form-group">
                <label>Отзыв</label>
                <textarea v-model="review" placeholder="Что вы думаете об этом товаре?..." rows="6" class="form-textarea"></textarea>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-required { min-height: 70vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
.login-card { text-align: center; padding: 40px 24px; border: 1px solid #333; border-radius: 20px; max-width: 320px; }
.login-icon { font-size: 64px; margin-bottom: 16px; }
.login-card h2 { font-size: 24px; font-weight: 700; color: #fff; margin: 0 0 8px; }
.login-card p { font-size: 15px; color: #777; margin: 0 0 24px; }
.login-btn { width: 100%; padding: 14px 24px; background: #fff; color: #000; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; }
.login-btn:hover { background: #eee; }

.loading-screen { min-height: 60vh; display: flex; align-items: center; justify-content: center; }
.spinner { width: 32px; height: 32px; border: 3px solid #333; border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Activation Page */
.activation-page { min-height: 70vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
.activation-card { text-align: center; padding: 40px 24px; border: 1px solid #333; border-radius: 24px; max-width: 380px; width: 100%; }
.activation-icon { font-size: 64px; margin-bottom: 20px; }
.activation-card h2 { font-size: 22px; font-weight: 700; color: #fff; margin: 0 0 12px; }
.activation-card > p { font-size: 15px; color: #888; line-height: 1.6; margin: 0 0 24px; }
.user-code { background: #111; border: 1px solid #333; border-radius: 12px; padding: 16px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; }
.code-label { font-size: 14px; color: #666; }
.code-value { font-size: 20px; font-weight: 700; color: #fff; letter-spacing: 1px; }
.whatsapp-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 16px; background: #25D366; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; color: #fff; text-decoration: none; cursor: pointer; transition: all 0.2s; }
.whatsapp-btn:hover { background: #20BD5A; }
.whatsapp-btn svg { width: 22px; height: 22px; }
.hint-text { font-size: 13px; color: #555; margin: 16px 0 24px; line-height: 1.5; }
.logout-btn { width: 100%; padding: 14px; background: transparent; border: 1px solid #333; border-radius: 12px; color: #888; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.logout-btn:hover { background: #111; color: #fff; }

.create-page { padding: 0; }

.create-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid #222; margin-bottom: 24px; }
.create-header h1 { font-size: 17px; font-weight: 700; color: #fff; margin: 0; }
.cancel-btn { background: transparent; border: none; color: #fff; font-size: 15px; cursor: pointer; padding: 8px 0; }
.submit-btn { padding: 10px 20px; background: #fff; border: none; border-radius: 20px; color: #000; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.submit-btn:hover:not(:disabled) { background: #e5e5e5; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.create-form { display: flex; flex-direction: column; gap: 24px; }

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 14px; font-weight: 600; color: #777; }

.form-input, .form-textarea { width: 100%; padding: 16px; background: #111; border: 1px solid #333; border-radius: 12px; color: #fff; font-size: 16px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
.form-input:focus, .form-textarea:focus { border-color: #555; }
.form-input::placeholder, .form-textarea::placeholder { color: #555; }
.form-textarea { resize: none; font-family: inherit; line-height: 1.5; }

/* Photo Upload */
.photo-upload { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 40px 20px; background: #111; border: 2px dashed #333; border-radius: 16px; cursor: pointer; transition: all 0.2s; }
.photo-upload:hover { border-color: #555; background: #151515; }
.upload-icon { font-size: 48px; }
.photo-upload span { font-size: 14px; color: #666; }

.photo-preview { position: relative; border-radius: 16px; overflow: hidden; }
.photo-preview img { width: 100%; max-height: 400px; object-fit: cover; display: block; border-radius: 16px; }
.remove-photo { position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; background: rgba(0,0,0,0.7); border: none; border-radius: 50%; color: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.remove-photo:hover { background: #ff4444; }
</style>
