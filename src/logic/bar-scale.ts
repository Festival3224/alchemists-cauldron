import type { IRecipeRange } from '../types/game';

const MIN_SCALE = 100;
const SCALE_STEP = 100;

export const getBarLimit = (value: number, range?: IRecipeRange): number => {
  const maximum = Math.max(
    Math.abs(value),
    Math.abs(range?.min ?? 0),
    Math.abs(range?.max ?? 0),
    MIN_SCALE,
  );

  return Math.ceil(maximum / SCALE_STEP) * SCALE_STEP;
};

export const getBarPosition = (value: number, limit: number): number => {
  const clampedValue = Math.max(-limit, Math.min(limit, value));

  return ((clampedValue + limit) / (limit * 2)) * 100;
};
