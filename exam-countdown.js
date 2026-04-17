// ============================================================
// Exam Countdown — Floating widget for KL Material
// Shows countdown to the next configurable exam date
// Draggable, collapsible, full localStorage persistence
// ============================================================

(function () {
  'use strict';
  if (document.body.classList.contains('no-countdown')) return;

  const STORAGE_KEY = 'klm-exam-dates-v1';

  // ── Inject CSS ──────────────────────────────────────────
  const css = `
    #ec-widget {
      position: fixed;
      bottom: 240px;
      right: 18px;
      z-index: 9984;
      width: 220px;
      border-radius: 18px;
      background: rgba(10,14,39,0.97);
      border: 1px solid rgba(128,32,255,0.3);
      box-shadow: 0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(128,32,255,0.07);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      font-family: 'Outfit', 'Poppins', sans-serif;
      transition: transform 0.25s ease;
      user-select: none;
      overflow: hidden;
    }
    #ec-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px 8px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      cursor: move;
    }
    #ec-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: #8020ff;
      letter-spacing: 0.5px;
    }
    #ec-toggle-btn {
      background: none; border: none;
      color: rgba(255,255,255,0.45);
      cursor: pointer; font-size: 1rem;
      padding: 2px; line-height: 1;
      transition: color 0.2s;
    }
    #ec-toggle-btn:hover { color: #8020ff; }
    #ec-body { padding: 12px 14px; }
    #ec-exam-select {
      width: 100%;
      padding: 8px 10px;
      border-radius: 10px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #fff;
      font-family: inherit;
      font-size: 0.8rem;
      margin-bottom: 10px;
      cursor: pointer;
      outline: none;
    }
    #ec-exam-select option { background: #0a0e27; }
    #ec-countdown-display {
      text-align: center;
      padding: 10px 0 4px;
    }
    #ec-days {
      font-size: 2.6rem;
      font-weight: 700;
      letter-spacing: -2px;
      color: #fff;
      line-height: 1;
      background: linear-gradient(135deg, #8020ff, #2060ff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    #ec-days-label {
      font-size: 0.7rem;
      color: rgba(255,255,255,0.4);
      margin-top: 4px;
    }
    #ec-exam-name {
      font-size: 0.8rem;
      font-weight: 600;
      color: rgba(255,255,255,0.8);
      text-align: center;
      margin-top: 8px;
    }
    #ec-add-area {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .ec-input {
      width: 100%;
      box-sizing: border-box;
      padding: 7px 10px;
      border-radius: 8px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #fff;
      font-family: inherit;
      font-size: 0.78rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .ec-input:focus { border-color: rgba(128,32,255,0.5); }
    .ec-input::placeholder { color: rgba(255,255,255,0.25); }
    #ec-save-btn {
      width: 100%;
      padding: 7px;
      border-radius: 8px;
      background: rgba(128,32,255,0.2);
      border: 1px solid rgba(128,32,255,0.4);
      color: #c080ff;
      font-family: inherit;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    #ec-save-btn:hover { background: rgba(128,32,255,0.35); }
    #ec-delete-btn {
      width: 100%;
      padding: 5px;
      border-radius: 8px;
      background: transparent;
      border: none;
      color: rgba(255,80,80,0.5);
      font-family: inherit;
      font-size: 0.7rem;
      cursor: pointer;
      transition: color 0.2s;
    }
    #ec-delete-btn:hover { color: rgba(255,80,80,0.8); }
    #ec-widget.ec-collapsed #ec-body { display: none; }
    #ec-add-toggle {
      font-size: 0.7rem;
      color: rgba(255,255,255,0.3);
      text-align: center;
      cursor: pointer;
      padding: 2px 0 8px;
      transition: color 0.2s;
    }
    #ec-add-toggle:hover { color: rgba(128,32,255,0.7); }
    #ec-add-area.hidden { display: none; }
    @media (max-width: 768px) {
      #ec-widget { display: none !important; }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── State ───────────────────────────────────────────────
  let exams = [];
  let selectedIdx = 0;

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(s)) exams = s;
    } catch(e) {}
    // Add defaults if empty
    if (exams.length === 0) {
      const now = new Date();
      exams = [
        { name: 'Mid-1 Exams', date: new Date(now.getFullYear(), now.getMonth() + 1, 15).toISOString().split('T')[0] },
        { name: 'Mid-2 Exams', date: new Date(now.getFullYear(), now.getMonth() + 2, 20).toISOString().split('T')[0] },
        { name: 'End Semester', date: new Date(now.getFullYear(), now.getMonth() + 4, 1).toISOString().split('T')[0] },
      ];
    }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(exams)); } catch(e) {}
  }

  // ── Build Widget ────────────────────────────────────────
  const w = document.createElement('div');
  w.id = 'ec-widget';
  w.setAttribute('role', 'timer');
  w.setAttribute('aria-label', 'Exam countdown');
  w.innerHTML = `
    <div id="ec-header">
      <span id="ec-title">📅 Exam Countdown</span>
      <button id="ec-toggle-btn" aria-label="Collapse / expand countdown" title="Exam Countdown">📅</button>
    </div>
    <div id="ec-body">
      <select id="ec-exam-select"></select>
      <div id="ec-countdown-display">
        <div id="ec-days">—</div>
        <div id="ec-days-label">days remaining</div>
        <div id="ec-exam-name"></div>
      </div>
      <div id="ec-add-toggle">+ Add exam</div>
      <div id="ec-add-area" class="hidden">
        <input class="ec-input" id="ec-new-name" placeholder="Exam name (e.g. DSA Mid-1)">
        <input class="ec-input" type="date" id="ec-new-date">
        <button id="ec-save-btn">Save Exam</button>
        <button id="ec-delete-btn">Delete selected</button>
      </div>
    </div>
  `;
  document.body.appendChild(w);

  // ── Refs ────────────────────────────────────────────────
  const selectEl  = document.getElementById('ec-exam-select');
  const daysEl    = document.getElementById('ec-days');
  const nameEl    = document.getElementById('ec-exam-name');
  const addArea   = document.getElementById('ec-add-area');
  const addToggle = document.getElementById('ec-add-toggle');
  const nameInput = document.getElementById('ec-new-name');
  const dateInput = document.getElementById('ec-new-date');
  const saveBtn   = document.getElementById('ec-save-btn');
  const delBtn    = document.getElementById('ec-delete-btn');

  function daysUntil(dateStr) {
    const today = new Date(); today.setHours(0,0,0,0);
    const target = new Date(dateStr + 'T00:00:00');
    const diff = Math.round((target - today) / 86400000);
    return diff;
  }

  function rebuildSelect() {
    selectEl.innerHTML = exams.map((e,i) =>
      `<option value="${i}">${e.name}</option>`
    ).join('');
    if (exams[selectedIdx]) selectEl.value = selectedIdx;
  }

  function updateDisplay() {
    if (!exams.length) {
      daysEl.textContent = '—';
      nameEl.textContent = 'No exams added';
      return;
    }
    const exam = exams[selectedIdx] || exams[0];
    const d = daysUntil(exam.date);
    daysEl.textContent = d < 0 ? '✓' : d;
    nameEl.textContent = d < 0 ? `${exam.name} passed` : exam.name;
    // Color urgency
    const urgencyColor = d <= 3 ? '#ff3b30' : d <= 7 ? '#ff9f0a' : '#8020ff';
    daysEl.style.background = `linear-gradient(135deg, ${urgencyColor}, #2060ff)`;
    daysEl.style['-webkit-background-clip'] = 'text';
    daysEl.style['background-clip'] = 'text';
  }

  function init() {
    load();
    rebuildSelect();
    updateDisplay();
  }

  // ── Events ──────────────────────────────────────────────
  selectEl.addEventListener('change', () => {
    selectedIdx = parseInt(selectEl.value) || 0;
    updateDisplay();
  });

  addToggle.addEventListener('click', () => {
    addArea.classList.toggle('hidden');
    addToggle.textContent = addArea.classList.contains('hidden') ? '+ Add exam' : '− Hide';
  });

  saveBtn.addEventListener('click', () => {
    const nm = nameInput.value.trim();
    const dt = dateInput.value;
    if (!nm || !dt) return;
    exams.push({ name: nm, date: dt });
    selectedIdx = exams.length - 1;
    save();
    rebuildSelect();
    updateDisplay();
    nameInput.value = ''; dateInput.value = '';
    addArea.classList.add('hidden');
    addToggle.textContent = '+ Add exam';
  });

  delBtn.addEventListener('click', () => {
    if (exams.length === 0) return;
    if (!confirm(`Delete "${exams[selectedIdx].name}"?`)) return;
    exams.splice(selectedIdx, 1);
    selectedIdx = Math.max(0, selectedIdx - 1);
    save();
    rebuildSelect();
    updateDisplay();
  });

  // Collapse toggle
  document.getElementById('ec-toggle-btn').addEventListener('click', () => {
    w.classList.toggle('ec-collapsed');
  });

  // Draggable
  let dragging = false, dx = 0, dy = 0;
  const hdr = document.getElementById('ec-header');
  hdr.addEventListener('mousedown', e => {
    if (e.target.id === 'ec-toggle-btn') return;
    dragging = true;
    const rect = w.getBoundingClientRect();
    dx = e.clientX - rect.left;
    dy = e.clientY - rect.top;
    w.style.transition = 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    w.style.left   = (e.clientX - dx) + 'px';
    w.style.top    = (e.clientY - dy) + 'px';
    w.style.right  = 'auto';
    w.style.bottom = 'auto';
  });
  document.addEventListener('mouseup', () => { dragging = false; w.style.transition = ''; });

  // Update counter every minute
  init();
  setInterval(updateDisplay, 60000);
})();
