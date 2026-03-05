import { useNuxtApp } from '#app';
import type { PaginatedResponse, User, Branch, Post, TrackingItem, DashboardStats, TrackingStatus } from '~/types';

export const useApi = () => {
    const { $axios } = useNuxtApp();

    return {
        auth: {
            signIn: (data: any) => $axios.post('/auth/signIn', data),
            signUp: (data: any) => $axios.post('/auth/signUp', data),
            refresh: (data: { refreshToken: string }) => $axios.post('/auth/refresh', data),
        },
        profile: {
            getProfile: () => $axios.get<User>('/profile'),
            updateProfile: (data: any) => $axios.patch<User>('/profile', data),
            uploadProfilePhoto: (data: FormData) => $axios.patch<{ profilePhotoUrl: string }>('/user/profile-photo', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
            getMyPosts: (params?: any) => $axios.get<PaginatedResponse<Post>>('/profile/posts', { params }),
            getLikedPosts: (params?: any) => $axios.get<PaginatedResponse<Post>>('/profile/liked', { params }),
            getMyTracking: (params?: any) => $axios.get<PaginatedResponse<TrackingItem>>('/profile/tracking', { params }),
            getMyArchiveTracking: (params?: any) => $axios.get<PaginatedResponse<TrackingItem>>('/profile/trackingArchive', { params }),
        },
        branches: {
            findAll: () => $axios.get<Branch[]>('/branches'),
            findOne: (id: number) => $axios.get<Branch>(`/branches/id/${id}`),
            create: (data: any) => $axios.post<Branch>('/branches', data),
            update: (id: number, data: any) => $axios.patch<Branch>(`/branches/${id}`, data),
            remove: (id: number) => $axios.delete(`/branches/${id}`),
        },
        feed: {
            getFeed: (params?: any) => $axios.get<PaginatedResponse<Post>>('/feed', { params }),
            searchPosts: (search: string) => $axios.get<PaginatedResponse<Post>>(`/feed/posts/${search}`),
            createPost: (data: FormData) => $axios.post<Post>('/feed/posts', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
            deletePost: (id: number) => $axios.delete(`/feed/posts/${id}`),
            toggleLike: (id: number) => $axios.post(`/feed/posts/${id}/like`),
            getComments: (postId: number, params?: any) => $axios.get<PaginatedResponse<any>>(`/feed/posts/${postId}/comments`, { params }),
            createComment: (postId: number, data: any) => $axios.post(`/feed/posts/${postId}/comments`, data),
            deleteComment: (postId: number, commentId: number) => $axios.delete(`/feed/posts/${postId}/comments/${commentId}`),
        },
        tracking: {
            create: (data: any) => $axios.post<TrackingItem>('/tracking', data),
            findAll: (params?: any) => $axios.get<PaginatedResponse<TrackingItem>>('/tracking', { params }),
            searchByCode: (trackingCode: string) => $axios.get<TrackingItem>('/tracking/search', { params: { trackingCode } }),
            getOne: (id: number) => $axios.get<TrackingItem>(`/tracking/${id}`),
            update: (id: number, data: any) => $axios.patch<TrackingItem>(`/tracking/${id}`, data),
            updateStatus: (id: number, data: any) => $axios.patch<TrackingItem>(`/tracking/${id}/status`, data),
            getArchive: (params?: any) => $axios.get<PaginatedResponse<TrackingItem>>('/tracking/archive', { params }),
            softDelete: (id: number) => $axios.delete(`/tracking/softDelete/${id}`),
            restore: (id: number) => $axios.patch(`/tracking/restore/${id}`),
            remove: (id: number) => $axios.delete(`/tracking/${id}`),
            dashboard: () => $axios.get<DashboardStats>('/tracking/dashboard'),
            quickUpdate: (data: any) => $axios.patch<TrackingItem>('/tracking/quick-update', data),
            notifyArrivals: () => $axios.post('/tracking/notify-arrivals'),
            importExcel: (data: FormData) => $axios.post('/tracking/import', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
            getImportLogs: (params?: any) => $axios.get<PaginatedResponse<any>>('/tracking/import/logs', { params }),
        },
        users: {
            getPublicProfile: (id: number) => $axios.get<any>(`/users/${id}/profile`),
        },
        admin: {
            getUsers: (params?: any) => $axios.get<PaginatedResponse<User>>('/admin/users', { params }),
            getUser: (id: number) => $axios.get<User>(`/admin/users/${id}`),
            createUser: (data: any) => $axios.post<User>('/admin/users', data),
            updateUser: (id: number, data: any) => $axios.patch<User>(`/admin/users/${id}`, data),
            resetPassword: (id: number, data: any) => $axios.patch(`/admin/users/${id}/reset-password`, data),
            toggleStatus: (id: number) => $axios.post(`/admin/users/${id}/toggle-status`),
            deleteUser: (id: number) => $axios.delete(`/admin/users/${id}`),
            getSettings: () => $axios.get('/admin/settings'),
            updateSetting: (key: string, value: string) => $axios.put(`/admin/settings/${key}`, { value }),
        }
    };
};
