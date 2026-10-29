import { DIFFICULTY_SETTINGS, TIMER_WARNING_THRESHOLD } from '../data/difficulty';
import { formatTime } from '../logic/timer';
import { gameState } from '../state/game-state';

export const renderGameHud = (): string => {
  const config = DIFFICULTY_SETTINGS[gameState.difficulty];
  const isMenu = gameState.status === 'menu';

  const isUrgent = gameState.status === 'playing' && gameState.timeLeft < TIMER_WARNING_THRESHOLD;

  return `
    <section
      class="game-hud ${isMenu ? 'game-hud--idle' : 'game-hud--active'}"
      aria-label="Game statistics"  
    >
      <div class="game-hud__item">
        <span class="game-hud__label">Score</span>
        <strong class="game-hud__value">${gameState.score}</strong>
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
        <strong class="game-hud__value">${isMenu ? '0' : gameState.lives}</strong>
      </div>

    </section>
  `;
};
