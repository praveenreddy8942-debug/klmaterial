import os
import re

materials_file = "materials.html"

if not os.path.exists(materials_file):
    print("Error: materials.html not found.")
    exit(1)

with open(materials_file, "r") as f:
    materials_content = f.read()

# 1. We will link the buttons in materials.html to subject.html
# We must find the button inside each sub-card block and replace it based on the pill.
pattern = re.compile(r'<span class="pill">(.*?)</span>(.*?)<button class="btn btn-glass" style="width:100%;margin-top:8px">View Materials &rarr;</button>', re.DOTALL)

def replace_button(match):
    subject_code = match.group(1).strip()
    middle_html = match.group(2)
    new_btn = f'<a href="subject.html?sub={subject_code}" class="btn btn-glass" style="width:100%;text-align:center;margin-top:8px;text-decoration:none">View Materials &rarr;</a>'
    return f'<span class="pill">{subject_code}</span>{middle_html}{new_btn}'

new_materials_content = pattern.sub(replace_button, materials_content)

with open(materials_file, "w") as f:
    f.write(new_materials_content)
    print("Updated materials.html buttons to link to subject.html")


# 2. Now we create subject.html by copying materials.html layout, but ripping out the center grid
# and inserting the github-materials.js container and Glass CSS overrides!

subject_html = materials_content

# Add the github materials styles!
glass_css_overrides = """
<style>
/* GitHub Materials Glass Overrides */
.selector-pills { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 15px; }
.selector-pill {
  padding: 10px 20px; border-radius: 999px; background: var(--glass-bg); backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); color: var(--text-primary); font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: all 0.3s var(--ease-spring); display: flex; align-items: center; gap: 8px;
}
.selector-pill:hover { background: rgba(255, 255, 255, 0.15); transform: translateY(-2px); border-color: rgba(255, 255, 255, 0.4); }
.selector-pill.active { background: rgba(255, 255, 255, 0.25); border-color: rgba(255, 255, 255, 0.6); box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1); }

.subject-card { margin-top: 40px; background: transparent; width: 100%; }
.subject-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid var(--glass-border); }
.subject-title { font-size: 1.8rem; font-weight: 600; }
.materials-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }

.material-card {
  background: var(--glass-bg); backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); border-radius: 20px; overflow: hidden; transition: all 0.4s var(--ease-spring); display: flex; flex-direction: column; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
.material-card:hover { transform: translateY(-5px) scale(1.02); border-color: var(--glass-border-focus); background: rgba(255, 255, 255, 0.12); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.45) inset; }
.card-header { padding: 20px; display: flex; justify-content: space-between; align-items: center; background: rgba(255, 255, 255, 0.03); border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
.file-icon { font-size: 2.2rem; }
.file-type-badge { background: rgba(255, 255, 255, 0.15); padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
.card-body { padding: 20px; flex-grow: 1; }
.material-name { font-size: 1.1rem; margin-bottom: 10px; line-height: 1.4; color: var(--text-primary); }
.material-meta { display: flex; gap: 15px; font-size: 0.85rem; color: var(--text-secondary); }
.card-footer { padding: 15px 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); }
.download-link { display: flex; align-items: center; gap: 8px; color: var(--text-primary); font-weight: 500; transition: color 0.2s; }
.download-link:hover { color: white; }
.star.filled { color: #f59e0b; }
.star.half { color: #f59e0b; }
.star { color: rgba(255, 255, 255, 0.2); }
#filter-breadcrumb { margin-top: 15px; padding: 10px 20px; background: rgba(255,255,255,0.05); border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
#breadcrumb-reset { background: rgba(255,255,255,0.1); border: none; padding: 5px 12px; border-radius: 8px; color: white; cursor: pointer; }
.no-results { text-align: center; padding: 40px; font-size: 1.2rem; color: var(--text-secondary); }
#clear-search { position: absolute; right: 15px; background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; display: none; }
</style>
<link rel="stylesheet" href="glass-components.css">
"""
subject_html = subject_html.replace('<link rel="stylesheet" href="glass-components.css">', glass_css_overrides)

