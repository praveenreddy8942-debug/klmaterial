import re

file_path = "materials.html"

with open(file_path, "r") as f:
    content = f.read()

# 1. Inject the CSS fix for `<option>` tags
css_fix = """
/* Dropdown Option Fix */
select.glass-input option {
    background-color: var(--bg-dark);
    color: var(--text-primary);
    padding: 10px;
}
"""
content = content.replace('/* Materials Page Specific */', css_fix + '\n/* Materials Page Specific */')

# 2. Add IDs to the filter bar elements
filter_bar_old = """<div class="glass filter-bar stagger" style="animation-delay:0.2s">
            <input type="text" class="glass-input" placeholder="Search materials...">
            <select class="glass-input"><option>All Years</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select>
            <select class="glass-input"><option>All Semesters</option><option>Odd Sem</option><option>Even Sem</option></select>
            <select class="glass-input"><option>All Subjects</option><option>Core</option><option>Elective</option></select>
            <button class="btn btn-primary">Reset</button>
        </div>"""

filter_bar_new = """<div class="glass filter-bar stagger" style="animation-delay:0.2s">
            <input type="text" id="searchSubject" class="glass-input" placeholder="Search subjects...">
            <select id="yearFilter" class="glass-input"><option value="all">All Years</option><option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option></select>
            <select id="semFilter" class="glass-input"><option value="all">All Semesters</option><option value="odd">Odd Sem</option><option value="even">Even Sem</option></select>
            <select id="typeFilter" class="glass-input"><option value="all">All Subjects</option><option value="core">Core</option><option value="elective">Elective</option></select>
            <button id="resetFilters" class="btn btn-primary">Reset</button>
        </div>"""

content = content.replace(filter_bar_old, filter_bar_new)

# 3. Inject data attributes into the sub-cards (all current are year 1, core)
# BEEC, DM, DSD, PSC are Odd sem. PP, LACE, DS, FIS, COA are Even sem.
odd_subjects = ['BEEC', 'DM', 'DSD', 'PSC']

def inject_data_attributes(match):
    full_str = match.group(0)
    pill_text_match = re.search(r'<span class="pill">(.*?)</span>', full_str)
    pill = pill_text_match.group(1).strip() if pill_text_match else ""
    
    sem_val = "odd" if pill in odd_subjects else "even"
    
    # replace first div
    return full_str.replace('<div class="glass glass-card sub-card', f'<div class="glass glass-card sub-card" data-year="1" data-sem="{sem_val}" data-type="core" data-search="{pill.lower()} "')

content = re.sub(r'<div class="glass glass-card sub-card stagger".*?</div>', inject_data_attributes, content, flags=re.DOTALL)


# 4. Inject the JS script to do the filtering at the bottom
filter_js = """
<script>
document.addEventListener("DOMContentLoaded", () => {
    const searchSub = document.getElementById("searchSubject");
    const yearF = document.getElementById("yearFilter");
    const semF = document.getElementById("semFilter");
    const typeF = document.getElementById("typeFilter");
    const resetBtn = document.getElementById("resetFilters");
    
    const cards = document.querySelectorAll(".sub-card");

    function formatTextForSearch(element) {
        return (element.textContent || "").toLowerCase().replace(/\\s+/g, ' ').trim();
    }

    // pre-compile search text
    cards.forEach(card => {
        card.dataset.fulltext = formatTextForSearch(card);
    });

    function filterCards() {
        const query = (searchSub.value || "").toLowerCase().trim();
        const year = yearF.value;
        const sem = semF.value;
        const type = typeF.value;

        let visibleCount = 0;

        cards.forEach(card => {
            const cardYear = card.getAttribute("data-year");
            const cardSem = card.getAttribute("data-sem");
            const cardType = card.getAttribute("data-type");
            const searchableText = card.dataset.fulltext;

            const matchQuery = query === "" || searchableText.includes(query);
            const matchYear = year === "all" || year === cardYear;
            const matchSem = sem === "all" || sem === cardSem;
            const matchType = type === "all" || type === cardType;

            if (matchQuery && matchYear && matchSem && matchType) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Toggle No Results
        let noResBox = document.getElementById("no-results-box");
        if (visibleCount === 0) {
            if (!noResBox) {
                noResBox = document.createElement("div");
                noResBox.id = "no-results-box";
                noResBox.className = "glass glass-card";
                noResBox.style.padding = "40px";
                noResBox.style.gridColumn = "1 / -1";
                noResBox.style.textAlign = "center";
                noResBox.innerHTML = "<h3 style='margin-bottom: 8px;'>No Subjects Found</h3><p style='color: var(--text-secondary);'>Try adjusting your filters or search query.</p>";
                document.querySelector(".cards-grid").appendChild(noResBox);
            }
            noResBox.style.display = "block";
        } else if (noResBox) {
            noResBox.style.display = "none";
        }
    }

    if (searchSub) {
        searchSub.addEventListener("input", filterCards);
        yearF.addEventListener("change", filterCards);
        semF.addEventListener("change", filterCards);
        typeF.addEventListener("change", filterCards);
        
        resetBtn.addEventListener("click", () => {
            searchSub.value = "";
            yearF.value = "all";
            semF.value = "all";
            typeF.value = "all";
            filterCards();
        });
    }
});
</script>
"""

content = content.replace('<script>\n\n</script>', filter_js)

with open(file_path, "w") as f:
    f.write(content)
print("Materials search and dropdown patched!")
