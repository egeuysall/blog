'use client';

import { useEffect, useState } from 'react';
import { Toaster as Sonner } from 'sonner';
import type { ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDark(event.matches);
    };

    setIsDark(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <Sonner
      theme={isDark ? 'dark' : 'light'}
      className="toaster group"
      style={
        {
          '--normal-bg': isDark ? 'var(--color-neutral-900)' : 'var(--color-neutral-100)',
          '--normal-text': isDark ? 'var(--color-neutral-100)' : 'var(--color-neutral-900)',
          '--normal-border': isDark ? 'var(--color-neutral-700)' : 'var(--color-neutral-300)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
