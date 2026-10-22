import './styles/main.scss';

import {
  addIngredient,
  brewPotion,
  gameState,
  startNewGame,
  updateTimer,
  pauseGame,
  resumeGame,
  exitToMenu,
} from './state/game-state';

import { formatTime } from './logic/timer';

import { renderCauldron } from './ui/cauldron';
import { renderShelf } from './ui/shelf';
import { renderBars, updateBars } from './ui/bars';
import { renderRecipe } from './ui/recipe';
import { renderGameHud } from './ui/game-hud';

import type { BrewResult } from './state/game-state';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Application root element not found');
}

const renderApp = (brewResult?: BrewResult): void => {
  const gameOverMarkup =
    gameState.status === 'game-over'
      ? `<dialog
          class="game-over"
          closedby="none"
          aria-labelledby="game-over-title"
         >
          <h2 id="game-over-title" tabindex="-1">Game Over!</h2>
          <p>${
            gameState.timeLeft === 0
              ? "Time's up!"
              : gameState.lives <= 0
                ? "You've run out of lives."
                : 'Out of ingredients.'
          }</p>

         <p class="game-over__score-label">Final Score</p>
         <strong class="game-over__score">${gameState.score}</strong>

         <button class="start-button" type="button" data-action="start">
           Play Again
         </button>

         <button
            class="game-over__menu-button"
            type="button"
            data-action="menu"
          >
            Main Menu
          </button>

       </dialog>`
      : '';

  app.innerHTML = `  
    <main class="app">
      <h1>Alchemist's Cauldron</h1>
      <p>A magical potion-brewing game.</p>

      ${renderGameHud()}

      ${
        gameState.status === 'menu'
          ? '<button class="start-button" type="button" data-action="start">Start Game</button>'
          : ''
      }

      <div class="game-layout">
        <div class="game-layout__shelf">
          ${renderShelf()}
        </div>

        <div class="game-layout__cauldron">
          ${renderCauldron()}
        </div>

        <div class="game-layout__recipe">
          ${renderRecipe()}
        </div>

        <div class="game-layout__bars">
          ${renderBars()}
        </div>
      </div>

      ${
        brewResult === 'success'
          ? '<p class="brew-message brew-message--success" role="status">Potion brewed successfully! +200 points</p>'
          : brewResult === 'failure'
            ? '<p class="brew-message brew-message--failure" role="status">Brewing failed! Lost 1 life.</p>'
            : ''
      }
    </main>
    ${gameOverMarkup}
  `;
  const gameOverDialog = app.querySelector<HTMLDialogElement>('.game-over');

  if (gameOverDialog) {
    gameOverDialog.addEventListener('cancel', (event) => {
      event.preventDefault();
    });

    gameOverDialog.showModal();
    gameOverDialog.querySelector<HTMLElement>('#game-over-title')?.focus();
  }
};

const refreshGameHud = (): void => {
  if (gameState.status !== 'playing') {
    return;
  }

  updateTimer();

  if (gameState.status !== 'playing') {
    renderApp();
    return;
  }

  const timeItem = app.querySelector<HTMLElement>('.game-hud__item--time');
  const timeElement = timeItem?.querySelector<HTMLElement>('.game-hud__value');
  const progress = timeItem?.querySelector<HTMLProgressElement>('.game-hud__progress');

  if (timeElement) {
    timeElement.textContent = formatTime(gameState.timeLeft);
  }

  if (progress) {
    progress.value = gameState.timeLeft;
  }

  timeItem?.classList.toggle('game-hud__item--urgent', gameState.timeLeft < 15);
};

app.addEventListener('click', (event: MouseEvent) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const menuButton = target.closest<HTMLButtonElement>('[data-action="menu"]');

  if (menuButton) {
    exitToMenu();
    renderApp();
    return;
  }

  const startButton = target.closest<HTMLButtonElement>('[data-action="start"]');

  if (startButton) {
    startNewGame();
    renderApp();
    return;
  }

  const pauseButton = target.closest<HTMLButtonElement>('[data-action="pause"]');

  if (pauseButton) {
    if (gameState.status === 'playing') {
      pauseGame();
    } else if (gameState.status === 'paused') {
      resumeGame();
    }

    renderApp();
    return;
  }

  const brewButton = target.closest<HTMLButtonElement>('[data-action="brew"]');

  if (brewButton) {
    if (brewButton.disabled) {
      return;
    }

    const result = brewPotion();

    if (result === 'unavailable') {
      return;
    }

    renderApp(result);
    return;
  }

  const ingredientButton = target.closest<HTMLButtonElement>('[data-ingredient-id]');

  if (!ingredientButton || ingredientButton.disabled) {
    return;
  }

  const ingredientId = ingredientButton.dataset.ingredientId;

  if (ingredientId && addIngredient(ingredientId)) {
    const shelf = app.querySelector('.shelf');
    const cauldron = app.querySelector('.cauldron');

    if (shelf) {
      shelf.outerHTML = renderShelf();
    }

    if (cauldron) {
      cauldron.outerHTML = renderCauldron();
    }

    const recipe = app.querySelector('.recipe');

    if (recipe) {
      recipe.outerHTML = renderRecipe();
    }

    updateBars();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && gameState.status === 'playing') {
    pauseGame();
    renderApp();
  }
});

renderApp();

const TIMER_REFRESH_INTERVAL = 250;

setInterval(refreshGameHud, TIMER_REFRESH_INTERVAL);
