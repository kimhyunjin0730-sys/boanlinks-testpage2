'use client';

import { useEffect, useState } from 'react';

type Props = {
  /** Public URL of the PDF (relative to /public, e.g. /docs/boanlinks-intro.pdf) */
  pdfUrl: string;
  /** Slide-image fallback (used while the iframe loads or if the browser blocks PDF embedding) */
  slideImages?: string[];
  /** Filename suggested when downloading */
  downloadName?: string;
  /** Trigger button label */
  triggerLabel?: string;
  /** Trigger button class */
  triggerClassName?: string;
};

/**
 * "소개서 보기 (PDF)" — opens an inline modal viewer with the brochure PDF.
 *
 * Strategy:
 *  - Primary: <iframe src={pdfUrl}> — browsers with built-in PDF viewers render it.
 *  - Fallback: a slide-image carousel from `slideImages` for browsers/devices
 *    where inline PDF viewing is blocked (most mobile browsers).
 *  - Always exposes a "PDF 다운로드" link so users can grab the original file.
 */
export function PdfViewer({
  pdfUrl,
  slideImages = [],
  downloadName = 'boanlinks-intro.pdf',
  triggerLabel = '소개서 보기 (PDF)',
  triggerClassName,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'pdf' | 'slides'>('pdf');
  const [slideIdx, setSlideIdx] = useState(0);

  // Lock body scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (mode === 'slides') {
        if (e.key === 'ArrowRight')
          setSlideIdx((i) => Math.min(i + 1, slideImages.length - 1));
        if (e.key === 'ArrowLeft') setSlideIdx((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, mode, slideImages.length]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          triggerClassName ??
          'inline-flex items-center justify-center gap-2 rounded-[.625rem] bg-white text-navy border border-border px-6 py-3 text-sm font-semibold transition-all hover:bg-slate-50 hover:-translate-y-[1px]'
        }
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
        {triggerLabel}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Boanlinks 소개서"
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative flex w-full max-w-5xl h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Toolbar */}
            <header className="flex items-center justify-between gap-2 border-b border-border bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-navy">Boanlinks 서비스 소개서</h2>
                {slideImages.length > 0 && (
                  <div
                    role="tablist"
                    aria-label="보기 모드"
                    className="hidden sm:inline-flex rounded-full bg-slate-100 p-0.5 text-xs font-semibold"
                  >
                    <button
                      role="tab"
                      aria-selected={mode === 'pdf'}
                      onClick={() => setMode('pdf')}
                      className={`px-3 py-1 rounded-full transition-colors ${
                        mode === 'pdf' ? 'bg-white text-navy shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      PDF
                    </button>
                    <button
                      role="tab"
                      aria-selected={mode === 'slides'}
                      onClick={() => setMode('slides')}
                      className={`px-3 py-1 rounded-full transition-colors ${
                        mode === 'slides' ? 'bg-white text-navy shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      슬라이드
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={pdfUrl}
                  download={downloadName}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-slate-50"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  다운로드
                </a>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-slate-50"
                >
                  새 창에서 열기
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="닫기"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </header>

            {/* Body */}
            <div className="flex-1 min-h-0 bg-slate-100">
              {mode === 'pdf' ? (
                <iframe
                  src={pdfUrl}
                  title="Boanlinks 소개서"
                  className="h-full w-full border-0"
                />
              ) : slideImages.length > 0 ? (
                <div className="relative flex h-full flex-col">
                  <div className="flex flex-1 items-center justify-center p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slideImages[slideIdx]}
                      alt={`슬라이드 ${slideIdx + 1}`}
                      className="max-h-full max-w-full object-contain shadow-md"
                    />
                  </div>
                  <div className="flex items-center justify-between border-t border-border bg-white px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSlideIdx((i) => Math.max(0, i - 1))}
                      disabled={slideIdx === 0}
                      className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-navy hover:bg-slate-50 disabled:opacity-40"
                    >
                      ← 이전
                    </button>
                    <span className="text-xs font-semibold text-slate-600">
                      {slideIdx + 1} / {slideImages.length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSlideIdx((i) => Math.min(slideImages.length - 1, i + 1))
                      }
                      disabled={slideIdx === slideImages.length - 1}
                      className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-navy hover:bg-slate-50 disabled:opacity-40"
                    >
                      다음 →
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
