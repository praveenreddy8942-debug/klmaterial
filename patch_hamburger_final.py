import glob
import re

html_files = glob.glob("*.html")

burger_bars = '\n                <span class="bar"></span>\n                <span class="bar"></span>\n                <span class="bar"></span>\n            '

for file in html_files:
    with open(file, "r") as f:
        content = f.read()

    # We want to replace `<button class="mobile-toggle"...> <svg...>... </svg> </button>`
    # OR `<button class="mobile-btn"...> ... </button>`
    # Using regex to find the button and replace its inner HTML and add 'hamburger' class.

    # 1. Update .mobile-toggle
    def replacer_toggle(match):
        attrs = match.group(1)
        if 'hamburger' not in attrs:
            attrs += ' hamburger'
        return f'<button {attrs}>{burger_bars}</button>'

    # Match `<button ...class="mobile-toggle"...> ... </button>`
    content = re.sub(r'<button([^>]*class="[^"]*mobile-toggle[^"]*"[^>]*)>.*?</button>', replacer_toggle, content, flags=re.DOTALL)

    # 2. Update .mobile-btn
    def replacer_btn(match):
        attrs = match.group(1)
        if 'hamburger' not in attrs:
            attrs += ' hamburger'
        return f'<button {attrs}>{burger_bars}</button>'

    content = re.sub(r'<button([^>]*class="[^"]*mobile-btn[^"]*"[^>]*)>.*?</button>', replacer_btn, content, flags=re.DOTALL)

    # Save
    with open(file, "w") as f:
        f.write(content)
    print(f"Patched hamburger button in {file}")

# Update CSS to ensure .mobile-toggle and .mobile-btn are visible on mobile
css_patch = """
/* Guarantee hamburger is visible and styled on mobile */
@media (max-width: 768px) {
    .mobile-toggle, .mobile-btn {
        display: block !important;
        background: transparent !important;
        border: none !important;
        cursor: pointer !important;
        z-index: 1000 !important;
    }
}
@media (min-width: 769px) {
    .mobile-toggle, .mobile-btn, .hamburger {
        display: none !important;
    }
}
"""

with open("glass-components.css", "a") as f:
    f.write(css_patch)
print("Injected visibility guarantees to glass-components.css")
