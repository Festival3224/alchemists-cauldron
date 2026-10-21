import { gameState } from '../state/game-state';

export const renderGameHud = (): string => {
  if (gameState.status === 'menu') {
    return '';
  }

  return `
    <section class="game-hud" aria-label="Game statistics">
      <div class="game-hud__item">
        <span class="game-hud__label">Score</span>
        <strong class="game-hud__value">${gameState.score}</strong>
      </div>

      <div class="game-hud__item">
        <span class="game-hud__label">Time</span>
        <strong class="game-hud__value">${gameState.timeLeft}s</strong>
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
