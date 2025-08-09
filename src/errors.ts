export class PropConflictError extends Error {
  constructor(targetProp: string, props: Array<string | number | symbol>) {
    super()
    this.message = `Conflict error: You can not use both the explicit prop "${targetProp}" and boolean variant${
      props.length === 1 ? '' : 's'
    }: [${props.join(', ')}]`
  }
}

export class VariantCollisionError extends Error {
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
