# Smaragd és Hamu — Interaktív Noir Gamebook

Interaktív, 1940-es évekbeli klasszikus noir detektívregény (gamebook) React, TypeScript és Tailwind CSS alapokon. Egy eső áztatta nagyvárosi éjszakán vörös hajú idegen, egy zárható bőrtáska és egy eltűnt könyvelő ügyében kell döntéseket hoznod — minden választás új irányba viszi a nyomozást, vagy végzetes csapdába vezet.

**Élő verzió (GitHub Pages):** [https://xykz0.github.io/Smaragd-s-Hamu/](https://xykz0.github.io/Smaragd-s-Hamu/)

---

## Főbb jellemzők

- **100 fejezetes elágazó történet:** Öt felvonáson átívelő, körmentes döntési gráf (16 halálos zsákutcával és 5 eltérő végjátékkal).
- **100 egyedi noir illusztráció:** Mind a 100 fejezet saját, előre legenerált, nagy kontrasztú Sin City stílusú statikus képet használ, így futásidejű API-kulcs és külső szerver nélkül, azonnal betöltődik.
- **Nyomozói napló (30 nyom):** A fejezetek során megszerzett tárgyak, személyek, bizonyítékok és helyszínek automatikusan feloldódnak, és visszaugorhatsz arra a jelenetre, ahol rátaláltál a nyomra.
- **Jelenet-térkép:** Áttekintheted az eddig felfedezett fejezeteket, és közvetlenül visszaléphetsz egy korábbi elágazáshoz.
- **Billentyűzetes vezérlés:**
  - `1`–`4`: Választási lehetőség kiválasztása
  - `Backspace` vagy `←` (Balra nyíl): Visszalépés az előző döntési pontra
- **Automatikus mentés:** Az aktuális pozíció, a látogatott fejezetek és az összegyűjtött nyomok automatikusan mentésre kerülnek a böngésző `localStorage` tárhelyére.

---

## Technológiák

- **Frontend:** React 19, TypeScript
- **Build rendszer:** Vite 8
- **Stílus:** Tailwind CSS v4
- **Ikonok:** Lucide React
- **Fejlesztés (Vibe coding):** Google AI Studio / Gemini segítségével készült (kódolás, történetépítés és a 100 egyedi jelenetkép generálása)

---

## Helyi fejlesztés és build

### Előfeltételek

- Node.js 20+ (ajánlott: Node 22)
- npm

### Telepítés és futtatás

```bash
# Függőségek telepítése (a gyökérben lévő .npmrc kezeli a peer dependency beállítást)
npm install

# Fejlesztői szerver indítása (http://localhost:3000)
npm run dev
```

### Típusellenőrzés és produkciós build

```bash
# TypeScript típusellenőrzés
npm run lint

# Produkciós csomag elkészítése a dist/ mappába
npm run build

# Elkészült build helyi előnézete
npm run preview
```

---

## Projektstruktúra

```text
├── .github/workflows/deploy.yml   # Automatikus GitHub Pages build és deploy
├── .npmrc                         # legacy-peer-deps=true beállítás az npm installhoz
├── index.html                     # HTML belépési pont és betűtípusok
├── vite.config.ts                 # Vite konfiguráció (build esetén relatív './' bázisútvonal)
└── src/
    ├── App.tsx                    # Fő alkalmazásállapot, navigáció és localStorage mentés
    ├── types/
    │   └── gamebook.ts            # Scene, SceneChoice, EvidenceItem típusdefiníciók
    ├── data/
    │   ├── scenes.json            # A 100 fejezet teljes szövege és elágazási gráfja
    │   └── evidence.json          # A 30 megszerezhető nyom katalógusa
    ├── assets/
    │   ├── sceneImages.ts         # Mind a 100 fejezet 1-az-1-hez statikus képhozzárendelése
    │   └── images/                # A 100 egyedi, előre legenerált .jpg illusztráció
    └── components/
        ├── StoryPlayer.tsx        # Olvasónézet, választógombok és billentyűparancsok
        ├── SceneImagePlate.tsx    # Jelenetkép-keret és fejezetszámozás
        ├── SceneMapView.tsx       # Felfedezett fejezetek térképe
        ├── EvidenceLogView.tsx    # Nyomozói napló és szűrés kategóriák szerint
        ├── GuideView.tsx          # Játékos útmutató és irányítás
        └── ConfirmRestartModal.tsx# Megerősítő ablak új nyomozás indításához
```

---

## Saját történet készítése a motorral

A játék teljes tartalma adatvezérelt JSON-fájlokra épül, így a motor másik történethez is újrahasznosítható:

1. **Fejezetek (`src/data/scenes.json`):** Minden objektum tartalmaz egy egyedi `id`-t (a kezdőpont a `start`), egy `title` címet, a bekezdéseket `\n\n`-nel elválasztó `text` mezőt, opcionálisan az `evidenceUnlocked` tömböt és az `endingType` (`"dead_end"` vagy `"ending"`) jelölőt, valamint a `choices` tömböt (`text` és `nextScene`).
2. **Nyomok (`src/data/evidence.json`):** Itt sorolhatók fel a gyűjthető elemek (`id`, `title`, `category`, `summary`, `splashColor`).
3. **Képek (`src/assets/sceneImages.ts`):** A `SCENE_IMAGES` objektumban minden `scene.id`-hoz közvetlen statikus képimport rendelhető, így a `vite build` automatikusan becsomagolja az összes képet a végső csomagba.

---

## GitHub Pages telepítés

A repó tartalmazza a `.github/workflows/deploy.yml` munkafolyamatot, amely minden `main` vagy `master` ágra érkező push után:
1. Telepíti a függőségeket (`npm install`),
2. Lefuttatja a `npm run build` parancsot (a `vite.config.ts` relatív `./` útvonalakkal generálja a `dist/` könyvtárat),
3. Feltölti és publikálja a kész statikus oldalt a GitHub Pages környezetbe.