# Replace <title>
subject_html = subject_html.replace("<title>CSE Study Materials</title>", "<title>Subject Materials - KL Material</title>")
subject_html = subject_html.replace('<header class="page-header stagger" style="animation-delay:0.1s">\n        <h1 class="page-title">CSE Study Materials</h1>', '<header class="page-header stagger" style="animation-delay:0.1s">\n        <h1 class="page-title" id="subject-main-title">Loading Subject...</h1>')
subject_html = subject_html.replace('<p class="page-subtitle">Access comprehensive study resources for your engineering journey</p>', '<p class="page-subtitle" id="subject-subtitle">View and download all resources for this course.</p>')


# Remove stats pills
stats_start = subject_html.find('<div class="stats-pills">')
stats_end = subject_html.find('</div>', stats_start + 20) + 6
if stats_start != -1 and stats_end != -1:
    subject_html = subject_html[:stats_start] + subject_html[stats_end+1:]


# Inject Dynamic Body
dynamic_body = """
        <div class="glass filter-bar stagger" id="search-container-box" style="animation-delay:0.2s">
            <div style="display: flex; align-items: center; position: relative; width: 100%;">
                <input type="text" id="search-bar" class="glass-input" placeholder="Search files in this subject (e.g. Notes, Textbook)..." style="width: 100%;">
                <button id="clear-search">&times;</button>
            </div>
            
            <!-- Hidden required selectors for github-materials.js -->
            <div id="year-selector" class="selector-pills" style="display:none;"></div>
            <div id="semester-group" style="display:none;"><div id="semester-selector" class="selector-pills"></div></div>
            <div id="subject-group" style="display:none;"><div id="subject-selector" class="selector-pills"></div></div>
            <div id="filter-breadcrumb" style="display:none"><span id="breadcrumb-path"></span><button id="breadcrumb-reset">Reset</button></div>
        </div>

        <div style="margin-bottom: 20px;">
             <a href="materials.html" class="btn btn-glass" style="padding: 8px 16px; font-size: 14px;">&larr; Back to Subjects</a>
        </div>

        <!-- Dynamic Materials Container -->
        <div id="materials-list">
            <!-- github-materials.js will inject cards here -->
            <div style="text-align:center; padding: 40px;">
                <p>Loading files securely from GitHub...</p>
            </div>
        </div>
"""

main_start = subject_html.find('<main class="container">') + len('<main class="container">')
main_end = subject_html.find('</main>')

subject_html = subject_html[:main_start] + "\n" + dynamic_body + "\n    " + subject_html[main_end:]


# Add scripts
scripts = """
<script src="https://kit.fontawesome.com/fe6e676100.js" crossorigin crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-db.js"></script>
<script src="github-materials.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const subCode = urlParams.get('sub');
    
    if (subCode && typeof subjects !== 'undefined' && subjects[subCode]) {
        // Update Title dynamically
        const titleEl = document.getElementById("subject-main-title");
        if(titleEl) titleEl.innerText = subjects[subCode].name;
        
        // Auto-select in github-materials.js
        window.activeSubject = subCode;
        window.activeYear = subjects[subCode].year.toString();
        window.activeSemester = subjects[subCode].semester.toString();
        
        if (typeof loadMaterials === 'function') {
            loadMaterials().then(() => {
                // If the script forcefully changed anything we can override here if needed
                // It natively filters the display elements!
            });
        }
    } else {
        // No subject param provided, throw error or redirect back to materials index
        const titleEl = document.getElementById("subject-main-title");
        if(titleEl) titleEl.innerText = "Subject Not Found";
        const subtitleEl = document.getElementById("subject-subtitle");
        if(subtitleEl) subtitleEl.innerText = "Please return to the Materials page & select a valid core subject.";
        document.getElementById("search-container-box").style.display = 'none';
        document.getElementById("materials-list").innerHTML = '';
    }
  });
</script>
<script src="ui.js"></script>
"""

subject_html = subject_html.replace('<script src="ui.js"></script>', scripts)

with open("subject.html", "w") as f:
    f.write(subject_html)
    print("Created subject.html")
