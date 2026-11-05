const en = {
  menu: 'Menu',
  help: 'Help',
  settings: 'Settings',
  leaderboard: 'Leaderboard',
  close: 'Close',

  difficulty: 'Difficulty',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',

  language: 'Language',

  startGame: 'Start Game',
  startNewGame: 'Start New Game',
  continueGame: 'Continue Game',
  brew: 'Brew',
  pourOut: 'Pour Out',

  pause: 'Pause',
  resume: 'Resume',
  mainMenu: 'Main Menu',
  gameOver: 'Game Over!',
  playAgain: 'Play Again',
  score: 'Score',
  time: 'Time',
  lives: 'Lives',
  gameStatistics: 'Game statistics',
  remainingTime: 'Remaining time',
  livesRemaining: '{current} of {total} lives remaining',

  ingredientShelf: 'Ingredient Shelf',
  empty: 'Empty',
  temperature: 'Temperature',
  density: 'Density',
  magicPower: 'Magic Power',

  dragonTears: 'Dragon Tears',
  fairyDust: 'Fairy Dust',
  frostLotus: 'Frost Lotus',
  mandrakeRoot: 'Mandrake Root',
  causticAcid: 'Caustic Acid',
  essenceOfVoid: 'Essence of the Void',
  phoenixFeather: 'Phoenix Feather',
  toadSlime: 'Toad Slime',

  currentRecipe: 'Current Recipe',

  moonMist: 'Moon Mist',
  rootBloom: 'Root Bloom',
  frostSteam: 'Frost Steam',
  quietSwirl: 'Quiet Swirl',
  brightDew: 'Bright Dew',
  snowDust: 'Snow Dust',

  acidSpark: 'Acid Spark',
  voidEmber: 'Void Ember',
  heavyAcid: 'Heavy Acid',
  frostAcid: 'Frost Acid',
  dustyVoid: 'Dusty Void',
  dragonVoid: 'Dragon Void',
  rootedNight: 'Rooted Night',

  phoenixPulse: 'Phoenix Pulse',
  slimeCrown: 'Slime Crown',
  voidFlame: 'Void Flame',
  acidBog: 'Acid Bog',
  frozenAsh: 'Frozen Ash',
  tripleEclipse: 'Triple Eclipse',
  emberSoup: 'Ember Soup',
} as const;

export type TranslationKey = keyof typeof en;

const ru: Record<TranslationKey, string> = {
  menu: 'Меню',
  help: 'Помощь',
  settings: 'Настройки',
  leaderboard: 'Таблица рекордов',
  close: 'Закрыть',

  difficulty: 'Сложность',
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',

  language: 'Язык',

  startGame: 'Начать игру',
  startNewGame: 'Новая игра',
  continueGame: 'Продолжить игру',
  brew: 'Сварить зелье',
  pourOut: 'Вылить',

  pause: 'Пауза',
  resume: 'Продолжить',
  mainMenu: 'Главное меню',
  gameOver: 'Игра окончена!',
  playAgain: 'Играть снова',

  score: 'Очки',
  time: 'Время',
  lives: 'Жизни',
  gameStatistics: 'Игровая статистика',
  remainingTime: 'Оставшееся время',
  livesRemaining: 'Осталось жизней: {current} из {total}',

  ingredientShelf: 'Полка ингредиентов',
  empty: 'Пусто',
  temperature: 'Температура',
  density: 'Плотность',
  magicPower: 'Магическая сила',

  dragonTears: 'Слёзы дракона',
  fairyDust: 'Пыльца фей',
  frostLotus: 'Ледяной лотос',
  mandrakeRoot: 'Корень мандрагоры',
  causticAcid: 'Едкая кислота',
  essenceOfVoid: 'Сущность пустоты',
  phoenixFeather: 'Перо феникса',
  toadSlime: 'Жабья слизь',

  currentRecipe: 'Текущий рецепт',

  moonMist: 'Лунный туман',
  rootBloom: 'Цветение корней',
  frostSteam: 'Морозный пар',
  quietSwirl: 'Тихий вихрь',
  brightDew: 'Сияющая роса',
  snowDust: 'Снежная пыль',

  acidSpark: 'Кислотная искра',
  voidEmber: 'Уголёк пустоты',
  heavyAcid: 'Тяжёлая кислота',
  frostAcid: 'Ледяная кислота',
  dustyVoid: 'Пыльная пустота',
  dragonVoid: 'Драконья пустота',
  rootedNight: 'Ночь корней',

  phoenixPulse: 'Пульс феникса',
  slimeCrown: 'Корона слизи',
  voidFlame: 'Пламя пустоты',
  acidBog: 'Кислотная трясина',
  frozenAsh: 'Замёрзший пепел',
  tripleEclipse: 'Тройное затмение',
  emberSoup: 'Суп из угольков',
};

const es: Record<TranslationKey, string> = {
  menu: 'Menú',
  help: 'Ayuda',
  settings: 'Configuración',
  leaderboard: 'Clasificación',
  close: 'Cerrar',

  difficulty: 'Dificultad',
  easy: 'Fácil',
  medium: 'Medio',
  hard: 'Difícil',

  language: 'Idioma',

  startGame: 'Empezar partida',
  startNewGame: 'Nueva partida',
  continueGame: 'Continuar partida',
  brew: 'Preparar poción',
  pourOut: 'Vaciar',

  pause: 'Pausa',
  resume: 'Reanudar',
  mainMenu: 'Menú principal',
  gameOver: '¡Fin de la partida!',
  playAgain: 'Jugar de nuevo',
  score: 'Puntos',
  time: 'Tiempo',
  lives: 'Vidas',
  gameStatistics: 'Estadísticas de la partida',
  remainingTime: 'Tiempo restante',
  livesRemaining: 'Vidas restantes: {current} de {total}',

  ingredientShelf: 'Estante de ingredientes',
  empty: 'Vacío',
  temperature: 'Temperatura',
  density: 'Densidad',
  magicPower: 'Poder mágico',

  dragonTears: 'Lágrimas de dragón',
  fairyDust: 'Polvo de hadas',
  frostLotus: 'Loto de hielo',
  mandrakeRoot: 'Raíz de mandrágora',
  causticAcid: 'Ácido cáustico',
  essenceOfVoid: 'Esencia del vacío',
  phoenixFeather: 'Pluma de fénix',
  toadSlime: 'Baba de sapo',

  currentRecipe: 'Receta actual',

  moonMist: 'Niebla lunar',
  rootBloom: 'Floración de raíces',
  frostSteam: 'Vapor helado',
  quietSwirl: 'Remolino silencioso',
  brightDew: 'Rocío brillante',
  snowDust: 'Polvo de nieve',

  acidSpark: 'Chispa ácida',
  voidEmber: 'Brasa del vacío',
  heavyAcid: 'Ácido pesado',
  frostAcid: 'Ácido helado',
  dustyVoid: 'Vacío polvoriento',
  dragonVoid: 'Vacío del dragón',
  rootedNight: 'Noche de raíces',

  phoenixPulse: 'Pulso del fénix',
  slimeCrown: 'Corona de baba',
  voidFlame: 'Llama del vacío',
  acidBog: 'Pantano ácido',
  frozenAsh: 'Ceniza helada',
  tripleEclipse: 'Triple eclipse',
  emberSoup: 'Sopa de brasas',
};

export const translations = {
  en,
  ru,
  es,
};

export type Locale = keyof typeof translations;
