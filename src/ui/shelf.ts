import { INGREDIENTS } from '../data/ingredients';
import { gameState } from '../state/game-state';

import { LEVEL_ONE_CONFIG } from '../data/difficulty';

export const renderShelf = (): string => {
  const ingredients = INGREDIENTS.slice(0, LEVEL_ONE_CONFIG.ingredientCount);

  const isCauldronFull =
    gameState.cauldronIngredients.length >= LEVEL_ONE_CONFIG.maxCauldronIngredients;

  const cards = ingredients
    .map((ingredient) => {
      const stock = gameState.shelfStock[ingredient.id] ?? 0;
      const isEmpty = stock === 0;
      const isDisabled = isEmpty || isCauldronFull || gameState.status !== 'playing';

      return `
        <button
          class="ingredient-card ${isEmpty ? 'ingredient-card--empty' : ''}"
          type="button"
          data-ingredient-id="${ingredient.id}"
          ${isDisabled ? 'disabled' : ''}
        >
          <span class="ingredient-card__stock">${stock}</span>
          <span class="ingredient-card__icon" aria-hidden="true">
            ${isEmpty ? '' : ingredient.icon}
          </span>
          <span class="ingredient-card__name">
            ${isEmpty ? 'Empty' : ingredient.name}
          </span>
          ${
            isEmpty
              ? ''
              : `<span class="ingredient-card__values">
           <span class="ingredient-card__value">
             <span class="ingredient-card__label-desktop">Temp:</span>
             <span class="ingredient-card__label-mobile">T:</span>
             ${ingredient.temperature > 0 ? '+' : ''}${ingredient.temperature}
           </span>
           <span class="ingredient-card__value">
             <span class="ingredient-card__label-desktop">Density:</span>
             <span class="ingredient-card__label-mobile">D:</span>
             ${ingredient.density > 0 ? '+' : ''}${ingredient.density}
           </span>
           <span class="ingredient-card__value">
             <span class="ingredient-card__label-desktop">Magic:</span>
             <span class="ingredient-card__label-mobile">M:</span>
             ${ingredient.magicPower > 0 ? '+' : ''}${ingredient.magicPower}
           </span>
         </span>`
          }
        </button>
      `;
    })
    .join('');

  return `
    <section class="shelf" aria-labelledby="shelf-title">
      <h2 id="shelf-title">Ingredient Shelf</h2>
      <div class="shelf__grid">
        ${cards}
      </div>
    </section>
  `;
};
