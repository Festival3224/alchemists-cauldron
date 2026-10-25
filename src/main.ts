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

let isStarting = false;

const animateGameStart = (): void => {
  if (isStarting) {
    return;
  }

  isStarting = true;

  const progress = app.querySelector<HTMLProgressElement>('.game-hud__progress');
  const startButton = app.querySelector<HTMLButtonElement>('[data-action="start"]');

  if (!progress) {
    startNewGame();
    renderApp();
    isStarting = false;
    return;
  }

  if (startButton) {
    startButton.disabled = true;
  }

  const duration = 600;
  const startTime = performance.now();

  const animate = (now: number): void => {
    const elapsed = Math.min((now - startTime) / duration, 1);
    const eased = 1 - (1 - elapsed) ** 3;

    progress.value = eased * LEVEL_ONE_CONFIG.startingTime;

    if (elapsed < 1) {
      requestAnimationFrame(animate);
      return;
    }

    startNewGame();
    renderApp();
    isStarting = false;
  };

  requestAnimationFrame(animate);
};

const renderPrimaryAction = (): string => {
  const isMenu = gameState.status === 'menu';
  const canBrew = gameState.status === 'playing' && gameState.cauldronIngredients.length > 0;

  return `
    <button
      class="cauldron__brew"
      type="button"
      data-action="${isMenu ? 'start' : 'brew'}"
      ${!isMenu && !canBrew ? 'disabled' : ''}
    >
      ${isMenu ? 'Start Game' : 'Brew'}
    </button>
  `;
};

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
      <header class="app-header">
        <h1>Alchemist's Cauldron</h1>

        <button
          class="app-menu-trigger"
          type="button"
          data-action="menu-open"
          aria-haspopup="dialog"
        >
          <span class="app-menu-trigger__label">Menu</span>

          <svg
            class="app-menu-trigger__ornaments"
            viewBox="0 0 180 70"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <!-- Outer frame -->
            <g class="frame-outer">
              <path d="M22 9 H158 M171 22 V48 M158 61 H22 M9 48 V22" />
            </g>

            <!-- Inner frame -->
            <g class="frame-inner">
              <path d="M22 12 H158 M168 22 V48 M158 58 H22 M12 48 V22" />
            </g>

            <!-- Four decorative stars -->
            <g class="frame-ornament">
              <path d="M15 9 Q16 14 21 15 Q16 16 15 21 Q14 16 9 15 Q14 14 15 9Z" />
              <path d="M165 9 Q166 14 171 15 Q166 16 165 21 Q164 16 159 15 Q164 14 165 9Z" />
              <path d="M15 49 Q16 54 21 55 Q16 56 15 61 Q14 56 9 55 Q14 54 15 49Z" />
              <path d="M165 49 Q166 54 171 55 Q166 56 165 61 Q164 56 159 55 Q164 54 165 49Z" />
            </g>
          </svg>
        </button>
      </header>

      ${renderGameHud()}

      <div class="game-layout">
        <div class="game-layout__shelf">
          ${renderShelf()}
        </div>

        <div class="game-layout__cauldron">
          ${renderCauldron(brewResult)}
        </div>

        <div class="game-layout__action">
          ${renderPrimaryAction()}
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

    <dialog class="menu-dialog" aria-labelledby="menu-dialog-title">
      <h2 id="menu-dialog-title">✦ Menu ✦</h2>

      <div class="menu-dialog__actions">
        <button type="button" disabled>          
          Help
          <small>Coming soon</small>
        </button>

        <button type="button" disabled>
          Settings
          <small>Coming soon</small>
        </button>

        <button type="button" data-action="leaderboard-open">          
         Leaderboard
        </button>
      </div>

      <button
        class="menu-dialog__close"
        type="button"
        data-action="menu-close"
      >
        Close
      </button>
    </dialog>

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
  app.querySelector<HTMLDialogElement>('.menu-dialog')?.close();
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
    gameState.status === 'playing' && gameState.timeLeft < TIMER_WARNING_THRESHOLD,
  );
};

app.addEventListener('click', (event: MouseEvent) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const openMenuButton = target.closest<HTMLButtonElement>('[data-action="menu-open"]');

  if (openMenuButton) {
    const dialog = app.querySelector<HTMLDialogElement>('.menu-dialog');
    dialog?.showModal();
    return;
  }

  const closeMenuButton = target.closest<HTMLButtonElement>('[data-action="menu-close"]');

  if (closeMenuButton) {
    app.querySelector<HTMLDialogElement>('.menu-dialog')?.close();
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
    animateGameStart();
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

    const primaryAction = app.querySelector<HTMLElement>('.game-layout__action');

    if (primaryAction) {
      primaryAction.innerHTML = renderPrimaryAction();
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
