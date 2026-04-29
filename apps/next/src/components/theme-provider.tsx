"use client";

import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";

const twColors = resolveConfig(tailwindConfig).theme.colors;

const theme = createTheme({
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
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <StyledEngineProvider injectFirst>
      <AppRouterCacheProvider options={{ enableCssLayer: false }}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <MUIThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </MUIThemeProvider>
        </NextThemesProvider>
      </AppRouterCacheProvider>
    </StyledEngineProvider>
  );
}
