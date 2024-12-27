"use client";

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/lib/error-boundary';
import { ChatProvider } from '@/lib/chat-context';
import { StatsProvider } from '@/lib/contexts/stats-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ErrorBoundary>
        <ChatProvider>
          <StatsProvider>
            {children}
            <Toaster />
          </StatsProvider>
        </ChatProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}