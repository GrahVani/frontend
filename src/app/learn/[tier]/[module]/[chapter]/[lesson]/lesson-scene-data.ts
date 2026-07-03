/**
 * Lesson-specific scene metadata.
 *
 * This file is intentionally free of React/component imports so it can be
 * imported by both the server page (for reflection prompts) and the client
 * scene component (for scene wiring). Keeping it lightweight avoids bloating
 * the server bundle with heavy interactive components.
 */

export function getReflectionPrompts(slug: string): string[] {
  switch (slug) {
    case "jyotisha-as-vedanga":
      return [
        "Which of the six Vedāṅgas' body-part role surprises you most, and why?",
        "If Jyotiṣa is the eye, what does that imply about its function relative to the other limbs?",
        "Try restating in your own words: why does the Veda need 'limbs' at all?",
      ];
    case "the-six-vedangas-and-their-relationship":
      return [
        "Which cluster — recitation, meaning, or action — surprised you most as the place Jyotiṣa actually belongs?",
        "If you had to drop one of the six Vedāṅgas from a Jyotiṣa learner's training, which would you cut and what specifically would break?",
        "Try restating in your own words: what does sāṅga study mean, and why does it matter for a Jyotiṣa specialist today?",
      ];
    case "modern-founders-krishnamurti-and-joshi":
      return [
        "Of the 11 distinctive contributions you just saw (5 KP + 6 Lal Kitab), which ORIGINATION strikes you as the boldest doctrinal move — the one least derivable from anything in the prior classical landscape — and what does it tell you about what the modern-primary doctrine actually authorises?",
        "Where do YOU sit on the three modern-primary criteria (origination + practitioner lineage + empirical results)? Are there other modern Vedic-astrology authors you'd nominate as candidates — and which criterion do they meet (or fail)?",
        "Try restating the four-stream landscape in your own words: how does \"complementary, not competing\" change what you'll do when you next read a single-stream practitioner critiquing another stream?",
      ];
    case "jaimini-and-the-second-tradition":
      return [
        "Of the five distinctive Jaiminī doctrines (Cara Rāśi Daśās, Ārūḍha Lagna, rāśi-aspects, cara kārakas, Jaiminī yogas), which one's GENUINELY UNIQUE status surprised you most — and what does that imply for what you'd lose if Jaiminī were treated as a sub-school of Parāśari?",
        "Where do YOU sit on the same-Jaiminī identity question (Jyotiṣa Jaiminī = Mīmāṁsā Jaiminī or two different people)? When you next cite the Jaiminī Sūtra, what's the honest framing you'll use?",
        "Try restating in your own words: what is the difference between PARALLEL traditions and SUBORDINATE traditions — and why does parallel-not-subordinate change how you read every classical Jyotiṣa citation?",
      ];
    case "medieval-codifiers-kalyanavarma-mantresvara":
      return [
        "Of the four medieval codifiers, whose distinctive contribution (yoga catalogue / practitioner pedagogy / comprehensive synthesis / praśna foundation) feels most operationally useful to you — and why?",
        "Where do YOU sit in the codifier vs originator framing? When you cite a classical author going forward, will you treat their role as transmitting, refining, or originating? What changes?",
        "Try restating the three-layer lineage in your own words: foundational ṛṣi-core → systematic codifier → medieval codifiers. What does each layer contribute that the others don't?",
      ];
    case "varahamihira-the-systematic-codifier":
      return [
        "Of Varāhamihira's three texts (Bṛhat Jātaka, Bṛhat Saṁhitā, Pañcasiddhāntikā), which one's existence surprised you most — and what does it tell you about the breadth of classical Jyotiṣa scholarship?",
        "When you next encounter a date claim for a classical Jyotiṣa author (e.g., \"Kalyāṇavarmā ~800 CE\"), what's the FIRST question you'll ask about how that date was arrived at?",
        "Try restating the both-anchors framework in your own words: how can Parāśara AND Varāhamihira both be authoritative without one displacing the other?",
      ];
    case "parashara-the-foundational-rishi":
      return [
        "Of the ten BPHS prakaraṇa-divisions, which one's PURPOSE surprised you most — and what does it tell you about BPHS's encyclopaedic ambition?",
        "How will you change the way you cite BPHS in your own writing now that you've seen the recension layering? What will you say differently?",
        "Try restating in your own words: how can BPHS be BOTH foundational-authoritative AND recensionally-medieval at the same time — without contradiction?",
      ];
    case "the-historical-timeline-of-jyotisha":
      return [
        "Of the twelve authors on the timeline, which one's DATING DIVERGENCE between traditional and academic surprised you most — and what does it imply about how you should hear classical citations going forward?",
        "Of the four citation-discipline moves (source / date / recension / translator), which one do you think you'll find HARDEST to apply consistently — and why?",
        "Try restating in your own words: why does the MODERN PRIMARY carve-out matter — what would be lost if KP and Lal Kitab were lumped in with 'modern derivative'?",
      ];
    case "philosophy-of-karma-and-prediction":
      return [
        "Of the four karma types, which one's MAPPING onto Jyotiṣa's predictive scope surprised you most — and what does that imply about how you should hear classical chart-readings?",
        "Where do YOU sit between deterministic prediction (\"the chart tells you what will happen\") and full agency (\"nothing is given\")? What does the four-fold framework do to that intuition?",
        "Try restating in your own words: why is indication-with-confidence-tier framing more honest than deterministic prediction — given what the chart can and cannot read?",
      ];
    case "tithi-as-12-degrees-of-sun-moon-angle":
      return [
        "At what elongation does the transition from śukla to kṛṣṇa pakṣa occur, and why is it astronomically significant?",
        "If a birth occurs at 16:00 on a day whose pañcāṅga-tithi is Śukla Caturthī but whose tithi-end-time was 14:42, what tithi do you record in the natal chart — and why?",
        "Try restating in your own words: why must true (spaṣṭa) longitudes be used instead of mean longitudes for tithi computation?",
      ];
    case "the-15-shukla-tithis":
      return [
        "Which śukla tithi's deity association surprised you most — and what does it tell you about how tithi-deity correspondences encode cultural significance?",
        "Why do you think Pratipadā and Pūrṇimā have special names while tithis 2–14 follow a numeral pattern? What does this tell you about how the tradition frames beginnings and endings?",
        "Try reciting the 15 śukla tithis in order from memory — which three give you the most trouble, and why?",
      ];
    case "where-grahvani-sits-in-the-skandha-map":
      return [
        "Which cell of the 4 × 3 × 7 coverage matrix surprised you most in how the curriculum distributed its depth — and what does that tell you about the curriculum's operational priorities?",
        "Of the seven categories of intentional non-coverage, which one do you think will be most relevant to YOUR learning path — and what's your plan for engaging the cross-references?",
        "Try restating in your own words: why is 'modern-teaching-synthesis' a MORE honest self-positioning than 'modern-primary' would be for this curriculum?",
      ];
    case "the-four-yugas-and-the-mahayuga":
      return [
        "The 4:3:2:1 proportional structure and the absolute durations (1.728M / 1.296M / 0.864M / 0.432M years) are two ways of describing the same thing. Which representation do you find more memorable, and why?",
        "The dharma-erosion doctrine is a cosmological-philosophical framework, not a sociological claim. What is the practical difference this framing makes for how you read classical texts?",
        "Try restating in your own words: why does the yuga-cycle need saṁdhyā + saṁdhyāṁśa twilight regions? What doctrinal awkwardness would arise without them?",
      ];
    case "manvantara-and-kalpa-the-cosmic-scale":
      return [
        "The Manvantara (~308M years) and Kalpa (~4.32B years) are scales far beyond human intuition. What mental anchor do you use to make these numbers meaningful?",
        "Why does the Kalpa structure need 14 Manvantaras plus 15 saṁdhyā periods rather than a simple multiple? What doctrinal function does the saṁdhyā serve at this scale?",
        "Try restating in your own words: what is the difference between a Manvantara and a Kalpa, and why does the distinction matter for cosmological literacy?",
      ];
    case "where-are-we-now":
      return [
        "The traditional, Yukteshwar, and academic-Indology positions on present-epoch dating all operate at different epistemological registers. Which register do you find most challenging to hold simultaneously with the others?",
        "The saṅkalpa formula requires the traditional placement. How would you honestly respond to a client who asks why you use the traditional framework rather than Yukteshwar's?",
        "Try restating in your own words: what is the difference between 'this position is operationally normative in context X' and 'this position is universally true'?",
      ];
    case "does-yuga-position-affect-your-chart":
      return [
        "The diagnostic question — 'does this computation require cosmic-time-locator input?' — cleanly separates yuga-dependent from yuga-independent calculations. Which category surprised you more in how large it is?",
        "Why is 'cultural-cosmological context' operationally distinct from 'computational input'? When might a practitioner confuse the two in client communication?",
        "Try restating the honest-weighting framework in your own words: what is the third path between maximalist over-application and minimalist under-application?",
      ];
    case "the-four-day-types":
      return [
        "The four day-types are defined by four different reference-events (sunrise, star-transit, Sun-Moon angle, sign-ingress). Which reference-event do you find most counterintuitive, and why?",
        "A client says 'I was born on March 15, 1985 at 2 AM' — which day-type is implicit in their statement, and which day-type would a pañcāṅga use to determine their vāra?",
        "Try restating in your own words: why does the sidereal day (~23h 56m) being shorter than the sāvana day (~24h) mean that using sāvana-day mechanics for sidereal-position computation accumulates ~1° error per year?",
      ];
    case "savana-day-and-civil-time":
      return [
        "The sunrise-hour-angle formula cos H = −tan(φ) × tan(δ) is a spherical-trigonometry result. What is the physical meaning of each variable, and why does the minus sign appear?",
        "At the equator, sunrise is nearly constant year-round. At high latitudes, the formula breaks down. What does this tell you about the formula's domain of applicability?",
        "Try restating in your own words: why is sunrise (not sunset, noon, or midnight) the traditional Vedic civil-day reference?",
      ];
    case "sidereal-day-and-its-uses":
      return [
        "The ~3m 56s differential between sāvana and sidereal day seems tiny. Why does it accumulate to ~1° per year — and why is that operationally consequential for nakṣatra-timing?",
        "Local Sidereal Time (LST) converts civil time to star-time. When would you need LST in actual chart-computation work?",
        "Try restating in your own words: what is the difference between 'the Earth rotates 360° in 24 hours' (sāvana intuition) and 'the Earth rotates 360° in 23h 56m 4s' (sidereal fact)?",
      ];
    case "the-tithi-as-lunar-day":
      return [
        "The tithi formula divides Sun-Moon elongation by 12°. Why 12° specifically — what makes that the natural unit for lunar-day division?",
        "A tithi can last 23 hours or 25 hours depending on the Moon's orbital speed. What does this variability mean for pañcāṅga practitioners who need to publish a calendar months in advance?",
        "Try restating in your own words: what is the difference between 'the tithi prevailing at sunrise' (pañcāṅga convention) and 'the astronomical tithi at the birth moment' (natal computation)?",
      ];
    case "solar-day-and-sankranti":
      return [
        "The Uttarāyaṇa-Dakṣiṇāyana axis divides the year into 'auspicious' and 'contemplative' halves. Is this a cosmological-philosophical framework or a sociological claim about human behaviour — and what is the practical difference?",
        "Makara Saṅkrānti is ~14 January in sidereal terms but ~21 December in tropical terms. A Western-astrology client asks why Makara Saṅkrānti is not on the winter solstice. What is your honest answer?",
        "Try restating in your own words: why does the saṅkrānti-date drift forward at ~1 day per 72 years, and what does this mean for interpreting classical texts that mention saṅkrānti dates?",
      ];
    case "jyotisha-vs-western-astrology-vs-pop-astrology":
      return [
        "Of the six dimensions, which one was the biggest surprise — where did you realise you'd been carrying an incorrect mental model about one of the traditions?",
        "When you encounter \"astrology\" in casual conversation tomorrow, what's the FIRST clarifying question you'll ask before engaging substantively?",
        "Where do you think classical Hellenistic Western astrology actually has MORE in common with Vedic Jyotiṣa than modern psychological Western does? What does that tell you about the lineage?",
      ];
    case "vikrama-and-shaka-the-major-samvats":
      return [
        "The 135-year offset is simple arithmetic (57 + 78), but year-start boundaries complicate it. Where do you think you'll make the most mistakes in real client work — the arithmetic or the boundaries?",
        "A north-India client mentions their birth year as 'Vikrama 2050' and a south-India client as 'Śaka 1915'. Without computing, which client is older — and what does this tell you about intuitive date sense across saṁvats?",
        "Try restating in your own words: why does the modern Indian government use a modified Śaka year-start (22 March) when the classical tradition uses Caitra Śukla Pratipad? What is lost and what is gained by each convention?",
      ];
    case "kollam-era-and-regional-calendars":
      return [
        "Of the eight calendar systems in the explorer, which one's year-start date surprised you most — and what does that tell you about your own calendar intuition?",
        "A Kerala client and a Tamil client both celebrate their New Year in April. But only one actually does. Which one — and why does the other celebrate in August?",
        "Try restating in your own words: why is Kollam's Siṁha Saṅkrānti year-start not a 'mistake' or 'delay' but a coherent regional convention with its own historical logic?",
      ];
    case "converting-dates-systematically":
      return [
        "Module 02 closes with this lesson. Of the five chapters' frameworks, which one do you feel MOST confident applying — and which one needs review before Module 03?",
        "A client gives you a birth date as 'Kollam 1195, Kanni 12' and asks for their Gregorian birth date. Walk through the complete conversion step by step — where is the highest risk of error?",
        "Try restating in your own words: what is the difference between 'I know the conversion formula' and 'I can reliably convert dates under pressure'? What practice bridge is still missing?",
      ];
    default:
      return [];
  }
}
