/**
 * AIME Widget - Client-side AI Assistant
 * A lightweight, accessible floating chat widget for study help.
 * 
 * Features:
 * - Keyboard accessible (Tab, Enter, Escape)
 * - Theme-aware (prefers-color-scheme)
 * - Demo responses (client-side only)
 * - Documented placeholder for server-side AI integration
 * 
 * Usage:
 * Include aime-widget.css and aime-widget.js in your page.
 * The widget auto-initializes on DOMContentLoaded.
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    welcomeMessage: "👋 Hi! I'm AIME, your study assistant. Ask me about CSE topics, materials, or career guidance!",
    placeholderText: "Ask me anything...",
    typingDelay: 300,       // Delay before showing typing indicator
    minTypingTime: 600,     // Simulated response time (reduced for demo)
  };

  // Demo responses for client-side operation (no API keys needed)
  const DEMO_RESPONSES = {
    greetings: [
      "Hello! How can I help you with your studies today?",
      "Hi there! Ready to help you learn. What topic are you interested in?",
      "Hey! I'm here to assist with your CSE coursework. What's on your mind?"
    ],
    materials: [
      "You can find study materials in the Materials section. Use the search bar to filter by subject like BEEC, DM, PSC, or DSD.",
      "Check out our Materials page! It's organized by subjects and you can download PDFs directly.",
      "All our study resources are available in the Materials section. Looking for something specific?"
    ],
    roadmap: [
      "The Roadmap section has a complete 4-year B.Tech career guide with learning resources for each semester.",
      "For career guidance, visit the Roadmap page. It covers skills, projects, and interview prep for each year.",
      "Want to plan your CSE journey? The Roadmap page has everything from fundamentals to placement preparation."
    ],
    general: [
      "That's a great question! While I can provide general guidance, you might want to explore our Materials or Roadmap sections for detailed resources.",
      "I'm here to help! For specific study materials, check the Materials page. For career advice, see the Roadmap.",
      "Good thinking! I recommend checking out our curated resources in the Materials section for in-depth learning.",
      "Interesting topic! Browse through our study hub to find relevant materials and learning paths."
    ]
  };

  /**
   * Placeholder function for server-side AI integration.
   * 
   * To enable server-side AI:
   * 1. Replace this function with actual API calls
   * 2. Add your AI endpoint URL
   * 3. Handle authentication securely (server-side tokens)
   * 4. Never expose API keys in client-side code
   * 
   * Example implementation:
   * async function sendToServer(message) {
   *   const response = await fetch('/api/ai/chat', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify({ message, sessionId: getSessionId() })
   *   });
   *   const data = await response.json();
   *   return data.reply;
   * }
   * 
   * @param {string} message - The user's message
   * @returns {Promise<string>} - The AI response
   */
  async function sendToServer(message) {
    // DEMO MODE: Returns a contextual demo response
    // Replace this with actual server call for production
    
    const lowerMessage = message.toLowerCase();
    
    let responsePool;
    if (lowerMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
      responsePool = DEMO_RESPONSES.greetings;
    } else if (lowerMessage.match(/\b(material|pdf|download|study|notes|book)\b/)) {
      responsePool = DEMO_RESPONSES.materials;
    } else if (lowerMessage.match(/\b(roadmap|career|job|interview|placement|skill)\b/)) {
      responsePool = DEMO_RESPONSES.roadmap;
    } else {
      responsePool = DEMO_RESPONSES.general;
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, CONFIG.minTypingTime));
    
    return responsePool[Math.floor(Math.random() * responsePool.length)];
  }

  // Widget Class
  class AIMEWidget {
    constructor() {
      this.isOpen = false;
      this.isProcessing = false;
      this.messages = [];
      this.container = null;
      this.panel = null;
      this.messagesContainer = null;
      this.input = null;
      this.sendButton = null;
      this.toggleButton = null;
    }

    init() {
      this.createWidget();
      this.attachEventListeners();
      this.addMessage('assistant', CONFIG.welcomeMessage);
    }

    createWidget() {
      // Create container
      this.container = document.createElement('div');
      this.container.className = 'aime-widget';
      this.container.setAttribute('role', 'complementary');
      this.container.setAttribute('aria-label', 'AIME Study Assistant');

      // Create toggle button
      this.toggleButton = document.createElement('button');
      this.toggleButton.className = 'aime-toggle';
      this.toggleButton.setAttribute('aria-expanded', 'false');
      this.toggleButton.setAttribute('aria-controls', 'aime-panel');
      this.toggleButton.setAttribute('aria-label', 'Open AIME assistant');
      this.toggleButton.innerHTML = `
        <span class="aime-icon-chat" aria-hidden="true">💬</span>
        <span class="aime-icon-close" aria-hidden="true">✕</span>
      `;

      // Create panel
      this.panel = document.createElement('div');
      this.panel.className = 'aime-panel';
      this.panel.id = 'aime-panel';
      this.panel.setAttribute('role', 'dialog');
      this.panel.setAttribute('aria-label', 'Chat with AIME');
      this.panel.setAttribute('data-open', 'false');

      // Panel header
      const header = document.createElement('div');
      header.className = 'aime-header';
      header.innerHTML = `
        <div class="aime-header-icon" aria-hidden="true">🤖</div>
        <div class="aime-header-title">AIME Assistant</div>
        <div class="aime-header-status">Online</div>
      `;

      // Messages container
      this.messagesContainer = document.createElement('div');
      this.messagesContainer.className = 'aime-messages';
      this.messagesContainer.setAttribute('role', 'log');
      this.messagesContainer.setAttribute('aria-live', 'polite');
      this.messagesContainer.setAttribute('aria-label', 'Chat messages');

      // Input area
      const inputArea = document.createElement('div');
      inputArea.className = 'aime-input-area';

      this.input = document.createElement('input');
      this.input.className = 'aime-input';
      this.input.type = 'text';
      this.input.placeholder = CONFIG.placeholderText;
      this.input.setAttribute('aria-label', 'Type your message');

      this.sendButton = document.createElement('button');
      this.sendButton.className = 'aime-send';
      this.sendButton.setAttribute('aria-label', 'Send message');
      this.sendButton.innerHTML = '➤';

      inputArea.appendChild(this.input);
      inputArea.appendChild(this.sendButton);

      // Assemble panel
      this.panel.appendChild(header);
      this.panel.appendChild(this.messagesContainer);
      this.panel.appendChild(inputArea);

      // Assemble container
      this.container.appendChild(this.panel);
      this.container.appendChild(this.toggleButton);

      // Add to page
      document.body.appendChild(this.container);
    }

    attachEventListeners() {
      // Toggle button
      this.toggleButton.addEventListener('click', () => this.toggle());

      // Send button
      this.sendButton.addEventListener('click', () => this.handleSend());

      // Input enter key
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSend();
        }
      });

      // Escape key to close
      this.panel.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.close();
          this.toggleButton.focus();
        }
      });

      // Focus trap within panel when open
      this.panel.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          const focusableElements = this.panel.querySelectorAll(
            'button, input, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      });
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      this.isOpen = true;
      this.panel.setAttribute('data-open', 'true');
      this.toggleButton.setAttribute('aria-expanded', 'true');
      this.toggleButton.setAttribute('aria-label', 'Close AIME assistant');
      
      // Focus input after animation
      setTimeout(() => {
        this.input.focus();
      }, 200);
    }

    close() {
      this.isOpen = false;
      this.panel.setAttribute('data-open', 'false');
      this.toggleButton.setAttribute('aria-expanded', 'false');
      this.toggleButton.setAttribute('aria-label', 'Open AIME assistant');
    }

    addMessage(type, content) {
      const message = document.createElement('div');
      message.className = `aime-message aime-message--${type}`;
      message.textContent = content;
      
      this.messagesContainer.appendChild(message);
      this.scrollToBottom();
      
      this.messages.push({ type, content, timestamp: Date.now() });
    }

    showTypingIndicator() {
      const typing = document.createElement('div');
      typing.className = 'aime-message aime-message--assistant aime-message--typing';
      typing.id = 'aime-typing';
      typing.innerHTML = `
        <span class="aime-typing-dot"></span>
        <span class="aime-typing-dot"></span>
        <span class="aime-typing-dot"></span>
      `;
      this.messagesContainer.appendChild(typing);
      this.scrollToBottom();
    }

    hideTypingIndicator() {
      const typing = document.getElementById('aime-typing');
      if (typing) {
        typing.remove();
      }
    }

    scrollToBottom() {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    async handleSend() {
      const message = this.input.value.trim();
      
      if (!message || this.isProcessing) {
        return;
      }

      this.isProcessing = true;
      this.sendButton.disabled = true;
      this.input.value = '';

      // Add user message
      this.addMessage('user', message);

      // Show typing indicator
      setTimeout(() => {
        this.showTypingIndicator();
      }, CONFIG.typingDelay);

      try {
        // Get response from server (or demo in client mode)
        const response = await sendToServer(message);
        
        // Hide typing and show response
        this.hideTypingIndicator();
        this.addMessage('assistant', response);
      } catch (error) {
        console.error('AIME Widget Error:', error);
        this.hideTypingIndicator();
        this.addMessage('assistant', "Sorry, I'm having trouble responding right now. Please try again later.");
      }

      this.isProcessing = false;
      this.sendButton.disabled = false;
      this.input.focus();
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const widget = new AIMEWidget();
      widget.init();
    });
  } else {
    const widget = new AIMEWidget();
    widget.init();
  }

  // Expose for external control if needed (namespaced to avoid conflicts)
  window.KLMaterial = window.KLMaterial || {};
  window.KLMaterial.AIMEWidget = AIMEWidget;
})();
