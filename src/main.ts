import './styles/style.css';

import { addIngredient, gameState, startNewGame } from './state/game-state';
import { renderCauldron } from './ui/cauldron';
import { renderShelf } from './ui/shelf';
import { renderBars, updateBars } from './ui/bars';
import { renderRecipe } from './ui/recipe';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Application root element not found');
}

const renderApp = (): void => {
  app.innerHTML = `
    <main class="app">
      <h1>Alchemist's Cauldron</h1>
      <p>A magical potion-brewing game.</p>

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
    </main>
  `;
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

    updateBars();
  }
});

renderApp();
