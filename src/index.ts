import { createElement, type ComponentType, type FC } from 'react'

type VariantMap = Record<string, readonly string[]>

type VariantKeys<M extends VariantMap> = M[keyof M][number]

type ExtractBooleanProps<M extends VariantMap> = {
  [K in VariantKeys<M>]?: boolean
}

class PropConflictError extends Error {
  constructor(targetProp: string, props: Array<string | number | symbol>) {
    super()
    this.message = `Conflict error: You can not use both the explicit prop "${targetProp}" and boolean variant${
      props.length === 1 ? '' : 's'
    }: [${props.join(', ')}]`
  }
}

class VariantCollisionError extends Error {
  constructor(
    variants: readonly string[],
    targetProp: string,
    props: Array<string | number | symbol>,
  ) {
    super()
    this.message = `Collision error: Only one of [${variants.join(
      ', ',
    )}] can be used for "${targetProp}". Got: [${props.join(', ')}]`
  }
}

export const withBooleanVariants =
  <T extends string, M extends Record<string, ReadonlyArray<T>>>(variantMap: M) =>
  <P extends object>(component: ComponentType<P>): FC<P & ExtractBooleanProps<M>> => {
  const WrappedComponent: FC<P & ExtractBooleanProps<M>> = (props) => {
    const newProps = { ...props } as Record<string, any>
    const variantEntries = Object.entries(variantMap)

    variantEntries.forEach(([targetProp, variants]) => {
      const booleanProps = (variants as readonly (keyof typeof props)[]).filter(
        (v) => props[v],
      )

      if ((props as any)[targetProp] !== undefined && booleanProps.length > 0) {
        throw new PropConflictError(targetProp, booleanProps)
      }

      if (booleanProps.length > 1) {
        throw new VariantCollisionError(variants, targetProp, booleanProps)
      }

      if (booleanProps.length === 1) {
        newProps[targetProp] = booleanProps[0]
      }

      variants.forEach((variant) => {
        delete newProps[variant]
      })
    })

    return createElement(component, newProps as P)
  }
  WrappedComponent.displayName = `WithBooleanVariants(${component.displayName ?? component.name})`
  return WrappedComponent
}
