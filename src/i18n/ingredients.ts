import { translate } from './index';
import type { TranslationKey } from './translations';
import type { IIngredient } from '../types/game';

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

export const getIngredientName = (ingredient: IIngredient): string => {
  const nameKey = INGREDIENT_NAME_KEYS[ingredient.id];

  return nameKey ? translate(nameKey) : ingredient.name;
};
