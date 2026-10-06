<script setup lang="ts">
type Enter = 'rise' | 'left' | 'right' | 'top' | 'pop' | 'stamp'

/** Collage piece kept in the hero. x in % of width; y, w and drop in cqw (`'ground'` = bottom edge tucked under the card); `at` in seconds. */
interface Piece { id: string; src: string; x: number; y: number | 'ground'; w: number; r?: number; enter: Enter; at: number; drop?: number; sway?: boolean; burst?: boolean }

/** Intro-only element sweeping across the screen; [x, y, rotate] offsets in cqw/deg relative to (x, y). */
interface Flyer { id: string; src: string; x: number; y: number; w: number; at: number; duration: number; from: [number, number, number]; to: [number, number, number] }

defineProps<{ title: string; tagline: string }>()

// Choreography transcribed from test-anim-pe/landing.mp4 (seconds).
const TITLE_AT = 2.05
const TITLE_STEP = 0.25
const PILL_AT = 2.5
const CARD_AT = 2.3
const INTRO_END = 3.4

/** Array order = stacking order. `drop` = how much lower the piece sits until the card pushes the scene up. */
const PIECES: readonly Piece[] = [
  { id: 'grass', src: '/images/collage-grass.png', x: 50, y: 150, w: 120, enter: 'rise', at: 0.4, drop: 40 },
  { id: 'palm-back', src: '/images/collage-palm.png', x: 52, y: 116, w: 24, enter: 'rise', at: 0.75, drop: 35 },
  { id: 'palm-large', src: '/images/collage-palm.png', x: 20, y: 106, w: 36, enter: 'rise', at: 0.5, drop: 30 },
  { id: 'palm-small', src: '/images/collage-palm.png', x: 3, y: 122, w: 26, enter: 'rise', at: 0.65, drop: 35 },
  { id: 'fork', src: '/images/sticker-fork.png', x: 13, y: 72, w: 26, r: 25, enter: 'left', at: 1.25 },
  { id: 'stamp', src: '/images/sticker-stamp.png', x: 28, y: 87, w: 16, r: -8, enter: 'stamp', at: 1.5, burst: true },
  { id: 'michelin', src: '/images/collage-michelin.png', x: 45, y: 98, w: 5, enter: 'pop', at: 1.8, sway: true },
  { id: 'key', src: '/images/sticker-key.png', x: 99, y: 62, w: 22, r: -25, enter: 'top', at: 1.3 },
  { id: 'boarding-pass', src: '/images/sticker-boarding-pass.png', x: 98, y: 34, w: 14, r: 60, enter: 'right', at: 2, burst: true },
  { id: 'bell', src: '/images/sticker-bell.png', x: 100, y: 90, w: 18, r: -10, enter: 'right', at: 2.1 },
  { id: 'oui-chef', src: '/images/sticker-oui-chef.png', x: 14, y: 108, w: 28, r: 14, enter: 'left', at: 1.55, drop: 20, burst: true },
  { id: 'plane-window', src: '/images/collage-plane-window.png', x: 57, y: 'ground', w: 23, enter: 'rise', at: 1.25, drop: 40 },
  { id: 'hand-plate', src: '/images/collage-hand-plate.png', x: 75, y: 100, w: 30, enter: 'right', at: 2.6 },
  { id: 'tanya', src: '/images/collage-tanya.png', x: 94, y: 'ground', w: 36, enter: 'rise', at: 1.55, drop: 40 },
  { id: 'chef', src: '/images/collage-chef-glasses.png', x: 36, y: 'ground', w: 30, enter: 'rise', at: 2.5 },
  { id: 'ratatouille', src: '/images/collage-ratatouille.png', x: 71, y: 130, w: 20, enter: 'pop', at: 2.8 }
]

const FLYERS: readonly Flyer[] = [
  { id: 'stamp-peek', src: '/images/sticker-stamp.png', x: 4, y: 54, w: 13, at: 0.2, duration: 1.4, from: [-12, 0, -25], to: [0, -2, -10] },
  { id: 'stamp-big', src: '/images/sticker-stamp.png', x: 70, y: 96, w: 34, at: 0.35, duration: 1.1, from: [70, 10, 40], to: [-150, -25, -60] },
  { id: 'pass-a', src: '/images/sticker-boarding-pass.png', x: 70, y: 70, w: 20, at: 0.5, duration: 1.1, from: [70, 15, 20], to: [-150, -35, -40] },
  { id: 'pass-b', src: '/images/sticker-boarding-pass.png', x: 70, y: 120, w: 22, at: 0.65, duration: 1.1, from: [70, 5, 30], to: [-160, -45, -20] },
  { id: 'stamp-small', src: '/images/sticker-stamp.png', x: 85, y: 55, w: 16, at: 0.8, duration: 1.2, from: [40, -20, 20], to: [-140, 10, -30] },
  { id: 'stamp-corner', src: '/images/sticker-stamp.png', x: 88, y: 24, w: 14, at: 1, duration: 1.3, from: [25, -10, 15], to: [-20, 15, -5] }
]

