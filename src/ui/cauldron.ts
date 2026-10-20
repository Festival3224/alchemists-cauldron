import { gameState } from '../state/game-state';

import { LEVEL_ONE_CONFIG } from '../data/difficulty';

export const renderCauldron = (): string => {
  const ingredients = gameState.cauldronIngredients;

  const content =
    ingredients.length === 0
      ? '<p class="cauldron__empty">The cauldron is empty</p>'
      : ingredients
          .map(
            (ingredient) => `
              <li class="cauldron__ingredient">
                <span class="cauldron__icon" aria-hidden="true">
                  ${ingredient.icon}
                </span>
                <span class="cauldron__name">
                  ${ingredient.name}
                </span>
              </li>
            `,
          )
          .join('');

  return `
    <section class="cauldron" aria-labelledby="cauldron-title">
      <h2 id="cauldron-title">Cauldron</h2>

      <div class="cauldron__body">
        <div class="cauldron__header">
          <span class="cauldron__counter">
            ${ingredients.length} / ${LEVEL_ONE_CONFIG.maxCauldronIngredients}
          </span>
        </div>

        ${ingredients.length === 0 ? content : `<ol class="cauldron__list">${content}</ol>`}
      </div>
    </section>
  `;
};
