# Implementation Plan: life-dashboard-enhancements

## Overview

This plan defines the implementation tasks for enhancements to the existing Life Dashboard web application (vanilla HTML/CSS/JS, no frameworks, no build step, LocalStorage only). The work covers six areas: (1) an i18n system foundation for EN/ID localization, (2) HTML restructuring for the new calendar block and flip clock, (3) flip clock and responsive layout CSS, (4) the flip clock JS module, (5) language toggle integration into existing modules, and (6) a display name editing hint. A seventh area — verification and cross-browser testing — validates the implementation.

Tasks 1–6 are complete. Task 7 (Verification and Testing) has subtasks 7.1–7.10 complete; 7.11 (cross-browser verification) remains. A review of the implementation against the requirements and design identified two additional work areas: Task 8 addresses i18n coverage gaps (several UI strings are still hardcoded in English), and Task 9 adds the automated test suite (property-based tests, unit tests, and integration tests) described in the design document's testing strategy.

All changes target three files: `index.html`, `css/style.css`, and `js/app.js`. The automated test suite creates new files outside `js/` to satisfy the single-JS-file constraint (Requirement 16.4).

## Notes

- The existing application uses a single IIFE in `js/app.js`. All new JS code is added inside this IIFE, not as separate files.
- The `STORAGE_KEYS` constant, `state` object, `hydrateState()`, `cacheDom()`, `bindEvents()`, and `init()` functions are the primary modification points in `js/app.js`.
- The flip clock animation technique is adapted from `FipClock-v2.2.html` in the project root — the CSS keyframe logic is preserved but all colors are replaced with CSS custom properties.
- Indonesian (ID) string values are defined in the design document's i18n dictionary section.
- No existing LocalStorage keys are changed; only `life_dashboard_language` is added.
- All existing functionality (theme toggle, Pomodoro timer, tasks, quick links, keyboard shortcuts) must continue to work identically after all changes.
- **Known discrepancy:** Requirement 2.2 specifies the Plus Jakarta Sans font for the Greeting and Display_Name, but the implementation uses Instrument Serif (`--font-display`) for both. This is a pre-existing design choice carried over from the original dashboard; changing it would alter the visual identity. No task is added for this — flagged for user decision.
- **Pre-paint language script:** The design document describes an inline pre-paint script for language flash prevention (mirroring the existing theme-flash script). This is not implemented and is not required by any acceptance criterion. It is an optional enhancement omitted from the task list.
- **Task 8 (i18n coverage gaps):** A review of the implementation found that several UI strings are hardcoded in English rather than using `t()`/`tf()`: the sound toggle label ("SFX On"/"Muted"), the theme toggle label ("Dark"/"Light"), the default name fallback ("Friend"), the name saved badge ("Saved"), the header progress pill ("X/Y Tasks Done"), and the timer "Min:" label. The corresponding i18n keys exist in the design's STRINGS table but were not included in `I18N_STRINGS` during Task 1.
- **Task 9 (automated tests):** The design document specifies a Vitest + jsdom + fast-check test stack with five property-based tests, unit tests, and integration tests. None of this infrastructure exists yet — there is no `package.json`, no `test/` directory, no test harness exposure on `window`, and no test files. Task 9 implements the full testing strategy from the design.

## Tasks

