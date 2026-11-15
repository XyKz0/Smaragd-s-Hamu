import { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-white/15 bg-[#111116] px-3.5 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-emerald-500/60 hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-emerald-400 whitespace-nowrap shrink-0"
      >
        <Download className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
        <span>Telepítés</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-white/15 bg-[#111116] px-3.5 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-emerald-500/60 hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-emerald-400 whitespace-nowrap shrink-0"
        >
          <Download className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
          <span>Offline mentés (iOS)</span>
        </button>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
          >
            <div className="w-full max-w-sm rounded-lg border border-white/15 bg-[#111116] p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <h2
                  id="ios-install-title"
                  className="font-display text-xl font-bold text-[#F5F2EB]"
                >
                  Telepítés iPhone / iPad készülékre
                </h2>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Bezárás"
                  className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-300">
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-xs font-semibold text-emerald-400">01.</span>
                  <span>
                    Nyisd meg az oldalt <strong>Safari</strong> böngészőben, majd koppints a{' '}
                    <span className="inline-flex items-center gap-1 font-semibold text-white">
                      Megosztás <Share className="inline h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    </span>{' '}
                    gombra.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-xs font-semibold text-emerald-400">02.</span>
                  <span>
                    Görgess lejjebb, és válaszd a{' '}
                    <strong className="text-white">Hozzáadás a főképernyőhöz</strong> menüpontot.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-xs font-semibold text-emerald-400">03.</span>
                  <span>
                    Indítsd el a főképernyőről — Wi-Fi-s letöltés után mobilnet nélkül is játszható.
                  </span>
                </li>
              </ol>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-red-400"
              >
                Értem
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
