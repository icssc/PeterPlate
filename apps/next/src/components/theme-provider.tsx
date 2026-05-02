"use client";

import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
  StyledEngineProvider,
  useColorScheme,
} from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";

const twColors = resolveConfig(tailwindConfig).theme.colors;

function MuiThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const { setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  // Sync next-themes state to MUI internal state
  useEffect(() => {
    setMounted(true);
    if (resolvedTheme) {
      setMode(resolvedTheme as "light" | "dark");
    }
  }, [resolvedTheme, setMode]);

  const theme = useMemo(
    () =>
      createTheme({
        cssVariables: {
          colorSchemeSelector: "class",
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
    [],
  );

  if (!mounted) return null;

  return (
    <MUIThemeProvider
      theme={theme}
      defaultMode={resolvedTheme as "light" | "dark"}
    >
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