- [x] 1. i18n System Foundation (js/app.js)
  - [x] 1.1 Add `LANGUAGE: 'life_dashboard_language'` to the `STORAGE_KEYS` constant
  - [x] 1.2 Add `language: 'en'` field to the `state` object (default to `'en'`)
  - [x] 1.3 Add language hydration in `hydrateState()`: read `STORAGE_KEYS.LANGUAGE` with fallback to `'en'`, validate it is `'en'` or `'id'`
  - [x] 1.4 Create the `I18N_STRINGS` constant dictionary with complete `en` and `id` sub-objects, covering: greeting (morning/afternoon/evening/night), cardTitles (focusTimer/todayTasks/quickLinks), timer (ready/focusing/paused/complete/target/start/pause/resume/reset/sessionsDone function), tasks (placeholder/addTask/clearDone/done/all/active/completed/sortBy/sortIncomplete/sortNewest/sortOldest/sortAlpha/taskCounter function), links (addLink/saveLink/cancel/titlePlaceholder/urlPlaceholder/errorTitle/errorUrl/errorDuplicate/emptyTitle/emptyRestore), footer (info/shortcutNewTask/shortcutTimer/shortcutTheme), duplicate (warning function), empty (clearTitle/clearDesc/allDoneTitle/allDoneDesc/noCompletedTitle/noCompletedDesc), displayName (hint), date (weekdays array/months array)
  - [x] 1.5 Implement `t(key)` function: resolves dot-notation key against `I18N_STRINGS[state.language]`, falls back to English if key missing in current language, falls back to key string if missing in both
  - [x] 1.6 Implement `tf(key, ...args)` function: resolves key to a function in the dictionary and calls it with the provided args
  - [x] 1.7 Implement `formatDate(date, lang)` function: EN format is `"${weekdays[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}"`; ID format is `"${weekdays[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}"`
  - [x] 1.8 Implement `getGreeting(hour, lang)` function: returns morning (5–11), afternoon (12–16), evening (17–20), or night (21–4) greeting string for the given language
  - [x] 1.9 Implement `applyStaticStrings()` function: queries all `[data-i18n]` elements and sets `textContent`, all `[data-i18n-placeholder]` elements and sets `placeholder` attribute, all `[data-i18n-option]` elements and sets `textContent`
  - [x] 1.10 Implement `applyLanguage()` function: calls `applyStaticStrings()`, then `updateClockAndGreeting()`, then `updateTimerUI()`, then `renderTasks()`, then `renderQuickLinks()`, then `updateLanguageLabel()`

  **Implements:** Requirements 1.2, 1.3, 2.3, 2.4, 2.5, 2.6, 5.2, 5.3, 5.6, 5.7

- [x] 2. HTML Restructuring (index.html)
  - [x] 2.1 In the `.header-left` section: remove the `#clock-time` time element, the `#clock-period` span, and the `.date-badge` span (with its SVG icon and `#current-date` span)
  - [x] 2.2 Add a new `#header-date` heading element at the top of `.header-left`, styled with a display font class, containing placeholder text "Loading date..."
  - [x] 2.3 Add a new `#display-name-hint` paragraph element below the `.greeting-row` in `.header-left`, with `data-i18n="displayName.hint"` attribute and class `display-name-hint`
  - [x] 2.4 In the `.header-right` section: add a `#flip-clock` container div above the control pills, with class `flip-clock-container`
  - [x] 2.5 Add a new `#language-toggle-btn` pill button to the `.header-right` control row (before or after the existing `#clock-format-btn`), using the `.icon-pill-btn` class, showing "EN" by default
  - [x] 2.6 Add `data-i18n` attributes to all static text elements: card titles (`cardTitles.focusTimer`, `cardTitles.todayTasks`, `cardTitles.quickLinks`), filter tab labels (`tasks.all`, `tasks.active`, `tasks.completed`), sort label (`tasks.sortBy`), sort options (`tasks.sortIncomplete`, `tasks.sortNewest`, `tasks.sortOldest`, `tasks.sortAlpha` via `data-i18n-option`), task input placeholder (`tasks.placeholder` via `data-i18n-placeholder`), add task button (`tasks.addTask`), clear done button (`tasks.clearDone`), quick link add button (`links.addLink`), save link button (`links.saveLink`), cancel button (`links.cancel`), link title input placeholder (`links.titlePlaceholder` via `data-i18n-placeholder`), link URL input placeholder (`links.urlPlaceholder` via `data-i18n-placeholder`), footer info text (`footer.info`), and all three shortcut labels (`footer.shortcutNewTask`, `footer.shortcutTimer`, `footer.shortcutTheme`)

  **Implements:** Requirements 1.1, 2.7, 3.1, 5.1, 5.3

