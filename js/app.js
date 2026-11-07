/**
 * To-Do List Life Dashboard — Core Application Logic (js/app.js)
 * Stack: Pure Vanilla JavaScript (ES6+) + Browser LocalStorage API
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. STORAGE KEYS & DEFAULT STATE
     ========================================================================== */
  const STORAGE_KEYS = {
    THEME: 'life_dashboard_theme',
    USERNAME: 'life_dashboard_username',
    CLOCK_24H: 'life_dashboard_clock_24h',
    SOUND: 'life_dashboard_sound',
    TIMER_CONFIG: 'life_dashboard_timer_config',
    TASKS: 'life_dashboard_tasks',
    LINKS: 'life_dashboard_links',
    SORT: 'life_dashboard_sort',
    LANGUAGE: 'life_dashboard_language'
  };

  const DEFAULT_TASKS = [
    {
      id: 'task-seed-1',
      text: 'Review daily priorities and top 3 focus goals',
      completed: true,
      createdAt: Date.now() - 3600 * 1000 * 3
    },
    {
      id: 'task-seed-2',
      text: 'Complete one 25-minute deep work Pomodoro session',
      completed: false,
      createdAt: Date.now() - 3600 * 1000 * 2
    },
    {
      id: 'task-seed-3',
      text: 'Clear inbox and respond to pending messages',
      completed: false,
      createdAt: Date.now() - 3600 * 1000 * 1
    }
  ];

  const DEFAULT_LINKS = [
    { id: 'link-1', title: 'GitHub', url: 'https://github.com' },
    { id: 'link-2', title: 'Notion', url: 'https://www.notion.so' },
    { id: 'link-3', title: 'Gmail', url: 'https://mail.google.com' },
    { id: 'link-4', title: 'Calendar', url: 'https://calendar.google.com' },
    { id: 'link-5', title: 'YouTube', url: 'https://www.youtube.com' },
    { id: 'link-6', title: 'Developer Docs', url: 'https://developer.mozilla.org' }
  ];

  /* ==========================================================================
     I18N STRING DICTIONARY (English & Indonesian)
     ========================================================================== */
  const I18N_STRINGS = {
    en: {
      greeting: {
        morning:   'Good morning,',
        afternoon: 'Good afternoon,',
        evening:   'Good evening,',
        night:     'Good night,'
      },
      cardTitles: {
        focusTimer: 'Focus Timer',
        todayTasks: "Today's Tasks",
        quickLinks: 'Quick Links'
      },
      timer: {
        ready:    'Ready',
        focusing: 'Focusing...',
        paused:   'Paused',
        complete: 'Session Complete!',
        target:   'target',
        start:    'Start',
        pause:    'Pause',
        resume:   'Resume',
        reset:    'Reset',
        sessionsDone: (n) => n === 1 ? '1 session done' : `${n} sessions done`
      },
      tasks: {
        placeholder:     'Add a new task for today...',
        addTask:         '+ Add Task',
        clearDone:       'Clear Done',
        done:            'done',
        all:             'All',
        active:          'Active',
        completed:       'Completed',
        sortBy:          'Sort by:',
        sortIncomplete:  'Incomplete First',
        sortNewest:      'Newest First',
        sortOldest:      'Oldest First',
        sortAlpha:       'Alphabetical (A\u2013Z)',
        taskCounter:     (done, total) => `${done} of ${total} done`
      },
      links: {
        addLink:         '+ Add Link',
        saveLink:        'Save Link',
        cancel:          'Cancel',
        titlePlaceholder:'Title (e.g., Figma)',
        urlPlaceholder:  'URL (e.g., figma.com)',
        errorTitle:      'Please enter a short title.',
        errorUrl:        'Please enter a valid website URL.',
        errorDuplicate:  'This website is already in your Quick Links.',
        emptyTitle:      'No quick links saved yet.',
        emptyRestore:    'Restore Starter Links'
      },
      footer: {
        info:              'All data is stored locally in your browser via Local Storage. Double-click any task to edit inline.',
        shortcutNewTask:   'New Task',
        shortcutTimer:     'Start/Pause Timer',
        shortcutTheme:     'Toggle Theme'
      },
      duplicate: {
        warning: (text) => `Duplicate prevented: "${text}" is already in your list.`
      },
      empty: {
        clearTitle:       'Your task list is clear',
        clearDesc:        'Add a task above to structure your day with intention.',
        allDoneTitle:     'All tasks completed!',
        allDoneDesc:      'Every single item on your list is checked off. Great work today.',
        noCompletedTitle: 'No completed tasks yet',
        noCompletedDesc:  'Check off a task as you make progress through your day.'
      },
      displayName: {
        hint: 'edit your display name'
      },
      date: {
        weekdays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        months:   ['January','February','March','April','May','June','July','August','September','October','November','December']
      }
    },
    id: {
      greeting: {
        morning:   'Selamat pagi,',
        afternoon: 'Selamat siang,',
        evening:   'Selamat sore,',
        night:     'Selamat malam,'
      },
      cardTitles: {
        focusTimer: 'Timer Fokus',
        todayTasks: 'Tugas Hari Ini',
        quickLinks: 'Tautan Cepat'
      },
      timer: {
        ready:    'Siap',
        focusing: 'Berfokus...',
        paused:   'Jeda',
        complete: 'Sesi Selesai!',
        target:   'target',
        start:    'Mulai',
        pause:    'Jeda',
        resume:   'Lanjut',
        reset:    'Atur Ulang',
        sessionsDone: (n) => n === 1 ? '1 sesi selesai' : `${n} sesi selesai`
      },
      tasks: {
        placeholder:     'Tambah tugas untuk hari ini...',
        addTask:         '+ Tambah Tugas',
        clearDone:       'Hapus Selesai',
        done:            'selesai',
        all:             'Semua',
        active:          'Aktif',
        completed:       'Selesai',
        sortBy:          'Urutkan:',
        sortIncomplete:  'Belum Selesai Dulu',
        sortNewest:      'Terbaru Dulu',
        sortOldest:      'Terlama Dulu',
        sortAlpha:       'Abjad (A\u2013Z)',
        taskCounter:     (done, total) => `${done} dari ${total} selesai`
      },
      links: {
        addLink:         '+ Tambah Tautan',
        saveLink:        'Simpan Tautan',
        cancel:          'Batal',
        titlePlaceholder:'Judul (mis., Figma)',
        urlPlaceholder:  'URL (mis., figma.com)',
        errorTitle:      'Masukkan judul singkat.',
        errorUrl:        'Masukkan URL situs yang valid.',
        errorDuplicate:  'Situs ini sudah ada di Tautan Cepat Anda.',
        emptyTitle:      'Belum ada tautan cepat.',
        emptyRestore:    'Pulihkan Tautan Awal'
      },
      footer: {
        info:              'Semua data disimpan di browser Anda melalui Local Storage. Klik dua kali tugas untuk mengedit.',
        shortcutNewTask:   'Tugas Baru',
        shortcutTimer:     'Mulai/Jeda Timer',
        shortcutTheme:     'Ganti Tema'
      },
      duplicate: {
        warning: (text) => `Duplikat dicegah: "${text}" sudah ada di daftar Anda.`
      },
      empty: {
        clearTitle:       'Daftar tugas Anda kosong',
        clearDesc:        'Tambahkan tugas di atas untuk menyusun hari Anda.',
        allDoneTitle:     'Semua tugas selesai!',
        allDoneDesc:      'Setiap tugas di daftar Anda sudah dicentang. Kerja bagus!',
        noCompletedTitle: 'Belum ada tugas selesai',
        noCompletedDesc:  'Centang tugas saat Anda menyelesaikannya.'
      },
      displayName: {
        hint: 'ubah nama tampilan'
      },
      date: {
        weekdays: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
        months:   ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
      }
    }
  };

  function t(key) {
    const keys = key.split('.');
    let val = I18N_STRINGS[state.language];
    for (const k of keys) {
      if (val == null) break;
      val = val[k];
    }
    if (val !== undefined && typeof val !== 'function') return val;
    // fallback to English
    let en = I18N_STRINGS['en'];
    for (const k of keys) {
      if (en == null) break;
      en = en[k];
    }
    if (en !== undefined && typeof en !== 'function') return en;
    return key;
  }

  function tf(key, ...args) {
    const keys = key.split('.');
    let fn = I18N_STRINGS[state.language];
    for (const k of keys) {
      if (fn == null) break;
      fn = fn[k];
    }
    if (typeof fn === 'function') return fn(...args);
    // fallback to English
    let enFn = I18N_STRINGS['en'];
    for (const k of keys) {
      if (enFn == null) break;
      enFn = enFn[k];
    }
    if (typeof enFn === 'function') return enFn(...args);
    return key;
  }

  function formatDate(date, lang) {
    const d = (I18N_STRINGS[lang] || I18N_STRINGS['en']).date;
    if (lang === 'en') {
      return `${d.weekdays[date.getDay()]}, ${d.months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
    return `${d.weekdays[date.getDay()]}, ${date.getDate()} ${d.months[date.getMonth()]} ${date.getFullYear()}`;
  }

  function getGreeting(hour, lang) {
    const g = (I18N_STRINGS[lang] || I18N_STRINGS['en']).greeting;
    if (hour >= 5 && hour < 12)  return g.morning;
    if (hour >= 12 && hour < 17) return g.afternoon;
    if (hour >= 17 && hour < 21) return g.evening;
    return g.night;
  }

  function applyStaticStrings() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('[data-i18n-option]').forEach((el) => {
      el.textContent = t(el.getAttribute('data-i18n-option'));
    });
  }

  function updateLanguageLabel() {
    if (dom.languageToggleBtn) {
      dom.languageToggleBtn.textContent = state.language === 'en' ? 'EN' : 'ID';
      if (state.language === 'id') {
        dom.languageToggleBtn.classList.add('active-toggle');
      } else {
        dom.languageToggleBtn.classList.remove('active-toggle');
      }
    }
  }

  function applyLanguage() {
    applyStaticStrings();
    updateClockAndGreeting();
    updateTimerUI();
    renderTasks();
    renderQuickLinks();
    updateLanguageLabel();
  }

  function toggleLanguage() {
    state.language = state.language === 'en' ? 'id' : 'en';
    saveToStorage(STORAGE_KEYS.LANGUAGE, state.language);
    applyLanguage();
  }

  /* ==========================================================================
     2. APPLICATION STATE
     ========================================================================== */
  const state = {
    theme: 'light',
    username: 'Alex',
    use24HourClock: false,
    soundEnabled: true,
    timer: {
      durationMinutes: 25,
      remainingSeconds: 25 * 60,
      isRunning: false,
      intervalId: null,
      sessionsCompleted: 0
    },
    tasks: [],
    taskFilter: 'all', // 'all' | 'active' | 'completed'
    taskSort: 'incomplete', // 'incomplete' | 'newest' | 'oldest' | 'alpha'
    editingTaskId: null,
    links: [],
    language: 'en' // 'en' | 'id' — current UI language
  };

  /* ==========================================================================
     3. LOCAL STORAGE HELPERS
     ========================================================================== */
  function loadFromStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      console.warn(`Failed to read ${key} from LocalStorage:`, err);
      return fallback;
    }
  }

  function saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`Failed to save ${key} to LocalStorage:`, err);
    }
  }

  function hydrateState() {
    // Theme preference
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      state.theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      state.theme = 'dark';
    }

    // Username
    const savedName = localStorage.getItem(STORAGE_KEYS.USERNAME);
    if (savedName && savedName.trim().length > 0) {
      state.username = savedName.trim();
    }

    // Clock format & sound
    state.use24HourClock = loadFromStorage(STORAGE_KEYS.CLOCK_24H, false);
    state.soundEnabled = loadFromStorage(STORAGE_KEYS.SOUND, true);

    // Timer Config
    const savedTimer = loadFromStorage(STORAGE_KEYS.TIMER_CONFIG, null);
    if (savedTimer && typeof savedTimer.durationMinutes === 'number') {
      const clampedMins = Math.min(120, Math.max(1, Math.round(savedTimer.durationMinutes)));
      state.timer.durationMinutes = clampedMins;
      state.timer.remainingSeconds = clampedMins * 60;
      state.timer.sessionsCompleted = savedTimer.sessionsCompleted || 0;
    }

    // Tasks
    const savedTasks = loadFromStorage(STORAGE_KEYS.TASKS, null);
    if (Array.isArray(savedTasks)) {
      state.tasks = savedTasks;
    } else {
      state.tasks = DEFAULT_TASKS;
      saveToStorage(STORAGE_KEYS.TASKS, state.tasks);
    }

    // Sort preference
    const savedSort = localStorage.getItem(STORAGE_KEYS.SORT);
    if (['incomplete', 'newest', 'oldest', 'alpha'].includes(savedSort)) {
      state.taskSort = savedSort;
    }

    // Language preference
    const savedLang = loadFromStorage(STORAGE_KEYS.LANGUAGE, 'en');
    state.language = (savedLang === 'id') ? 'id' : 'en';

    // Quick Links
    const savedLinks = loadFromStorage(STORAGE_KEYS.LINKS, null);
    if (Array.isArray(savedLinks)) {
      state.links = savedLinks;
    } else {
      state.links = DEFAULT_LINKS;
      saveToStorage(STORAGE_KEYS.LINKS, state.links);
    }
  }

  /* ==========================================================================
     4. WEB AUDIO SYNTHESIZER (TACTILE SOUND EFFECTS & TIMER CHIME)
     ========================================================================== */
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTaskCompleteSound() {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.11); // G5

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.19);
    } catch (e) {
      // Ignore audio errors if blocked by autoplay policy
    }
  }

  function playTimerCompletionChime() {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const start = ctx.currentTime + idx * 0.14;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.14, start);
        gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.68);
      });
    } catch (e) {
      // Ignore audio errors
    }
  }

  /* ==========================================================================
     5. DOM REFERENCES
     ========================================================================== */
  const dom = {};

  function cacheDom() {
    // Header & Greeting
    dom.flipClockContainer = document.getElementById('flip-clock');
    dom.headerDate = document.getElementById('header-date');
    dom.displayNameHint = document.getElementById('display-name-hint');
    dom.languageToggleBtn = document.getElementById('language-toggle-btn');
    dom.greetingPrefix = document.getElementById('greeting-prefix');
    dom.userName = document.getElementById('user-name');
    dom.editNameBtn = document.getElementById('edit-name-btn');
    dom.nameSavedBadge = document.getElementById('name-saved-badge');
    dom.headerProgressText = document.getElementById('header-progress-text');
    dom.clockFormatBtn = document.getElementById('clock-format-btn');
    dom.soundToggleBtn = document.getElementById('sound-toggle-btn');
    dom.soundToggleLabel = document.getElementById('sound-toggle-label');
    dom.themeToggleBtn = document.getElementById('theme-toggle-btn');
    dom.themeToggleLabel = document.getElementById('theme-toggle-label');

    // Focus Timer
    dom.timerCard = document.getElementById('focus-timer-card');
    dom.timerStatusBadge = document.getElementById('timer-status-badge');
    dom.presetBtns = document.querySelectorAll('.preset-btn');
    dom.customMinutesInput = document.getElementById('custom-minutes-input');
    dom.timerRingProgress = document.getElementById('timer-ring-progress');
    dom.timerReadout = document.getElementById('timer-readout');
    dom.timerSubtext = document.getElementById('timer-subtext');
    dom.timerStartPauseBtn = document.getElementById('timer-start-pause-btn');
    dom.timerResetBtn = document.getElementById('timer-reset-btn');
    dom.timerPlusOneBtn = document.getElementById('timer-plus-one-btn');

    // Quick Links
    dom.toggleLinkDrawerBtn = document.getElementById('toggle-link-drawer-btn');
    dom.linkDrawer = document.getElementById('link-drawer');
    dom.linkForm = document.getElementById('link-form');
    dom.linkTitleInput = document.getElementById('link-title-input');
    dom.linkUrlInput = document.getElementById('link-url-input');
    dom.linkErrorMsg = document.getElementById('link-error-msg');
    dom.cancelLinkBtn = document.getElementById('cancel-link-btn');
    dom.quickLinksGrid = document.getElementById('quick-links-grid');

    // To-Do List
    dom.taskCounterPill = document.getElementById('task-counter-pill');
    dom.clearCompletedBtn = document.getElementById('clear-completed-btn');
    dom.todoProgressFill = document.getElementById('todo-progress-fill');
    dom.taskForm = document.getElementById('task-form');
    dom.taskInput = document.getElementById('task-input');
    dom.duplicateWarning = document.getElementById('duplicate-warning');
    dom.duplicateWarningText = document.getElementById('duplicate-warning-text');
    dom.filterTabs = document.querySelectorAll('.filter-tab');
    dom.countAll = document.getElementById('count-all');
    dom.countActive = document.getElementById('count-active');
    dom.countCompleted = document.getElementById('count-completed');
    dom.sortSelect = document.getElementById('sort-select');
    dom.taskList = document.getElementById('task-list');
  }

  /* ==========================================================================
     6. THEME & HEADER CONTROLS
     ========================================================================== */
  function applyTheme(theme) {
    state.theme = theme;
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (dom.themeToggleLabel) dom.themeToggleLabel.textContent = 'Light';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (dom.themeToggleLabel) dom.themeToggleLabel.textContent = 'Dark';
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  function toggleTheme() {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  }

  /* ==========================================================================
     FLIP CLOCK MODULE (Split-Flap Animated Clock)
     ========================================================================== */
  const flipClock = {
    cards: [],
    initialized: false,
    ampmEl: null,

    init(container) {
      if (!container || this.initialized) return;
      this.initialized = true;

      const clockWrap = document.createElement('div');
      clockWrap.className = 'flip-clock';

      const groups = {};
      ['hours', 'minutes', 'seconds'].forEach((key) => {
        const group = document.createElement('div');
        group.className = 'flip-group';
        groups[key] = group;
      });

      ['hours', 'minutes', 'seconds'].forEach((key) => {
        for (let i = 0; i < 2; i++) {
          const card = document.createElement('div');
          card.className = 'flip-card';
          card.dataset.v = '';
          card.innerHTML =
            '<div class="flip-half flip-top"><span></span></div>' +
            '<div class="flip-half flip-bottom"><span></span></div>' +
            '<div class="flip-flap flip-flap-top"><span></span></div>' +
            '<div class="flip-flap flip-flap-bottom"><span></span></div>';
          card.topS = card.querySelector('.flip-top span');
          card.botS = card.querySelector('.flip-bottom span');
          card.ftS = card.querySelector('.flip-flap-top span');
          card.fbS = card.querySelector('.flip-flap-bottom span');
          groups[key].appendChild(card);
          this.cards.push(card);
        }
      });

      const makeSep = () => {
        const sep = document.createElement('div');
        sep.className = 'flip-sep';
        sep.innerHTML = '<span class="flip-dot"></span><span class="flip-dot"></span>';
        return sep;
      };

      const ampm = document.createElement('span');
      ampm.className = 'flip-ampm flip-ampm-hidden';
      this.ampmEl = ampm;

      clockWrap.appendChild(groups.hours);
      clockWrap.appendChild(makeSep());
      clockWrap.appendChild(groups.minutes);
      clockWrap.appendChild(makeSep());
      clockWrap.appendChild(groups.seconds);
      clockWrap.appendChild(ampm);
      container.appendChild(clockWrap);
    },

    setCard(card, value) {
      if (card.dataset.v === value) return;
      const oldValue = card.dataset.v;
      card.dataset.v = value;

      if (oldValue === '') {
        card.topS.textContent = value;
        card.botS.textContent = value;
        return;
      }

      card.ftS.textContent = oldValue;
      card.fbS.textContent = value;
      card.topS.textContent = value;

      card.classList.remove('flipping');
      void card.offsetWidth;
      card.classList.add('flipping');

      clearTimeout(card._flipTimer);
      card._flipTimer = setTimeout(() => {
        card.botS.textContent = value;
        card.classList.remove('flipping');
      }, 620);
    },

    setAmPmVisible(visible) {
      if (!this.ampmEl) return;
      if (visible) {
        this.ampmEl.classList.remove('flip-ampm-hidden');
      } else {
        this.ampmEl.classList.add('flip-ampm-hidden');
      }
    },

    update(now, use24Hour) {
      if (!this.initialized || this.cards.length < 6) return;

      let h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();

      if (use24Hour) {
        this.setAmPmVisible(false);
      } else {
        this.ampmEl.textContent = h >= 12 ? 'PM' : 'AM';
        this.setAmPmVisible(true);
        h = h % 12 || 12;
      }

      const pad = (n) => String(n).padStart(2, '0');
      const digits = pad(h) + pad(m) + pad(s);

      for (let i = 0; i < 6; i++) {
        this.setCard(this.cards[i], digits[i]);
      }
    }
  };

  function updateClockAndGreeting() {
    const now = new Date();
    const hours24 = now.getHours();

    // Flip clock digit update
    flipClock.update(now, state.use24HourClock);

    // Clock format toggle label
    if (state.use24HourClock) {
      dom.clockFormatBtn.textContent = '24H';
      dom.clockFormatBtn.classList.add('active-toggle');
    } else {
      dom.clockFormatBtn.textContent = '12H';
      dom.clockFormatBtn.classList.remove('active-toggle');
    }

    // Localized calendar date
    const dateString = formatDate(now, state.language);
    if (dom.headerDate && dom.headerDate.textContent !== dateString) {
      dom.headerDate.textContent = dateString;
    }

    // Localized time-of-day greeting
    const greeting = getGreeting(hours24, state.language);
    if (dom.greetingPrefix.textContent !== greeting) {
      dom.greetingPrefix.textContent = greeting;
    }
  }

  function initCustomNameEditing() {
    dom.userName.textContent = state.username;

    let savedBadgeTimeout = null;
    function commitUserName() {
      const rawText = dom.userName.textContent.replace(/\s+/g, ' ').trim();
      const finalName = rawText.length > 0 ? rawText.slice(0, 28) : 'Friend';
      state.username = finalName;
      dom.userName.textContent = finalName;
      localStorage.setItem(STORAGE_KEYS.USERNAME, finalName);

      // Show subtle "Saved" pill feedback
      dom.nameSavedBadge.classList.add('visible');
      clearTimeout(savedBadgeTimeout);
      savedBadgeTimeout = setTimeout(() => {
        dom.nameSavedBadge.classList.remove('visible');
      }, 1800);
    }

    dom.userName.addEventListener('blur', commitUserName);

    dom.userName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        dom.userName.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        dom.userName.textContent = state.username;
        dom.userName.blur();
      }
    });

    dom.editNameBtn.addEventListener('click', () => {
      dom.userName.focus();
      // Select all text inside contenteditable span for quick replacement
      const range = document.createRange();
      range.selectNodeContents(dom.userName);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });
  }

  function updateSoundToggleUI() {
    if (state.soundEnabled) {
      dom.soundToggleBtn.classList.add('active-toggle');
      dom.soundToggleLabel.textContent = 'SFX On';
    } else {
      dom.soundToggleBtn.classList.remove('active-toggle');
      dom.soundToggleLabel.textContent = 'Muted';
    }
  }

  /* ==========================================================================
     7. FOCUS TIMER (POMODORO) MODULE
     ========================================================================== */
  const RING_RADIUS = 92;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ~578.05

  function formatTimerSeconds(totalSecs) {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function saveTimerConfig() {
    saveToStorage(STORAGE_KEYS.TIMER_CONFIG, {
      durationMinutes: state.timer.durationMinutes,
      sessionsCompleted: state.timer.sessionsCompleted
    });
  }

  function updateTimerUI() {
    const { durationMinutes, remainingSeconds, isRunning, sessionsCompleted } = state.timer;
    const totalSeconds = Math.max(1, durationMinutes * 60);
    const formatted = formatTimerSeconds(remainingSeconds);

    dom.timerReadout.textContent = formatted;

    // SVG Ring Dashoffset Calculation
    const progressRatio = Math.min(1, Math.max(0, remainingSeconds / totalSeconds));
    const offset = RING_CIRCUMFERENCE * (1 - progressRatio);
    dom.timerRingProgress.style.strokeDasharray = `${RING_CIRCUMFERENCE}`;
    dom.timerRingProgress.style.strokeDashoffset = `${offset}`;

    // Subtext & Session Count
    dom.timerSubtext.textContent = `${durationMinutes}m ${t('timer.target')} • ${tf('timer.sessionsDone', sessionsCompleted)}`;

    // Preset Active State
    dom.presetBtns.forEach((btn) => {
      const mins = Number(btn.getAttribute('data-minutes'));
      btn.classList.toggle('active', mins === durationMinutes);
    });

    if (document.activeElement !== dom.customMinutesInput) {
      dom.customMinutesInput.value = durationMinutes;
    }

    // Button & Card States
    if (isRunning) {
      dom.timerCard.classList.add('timer-running');
      dom.timerStatusBadge.textContent = t('timer.focusing');
      dom.timerStatusBadge.className = 'timer-status-badge status-running';
      dom.timerStartPauseBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="6" y="4" width="4" height="16" rx="1"></rect>
          <rect x="14" y="4" width="4" height="16" rx="1"></rect>
        </svg>
        <span>${t('timer.pause')}</span>
      `;
      document.title = `(${formatted}) Focus — Life Dashboard`;
    } else {
      dom.timerCard.classList.remove('timer-running');
      const isAtStart = remainingSeconds === durationMinutes * 60;
      if (remainingSeconds === 0) {
        dom.timerStatusBadge.textContent = t('timer.complete');
        dom.timerStatusBadge.className = 'timer-status-badge status-done';
      } else if (isAtStart) {
        dom.timerStatusBadge.textContent = t('timer.ready');
        dom.timerStatusBadge.className = 'timer-status-badge';
      } else {
        dom.timerStatusBadge.textContent = t('timer.paused');
        dom.timerStatusBadge.className = 'timer-status-badge';
      }

      dom.timerStartPauseBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <polygon points="6 3 20 12 6 21 6 3"></polygon>
        </svg>
        <span>${isAtStart || remainingSeconds === 0 ? t('timer.start') : t('timer.resume')}</span>
      `;
      document.title = 'Life Dashboard — Focus & To-Do Workspace';
    }
  }

  function startPauseTimer() {
    if (state.timer.isRunning) {
      // Pause
      clearInterval(state.timer.intervalId);
      state.timer.intervalId = null;
      state.timer.isRunning = false;
      updateTimerUI();
    } else {
      // If timer was at 0, reset to configured duration before starting
      if (state.timer.remainingSeconds <= 0) {
        state.timer.remainingSeconds = state.timer.durationMinutes * 60;
      }
      state.timer.isRunning = true;
      updateTimerUI();

      state.timer.intervalId = setInterval(() => {
        if (state.timer.remainingSeconds > 0) {
          state.timer.remainingSeconds -= 1;
          updateTimerUI();
        } else {
          // Timer Completed!
          clearInterval(state.timer.intervalId);
          state.timer.intervalId = null;
          state.timer.isRunning = false;
          state.timer.sessionsCompleted += 1;
          saveTimerConfig();
          playTimerCompletionChime();
          updateTimerUI();
        }
      }, 1000);
    }
  }

  function resetTimer() {
    if (state.timer.intervalId) {
      clearInterval(state.timer.intervalId);
      state.timer.intervalId = null;
    }
    state.timer.isRunning = false;
    state.timer.remainingSeconds = state.timer.durationMinutes * 60;
    updateTimerUI();
  }

  function setTimerDuration(minutes) {
    const parsed = parseInt(minutes, 10);
    if (isNaN(parsed)) return;
    const clamped = Math.min(120, Math.max(1, parsed));
    state.timer.durationMinutes = clamped;
    saveTimerConfig();
    resetTimer();
  }

  function addOneMinute() {
    const maxSecs = 120 * 60;
    state.timer.remainingSeconds = Math.min(maxSecs, state.timer.remainingSeconds + 60);
    if (state.timer.remainingSeconds > state.timer.durationMinutes * 60) {
      state.timer.durationMinutes = Math.ceil(state.timer.remainingSeconds / 60);
      saveTimerConfig();
    }
    updateTimerUI();
  }

  /* ==========================================================================
     8. TO-DO LIST MODULE (CRUD, DUPLICATE PREVENTION, SORT, FILTER)
     ========================================================================== */
  let duplicateWarningTimer = null;

  function normalizeTaskText(text) {
    return text.replace(/\s+/g, ' ').trim();
  }

  function isDuplicateTask(candidateText, ignoreTaskId = null) {
    const normalizedCandidate = normalizeTaskText(candidateText).toLowerCase();
    return state.tasks.find(
      (task) =>
        task.id !== ignoreTaskId &&
        normalizeTaskText(task.text).toLowerCase() === normalizedCandidate
    );
  }

  function triggerDuplicateFeedback(existingTask) {
    dom.taskInput.classList.remove('input-duplicate-error');
    // Force reflow so animation replays cleanly
    void dom.taskInput.offsetWidth;
    dom.taskInput.classList.add('input-duplicate-error');

    dom.duplicateWarningText.textContent = tf('duplicate.warning', existingTask.text);
    dom.duplicateWarning.classList.add('visible');

    // Highlight existing matching task in DOM if visible
    const existingRow = dom.taskList.querySelector(`[data-task-id="${existingTask.id}"]`);
    if (existingRow) {
      existingRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      existingRow.classList.remove('duplicate-highlight');
      void existingRow.offsetWidth;
      existingRow.classList.add('duplicate-highlight');
      setTimeout(() => existingRow.classList.remove('duplicate-highlight'), 1400);
    }

    clearTimeout(duplicateWarningTimer);
    duplicateWarningTimer = setTimeout(() => {
      dom.duplicateWarning.classList.remove('visible');
      dom.taskInput.classList.remove('input-duplicate-error');
    }, 3400);
  }

  function hideDuplicateWarning() {
    dom.duplicateWarning.classList.remove('visible');
    dom.taskInput.classList.remove('input-duplicate-error');
  }

  function saveTasks() {
    saveToStorage(STORAGE_KEYS.TASKS, state.tasks);
  }

  function addTask(rawText) {
    const cleaned = normalizeTaskText(rawText);
    if (!cleaned) return false;

    const existingDuplicate = isDuplicateTask(cleaned);
    if (existingDuplicate) {
      triggerDuplicateFeedback(existingDuplicate);
      return false;
    }

    hideDuplicateWarning();

    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      text: cleaned,
      completed: false,
      createdAt: Date.now()
    };

    state.tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    return true;
  }

  function toggleTaskCompletion(taskId, checkboxEl) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    saveTasks();

    if (task.completed) {
      playTaskCompleteSound();
      if (checkboxEl) {
        spawnMicroConfetti(checkboxEl);
      }
    }

    renderTasks();
  }

  function deleteTask(taskId) {
    state.tasks = state.tasks.filter((t) => t.id !== taskId);
    if (state.editingTaskId === taskId) {
      state.editingTaskId = null;
    }
    saveTasks();
    renderTasks();
  }

  function startEditingTask(taskId) {
    state.editingTaskId = taskId;
    renderTasks();
    const editInput = dom.taskList.querySelector('.task-edit-input');
    if (editInput) {
      editInput.focus();
      editInput.setSelectionRange(editInput.value.length, editInput.value.length);
    }
  }

  function commitTaskEdit(taskId, newRawText) {
    const cleaned = normalizeTaskText(newRawText);
    if (!cleaned) {
      state.editingTaskId = null;
      renderTasks();
      return;
    }

    const existingDuplicate = isDuplicateTask(cleaned, taskId);
    if (existingDuplicate) {
      triggerDuplicateFeedback(existingDuplicate);
      return;
    }

    const task = state.tasks.find((t) => t.id === taskId);
    if (task) {
      task.text = cleaned;
      saveTasks();
    }
    state.editingTaskId = null;
    renderTasks();
  }

  function clearCompletedTasks() {
    state.tasks = state.tasks.filter((t) => !t.completed);
    saveTasks();
    renderTasks();
  }

  function getFilteredAndSortedTasks() {
    // 1. Filter
    let list = state.tasks.filter((task) => {
      if (state.taskFilter === 'active') return !task.completed;
      if (state.taskFilter === 'completed') return task.completed;
      return true;
    });

    // 2. Sort
    list = [...list].sort((a, b) => {
      switch (state.taskSort) {
        case 'incomplete':
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
          return b.createdAt - a.createdAt;
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'alpha':
          return a.text.localeCompare(b.text, undefined, { sensitivity: 'base' });
        default:
          return 0;
      }
    });

    return list;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderTasks() {
    const totalCount = state.tasks.length;
    const completedCount = state.tasks.filter((t) => t.completed).length;
    const activeCount = totalCount - completedCount;

    // Update counts & progress indicators
    dom.countAll.textContent = totalCount;
    dom.countActive.textContent = activeCount;
    dom.countCompleted.textContent = completedCount;

    dom.taskCounterPill.textContent = tf('tasks.taskCounter', completedCount, totalCount);
    dom.headerProgressText.textContent = `${completedCount}/${totalCount} Tasks Done`;

    const progressPct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
    dom.todoProgressFill.style.width = `${progressPct}%`;

    // Show/hide Clear Completed button
    dom.clearCompletedBtn.style.display = completedCount > 0 ? 'inline-block' : 'none';

    // Sync filter tabs active class
    dom.filterTabs.forEach((tab) => {
      tab.classList.toggle('active', tab.getAttribute('data-filter') === state.taskFilter);
    });

    // Sync sort select
    dom.sortSelect.value = state.taskSort;

    const visibleTasks = getFilteredAndSortedTasks();

    if (visibleTasks.length === 0) {
      let emptyTitle = t('empty.clearTitle');
      let emptyDesc = t('empty.clearDesc');

      if (state.taskFilter === 'active' && totalCount > 0) {
        emptyTitle = t('empty.allDoneTitle');
        emptyDesc = t('empty.allDoneDesc');
      } else if (state.taskFilter === 'completed' && totalCount > 0) {
        emptyTitle = t('empty.noCompletedTitle');
        emptyDesc = t('empty.noCompletedDesc');
      }

      dom.taskList.innerHTML = `
        <li class="empty-state">
          <div class="empty-state-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
          </div>
          <p class="empty-state-title">${emptyTitle}</p>
          <p class="empty-state-desc">${emptyDesc}</p>
        </li>
      `;
      return;
    }

    dom.taskList.innerHTML = visibleTasks
      .map((task) => {
        const isEditing = state.editingTaskId === task.id;
        const safeText = escapeHtml(task.text);

        if (isEditing) {
          return `
            <li class="task-item" data-task-id="${task.id}">
              <form class="task-edit-form" data-edit-form="${task.id}">
                <input
                  type="text"
                  class="task-edit-input"
                  value="${safeText}"
                  maxlength="160"
                  aria-label="Edit task description"
                />
                <button type="submit" class="task-action-btn save-edit-btn" title="Save changes (Enter)">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
                <button type="button" class="task-action-btn cancel-edit-btn" data-action="cancel-edit" title="Cancel (Esc)">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </form>
            </li>
          `;
        }

        return `
          <li class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
            <div class="task-left">
              <button
                type="button"
                class="task-checkbox-btn"
                data-action="toggle"
                aria-label="${task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
              <span class="task-text-content" data-action="toggle" title="Click to toggle completion, double-click to edit">${safeText}</span>
            </div>
            <div class="task-actions">
              <button
                type="button"
                class="task-action-btn"
                data-action="edit"
                title="Edit task"
                aria-label="Edit task"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </button>
              <button
                type="button"
                class="task-action-btn delete-btn"
                data-action="delete"
                title="Delete task"
                aria-label="Delete task"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </li>
        `;
      })
      .join('');
  }

  /* ==========================================================================
     9. QUICK LINKS MODULE
     ========================================================================== */
  function normalizeUrl(rawUrl) {
    let trimmed = rawUrl.trim();
    if (!trimmed) return '';
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = 'https://' + trimmed;
    }
    try {
      const parsed = new URL(trimmed);
      return parsed.href;
    } catch (e) {
      return '';
    }
  }

  function extractDomain(url) {
    try {
      const parsed = new URL(url);
      return parsed.hostname;
    } catch (e) {
      return 'example.com';
    }
  }

  function saveLinks() {
    saveToStorage(STORAGE_KEYS.LINKS, state.links);
  }

  function renderQuickLinks() {
    if (state.links.length === 0) {
      dom.quickLinksGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 18px 8px; color: var(--text-muted); font-size: 0.82rem;">
          <p style="margin: 0 0 8px;">${t('links.emptyTitle')}</p>
          <button type="button" id="restore-default-links-btn" class="add-link-trigger" style="margin: 0 auto;">
            ${t('links.emptyRestore')}
          </button>
        </div>
      `;
      const restoreBtn = document.getElementById('restore-default-links-btn');
      if (restoreBtn) {
        restoreBtn.addEventListener('click', () => {
          state.links = [...DEFAULT_LINKS];
          saveLinks();
          renderQuickLinks();
        });
      }
      return;
    }

    dom.quickLinksGrid.innerHTML = state.links
      .map((link) => {
        const domain = extractDomain(link.url);
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
        const safeTitle = escapeHtml(link.title);
        const safeUrl = escapeHtml(link.url);

        return `
          <a
            href="${safeUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="quick-link-pill"
            data-link-id="${link.id}"
            title="${safeTitle} (${safeUrl})"
          >
            <img
              src="${faviconUrl}"
              alt=""
              class="link-favicon"
              loading="lazy"
              onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%238E8E93%22 stroke-width=%222%22%3E%3Ccircle cx=%2212%22 cy=%2212%22 r=%2210%22/%3E%3Cline x1=%222%22 y1=%2212%22 x2=%2222%22 y2=%2212%22/%3E%3Cpath d=%22M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z%22/%3E%3C/svg%3E';"
            />
            <span class="link-title-text">${safeTitle}</span>
            <button
              type="button"
              class="link-delete-btn"
              data-delete-link="${link.id}"
              title="Remove shortcut"
              aria-label="Remove ${safeTitle}"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </a>
        `;
      })
      .join('');
  }

  function addQuickLink(title, rawUrl) {
    const cleanTitle = title.trim();
    const validUrl = normalizeUrl(rawUrl);

    if (!cleanTitle) {
      dom.linkErrorMsg.textContent = t('links.errorTitle');
      return false;
    }
    if (!validUrl) {
      dom.linkErrorMsg.textContent = t('links.errorUrl');
      return false;
    }

    // Prevent duplicate link URL
    const exists = state.links.some((l) => l.url.toLowerCase() === validUrl.toLowerCase());
    if (exists) {
      dom.linkErrorMsg.textContent = t('links.errorDuplicate');
      return false;
    }

    dom.linkErrorMsg.textContent = '';
    state.links.push({
      id: 'link-' + Date.now(),
      title: cleanTitle,
      url: validUrl
    });

    saveLinks();
    renderQuickLinks();
    return true;
  }

  function deleteQuickLink(linkId) {
    state.links = state.links.filter((l) => l.id !== linkId);
    saveLinks();
    renderQuickLinks();
  }

  /* ==========================================================================
     10. COOL HOVER & TACTILE EFFECTS (SPOTLIGHT & MICRO-CONFETTI)
     ========================================================================== */
  function initCardSpotlightEffect() {
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  function spawnMicroConfetti(originEl) {
    const rect = originEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const colors = ['#D95D39', '#2E7D5B', '#FBBF24', '#34D399', '#F07148'];

    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('span');
      const angle = (Math.PI * 2 * i) / 10;
      const distance = 18 + Math.random() * 16;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      particle.style.position = 'fixed';
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.width = '5px';
      particle.style.height = '5px';
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = colors[i % colors.length];
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';
      particle.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease';

      document.body.appendChild(particle);

      requestAnimationFrame(() => {
        particle.style.transform = `translate(${tx}px, ${ty}px) scale(0.2)`;
        particle.style.opacity = '0';
      });

      setTimeout(() => {
        particle.remove();
      }, 460);
    }
  }

  /* ==========================================================================
     11. EVENT LISTENERS & KEYBOARD SHORTCUTS
     ========================================================================== */
  function bindEvents() {
    // Theme Toggle
    dom.themeToggleBtn.addEventListener('click', toggleTheme);

    // Language Toggle (EN / ID)
    if (dom.languageToggleBtn) {
      dom.languageToggleBtn.addEventListener('click', toggleLanguage);
    }

    // Display Name Hint — click focuses the editable name span
    if (dom.displayNameHint) {
      dom.displayNameHint.addEventListener('click', () => {
        dom.userName.focus();
        const range = document.createRange();
        range.selectNodeContents(dom.userName);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      });
    }

    // 12h / 24h Clock Toggle
    dom.clockFormatBtn.addEventListener('click', () => {
      state.use24HourClock = !state.use24HourClock;
      saveToStorage(STORAGE_KEYS.CLOCK_24H, state.use24HourClock);
      updateClockAndGreeting();
    });

    // Sound Toggle
    dom.soundToggleBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      saveToStorage(STORAGE_KEYS.SOUND, state.soundEnabled);
      updateSoundToggleUI();
      if (state.soundEnabled) playTaskCompleteSound();
    });

    // Timer Controls
    dom.timerStartPauseBtn.addEventListener('click', startPauseTimer);
    dom.timerResetBtn.addEventListener('click', resetTimer);
    dom.timerPlusOneBtn.addEventListener('click', addOneMinute);

    dom.presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mins = Number(btn.getAttribute('data-minutes'));
        setTimerDuration(mins);
      });
    });

    dom.customMinutesInput.addEventListener('change', (e) => {
      setTimerDuration(e.target.value);
    });

    // Quick Links Drawer & Events
    dom.toggleLinkDrawerBtn.addEventListener('click', () => {
      const isOpen = dom.linkDrawer.classList.toggle('open');
      if (isOpen) {
        dom.linkErrorMsg.textContent = '';
        dom.linkTitleInput.focus();
      }
    });

    dom.cancelLinkBtn.addEventListener('click', () => {
      dom.linkDrawer.classList.remove('open');
      dom.linkForm.reset();
      dom.linkErrorMsg.textContent = '';
    });

    dom.linkForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const added = addQuickLink(dom.linkTitleInput.value, dom.linkUrlInput.value);
      if (added) {
        dom.linkForm.reset();
        dom.linkDrawer.classList.remove('open');
      }
    });

    dom.quickLinksGrid.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('[data-delete-link]');
      if (deleteBtn) {
        e.preventDefault();
        e.stopPropagation();
        const linkId = deleteBtn.getAttribute('data-delete-link');
        deleteQuickLink(linkId);
      }
    });

    // To-Do Form Submission
    dom.taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = addTask(dom.taskInput.value);
      if (success) {
        dom.taskInput.value = '';
      }
    });

    dom.taskInput.addEventListener('input', () => {
      if (dom.duplicateWarning.classList.contains('visible')) {
        hideDuplicateWarning();
      }
    });

    // Clear Completed
    dom.clearCompletedBtn.addEventListener('click', clearCompletedTasks);

    // Filter Tabs
    dom.filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        state.taskFilter = tab.getAttribute('data-filter');
        renderTasks();
      });
    });

    // Sort Dropdown
    dom.sortSelect.addEventListener('change', (e) => {
      state.taskSort = e.target.value;
      localStorage.setItem(STORAGE_KEYS.SORT, state.taskSort);
      renderTasks();
    });

    // Task List Delegated Interactions
    dom.taskList.addEventListener('click', (e) => {
      const taskItem = e.target.closest('.task-item');
      if (!taskItem) return;
      const taskId = taskItem.getAttribute('data-task-id');

      const actionEl = e.target.closest('[data-action]');
      if (!actionEl) return;
      const action = actionEl.getAttribute('data-action');

      if (action === 'toggle') {
        const checkboxBtn = taskItem.querySelector('.task-checkbox-btn');
        toggleTaskCompletion(taskId, checkboxBtn);
      } else if (action === 'edit') {
        startEditingTask(taskId);
      } else if (action === 'delete') {
        deleteTask(taskId);
      } else if (action === 'cancel-edit') {
        state.editingTaskId = null;
        renderTasks();
      }
    });

    // Double-click task text to edit inline
    dom.taskList.addEventListener('dblclick', (e) => {
      const textEl = e.target.closest('.task-text-content');
      if (!textEl) return;
      const taskItem = textEl.closest('.task-item');
      if (taskItem) {
        startEditingTask(taskItem.getAttribute('data-task-id'));
      }
    });

    // Inline Edit Form Submit & Escape
    dom.taskList.addEventListener('submit', (e) => {
      const editForm = e.target.closest('[data-edit-form]');
      if (!editForm) return;
      e.preventDefault();
      const taskId = editForm.getAttribute('data-edit-form');
      const input = editForm.querySelector('.task-edit-input');
      if (input) {
        commitTaskEdit(taskId, input.value);
      }
    });

    dom.taskList.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.editingTaskId) {
        state.editingTaskId = null;
        renderTasks();
      }
    });

    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isTyping =
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        (document.activeElement && document.activeElement.isContentEditable);

      // Press '/' to focus the new task input
      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        dom.taskInput.focus();
      }

      // Alt + T to toggle Dark/Light Mode
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleTheme();
      }

      // Alt + S to Start/Pause Pomodoro Timer
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        startPauseTimer();
      }
    });
  }

  /* ==========================================================================
     12. INITIALIZATION
     ========================================================================== */
  function init() {
    hydrateState();
    cacheDom();

    applyTheme(state.theme);
    updateSoundToggleUI();
    initCustomNameEditing();

    // Build flip clock and apply localized strings
    flipClock.init(dom.flipClockContainer);
    applyStaticStrings();
    updateLanguageLabel();

    // Start live clock immediately
    updateClockAndGreeting();
    setInterval(updateClockAndGreeting, 1000);

    // Render modules
    updateTimerUI();
    renderQuickLinks();
    renderTasks();

    // Bind events & hover effects
    bindEvents();
    initCardSpotlightEffect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
