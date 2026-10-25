import { gameState } from '../state/game-state';
import { LEVEL_ONE_CONFIG } from '../data/difficulty';

export const renderRecipe = (): string => {
  const recipe = gameState.activeRecipe;
  const ingredientCount = gameState.cauldronIngredients.length;
  const maxIngredients = LEVEL_ONE_CONFIG.maxCauldronIngredients;
  const isFull = ingredientCount >= maxIngredients;

  if (!recipe) {
    return `
    <section class="recipe recipe--empty" aria-labelledby="recipe-title">
      <h2 id="recipe-title">Current Recipe</h2>

      <p class="recipe__difficulty">
        Difficulty: Medium
      </p>

      <p
        class="recipe__counter"
        aria-label="Ingredients: 0 of ${maxIngredients}"
      >
        0 / ${maxIngredients}
      </p>

      <div class="recipe__ranges">
        <p>
          <span>Temperature:</span>
          <strong>—</strong>
        </p>

        <p>
          <span>Density:</span>
          <strong>—</strong>
        </p>

        <p>
          <span>Magic Power:</span>
          <strong>—</strong>
        </p>
      </div>
    </section>
  `;
  }

  return `
    <section class="recipe" aria-labelledby="recipe-title">
      <h2 id="recipe-title">${recipe.name}</h2>

      <p class="recipe__difficulty">
        Difficulty: ${recipe.difficulty}
      </p>

      <p
        class="recipe__counter ${isFull ? 'recipe__counter--full' : ''}"
        aria-live="polite"
        aria-label="Ingredients: ${ingredientCount} of ${maxIngredients}"
      >
         ${ingredientCount} / ${maxIngredients}
      </p>

      <div class="recipe__ranges">
        <p>
          <span>Temperature:</span>
          <strong>${recipe.temperature.min} to ${recipe.temperature.max}</strong>
        </p>

        <p>
          <span>Density:</span>
          <strong>${recipe.density.min} to ${recipe.density.max}</strong>
        </p>

        <p>
          <span>Magic Power:</span>
          <strong>${recipe.magicPower.min} to ${recipe.magicPower.max}</strong>
        </p>
      </div>
    </section>
  `;
};
