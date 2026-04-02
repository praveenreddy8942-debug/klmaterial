import os

# 1. Append Chatbot CSS to glass-components.css
chatbot_css = """
/* ========================================= */
/* KL Study Buddy Chatbot - Liquid Glass CSS */
/* ========================================= */
#gemini-chat-fab {
  position: fixed;
  bottom: 30px;
  right: 100px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--glass-bg, rgba(255,255,255,0.1));
  backdrop-filter: var(--glass-blur, blur(40px) saturate(180%));
  -webkit-backdrop-filter: var(--glass-blur, blur(40px) saturate(180%));
  border: 1px solid var(--glass-border, rgba(255,255,255,0.25));
  box-shadow: 0 8px 32px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.45) inset;
  color: var(--text-primary, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s var(--ease-spring);
}
#gemini-chat-fab:hover { transform: scale(1.05) translateY(-2px); }
#gemini-chat-fab.hidden { display: none; }

#gemini-chat-window {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 90vw;
  max-width: 380px;
  height: 60vh;
  max-height: 600px;
  min-height: 400px;
  background: var(--glass-bg, rgba(20, 20, 40, 0.4));
  backdrop-filter: blur(50px) saturate(200%);
  -webkit-backdrop-filter: blur(50px) saturate(200%);
  border: 1px solid var(--glass-border, rgba(255,255,255,0.25));
  box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 1px 2px rgba(255,255,255,0.3) inset;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px) scale(0.95);
  transition: all 0.4s var(--ease-spring);
  overflow: hidden;
}
#gemini-chat-window.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

.gchat-header {
  padding: 16px 20px;
  background: rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.gchat-header-info { display: flex; align-items: center; gap: 12px; }
.gchat-avatar {
  background: linear-gradient(135deg, #2060ff, #8020ff);
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; color: white;
}
.gchat-header-info strong { font-size: 15px; color: var(--text-primary); }
.gchat-header-info small { display: block; font-size: 11px; color: var(--text-secondary); opacity: 0.8; }
.gchat-close { background: transparent; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer; }

.gchat-messages {
  flex-grow: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px;
}
.gchat-msg { display: flex; align-items: flex-end; gap: 8px; max-width: 90%; }
.gchat-msg.user { align-self: flex-end; flex-direction: row-reverse; }

.gchat-msg-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; background: rgba(255,255,255,0.1); color: var(--text-primary); }
.gchat-msg.bot .gchat-msg-icon { background: linear-gradient(135deg, #2060ff, #8020ff); color: white; }

.gchat-bubble {
  background: rgba(255,255,255,0.08);
  padding: 12px 16px; border-radius: 18px 18px 18px 4px; border: 1px solid rgba(255,255,255,0.1);
  font-size: 14px; line-height: 1.4; color: var(--text-primary);
}
.gchat-msg.user .gchat-bubble {
  background: rgba(32, 96, 255, 0.4); border-color: rgba(32, 96, 255, 0.6);
  border-radius: 18px 18px 4px 18px;
}

.gchat-input-area {
  padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.03); display: flex; gap: 8px;
}
#gchat-input {
  flex-grow: 1; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  border-radius: 999px; padding: 10px 16px; color: var(--text-primary); outline: none; font-size: 14px;
}
#gchat-input:focus { border-color: rgba(255,255,255,0.5); }
.gchat-send {
  background: linear-gradient(135deg, #2060ff, #8020ff); border: none; width: 40px; height: 40px;
  border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer;
}

.gchat-quick-replies { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.gchat-qr-btn {
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  padding: 6px 12px; border-radius: 999px; font-size: 12px; color: var(--text-primary); cursor: pointer; transition: all 0.2s;
}
.gchat-qr-btn:hover { background: rgba(255,255,255,0.2); }
"""

with open("glass-components.css", "a") as f:
    f.write(chatbot_css)
print("Injected Chatbot Liquid Glass CSS")

# 2. Append Scroll Top Logic to ui.js
scroll_logic = """
// Scroll Top Button logic
document.addEventListener("DOMContentLoaded", () => {
    const sTop = document.getElementById("sTop");
    if (sTop) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                sTop.classList.add("visible");
            } else {
                sTop.classList.remove("visible");
            }
        });
    }
});
"""

with open("ui.js", "a") as f:
    f.write(scroll_logic)
print("Injected Scroll Top logic")
