// ====================================
// Gemini AI Chatbot — KL Material Study Hub
// ====================================
(function () {
  'use strict';

  // ─── CONFIG ───────────────────────────────────────────
  const GEMINI_API_KEY = 'AIzaSyA_W8GFEooAY3WPGuVfkBiU8vZIH39j6G0'; // ← Get free key: https://aistudio.google.com/apikey
  const MODEL = 'gemini-2.0-flash';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const SYSTEM_PROMPT = `You are KL Study Buddy, a friendly AI assistant on the KL Material Study Hub website.
You help B.Tech CSE students with:
- Study materials for subjects like BEEC, Discrete Mathematics, PSC, DSD
- Career roadmaps, learning paths, and placement preparation
- Explaining technical concepts in simple language
- Study tips and exam strategies
Keep responses concise (2-4 sentences unless more detail is asked). Use simple language.
If asked about unrelated topics, politely redirect to academics.`;

  let chatHistory = [];
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

    if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
      appendMsg('bot', '<i class="fa-solid fa-triangle-exclamation"></i> API key not configured. Get a free Gemini key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a> and paste it in chatbot.js');
      return;
    }

    const typingId = showTyping();
    try {
      const reply = await callGemini(query);
      removeTyping(typingId);
      appendMsg('bot', reply);
    } catch (err) {
      removeTyping(typingId);
      console.error('Gemini API error:', err);
      appendMsg('bot', '<i class="fa-solid fa-face-smile-wink"></i> Sorry, something went wrong. Please try again in a moment.');
    }
  }

  // ─── GEMINI API ───────────────────────────────────────
  async function callGemini(userMessage) {
    chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });

    // Trim history to last 20 messages to prevent memory leak
    if (chatHistory.length > 20) {
      chatHistory = chatHistory.slice(-20);
    }
    const recent = chatHistory;

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: recent,
        generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 512 }
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || 'HTTP ' + res.status);
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received. Try again.';
    chatHistory.push({ role: 'model', parts: [{ text: reply }] });
    return reply;
  }

  // ─── UI HELPERS ───────────────────────────────────────
  function appendMsg(role, text) {
    const container = document.getElementById('gchat-messages');
    const div = document.createElement('div');
    div.className = 'gchat-msg ' + (role === 'user' ? 'user' : 'bot');

    const icon = role === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';
    // Basic formatting: bold, inline code, line breaks
    const html = text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>')
      // Restore anchor tags that got escaped (for our own messages)
      .replace(/&lt;a href=&quot;(.*?)&quot;(.*?)&gt;(.*?)&lt;\/a&gt;/g, '<a href="$1"$2>$3</a>');

    div.innerHTML = '<span class="gchat-msg-icon">' + icon + '</span><div class="gchat-bubble">' + html + '</div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function showTyping() {
    const container = document.getElementById('gchat-messages');
    const div = document.createElement('div');
    const id = 'typing-' + Date.now();
    div.id = id;
    div.className = 'gchat-msg bot';
    div.innerHTML = '<span class="gchat-msg-icon"><i class="fa-solid fa-robot"></i></span><div class="gchat-bubble gchat-typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
  }

  function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  // ─── INIT ─────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatUI);
  } else {
    createChatUI();
  }
})();
