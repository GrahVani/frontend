import os

base_dir = r"c:\CorpoAstroOfficial_grahavani\Grahvani\curriculum\interactive-specs"

specs = {
    "mula-root-mandala": "Mula Root Mandala",
    "purva-ashadha-relationship-map": "Purva Ashadha Relationship Map",
    "uttara-ashadha-attribute-universe": "Uttara Ashadha Attribute Universe",
    "shravana-dhanishtha-concept-constellation": "Shravana Dhanishtha Concept Constellation",
    "shatabhishaj-bhadrapada-knowledge-galaxy": "Shatabhishaj Bhadrapada Knowledge Galaxy",
    "revati-constellation-diagram": "Revati Constellation Diagram"
}

template = """# Interactive Spec: {title}

## Lesson
- **Registry key**: `{slug}`
- **Module**: 07 - Nakshatras
- **Chapter**: 05 - Mula to Revati

## Component Identity
- **Taxonomy type**: B. Explorer
- **Display mode**: Section 7 primary simulator

## Pedagogical Purpose
Interactive visualization for Chapter 5.

## Runtime Contract
The lesson frontmatter declares:
```yaml
interactive:
  enabled: true
  component: {slug}
  type: reference-card
  spec_file: interactive-specs/{slug}.md
```
"""

for slug, title in specs.items():
    file_path = os.path.join(base_dir, f"{slug}.md")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(template.format(slug=slug, title=title))

print("Created 6 spec files.")
