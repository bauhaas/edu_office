<script setup lang="ts">
defineProps<{ emoji: string }>()
</script>

<template>
  <div class="flex flex-col">
    <span class="mb-2 text-xl leading-none" aria-hidden="true">{{ emoji }}</span>
    <dt class="order-2 text-[15px] leading-snug text-ink-muted">
      <slot />
    </dt>
    <dd class="order-1 text-[17px] leading-tight font-semibold text-ink">
      <slot name="value" />
    </dd>
  </div>
</template>
