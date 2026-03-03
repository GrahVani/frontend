/**
 * Shared planet color classes used across dasha components and pages.
 * Format: "bg-{color}-100 text-{color}-800 border-{color}-300"
 */
export const PLANET_COLORS: Record<string, string> = {
  Sun: "bg-orange-100 text-orange-800 border-orange-300",
  Moon: "bg-slate-100 text-slate-700 border-slate-300",
  Mars: "bg-red-100 text-red-800 border-red-300",
  Mercury: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Jupiter: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Venus: "bg-pink-100 text-pink-800 border-pink-300",
  Saturn: "bg-gray-200 text-gray-800 border-gray-400",
  Rahu: "bg-purple-100 text-purple-800 border-purple-300",
  Ketu: "bg-indigo-100 text-indigo-800 border-indigo-300",
};

/**
 * Shared sign color classes based on ruling planets.
 */
export const SIGN_COLORS: Record<string, string> = {
  Aries: PLANET_COLORS.Mars,
  Scorpio: PLANET_COLORS.Mars,
  Taurus: PLANET_COLORS.Venus,
  Libra: PLANET_COLORS.Venus,
  Gemini: PLANET_COLORS.Mercury,
  Virgo: PLANET_COLORS.Mercury,
  Cancer: PLANET_COLORS.Moon,
  Leo: PLANET_COLORS.Sun,
  Sagittarius: PLANET_COLORS.Jupiter,
  Pisces: PLANET_COLORS.Jupiter,
  Capricorn: PLANET_COLORS.Saturn,
  Aquarius: PLANET_COLORS.Saturn,
};
