"use client";

import CssBaseline from "@mui/material/CssBaseline";
import {
  extendTheme,
  ThemeProvider as MUIThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const theme = extendTheme({
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
