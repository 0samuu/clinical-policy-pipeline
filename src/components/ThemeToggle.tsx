'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg bg-surface-elevated animate-pulse" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle Clinical Theme Mode"
      id="theme-toggle-btn"
      className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-border-subtle bg-surface-card hover:bg-surface-elevated text-text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-brand-primary transition-transform rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-brand-primary transition-transform rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}
