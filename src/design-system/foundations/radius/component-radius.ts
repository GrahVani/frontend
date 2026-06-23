/**
 * Component Radius Tokens
 *
 * Semantic radius assignments for every component category. These map to the
 * base `radiusScale` so the product has one radius language.
 */

import { radiusScale, type RadiusScaleToken } from './radius';

const alias = (token: RadiusScaleToken) => ({
  value: token,
  px: token === 'full' ? 9999 : Math.round(parseFloat(radiusScale[token]) * 16),
});

export const componentRadius = {
  /** Primary buttons, secondary buttons, icon buttons. */
  button: alias('md'),

  /** Text inputs, textareas, search fields. */
  input: alias('md'),

  /** Select dropdowns and comboboxes. */
  select: alias('md'),

  /** Dropdown menus, popover panels, context menus. */
  dropdown: alias('lg'),

  /** Default card radius. */
  card: alias('lg'),

  /** Data-dense dashboard widget cards. */
  dashboardWidget: alias('md'),

  /** Table containers, table rows, table cells. */
  table: alias('md'),

  /** Modal dialogs and overlay panels. */
  modal: alias('xl'),

  /** Side drawers and slide-out panels. */
  drawer: alias('xl'),

  /** Status badges, labels, tags. */
  badge: alias('full'),

  /** Tooltips and small floating hints. */
  tooltip: alias('md'),

  /** Chart containers and chart cards. */
  chart: alias('md'),

  /** Learning module content cards and lesson cards. */
  learningCard: alias('lg'),

  /** Learning interactives, quizzes, simulators. */
  learningInteractive: alias('md'),

  /** User avatars and profile pictures. */
  avatar: alias('full'),

  /** Pills, filter chips, segmented controls. */
  pill: alias('full'),

  /** Accordion containers and expand/collapse panels. */
  accordion: alias('lg'),

  /** Toast and notification containers. */
  toast: alias('lg'),

  /** Calendar day cells and calendar cards. */
  calendar: alias('md'),

  /** Image containers, media cards. */
  image: alias('lg'),
} as const;

export type ComponentRadius = typeof componentRadius;
