export interface Weekday {
  id: number;
  name: string;
  short: string;
  gulikaPortion: number;
  lordPlanet: string;
}

export interface ZodiacSign {
  id: number;
  name: string;
  sanskrit: string;
}

export const WEEKDAYS: Weekday[] = [
  { id: 0, name: "Sunday", short: "Sun", gulikaPortion: 7, lordPlanet: "Surya" },
  { id: 1, name: "Monday", short: "Mon", gulikaPortion: 6, lordPlanet: "Candra" },
  { id: 2, name: "Tuesday", short: "Tue", gulikaPortion: 5, lordPlanet: "Mangala" },
  { id: 3, name: "Wednesday", short: "Wed", gulikaPortion: 4, lordPlanet: "Budha" },
  { id: 4, name: "Thursday", short: "Thu", gulikaPortion: 3, lordPlanet: "Guru" },
  { id: 5, name: "Friday", short: "Fri", gulikaPortion: 2, lordPlanet: "Shukra" },
  { id: 6, name: "Saturday", short: "Sat", gulikaPortion: 1, lordPlanet: "Shani" },
];

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: 1, name: "Aries", sanskrit: "Mesha" },
  { id: 2, name: "Taurus", sanskrit: "Vrishabha" },
  { id: 3, name: "Gemini", sanskrit: "Mithuna" },
  { id: 4, name: "Cancer", sanskrit: "Karka" },
  { id: 5, name: "Leo", sanskrit: "Simha" },
  { id: 6, name: "Virgo", sanskrit: "Kanya" },
  { id: 7, name: "Libra", sanskrit: "Tula" },
  { id: 8, name: "Scorpio", sanskrit: "Vrishchika" },
  { id: 9, name: "Sagittarius", sanskrit: "Dhanus" },
  { id: 10, name: "Capricorn", sanskrit: "Makara" },
  { id: 11, name: "Aquarius", sanskrit: "Kumbha" },
  { id: 12, name: "Pisces", sanskrit: "Mina" },
];

export function estimateLagna(
  sunriseMinutes: number,
  sunsetMinutes: number,
  targetMinutes: number,
  sunriseLagnaIndex = 0,
): ZodiacSign {
  const dayLength = sunsetMinutes - sunriseMinutes;
  if (dayLength <= 0) return ZODIAC_SIGNS[sunriseLagnaIndex];

  const elapsed = targetMinutes - sunriseMinutes;
  const signDuration = dayLength / 6;
  const signsElapsed = Math.floor(elapsed / signDuration);
  return ZODIAC_SIGNS[(sunriseLagnaIndex + signsElapsed) % ZODIAC_SIGNS.length];
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

export function minutesToTime(totalMinutes: number): string {
  const wrapped = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(wrapped / 60);
  const minutes = wrapped % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
