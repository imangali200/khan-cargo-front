<template>
    <div class="preview-hub">
        <header class="hub-header">
            <div class="logo">CF</div>
            <h1>CargoFlow Ecosystem</h1>
            <p>The updated preview hub for the CargoFlow logistics platform. Unified interface for users, branch admins,
                and global moderators.</p>
        </header>

        <main class="hub-container">
            <!-- User Section -->
            <section class="hub-section">
                <h2 class="section-title">📱 User Interface</h2>
                <div class="hub-grid">
                    <NuxtLink to="/user" class="hub-card user">
                        <div class="card-icon">🏠</div>
                        <div class="card-info">
                            <h3>Feed</h3>
                            <p>Cargo updates, reviews and community feed</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/user/tracking" class="hub-card user">
                        <div class="card-icon">📦</div>
                        <div class="card-info">
                            <h3>Tracking</h3>
                            <p>Manage and track your active cargo</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/user/me" class="hub-card user">
                        <div class="card-icon">👤</div>
                        <div class="card-info">
                            <h3>Profile</h3>
                            <p>Your account, posts and saved items</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/user/search" class="hub-card user">
                        <div class="card-icon">🔍</div>
                        <div class="card-info">
                            <h3>Search</h3>
                            <p>Quick lookup by tracking code</p>
                        </div>
                    </NuxtLink>
                </div>
            </section>

            <!-- Admin Section -->
            <section class="hub-section">
                <h2 class="section-title">🏢 Branch Management</h2>
                <div class="hub-grid">
                    <NuxtLink to="/admin" class="hub-card admin">
                        <div class="card-icon">⚡</div>
                        <div class="card-info">
                            <h3>Branch Console</h3>
                            <p>Receive and process cargo at the local hub</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/admin/history" class="hub-card admin">
                        <div class="card-icon">📜</div>
                        <div class="card-info">
                            <h3>Hub Log</h3>
                            <p>History of all movements and deliveries</p>
                        </div>
                    </NuxtLink>
                </div>
            </section>

            <!-- Super Admin Section -->
            <section class="hub-section">
                <h2 class="section-title">👑 Global Control Panel</h2>
                <div class="hub-grid">
                    <NuxtLink to="/superAdmin" class="hub-card s-admin">
                        <div class="card-icon">🏛️</div>
                        <div class="card-info">
                            <h3>Global Dashboard</h3>
                            <p>Real-time analytics across all branches</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/superAdmin/users" class="hub-card s-admin">
                        <div class="card-info">
                            <h3>User Hub</h3>
                            <p>Manage staff, branch admins, and clients</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/superAdmin/tracks" class="hub-card s-admin">
                        <div class="card-info">
                            <h3>Inventory Control</h3>
                            <p>Monitor all shipments through the system</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/superAdmin/import" class="hub-card s-admin">
                        <div class="card-info">
                            <h3>Mass Import</h3>
                            <p>Batch upload tracking codes and data</p>
                        </div>
                    </NuxtLink>
                </div>
            </section>

            <!-- Auth Section -->
            <section class="hub-section">
                <h2 class="section-title">🔐 Authentication</h2>
                <div class="hub-grid">
                    <NuxtLink to="/auth/login" class="hub-card auth">
                        <div class="card-icon">🔑</div>
                        <div class="card-info">
                            <h3>Login Page</h3>
                            <p>Premium dark-themed authentication screen</p>
                        </div>
                    </NuxtLink>
                </div>
            </section>
        </main>

        <div class="hub-footer">
            <p>© 2024 CargoFlow Engineering • Hub v2.1</p>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: false
})
</script>

<style scoped>
.preview-hub {
    min-height: 100vh;
    background-color: #0d1117;
    padding: 60px 20px;
    font-family: 'Inter', sans-serif;
    color: #e6edf3;
}

.hub-header {
    text-align: center;
    margin-bottom: 60px;
    max-width: 700px;
    margin-inline: auto;
}

.logo {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #2563eb, #1e40af);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 900;
    margin: 0 auto 24px;
    box-shadow: 0 12px 30px rgba(37, 99, 235, 0.3);
    color: white;
}

.hub-header h1 {
    font-size: 42px;
    font-weight: 900;
    margin: 0 0 16px;
    letter-spacing: -1.5px;
    color: white;
}

.hub-header p {
    font-size: 16px;
    color: #8b949e;
    line-height: 1.6;
}

.hub-container {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 60px;
}

.section-title {
    font-size: 13px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #8b949e;
    margin-bottom: 24px;
    padding-left: 10px;
    border-left: 3px solid #2563eb;
}

.hub-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
}

.hub-card {
    background: #161b22;
    border: 1px solid #30363d;
    padding: 24px;
    border-radius: 24px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.hub-card:hover {
    transform: translateY(-4px);
    background: #1c2128;
    border-color: #2563eb;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-icon {
    font-size: 28px;
    width: 56px;
    height: 56px;
    background: #0d1117;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-info h3 {
    font-size: 17px;
    font-weight: 800;
    color: #fff;
    margin: 0 0 4px;
}

.card-info p {
    font-size: 13px;
    color: #8b949e;
    margin: 0;
}

.hub-footer {
    margin-top: 100px;
    text-align: center;
    border-top: 1px solid #30363d;
    padding-top: 40px;
}

.hub-footer p {
    font-size: 12px;
    color: #484f58;
    font-weight: 700;
}

@media (max-width: 600px) {
    .hub-grid {
        grid-template-columns: 1fr;
    }

    .hub-header h1 {
        font-size: 32px;
    }
}
</style>