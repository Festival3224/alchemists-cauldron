import './styles/main.scss';

import { renderLanguageSwitcher } from './ui/language-switcher';
import { getLocale, setLocale, translate } from './i18n';
import type { TranslationKey } from './i18n/translations';

import { DIFFICULTY_SETTINGS, TIMER_WARNING_THRESHOLD } from './data/difficulty';

import {
  activateGameTimer,
  addIngredient,
  brewPotion,
  pourOut,
  continueGame,
  gameState,
  startNewGame,
  updateTimer,
  pauseGame,
  resumeGame,
  exitToMenu,
  setDifficulty,
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

import { loadGame } from './storage/game-save';

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

  // Prepare the game without starting the countdown.
  startNewGame(false);

  app.classList.add('game-starting');
  renderApp();

  const progress = app.querySelector<HTMLProgressElement>('.game-hud__progress');

  if (!progress) {
    app.classList.remove('game-starting');
    activateGameTimer();
    isStarting = false;
    return;
  }

  progress.value = 0;

  const duration = 600;
  const startTime = performance.now();

  const animate = (now: number): void => {
    // Do not start the timer if the game was paused or exited.
    if (gameState.status !== 'playing') {
      app.classList.remove('game-starting');
      isStarting = false;
      return;
    }

    const elapsed = Math.min((now - startTime) / duration, 1);
    const eased = 1 - (1 - elapsed) ** 3;

    progress.value = eased * DIFFICULTY_SETTINGS[gameState.difficulty].startingTime;

    if (elapsed < 1) {
      requestAnimationFrame(animate);
      return;
    }

    app.classList.remove('game-starting');
    activateGameTimer();
    isStarting = false;
  };

  requestAnimationFrame(animate);
};

const renderPrimaryAction = (): string => {
  const isMenu = gameState.status === 'menu';
  const isPlaying = gameState.status === 'playing';
  const hasIngredients = gameState.cauldronIngredients.length > 0;

  if (isMenu && loadGame()) {
    return `
      <div class="game-layout__start-actions">
        <button
          class="cauldron__brew"
          type="button"
          data-action="continue"
          data-i18n="continueGame"
        >
          ${translate('continueGame')}
        </button>

        <button class="cauldron__brew" type="button" data-action="start" data-i18n="startNewGame">
          ${translate('startNewGame')}
        </button>
      </div>
    `;
  }

  if (isMenu) {
    return `
      <button class="cauldron__brew" type="button" data-action="start" data-i18n="startGame">
        ${translate('startGame')}
      </button>
    `;
  }

  return `
    <div class="game-layout__brew-actions">
      <button
        class="cauldron__brew"
        type="button"
        data-action="brew"
        data-i18n="brew"
        ${!isPlaying || !hasIngredients ? 'disabled' : ''}
      >
        ${translate('brew')}
      </button>

      <button
        class="cauldron__pour-out"
        type="button"
        data-action="pour-out"
        data-i18n="pourOut"
        ${!isPlaying || !hasIngredients ? 'disabled' : ''}
      >
        ${translate('pourOut')}
      </button>
    </div>
  `;
};

const renderHelpAction = (
  textKey: 'helpStart' | 'helpBrew' | 'helpPause',
  actionKey: 'startGame' | 'brew' | 'pause',
): string => {
  const [before, after] = translate(textKey).split('{action}');

  return `${before}<strong class="help-dialog__action">${translate(actionKey)}</strong>${after}`;
};

