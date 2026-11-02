import { DIFFICULTY_SETTINGS, TIMER_WARNING_THRESHOLD } from '../data/difficulty';
import { formatTime } from '../logic/timer';
import { gameState } from '../state/game-state';

import type { BrewResult } from '../state/game-state';

const renderHearts = (count: number, lives: number, lostLife: boolean): string => {
  return Array.from({ length: count }, (_, index) => {
    const isFilled = index < lives;
    const isLost = lostLife && index === lives;

    return `
      <svg
        class="game-hud__heart ${isFilled ? 'game-hud__heart--filled' : ''} ${isLost ? 'game-hud__heart--lost' : ''}"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
        />
      </svg>
    `;
  }).join('');
};

export const renderGameHud = (brewResult?: BrewResult): string => {
  const config = DIFFICULTY_SETTINGS[gameState.difficulty];
  const isMenu = gameState.status === 'menu';

  const isSuccess = brewResult === 'success';
  const scoreGain = config.scorePerBrew;
  const visibleLives = isMenu ? 0 : gameState.lives;

  const isUrgent = gameState.status === 'playing' && gameState.timeLeft < TIMER_WARNING_THRESHOLD;

  return `
    <section
      class="game-hud ${isMenu ? 'game-hud--idle' : 'game-hud--active'}"
      aria-label="Game statistics"  
    >
      <div class="game-hud__item">
  <span class="game-hud__label">Score</span>
  <strong
    class="game-hud__value game-hud__score ${isSuccess ? 'game-hud__value--gain' : ''}"
    aria-live="polite"
  >
    ${isSuccess ? `+${scoreGain}` : gameState.score}
  </strong>
</div>

      <div class="game-hud__item game-hud__item--time ${isUrgent ? 'game-hud__item--urgent' : ''}">
        <span class="game-hud__label">Time</span>

        <div class="game-hud__time-controls">
          <strong class="game-hud__value">
            ${isMenu ? '00:00' : formatTime(gameState.timeLeft)}
          </strong>

          <button
            class="game-hud__pause"
            type="button"
            data-action="pause"
            ${isMenu ? 'disabled' : ''}
          >
            ${gameState.status === 'paused' ? 'Resume' : 'Pause'}
          </button>
        </div>

        <progress
          class="game-hud__progress"
          max="${config.startingTime}"
          value="${isMenu ? 0 : gameState.timeLeft}"
          aria-label="Remaining time"
        ></progress>
      </div>

      <div class="game-hud__item">
  <span class="game-hud__label">Lives</span>
  <div
    class="game-hud__hearts"
    role="img"
    aria-label="${visibleLives} of ${config.startingLives} lives remaining"
  >
    ${renderHearts(config.startingLives, visibleLives, brewResult === 'failure')}
  </div>
</div>

    </section>
  `;
};
