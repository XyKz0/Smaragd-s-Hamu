export function GuideView() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-8">
      <div className="border-b border-white/10 pb-5">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#F5F2EB] sm:text-3xl [text-wrap:balance]">
          Játékszabály és irányítás
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Rövid áttekintés arról, hogyan zajlik a nyomozás és hogyan használhatod a naplót.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-[#111116] p-6">
          <h2 className="font-display text-lg font-semibold text-[#F5F2EB]">
            01. A nyomozás menete
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">
            Minden jelenet végén válaszút elé kerülsz. A döntéseid határozzák meg, merre
            haladsz tovább: új nyomokra bukkansz, kockázatos összecsapásba keveredsz, vagy
            halálos zsákutcába futsz. Olvasd el figyelmesen a részleteket, mielőtt lépsz.
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#111116] p-6">
          <h2 className="font-display text-lg font-semibold text-[#F5F2EB]">
            02. Nyomozói napló és bizonyítékok
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">
            A történet során talált kulcsfontosságú tárgyak, nevek és helyszínek
            automatikusan bekerülnek a <span className="font-medium text-zinc-100">Nyomozói napló</span> fülre.
            Ezek segítenek összerakni a képet Maeve O&apos;Hara szerepéről és a titokzatos
            aktatáska hátteréről.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#111116] p-6">
        <h2 className="font-display text-lg font-semibold text-[#F5F2EB]">
          03. Billentyűparancsok és nézetek
        </h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-md border border-white/10 bg-[#0B0B0E] p-4">
            <dt className="font-mono text-xs text-red-400">1, 2, 3, 4</dt>
            <dd className="mt-1 text-zinc-300">
              Az adott sorszámú válaszlehetőség kiválasztása egérhasználat nélkül.
            </dd>
          </div>
          <div className="rounded-md border border-white/10 bg-[#0B0B0E] p-4">
            <dt className="font-mono text-xs text-red-400">Backspace / Balra nyíl</dt>
            <dd className="mt-1 text-zinc-300">
              Visszalépés az előző jelenethez a megtett útvonalon.
            </dd>
          </div>
          <div className="rounded-md border border-white/10 bg-[#0B0B0E] p-4">
            <dt className="font-mono text-xs text-red-400">Jelenet-térkép</dt>
            <dd className="mt-1 text-zinc-300">
              Csak a már olvasott fejezeteket mutatja, hogy bármikor visszaugorhass egy elágazáshoz.
            </dd>
          </div>
          <div className="rounded-md border border-white/10 bg-[#0B0B0E] p-4">
            <dt className="font-mono text-xs text-red-400">Automatikus mentés és Új nyomozás</dt>
            <dd className="mt-1 text-zinc-300">
              A haladásod automatikusan mentődik ezen az eszközön, így onnan folytathatod,
              ahol abbahagytad. Az Új nyomozás gomb megerősítés után törli a játékmenetet és
              elölről indítja az esetet.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
