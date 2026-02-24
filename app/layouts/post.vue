<script setup lang="ts">
</script>

<template>
  <div class="post-layout">
    <slot />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.post-layout {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  width: 100%;
  background: #000;
}
</style>