- [x] 3. Flip Clock and Layout CSS (css/style.css)
  - [x] 3.1 Add flip clock CSS custom properties to the `:root` block: `--flip-card-w`, `--flip-card-h`, `--flip-digit-size`, `--flip-card-bg`, `--flip-card-top-bg`, `--flip-card-bottom-bg`, `--flip-digit-color`, `--flip-sep-color`, `--flip-seam-color`, `--flip-card-shadow`, `--flip-card-radius`, `--flip-sep-gap` (with light mode values)
  - [x] 3.2 Add the same flip clock CSS custom properties to the `[data-theme="dark"]` block with dark mode values
  - [x] 3.3 Add flip clock layout styles: `.flip-clock-container` (flex, align-items center, justify-content flex-end), `.flip-clock` (flex, align-items center, gap), `.flip-group` (flex, gap), `.flip-sep` (flex column, justify-content center), `.flip-dot` (circle with blink animation)
  - [x] 3.4 Add flip card styles: `.flip-card` (position relative, width/height from variables, border-radius, overflow hidden, perspective), `.flip-card::after` (horizontal seam line), `.flip-half` and `.flip-flap` (absolute positioning, 50% height, overflow hidden), `.flip-top` / `.flip-bottom` / `.flip-flap-top` / `.flip-flap-bottom` positioning, digit span styling (font-family mono, font-size from variable, tabular-nums, centered)
  - [x] 3.5 Add flip animation keyframes: `flipTop` (rotateX 0deg to -90deg) and `flipBottom` (rotateX 90deg to 0deg), plus `.flip-card.flipping` selectors that apply the animations with the correct delays
  - [x] 3.6 Add `.flip-ampm` styling (color, font-size, font-weight) and `.flip-ampm-hidden` (display none)
  - [x] 3.7 Add responsive flip clock sizing in the existing `@media (max-width: 720px)` block: override `--flip-card-w`, `--flip-card-h`, `--flip-digit-size` with smaller values
  - [x] 3.8 Add `#header-date` styling: use `--font-display` (Instrument Serif), larger font size (e.g., `clamp(1.5rem, 2.5vw, 2rem)`), `--text-primary` color
  - [x] 3.9 Add `.display-name-hint` styling: `--text-muted` color, small font size (e.g., 0.78rem), cursor pointer, no border or background, with hover effect (color change to `--text-secondary`)
  - [x] 3.10 Update `.header-right` layout: add `flex-direction: column`, `align-items: flex-end`, `gap` to stack the flip clock above the control pills
  - [x] 3.11 Remove or adjust `.clock-date-row` styling if no longer needed (the date badge elements were removed in task 2.1)

  **Implements:** Requirements 1.1, 2.7, 3.2, 3.3, 3.4, 3.5, 3.6, 14.1, 14.2

- [x] 4. Flip Clock JS Module (js/app.js)
  - [x] 4.1 Create a `flipClock` object inside the IIFE with an internal `cards` array and `initialized` flag
  - [x] 4.2 Implement `flipClock.init(container)`: build 6 `.flip-card` elements (2 per group: hours, minutes, seconds), each with top/bottom halves and flap-top/flap-bottom divs containing span elements; insert `.flip-sep` dot groups between hour-minute and minute-second groups; append an `.flip-ampm` span; store references to each card's span elements and dataset
  - [x] 4.3 Implement `flipClock.setCard(card, value)`: if `card.dataset.v === value`, return (no change); if first render (empty `data-v`), set all spans without animation; otherwise set `flap-top` to old value, `flap-bottom` to new value, `top` to new value, add `.flipping` class, and after 620ms set `bottom` to new value and remove `.flipping` class
  - [x] 4.4 Implement `flipClock.update(now, use24Hour)`: compute hours (12H or 24H), minutes, seconds; pad each to 2 digits; iterate over the 6 cards and call `setCard()` for each digit; toggle AM/PM indicator visibility and text based on `use24Hour` flag
  - [x] 4.5 Implement `flipClock.setAmPmVisible(visible)`: add or remove `.flip-ampm-hidden` class from the AM/PM element
  - [x] 4.6 In `cacheDom()`: add `dom.flipClockContainer = document.getElementById('flip-clock')`, `dom.headerDate = document.getElementById('header-date')`, `dom.displayNameHint = document.getElementById('display-name-hint')`, and `dom.languageToggleBtn = document.getElementById('language-toggle-btn')`
  - [x] 4.7 In `init()`: call `flipClock.init(dom.flipClockContainer)` if the container exists
  - [x] 4.8 Modify `updateClockAndGreeting()`: replace the digital clock text update with `flipClock.update(now, state.use24HourClock)`; replace the `Intl.DateTimeFormat` date call with `formatDate(now, state.language)` and update `dom.headerDate.textContent`; replace the hardcoded greeting string with `getGreeting(hours24, state.language)`; only update DOM elements if the value changed

  **Implements:** Requirements 1.1, 1.4, 2.1, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.2

