"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import superjson from "superjson";
import Toolbar from "@/components/ui/toolbar";
import { DateProvider } from "@/context/date-context";
import { useUserStore } from "@/context/useUserStore";
import { useSession } from "@/utils/auth-client";
import { trpc } from "../utils/trpc";

export function RootClient({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5m default stale time
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

  // syncs better auth session
  // with zustand user store
  const { data: session, isPending } = useSession();
  const setUserId = useUserStore((s) => s.setUserId);
  const clearUser = useUserStore((s) => s.clearUser);

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      setUserId(session.user.id);
    } else {
      clearUser();
    }
  }, [session, isPending, setUserId, clearUser]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <DateProvider>
            <Toolbar />
            {children}
          </DateProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ThemeProvider>
  );
}
