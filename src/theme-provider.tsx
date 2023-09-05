/* eslint-disable consistent-return,no-param-reassign */
/** @jsx jsx */
// noinspection JSUnusedGlobalSymbols

import { ThemeStyles, ThemeUIProvider } from "theme-ui";
import { useThemedStylesWithMdx } from "@theme-ui/mdx";
import { MDXProvider, useMDXComponents } from "@mdx-js/react";
import { Components as MDXComponents, MergeComponents as MergeMDXComponents } from "@mdx-js/react/lib";
import * as React from "react";
import { jsx } from "./jsx-runtime";
import { makeResponsive } from "./react-jsx";
import { Theme } from "./types";
import styleProps from "./style-props";

export interface ThemeProviderProps {
    theme: Theme | ((outerTheme: Theme) => Theme);
    children?: React.ReactNode;
    components?: MDXComponents | MergeMDXComponents;
}

const conflictingProps = ["p"];

function transformStyles(styles: object | null | undefined, result = {}, tree = 0): ThemeStyles {
    if (styles !== null && typeof styles === "object") {
        Object.entries(styles).forEach(([key, value]) => {
            if (!Array.isArray(value) && typeof value === "object") {
                result[key.replace(/^_/, ":")] = transformStyles(value, {}, tree + 1);
                return result;
            }

            if (tree === 1 && conflictingProps.includes(key)) {
                return;
            }

            if (typeof styleProps[key] !== "undefined") {
                const names = styleProps[key];
                names.forEach((name: string | number) => {
                    result[name] = makeResponsive(value);
                });
            }
        });
    }

    return result;
}

export function ThemeProvider({ theme, components, children }: ThemeProviderProps) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let _theme = theme;
    const componentsWithStyles = useThemedStylesWithMdx(useMDXComponents(components));
    if (typeof theme !== "function") {
        _theme = {
            ...theme,
            styles: transformStyles(theme.styles),
        };
    }

    return (<ThemeUIProvider theme={_theme}>
            <MDXProvider components={componentsWithStyles}>{children}</MDXProvider>
        </ThemeUIProvider>);
}




