import { useState, useCallback } from 'react';

type ToastVariant = 'default' | 'destructive' | 'success';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 5000;

let toastCount = 0;
const listeners: Array<(state: ToastState) => void> = [];
let memoryState: ToastState = { toasts: [] };

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_VALUE;
  return toastCount.toString();
}

function addToast(toast: Omit<Toast, 'id'>) {
  const id = genId();
  const newToast: Toast = {
    ...toast,
    id,
    duration: toast.duration ?? TOAST_REMOVE_DELAY,
  };

  memoryState = {
    toasts: [newToast, ...memoryState.toasts].slice(0, TOAST_LIMIT),
  };

  listeners.forEach((listener) => listener(memoryState));

  // Auto dismiss
  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, newToast.duration);
  }

  return id;
}

function dismissToast(toastId: string) {
  memoryState = {
    toasts: memoryState.toasts.filter((t) => t.id !== toastId),
  };

  listeners.forEach((listener) => listener(memoryState));
}

export function useToast() {
  const [state, setState] = useState<ToastState>(memoryState);

  useState(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  });

  const toast = useCallback(
    ({
      title,
      description,
      variant = 'default',
      duration,
    }: Omit<Toast, 'id'>) => {
      return addToast({ title, description, variant, duration });
    },
    []
  );

  const dismiss = useCallback((toastId: string) => {
    dismissToast(toastId);
  }, []);

  return {
    toast,
    toasts: state.toasts,
    dismiss,
  };
}