import type { Difficulty } from '../types/game';

export const DIFFICULTY_SETTINGS = {
  easy: {
    ingredientCount: 4,
    maxCauldronIngredients: 4,
    startingTime: 180,
    startingLives: 5,
    scorePerBrew: 100,
    timeBonusPerBrew: 15,
    recipeTolerance: 12,
    reactionCount: 0,
  },
  medium: {
    ingredientCount: 6,
    maxCauldronIngredients: 4,
    startingTime: 150,
    startingLives: 3,
    scorePerBrew: 200,
    timeBonusPerBrew: 10,
    recipeTolerance: 8,
    reactionCount: 2,
  },
  hard: {
    ingredientCount: 8,
    maxCauldronIngredients: 5,
    startingTime: 150,
    startingLives: 3,
    scorePerBrew: 300,
    timeBonusPerBrew: 5,
    recipeTolerance: 5,
    reactionCount: 3,
  },
} as const satisfies Record<
  Difficulty,
  {
    ingredientCount: number;
    maxCauldronIngredients: number;
    startingTime: number;
    startingLives: number;
    scorePerBrew: number;
    timeBonusPerBrew: number;
    recipeTolerance: number;
    reactionCount: number;
  }
>;

export const MILLISECONDS_PER_SECOND = 1000;
export const TIMER_WARNING_THRESHOLD = 15;
export const SECONDS_PER_MINUTE = 60;
export const PERCENTAGE_MAX = 100;