- [x] 5. Language Toggle Integration (js/app.js)
  - [x] 5.1 Create `toggleLanguage()` function: toggle `state.language` between `'en'` and `'id'`, call `saveToStorage(STORAGE_KEYS.LANGUAGE, state.language)`, call `applyLanguage()`
  - [x] 5.2 Create `updateLanguageLabel()` function: set `dom.languageToggleBtn.textContent` to `'EN'` if `state.language === 'en'`, `'ID'` if `state.language === 'id'`; toggle `.active-toggle` class based on whether ID is active
  - [x] 5.3 Add click event listener for `dom.languageToggleBtn` in `bindEvents()`: calls `toggleLanguage()`
  - [x] 5.4 Call `applyStaticStrings()` and `updateLanguageLabel()` in `init()` after `hydrateState()` and `cacheDom()`
  - [x] 5.5 Modify `updateTimerUI()`: replace hardcoded timer status text ("Ready", "Focusing...", "Paused", "Session Complete!") with `t()` calls; replace timer subtext construction with `tf('timer.sessionsDone', sessionsCompleted)` and `t('timer.target')`; replace button labels ("Start", "Pause", "Resume") with `t()` calls
  - [x] 5.6 Modify `renderTasks()`: replace `dom.taskCounterPill.textContent` with `tf('tasks.taskCounter', completedCount, totalCount)`; replace empty state titles and descriptions with `t()` calls; ensure filter tab labels use `data-i18n` attributes (set in task 2.6)
  - [x] 5.7 Modify `triggerDuplicateFeedback()`: replace `dom.duplicateWarningText.textContent` with `tf('duplicate.warning', existingTask.text)`
  - [x] 5.8 Modify `renderQuickLinks()`: replace empty state text with `t('links.emptyTitle')` and `t('links.emptyRestore')`
  - [x] 5.9 Modify `addQuickLink()`: replace error messages with `t('links.errorTitle')`, `t('links.errorUrl')`, `t('links.errorDuplicate')`
  - [x] 5.10 Modify the `#clock-format-btn` click handler: after toggling `use24HourClock` and saving, call `updateClockAndGreeting()` which now updates both date and flip clock format

  **Implements:** Requirements 4.2, 5.1, 5.2, 5.3, 5.6, 5.7

- [x] 6. Display Name Hint (js/app.js)
  - [x] 6.1 Add click event listener for `dom.displayNameHint` in `bindEvents()`: on click, focus `dom.userName`, create a range selecting all contents of the contenteditable span, and apply the selection (same logic as the `#edit-name-btn` click handler)
  - [x] 6.2 Verify that `#display-name-hint` text updates on language toggle via `applyStaticStrings()` (the `data-i18n` attribute set in task 2.3 handles this automatically)

  **Implements:** Requirement 2.7

- [ ] 7. Verification and Testing
  - [x] 7.1 Verify dark/light theme toggle updates flip clock colors via CSS variables without page reload
  - [x] 7.2 Verify 12H/24H toggle updates flip clock format and AM/PM indicator visibility
  - [x] 7.3 Verify EN/ID language toggle updates all visible strings including card titles, timer labels, task UI, quick link form, footer, empty states, duplicate warning, date format, and greeting
  - [x] 7.4 Verify language preference persists across page reloads (LocalStorage)
  - [x] 7.5 Verify the full calendar date displays correctly in both formats: EN "Friday, November 7, 2026" and ID "Jumat, 7 November 2026"
  - [x] 7.6 Verify the greeting updates with time of day in both languages
  - [x] 7.7 Verify the display name hint click focuses the editable name span
  - [x] 7.8 Verify the flip clock animates only on digit changes and does not produce tick sounds
  - [x] 7.9 Verify all existing functionality works: Pomodoro timer (start/pause/reset/+1m/presets), tasks (add/edit/delete/toggle/filter/sort/duplicate prevention/confetti), quick links (add/delete/favicon), theme toggle, keyboard shortcuts (/, Alt+T, Alt+S)
  - [x] 7.10 Verify responsive layout on mobile viewport (max-width 720px): flip clock scales down, header stacks correctly, no horizontal overflow
  - [ ] 7.11 Verify in Chrome, Firefox, Edge, and Safari (flip clock CSS 3D transforms, LocalStorage, contenteditable)

  **Implements:** All acceptance criteria; 7.11 specifically validates Requirement 16.3

