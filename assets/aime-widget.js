/**
 * AIME Assistant Widget
 * A lightweight, accessible floating chat widget for the KL Material site.
 * 
 * Features:
 * - Accessible with keyboard navigation and ARIA labels
 * - Theme-aware (matches site design)
 * - Documented sendToServer() stub for future AI integration
 * - No API keys or external dependencies
 * 
 * Usage:
 *   <script src="./assets/aime-widget.js" defer></script>
 *   <link rel="stylesheet" href="./assets/aime-widget.css">
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    welcomeMessage: 'Hello! I\'m AIME, your AI assistant. I can help you find study materials, navigate the site, or answer questions about KL University CSE courses.',
    demoResponses: [
      'I can help you find materials for subjects like BEEC, DM, PSC, and DSD. What subject are you interested in?',
      'Check out the Materials section for PDF notes, question papers, and study resources!',
      'The Roadmap page has a complete 4-year B.Tech career guide with learning resources.',
      'You can use the search bar on the Materials page to quickly find specific topics.',
      'I\'m a demo assistant. In production, I\'d be connected to a real AI backend!'
    ],
    typingDelay: 800, // milliseconds
    storageKey: 'aime-chat-history'
  };

  /**
   * STUB: Send message to server for AI processing.
   * 
   * This function is a placeholder for server-side AI integration.
   * 
   * To implement a real AI backend:
   * 1. Set up an API endpoint (e.g., /api/chat or use OpenAI, Claude, etc.)
   * 2. Replace the demo response logic below with actual API calls
   * 3. Handle authentication, rate limiting, and error states
   * 
   * Example implementation with a real backend:
   * ```javascript
   * async function sendToServer(message) {
   *   const response = await fetch('/api/chat', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify({ message, sessionId: getSessionId() })
   *   });
   *   if (!response.ok) throw new Error('API request failed');
   *   const data = await response.json();
   *   return data.response;
   * }
   * ```
   * 
   * @param {string} message - The user's message
   * @returns {Promise<string>} - The AI response
   */
  async function sendToServer(message) {
    // DEMO MODE: Return a random demo response
    // Replace this with actual API integration for production
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * CONFIG.demoResponses.length);
        resolve(CONFIG.demoResponses[randomIndex]);
      }, CONFIG.typingDelay);
    });
  }

  // SVG Icons
  const ICONS = {
    chat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 5.92 2 10.5c0 2.47 1.19 4.69 3.08 6.17L4 22l5.23-2.75c.89.17 1.82.25 2.77.25 5.52 0 10-3.92 10-8.5S17.52 2 12 2zm1 13h-2v-2h2v2zm0-4h-2V6h2v5z"/>
    </svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>`,
    send: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>`,
    ai: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
      <circle cx="9" cy="10" r="1.5"/>
      <circle cx="15" cy="10" r="1.5"/>
      <path d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
    </svg>`
  };

  // Widget state
  let isOpen = false;
  let messages = [];
  let container = null;

  /**
   * Create the widget DOM structure
   */
  function createWidget() {
    container = document.createElement('div');
    container.className = 'aime-widget-container';
    container.innerHTML = `
      <div class="aime-chat-window" role="dialog" aria-label="AIME Assistant Chat" aria-modal="true">
        <div class="aime-header">
          <h2 class="aime-header-title">
            ${ICONS.ai}
            <span>AIME Assistant</span>
          </h2>
          <button class="aime-close-btn" aria-label="Close chat" title="Close chat">
            ${ICONS.close}
          </button>
        </div>
        <div class="aime-messages" role="log" aria-live="polite" aria-label="Chat messages">
          <div class="aime-welcome">
            <strong>Welcome to AIME!</strong>
            ${CONFIG.welcomeMessage}
          </div>
        </div>
        <div class="aime-input-area">
          <input 
            type="text" 
            class="aime-input" 
            placeholder="Type your message..." 
            aria-label="Type your message"
            autocomplete="off"
          >
          <button class="aime-send-btn" aria-label="Send message" title="Send message" disabled>
            ${ICONS.send}
          </button>
        </div>
      </div>
      <button class="aime-toggle-btn" aria-label="Open AIME chat assistant" aria-expanded="false" title="Open AIME chat assistant">
        ${ICONS.chat}
      </button>
    `;

    document.body.appendChild(container);
    bindEvents();
  }

  /**
   * Bind event listeners
   */
  function bindEvents() {
    const toggleBtn = container.querySelector('.aime-toggle-btn');
    const closeBtn = container.querySelector('.aime-close-btn');
    const input = container.querySelector('.aime-input');
    const sendBtn = container.querySelector('.aime-send-btn');
    const chatWindow = container.querySelector('.aime-chat-window');

    // Toggle chat
    toggleBtn.addEventListener('click', () => toggleChat());

    // Close button
    closeBtn.addEventListener('click', () => toggleChat(false));

    // Input handling
    input.addEventListener('input', () => {
      sendBtn.disabled = input.value.trim() === '';
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && input.value.trim()) {
        e.preventDefault();
        handleSendMessage();
      }
    });

    // Send button
    sendBtn.addEventListener('click', handleSendMessage);

    // Escape to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleChat(false);
        toggleBtn.focus();
      }
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (isOpen && !container.contains(e.target)) {
        toggleChat(false);
      }
    });

    // Trap focus within dialog when open
    chatWindow.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        trapFocus(e, chatWindow);
      }
    });
  }

  /**
   * Toggle chat window open/closed
   * @param {boolean|undefined} forceState - Optional forced state
   */
  function toggleChat(forceState) {
    isOpen = forceState !== undefined ? forceState : !isOpen;
    
    const chatWindow = container.querySelector('.aime-chat-window');
    const toggleBtn = container.querySelector('.aime-toggle-btn');
    const input = container.querySelector('.aime-input');

    chatWindow.classList.toggle('aime-open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    toggleBtn.setAttribute('aria-label', isOpen ? 'Close AIME chat' : 'Open AIME chat assistant');

    if (isOpen) {
      setTimeout(() => input.focus(), 100);
    }
  }

  /**
   * Handle sending a message
   */
  async function handleSendMessage() {
    const input = container.querySelector('.aime-input');
    const sendBtn = container.querySelector('.aime-send-btn');
    const message = input.value.trim();

    if (!message) return;

    // Disable input while processing
    input.disabled = true;
    sendBtn.disabled = true;

    // Add user message
    addMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    try {
      // Get response from server (currently demo mode)
      const response = await sendToServer(message);
      
      // Remove typing indicator and show response
      hideTypingIndicator();
      addMessage(response, 'assistant');
    } catch (error) {
      console.error('AIME: Error getting response:', error);
      hideTypingIndicator();
      addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
    }

    // Re-enable input
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }

  /**
   * Add a message to the chat
   * @param {string} text - Message text
   * @param {string} role - 'user' or 'assistant'
   */
  function addMessage(text, role) {
    const messagesContainer = container.querySelector('.aime-messages');
    const welcomeMsg = messagesContainer.querySelector('.aime-welcome');
    
    // Remove welcome message on first user message
    if (welcomeMsg && role === 'user') {
      welcomeMsg.remove();
    }

    const messageEl = document.createElement('div');
    messageEl.className = `aime-message aime-message-${role}`;
    messageEl.textContent = text;
    messageEl.setAttribute('role', 'article');
    messageEl.setAttribute('aria-label', `${role === 'user' ? 'You' : 'AIME'}: ${text}`);

    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Store message
    messages.push({ role, text, timestamp: Date.now() });
  }

  /**
   * Show typing indicator
   */
  function showTypingIndicator() {
    const messagesContainer = container.querySelector('.aime-messages');
    const typingEl = document.createElement('div');
    typingEl.className = 'aime-message aime-message-assistant aime-message-typing';
    typingEl.id = 'aime-typing';
    typingEl.innerHTML = `
      <span class="aime-typing-dot"></span>
      <span class="aime-typing-dot"></span>
      <span class="aime-typing-dot"></span>
    `;
    typingEl.setAttribute('aria-label', 'AIME is typing');
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  /**
   * Hide typing indicator
   */
  function hideTypingIndicator() {
    const typingEl = container.querySelector('#aime-typing');
    if (typingEl) {
      typingEl.remove();
    }
  }

  /**
   * Trap focus within an element for accessibility
   * @param {KeyboardEvent} e - Keyboard event
   * @param {HTMLElement} element - Container element
   */
  function trapFocus(e, element) {
    const focusableElements = element.querySelectorAll(
      'button, input, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstEl) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  }

  /**
   * Public API for external control
   */
  window.AIMEWidget = {
    open: () => toggleChat(true),
    close: () => toggleChat(false),
    toggle: () => toggleChat(),
    isOpen: () => isOpen,
    getMessages: () => [...messages],
    
    /**
     * Set a custom response handler for production use
     * @param {Function} handler - Async function that takes message and returns response
     */
    setResponseHandler: (handler) => {
      if (typeof handler === 'function') {
        // Override the sendToServer function
        window._aimeCustomHandler = handler;
      }
    }
  };

  // Override sendToServer if custom handler is set
  const originalSendToServer = sendToServer;
  async function sendToServerWithCustomHandler(message) {
    if (typeof window._aimeCustomHandler === 'function') {
      return window._aimeCustomHandler(message);
    }
    return originalSendToServer(message);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
