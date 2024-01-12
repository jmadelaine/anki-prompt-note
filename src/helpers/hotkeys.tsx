// Fire if we have a current element but it's unfocussable
// (when nothing is focussed, document.body is focussed by default).
const shouldFireHotkey = (target: EventTarget | null) => {
  // Don't hotkey on contenteditable text inputs
  if (target instanceof HTMLDivElement && target.getAttribute('contenteditable') === 'true') return false
  return target instanceof HTMLElement && target.tabIndex === -1
}

type KeyHandler = ({ shift, alt }: { shift: boolean; alt: boolean }) => void

export const useHotkeys = (keys: Record<string, KeyHandler | { down?: KeyHandler; up?: KeyHandler }>) => {
  window.addEventListener('keydown', ({ key, target, metaKey, shiftKey: shift, altKey: alt }: KeyboardEvent) => {
    const hotkey = keys[key]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (metaKey || !hotkey || !shouldFireHotkey(target)) return
    if (typeof hotkey === 'function') hotkey({ shift, alt })
    else if (hotkey.down) hotkey.down({ shift, alt })
  })

  window.addEventListener('keyup', ({ key, target, shiftKey: shift, altKey: alt, metaKey }: KeyboardEvent) => {
    const hotkey = keys[key]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (metaKey || !hotkey || !shouldFireHotkey(target)) return
    if (typeof hotkey !== 'function' && hotkey.up) hotkey.up({ shift, alt })
  })
}
