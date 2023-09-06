/* eslint-disable @typescript-eslint/strict-boolean-expressions,@typescript-eslint/naming-convention */
// noinspection JSUnusedGlobalSymbols

import type * as React from 'react'
import styleProps from './style-props.js'
import { type StyleProps, type SxProps, type Theme } from './types.js'
import deepmerge from 'deepmerge'
import {
  jsx as themeUIJSX,
  css,
  type ThemeUIStyleObject,
  useThemeUI,
  type ThemeUIContextValue
} from 'theme-ui'

export { useColorMode, css, get, InitializeColorMode } from 'theme-ui'

interface ExactContextValue extends Omit<ThemeUIContextValue, 'theme'> {
  theme: Theme
}

export const merge = deepmerge

export const useTheme = (useThemeUI as unknown) as () => ExactContextValue

const RESPONSIVE_SEPARATOR = '|'

const regex = new RegExp(`^(${Object.keys(styleProps).join('|')})$`)

const omit = (props: Record<string, any>): Record<string, any> => {
  const next: Record<string, any> = {}
  for (const key in props) {
    if (regex.test(key)) continue
    next[key] = props[key]
  }
  return next
}

const pick = (props: Record<string, any>): Record<string, any> => {
  const next: Record<string, any> = {}
  for (const key in props) {
    if (!regex.test(key)) continue
    next[key] = props[key]
  }
  return next
}

const split = (props: Record<string, any>): [Record<string, any>, Record<string, any>] => [pick(props), omit(props)]

export const makeResponsive = (prop: string | any): any => {
  if (typeof prop !== 'string') {
    return prop
  }

  // Allow responsive values to be written as "foo|bar|baz".
  return prop.split(RESPONSIVE_SEPARATOR).map((value) => {
    if (value === 'null') {
      return null
    }
    return (value.match(/^\d+$/) != null) ? parseInt(value) : value
  })
}

export function transformProps (
  props: StyleProps,
  result: Record<string, any> = {}
): ThemeUIStyleObject {
  if (props !== null && typeof props === 'object') {
    Object.entries(props).forEach(([key, value]) => {
      if (!Array.isArray(value) && typeof value === 'object') {
        return (result[key.replace(/^_/, ':')] = transformProps(value))
      }

      if (typeof styleProps[key] !== 'undefined') {
        const names = styleProps[key]
        names.forEach((name: string | number) => {
          result[name] = makeResponsive(value)
        })
      }
    })
  }

  return result
}

type doNotParseType = keyof React.JSX.IntrinsicElements

const doNotParseTypes: doNotParseType[] = ['meta']

/* eslint-disable  @typescript-eslint/no-explicit-any */
function isDoNotParseType (name: any): name is doNotParseType {
  return doNotParseTypes.includes(name)
}

export function parseProps (type: any, props: any): any {
  if (!props) return props

  if (isDoNotParseType(type)) {
    return props
  }

  // Fix for React.Fragment.
  if (typeof type === 'symbol') {
    return props
  }

  if (typeof type !== 'string') {
    return props.sx
      ? {
          ...props,
          sx: transformProps(props.sx)
        }
      : props
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { sx: _sx = {}, ...__props } = props
  let { variant, ..._props } = __props
  const { variant: sxVariant, ...sx } = _sx
  if (sxVariant) {
    variant = sxVariant
  }

  const [styleProps, otherProps] = split(_props)

  if (
    !variant &&
        Object.keys(sx).length === 0 &&
        Object.keys(styleProps).length === 0
  ) {
    return props
  }

  const sxProps = transformProps(deepmerge(styleProps, sx))

  const next: typeof props & {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    css?: any
    sx: SxProps
  } = {
    ...otherProps
  }

  if (!variant) {
    next.sx = sxProps
    return next
  }

  next.css = (theme: Record<string, any>) => {
    const variants = variant.split(' ')
    let __themeKeyFailed = false
    let variantStyles = {}
    variants.forEach((variant: { split: (arg0: string) => [any, ...any[]] }) => {
      const [__themeKey, ...nestedVariants] = variant.split('.')
      if (!theme[__themeKey]) {
        __themeKeyFailed = true
        return
      }

      // Handle nested variants.
      let styles = theme[__themeKey]
      nestedVariants.forEach((v) => {
        if (theme[__themeKey][v]) {
          const _vStyles = theme[__themeKey][v]
          const vStyles =
                        typeof _vStyles === 'function' ? _vStyles(theme, styles) : _vStyles
          styles = deepmerge(styles, vStyles)
        }
      })

      variantStyles = deepmerge(variantStyles, styles)
    })

    if (__themeKeyFailed) {
      return sxProps ? css(sxProps)(theme) : null
    }

    return css(
      transformProps({
        ...variantStyles,
        ...sxProps as any
      })
    )(theme)
  }

  return next
}

// @ts-expect-error not yet
export const jsx: typeof React.createElement = (type, props, ...children) => {
  // eslint-disable-next-line no-useless-call
  return themeUIJSX.apply(undefined, [
    type,
    parseProps(type, props),
    ...children
  ])
}
