import { injectGlobal } from '@emotion/css'
import { theme } from './theme'

export const loadGlobalCss = () => {
  injectGlobal({
    '*, *::before, *::after': {
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      margin: 0,
      outline: 0,
      padding: 0,
      position: 'relative',
      WebkitTapHighlightColor: 'transparent',
      WebkitTouchCallout: 'none',
    },
    // Prevents "long press to copy" blue box appearing on random elements on iOS
    '*:not(input, textarea)': { WebkitUserSelect: 'none' },
    html: {
      fontFamily:
        '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: '100%',
      fontWeight: 300,
      lineHeight: 1.25,
      textSizeAdjust: '100%',
      width: '100%',
      height: '100%',
    },
    body: {
      height: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      MsContentZooming: 'none',
      overflow: 'hidden',
      overscrollBehaviorY: 'none',
      position: 'fixed',
      textRendering: 'optimizeLegibility',
      touchAction: 'none',
      WebkitUserDrag: 'none',
      width: '100%',
      wordWrap: 'break-word',
      backgroundColor: theme.colors.background(0),
      color: theme.colors.text(0),
    },
    'p, h1, h2, h3, h4, h5, h6': { fontSize: 'inherit' },
    '#root': { inset: 0, overflow: 'hidden', position: 'fixed', zIndex: 1 },
  })
}
