'use client';
import { useEffect } from 'react';

export function PWAInit() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        reg => console.log('SW registered:', reg.scope),
        err => console.log('SW failed:', err)
      );
    }
  }, []);
  return null;
}
