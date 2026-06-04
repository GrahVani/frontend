import re

components = [
    "anuradha-devotion-network",
    "ashlesha-honest-handling-dojo",
    "chitra-celestial-gem-lab",
    "gandanta-water-fire-junction",
    "jyeshtha-supremacy-talisman",
    "magha-ancestral-gateway-lab",
    "mula-root-mandala",
    "nakshatra-profile",
    "nakshatra-template-lab",
    "purva-ashadha-relationship-map",
    "purva-uttara-doctrine-explorer",
    "pushya-auspiciousness-lab",
    "revati-constellation-diagram",
    "shatabhishaj-bhadrapada-knowledge-galaxy",
    "shravana-dhanishtha-concept-constellation",
    "swati-breeze-navigator",
    "uttara-ashadha-attribute-universe",
    "vishakha-forked-path-explorer"
]

def kebab_to_pascal(text):
    return "".join(word.capitalize() for word in text.split("-"))

file_path = r"c:\CorpoAstroOfficial_grahavani\Grahvani\frontend-grahvani-software\src\components\learning-runtime\interactive\registry.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

missing_components = []
for c in components:
    if f'"{c}"' not in content:
        missing_components.append(c)

print(f"Missing components: {missing_components}")

if not missing_components:
    print("Nothing to fix.")
    exit(0)

new_imports = ""
new_entries = ""

for c in missing_components:
    pascal = kebab_to_pascal(c)
    new_imports += f'import {{ {pascal} }} from "./{c}";\n'
    new_entries += f'  "{c}": {pascal},\n'

# Find last import
last_import_index = content.rfind("import {")
end_of_last_import = content.find("\n", last_import_index) + 1

content = content[:end_of_last_import] + new_imports + content[end_of_last_import:]

# Find end of registry object
registry_end = content.rfind("};\n\nexport function resolveInteractive")

content = content[:registry_end] + new_entries + content[registry_end:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed registry.ts")
