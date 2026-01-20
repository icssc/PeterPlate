"use client";
import Snackbar from "@mui/material/Snackbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import Toolbar from "@/components/ui/toolbar";
import { DateProvider } from "@/context/date-context";
import { trpc } from "../utils/trpc";

export function RootClient({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
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

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <DateProvider>
          <Toolbar />
          {children}
          <Snackbar />
        </DateProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
