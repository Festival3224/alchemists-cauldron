export const LEVEL_ONE_CONFIG = {
  ingredientCount: 6,
  maxCauldronIngredients: 4,
  startingTime: 150,
  startingLives: 3,
  scorePerBrew: 200,
  timeBonusPerBrew: 10,
  recipeTolerance: 8,
} as const;

export const LEVEL_ONE_RECIPE_TOLERANCE = LEVEL_ONE_CONFIG.recipeTolerance;
export const MILLISECONDS_PER_SECOND = 1000;

export const TIMER_WARNING_THRESHOLD = 15;
export const SECONDS_PER_MINUTE = 60;
export const PERCENTAGE_MAX = 100;