const renderApp = (brewResult?: BrewResult): void => {
  const gameOverReasonKey: TranslationKey =
    gameState.timeLeft === 0 ? 'timeUp' : gameState.lives <= 0 ? 'outOfLives' : 'outOfIngredients';

  const gameOverMarkup =
    gameState.status === 'game-over'
      ? `<dialog
          class="game-over"
          closedby="none"
          aria-labelledby="game-over-title"
         >
          <h2 id="game-over-title" tabindex="-1" data-i18n="gameOver">
            ${translate('gameOver')}
          </h2>
          <p data-i18n="${gameOverReasonKey}">
            ${translate(gameOverReasonKey)}
          </p>

         <p class="game-over__score-label" data-i18n="finalScore">
            ${translate('finalScore')}
         </p>
         <strong class="game-over__score">${gameState.score}</strong>

         ${!scoreSubmitted && qualifiesForLeaderboard(gameState.score, gameState.difficulty) ? renderPlayerNameForm() : ''}

         <button class="start-button" type="button" data-action="start" data-i18n="playAgain">
           ${translate('playAgain')}
         </button>

         <button
            class="game-over__menu-button"
            type="button"
            data-action="menu"
            data-i18n="mainMenu"
          >
            ${translate('mainMenu')}
          </button>

         <button
           class="game-over__menu-button"
           type="button"
           data-action="leaderboard-open"
           data-i18n="leaderboard"
          >
            ${translate('leaderboard')}
         </button> 

       </dialog>`
      : '';

  const pauseMarkup =
    gameState.status === 'paused'
      ? `<dialog class="pause-dialog" closedby="none" aria-labelledby="pause-title">
        <h2 id="pause-title" data-i18n="gamePaused">
          ${translate('gamePaused')}
        </h2>

        <p data-i18n="potionWaiting">
          ${translate('potionWaiting')}
        </p>

        <button
          class="start-button"
          type="button"
          data-action="pause"
          data-i18n="resume"
        >
          ${translate('resume')}
        </button>

        <button
          class="pause-dialog__menu-button"
          type="button"
          data-action="menu"
          data-i18n="mainMenu"
        >
          ${translate('mainMenu')}
        </button>
      </dialog>`
      : '';

  app.innerHTML = `  
    <main class="app">
      <header class="app-header">
        <h1>Alchemist's Cauldron</h1>

        <div class="app-header__controls">
          ${renderLanguageSwitcher()}


          <button
            class="app-menu-trigger"
            type="button"
            data-action="menu-open"
            aria-haspopup="dialog"
            aria-label="Open menu"
          >
            <span class="app-menu-trigger__label">Menu</span>

            <span class="app-menu-trigger__hamburger" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>

            <svg
              class="app-menu-trigger__ornaments"
              viewBox="0 0 180 70"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              
              <g class="frame-outer">
                <path d="M22 9 H158 M171 22 V48 M158 61 H22 M9 48 V22" />
              </g>

              <g class="frame-inner">
                <path d="M22 12 H158 M168 22 V48 M158 58 H22 M12 48 V22" />
              </g>                            
            </svg>

            <span class="app-menu-trigger__stars" aria-hidden="true">
              <span class="app-menu-trigger__stars-top"></span>
              <span class="app-menu-trigger__stars-bottom"></span>
            </span>

          </button>
        </div>
      </header>

      ${renderGameHud(brewResult)}

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

        <div class="game-layout__right">
          <div class="game-layout__recipe">
            ${renderRecipe()}
          </div>

          <div class="game-layout__bars">
            ${renderBars()}
          </div>
        </div>
      </div>

    </main>

    <dialog class="menu-dialog main-menu-dialog" aria-labelledby="menu-dialog-title">
      <button
        class="main-menu-dialog__close-icon"
        type="button"
        data-action="menu-close"
        aria-label="Close menu"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>

      <h2 id="menu-dialog-title">
        ✦ <span data-i18n="menu">${translate('menu')}</span> ✦
      </h2>

      <div class="menu-dialog__actions">

        <button type="button" data-action="help-open" data-i18n="help">
          ${translate('help')}
        </button>

        <button type="button" data-action="settings-open" data-i18n="settings">
          ${translate('settings')}
        </button>

        <button type="button" data-action="leaderboard-open" data-i18n="leaderboard">          
         ${translate('leaderboard')}
        </button>
      </div>

      <div class="main-menu-dialog__language">
        ${renderLanguageSwitcher()}
      </div>

      <button
        class="menu-dialog__close"
        type="button"
        data-action="menu-close"
        data-i18n="close"
      >
        ${translate('close')}
      </button>
    </dialog>

    
    
<dialog
  class="menu-dialog settings-dialog"
  aria-labelledby="settings-dialog-title"
>
  <h2 id="settings-dialog-title">
    ✦ <span data-i18n="difficulty">${translate('difficulty')}</span> ✦
  </h2>

  
<div class="settings-dialog__difficulty">

  <div
    class="settings-dialog__options"
    role="group"
    aria-labelledby="difficulty-title"
  >
    ${(['easy', 'medium', 'hard'] as const)
      .map(
        (difficulty) => `
          <button
            type="button"
            class="settings-dialog__option ${
              gameState.difficulty === difficulty ? 'settings-dialog__option--selected' : ''
            }"
            data-difficulty="${difficulty}"
            aria-pressed="${gameState.difficulty === difficulty}"
            ${gameState.status !== 'menu' ? 'disabled' : ''}
            data-i18n="${difficulty}"
          >
            ${translate(difficulty)}
          </button>
        `,
      )
      .join('')}
  </div>
</div>


  <button
    class="menu-dialog__close"
    type="button"
    data-action="settings-close"
    data-i18n="close"
  >
    ${translate('close')}
  </button>
</dialog>



    <dialog class="menu-dialog help-dialog" aria-labelledby="help-dialog-title">
  <h2 id="help-dialog-title">
    ✦ <span data-i18n="howToPlay">${translate('howToPlay')}</span> ✦
  </h2>

  <div class="help-dialog__content">
    <p data-i18n="helpWelcome">${translate('helpWelcome')}</p>

    <ol>
      <li data-help-action="start">
        ${renderHelpAction('helpStart', 'startGame')}
      </li>
      <li data-i18n="helpRecipe">${translate('helpRecipe')}</li>
      <li data-i18n="helpIngredients">${translate('helpIngredients')}</li>
      <li data-i18n="helpParameters">${translate('helpParameters')}</li>
      <li data-help-action="brew">
        ${renderHelpAction('helpBrew', 'brew')}
      </li>
      <li data-i18n="helpSuccess">${translate('helpSuccess')}</li>
    </ol>

    <p data-i18n="helpRewards">${translate('helpRewards')}</p>
    <p data-i18n="helpLives">${translate('helpLives')}</p>
    <p data-help-action="pause">
      ${renderHelpAction('helpPause', 'pause')}
    </p>
  </div>

  <button
    class="menu-dialog__close"
    type="button"
    data-action="help-close"
    data-i18n="close"
  >
    ${translate('close')}
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

    const showGameOver = (): void => {
      if (!gameOverDialog.isConnected || gameState.status !== 'game-over') {
        return;
      }

      gameOverDialog.showModal();
      gameOverDialog.querySelector<HTMLElement>('#game-over-title')?.focus();
    };

    if (brewResult === 'success' || brewResult === 'failure') {
      window.setTimeout(showGameOver, 950);
    } else {
      showGameOver();
    }
  }

  const pauseDialog = app.querySelector<HTMLDialogElement>('.pause-dialog');

  if (pauseDialog) {
    pauseDialog.addEventListener('cancel', (event) => {
      event.preventDefault();
    });

    pauseDialog.showModal();
    pauseDialog.querySelector<HTMLButtonElement>('[data-action="pause"]')?.focus();
  }

  if (brewResult === 'success') {
    const scoreElement = app.querySelector<HTMLElement>('.game-hud__score');

    window.setTimeout(() => {
      if (scoreElement?.isConnected && scoreElement.classList.contains('game-hud__value--gain')) {
        scoreElement.textContent = String(gameState.score);
        scoreElement.classList.remove('game-hud__value--gain');
      }
    }, 850);
  }
};

const openLeaderboard = (confirmClear = false): void => {
  app.querySelector<HTMLDialogElement>('.menu-dialog')?.close();
  const existingDialog = app.querySelector<HTMLDialogElement>('.leaderboard-dialog');

  if (existingDialog) {
    existingDialog.close();
    existingDialog.remove();
  }

  app.insertAdjacentHTML('beforeend', renderLeaderboard(confirmClear, gameState.difficulty));

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

const positionIngredientTooltip = (target: EventTarget | null): void => {
  if (!(target instanceof Element) || gameState.status !== 'playing') {
    return;
  }

  const card = target.closest<HTMLButtonElement>('.ingredient-card');

  if (!card || card.disabled) {
    return;
  }

  const tooltip = card.querySelector<HTMLElement>('.ingredient-tooltip');

  if (!tooltip) {
    return;
  }

  tooltip.classList.remove('ingredient-tooltip--left', 'ingredient-tooltip--up');

  const cardRect = card.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  const spaceRight = window.innerWidth - cardRect.right;
  const spaceLeft = cardRect.left;

  if (spaceRight < tooltipRect.width + 10 && spaceLeft > spaceRight) {
    tooltip.classList.add('ingredient-tooltip--left');
  }

  const positionedRect = tooltip.getBoundingClientRect();

  if (positionedRect.bottom > window.innerHeight - 8) {
    tooltip.classList.add('ingredient-tooltip--up');
  }
};

app.addEventListener('pointerover', (event) => {
  positionIngredientTooltip(event.target);
});

app.addEventListener('focusin', (event) => {
  positionIngredientTooltip(event.target);
});

const updateTranslations = (): void => {
  app.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n as TranslationKey;
    element.textContent = translate(key);
  });

  const helpActions = {
    start: ['helpStart', 'startGame'],
    brew: ['helpBrew', 'brew'],
    pause: ['helpPause', 'pause'],
  } as const;

  Object.entries(helpActions).forEach(([action, [textKey, actionKey]]) => {
    const element = app.querySelector<HTMLElement>(`[data-help-action="${action}"]`);

    if (element) {
      element.innerHTML = renderHelpAction(textKey, actionKey);
    }
  });

  const shelf = app.querySelector<HTMLElement>('.shelf');

  if (shelf) {
    shelf.outerHTML = renderShelf();
  }

  const recipe = app.querySelector<HTMLElement>('.recipe');

  if (recipe) {
    recipe.outerHTML = renderRecipe();
  }
};

app.addEventListener('click', (event: MouseEvent) => {
  if (isStarting) {
    return;
  }

  if (gameState.status === 'game-over' && app.querySelector('.game-over:not([open])')) {
    return;
  }

  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const languageButton = target.closest<HTMLButtonElement>('[data-locale]');

  if (languageButton) {
    const locale = languageButton.dataset.locale;

    if (locale !== 'en' && locale !== 'ru' && locale !== 'es') {
      return;
    }

    setLocale(locale);

    app.querySelectorAll<HTMLButtonElement>('[data-locale]').forEach((button) => {
      const isActive = button.dataset.locale === locale;

      button.classList.toggle('language-switcher__button--active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    updateTranslations();

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

  const helpOpenButton = target.closest<HTMLButtonElement>('[data-action="help-open"]');

  if (helpOpenButton) {
    app.querySelector<HTMLDialogElement>('.menu-dialog:not(.help-dialog)')?.close();
    app.querySelector<HTMLDialogElement>('.help-dialog')?.showModal();
    return;
  }

  const helpCloseButton = target.closest<HTMLButtonElement>('[data-action="help-close"]');

  if (helpCloseButton) {
    app.querySelector<HTMLDialogElement>('.help-dialog')?.close();
    return;
  }

  const settingsOpenButton = target.closest<HTMLButtonElement>('[data-action="settings-open"]');

  if (settingsOpenButton) {
    app
      .querySelector<HTMLDialogElement>('.menu-dialog:not(.settings-dialog):not(.help-dialog)')
      ?.close();

    app.querySelector<HTMLDialogElement>('.settings-dialog')?.showModal();
    return;
  }

  const settingsCloseButton = target.closest<HTMLButtonElement>('[data-action="settings-close"]');

  if (settingsCloseButton) {
    app.querySelector<HTMLDialogElement>('.settings-dialog')?.close();

    if (gameState.status === 'menu') {
      renderApp();
    }

    return;
  }

  const difficultyButton = target.closest<HTMLButtonElement>('[data-difficulty]');

  if (difficultyButton) {
    const difficulty = difficultyButton.dataset.difficulty;

    if (difficulty !== 'easy' && difficulty !== 'medium' && difficulty !== 'hard') {
      return;
    }

    setDifficulty(difficulty);

    const options = app.querySelectorAll<HTMLButtonElement>('[data-difficulty]');

    options.forEach((button) => {
      const isSelected = button.dataset.difficulty === gameState.difficulty;

      button.classList.toggle('settings-dialog__option--selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });

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
        if (clearLeaderboard(gameState.difficulty)) {
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

  const continueButton = target.closest<HTMLButtonElement>('[data-action="continue"]');

  if (continueButton) {
    if (continueGame()) {
      scoreSubmitted = false;
      renderApp();
    }

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

  const pourOutButton = target.closest<HTMLButtonElement>('[data-action="pour-out"]');

  if (pourOutButton) {
    if (!pourOutButton.disabled && pourOut()) {
      renderApp();
    }

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

let draggedIngredientId: string | null = null;

const clearDragState = (): void => {
  document.documentElement.classList.remove('ingredient-drag-active');

  app.querySelector('.ingredient-card--dragging')?.classList.remove('ingredient-card--dragging');

  draggedIngredientId = null;

  app.querySelectorAll('.cauldron--drag-over').forEach((element) => {
    element.classList.remove('cauldron--drag-over');
  });
};

app.addEventListener('dragstart', (event: DragEvent) => {
  const target = event.target;

  if (!(target instanceof Element) || isStarting || gameState.status !== 'playing') {
    event.preventDefault();
    return;
  }

  const card = target.closest<HTMLButtonElement>('.ingredient-card');

  if (!card || card.disabled || !card.dataset.ingredientId || !event.dataTransfer) {
    event.preventDefault();
    return;
  }

  draggedIngredientId = card.dataset.ingredientId;

  document.documentElement.classList.add('ingredient-drag-active');

  card.classList.add('ingredient-card--dragging');

  event.dataTransfer.setData('text/plain', draggedIngredientId);
  event.dataTransfer.effectAllowed = 'copy';

  const image = card.querySelector<HTMLImageElement>('.ingredient-card__image');

  if (image && image.complete && image.naturalWidth > 0) {
    event.dataTransfer.setDragImage(
      image,
      image.getBoundingClientRect().width / 2,
      image.getBoundingClientRect().height / 2,
    );
  }
});

app.addEventListener('dragover', (event: DragEvent) => {
  if (!draggedIngredientId || gameState.status !== 'playing' || isStarting) {
    return;
  }

  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const cauldron = target.closest<HTMLElement>('.cauldron');

  const config = DIFFICULTY_SETTINGS[gameState.difficulty];
  const hasSpace = gameState.cauldronIngredients.length < config.maxCauldronIngredients;

  if (!cauldron || !hasSpace) {
    return;
  }

  event.preventDefault();

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy';
  }

  cauldron.classList.add('cauldron--drag-over');
});

app.addEventListener('dragleave', (event: DragEvent) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const cauldron = target.closest<HTMLElement>('.cauldron');

  if (cauldron && (!event.relatedTarget || !cauldron.contains(event.relatedTarget as Node))) {
    cauldron.classList.remove('cauldron--drag-over');
  }
});

app.addEventListener('drop', (event: DragEvent) => {
  const target = event.target;
  const cauldron = target instanceof Element ? target.closest('.cauldron') : null;
  const ingredientId = draggedIngredientId;

  if (cauldron) {
    event.preventDefault();
  }

  clearDragState();

  if (cauldron && ingredientId && !isStarting && addIngredient(ingredientId)) {
    renderApp();
  }
});

app.addEventListener('dragend', clearDragState);

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

  if (!saveLeaderboardEntry(name, gameState.score, gameState.difficulty)) {
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

window.addEventListener('pagehide', () => {
  if (gameState.status === 'playing') {
    pauseGame();
  }
});

document.documentElement.lang = getLocale();

renderApp();

const TIMER_REFRESH_INTERVAL = 250;

setInterval(refreshGameHud, TIMER_REFRESH_INTERVAL);
