"use client";

import { useToast } from "./use-toast";

export function Toaster() {
  // For simplicity, we're not actually showing UI toasts
  // In a real app, this would render toast notifications

  // But we'll still hook into the toast system
  const { toasts } = useToast();

  return null;
}
