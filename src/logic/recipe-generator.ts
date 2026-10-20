import { RECIPES } from '../data/recipes';
import type { Difficulty, IRecipe } from '../types/game';

export const getRandomRecipe = (difficulty: Difficulty): IRecipe => {
  const availableRecipes = RECIPES.filter((recipe) => recipe.difficulty === difficulty);

  if (availableRecipes.length === 0) {
    throw new Error(`No recipes available for difficulty: ${difficulty}`);
  }

  const randomIndex = Math.floor(Math.random() * availableRecipes.length);

  return availableRecipes[randomIndex]!;
};
