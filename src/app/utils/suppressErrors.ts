'use client';

import { useEffect } from 'react';

export const SuppressErrors = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Store original methods
      const originalError = console.error;
      const originalWarn = console.warn;
      const originalLog = console.log;
      const originalInfo = console.info;

      // Override console methods to prevent UI notifications
      console.error = (...args: any[]) => {
        // Still log to dev tools but prevent error overlays/toasts
        originalError.apply(console, args);
      };

      console.warn = (...args: any[]) => {
        originalWarn.apply(console, args);
      };

      console.log = (...args: any[]) => {
        originalLog.apply(console, args);
      };

      console.info = (...args: any[]) => {
        originalInfo.apply(console, args);
      };

      // Suppress React error boundary and development warnings
      window.addEventListener('error', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });

      window.addEventListener('unhandledrejection', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    }
  }, []);

  return null;
};