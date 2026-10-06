<script setup lang="ts">
import type { ProCon, ProConKind, SectionOf } from '#shared/types/job'
import type { SegmentOption } from '~/components/ui/UiSegmented.vue'

type Section = SectionOf<'prosCons'>

const props = defineProps<{ section: Section }>()
const emit = defineEmits<{ update: [section: Section] }>()

const update = (next: Section): void => emit('update', next)
const patch = useSectionPatch(() => props.section, update)
const { updateItem, removeItem, moveItem, addItem } = useListSection(
  () => props.section,
  update,
  (a, b) => a.kind === b.kind
)

const TABS: readonly SegmentOption<ProConKind>[] = [
  { value: 'pro', label: 'Les plus', emoji: '💖' },
  { value: 'con', label: 'Les moins', emoji: '☠️' }
]
const CARD_TILTS = [-2.5, 1.5, -1.5, 2] as const

const activeKind = ref<ProConKind>('pro')
const visibleItems = computed(() => props.section.items.filter((item) => item.kind === activeKind.value))
const tiltAt = (index: number): number => CARD_TILTS[index % CARD_TILTS.length] ?? 0
const patchItem = (item: ProCon, changes: Partial<Omit<ProCon, 'id' | 'kind'>>): void => updateItem({ ...item, ...changes })
</script>

<template>
  <div class="space-y-5">
    <UiSectionTitle>
      <EditorEditableText :model-value="section.title" label="Titre" @update:model-value="patch({ title: $event })" />
    </UiSectionTitle>

    <UiSegmented v-model="activeKind" :options="TABS" label="Points forts et points faibles" />

    <Transition mode="out-in" name="cards">
      <ul :key="activeKind" class="space-y-4 px-1 pt-2" role="tabpanel">
        <li
          v-for="(item, index) in visibleItems"
          :key="item.id"
          class="card relative rounded-[1.25rem] bg-surface px-5 py-5 shadow-card ring-1 ring-black/5"
          :style="{ '--tilt': `${tiltAt(index)}deg`, '--delay': `${index * 90}ms` }"
        >
          <EditorItemControls
            :label="item.title"
            :can-move-up="index > 0"
            :can-move-down="index < visibleItems.length - 1"
            @move="moveItem(item.id, $event)"
            @remove="removeItem(item.id)"
          />
          <h3 class="mb-2 text-[17px] leading-snug font-semibold">
            <EditorEditableText :model-value="item.title" label="Titre" @update:model-value="patchItem(item, { title: $event })" />
          </h3>
          <p class="text-[15px] leading-relaxed text-ink-muted">
            <EditorEditableText :model-value="item.body" label="Texte" multiline @update:model-value="patchItem(item, { body: $event })" />
          </p>
        </li>
      </ul>
    </Transition>

    <EditorAddItemButton @add="addItem(createProCon(activeKind))">
      Ajouter {{ activeKind === 'pro' ? 'un point fort' : 'un point faible' }}
    </EditorAddItemButton>
  </div>
</template>

<style scoped>
.card {
  rotate: var(--tilt);
  transition: rotate 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), translate 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease;
  transition-delay: var(--delay);
}

.cards-enter-from .card {
  opacity: 0;
  rotate: calc(var(--tilt) * -3);
  translate: 0 16px;
}

.cards-leave-to .card {
  opacity: 0;
  rotate: calc(var(--tilt) * 3);
  translate: 0 -8px;
  transition-delay: 0ms;
}

.cards-enter-active,
.cards-leave-active {
  transition: opacity 0.4s ease;
}

.cards-enter-from,
.cards-leave-to {
  opacity: 0;
}
</style>
