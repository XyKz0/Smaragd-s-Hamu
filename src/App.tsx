import { useCallback, useEffect, useState } from 'react';
import initialScenesData from './data/scenes.json';
import evidenceCatalogData from './data/evidence.json';
import type { AppView, EvidenceItem, Scene } from './types/gamebook';
import { StoryPlayer } from './components/StoryPlayer';
import { SceneMapView } from './components/SceneMapView';
import { EvidenceLogView } from './components/EvidenceLogView';
import { GuideView } from './components/GuideView';
import { ConfirmRestartModal } from './components/ConfirmRestartModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

const SCENES = initialScenesData as Scene[];
const EVIDENCE_CATALOG = evidenceCatalogData as EvidenceItem[];
const SCENE_MAP = new Map(SCENES.map((s) => [s.id, s]));
const EVIDENCE_MAP = new Map(EVIDENCE_CATALOG.map((e) => [e.id, e]));

const INITIAL_SCENE_ID = SCENES.some((s) => s.id === 'start')
  ? 'start'
  : SCENES[0]?.id ?? 'start';

const EVIDENCE_STORAGE_KEY = 'sincity_noir_evidence_v1';
const SOURCES_STORAGE_KEY = 'sincity_noir_evidence_sources_v1';
const PROGRESS_STORAGE_KEY = 'sincity_noir_progress_v1';

interface StoredProgress {
  currentSceneId: string;
  visitedSceneIds: string[];
  history: string[];
}

function loadStoredProgress(): StoredProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredProgress>;
      const currentSceneId =
        typeof parsed.currentSceneId === 'string' && SCENE_MAP.has(parsed.currentSceneId)
          ? parsed.currentSceneId
          : INITIAL_SCENE_ID;

      const rawVisited = Array.isArray(parsed.visitedSceneIds)
        ? parsed.visitedSceneIds.filter(
            (id): id is string => typeof id === 'string' && SCENE_MAP.has(id),
          )
        : [];
      const visitedSet = new Set<string>([INITIAL_SCENE_ID, ...rawVisited, currentSceneId]);

      const history = Array.isArray(parsed.history)
        ? parsed.history.filter(
            (id): id is string => typeof id === 'string' && SCENE_MAP.has(id),
          )
        : [];

      return {
        currentSceneId,
        visitedSceneIds: Array.from(visitedSet),
        history,
      };
    }
  } catch {
    // Fallback to initial state
  }

  return {
    currentSceneId: INITIAL_SCENE_ID,
    visitedSceneIds: [INITIAL_SCENE_ID],
    history: [],
  };
}

function findVisitedPathToScene(targetId: string, visitedIds: string[]): string[] {
  if (targetId === INITIAL_SCENE_ID) return [];
  const visitedSet = new Set(visitedIds);
  if (!visitedSet.has(INITIAL_SCENE_ID)) return [];

  const queue: { id: string; trail: string[] }[] = [{ id: INITIAL_SCENE_ID, trail: [] }];
  const seen = new Set<string>([INITIAL_SCENE_ID]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const scene = SCENE_MAP.get(current.id);
    if (!scene) continue;

    for (const choice of scene.choices) {
      if (choice.nextScene === targetId) {
        return [...current.trail, current.id];
      }
      if (visitedSet.has(choice.nextScene) && !seen.has(choice.nextScene)) {
        seen.add(choice.nextScene);
        queue.push({
          id: choice.nextScene,
          trail: [...current.trail, current.id],
        });
      }
    }
  }

  const parent = SCENES.find(
    (s) => visitedSet.has(s.id) && s.choices.some((c) => c.nextScene === targetId),
  );
  return parent ? [parent.id] : [];
}

function loadStoredArray(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string');
      }
    }
  } catch {
    // Fallback to empty
  }
  return [];
}

