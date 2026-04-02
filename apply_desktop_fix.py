import re
import os

css_file = 'kl-liquid-glass.css'

with open(css_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all occurrences of "header {" with ".navbar {"
# and similar for pseudo classes if they are definitely navigation
# Actually, it's safer to just do a precise regex replace for `header` to `.navbar` 
# specifically where it refers to the top-level element.
content = re.sub(r'\bheader\b(\s*\{)', r'.navbar\1', content)
content = re.sub(r'\bheader:hover\b', r'.navbar:hover', content)
content = re.sub(r'\bheader::before\b', r'.navbar::before', content)
content = re.sub(r'\bheader::after\b', r'.navbar::after', content)

# Inject left: 50% !important; inside the desktop .navbar block
# which has -webkit-transform: translate3d(-50%, 0, 0) !important;
if 'left: 50% !important;' not in content:
    content = content.replace(
        '-webkit-transform: translate3d(-50%, 0, 0) !important;',
        'left: 50% !important;\n    -webkit-transform: translate3d(-50%, 0, 0) !important;'
    )

# Inject Global Centering Fix for Desktop before the DESKTOP HEADER section
if 'GLOBAL CENTERING FIX' not in content:
    global_fix = """
/* ══════════════════════════════════════════════════════════
   GLOBAL CENTERING FIX (Desktop Layout)
   ══════════════════════════════════════════════════════════ */
.container, main, .search-wrapper, .hero, .cta-banner {
  margin-left: auto !important;
  margin-right: auto !important;
  max-width: 1200px !important;
}

"""
    content = content.replace(
        '/* ══════════════════════════════════════════════════════════\n   DESKTOP HEADER',
        global_fix + '/* ══════════════════════════════════════════════════════════\n   DESKTOP HEADER'
    )

with open(css_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed kl-liquid-glass.css layout issues.")
