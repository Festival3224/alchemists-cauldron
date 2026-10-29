export interface ILeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

import type { Difficulty } from '../types/game';

const STORAGE_KEYS: Record<Difficulty, string> = {
  easy: 'alchemists-cauldron-leaderboard-easy',
  medium: 'alchemists-cauldron-leaderboard',
  hard: 'alchemists-cauldron-leaderboard-hard',
};

const MAX_ENTRIES = 10;
export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 15;

const isLeaderboardEntry = (value: unknown): value is ILeaderboardEntry => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.name === 'string' &&
    typeof entry.score === 'number' &&
    Number.isFinite(entry.score) &&
    entry.score >= 0 &&
    typeof entry.date === 'string' &&
    !Number.isNaN(Date.parse(entry.date))
  );
};

const sortEntries = (entries: ILeaderboardEntry[]): ILeaderboardEntry[] =>
  entries
    .sort((a, b) => b.score - a.score || Date.parse(a.date) - Date.parse(b.date))
    .slice(0, MAX_ENTRIES);

export const validatePlayerName = (name: string): boolean => {
  const trimmedName = name.trim();

  return (
    trimmedName.length >= MIN_NAME_LENGTH &&
    trimmedName.length <= MAX_NAME_LENGTH &&
    /^[\p{L}\p{N} _-]+$/u.test(trimmedName)
  );
};

export const loadLeaderboard = (difficulty: Difficulty = 'medium'): ILeaderboardEntry[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS[difficulty]);

    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return sortEntries(parsed.filter(isLeaderboardEntry));
  } catch {
    return [];
  }
};

export const qualifiesForLeaderboard = (
  score: number,
  difficulty: Difficulty = 'medium',
): boolean => {
  if (!Number.isFinite(score) || score < 0) {
    return false;
  }

  const entries = loadLeaderboard(difficulty);

  return entries.length < MAX_ENTRIES || score > entries[entries.length - 1].score;
};

export const saveLeaderboardEntry = (
  name: string,
  score: number,
  difficulty: Difficulty = 'medium',
): boolean => {
  if (!validatePlayerName(name) || !Number.isFinite(score) || score < 0) {
    return false;
  }

  const entries = loadLeaderboard(difficulty);

  entries.push({
    name: name.trim(),
    score,
    date: new Date().toISOString(),
  });

  const updated = sortEntries(entries);

  try {
    localStorage.setItem(STORAGE_KEYS[difficulty], JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
};

export const clearLeaderboard = (difficulty: Difficulty = 'medium'): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEYS[difficulty]);
    return true;
  } catch {
    return false;
  }
};

export const formatLeaderboardDate = (date: string): string => {
  const parsedDate = new Date(date);

  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const year = parsedDate.getFullYear();
  const hours = String(parsedDate.getHours()).padStart(2, '0');
  const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};
