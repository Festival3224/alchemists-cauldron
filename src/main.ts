import './styles/style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Application root element not found');
}

app.innerHTML = `
  <main class="app">
    <h1>Alchemist's Cauldron</h1>
    <p>A magical potion-brewing game.</p>
  </main>
`;
