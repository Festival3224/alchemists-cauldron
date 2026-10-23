import {
  formatLeaderboardDate,
  loadLeaderboard,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
} from '../storage/leaderboard';

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export const renderLeaderboard = (confirmClear = false): string => {
  const entries = loadLeaderboard();

  const rows = entries
    .map(
      (entry, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(entry.name)}</td>
          <td>${entry.score}</td>
          <td>${formatLeaderboardDate(entry.date)}</td>
        </tr>
      `,
    )
    .join('');

  return `
    <dialog
      class="leaderboard-dialog"
      closedby="none"
      aria-labelledby="leaderboard-title"
    >
      <h2 id="leaderboard-title">Leaderboard</h2>

      ${
        confirmClear
          ? `<div class="leaderboard-dialog__confirmation">
               <p>Clear all leaderboard records? This cannot be undone.</p>

               <button type="button" data-action="leaderboard-confirm-clear">
                 Yes, Clear All
               </button>

               <button type="button" data-action="leaderboard-cancel-clear">
                 Cancel
               </button>
             </div>`
          : `
            ${
              entries.length === 0
                ? '<p>No records yet. Brew some potions!</p>'
                : `<div class="leaderboard-dialog__table-wrapper">
                     <table>
                       <thead>
                         <tr>
                           <th scope="col">Rank</th>
                           <th scope="col">Player</th>
                           <th scope="col">Score</th>
                           <th scope="col">Date</th>
                         </tr>
                       </thead>
                       <tbody>${rows}</tbody>
                     </table>
                   </div>`
            }

            ${
              entries.length > 0
                ? `<button type="button" data-action="leaderboard-clear">
                     Clear Leaderboard
                   </button>`
                : ''
            }
          `
      }

      <button
        class="leaderboard-dialog__close"
        type="button"
        data-action="leaderboard-close"
      >
        Close
      </button>
    </dialog>
  `;
};

export const renderPlayerNameForm = (): string => `
  <form class="leaderboard-name-form" data-form="leaderboard-name">
    <label for="leaderboard-player-name">
      Enter your name for the leaderboard:
    </label>

    <input
      id="leaderboard-player-name"
      name="playerName"
      type="text"
      minlength="${MIN_NAME_LENGTH}"
      maxlength="${MAX_NAME_LENGTH}"
      autocomplete="nickname"
      required
    />

    <p class="leaderboard-name-form__hint">
      ${MIN_NAME_LENGTH}-${MAX_NAME_LENGTH} characters: letters, numbers, spaces, _ or -
    </p>

    <p class="leaderboard-name-form__error" role="alert"></p>

    <button type="submit">Save Score</button>
  </form>
`;
