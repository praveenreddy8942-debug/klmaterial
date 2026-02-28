// ====================================
// Gemini AI Chatbot — KL Material Study Hub
// ====================================
(function () {
  'use strict';

  // ─── CONFIG ───────────────────────────────────────────
  // Gemini API key removed for security reasons.
  // To re-enable AI chat, set up a backend proxy endpoint and
  // restore the callGemini() logic. See git history for the
  // original implementation with model fallback.

  let isOpen = false;

  // ─── CREATE UI ────────────────────────────────────────
  function createChatUI() {
    // Floating action button
    const fab = document.createElement('button');
    fab.id = 'gemini-chat-fab';
    fab.setAttribute('aria-label', 'Open AI Study Buddy chat');
    fab.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    fab.addEventListener('click', toggleChat);

    // Chat window
    const win = document.createElement('div');
    win.id = 'gemini-chat-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'AI Study Buddy Chat');
    win.innerHTML = `
      <div class="gchat-header">
        <div class="gchat-header-info">
          <span class="gchat-avatar"><i class="fa-solid fa-robot"></i></span>
          <div>
            <strong>KL Study Buddy</strong>
            <small>Powered by Gemini AI</small>
          </div>
        </div>
        <button class="gchat-close" aria-label="Close chat">&times;</button>
      </div>
      <div id="gchat-messages" class="gchat-messages">
        <div class="gchat-msg bot">
          <span class="gchat-msg-icon"><i class="fa-solid fa-robot"></i></span>
          <div class="gchat-bubble">Hi! I'm your KL Study Buddy <i class="fa-solid fa-book-open"></i><br>Ask me anything about BEEC, DM, PSC, DSD, career roadmaps, or study tips!</div>
        </div>
      </div>
      <form id="gchat-form" class="gchat-input-area" autocomplete="off">
        <input type="text" id="gchat-input" placeholder="Ask about subjects, roadmaps..." autocomplete="off" />
        <button type="submit" class="gchat-send" aria-label="Send message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </form>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(win);

    // Events
    win.querySelector('.gchat-close').addEventListener('click', toggleChat);
    document.getElementById('gchat-form').addEventListener('submit', handleSubmit);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) toggleChat();
    });
  }

  // ─── TOGGLE ───────────────────────────────────────────
  function toggleChat() {
    const win = document.getElementById('gemini-chat-window');
    const fab = document.getElementById('gemini-chat-fab');
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);
    fab.classList.toggle('hidden', isOpen);
    if (isOpen) document.getElementById('gchat-input').focus();
  }

  // ─── SUBMIT ───────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('gchat-input');
    const query = input.value.trim();
    if (!query) return;

    input.value = '';
    appendMsg('user', query);

    // Gemini API key was removed for security. Show a friendly notice instead of crashing.
    appendMsg('bot', '<i class="fa-solid fa-triangle-exclamation"></i> AI chat is not configured yet. To enable it, set up a backend proxy for the Gemini API and update <code>chatbot.js</code>.', true);
  }

  // ─── UI HELPERS ───────────────────────────────────────
  function appendMsg(role, text, raw) {
    const container = document.getElementById('gchat-messages');
    const div = document.createElement('div');
    div.className = 'gchat-msg ' + (role === 'user' ? 'user' : 'bot');

    const icon = role === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';
    let html;
    if (raw) {
      // Trust the HTML as-is (used for internal bot messages with icons/links)
      html = text;
    } else {
      // Sanitize user/AI content, then apply basic markdown-like formatting
      html = text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
    }

    div.innerHTML = '<span class="gchat-msg-icon">' + icon + '</span><div class="gchat-bubble">' + html + '</div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  // ─── INIT ─────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatUI);
  } else {
    createChatUI();
  }
})();
