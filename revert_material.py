import os

materials_html_content = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CSE Study Materials</title>
<style>
:root{--bg-dark:#080818;--glass-bg:rgba(255,255,255,0.08);--glass-border:rgba(255,255,255,0.25);--glass-border-focus:rgba(255,255,255,0.5);--glass-blur:blur(40px) saturate(180%);--text-primary:rgba(255,255,255,0.95);--text-secondary:rgba(255,255,255,0.62);--text-muted:rgba(255,255,255,0.38);--ease-spring:cubic-bezier(0.34,1.56,0.64,1);--ease-out:cubic-bezier(0.16,1,0.3,1)}*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{background:var(--bg-dark);color:var(--text-primary);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif;min-height:100vh;overflow-x:hidden}a{text-decoration:none;color:inherit}.bg-layer{position:fixed;inset:0;z-index:0;overflow:hidden}.blob{position:absolute;border-radius:50%;filter:blur(100px);will-change:transform;animation:float 20s infinite alternate cubic-bezier(0.45,.05,.55,.95)}.blob-1{background:#2060ff;top:-200px;left:-200px;width:800px;height:800px;opacity:.7;animation-duration:26s}.blob-2{background:#8020ff;top:20%;right:-150px;width:700px;height:700px;opacity:.7;animation-duration:18s;animation-delay:-5s}.blob-3{background:#00e5a0;bottom:-100px;left:30%;width:600px;height:600px;opacity:.7;animation-duration:22s;animation-delay:-10s}.blob-4{background:#ff5520;top:50%;left:5%;width:500px;height:500px;opacity:.45;animation-duration:24s;animation-delay:-15s}@keyframes float{0%{transform:translate(0,0) scale(1)}33%{transform:translate(5%,8%) scale(1.05)}66%{transform:translate(-4%,4%) scale(.95)}100%{transform:translate(6%,-6%) scale(1.02)}}.main-wrapper{position:relative;z-index:1}.glass{position:relative;background:var(--glass-bg);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border:1px solid var(--glass-border);box-shadow:0 8px 32px rgba(0,0,0,.22),0 1px 0 rgba(255,255,255,.45) inset,0 -1px 0 rgba(0,0,0,.08) inset;overflow:hidden;z-index:2}.glass::before{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(135deg,rgba(255,255,255,.45) 0%,rgba(255,255,255,.05) 45%,transparent 65%)}.glass>*{position:relative;z-index:2}.navbar{position:sticky;top:0;z-index:100;height:60px;background:rgba(255,255,255,.07);backdrop-filter:blur(50px) saturate(200%);-webkit-backdrop-filter:blur(50px) saturate(200%);border-bottom:1px solid rgba(255,255,255,.12);display:flex;align-items:center}.navbar::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;z-index:3;background:linear-gradient(90deg,transparent,rgba(255,255,255,.6) 50%,transparent);pointer-events:none}.nav-container{width:100%;max-width:1200px;margin:0 auto;padding:0 24px;display:flex;justify-content:space-between;align-items:center}.nav-brand{font-weight:600;font-size:18px}.nav-links{display:flex;gap:8px}.nav-link{padding:6px 16px;font-size:14px;color:var(--text-secondary);transition:all .3s var(--ease-spring);border:1px solid transparent;border-radius:999px}.nav-link:hover{color:var(--text-primary);background:rgba(255,255,255,.05)}.nav-link.active{color:var(--text-primary);background:rgba(255,255,255,.15);border-color:var(--glass-border)}.mobile-btn{display:none;background:0 0;border:0;color:#fff;cursor:pointer}.btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 24px;border-radius:999px;font-size:15px;font-weight:600;cursor:pointer;transition:all .3s var(--ease-spring);will-change:transform;border:none;outline:none}.btn:hover{transform:scale(1.04) translateY(-1px)}.btn:active{transform:scale(.97)}.btn-primary{background:rgba(255,255,255,.95);color:#111;box-shadow:0 4px 16px rgba(0,0,0,.2)}.btn-glass{color:#fff;background:var(--glass-bg);backdrop-filter:var(--glass-blur);border:1px solid var(--glass-border);box-shadow:0 8px 32px rgba(0,0,0,.22),0 1px 0 rgba(255,255,255,.45) inset;position:relative;overflow:hidden}.page-header{text-align:center;padding:60px 24px;display:flex;flex-direction:column;align-items:center;gap:16px}.page-title{font-size:2.5rem;font-weight:300;letter-spacing:-1px}.page-subtitle{font-size:1.1rem;color:var(--text-secondary)}.stagger{opacity:0;transform:translateY(20px);will-change:transform,opacity;animation:fadeUp .8s var(--ease-out) forwards}@keyframes fadeUp{to{opacity:1;transform:translateY(0)}}.glass-card{border-radius:24px;transition:all .35s var(--ease-spring);will-change:transform}.glass-card:hover{transform:translateY(-5px) scale(1.02);box-shadow:0 12px 40px rgba(0,0,0,.3),0 1px 0 rgba(255,255,255,.45) inset,0 -1px 0 rgba(0,0,0,.08) inset}.container{max-width:1200px;margin:0 auto;padding:0 24px 80px}.footer{margin-top:auto;padding:40px 24px;text-align:center;border-radius:40px 40px 0 0;border-bottom:none}.footer-links{display:flex;justify-content:center;gap:24px;margin:20px 0;flex-wrap:wrap}.footer-links a{color:var(--text-muted);font-size:14px}.scroll-top{position:fixed;bottom:30px;right:30px;width:50px;height:50px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;visibility:hidden;transform:translateY(20px) scale(.9);transition:all .4s var(--ease-spring);z-index:99;border:1px solid var(--glass-border)}.scroll-top.visible{opacity:1;visibility:visible;transform:translateY(0) scale(1)}.glass-input{width:100%;padding:14px 20px;border-radius:12px;color:#fff;outline:none;border:1px solid var(--glass-border);background:var(--glass-bg);backdrop-filter:var(--glass-blur);transition:all .3s ease}.glass-input::placeholder{color:var(--text-muted)}.glass-input:focus{border-color:var(--glass-border-focus);box-shadow:0 0 0 3px rgba(255,255,255,.08)}@media(max-width:768px){.nav-links{display:none;position:absolute;top:60px;left:0;right:0;flex-direction:column;padding:16px;background:rgba(10,10,26,.9);backdrop-filter:blur(20px)}.nav-links.open{display:flex}.mobile-btn{display:block}}
/* Materials Page Specific */
.stats-pills{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:8px}
.pill{padding:6px 16px;border-radius:999px;font-size:14px;font-weight:500;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2)}
.filter-bar{padding:24px;display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:16px;margin-bottom:40px;border-radius:24px}
@media(max-width:900px){.filter-bar{grid-template-columns:1fr}}
.cards-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:24px}
.sub-card{padding:32px;display:flex;flex-direction:column;gap:16px;align-items:flex-start}
.sub-card .pill{background:rgba(255,255,255,0.15);color:white;margin-bottom:8px}
.sub-card h3{font-size:1.4rem;font-weight:600}
.sub-card p{color:var(--text-secondary);flex-grow:1;font-size:0.95rem;line-height:1.5}
.sub-card::after{content:'';position:absolute;top:0;left:-150%;width:50%;height:100%;background:linear-gradient(to right,transparent,rgba(255,255,255,.2),transparent);transform:skewX(-25deg);z-index:1;pointer-events:none;transition:left .5s ease}
.sub-card:hover::after{left:200%}
</style>

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
    <link rel="stylesheet" href="glass-components.css">
