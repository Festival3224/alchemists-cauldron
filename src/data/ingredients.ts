import type { IIngredient } from '../types/game';

import dragonTearsImage from '../assets/image/dragons-tears.png';
import fairyDustImage from '../assets/image/fairy-dust-elf.png';
import frostLotusImage from '../assets/image/frost-lotus.png';
import mandrakeRootImage from '../assets/image/discord_newplant.svg';
import causticAcidImage from '../assets/image/caustic-acid.png';
import essenceOfVoidImage from '../assets/image/essence-of-void.png';

export const INGREDIENTS: IIngredient[] = [
  {
    id: 'dragon-tears',
    name: 'Dragon Tears',
    icon: '🐉',
    image: dragonTearsImage,
    temperature: 25,
    density: 8,
    magicPower: 10,
  },
  {
    id: 'fairy-dust',
    name: 'Fairy Dust',
    icon: '✨',
    image: fairyDustImage,
    temperature: 12,
    density: 9,
    magicPower: 12,
  },
  {
    id: 'frost-lotus',
    name: 'Frost Lotus',
    icon: '❄️',
    image: frostLotusImage,
    temperature: -18,
    density: 4,
    magicPower: 14,
  },
  {
    id: 'mandrake-root',
    name: 'Mandrake Root',
    icon: '🌿',
    image: mandrakeRootImage,
    temperature: -5,
    density: 20,
    magicPower: 8,
  },
  {
    id: 'caustic-acid',
    name: 'Caustic Acid',
    icon: '🧪',
    image: causticAcidImage,
    temperature: 10,
    density: 14,
    magicPower: 22,
  },
  {
    id: 'essence-of-the-void',
    name: 'Essence of the Void',
    icon: '🌌',
    image: essenceOfVoidImage,
    temperature: -20,
    density: -10,
    magicPower: 40,
  },
  {
    id: 'phoenix-feather',
    name: 'Phoenix Feather',
    icon: '🔥',
    temperature: 50,
    density: -10,
    magicPower: 30,
  },
  {
    id: 'toad-slime',
    name: 'Toad Slime',
    icon: '🐸',
    temperature: 5,
    density: 30,
    magicPower: 0,
  },
];
