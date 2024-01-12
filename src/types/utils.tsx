import { ParentComponent, VoidComponent } from 'solid-js'

// eslint-disable-next-line @typescript-eslint/ban-types
export type PComp<TProps = {}> = ParentComponent<TProps & { class?: string }>
// eslint-disable-next-line @typescript-eslint/ban-types
export type Comp<TProps = {}> = VoidComponent<TProps & { class?: string }>
