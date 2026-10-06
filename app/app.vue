<script setup lang="ts">
const title = ref<string>('edu_office')
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800">
    <NuxtRouteAnnouncer />
    <div class="flex items-center gap-3 rounded-xl bg-white p-6 shadow">
      <Icon name="lucide:graduation-cap" class="size-8 text-indigo-600" />
      <h1 class="text-2xl font-semibold">{{ title }}</h1>
    </div>
  </div>
</template>