// Cycled one at a time above the silver plate; keep in sync with the plate-pop keyframes (1 / length window).
const PLATE_ITEMS = [
  { src: '/images/sticker-bell.png', w: 11 },
  { src: '/images/collage-michelin.png', w: 5 },
  { src: '/images/sticker-key.png', w: 9 },
  { src: '/images/sticker-boarding-pass.png', w: 7 }
] as const
const PLATE_STEP = 1.6
const BURST_COPIES = 7
const BURST_STEP = 0.07

// Deterministic scatter (SSR-safe): copies spread around the piece like a burst-shot stack.
const burstCopy = (piece: Piece, i: number) => {
  const angle = (i / BURST_COPIES) * 2 * Math.PI + (i % 2 ? 0.4 : -0.2)
  const dist = piece.w * (0.35 + (i % 3) * 0.12)
  return {
    '--bx': `${Math.cos(angle) * dist}cqw`,
    '--by': `${Math.sin(angle) * dist}cqw`,
    rotate: `${(piece.r ?? 0) + (i % 2 ? 1 : -1) * (8 + i * 3)}deg`,
    animationDelay: `${piece.at + i * BURST_STEP}s`
  }
}

const titleLines = (title: string): string[] => title.split(/\s*[,&]\s*/).filter(Boolean)

// The card overlaps the header by 2rem, so bottom: 0 hides the cut-off edge behind it.
const box = (x: number, y: number | 'ground', w: number) => ({
  left: `${x}%`,
  width: `${w}cqw`,
  ...(y === 'ground' ? { bottom: 0 } : { top: `${y}cqw` })
})

const flyerStyle = (f: Flyer) => ({
  ...box(f.x, f.y, f.w),
  animationDelay: `${f.at}s`,
  animationDuration: `${f.duration}s`,
  '--fx': `${f.from[0]}cqw`,
  '--fy': `${f.from[1]}cqw`,
  '--fr': `${f.from[2]}deg`,
  '--tx': `${f.to[0]}cqw`,
  '--ty': `${f.to[1]}cqw`,
  '--tr': `${f.to[2]}deg`
})

// Scroll is locked from the server render until the intro is over.
const reducedMotion = usePreferredReducedMotion()
const isLocked = ref(true)
useHead({ htmlAttrs: { class: computed(() => (isLocked.value ? 'overflow-hidden' : '')) } })

onMounted(() => {
  window.scrollTo(0, 0)
  if (reducedMotion.value === 'reduce') isLocked.value = false
  else setTimeout(() => (isLocked.value = false), INTRO_END * 1000)
})
onBeforeUnmount(() => (isLocked.value = false))

// Once the intro title has been scrolled away, the card heading becomes the classic title (one-way).
const introTitle = useTemplateRef('introTitle')
const showTitle = ref(false)
const { stop } = useIntersectionObserver(introTitle, ([entry]) => {
  if (isLocked.value || entry?.isIntersecting !== false) return
  showTitle.value = true
  stop()
})

// The faded scene is removed once off-screen; scroll is compensated so the card doesn't move.
const header = useTemplateRef('header')
const card = useTemplateRef('card')
const isHeaderVisible = ref(true)
const isCollapsed = ref(false)
useIntersectionObserver(header, ([entry]) => (isHeaderVisible.value = entry?.isIntersecting ?? true))

watch([showTitle, isHeaderVisible], async ([faded, visible]) => {
  if (!faded || visible || isCollapsed.value || !card.value) return
  const before = card.value.getBoundingClientRect().top
  isCollapsed.value = true
  await nextTick()
  window.scrollBy(0, card.value.getBoundingClientRect().top - before)
})
</script>

