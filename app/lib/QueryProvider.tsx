"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { EdgeStoreProvider } from "./edgeStoreProvider";

function QueryProvider({ children }: React.PropsWithChildren) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <EdgeStoreProvider>{children}</EdgeStoreProvider>
    </QueryClientProvider>
  )
}

export default QueryProvider;
