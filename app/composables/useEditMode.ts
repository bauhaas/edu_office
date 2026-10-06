import type { InjectionKey, Ref } from 'vue'

const EDIT_MODE_KEY: InjectionKey<Readonly<Ref<boolean>>> = Symbol('edit-mode')

export function provideEditMode(enabled: Readonly<Ref<boolean>>): void {
  provide(EDIT_MODE_KEY, enabled)
}

/** `true` inside the editor while edit mode is on; `false` on the public page. */
export function useEditMode(): Readonly<Ref<boolean>> {
  return inject(EDIT_MODE_KEY, ref(false))
}
