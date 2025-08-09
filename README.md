# boolean-variants

A React [Higher-Order Component](https://legacy.reactjs.org/docs/higher-order-components.html) (HOC) that maps alternative boolean props to a component while maintaining the original component props.

```tsx
// Before 🥱
<Button variant="primary" size="lg">
```
```tsx
// After ✨
<Button primary lg>
```

## Installation

```bash
npm install boolean-variants
```

## Usage

Assume you have `BaseButton` component that has a `variant` prop and a `size` prop. Used like:

```tsx
<BaseButton variant="primary" size="lg">
```

Use `withBooleanVariants` to pass an object of arrays of possible values and their corresponding prop keys.

```ts
import { withBooleanVariants } from 'boolean-variants'

const Button = withBooleanVariants(BaseButton, {
  variant: ['primary', 'secondary', 'outline', 'destructive'],
  size: ['xs', 'sm', 'lg', 'xl'],
} as const) // <--- `as const` is required in TypeScript!
```

Now you can use boolean props to set the same prop values.

```tsx
<Button primary lg>
```

You can even combine them.

```tsx
<Button variant="primary" lg>
```

Attempting to use an explicit prop with a boolean prop variant or two boolean prop variants of the same group will throw a runtime error.

```tsx
<Button variant="primary" secondary>
// ❌ Throws a prop conflict error.
```
```tsx
<Button primary secondary>
// ❌ Throws a variant collision error.
```