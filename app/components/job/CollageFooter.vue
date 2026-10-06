<script setup lang="ts">
interface CollagePiece {
  src: string
  className: string
  rotate: number
}

// Static decoration: the original collage assets were not provided, so it is rebuilt from the available stickers.
const PIECES: readonly CollagePiece[] = [
  { src: '/images/sticker-oui-chef.png', className: '-left-6 top-0 w-28', rotate: -12 },
  { src: '/images/sticker-boarding-pass.png', className: 'left-14 top-16 w-24', rotate: -8 },
  { src: '/images/sticker-bell.png', className: 'right-2 top-2 w-16', rotate: 6 },
  { src: '/images/sticker-key.png', className: '-right-4 top-16 w-28', rotate: -18 },
  { src: '/images/sticker-stamp.png', className: 'left-1/2 top-24 w-24 -translate-x-1/2', rotate: 10 },
  { src: '/images/sticker-fork.png', className: 'left-2 bottom-0 w-24', rotate: 28 }
]

const root = useTemplateRef('root')
const { isRevealed } = useReveal(root, 0.2)
</script>

<template>
  <div ref="root" class="relative h-64 overflow-hidden" aria-hidden="true">
    <img
      v-for="(piece, index) in PIECES"
      :key="piece.src"
      :src="piece.src"
      alt=""
      draggable="false"
      class="absolute drop-shadow-lg transition-[translate,opacity] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      :class="[piece.className, isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0']"
      :style="{ rotate: `${piece.rotate}deg`, transitionDelay: `${index * 90}ms` }"
    >
  </div>
</template>
