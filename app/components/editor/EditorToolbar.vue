<script setup lang="ts">
defineProps<{
  isEditing: boolean
  isDirty: boolean
  isSaving: boolean
  error: string | null
  validationErrors: readonly string[]
  publicPath: string
}>()
defineEmits<{ start: []; cancel: []; save: [] }>()
</script>

<template>
  <div class="sticky top-0 z-50 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur">
    <div class="flex items-center gap-2">
      <NuxtLink :to="publicPath" class="control-btn size-9 text-ink hover:bg-surface-muted" aria-label="Voir la page publique">
        <Icon name="lucide:eye" class="size-5" />
      </NuxtLink>
      <p class="flex-1 truncate text-sm font-medium">
        <template v-if="!isEditing">Éditeur</template>
        <template v-else-if="isDirty">
          <span class="mr-1.5 inline-block size-2 rounded-full bg-amber-500" aria-hidden="true" />Modifications non enregistrées
        </template>
        <template v-else>Mode édition</template>
      </p>

      <button v-if="!isEditing" type="button" class="toolbar-btn bg-ink text-white" @click="$emit('start')">
        <Icon name="lucide:pencil" /> Modifier
      </button>
      <template v-else>
        <button type="button" class="toolbar-btn bg-surface-muted" :disabled="isSaving" @click="$emit('cancel')">Annuler</button>
        <button type="button" class="toolbar-btn bg-ink text-white" :disabled="!isDirty || isSaving || validationErrors.length > 0" @click="$emit('save')">
          <Icon :name="isSaving ? 'lucide:loader-circle' : 'lucide:check'" :class="{ 'animate-spin': isSaving }" />
          Enregistrer
        </button>
      </template>
    </div>
    <ul v-if="isEditing && validationErrors.length > 0" role="alert" class="mt-2 list-inside list-disc rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
      <li v-for="message in validationErrors" :key="message">{{ message }}</li>
    </ul>
    <p v-if="error" role="alert" class="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.toolbar-btn {
  @apply inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-40;
}
</style>
