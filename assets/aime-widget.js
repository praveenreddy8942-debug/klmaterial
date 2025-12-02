/**
 * AIME Assistant Widget
 * 
 * A lightweight, accessible AI assistant chat widget.
 * Client-side with built-in fallback responses and hooks for server-side AI integration.
 * 
 * INTEGRATION GUIDE:
 * To connect to a real AI backend (e.g., OpenAI), implement the sendToServer() function.
 * See the example at the bottom of this file.
 * 
 * @author KL Material Team
 * @version 1.0.0
 */

(function() {
  'use strict';

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  const CONFIG = {
    // Widget settings
    widgetId: 'aime-widget',
    storageKey: 'aime-chat-history',
    maxHistoryLength: 50,
    maxMessageLength: 1000, // Max characters per message
    maxStorageSize: 100000, // Max localStorage size in bytes (~100KB)
    
    // Messages
    welcomeMessage: "Hi! I'm AIME, your AI assistant for KL Material. How can I help you today?",
    errorMessage: "I'm sorry, I encountered an error. Please try again.",
    offlineMessage: "You appear to be offline. Some features may be limited.",
    
    // UI text
    placeholder: "Ask me anything...",
    sendButtonLabel: "Send message",
    toggleButtonLabel: "Open AIME assistant",
    closeButtonLabel: "Close chat",
    
    // Quick actions
    quickActions: [
      { label: "📚 Study materials", message: "Where can I find study materials?" },
      { label: "🗺️ Roadmap", message: "Show me the career roadmap" },
      { label: "💡 Help", message: "What can you help me with?" }
    ]
  };

  // ============================================================================
  // FALLBACK RESPONSES (used when no server is connected)
  // ============================================================================

  const FALLBACK_RESPONSES = {
    greetings: [
      "Hello! How can I assist you today?",
      "Hi there! What would you like to know?",
      "Hey! I'm here to help with your studies."
    ],
    materials: [
      "You can find study materials by clicking on the 'Materials' section in the navigation. We have resources for BEEC, DM, PSC, DSD, and more!",
      "Our materials section contains PDFs, notes, and resources organized by subject. Check out the Materials page!"
    ],
    roadmap: [
      "The Roadmap section provides a 4-year career guidance plan for B.Tech CSE students. You'll find learning paths, skill recommendations, and resource links.",
      "Check out our Roadmap page for career guidance, semester-wise learning plans, and recommended resources."
    ],
    help: [
      "I can help you with:\n• Finding study materials\n• Understanding the career roadmap\n• Navigating the website\n• General study tips\n\nJust ask away!",
      "I'm here to assist with study materials, career guidance, and general navigation. What would you like to know?"
    ],
    unknown: [
      "I'm not sure I understand. Could you rephrase that?",
      "That's an interesting question! For now, I can help with study materials and career roadmap. Try asking about those!",
      "I'm still learning! For specific questions, you might want to check the Materials or Roadmap sections."
    ]
  };

  // ============================================================================
  // STATE
  // ============================================================================

  let isOpen = false;
  let isTyping = false;
  let messageHistory = [];

  // ============================================================================
  // SERVER INTEGRATION HOOK
  // ============================================================================

  /**
   * Send message to AI server
   * 
   * DEVELOPERS: Implement this function to connect to your AI backend.
   * Return a Promise that resolves with the AI response string.
   * 
   * SECURITY NOTES:
   * - Never include API keys in client-side code
   * - Use a backend proxy server to handle API authentication
   * - Validate and sanitize all inputs on your server
   * - Implement rate limiting on your backend
   * 
   * Example backend proxy approach:
   * 
   * async function sendToServer(message, history) {
   *   // Validate input before sending
   *   if (!message || typeof message !== 'string') return null;
   *   
   *   const response = await fetch('YOUR_BACKEND_PROXY_ENDPOINT', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify({
   *       message: message.substring(0, 1000), // Limit message length
   *       // Only send minimal history needed
   *       historyCount: Math.min(history.length, 10)
   *     })
   *   });
   *   if (!response.ok) throw new Error('Server error');
   *   const data = await response.json();
   *   return data.reply;
   * }
   * 
   * @param {string} message - The user's message (already sanitized)
   * @param {Array} history - Previous messages [{role: 'user'|'assistant', content: string}]
   * @returns {Promise<string|null>} The AI response or null to use fallback
   */
  async function sendToServer(message, history) {
    // TODO: Implement your AI backend integration here
    // Return null to fall back to local responses
    
    // Example placeholder - uncomment and modify for your backend:
    /*
    try {
      // Input validation
      if (!message || typeof message !== 'string') return null;
      
      const response = await fetch('https://your-backend-proxy.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: message.substring(0, 1000),
          historyLength: history.length 
        })
      });
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      return typeof data.reply === 'string' ? data.reply : null;
    } catch (error) {
      console.error('[AIME] Server error:', error);
      return null; // Fall back to local responses
    }
    */
    
    return null; // Use local fallback responses
  }

  // ============================================================================
  // LOCAL RESPONSE GENERATOR
  // ============================================================================

  /**
   * Generate a local fallback response based on keywords
   */
  function generateLocalResponse(message) {
    const lower = message.toLowerCase();
    
    // Check for greetings
    if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening))/.test(lower)) {
      return randomChoice(FALLBACK_RESPONSES.greetings);
    }
    
    // Check for materials-related
    if (/material|study|pdf|note|resource|download|subject|beec|dm|psc|dsd/.test(lower)) {
      return randomChoice(FALLBACK_RESPONSES.materials);
    }
    
    // Check for roadmap-related
    if (/roadmap|career|path|guide|plan|semester|year|skill|job/.test(lower)) {
      return randomChoice(FALLBACK_RESPONSES.roadmap);
    }
    
    // Check for help request
    if (/help|what can you|how can you|what do you|capability|feature/.test(lower)) {
      return randomChoice(FALLBACK_RESPONSES.help);
    }
    
    // Default response
    return randomChoice(FALLBACK_RESPONSES.unknown);
  }

  /**
   * Get random item from array
   */
  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ============================================================================
  // MESSAGE HANDLING
  // ============================================================================

  /**
   * Process user message and get response
   */
  async function processMessage(userMessage) {
    if (!userMessage.trim()) return;
    
    // Add user message to history
    addMessage('user', userMessage);
    
    // Show typing indicator
    showTyping(true);
    
    try {
      // Try server first
      let response = await sendToServer(userMessage, messageHistory);
      
      // Fall back to local if server returns null
      if (!response) {
        // Simulate thinking delay
        await delay(500 + Math.random() * 1000);
        response = generateLocalResponse(userMessage);
      }
      
      showTyping(false);
      addMessage('assistant', response);
      
    } catch (error) {
      console.error('[AIME] Error:', error);
      showTyping(false);
      addMessage('assistant', CONFIG.errorMessage);
    }
  }

  /**
   * Add message to chat with sanitization
   */
  function addMessage(role, content) {
    // Validate role
    const validRoles = ['user', 'assistant'];
    const safeRole = validRoles.includes(role) ? role : 'assistant';
    
    // Sanitize content
    const safeContent = sanitizeMessage(content);
    if (!safeContent) return;
    
    const message = { role: safeRole, content: safeContent, timestamp: Date.now() };
    messageHistory.push(message);
    
    // Trim history if too long
    if (messageHistory.length > CONFIG.maxHistoryLength) {
      messageHistory = messageHistory.slice(-CONFIG.maxHistoryLength);
    }
    
    // Save to storage
    saveHistory();
    
    // Render message
    renderMessage(message);
  }

  /**
   * Render a message in the chat
   */
  function renderMessage(message) {
    const container = document.querySelector('.aime-messages');
    if (!container) return;
    
    // Validate role to prevent CSS injection
    const validRoles = ['user', 'assistant'];
    const safeRole = validRoles.includes(message.role) ? message.role : 'assistant';
    
    const div = document.createElement('div');
    div.className = 'aime-message aime-message--' + safeRole;
    div.setAttribute('role', 'listitem');
    div.textContent = message.content;
    
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  /**
   * Show/hide typing indicator
   */
  function showTyping(show) {
    isTyping = show;
    const container = document.querySelector('.aime-messages');
    if (!container) return;
    
    const existing = container.querySelector('.aime-message--typing');
    if (existing) existing.remove();
    
    if (show) {
      const div = document.createElement('div');
      div.className = 'aime-message aime-message--assistant aime-message--typing';
      div.setAttribute('aria-label', 'AIME is typing');
      div.innerHTML = '<span class="aime-typing-dot"></span><span class="aime-typing-dot"></span><span class="aime-typing-dot"></span>';
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }
  }

  // ============================================================================
  // STORAGE
  // ============================================================================

  /**
   * Sanitize message content for safe storage
   */
  function sanitizeMessage(content) {
    if (typeof content !== 'string') return '';
    // Truncate to max length and remove control characters
    return content
      .substring(0, CONFIG.maxMessageLength)
      .replace(/[\x00-\x1F\x7F]/g, '');
  }

  /**
   * Save chat history to localStorage with size limits
   */
  function saveHistory() {
    try {
      const data = JSON.stringify(messageHistory);
      // Check size limit
      if (data.length > CONFIG.maxStorageSize) {
        // Trim oldest messages until under limit
        while (messageHistory.length > 1 && JSON.stringify(messageHistory).length > CONFIG.maxStorageSize) {
          messageHistory.shift();
        }
      }
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(messageHistory));
    } catch (e) {
      console.warn('[AIME] Could not save history:', e);
      // If quota exceeded, clear old history
      if (e.name === 'QuotaExceededError') {
        clearHistory();
      }
    }
  }

  /**
   * Load chat history from localStorage with validation
   */
  function loadHistory() {
    try {
      const saved = localStorage.getItem(CONFIG.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate structure
        if (Array.isArray(parsed)) {
          messageHistory = parsed.filter(msg => 
            msg && 
            typeof msg.content === 'string' &&
            ['user', 'assistant'].includes(msg.role)
          ).map(msg => ({
            role: msg.role,
            content: sanitizeMessage(msg.content),
            timestamp: msg.timestamp || Date.now()
          }));
          return messageHistory.length > 0;
        }
      }
    } catch (e) {
      console.warn('[AIME] Could not load history:', e);
      // Clear corrupted data
      localStorage.removeItem(CONFIG.storageKey);
    }
    return false;
  }

  /**
   * Clear chat history
   */
  function clearHistory() {
    messageHistory = [];
    localStorage.removeItem(CONFIG.storageKey);
    const container = document.querySelector('.aime-messages');
    if (container) container.innerHTML = '';
  }

  // ============================================================================
  // UI RENDERING
  // ============================================================================

  /**
   * Create the widget HTML
   */
  function createWidget() {
    const widget = document.createElement('div');
    widget.id = CONFIG.widgetId;
    widget.className = 'aime-widget';
    widget.innerHTML = `
      <!-- Toggle Button -->
      <button class="aime-toggle" aria-label="${CONFIG.toggleButtonLabel}" aria-expanded="false">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L2 22l5.71-.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.4 0-2.74-.34-3.9-.96l-.28-.16-2.88.49.49-2.88-.16-.28C4.34 14.74 4 13.4 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.5-6H8c-.55 0-1 .45-1 1s.45 1 1 1h8.5c.55 0 1-.45 1-1s-.45-1-1-1zm0-3H8c-.55 0-1 .45-1 1s.45 1 1 1h8.5c.55 0 1-.45 1-1s-.45-1-1-1zm0-3H8c-.55 0-1 .45-1 1s.45 1 1 1h8.5c.55 0 1-.45 1-1s-.45-1-1-1z"/>
        </svg>
      </button>
      
      <!-- Chat Panel -->
      <div class="aime-panel" role="dialog" aria-label="AIME Assistant" aria-hidden="true">
        <!-- Header -->
        <div class="aime-header">
          <div class="aime-header-title">
            <div class="aime-header-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <div>
              <h2>AIME Assistant</h2>
              <div class="aime-header-status">Online • Ready to help</div>
            </div>
          </div>
          <button class="aime-header-close" aria-label="${CONFIG.closeButtonLabel}">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        
        <!-- Messages -->
        <div class="aime-messages" role="list" aria-live="polite" aria-label="Chat messages">
        </div>
        
        <!-- Quick Actions -->
        <div class="aime-quick-actions" role="group" aria-label="Quick actions">
          ${CONFIG.quickActions.map(action => 
            `<button class="aime-quick-btn" data-message="${escapeHtml(action.message)}">${action.label}</button>`
          ).join('')}
        </div>
        
        <!-- Input Area -->
        <form class="aime-input-area" role="search">
          <input 
            type="text" 
            class="aime-input" 
            placeholder="${CONFIG.placeholder}"
            aria-label="Type your message"
            autocomplete="off"
          />
          <button type="submit" class="aime-send" aria-label="${CONFIG.sendButtonLabel}">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </form>
      </div>
    `;
    
    document.body.appendChild(widget);
    return widget;
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    const widget = document.getElementById(CONFIG.widgetId);
    if (!widget) return;
    
    const toggle = widget.querySelector('.aime-toggle');
    const panel = widget.querySelector('.aime-panel');
    const closeBtn = widget.querySelector('.aime-header-close');
    const form = widget.querySelector('.aime-input-area');
    const input = widget.querySelector('.aime-input');
    const quickBtns = widget.querySelectorAll('.aime-quick-btn');
    
    // Toggle button
    toggle.addEventListener('click', () => {
      togglePanel(!isOpen);
    });
    
    // Close button
    closeBtn.addEventListener('click', () => {
      togglePanel(false);
    });
    
    // Form submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (message) {
        input.value = '';
        processMessage(message);
      }
    });
    
    // Quick action buttons
    quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const message = btn.getAttribute('data-message');
        if (message) {
          processMessage(message);
        }
      });
    });
    
    // Keyboard handling
    widget.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        togglePanel(false);
        toggle.focus();
      }
    });
    
    // Click outside to close
    document.addEventListener('click', (e) => {
      if (isOpen && !widget.contains(e.target)) {
        togglePanel(false);
      }
    });
  }

  /**
   * Toggle panel open/close
   */
  function togglePanel(open) {
    isOpen = open;
    
    const widget = document.getElementById(CONFIG.widgetId);
    if (!widget) return;
    
    const toggle = widget.querySelector('.aime-toggle');
    const panel = widget.querySelector('.aime-panel');
    const input = widget.querySelector('.aime-input');
    
    if (open) {
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.classList.add('aime-toggle--close');
      
      // Update toggle icon to X
      toggle.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      `;
      
      // Focus input
      setTimeout(() => input.focus(), 100);
      
    } else {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('aime-toggle--close');
      
      // Restore toggle icon
      toggle.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L2 22l5.71-.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.4 0-2.74-.34-3.9-.96l-.28-.16-2.88.49.49-2.88-.16-.28C4.34 14.74 4 13.4 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.5-6H8c-.55 0-1 .45-1 1s.45 1 1 1h8.5c.55 0 1-.45 1-1s-.45-1-1-1zm0-3H8c-.55 0-1 .45-1 1s.45 1 1 1h8.5c.55 0 1-.45 1-1s-.45-1-1-1zm0-3H8c-.55 0-1 .45-1 1s.45 1 1 1h8.5c.55 0 1-.45 1-1s-.45-1-1-1z"/>
        </svg>
      `;
    }
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Delay helper
   */
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initialize the AIME widget
   */
  function init() {
    // Create widget
    createWidget();
    
    // Setup events
    setupEventListeners();
    
    // Load history and render
    const hasHistory = loadHistory();
    const container = document.querySelector('.aime-messages');
    
    if (hasHistory && messageHistory.length > 0) {
      messageHistory.forEach(msg => renderMessage(msg));
    } else {
      // Show welcome message
      addMessage('assistant', CONFIG.welcomeMessage);
    }
    
    console.log('[AIME] Widget initialized');
  }

  /**
   * Destroy the widget
   */
  function destroy() {
    const widget = document.getElementById(CONFIG.widgetId);
    if (widget) {
      widget.remove();
    }
  }

  /**
   * Show/hide widget
   */
  function toggle(visible) {
    const widget = document.getElementById(CONFIG.widgetId);
    if (widget) {
      widget.setAttribute('data-hidden', visible ? 'false' : 'true');
    }
  }

  // Expose API (limited for security - sendToServer is internal only)
  window.AIME = {
    init: init,
    destroy: destroy,
    toggle: toggle,
    clearHistory: clearHistory,
    config: CONFIG
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
