"use client";

import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useMemo } from "react";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";

const twColors = resolveConfig(tailwindConfig).theme.colors;

function MuiThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const theme = useMemo(
    () =>
      createTheme({
        cssVariables: {
          colorSchemeSelector: "class",
        },
        palette: {
          mode: isDark ? "dark" : "light",
        },
        colorSchemes: {
          light: {
            palette: {
              primary: {
                main: twColors.sky["700"],
              },
            },
          },
          dark: {
            palette: {
              primary: {
                main: twColors.blue["300"],
              },
              background: {
                default: twColors.zinc["800"],
                paper: twColors.zinc["700"],
              },
              text: {
                primary: twColors.zinc["50"],
                secondary: twColors.zinc["50"], //twColors.zinc["400"],
              },
              divider: twColors.zinc["700"],
            },
          },
        },
        typography: {
          fontFamily: "var(--font-poppins), sans-serif",
        },
      }),
    [isDark],
  );

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <StyledEngineProvider injectFirst>
      <AppRouterCacheProvider options={{ enableCssLayer: false }}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <MuiThemeWrapper>{children}</MuiThemeWrapper>
        </NextThemesProvider>
      </AppRouterCacheProvider>
    </StyledEngineProvider>
  );
}
