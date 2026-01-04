'use client';

import { ThemeProvider } from '@/components/ThemeProvider';
import { CursorGlow } from '@/components/CursorGlow';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <CursorGlow />
      {children}
    </ThemeProvider>
  );
}
