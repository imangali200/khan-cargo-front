<template>
    <div class="user-app">
        <Header />
        <main class="user-main">
            <div class="user-container">
                <slot />
            </div>
        </main>
        <BottomNav />
    </div>
</template>

<script setup lang="ts">
import Header from '~/components/header.vue'
import BottomNav from '~/components/BottomNav.vue'
</script>

<style scoped>
.user-app {
    min-height: 100vh;
    min-height: 100dvh;
    width: 100%;
    background-color: #0d1117;
    color: #e6edf3;
    font-family: 'Inter', -apple-system, sans-serif;
}

.user-main {
    flex: 1;
    padding-bottom: calc(85px + env(safe-area-inset-bottom, 0px));
}

.user-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
}
</style>
