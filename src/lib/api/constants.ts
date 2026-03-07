// Chart and Dasha metadata constants

// Chart metadata for display
export const CHART_METADATA: Record<string, { name: string; desc: string; category: string }> = {
    'D1': { name: 'Rashi', desc: 'Physical Body & General Destiny', category: 'divisional' },
    'D2': { name: 'Hora', desc: 'Wealth & Financial Prospects', category: 'divisional' },
    'D3': { name: 'Drekkana', desc: 'Siblings & Courage', category: 'divisional' },
    'D4': { name: 'Chaturthamsha', desc: 'Fortune & Property', category: 'divisional' },
    'D7': { name: 'Saptamsha', desc: 'Children & Progeny', category: 'divisional' },
    'D9': { name: 'Navamsha', desc: 'Marriage & Spiritual Core', category: 'divisional' },
    'D10': { name: 'Dashamsha', desc: 'Career & Profession', category: 'divisional' },
    'D12': { name: 'Dwadashamsha', desc: 'Parents & Ancestry', category: 'divisional' },
    'D16': { name: 'Shodashamsha', desc: 'Vehicles & Comforts', category: 'divisional' },
    'D20': { name: 'Vimshamsha', desc: 'Spiritual Progress', category: 'divisional' },
    'D24': { name: 'Chaturvimshamsha', desc: 'Education & Learning', category: 'divisional' },
    'D27': { name: 'Saptavimshamsha', desc: 'Strength & Vitality', category: 'divisional' },
    'D30': { name: 'Trimshamsha', desc: 'Misfortunes & Evil', category: 'divisional' },
    'D40': { name: 'Khavedamsha', desc: 'Auspicious Effects', category: 'divisional' },
    'D45': { name: 'Akshavedamsha', desc: 'General Indications', category: 'divisional' },
    'D60': { name: 'Shashtiamsha', desc: 'Past Karma & Results', category: 'divisional' },
    'moon': { name: 'Moon Chart', desc: 'Emotional & Mental State', category: 'special' },
    'sun': { name: 'Sun Chart', desc: 'Life Purpose & Father', category: 'special' },
    'sudarshan': { name: 'Sudarshan Chakra', desc: 'Triple View Analysis', category: 'special' },
    'transit': { name: 'Transit', desc: 'Current Planetary Positions', category: 'special' },
    'arudha': { name: 'Arudha Lagna', desc: 'Worldly Image & Perception', category: 'lagna' },
    'bhava': { name: 'Bhava Lagna', desc: 'House Strengths', category: 'lagna' },
    'hora': { name: 'Hora Lagna', desc: 'Wealth Indicator', category: 'lagna' },
    'sripathi': { name: 'Sripathi Bhava', desc: 'Unequal House System', category: 'lagna' },
    'kp_bhava': { name: 'KP Bhava', desc: 'KP System Houses', category: 'lagna' },
    'equal_bhava': { name: 'Equal Bhava', desc: 'Equal House System', category: 'lagna' },
    'karkamsha_d1': { name: 'Karkamsha D1', desc: 'Atmakaraka in Navamsha to D1', category: 'lagna' },
    'karkamsha_d9': { name: 'Karkamsha D9', desc: 'Atmakaraka in Navamsha', category: 'lagna' },
    'shadbala': { name: 'Shadbala', desc: 'Six-fold Planetary Strength Analysis', category: 'special' },
    'mandi': { name: 'Mandi', desc: 'Son of Saturn - Karmic Obstacles', category: 'lagna' },
    'gulika': { name: 'Gulika', desc: 'Son of Saturn - Instant Karma', category: 'lagna' },
};

// Dasha system metadata for display
export const DASHA_TYPES: Record<string, { name: string; years: number; desc: string; category: 'primary' | 'conditional' }> = {
    vimshottari: {
        name: 'Vimshottari',
        years: 120,
        desc: 'Universal Moon-nakshatra based dasha system',
        category: 'primary'
    },
    tribhagi: {
        name: 'Tribhagi',
        years: 40,
        desc: 'One-third portions of Vimshottari periods',
        category: 'conditional'
    },
    shodashottari: {
        name: 'Shodashottari',
        years: 116,
        desc: 'For Venus in 9th + Lagna in hora of Venus',
        category: 'conditional'
    },
    dwadashottari: {
        name: 'Dwadashottari',
        years: 112,
        desc: 'Venus in Lagna + Moon in Venusian nakshatra',
        category: 'conditional'
    },
    panchottari: {
        name: 'Panchottari',
        years: 105,
        desc: 'Cancer Lagna with Dhanishtha nakshatra',
        category: 'conditional'
    },
    chaturshitisama: {
        name: 'Chaturshitisama',
        years: 84,
        desc: '10th lord posited in 10th house',
        category: 'conditional'
    },
    satabdika: {
        name: 'Satabdika',
        years: 100,
        desc: 'Lagna in Vargottama position',
        category: 'conditional'
    },
    dwisaptati: {
        name: 'Dwisaptati Sama',
        years: 72,
        desc: 'Lagna lord in 7th or 7th lord in Lagna',
        category: 'conditional'
    },
    shastihayani: {
        name: 'Shastihayani',
        years: 60,
        desc: 'Sun posited in the Lagna',
        category: 'conditional'
    },
    shattrimshatsama: {
        name: 'Shattrimshatsama',
        years: 36,
        desc: 'Born in daytime with Moon in Lagna',
        category: 'conditional'
    },
    chara: {
        name: 'Chara (Jaimini)',
        years: 0,
        desc: 'Sign-based Jaimini dasha system',
        category: 'conditional'
    },
};
