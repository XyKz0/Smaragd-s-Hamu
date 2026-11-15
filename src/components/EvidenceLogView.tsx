import { useState } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import type { EvidenceCategory, EvidenceItem, Scene } from '../types/gamebook';

interface EvidenceLogViewProps {
  evidenceCatalog: EvidenceItem[];
  unlockedEvidenceIds: string[];
  evidenceSources: Record<string, string>;
  scenes: Scene[];
  onJumpToScene: (sceneId: string) => void;
  onClearEvidence: () => void;
}

type FilterOption = 'all' | EvidenceCategory;

const FILTER_TABS: { id: FilterOption; label: string }[] = [
  { id: 'all', label: 'Összes' },
  { id: 'szemely', label: 'Személyek' },
  { id: 'targy', label: 'Tárgyak' },
  { id: 'bizonyitek', label: 'Bizonyítékok' },
  { id: 'helyszin', label: 'Helyszínek' },
];

const CATEGORY_LABELS: Record<EvidenceCategory, string> = {
  szemely: 'Személy',
  targy: 'Tárgy',
  bizonyitek: 'Bizonyíték',
  helyszin: 'Helyszín',
};

const SPLASH_CLASSES: Record<EvidenceItem['splashColor'], string> = {
  red: 'bg-red-600',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
};

export function EvidenceLogView({
  evidenceCatalog,
  unlockedEvidenceIds,
  evidenceSources,
  scenes,
  onJumpToScene,
  onClearEvidence,
}: EvidenceLogViewProps) {
  const [filter, setFilter] = useState<FilterOption>('all');

  const catalogMap = new Map(evidenceCatalog.map((item) => [item.id, item]));
  const sceneMap = new Map(scenes.map((scene) => [scene.id, scene]));

  const unlockedItems = unlockedEvidenceIds
    .map((id) => catalogMap.get(id))
    .filter((item): item is EvidenceItem => Boolean(item));

  const filteredItems =
    filter === 'all'
      ? unlockedItems
      : unlockedItems.filter((item) => item.category === filter);

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#F5F2EB] sm:text-3xl [text-wrap:balance]">
            Nyomozói napló
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
            A város árnyékaiból előkerült tárgyak, nevek és helyszínek dossziéja. Minden
            felfedezett nyom automatikusan rögzítésre kerül az ügyiratban.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-zinc-400 tabular-nums">
            Rögzített nyomok: {unlockedItems.length} / {evidenceCatalog.length}
          </span>
          {unlockedItems.length > 0 && (
            <button
              type="button"
              onClick={onClearEvidence}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-white/10 bg-[#111116] px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-red-500/40 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-red-500 whitespace-nowrap shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Napló ürítése</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Segmented Bar */}
      <div className="flex flex-wrap items-center gap-1 self-start rounded-lg border border-white/10 bg-[#111116] p-1">
        {FILTER_TABS.map((tab) => {
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-red-500 ${
                active
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Evidence Dossier Cards or Empty State */}
      {unlockedItems.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-[#111116] p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-red-400">
            <FileText className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="font-display text-xl font-semibold text-[#F5F2EB]">
            A dosszié egyelőre üres
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
            Az íróasztalodon még nincs bizonyíték. Ahogy haladsz az éjszakában és új
            választásokat hozol, a kulcsfontosságú tárgyak és nevek ide kerülnek.
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-[#111116] p-8 text-center">
          <p className="text-sm text-zinc-400">
            Ebben a kategóriában még nem rögzítettél nyomot.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredItems.map((item, idx) => {
            const sourceSceneId = evidenceSources[item.id];
            const sourceScene = sourceSceneId ? sceneMap.get(sourceSceneId) : undefined;
            return (
              <article
                key={item.id}
                className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#111116] p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <span
                        aria-hidden="true"
                        className={`inline-block h-2.5 w-2.5 rounded-xs ${SPLASH_CLASSES[item.splashColor]}`}
                      />
                      <span>{CATEGORY_LABELS[item.category]}</span>
                    </div>
                    <span className="font-mono text-zinc-500 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}. bejegyzés
                    </span>
                  </div>

                  <h2 className="mt-3 font-display text-xl font-semibold text-[#F5F2EB]">
                    {item.title}
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                    {item.summary}
                  </p>
                </div>

                {sourceScene && (
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs">
                    <span className="text-zinc-500">
                      Forrás:{' '}
                      <span className="text-zinc-300">{sourceScene.title}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onJumpToScene(sourceScene.id)}
                      className="font-medium text-red-400 transition-colors hover:text-red-300 focus-visible:outline-2 focus-visible:outline-red-500 whitespace-nowrap shrink-0"
                    >
                      Vissza a fejezethez
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
