import os

base_dir = r"c:\CorpoAstroOfficial_grahavani\Grahvani\curriculum\tier-1-foundation\module-07-nakshatras\chapter-05-mula-to-revati"

replacements = {
    "lesson-01-mula-the-root-nirriti-domain.md": "mula-root-mandala",
    "lesson-02-purva-ashadha-the-former-undefeated.md": "purva-ashadha-relationship-map",
    "lesson-03-uttara-ashadha-the-latter-undefeated.md": "uttara-ashadha-attribute-universe",
    "lesson-04-shravana-and-dhanishtha-the-hearing-and-wealth-pair.md": "shravana-dhanishtha-concept-constellation",
    "lesson-05-shatabhishaj-purva-bhadrapada-uttara-bhadrapada.md": "shatabhishaj-bhadrapada-knowledge-galaxy",
    "lesson-06-revati-the-rich-pushan-domain.md": "revati-constellation-diagram"
}

for filename, component_slug in replacements.items():
    file_path = os.path.join(base_dir, filename)
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace the component slug in frontmatter
    content = content.replace(
        "  component: nakshatra-profile\n",
        f"  component: {component_slug}\n"
    )
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Fixed component slugs in frontmatter")
