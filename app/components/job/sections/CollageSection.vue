<script setup lang="ts">
import type { CollagePiece, SectionOf, Secret } from '#shared/types/job'

type Section = SectionOf<'collage'>

const props = defineProps<{ section: Section }>()
const emit = defineEmits<{ update: [section: Section] }>()

const { updateItem } = useListSection(() => props.section, (next) => emit('update', next))
const isEditing = useEditMode()

const openId = ref<string | null>(null)
const openPiece = computed(() => props.section.items.find((piece) => piece.id === openId.value) ?? null)

const isInteractive = (piece: CollagePiece): boolean => isEditing.value || piece.secret !== null

function open(piece: CollagePiece): void {
  if (!isInteractive(piece)) return
  if (!piece.secret) updateItem({ ...piece, secret: createSecret() })
  openId.value = piece.id
}

function updateSecret(piece: CollagePiece, secret: Secret | null): void {
  updateItem({ ...piece, secret })
  if (!secret) openId.value = null
}

const root = useTemplateRef('root')
const { isRevealed } = useReveal(root, 0.2)
</script>

<template>
  <!-- Ratio taken from the mockup (375×310); pieces bleed off the edges and are clipped. -->
  <div ref="root" class="relative -mt-8 aspect-[375/310] w-full overflow-hidden">
    <component
      :is="isInteractive(piece) ? 'button' : 'div'"
      v-for="(piece, index) in section.items"
      :key="piece.id"
      :type="isInteractive(piece) ? 'button' : undefined"
      :aria-label="isInteractive(piece) ? `Découvrir : ${piece.asset.alt || 'secret'}` : undefined"
      :aria-hidden="isInteractive(piece) ? undefined : true"
      class="piece absolute"
      :class="{ 'is-in': isRevealed, 'cursor-pointer': isInteractive(piece), 'pointer-events-none': !isInteractive(piece) }"
      :style="{
        left: `${piece.x}%`,
        top: `${piece.y}%`,
        width: `${piece.width}%`,
        rotate: `${piece.rotate}deg`,
        transitionDelay: `${index * 60}ms`
      }"
      @click="open(piece)"
    >
      <img :src="piece.asset.src" alt="" class="w-full" draggable="false">
      <span
        v-if="piece.secret?.showHint || isEditing"
        class="absolute top-[12%] left-[12%] grid size-5 place-items-center rounded-full text-[10px] text-white shadow-md"
        :class="piece.secret ? 'hint bg-ink/80' : 'bg-sky-600'"
        aria-hidden="true"
      >
        <Icon :name="piece.secret ? 'lucide:sparkles' : 'lucide:plus'" />
      </span>
    </component>

    <Teleport to="body">
      <Transition name="secret">
        <JobSecretOverlay
          v-if="openPiece?.secret"
          :asset="openPiece.asset"
          :secret="openPiece.secret"
          @close="openId = null"
          @update="updateSecret(openPiece, $event)"
          @remove="updateSecret(openPiece, null)"
        />
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.piece {
  opacity: 0;
  translate: -50% calc(-50% + 48px);
  transition: opacity 0.5s ease, translate 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), scale 0.3s ease;
}

.piece.is-in {
  opacity: 1;
  translate: -50% -50%;
}

button.piece:hover,
button.piece:focus-visible {
  scale: 1.05;
}

.hint {
  animation: hint-pulse 2.4s ease-in-out infinite;
}

@keyframes hint-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgb(28 27 31 / 0.35); }
  50% { box-shadow: 0 0 0 6px rgb(28 27 31 / 0); }
}

.secret-enter-active,
.secret-leave-active {
  transition: opacity 0.35s ease, backdrop-filter 0.35s ease;
}

.secret-enter-from,
.secret-leave-to {
  opacity: 0;
}
</style>
