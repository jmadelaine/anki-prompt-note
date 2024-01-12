import { css as emotionCss, CSSInterpolation, cx as emotionCx } from '@emotion/css'

const getOpacityColor = (color: string, amount: number): string => {
  const o = Math.max(0, Math.min(1, amount))
  let r = 0
  let g = 0
  let b = 0
  if (color.length === 4) {
    // Short format, e.g., #F00
    r = parseInt(color[1] + color[1], 16)
    g = parseInt(color[2] + color[2], 16)
    b = parseInt(color[3] + color[3], 16)
  } else if (color.length === 7) {
    // Full format, e.g., #FF0000
    r = parseInt(color.substring(1, 3), 16)
    g = parseInt(color.substring(3, 5), 16)
    b = parseInt(color.substring(5, 7), 16)
  } else {
    throw new Error('Invalid color format')
  }
  return `rgba(${r}, ${g}, ${b}, ${o})`
}

// FIXME: figure out a way to toggle dark mode
let isDarkMode = true

const colors = {
  background: {
    0: { dark: '#15191C', light: '#FFFFFF' },
    1: { dark: '#191D24', light: '#F7F8FA' },
    2: { dark: '#1D222B', light: '#EDF1F5' },
    3: { dark: '#222833', light: '#DFE4EB' },
    4: { dark: '#262D3B', light: '#D1D8E0' },
  },
  text: {
    0: { dark: '#EDF1F5', light: '#15191C' },
  },
  primary: {
    0: { dark: '#001d66', light: '#001d66' },
    1: { dark: '#002c8c', light: '#002c8c' },
    2: { dark: '#003eb3', light: '#003eb3' },
    3: { dark: '#0958d9', light: '#0958d9' },
    4: { dark: '#1677ff', light: '#1677ff' },
    5: { dark: '#4096ff', light: '#4096ff' },
    6: { dark: '#69b1ff', light: '#69b1ff' },
    7: { dark: '#91caff', light: '#91caff' },
    8: { dark: '#bae0ff', light: '#bae0ff' },
    9: { dark: '#e6f4ff', light: '#e6f4ff' },
  },
}

const shadow = {
  1: [
    { offsetX: 0, offsetY: 1, blur: 2, spread: 0, opacity: 0.03 },
    { offsetX: 0, offsetY: 2, blur: 4, spread: 0, opacity: 0.04 },
    { offsetX: 0, offsetY: 6, blur: 9, spread: -1, opacity: 0.2 },
    { offsetX: 0, offsetY: -2, blur: 4, spread: -4, opacity: 0.2 },
  ],
  2: [
    { offsetX: 0, offsetY: 4, blur: 8, spread: 0, opacity: 0.03 },
    { offsetX: 0, offsetY: 8, blur: 16, spread: -2, opacity: 0.04 },
    { offsetX: 0, offsetY: 24, blur: 36, spread: -4, opacity: 0.2 },
    { offsetX: 0, offsetY: -2, blur: 4, spread: -4, opacity: 0.2 },
  ],
  3: [
    { offsetX: 0, offsetY: 12, blur: 24, spread: 0, opacity: 0.03 },
    { offsetX: 0, offsetY: 24, blur: 48, spread: -6, opacity: 0.04 },
    { offsetX: 0, offsetY: 72, blur: 108, spread: -12, opacity: 0.2 },
    { offsetX: 0, offsetY: -2, blur: 4, spread: -4, opacity: 0.2 },
  ],
}

const buildColors = (clrs: typeof colors, isDrkMde: boolean) => {
  const opacityFn = (c: string, o?: number) => (o !== undefined ? getOpacityColor(c, o) : c)

  // eslint-disable-next-line
  return (Object.keys(clrs) as (keyof typeof clrs)[]).reduce<{
    [K in keyof typeof clrs]: ((shade: keyof typeof clrs[K], opacity?: number) => string) & {
      dark: (shade: keyof typeof clrs[K], opacity?: number) => string
      light: (shade: keyof typeof clrs[K], opacity?: number) => string
    }
  }>((a, k) => {
    // eslint-disable-next-line
    a[k] = Object.assign(
      (shade: keyof typeof clrs[typeof k], opacity?: number) =>
        opacityFn(clrs[k][shade][isDrkMde ? 'dark' : 'light'], opacity),
      {
        dark: (shade: keyof typeof clrs[typeof k], opacity?: number) => opacityFn(clrs[k][shade].dark, opacity),
        light: (shade: keyof typeof clrs[typeof k], opacity?: number) => opacityFn(clrs[k][shade].light, opacity),
      }
    ) as any // eslint-disable-line
    return a
  }, {} as any) // eslint-disable-line
}

export const theme = {
  colors: buildColors(colors, isDarkMode),
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  shadow: (Object.keys(shadow) as unknown as (keyof typeof shadow)[]).reduce<Record<keyof typeof shadow, string>>(
    (res, key) => {
      res[key] = shadow[key].reduce<string>((s, { offsetX, offsetY, blur, spread, opacity }) => {
        const sh = s ? `${s}, ` : ''
        // 2x transparecy when in dark mode makes shadows darker (more visible) on the darker background
        const alpha = isDarkMode ? opacity * 2 : opacity
        return `${sh}${offsetX}px ${offsetY}px ${blur}px ${spread}px rgba(0, 0, 0, ${alpha})`
      }, '')
      return res
    },
    {} as any // eslint-disable-line
  ),

  font: {
    size: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.375rem', xl: '2rem', xxl: '3rem' },
    weight: { light: 300, normal: 400, semibold: 500, bold: 700 },
  },
}

// Allows both style objects and emotion-generated classnames to be merged in a specified order
export const css = (...classes: (CSSInterpolation | string)[]) =>
  emotionCx(...classes.map(c => (typeof c === 'string' ? c : emotionCss(c))))
