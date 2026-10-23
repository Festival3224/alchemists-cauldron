import { getBarLimit, getBarPosition } from '../logic/bar-scale';
import { calculateCauldron } from '../logic/calculate-cauldron';
import { gameState } from '../state/game-state';
import type { ICauldronValues, IRecipeRange } from '../types/game';
import { LEVEL_ONE_RECIPE_TOLERANCE } from '../data/difficulty';

type ParameterKey = keyof ICauldronValues;

const PARAMETERS: { key: ParameterKey; label: string; icon: string }[] = [
  { key: 'temperature', label: 'Temperature', icon: '🌡️' },
  { key: 'density', label: 'Density', icon: '💧' },
  { key: 'magicPower', label: 'Magic Power', icon: '🪄' },
];

const isValueInRange = (value: number, range: IRecipeRange | undefined): boolean => {
  return range !== undefined && value >= range.min && value <= range.max;
};

const renderBar = (
  key: ParameterKey,
  label: string,
  icon: string,
  value: number,
  range: IRecipeRange | undefined,
): string => {
  const toleranceRange = range
    ? {
        min: range.min - LEVEL_ONE_RECIPE_TOLERANCE,
        max: range.max + LEVEL_ONE_RECIPE_TOLERANCE,
      }
    : undefined;

  const limit = getBarLimit(value, toleranceRange);

  const position = getBarPosition(value, limit);
  const rangeStart = range ? getBarPosition(range.min, limit) : 0;
  const rangeEnd = range ? getBarPosition(range.max, limit) : 0;
  const toleranceStart = toleranceRange ? getBarPosition(toleranceRange.min, limit) : 0;
  const toleranceEnd = toleranceRange ? getBarPosition(toleranceRange.max, limit) : 0;

  const isInRange = gameState.cauldronIngredients.length > 0 && isValueInRange(value, range);

  return `
    <div
      class="parameter-bar parameter-bar--${key} ${isInRange ? 'parameter-bar--success' : ''}"
      data-parameter="${key}"
    >
      <div class="parameter-bar__header">
        <span class="parameter-bar__label">
          <span class="parameter-bar__icon" aria-hidden="true">${icon}</span>
            ${label}
          </span>
        <span class="parameter-bar__value">${value}</span>
      </div>

      <div class="parameter-bar__track">
        ${
          toleranceRange
            ? `<span
                 class="parameter-bar__tolerance"
                 style="left: ${toleranceStart}%; width: ${toleranceEnd - toleranceStart}%"
                 aria-hidden="true"
               ></span>`
            : ''
        }

        ${
          range
            ? `<span
                class="parameter-bar__target"
                style="left: ${rangeStart}%; width: ${rangeEnd - rangeStart}%"
              ></span>`
            : ''
        }

        <span class="parameter-bar__zero"></span>

        <span
          class="parameter-bar__marker"
          style="left: ${position}%"
        ></span>
      </div>

      <div class="parameter-bar__scale">
        <span class="parameter-bar__min">${-limit}</span>
        <span>0</span>
        <span class="parameter-bar__max">+${limit}</span>
      </div>
    </div>
  `;
};

export const renderBars = (): string => {
  const values = calculateCauldron(gameState.cauldronIngredients);
  const recipe = gameState.activeRecipe;

  const bars = PARAMETERS.map(({ key, label, icon }) =>
    renderBar(key, label, icon, values[key], recipe?.[key]),
  ).join('');

  return `
    <section class="parameters" aria-labelledby="parameters-title">
      <h2 id="parameters-title">Cauldron Parameters</h2>
      <div class="parameters__list">
        ${bars}
      </div>

      <div class="parameters__legend" aria-label="Parameter bar legend">
        <span><i class="parameters__legend-exact"></i> Target range</span>
        <span><i class="parameters__legend-tolerance"></i> Tolerance ±8</span>
        <span><i class="parameters__legend-marker"></i> Current value</span>
      </div>

    </section>
  `;
};

export const updateBars = (): void => {
  const values = calculateCauldron(gameState.cauldronIngredients);
  const recipe = gameState.activeRecipe;

  for (const { key } of PARAMETERS) {
    const bar = document.querySelector<HTMLElement>(`[data-parameter="${key}"]`);

    if (!bar) {
      continue;
    }

    const value = values[key];
    const range = recipe?.[key];

    const toleranceRange = range
      ? {
          min: range.min - LEVEL_ONE_RECIPE_TOLERANCE,
          max: range.max + LEVEL_ONE_RECIPE_TOLERANCE,
        }
      : undefined;

    const limit = getBarLimit(value, toleranceRange);

    const marker = bar.querySelector<HTMLElement>('.parameter-bar__marker');
    const target = bar.querySelector<HTMLElement>('.parameter-bar__target');
    const tolerance = bar.querySelector<HTMLElement>('.parameter-bar__tolerance');
    const valueElement = bar.querySelector<HTMLElement>('.parameter-bar__value');
    const minElement = bar.querySelector<HTMLElement>('.parameter-bar__min');
    const maxElement = bar.querySelector<HTMLElement>('.parameter-bar__max');

    if (marker) {
      marker.style.left = `${getBarPosition(value, limit)}%`;
    }

    if (target && range) {
      const start = getBarPosition(range.min, limit);
      const end = getBarPosition(range.max, limit);

      target.style.left = `${start}%`;
      target.style.width = `${end - start}%`;
    }

    if (tolerance && toleranceRange) {
      const start = getBarPosition(toleranceRange.min, limit);
      const end = getBarPosition(toleranceRange.max, limit);

      tolerance.style.left = `${start}%`;
      tolerance.style.width = `${end - start}%`;
    }

    if (valueElement) {
      valueElement.textContent = String(value);
    }

    if (minElement) {
      minElement.textContent = String(-limit);
    }

    if (maxElement) {
      maxElement.textContent = `+${limit}`;
    }

    bar.classList.toggle(
      'parameter-bar--success',
      gameState.cauldronIngredients.length > 0 && isValueInRange(value, range),
    );
  }
};
