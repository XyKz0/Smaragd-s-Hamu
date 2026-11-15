import { ArrowRight, CheckCircle2, Play } from 'lucide-react';
import type { Scene } from '../types/gamebook';

interface SceneMapViewProps {
  scenes: Scene[];
  visitedSceneIds: string[];
  currentSceneId: string;
  onJumpToScene: (sceneId: string) => void;
}

export function SceneMapView({
  scenes,
  visitedSceneIds,
  currentSceneId,
  onJumpToScene,
}: SceneMapViewProps) {
  const sceneMap = new Map(scenes.map((s) => [s.id, s]));
  const visitedSet = new Set(visitedSceneIds);

  // Only reveal chapters the player has already read, in the order they discovered them
  const discoveredScenes = visitedSceneIds
    .map((id) => sceneMap.get(id))
    .filter((scene): scene is Scene => Boolean(scene));

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#F5F2EB] sm:text-3xl [text-wrap:balance]">
            Megtett út és fejezetek
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
            Itt csak azok a fejezetek láthatók, amelyeket már olvastál a nyomozás során.
            Bármelyik korábbi állomásra visszaugorhatsz, hogy új irányba indulj el.
          </p>
        </div>

        <div className="text-xs text-zinc-400 font-mono tabular-nums">
          Megismert fejezetek: {discoveredScenes.length}
        </div>
      </div>

      {/* Visited Scenes Grid (spoiler-free) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {discoveredScenes.map((scene, index) => {
          const isCurrent = scene.id === currentSceneId;
          return (
            <div
              key={scene.id}
              className={`flex flex-col justify-between rounded-lg border p-6 transition-colors ${
                isCurrent
                  ? 'border-red-500/60 bg-[#181316]'
                  : 'border-white/10 bg-[#111116]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-red-400 tabular-nums">
                    {String(index + 1).padStart(2, '0')}. állomás
                  </span>
                  {isCurrent && (
                    <div className="flex items-center gap-1.5 text-zinc-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
                      <span>Jelenlegi hely</span>
                    </div>
                  )}
                </div>

                <h2 className="mt-3 font-display text-xl font-semibold text-[#F5F2EB]">
                  {scene.title}
                </h2>

                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                  {scene.text}
                </p>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-xs font-medium text-zinc-400">
                    {scene.choices.length > 0
                      ? `Választási lehetőségek (${scene.choices.length})`
                      : 'Zsákutca / Lezárás'}
                  </p>
                  {scene.choices.length > 0 && (
                    <ul className="mt-3 space-y-2.5">
                      {scene.choices.map((choice, cIdx) => {
                        const targetVisited = visitedSet.has(choice.nextScene);
                        const targetScene = targetVisited
                          ? sceneMap.get(choice.nextScene)
                          : undefined;
                        return (
                          <li
                            key={`${scene.id}-${choice.nextScene}-${cIdx}`}
                            className="flex items-start justify-between gap-3 text-xs"
                          >
                            <span className="line-clamp-2 text-zinc-300">
                              {choice.text}
                            </span>
                            <span
                              className={`inline-flex shrink-0 items-center gap-1 ${
                                targetScene ? 'text-zinc-200' : 'text-zinc-500'
                              }`}
                            >
                              <ArrowRight className="h-3 w-3" aria-hidden="true" />
                              <span>
                                {targetScene ? targetScene.title : 'Felderítetlen'}
                              </span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => onJumpToScene(scene.id)}
                  className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-100 transition-colors hover:border-red-500/60 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-red-500 whitespace-nowrap"
                >
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Ugrás ehhez a fejezethez</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
