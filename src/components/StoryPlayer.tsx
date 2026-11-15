import { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import type { EvidenceItem, Scene } from '../types/gamebook';
import { SCENE_IMAGES } from '../assets/sceneImages';
import { SceneImagePlate } from './SceneImagePlate';

interface StoryPlayerProps {
  scenes: Scene[];
  currentSceneId: string;
  history: string[];
  canGoBack: boolean;
  previousSceneTitle?: string;
  unlockedCount: number;
  newlyUnlockedItems: EvidenceItem[];
  onSelectChoice: (nextSceneId: string) => void;
  onGoBack: () => void;
  onRestart: () => void;
  onOpenLog: () => void;
}

export function StoryPlayer({
  scenes,
  currentSceneId,
  history,
  canGoBack,
  previousSceneTitle,
  unlockedCount,
  newlyUnlockedItems,
  onSelectChoice,
  onGoBack,
  onRestart,
  onOpenLog,
}: StoryPlayerProps) {
  const sceneMap = new Map(scenes.map((s) => [s.id, s]));
  const currentScene = sceneMap.get(currentSceneId);
  const chapterNumber = history.length + 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'TEXTAREA' ||
          target.tagName === 'INPUT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (currentScene && currentScene.choices.length > 0) {
        const num = Number(e.key);
        if (num >= 1 && num <= currentScene.choices.length) {
          e.preventDefault();
          onSelectChoice(currentScene.choices[num - 1].nextScene);
          return;
        }
      }

      if ((e.key === 'Backspace' || e.key === 'ArrowLeft') && canGoBack) {
        e.preventDefault();
        onGoBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canGoBack, currentScene, onGoBack, onSelectChoice]);

  if (!currentScene) {
    return (
      <section className="mx-auto max-w-3xl py-8">
        <div className="rounded-lg border border-white/10 bg-[#111116] p-8">
          <p className="text-xs font-medium text-amber-400">
            Folytatás következik
          </p>

          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#F5F2EB] [text-wrap:balance]">
            A történetnek ez a szála még készülőben van
          </h1>

          <p className="mt-4 text-base leading-relaxed text-zinc-300">
            A nyomozás ezen az ösvényen hamarosan tovább folytatódik. Addig is visszaléphetsz,
            hogy egy másik döntést próbálj ki, vagy újrakezdheted az esetet az elejéről.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onGoBack}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-red-400 whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Visszalépés</span>
              </button>
            )}

            <button
              type="button"
              onClick={onRestart}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-red-500 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Kezdés elölről</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  const paragraphs = currentScene.text
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  const imageUrl = SCENE_IMAGES[currentScene.id];
  const trail = [...history, currentScene.id];

  return (
    <section className="flex flex-col gap-6">
      {/* Compact Workspace Utility Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex min-w-0 items-center gap-2 text-xs text-zinc-400">
          <span className="shrink-0 text-zinc-500">Útvonal:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {trail.map((nodeId, idx) => {
              const title = sceneMap.get(nodeId)?.title ?? nodeId;
              return (
                <span key={`${nodeId}-${idx}`} className="flex items-center gap-1.5 shrink-0">
                  {idx > 0 && (
                    <span aria-hidden="true" className="text-zinc-600">
                      /
                    </span>
                  )}
                  <span
                    className={
                      idx === trail.length - 1 ? 'text-red-400 font-medium' : 'text-zinc-400'
                    }
                  >
                    {title}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {canGoBack && (
            <button
              type="button"
              onClick={onGoBack}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-white/10 bg-[#111116] px-3.5 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-red-500/50 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-red-500 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Visszalépés</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenLog}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-white/10 bg-[#111116] px-3.5 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-amber-500/50 hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-red-500 whitespace-nowrap shrink-0"
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
            <span className="tabular-nums">Nyomozói napló ({unlockedCount})</span>
          </button>
        </div>
      </div>

      {/* Main 1440px Split Gamebook Stage */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left: Sin City Ink Illustration Plate */}
        <div className="lg:col-span-5 lg:sticky lg:top-8">
          <SceneImagePlate
            key={currentScene.id}
            scene={currentScene}
            imageUrl={imageUrl}
            chapterNumber={chapterNumber}
          />
        </div>

        {/* Right: Hardboiled Narrative & Decision Stage */}
        <article className="flex flex-col rounded-lg border border-white/10 bg-[#111116] p-6 sm:p-8 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            <span className="font-mono text-red-400 tabular-nums">
              {String(chapterNumber).padStart(2, '0')}. fejezet
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className={currentScene.choices.length === 0 && currentScene.endingType === 'dead_end' ? 'font-medium text-red-400' : ''}>
              {currentScene.choices.length > 0
                ? `${currentScene.choices.length} válaszlehetőség`
                : currentScene.endingType === 'dead_end'
                  ? 'Halálos zsákutca'
                  : 'Lezárás'}
            </span>
          </div>

          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#F5F2EB] sm:text-3xl [text-wrap:balance]">
            {currentScene.title}
          </h1>

          <div className="mt-6 space-y-5 border-t border-white/10 pt-6 text-justify hyphens-auto text-[16.5px] leading-[1.78] tracking-[0.01em] text-[#E2DFD7]">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Newly Unlocked Clue Notification */}
          {newlyUnlockedItems.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-[#191610] px-4 py-3 text-xs">
              <div className="flex items-center gap-2.5 text-amber-200">
                <BookOpen className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                <span>
                  Új nyom rögzítve:{' '}
                  <strong className="font-semibold text-white">
                    {newlyUnlockedItems.map((i) => i.title).join(', ')}
                  </strong>
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenLog}
                className="font-medium text-amber-400 transition-colors hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-amber-400 whitespace-nowrap shrink-0"
              >
                Napló megnyitása
              </button>
            </div>
          )}

          {/* Interactive Choices */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <h2 className="text-xs font-medium tracking-wide text-zinc-400">
              {currentScene.choices.length > 0
                ? 'Mit teszel?'
                : currentScene.endingType === 'dead_end'
                  ? 'Game Over — Halálos zsákutca'
                  : 'Végjáték'}
            </h2>

            {currentScene.choices.length > 0 ? (
              <div className="mt-4 flex flex-col gap-3">
                {currentScene.choices.map((choice, idx) => (
                  <button
                    key={`${choice.nextScene}-${idx}`}
                    type="button"
                    onClick={() => onSelectChoice(choice.nextScene)}
                    className="group flex min-h-[52px] w-full items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#17171E] px-5 py-3.5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-red-500/60 hover:bg-[#1E1A1D] focus-visible:outline-2 focus-visible:outline-red-500"
                  >
                    <div className="flex items-baseline gap-3.5">
                      <span className="font-mono text-xs font-medium text-red-400 tabular-nums shrink-0">
                        0{idx + 1}.
                      </span>
                      <span className="text-[15.5px] leading-snug text-zinc-100 group-hover:text-white">
                        {choice.text}
                      </span>
                    </div>

                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-red-400"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            ) : currentScene.endingType === 'dead_end' ? (
              <div className="mt-4 rounded-lg border border-red-500/35 bg-[#191115] p-5">
                <p className="text-sm leading-relaxed text-zinc-200">
                  Rossz döntést hoztál, és a kaland itt véget ért.{' '}
                  {canGoBack && previousSceneTitle
                    ? `Visszaléphetsz az utolsó döntési pontodhoz (${previousSceneTitle}), hogy kipróbálj egy másik lehetőséget, vagy elölről kezdheted az egész nyomozást.`
                    : canGoBack
                      ? 'Visszaléphetsz az utolsó döntéshez, hogy kipróbálj egy másik lehetőséget, vagy elölről kezdheted az egész nyomozást.'
                      : 'Tiszta lappal újrakezdheted az egész nyomozást.'}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {canGoBack && (
                    <button
                      type="button"
                      onClick={onGoBack}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-red-400 whitespace-nowrap shrink-0"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      <span>Visszalépés az utolsó döntéshez</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onRestart}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-red-500 whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    <span>Új nyomozás indítása</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-white/10 bg-[#17171E] p-5">
                <p className="text-sm leading-relaxed text-zinc-300">
                  Ez a történetszál itt véget ért.{' '}
                  {canGoBack
                    ? 'Visszaléphetsz az utolsó döntéshez egy másik befejezés kipróbálásához, vagy tiszta lappal újrakezdheted a nyomozást.'
                    : 'Tiszta lappal újrakezdheted a nyomozást.'}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {canGoBack && (
                    <button
                      type="button"
                      onClick={onGoBack}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-red-500 whitespace-nowrap shrink-0"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      <span>Visszalépés az utolsó döntéshez</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onRestart}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-red-400 whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    <span>Új nyomozás indítása</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
