export { backgroundTokens, getBackground } from './background';
export type { BackgroundTheme, BackgroundToken } from './background';

export { surfaceTokens, getSurface } from './surface';
export type { SurfaceTheme, SurfaceToken } from './surface';

export { borderTokens, getBorder } from './border';
export type { BorderTheme, BorderToken } from './border';

export {
  textTokens,
  getText,
  getTextForSurface,
  surfaceToTextRole,
  approvedTextCombinations,
  forbiddenTextCombinations,
  textContrastReference,
  getTextContrastStatus,
} from './text';
export type {
  TextTheme,
  TextToken,
  TextRole,
  BackgroundOrSurface,
} from './text';
