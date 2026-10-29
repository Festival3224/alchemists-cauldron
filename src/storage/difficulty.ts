import type { Difficulty } from '../types/game';

const STORAGE_KEY = 'alchemists-cauldron-difficulty';

export const loadDifficulty = (): Difficulty => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === 'easy' || saved === 'medium' || saved === 'hard') {
      return saved;
    }
  } catch {
    // Fall back to the default difficulty.
  }

  return 'medium';
};

export const saveDifficulty = (difficulty: Difficulty): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, difficulty);
    return true;
  } catch {
    return false;
  }
};
