import { LEVEL_ONE_RECIPE_TOLERANCE } from '../data/difficulty';
import type { ICauldronValues, IRecipe, IRecipeRange } from '../types/game';

const isWithinRange = (value: number, range: IRecipeRange, tolerance: number): boolean => {
  return value >= range.min - tolerance && value <= range.max + tolerance;
};

export const checkRecipe = (values: ICauldronValues, recipe: IRecipe): boolean => {
  return (
    isWithinRange(values.temperature, recipe.temperature, LEVEL_ONE_RECIPE_TOLERANCE) &&
    isWithinRange(values.density, recipe.density, LEVEL_ONE_RECIPE_TOLERANCE) &&
    isWithinRange(values.magicPower, recipe.magicPower, LEVEL_ONE_RECIPE_TOLERANCE)
  );
};
