"use client";

import { Alert, Snackbar } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import superjson from "superjson";
import { ThemeProvider } from "@/components/theme-provider";
import { ACCOUNT_DELETED_KEY } from "@/components/ui/delete-account-content";
import Toolbar from "@/components/ui/toolbar";
import { DateProvider } from "@/context/date-context";
import { useSnackbarStore } from "@/context/useSnackbar";
import { useUserStore } from "@/context/useUserStore";
import { useSession } from "@/utils/auth-client";
import { trpc } from "../utils/trpc";

export function RootClient({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url:
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/trpc",
          transformer: superjson,
          async headers() {
            return {
              "x-trpc-source": "next-js",
            };
          },
        }),
      ],
    }),
  );

  const { data: session, isPending } = useSession();
  const setUserId = useUserStore((s) => s.setUserId);
  const clearUser = useUserStore((s) => s.clearUser);

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      setUserId(session.user.id);
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
      });
    } else {
      clearUser();
      posthog.reset();
    }
  }, [session, isPending, setUserId, clearUser]);

  return (
    <ThemeProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <DateProvider>
            <Toolbar />
            <GlobalSnackbar />
            <main className="pb-20 md:pb-0">{children}</main>
          </DateProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ThemeProvider>
  );
}

function GlobalSnackbar() {
  const { open, message, severity, showSnackbar, closeSnackbar } =
    useSnackbarStore();

  useEffect(() => {
    if (!sessionStorage.getItem(ACCOUNT_DELETED_KEY)) return;
    sessionStorage.removeItem(ACCOUNT_DELETED_KEY);
    showSnackbar("Your account has been deleted.", "success");
  }, [showSnackbar]);

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={closeSnackbar}>
      <Alert onClose={closeSnackbar} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
