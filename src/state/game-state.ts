import { INGREDIENTS } from '../data/ingredients';
import { createStock } from '../logic/stock';
import type { IGameState } from '../types/game';

import { getRandomRecipe } from '../logic/recipe-generator';
import { calculateCauldron } from '../logic/calculate-cauldron';
import { checkRecipe } from '../logic/check-recipe';

import { LEVEL_ONE_CONFIG, MILLISECONDS_PER_SECOND } from '../data/difficulty';
import { calculateTimeLeft } from '../logic/timer';

export type BrewResult = 'success' | 'failure' | 'unavailable';

export const gameState: IGameState = {
  status: 'menu',
  score: 0,
  timeLeft: 0,
  timerEndsAt: null,
  lives: 0,
  cauldronIngredients: [],
  shelfStock: {},
  activeRecipe: null,
};

export const startNewGame = (): void => {
  gameState.status = 'playing';
  gameState.score = 0;
  gameState.timeLeft = LEVEL_ONE_CONFIG.startingTime;
  gameState.timerEndsAt = Date.now() + gameState.timeLeft * MILLISECONDS_PER_SECOND;
  gameState.lives = LEVEL_ONE_CONFIG.startingLives;
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

export const brewPotion = (): BrewResult => {
  updateTimer();

  if (
    gameState.status !== 'playing' ||
    !gameState.activeRecipe ||
    gameState.cauldronIngredients.length === 0
  ) {
    return 'unavailable';
  }

  const values = calculateCauldron(gameState.cauldronIngredients);
  const isSuccessful = checkRecipe(values, gameState.activeRecipe);

  gameState.cauldronIngredients = [];

  if (isSuccessful) {
    gameState.score += LEVEL_ONE_CONFIG.scorePerBrew;

    if (gameState.timerEndsAt !== null) {
      gameState.timeLeft = Math.min(
        calculateTimeLeft(gameState.timerEndsAt, Date.now()) + LEVEL_ONE_CONFIG.timeBonusPerBrew,
        LEVEL_ONE_CONFIG.startingTime,
      );

      gameState.timerEndsAt = Date.now() + gameState.timeLeft * MILLISECONDS_PER_SECOND;
    }
  } else {
    gameState.lives -= 1;
  }

  if (gameState.lives <= 0) {
    gameState.status = 'game-over';
    gameState.timerEndsAt = null;
    gameState.activeRecipe = null;
  } else if (isSuccessful) {
    gameState.activeRecipe = getRandomRecipe('medium');
  }

  return isSuccessful ? 'success' : 'failure';
};

export const updateTimer = (): void => {
  if (gameState.status !== 'playing' || gameState.timerEndsAt === null) {
    return;
  }

  gameState.timeLeft = calculateTimeLeft(gameState.timerEndsAt, Date.now());

  if (gameState.timeLeft === 0) {
    gameState.status = 'game-over';
    gameState.timerEndsAt = null;
    gameState.activeRecipe = null;
  }
};

export const pauseGame = (): void => {
  if (gameState.status !== 'playing') {
    return;
  }

  updateTimer();

  if (gameState.status !== 'playing') {
    return;
  }

  gameState.timerEndsAt = null;
  gameState.status = 'paused';
};

export const resumeGame = (): void => {
  if (gameState.status !== 'paused') {
    return;
  }

  gameState.timerEndsAt = Date.now() + gameState.timeLeft * MILLISECONDS_PER_SECOND;

  gameState.status = 'playing';
};
