<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
</script>

<template>
  <main class="mx-auto flex min-h-dvh max-w-[430px] flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
    <p class="text-5xl font-semibold">{{ error.statusCode }}</p>
    <p class="text-ink-muted">{{ error.message || 'Une erreur est survenue.' }}</p>
    <button type="button" class="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white" @click="clearError({ redirect: '/' })">
      Retour à l’accueil
    </button>
  </main>
</template>
