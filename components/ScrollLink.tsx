'use client';

import type { ReactNode } from 'react';

type Props = {
  targetId: string;
  className?: string;
  children: ReactNode;
};

/**
 * Smooth-scrolls to an in-page anchor by id. Used for inline brochure
 * navigation so users can scroll the brochure rather than opening a PDF.
 */
export function ScrollLink({ targetId, className, children }: Props) {
  return (
    <button
      type="button"
      onClick={() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
      className={className}
    >
      {children}
    </button>
  );
}
