<script setup lang="ts">
withDefaults(defineProps<{ centered?: boolean; strong?: boolean }>(), { centered: false, strong: false })
</script>

<template>
  <h2
    class="text-[22px] leading-tight text-ink"
    :class="[strong ? 'font-semibold' : 'font-medium', { 'text-center': centered }]"
  >
    <slot />
  </h2>
</template>
