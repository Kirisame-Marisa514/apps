export interface WakeUpRecord {
  id: string;
  timestamp: string; // ISO string
  gamePlayed: GameType;
}

export enum GameType {
  MATH = 'MATH',
  MEMORY = 'MEMORY',
  RIDDLE = 'RIDDLE',
  COLOR_MATCH = 'COLOR_MATCH',
  WORD_SCRAMBLE = 'WORD_SCRAMBLE',
}

export interface GameProps {
  onComplete: () => void;
  onFailure: () => void;
}

export interface RiddleData {
  question: string;
  options: string[];
  answer: string;
}

export type Language = 'en' | 'zh';