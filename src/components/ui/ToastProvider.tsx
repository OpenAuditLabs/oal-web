"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster position="bottom-right" richColors closeButton expand={false} />
  );
}

export default ToastProvider;
