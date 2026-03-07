/**
 * Dasha system metadata — constants extracted from the Dashas page.
 */

export const DASHA_LEVELS = [
    { id: 'mahadasha', name: 'Mahadasha', short: 'Maha' },
    { id: 'antardasha', name: 'Antardasha', short: 'Antar' },
    { id: 'pratyantardasha', name: 'Pratyantardasha', short: 'Pratyantar' },
    { id: 'sookshmadasha', name: 'Sookshma', short: 'Sookshma' },
    { id: 'pranadasha', name: 'Prana', short: 'Prana' },
] as const;

export const DASHA_SYSTEMS = [
    { id: 'vimshottari', name: 'Vimshottari', years: 120, category: 'primary', applicable: true, desc: 'Universal Moon-nakshatra based' },
    { id: 'tribhagi', name: 'Tribhagi', years: 80, category: 'conditional', applicable: true, desc: 'One-third of Vimshottari' },
    { id: 'tribhagi-40', name: 'Tribhagi (40 Years)', years: 40, category: 'conditional', applicable: true, desc: '40 Year Cycle Variation' },
    { id: 'ashtottari', name: 'Ashtottari', years: 108, category: 'conditional', applicable: true, desc: 'Rahu & Venus Special Conditions' },
    { id: 'shodashottari', name: 'Shodashottari', years: 116, category: 'conditional', applicable: true, desc: 'Venus in 9th + Lagna hora' },
    { id: 'dwadashottari', name: 'Dwadashottari', years: 112, category: 'conditional', applicable: true, desc: 'Venus in Lagna' },
    { id: 'panchottari', name: 'Panchottari', years: 105, category: 'conditional', applicable: true, desc: 'Cancer Lagna + Dhanishtha' },
    { id: 'chaturshitisama', name: 'Chaturshitisama', years: 84, category: 'conditional', applicable: false, desc: '10th lord in 10th' },
    { id: 'satabdika', name: 'Satabdika', years: 100, category: 'conditional', applicable: true, desc: 'Vargottama Lagna' },
    { id: 'dwisaptati', name: 'Dwisaptati Sama', years: 72, category: 'conditional', applicable: true, desc: 'Lagna lord in 7th' },
    { id: 'shastihayani', name: 'Shastihayani', years: 60, category: 'conditional', applicable: false, desc: 'Sun in Lagna' },
    { id: 'shattrimshatsama', name: 'Shattrimshatsama', years: 36, category: 'conditional', applicable: false, desc: 'Daytime + Moon in Lagna' },
    { id: 'chara', name: 'Chara (Jaimini)', years: 0, category: 'jaimini', applicable: true, desc: 'Sign-based system' },
] as const;
