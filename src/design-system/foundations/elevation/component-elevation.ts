/**
 * Component Elevation Tokens
 *
 * Semantic elevation assignments for every component category. These map to
 * the base `elevationTokens` so the product has one elevation language.
 *
 * Rule of thumb:
 * - Flat surfaces use `none`.
 * - Resting cards and widgets use `sm`.
 * - Hover/focus states and floating menus use `md`.
 * - Overlays (modal, drawer, toast) use `lg`.
 * - Maximum overlays use `xl`.
 */

import { elevationTokens, type ElevationToken } from './elevation';

const alias = (token: ElevationToken) => ({
  value: token,
  cssLight: elevationTokens.light[token],
  cssDark: elevationTokens.dark[token],
});

export const componentElevation = {
  /** Page ground is flat. Depth comes from background/surface layers. */
  pageSurface: alias('none'),

  /** Default resting card. */
  card: alias('sm'),

  /** Card hover / focus / active elevation. */
  cardHover: alias('md'),

  /** Data-dense dashboard widgets. */
  dashboardWidget: alias('sm'),

  /** Dashboard widget hover. */
  dashboardWidgetHover: alias('md'),

  /** Form container card. */
  form: alias('sm'),

  /** Input fields are flat; border provides structure. */
  input: alias('none'),

  /** Input focus state. */
  inputFocus: alias('sm'),

  /** Dropdown menus, select popovers. */
  dropdown: alias('md'),

  /** Small tooltips. */
  tooltip: alias('md'),

  /** Popover panels. */
  popover: alias('md'),

  /** Modal dialogs. */
  modal: alias('lg'),

  /** Side drawers. */
  drawer: alias('lg'),

  /** Toast and notification containers. */
  toast: alias('md'),

  /** Calendar cards and day cells container. */
  calendar: alias('sm'),

  /** Learning module content cards. */
  learningCard: alias('sm'),

  /** Learning interactive containers. */
  learningInteractive: alias('sm'),

  /** Chart container cards. */
  chart: alias('sm'),

  /** Table container card. The table itself is flat. */
  table: alias('sm'),

  /** Table row hover highlight — use a shadow only if needed, otherwise use bg.elevated. */
  tableRowHover: alias('none'),

  /** Badges and pills are flat. */
  badge: alias('none'),

  /** Buttons are flat; use border and background. */
  button: alias('none'),

  /** Button hover / active. */
  buttonHover: alias('sm'),

  /** Command palette / search overlay. */
  commandPalette: alias('xl'),

  /** Full-screen overlay backgrounds use no shadow. */
  overlay: alias('none'),
} as const;

export type ComponentElevation = typeof componentElevation;