function loadStoredSources(): Record<string, string> {
  try {
    const raw = localStorage.getItem(SOURCES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, string>;
      }
    }
  } catch {
    // Fallback to empty
  }
  return {};
}

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: 'play', label: 'Játék' },
  { id: 'map', label: 'Jelenet-térkép' },
  { id: 'log', label: 'Nyomozói napló' },
  { id: 'guide', label: 'Útmutató' },
];

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('play');
  const [initialProgress] = useState<StoredProgress>(loadStoredProgress);
  const [currentSceneId, setCurrentSceneId] = useState<string>(initialProgress.currentSceneId);
  const [visitedSceneIds, setVisitedSceneIds] = useState<string[]>(initialProgress.visitedSceneIds);
  const [history, setHistory] = useState<string[]>(initialProgress.history);
  const [isRestartConfirmOpen, setIsRestartConfirmOpen] = useState<boolean>(false);
  const [unlockedEvidenceIds, setUnlockedEvidenceIds] = useState<string[]>(() =>
    loadStoredArray(EVIDENCE_STORAGE_KEY),
  );
  const [evidenceSources, setEvidenceSources] = useState<Record<string, string>>(
    loadStoredSources,
  );
  const [newlyUnlockedIds, setNewlyUnlockedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const payload: StoredProgress = {
        currentSceneId,
        visitedSceneIds,
        history,
      };
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }, [currentSceneId, visitedSceneIds, history]);

  const unlockEvidenceForScene = useCallback(
    (sceneId: string) => {
      const scene = SCENE_MAP.get(sceneId);
      const clueIds = scene?.evidenceUnlocked ?? [];
      if (clueIds.length === 0) {
        setNewlyUnlockedIds([]);
        return;
      }

      setUnlockedEvidenceIds((prev) => {
        const freshIds = clueIds.filter(
          (id) => EVIDENCE_MAP.has(id) && !prev.includes(id),
        );
        setNewlyUnlockedIds(freshIds);
        if (freshIds.length === 0) return prev;

        const next = [...prev, ...freshIds];
        try {
          localStorage.setItem(EVIDENCE_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore storage quota errors
        }

        setEvidenceSources((prevSources) => {
          const updatedSources = { ...prevSources };
          freshIds.forEach((id) => {
            if (!updatedSources[id]) {
              updatedSources[id] = sceneId;
            }
          });
          try {
            localStorage.setItem(SOURCES_STORAGE_KEY, JSON.stringify(updatedSources));
          } catch {
            // Ignore storage quota errors
          }
          return updatedSources;
        });

        return next;
      });
    },
    [],
  );

  const handleSelectChoice = useCallback(
    (nextSceneId: string) => {
      setHistory((prev) => [...prev, currentSceneId]);
      setCurrentSceneId(nextSceneId);
      if (SCENE_MAP.has(nextSceneId)) {
        setVisitedSceneIds((prev) =>
          prev.includes(nextSceneId) ? prev : [...prev, nextSceneId],
        );
        unlockEvidenceForScene(nextSceneId);
      } else {
        setNewlyUnlockedIds([]);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentSceneId, unlockEvidenceForScene],
  );

  const fallbackParentScene =
    history.length === 0
      ? SCENES.find(
          (s) =>
            visitedSceneIds.includes(s.id) &&
            s.choices.some((choice) => choice.nextScene === currentSceneId),
        )
      : undefined;

  const previousScene =
    history.length > 0
      ? SCENE_MAP.get(history[history.length - 1])
      : fallbackParentScene;

  const handleGoBack = useCallback(() => {
    if (history.length > 0) {
      const previousId = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setCurrentSceneId(previousId);
      setNewlyUnlockedIds([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (fallbackParentScene) {
      setCurrentSceneId(fallbackParentScene.id);
      setNewlyUnlockedIds([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [fallbackParentScene, history]);

  const handleRequestRestart = useCallback(() => {
    setIsRestartConfirmOpen(true);
  }, []);

  const handleCancelRestart = useCallback(() => {
    setIsRestartConfirmOpen(false);
  }, []);

  const handleConfirmRestart = useCallback(() => {
    setIsRestartConfirmOpen(false);
    setHistory([]);
    setCurrentSceneId(INITIAL_SCENE_ID);
    setVisitedSceneIds([INITIAL_SCENE_ID]);
    setUnlockedEvidenceIds([]);
    setEvidenceSources({});
    setNewlyUnlockedIds([]);
    setActiveView('play');
    try {
      localStorage.removeItem(EVIDENCE_STORAGE_KEY);
      localStorage.removeItem(SOURCES_STORAGE_KEY);
      localStorage.setItem(
        PROGRESS_STORAGE_KEY,
        JSON.stringify({
          currentSceneId: INITIAL_SCENE_ID,
          visitedSceneIds: [INITIAL_SCENE_ID],
          history: [],
        }),
      );
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleJumpToScene = useCallback(
    (sceneId: string) => {
      if (!visitedSceneIds.includes(sceneId)) return;
      const idxInHistory = history.indexOf(sceneId);
      const nextHistory =
        idxInHistory >= 0
          ? history.slice(0, idxInHistory)
          : findVisitedPathToScene(sceneId, visitedSceneIds);
      setHistory(nextHistory);
      setCurrentSceneId(sceneId);
      setNewlyUnlockedIds([]);
      setActiveView('play');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [history, visitedSceneIds],
  );

  const handleClearEvidence = useCallback(() => {
    setUnlockedEvidenceIds([]);
    setEvidenceSources({});
    setNewlyUnlockedIds([]);
    try {
      localStorage.removeItem(EVIDENCE_STORAGE_KEY);
      localStorage.removeItem(SOURCES_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const newlyUnlockedItems = newlyUnlockedIds
    .map((id) => EVIDENCE_MAP.get(id))
    .filter((item): item is EvidenceItem => Boolean(item));

  return (
    <div className="min-h-screen bg-[#070709] text-[#F0EDE6] flex flex-col">
      {/* Three-Zone Top Bar Contract */}
      <header className="border-b border-white/10 bg-[#070709]">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 py-4">
          {/* Zone 1: Single-element Wordmark */}
          <a
            href="#start"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('play');
            }}
            className="font-display text-xl font-bold tracking-tight text-[#F5F2EB] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-red-500"
          >
            Smaragd és Hamu
          </a>

          {/* Zone 2: Concise navigation links (wraps cleanly on narrow mobile screens) */}
          <nav
            aria-label="Fő navigáció"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium sm:gap-x-6"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                  className={`relative py-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-red-500 ${
                    isActive
                      ? 'text-red-400'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-[2px] bg-red-600 lg:-bottom-[15px]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Install */}
          <div className="flex items-center gap-2.5 shrink-0">
            <PWAInstallButton />
            <button
              type="button"
              onClick={handleRequestRestart}
              className="inline-flex min-h-[40px] items-center rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-red-400 whitespace-nowrap shrink-0"
            >
              Új nyomozás
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto w-full max-w-[1360px] flex-1 px-6 py-8">
        {activeView === 'play' && (
          <StoryPlayer
            scenes={SCENES}
            currentSceneId={currentSceneId}
            history={history}
            canGoBack={Boolean(previousScene)}
            previousSceneTitle={previousScene?.title}
            unlockedCount={unlockedEvidenceIds.length}
            newlyUnlockedItems={newlyUnlockedItems}
            onSelectChoice={handleSelectChoice}
            onGoBack={handleGoBack}
            onRestart={handleRequestRestart}
            onOpenLog={() => setActiveView('log')}
          />
        )}

        {activeView === 'map' && (
          <SceneMapView
            scenes={SCENES}
            visitedSceneIds={visitedSceneIds}
            currentSceneId={currentSceneId}
            onJumpToScene={handleJumpToScene}
          />
        )}

        {activeView === 'log' && (
          <EvidenceLogView
            evidenceCatalog={EVIDENCE_CATALOG}
            unlockedEvidenceIds={unlockedEvidenceIds}
            evidenceSources={evidenceSources}
            scenes={SCENES}
            onJumpToScene={handleJumpToScene}
            onClearEvidence={handleClearEvidence}
          />
        )}

        {activeView === 'guide' && <GuideView />}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-white/10 py-5">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-4 px-6 text-xs text-zinc-500">
          <span>Smaragd és Hamu — Interaktív Noir Nyomozás</span>
          <div className="flex items-center gap-3 font-mono tabular-nums">
            <span>Megismert fejezetek: {visitedSceneIds.length}</span>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <span>Nyomok: {unlockedEvidenceIds.length}</span>
          </div>
        </div>
      </footer>

      <ConfirmRestartModal
        isOpen={isRestartConfirmOpen}
        visitedCount={visitedSceneIds.length}
        evidenceCount={unlockedEvidenceIds.length}
        onCancel={handleCancelRestart}
        onConfirm={handleConfirmRestart}
      />

      <OfflineIndicator />
    </div>
  );
}
