/**
 * aime-widget.js
 * AIME (AI Material Expert) Assistant Widget
 * 
 * Client-side chat widget with demo responses.
 * Includes a documented sendToServer() stub for future AI integration.
 * 
 * Usage: Include this script in your page. The widget auto-initializes on load.
 * 
 * Server Integration:
 * To connect to a real AI backend, implement the sendToServer() function below.
 * See README.md for detailed server integration instructions.
 */

(function() {
  'use strict';

  // ============================================================================
  // SERVER INTEGRATION HOOK
  // ============================================================================
  
  /**
   * Send a message to the server and return the AI response.
   * 
   * STUB: This function currently returns null, triggering fallback responses.
   * 
   * To integrate with a real AI backend:
   * 1. Set up your server endpoint (e.g., /api/chat)
   * 2. Implement this function to POST the message and return the response
   * 3. Handle authentication (API keys should be server-side only!)
   * 
   * Example implementation:
   * 
   * async function sendToServer(message) {
   *   try {
   *     const response = await fetch('/api/chat', {
   *       method: 'POST',
   *       headers: { 'Content-Type': 'application/json' },
   *       body: JSON.stringify({ message: message })
   *     });
   *     
   *     if (!response.ok) throw new Error('Server error');
   *     
   *     const data = await response.json();
   *     return data.reply; // Adjust based on your API response format
   *   } catch (error) {
   *     console.error('AIME: Server request failed:', error);
   *     return null; // Falls back to demo responses
   *   }
   * }
   * 
   * @param {string} message - The user's message
   * @returns {Promise<string|null>} The AI response, or null to use fallback
   */
  async function sendToServer(message) {
    // STUB: Return null to use fallback responses
    // Implement your server integration here
    return null;
  }

  // ============================================================================
  // FALLBACK RESPONSES (Client-only demo mode)
  // ============================================================================

  const FALLBACK_RESPONSES = [
    "Hi! I'm AIME, your AI Material Expert. I can help you find study materials, explain concepts, or suggest resources. What would you like to know?",
    "I can help with subjects like BEEC, Discrete Mathematics, PSC, and DSD. Which topic interests you?",
    "Looking for study materials? Check out the Materials section using the navigation above!",
    "For the B.Tech roadmap and career guidance, visit the Roadmap page. It has year-by-year learning paths.",
    "I'm here to assist with your academic journey. Feel free to ask about any CSE topic!",
    "That's a great question! While I'm running in demo mode, the full version can provide detailed explanations.",
    "Want to know about a specific subject? I can point you to relevant resources.",
    "The Materials page has organized content by subject. Use the search and filter features to find what you need.",
    "Remember to take breaks while studying! A fresh mind learns better.",
    "I'm currently in demo mode. When connected to the server, I can provide more personalized responses."
  ];

  const GREETING_RESPONSES = [
    "Hello! 👋 I'm AIME, your study assistant. How can I help you today?",
    "Hi there! Ready to help with your studies. What are you working on?",
    "Hey! I'm here to assist with CSE materials and resources. Ask me anything!"
  ];

  const KEYWORD_RESPONSES = {
    'material': "You can find all study materials on the Materials page. Use the subject filters to narrow down what you need!",
    'materials': "You can find all study materials on the Materials page. Use the subject filters to narrow down what you need!",
    'beec': "BEEC (Basic Electrical & Electronic Circuits) materials are available in the Materials section. Look for the BEEC filter!",
    'discrete': "Discrete Mathematics resources can be found by filtering for 'DM' in the Materials page.",
    'math': "For math-related materials, check the Discrete Mathematics (DM) section in Materials.",
    'psc': "PSC (Probability, Statistics, and Complex Analysis) materials are organized in the Materials section.",
    'dsd': "DSD (Digital System Design) content is available in the Materials page. Use the DSD filter!",
    'roadmap': "The Roadmap page has a comprehensive 4-year B.Tech career guide with semester-wise learning paths.",
    'help': "I can help you find study materials, navigate the site, or answer questions about CSE topics. What do you need?",
    'thanks': "You're welcome! Happy to help. Good luck with your studies! 📚",
    'thank': "You're welcome! Feel free to ask if you need anything else.",
    'bye': "Goodbye! Best of luck with your studies. Come back anytime! 👋"
  };

  // ============================================================================
  // WIDGET IMPLEMENTATION
  // ============================================================================

  let responseIndex = 0;

  function getRandomGreeting() {
    return GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)];
  }

  function getResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for greetings
    if (/^(hi|hello|hey|greetings)/i.test(lowerMessage)) {
      return getRandomGreeting();
    }
    
    // Check for keyword matches
    for (const [keyword, response] of Object.entries(KEYWORD_RESPONSES)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    // Use rotating fallback responses
    const response = FALLBACK_RESPONSES[responseIndex % FALLBACK_RESPONSES.length];
    responseIndex++;
    return response;
  }

  function createWidget() {
    // Create widget container
    const widget = document.createElement('div');
    widget.className = 'aime-widget';
    widget.setAttribute('role', 'complementary');
    widget.setAttribute('aria-label', 'AIME Chat Assistant');

    widget.innerHTML = `
      <button class="aime-toggle" aria-expanded="false" aria-controls="aime-panel" title="Chat with AIME">
        <span class="aime-icon-open">💬</span>
        <span class="aime-icon-close">✕</span>
      </button>
      
      <div id="aime-panel" class="aime-panel" role="dialog" aria-label="Chat with AIME">
        <div class="aime-header">
          <span class="aime-header-icon">🤖</span>
          <div>
            <h3 class="aime-header-title">AIME</h3>
            <p class="aime-header-subtitle">AI Material Expert</p>
          </div>
        </div>
        
        <div class="aime-messages" role="log" aria-live="polite" aria-label="Chat messages">
          <div class="aime-message aime-message-bot">
            Hi! I'm AIME, your AI Material Expert. I can help you find study materials and resources. What can I help you with today?
          </div>
        </div>
        
        <form class="aime-input-area">
          <input 
            type="text" 
            class="aime-input" 
            placeholder="Type your message..." 
            aria-label="Your message"
            autocomplete="off"
          />
          <button type="submit" class="aime-send" aria-label="Send message">➤</button>
        </form>
      </div>
    `;

    document.body.appendChild(widget);

    // Get references
    const toggle = widget.querySelector('.aime-toggle');
    const panel = widget.querySelector('.aime-panel');
    const messages = widget.querySelector('.aime-messages');
    const form = widget.querySelector('.aime-input-area');
    const input = widget.querySelector('.aime-input');
    const sendBtn = widget.querySelector('.aime-send');

    // Toggle panel
    function togglePanel() {
      const isOpen = panel.classList.toggle('aime-open');
      toggle.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        input.focus();
      }
    }

    toggle.addEventListener('click', togglePanel);

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && panel.classList.contains('aime-open')) {
        togglePanel();
        toggle.focus();
      }
    });

    // Add message to chat
    function addMessage(text, isUser) {
      const msg = document.createElement('div');
      msg.className = 'aime-message ' + (isUser ? 'aime-message-user' : 'aime-message-bot');
      msg.textContent = text;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }

    // Show typing indicator
    function showTyping() {
      const typing = document.createElement('div');
      typing.className = 'aime-message aime-message-bot aime-message-typing';
      typing.id = 'aime-typing';
      typing.textContent = 'AIME is thinking...';
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;
    }

    function hideTyping() {
      const typing = document.getElementById('aime-typing');
      if (typing) {
        typing.remove();
      }
    }

    // Handle message submission
    async function handleSubmit(e) {
      e.preventDefault();
      
      const text = input.value.trim();
      if (!text) return;
      
      // Add user message
      addMessage(text, true);
      input.value = '';
      sendBtn.disabled = true;
      
      // Show typing indicator
      showTyping();
      
      // Try server first, then fallback
      let response;
      try {
        response = await sendToServer(text);
      } catch (err) {
        console.warn('[AIME] Server request error:', err);
        response = null;
      }
      
      // Simulate slight delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
      
      hideTyping();
      
      if (response === null || response === undefined) {
        response = getResponse(text);
      }
      
      addMessage(response, false);
      sendBtn.disabled = false;
    }

    form.addEventListener('submit', handleSubmit);

    // Enable/disable send button based on input
    input.addEventListener('input', function() {
      sendBtn.disabled = !input.value.trim();
    });

    console.info('[AIME] Widget initialized. Running in demo mode.');
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }

  // Expose for debugging
  window.AIME = {
    sendToServer: sendToServer
  };

})();
