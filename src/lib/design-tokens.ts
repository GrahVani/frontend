/**
 * Design Tokens — Single source of truth for Grahvani's visual language.
 *
 * These tokens mirror the CSS custom properties in globals.css.
 * Use them for:
 *   - TypeScript-level documentation/linting
 *   - Programmatic style generation (charts, dynamic themes)
 *   - Storybook / design-system tooling
 *
 * ⚠️  For component styling, prefer Tailwind utility classes
 *     (e.g. `bg-parchment`, `text-gold-primary`) which are generated
 *     from the @theme block in globals.css.
 */

// ─── Background Colors ─────────────────────────────────────────
export const backgrounds = {
  parchment: '#FAEFD8',
  softwhite: '#FEFAEA',
  surfaceModal: '#FFF9F0',
  bgHover: '#FFF4E6',
  hero: '#f4e8d8',
  heroSecondary: '#e8dcc8',
  luxuryRadial: 'radial-gradient(circle at 50% 40%, #FFF9F0 0%, #F2E6D0 40%, #E0CCAA 100%)',
} as const;

// ─── Text Colors ────────────────────────────────────────────────
export const text = {
  ink: '#3E2A1F',
  body: '#5A3E2B',
  muted: '#7A5A43',
  primary: '#2D2419',
  secondary: '#4A3F32',
  mutedRefined: '#6B5D4F',
  disabled: '#9B8D7E',
  dark: '#2b1510',
} as const;

// ─── Gold Accent Palette ────────────────────────────────────────
export const gold = {
  primary: '#C9A24D',
  soft: '#E6C97A',
  dark: '#9C7A2F',
  hover: '#D4AD5A',
  pressed: '#B8923F',
  accentGold: '#B8860B',
  accentGoldLight: '#D4A574',
  activeGlow: '#FFD27D',
} as const;

// ─── Bronze Palette ─────────────────────────────────────────────
export const bronze = {
  accent: '#8b5a2b',
  dark: '#6b4423',
  hover: '#a0683c',
} as const;

// ─── Border Colors ──────────────────────────────────────────────
export const borders = {
  antique: '#E7D6B8',
  divider: '#DCC9A6',
  headerBorder: '#D08C60',
} as const;

// ─── Status Colors ──────────────────────────────────────────────
export const status = {
  success: '#2D6A4F',
  error: '#9B2C2C',
  warning: '#B7791F',
  info: '#2B6CB0',
} as const;

// ─── Header / Sidebar Gradient ──────────────────────────────────
export const gradients = {
  header: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)',
  luxuryCard: 'linear-gradient(165deg, #6B4423 0%, #4A2F1A 50%, #3A2314 100%)',
  goldFrame: 'linear-gradient(145deg, #E6C97A 0%, #C9A24D 30%, #9C7A2F 70%, #7A5A23 100%)',
  goldBadge: 'linear-gradient(145deg, #E6C97A 0%, #C9A24D 40%, #9C7A2F 100%)',
  goldButton: 'linear-gradient(180deg, #E6C97A 0%, #C9A24D 50%, #9C7A2F 100%)',
} as const;

// ─── Shadow System ──────────────────────────────────────────────
export const shadows = {
  color: 'rgba(62, 42, 31, 0.12)',
  card: '0 2px 8px rgba(62, 42, 31, 0.12)',
  button: '0 2px 4px rgba(62, 42, 31, 0.12)',
} as const;

// ─── Typography ─────────────────────────────────────────────────
export const typography = {
  families: {
    serif: "'Spectral', 'Crimson Pro', 'Lora', Georgia, serif",
    sans: "'Inter', 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  sizes: {
    xl: '1.25rem',   // 20px — App title
    lg: '1.125rem',  // 18px — Section headers
    md: '0.9375rem', // 15px — Card titles
    base: '0.875rem', // 14px — Table body
    sm: '0.8125rem', // 13px — Table headers
    xs: '0.75rem',   // 12px — Metadata
    '2xs': '0.6875rem', // 11px — Chart annotations
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.2,
    compact: 1.3,
    normal: 1.4,
    relaxed: 1.5,
  },
  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.01em',
    wider: '0.05em',
  },
} as const;

// ─── Texture Paths (self-hosted) ────────────────────────────────
export const textures = {
  agedPaper: '/textures/aged-paper.png',
  creamPaper: '/textures/cream-paper.png',
  parchment: '/textures/parchment.png',
  arabesque: '/textures/arabesque.png',
  stardust: '/textures/stardust.png',
} as const;

// ─── Complete Token Map (for tooling) ───────────────────────────
export const tokens = {
  backgrounds,
  text,
  gold,
  bronze,
  borders,
  status,
  gradients,
  shadows,
  typography,
  textures,
} as const;

export default tokens;
