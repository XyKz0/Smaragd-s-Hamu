import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import type { Scene } from '../types/gamebook';

interface SceneImagePlateProps {
  scene: Scene;
  imageUrl?: string;
  chapterNumber: number;
}

export function SceneImagePlate({ scene, imageUrl, chapterNumber }: SceneImagePlateProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const showImage = Boolean(imageUrl) && !imgFailed;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10 bg-[#111116]">
      {showImage ? (
        <img
          src={imageUrl}
          alt={`${scene.title} — jelenet illusztráció`}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#16161B] via-[#0B0B0E] to-[#1A0D10] p-8 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-red-400">
            <ImageIcon className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-2 font-display text-xl font-semibold text-zinc-200">
            {scene.title}
          </p>
          <p className="mt-2 max-w-xs text-sm text-zinc-400">
            Ehhez a jelenethez még nincs rendelt illusztráció.
          </p>
        </div>
      )}

      {/* Measured scrim for crisp metadata contrast over stark ink artwork */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-5 pt-12 pb-4">
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-300 tabular-nums">
          <span>{String(chapterNumber).padStart(2, '0')}. fejezet</span>
        </div>
      </div>
    </div>
  );
}
