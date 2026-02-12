import { WakeUpRecord, GameType } from '../types';
import { APP_STORAGE_KEY } from '../constants';

const GOAL_STORAGE_KEY = 'rise_and_shine_goal';

export const getHistory = (): WakeUpRecord[] => {
  try {
    const data = localStorage.getItem(APP_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load history", error);
    return [];
  }
};

export const saveRecord = (gamePlayed: GameType): WakeUpRecord => {
  const history = getHistory();
  const newRecord: WakeUpRecord = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    gamePlayed,
  };
  
  const updatedHistory = [...history, newRecord];
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(updatedHistory));
  return newRecord;
};

export const removeTodaysRecord = (): void => {
  const history = getHistory();
  if (history.length === 0) return;

  const today = new Date().toDateString();
  const updatedHistory = history.filter(record => {
    return new Date(record.timestamp).toDateString() !== today;
  });
  
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(updatedHistory));
};

export const hasWokenUpToday = (): boolean => {
  const history = getHistory();
  if (history.length === 0) return false;

  const lastRecord = history[history.length - 1];
  const lastDate = new Date(lastRecord.timestamp).toDateString();
  const today = new Date().toDateString();

  return lastDate === today;
};

export const getTodaysRecord = (): WakeUpRecord | undefined => {
    const history = getHistory();
    if (history.length === 0) return undefined;
  
    const lastRecord = history[history.length - 1];
    const lastDate = new Date(lastRecord.timestamp).toDateString();
    const today = new Date().toDateString();
  
    return lastDate === today ? lastRecord : undefined;
}

export const getTargetTime = (): string => {
  return localStorage.getItem(GOAL_STORAGE_KEY) || "08:00";
};

export const saveTargetTime = (time: string): void => {
  localStorage.setItem(GOAL_STORAGE_KEY, time);
};