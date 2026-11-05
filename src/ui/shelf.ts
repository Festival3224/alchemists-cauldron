import { INGREDIENTS } from '../data/ingredients';
import { gameState } from '../state/game-state';

import { DIFFICULTY_SETTINGS } from '../data/difficulty';

import { translate } from '../i18n';
import type { TranslationKey } from '../i18n/translations';

const INGREDIENT_NAME_KEYS: Record<string, TranslationKey> = {
  'dragon-tears': 'dragonTears',
  'fairy-dust': 'fairyDust',
  'frost-lotus': 'frostLotus',
  'mandrake-root': 'mandrakeRoot',
  'caustic-acid': 'causticAcid',
  'essence-of-the-void': 'essenceOfVoid',
  'phoenix-feather': 'phoenixFeather',
  'toad-slime': 'toadSlime',
};

const formatIngredientValue = (value: number): string => {
  if (value > 0) return `+${value}`;
  if (value < 0) return `−${Math.abs(value)}`;
  return '0';
};

export const renderShelf = (): string => {
  const config = DIFFICULTY_SETTINGS[gameState.difficulty];

  const ingredients = INGREDIENTS.slice(0, config.ingredientCount);

  const isCauldronFull = gameState.cauldronIngredients.length >= config.maxCauldronIngredients;

  const cards = ingredients
    .map((ingredient) => {
      const stock = gameState.shelfStock[ingredient.id] ?? 0;
      const isEmpty = stock === 0;
      const isDisabled = isEmpty || isCauldronFull || gameState.status !== 'playing';

      const nameKey = INGREDIENT_NAME_KEYS[ingredient.id];
      const ingredientName = nameKey ? translate(nameKey) : ingredient.name;

      return `
        <button
          class="ingredient-card ${isEmpty ? 'ingredient-card--empty' : ''}"
          type="button"
          data-ingredient-id="${ingredient.id}"
          draggable="${!isDisabled}"
          ${!isEmpty ? `aria-describedby="tooltip-${ingredient.id}"` : ''}
          ${isDisabled ? 'disabled' : ''}
        >
          <span class="ingredient-card__stock">${stock}</span>

          <span class="ingredient-card__icon" aria-hidden="true">
            ${
              isEmpty
                ? ''
                : ingredient.image
                  ? `<img
                      class="ingredient-card__image"
                      src="${ingredient.image}"
                      alt=""
                    />`
                  : ingredient.icon
            }
          </span>

          <span class="ingredient-card__name">
            ${isEmpty ? translate('empty') : ingredientName}
          </span>
          
          ${
            isEmpty
              ? ''
              : `<span class="ingredient-tooltip" id="tooltip-${ingredient.id}" role="tooltip">
                  <span class="ingredient-tooltip__title">${ingredientName}</span>
                  <span>${translate('temperature')}: ${formatIngredientValue(ingredient.temperature)}</span>
                  <span>${translate('density')}: ${formatIngredientValue(ingredient.density)}</span>
                  <span>${translate('magicPower')}: ${formatIngredientValue(ingredient.magicPower)}</span>
                </span>`
          }

        </button>
      `;
    })
    .join('');

  return `
    <section class="shelf" aria-labelledby="shelf-title">
      <h2 id="shelf-title">${translate('ingredientShelf')}</h2>
      <div class="shelf__grid">
        ${cards}
      </div>
    </section>
  `;
};
