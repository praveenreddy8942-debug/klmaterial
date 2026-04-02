import os

file_path = "materials.html"

if not os.path.exists(file_path):
    print("Error: materials.html not found!")
    exit(1)

with open(file_path, "r") as f:
    content = f.read()

# 1. Provide the CSS block for materials cards and selector pills (Glass Style)
material_css = """
<style>
/* GitHub Materials Glass Overrides */
.selector-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 15px;
}
.selector-pill {
  padding: 10px 20px;
  border-radius: 999px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s var(--ease-spring);
  display: flex;
  align-items: center;
  gap: 8px;
}
.selector-pill:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.4);
}
.selector-pill.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
}

.subject-card {
  margin-top: 40px;
  background: transparent;
  width: 100%;
}
.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--glass-border);
}
.subject-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}
.subject-title {
  font-size: 1.8rem;
  font-weight: 600;
}
.materials-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.material-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s var(--ease-spring);
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
.material-card:hover {
  transform: translateY(-5px) scale(1.02);
  border-color: var(--glass-border-focus);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.45) inset;
}
.card-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.file-icon { font-size: 2.2rem; }
.file-type-badge {
  background: rgba(255, 255, 255, 0.15);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}
.card-body {
  padding: 20px;
  flex-grow: 1;
}
.material-name {
  font-size: 1.1rem;
  margin-bottom: 10px;
  line-height: 1.4;
  color: var(--text-primary);
}
.material-meta {
  display: flex;
  gap: 15px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}
.card-footer {
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.download-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-weight: 500;
  transition: color 0.2s;
}
.download-link:hover {
  color: white;
}
.star.filled { color: #f59e0b; }
.star.half { color: #f59e0b; }
.star { color: rgba(255, 255, 255, 0.2); }

#filter-breadcrumb {
  margin-top: 15px;
  padding: 10px 20px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#breadcrumb-reset {
  background: rgba(255,255,255,0.1);
  border: none;
  padding: 5px 12px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}
.no-results {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: var(--text-secondary);
}
.advanced-search-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}
#clear-search {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
}
</style>
<link rel="stylesheet" href="glass-components.css">
"""

content = content.replace('<link rel="stylesheet" href="glass-components.css">', material_css)

# 2. Replace the hardcoded `<div class="glass filter-bar">...` up to `</main>` with the dynamic structures.
dynamic_dom = """
        <div class="glass filter-bar stagger" style="animation-delay:0.2s">
            <div class="advanced-search-container" style="margin-bottom: 20px;">
                <input type="text" id="search-bar" class="glass-input" placeholder="Search materials (e.g. BEEC, Python, Math)..." style="width: 100%;">
                <button id="clear-search">&times;</button>
            </div>
            
            <div id="year-selector" class="selector-pills">
                <button class="selector-pill active" data-year="all">All Years</button>
                <button class="selector-pill" data-year="1">1st Year</button>
                <button class="selector-pill" data-year="2">2nd Year</button>
                <button class="selector-pill" data-year="3">3rd Year</button>
                <button class="selector-pill" data-year="4">4th Year</button>
            </div>

            <div id="semester-group" style="display:none; margin-top: 15px;">
                <div id="semester-selector" class="selector-pills"></div>
            </div>

            <div id="subject-group" style="display:none; margin-top: 15px;">
                <div id="subject-selector" class="selector-pills"></div>
            </div>

            <div id="filter-breadcrumb" style="display:none">
                <span id="breadcrumb-path"></span>
                <button id="breadcrumb-reset">Reset</button>
            </div>
        </div>

        <!-- Dynamic Materials Container -->
        <div id="materials-list" style="margin-top: 30px;">
            <!-- github-materials.js will inject cards here -->
        </div>
"""

start_str = '<div class="glass filter-bar stagger" style="animation-delay:0.2s">'
end_str = '</main>'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + dynamic_dom + "\n    " + content[end_idx:]

# 3. Inject js dependencies BEFORE ui.js
scripts = """
<script src="https://kit.fontawesome.com/fe6e676100.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-db.js"></script>
<script src="github-materials.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof loadMaterials === 'function') {
      loadMaterials();
    }
  });
</script>
<script src="ui.js"></script>
"""

content = content.replace('<script src="ui.js"></script>', scripts)

with open(file_path, "w") as f:
    f.write(content)

print("Successfully injected github-materials framework into materials.html!")
