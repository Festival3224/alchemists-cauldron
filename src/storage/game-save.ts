import type { ISavedGame } from '../types/game';

import { INGREDIENTS } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import { DIFFICULTY_SETTINGS } from '../data/difficulty';

const STORAGE_KEY = 'alchemists-cauldron-save';

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const hasValidSaveMetadata = (data: unknown): boolean => {
  if (!isRecord(data)) {
    return false;
  }

  const { difficulty, status, score, timeLeft, lives } = data;

  if (difficulty !== 'easy' && difficulty !== 'medium' && difficulty !== 'hard') {
    return false;
  }

  if (status !== 'playing' && status !== 'paused') {
    return false;
  }

  const config = DIFFICULTY_SETTINGS[difficulty];

  return (
    typeof score === 'number' &&
    Number.isSafeInteger(score) &&
    score >= 0 &&
    typeof timeLeft === 'number' &&
    Number.isInteger(timeLeft) &&
    timeLeft > 0 &&
    timeLeft <= config.startingTime &&
    typeof lives === 'number' &&
    Number.isInteger(lives) &&
    lives > 0 &&
    lives <= config.startingLives
  );
};

const isValidSave = (data: unknown): data is ISavedGame => {
  if (!hasValidSaveMetadata(data) || !isRecord(data)) {
    return false;
  }

  const { difficulty, activeRecipe, cauldronIngredients, shelfStock } = data;

  if (difficulty !== 'easy' && difficulty !== 'medium' && difficulty !== 'hard') {
    return false;
  }

  const config = DIFFICULTY_SETTINGS[difficulty];
  const availableIngredients = INGREDIENTS.slice(0, config.ingredientCount);

  // Validate the active recipe.
  if (!isRecord(activeRecipe)) {
    return false;
  }

  const recipe = RECIPES.find(
    (item) => item.id === activeRecipe.id && item.difficulty === difficulty,
  );

  if (!recipe) {
    return false;
  }

  // Validate cauldron ingredients.
  if (
    !Array.isArray(cauldronIngredients) ||
    cauldronIngredients.length > config.maxCauldronIngredients
  ) {
    return false;
  }

  const validCauldron = cauldronIngredients.every(
    (ingredient: unknown) =>
      isRecord(ingredient) && availableIngredients.some((item) => item.id === ingredient.id),
  );

  if (!validCauldron) {
    return false;
  }

  // Validate shelf stock.
  if (!isRecord(shelfStock)) {
    return false;
  }

  const allowedIds = availableIngredients.map((ingredient) => ingredient.id);

  if (
    Object.keys(shelfStock).length !== allowedIds.length ||
    !Object.keys(shelfStock).every((id) => allowedIds.includes(id))
  ) {
    return false;
  }

  return allowedIds.every((id) => {
    const quantity = shelfStock[id];

    return (
      typeof quantity === 'number' && Number.isInteger(quantity) && quantity >= 0 && quantity <= 15
    );
  });
};

export const saveGame = (state: ISavedGame): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
};

export const loadGame = (): ISavedGame | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return null;
    }

    const parsed: unknown = JSON.parse(saved);

    if (!isValidSave(parsed)) {
      clearSave();
      return null;
    }

    const config = DIFFICULTY_SETTINGS[parsed.difficulty];
    const availableIngredients = INGREDIENTS.slice(0, config.ingredientCount);

    const recipe = RECIPES.find((item) => item.id === parsed.activeRecipe!.id);

    if (!recipe) {
      clearSave();
      return null;
    }

    return {
      difficulty: parsed.difficulty,
      score: parsed.score,
      timeLeft: parsed.timeLeft,
      lives: parsed.lives,
      status: parsed.status,
      activeRecipe: recipe,
      cauldronIngredients: parsed.cauldronIngredients.map((ingredient) =>
        availableIngredients.find((item) => item.id === ingredient.id)!,
      ),
      shelfStock: parsed.shelfStock,
    };
  } catch {
    return null;
  }
};

export const clearSave = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
};