</head>
<body>
<div class="bg-layer">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
    <div class="blob blob-4"></div>
</div>

<div class="main-wrapper">
    <nav class="navbar">
        <div class="nav-container">
            <a href="index.html" class="nav-brand">KL Material</a>
            <div class="nav-links" id="nLinks">
                <a href="index.html" class="nav-link">Home</a>
                <a href="materials.html" class="nav-link active">Materials</a>
                <a href="roadmap.html" class="nav-link">Roadmap</a>
                <a href="cgpa.html" class="nav-link">CGPA Calc</a>
                <a href="about.html" class="nav-link">About</a>
                <a href="contact.html" class="nav-link">Contact</a>
            </div>
            <button class="mobile-btn" id="mobBtn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
        </div>
    </nav>

    <header class="page-header stagger" style="animation-delay:0.1s">
        <h1 class="page-title">CSE Study Materials</h1>
        <p class="page-subtitle">Access comprehensive study resources for your engineering journey</p>
        <div class="stats-pills">
            <div class="pill">100+ Materials</div>
            <div class="pill">9 Subjects</div>
            <div class="pill">Free Access</div>
        </div>
    </header>

    <main class="container">
        <div class="glass filter-bar stagger" style="animation-delay:0.2s">
            <input type="text" class="glass-input" placeholder="Search materials...">
            <select class="glass-input"><option>All Years</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select>
            <select class="glass-input"><option>All Semesters</option><option>Odd Sem</option><option>Even Sem</option></select>
            <select class="glass-input"><option>All Subjects</option><option>Core</option><option>Elective</option></select>
            <button class="btn btn-primary">Reset</button>
        </div>

        <div class="cards-grid">
            <div class="glass glass-card sub-card stagger" style="animation-delay:0.3s">
                <span class="pill">BEEC</span>
                <h3>Basic Electrical & Electronics</h3>
                <p>Circuits, electronics fundamentals</p>
                <button class="btn btn-glass" style="width:100%;margin-top:8px">View Materials &rarr;</button>
            </div>
            <div class="glass glass-card sub-card stagger" style="animation-delay:0.35s">
                <span class="pill">DM</span>
                <h3>Discrete Mathematics</h3>
                <p>Logic, sets, graph theory</p>
                <button class="btn btn-glass" style="width:100%;margin-top:8px">View Materials &rarr;</button>
            </div>
            <div class="glass glass-card sub-card stagger" style="animation-delay:0.4s">
                <span class="pill">DSD</span>
                <h3>Digital System Design</h3>
                <p>Logic gates, flip-flops, circuits</p>
                <button class="btn btn-glass" style="width:100%;margin-top:8px">View Materials &rarr;</button>
            </div>
            <div class="glass glass-card sub-card stagger" style="animation-delay:0.45s">
                <span class="pill">PSC</span>
                <h3>Problem Solving with C</h3>
                <p>C programming fundamentals</p>
                <button class="btn btn-glass" style="width:100%;margin-top:8px">View Materials &rarr;</button>
            </div>
            <div class="glass glass-card sub-card stagger" style="animation-delay:0.5s">
                <span class="pill">PP</span>
                <h3>Python Programming</h3>
                <p>Python basics to advanced</p>
                <button class="btn btn-glass" style="width:100%;margin-top:8px">View Materials &rarr;</button>
            </div>
            <div class="glass glass-card sub-card stagger" style="animation-delay:0.55s">
                <span class="pill">LACE</span>
                <h3>Linear Algebra & Calculus</h3>
                <p>Matrices, derivatives, integrals</p>
                <button class="btn btn-glass" style="width:100%;margin-top:8px">View Materials &rarr;</button>
            </div>
            <div class="glass glass-card sub-card stagger" style="animation-delay:0.6s">
                <span class="pill">DS</span>
                <h3>Data Structures</h3>
                <p>Arrays, trees, graphs, algorithms</p>
                <button class="btn btn-glass" style="width:100%;margin-top:8px">View Materials &rarr;</button>
            </div>
            <div class="glass glass-card sub-card stagger" style="animation-delay:0.65s">
                <span class="pill">FIS</span>
                <h3>Foundations of Information Security</h3>
                <p>Cryptography, security basics</p>
                <button class="btn btn-glass" style="width:100%;margin-top:8px">View Materials &rarr;</button>
            </div>
            <div class="glass glass-card sub-card stagger" style="animation-delay:0.7s">
                <span class="pill">COA</span>
                <h3>Computer Organization & Architecture</h3>
                <p>CPU, memory, instruction sets</p>
                <button class="btn btn-glass" style="width:100%;margin-top:8px">View Materials &rarr;</button>
            </div>
        </div>
    </main>

    <footer class="glass footer stagger" style="animation-delay:0.8s">
        <div style="font-weight:600;font-size:18px">KL Material</div>
        <p style="color:var(--text-secondary);margin-top:8px">always free, always accessible</p>
        <div class="footer-links">
            <a href="materials.html">Materials</a><a href="roadmap.html">Roadmap</a><a href="cgpa.html">CGPA Calc</a><a href="about.html">About</a><a href="contact.html">Contact</a><a href="#">Privacy</a>
        </div>
        <div style="color:var(--text-muted);font-size:13px">&copy; 2026 Praveen Reddy &middot; Made with ❤️ for KL University students</div>
    </footer>

    <button class="glass scroll-top" id="sTop" onclick="window.scrollTo(0,0)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
    </button>
</div>

<script src="ui.js"></script>
<script src="advanced-features.js"></script>
<script src="chatbot.js"></script>
</body>
</html>
"""

with open("materials.html", "w") as f:
    f.write(materials_html_content)

print("Reverted materials.html to the static Apple Liquid Glass version.")