<template>
  <div class="@container">
    <div class="relative" :style="{ '--card-at': `${CARD_AT}s` }">
      <template v-if="!isCollapsed">
        <div class="intro-bg scene absolute inset-x-0 top-0 h-[max(100svh,165cqw)]" :class="{ 'is-out': showTitle }" aria-hidden="true" />

        <header ref="header" class="scene relative h-[156cqw]" :class="{ 'is-out': showTitle }">
        <div
          v-for="piece in PIECES"
          :key="piece.id"
          class="pointer-events-none absolute"
          :class="piece.y === 'ground' ? '-translate-x-1/2' : '-translate-1/2'"
          :style="box(piece.x, piece.y, piece.w)"
          aria-hidden="true"
        >
          <div
            class="relative"
            :class="{ 'intro-settle': piece.drop, 'sway': piece.sway }"
            :style="{ '--drop': `${piece.drop ?? 0}cqw`, '--sway-at': `${piece.at + 0.5}s` }"
          >
            <template v-if="piece.burst">
              <img
                v-for="i in BURST_COPIES"
                :key="i"
                :src="piece.src"
                alt=""
                draggable="false"
                class="burst-copy"
                :style="burstCopy(piece, i - 1)"
              >
            </template>
            <img
              :src="piece.src"
              alt=""
              draggable="false"
              class="intro-anim relative w-full"
              :class="`enter-${piece.enter}`"
              :style="{ rotate: `${piece.r ?? 0}deg`, animationDelay: `${piece.at}s` }"
            >
            <div v-if="piece.id === 'hand-plate'" class="plate">
              <img
                v-for="(item, index) in PLATE_ITEMS"
                :key="item.src"
                :src="item.src"
                alt=""
                draggable="false"
                class="plate-item"
                :style="{
                  width: `${item.w}cqw`,
                  animationDuration: `${PLATE_STEP * PLATE_ITEMS.length}s`,
                  animationDelay: `${INTRO_END + index * PLATE_STEP}s`
                }"
              >
            </div>
          </div>
        </div>

        <img
          v-for="flyer in FLYERS"
          :key="flyer.id"
          :src="flyer.src"
          alt=""
          aria-hidden="true"
          draggable="false"
          class="intro-anim intro-flyer pointer-events-none absolute -translate-1/2"
          :style="flyerStyle(flyer)"
        >

        <div class="absolute inset-x-0 top-[33cqw] flex flex-col items-center px-6 text-center">
          <span
            class="intro-anim intro-fade rounded-full border border-ink/15 px-[3cqw] py-[0.8cqw] text-[3.4cqw] text-ink-muted"
            :style="{ animationDelay: `${PILL_AT}s` }"
          >Filière</span>
          <h1 ref="introTitle" class="mt-[4cqw] text-[10cqw] leading-[1.15] font-medium tracking-tight">
            <span class="sr-only">{{ title }}</span>
            <span
              v-for="(line, index) in titleLines(title)"
              :key="line"
              aria-hidden="true"
              class="intro-anim intro-line block"
              :style="{ animationDelay: `${TITLE_AT + index * TITLE_STEP}s` }"
            >{{ line }}</span>
          </h1>
        </div>
        </header>
      </template>

      <div ref="card" class="intro-card relative z-10 rounded-t-[2rem] bg-surface" :class="{ '-mt-8': !isCollapsed }">
        <div class="space-y-4 px-6 pt-10 pb-4 text-center">
          <!-- Both headings share one grid cell so the swap never changes the card height. -->
          <div class="grid place-items-center">
            <p
              class="swap col-start-1 row-start-1 text-xs font-medium tracking-wide text-ink-muted uppercase"
              :class="{ 'is-out': showTitle }"
              :aria-hidden="showTitle"
            >En deux mots, c’est…</p>
            <!-- Becomes the page heading once the intro (and its sr-only h1) is gone. -->
            <component
              :is="isCollapsed ? 'h1' : 'p'"
              class="swap col-start-1 row-start-1 mx-auto max-w-[14ch] text-[28px] leading-[1.2] font-semibold text-balance"
              :class="{ 'is-out': !showTitle }"
              :aria-hidden="!isCollapsed"
            >{{ title }}</component>
          </div>
          <p class="mx-auto max-w-[30ch] text-[17px] leading-snug text-ink-muted text-balance">{{ tagline }}</p>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.intro-bg {
  background:
    radial-gradient(55% 30% at 0% 38%, rgb(250 200 178 / 0.85) 0%, transparent 70%),
    radial-gradient(60% 35% at 100% 62%, rgb(240 172 220 / 0.85) 0%, transparent 70%),
    radial-gradient(70% 25% at 0% 100%, rgb(190 210 245 / 0.95) 0%, transparent 70%),
    linear-gradient(180deg, #f6f1ee 0%, #f5e9ea 40%, #ecd6ef 100%);
}

.intro-anim {
  animation-duration: 0.8s;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  animation-fill-mode: backwards;
}

/* Card and "ground" pieces move up together, as if the card pushed the scene. */
.intro-card,
.intro-settle {
  animation: 0.65s cubic-bezier(0.22, 1, 0.36, 1) var(--card-at) backwards;
}

.intro-card {
  animation-name: card-in;
}

.intro-settle {
  animation-name: settle;
}

.scene {
  transition: opacity 0.6s ease;
}

.scene.is-out {
  opacity: 0;
}

.swap {
  transition: opacity 0.6s ease, translate 0.6s cubic-bezier(0.22, 1, 0.36, 1), filter 0.6s ease;
}

.swap.is-out {
  opacity: 0;
  translate: 0 0.4em;
  filter: blur(6px);
}

.intro-fade { animation-name: fade-in; }
.intro-line { animation-name: line-in; animation-duration: 0.6s; }
.enter-rise { animation-name: enter-rise; animation-timing-function: cubic-bezier(0.34, 1.2, 0.64, 1); }
.enter-left { animation-name: enter-left; }
.enter-right { animation-name: enter-right; }
.enter-top { animation-name: enter-top; }
.enter-pop { animation-name: enter-pop; animation-duration: 0.5s; animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
.enter-stamp { animation-name: enter-stamp; animation-duration: 0.45s; }

.sway {
  animation: sway 2.4s ease-in-out var(--sway-at) infinite alternate;
}

.burst-copy {
  position: absolute;
  inset: 0;
  width: 100%;
  opacity: 0;
  animation: burst 1s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Bottom edge sits on the plate surface; only that edge clips so items emerge from the plate. */
.plate {
  position: absolute;
  left: 50%;
  top: 9%;
  width: 60%;
  aspect-ratio: 1;
  translate: -50% -100%;
  clip-path: inset(-100% -100% 0 -100%);
}

.plate-item {
  position: absolute;
  bottom: 0;
  left: 50%;
  translate: -50% 0;
  opacity: 0;
  animation-name: plate-pop;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-fill-mode: backwards;
}

.intro-flyer {
  opacity: 0;
  animation-name: fly;
  animation-timing-function: cubic-bezier(0.45, 0.05, 0.55, 0.95);
}

@keyframes card-in {
  from { transform: translateY(max(100svh - 156cqw + 2rem, 4rem)); }
}

@keyframes settle {
  from { transform: translateY(var(--drop)); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(2cqw); }
}

@keyframes line-in {
  from { opacity: 0; transform: translateY(0.5em); filter: blur(6px); }
}

@keyframes enter-rise {
  from { opacity: 0; transform: translateY(70cqw); }
  30% { opacity: 1; }
}

@keyframes enter-left {
  from { opacity: 0; transform: translateX(-90cqw) rotate(-35deg); }
  30% { opacity: 1; }
}

@keyframes enter-right {
  from { opacity: 0; transform: translateX(90cqw) rotate(35deg); }
  30% { opacity: 1; }
}

@keyframes enter-top {
  from { opacity: 0; transform: translateY(-90cqw) rotate(-30deg); }
  30% { opacity: 1; }
}

@keyframes enter-pop {
  from { opacity: 0; transform: scale(0); }
}

@keyframes enter-stamp {
  from { opacity: 0; transform: scale(2.2); }
  60% { opacity: 1; transform: scale(0.92); }
}

@keyframes burst {
  from { opacity: 0; transform: translate(var(--bx), var(--by)) scale(1.5); }
  12% { opacity: 1; transform: translate(var(--bx), var(--by)) scale(1); }
  60% { opacity: 1; transform: translate(var(--bx), var(--by)) scale(1); }
  to { opacity: 0; transform: translate(0, 0) scale(0.6); }
}

/* Each item owns a 25% window (4 items). */
@keyframes plate-pop {
  0% { opacity: 0; transform: translateY(100%); }
  6% { opacity: 1; transform: translateY(-10%); }
  18% { opacity: 1; transform: translateY(-18%); }
  25%, 100% { opacity: 0; transform: translateY(-35%); }
}

@keyframes sway {
  from { rotate: -14deg; }
  to { rotate: 14deg; }
}

@keyframes fly {
  0% { opacity: 0; transform: translate(var(--fx), var(--fy)) rotate(var(--fr)); }
  8%, 85% { opacity: 1; }
  100% { opacity: 0; transform: translate(var(--tx), var(--ty)) rotate(var(--tr)); }
}

@media (prefers-reduced-motion: reduce) {
  .intro-anim,
  .intro-card,
  .intro-settle,
  .sway,
  .burst-copy,
  .plate-item {
    animation: none;
  }
}
</style>
