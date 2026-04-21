"use client";

import type { AppRouter } from "@/server/api/root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { useState, type ReactNode } from "react";

export const api = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function TRPCReactProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
