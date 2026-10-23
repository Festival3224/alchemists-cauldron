import './styles/main.scss';

import { LEVEL_ONE_CONFIG, TIMER_WARNING_THRESHOLD } from './data/difficulty';

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

import {
  clearLeaderboard,
  qualifiesForLeaderboard,
  saveLeaderboardEntry,
  validatePlayerName,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
} from './storage/leaderboard';

import { renderLeaderboard, renderPlayerNameForm } from './ui/leaderboard';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Application root element not found');
}

let scoreSubmitted = false;

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

         ${!scoreSubmitted && qualifiesForLeaderboard(gameState.score) ? renderPlayerNameForm() : ''}

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

         <button
           class="game-over__menu-button"
           type="button"
           data-action="leaderboard-open"
      >
           Leaderboard
         </button> 

       </dialog>`
      : '';

  const pauseMarkup =
    gameState.status === 'paused'
      ? `<dialog class="pause-dialog" closedby="none" aria-labelledby="pause-title">
              <h2 id="pause-title">Game Paused</h2>
              <p>Your potion is waiting.</p>

              <button class="start-button" type="button" data-action="pause">
                Resume
              </button>

              <button class="pause-dialog__menu-button" type="button" data-action="menu">
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
          ? `<div class="menu-actions">
           <button class="start-button" type="button" data-action="start">
             Start Game
           </button>
           <button class="start-button" type="button" data-action="leaderboard-open">
             Leaderboard
           </button>
         </div>`
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
                ? `<p class="brew-message brew-message--success" role="status">
                    Potion brewed successfully! +${LEVEL_ONE_CONFIG.scorePerBrew} points
                  </p>`
                : brewResult === 'failure'
                  ? '<p class="brew-message brew-message--failure" role="status">Brewing failed! Lost 1 life.</p>'
                  : ''
            }
    </main>
    ${gameOverMarkup}
    ${pauseMarkup}
  `;
  const gameOverDialog = app.querySelector<HTMLDialogElement>('.game-over');

  if (gameOverDialog) {
    gameOverDialog.addEventListener('cancel', (event) => {
      event.preventDefault();
    });

    gameOverDialog.showModal();
    gameOverDialog.querySelector<HTMLElement>('#game-over-title')?.focus();
  }

  const pauseDialog = app.querySelector<HTMLDialogElement>('.pause-dialog');

  if (pauseDialog) {
    pauseDialog.addEventListener('cancel', (event) => {
      event.preventDefault();
    });

    pauseDialog.showModal();
    pauseDialog.querySelector<HTMLButtonElement>('[data-action="pause"]')?.focus();
  }
};

const openLeaderboard = (confirmClear = false): void => {
  const existingDialog = app.querySelector<HTMLDialogElement>('.leaderboard-dialog');

  if (existingDialog) {
    existingDialog.close();
    existingDialog.remove();
  }

  app.insertAdjacentHTML('beforeend', renderLeaderboard(confirmClear));

  const dialog = app.querySelector<HTMLDialogElement>('.leaderboard-dialog');

  if (!dialog) {
    return;
  }

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
  });

  dialog.showModal();
  dialog.querySelector<HTMLButtonElement>('button')?.focus();
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

  timeItem?.classList.toggle(
    'game-hud__item--urgent',
    gameState.timeLeft < TIMER_WARNING_THRESHOLD,
  );
};

app.addEventListener('click', (event: MouseEvent) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const leaderboardButton = target.closest<HTMLButtonElement>('[data-action^="leaderboard-"]');

  if (leaderboardButton) {
    switch (leaderboardButton.dataset.action) {
      case 'leaderboard-open':
        openLeaderboard();
        break;

      case 'leaderboard-close': {
        const dialog = app.querySelector<HTMLDialogElement>('.leaderboard-dialog');
        dialog?.close();
        dialog?.remove();
        break;
      }

      case 'leaderboard-clear':
        openLeaderboard(true);
        break;

      case 'leaderboard-cancel-clear':
        openLeaderboard();
        break;

      case 'leaderboard-confirm-clear':
        if (clearLeaderboard()) {
          openLeaderboard();
        } else {
          const confirmation = app.querySelector('.leaderboard-dialog__confirmation');
          confirmation?.insertAdjacentHTML(
            'beforeend',
            '<p role="alert">Could not clear the leaderboard.</p>',
          );
        }
        break;
    }

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
    scoreSubmitted = false;
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

app.addEventListener('submit', (event: SubmitEvent) => {
  const form = event.target;

  if (!(form instanceof HTMLFormElement) || form.dataset.form !== 'leaderboard-name') {
    return;
  }

  event.preventDefault();

  if (gameState.status !== 'game-over' || scoreSubmitted) {
    return;
  }

  const formData = new FormData(form);
  const name = String(formData.get('playerName') ?? '').trim();
  const errorElement = form.querySelector<HTMLElement>('.leaderboard-name-form__error');

  if (!validatePlayerName(name)) {
    if (errorElement) {
      errorElement.textContent = `Use ${MIN_NAME_LENGTH}-${MAX_NAME_LENGTH} characters: letters, numbers, spaces, _ or -.`;
    }

    return;
  }

  if (!saveLeaderboardEntry(name, gameState.score)) {
    if (errorElement) {
      errorElement.textContent = 'Could not save your score. Please try again.';
    }

    return;
  }

  scoreSubmitted = true;
  renderApp();
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
