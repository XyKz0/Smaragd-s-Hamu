import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmRestartModalProps {
  isOpen: boolean;
  visitedCount: number;
  evidenceCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmRestartModal({
  isOpen,
  visitedCount,
  evidenceCount,
  onCancel,
  onConfirm,
}: ConfirmRestartModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-xs"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="restart-dialog-title"
        aria-describedby="restart-dialog-desc"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-lg border border-white/15 bg-[#111116] p-6 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-red-500/30 bg-red-950/40 text-red-400">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="restart-dialog-title"
              className="font-display text-xl font-bold tracking-tight text-[#F5F2EB] [text-wrap:balance]"
            >
              Új nyomozás indítása?
            </h2>
            <p
              id="restart-dialog-desc"
              className="mt-2.5 text-sm leading-relaxed text-zinc-300"
            >
              Biztosan elölről akarod kezdeni a történetet? Ha megerősíted, minden eddigi
              játékmeneted, a bejárt útvonalad és a nyomozói naplóban összegyűjtött
              bizonyítékaid végleg elvesznek ezen az eszközön.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 font-mono text-xs text-zinc-400 tabular-nums">
          <span>Megismert fejezetek: {visitedCount}</span>
          <span aria-hidden="true" className="text-zinc-600">
            ·
          </span>
          <span>Összegyűjtött nyomok: {evidenceCount}</span>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-[42px] items-center justify-center rounded-md border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-red-500 whitespace-nowrap shrink-0"
          >
            Mégse, folytatom
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex min-h-[42px] items-center justify-center rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-red-400 whitespace-nowrap shrink-0"
          >
            Igen, újrakezdem
          </button>
        </div>
      </div>
    </div>
  );
}
