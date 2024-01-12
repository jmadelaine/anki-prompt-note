import { removeProps } from 'helpers/solid'
import { ComponentProps, JSX } from 'solid-js'
import { css } from 'style/theme'
import { PComp } from 'types/utils'

const distributeOptions = {
  around: 'space-around',
  between: 'space-between',
  center: 'center',
  end: 'end',
  evenly: 'space-evenly',
  start: 'start',
} as const

const alignOptions = {
  center: 'center',
  end: 'end',
  start: 'start',
  stretch: 'stretch',
} as const

const directionOptions = {
  col: 'column',
  row: 'row',
} as const

type FlexProps = {
  align?: keyof typeof alignOptions
  direction?: keyof typeof directionOptions
  distribute?: keyof typeof distributeOptions
  gap?: string
}

type FlexChildProps = {
  alignSelf?: keyof typeof alignOptions
  basis?: number | string
  flex?: number | string
  grow?: number
  shrink?: number
}

type OtherStyleProps = {
  padding?: string
  position?: 'static' | 'relative' | 'absolute' | 'fixed'
  inset?: string
}

type AsButtonProps = { asButton?: boolean; disabled?: boolean }

type ScrollableProps = { scrollable?: boolean }

export const Block: PComp<
  FlexChildProps & OtherStyleProps & AsButtonProps & JSX.HTMLAttributes<HTMLDivElement>
> = p => (
  <div
    ref={p.ref}
    class={css(
      {
        boxSizing: 'border-box',
        position: p.position ?? 'relative',
        flex: p.flex,
        flexBasis: p.basis,
        flexGrow: p.grow,
        flexShrink: p.shrink,
        inset: p.inset,
        padding: p.padding,
        ...(!!p.alignSelf && { alignSelf: alignOptions[p.alignSelf] }),
        ...(p.asButton && {
          cursor: 'pointer',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none',
          '& > *:not(button):not(input):not(textarea):not([role=button])': {
            pointerEvents: 'none',
          },
        }),
      },
      p.class
    )}
    {...(p.asButton
      ? {
          role: 'button',
          tabIndex: 0,
          // prevents child button clicks from clicking this button
          onClick: e => {
            if (e.target !== e.currentTarget || p.disabled) return
            if (typeof p.onClick === 'function') p.onClick(e)
            else if (p.onClick) p.onClick[0](p.onClick[1], e)
          },
          onKeyDown: e => {
            if (typeof p.onKeyDown === 'function') p.onKeyDown(e)
            else if (p.onKeyDown) p.onKeyDown[0](p.onKeyDown[1], e)
            // click this button on Enter or Space key
            // prevents child onKeyDown events from clicking this button
            if (e.target !== e.currentTarget || p.disabled || (e.key !== 'Enter' && e.key !== ' ')) return
            e.currentTarget.click()
          },
        }
      : { onClick: p.onClick })}
  >
    {p.children}
  </div>
)

export const Flex: PComp<ComponentProps<typeof Block> & FlexProps & ScrollableProps> = p => {
  const props = removeProps(p, ['class', 'flex', 'scrollable', 'gap', 'direction', 'align', 'distribute'])

  return (
    <Block
      class={css(
        {
          alignItems: alignOptions[p.align ?? 'stretch'],
          display: 'flex',
          flexDirection: directionOptions[p.direction ?? 'row'],
          gap: p.gap,
          justifyContent: distributeOptions[p.distribute ?? 'start'],
          '& > *': { flexShrink: 0 },
          ...(p.scrollable &&
            ({ row: { minWidth: 0, overflowX: 'auto' }, col: { minHeight: 0, overflowY: 'auto' } } as const)[
              p.direction ?? 'row'
            ]),
        },
        p.class
      )}
      flex={p.flex ?? (p.scrollable ? '1 1 0' : undefined)}
      {...props}
    />
  )
}

export const Col: PComp<Omit<ComponentProps<typeof Flex>, 'direction'>> = p => <Flex direction="col" {...p} />

export const Row: PComp<Omit<ComponentProps<typeof Flex>, 'direction'>> = p => <Flex direction="row" {...p} />
