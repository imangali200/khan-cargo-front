export interface User {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    name: string;
    lastName: string;
    telegramUsername?: string | null;
    telegramNickname?: string | null;
    email?: string | null;
    profilePhotoUrl?: string | null;
    profilePhotoPublicId?: string | null;
    phoneNumber: string;
    userCode: string;
    role: 'user' | 'admin' | 'superadmin' | 'USER' | 'ADMIN' | 'SUPERADMIN';
    branchId: number;
    branch?: Branch;
    isActive: boolean;
}

export interface Branch {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    name: string;
    address?: string | null;
    isActive: boolean;
    adminId?: number | null;
    admin?: User;
    telegramThreadId?: number | null;
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
    khanCargoArrivalDate?: string;
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
