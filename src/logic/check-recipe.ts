import { DIFFICULTY_SETTINGS } from '../data/difficulty';
import type { ICauldronValues, Difficulty, IRecipe, IRecipeRange } from '../types/game';

const isWithinRange = (value: number, range: IRecipeRange, tolerance: number): boolean => {
  return value >= range.min - tolerance && value <= range.max + tolerance;
};

export const checkRecipe = (
  values: ICauldronValues,
  recipe: IRecipe,
  difficulty: Difficulty,
): boolean => {
  const tolerance = DIFFICULTY_SETTINGS[difficulty].recipeTolerance;

  return (
    isWithinRange(values.temperature, recipe.temperature, tolerance) &&
    isWithinRange(values.density, recipe.density, tolerance) &&
    isWithinRange(values.magicPower, recipe.magicPower, tolerance)
  );
};
