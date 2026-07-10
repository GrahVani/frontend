#!/usr/bin/env python3
"""
Bulk-migrate interactive workbench SVG layouts from 50/50 grid to diagram-first flex.

Only touches files where:
- a `responsiveTwoColumnStyle` div contains an `<SomeSvgComponent` call, and
- that div has a `<section style={cardStyle}>` child and a
  `<section style={{ display: "grid", gap: "0.85rem" }}>` sibling.

All other files are left unchanged and reported for manual review.
"""

import re
from pathlib import Path

INTERACTIVE_DIR = Path("src/components/learning-runtime/interactive")
LAYOUT_IMPORT = 'import { workbenchTwoColumnStyle, workbenchDiagramLayoutStyle } from "../lib/layouts";'


def find_lucide_import_end(content: str) -> int | None:
    """Return the index just after the last lucide-react import line."""
    matches = list(re.finditer(r'^import \{[^}]+\} from "lucide-react";\n', content, re.MULTILINE))
    if matches:
        return matches[-1].end()
    return None


def transform_file(path: Path) -> tuple[bool, str]:
    content = path.read_text(encoding="utf-8")
    original = content

    if "responsiveTwoColumnStyle" not in content or "<svg" not in content:
        return False, "no svg or no responsiveTwoColumnStyle"

    # Find responsiveTwoColumnStyle divs that contain an SVG component call.
    svg_div_match = None
    for m in re.finditer(r'<div style=\{responsiveTwoColumnStyle\}>', content):
        div_start = m.start()
        # Find matching closing </div> by simple tag counting.
        depth = 0
        div_end = None
        for i in range(div_start, len(content)):
            if content.startswith("<div", i):
                depth += 1
            elif content.startswith("</div>", i):
                depth -= 1
                if depth == 0:
                    div_end = i + 6
                    break
        if div_end is None:
            continue
        div_content = content[div_start:div_end]
        if re.search(r'<[A-Z][a-zA-Z0-9]*Svg\b', div_content):
            svg_div_match = (div_start, div_end, div_content)
            break

    if svg_div_match is None:
        return False, "no responsiveTwoColumnStyle div contains an Svg component"

    div_start, div_end, div_content = svg_div_match

    # Verify expected child structure.
    if '<section style={cardStyle}>' not in div_content:
        return False, "diagram div missing <section style={cardStyle}>"
    if '<section style={{ display: "grid", gap: "0.85rem" }}>' not in div_content:
        return False, "diagram div missing expected sidebar section"

    # Transform the div wrapper.
    new_div = div_content.replace(
        '<div style={responsiveTwoColumnStyle}>',
        '<div style={workbenchDiagramLayoutStyle}>',
        1,
    )

    # Transform first <section style={cardStyle}> inside the div.
    new_div = new_div.replace(
        '<section style={cardStyle}>',
        '<section style={{ ...cardStyle, flex: "2 1 460px" }}>',
        1,
    )

    # Transform the sidebar section inside the div.
    new_div = new_div.replace(
        '<section style={{ display: "grid", gap: "0.85rem" }}>',
        '<section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>',
        1,
    )

    content = content[:div_start] + new_div + content[div_end:]

    # Rename remaining responsiveTwoColumnStyle usages to workbenchTwoColumnStyle.
    content = content.replace("responsiveTwoColumnStyle", "workbenchTwoColumnStyle")

    # Remove local const definition (now named workbenchTwoColumnStyle after replacement).
    content = re.sub(
        r'\nconst workbenchTwoColumnStyle: CSSProperties = \{\n'
        r'\s+display: "grid",\n'
        r'\s+gridTemplateColumns: "repeat\(auto-fit, minmax\(min\(100%, 330px\), 1fr\)\)",\n'
        r'\s+gap: "1rem",\n'
        r'\};\n',
        "\n",
        content,
    )

    # Add layout import after lucide-react import if not already present.
    if '../lib/layouts' not in content:
        insert_pos = find_lucide_import_end(content)
        if insert_pos is not None:
            content = content[:insert_pos] + LAYOUT_IMPORT + "\n" + content[insert_pos:]
        else:
            return False, "could not find lucide-react import"

    if content == original:
        return False, "no changes applied"

    path.write_text(content, encoding="utf-8")
    return True, "ok"


def main() -> None:
    changed: list[Path] = []
    skipped: list[tuple[Path, str]] = []

    for path in sorted(INTERACTIVE_DIR.rglob("index.tsx")):
        ok, reason = transform_file(path)
        if ok:
            changed.append(path)
        else:
            skipped.append((path, reason))

    print(f"Changed {len(changed)} files:")
    for p in changed:
        print(f"  + {p}")

    print(f"\nSkipped {len(skipped)} files:")
    for p, reason in skipped:
        print(f"  - {p}: {reason}")


if __name__ == "__main__":
    main()
