export interface IIngredient {
  id: string;
  name: string;
  icon: string;
  temperature: number;
  density: number;
  magicPower: number;
}

export interface ICauldronValues {
  temperature: number;
  density: number;
  magicPower: number;
}

export type GameStatus = 'menu' | 'playing' | 'paused' | 'game-over';

export interface IGameState {
  status: GameStatus;
  cauldronIngredients: IIngredient[];
  shelfStock: Record<string, number>;
  activeRecipe: IRecipe | null;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface IRecipeRange {
  min: number;
  max: number;
}

export interface IRecipe {
  id: string;
  name: string;
  difficulty: Difficulty;
  temperature: IRecipeRange;
  density: IRecipeRange;
  magicPower: IRecipeRange;
}
