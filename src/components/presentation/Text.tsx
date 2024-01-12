import { createMemo, JSX } from 'solid-js'
import { css, theme } from 'style/theme'
import { PComp } from 'types/utils'

interface TextProps {
  element?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  format?: 'truncate' | 'preserve' | 'nowrap' | 'default'
  align?: 'start' | 'center' | 'end'
  weight?: keyof typeof theme['font']['weight']
  size?: keyof typeof theme['font']['size']
  color?: string
}

const appendChildren = (element: HTMLElement, children: JSX.Element) => {
  if (children === undefined || children === null) return

  if (typeof children === 'string' || typeof children === 'number' || typeof children === 'boolean') {
    element.innerText += String(children)
    return
  }

  if (Array.isArray(children)) {
    children.forEach(child => appendChildren(element, child))
    return
  }

  if (typeof children === 'function') {
    appendChildren(element, children())
    return
  }

  element.appendChild(children)
}

export const Text: PComp<TextProps & JSX.HTMLAttributes<HTMLElement>> = p => {
  const component = createMemo(() => {
    const el = document.createElement(p.element ?? 'div')
    el.className = css(
      {
        boxSizing: 'border-box',
        position: 'relative',
        textAlign: p.align,
        fontSize: theme.font.size[p.size ?? 'md'],
        fontWeight: theme.font.weight[p.weight ?? 'normal'],
        ...(!!p.color && { color: p.color }),
        ...(p.format === 'truncate'
          ? {
              /* Add aria-label with full text, and wrap truncated text with aria-ignore */
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1,
            }
          : p.format === 'preserve'
          ? { whiteSpace: 'pre-wrap', wordWrap: 'break-word', overflowWrap: 'break-word' }
          : p.format === 'nowrap'
          ? { whiteSpace: 'nowrap' }
          : undefined),
      },
      p.class
    )

    appendChildren(el, p.children)

    return el
  })

  return component
}