- [ ] 8. Complete i18n Coverage (js/app.js, index.html)
  - [ ] 8.1 Add missing i18n string keys to `I18N_STRINGS` for both `en` and `id`: `sfx.on` ("SFX On" / "SFX Aktif"), `sfx.muted` ("Muted" / "Bisu"), `theme.dark` ("Dark" / "Gelap"), `theme.light` ("Light" / "Terang"), `name.default` ("Friend" / "Teman"), `name.saved` ("Saved" / "Tersimpan"), `progress.tasks` as a function `(done, total) => `${done}/${total} Tasks Done`` / `${done}/${total} Tugas Selesai`, and `timer.minLabel` ("Min:" / "Men:")
    - Add these as new nested objects within the existing `en` and `id` dictionaries (e.g., `sfx: { on: '...', muted: '...' }`)
    - _Requirements: 5.3_

  - [ ] 8.2 Localize sound and theme toggle labels in `updateSoundToggleUI()` and `applyTheme()`
    - In `updateSoundToggleUI()`: replace hardcoded `'SFX On'` with `t('sfx.on')` and `'Muted'` with `t('sfx.muted')`
    - In `applyTheme()`: replace hardcoded `'Light'` with `t('theme.light')` and `'Dark'` with `t('theme.dark')`
    - _Requirements: 5.3_

  - [ ] 8.3 Localize default name fallback in `commitUserName()`
    - Replace hardcoded `'Friend'` fallback string with `t('name.default')`
    - _Requirements: 2.9, 5.3_

  - [ ] 8.4 Localize header progress pill in `renderTasks()`
    - Replace hardcoded `` `${completedCount}/${totalCount} Tasks Done` `` with `tf('progress.tasks', completedCount, totalCount)`
    - _Requirements: 5.3, 11.1_

  - [ ] 8.5 Add `data-i18n` attributes to remaining static HTML elements in `index.html`
    - Add `data-i18n="name.saved"` to the `#name-saved-badge` span so `applyStaticStrings()` localizes the badge text
    - Add `data-i18n="timer.minLabel"` to the `<label for="custom-minutes-input">` element so the "Min:" label localizes
    - _Requirements: 2.8, 5.3_

  **Implements:** Requirements 2.8, 2.9, 5.3, 11.1

