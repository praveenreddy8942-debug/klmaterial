import re
import os

with open("style.css", "r") as f:
    lines = f.readlines()

# Extract from line 2870 (Chatbot) to 3950 (End of Scroll Progress)
# Using 0-indexing, 2868 to 3950
css_lines = lines[2860:3960]
extracted_css = "".join(css_lines)

# Write to glass-components.css
with open("glass-components.css", "w") as f:
    f.write("/* Extracted Components CSS */\n")
    f.write(extracted_css)

files = ["index.html", "materials.html", "roadmap.html", "cgpa.html", "about.html", "contact.html"]

for file in files:
    if os.path.exists(file):
        with open(file, "r") as f:
            content = f.read()

        # 1. Add link into <head>
        if 'href="glass-components.css"' not in content:
            content = content.replace("</head>", '    <link rel="stylesheet" href="glass-components.css">\n</head>')
            
        # 2. Remove inline mobileToggle/mobBtn logic
        content = re.sub(r'const mobileToggle.*classList\.toggle\(\'mobile\-open\'\);\s+\}\);', '', content, flags=re.DOTALL)
        content = re.sub(r'document\.getElementById\(\'mobBtn\'\)\.onclick\s*=\s*\(\)\s*=>\s*\{\s*document\.getElementById\(\'nLinks\'\)\.classList\.toggle\(\'open\'\)\s*\};', '', content)
        
        # Write back
        with open(file, "w") as f:
            f.write(content)
        print(f"Fixed {file}")

print("Extraction and injection complete.")
