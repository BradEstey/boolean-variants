import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { withBooleanVariants } from './index'
import React, { type ReactNode } from 'react'

interface ButtonProps {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'destructive'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  children: ReactNode
}

const BaseButton = ({ variant, size, children }: ButtonProps) => (
  <button data-variant={variant} data-size={size}>
    {children}
  </button>
)

const Button = withBooleanVariants(BaseButton, {
  variant: ['primary', 'secondary', 'outline', 'destructive'],
  size: ['xs', 'sm', 'lg', 'xl'],
} as const)

describe('withBooleanVariants', () => {
  it('converts the boolean prop into the expected prop value', () => {
    const { getByText } = render(<Button primary>Submit</Button>)
    expect(getByText('Submit').getAttribute('data-variant')).toBe('primary')
  })

  it('still allows original props to be used', () => {
    const { getByText } = render(<Button variant="secondary">Secondary</Button>)
    expect(getByText('Secondary').getAttribute('data-variant')).toBe(
      'secondary',
    )
  })

  it('allows original props to be used with boolean props', () => {
    const { getByText } = render(
      <Button variant="secondary" xl>
        Extra Large Secondary
      </Button>,
    )
    expect(
      getByText('Extra Large Secondary').getAttribute('data-variant'),
    ).toBe('secondary')
    expect(getByText('Extra Large Secondary').getAttribute('data-size')).toBe(
      'xl',
    )
  })

  it('throw an error if an explicit prop and boolean prop are used together', () => {
    expect(() => {
      render(
        <Button variant="secondary" destructive>
          Error
        </Button>,
      )
    }).toThrowError()
  })

  it('throw an error if an two boolean props in the same group are used together', () => {
    expect(() => {
      render(
        <Button xl lg>
          Error
        </Button>,
      )
    }).toThrowError()
  })
})
