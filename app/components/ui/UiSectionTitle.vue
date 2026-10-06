<script setup lang="ts">
withDefaults(defineProps<{ centered?: boolean }>(), { centered: false })
</script>

<template>
  <h2 class="text-[22px] leading-tight font-medium text-ink" :class="{ 'text-center': centered }">
    <slot />
  </h2>
</template>
