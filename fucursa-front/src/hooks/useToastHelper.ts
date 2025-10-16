'use client';

import { useToast } from '@/components/Toast';

// Helper hook that provides a confirm function similar to window.confirm
export function useToastHelper() {
  const toast = useToast();

  // For async confirmation dialogs, we still need to use window.confirm
  // But for simple notifications, use toast
  const confirm = (message: string): boolean => {
    return window.confirm(message);
  };

  return {
    ...toast,
    confirm
  };
}

