import { gameState } from '../state/game-state';
import { DIFFICULTY_SETTINGS } from '../data/difficulty';

import { translate } from '../i18n';

import { getIngredientName } from '../i18n/ingredients';

import cauldronImage from '../assets/image/cualdron.png';

import type { BrewResult } from '../state/game-state';

export const renderCauldron = (brewResult?: BrewResult): string => {
  const ingredients = gameState.cauldronIngredients;

  const maxIngredients = DIFFICULTY_SETTINGS[gameState.difficulty].maxCauldronIngredients;
  const slots = Array.from({ length: maxIngredients }, (_, index) => {
    const ingredient = ingredients[index];
    const ingredientName = ingredient ? getIngredientName(ingredient) : '';

    return ingredient
      ? `
        <li class="cauldron__slot cauldron__slot--filled"
            title="${ingredientName}">

          <span class="cauldron__slot-icon" aria-hidden="true">
            ${
              ingredient.image
                ? `<img
                    class="cauldron__slot-image"
                    src="${ingredient.image}"
                    alt=""
                  />`
                : ingredient.icon
            }
          </span>

          <span class="cauldron__slot-name">${ingredientName}</span>
        </li>
      `
      : `
        <li class="cauldron__slot cauldron__slot--empty"
            aria-label="${translate('emptyIngredientSlot')}"
          <span aria-hidden="true">✧</span>
        </li>
      `;
  }).join('');

  return `
    <section class="cauldron" aria-label="${translate('cauldron')}">

      <div class="cauldron__body">
        <div class="cauldron__scene ${brewResult ? `cauldron__scene--${brewResult}` : ''}">
          <div class="cauldron__visual">
            <img
              class="cauldron__image"
              src="${cauldronImage}"
              alt="${translate('magicalCauldron')}"
              width="1024"
              height="1024"
            />

            <div class="cauldron__magic" aria-hidden="true">
              <span class="cauldron__magic-bubble"></span>
              <span class="cauldron__magic-bubble"></span>
              <span class="cauldron__magic-bubble"></span>
              <span class="cauldron__magic-bubble"></span>
              <span class="cauldron__magic-bubble"></span>
            </div>
          </div>
        </div>

        <ol class="cauldron__slots" aria-label="${translate('ingredientsInCauldron')}">
          ${slots}
        </ol>

      </div>
    </section>
  `;
};
