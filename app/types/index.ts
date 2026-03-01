export interface User {
    id: number;
    name: string;
    lastName: string;
    telegramUsername?: string;
    telegramNickname?: string;
    phoneNumber: string;
    userCode: string;
    role: 'USER' | 'ADMIN' | 'SUPERADMIN';
    branchId: number;
    branch?: Branch;
    isActive: boolean;
    avatar?: string;
    createAt: string;
}

export interface Branch {
    id: number;
    name: string;
    address?: string;
    isActive: boolean;
    adminId?: number;
    admin?: User;
    telegramThreadId?: number;
    createAt: string;
}

export interface Post {
    id: number;
    content: string;
    imageUrl?: string;
    externalLink?: string;
    price?: number;
    likesCount: number;
    commentsCount: number;
    isHidden: boolean;
    createAt: string;
    createdAt?: string; // From new API
    updatedAt?: string; // From new API
    authorId?: number;  // From new API
    imagePublicId?: string; // From new API
    author: User;
    branch: Branch;
    isLikedByMe?: boolean; // Added on frontend
    isSaved?: boolean;     // Added on frontend
    comments?: Comment[];  // Added on frontend
}

export interface Comment {
    id: number;
    content: string;
    createAt: string;
    author: User;
}

export enum TrackingStatus {
    REGISTERED = 'REGISTERED',
    ARRIVED_CHINA_WAREHOUSE = 'ARRIVED_CHINA_WAREHOUSE',
    ARRIVED_BRANCH = 'ARRIVED_BRANCH',
    PICKED_UP = 'PICKED_UP',
}

export interface TrackingItem {
    id: number;
    trackingCode: string;
    description: string;
    branchId: number;
    branch?: Branch;
    createdByUserId: number;
    createdBy?: User;
    currentStatus: TrackingStatus;
    clientName?: string;
    clientPhone?: string;
    weight?: number;
    declaredValue?: number;
    chinaArrivalDate?: string;
    aicargoArrivalDate?: string;
    deliveryDate?: string;
    isTelegramNotified: boolean;
    createAt: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
        limit: number;
    };
}

export interface DashboardStats {
    totalAcceptedToday: number;
    inProcessing: number;
    totalActive: number;
}
