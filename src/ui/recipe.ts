import { gameState } from '../state/game-state';
import { DIFFICULTY_SETTINGS } from '../data/difficulty';

import { translate } from '../i18n';
import type { TranslationKey } from '../i18n/translations';

const RECIPE_NAME_KEYS: Record<string, TranslationKey> = {
  'moon-mist': 'moonMist',
  'root-bloom': 'rootBloom',
  'frost-steam': 'frostSteam',
  'quiet-swirl': 'quietSwirl',
  'bright-dew': 'brightDew',
  'snow-dust': 'snowDust',

  'acid-spark': 'acidSpark',
  'void-ember': 'voidEmber',
  'heavy-acid': 'heavyAcid',
  'frost-acid': 'frostAcid',
  'dusty-void': 'dustyVoid',
  'dragon-void': 'dragonVoid',
  'rooted-night': 'rootedNight',

  'phoenix-pulse': 'phoenixPulse',
  'slime-crown': 'slimeCrown',
  'void-flame': 'voidFlame',
  'acid-bog': 'acidBog',
  'frozen-ash': 'frozenAsh',
  'triple-eclipse': 'tripleEclipse',
  'ember-soup': 'emberSoup',
};

export const renderRecipe = (): string => {
  const recipe = gameState.activeRecipe;

  const recipeNameKey = recipe ? RECIPE_NAME_KEYS[recipe.id] : undefined;
  const recipeName = recipeNameKey ? translate(recipeNameKey) : recipe?.name;

  const ingredientCount = gameState.cauldronIngredients.length;
  const maxIngredients = DIFFICULTY_SETTINGS[gameState.difficulty].maxCauldronIngredients;
  const isFull = ingredientCount >= maxIngredients;

  if (!recipe) {
    return `
    <section class="recipe recipe--empty" aria-labelledby="recipe-title">
      <h2 id="recipe-title">${translate('currentRecipe')}</h2>

      <p class="recipe__difficulty">
        ${translate('difficulty')}: ${translate(gameState.difficulty)}
      </p>

      <p
        class="recipe__counter"
        aria-label="${translate('ingredientsCount')}: 0 / ${maxIngredients}"
      >
        0 / ${maxIngredients}
      </p>

      <div class="recipe__ranges">
        <p>
          <span>${translate('temperature')}:</span>
          <strong>—</strong>
        </p>

        <p>
          <span>${translate('density')}:</span>
          <strong>—</strong>
        </p>

        <p>
          <span>${translate('magicPower')}:</span>
          <strong>—</strong>
        </p>
      </div>
    </section>
  `;
  }

  return `
    <section class="recipe" aria-labelledby="recipe-title">
      <h2 id="recipe-title">${recipeName}</h2>

      <p class="recipe__difficulty">
        ${translate('difficulty')}: ${translate(recipe.difficulty)}
      </p>

      <p
        class="recipe__counter ${isFull ? 'recipe__counter--full' : ''}"
        aria-live="polite"
        aria-label="${translate('ingredientsCount')}: ${ingredientCount} / ${maxIngredients}"
      >
         ${ingredientCount} / ${maxIngredients}
      </p>

      <div class="recipe__ranges">
        <p>
          <span>${translate('temperature')}:</span>
          <strong>${recipe.temperature.min} … ${recipe.temperature.max}</strong>
        </p>

        <p>
          <span>${translate('density')}:</span>
          <strong>${recipe.density.min} … ${recipe.density.max}</strong>
        </p>

        <p>
          <span>${translate('magicPower')}:</span>
          <strong>${recipe.magicPower.min} … ${recipe.magicPower.max}</strong>
        </p>
      </div>
    </section>
  `;
};
