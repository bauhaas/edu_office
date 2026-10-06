<script setup lang="ts">
import type { Subjob } from '#shared/types/job'

const props = defineProps<{ subjob: Subjob; tilt: number; revealed: boolean }>()
const emit = defineEmits<{ update: [subjob: Subjob] }>()

const patch = (changes: Partial<Omit<Subjob, 'id'>>): void => emit('update', { ...props.subjob, ...changes })
</script>

<template>
  <article class="group flex flex-col items-center gap-4">
    <div class="relative aspect-square w-full rounded-card bg-surface-muted">
      <div
        class="absolute top-1/2 left-1/2 aspect-3/4 w-[60%] -translate-1/2 overflow-hidden rounded-lg bg-line shadow-photo transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.04]"
        :style="{ rotate: `${revealed ? tilt : 0}deg` }"
      >
        <EditorEditableImage
          :model-value="subjob.cover"
          :label="`la photo ${subjob.label}`"
          class="size-full object-cover"
          @update:model-value="patch({ cover: $event })"
        />
      </div>
      <img
        v-for="(sticker, index) in subjob.stickers"
        :key="sticker.id"
        :src="sticker.asset.src"
        :alt="sticker.asset.alt"
        draggable="false"
        class="pointer-events-none absolute -translate-1/2 drop-shadow-md transition-[scale,opacity] duration-500"
        :class="revealed ? 'animate-float scale-100 opacity-100' : 'scale-50 opacity-0'"
        :style="{
          left: `${sticker.x}%`,
          top: `${sticker.y}%`,
          width: `${sticker.width}%`,
          '--sticker-rotate': `${sticker.rotate}deg`,
          rotate: `${sticker.rotate}deg`,
          animationDelay: `${index * 0.6}s`,
          transitionDelay: `${200 + index * 120}ms`
        }"
      >
    </div>
    <h3 class="text-center text-[15px] leading-snug font-semibold text-balance">
      <EditorEditableText
        :model-value="subjob.label"
        label="Nom du métier"
        @update:model-value="patch({ label: $event })"
      />
    </h3>
  </article>
</template>
