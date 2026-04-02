import glob

# 1. Inject Hamburger CSS to glass-components.css
css = """
/* ========================================= */
/* Hamburger Mobile Menu Liquid Glass CSS    */
/* ========================================= */
.hamburger {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1000;
  margin-right: 8px;
}
.hamburger .bar {
  display: block;
  width: 20px;
  height: 2px;
  margin: 4px auto;
  transition: all 0.3s var(--ease-spring);
  background-color: var(--text-primary);
  border-radius: 4px;
}

@media (max-width: 768px) {
    .hamburger {
        display: block;
    }
    
    .nav-track {
        overflow: visible !important;
        flex-grow: 0 !important;
    }
    
    .nav-links {
        position: fixed !important;
        top: 0 !important;
        right: -100% !important;
        width: 70vw !important;
        max-width: 300px !important;
        height: 100vh !important;
        flex-direction: column !important;
        justify-content: flex-start !important;
        align-items: flex-start !important;
        padding-top: 100px !important;
        padding-left: 30px !important;
        padding-right: 30px !important;
        background: var(--glass-bg, rgba(20,20,40,0.6)) !important;
        backdrop-filter: blur(50px) saturate(200%) !important;
        -webkit-backdrop-filter: blur(50px) saturate(200%) !important;
        border-left: 1px solid var(--glass-border) !important;
        transition: right 0.5s var(--ease-spring) !important;
        z-index: 998 !important;
        box-shadow: -20px 0 60px rgba(0,0,0,0.3) !important;
    }

    .nav-links a {
        width: 100% !important;
        padding: 15px 20px !important;
        margin: 5px 0 !important;
        font-size: 18px !important;
        border-radius: 12px !important;
    }
    
    body.nav-active .nav-links {
        right: 0 !important;
    }
    
    /* Hamburger to X Animation */
    body.nav-active .hamburger .bar:nth-child(2) { opacity: 0; }
    body.nav-active .hamburger .bar:nth-child(1) { transform: translateY(6px) rotate(45deg); }
    body.nav-active .hamburger .bar:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
    
    /* Optional: Hide marker on mobile */
    .nav-marker { display: none !important; }
}
"""

with open("glass-components.css", "a") as f:
    f.write(css)

# 2. Inject Hamburger button into all HTML pages
html_files = glob.glob("*.html")

target_btn = '<button class="theme-toggle" id="themeTgl"'

hamburger_html = """
        <button class="hamburger" id="mobileToggle" aria-label="Toggle Menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>"""

for file in html_files:
    with open(file, "r") as f:
        content = f.read()

    # Skip if already injected
    if 'id="mobileToggle"' in content or 'class="hamburger"' in content:
        continue

    # Find the theme toggle button and insert hamburger before it
    # We use a simple replace because the theme toggle button is unique inside the nav block
    if target_btn in content:
        content = content.replace(target_btn, hamburger_html.strip() + '\n        ' + target_btn)
        
        with open(file, "w") as f:
            f.write(content)
        print(f"Added hamburger to {file}!")
