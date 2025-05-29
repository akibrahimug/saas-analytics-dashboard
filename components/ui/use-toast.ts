"use client";

// Simplified toast implementation
// In a real app, you would use a complete toast library

import * as React from "react";

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
  type?: "success" | "error" | "warning" | "info";
  variant?: "default" | "destructive";
}

// Simple in-memory state management
const listeners: Array<(toasts: ToastOptions[]) => void> = [];
let toasts: ToastOptions[] = [];

export function toast(options: ToastOptions) {
  // For now, just log to console
  console.log(`Toast: ${options.title}`);
  if (options.description) {
    console.log(`  ${options.description}`);
  }

  // In a real implementation, we would add the toast to a list
  // and notify listeners
  toasts = [...toasts, options];
  listeners.forEach((listener) => listener(toasts));

  // Remove the toast after a delay
  setTimeout(() => {
    toasts = toasts.filter((t) => t !== options);
    listeners.forEach((listener) => listener(toasts));
  }, options.duration || 3000);

  return {
    dismiss: () => {
      toasts = toasts.filter((t) => t !== options);
      listeners.forEach((listener) => listener(toasts));
    },
  };
}

export function useToast() {
  const [state, setState] = React.useState<ToastOptions[]>(toasts);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    toasts: state,
    toast,
  };
}
