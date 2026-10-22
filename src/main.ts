import './styles/main.scss';

import {
  addIngredient,
  brewPotion,
  gameState,
  startNewGame,
  updateTimer,
  pauseGame,
  resumeGame,
} from './state/game-state';
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
        gameState.status === 'game-over'
          ? `<div class="brew-message brew-message--failure" role="status">
              <strong>Game Over!</strong>
              <p>
                ${gameState.timeLeft === 0 ? "Time's up!" : "You've run out of lives."}
                Final score: ${gameState.score}
              </p>
              <button class="start-button" type="button" data-action="start">
                Play Again
              </button>
            </div>`
          : brewResult === 'success'
            ? '<p class="brew-message brew-message--success" role="status">Potion brewed successfully! +200 points</p>'
            : brewResult === 'failure'
              ? '<p class="brew-message brew-message--failure" role="status">Brewing failed! Lost 1 life.</p>'
              : ''
      }
    </main>
  `;
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

  const timeElement = app.querySelector<HTMLElement>(
    '.game-hud__item:nth-child(2) .game-hud__value',
  );

  if (timeElement) {
    timeElement.textContent = `${gameState.timeLeft}s`;
  }
};

app.addEventListener('click', (event: MouseEvent) => {
  const target = event.target;

  if (!(target instanceof Element)) {
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
