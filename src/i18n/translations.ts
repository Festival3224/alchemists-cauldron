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
};

export const translations = {
  en,
  ru,
  es,
};

export type Locale = keyof typeof translations;
