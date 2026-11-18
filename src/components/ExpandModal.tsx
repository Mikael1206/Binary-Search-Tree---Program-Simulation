import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ExpandModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  headerColorClass: 'bg-accent-pink' | 'bg-accent-yellow';
  ariaLabel: string;
  closeAriaLabel: string;
  children: React.ReactNode;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const ExpandModal: React.FC<ExpandModalProps> = ({
  isOpen,
  onClose,
  title,
  headerColorClass,
  ariaLabel,
  closeAriaLabel,
  children,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((element) => !element.hasAttribute('hidden'));

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    window.requestAnimationFrame(() => {
      const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (firstFocusable ?? dialogRef.current)?.focus();
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/25 backdrop-blur-[8px] motion-safe:animate-[backdropIn_180ms_ease-out]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className="w-[92vw] max-w-[1200px] h-[86vh] max-h-[820px] sm:w-[92vw] max-[639px]:w-[95vw] max-[639px]:h-[90vh] bg-card rounded-card border-3 border-ink shadow-pop overflow-hidden flex flex-col motion-safe:animate-[modalIn_180ms_ease-out]"
      >
        <div
          className={`h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between border-b-3 border-ink flex-shrink-0 ${headerColorClass}`}
        >
          <h2 className="font-sans font-extrabold text-ink text-[10px] tracking-[0.18em] uppercase select-none sm:text-[13px] sm:tracking-[0.22em]">
            {title}
          </h2>
          <button
            type="button"
            aria-label={closeAriaLabel}
            onClick={onClose}
            className="w-9 h-9 border-2 border-ink rounded-[5px] bg-card flex items-center justify-center text-ink cursor-pointer hover:bg-white active:translate-x-0.5 active:translate-y-0.5 transition-colors"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default ExpandModal;
