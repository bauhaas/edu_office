<script setup lang="ts">
defineProps<{ open: boolean }>()
</script>

<template>
  <div
    class="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
    :class="open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
    :inert="!open"
  >
    <div class="overflow-hidden">
      <slot />
    </div>
  </div>
</template>
