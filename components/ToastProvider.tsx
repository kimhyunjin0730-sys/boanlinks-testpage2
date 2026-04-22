'use client';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { Toast, ToastKind } from '@/types';

type Ctx = {
  show: (kind: ToastKind, title: string, description?: string) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((kind: ToastKind, title: string, description?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, kind, title, description }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-scale-in rounded-lg border px-4 py-3 shadow-lg bg-white ${
              t.kind === 'success'
                ? 'border-emerald-300'
                : t.kind === 'error'
                ? 'border-red-300'
                : 'border-border'
            }`}
          >
            <p className="font-semibold text-sm text-navy">{t.title}</p>
            {t.description && <p className="text-xs text-slate-500 mt-1">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
