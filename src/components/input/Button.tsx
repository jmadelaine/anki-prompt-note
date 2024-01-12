import { removeProps } from 'helpers/solid'
import { JSX } from 'solid-js'
import { css } from 'style/theme'
import { PComp } from 'types/utils'

const validButtonTypes = ['button', 'reset', 'submit'] as const

/** A CSS reset button used as a base to create different buttons */
export const Button: PComp<
  {
    type?: typeof validButtonTypes[number]
    disabled?: boolean
  } & Pick<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onMouseDown' | 'onMouseUp' | 'style'>
> = p => {
  const props = removeProps(p, ['class', 'type'])

  return (
    <button
      class={css(
        {
          appearance: 'none',
          background: 0,
          border: 0,
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: 1,
          outline: 0,
          overflow: 'hidden',
          padding: 0,
          pointerEvents: 'auto',
          position: 'relative',
          textOverflow: 'ellipsis',
          userSelect: 'none',
          verticalAlign: 'middle',
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none',
          whiteSpace: 'nowrap',
          color: 'inherit',
          '&:disabled': { cursor: 'not-allowed', opacity: 0.33 },
        },
        p.class
      )}
      type={p.type ?? 'button'}
      {...props}
    />
  )
}
