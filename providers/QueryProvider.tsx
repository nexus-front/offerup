"use client";

// providers/QueryProvider.tsx
// Wrap this around your app in the root layout, alongside AuthProvider

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

type Props = { children: React.ReactNode };

export function QueryProvider({ children }: Props) {
  // useState so each request gets its own QueryClient
  // and data is not shared between users/requests on the server
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          /*  queries: {
            staleTime: 1000 * 60 * 5, // 5 min — don't refetch if data is fresh
            gcTime: 1000 * 60 * 10, // 10 min — keep in cache after unmount
            retry: 1, // retry once on failure
            refetchOnWindowFocus: false, // don't refetch when tab regains focus
          }, */
          queries: {
            staleTime: 1000 * 60 * 5, // 5 min — data considered fresh
            gcTime: 1000 * 60 * 30, // 30 min — keep in memory after unmount
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnMount: false, // don't refetch if data exists in cache
            refetchOnReconnect: false, // don't refetch on network reconnect
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
