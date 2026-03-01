<template>
    <div class="profile-app">
        <main class="profile-main">
            <slot />
        </main>
        <BottomNav />
    </div>
</template>

<script setup lang="ts">
import BottomNav from '~/components/BottomNav.vue'
</script>

<style scoped>
.profile-app {
    min-height: 100vh;
    min-height: 100dvh;
    width: 100%;
    background-color: #000000;
    color: #ffffff;
    font-family: 'Golos Text', 'Inter', -apple-system, sans-serif;
}

.profile-main {
    flex: 1;
    padding-bottom: calc(85px + env(safe-area-inset-bottom, 0px));
}
</style>
