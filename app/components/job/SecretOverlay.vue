<script setup lang="ts">
import type { Asset, Secret } from '#shared/types/job'

const props = defineProps<{ asset: Asset; secret: Secret }>()
const emit = defineEmits<{ close: []; update: [secret: Secret]; remove: [] }>()

const isEditing = useEditMode()
const closeButton = useTemplateRef('closeButton')
const isLocked = useScrollLock(document.body)

const patch = (changes: Partial<Secret>): void => emit('update', { ...props.secret, ...changes })

onKeyStroke('Escape', () => emit('close'))
onMounted(() => {
  isLocked.value = true
  closeButton.value?.focus()
})
onBeforeUnmount(() => {
  isLocked.value = false
})
</script>

<template>
  <div
    class="fixed inset-0 z-[100] flex justify-center bg-ink/30 backdrop-blur-2xl"
    role="dialog"
    aria-modal="true"
    :aria-label="secret.title || 'Secret'"
    @click.self="$emit('close')"
  >
    <div class="relative flex w-full max-w-[430px] flex-col items-center overflow-y-auto px-7 pt-28 pb-12 text-center text-white" @click.self="$emit('close')">
      <button
        ref="closeButton"
        type="button"
        class="absolute top-5 left-5 grid size-11 place-items-center rounded-full bg-white/80 text-ink shadow-card transition-transform active:scale-90"
        aria-label="Fermer"
        @click="$emit('close')"
      >
        <Icon name="lucide:x" class="size-5" />
      </button>

      <div class="secret-image relative mb-10 w-[52%]">
        <img :src="asset.src" :alt="asset.alt" class="secret-asset w-full" draggable="false">
      </div>

      <h2 class="secret-text mb-6 text-[32px] leading-tight font-semibold">
        <EditorEditableText :model-value="secret.title" label="Titre du secret" required @update:model-value="patch({ title: $event })" />
      </h2>
      <p v-if="isEditing || secret.body" class="secret-text text-[15px] leading-relaxed text-white/95" style="animation-delay: 120ms">
        <EditorEditableText :model-value="secret.body" label="Texte du secret" multiline @update:model-value="patch({ body: $event })" />
      </p>

      <label v-if="isEditing" class="mt-8 inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          class="size-4 accent-white"
          :checked="secret.showHint"
          @change="patch({ showHint: ($event.target as HTMLInputElement).checked })"
        >
        Afficher l’indicateur sur le personnage
      </label>

      <button
        v-if="isEditing"
        type="button"
        class="mt-4 inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-medium"
        @click="$emit('remove')"
      >
        <Icon name="lucide:trash-2" /> Supprimer le secret
      </button>
    </div>
  </div>
</template>

<style scoped>
.secret-image {
  animation: pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  perspective: 800px;
}

/* Stacked drop-shadows trace the image's alpha, so transparent SVG/PNG get a contour, not a box. */
.secret-asset {
  filter:
    drop-shadow(3px 0 0 white)
    drop-shadow(-3px 0 0 white)
    drop-shadow(0 3px 0 white)
    drop-shadow(0 -3px 0 white)
    drop-shadow(0 20px 25px rgb(0 0 0 / 0.25));
  animation: spin-y 4s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .secret-asset {
    animation: none;
  }
}

@keyframes spin-y {
  to { transform: rotateY(360deg); }
}

.secret-text {
  animation: var(--animate-reveal);
}

/* Editable fields on a dark blurred backdrop need dark text. */
.secret-text :deep(.editable-field) {
  color: var(--color-ink);
}

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.6) translateY(40px); }
  to { opacity: 1; transform: none; }
}
</style>
