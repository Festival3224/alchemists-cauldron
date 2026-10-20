import { INGREDIENTS } from '../data/ingredients';
import { createStock } from '../logic/stock';
import type { IGameState } from '../types/game';

import { LEVEL_ONE_CONFIG } from '../data/difficulty';

import { getRandomRecipe } from '../logic/recipe-generator';

export const gameState: IGameState = {
  status: 'menu',
  cauldronIngredients: [],
  shelfStock: {},
  activeRecipe: null,
};

export const startNewGame = (): void => {
  gameState.status = 'playing';
  gameState.cauldronIngredients = [];
  gameState.shelfStock = createStock(INGREDIENTS.slice(0, LEVEL_ONE_CONFIG.ingredientCount));
  gameState.activeRecipe = getRandomRecipe('medium');
};

export const addIngredient = (id: string): boolean => {
  if (gameState.status !== 'playing') {
    return false;
  }

  if (gameState.cauldronIngredients.length >= LEVEL_ONE_CONFIG.maxCauldronIngredients) {
    return false;
  }

  const ingredient = INGREDIENTS.slice(0, LEVEL_ONE_CONFIG.ingredientCount).find(
    (item) => item.id === id,
  );

  if (!ingredient || (gameState.shelfStock[id] ?? 0) <= 0) {
    return false;
  }

  gameState.cauldronIngredients.push(ingredient);
  gameState.shelfStock[id] -= 1;

  return true;
};
