"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <ConvexProvider client={convex}>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
        </QueryClientProvider>
      </ConvexProvider>
    </SessionProvider>
  );
};

export default Providers;
