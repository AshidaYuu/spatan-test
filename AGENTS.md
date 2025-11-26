# AGENTS

## TL;DR
- React 18 + Vite + Tailwind CSS single-page app for rapid English vocabulary drills.
- All data, state, and UI live inside `src/App.jsx`; `src/main.jsx` just mounts `<App />` and pulls in Tailwind styles.
- Primary workflows: select a dataset and range → flashcard-style self-scoring test with speech + timer → score screen with PDF export, sudden-death review, and a persistent mistake list drill.
- Run locally with `npm install` then `npm run dev`; `npm run build` produces the `/dist` bundle.

## Source Layout
| Path | Purpose |
| --- | --- |
| `src/App.jsx` | Entire application: raw word banks, parsing helpers, React component, UI rendering, timer/TTS/review logic. |
| `src/main.jsx` | Vite entry point that renders `<App />` inside `#root`. |
| `src/styles.css` | Tailwind directives plus base font/background resets. |
| `tailwind.config.js`, `postcss.config.js`, `vite.config.js` | Standard Vite/Tailwind build plumbing (no custom rules yet). |

There is no backend or persistence layer; everything is client-side.

## Vocabulary Data Model
- Three raw datasets are embedded as template literals near the top of `src/App.jsx`:
  1. `RAW_DATA_MASTER_800` – 英単語マスター 800
  2. `RAW_DATA_SEKI_KOKO` – 関正生 難関高校英単語 (1-405)
  3. `RAW_DATA_TARGET_1900` – ターゲット1900 (1~800)
- `DATA_SETS` exposes metadata `{id, title, data}` for those lists. Additions should follow the same structure so the dataset instantly appears in the selector.
- `parseWordList(raw)` splits on newlines, extracts `id`, `word`, `meaning`, optional `[pronunciation]`, and produces:
  ```ts
  { id: number, word: string, meaning: string, pronunciation: string, variations: string[] }
  ```
- `normalizeWordAndMeaning` removes trailing digits accidentally appended to words (e.g. `play10`) and folds them into the meaning so ID ranges stay sequential.
- `variations` is derived by tokenizing `meaning` on commas/ja punctuation/slashes so fuzzy matching can be introduced later.

## Core Application State (`src/App.jsx`)
- `appState`: `'home' | 'test' | 'result'` controls which screen renders.
- `selectedDatasetId`: key for `DATA_SETS`; memoized `wordList` depends on it.
- Range + settings: `rangeStart`, `rangeEnd`, `isRandom`, `timeLimit` (seconds per card).
- Test session: `testWords`, `currentIndex`, `flashcardPhase ('question' | 'answer')`, `timeLeft`, `results`.
- Review mode: `isReviewMode`, `reviewTargetWords` ensure repeated attempts reuse the same wrong-word pool.
- `timerRef` (`useRef`) holds the ticking interval so it can be cancelled reliably between renders.

## Screen Flow
### Home (`appState === 'home'`)
1. User picks a dataset (dropdown auto-updated from `DATA_SETS`).
2. Sets the numeric ID range (defaults reset when dataset changes). Inputs are clamped inside `startTest` so invalid ranges alert the user.
3. Chooses time limit preset buttons (5/10/15/20s) and question order (ordered vs shuffle toggle).
4. `Start` button (and `[Enter]`) runs `startTest`, which:
   - filters `wordList` to the desired ID interval,
   - optionally shuffles,
   - resets indices, results, and review flags,
   - flips `appState` to `test`.

### Flashcard Test (`appState === 'test'`)
- Timer/TTS effect: when `flashcardPhase === 'question'`, `speakWord` uses `window.speechSynthesis` (en-US) to read the term, then starts a 1s interval countdown. Revealing the answer or navigating away cancels the interval.
- UI shows current word, optional pronunciation + meaning once revealed, and a circular timer (danger styling <3s or in review mode).
- Controls:
  - `Space`/`Enter`/`ArrowDown` (or the “答えを見る” button) toggles `flashcardPhase` to `'answer'`.
  - `ArrowLeft`/`n` (or “わからない”) calls `handleSelfCheck(false)`.
  - `ArrowRight`/`y` (or “わかった”) calls `handleSelfCheck(true)`.
  - Speaker button calls `speakWord` manually for replays.
