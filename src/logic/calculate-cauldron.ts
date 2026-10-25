import type { ICauldronValues, IIngredient } from '../types/game';

export const calculateCauldron = (ingredients: readonly IIngredient[]): ICauldronValues => {
  return ingredients.reduce<ICauldronValues>(
    (totals, ingredient) => ({
      temperature: totals.temperature + ingredient.temperature,
      density: totals.density + ingredient.density,
      magicPower: totals.magicPower + ingredient.magicPower,
    }),
    {
      temperature: 0,
      density: 0,
      magicPower: 0,
    },
  );
};
