# CodingCamp-2November26-Dedi-Triwibowo
Mini Project - Coding Camp  - Batch 2 November 2026 - Dedi Triwibowo

## 📋 Life Dashboard

A clean, minimal **homepage-style dashboard** that helps you organize your day. It shows the current time, a formatted calendar, a personalized greeting, a Pomodoro focus timer, a full to-do list, and quick links to your favorite websites — all in one page, with a dark mode and bilingual (English / Indonesian) support.

Built with **plain HTML, CSS, and Vanilla JavaScript** — no frameworks, no build tools, no backend. All your data stays in your browser via LocalStorage.

---

## ✨ Features

### Header
| Element | Location | Description |
|---------|----------|-------------|
| **Calendar** | Top-left | Full date in `Friday, November 6, 2026` format (EN) or `Jumat, 6 November 2026` format (ID). Updates automatically. |
| **Greeting** | Below calendar | Time-based greeting (`Good morning / afternoon / evening / night`) with your custom name. Uses the elegant **Outfit** font. |
| **Clock** | Top-right | Live ticking clock (HH:MM:SS) with tabular numerals. |
| **Language toggle** | Top-right | Switch between **EN** and **ID** — all text and calendar formatting follow. |
| **Theme toggle** | Top-right | Switch between **light** and **dark** mode. Preference is saved. |

### Focus Timer (Pomodoro)
- Configurable duration (1–120 minutes), default **25 min** — adjust with `+`/`−` buttons (in steps of 5). Your choice is saved.
- Animated **circular progress ring** that depletes as time counts down.
- **Start**, **Stop**, and **Reset** buttons.
- A subtle beep plays when the timer finishes.
- A gentle pulse animation on the timer while running.

### To-Do List
- **Add** tasks by typing and pressing Enter or clicking Add.
- **Edit** tasks — click the pencil icon, or double-click the task text. Press Enter to save, Esc to cancel.
- **Mark done** — click the checkbox to toggle a strikethrough style.
- **Delete** tasks with the trash icon.
- **Prevent duplicates** — adding a task that already exists (case-insensitive) shows a warning toast.
- **Sort tasks** — by added order, by name (A–Z), or by status (incomplete first).
- Task counter showing completed/total.
- Everything is **saved in LocalStorage** and persists across page reloads.

### Quick Links
- Add custom website shortcuts with a name and URL.
- Each link displays the site's favicon with a letter fallback.
- Click a tile to open the site in a new tab.
- Delete links with the `×` button (appears on hover).
- Links are **saved in LocalStorage**.

### Visual Effects
- Glassmorphism cards with backdrop blur.
- Animated gradient background blobs that gently float.
- Hover effects: cards lift, buttons scale and glow, todo items slide, link tiles pop.
- Smooth fade-in and slide-in entrance animations.
- Smooth theme transitions.

---

## 🗂️ Project Structure

```
CodingCamp-2November26-Dedi-Triwibowo/
├── index.html          # Page structure
├── css/
│   └── style.css        # All styling (single file)
├── js/
│   └── script.js        # All logic (single file)
└── README.md            # This file
```

> Folder rules followed: exactly **1 CSS file** in `css/` and **1 JavaScript file** in `js/`.

---

## 🚀 Getting Started

No installation required. Just open the page:

1. Open the `index.html` file in any modern browser (Chrome, Firefox, Edge, Safari).
2. That's it — the dashboard loads immediately with default settings.

### Use as a browser homepage / extension

You can set this as your browser's new-tab page or homepage:
- **Chrome / Edge:** Settings → On startup → Open a specific page → paste the file path, or host the folder locally.
- **As an extension:** Package the folder as an unpacked extension and point it at `index.html`.

---

## ⚙️ Technical Details

| Constraint | How it's met |
|------------|--------------|
| **Technology stack** | HTML + CSS + Vanilla JS only. No React, Vue, or any framework. |
| **Data storage** | Browser `localStorage` API — all data client-side. Keys are prefixed `ld_`. |
| **Browser compatibility** | Uses standard web APIs (LocalStorage, AudioContext, SVG, CSS custom properties). Works in modern Chrome, Firefox, Edge, and Safari. |
| **No backend** | The app runs entirely in the browser. No server, no API calls. |

### LocalStorage Keys

| Key | Purpose |
|-----|---------|
| `ld_theme` | Saved theme (`light` / `dark`) |
| `ld_lang` | Saved language (`en` / `id`) |
| `ld_name` | Custom greeting name |
| `ld_todos` | To-do list array |
| `ld_links` | Quick links array |
| `ld_pomodoro_minutes` | Timer duration in minutes |

### Fonts
- [**Outfit**](https://fonts.google.com/specimen/Outfit) — elegant font for the greeting, clock, timer, and headings.
- [**Inter**](https://fonts.google.com/specimen/Inter) — clean, readable font for body text and UI elements.

---

## 🌐 Language Support

The entire interface and calendar system support **English (EN)** and **Indonesian (ID)**. Toggle with the button in the top-right corner. The calendar switches day and month names, and the date format adapts:

- **EN:** `Friday, November 6, 2026`
- **ID:** `Jumat, 6 November 2026`

Greeting time brackets:

| Hours | English | Indonesian |
|-------|---------|------------|
| 00–10 | Good morning | Selamat pagi |
| 11–14 | Good afternoon | Selamat siang |
| 15–17 | Good evening | Selamat sore |
| 18–23 | Good night | Selamat malam |

---

## 🎯 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Add a task | Type in task box, press **Enter** |
| Save edited task | Press **Enter** while editing |
| Cancel edit | Press **Esc** while editing |
| Add a link | Fill both fields, press **Enter** |
| Toggle task done | Click checkbox, or **Space**/**Enter** when focused |

---

## 🔧 Customization Tips

- **Change accent color:** Edit the `--accent` and `--accent-soft` CSS variables at the top of `style.css`.
- **Change timer step:** The `+`/`−` buttons change by 5 minutes — adjust in `setTimerMinutes` calls in `script.js`.
- **Change greeting thresholds:** Edit the hour ranges in `getGreetingKey()` in `script.js`.

---

## 📄 License

This project is created for the Coding Camp (2 November 2026) by Dedi Triwibowo. Free to use and modify.
