import type { IIngredient } from '../types/game';

const MIN_STOCK = 2;
const MAX_STOCK = 15;

export const createStock = (ingredients: readonly IIngredient[]): Record<string, number> => {
  const stock: Record<string, number> = {};

  for (const ingredient of ingredients) {
    stock[ingredient.id] = Math.floor(Math.random() * (MAX_STOCK - MIN_STOCK + 1)) + MIN_STOCK;
  }

  return stock;
};
