import { gameState } from '../state/game-state';

export const renderRecipe = (): string => {
  const recipe = gameState.activeRecipe;

  if (!recipe) {
    return '';
  }

  return `
    <section class="recipe" aria-labelledby="recipe-title">
      <h2 id="recipe-title">${recipe.name}</h2>

      <p class="recipe__difficulty">
        Difficulty: ${recipe.difficulty}
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
