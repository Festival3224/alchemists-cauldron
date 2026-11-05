import {
  formatLeaderboardDate,
  loadLeaderboard,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
} from '../storage/leaderboard';

import { translate } from '../i18n';

import type { Difficulty } from '../types/game';

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export const renderLeaderboard = (
  confirmClear = false,
  difficulty: Difficulty = 'medium',
): string => {
  const entries = loadLeaderboard(difficulty);

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
      <h2 id="leaderboard-title">
        ${translate('leaderboard')} — ${translate(difficulty)}
      </h2>

      ${
        confirmClear
          ? `<div class="leaderboard-dialog__confirmation">
               <p>${translate('clearLeaderboardConfirm')}</p>

               <button type="button" data-action="leaderboard-confirm-clear">
                  ${translate('confirmClearAll')}
               </button>

               <button type="button" data-action="leaderboard-cancel-clear">
                  ${translate('cancel')}
               </button>
             </div>`
          : `
            ${
              entries.length === 0
                ? `<p>${translate('noRecords')}</p>`
                : `<div class="leaderboard-dialog__table-wrapper">
                     <table>
                       <thead>
                         <tr>
                           <th scope="col">${translate('rank')}</th>
                           <th scope="col">${translate('player')}</th>
                           <th scope="col">${translate('score')}</th>
                           <th scope="col">${translate('date')}</th>
                         </tr>
                       </thead>
                       <tbody>${rows}</tbody>
                     </table>
                   </div>`
            }

            ${
              entries.length > 0
                ? `<button type="button" data-action="leaderboard-clear">
                    ${translate('clearLeaderboard')}
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
        ${translate('close')}
      </button>
    </dialog>
  `;
};

export const renderPlayerNameForm = (): string => `
  <form class="leaderboard-name-form" data-form="leaderboard-name">
    <label for="leaderboard-player-name">
      ${translate('enterPlayerName')}
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
      ${MIN_NAME_LENGTH}-${MAX_NAME_LENGTH} ${translate('playerNameHint')}
    </p>

    <p class="leaderboard-name-form__error" role="alert"></p>

    <button type="submit">
      ${translate('saveScore')}
    </button>
  </form>
`;
