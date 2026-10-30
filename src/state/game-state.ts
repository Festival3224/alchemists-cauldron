import { INGREDIENTS } from '../data/ingredients';
import { createStock } from '../logic/stock';
import type { Difficulty, IGameState } from '../types/game';

import { getRandomRecipe } from '../logic/recipe-generator';
import { calculateCauldron } from '../logic/calculate-cauldron';
import { checkRecipe } from '../logic/check-recipe';

import { DIFFICULTY_SETTINGS, MILLISECONDS_PER_SECOND } from '../data/difficulty';
import { calculateTimeLeft } from '../logic/timer';

import { loadDifficulty, saveDifficulty } from '../storage/difficulty';

export type BrewResult = 'success' | 'failure' | 'unavailable';

import { saveGame, loadGame, clearSave } from '../storage/game-save';

export const gameState: IGameState = {
  status: 'menu',
  difficulty: loadDifficulty(),
  score: 0,
  timeLeft: 0,
  timerEndsAt: null,
  lives: 0,
  cauldronIngredients: [],
  shelfStock: {},
  activeRecipe: null,
};

const persistGame = (): void => {
  if (gameState.status !== 'playing' && gameState.status !== 'paused') {
    clearSave();
    return;
  }

  saveGame({
    difficulty: gameState.difficulty,
    score: gameState.score,
    timeLeft: gameState.timeLeft,
    lives: gameState.lives,
    activeRecipe: gameState.activeRecipe,
    cauldronIngredients: gameState.cauldronIngredients,
    shelfStock: gameState.shelfStock,
    status: gameState.status,
  });
};

export const setDifficulty = (difficulty: Difficulty): void => {
  if (gameState.status !== 'menu') {
    return;
  }

  gameState.difficulty = difficulty;
  saveDifficulty(difficulty);
};

export const continueGame = (): boolean => {
  const saved = loadGame();

  if (!saved) {
    return false;
  }

  gameState.difficulty = saved.difficulty;
  gameState.score = saved.score;
  gameState.timeLeft = saved.timeLeft;
  gameState.timerEndsAt = null;
  gameState.lives = saved.lives;
  gameState.cauldronIngredients = saved.cauldronIngredients;
  gameState.shelfStock = { ...saved.shelfStock };
  gameState.activeRecipe = saved.activeRecipe;

  gameState.status = 'paused';

  return true;
};

export const startNewGame = (): void => {
  const config = DIFFICULTY_SETTINGS[gameState.difficulty];

  gameState.status = 'playing';
  gameState.score = 0;
  gameState.timeLeft = config.startingTime;
  gameState.timerEndsAt = Date.now() + gameState.timeLeft * MILLISECONDS_PER_SECOND;
  gameState.lives = config.startingLives;
  gameState.cauldronIngredients = [];
  gameState.shelfStock = createStock(INGREDIENTS.slice(0, config.ingredientCount));
  gameState.activeRecipe = getRandomRecipe(gameState.difficulty);
  persistGame();
};

export const addIngredient = (id: string): boolean => {
  if (gameState.status !== 'playing') {
    return false;
  }

  const config = DIFFICULTY_SETTINGS[gameState.difficulty];

  if (gameState.cauldronIngredients.length >= config.maxCauldronIngredients) {
    return false;
  }

  const ingredient = INGREDIENTS.slice(0, config.ingredientCount).find((item) => item.id === id);

  if (!ingredient || (gameState.shelfStock[id] ?? 0) <= 0) {
    return false;
  }

  gameState.cauldronIngredients.push(ingredient);
  gameState.shelfStock[id] -= 1;

  persistGame();

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

  const config = DIFFICULTY_SETTINGS[gameState.difficulty];

  const values = calculateCauldron(gameState.cauldronIngredients);
  const isSuccessful = checkRecipe(values, gameState.activeRecipe, gameState.difficulty);

  gameState.cauldronIngredients = [];

  if (isSuccessful) {
    gameState.score += config.scorePerBrew;

    if (gameState.timerEndsAt !== null) {
      gameState.timeLeft = Math.min(
        calculateTimeLeft(gameState.timerEndsAt, Date.now()) + config.timeBonusPerBrew,
        config.startingTime,
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
    gameState.activeRecipe = getRandomRecipe(gameState.difficulty);
  }

  checkOutOfIngredients();
  persistGame();

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
  checkOutOfIngredients();

  if (gameState.status === 'game-over') {
    clearSave();
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
  persistGame();
};

export const resumeGame = (): void => {
  if (gameState.status !== 'paused') {
    return;
  }

  gameState.timerEndsAt = Date.now() + gameState.timeLeft * MILLISECONDS_PER_SECOND;

  gameState.status = 'playing';
  persistGame();
};

const checkOutOfIngredients = (): void => {
  if (gameState.status !== 'playing') {
    return;
  }

  const stockValues = Object.values(gameState.shelfStock);

  if (
    stockValues.length > 0 &&
    stockValues.every((quantity) => quantity === 0) &&
    gameState.cauldronIngredients.length === 0
  ) {
    gameState.status = 'game-over';
    gameState.timerEndsAt = null;
    gameState.activeRecipe = null;
  }
};

export const exitToMenu = (): void => {
  gameState.status = 'menu';
  gameState.score = 0;
  gameState.timeLeft = 0;
  gameState.timerEndsAt = null;
  gameState.lives = 0;
  gameState.cauldronIngredients = [];
  gameState.shelfStock = {};
  gameState.activeRecipe = null;
  clearSave();
};