- `handleSelfCheck` appends a result payload `{wordId, word, correctMeaning, pronunciation, isCorrect, status}`. When the last word is graded, `appState` flips to `'result'`.
- Review mode twist: if `isReviewMode` is true and the user marks an answer wrong, they are alert-notified and the entire review session restarts from question 1 with the word list reshuffled (sudden-death practice).

### Results & Review (`appState === 'result'`)
- Score card displays percentage, raw counts, and celebratory styles when perfect.
- Every response is listed with ability to toggle correctness after the fact (`handleToggleCorrect`). Manual overrides change both `isCorrect` and `status` so the score updates immediately via the derived `actualCorrectCount`.
- Wrong-answer actions:
  1. **徹底復習する** (`startReview`): collects all incorrect IDs, shuffles, stores them in `reviewTargetWords`, clears previous results, sets `isReviewMode`, and re-enters the test view. This mode keeps looping until the user finishes with zero wrong answers. When they succeed, a dedicated “復習完了” screen appears before returning home.
  2. **復習リストをPDF保存**: `handleDownloadPDF` builds a printable HTML string for the incorrect answers and opens it in a new tab, prompting the browser’s Print/PDF UI automatically.
- `[Enter]` always returns to home from the default result screen.

### Mistake List Mode
- Every time `handleSelfCheck(false)` fires, the current word (with `datasetId`) flows into `mistakeWords`. Duplicates are ignored so the list grows monotonically.
- The home screen shows the count + latest entries and exposes a **苦手を練習** CTA. Hitting it shuffles the mistake pool, switches to flashcard view, and sets `isMistakeMode`.
- Mistake mode uses amber styling, lets the learner remove the current card from the list via `handleRemoveCurrentMistakeWord`, and shows a dedicated result screen summarizing remaining items with options to continue or return home.
- Like review mode, Mistake mode turns off regular scoring logic (no sudden-death, but still records `results` for context).

## Audio/Timer Notes
- `speakWord` must always cancel in-flight synthesis via `window.speechSynthesis.cancel()` before speaking again; any updates must keep that guard to avoid browser queue buildup.
- The timer effect is sensitive to stale refs; always clear `timerRef.current` in cleanup blocks before assigning new intervals, and guard asynchronous callbacks with an `isMounted` flag (already implemented) when adding new async flows.

## Styling & UI Conventions
- Tailwind utility classes dominate the JSX. Keep new styles in-line with this approach rather than introducing separate CSS unless absolutely necessary.
- Components are intentionally single-file for ease of copying; if refactoring into smaller files, update the guidance here.
- Icons come from `lucide-react`. Import only what is used to avoid bundle bloat.

## Adding or Updating Datasets
1. Append a new `RAW_DATA_*` template literal following the `idwordmeaning[reading]` format (IDs must stay numeric and sequential for range filtering).
2. Register it inside `DATA_SETS` with a unique `id` and human-readable `title`.
3. `parseWordList` automatically handles punctuation-separated meanings and optional readings; tweak regex cautiously if the source format changes.
4. Verify by selecting the dataset in the home dropdown and checking that the range limit updates to the new list length.

## Local Development Commands
- `npm install` – install dependencies (React, Vite, Tailwind, lucide-react).
- `npm run dev` – start Vite dev server (default http://localhost:5173) with hot reload.
- `npm run build` – production build into `dist/`.
- `npm run preview` – serve the build for smoke tests.

## Manual QA Checklist
1. Launch dev server, ensure each dataset populates the selector and updates the `出題範囲` upper bound.
2. Run a short ordered test (e.g., IDs 1-5) verifying TTS, timer countdown, reveal/answer buttons, and keyboard shortcuts.
3. Complete a session with mixed correct/incorrect answers; confirm the score math, toggle correction buttons, and PDF export contents.
4. Trigger review mode via an incorrect answer, confirm sudden-death restart when failing, and verify completion screen upon clearing all wrong words.
5. Smoke-test multiple browser tabs to make sure `speechSynthesis` cancellation prevents overlapping playback.

## Known Constraints / Future Ideas
- There is no persistence; refreshing the page clears progress and custom datasets.
- PDF export relies on `window.open` + `window.print()`. Browsers that block popups will require user interaction to allow it.
- Mobile Safari occasionally delays the speech synthesis callback; timer start uses a 600ms delay to reduce clipping – keep this in mind when adjusting UX timings.
- Timer duration presets are hard-coded; exposing a text input or slider will require extra validation around `timeLimit` and `setTimeLeft` initialization.

This document should equip future agents with enough context to modify or extend the app even if previous conversation history is unavailable.
