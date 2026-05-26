# Three Skandha Synthesis Dojo

Lesson 3.1 (Module 1, Chapter 3, Lesson 1) §7 flagship component.

## Pattern
Two-tab composition (per Ch2 dojo canonical pattern):
- Tab 1 "The Matrix": 4 streams × 3 skandhas clickable grid
- Tab 2 "The Drill": 5 evaluative classification scenarios

## Data
Static data in `data.ts`:
- `MATRIX_CELLS`: 12 cells (4 streams × 3 skandhas) with corpus and note
- `DRILL_SCENARIOS`: 5 scenarios with 4 options each

## Behaviour
- Matrix cells toggle an ActiveDetail panel below the grid
- Drill presents one scenario at a time with instant feedback
- Progress dots show scenario position
- Reduced-motion respected
