<script setup lang="ts">
import Header from '~/components/header.vue'
import BottomNav from '~/components/BottomNav.vue'
</script>

<template>
    <div class="marketplace-app">
        <Header />
        <main class="marketplace-main">
            <div class="marketplace-container">
                <slot />
            </div>
        </main>
        <BottomNav />
    </div>
</template>

<style scoped>
.marketplace-app { 
    min-height: 100vh; 
    min-height: 100dvh; 
    width: 100%; 
    background: linear-gradient(135deg, #f5f7ff 0%, #f0f0f5 100%);
    color: #242424; 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}
.marketplace-main { 
    flex: 1; 
    padding-bottom: calc(85px + env(safe-area-inset-bottom, 0px)); 
    padding-top: 24px; 
}
.marketplace-container { 
    max-width: 1200px; 
    margin: 0 auto; 
    padding: 0 16px; 
}
</style>
