// ============================================================
// Study Timer — Pomodoro Widget for KL Material
// Floating draggable timer: 25 min study / 5 min break
// ============================================================

(function () {
  'use strict';

  // Don't run on offline / 404 pages
  if (document.body.classList.contains('no-timer')) return;

  const STORAGE_KEY = 'klm-timer-state';

  // ── Config ──────────────────────────────────────────────
  const MODES = {
    study: { label: 'Study', duration: 25 * 60, color: '#00d4ff' },
    break: { label: 'Break', duration: 5 * 60,  color: '#00ff88' },
    long:  { label: 'Long Break', duration: 15 * 60, color: '#f39c12' }
  };

  let state = {
    mode: 'study',
    remaining: MODES.study.duration,
    running: false,
    session: 1,
    totalSessions: 4
  };
  let _interval = null;

  // ── Load persisted state ────────────────────────────────
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && saved.mode && MODES[saved.mode]) {
      state = { ...state, ...saved, running: false }; // don't auto-start across pages
    }
  } catch (e) { /* ignore */ }

  function saveState() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { }
  }

  // ── Build Widget HTML ───────────────────────────────────
  function buildWidget() {
    const w = document.createElement('div');
    w.id = 'study-timer-widget';
    w.setAttribute('role', 'timer');
    w.setAttribute('aria-label', 'Study timer');
    w.innerHTML = `
      <div id="stw-header">
        <span id="stw-mode-label">Study</span>
        <span id="stw-session-label">Session 1/4</span>
        <button id="stw-toggle-btn" aria-label="Show/hide timer" title="Study Timer">⏱</button>
      </div>
      <div id="stw-body">
        <svg id="stw-ring" viewBox="0 0 80 80" aria-hidden="true">
          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="5"/>
          <circle id="stw-arc" cx="40" cy="40" r="34" fill="none" stroke="#00d4ff"
                  stroke-width="5" stroke-linecap="round"
                  stroke-dasharray="213.6" stroke-dashoffset="0"
                  transform="rotate(-90 40 40)"/>
        </svg>
        <div id="stw-time">25:00</div>
      </div>
      <div id="stw-controls">
        <button class="stw-ctrl" id="stw-btn-start" title="Start">▶</button>
        <button class="stw-ctrl" id="stw-btn-pause" title="Pause" style="display:none">⏸</button>
        <button class="stw-ctrl" id="stw-btn-reset" title="Reset">↺</button>
        <button class="stw-ctrl" id="stw-btn-skip"  title="Next">⏭</button>
      </div>
      <div id="stw-modes">
        <button class="stw-mode-btn active" data-mode="study">Study</button>
        <button class="stw-mode-btn" data-mode="break">Break</button>
        <button class="stw-mode-btn" data-mode="long">Long Break</button>
      </div>
    `;
    document.body.appendChild(w);
    return w;
  }

  // ── CSS ─────────────────────────────────────────────────
  const css = `
    #study-timer-widget {
      position: fixed;
      bottom: 80px;
      right: 18px;
      z-index: 9990;
      background: rgba(10,14,39,0.97);
      border: 1px solid rgba(0,212,255,0.25);
      border-radius: 18px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,212,255,0.07);
      width: 200px;
      overflow: hidden;
      font-family: 'Poppins', sans-serif;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition: transform 0.25s ease, box-shadow 0.25s;
      user-select: none;
    }
    #stw-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px 8px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      cursor: move;
    }
    #stw-mode-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #00d4ff;
      letter-spacing: 0.5px;
    }
    #stw-session-label {
      font-size: 0.68rem;
      color: rgba(255,255,255,0.4);
    }
    #stw-toggle-btn {
      background: none;
      border: none;
      color: rgba(255,255,255,0.5);
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
      padding: 2px;
      transition: color 0.2s;
    }
    #stw-toggle-btn:hover { color: #00d4ff; }
    #stw-body {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14px 0 10px;
    }
    #stw-ring { width: 80px; height: 80px; }
    #stw-time {
      position: absolute;
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: 1px;
    }
    #stw-controls {
      display: flex;
      justify-content: center;
      gap: 8px;
      padding: 0 14px 10px;
    }
    .stw-ctrl {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      color: #fff;
      cursor: pointer;
      font-size: 0.9rem;
      padding: 5px 10px;
      transition: background 0.2s, border-color 0.2s;
    }
    .stw-ctrl:hover { background: rgba(0,212,255,0.18); border-color: rgba(0,212,255,0.4); }
    #stw-modes {
      display: flex;
      gap: 4px;
      padding: 0 10px 12px;
      justify-content: center;
    }
    .stw-mode-btn {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 50px;
      color: rgba(255,255,255,0.45);
      cursor: pointer;
      font-size: 0.65rem;
      font-family: inherit;
      padding: 3px 8px;
      transition: all 0.2s;
    }
    .stw-mode-btn:hover { border-color: rgba(0,212,255,0.35); color: #00d4ff; }
    .stw-mode-btn.active {
      background: rgba(0,212,255,0.15);
      border-color: rgba(0,212,255,0.4);
      color: #00d4ff;
    }
    #study-timer-widget.stw-collapsed #stw-body,
    #study-timer-widget.stw-collapsed #stw-controls,
    #study-timer-widget.stw-collapsed #stw-modes { display: none; }
    @media (max-width: 768px) {
      #study-timer-widget { display: none !important; }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Init ───────────────────────────────────────────────
  const widget = buildWidget();

  let collapsed = false;
  const CIRC = 2 * Math.PI * 34; // 213.6

  function fmt(secs) {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateUI() {
    const cfg = MODES[state.mode];
    const pct = state.remaining / cfg.duration;
    const offset = CIRC * (1 - pct);

    document.getElementById('stw-time').textContent = fmt(state.remaining);
    document.getElementById('stw-arc').style.strokeDashoffset = offset;
    document.getElementById('stw-arc').style.stroke = cfg.color;
    document.getElementById('stw-mode-label').textContent = cfg.label;
    document.getElementById('stw-mode-label').style.color = cfg.color;
    document.getElementById('stw-session-label').textContent =
      `Session ${state.session}/${state.totalSessions}`;

    // Show/hide start/pause
    document.getElementById('stw-btn-start').style.display = state.running ? 'none' : '';
    document.getElementById('stw-btn-pause').style.display = state.running ? '' : 'none';

    // Mode buttons
    document.querySelectorAll('.stw-mode-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === state.mode);
    });

    // Page title badge
    const orig = document._origTitle || document.title;
    document._origTitle = orig.replace(/^\[[\d:]+\] /, '');
    if (state.running) {
      document.title = `[${fmt(state.remaining)}] ${document._origTitle}`;
    } else {
      document.title = document._origTitle;
    }
  }

  function switchMode(mode) {
    clearInterval(_interval);
    _interval = null;
    state.mode = mode;
    state.remaining = MODES[mode].duration;
    state.running = false;
    saveState();
    updateUI();
  }

  function tick() {
    if (state.remaining <= 0) {
      clearInterval(_interval);
      _interval = null;
      state.running = false;
      onComplete();
      return;
    }
    state.remaining--;
    saveState();
    updateUI();
  }

  function onComplete() {
    updateUI();
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const msg = state.mode === 'study'
        ? `⏰ Study session done! Take a ${state.session % 4 === 0 ? 'long ' : ''}break.`
        : '📚 Break over — back to studying!';
      new Notification('KL Material Study Timer', { body: msg, icon: '/klmaterial/icon.svg' });
    }
    // Auto-switch mode
    if (state.mode === 'study') {
      state.session++;
      switchMode(state.session % 4 === 1 && state.session > 1 ? 'long' : 'break');
    } else {
      if (state.session > state.totalSessions) state.session = 1;
      switchMode('study');
    }
  }

  // ── Controls ───────────────────────────────────────────
  document.getElementById('stw-btn-start').addEventListener('click', () => {
    // Request notification permission on first start
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    state.running = true;
    _interval = setInterval(tick, 1000);
    saveState();
    updateUI();
  });

  document.getElementById('stw-btn-pause').addEventListener('click', () => {
    clearInterval(_interval);
    _interval = null;
    state.running = false;
    saveState();
    updateUI();
  });

  document.getElementById('stw-btn-reset').addEventListener('click', () => {
    clearInterval(_interval);
    _interval = null;
    state.remaining = MODES[state.mode].duration;
    state.running = false;
    saveState();
    updateUI();
  });

  document.getElementById('stw-btn-skip').addEventListener('click', () => {
    clearInterval(_interval);
    _interval = null;
    state.running = false;
    onComplete();
  });

  document.querySelectorAll('.stw-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => switchMode(btn.dataset.mode));
  });

  // Collapse toggle
  document.getElementById('stw-toggle-btn').addEventListener('click', () => {
    collapsed = !collapsed;
    widget.classList.toggle('stw-collapsed', collapsed);
  });

  // Draggable (mouse)
  let dragging = false, dx = 0, dy = 0;
  const header = document.getElementById('stw-header');

  header.addEventListener('mousedown', e => {
    dragging = true;
    const rect = widget.getBoundingClientRect();
    dx = e.clientX - rect.left;
    dy = e.clientY - rect.top;
    widget.style.transition = 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    widget.style.left = (e.clientX - dx) + 'px';
    widget.style.top = (e.clientY - dy) + 'px';
    widget.style.right = 'auto';
    widget.style.bottom = 'auto';
  });
  document.addEventListener('mouseup', () => {
    dragging = false;
    widget.style.transition = '';
  });

  // Initial render
  updateUI();
})();
