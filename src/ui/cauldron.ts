import { gameState } from '../state/game-state';
import { LEVEL_ONE_CONFIG } from '../data/difficulty';

import cauldronImage from '../assets/image/cualdron.png';

import type { BrewResult } from '../state/game-state';

export const renderCauldron = (brewResult?: BrewResult): string => {
  const ingredients = gameState.cauldronIngredients;

  const slots = Array.from({ length: LEVEL_ONE_CONFIG.maxCauldronIngredients }, (_, index) => {
    const ingredient = ingredients[index];

    return ingredient
      ? `
        <li class="cauldron__slot cauldron__slot--filled"
            title="${ingredient.name}">

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

          <span class="cauldron__slot-name">${ingredient.name}</span>
        </li>
      `
      : `
        <li class="cauldron__slot cauldron__slot--empty"
            aria-label="Empty ingredient slot">
          <span aria-hidden="true">✧</span>
        </li>
      `;
  }).join('');

  return `
    <section class="cauldron" aria-label="Cauldron">

      <div class="cauldron__body">
        <div class="cauldron__scene ${brewResult ? `cauldron__scene--${brewResult}` : ''}">
          <div class="cauldron__visual">
            <img
              class="cauldron__image"
              src="${cauldronImage}"
              alt="Magical cauldron filled with glowing purple potion"
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

        <ol class="cauldron__slots" aria-label="Ingredients in the cauldron">
          ${slots}
        </ol>

      </div>
    </section>
  `;
};
