import { LEVEL_ONE_CONFIG, TIMER_WARNING_THRESHOLD } from '../data/difficulty';
import { formatTime } from '../logic/timer';
import { gameState } from '../state/game-state';

export const renderGameHud = (): string => {
  if (gameState.status === 'menu') {
    return '';
  }

  const isUrgent = gameState.timeLeft < TIMER_WARNING_THRESHOLD;

  return `
    <section class="game-hud" aria-label="Game statistics">
      <div class="game-hud__item">
        <span class="game-hud__label">Score</span>
        <strong class="game-hud__value">${gameState.score}</strong>
      </div>

      <div class="game-hud__item game-hud__item--time ${isUrgent ? 'game-hud__item--urgent' : ''}">
        <span class="game-hud__label">Time</span>
        <strong class="game-hud__value">${formatTime(gameState.timeLeft)}</strong>
        <progress
          class="game-hud__progress"
          max="${LEVEL_ONE_CONFIG.startingTime}"
          value="${gameState.timeLeft}"
          aria-label="Remaining time"
        ></progress>
      </div>

      <div class="game-hud__item">
        <span class="game-hud__label">Lives</span>
        <strong class="game-hud__value">${gameState.lives}</strong>
      </div>

      ${
        gameState.status === 'playing' || gameState.status === 'paused'
          ? `<button class="game-hud__pause" type="button" data-action="pause">
               ${gameState.status === 'paused' ? 'Resume' : 'Pause'}
             </button>`
          : ''
      }
    </section>
  `;
};
