/**
 * Planet metadata & interpretations for Dasha period analysis.
 */

interface PlanetIntelEntry {
    nature: string;
    themes: string[];
    advice: string;
    tip: string;
}

export const PLANET_INTEL: Record<string, PlanetIntelEntry> = {
    Sun: {
        nature: 'Malefic (Natural)',
        themes: ['Authority', 'Vitality', 'Father', 'Government'],
        advice: 'Period of self-realization and recognition. Focus on discipline and leadership.',
        tip: 'Best period for self-reflection and starting new ventures. Avoid excessive ego.'
    },
    Moon: {
        nature: 'Benefic (Natural)',
        themes: ['Mind', 'Emotions', 'Mother', 'Public Affairs'],
        advice: 'Focus on mental health and home peace. Good for emotional growth.',
        tip: 'Excellent for traveling and connecting with the public. Maintain emotional balance.'
    },
    Mars: {
        nature: 'Malefic (Natural)',
        themes: ['Energy', 'Siblings', 'Property', 'Courage'],
        advice: 'High energy period. Watch for accidents or conflicts. Channel energy into property.',
        tip: 'Good for sports and competitive activities. Stay calm to avoid unnecessary fights.'
    },
    Mercury: {
        nature: 'Neutral',
        themes: ['Business', 'Speech', 'Logic', 'Intelligence'],
        advice: 'Intellectual growth favors education and business. Communication is key.',
        tip: 'Best for learning new skills and network building. Verify details before signing.'
    },
    Jupiter: {
        nature: 'Benefic (Natural)',
        themes: ['Wisdom', 'Growth', 'Wealth', 'Dharma'],
        advice: 'Auspicious period for growth and wisdom. Spiritual progress is likely.',
        tip: 'Best period for education, marriage, and spiritual growth. Wear yellow sapphire for enhanced results.'
    },
    Venus: {
        nature: 'Benefic (Natural)',
        themes: ['Luxury', 'Arts', 'Love', 'Vehicles'],
        advice: 'Period of comfort and material prosperity. Relationships flourish.',
        tip: 'Focus on harmony in partnerships. Excellent for creative hobbies and luxury purchases.'
    },
    Saturn: {
        nature: 'Malefic (Natural)',
        themes: ['Karma', 'Discipline', 'Delay', 'Service'],
        advice: 'Period of hard work and discipline. Long-term results through patience.',
        tip: 'Stay consistent and disciplined. Blue sapphire may help if Saturn is well-placed.'
    },
    Rahu: {
        nature: 'Malefic (Node)',
        themes: ['Foreign', 'Obsession', 'Illusion', 'Technology'],
        advice: 'Period of materialistic pursuits and foreign connections. Watch for deception.',
        tip: 'Good for technical fields. Avoid shortcuts and unconventional obsessions.'
    },
    Ketu: {
        nature: 'Malefic (Node)',
        themes: ['Spiritual', 'Detachment', 'Moksha', 'Intuition'],
        advice: 'Spiritual detachment and potential for losses. Focus on inner peace.',
        tip: 'Great for meditation and occult studies. Let go of past baggage.'
    },
};
