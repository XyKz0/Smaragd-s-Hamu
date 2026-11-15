export interface SceneChoice {
  text: string;
  nextScene: string;
}

export interface Scene {
  id: string;
  title: string;
  text: string;
  imagePrompt: string;
  evidenceUnlocked?: string[];
  endingType?: 'dead_end' | 'ending';
  choices: SceneChoice[];
}

export type EvidenceCategory = 'targy' | 'szemely' | 'bizonyitek' | 'helyszin';

export interface EvidenceItem {
  id: string;
  title: string;
  category: EvidenceCategory;
  summary: string;
  splashColor: 'red' | 'amber' | 'emerald';
}

export type AppView = 'play' | 'map' | 'log' | 'guide';
