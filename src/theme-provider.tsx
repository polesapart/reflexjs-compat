/** @jsx jsx */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { type ThemeStyles, ThemeUIProvider } from 'theme-ui'
import { useThemedStylesWithMdx } from '@theme-ui/mdx'
import { MDXProvider, useMDXComponents } from '@mdx-js/react'
import { type Components as MDXComponents, type MergeComponents as MergeMDXComponents } from '@mdx-js/react/lib'
import * as React from 'react'

// @ts-expect-warning
import { jsx } from './jsx-runtime.js'
import { makeResponsive } from './react-jsx.js'
import { type StringIndexedObject, type Theme } from './types.js'
import styleProps from './style-props.js'

export interface ThemeProviderProps {
  theme: Theme | ((outerTheme: Theme) => Theme)
  children?: React.ReactNode
  components?: MDXComponents | MergeMDXComponents
}

const conflictingProps = ['p']

function transformStyles (styles: object | null | undefined, result: StringIndexedObject = {}, tree = 0): ThemeStyles {
  if (styles !== null && typeof styles === 'object') {
    Object.entries(styles).forEach(([key, value]) => {
      if (!Array.isArray(value) && typeof value === 'object') {
        result[key.replace(/^_/, ':')] = transformStyles(value, {}, tree + 1)
        return result
      }

      if (tree === 1 && conflictingProps.includes(key)) {
        return
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

// noinspection JSUnusedGlobalSymbols
export const ThemeProvider: ({ theme, components, children }: ThemeProviderProps) => React.JSX.Element = ({ theme, components, children }: ThemeProviderProps) => {
  let _theme = theme
  const componentsWithStyles = useThemedStylesWithMdx(useMDXComponents(components))
  if (typeof theme !== 'function') {
    _theme = {
      ...theme,
      styles: transformStyles(theme.styles)
    }
  }

  return (<ThemeUIProvider theme={_theme}>
            <MDXProvider components={componentsWithStyles}>{children}</MDXProvider>
        </ThemeUIProvider>)
}
