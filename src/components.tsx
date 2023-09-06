/** @jsx jsx */
// noinspection JSUnusedGlobalSymbols

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from './jsx-runtime.js'
import { useTheme } from './react-jsx.js'

export interface VisuallyHiddenProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export function VisuallyHidden (props: VisuallyHiddenProps) {
  return (
    <span
      sx={{
        position: 'absolute',
        top: 'auto',
        overflow: 'hidden',
        clipPath: 'rect(1px, 1px, 1px, 1px)',
        width: '1px',
        height: '1px',
        whiteSpace: 'nowrap'
      }}
      {...props}
    />
  )
}

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string
}

export function Icon ({ name, size = 4, ...props }: IconProps) {
  const { theme } = useTheme()

  return theme?.icons?.[name]
    ? (
    <svg
      fill="currentColor"
      dangerouslySetInnerHTML={{
        __html: theme.icons[name]
      }}
      size={size}
      {...props}
    />
      )
    : null
}
