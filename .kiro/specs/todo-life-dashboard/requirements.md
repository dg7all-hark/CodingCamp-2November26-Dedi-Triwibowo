# Requirements Document

## Introduction

The To-Do List Life Dashboard is a single-page personal productivity homepage built with HTML, CSS, and Vanilla JavaScript (no frameworks, no backend). All user data is persisted client-side in the browser LocalStorage. The dashboard combines a live animated flip clock, a calendar date block, a personalized greeting with an editable display name, a Pomodoro-style focus timer, a smart to-do list with duplicate prevention, and a quick-links grid.

This feature iteration introduces three changes on top of the existing dashboard: (1) the top-left text clock is replaced by a long-format calendar date block that localizes between English and Indonesian, (2) the top-right text clock is replaced by a live animated split-flap flip clock, and (3) a new EN/ID language toggle is added that localizes all UI text between English and Indonesian. The existing dark/light theme toggle, SFX toggle (default ON), focus timer, to-do list, quick links, editable name, spotlight/confetti interaction effects, and LocalStorage persistence are preserved unchanged.

## Glossary

- **Life_Dashboard**: The single-page web application as a whole, comprising the header, bento grid workspace, and footer.
- **Flip_Clock**: The animated split-flap card clock component that displays the current time using flipping digit cards for hours, minutes, and seconds, with blinking dot separators and an AM/PM label.
- **Calendar_Block**: The date display component shown in the top-left header area, rendering the current date in a localized long format.
- **Greeting**: The time-of-day salutation displayed above the editable display name (e.g., "Good morning," / "Selamat pagi,").
- **Display_Name**: The user-editable name shown in the greeting heading, persisted to LocalStorage.
- **Language_Toggle**: The header pill button that switches all UI text between English and Indonesian.
- **Clock_Format_Toggle**: The header pill button that switches the Flip_Clock between 12-hour and 24-hour display.
- **Theme_Toggle**: The header pill button that switches the Life_Dashboard between light and dark color themes.
- **SFX_Toggle**: The header pill button that enables or disables acoustic feedback sounds.
- **Focus_Timer**: The Pomodoro timer component with preset durations, a custom minutes input, an SVG progress ring, and Start/Pause/Reset/+1m controls.
- **Task_List**: The to-do list component supporting add, edit, delete, complete, duplicate prevention, filter, sort, and clear-done actions.
- **Quick_Links**: The favorite-website shortcut component rendered as a favicon grid with add/delete actions.
- **Progress_Pill**: The header summary pill showing completed versus total task counts.
- **Web_Audio_API**: The browser audio API used to synthesize the task-completion sound and timer-completion chime.
- **LocalStorage**: The browser client-side key/value storage used for all data persistence.
- **Bento_Cards**: The card-based grid panels (Focus Timer, Quick Links, Today's Tasks) that host the workspace modules.
- **English**: The default UI language.
- **Indonesian**: The alternate UI language selectable via the Language_Toggle.

## Requirements

### Requirement 1: Calendar Date Block

**User Story:** As a user, I want to see the current date in a long-format calendar block in the top-left header area, so that I have clear calendar context alongside my greeting.

#### Acceptance Criteria

1. THE Calendar_Block SHALL display the current date in long format in the top-left area of the header.
2. WHILE the language is English, THE Calendar_Block SHALL render the date in the form "Friday, November 6, 2026" (full weekday, full month, numeric day, full year).
3. WHILE the language is Indonesian, THE Calendar_Block SHALL render the date in the form "Jumat, 6 November 2026" (full weekday, numeric day, full month, full year).
4. WHEN the current date changes, THE Calendar_Block SHALL update its display to reflect the new date.

### Requirement 2: Personalized Greeting and Editable Display Name

**User Story:** As a user, I want a time-of-day greeting with an editable name rendered in the Plus Jakarta Sans font, so that the dashboard feels personal and polished.

#### Acceptance Criteria

1. THE Life_Dashboard SHALL display a time-of-day Greeting above the Display_Name in the top-left header area.
2. THE Greeting and Display_Name SHALL render using the Plus Jakarta Sans font family.
3. WHEN the local time is between 05:00 and 11:59, THE Life_Dashboard SHALL display "Good morning," in English and "Selamat pagi," in Indonesian.
4. WHEN the local time is between 12:00 and 16:59, THE Life_Dashboard SHALL display "Good afternoon," in English and "Selamat siang," in Indonesian.
5. WHEN the local time is between 17:00 and 20:59, THE Life_Dashboard SHALL display "Good evening," in English and "Selamat sore," in Indonesian.
6. WHEN the local time is between 21:00 and 04:59, THE Life_Dashboard SHALL display "Good night," in English and "Selamat malam," in Indonesian.
7. WHEN the Display_Name is clicked, THE Life_Dashboard SHALL make the name editable in place.
8. WHEN the Display_Name edit is committed, THE Life_Dashboard SHALL persist the name to LocalStorage and show a transient "Saved" confirmation badge.
9. IF the committed Display_Name is empty, THEN THE Life_Dashboard SHALL fall back to a default name.

### Requirement 3: Live Flip Clock

**User Story:** As a user, I want an animated split-flap flip clock in the top-right header area, so that the time display is visually engaging.

#### Acceptance Criteria

1. THE Flip_Clock SHALL display the current time in the top-right area of the header, replacing the previous text-based hero clock.
2. THE Flip_Clock SHALL render the hours, minutes, and seconds as separate animated flip card digits.
3. WHEN a digit value changes, THE Flip_Clock SHALL animate the flip card transition for that digit.
4. THE Flip_Clock SHALL display blinking dot separators between the hours, minutes, and seconds digit groups.
5. WHILE the Clock_Format_Toggle is set to 12-hour mode, THE Flip_Clock SHALL display an AM or PM label.
6. WHILE the Clock_Format_Toggle is set to 24-hour mode, THE Flip_Clock SHALL hide the AM/PM label.

### Requirement 4: Clock Format Toggle

**User Story:** As a user, I want to toggle between 12-hour and 24-hour time formats, so that I can view time in my preferred format.

#### Acceptance Criteria

1. THE Life_Dashboard SHALL provide a Clock_Format_Toggle pill button in the header.
2. WHEN the Clock_Format_Toggle is pressed, THE Flip_Clock SHALL switch between 12-hour and 24-hour display formats.
3. THE Life_Dashboard SHALL persist the selected clock format to LocalStorage.
4. WHEN the page loads, THE Life_Dashboard SHALL restore the clock format from LocalStorage, falling back to 12-hour mode by default.

### Requirement 5: EN/ID Language Toggle

**User Story:** As a user, I want to toggle the entire UI text between English and Indonesian, so that I can use the dashboard in my preferred language.

#### Acceptance Criteria

1. THE Life_Dashboard SHALL provide a Language_Toggle pill button in the header alongside the other header pills.
2. WHEN the Language_Toggle is pressed, THE Life_Dashboard SHALL switch all UI text between English and Indonesian.
3. WHEN the language changes, THE Life_Dashboard SHALL localize the Calendar_Block date format, the Greeting text, the card titles, the button labels, the filter tabs, the sort labels and options, the footer text, the empty-state messages, and the duplicate-warning text.
4. WHILE the language is English, THE Life_Dashboard SHALL display card titles "Focus Timer", "Today's Tasks", and "Quick Links".
5. WHILE the language is Indonesian, THE Life_Dashboard SHALL display card titles "Timer Fokus", "Tugas Hari Ini", and "Tautan Cepat".
6. THE Life_Dashboard SHALL persist the selected language to LocalStorage.
7. WHEN the page loads, THE Life_Dashboard SHALL restore the language from LocalStorage, falling back to English by default.

### Requirement 6: Dark and Light Theme Toggle

**User Story:** As a user, I want to toggle between dark and light themes, so that I can use the dashboard comfortably in any lighting.

#### Acceptance Criteria

1. THE Life_Dashboard SHALL provide a Theme_Toggle pill button in the header.
2. WHEN the Theme_Toggle is pressed, THE Life_Dashboard SHALL switch between the light and dark themes.
3. THE Life_Dashboard SHALL persist the selected theme to LocalStorage.
4. WHERE no theme preference is saved in LocalStorage, THE Life_Dashboard SHALL default to the operating system color-scheme preference.
5. WHEN the page loads, THE Life_Dashboard SHALL apply the saved theme before first paint to prevent a theme flash.

### Requirement 7: Sound Effects Toggle

**User Story:** As a user, I want optional sound effects for task completion and timer chimes, so that I receive audio feedback; the sound effects shall be on by default.

#### Acceptance Criteria

1. THE Life_Dashboard SHALL provide an SFX_Toggle pill button in the header.
2. THE Life_Dashboard SHALL default the sound effects setting to ON.
3. WHEN a task is completed and sound effects are ON, THE Life_Dashboard SHALL play a task-completion sound via the Web_Audio_API.
4. WHEN the Focus_Timer reaches zero and sound effects are ON, THE Life_Dashboard SHALL play a timer-completion chime via the Web_Audio_API.
5. THE Life_Dashboard SHALL persist the sound effects preference to LocalStorage.
6. WHEN the page loads, THE Life_Dashboard SHALL restore the sound effects setting from LocalStorage, falling back to ON by default.

### Requirement 8: Focus Timer

**User Story:** As a user, I want a Pomodoro focus timer with presets and a custom duration, so that I can run structured work sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL provide preset duration buttons for 15, 25, 45, and 60 minutes.
2. THE Focus_Timer SHALL provide a custom minutes input accepting values between 1 and 120.
3. WHILE the timer is running, THE Focus_Timer SHALL display the remaining time and animate an SVG progress ring to reflect elapsed progress.
4. THE Focus_Timer SHALL provide Start/Pause, Reset, and "+1m" controls.
5. WHEN the Focus_Timer reaches zero, THE Focus_Timer SHALL increment the completed-sessions counter and play the timer-completion chime if sound effects are ON.
6. THE Focus_Timer SHALL persist the configured duration and completed-sessions counter to LocalStorage.
7. WHEN the page loads, THE Life_Dashboard SHALL restore the Focus_Timer duration and completed-sessions counter from LocalStorage.

### Requirement 9: To-Do List

**User Story:** As a user, I want to add, edit, delete, complete, filter, sort, and clear my tasks, so that I can organize my day.

#### Acceptance Criteria

1. WHEN a new task is submitted with non-empty text, THE Task_List SHALL add the task with a unique id, a completed state of false, and a creation timestamp.
2. IF a submitted task text matches an existing task text case-insensitively after whitespace normalization, THEN THE Task_List SHALL reject the duplicate and show a duplicate warning.
3. WHEN a task checkbox is toggled, THE Task_List SHALL mark the task complete or incomplete and update the progress indicators.
4. WHEN a task is marked complete and sound effects are ON, THE Life_Dashboard SHALL play the task-completion sound and spawn micro-confetti at the checkbox.
5. WHEN a task text is double-clicked or the edit action is invoked, THE Task_List SHALL enter inline edit mode for that task.
6. WHEN an inline edit is committed, THE Task_List SHALL save the new text if it is non-empty and not a duplicate of another task.
7. THE Task_List SHALL provide filter tabs for All, Active, and Completed.
8. THE Task_List SHALL provide a sort dropdown with the options Incomplete First, Newest First, Oldest First, and Alphabetical.
9. WHEN at least one task is completed, THE Task_List SHALL provide a Clear Done action that removes all completed tasks.
10. THE Task_List SHALL display a progress bar and a counter reflecting the completed-to-total task ratio.
11. THE Task_List SHALL persist all tasks, the active filter, and the sort selection to LocalStorage.
12. WHEN the page loads, THE Life_Dashboard SHALL restore the tasks, active filter, and sort selection from LocalStorage.

### Requirement 10: Quick Links

**User Story:** As a user, I want to save and manage favorite website shortcuts, so that I can access them quickly from the dashboard.

#### Acceptance Criteria

1. THE Quick_Links SHALL provide an Add Link drawer form with title and URL inputs.
2. WHEN a submitted URL has no protocol, THE Quick_Links SHALL prepend "https://" and validate the resulting URL.
3. IF a submitted URL matches an existing link URL case-insensitively, THEN THE Quick_Links SHALL reject the duplicate and show an inline error message.
4. IF a submitted title is empty or the URL is invalid, THEN THE Quick_Links SHALL show an inline error message and not save the link.
5. THE Quick_Links SHALL render each saved link as a pill containing a favicon and the link title, opening in a new browser tab.
6. THE Quick_Links SHALL allow deletion of individual saved links.
7. THE Quick_Links SHALL persist all saved links to LocalStorage.
8. WHEN the page loads, THE Life_Dashboard SHALL restore the saved links from LocalStorage.

### Requirement 11: Task Progress Pill

**User Story:** As a user, I want a quick summary of task completion in the header, so that I can see my progress at a glance.

#### Acceptance Criteria

1. THE Life_Dashboard SHALL display a Progress_Pill in the header showing the completed and total task counts.
2. WHEN a task is added, completed, uncompleted, or deleted, THE Life_Dashboard SHALL update the Progress_Pill to reflect the current counts.

### Requirement 12: Keyboard Shortcuts

**User Story:** As a user, I want keyboard shortcuts for common actions, so that I can operate the dashboard quickly without the mouse.

#### Acceptance Criteria

1. WHEN the "/" key is pressed while no input, textarea, select, or contenteditable element is focused, THE Life_Dashboard SHALL focus the new-task input.
2. WHEN "Alt+T" is pressed, THE Life_Dashboard SHALL toggle the theme.
3. WHEN "Alt+S" is pressed, THE Life_Dashboard SHALL start or pause the Focus_Timer.

### Requirement 13: Visual Design and Interaction Effects

**User Story:** As a user, I want smooth, polished interactions, so that the dashboard feels high-quality and responsive.

#### Acceptance Criteria

1. THE Life_Dashboard SHALL render the Bento_Cards in a bento grid layout with a cursor-tracked spotlight effect on hover.
2. THE Life_Dashboard SHALL apply button lift and active-scale animations to interactive buttons.
3. WHEN a task item is added, THE Task_List SHALL animate the item sliding into view.
4. WHEN a task is completed, THE Life_Dashboard SHALL spawn micro-confetti at the task checkbox.
5. WHILE the Focus_Timer is running, THE Focus_Timer card SHALL display a running-state glow effect.

### Requirement 14: Responsive Layout

**User Story:** As a user, I want the dashboard to adapt to different screen sizes, so that I can use it on desktop and mobile devices.

#### Acceptance Criteria

1. WHILE the viewport width is narrower than 1024 pixels, THE Life_Dashboard SHALL stack the left and right bento columns into a single vertical flow.
2. WHILE the viewport width is narrower than 720 pixels, THE Life_Dashboard SHALL stack the task form vertically and reduce the outer padding.

### Requirement 15: Data Persistence

**User Story:** As a user, I want all my data and preferences saved locally, so that they persist across browser sessions without a backend.

#### Acceptance Criteria

1. THE Life_Dashboard SHALL persist the theme, Display_Name, clock format, sound effects setting, Focus_Timer configuration, tasks, links, sort selection, and language to LocalStorage.
2. WHEN the page loads, THE Life_Dashboard SHALL hydrate all state from LocalStorage, falling back to defined defaults for any missing or invalid entry.

### Requirement 16: Technical Constraints

**User Story:** As a developer, I want clear technical constraints, so that the implementation remains maintainable, lightweight, and browser-portable.

#### Acceptance Criteria

1. THE Life_Dashboard SHALL be implemented using HTML, CSS, and Vanilla JavaScript only, with no frameworks or build step.
2. THE Life_Dashboard SHALL use browser LocalStorage for all data persistence, with no server or backend.
3. THE Life_Dashboard SHALL be compatible with modern versions of Chrome, Firefox, Edge, and Safari.
4. THE Life_Dashboard SHALL contain exactly one CSS file inside the css/ directory and exactly one JavaScript file inside the js/ directory.

### Requirement 17: Non-Functional Quality Attributes

**User Story:** As a user, I want a simple, fast, and readable dashboard, so that I can use it daily without friction.

#### Acceptance Criteria

1. THE Life_Dashboard SHALL present a clean minimal interface with no complex setup or test setup required.
2. THE Life_Dashboard SHALL load and respond to user input without noticeable lag on a modern device.
3. THE Life_Dashboard SHALL maintain a clear visual hierarchy and readable typography, using Plus Jakarta Sans for the greeting area.
4. WHERE sound effects have not been explicitly disabled by the user, THE Life_Dashboard SHALL keep sound effects on by default.
