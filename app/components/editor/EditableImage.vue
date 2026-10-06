<script setup lang="ts">
import type { Asset } from '#shared/types/job'

defineOptions({ inheritAttrs: false })

const props = defineProps<{ label: string }>()
const asset = defineModel<Asset>({ required: true })
const isEditing = useEditMode()
const error = ref<string | null>(null)
const isLoading = ref(false)

async function onFileChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  isLoading.value = true
  error.value = null
  try {
    asset.value = await fileToAsset(file, asset.value.alt || props.label)
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Image invalide.'
  } finally {
    isLoading.value = false
    input.value = ''
  }
}
</script>

<template>
  <img v-if="!isEditing" v-bind="$attrs" :src="asset.src" :alt="asset.alt" loading="lazy" draggable="false">
  <label v-else class="relative block cursor-pointer" v-bind="$attrs">
    <img :src="asset.src" :alt="asset.alt" class="size-full object-cover" draggable="false">
    <span
      class="absolute inset-0 grid place-items-center bg-ink/45 text-white opacity-90 transition-opacity hover:opacity-100"
      :title="error ?? `Changer ${label}`"
    >
      <Icon :name="isLoading ? 'lucide:loader-circle' : 'lucide:image-up'" class="size-6" :class="{ 'animate-spin': isLoading }" />
    </span>
    <input type="file" accept="image/*" class="sr-only" :aria-label="`Changer ${label}`" @change="onFileChange">
  </label>
</template>
