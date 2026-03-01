<template>
    <div class="superadmin-app">
        <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
            <div class="sidebar-header">
                <div class="logo-box">
                    <img src="/logo.jpg" alt="Khan Cargo" class="logo-img" />
                </div>
                <div class="logo-text hide-on-collapse">
                    <span class="title">KHAN CARGO</span>
                    <span class="subtitle">TARAZ</span>
                </div>
            </div>

            <nav class="sidebar-nav">
                <router-link to="/superAdmin" class="nav-link">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span class="nav-label hide-on-collapse">Dashboard</span>
                </router-link>
                <router-link to="/superAdmin/warehouses" class="nav-link">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M3 12h5m8 0h5M12 3v5m0 8v5"></path>
                    </svg>
                    <span class="nav-label hide-on-collapse">Branches</span>
                </router-link>
                <router-link to="/superAdmin/users" class="nav-link">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span class="nav-label hide-on-collapse">Users</span>
                </router-link>
                <router-link to="/superAdmin/tracks" class="nav-link">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="21 8 21 21 3 21 3 8"></polyline>
                        <rect x="1" y="3" width="22" height="5"></rect>
                        <line x1="10" y1="12" x2="14" y2="12"></line>
                    </svg>
                    <span class="nav-label hide-on-collapse">Inventory</span>
                </router-link>
                <router-link to="/superAdmin/history" class="nav-link">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span class="nav-label hide-on-collapse">History</span>
                </router-link>
                <router-link to="/superAdmin/settings" class="nav-link">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path
                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
                        </path>
                    </svg>
                    <span class="nav-label hide-on-collapse">Settings</span>
                </router-link>
            </nav>

            <div class="sidebar-collapse-toggle">
                <button @click="toggleSidebar" class="collapse-btn"
                    :title="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'">
                    <svg class="collapse-icon" :class="{ rotated: sidebarCollapsed }" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="11 17 6 12 11 7"></polyline>
                        <polyline points="18 17 13 12 18 7"></polyline>
                    </svg>
                </button>
            </div>

            <div class="sidebar-footer">
                <div class="user-profile">
                    <div class="avatar-placeholder">MT</div>
                    <div class="user-info hide-on-collapse">
                        <span class="user-name">Marcus Thorne</span>
                        <span class="user-role">System Administrator</span>
                    </div>
                    <button @click="logout" class="logout-icon-btn hide-on-collapse" title="Logout">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </aside>

        <main class="superadmin-main" :class="{ 'main-expanded': sidebarCollapsed }">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
const token = useCookie('token')
const sidebarCollapsed = ref(false)

function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
}

function logout() {
    token.value = null
    navigateTo('/auth/login')
}
</script>

<style scoped>
.superadmin-app {
    display: flex;
    min-height: 100vh;
    background-color: #0d0d0d;
    color: #e6edf3;
    font-family: 'Inter', -apple-system, sans-serif;
}

.sidebar {
    width: 260px;
    background-color: #161618;
    border-right: 1px solid #27272a;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    overflow-y: auto;
    z-index: 10;
    transition: width 0.3s ease;
}

.sidebar.collapsed {
    width: 72px;
}

.sidebar-header {
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.sidebar.collapsed .sidebar-header {
    padding: 24px 18px;
    justify-content: center;
}

.logo-box {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
}

.logo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.logo-text {
    display: flex;
    flex-direction: column;
}

.title {
    font-size: 14px;
    font-weight: 800;
    color: white;
    letter-spacing: 0.5px;
}

.subtitle {
    font-size: 10px;
    font-weight: 700;
    color: #71717a;
    letter-spacing: 1px;
}

/* Hide text elements when sidebar is collapsed */
.sidebar.collapsed .hide-on-collapse {
    display: none;
}

.sidebar-nav {
    flex: 1;
    padding: 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.sidebar.collapsed .sidebar-nav {
    padding: 16px 12px;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    border-radius: 8px;
    color: #a1a1aa;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s;
    white-space: nowrap;
    overflow: hidden;
}

.sidebar.collapsed .nav-link {
    padding: 10px;
    justify-content: center;
}

.nav-label {
    transition: opacity 0.2s ease;
}

.nav-icon {
    width: 18px;
    height: 18px;
    opacity: 0.8;
    flex-shrink: 0;
}

.nav-link:hover {
    background-color: #27272a;
    color: #e4e4e7;
}

.nav-link.router-link-active {
    background-color: rgba(59, 130, 246, 0.1);
    color: #60a5fa;
}

.nav-link.router-link-active .nav-icon {
    opacity: 1;
}

/* Collapse toggle button */
.sidebar-collapse-toggle {
    padding: 0 16px 8px;
}

.sidebar.collapsed .sidebar-collapse-toggle {
    padding: 0 12px 8px;
}

.collapse-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border: 1px solid #27272a;
    border-radius: 8px;
    background-color: #1e1e20;
    color: #71717a;
    cursor: pointer;
    transition: all 0.2s;
}

.collapse-btn:hover {
    background-color: #27272a;
    color: #a1a1aa;
}

.collapse-icon {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
}

.collapse-icon.rotated {
    transform: rotate(180deg);
}

.sidebar-footer {
    padding: 24px 16px;
    border-top: 1px solid #27272a;
}

.sidebar.collapsed .sidebar-footer {
    padding: 16px 12px;
}

.user-profile {
    display: flex;
    align-items: center;
    background-color: #1e1e20;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #27272a;
    gap: 10px;
}

.sidebar.collapsed .user-profile {
    padding: 8px;
    justify-content: center;
}

.avatar-placeholder {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #f7cbba;
    color: #c2410c;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 800;
    flex-shrink: 0;
}

.user-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}

.user-name {
    font-size: 13px;
    font-weight: 700;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-role {
    font-size: 10px;
    color: #71717a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.logout-icon-btn {
    background: none;
    border: none;
    color: #71717a;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.logout-icon-btn svg {
    width: 16px;
    height: 16px;
}

.logout-icon-btn:hover {
    color: #ef4444;
    background-color: rgba(239, 68, 68, 0.1);
}

.superadmin-main {
    flex: 1;
    margin-left: 260px;
    min-height: 100vh;
    background-color: #09090b;
    padding: 0;
    transition: margin-left 0.3s ease;
}

.superadmin-main.main-expanded {
    margin-left: 72px;
}

@media (max-width: 768px) {
    .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s, width 0.3s ease;
    }

    .sidebar-open {
        transform: translateX(0);
    }

    .superadmin-main {
        margin-left: 0;
    }

    .superadmin-main.main-expanded {
        margin-left: 0;
    }
}
</style>
