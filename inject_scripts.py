import os

files = ["index.html", "materials.html", "roadmap.html", "cgpa.html", "about.html", "contact.html"]

scripts_to_inject = """
<script src="ui.js"></script>
<script src="advanced-features.js"></script>
<script src="chatbot.js"></script>
"""

light_mode_styles = """
<style>
[data-theme="light"] {
    --bg-dark: #f0f4f8;
    --glass-bg: rgba(255, 255, 255, 0.7);
    --glass-border: rgba(255, 255, 255, 1);
    --glass-border-focus: rgba(0, 119, 255, 0.5);
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-muted: #94a3b8;
}
[data-theme="light"] .blob-1 { background: #3b82f6; opacity: 0.6; }
[data-theme="light"] .blob-2 { background: #8b5cf6; opacity: 0.6; }
[data-theme="light"] .blob-3 { background: #10b981; opacity: 0.6; }
[data-theme="light"] .blob-4 { background: #f97316; opacity: 0.4; }
[data-theme="light"] .nav-link { color: var(--text-secondary); }
[data-theme="light"] .nav-link:hover { color: var(--text-primary); background: rgba(0,0,0,0.05); }
[data-theme="light"] .nav-link.active { background: rgba(0,0,0,0.1); border-color: rgba(0,0,0,0.1); color: var(--text-primary); }
[data-theme="light"] .navbar { background: rgba(255,255,255,0.4); border-bottom: 1px solid rgba(0,0,0,0.1); }
[data-theme="light"] .navbar::before { background: linear-gradient(90deg, transparent, rgba(0,0,0,0.2) 50%, transparent); }
[data-theme="light"] .btn-primary { background: #0f172a; color: #f8fafc; }
[data-theme="light"] .glass-input { color: #0f172a; }
[data-theme="light"] .footer-links a { color: var(--text-secondary); }
[data-theme="light"] .mobile-toggle, [data-theme="light"] .mobile-btn { color: #0f172a; }
[data-theme="light"] #themeToggle { color: #0f172a; }
</style>
"""

for file in files:
    if os.path.exists(file):
        with open(file, 'r') as f:
            content = f.read()
            
        if "<style>\n[data-theme" not in content:
            content = content.replace('</head>', light_mode_styles + '</head>')
            
        if "chatbot.js" not in content:
            content = content.replace('</body>', scripts_to_inject + '</body>')
            
        with open(file, 'w') as f:
            f.write(content)
        print(f"Updated {file}")