- [ ] 9. Automated Test Suite
  - [ ] 9.1 Set up test infrastructure (Vitest + jsdom + fast-check)
    - Create `package.json` at project root with dev dependencies: `vitest`, `jsdom`, `fast-check`
    - Create `vitest.config.js` at project root with `environment: 'jsdom'` and `include: ['test/**/*.spec.js']`
    - Create `test/setup.js` that loads `js/app.js` into the jsdom `window` so the IIFE executes
    - Test files live in `test/` directory (outside `js/` to satisfy Requirement 16.4)
    - _Requirements: 16.4_

  - [ ] 9.2 Expose test harness on `window.__lifeDashboard` in `js/app.js`
    - Add a no-production-impact block at the end of the IIFE (before the closing) that exposes internal functions for testing:
      `window.__lifeDashboard = { formatDate, normalizeTaskText, isDuplicateTask, flipClock, applyLanguage, saveToStorage, loadFromStorage, I18N_STRINGS, t, tf }`
    - Use actual implementation names (the design references `calendarFormat`/`STRINGS`/`setCard` but the implementation uses `formatDate`/`I18N_STRINGS`/`flipClock.setCard`)
    - Guard with `if (typeof window !== 'undefined')` so it is inert in non-browser environments
    - _Requirements: 16.4_

  - [ ]* 9.3 Write property test for Calendar_Block locale invariant
    - **Property 1: Calendar_Block locale invariant**
    - **Validates: Requirements 1.2, 1.3**
    - Generate random valid `Date` objects (years 2000–2100) and languages (`en`/`id`); assert `formatDate(date, lang)` is non-empty and matches the EN regex `/^[A-Z][a-z]+, [A-Z][a-z]+ \d{1,2}, \d{4}$/` or ID regex `/^[A-Z][a-z]+, \d{1,2} [A-Z][a-z]+ \d{4}$/`
    - Configure fast-check with `numRuns: 100`

  - [ ]* 9.4 Write property test for flip clock digit safety
    - **Property 2: Flip clock digit safety**
    - **Validates: Requirement 3.2**
    - Generate random digit characters `'0'`–`'9'`; after calling `flipClock.setCard(card, v)` on a jsdom card element, assert `card.dataset.v === v` and `/^[0-9]$/.test(v)`
    - Configure fast-check with `numRuns: 100`

  - [ ]* 9.5 Write property test for language toggle idempotency
    - **Property 3: Language toggle idempotency**
    - **Validates: Requirements 5.2, 5.3**
    - Generate random language (`en`/`id`); call `applyLanguage()` twice and assert every `[data-i18n]` element has the same `textContent` as after a single call
    - Configure fast-check with `numRuns: 100`

  - [ ]* 9.6 Write property test for duplicate task prevention
    - **Property 4: Duplicate task prevention**
    - **Validates: Requirement 9.2**
    - Generate a task list with an existing task, then generate whitespace/case variants of the existing text; assert `addTask(variant)` returns `false` and `state.tasks.length` is unchanged
    - Configure fast-check with `numRuns: 100`

  - [ ]* 9.7 Write property test for LocalStorage round-trip
    - **Property 5: LocalStorage round-trip**
    - **Validates: Requirement 15.1**
    - Generate random JSON-serializable values (strings, numbers, booleans, arrays, nested objects); assert `loadFromStorage(k, fallback)` deeply equals the value saved by `saveToStorage(k, V)`
    - Configure fast-check with `numRuns: 100`

  - [ ]* 9.8 Write unit tests for edge cases and examples
    - Empty-name edit falls back to default name (`t('name.default')`) — _Requirement 2.9_
    - `/` shortcut ignored while an input/textarea/select/contenteditable is focused — _Requirement 12.1_
    - Missing/corrupt storage entries hydrate to defaults — _Requirement 15.2_
    - Single CSS file in `css/`, single JS file in `js/` — _Requirement 16.4_
    - Default `soundEnabled === true` on fresh load — _Requirement 17.4_
    - Calendar element exists in header-left and renders a date — _Requirement 1.1_
    - Flip clock container exists in header-right — _Requirement 3.1_
    - 12h shows AM/PM, 24h hides it — _Requirements 3.5, 3.6_
    - Card titles localize EN/ID — _Requirements 5.4, 5.5_

  - [ ]* 9.9 Write integration tests for persistence and cross-module behavior
    - Language preference persists and restores across a simulated reload — _Requirements 5.6, 5.7_
    - Clock format preference persists and restores, default 12h — _Requirements 4.3, 4.4_
    - Theme persists, OS-preference fallback — _Requirements 6.3, 6.4_
    - SFX plays on task completion with mocked `AudioContext` — _Requirement 7.3_
    - Timer chime + session-counter increment on completion with fake timers — _Requirement 8.5_
    - Tasks/links/filter/sort persist and restore — _Requirements 9.11, 9.12, 10.7, 10.8_
    - Confetti spawns on task completion in jsdom — _Requirement 9.4_

  **Implements:** Requirements 1.1, 1.2, 1.3, 2.9, 3.1, 3.2, 3.5, 3.6, 4.3, 4.4, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 6.3, 6.4, 7.3, 8.5, 9.2, 9.4, 9.11, 9.12, 10.7, 10.8, 12.1, 15.1, 15.2, 16.4, 17.4

- [ ] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["8.1"] },
    { "id": 1, "tasks": ["8.2", "8.5"] },
    { "id": 2, "tasks": ["8.3"] },
    { "id": 3, "tasks": ["8.4"] },
    { "id": 4, "tasks": ["7.11", "9.1", "9.2"] },
    { "id": 5, "tasks": ["9.3", "9.4", "9.5", "9.6", "9.7", "9.8", "9.9"] }
  ]
}
```

Dependencies:
- Task 8.1 (add missing i18n keys) has no dependencies — it is the foundation for Tasks 8.2–8.5
- Task 8.2 (localize toggle labels in app.js) depends on 8.1 (keys must exist)
- Task 8.3 (localize name fallback in app.js) depends on 8.1; placed in a later wave than 8.2 since both write to app.js
- Task 8.4 (localize progress pill in app.js) depends on 8.1; placed in a later wave than 8.3 since both write to app.js
- Task 8.5 (add data-i18n attributes in index.html) depends on 8.1 (keys must exist for runtime resolution); runs in parallel with 8.2 since it writes to a different file
- Task 7.11 (cross-browser verification) depends on all Task 8 code changes being complete
- Task 9.1 (test infrastructure) creates new files, no file conflicts; can run alongside 7.11
- Task 9.2 (test harness in app.js) depends on Task 8.4 completing (both write to app.js); runs alongside 9.1
- Tasks 9.3–9.9 (test files in test/ directory) depend on 9.1 (infrastructure) and 9.2 (harness exposure); all create different files and run in parallel
