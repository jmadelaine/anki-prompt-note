import { splitProps } from 'solid-js'

export const removeProps = <T, K extends [readonly (keyof T)[], ...(readonly (keyof T)[])[]]>(
  props: T,
  ...keys: K
): Omit<T, K[number][number]> => splitProps(props, ...keys)[1]
