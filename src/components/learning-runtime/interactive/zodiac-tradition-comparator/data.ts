export interface ZodiacSign {
  id: string;
  name: string;
  sanskritName: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  description: string;
}

export interface ComponentData {
  signs: ZodiacSign[];
  milestones: { year: number; event: string; ayanamsaDegrees: number }[];
  content: {
    tropicalPhilosophy: string;
    siderealPhilosophy: string;
    ayanamsaExplanation: string;
  };
}

export const zodiacSigns: ZodiacSign[] = [
  { id: 'aries', name: 'Aries', sanskritName: 'Mesha', element: 'Fire', modality: 'Cardinal', description: 'The pioneer and initiator. In the Tropical system, it rigidly marks the Spring Equinox. In the Sidereal system, it is permanently aligned with the Ashwini nakshatra in the sky.' },
  { id: 'taurus', name: 'Taurus', sanskritName: 'Vrishabha', element: 'Earth', modality: 'Fixed', description: 'Grounded and enduring. Represents the stabilization of the initial burst of energy.' },
  { id: 'gemini', name: 'Gemini', sanskritName: 'Mithuna', element: 'Air', modality: 'Mutable', description: 'Communicative and adaptable. The duality and exchange of ideas.' },
  { id: 'cancer', name: 'Cancer', sanskritName: 'Karka', element: 'Water', modality: 'Cardinal', description: 'Nurturing and intuitive. In Tropical astrology, this marks the Summer Solstice.' },
  { id: 'leo', name: 'Leo', sanskritName: 'Simha', element: 'Fire', modality: 'Fixed', description: 'Radiant and expressive. Ruled by the Sun, representing the peak of self-expression.' },
  { id: 'virgo', name: 'Virgo', sanskritName: 'Kanya', element: 'Earth', modality: 'Mutable', description: 'Analytical and practical. The meticulous organization of details.' },
  { id: 'libra', name: 'Libra', sanskritName: 'Tula', element: 'Air', modality: 'Cardinal', description: 'Balanced and harmonious. In Tropical astrology, this marks the Autumnal Equinox.' },
  { id: 'scorpio', name: 'Scorpio', sanskritName: 'Vrishchika', element: 'Water', modality: 'Fixed', description: 'Intense and transformative. The deep, penetrating emotional waters.' },
  { id: 'sagittarius', name: 'Sagittarius', sanskritName: 'Dhanus', element: 'Fire', modality: 'Mutable', description: 'Adventurous and philosophical. The quest for higher meaning and truth.' },
  { id: 'capricorn', name: 'Capricorn', sanskritName: 'Makara', element: 'Earth', modality: 'Cardinal', description: 'Disciplined and ambitious. In Tropical astrology, this marks the Winter Solstice.' },
  { id: 'aquarius', name: 'Aquarius', sanskritName: 'Kumbha', element: 'Air', modality: 'Fixed', description: 'Innovative and unconventional. The collective consciousness and future vision.' },
  { id: 'pisces', name: 'Pisces', sanskritName: 'Meena', element: 'Water', modality: 'Mutable', description: 'Empathetic and mystical. The dissolution into the universal ocean.' },
];

export const comparatorData: ComponentData = {
  signs: zodiacSigns,
  milestones: [
    { year: 285, event: 'Zero Ayanamsa', ayanamsaDegrees: 0 },
    { year: 2024, event: 'Present Day', ayanamsaDegrees: 24.1 },
  ],
  content: {
    tropicalPhilosophy: 'The Tropical (Sayana) zodiac is intimately tied to the Earth\'s seasons. It begins precisely when the Sun crosses the celestial equator at the Vernal Equinox, marking 0° Aries. This system focuses on the psychological unfolding of life relative to the solar cycles we experience on Earth.',
    siderealPhilosophy: 'The Sidereal (Nirayana) zodiac is tied to the fixed stars in the cosmos. It anchors 0° Aries to a specific point in the background constellations (like opposite to the star Spica). It is viewed as reflecting cosmic, eternal truths unswayed by the shifting seasons of Earth.',
    ayanamsaExplanation: 'Ayanamsa is the longitudinal difference in degrees between the Tropical (seasonal) and Sidereal (stellar) zodiacs. Because of the Earth\'s "axial wobble" (precession of the equinoxes), the Tropical seasons slowly drift backwards against the fixed stars at a rate of 1° every 72 years.'
  }
};
