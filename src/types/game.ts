export interface IIngredient {
  id: string;
  name: string;
  icon: string;
  temperature: number;
  density: number;
  magicPower: number;
}

export type GameStatus = 'menu' | 'playing' | 'paused' | 'game-over';

export interface IGameState {
  status: GameStatus;
  cauldronIngredients: IIngredient[];
  shelfStock: Record<string, number>;
}
