import os

css_file = 'kl-liquid-glass.css'

with open(css_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Restore the block I changed in replace_file_content
old_block = """  .navbar {
    position: fixed !important;
    top: 24px !important;
    width: calc(100% - 48px) !important;
    max-width: 900px !important;
    height: auto !important;
    padding: 2px 8px !important;
    border-radius: 100px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.20) !important;
    backdrop-filter: var(--apple-blur) !important;
    -webkit-backdrop-filter: var(--apple-blur) !important;
    /* Keep desktop header centered while still forcing GPU compositing */
    left: 50% !important;
    -webkit-transform: translate3d(-50%, 0, 0) !important;
    transform: translate3d(-50%, 0, 0) !important;
    will-change: transform, backdrop-filter !important;"""

new_block = """  header {
    backdrop-filter: var(--apple-blur) !important;
    -webkit-backdrop-filter: var(--apple-blur) !important;
    /* Keep desktop header centered while still forcing GPU compositing */
    -webkit-transform: translate3d(-50%, 0, 0) !important;
    transform: translate3d(-50%, 0, 0) !important;
    will-change: transform, backdrop-filter !important;"""

content = content.replace(old_block, new_block)

# If the exact block wasn't found (maybe line ending differences), we will try a broader replace
if old_block not in content and 'position: fixed' in content and 'top: 24px' in content:
    print("WARNING: Exact block not found, might have whitespace differences")

# Reverse the python regex replacements
content = content.replace('.navbar {', 'header {')
content = content.replace('.navbar:hover', 'header:hover')
content = content.replace('.navbar::before', 'header::before')
content = content.replace('.navbar::after', 'header::after')

with open(css_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Reverted navbar edits!")
