'use client';

import { useToast } from '@/app/hooks/use-toast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px] pointer-events-none">
      {toasts.map((toast) => {
        const isDestructive = toast.variant === 'destructive';
        const isSuccess = toast.variant === 'success';

        return (
          <div
            key={toast.id}
            className={`
              group pointer-events-auto relative flex w-full items-start space-x-3 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all
              ${isDestructive ? 'border-red-200 bg-red-50' : ''}
              ${isSuccess ? 'border-green-200 bg-green-50' : ''}
              ${!isDestructive && !isSuccess ? 'border-gray-200 bg-white' : ''}
              mb-2 animate-in slide-in-from-top-full
            `}
          >
            {/* Icono */}
            <div className="flex-shrink-0 mt-0.5">
              {isSuccess && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              {isDestructive && (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              {!isSuccess && !isDestructive && (
                <Info className="h-5 w-5 text-blue-600" />
              )}
            </div>

            {/* Contenido */}
            <div className="flex-1 space-y-1">
              {toast.title && (
                <div
                  className={`
                    text-sm font-semibold
                    ${isDestructive ? 'text-red-900' : ''}
                    ${isSuccess ? 'text-green-900' : ''}
                    ${!isDestructive && !isSuccess ? 'text-gray-900' : ''}
                  `}
                >
                  {toast.title}
                </div>
              )}
              {toast.description && (
                <div
                  className={`
                    text-sm
                    ${isDestructive ? 'text-red-700' : ''}
                    ${isSuccess ? 'text-green-700' : ''}
                    ${!isDestructive && !isSuccess ? 'text-gray-600' : ''}
                  `}
                >
                  {toast.description}
                </div>
              )}
            </div>

            {/* Botón cerrar */}
            <button
              onClick={() => dismiss(toast.id)}
              className={`
                absolute right-2 top-2 rounded-md p-1 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${isDestructive ? 'text-red-500 hover:bg-red-100 focus:ring-red-600' : ''}
                ${isSuccess ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' : ''}
                ${!isDestructive && !isSuccess ? 'text-gray-400 hover:bg-gray-100 focus:ring-gray-600' : ''}
              `}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}