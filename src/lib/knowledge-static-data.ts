// Auto-generated from knowledge-service seed data (217 entries)
// This enables tooltips to work without the knowledge-service backend.

import type { KnowledgeEntry } from "@/types/knowledge.types";

type StaticEntry = Omit<KnowledgeEntry, "id" | "createdAt" | "updatedAt" | "sortOrder">;

const ENTRIES: StaticEntry[] = [
  {
    "termKey": "tithi",
    "domain": "vedic",
    "category": "panchanga",
    "title": "Tithi (तिथि)",
    "sanskrit": "तिथि",
    "summary": "A Tithi is a lunar day — one of 30 phases in a lunar month, determined by the angular distance between the Sun and Moon.",
    "description": "A Tithi represents the time it takes for the Moon to gain 12° over the Sun in ecliptic longitude. Unlike solar days which are fixed at ~24 hours, tithis vary in length from about 19 to 26 hours because the Moon's orbital speed is not constant.\n\nThere are 30 tithis in a complete lunar month (Shukla Paksha 1-15, Krishna Paksha 1-15). Each tithi is ruled by a specific deity and has inherent qualities — some are auspicious (Shubha), some inauspicious (Ashubha), and some mixed.\n\nThe five special tithis called **Pancha Parva** (Purnima, Amavasya, Ashtami, Ekadashi, and Chaturdashi) hold extraordinary spiritual and religious significance. Ekadashi is considered the most auspicious for spiritual practices, while Amavasya (new moon) is traditionally avoided for new beginnings.\n\nTithis are the single most important factor in Muhurta (electional astrology) — an auspicious tithi can uplift an otherwise mediocre muhurta, while an inauspicious tithi can undermine even a well-selected time.",
    "howToRead": "Check which tithi is running at the time of birth or the proposed event. Shukla Paksha tithis (waxing moon, 1-15) are generally more favorable for new beginnings. Krishna Paksha tithis (waning moon) favor completion, ending, and spiritual practices.",
    "significance": "Tithi is the first and foremost limb of the Panchanga. In Vedic tradition, virtually all religious observances (vratas, festivals, ceremonies) are tied to specific tithis rather than solar dates. A well-chosen tithi is non-negotiable in Muhurta selection.",
    "examples": [
      {
        "title": "Shukla Chaturthi",
        "content": "The 4th tithi of the bright half — sacred to Lord Ganesha. Ideal for beginning new ventures after offering Ganesha puja."
      },
      {
        "title": "Krishna Ashtami",
        "content": "The 8th tithi of the dark half — associated with Lord Krishna's birth (Janmashtami). A Rikta tithi, generally avoided for material beginnings."
      }
    ],
    "relatedTerms": [
      "nakshatra",
      "karana",
      "yoga_panchanga",
      "vara",
      "paksha"
    ],
    "tags": [
      "panchanga",
      "lunar",
      "timing",
      "muhurta"
    ]
  },
  {
    "termKey": "nakshatra",
    "domain": "vedic",
    "category": "panchanga",
    "title": "Nakshatra (नक्षत्र)",
    "sanskrit": "नक्षत्र",
    "summary": "Nakshatras are 27 lunar mansions — star clusters along the Moon's path that form the backbone of Vedic astrology's predictive framework.",
    "description": "The zodiac is divided into 27 equal segments of 13°20' each, called Nakshatras (literally \"that which does not decay\"). Each nakshatra is associated with a specific star or star cluster, a ruling deity, a ruling planet, a symbol, and distinctive qualities.\n\nWhile the 12 rashis (signs) provide broad characteristics, nakshatras offer far more precise and nuanced personality analysis. Two people born under the same rashi but different nakshatras can have markedly different temperaments, life patterns, and destinies.\n\nEach nakshatra has 4 padas (quarters) of 3°20', totaling 108 padas across the zodiac — a sacred number in Vedic tradition. The birth nakshatra (Janma Nakshatra) — the nakshatra occupied by the Moon at birth — is considered the most defining astrological indicator in a person's chart.\n\nThe Vimshottari Dasha system, the most widely used predictive timing tool, is entirely based on the birth nakshatra. The ruling planet of the birth nakshatra becomes the first Mahadasha lord, setting the entire life timeline.",
    "howToRead": "Identify the Moon's nakshatra at birth — this is the Janma Nakshatra. Note its ruling planet (dasha starting point), deity (spiritual theme), symbol (life metaphor), and gana (Deva/Manushya/Rakshasa temperament). For muhurta, check the nakshatra running at the proposed time.",
    "significance": "Nakshatras are arguably the most distinctive feature of Vedic astrology versus Western astrology. They provide the foundation for the Dasha system, compatibility matching (Ashta Koota), naming conventions (Namakshar), and muhurta selection.",
    "examples": [
      {
        "title": "Ashwini Nakshatra",
        "content": "Ruled by Ketu, deity Ashwini Kumaras (divine physicians). Symbol: Horse's head. Qualities: Speed, healing, pioneering. People born here are natural healers, fast-moving, and initiators."
      },
      {
        "title": "Rohini Nakshatra",
        "content": "Ruled by Moon, deity Brahma. Symbol: Ox cart. Krishna's birth nakshatra. Known for beauty, fertility, material abundance, and creative arts."
      }
    ],
    "relatedTerms": [
      "tithi",
      "rashi",
      "vimshottari_dasha",
      "pada",
      "namakshar",
      "yoni",
      "gana"
    ],
    "tags": [
      "panchanga",
      "nakshatra",
      "lunar",
      "prediction",
      "dasha"
    ]
  },
  {
    "termKey": "yoga_panchanga",
    "domain": "vedic",
    "category": "panchanga",
    "title": "Yoga (योग) — Panchanga",
    "sanskrit": "योग",
    "summary": "Panchanga Yoga is a luni-solar combination — one of 27 yogas formed by the combined longitude of the Sun and Moon, indicating the day's overall auspiciousness.",
    "description": "Panchanga Yoga (not to be confused with planetary Yogas like Raja Yoga or Gaja Kesari Yoga) is calculated by adding the true longitudes of the Sun and Moon, then dividing by 13°20'. This produces 27 Yogas, each spanning 13°20' of the combined arc.\n\nThe 27 Yogas are grouped into categories of auspiciousness:\n- **Highly Auspicious**: Siddha, Amrita, Shubha, Siddhi\n- **Auspicious**: Priti, Ayushman, Saubhagya, Shobhana, Sukarma, Dhriti, Vriddhi, Dhruva, Harshana, Shiva, Brahma, Indra, Variyan\n- **Inauspicious**: Vishkambha, Atiganda, Shoola, Ganda, Vyaghata, Vajra, Vyatipata, Parigha, Vaidhriti\n\nUnlike tithis which change daily, yogas can shift at any point during the day. An auspicious yoga running during a critical moment (like signing a contract or starting a journey) is considered a positive reinforcement of the muhurta.",
    "howToRead": "Check which yoga is active at the time in question. Auspicious yogas amplify good results, while inauspicious yogas (especially Vyatipata and Vaidhriti, called 'vishti' yogas) should be avoided for important new beginnings. The yoga at birth reveals the native's inherent fortune tendency.",
    "significance": "Yoga is the fourth limb of the Panchanga and serves as a broad indicator of the day's cosmic energy. While less granular than tithis or nakshatras, it provides an essential 'background check' on any given moment.",
    "examples": [
      {
        "title": "Siddha Yoga",
        "content": "One of the most auspicious yogas. Activities initiated under Siddha Yoga are said to 'automatically succeed' (siddhi = accomplishment). Ideal for starting businesses, signing agreements, or beginning studies."
      },
      {
        "title": "Vyatipata Yoga",
        "content": "Considered highly inauspicious — one of the two 'great evils' (Maha Doshas) in the Panchanga. Travel, marriage, and new ventures should be strictly avoided. However, it is considered favorable for propitiating ancestors."
      }
    ],
    "relatedTerms": [
      "tithi",
      "nakshatra",
      "karana",
      "vara"
    ],
    "tags": [
      "panchanga",
      "timing",
      "muhurta",
      "auspicious"
    ]
  },
  {
    "termKey": "karana",
    "domain": "vedic",
    "category": "panchanga",
    "title": "Karana (करण)",
    "sanskrit": "करण",
    "summary": "A Karana is half of a Tithi — there are 11 types of Karanas (4 fixed + 7 repeating) that cycle through the lunar month, each governing specific activities.",
    "description": "Each tithi is divided into two Karanas, making 60 Karanas in a complete lunar month. Of the 11 types, 7 are \"Chara\" (movable/repeating) and cycle continuously, while 4 are \"Sthira\" (fixed) and appear only once per month at specific positions.\n\n**7 Chara Karanas** (repeating): Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti (Bhadra)\n**4 Sthira Karanas** (fixed): Shakuni, Chatushpada, Naga, Kimstughna\n\nVishti Karana (also called Bhadra) is the most significant — it is considered highly inauspicious and appears 8 times per lunar month. Traditional texts strongly advise against starting any new work, travel, or ceremony during Vishti Karana. However, Vishti occurring during daytime in Krishna Paksha or nighttime in Shukla Paksha is less harmful.\n\nKaranas provide a finer temporal resolution than tithis, allowing astrologers to pinpoint exactly which half of a tithi is more favorable.",
    "howToRead": "Identify the karana running at the proposed time. Avoid Vishti (Bhadra) Karana for auspicious activities. Among the Chara karanas, Bava, Balava, and Kaulava are generally favorable, while Vanija is good for trade. Among Sthira karanas, Kimstughna is the most favorable.",
    "significance": "Karana is the fifth and finest limb of the Panchanga. While often overlooked by beginners, experienced astrologers consider it essential for precise muhurta selection — especially for checking that Vishti Karana does not spoil an otherwise good time.",
    "examples": [
      {
        "title": "Vishti (Bhadra) Karana",
        "content": "Appears when Bhadra falls during specific tithis. Travel begun during Vishti Karana is said to cause obstacles. However, activities related to fire (cooking, metallurgy) and warfare are traditionally permitted."
      }
    ],
    "relatedTerms": [
      "tithi",
      "nakshatra",
      "yoga_panchanga",
      "vara",
      "paksha"
    ],
    "tags": [
      "panchanga",
      "timing",
      "muhurta",
      "karana"
    ]
  },
  {
    "termKey": "vara",
    "domain": "vedic",
    "category": "panchanga",
    "title": "Vara (वार)",
    "sanskrit": "वार",
    "summary": "Vara is the weekday — each of the 7 days is ruled by a planet, carrying that planet's energy and making it suitable for specific types of activities.",
    "description": "The seven Varas (weekdays) are named after and ruled by the seven visible celestial bodies:\n\n| Day | Sanskrit | Ruler | Energy |\n|-----|----------|-------|--------|\n| Sunday | Ravivara | Sun | Authority, father, government |\n| Monday | Somavara | Moon | Mind, mother, emotions |\n| Tuesday | Mangalavara | Mars | Courage, surgery, property |\n| Wednesday | Budhavara | Mercury | Communication, trade, learning |\n| Thursday | Guruvara | Jupiter | Wisdom, marriage, spirituality |\n| Friday | Shukravara | Venus | Love, arts, luxury, vehicles |\n| Saturday | Shanivara | Saturn | Discipline, oil, iron, servants |\n\nThe Vedic day begins at sunrise (not midnight), so a \"Tuesday\" in Vedic reckoning starts at sunrise on Tuesday and ends at sunrise on Wednesday. This is important for muhurta calculations — an event at 2 AM Wednesday morning is still astrologically \"Tuesday.\"\n\nCertain vara-tithi-nakshatra combinations create powerful auspicious or inauspicious yogas. For example, the Siddha Yoga formed by specific weekday-tithi pairs is one of the most sought-after muhurta indicators.",
    "howToRead": "Match the activity to the ruling planet's domain. Thursday (Jupiter) is ideal for education, marriage, and religious ceremonies. Saturday (Saturn) is avoided for new beginnings but excellent for oil-related activities and fasting. Tuesday (Mars) favors property registration and surgery but is avoided for travel.",
    "significance": "Vara is the second limb of the Panchanga and the simplest to determine — yet it forms the backbone of popular astrology practices. Many people follow basic vara-based rules (no new clothes on Saturday, no travel on Tuesday) even without deeper astrological knowledge.",
    "examples": [
      {
        "title": "Guru-Pushya Yoga",
        "content": "When Thursday (Guru's day) coincides with Pushya Nakshatra, it creates one of the most auspicious combinations in the entire Panchanga — ideal for buying gold, starting education, or initiating any significant venture."
      }
    ],
    "relatedTerms": [
      "tithi",
      "nakshatra",
      "yoga_panchanga",
      "karana",
      "hora_time"
    ],
    "tags": [
      "panchanga",
      "weekday",
      "timing",
      "muhurta"
    ]
  },
  {
    "termKey": "varna",
    "domain": "vedic",
    "category": "avakhada",
    "title": "Varna (वर्ण)",
    "sanskrit": "वर्ण",
    "summary": "Varna represents the temperament classification of the native — Brahmin (intellectual), Kshatriya (warrior), Vaishya (merchant), or Shudra (service-oriented).",
    "description": "In the Avakhada Chakra, Varna is derived from the Moon's nakshatra and indicates the native's fundamental approach to life. It is NOT about social hierarchy but about innate temperament and the way a person processes the world.\n\n- **Brahmin** (ब्राह्मण): Intellectual, spiritual, knowledge-seeking. Drawn to teaching, philosophy, research.\n- **Kshatriya** (क्षत्रिय): Protective, courageous, leadership-oriented. Drawn to administration, military, governance.\n- **Vaishya** (वैश्य): Commercial, social, exchange-oriented. Drawn to trade, networking, finance.\n- **Shudra** (शूद्र): Service-oriented, practical, grounded. Drawn to craftsmanship, agriculture, hands-on work.\n\nIn matchmaking (Ashta Koota), the groom's Varna should ideally be equal to or higher than the bride's. This scores 1 point out of 36 in the Koota system.",
    "howToRead": "The Varna shown in a birth chart's Avakhada Chakra tells you the native's dominant life approach. It helps in career guidance — a Brahmin Varna person will thrive in knowledge-based professions, while a Kshatriya Varna excels in leadership roles.",
    "significance": "Varna is one of the 8 Koota matching criteria and the first to be evaluated. While it carries the least weight (1 point), it sets the foundational context for understanding the native's psyche.",
    "examples": [],
    "relatedTerms": [
      "koota_varna",
      "vashya",
      "gana",
      "nadi"
    ],
    "tags": [
      "avakhada",
      "matchmaking",
      "temperament"
    ]
  },
  {
    "termKey": "vashya",
    "domain": "vedic",
    "category": "avakhada",
    "title": "Vashya (वश्य)",
    "sanskrit": "वश्य",
    "summary": "Vashya indicates the control/attraction dynamic — which types of beings naturally have influence over others, based on the Moon sign classification.",
    "description": "Vashya classifies the 12 Moon signs into 5 categories based on the type of being they represent:\n\n- **Manava** (Human): Gemini, Virgo, Libra, first half of Sagittarius, Aquarius\n- **Vanachara** (Wild/Forest): Leo\n- **Chatushpada** (Quadruped): Aries, Taurus, second half of Sagittarius, first half of Capricorn\n- **Jalachara** (Water): Cancer, Pisces, second half of Capricorn\n- **Keeta** (Insect/Reptile): Scorpio\n\nThe Vashya compatibility rules determine which category can \"attract\" or \"control\" which. Manava and Jalachara have mutual attraction. Chatushpada fears Manava. Leo (Vanachara) has dominance over Chatushpada but is controlled by Manava.\n\nIn matchmaking, Vashya scoring ranges from 0 to 2 points based on the mutual attraction/control relationship between the couple's Vashya categories.",
    "howToRead": "Look at the Vashya classification of the Moon sign. It reveals the person's natural sphere of influence — are they naturally dominant, submissive, or mutually attractive in relationships? This is particularly useful in understanding interpersonal dynamics.",
    "significance": "Vashya carries 2 points in Ashta Koota matching and indicates the balance of power in a relationship. Good Vashya compatibility suggests the couple will have a natural give-and-take dynamic rather than one person dominating.",
    "examples": [],
    "relatedTerms": [
      "koota_vashya",
      "varna",
      "rashi",
      "gana"
    ],
    "tags": [
      "avakhada",
      "matchmaking",
      "compatibility"
    ]
  },
  {
    "termKey": "yoni",
    "domain": "vedic",
    "category": "avakhada",
    "title": "Yoni (योनि)",
    "sanskrit": "योनि",
    "summary": "Yoni represents the animal instinct symbol of a nakshatra — 14 animal pairs that reveal primal behavioral tendencies, physical compatibility, and sexual temperament.",
    "description": "Each nakshatra is assigned one of 14 animal symbols, organized into male-female pairs:\n\nHorse, Elephant, Sheep, Serpent, Dog, Cat, Rat, Cow, Buffalo, Tiger, Deer, Monkey, Mongoose, Lion\n\nThe Yoni system captures the instinctive, subconscious behavior patterns that emerge especially in intimate relationships and under stress. Two people with the same Yoni have natural physical and temperamental compatibility. Certain Yoni pairs are natural enemies (e.g., Mongoose-Serpent, Cat-Rat, Dog-Deer), and their pairing in marriage is traditionally cautioned against.\n\nIn matchmaking, Yoni scores 4 points — the highest among the first four Kootas — reflecting its significant influence on marital harmony, particularly in physical compatibility and instinctive behavior patterns.",
    "howToRead": "Identify the Yoni animal from the birth nakshatra. Same Yoni pairs score maximum points. Friendly animal pairs score 3, neutral pairs 2, enemy pairs 1, and extreme enemy pairs 0. The animal symbol also gives insight into the person's instinctive reactions.",
    "significance": "Yoni is crucial in matchmaking because it addresses an aspect of compatibility that intellectual or emotional matching cannot — the raw, instinctive, physical dimension of a relationship. Mismatched Yonis (especially enemy pairs) are a significant red flag in traditional match assessment.",
    "examples": [],
    "relatedTerms": [
      "koota_yoni",
      "nakshatra",
      "gana",
      "nadi"
    ],
    "tags": [
      "avakhada",
      "matchmaking",
      "compatibility",
      "nakshatra"
    ]
  },
  {
    "termKey": "gana",
    "domain": "vedic",
    "category": "avakhada",
    "title": "Gana (गण)",
    "sanskrit": "गण",
    "summary": "Gana classifies temperament into three cosmic groups — Deva (divine/gentle), Manushya (human/mixed), and Rakshasa (demonic/intense) — based on the birth nakshatra.",
    "description": "The 27 nakshatras are divided into three Ganas of 9 nakshatras each:\n\n**Deva Gana** (Divine): Ashwini, Mrigashira, Punarvasu, Pushya, Hasta, Swati, Anuradha, Shravana, Revati\n- Gentle, charitable, spiritual, polite, forgiving. May lack assertiveness.\n\n**Manushya Gana** (Human): Bharani, Rohini, Ardra, Purva Phalguni, Uttara Phalguni, Purva Ashadha, Uttara Ashadha, Purva Bhadrapada, Uttara Bhadrapada\n- Balanced, practical, ambitious, worldly. Mix of good and challenging traits.\n\n**Rakshasa Gana** (Demonic): Krittika, Ashlesha, Magha, Chitra, Vishakha, Jyeshtha, Moola, Dhanishta, Shatabhisha\n- Intense, independent, forceful, unconventional. Strong willpower, can be harsh.\n\n**Important**: Rakshasa Gana does NOT mean \"evil.\" It indicates an intense, direct, and independent personality. Many successful leaders, reformers, and innovators have Rakshasa Gana. The term \"demonic\" reflects intensity of purpose, not moral character.\n\nIn matchmaking, Deva-Deva scores 6, Manushya-Manushya scores 6, Deva-Manushya scores 5, Rakshasa-Rakshasa scores 6, but Deva-Rakshasa scores 0 — the worst combination for temperamental harmony.",
    "howToRead": "Check the birth nakshatra's Gana. Deva Gana people are naturally agreeable and spiritual. Manushya Gana people are practical and worldly. Rakshasa Gana people are fiercely independent and intense. In a couple, matching Ganas or compatible ones (Deva-Manushya) lead to smoother relationships.",
    "significance": "Gana carries 6 points in Ashta Koota — one of the highest-weighted criteria. It reveals the deep temperamental compatibility between two people. A Deva-Rakshasa mismatch is one of the most concerning findings in traditional matchmaking.",
    "examples": [],
    "relatedTerms": [
      "koota_gana",
      "nakshatra",
      "varna",
      "yoni",
      "nadi"
    ],
    "tags": [
      "avakhada",
      "matchmaking",
      "temperament",
      "nakshatra"
    ]
  },
  {
    "termKey": "nadi",
    "domain": "vedic",
    "category": "avakhada",
    "title": "Nadi (नाडी)",
    "sanskrit": "नाडी",
    "summary": "Nadi represents the energy channel or pulse — Aadi (Vata/wind), Madhya (Pitta/bile), or Antya (Kapha/phlegm) — derived from the birth nakshatra.",
    "description": "Nadi is based on the Ayurvedic tridosha system and classifies nakshatras into three energy channels:\n\n**Aadi Nadi** (आदि — Vata/Wind): Ashwini, Ardra, Punarvasu, Uttara Phalguni, Hasta, Jyeshtha, Moola, Shatabhisha, Purva Bhadrapada\n**Madhya Nadi** (मध्य — Pitta/Bile): Bharani, Mrigashira, Pushya, Purva Phalguni, Chitra, Anuradha, Purva Ashadha, Dhanishta, Uttara Bhadrapada\n**Antya Nadi** (अन्त्य — Kapha/Phlegm): Krittika, Rohini, Ashlesha, Magha, Swati, Vishakha, Uttara Ashadha, Shravana, Revati\n\n**Nadi Dosha** — the most feared matchmaking defect — occurs when both partners share the same Nadi. It is believed to cause health problems, progeny issues, and fundamental incompatibility. Nadi Dosha cancellation rules exist (different rashis, different nakshatra lords) but traditional families take it very seriously.\n\nNadi carries the maximum weight of 8 points in Ashta Koota matching. Same Nadi scores 0 (Nadi Dosha), while different Nadis score 8 (full marks). This makes it the single most impactful factor in match scoring.",
    "howToRead": "Check the Nadi of both partners. If they share the same Nadi — that's Nadi Dosha (0/8 points). Different Nadis score full 8 points. If Nadi Dosha is present, check for cancellation conditions: different Moon signs, or the same nakshatra but different padas.",
    "significance": "Nadi is the highest-weighted Koota (8/36 points) and the most common reason for match rejection in traditional astrology. The underlying logic is Ayurvedic — same-Nadi couples are believed to have similar constitutional weaknesses, leading to health issues in offspring.",
    "examples": [],
    "relatedTerms": [
      "koota_naadi",
      "naadi_dosha",
      "nakshatra",
      "gana",
      "vashya"
    ],
    "tags": [
      "avakhada",
      "matchmaking",
      "health",
      "ayurveda",
      "nakshatra"
    ]
  },
  {
    "termKey": "tatva",
    "domain": "vedic",
    "category": "avakhada",
    "title": "Tatva (तत्व)",
    "sanskrit": "तत्व",
    "summary": "Tatva is the elemental nature — Earth (Prithvi), Water (Jala), Fire (Agni), Air (Vayu), or Ether (Akasha) — assigned to the birth nakshatra.",
    "description": "The Pancha Tatva (five elements) system assigns each nakshatra to one of five fundamental elements:\n\n- **Prithvi (Earth)**: Stability, materialism, patience, groundedness\n- **Jala (Water)**: Emotion, intuition, adaptability, nurturing\n- **Agni (Fire)**: Energy, ambition, transformation, passion\n- **Vayu (Air)**: Intellect, communication, movement, changeability\n- **Akasha (Ether/Space)**: Spirituality, expansiveness, subtlety, transcendence\n\nThe Tatva of the birth nakshatra reveals the native's fundamental elemental constitution — which energy they naturally resonate with. This has practical implications for health (Ayurvedic constitution correlation), career preferences, and relationship dynamics.\n\nComplementary elements (Fire-Air, Earth-Water) tend to support each other, while conflicting elements (Fire-Water, Earth-Air) may create friction. Ether is generally compatible with all elements.",
    "howToRead": "The Tatva shown in the Avakhada Chakra reveals the native's elemental nature. Fire Tatva people are driven and ambitious. Water Tatva people are emotional and intuitive. Earth Tatva people are practical and stable. Air Tatva people are intellectual and communicative. Ether Tatva people are spiritual and expansive.",
    "significance": "While not directly part of Ashta Koota scoring, Tatva provides valuable Ayurvedic and temperamental insights. It bridges Jyotish and Ayurveda, helping astrologers give holistic health and lifestyle recommendations.",
    "examples": [],
    "relatedTerms": [
      "nakshatra",
      "gana",
      "nadi",
      "varna"
    ],
    "tags": [
      "avakhada",
      "element",
      "ayurveda",
      "nakshatra"
    ]
  },
  {
    "termKey": "rashi",
    "domain": "vedic",
    "category": "avakhada",
    "title": "Rashi (राशि)",
    "sanskrit": "राशि",
    "summary": "Rashi is the Moon sign — the zodiac sign occupied by the Moon at the time of birth, considered the primary identity marker in Vedic astrology.",
    "description": "In Vedic astrology, when someone asks \"What is your sign?\" they mean the Moon sign (Rashi), not the Sun sign used in Western astrology. The Moon sign is determined by the Moon's position in one of the 12 zodiac signs (Mesha/Aries through Meena/Pisces) at the exact time of birth.\n\nThe Rashi reveals:\n- **Emotional nature**: How you process feelings and react to situations\n- **Mental disposition**: Your default thinking patterns and preferences\n- **Public personality**: How others perceive you in social settings\n- **Mother's influence**: The Moon governs the mother and maternal lineage\n\nIn the Avakhada Chakra, the Rashi is derived from the Janma Nakshatra — since each sign contains 2.25 nakshatras, knowing the birth nakshatra automatically determines the Moon sign.\n\nThe Rashi is used extensively in transit analysis (Gochar), dasha interpretation, and as the reference point for Bhava (house) calculations in some systems.",
    "howToRead": "The Moon sign in the Avakhada Chakra is the starting point for most Vedic astrological analysis. Check the qualities of that sign (element, modality, ruling planet) and the condition of its lord in the birth chart. A strong Moon sign lord generally indicates emotional stability and mental well-being.",
    "significance": "Rashi is the cornerstone identity in Vedic astrology. Horoscope columns in Indian newspapers and TV channels are based on Moon signs. All transit predictions, Dasha interpretations, and compatibility analyses reference the Moon sign as the primary anchor.",
    "examples": [],
    "relatedTerms": [
      "nakshatra",
      "rashi_lord",
      "pada",
      "gochar"
    ],
    "tags": [
      "avakhada",
      "zodiac",
      "moon",
      "identity"
    ]
  },
  {
    "termKey": "rashi_lord",
    "domain": "vedic",
    "category": "avakhada",
    "title": "Rashi Lord (राशि स्वामी)",
    "sanskrit": "राशि स्वामी",
    "summary": "The Rashi Lord is the ruling planet of the Moon sign — its strength, placement, and condition in the birth chart directly influence the native's emotional well-being and life direction.",
    "description": "Each of the 12 zodiac signs has a planetary ruler:\n\n| Sign | Lord | | Sign | Lord |\n|------|------|-|------|------|\n| Aries | Mars | | Libra | Venus |\n| Taurus | Venus | | Scorpio | Mars |\n| Gemini | Mercury | | Sagittarius | Jupiter |\n| Cancer | Moon | | Capricorn | Saturn |\n| Leo | Sun | | Aquarius | Saturn |\n| Virgo | Mercury | | Pisces | Jupiter |\n\nThe Rashi Lord's placement, strength, and aspects in the birth chart are critically important:\n- A strong, well-placed Rashi Lord = emotional stability, clear direction, support from environment\n- A weak, afflicted Rashi Lord = mental turbulence, confusion, lack of support\n- The house occupied by the Rashi Lord often becomes a major area of focus in life\n\nSince the Moon represents the mind, the condition of its sign lord directly affects mental peace, decision-making ability, and overall life satisfaction.",
    "howToRead": "Find the Moon sign, then locate its ruling planet in the birth chart. Check: (1) Which house is it in? That area of life gets emphasis. (2) Is it exalted, debilitated, or in own sign? (3) Which planets aspect it? Benefic aspects strengthen, malefic aspects challenge. (4) Is it retrograde or combust?",
    "significance": "The Rashi Lord is one of the most important planets in any chart analysis. In predictive astrology, the Rashi Lord's dasha period is often a defining chapter in the native's life, bringing the themes of the Moon sign into sharp focus.",
    "examples": [],
    "relatedTerms": [
      "rashi",
      "nakshatra",
      "sign_lord",
      "dignity"
    ],
    "tags": [
      "avakhada",
      "planet",
      "ruler",
      "moon"
    ]
  },
  {
    "termKey": "pada",
    "domain": "vedic",
    "category": "avakhada",
    "title": "Pada (पाद)",
    "sanskrit": "पाद",
    "summary": "Pada is the quarter of a Nakshatra — each of the 27 nakshatras has 4 padas of 3°20', totaling 108 padas that map to the Navamsha (D9) chart divisions.",
    "description": "The word \"Pada\" literally means \"foot\" or \"quarter.\" Each nakshatra spans 13°20' of the zodiac and is divided into 4 equal quarters:\n\n- **Pada 1**: 0°00' to 3°20' of the nakshatra\n- **Pada 2**: 3°20' to 6°40'\n- **Pada 3**: 6°40' to 10°00'\n- **Pada 4**: 10°00' to 13°20'\n\nThe 108 padas (27 × 4) have a direct mathematical correspondence with the Navamsha (D9) chart — each pada maps to exactly one Navamsha sign. This is why the Navamsha is considered the \"extension\" of the nakshatra system.\n\nThe pada of the Janma Nakshatra determines:\n1. The **Namakshar** (first syllable for naming the child)\n2. The **Navamsha Lagna** (if Moon pada = Lagna pada, it's an exceptionally strong chart)\n3. The specific shade of the nakshatra's qualities — Pada 1 (Dharma/purpose), Pada 2 (Artha/wealth), Pada 3 (Kama/desire), Pada 4 (Moksha/liberation)",
    "howToRead": "Check which pada the Moon occupies at birth. Pada 1 emphasizes purpose and identity. Pada 2 emphasizes material security. Pada 3 emphasizes relationships and desires. Pada 4 emphasizes spiritual growth and letting go. The pada also determines the first syllable to be used for naming.",
    "significance": "Pada is the bridge between the Nakshatra system and the Navamsha chart — two of the most important analytical frameworks in Vedic astrology. Understanding padas allows for much finer character delineation within a single nakshatra.",
    "examples": [],
    "relatedTerms": [
      "nakshatra",
      "namakshar",
      "d9_navamsha",
      "rashi"
    ],
    "tags": [
      "avakhada",
      "nakshatra",
      "navamsha",
      "naming"
    ]
  },
  {
    "termKey": "namakshar",
    "domain": "vedic",
    "category": "avakhada",
    "title": "Namakshar (नामाक्षर)",
    "sanskrit": "नामाक्षर",
    "summary": "Namakshar is the auspicious first syllable for naming — derived from the birth nakshatra's pada, ensuring the name resonates with the native's cosmic vibration.",
    "description": "Each of the 108 nakshatra-padas is assigned a specific Sanskrit syllable (akshar). The child's name should ideally begin with this syllable to create vibrational harmony between the name and the birth chart.\n\nFor example:\n- Ashwini Pada 1 → \"Chu\" (चू)\n- Ashwini Pada 2 → \"Che\" (चे)\n- Ashwini Pada 3 → \"Cho\" (चो)\n- Ashwini Pada 4 → \"La\" (ला)\n\nThis practice is deeply rooted in the Vedic concept of **Nama Karma** (naming ceremony) — one of the 16 Samskaras (sacraments). The belief is that a person's name is not just a label but a mantra that is repeated thousands of times throughout life. A name aligned with the birth nakshatra amplifies positive planetary influences.\n\nModern Indian families often use the Namakshar as the starting point, then find a meaningful name beginning with that syllable. Many families consult astrologers specifically for this purpose, especially for the formal/astrological name even if a different modern name is used socially.",
    "howToRead": "Find the Janma Nakshatra and its pada from the birth chart. Look up the corresponding syllable from the Namakshar table. The child's name should begin with this syllable. If the family prefers a different name, at least the formal/astrological name should use the Namakshar.",
    "significance": "Namakshar naming is one of the most practically applied aspects of Vedic astrology in Indian culture. Even families who don't follow astrology closely often consult for the Namakshar when naming a newborn. It connects the Vedic birth chart to daily life through the power of sound vibration.",
    "examples": [],
    "relatedTerms": [
      "nakshatra",
      "pada",
      "rashi"
    ],
    "tags": [
      "avakhada",
      "naming",
      "nakshatra",
      "ceremony"
    ]
  },
  {
    "termKey": "paya_rashi",
    "domain": "vedic",
    "category": "avakhada",
    "title": "Paya Rashi (पाया राशि)",
    "sanskrit": "पाया राशि",
    "summary": "Paya by Rashi classifies the Moon sign into one of four base metals — Gold, Silver, Copper, or Iron — indicating the native's inherent material fortune and constitution.",
    "description": "The Paya (literally \"base\" or \"foundation\") system assigns a metal to each Moon sign:\n\n- **Gold (Swarna)**: Indicates highest material fortune, natural abundance, strong health\n- **Silver (Rajat)**: Good fortune, comfortable life, moderate prosperity\n- **Copper (Tamra)**: Mixed results, fluctuating fortune, needs effort\n- **Iron (Loha)**: Challenging material circumstances, hard work required, strong resilience\n\nThe Rashi-based Paya assignment follows a fixed mapping — each zodiac sign permanently belongs to one metal category. This gives a broad-stroke assessment of the native's material destiny based solely on the Moon sign.\n\nPaya analysis is often used alongside the more detailed Nakshatra-based Paya for a comprehensive assessment. When both Rashi Paya and Nakshatra Paya align (e.g., both Gold), the indication is strongly reinforced.",
    "howToRead": "Check the Paya metal assigned to the Moon sign. Gold Paya natives tend to attract wealth naturally. Silver Paya natives live comfortably with moderate effort. Copper Paya natives experience ups and downs. Iron Paya natives build fortune through persistent hard work and resilience.",
    "significance": "Paya is a quick-reference indicator used in traditional Vedic astrology to assess the native's material trajectory. While not as detailed as a full chart analysis, it provides an instant baseline assessment that experienced astrologers use for initial chart evaluation.",
    "examples": [],
    "relatedTerms": [
      "paya_nakshatra",
      "rashi",
      "nakshatra"
    ],
    "tags": [
      "avakhada",
      "wealth",
      "fortune",
      "metals"
    ]
  },
  {
    "termKey": "paya_nakshatra",
    "domain": "vedic",
    "category": "avakhada",
    "title": "Paya Nakshatra (पाया नक्षत्र)",
    "sanskrit": "पाया नक्षत्र",
    "summary": "Paya by Nakshatra assigns a base metal (Gold, Silver, Copper, or Iron) based on the birth star, providing a more refined material fortune indicator than the Rashi-based Paya.",
    "description": "While Rashi Paya gives a broad assessment based on the Moon sign (12 possibilities), Nakshatra Paya uses the more precise 27-nakshatra system for finer differentiation. Two people with the same Moon sign but different nakshatras may have different Nakshatra Payas.\n\nThe Nakshatra Paya mapping considers the specific energetic quality of each lunar mansion:\n- **Gold Paya Nakshatras**: Associated with Jupiter and Venus-ruled nakshatras that naturally attract abundance\n- **Silver Paya Nakshatras**: Associated with Moon and Mercury-ruled nakshatras with comfortable circumstances\n- **Copper Paya Nakshatras**: Mixed-energy nakshatras requiring balance\n- **Iron Paya Nakshatras**: Mars and Saturn-ruled nakshatras requiring effort and discipline\n\nWhen both Rashi Paya and Nakshatra Paya agree, the prediction is strongly reinforced. When they conflict, the Nakshatra Paya is generally given more weight as it's more specific.",
    "howToRead": "Compare the Nakshatra Paya with the Rashi Paya. If both are Gold or Silver, the native has strong material fortune indicators. If they conflict, the Nakshatra Paya takes precedence. Iron Paya doesn't mean poverty — it means fortune comes through hard work rather than luck.",
    "significance": "Nakshatra Paya provides a second layer of material assessment beyond Rashi Paya. Traditional astrologers often mention both when giving an initial chart reading, as it quickly sets expectations about the native's material life trajectory.",
    "examples": [],
    "relatedTerms": [
      "paya_rashi",
      "nakshatra",
      "rashi"
    ],
    "tags": [
      "avakhada",
      "wealth",
      "fortune",
      "nakshatra"
    ]
  },
  {
    "termKey": "paksha",
    "domain": "vedic",
    "category": "avakhada",
    "title": "Paksha (पक्ष)",
    "sanskrit": "पक्ष",
    "summary": "Paksha is the lunar phase — Shukla (bright/waxing) or Krishna (dark/waning) — determined by whether the Moon is growing or diminishing at the time of birth.",
    "description": "The lunar month is divided into two Pakshas of approximately 15 days each:\n\n**Shukla Paksha** (शुक्ल पक्ष — Bright Half): From Amavasya (new moon) to Purnima (full moon). The Moon waxes, growing brighter each night. This is the period of growth, expansion, and new beginnings.\n\n**Krishna Paksha** (कृष्ण पक्ष — Dark Half): From Purnima (full moon) to Amavasya (new moon). The Moon wanes, diminishing each night. This is the period of consolidation, introspection, and completion.\n\nBirth during Shukla Paksha is traditionally considered more favorable for material success — the growing Moon symbolizes increasing fortune, mental strength, and optimism. Krishna Paksha births, while not unfavorable, are associated with introversion, spiritual inclination, and wisdom through adversity.\n\nThe Paksha is directly linked to the Tithi — Shukla Paksha contains tithis 1-15 (Pratipada to Purnima), and Krishna Paksha contains tithis 1-15 (Pratipada to Amavasya). The specific tithi within the paksha further refines the interpretation.",
    "howToRead": "Check whether the birth tithi falls in Shukla or Krishna Paksha. Shukla Paksha births generally have a stronger, more resilient Moon — important for emotional stability. For muhurta, Shukla Paksha is preferred for new beginnings, while Krishna Paksha is suitable for ending projects, fasting, and spiritual practices.",
    "significance": "Paksha fundamentally affects the Moon's strength — a waxing Moon (Shukla) is considered naturally strong, while a waning Moon (Krishna) is considered weaker. Since the Moon governs the mind in Vedic astrology, this directly impacts the native's mental constitution and emotional resilience.",
    "examples": [],
    "relatedTerms": [
      "tithi",
      "nakshatra",
      "rashi"
    ],
    "tags": [
      "avakhada",
      "lunar",
      "moon",
      "panchanga"
    ]
  },
  {
    "termKey": "sun",
    "domain": "vedic",
    "category": "navagraha",
    "title": "Sun — Surya (सूर्य)",
    "sanskrit": "सूर्य",
    "summary": "The Sun (Surya) is the soul (Atmakaraka), representing ego, authority, father, government, vitality, and self-expression. It rules Leo and is exalted in Aries.",
    "description": "Surya is the king of the planetary cabinet — the source of light, life, and consciousness. In a birth chart, the Sun represents the native's core identity, willpower, and life purpose.\n\n**Key Significations:**\n- **Soul & Self**: The deepest sense of \"who I am\" — beyond personality (Moon) or intellect (Mercury)\n- **Father & Authority**: Relationship with father, bosses, government officials, and authority figures\n- **Vitality & Health**: Physical constitution, heart health, bones, right eye (male), left eye (female)\n- **Career & Status**: Government jobs, politics, administration, leadership positions\n\n**Astronomical Details:**\n- Rules: Leo (Simha)\n- Exalted: Aries 10° (maximum strength)\n- Debilitated: Libra 10° (weakened)\n- Friends: Moon, Mars, Jupiter\n- Enemies: Venus, Saturn\n- Neutral: Mercury\n- Day: Sunday | Color: Red/Copper | Gemstone: Ruby (Manik) | Metal: Gold\n\nA strong Sun gives leadership ability, confidence, government favor, and good health. A weak or afflicted Sun can cause ego issues, problems with father/authority, heart ailments, and lack of direction.",
    "howToRead": "Check the Sun's sign, house, and aspects. Sun in the 10th house is exceptionally powerful (Dig Bala — directional strength). Sun conjunct or aspected by malefics may indicate health issues or authority conflicts. Sun's Dasha/Antardasha periods often bring career changes, recognition, or authority-related events.",
    "significance": "While Vedic astrology emphasizes the Moon sign, the Sun is equally vital — it represents the conscious will and life force. A chart with a strong Moon but weak Sun may have a person who is emotionally rich but lacks direction or authority.",
    "examples": [
      {
        "title": "Sun in 10th House",
        "content": "One of the most powerful placements — the Sun gets Dig Bala (directional strength) here. Indicates natural authority, government connections, and career prominence. The native often achieves a leadership position."
      },
      {
        "title": "Sun-Saturn Conjunction",
        "content": "Father may be distant or strict. The native struggles with authority figures early in life but develops tremendous discipline. Often seen in charts of self-made leaders who rise through persistent effort."
      }
    ],
    "relatedTerms": [
      "moon",
      "mars",
      "jupiter",
      "dignity",
      "combustion"
    ],
    "tags": [
      "planet",
      "navagraha",
      "soul",
      "authority",
      "father"
    ]
  },
  {
    "termKey": "moon",
    "domain": "vedic",
    "category": "navagraha",
    "title": "Moon — Chandra (चंद्र)",
    "sanskrit": "चंद्र",
    "summary": "The Moon (Chandra) is the mind (Manokaraka), governing emotions, mother, mental peace, public image, and intuition. It rules Cancer and is exalted in Taurus.",
    "description": "Chandra is the queen of the planetary cabinet — the reflection of consciousness, the mind's mirror. In Vedic astrology, the Moon is arguably the most important planet because it determines the Rashi (Moon sign), which is the primary identity marker.\n\n**Key Significations:**\n- **Mind & Emotions**: Mental state, emotional patterns, psychological well-being\n- **Mother & Nurturing**: Relationship with mother, maternal figures, capacity to nurture\n- **Public & Popularity**: How the public perceives you, charisma, mass appeal\n- **Fluids & Fertility**: Blood, lymph, water retention, menstrual cycle, fertility\n\n**Astronomical Details:**\n- Rules: Cancer (Karka)\n- Exalted: Taurus 3° (Rohini Nakshatra — Krishna's birth star)\n- Debilitated: Scorpio 3°\n- Friends: Sun, Mercury\n- Enemies: None (the Moon has no permanent enemies)\n- Day: Monday | Color: White | Gemstone: Pearl (Moti) | Metal: Silver\n\n**Waxing vs Waning**: A waxing Moon (Shukla Paksha) is considered strong — bright, full, generous. A waning Moon (Krishna Paksha) is weaker — introverted, contemplative, anxious. This is why Paksha matters so much in chart assessment.",
    "howToRead": "The Moon's strength is the single most important factor for mental well-being. Check: (1) Paksha — waxing is stronger. (2) Sign — Taurus is best, Scorpio is challenging. (3) Aspects — Jupiter's aspect on Moon is the best remedy for mental peace. (4) Nakshatra — determines the Dasha sequence and life timeline.",
    "significance": "The Moon is the lens through which the entire chart is experienced. A strong Moon can compensate for many other afflictions — the native remains mentally resilient. A weak Moon, even with other strong placements, often leads to anxiety, indecision, and emotional turbulence.",
    "examples": [
      {
        "title": "Gaja Kesari Yoga",
        "content": "When Jupiter is in a Kendra (1st, 4th, 7th, or 10th) from the Moon, it creates Gaja Kesari Yoga — one of the most celebrated yogas. Gives wisdom, wealth, and lasting fame."
      }
    ],
    "relatedTerms": [
      "sun",
      "rashi",
      "nakshatra",
      "paksha",
      "gaja_kesari_yoga"
    ],
    "tags": [
      "planet",
      "navagraha",
      "mind",
      "emotions",
      "mother"
    ]
  },
  {
    "termKey": "mars",
    "domain": "vedic",
    "category": "navagraha",
    "title": "Mars — Mangal (मंगल)",
    "sanskrit": "मंगल",
    "summary": "Mars (Mangal) is the commander, representing courage, energy, siblings, property, surgery, and combat. It rules Aries and Scorpio, exalted in Capricorn.",
    "description": "Mangal is the warrior planet — raw energy, ambition, and the drive to conquer. In a chart, Mars shows where you fight, what you fight for, and how you handle conflict.\n\n**Key Significations:**\n- **Energy & Courage**: Physical vitality, athletic ability, risk-taking, assertiveness\n- **Siblings & Property**: Younger siblings, real estate, land, agriculture\n- **Surgery & Blood**: Surgical procedures, accidents, cuts, blood-related issues\n- **Technical Skills**: Engineering, machinery, weapons, fire, electricity\n\n**Astronomical Details:**\n- Rules: Aries (Mesha) and Scorpio (Vrishchika)\n- Exalted: Capricorn 28° | Debilitated: Cancer 28°\n- Friends: Sun, Moon, Jupiter\n- Enemies: Mercury\n- Day: Tuesday | Color: Red | Gemstone: Red Coral (Moonga) | Metal: Copper\n\n**Manglik Dosha**: Mars in houses 1, 2, 4, 7, 8, or 12 from the Lagna or Moon creates Manglik Dosha — the most commonly discussed marriage affliction. It is said to cause conflict, aggression, or even separation in marriage if the partner is non-Manglik.",
    "howToRead": "Check Mars's house placement, sign, and aspects. Mars in its own sign (Aries/Scorpio) or exalted (Capricorn) gives tremendous energy and success. Mars in Cancer (debilitated) makes the person emotionally reactive rather than strategically assertive. Always check for Manglik Dosha in marriage consultations.",
    "significance": "Mars is the planet of action — without Mars energy, nothing gets done. A well-placed Mars gives the courage to pursue goals and overcome obstacles. An afflicted Mars either suppresses energy (passive-aggressive) or explosively releases it (anger, accidents).",
    "examples": [],
    "relatedTerms": [
      "sun",
      "saturn",
      "manglik_dosha",
      "angarak_dosha"
    ],
    "tags": [
      "planet",
      "navagraha",
      "courage",
      "energy",
      "property"
    ]
  },
  {
    "termKey": "mercury",
    "domain": "vedic",
    "category": "navagraha",
    "title": "Mercury — Budha (बुध)",
    "sanskrit": "बुध",
    "summary": "Mercury (Budha) is the prince, governing intellect, communication, commerce, humor, and analytical ability. It rules Gemini and Virgo, exalted in Virgo.",
    "description": "Budha is the planet of intelligence and communication — the messenger between the conscious and subconscious mind. Mercury shows how you think, speak, learn, and trade.\n\n**Key Significations:**\n- **Intellect & Speech**: Analytical ability, communication skills, writing, wit\n- **Commerce & Trade**: Business acumen, accounting, negotiations, contracts\n- **Education & Learning**: Formal education, skills training, languages, mathematics\n- **Nervous System**: Skin, nerves, respiratory system, hands\n\n**Astronomical Details:**\n- Rules: Gemini (Mithuna) and Virgo (Kanya)\n- Exalted: Virgo 15° (uniquely, Mercury is exalted in its own sign)\n- Debilitated: Pisces 15°\n- Friends: Sun, Venus\n- Enemies: Moon\n- Day: Wednesday | Color: Green | Gemstone: Emerald (Panna) | Metal: Brass\n\n**Special Quality**: Mercury is the most adaptable planet — it takes on the nature of planets it associates with. Mercury with Jupiter becomes wise and philosophical. Mercury with Mars becomes sharp and argumentative. Mercury with Saturn becomes methodical and research-oriented. This chameleon quality makes Mercury's conjunctions particularly important to analyze.",
    "howToRead": "Check Mercury's sign, house, and conjunctions. Mercury in Gemini or Virgo gives excellent communication. Mercury in Pisces (debilitated) creates dreamy, intuitive but impractical thinking. Mercury's conjunctions are crucial — it absorbs the nature of associated planets. Mercury Dasha periods bring education, travel, and business opportunities.",
    "significance": "In the modern world, Mercury's significations (communication, technology, commerce, education) are more relevant than ever. A strong Mercury is practically essential for success in today's information-driven economy.",
    "examples": [],
    "relatedTerms": [
      "jupiter",
      "venus",
      "budha_aditya_yoga",
      "retrograde"
    ],
    "tags": [
      "planet",
      "navagraha",
      "intellect",
      "communication",
      "commerce"
    ]
  },
  {
    "termKey": "jupiter",
    "domain": "vedic",
    "category": "navagraha",
    "title": "Jupiter — Guru (गुरु)",
    "sanskrit": "गुरु",
    "summary": "Jupiter (Guru/Brihaspati) is the great benefic — the teacher planet governing wisdom, dharma, children, wealth, expansion, and spiritual growth. Rules Sagittarius and Pisces.",
    "description": "Guru is the most benefic planet in Vedic astrology — the divine teacher (Brihaspati, preceptor of the gods). Jupiter's placement shows where you find meaning, grow spiritually, and receive grace.\n\n**Key Significations:**\n- **Wisdom & Teaching**: Higher learning, philosophy, religion, mentorship\n- **Children & Progeny**: Especially sons, fertility, relationship with children\n- **Wealth & Expansion**: Growth of resources, generosity, luck, prosperity\n- **Dharma & Ethics**: Moral compass, righteousness, justice, fairness\n- **Husband (in female charts)**: Jupiter is the primary significator for husband\n\n**Astronomical Details:**\n- Rules: Sagittarius (Dhanu) and Pisces (Meena)\n- Exalted: Cancer 5° | Debilitated: Capricorn 5°\n- Friends: Sun, Moon, Mars\n- Enemies: Mercury, Venus\n- Day: Thursday | Color: Yellow | Gemstone: Yellow Sapphire (Pukhraj) | Metal: Gold\n\n**Jupiter's Aspect**: Uniquely, Jupiter aspects the 5th, 7th, and 9th houses from its position (most planets only aspect the 7th). This triple aspect means Jupiter's benefic influence reaches far across the chart, blessing whichever houses it touches.",
    "howToRead": "Jupiter's house placement shows where you experience growth and luck. Jupiter in Kendra (1-4-7-10) is powerful, forming various beneficial yogas. Jupiter in Cancer (exalted) gives deep wisdom and material prosperity. Always check Jupiter's special 5th, 7th, and 9th aspects — they bless those houses significantly.",
    "significance": "Jupiter is called 'Guru' for a reason — it governs the capacity for wisdom, growth, and grace. A strong Jupiter can single-handedly elevate an otherwise troubled chart (Guru Bala). This is why Jupiter's transit through different signs is one of the most tracked events in Vedic astrology.",
    "examples": [],
    "relatedTerms": [
      "sun",
      "moon",
      "venus",
      "gaja_kesari_yoga",
      "guru_mangal_yoga",
      "guru_chandal_dosha"
    ],
    "tags": [
      "planet",
      "navagraha",
      "benefic",
      "wisdom",
      "wealth",
      "children"
    ]
  },
  {
    "termKey": "venus",
    "domain": "vedic",
    "category": "navagraha",
    "title": "Venus — Shukra (शुक्र)",
    "sanskrit": "शुक्र",
    "summary": "Venus (Shukra) is the planet of love, beauty, luxury, art, marriage, and sensual pleasure. It rules Taurus and Libra, exalted in Pisces.",
    "description": "Shukra is the minister of the planetary cabinet — the preceptor of the Asuras (demons), representing refined pleasure, aesthetics, and material enjoyment. Venus shows how you love, what you find beautiful, and your relationship with luxury.\n\n**Key Significations:**\n- **Love & Marriage**: Romantic relationships, marital harmony, attraction\n- **Beauty & Art**: Aesthetics, fashion, music, dance, cinema, design\n- **Luxury & Comfort**: Vehicles, jewelry, fine dining, comfortable living\n- **Wife (in male charts)**: Venus is the primary significator for wife/partner\n- **Reproductive System**: Fertility, semen, reproductive organs\n\n**Astronomical Details:**\n- Rules: Taurus (Vrishabha) and Libra (Tula)\n- Exalted: Pisces 27° | Debilitated: Virgo 27°\n- Friends: Mercury, Saturn\n- Enemies: Sun, Moon\n- Day: Friday | Color: White/Silver | Gemstone: Diamond (Heera) | Metal: Silver\n\nVenus is the second great benefic (after Jupiter). While Jupiter gives spiritual wisdom, Venus gives worldly wisdom — the ability to appreciate and create beauty, build harmonious relationships, and enjoy the material world without guilt.",
    "howToRead": "Check Venus's sign, house, and aspects for relationship and aesthetic indicators. Venus in Pisces (exalted) gives the most refined artistic sensibility and deep romantic capacity. Venus in Virgo (debilitated) may indicate overly critical or analytical approach to love. Venus Dasha periods bring marriage, artistic success, and luxury.",
    "significance": "Venus governs the quality of relationships, the capacity for joy, and the appreciation of beauty. In a world where marital harmony and emotional satisfaction are major concerns, Venus's condition in the chart is one of the first things an astrologer evaluates.",
    "examples": [],
    "relatedTerms": [
      "mercury",
      "saturn",
      "mars",
      "manglik_dosha"
    ],
    "tags": [
      "planet",
      "navagraha",
      "benefic",
      "love",
      "beauty",
      "marriage"
    ]
  },
  {
    "termKey": "saturn",
    "domain": "vedic",
    "category": "navagraha",
    "title": "Saturn — Shani (शनि)",
    "sanskrit": "शनि",
    "summary": "Saturn (Shani) is the great taskmaster — the planet of karma, discipline, delays, longevity, and hard-won wisdom. Rules Capricorn and Aquarius, exalted in Libra.",
    "description": "Shani is the most feared yet most transformative planet in Vedic astrology. As the son of Surya (Sun) and Chhaya (Shadow), Saturn represents the consequences of past actions (karma) manifesting in the present life.\n\n**Key Significations:**\n- **Karma & Justice**: Results of past actions, accountability, life lessons\n- **Discipline & Structure**: Hard work, perseverance, organization, time management\n- **Delays & Obstacles**: Slowness, restrictions, chronic issues, but eventual success\n- **Longevity & Old Age**: Lifespan, aging, chronic diseases, joints, bones\n- **Service & Labor**: Workers, servants, masses, democracy, social justice\n\n**Astronomical Details:**\n- Rules: Capricorn (Makara) and Aquarius (Kumbha)\n- Exalted: Libra 20° | Debilitated: Aries 20°\n- Friends: Mercury, Venus\n- Enemies: Sun, Moon, Mars\n- Day: Saturday | Color: Black/Blue | Gemstone: Blue Sapphire (Neelam) | Metal: Iron\n\n**Sade Sati** — Saturn's most significant transit — occurs when Saturn transits the 12th, 1st, and 2nd houses from the Moon sign. This 7.5-year period is considered one of the most challenging phases of life, bringing restructuring, loss, and ultimately transformation.",
    "howToRead": "Saturn's house shows where you face your greatest challenges and ultimately build mastery. Saturn in the 10th house (Dig Bala) gives incredible career success through sustained effort. Saturn Dasha periods (19 years in Vimshottari) are defining chapters — difficult but deeply character-building.",
    "significance": "Saturn is the planet of time itself — it reminds us that nothing comes without effort and everything is temporary. While feared in popular astrology, experienced astrologers know that Saturn's influence, though harsh, builds the strongest foundations. The greatest achievements often come through Saturn's periods.",
    "examples": [
      {
        "title": "Sade Sati",
        "content": "The 7.5-year Saturn transit over the Moon sign is life's great restructuring period. It strips away what isn't authentic and forces you to rebuild on solid foundations. Many people report that their greatest growth happened during Sade Sati."
      }
    ],
    "relatedTerms": [
      "sun",
      "mars",
      "rahu",
      "sade_sati",
      "sani_dhaiya",
      "shrapit_dosha"
    ],
    "tags": [
      "planet",
      "navagraha",
      "malefic",
      "karma",
      "discipline",
      "longevity"
    ]
  },
  {
    "termKey": "rahu",
    "domain": "vedic",
    "category": "navagraha",
    "title": "Rahu (राहु)",
    "sanskrit": "राहु",
    "summary": "Rahu is the North Node of the Moon — a shadow planet representing obsession, illusion, foreign influences, technology, unconventional paths, and karmic desires from past lives.",
    "description": "Rahu is not a physical planet but a mathematical point — the ascending node where the Moon's orbit intersects the ecliptic (Sun's apparent path). In Vedic mythology, Rahu is the head of a demon who tricked the gods into drinking the nectar of immortality, and was beheaded by Vishnu's Sudarshana Chakra. The head became Rahu, the tail became Ketu.\n\n**Key Significations:**\n- **Obsession & Amplification**: Whatever Rahu touches, it amplifies to an obsessive degree\n- **Foreign & Unconventional**: Foreign travel, foreign cultures, breaking traditions\n- **Technology & Innovation**: Computers, internet, AI, cutting-edge technology\n- **Illusion & Deception**: Maya, confusion, smoke-and-mirrors, hidden agendas\n- **Material Desire**: Intense worldly ambition, status-seeking, power hunger\n\n**Details:**\n- Exalted: Taurus/Gemini (varies by tradition) | Debilitated: Scorpio/Sagittarius\n- No rulership of signs (but considered co-ruler of Aquarius by some)\n- Always retrograde in apparent motion\n- Dasha period: 18 years in Vimshottari\n- Day: Saturday (shared with Saturn) | Gemstone: Hessonite (Gomed)\n\nRahu acts like an amplified version of the sign lord it occupies. Rahu in Venus's signs acts like an amplified Venus (extreme luxury, passion). Rahu in Mars's signs acts like amplified Mars (extreme aggression, risk-taking).",
    "howToRead": "Rahu's house shows your greatest worldly obsession and life area of amplification. Rahu in the 10th gives obsessive career ambition (often seen in politicians and CEOs). The sign tells how Rahu expresses itself. Check the sign lord's condition — it controls Rahu's outcomes. Rahu's Dasha (18 years) is often the most eventful period of life.",
    "significance": "Rahu represents the karmic direction this life is pushing you toward — the unfamiliar territory your soul needs to explore. While often feared, Rahu is essential for growth beyond comfort zones. Many of the world's greatest innovators and paradigm-shifters have prominent Rahu placements.",
    "examples": [],
    "relatedTerms": [
      "ketu",
      "saturn",
      "kala_sarpa_dosha",
      "guru_chandal_dosha",
      "angarak_dosha"
    ],
    "tags": [
      "planet",
      "navagraha",
      "shadow",
      "karma",
      "obsession",
      "technology"
    ]
  },
  {
    "termKey": "ketu",
    "domain": "vedic",
    "category": "navagraha",
    "title": "Ketu (केतु)",
    "sanskrit": "केतु",
    "summary": "Ketu is the South Node of the Moon — a shadow planet representing detachment, spirituality, past-life mastery, intuition, and liberation (moksha).",
    "description": "Ketu is Rahu's counterpart — the descending node of the Moon's orbit. While Rahu is the head (desire, obsession), Ketu is the headless body (detachment, dissolution). Ketu represents what you've already mastered in past lives and now need to let go of.\n\n**Key Significations:**\n- **Detachment & Liberation**: Letting go, renunciation, moksha, spiritual freedom\n- **Past-Life Mastery**: Skills and knowledge brought from previous incarnations\n- **Intuition & Psychic Ability**: Sixth sense, spiritual perception, channeling\n- **Isolation & Withdrawal**: Hermit tendencies, emotional disconnection, asceticism\n- **Surgery & Precision**: Sharp, precise, cutting — especially in medical/scientific fields\n\n**Details:**\n- Exalted: Scorpio/Sagittarius (varies by tradition) | Debilitated: Taurus/Gemini\n- Always retrograde in apparent motion (opposite to Rahu)\n- Dasha period: 7 years in Vimshottari (shortest major period)\n- Day: Tuesday (shared with Mars) | Gemstone: Cat's Eye (Lehsunia)\n\nKetu gives opposite results to Rahu — where Rahu amplifies and obsesses, Ketu diminishes and detaches. The house Ketu occupies often represents an area where you feel \"been there, done that\" — naturally skilled but emotionally uninvested.",
    "howToRead": "Ketu's house shows where you have past-life expertise but current-life detachment. Ketu in the 12th house (strongest placement) gives deep spiritual insight and moksha potential. The Rahu-Ketu axis (always exactly opposite) shows the fundamental karmic tension in the chart — what you're leaving behind (Ketu) vs. where you're heading (Rahu).",
    "significance": "Ketu is the moksha-karaka (liberation significator). While Rahu drives you into the world, Ketu pulls you out of it. The balance between Rahu's worldly ambition and Ketu's spiritual detachment is the central karmic drama of every chart.",
    "examples": [],
    "relatedTerms": [
      "rahu",
      "mars",
      "kala_sarpa_dosha",
      "spiritual_yoga"
    ],
    "tags": [
      "planet",
      "navagraha",
      "shadow",
      "karma",
      "spirituality",
      "moksha"
    ]
  },
  {
    "termKey": "aries",
    "domain": "vedic",
    "category": "rashi",
    "title": "Aries — Mesha (मेष)",
    "sanskrit": "मेष",
    "summary": "Aries (Mesha) is the first sign — a cardinal fire sign ruled by Mars, representing initiative, courage, leadership, and the pioneering spirit.",
    "description": "Mesha is the natural first house of the zodiac, marking the beginning of the astrological cycle at the vernal equinox. Ruled by Mars, this sign embodies raw energy, assertiveness, and the drive to initiate.\n\n**Key Characteristics:**\n- **Element**: Fire (Agni) — passionate, energetic, spontaneous\n- **Quality**: Cardinal (Chara) — initiating, action-oriented, enterprising\n- **Symbol**: Ram — headstrong, courageous, direct\n- **Body Parts**: Head, face, brain\n- **Ruling Planet**: Mars (Mangal)\n\nAries natives are natural leaders who prefer to blaze new trails rather than follow established paths. They are quick to act, competitive, and thrive in challenging situations. Their weakness is impatience — they start many projects but may struggle with follow-through.\n\nThe Sun is exalted in Aries (at 10°), making this sign particularly conducive to authority, self-expression, and vitality. Saturn is debilitated here, indicating that patience and discipline don't come naturally to Aries energy.",
    "howToRead": "Planets in Aries express themselves with urgency and directness. Mars here is in its own sign (powerful). Sun here is exalted (authoritative). Saturn here is debilitated (impatient, reckless). Check which house Aries falls in to see where this pioneering energy manifests in the native's life.",
    "significance": "As the first sign, Aries sets the tone for the entire zodiac — it represents the spark of creation, the initial impulse, the 'Big Bang' of individual consciousness. Understanding Aries energy is key to understanding the concept of Chara (cardinal) signs.",
    "examples": [],
    "relatedTerms": [
      "mars",
      "sun",
      "saturn",
      "rashi"
    ],
    "tags": [
      "rashi",
      "zodiac",
      "fire",
      "cardinal"
    ]
  },
  {
    "termKey": "taurus",
    "domain": "vedic",
    "category": "rashi",
    "title": "Taurus — Vrishabha (वृषभ)",
    "sanskrit": "वृषभ",
    "summary": "Taurus (Vrishabha) is a fixed earth sign ruled by Venus, representing stability, material wealth, beauty, sensual pleasure, and steadfast determination.",
    "description": "Vrishabha is the natural second house of the zodiac, governing wealth, speech, and family. Ruled by Venus, this sign embodies material abundance, aesthetic appreciation, and grounded stability.\n\n**Key Characteristics:**\n- **Element**: Earth (Prithvi) — practical, grounded, material\n- **Quality**: Fixed (Sthira) — stable, persistent, resistant to change\n- **Symbol**: Bull — strong, patient, stubborn\n- **Body Parts**: Throat, neck, face, voice\n- **Ruling Planet**: Venus (Shukra)\n\nThe Moon is exalted in Taurus (at 3°, in Rohini Nakshatra), making this the most emotionally nurturing and mentally stable sign placement. Taurus provides the Moon with the material security and sensory comfort it needs to function optimally.\n\nTaurus natives are known for their reliability, love of comfort, and artistic sensibility. They build slowly but build to last. Their challenge is resistance to change — they can become possessive and inflexible.",
    "howToRead": "Planets in Taurus express themselves steadily and materially. Moon here is exalted (supreme emotional stability). Venus here is in own sign (peak aesthetic and material enjoyment). Check the condition of Venus (sign lord) to understand how Taurus energy manifests in the chart.",
    "significance": "Taurus represents the principle of consolidation — after Aries initiates, Taurus stabilizes and materializes. It is the sign most associated with wealth creation, voice/speech quality, and the capacity to enjoy life's pleasures.",
    "examples": [],
    "relatedTerms": [
      "venus",
      "moon",
      "rashi"
    ],
    "tags": [
      "rashi",
      "zodiac",
      "earth",
      "fixed"
    ]
  },
  {
    "termKey": "gemini",
    "domain": "vedic",
    "category": "rashi",
    "title": "Gemini — Mithuna (मिथुन)",
    "sanskrit": "मिथुन",
    "summary": "Gemini (Mithuna) is a mutable air sign ruled by Mercury, representing communication, duality, intellect, curiosity, and versatile social engagement.",
    "description": "Mithuna is the natural third house, governing communication, siblings, and short journeys. Ruled by Mercury, this sign embodies intellectual curiosity, verbal agility, and adaptability.\n\n**Key Characteristics:**\n- **Element**: Air (Vayu) — intellectual, communicative, social\n- **Quality**: Mutable (Dwiswabhava) — adaptable, flexible, changeable\n- **Symbol**: Couple/Twins — duality, partnership, exchange\n- **Body Parts**: Arms, hands, shoulders, lungs\n- **Ruling Planet**: Mercury (Budha)\n\nGemini is the sign of the communicator — writers, journalists, traders, and networkers. Rahu is considered strong in Gemini (exalted by some traditions), amplifying the sign's already restless, information-hungry nature.\n\nGemini natives excel at multitasking and social networking but may struggle with depth — they know a little about everything but may resist mastering one thing. Their gift is making complex information accessible and entertaining.",
    "howToRead": "Planets in Gemini become communicative and intellectually active. Mercury here is in own sign (sharp intellect, skilled speech). Rahu here amplifies communication to an obsessive degree. Check the 3rd house connection — Gemini energy is fundamentally about information exchange.",
    "significance": "Gemini represents the principle of connection — the bridge between self and other, between thought and speech. In the modern information age, Gemini qualities (communication, networking, data processing) are more valued than ever.",
    "examples": [],
    "relatedTerms": [
      "mercury",
      "rahu",
      "rashi"
    ],
    "tags": [
      "rashi",
      "zodiac",
      "air",
      "mutable"
    ]
  },
  {
    "termKey": "cancer",
    "domain": "vedic",
    "category": "rashi",
    "title": "Cancer — Karka (कर्क)",
    "sanskrit": "कर्क",
    "summary": "Cancer (Karka) is a cardinal water sign ruled by the Moon, representing emotions, home, mother, nurturing, intuition, and protective instincts.",
    "description": "Karka is the natural fourth house, governing home, mother, emotional security, and inner peace. Ruled by the Moon, this is the most emotionally sensitive and nurturing sign.\n\n**Key Characteristics:**\n- **Element**: Water (Jala) — emotional, intuitive, nurturing\n- **Quality**: Cardinal (Chara) — initiating (in emotional matters), protective\n- **Symbol**: Crab — protective shell, sideways approach, tenacious grip\n- **Body Parts**: Chest, breasts, stomach, digestive system\n- **Ruling Planet**: Moon (Chandra)\n\nJupiter is exalted in Cancer (at 5°), making this sign the pinnacle of wisdom combined with emotional intelligence. Mars is debilitated here (at 28°), indicating that aggressive energy struggles in an emotionally sensitive environment.\n\nCancer natives are deeply caring, intuitive, and family-oriented. They have strong memories and hold onto both positive and negative experiences. Their challenge is mood fluctuation and tendency toward emotional manipulation when hurt.",
    "howToRead": "Planets in Cancer become emotionally colored and protective. Jupiter here is exalted (wisdom through empathy). Mars here is debilitated (anger turns to passive-aggression). The Moon's condition elsewhere in the chart is critical — as Cancer's ruler, it determines how well Cancer energy functions.",
    "significance": "Cancer represents the principle of nurturing — the emotional foundation upon which all other growth depends. A strong Cancer influence in a chart indicates deep emotional intelligence and a strong connection to family, homeland, and ancestral roots.",
    "examples": [],
    "relatedTerms": [
      "moon",
      "jupiter",
      "mars",
      "rashi"
    ],
    "tags": [
      "rashi",
      "zodiac",
      "water",
      "cardinal"
    ]
  },
  {
    "termKey": "leo",
    "domain": "vedic",
    "category": "rashi",
    "title": "Leo — Simha (सिंह)",
    "sanskrit": "सिंह",
    "summary": "Leo (Simha) is a fixed fire sign ruled by the Sun, representing royalty, authority, creativity, self-expression, and the desire for recognition.",
    "description": "Simha is the natural fifth house, governing creativity, children, intelligence, and past-life merit (Poorva Punya). Ruled by the Sun, this sign embodies regal authority, creative expression, and the desire to shine.\n\n**Key Characteristics:**\n- **Element**: Fire (Agni) — passionate, dramatic, expressive\n- **Quality**: Fixed (Sthira) — determined, loyal, stubborn\n- **Symbol**: Lion — king of the jungle, majestic, commanding\n- **Body Parts**: Heart, upper back, spine\n- **Ruling Planet**: Sun (Surya)\n\nLeo is the only sign ruled by the Sun — giving it a unique solar quality of self-assurance and natural authority. No planet is exalted or debilitated in Leo, making it a neutral but powerful sign that amplifies whatever planet occupies it with confidence and visibility.\n\nLeo natives are natural performers, leaders, and creators. They need an audience and thrive when appreciated. Their challenge is ego — the line between healthy self-confidence and arrogance can be thin.",
    "howToRead": "Planets in Leo become visible and expressive. Sun here is in own sign (maximum self-assurance). Saturn here creates tension between authority (Sun/Leo) and discipline (Saturn). Check the 5th house significance — Leo energy is fundamentally about creative self-expression and legacy.",
    "significance": "Leo represents the principle of self-expression — the individual consciousness shining its light upon the world. It is the sign most associated with leadership charisma, dramatic flair, and the courage to be authentically oneself.",
    "examples": [],
    "relatedTerms": [
      "sun",
      "rashi"
    ],
    "tags": [
      "rashi",
      "zodiac",
      "fire",
      "fixed"
    ]
  },
  {
    "termKey": "virgo",
    "domain": "vedic",
    "category": "rashi",
    "title": "Virgo — Kanya (कन्या)",
    "sanskrit": "कन्या",
    "summary": "Virgo (Kanya) is a mutable earth sign ruled by Mercury, representing analysis, service, health, precision, discrimination, and practical problem-solving.",
    "description": "Kanya is the natural sixth house, governing health, service, daily routines, and overcoming obstacles. Ruled by Mercury, this sign combines intellectual rigor with practical application.\n\n**Key Characteristics:**\n- **Element**: Earth (Prithvi) — practical, detail-oriented, methodical\n- **Quality**: Mutable (Dwiswabhava) — adaptable, analytical, service-oriented\n- **Symbol**: Virgin/Maiden — purity, discrimination, refinement\n- **Body Parts**: Intestines, digestive system, nervous system\n- **Ruling Planet**: Mercury (Budha)\n\nMercury is both the ruler and exalted planet in Virgo (at 15°) — a unique distinction shared by no other sign-planet combination. This makes Virgo the absolute pinnacle of analytical and discriminative intelligence. Venus is debilitated in Virgo (at 27°), suggesting that romance and artistic expression can become overly analyzed and lose spontaneity.\n\nVirgo natives are the problem-solvers of the zodiac — meticulous, health-conscious, and service-oriented. Their challenge is perfectionism and excessive criticism (of self and others).",
    "howToRead": "Planets in Virgo become analytical and detail-focused. Mercury here is exalted (supreme analytical mind). Venus here is debilitated (overly critical in love). Virgo placements excel in healthcare, data analysis, quality control, and any field requiring precision.",
    "significance": "Virgo represents the principle of refinement — turning raw material into something useful and pure. It is the sign most associated with the scientific method, healthcare, and the discipline of daily practice.",
    "examples": [],
    "relatedTerms": [
      "mercury",
      "venus",
      "rashi"
    ],
    "tags": [
      "rashi",
      "zodiac",
      "earth",
      "mutable"
    ]
  },
  {
    "termKey": "libra",
    "domain": "vedic",
    "category": "rashi",
    "title": "Libra — Tula (तुला)",
    "sanskrit": "तुला",
    "summary": "Libra (Tula) is a cardinal air sign ruled by Venus, representing balance, partnership, justice, diplomacy, and the pursuit of harmony.",
    "description": "Tula is the natural seventh house, governing marriage, partnerships, business relationships, and open enemies. Ruled by Venus, this sign embodies the quest for balance, beauty, and fairness.\n\n**Key Characteristics:**\n- **Element**: Air (Vayu) — intellectual, social, relationship-oriented\n- **Quality**: Cardinal (Chara) — initiating (in partnerships and negotiations)\n- **Symbol**: Scales/Balance — justice, equilibrium, weighing options\n- **Body Parts**: Kidneys, lower back, skin\n- **Ruling Planet**: Venus (Shukra)\n\nSaturn is exalted in Libra (at 20°), creating the powerful combination of discipline and fairness — the ideal administrator or judge. The Sun is debilitated here (at 10°), indicating that ego and authority struggle in an environment that demands compromise and partnership.\n\nLibra natives are natural diplomats, mediators, and aesthetes. They see all sides of every issue, which can be both their greatest strength (fairness) and greatest weakness (indecision).",
    "howToRead": "Planets in Libra become relationship-oriented and fair-minded. Saturn here is exalted (justice through discipline). Sun here is debilitated (ego compromised in partnerships). Check the 7th house connection — Libra energy is fundamentally about how we relate to others.",
    "significance": "Libra represents the principle of partnership — the recognition that individual consciousness must relate to other consciousnesses. It marks the turning point of the zodiac where focus shifts from self (Aries-Virgo) to other (Libra-Pisces).",
    "examples": [],
    "relatedTerms": [
      "venus",
      "saturn",
      "sun",
      "rashi"
    ],
    "tags": [
      "rashi",
      "zodiac",
      "air",
      "cardinal"
    ]
  },
  {
    "termKey": "scorpio",
    "domain": "vedic",
    "category": "rashi",
    "title": "Scorpio — Vrishchika (वृश्चिक)",
    "sanskrit": "वृश्चिक",
    "summary": "Scorpio (Vrishchika) is a fixed water sign ruled by Mars, representing transformation, intensity, occult knowledge, research, and the cycle of death and rebirth.",
    "description": "Vrishchika is the natural eighth house, governing longevity, transformation, inheritance, hidden matters, and occult sciences. Ruled by Mars, this sign combines emotional depth with warrior-like intensity.\n\n**Key Characteristics:**\n- **Element**: Water (Jala) — emotional, intuitive, deep\n- **Quality**: Fixed (Sthira) — determined, obsessive, unyielding\n- **Symbol**: Scorpion — hidden danger, transformation, stinging truth\n- **Body Parts**: Reproductive organs, excretory system\n- **Ruling Planet**: Mars (Mangal) — Ketu is co-ruler in some traditions\n\nThe Moon is debilitated in Scorpio (at 3°), making this the most emotionally turbulent sign placement. Ketu is considered exalted here by some traditions, giving Scorpio its natural connection to spiritual transformation and occult perception.\n\nScorpio natives are intensely perceptive, emotionally powerful, and drawn to life's hidden dimensions. They are natural researchers, psychologists, and healers who understand transformation through crisis. Their challenge is trust — they can become suspicious, controlling, and vindictive when betrayed.",
    "howToRead": "Planets in Scorpio become intense and probing. Moon here is debilitated (emotional turbulence, deep psychology). Mars here is in own sign (fearless, investigative). Scorpio placements often indicate involvement with research, surgery, psychology, occult studies, or crisis management.",
    "significance": "Scorpio represents the principle of transformation — the phoenix that must burn to be reborn. It governs the most taboo and powerful aspects of existence: sexuality, death, inheritance, and the hidden workings of nature.",
    "examples": [],
    "relatedTerms": [
      "mars",
      "ketu",
      "moon",
      "rashi"
    ],
    "tags": [
      "rashi",
      "zodiac",
      "water",
      "fixed"
    ]
  },
  {
    "termKey": "sagittarius",
    "domain": "vedic",
    "category": "rashi",
    "title": "Sagittarius — Dhanu (धनु)",
    "sanskrit": "धनु",
    "summary": "Sagittarius (Dhanu) is a mutable fire sign ruled by Jupiter, representing dharma, higher learning, philosophy, long journeys, and spiritual aspiration.",
    "description": "Dhanu is the natural ninth house, governing dharma, fortune, higher education, long-distance travel, and the guru. Ruled by Jupiter, this sign embodies the quest for truth, meaning, and philosophical understanding.\n\n**Key Characteristics:**\n- **Element**: Fire (Agni) — enthusiastic, optimistic, visionary\n- **Quality**: Mutable (Dwiswabhava) — adaptable, philosophical, expansive\n- **Symbol**: Archer/Centaur — half-human, half-horse; targeting higher truth\n- **Body Parts**: Hips, thighs, liver\n- **Ruling Planet**: Jupiter (Guru)\n\nSagittarius is unique in being half-human (upper body) and half-animal (lower body) — representing the dual nature of human existence between spiritual aspiration and animal instinct. The first half (0°-15°) is called Dhanu (bow), while the second half (15°-30°) is called Mrigashira (deer head), reflecting this duality.\n\nSagittarius natives are born teachers, travelers, and seekers. They need freedom, philosophical engagement, and a sense of purpose. Their challenge is overconfidence and tactlessness — they can be blunt and preachy.",
    "howToRead": "Planets in Sagittarius become expansive and philosophical. Jupiter here is in own sign (peak wisdom and dharmic alignment). Check whether planets fall in the first half (more spiritual, human nature) or second half (more restless, animal nature) of the sign.",
    "significance": "Sagittarius represents the principle of dharma — the universal law, the teacher's path, the arrow aimed at truth. It is the sign most associated with religion, philosophy, law, and the search for ultimate meaning.",
    "examples": [],
    "relatedTerms": [
      "jupiter",
      "ketu",
      "rashi"
    ],
    "tags": [
      "rashi",
      "zodiac",
      "fire",
      "mutable"
    ]
  },
  {
    "termKey": "capricorn",
    "domain": "vedic",
    "category": "rashi",
    "title": "Capricorn — Makara (मकर)",
    "sanskrit": "मकर",
    "summary": "Capricorn (Makara) is a cardinal earth sign ruled by Saturn, representing ambition, structure, career, discipline, and methodical achievement.",
    "description": "Makara is the natural tenth house, governing career, public status, authority, and one's contribution to society. Ruled by Saturn, this sign embodies discipline, long-term planning, and the slow but sure climb to the top.\n\n**Key Characteristics:**\n- **Element**: Earth (Prithvi) — practical, ambitious, structured\n- **Quality**: Cardinal (Chara) — initiating (in career and public life)\n- **Symbol**: Crocodile/Sea-goat — navigates land and water, patient predator\n- **Body Parts**: Knees, bones, joints, skin\n- **Ruling Planet**: Saturn (Shani)\n\nMars is exalted in Capricorn (at 28°), creating a powerful combination of strategic energy (Mars) directed through disciplined structure (Saturn/Capricorn). Jupiter is debilitated here (at 5°), suggesting that expansive optimism is constrained by practical reality.\n\nCapricorn natives are the builders and administrators of the zodiac. They understand hierarchy, respect tradition, and plan for the long term. Their challenge is rigidity and emotional coldness — they can sacrifice personal relationships for professional achievement.",
    "howToRead": "Planets in Capricorn become structured and ambitious. Mars here is exalted (disciplined warrior, strategic leader). Jupiter here is debilitated (wisdom constrained by materialism). Saturn here is in own sign (maximum discipline and karmic focus). Capricorn placements indicate where the native builds lasting structures.",
    "significance": "Capricorn represents the principle of achievement — the summit of worldly success reached through persistent effort. It is the sign most associated with government, corporate leadership, and institutional authority.",
    "examples": [],
    "relatedTerms": [
      "saturn",
      "mars",
      "jupiter",
      "rashi"
    ],
    "tags": [
      "rashi",
      "zodiac",
      "earth",
      "cardinal"
    ]
  },
  {
    "termKey": "aquarius",
    "domain": "vedic",
    "category": "rashi",
    "title": "Aquarius — Kumbha (कुम्भ)",
    "sanskrit": "कुम्भ",
    "summary": "Aquarius (Kumbha) is a fixed air sign ruled by Saturn, representing humanitarianism, innovation, community, unconventional thinking, and social reform.",
    "description": "Kumbha is the natural eleventh house, governing gains, social networks, aspirations, and elder siblings. Ruled by Saturn, this sign combines intellectual rigor with humanitarian vision.\n\n**Key Characteristics:**\n- **Element**: Air (Vayu) — intellectual, social, progressive\n- **Quality**: Fixed (Sthira) — determined, stubborn in ideals, community-focused\n- **Symbol**: Water-bearer — pouring knowledge/resources for collective benefit\n- **Body Parts**: Calves, ankles, circulatory system\n- **Ruling Planet**: Saturn (Shani) — Rahu is co-ruler in some traditions\n\nAquarius is Saturn's second sign (Capricorn being the first), but while Capricorn represents Saturn's structured, hierarchical side, Aquarius represents Saturn's democratic, egalitarian side. Rahu's co-rulership adds the unconventional, innovative, and sometimes eccentric quality.\n\nAquarius natives are natural reformers, humanitarians, and group organizers. They think in terms of systems and communities rather than individuals. Their challenge is emotional detachment — they care about humanity abstractly but may struggle with individual intimacy.",
    "howToRead": "Planets in Aquarius become community-oriented and unconventional. Saturn here is in own sign (strong social conscience). Rahu here amplifies innovation and eccentricity. Check the 11th house themes — Aquarius energy is fundamentally about contribution to the larger group.",
    "significance": "Aquarius represents the principle of collective evolution — the recognition that individual progress must serve the greater good. It is the sign most associated with technology, social movements, and visionary thinking.",
    "examples": [],
    "relatedTerms": [
      "saturn",
      "rahu",
      "rashi"
    ],
    "tags": [
      "rashi",
      "zodiac",
      "air",
      "fixed"
    ]
  },
  {
    "termKey": "pisces",
    "domain": "vedic",
    "category": "rashi",
    "title": "Pisces — Meena (मीन)",
    "sanskrit": "मीन",
    "summary": "Pisces (Meena) is a mutable water sign ruled by Jupiter, representing spirituality, compassion, imagination, dissolution of ego, and the completion of the karmic cycle.",
    "description": "Meena is the natural twelfth house, governing liberation (moksha), foreign lands, losses, and spiritual transcendence. Ruled by Jupiter, this sign embodies compassion, imagination, and the dissolution of boundaries.\n\n**Key Characteristics:**\n- **Element**: Water (Jala) — emotional, spiritual, dissolving\n- **Quality**: Mutable (Dwiswabhava) — adaptable, changeable, transcendent\n- **Symbol**: Two Fish swimming in opposite directions — material vs. spiritual pull\n- **Body Parts**: Feet, lymphatic system, immune system\n- **Ruling Planet**: Jupiter (Guru)\n\nVenus is exalted in Pisces (at 27°), creating the most refined and spiritualized expression of love, art, and beauty — devotional love (bhakti) rather than romantic love. Mercury is debilitated here (at 15°), indicating that analytical thinking gives way to intuitive perception.\n\nPisces natives are deeply empathetic, spiritually inclined, and creatively gifted. They feel the suffering of others and often work in healing, artistic, or spiritual professions. Their challenge is maintaining boundaries — they absorb others' emotions and can become escapist.",
    "howToRead": "Planets in Pisces become spiritualized and boundary-dissolving. Venus here is exalted (devotional love, highest art). Mercury here is debilitated (logic replaced by intuition). Jupiter here is in own sign (deep spiritual wisdom). Pisces placements often indicate involvement with spirituality, healing, or the arts.",
    "significance": "Pisces represents the principle of dissolution — the final sign where individual ego dissolves into universal consciousness. It completes the zodiacal journey that began with Aries's 'I am' and ends with Pisces's 'We are all one.' It is the sign most associated with moksha (liberation) and unconditional compassion.",
    "examples": [],
    "relatedTerms": [
      "jupiter",
      "venus",
      "mercury",
      "rashi"
    ],
    "tags": [
      "rashi",
      "zodiac",
      "water",
      "mutable"
    ]
  },
  {
    "termKey": "ashwini",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Ashwini (अश्विनी)",
    "sanskrit": "अश्विनी",
    "summary": "The first nakshatra — ruled by Ketu, deity Ashwini Kumaras (divine physicians). Symbol: Horse's head. Known for speed, healing, and pioneering energy.",
    "description": "Ashwini spans 0°00' to 13°20' Aries and is the starting point of the entire nakshatra cycle. The Ashwini Kumaras are the celestial healers who restored youth to the aged — making this nakshatra deeply connected to medicine, healing, and rejuvenation.\n\n**Core Attributes:**\n- **Ruler**: Ketu | **Deity**: Ashwini Kumaras | **Gana**: Deva\n- **Symbol**: Horse's head | **Animal**: Male Horse | **Shakti**: Power to quickly reach things (Shidhra Vyapani)\n- **Quality**: Light (Laghu/Kshipra) — fast-acting, quick results\n\nPeople born under Ashwini are characteristically swift, handsome/beautiful, and drawn to healing professions. They have a natural capacity to initiate and complete things rapidly. Ketu's rulership gives them intuitive diagnostic ability — they can sense problems before they fully manifest.\n\n**Padas**: 1st (Aries navamsha — pure pioneer), 2nd (Taurus — practical healer), 3rd (Gemini — communicative healer), 4th (Cancer — empathetic healer)",
    "howToRead": "Ashwini natives are quick starters with natural healing ability. Check Ketu's placement for deeper insight. Strong Ashwini influence suggests careers in medicine, emergency services, sports, or any field requiring speed and initiative.",
    "significance": "As the first nakshatra, Ashwini represents the initial spark of creation — the moment consciousness enters the material world. It sets the pace and energy for the entire nakshatra system.",
    "examples": [],
    "relatedTerms": [
      "ketu",
      "aries",
      "nakshatra",
      "vimshottari_dasha"
    ],
    "tags": [
      "nakshatra",
      "ketu",
      "healing",
      "speed"
    ]
  },
  {
    "termKey": "bharani",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Bharani (भरणी)",
    "sanskrit": "भरणी",
    "summary": "The second nakshatra — ruled by Venus, deity Yama (god of death/dharma). Symbol: Yoni (female reproductive organ). Represents creation, restraint, and transformation.",
    "description": "Bharani spans 13°20' to 26°40' Aries. Despite being in fiery Aries, it is ruled by Venus and presided over by Yama — creating a unique blend of creative power, moral discipline, and transformative energy.\n\n**Core Attributes:**\n- **Ruler**: Venus | **Deity**: Yama (Lord of Death and Dharma) | **Gana**: Manushya\n- **Symbol**: Yoni (female organ of creation) | **Animal**: Male Elephant | **Shakti**: Power to take things away (Apabharani)\n- **Quality**: Fierce/Severe (Ugra/Krura) — intense, transformative\n\nBharani is the nakshatra of extremes — extreme creativity, extreme discipline, extreme transformation. The combination of Venus (pleasure, creation) and Yama (death, restraint) creates people who deeply understand both sides of existence. They are often drawn to professions involving birth, death, or transformation — midwives, morticians, therapists, artists, judges.",
    "howToRead": "Bharani natives have intense creative and transformative energy. Venus's position determines how this energy expresses — through art, relationships, or material creation. The Yama influence gives strong moral conviction and the ability to make difficult judgments.",
    "significance": "Bharani represents the womb of creation — the container where new life forms before emerging. It teaches that creation and destruction are inseparable aspects of the same cosmic process.",
    "examples": [],
    "relatedTerms": [
      "venus",
      "aries",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "venus",
      "transformation",
      "creation"
    ]
  },
  {
    "termKey": "krittika",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Krittika (कृत्तिका)",
    "sanskrit": "कृत्तिका",
    "summary": "The third nakshatra — ruled by Sun, deity Agni (fire god). Symbol: Razor/flame. Spans Aries-Taurus cusp. Known for purification, sharp intellect, and cutting through illusion.",
    "description": "Krittika spans 26°40' Aries to 10°00' Taurus — the only nakshatra straddling the fiery Aries and earthy Taurus. Ruled by the Sun and presided by Agni (sacred fire), it embodies purification through fire.\n\n**Core Attributes:**\n- **Ruler**: Sun | **Deity**: Agni (Fire God) | **Gana**: Rakshasa\n- **Symbol**: Razor, flame, or axe | **Animal**: Female Sheep | **Shakti**: Power to burn (Dahana)\n- **Quality**: Mixed (Mishra/Sadharana)\n\nKrittika is the \"star of fire\" — associated with the Pleiades star cluster (the six mothers who nursed Kartikeya/Skanda). Its energy is sharp, purifying, and sometimes harsh. Krittika natives are truthful to a fault, with razor-sharp perception that can either illuminate or wound.\n\nThe Aries portion (Pada 1) is more aggressive and pioneering, while the Taurus portion (Padas 2-4) is more nurturing and creative — like a cook who uses fire to transform raw ingredients into nourishment.",
    "howToRead": "Krittika natives are sharp, truthful, and purifying. The Sun's placement determines the strength of this fire. Pada 1 (Aries) is more aggressive; Padas 2-4 (Taurus) channel fire into creativity and nourishment. Often found in culinary arts, metallurgy, military, or spiritual purification roles.",
    "significance": "Krittika represents the transformative power of fire — Agni who purifies, illuminates, and transforms. It is the nakshatra most associated with truth-telling and the courage to cut through deception.",
    "examples": [],
    "relatedTerms": [
      "sun",
      "aries",
      "taurus",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "sun",
      "fire",
      "purification"
    ]
  },
  {
    "termKey": "rohini",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Rohini (रोहिणी)",
    "sanskrit": "रोहिणी",
    "summary": "The fourth nakshatra — ruled by Moon, deity Brahma (creator). Symbol: Ox cart/chariot. The Moon's most beloved star. Known for beauty, fertility, and material abundance.",
    "description": "Rohini spans 10°00' to 23°20' Taurus — the Moon's exaltation zone. This is considered the Moon's favorite nakshatra, and in mythology, the Moon (Chandra) was so enamored with Rohini that he neglected his other 26 nakshatra-wives, causing a cosmic scandal.\n\n**Core Attributes:**\n- **Ruler**: Moon | **Deity**: Brahma (Creator God) | **Gana**: Manushya\n- **Symbol**: Ox cart (abundance, journey) | **Animal**: Male Serpent | **Shakti**: Power of growth (Rohana)\n- **Quality**: Fixed (Dhruva/Sthira) — stable, grounding\n\nRohini is the nakshatra of material abundance, beauty, and creative growth. Lord Krishna was born under Rohini — embodying its qualities of charm, beauty, and magnetic attraction. Rohini natives are typically attractive, artistic, and prosperous.\n\nThis is one of the best nakshatras for the Moon to occupy — giving emotional stability, appreciation for beauty, and natural magnetism.",
    "howToRead": "Rohini natives are naturally attractive, creative, and materially fortunate. Moon in Rohini is one of the strongest placements — emotional stability plus creative abundance. Check Venus (Taurus lord) for additional insight. Excellent for careers in arts, agriculture, fashion, luxury goods.",
    "significance": "Rohini represents the principle of growth and beauty — Brahma's creative power manifesting in the material world. It is the nakshatra most associated with sensual beauty, fertility, and the abundance of nature.",
    "examples": [],
    "relatedTerms": [
      "moon",
      "taurus",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "moon",
      "beauty",
      "abundance"
    ]
  },
  {
    "termKey": "mrigashira",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Mrigashira (मृगशिरा)",
    "sanskrit": "मृगशिरा",
    "summary": "The fifth nakshatra — ruled by Mars, deity Soma (Moon/nectar). Symbol: Deer's head. Spans Taurus-Gemini cusp. Known for searching, curiosity, and gentle restlessness.",
    "description": "Mrigashira spans 23°20' Taurus to 6°40' Gemini. The name means \"deer's head\" — symbolizing the eternal search, gentle curiosity, and the ability to sense danger. Ruled by Mars but with Soma (Moon/nectar) as deity, it blends martial alertness with gentle seeking.\n\n**Core Attributes:**\n- **Ruler**: Mars | **Deity**: Soma (Moon god/divine nectar) | **Gana**: Deva\n- **Symbol**: Deer's head | **Animal**: Female Serpent | **Shakti**: Power of fulfillment (Prinana)\n- **Quality**: Soft/Gentle (Mridu)\n\nMrigashira natives are perpetual seekers — always searching for something (knowledge, love, meaning, beauty). The Taurus portion (Pada 1-2) searches in the material world, while the Gemini portion (Pada 3-4) searches in the intellectual realm.",
    "howToRead": "Mrigashira natives are gentle seekers with alert perception. Mars's placement shows where the search energy is directed. Taurus padas give material questing; Gemini padas give intellectual questing. Often found in research, exploration, travel writing, or detective work.",
    "significance": "Mrigashira represents the eternal quest — the deer always searching, always alert. It teaches that the journey of seeking is itself the destination.",
    "examples": [],
    "relatedTerms": [
      "mars",
      "taurus",
      "gemini",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "mars",
      "seeking",
      "curiosity"
    ]
  },
  {
    "termKey": "ardra",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Ardra (आर्द्रा)",
    "sanskrit": "आर्द्रा",
    "summary": "The sixth nakshatra — ruled by Rahu, deity Rudra (storm god). Symbol: Teardrop/diamond. Known for storms, transformation, emotional intensity, and intellectual brilliance.",
    "description": "Ardra spans 6°40' to 20°00' Gemini. The name means \"moist\" or \"fresh\" — like the earth after a thunderstorm. Ruled by Rahu and presided by Rudra (the fierce form of Shiva), this nakshatra brings destruction that clears the way for renewal.\n\n**Core Attributes:**\n- **Ruler**: Rahu | **Deity**: Rudra (Storm God, fierce Shiva) | **Gana**: Manushya\n- **Symbol**: Teardrop or diamond | **Animal**: Female Dog | **Shakti**: Power of effort (Yatna)\n- **Quality**: Sharp/Dreadful (Tikshna/Daruna)\n\nArdra natives often experience significant upheavals and transformations — storms that ultimately clear the air. They have exceptional analytical and research abilities (Rahu in Mercury's sign). Many brilliant scientists, technologists, and researchers have strong Ardra placements. The emotional intensity can manifest as both deep empathy and destructive rage.",
    "howToRead": "Ardra natives experience life through storms and renewals. Rahu's house placement shows where these upheavals occur. Strong Ardra influence suggests careers in technology, research, pharmaceuticals, or crisis management. The teardrop symbol reminds us that growth often comes through suffering.",
    "significance": "Ardra represents the transformative power of storms — Rudra's tears that cleanse and renew. Associated with the star Betelgeuse (Alpha Orionis), it connects earthly transformation to cosmic cycles.",
    "examples": [],
    "relatedTerms": [
      "rahu",
      "gemini",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "rahu",
      "transformation",
      "intellect"
    ]
  },
  {
    "termKey": "punarvasu",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Punarvasu (पुनर्वसु)",
    "sanskrit": "पुनर्वसु",
    "summary": "The seventh nakshatra — ruled by Jupiter, deity Aditi (mother of gods). Symbol: Quiver of arrows. Spans Gemini-Cancer cusp. Known for renewal, return, and restoration.",
    "description": "Punarvasu spans 20°00' Gemini to 3°20' Cancer. The name means \"return of the light\" or \"restoration\" — the ability to bounce back from adversity. Lord Rama was born under Punarvasu, embodying its qualities of dharma, return from exile, and restoration of righteous order.\n\n**Core Attributes:**\n- **Ruler**: Jupiter | **Deity**: Aditi (Mother of all Gods, boundless) | **Gana**: Deva\n- **Symbol**: Quiver of arrows (returning home) | **Animal**: Female Cat | **Shakti**: Power of wealth/abundance (Vasutva Prapana)\n- **Quality**: Movable (Chara)\n\nPunarvasu natives have a remarkable ability to recover from setbacks. Jupiter's rulership gives them optimism and faith even in difficult times. The transition from Gemini (intellectual) to Cancer (emotional) in this nakshatra represents the journey from head to heart.",
    "howToRead": "Punarvasu natives are resilient optimists with strong recovery ability. Jupiter's placement shows the source of their resilience. Gemini padas (1-3) emphasize intellectual renewal; Cancer pada (4) emphasizes emotional and spiritual renewal. Often found in counseling, spiritual teaching, and recovery-related professions.",
    "significance": "Punarvasu represents the principle of restoration — the cosmic guarantee that light returns after darkness. It is the nakshatra most associated with second chances, comebacks, and the triumph of dharma.",
    "examples": [],
    "relatedTerms": [
      "jupiter",
      "gemini",
      "cancer",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "jupiter",
      "renewal",
      "dharma"
    ]
  },
  {
    "termKey": "pushya",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Pushya (पुष्य)",
    "sanskrit": "पुष्य",
    "summary": "The eighth nakshatra — ruled by Saturn, deity Brihaspati (divine guru). Symbol: Lotus/udder/circle. Considered the most auspicious nakshatra for initiating activities.",
    "description": "Pushya spans 3°20' to 16°40' Cancer. Despite Saturn's rulership (typically considered restrictive), Pushya is celebrated as the most nourishing and auspicious of all 27 nakshatras. The combination of Saturn's discipline with Cancer's nurturing creates structured, reliable support.\n\n**Core Attributes:**\n- **Ruler**: Saturn | **Deity**: Brihaspati (Guru of the Gods) | **Gana**: Deva\n- **Symbol**: Lotus, cow's udder, wheel/circle | **Animal**: Male Sheep | **Shakti**: Power to create spiritual energy (Brahmavarchasa)\n- **Quality**: Light (Laghu/Kshipra)\n\nPushya is universally recommended in Muhurta for all auspicious activities. When Thursday (Guru's day) falls on Pushya Nakshatra, it creates \"Guru-Pushya Yoga\" — one of the most powerful positive combinations for buying gold, starting studies, and initiating ventures.",
    "howToRead": "Pushya natives are nurturing, reliable, and spiritually inclined. Saturn's placement adds discipline and longevity to Cancer's emotional depth. Pushya is the go-to nakshatra for electional astrology — check if the Moon transits Pushya for timing important decisions.",
    "significance": "Pushya is considered the 'king of nakshatras' for muhurta purposes. Its unique combination of Saturn's structure and Cancer's nurturing creates the ideal environment for any new beginning to take root and flourish.",
    "examples": [],
    "relatedTerms": [
      "saturn",
      "cancer",
      "nakshatra",
      "muhurta"
    ],
    "tags": [
      "nakshatra",
      "saturn",
      "auspicious",
      "nurturing"
    ]
  },
  {
    "termKey": "ashlesha",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Ashlesha (आश्लेषा)",
    "sanskrit": "आश्लेषा",
    "summary": "The ninth nakshatra — ruled by Mercury, deity Nagas (serpent gods). Symbol: Coiled serpent. Known for kundalini energy, hypnotic charm, mystical wisdom, and hidden power.",
    "description": "Ashlesha spans 16°40' to 30°00' Cancer — the final nakshatra in Cancer. Ruled by Mercury with Naga (serpent) deity, it combines sharp intellect with serpentine cunning, psychic perception, and the mysterious power of kundalini energy.\n\n**Core Attributes:**\n- **Ruler**: Mercury | **Deity**: Nagas (Serpent Deities) | **Gana**: Rakshasa\n- **Symbol**: Coiled serpent | **Animal**: Male Cat | **Shakti**: Power of poison (Vishasleshana)\n- **Quality**: Sharp/Dreadful (Tikshna/Daruna)\n\nAshlesha natives are hypnotically charismatic with piercing psychological insight. They can sense hidden motives and unspoken truths. The serpent energy gives them both healing power (like medical snake venom) and potential for manipulation. Many astrologers, psychologists, and occultists have prominent Ashlesha placements.",
    "howToRead": "Ashlesha natives possess deep psychological insight and kundalini potential. Mercury's placement determines how this serpentine intelligence expresses. Strong ethics transform Ashlesha's power into healing; weak ethics can lead to manipulation. Check for spiritual practices that channel kundalini constructively.",
    "significance": "Ashlesha represents the serpent power — kundalini, the coiled energy at the base of the spine. It embodies the dual nature of poison and medicine, destruction and healing, concealment and revelation.",
    "examples": [],
    "relatedTerms": [
      "mercury",
      "cancer",
      "nakshatra",
      "rahu"
    ],
    "tags": [
      "nakshatra",
      "mercury",
      "serpent",
      "mystical"
    ]
  },
  {
    "termKey": "magha",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Magha (मघा)",
    "sanskrit": "मघा",
    "summary": "The tenth nakshatra — ruled by Ketu, deity Pitris (ancestors). Symbol: Royal throne. Known for ancestral connection, authority, legacy, and regal bearing.",
    "description": "Magha spans 0°00' to 13°20' Leo — the beginning of the royal sign. Ruled by Ketu with the Pitris (ancestors) as deities, it represents the power of lineage, hereditary authority, and ancestral blessings.\n\n**Core Attributes:**\n- **Ruler**: Ketu | **Deity**: Pitris (Ancestral Spirits) | **Gana**: Rakshasa\n- **Symbol**: Royal throne room, palanquin | **Animal**: Male Rat | **Shakti**: Power to leave the body (Tyage Kshepani)\n- **Quality**: Fierce/Severe (Ugra/Krura)\n\nMagha natives carry a natural air of authority and dignity. They feel a strong connection to their ancestors and family traditions. Ketu's rulership gives them past-life wisdom and a sense of having \"been here before.\" They often hold positions of traditional authority — family heads, community leaders, or custodians of heritage.",
    "howToRead": "Magha natives have natural authority and ancestral awareness. Ketu's placement shows the past-life gifts they carry. Strong Magha influence suggests careers in governance, heritage preservation, or any role requiring gravitas and lineage-based authority. Performing Pitri (ancestor) rituals is especially beneficial.",
    "significance": "Magha represents the power of ancestry — the accumulated merit and wisdom passed down through generations. It reminds us that we stand on the shoulders of those who came before.",
    "examples": [],
    "relatedTerms": [
      "ketu",
      "leo",
      "nakshatra",
      "pitra_dosha"
    ],
    "tags": [
      "nakshatra",
      "ketu",
      "ancestors",
      "authority"
    ]
  },
  {
    "termKey": "purva_phalguni",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Purva Phalguni (पूर्वा फाल्गुनी)",
    "sanskrit": "पूर्वा फाल्गुनी",
    "summary": "The eleventh nakshatra — ruled by Venus, deity Bhaga (god of marital bliss). Symbol: Front legs of a bed/hammock. Known for love, luxury, creativity, and enjoyment.",
    "description": "Purva Phalguni spans 13°20' to 26°40' Leo. Ruled by Venus in the Sun's sign, it creates a powerful blend of royal confidence and aesthetic pleasure. Bhaga, the deity of marital happiness and prosperity, presides over this nakshatra.\n\n**Core Attributes:**\n- **Ruler**: Venus | **Deity**: Bhaga (God of Marital Bliss, Wealth) | **Gana**: Manushya\n- **Symbol**: Front legs of a bed, hammock, fig tree | **Animal**: Female Rat | **Shakti**: Power of creative procreation (Prajanana)\n- **Quality**: Fierce/Severe (Ugra/Krura)\n\nPurva Phalguni natives are pleasure-loving, creative, and socially graceful. They have a talent for bringing joy to others and creating beautiful environments. This is considered one of the most romantic nakshatras — ideal for marriage and creative partnerships.",
    "howToRead": "Purva Phalguni natives are creative, romantic, and joy-seeking. Venus's placement shows how their creative and romantic energies manifest. Strong for careers in entertainment, hospitality, fashion, arts, and any field that creates pleasure for others.",
    "significance": "Purva Phalguni represents the principle of enjoyment — the legitimate pleasure that comes from creative expression and loving partnerships. It balances Magha's duty-bound authority with Venus's capacity for joy.",
    "examples": [],
    "relatedTerms": [
      "venus",
      "leo",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "venus",
      "love",
      "creativity"
    ]
  },
  {
    "termKey": "uttara_phalguni",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Uttara Phalguni (उत्तरा फाल्गुनी)",
    "sanskrit": "उत्तरा फाल्गुनी",
    "summary": "The twelfth nakshatra — ruled by Sun, deity Aryaman (god of contracts/patronage). Symbol: Back legs of a bed. Spans Leo-Virgo cusp. Known for service, friendship, and social contracts.",
    "description": "Uttara Phalguni spans 26°40' Leo to 10°00' Virgo. While Purva Phalguni is about pleasure, Uttara Phalguni is about the responsibilities that come with relationships — contracts, service, and lasting commitments. Aryaman governs friendship and social bonds.\n\n**Core Attributes:**\n- **Ruler**: Sun | **Deity**: Aryaman (God of Patronage and Contracts) | **Gana**: Manushya\n- **Symbol**: Back legs of a bed (rest after work) | **Animal**: Male Cow/Bull | **Shakti**: Power of accumulation through marriage (Chayani)\n- **Quality**: Fixed (Dhruva/Sthira)\n\nThe transition from Leo (fixed fire) to Virgo (mutable earth) makes Uttara Phalguni natives both confident and service-oriented — they lead by serving. This is considered an excellent nakshatra for marriage, as it emphasizes commitment and mutual support.",
    "howToRead": "Uttara Phalguni natives are responsible, service-oriented leaders. Sun's placement determines the authority style. Leo padas (1) give royal generosity; Virgo padas (2-4) give practical service. Excellent for careers in HR, social work, contract law, or organizational leadership.",
    "significance": "Uttara Phalguni represents the transition from self-expression (Leo) to service (Virgo) — the realization that true leadership is servant leadership.",
    "examples": [],
    "relatedTerms": [
      "sun",
      "leo",
      "virgo",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "sun",
      "service",
      "contracts"
    ]
  },
  {
    "termKey": "hasta",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Hasta (हस्त)",
    "sanskrit": "हस्त",
    "summary": "The thirteenth nakshatra — ruled by Moon, deity Savitar (creative Sun). Symbol: Open hand/palm. Known for skill, craftsmanship, healing hands, and dexterity.",
    "description": "Hasta spans 10°00' to 23°20' Virgo. The name means \"hand\" — this is the nakshatra of manual dexterity, craftsmanship, and healing touch. Ruled by the Moon with Savitar (the creative aspect of the Sun) as deity, it combines emotional sensitivity with creative precision.\n\n**Core Attributes:**\n- **Ruler**: Moon | **Deity**: Savitar (Creative Solar Deity) | **Gana**: Deva\n- **Symbol**: Open hand, fist, palm | **Animal**: Female Buffalo | **Shakti**: Power to manifest in one's hands (Hasta Sthapaniya Agama)\n- **Quality**: Light (Laghu/Kshipra)\n\nHasta natives are skilled with their hands — surgeons, artists, craftspeople, magicians, pickpockets (in the negative expression). They have an innate ability to create, heal, and manipulate physical reality through manual skill. Palmistry is traditionally associated with this nakshatra.",
    "howToRead": "Hasta natives excel at hands-on skills. Moon's placement shows the emotional motivation behind their craftsmanship. Strong for careers in surgery, craft, massage therapy, painting, sculpture, or any profession requiring manual precision and creative touch.",
    "significance": "Hasta represents the creative power of the human hand — the tool that distinguishes humans from other beings. It embodies the principle that consciousness can manifest in physical reality through skilled action.",
    "examples": [],
    "relatedTerms": [
      "moon",
      "virgo",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "moon",
      "craftsmanship",
      "healing"
    ]
  },
  {
    "termKey": "chitra",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Chitra (चित्रा)",
    "sanskrit": "चित्रा",
    "summary": "The fourteenth nakshatra — ruled by Mars, deity Vishwakarma (divine architect). Symbol: Brilliant jewel/pearl. Spans Virgo-Libra cusp. Known for beauty, architecture, and artistic creation.",
    "description": "Chitra spans 23°20' Virgo to 6°40' Libra. Associated with the star Spica (one of the brightest stars), Chitra is the nakshatra of brilliance, beauty, and architectural creation. Vishwakarma, the divine architect who built the palaces of the gods, is the presiding deity.\n\n**Core Attributes:**\n- **Ruler**: Mars | **Deity**: Vishwakarma (Celestial Architect) | **Gana**: Rakshasa\n- **Symbol**: Brilliant jewel, shining pearl | **Animal**: Female Tiger | **Shakti**: Power to accumulate merit (Punya Cayani)\n- **Quality**: Soft/Gentle (Mridu)\n\nChitra natives are strikingly attractive and have an eye for design and beauty. Mars in Venus-ruled territory (Libra portion) creates dynamic aesthetic energy — they don't just appreciate beauty, they actively create it. Architects, fashion designers, jewelers, and graphic designers often have prominent Chitra placements.",
    "howToRead": "Chitra natives have striking appearance and creative design ability. Mars's placement shows where they direct their architectural/creative energy. Virgo padas emphasize technical precision; Libra padas emphasize aesthetic harmony. The Lahiri Ayanamsa is calibrated to Chitra (Spica) — the Chitrapaksha system.",
    "significance": "Chitra represents the principle of cosmic architecture — Vishwakarma's power to shape raw material into beautiful, functional form. The star Spica (Chitra) is the calibration point for the most widely used ayanamsa (Lahiri/Chitrapaksha).",
    "examples": [],
    "relatedTerms": [
      "mars",
      "virgo",
      "libra",
      "nakshatra",
      "lahiri_ayanamsa"
    ],
    "tags": [
      "nakshatra",
      "mars",
      "beauty",
      "architecture"
    ]
  },
  {
    "termKey": "swati",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Swati (स्वाति)",
    "sanskrit": "स्वाति",
    "summary": "The fifteenth nakshatra — ruled by Rahu, deity Vayu (wind god). Symbol: Young sprout swaying in wind. Known for independence, flexibility, trade, and self-driven growth.",
    "description": "Swati spans 6°40' to 20°00' Libra. The name means \"self-going\" or \"independent\" — a young plant that bends with the wind but never breaks. Ruled by Rahu with Vayu (wind god) as deity, it embodies freedom, adaptability, and self-made success.\n\n**Core Attributes:**\n- **Ruler**: Rahu | **Deity**: Vayu (Wind God) | **Gana**: Deva\n- **Symbol**: Young sprout, coral, sword | **Animal**: Male Buffalo | **Shakti**: Power to scatter like wind (Pradhvamsa)\n- **Quality**: Movable (Chara)\n\nSwati natives are fiercely independent, excellent at business, and remarkably adaptable. Rahu in Venus's sign gives them ambitious material desires combined with diplomatic skill. They are natural traders, negotiators, and entrepreneurs — the self-made millionaires of the nakshatra system.",
    "howToRead": "Swati natives are independent and business-savvy. Rahu's placement shows where their ambitious independence manifests. Strong for careers in international trade, diplomacy, law, or any field requiring flexibility and negotiation skill.",
    "significance": "Swati represents the principle of independent growth — the plant that grows without support, bending with storms but always springing back. It teaches resilience through flexibility rather than rigidity.",
    "examples": [],
    "relatedTerms": [
      "rahu",
      "libra",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "rahu",
      "independence",
      "trade"
    ]
  },
  {
    "termKey": "vishakha",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Vishakha (विशाखा)",
    "sanskrit": "विशाखा",
    "summary": "The sixteenth nakshatra — ruled by Jupiter, deities Indra and Agni. Symbol: Triumphal arch/forked branch. Spans Libra-Scorpio cusp. Known for determination, ambition, and single-pointed focus.",
    "description": "Vishakha spans 20°00' Libra to 3°20' Scorpio. The name means \"forked\" or \"branched\" — representing the moment of choosing a path and pursuing it with unwavering determination. Dual deities Indra (king of gods) and Agni (fire) give it both ambition and transformative power.\n\n**Core Attributes:**\n- **Ruler**: Jupiter | **Deity**: Indra-Agni (combined) | **Gana**: Rakshasa\n- **Symbol**: Triumphal archway, potter's wheel, forked branch | **Animal**: Male Tiger | **Shakti**: Power of purpose (Vyapana)\n- **Quality**: Mixed (Mishra/Sadharana)\n\nVishakha natives are goal-oriented to an extraordinary degree — once they set their sights on a target, nothing deters them. Jupiter's wisdom combined with Indra's ambition creates powerful leaders, politicians, and visionaries who shape society.",
    "howToRead": "Vishakha natives are intensely focused on their chosen goals. Jupiter's placement shows the philosophical basis of their ambition. Libra padas give diplomatic pursuit of goals; Scorpio pada (4) adds intensity and transformation. Strong for politics, leadership, and any field requiring relentless determination.",
    "significance": "Vishakha represents the principle of purposeful determination — the arrow that, once released, does not return until it hits the target. It marks the transition from Libra's diplomatic balance to Scorpio's transformative intensity.",
    "examples": [],
    "relatedTerms": [
      "jupiter",
      "libra",
      "scorpio",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "jupiter",
      "determination",
      "ambition"
    ]
  },
  {
    "termKey": "anuradha",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Anuradha (अनुराधा)",
    "sanskrit": "अनुराधा",
    "summary": "The seventeenth nakshatra — ruled by Saturn, deity Mitra (god of friendship). Symbol: Lotus, triumphant archway. Known for devotion, friendship, organization, and success in foreign lands.",
    "description": "Anuradha spans 3°20' to 16°40' Scorpio. The name means \"following Radha\" or \"subsequent success.\" Saturn's discipline in Mars's intense sign creates people who achieve through organized, persistent effort — often succeeding far from their birthplace.\n\n**Core Attributes:**\n- **Ruler**: Saturn | **Deity**: Mitra (God of Friendship and Alliances) | **Gana**: Deva\n- **Symbol**: Lotus (purity from muddy waters), triumphal arch | **Animal**: Female Deer/Hare | **Shakti**: Power of worship (Radhana)\n- **Quality**: Soft/Gentle (Mridu)\n\nAnuradha natives are loyal friends, skilled organizers, and often find their greatest success in foreign lands or outside their community. The lotus symbolism is key — they bloom beautifully despite being rooted in challenging emotional (Scorpio) waters.",
    "howToRead": "Anuradha natives succeed through devotion and organized effort. Saturn's placement shows the discipline structure. Strong for careers requiring organizational skill, international work, or devotional service. Often indicates residence or success far from birthplace.",
    "significance": "Anuradha represents the lotus principle — beauty and purity emerging from difficult circumstances. Saturn's discipline channels Scorpio's intensity into constructive achievement.",
    "examples": [],
    "relatedTerms": [
      "saturn",
      "scorpio",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "saturn",
      "friendship",
      "devotion"
    ]
  },
  {
    "termKey": "jyeshtha",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Jyeshtha (ज्येष्ठा)",
    "sanskrit": "ज्येष्ठा",
    "summary": "The eighteenth nakshatra — ruled by Mercury, deity Indra (king of gods). Symbol: Circular earring/talisman. Known for seniority, protective power, authority, and occult mastery.",
    "description": "Jyeshtha spans 16°40' to 30°00' Scorpio — the end of Scorpio and one of the gandanta (knot) points. The name means \"eldest\" or \"most senior\" — this nakshatra carries the authority and responsibility of the firstborn.\n\n**Core Attributes:**\n- **Ruler**: Mercury | **Deity**: Indra (King of Gods) | **Gana**: Rakshasa\n- **Symbol**: Circular earring, umbrella (of authority), talisman | **Animal**: Male Deer/Hare | **Shakti**: Power to rise and conquer (Arohana)\n- **Quality**: Sharp/Dreadful (Tikshna/Daruna)\n\nJyeshtha natives are natural authorities who protect those weaker than themselves. Mercury's analytical ability in Scorpio's deep waters creates exceptional psychological insight. However, the \"eldest\" archetype also carries the burden of responsibility and potential for jealousy from others.\n\nThe gandanta point (29°-30° Scorpio → 0° Sagittarius) at Jyeshtha's end is considered one of the most spiritually transformative — and challenging — birth positions.",
    "howToRead": "Jyeshtha natives carry natural authority and protective instinct. Mercury's placement shows how they exercise their analytical power. Strong for positions of seniority, protective roles, intelligence work, or occult studies. Check for gandanta birth (last pada of Jyeshtha).",
    "significance": "Jyeshtha represents the principle of protective authority — the eldest who shields the family. The gandanta at its tail marks one of astrology's most significant karmic transition points.",
    "examples": [],
    "relatedTerms": [
      "mercury",
      "scorpio",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "mercury",
      "authority",
      "protection"
    ]
  },
  {
    "termKey": "moola",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Moola (मूल)",
    "sanskrit": "मूल",
    "summary": "The nineteenth nakshatra — ruled by Ketu, deity Niritti (goddess of destruction/calamity). Symbol: Bunch of roots/tied roots. Known for uprooting, getting to the root cause, and transformative destruction.",
    "description": "Moola spans 0°00' to 13°20' Sagittarius — beginning at the gandanta point from Scorpio. The name means \"root\" — this nakshatra digs to the very foundation, uprooting whatever is not genuine. Ketu's detachment combined with Niritti's destructive power creates radical transformation.\n\n**Core Attributes:**\n- **Ruler**: Ketu | **Deity**: Niritti (Goddess of Destruction/Dissolution) | **Gana**: Rakshasa\n- **Symbol**: Bunch of roots tied together, elephant goad | **Animal**: Male Dog | **Shakti**: Power to ruin or destroy (Barhana)\n- **Quality**: Sharp/Dreadful (Tikshna/Daruna)\n\nMoola is at the galactic center — the point in the sky where the center of the Milky Way aligns. This cosmic position gives Moola natives a connection to fundamental truths and the power to strip away superficiality.\n\nMoola births (especially in the first pada/gandanta) are traditionally viewed with concern, but the mature expression of Moola is that of the researcher, philosopher, and truth-seeker who won't stop until they reach the root cause.",
    "howToRead": "Moola natives are root-cause analysts and transformative truth-seekers. Ketu's placement reveals past-life themes being uprooted. Strong for research, medicine (especially root-cause diagnosis), philosophy, archaeology, or any field requiring deep investigation.",
    "significance": "Moola represents the principle of radical investigation — going to the very root. Located at the galactic center, it connects individual transformation to cosmic evolution.",
    "examples": [],
    "relatedTerms": [
      "ketu",
      "sagittarius",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "ketu",
      "roots",
      "investigation"
    ]
  },
  {
    "termKey": "purva_ashadha",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Purva Ashadha (पूर्वा आषाढ़ा)",
    "sanskrit": "पूर्वा आषाढ़ा",
    "summary": "The twentieth nakshatra — ruled by Venus, deity Apas (water goddess). Symbol: Fan/winnowing basket. Known for invincibility, purification through water, and philosophical conviction.",
    "description": "Purva Ashadha spans 13°20' to 26°40' Sagittarius. The name means \"the former invincible\" — those who cannot be defeated. Venus's refinement in Jupiter's philosophical sign creates articulate, persuasive individuals with unshakable convictions.\n\n**Core Attributes:**\n- **Ruler**: Venus | **Deity**: Apas (Water Deity, purification) | **Gana**: Manushya\n- **Symbol**: Fan, winnowing basket, elephant's tusk | **Animal**: Male Monkey | **Shakti**: Power of invigoration (Varchograhana)\n- **Quality**: Fierce/Severe (Ugra/Krura)\n\nPurva Ashadha natives are philosophically passionate and verbally persuasive — the debaters, preachers, and advocates who argue their position with elegance and conviction. Venus in Sagittarius gives them the ability to present even harsh truths beautifully.",
    "howToRead": "Purva Ashadha natives are eloquent advocates of their beliefs. Venus's placement shows the aesthetic dimension of their convictions. Strong for law, preaching, motivational speaking, media, or any field requiring persuasive communication with philosophical depth.",
    "significance": "Purva Ashadha represents invincible conviction — the power that comes from absolute certainty in one's cause. The water purification theme suggests that this conviction must be continuously purified through self-reflection.",
    "examples": [],
    "relatedTerms": [
      "venus",
      "sagittarius",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "venus",
      "invincibility",
      "persuasion"
    ]
  },
  {
    "termKey": "uttara_ashadha",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Uttara Ashadha (उत्तरा आषाढ़ा)",
    "sanskrit": "उत्तरा आषाढ़ा",
    "summary": "The twenty-first nakshatra — ruled by Sun, deity Vishvadevas (universal gods). Symbol: Elephant's tusk/planks of a bed. Spans Sagittarius-Capricorn cusp. Known for final victory and universal leadership.",
    "description": "Uttara Ashadha spans 26°40' Sagittarius to 10°00' Capricorn. The name means \"the latter invincible\" — the final, complete victory. While Purva Ashadha has conviction, Uttara Ashadha has the follow-through to achieve total victory.\n\n**Core Attributes:**\n- **Ruler**: Sun | **Deity**: Vishvadevas (10 Universal Gods of Dharma) | **Gana**: Manushya\n- **Symbol**: Elephant's tusk, small bed | **Animal**: Male Mongoose | **Shakti**: Power of unchallengeable victory (Apradhrishya)\n- **Quality**: Fixed (Dhruva/Sthira)\n\nUttara Ashadha natives are consummate achievers — they don't just compete, they win definitively. The Sun's authority combined with Capricorn's discipline creates leaders who earn respect through demonstrated competence rather than inherited position.\n\nThis nakshatra contains the Abhijit zone (end of Uttara Ashadha/beginning of Shravana) — considered so auspicious that it's sometimes counted as a 28th nakshatra.",
    "howToRead": "Uttara Ashadha natives achieve through persistent, principled effort. Sun's placement shows the arena of victory. The Sagittarius-Capricorn transition gives both philosophical vision and practical execution. Strong for leadership, government, military, and any field requiring sustained, victorious effort.",
    "significance": "Uttara Ashadha represents the principle of final victory — the leader who wins not through force but through righteousness and sustained effort. The 10 Vishvadevas ensure that this victory serves universal dharma.",
    "examples": [],
    "relatedTerms": [
      "sun",
      "sagittarius",
      "capricorn",
      "nakshatra",
      "abhijit_muhurta"
    ],
    "tags": [
      "nakshatra",
      "sun",
      "victory",
      "leadership"
    ]
  },
  {
    "termKey": "shravana",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Shravana (श्रवण)",
    "sanskrit": "श्रवण",
    "summary": "The twenty-second nakshatra — ruled by Moon, deity Vishnu (preserver). Symbol: Three footprints/ear. Known for learning through listening, media, and connection.",
    "description": "Shravana spans 10°00' to 23°20' Capricorn. The name means \"hearing\" — this is the nakshatra of learning through listening, oral tradition, and media. Ruled by Moon with Vishnu (the preserver) as deity, it combines receptive intelligence with organizational power.\n\n**Core Attributes:**\n- **Ruler**: Moon | **Deity**: Vishnu (Preserver of the Universe) | **Gana**: Deva\n- **Symbol**: Three footprints (Vishnu's strides), ear | **Animal**: Female Monkey | **Shakti**: Power of connection (Samhanana)\n- **Quality**: Movable (Chara)\n\nShravana natives are exceptional listeners, scholars, and communicators. They learn by listening and teach by connecting ideas. In the modern context, this nakshatra is strongly associated with media, broadcasting, journalism, and telecommunications.\n\nVishnu's three footprints symbolize the ability to span vast distances — physically (travel), intellectually (connecting ideas), and spiritually (linking heaven, earth, and the underworld).",
    "howToRead": "Shravana natives learn and succeed through listening and connection. Moon's placement shows the emotional dimension of their receptive intelligence. Strong for media, education, counseling, telecommunications, or any field requiring the ability to listen deeply and connect broadly.",
    "significance": "Shravana represents the principle of learning through receptivity — the ear that hears the cosmic truth. In the Vedic tradition, shruti (that which is heard) is the highest form of knowledge.",
    "examples": [],
    "relatedTerms": [
      "moon",
      "capricorn",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "moon",
      "listening",
      "learning",
      "media"
    ]
  },
  {
    "termKey": "dhanishta",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Dhanishta (धनिष्ठा)",
    "sanskrit": "धनिष्ठा",
    "summary": "The twenty-third nakshatra — ruled by Mars, deity Vasus (8 elemental gods). Symbol: Drum/flute. Spans Capricorn-Aquarius cusp. Known for wealth, music, and rhythmic achievement.",
    "description": "Dhanishta spans 23°20' Capricorn to 6°40' Aquarius. The name means \"the wealthiest\" or \"most famous\" — this nakshatra is associated with material abundance and musical talent. Mars's energy combined with the Vasus (8 elemental gods of nature) creates dynamic, rhythmically talented achievers.\n\n**Core Attributes:**\n- **Ruler**: Mars | **Deity**: Ashtavasu (8 Vasus — elemental deities) | **Gana**: Rakshasa\n- **Symbol**: Drum (mridanga), bamboo flute | **Animal**: Female Lion | **Shakti**: Power to give abundance (Khyapayitri)\n- **Quality**: Movable (Chara)\n\nDhanishta natives often have natural musical talent — especially for percussion and rhythm. The drum symbol represents the heartbeat of the universe, and Dhanishta natives can feel and express cosmic rhythms. Wealth accumulation and fame are also strongly associated with this nakshatra.",
    "howToRead": "Dhanishta natives have musical ability and wealth potential. Mars's placement shows how they channel their dynamic energy. Capricorn padas (1-2) emphasize structured wealth building; Aquarius padas (3-4) emphasize community-oriented achievement. Strong for music, performing arts, real estate, and any field requiring rhythmic timing.",
    "significance": "Dhanishta represents the cosmic rhythm — the drum that keeps the universe in time. It bridges material abundance (Capricorn) with humanitarian distribution (Aquarius).",
    "examples": [],
    "relatedTerms": [
      "mars",
      "capricorn",
      "aquarius",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "mars",
      "wealth",
      "music"
    ]
  },
  {
    "termKey": "shatabhisha",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Shatabhisha (शतभिषा)",
    "sanskrit": "शतभिषा",
    "summary": "The twenty-fourth nakshatra — ruled by Rahu, deity Varuna (god of cosmic waters). Symbol: Empty circle/100 flowers. Known for healing, secrecy, mysticism, and aquatic connections.",
    "description": "Shatabhisha spans 6°40' to 20°00' Aquarius. The name means \"hundred physicians\" or \"hundred healers\" — this is one of the most powerful healing nakshatras. Rahu's unconventional approach combined with Varuna's cosmic waters creates healers who use alternative or hidden methods.\n\n**Core Attributes:**\n- **Ruler**: Rahu | **Deity**: Varuna (Lord of Cosmic Waters and Cosmic Order) | **Gana**: Rakshasa\n- **Symbol**: Empty circle (void), 100 flowers/stars | **Animal**: Female Horse | **Shakti**: Power of healing (Bheshaja)\n- **Quality**: Movable (Chara)\n\nShatabhisha natives are natural healers who often work through unconventional means — alternative medicine, energy healing, psychotherapy, or pharmaceutical research. The empty circle symbolizes both the void (shunya) and the wholeness that comes from perfect healing. Varuna's waters represent the healing power of the ocean and the cosmic laws that govern health.",
    "howToRead": "Shatabhisha natives have innate healing ability and are drawn to mystery. Rahu's placement shows the specific healing domain. Strong for alternative medicine, pharmaceutical research, oceanography, space science, or any field involving healing, secrets, and cosmic understanding.",
    "significance": "Shatabhisha represents the principle of cosmic healing — the 100 physicians who can cure what conventional medicine cannot. It connects individual healing to cosmic order (Varuna's Rta).",
    "examples": [],
    "relatedTerms": [
      "rahu",
      "aquarius",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "rahu",
      "healing",
      "mysticism"
    ]
  },
  {
    "termKey": "purva_bhadrapada",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Purva Bhadrapada (पूर्वा भाद्रपद)",
    "sanskrit": "पूर्वा भाद्रपद",
    "summary": "The twenty-fifth nakshatra — ruled by Jupiter, deity Aja Ekapada (one-footed cosmic serpent). Symbol: Front of a funeral cot/two-faced man. Known for intense transformation, penance, and philosophical fire.",
    "description": "Purva Bhadrapada spans 20°00' Aquarius to 3°20' Pisces. This is one of the most intense nakshatras — combining Jupiter's philosophical expansiveness with Aja Ekapada's fierce, singular focus. The funeral cot symbolism represents the transformative death of the ego.\n\n**Core Attributes:**\n- **Ruler**: Jupiter | **Deity**: Aja Ekapada (One-footed Goat, form of Rudra) | **Gana**: Manushya\n- **Symbol**: Front of a funeral cot, two-faced man, sword | **Animal**: Male Lion | **Shakti**: Power to elevate spiritually (Yajamana Udyamana)\n- **Quality**: Fierce/Severe (Ugra/Krura)\n\nPurva Bhadrapada natives are philosophical warriors — they fight for ideas, principles, and spiritual truth with extreme intensity. The two-faced man symbol represents seeing both the worldly and the spiritual simultaneously. They can be austere ascetics or fiery revolutionaries (or both).",
    "howToRead": "Purva Bhadrapada natives have intense philosophical and spiritual energy. Jupiter's placement shows the arena of their spiritual warfare. Strong for philosophy, revolutionary thought, intense spiritual practice, or any field requiring single-minded devotion to a transcendent cause.",
    "significance": "Purva Bhadrapada represents the fire of spiritual transformation — the funeral pyre that burns away the false self to reveal the eternal soul. It marks the penultimate stage of the soul's journey through the nakshatra cycle.",
    "examples": [],
    "relatedTerms": [
      "jupiter",
      "aquarius",
      "pisces",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "jupiter",
      "transformation",
      "spirituality"
    ]
  },
  {
    "termKey": "uttara_bhadrapada",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Uttara Bhadrapada (उत्तरा भाद्रपद)",
    "sanskrit": "उत्तरा भाद्रपद",
    "summary": "The twenty-sixth nakshatra — ruled by Saturn, deity Ahir Budhanya (serpent of the deep). Symbol: Back of a funeral cot/twin serpents. Known for deep wisdom, cosmic depth, and spiritual completion.",
    "description": "Uttara Bhadrapada spans 3°20' to 16°40' Pisces. Where Purva Bhadrapada is the fire of transformation, Uttara Bhadrapada is the deep peace that follows. Saturn's discipline in Jupiter's spiritual sign creates profound, controlled wisdom.\n\n**Core Attributes:**\n- **Ruler**: Saturn | **Deity**: Ahir Budhanya (Serpent of the Deep, kundalini at rest) | **Gana**: Manushya\n- **Symbol**: Back of a funeral cot, twin serpents | **Animal**: Female Cow | **Shakti**: Power of bringing rain (Varshodyamana)\n- **Quality**: Fixed (Dhruva/Sthira)\n\nUttara Bhadrapada natives have oceanic depth — they are the wise elders, the silent meditators, the deep-sea divers of consciousness. Saturn's discipline channels Pisces's boundless spirituality into controlled, practical wisdom. They often appear quiet and unassuming but possess profound inner knowledge.",
    "howToRead": "Uttara Bhadrapada natives have deep spiritual wisdom masked by outward simplicity. Saturn's placement shows where discipline meets spirituality. Strong for meditation teaching, depth psychology, research into consciousness, charitable work, or any field requiring deep, patient wisdom.",
    "significance": "Uttara Bhadrapada represents the depth of the cosmic ocean — the kundalini at rest, the wisdom that lies beneath all surface activity. It is one of the most spiritually advanced nakshatras.",
    "examples": [],
    "relatedTerms": [
      "saturn",
      "pisces",
      "nakshatra"
    ],
    "tags": [
      "nakshatra",
      "saturn",
      "depth",
      "wisdom"
    ]
  },
  {
    "termKey": "revati",
    "domain": "vedic",
    "category": "nakshatra",
    "title": "Revati (रेवती)",
    "sanskrit": "रेवती",
    "summary": "The twenty-seventh and final nakshatra — ruled by Mercury, deity Pushan (nourishing shepherd). Symbol: Fish/drum. Known for safe journeys, nourishment, completion, and cosmic compassion.",
    "description": "Revati spans 16°40' to 30°00' Pisces — the very end of the zodiac. As the last nakshatra, it represents the completion of the soul's journey through the 27 stations of consciousness. Pushan, the gentle shepherd who guides travelers and protects cattle, presides over this nurturing star.\n\n**Core Attributes:**\n- **Ruler**: Mercury | **Deity**: Pushan (Nourishing Sun God, Shepherd of Souls) | **Gana**: Deva\n- **Symbol**: Fish (swimming in cosmic waters), drum of time | **Animal**: Female Elephant | **Shakti**: Power of nourishment (Kshiradyapani)\n- **Quality**: Soft/Gentle (Mridu)\n\nRevati natives are gentle, compassionate, and nurturing — they have an instinct for guiding others safely through transitions. Mercury's intelligence in Pisces's spiritual waters creates intuitive communicators who can translate the transcendent into the understandable.\n\nAs the final nakshatra, Revati carries a sense of completion and cosmic compassion — the soul that has journeyed through all 26 previous stations now rests in universal love before the cycle begins again with Ashwini.",
    "howToRead": "Revati natives are gentle guides and nurturers. Mercury's placement shows how they communicate their compassion. Strong for counseling, hospice care, spiritual guidance, animal welfare, travel industry, or any field requiring gentle, nurturing communication and guidance through transitions.",
    "significance": "Revati represents the completion of the cosmic journey — the 27th and final station where all experiences are integrated into universal compassion. It is the nakshatra of safe arrival, of being guided home.",
    "examples": [],
    "relatedTerms": [
      "mercury",
      "pisces",
      "nakshatra",
      "ashwini"
    ],
    "tags": [
      "nakshatra",
      "mercury",
      "completion",
      "compassion"
    ]
  },
  {
    "termKey": "vimshottari_dasha",
    "domain": "vedic",
    "category": "dasha_system",
    "title": "Vimshottari Dasha (विंशोत्तरी दशा)",
    "sanskrit": "विंशोत्तरी दशा",
    "summary": "The universal 120-year dasha system based on the Moon's nakshatra at birth — the most widely used timing tool in Vedic astrology.",
    "description": "Vimshottari Dasha is the default predictive timing system used by the vast majority of Vedic astrologers worldwide. It assigns a 120-year life cycle divided among the 9 planets in a fixed sequence, with each planet ruling a specific number of years:\n\n| Planet | Years | | Planet | Years |\n|--------|-------|-|--------|-------|\n| Sun (Surya) | 6 | | Saturn (Shani) | 19 |\n| Moon (Chandra) | 10 | | Mercury (Budha) | 17 |\n| Mars (Mangal) | 7 | | Ketu | 7 |\n| Rahu | 18 | | Venus (Shukra) | 20 |\n| Jupiter (Guru) | 16 | | **Total** | **120** |\n\nThe starting planet is determined by the Moon's nakshatra at birth. Each nakshatra is ruled by one of the 9 planets, and the Mahadasha begins with that planet's period. The balance of the first dasha is calculated based on how far the Moon has traveled through the nakshatra.\n\n**Why 120 years?** The Vedic tradition considers 120 years as the maximum natural human lifespan. The system is designed so that every person experiences all 9 planetary periods within a full lifetime.",
    "howToRead": "Find the current Mahadasha (major period) and Antardasha (sub-period) from the birth chart. The Mahadasha lord's placement, strength, and house rulership determine the broad themes of that period. The Antardasha lord modulates the experience within the major period. Events are triggered when Dasha and transit alignments coincide.",
    "significance": "Vimshottari is the single most important timing tool in Vedic astrology. While transits show when planetary energy is available, the Dasha system determines whether the native is 'tuned in' to receive those energies. No prediction is complete without Dasha analysis.",
    "examples": [],
    "relatedTerms": [
      "mahadasha",
      "antardasha",
      "nakshatra",
      "moon"
    ],
    "tags": [
      "dasha",
      "timing",
      "prediction",
      "nakshatra"
    ]
  },
  {
    "termKey": "ashtottari_dasha",
    "domain": "vedic",
    "category": "dasha_system",
    "title": "Ashtottari Dasha (अष्टोत्तरी दशा)",
    "sanskrit": "अष्टोत्तरी दशा",
    "summary": "A 108-year dasha system using 8 planets (excluding Ketu). Applied when Rahu is in a Kendra or Trikona from the Lagna lord.",
    "description": "Ashtottari (\"108\") is an alternative dasha system with a total cycle of 108 years — a sacred number in Vedic tradition. It uses only 8 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu — Ketu is excluded).\n\n**Planet periods**: Sun 6, Moon 15, Mars 8, Mercury 17, Saturn 10, Jupiter 19, Rahu 12, Venus 21 = 108 years.\n\n**When to apply**: Traditional texts specify that Ashtottari should be used when Rahu occupies a Kendra (1,4,7,10) or Trikona (1,5,9) from the lord of the Lagna. Some astrologers also apply it for night births during Krishna Paksha (waning Moon).\n\nAshtottari is particularly popular in South India and is considered more suitable for certain chart configurations where Rahu plays a dominant role.",
    "howToRead": "First determine if Ashtottari applies to the chart (check Rahu's position relative to the Lagna lord). If applicable, use the Moon's nakshatra to calculate the starting balance, similar to Vimshottari but with different period lengths.",
    "significance": "Ashtottari provides a second opinion when Vimshottari predictions seem unclear. The 108-year cycle resonates with the 108 padas of nakshatras and 108 beads in a Japa mala, connecting time-keeping to spiritual practice.",
    "examples": [],
    "relatedTerms": [
      "vimshottari_dasha",
      "rahu",
      "nakshatra"
    ],
    "tags": [
      "dasha",
      "timing",
      "prediction"
    ]
  },
  {
    "termKey": "tribhagi_dasha",
    "domain": "vedic",
    "category": "dasha_system",
    "title": "Tribhagi Dasha (त्रिभागी दशा)",
    "sanskrit": "त्रिभागी दशा",
    "summary": "An 80-year one-third variation of Vimshottari — each planet's period is exactly one-third of its Vimshottari duration. Same planet sequence, compressed timeline.",
    "description": "Tribhagi means \"one-third division.\" This dasha system takes the Vimshottari sequence and reduces each planet's period to exactly one-third:\n\nSun 2, Moon 3.33, Mars 2.33, Rahu 6, Jupiter 5.33, Saturn 6.33, Mercury 5.67, Ketu 2.33, Venus 6.67 = ~40 years per cycle, 80 years for two cycles.\n\nTribhagi is used as a supplementary system alongside Vimshottari — it helps identify more precise timing windows within the broader Vimshottari periods. Some astrologers use it for shorter-term predictions.",
    "howToRead": "Calculate based on the same birth nakshatra as Vimshottari, but apply one-third period durations. Use alongside Vimshottari for more granular timing — when both systems agree on a planet's activation period, predictions are stronger.",
    "significance": "Tribhagi demonstrates the fractal nature of Vedic timing — the same planetary sequence operates at different time scales, allowing prediction at multiple levels of granularity.",
    "examples": [],
    "relatedTerms": [
      "vimshottari_dasha",
      "nakshatra"
    ],
    "tags": [
      "dasha",
      "timing",
      "prediction"
    ]
  },
  {
    "termKey": "shodashottari_dasha",
    "domain": "vedic",
    "category": "dasha_system",
    "title": "Shodashottari Dasha (षोडशोत्तरी दशा)",
    "sanskrit": "षोडशोत्तरी दशा",
    "summary": "A 116-year dasha system using 8 planets. Applied when the Lagna falls in the Hora of the Moon.",
    "description": "Shodashottari (\"116\") is a conditional dasha system applied when the Lagna (ascendant) falls in the Moon's Hora. It uses 8 planets with specific period durations totaling 116 years.\n\n**Planet periods**: Sun 11, Mars 12, Jupiter 13, Saturn 14, Ketu 15, Moon 16, Mercury 17, Venus 18 = 116 years.\n\nThis system is recommended by Parasara for specific birth conditions and provides an alternative timeline that can clarify situations where Vimshottari alone gives ambiguous results.",
    "howToRead": "Check if the birth Lagna falls in the Moon's Hora (first half of even signs, second half of odd signs). If yes, calculate Shodashottari alongside Vimshottari for comparative analysis.",
    "significance": "Shodashottari is one of several conditional dasha systems preserved in Parasara's Brihat Parasara Hora Shastra, ensuring comprehensive timing coverage for diverse chart configurations.",
    "examples": [],
    "relatedTerms": [
      "vimshottari_dasha",
      "moon",
      "d2_hora"
    ],
    "tags": [
      "dasha",
      "timing",
      "conditional"
    ]
  },
  {
    "termKey": "dwadashottari_dasha",
    "domain": "vedic",
    "category": "dasha_system",
    "title": "Dwadashottari Dasha (द्वादशोत्तरी दशा)",
    "sanskrit": "द्वादशोत्तरी दशा",
    "summary": "A 112-year dasha system. Applied when the Lagna falls in the Hora of the Sun, or for Venus-ruled Lagna nakshatras.",
    "description": "Dwadashottari (\"112\") complements Shodashottari — where Shodashottari applies to Moon Hora births, Dwadashottari applies to Sun Hora births.\n\n**Planet periods**: Sun 7, Jupiter 9, Ketu 11, Mercury 13, Rahu 15, Mars 17, Saturn 19, Moon 21 = 112 years.\n\nSome texts specify that this system should be used when the birth nakshatra of the Lagna is ruled by Venus. It is particularly valued in charts where Jupiter and Saturn play dominant roles.",
    "howToRead": "Check if the birth Lagna falls in the Sun's Hora. If yes, apply Dwadashottari for timing analysis. Compare results with Vimshottari for confirmation of key events.",
    "significance": "Dwadashottari completes the Hora-based dasha pair (Sun Hora = Dwadashottari, Moon Hora = Shodashottari), demonstrating the solar-lunar duality central to Vedic astrology.",
    "examples": [],
    "relatedTerms": [
      "vimshottari_dasha",
      "shodashottari_dasha",
      "sun"
    ],
    "tags": [
      "dasha",
      "timing",
      "conditional"
    ]
  },
  {
    "termKey": "panchottari_dasha",
    "domain": "vedic",
    "category": "dasha_system",
    "title": "Panchottari Dasha (पंचोत्तरी दशा)",
    "sanskrit": "पंचोत्तरी दशा",
    "summary": "A 105-year dasha system applied for charts with Cancer Lagna where specific conditions are met.",
    "description": "Panchottari (\"105\") is a conditional dasha system with 7 planets in a 105-year cycle. It is specifically recommended when the Lagna is Cancer and certain planetary conditions are satisfied.\n\n**Planet periods**: Sun 12, Mercury 13, Saturn 14, Mars 15, Venus 16, Moon 17, Jupiter 18 = 105 years.\n\nThis system is relatively rare in practice but is preserved in classical texts as part of the complete dasha toolkit.",
    "howToRead": "Verify Cancer Lagna and check the specific conditions from Parasara before applying. Use as a supplementary system to Vimshottari for Cancer ascendant charts.",
    "significance": "Panchottari is part of the comprehensive Parasara dasha collection — each system addresses specific chart configurations, ensuring no birth condition is left without an applicable timing tool.",
    "examples": [],
    "relatedTerms": [
      "vimshottari_dasha",
      "cancer"
    ],
    "tags": [
      "dasha",
      "timing",
      "conditional"
    ]
  },
  {
    "termKey": "chaturshitisama_dasha",
    "domain": "vedic",
    "category": "dasha_system",
    "title": "Chaturshitisama Dasha (चतुर्शीतिसम दशा)",
    "sanskrit": "चतुर्शीतिसम दशा",
    "summary": "An 84-year equal-distribution dasha system where each of 7 planets receives exactly 12 years.",
    "description": "Chaturshitisama (\"84 equal\") uniquely assigns equal 12-year periods to 7 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn). The total is 84 years (7 × 12). Rahu and Ketu are excluded.\n\nThis system is applied when the 10th lord is in the 10th house — a very specific condition indicating a strong, well-defined career. The equal distribution reflects the balanced, structured life that such a chart typically produces.",
    "howToRead": "Check if the 10th lord is in the 10th house. If yes, each planet's Dasha is exactly 12 years — making calculations straightforward. The sequence begins from the lord of the birth nakshatra.",
    "significance": "Chaturshitisama is notable for its egalitarian approach — no planet dominates. It reflects the principle that a well-positioned 10th lord creates a life of balanced, steady achievement.",
    "examples": [],
    "relatedTerms": [
      "vimshottari_dasha"
    ],
    "tags": [
      "dasha",
      "timing",
      "conditional"
    ]
  },
  {
    "termKey": "satabdika_dasha",
    "domain": "vedic",
    "category": "dasha_system",
    "title": "Satabdika Dasha (सतब्दिक दशा)",
    "sanskrit": "सतब्दिक दशा",
    "summary": "A 100-year dasha system applied when the Lagna and Moon occupy the same sign (strong chart).",
    "description": "Satabdika (\"centennial\" / 100 years) is applied when the Lagna and Moon occupy the same sign — a powerful alignment indicating strong mental-physical integration.\n\n**Planet periods**: Sun 5, Moon 5, Venus 10, Mercury 10, Jupiter 20, Mars 20, Saturn 30 = 100 years.\n\nThis system gives maximum weight to Saturn (30 years) and minimum to the luminaries (5 years each), reflecting the karmic emphasis in a chart where the body (Lagna) and mind (Moon) are in complete alignment.",
    "howToRead": "Check if the Moon is in the same sign as the Lagna. If yes, Satabdika may be the most appropriate timing system. Saturn's 30-year period dominates — indicating karmic lessons as the primary life theme.",
    "significance": "Satabdika applies to a rare and powerful birth condition (Moon conjunct Lagna) and provides a timeline heavily weighted toward karmic maturation through Saturn.",
    "examples": [],
    "relatedTerms": [
      "vimshottari_dasha",
      "saturn",
      "moon"
    ],
    "tags": [
      "dasha",
      "timing",
      "conditional"
    ]
  },
  {
    "termKey": "dwisaptati_dasha",
    "domain": "vedic",
    "category": "dasha_system",
    "title": "Dwisaptati Sama Dasha (द्विसप्तति सम दशा)",
    "sanskrit": "द्विसप्तति सम दशा",
    "summary": "A 72-year dasha system with equal 9-year periods for 8 planets. Applied when the 7th lord is in the 7th house.",
    "description": "Dwisaptati Sama (\"72 equal\") assigns 9-year periods to 8 planets (excluding Ketu). Total: 72 years. It is applied when the 7th lord occupies the 7th house — a powerful combination for partnerships and marriage.\n\nThe equal distribution (like Chaturshitisama) reflects the balanced, partnership-oriented life that a strong 7th house signifies. Each planet gets exactly 9 years, removing the dominance of any single planetary period.",
    "howToRead": "Check if the 7th lord is in the 7th house. If yes, each Dasha is 9 years. This system is particularly useful for timing marriage, business partnerships, and relationship events.",
    "significance": "Dwisaptati Sama demonstrates how specific chart strengths (strong 7th house) unlock alternative timing systems tuned to that life area.",
    "examples": [],
    "relatedTerms": [
      "vimshottari_dasha"
    ],
    "tags": [
      "dasha",
      "timing",
      "conditional"
    ]
  },
  {
    "termKey": "shastihayani_dasha",
    "domain": "vedic",
    "category": "dasha_system",
    "title": "Shastihayani Dasha (षष्टिहायणी दशा)",
    "sanskrit": "षष्टिहायणी दशा",
    "summary": "A 60-year dasha system — the shortest major system. Applied when the Sun is in the Lagna at birth.",
    "description": "Shastihayani (\"60 years\") is the most compact major dasha system. It is applied when the Sun occupies the Lagna (1st house) at birth — a condition indicating a solar-dominant personality.\n\nThe 60-year cycle means all planetary periods are experienced more quickly, reflecting the intense, accelerated life trajectory of someone with the Sun in the Ascendant. Events come faster and with greater intensity.",
    "howToRead": "Check if the Sun is in the 1st house. If yes, Shastihayani compresses life events into a 60-year cycle. Each period is shorter, so transitions happen more frequently — reflecting the Sun-in-Lagna native's intense, fast-paced life.",
    "significance": "Shastihayani's 60-year cycle connects to the Samvatsara (60-year Jupiter-Saturn cycle) and the concept that a complete life can be lived in 60 years when the soul is highly evolved.",
    "examples": [],
    "relatedTerms": [
      "vimshottari_dasha",
      "sun"
    ],
    "tags": [
      "dasha",
      "timing",
      "conditional"
    ]
  },
  {
    "termKey": "shattrimshatsama_dasha",
    "domain": "vedic",
    "category": "dasha_system",
    "title": "Shattrimshatsama Dasha (षट्त्रिंशत्सम दशा)",
    "sanskrit": "षट्त्रिंशत्सम दशा",
    "summary": "A 36-year equal-distribution dasha system — the shortest conditional system. Applied for daytime births during Shukla Paksha.",
    "description": "Shattrimshatsama (\"36 equal\") assigns very short, equal periods across 8 planets. Total cycle: 36 years — making it the most compressed conditional system.\n\nIt is applied for births occurring during the daytime in Shukla Paksha (bright half of the lunar month). The extremely short periods (4-5 years each) mean life events shift rapidly — suitable for people who experience many changes and transitions.",
    "howToRead": "Check for daytime birth + Shukla Paksha. The extremely short periods mean this system captures rapid life transitions. Best used alongside Vimshottari for cross-referencing timing.",
    "significance": "Shattrimshatsama represents the fastest karmic wheel — life experienced in rapid cycles of change and transformation. It is the temporal equivalent of a nakshatra's 4 padas compressed into a single cycle.",
    "examples": [],
    "relatedTerms": [
      "vimshottari_dasha",
      "paksha"
    ],
    "tags": [
      "dasha",
      "timing",
      "conditional"
    ]
  },
  {
    "termKey": "chara_dasha",
    "domain": "vedic",
    "category": "dasha_system",
    "title": "Chara Dasha (चर दशा)",
    "sanskrit": "चर दशा",
    "summary": "Jaimini's sign-based dasha system — uses zodiac signs (not planets) as period lords. Each sign rules for a variable duration based on its lord's position.",
    "description": "Chara Dasha is fundamentally different from all Parasara dashas because it uses zodiac signs rather than planets as period lords. Developed by Maharshi Jaimini, this system divides life into 12 sign-based periods whose duration varies based on the distance between the sign and its lord.\n\n**Key differences from Vimshottari:**\n- Period lords are signs (Aries, Taurus, etc.), not planets\n- Duration of each period varies (1-12 years) based on the lord's distance from the sign\n- The starting sign is determined by whether the Lagna is in an odd or even sign\n- Uses Jaimini's unique concept of Karakas (significators based on degree)\n\nChara Dasha is particularly powerful for predicting:\n- Career changes (when the 10th sign's dasha runs)\n- Marriage timing (7th sign's dasha)\n- Foreign travel (12th sign's dasha)\n- Health crises (8th sign's dasha)",
    "howToRead": "Calculate the starting sign based on the Lagna (odd sign → count from Aries; even sign → count from Pisces). Each sign's period duration = distance between the sign and its lord. Use alongside Vimshottari for comprehensive timing — they often confirm each other for major events.",
    "significance": "Chara Dasha represents Jaimini's revolutionary approach to timing — thinking in terms of life areas (houses/signs) rather than planetary energies. It is the primary timing tool in the Jaimini system and a valuable second opinion for Parasara practitioners.",
    "examples": [],
    "relatedTerms": [
      "vimshottari_dasha",
      "rashi"
    ],
    "tags": [
      "dasha",
      "timing",
      "jaimini",
      "sign-based"
    ]
  },
  {
    "termKey": "tribhagi_40_dasha",
    "domain": "vedic",
    "category": "dasha_system",
    "title": "Tribhagi 40 Dasha (त्रिभागी ४० दशा)",
    "sanskrit": "त्रिभागी ४०",
    "summary": "A 40-year variation of the Tribhagi system — one-third of Vimshottari's 120-year cycle, applied as a single pass without repetition.",
    "description": "Tribhagi 40 is a compact version of Tribhagi Dasha that runs a single 40-year cycle (one-third of 120) without repeating. Each planet's period is exactly one-third of its Vimshottari period:\n\nSun 2, Moon 3.33, Mars 2.33, Rahu 6, Jupiter 5.33, Saturn 6.33, Mercury 5.67, Ketu 2.33, Venus 6.67 = 40 years.\n\nThis system is used for focused short-range prediction, particularly effective for the first 40 years of life (education, marriage, career establishment) or when overlaid on any 40-year life segment.",
    "howToRead": "Apply as a single-pass 40-year overlay. Particularly useful for predicting events in the first half of life. Cross-reference with Vimshottari — when both agree on a planet's activation, predictions are strongly confirmed.",
    "significance": "Tribhagi 40 demonstrates the principle of temporal fractals in Vedic astrology — the same planetary sequence operates at 120-year, 80-year, and 40-year scales.",
    "examples": [],
    "relatedTerms": [
      "vimshottari_dasha",
      "tribhagi_dasha"
    ],
    "tags": [
      "dasha",
      "timing",
      "prediction"
    ]
  },
  {
    "termKey": "mahadasha",
    "domain": "vedic",
    "category": "dasha_level",
    "title": "Mahadasha (महादशा)",
    "sanskrit": "महादशा",
    "summary": "The major period — the broadest dasha level spanning 6-20 years. The Mahadasha lord's placement and strength define the overarching theme of that life chapter.",
    "description": "Mahadasha (literally \"great period\") is the primary level of the dasha system. In Vimshottari, each planet rules a Mahadasha of fixed duration (Sun 6 years, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19, Mercury 17, Ketu 7, Venus 20).\n\nThe Mahadasha lord's house placement, sign, strength, and aspects determine the broad themes you'll experience during that period:\n- **Mahadasha lord in a Kendra (1,4,7,10)**: Active, visible period with tangible results\n- **Mahadasha lord in a Trikona (1,5,9)**: Fortunate period with dharmic support\n- **Mahadasha lord in Dusthana (6,8,12)**: Challenging period requiring effort and transformation\n- **Mahadasha lord exalted**: Peak performance in that planet's significations\n- **Mahadasha lord debilitated**: Struggle with that planet's significations\n\nThe transition from one Mahadasha to another (called \"Dasha Sandhi\") is often a period of significant life change — relationships, career, health, and lifestyle may shift dramatically.",
    "howToRead": "Identify the current Mahadasha lord. Check its house placement (life area), sign (how it expresses), strength (Shadbala), and aspects (who influences it). The Mahadasha sets the stage — it's like the genre of the movie. The Antardasha then determines the specific scenes.",
    "significance": "The Mahadasha is the most fundamental timing unit in Vedic prediction. Major life events (marriage, career peaks, health crises, spiritual awakenings) almost always align with the Mahadasha lord's significations.",
    "examples": [],
    "relatedTerms": [
      "antardasha",
      "pratyantardasha",
      "vimshottari_dasha"
    ],
    "tags": [
      "dasha",
      "timing",
      "major_period"
    ]
  },
  {
    "termKey": "antardasha",
    "domain": "vedic",
    "category": "dasha_level",
    "title": "Antardasha (अंतर्दशा)",
    "sanskrit": "अंतर्दशा",
    "summary": "The sub-period within a Mahadasha — lasting months to a few years. The Antardasha lord modulates the Mahadasha theme with its own specific significations.",
    "description": "Antardasha (also called Bhukti) is the second level of dasha hierarchy. Each Mahadasha is divided into 9 Antardashas — one for each planet — in the same sequence as the Mahadasha but proportional to the major period's length.\n\nFor example, in a 20-year Venus Mahadasha:\n- Venus-Venus: 3 years 4 months (first)\n- Venus-Sun: 1 year\n- Venus-Moon: 1 year 8 months\n- ... and so on through all 9 planets\n\nThe Antardasha lord interacts with the Mahadasha lord in important ways:\n- **Natural friendship**: Smooth, supportive sub-period\n- **Natural enmity**: Challenging, conflicting sub-period\n- **Same planet**: Pure expression of that planet (e.g., Jupiter-Jupiter = peak wisdom period)\n- **Kendra/Trikona relationship in the chart**: Favorable results\n- **6-8 or 2-12 relationship**: Difficult combination",
    "howToRead": "Check the relationship between the Mahadasha lord and Antardasha lord — both naturally (friendship/enmity) and positionally (which houses they connect in the chart). The Antardasha modifies the Mahadasha theme — like a subplot within the main story.",
    "significance": "Antardashas provide the medium-resolution timing layer — while Mahadashas span years, Antardashas narrow events to specific months, making them essential for predicting when within a broader period an event will occur.",
    "examples": [],
    "relatedTerms": [
      "mahadasha",
      "pratyantardasha",
      "vimshottari_dasha"
    ],
    "tags": [
      "dasha",
      "timing",
      "sub_period"
    ]
  },
  {
    "termKey": "pratyantardasha",
    "domain": "vedic",
    "category": "dasha_level",
    "title": "Pratyantardasha (प्रत्यंतरदशा)",
    "sanskrit": "प्रत्यंतरदशा",
    "summary": "The sub-sub-period — lasting days to weeks. Provides fine-grained timing for pinpointing when specific events will manifest within an Antardasha.",
    "description": "Pratyantardasha is the third level of dasha subdivision. Each Antardasha is divided into 9 Pratyantardashas, again proportional in duration.\n\nAt this level, periods range from a few days to a few months. Pratyantardasha is crucial for:\n- Timing specific events (exact week of a job change, marriage date)\n- Understanding short-term emotional/health fluctuations\n- Confirming transit-based predictions with dasha support\n\nWhen the Pratyantardasha lord matches a transiting planet's signification, events crystallize with remarkable precision.",
    "howToRead": "Use Pratyantardasha for precise event timing. When Mahadasha, Antardasha, and Pratyantardasha lords all align with favorable transits, events manifest with clarity. This level is most useful when you need to narrow down 'when this month/week' rather than 'which year.'",
    "significance": "Pratyantardasha provides the temporal precision needed for muhurta (electional astrology) and event prediction. It's the level where astrological theory meets practical accuracy.",
    "examples": [],
    "relatedTerms": [
      "antardasha",
      "mahadasha",
      "sookshma_dasha"
    ],
    "tags": [
      "dasha",
      "timing",
      "precise"
    ]
  },
  {
    "termKey": "sookshma_dasha",
    "domain": "vedic",
    "category": "dasha_level",
    "title": "Sookshma Dasha (सूक्ष्मदशा)",
    "sanskrit": "सूक्ष्मदशा",
    "summary": "The micro-period — fourth level of dasha subdivision lasting hours to days. Used for extremely precise timing of critical events.",
    "description": "Sookshma (literally \"subtle\" or \"micro\") is the fourth level of dasha division. Each Pratyantardasha is subdivided into 9 Sookshma periods, which can last from a few hours to a few days.\n\nThis level of precision is used by advanced astrologers for:\n- Pinpointing exact dates for medical procedures\n- Timing critical business transactions\n- Verifying the exact moment of past events\n- Muhurta refinement when multiple dates are available\n\nAt this level, the interplay of four planetary influences (Mahadasha → Antardasha → Pratyantardasha → Sookshma) creates a highly specific energetic signature that can only manifest in one specific way.",
    "howToRead": "Sookshma-level analysis is used only for critical timing questions. Calculate the four-level dasha chain (MD-AD-PD-SD) and check all four planets' significations. This level of precision is meaningful only when combined with transit analysis.",
    "significance": "Sookshma Dasha demonstrates the Vedic conviction that time itself has quality — every moment carries a unique planetary signature that can be decoded for prediction and planning.",
    "examples": [],
    "relatedTerms": [
      "pratyantardasha",
      "prana_dasha"
    ],
    "tags": [
      "dasha",
      "timing",
      "micro"
    ]
  },
  {
    "termKey": "prana_dasha",
    "domain": "vedic",
    "category": "dasha_level",
    "title": "Prana Dasha (प्राणदशा)",
    "sanskrit": "प्राणदशा",
    "summary": "The sub-micro-period — the finest level of dasha subdivision, lasting minutes to hours. Represents the breath-level pulsation of planetary energy.",
    "description": "Prana Dasha is the fifth and finest level of dasha subdivision. Each Sookshma period is divided into 9 Prana periods lasting from minutes to a few hours.\n\nThe word \"Prana\" means \"breath\" or \"life force\" — at this level, planetary influences are operating at the level of individual breaths. This is primarily a theoretical construct, but advanced Jyotish practitioners use it for:\n- Determining the exact moment (hora) for extremely critical actions\n- Understanding why two events on the same day had different outcomes\n- Prashna (horary) chart rectification\n\nThe five-level chain (Mahadasha → Antardasha → Pratyantardasha → Sookshma → Prana) represents the complete hierarchy from decades to minutes — a fractal structure where the same planetary sequence operates at every temporal scale.",
    "howToRead": "Prana Dasha is used only in exceptional circumstances requiring minute-level timing. The five-level planetary combination creates a unique energetic fingerprint for each moment. In practice, most astrologers work with the first three levels (MD-AD-PD) and use Sookshma/Prana only for verification.",
    "significance": "Prana Dasha embodies the ultimate refinement of Vedic time analysis — the idea that every breath occurs under a specific five-planet combination. It connects the macrocosm (120-year cycle) to the microcosm (individual breath).",
    "examples": [],
    "relatedTerms": [
      "sookshma_dasha",
      "pratyantardasha"
    ],
    "tags": [
      "dasha",
      "timing",
      "finest"
    ]
  },
  {
    "termKey": "d1_rashi",
    "domain": "vedic",
    "category": "divisional_chart",
    "title": "D1 — Rashi Chart (राशि कुंडली)",
    "sanskrit": "राशि कुंडली",
    "summary": "The birth chart — the master chart showing planetary positions in the 12 zodiac signs at the moment of birth. The foundation of all Vedic astrological analysis.",
    "description": "The D1 Rashi chart is the primary birth chart (Janma Kundali) — the snapshot of the heavens at the exact moment of birth. It is the foundation upon which all other divisional charts are built.\n\n**What it shows:**\n- Positions of all 9 planets (Sun through Ketu) in the 12 signs\n- The Lagna (ascendant) — the sign rising on the eastern horizon at birth\n- House positions (Bhavas) determined by the Lagna\n- Aspects between planets and their mutual influences\n- Yogas, doshas, and special combinations\n\nThe D1 chart answers the broadest life questions: personality, career direction, marriage potential, health constitution, wealth capacity, and spiritual inclination. Every other divisional chart is derived mathematically from the D1 positions.\n\n**Shodashavarga weight**: 3.5 points (highest individual weight among the 16 vargas)",
    "howToRead": "Start with the Lagna lord — its placement reveals the native's overall life direction. Then check the Moon (mind) and Sun (soul). Examine house lords and their placements for each life area. The D1 is always the primary reference — no divisional chart overrides a clear D1 indication.",
    "significance": "The D1 is the 'trunk' from which all divisional chart 'branches' grow. A strong D1 can compensate for weak divisional charts, but weak D1 indications are rarely overridden by strong divisional charts. It is the single most important chart in Jyotish.",
    "examples": [],
    "relatedTerms": [
      "d9_navamsha",
      "rashi",
      "kundali"
    ],
    "tags": [
      "divisional_chart",
      "birth_chart",
      "fundamental"
    ]
  },
  {
    "termKey": "d2_hora",
    "domain": "vedic",
    "category": "divisional_chart",
    "title": "D2 — Hora Chart (होरा)",
    "sanskrit": "होरा",
    "summary": "The wealth chart — divides each sign into two halves (Sun's Hora and Moon's Hora), revealing the native's capacity for wealth accumulation.",
    "description": "The D2 Hora chart divides each zodiac sign into two equal halves of 15° each:\n- **Sun's Hora** (0°-15° of odd signs, 15°-30° of even signs): Active, self-earned wealth\n- **Moon's Hora** (15°-30° of odd signs, 0°-15° of even signs): Inherited, passive, or relationship-based wealth\n\nA strong D2 chart (benefics in Sun's Hora for self-made wealth, or Moon's Hora for inherited wealth) indicates good financial capacity. The 2nd and 11th houses in D2 are particularly important.\n\n**Shodashavarga weight**: 1.5 points\n\nThe word \"Hora\" itself derives from \"Ahoratra\" (day-night) with the first and last syllables removed — symbolizing the Sun-Moon duality that governs all material existence.",
    "howToRead": "Check whether key wealth indicators (2nd lord, 11th lord, Jupiter, Venus) fall in Sun's Hora (self-earned) or Moon's Hora (received/inherited). More planets in one Hora suggests the dominant wealth pathway.",
    "significance": "D2 provides the first filter for wealth analysis — before examining detailed financial yogas, check the D2 to understand the fundamental wealth capacity and primary wealth source.",
    "examples": [],
    "relatedTerms": [
      "d1_rashi",
      "hora_time"
    ],
    "tags": [
      "divisional_chart",
      "wealth",
      "hora"
    ]
  },
  {
    "termKey": "d3_drekkana",
    "domain": "vedic",
    "category": "divisional_chart",
    "title": "D3 — Drekkana Chart (द्रेक्काण)",
    "sanskrit": "द्रेक्काण",
    "summary": "The siblings and courage chart — divides each sign into 3 equal parts of 10°, revealing sibling relationships, courage, and initiative.",
    "description": "The D3 Drekkana chart divides each sign into three decanates of 10° each. Each decanate maps to a sign of the same element:\n- 1st Drekkana (0°-10°): Same sign (self)\n- 2nd Drekkana (10°-20°): 5th sign from it (co-borns, younger siblings)\n- 3rd Drekkana (20°-30°): 9th sign from it (elder siblings, courage)\n\n**Shodashavarga weight**: 1 point\n\nThe D3 is particularly important for:\n- Sibling relationships (number, nature, fortune of siblings)\n- Courage and initiative (3rd house significations)\n- Short journeys and communication\n- Self-expression and artistic abilities",
    "howToRead": "Check the 3rd house, its lord, and Mars (natural significator of siblings and courage) in the D3 chart. Benefic influences suggest harmonious sibling relationships and natural courage. Malefic influences may indicate sibling conflicts or challenges requiring courage to overcome.",
    "significance": "D3 provides specific insight into the 3rd house domain — an area that the D1 alone cannot fully detail. For questions about siblings and personal courage, D3 is the mandatory supplementary chart.",
    "examples": [],
    "relatedTerms": [
      "d1_rashi",
      "mars"
    ],
    "tags": [
      "divisional_chart",
      "siblings",
      "courage"
    ]
  },
  {
    "termKey": "d4_chaturthamsha",
    "domain": "vedic",
    "category": "divisional_chart",
    "title": "D4 — Chaturthamsha Chart (चतुर्थांश)",
    "sanskrit": "चतुर्थांश",
    "summary": "The property and fortune chart — divides each sign into 4 equal parts, revealing real estate fortune, vehicles, and overall material comfort.",
    "description": "The D4 Chaturthamsha chart divides each sign into four quarters of 7°30' each. It specifically examines the 4th house significations: property, vehicles, mother, education, and emotional happiness.\n\n**Shodashavarga weight**: 0.5 points\n\nKey areas of analysis:\n- Real estate fortune (buying, selling, building)\n- Vehicle acquisition and fortune with conveyances\n- Overall material comfort and domestic happiness\n- Relationship with mother and maternal property",
    "howToRead": "Check the 4th house, its lord, Moon (natural 4th house significator), and Venus (comfort indicator) in the D4. Strong placements suggest property wealth and domestic comfort. Weak or afflicted placements may indicate challenges with real estate or maternal relationships.",
    "significance": "D4 is essential for property-related consultations — a common question for astrologers. Before advising on real estate timing, always verify D4 chart strength.",
    "examples": [],
    "relatedTerms": [
      "d1_rashi",
      "moon"
    ],
    "tags": [
      "divisional_chart",
      "property",
      "vehicles"
    ]
  },
  {
    "termKey": "d7_saptamsha",
    "domain": "vedic",
    "category": "divisional_chart",
    "title": "D7 — Saptamsha Chart (सप्तांश)",
    "sanskrit": "सप्तांश",
    "summary": "The children chart — divides each sign into 7 equal parts, revealing progeny fortune, number of children, and relationship with offspring.",
    "description": "The D7 Saptamsha chart divides each sign into seven parts of 4°17' each. It specifically examines the 5th house domain: children, creativity, intelligence, and past-life merit.\n\n**Shodashavarga weight**: 0.5 points\n\nKey areas of analysis:\n- Number and nature of children\n- Fertility and conception potential\n- Children's fortune and relationship with the native\n- Creative intelligence and speculative ability",
    "howToRead": "Check the 5th house, its lord, and Jupiter (Putrakaraka — natural significator of children) in the D7. Strong placements indicate easy conception and harmonious relationships with children. Malefic influences may suggest delayed conception, fewer children, or challenging parent-child dynamics.",
    "significance": "D7 is the mandatory chart for all progeny-related questions. Indian culture places enormous importance on children, making D7 one of the most frequently consulted divisional charts in practice.",
    "examples": [],
    "relatedTerms": [
      "d1_rashi",
      "jupiter"
    ],
    "tags": [
      "divisional_chart",
      "children",
      "progeny"
    ]
  },
  {
    "termKey": "d9_navamsha",
    "domain": "vedic",
    "category": "divisional_chart",
    "title": "D9 — Navamsha Chart (नवांश)",
    "sanskrit": "नवांश",
    "summary": "The most important divisional chart after D1 — the marriage, dharma, and inner nature chart. Divides each sign into 9 parts mapping to the 108 nakshatra padas.",
    "description": "The D9 Navamsha chart divides each sign into 9 equal parts of 3°20' — exactly matching the 108 nakshatra padas. This makes D9 the direct extension of the nakshatra system into chart form.\n\n**Shodashavarga weight**: 3 points (second highest after D1)\n\nThe D9 is called the \"fruit of the tree\" — if D1 is the tree (potential), D9 shows the fruit (actualized results). Key areas:\n\n- **Marriage**: D9 is the primary chart for marriage analysis. The 7th house, Venus (wife in male charts), Jupiter (husband in female charts), and the Navamsha Lagna reveal the nature, timing, and quality of marriage.\n- **Dharma & Inner Nature**: The Navamsha shows the soul's true nature — who you really are beneath the D1 personality.\n- **Strength Verification**: A planet strong in D1 but weak in D9 may not deliver full results. A planet weak in D1 but strong in D9 (Vargottama — same sign in both) gains tremendous strength.\n\n**Vargottama**: When a planet occupies the same sign in both D1 and D9, it is called Vargottama — one of the most powerful positive indicators, suggesting that the planet's external expression and inner nature are aligned.",
    "howToRead": "Always read D9 alongside D1 — never in isolation. Check: (1) Navamsha Lagna sign for inner nature. (2) 7th house for marriage. (3) Vargottama planets for extra strength. (4) Pushkara Navamsha positions for exceptional results. D9 confirms or modifies D1 predictions.",
    "significance": "D9 is considered almost equal in importance to D1. No marriage prediction, no strength assessment, and no dharmic analysis is complete without Navamsha examination. Many astrologers consider a chart only truly strong if both D1 and D9 are favorable.",
    "examples": [],
    "relatedTerms": [
      "d1_rashi",
      "pada",
      "nakshatra"
    ],
    "tags": [
      "divisional_chart",
      "marriage",
      "dharma",
      "navamsha"
    ]
  },
  {
    "termKey": "d10_dashamsha",
    "domain": "vedic",
    "category": "divisional_chart",
    "title": "D10 — Dashamsha Chart (दशांश)",
    "sanskrit": "दशांश",
    "summary": "The career chart — divides each sign into 10 equal parts, revealing profession, public status, career achievements, and professional reputation.",
    "description": "The D10 Dashamsha chart divides each sign into 10 parts of 3° each. It specifically examines the 10th house domain: career, profession, public reputation, and contribution to society.\n\n**Shodashavarga weight**: 1 point\n\nKey areas of analysis:\n- Nature of profession and career direction\n- Professional success, achievements, and recognition\n- Relationship with authority figures and bosses\n- Public reputation and social standing\n\nD10 is essential for career guidance — while D1 shows general career potential, D10 reveals the specific professional domain, the level of success achievable, and the timing of career peaks and valleys.",
    "howToRead": "Check the 10th house lord, the Lagna lord, and the Sun (natural career significator) in D10. The D10 Lagna sign reveals the native's professional persona. Strong benefics in the D10 10th house indicate high professional achievement. Saturn well-placed gives longevity and stability in career.",
    "significance": "D10 is the go-to chart for all career consultations. In modern life, career is a primary concern — D10 provides the specific, actionable insight that D1 alone cannot offer for professional guidance.",
    "examples": [],
    "relatedTerms": [
      "d1_rashi",
      "sun",
      "saturn"
    ],
    "tags": [
      "divisional_chart",
      "career",
      "profession"
    ]
  },
  {
    "termKey": "d12_dwadashamsha",
    "domain": "vedic",
    "category": "divisional_chart",
    "title": "D12 — Dwadashamsha Chart (द्वादशांश)",
    "sanskrit": "द्वादशांश",
    "summary": "The parents chart — divides each sign into 12 equal parts, revealing the native's relationship with parents and parental lineage.",
    "description": "The D12 Dwadashamsha chart divides each sign into 12 parts of 2°30' each. It examines parental relationships and ancestral patterns.\n\n**Shodashavarga weight**: 0.5 points\n\nKey areas:\n- Father's nature and fortune (Sun and 9th house in D12)\n- Mother's nature and fortune (Moon and 4th house in D12)\n- Parental health and longevity\n- Ancestral patterns and inherited traits",
    "howToRead": "Check the Sun (father) and Moon (mother) in D12 for parental relationship insights. The 4th house reveals maternal dynamics, the 9th/10th houses reveal paternal dynamics. Afflictions suggest difficult parental relationships or parental health issues.",
    "significance": "D12 is the specific chart for understanding parental karma — the gifts and challenges inherited from the family lineage.",
    "examples": [],
    "relatedTerms": [
      "d1_rashi",
      "sun",
      "moon"
    ],
    "tags": [
      "divisional_chart",
      "parents",
      "lineage"
    ]
  },
  {
    "termKey": "d16_shodashamsha",
    "domain": "vedic",
    "category": "divisional_chart",
    "title": "D16 — Shodashamsha Chart (षोडशांश)",
    "sanskrit": "षोडशांश",
    "summary": "The vehicles and comforts chart — divides each sign into 16 parts, revealing happiness from vehicles, conveyances, and material comforts.",
    "description": "The D16 Shodashamsha chart divides each sign into 16 parts of 1°52.5'. It examines the native's fortune with vehicles, travel conveyances, and material comforts.\n\n**Shodashavarga weight**: 2 points\n\nIn modern context, D16 extends beyond traditional vehicles (horses, elephants, chariots) to include cars, aircraft, ships, and all modes of transportation. It also governs the happiness derived from material possessions and physical comfort.",
    "howToRead": "Check the 4th house (comfort), Venus (luxury), and Mars (vehicles) in D16. Strong placements indicate fortune with vehicles and material comfort. This chart is particularly consulted for vehicle purchase timing.",
    "significance": "D16 carries a relatively high Shodashavarga weight (2 points), indicating its importance in overall chart strength assessment.",
    "examples": [],
    "relatedTerms": [
      "d1_rashi",
      "d4_chaturthamsha"
    ],
    "tags": [
      "divisional_chart",
      "vehicles",
      "comfort"
    ]
  },
  {
    "termKey": "d20_vimshamsha",
    "domain": "vedic",
    "category": "divisional_chart",
    "title": "D20 — Vimshamsha Chart (विंशांश)",
    "sanskrit": "विंशांश",
    "summary": "The spiritual progress chart — divides each sign into 20 parts, revealing spiritual inclinations, religious practices, and upasana (worship) patterns.",
    "description": "The D20 Vimshamsha chart divides each sign into 20 parts of 1°30'. It specifically examines the native's spiritual life — the type of spiritual practice suitable, the depth of spiritual inclination, and progress toward liberation.\n\n**Shodashavarga weight**: 0.5 points\n\nKey areas:\n- Type of spiritual practice (meditation, mantra, devotion, service)\n- Guru connection and spiritual lineage\n- Progress in spiritual evolution\n- Religious inclinations and preferred deities",
    "howToRead": "Check Jupiter (spiritual wisdom), Ketu (liberation), and the 9th house (dharma) in D20. Strong placements indicate natural spiritual inclination. The D20 Lagna sign can suggest the most suitable spiritual path or deity for the native.",
    "significance": "D20 is the specialist chart for spiritual guidance — an area where Vedic astrology uniquely excels compared to other astrological traditions.",
    "examples": [],
    "relatedTerms": [
      "d1_rashi",
      "jupiter",
      "ketu"
    ],
    "tags": [
      "divisional_chart",
      "spirituality",
      "worship"
    ]
  },
  {
    "termKey": "d24_chaturvimshamsha",
    "domain": "vedic",
    "category": "divisional_chart",
    "title": "D24 — Chaturvimshamsha Chart (चतुर्विंशांश)",
    "sanskrit": "चतुर्विंशांश",
    "summary": "The education chart — divides each sign into 24 parts, revealing academic abilities, learning style, and educational achievements.",
    "description": "The D24 Chaturvimshamsha chart divides each sign into 24 parts of 1°15'. It examines the native's educational fortune, academic abilities, and the type of knowledge they're naturally drawn to.\n\n**Shodashavarga weight**: 0.5 points\n\nKey areas:\n- Academic achievement and educational level\n- Fields of study and natural intellectual strengths\n- Learning style and knowledge acquisition patterns\n- Teaching ability and knowledge transmission",
    "howToRead": "Check Mercury (intellect), Jupiter (higher learning), and the 4th/5th houses in D24. Strong placements indicate academic success and intellectual gifts. The D24 Lagna sign can suggest the most suitable field of study.",
    "significance": "D24 is essential for educational guidance — helping astrologers advise students on suitable fields of study and optimal timing for academic pursuits.",
    "examples": [],
    "relatedTerms": [
      "d1_rashi",
      "mercury",
      "jupiter"
    ],
    "tags": [
      "divisional_chart",
      "education",
      "learning"
    ]
  },
  {
    "termKey": "d27_saptavimshamsha",
    "domain": "vedic",
    "category": "divisional_chart",
    "title": "D27 — Saptavimshamsha Chart (सप्तविंशांश)",
    "sanskrit": "सप्तविंशांश",
    "summary": "The strength and weakness chart — divides each sign into 27 parts (matching the nakshatras), revealing inherent strengths and vulnerabilities.",
    "description": "The D27 Saptavimshamsha chart divides each sign into 27 parts of 1°6.67' — naturally corresponding to the 27 nakshatras. It examines the native's inherent strengths and weaknesses at a fundamental level.\n\n**Shodashavarga weight**: 0.5 points\n\nThis chart is unique because its 27-fold division mirrors the nakshatra system, creating a direct link between divisional chart analysis and nakshatra-based assessment. It reveals the core constitutional strength of the native.",
    "howToRead": "Check the Lagna lord and key planets in D27 for inherent strength assessment. This chart is primarily used for confirming the overall robustness of a chart — a strong D27 indicates resilient constitution.",
    "significance": "D27's 27-fold division mirrors the nakshatra system, bridging divisional chart analysis with nakshatra-based prediction.",
    "examples": [],
    "relatedTerms": [
      "d1_rashi",
      "nakshatra"
    ],
    "tags": [
      "divisional_chart",
      "strength",
      "constitution"
    ]
  },
  {
    "termKey": "d30_trimshamsha",
    "domain": "vedic",
    "category": "divisional_chart",
    "title": "D30 — Trimshamsha Chart (त्रिंशांश)",
    "sanskrit": "त्रिंशांश",
    "summary": "The misfortune and health chart — an unequal division of each sign into 5 parts, revealing susceptibility to illness, accidents, and adversity.",
    "description": "The D30 Trimshamsha chart divides each sign into 5 unequal parts of 5°, 5°, 8°, 7°, and 5° — assigned to Mars, Saturn, Jupiter, Mercury, and Venus respectively (order varies by odd/even signs). This unequal division is unique among the 16 vargas.\n\n**Shodashavarga weight**: 1 point\n\nKey areas:\n- Susceptibility to illness and chronic health conditions\n- Accident proneness and injury patterns\n- Types of misfortune likely to be encountered\n- The nature of challenges and how to overcome them\n\nD30 is sometimes called the \"evil\" chart — but more accurately, it maps the native's vulnerability landscape, allowing preventive measures.",
    "howToRead": "Check malefic placements (Mars, Saturn, Rahu, Ketu) in D30 — their house positions indicate specific health/misfortune vulnerabilities. Benefic placements (Jupiter, Venus) show protective factors. The 6th and 8th houses in D30 are critical for health assessment.",
    "significance": "D30 is the diagnostic chart for potential misfortunes — essential for health-focused consultations and for recommending preventive remedies.",
    "examples": [],
    "relatedTerms": [
      "d1_rashi",
      "mars",
      "saturn"
    ],
    "tags": [
      "divisional_chart",
      "health",
      "misfortune"
    ]
  },
  {
    "termKey": "d40_chatvarimshamsha",
    "domain": "vedic",
    "category": "divisional_chart",
    "title": "D40 — Chatvarimshamsha Chart (चत्वारिंशांश)",
    "sanskrit": "चत्वारिंशांश",
    "summary": "The auspicious/inauspicious deeds chart — divides each sign into 40 parts, revealing the karmic merit (Shubha Phala) of past-life actions.",
    "description": "The D40 chart divides each sign into 40 parts of 0°45'. It examines the results of meritorious deeds (good karma) from past lives — the reserve of positive karma that manifests as seemingly unearned good fortune in the current life.\n\n**Shodashavarga weight**: 0.5 points\n\nD40 specifically reveals:\n- Accumulated positive karma from past lives\n- Unearned advantages and privileges\n- Natural protection from misfortune\n- The \"lucky breaks\" factor in a person's life",
    "howToRead": "Check Jupiter (grace), the 9th house (past-life merit), and benefic placements in D40. Strong configurations indicate significant accumulated positive karma. Weak D40 may indicate a life requiring more self-effort with fewer 'lucky breaks.'",
    "significance": "D40 provides insight into the karmic credit balance — why some people seem blessed with unearned advantages while others face constant challenges despite good efforts.",
    "examples": [],
    "relatedTerms": [
      "d1_rashi",
      "d45_panchavimshamsha"
    ],
    "tags": [
      "divisional_chart",
      "karma",
      "merit"
    ]
  },
  {
    "termKey": "d45_panchavimshamsha",
    "domain": "vedic",
    "category": "divisional_chart",
    "title": "D45 — Akshavedamsha Chart (अक्षवेदांश)",
    "sanskrit": "अक्षवेदांश",
    "summary": "The character and conduct chart — divides each sign into 45 parts, revealing ethical character, behavioral patterns, and moral fiber.",
    "description": "The D45 chart divides each sign into 45 parts of 0°40'. It examines the native's ethical character, behavioral patterns, and the moral dimension of their actions.\n\n**Shodashavarga weight**: 0.5 points\n\nD45 complements D40 — where D40 shows accumulated merit, D45 shows current-life character and conduct. Together, they paint a complete picture of the native's karmic trajectory: past merit (D40) plus current conduct (D45) = future destiny.",
    "howToRead": "Check the Lagna lord, Jupiter (dharma), and the 1st/9th houses in D45 for character assessment. Strong, well-placed benefics indicate strong moral character. Afflictions may indicate ethical challenges or behavioral patterns requiring conscious correction.",
    "significance": "D45 addresses the moral dimension of astrology — a critical aspect in Vedic tradition where dharmic conduct is seen as the primary determinant of future karma.",
    "examples": [],
    "relatedTerms": [
      "d1_rashi",
      "d40_chatvarimshamsha"
    ],
    "tags": [
      "divisional_chart",
      "character",
      "ethics"
    ]
  },
  {
    "termKey": "d60_shashtiamsha",
    "domain": "vedic",
    "category": "divisional_chart",
    "title": "D60 — Shashtiamsha Chart (षष्ठिांश)",
    "sanskrit": "षष्ठिांश",
    "summary": "The past-life karma chart — the finest divisional chart dividing each sign into 60 parts. Reveals the most specific past-life influences shaping the current incarnation.",
    "description": "The D60 Shashtiamsha chart divides each sign into 60 parts of 0°30' (30 arc-minutes) — the finest division in the Shodashavarga system. Each of the 60 divisions has a specific name and deity, describing the exact nature of past-life karma affecting the current life.\n\n**Shodashavarga weight**: 4 points (the HIGHEST weight — tied for most important)\n\nThe 60 divisions carry names like \"Ghora\" (terrible), \"Rakshasa\" (demonic), \"Deva\" (divine), \"Kubera\" (wealthy), \"Kaala\" (death), \"Amrita\" (nectar), etc. The division occupied by key planets reveals the specific flavor of past-life karma influencing their significations.\n\n**Critical precision requirement**: D60 requires extremely accurate birth time — a 30-second error in birth time shifts the D60 positions by one division. This makes D60 both the most revealing and the most demanding chart.",
    "howToRead": "D60 requires confirmed birth time accuracy within 1-2 minutes. Check the Lagna division name and key planets' D60 positions. Planets in 'Deva' or 'Amrita' divisions carry positive past-life karma. Planets in 'Ghora' or 'Rakshasa' divisions indicate challenging karmic debts. D60 is the ultimate chart for understanding 'why this life is the way it is.'",
    "significance": "D60 carries the highest individual Shodashavarga weight (4 points), indicating its supreme importance in chart strength assessment. Parasara calls D60 the most important varga for determining past-life karma — the 'seed' from which the current life's 'tree' grows.",
    "examples": [],
    "relatedTerms": [
      "d1_rashi",
      "d9_navamsha"
    ],
    "tags": [
      "divisional_chart",
      "past_life",
      "karma",
      "finest"
    ]
  },
  {
    "termKey": "gaja_kesari_yoga",
    "domain": "vedic",
    "category": "yoga",
    "title": "Gaja Kesari Yoga (गजकेसरी योग)",
    "sanskrit": "गजकेसरी योग",
    "summary": "Jupiter in a Kendra (1st, 4th, 7th, or 10th) from the Moon — one of the most celebrated yogas, bestowing wisdom, wealth, and lasting fame.",
    "description": "Gaja Kesari (Elephant-Lion) Yoga forms when Jupiter occupies a Kendra house (1, 4, 7, or 10) from the Moon. The name evokes the majestic combination of an elephant's wisdom and a lion's courage.\n\n**Formation conditions:**\n- Jupiter must be in houses 1, 4, 7, or 10 counted from the Moon's position\n- Both Jupiter and Moon should be reasonably strong (not debilitated, combust, or heavily afflicted)\n- Stronger results when Jupiter is in its own sign, exalted, or in a friendly sign\n\n**Results:** Lasting fame beyond one's lifetime, natural wisdom, wealth that grows steadily, respected position in society, many supporters and followers, and good health. The native becomes a person whose advice is sought and whose reputation endures.\n\n**Important caveat:** This yoga is quite common (Jupiter is in a Kendra from Moon for roughly 33% of people). The strength of results depends on the dignity and overall condition of both Jupiter and Moon.",
    "howToRead": "Check Jupiter's position relative to the Moon. If in houses 1, 4, 7, or 10 from the Moon, Gaja Kesari is present. Then assess quality: Is Jupiter strong? Is Moon strong? Are they aspected by malefics? A dignified Gaja Kesari is far more powerful than a technically present but afflicted one.",
    "significance": "Gaja Kesari is the most frequently mentioned yoga in popular astrology. While common, its full activation requires planetary strength — teaching the important lesson that yoga presence alone doesn't guarantee results; planetary condition matters.",
    "examples": [],
    "relatedTerms": [
      "jupiter",
      "moon",
      "raja_yoga"
    ],
    "tags": [
      "yoga",
      "benefic",
      "jupiter",
      "moon",
      "fame"
    ]
  },
  {
    "termKey": "guru_mangal_yoga",
    "domain": "vedic",
    "category": "yoga",
    "title": "Guru Mangal Yoga (गुरु मंगल योग)",
    "sanskrit": "गुरु मंगल योग",
    "summary": "Jupiter-Mars conjunction or mutual aspect — combining wisdom with energy, creating dynamic, righteous action and success in leadership and property.",
    "description": "Guru Mangal Yoga forms when Jupiter and Mars are conjunct (in the same sign) or in mutual aspect. Jupiter's wisdom guides Mars's energy, creating purposeful, ethical action.\n\n**Results:** Success in property and real estate, leadership with both courage and wisdom, success in competitions and disputes when fighting for a just cause, good health and physical vitality, and success in military/administrative careers.\n\nThis yoga is particularly powerful when formed in Kendra houses (1, 4, 7, 10) and when both planets are well-dignified. Mars provides the energy to act, Jupiter provides the wisdom to act rightly.",
    "howToRead": "Check for Jupiter-Mars conjunction or mutual aspect. Assess the house where it forms — in the 10th, it creates powerful career success. In the 1st, it gives a righteous, energetic personality. In the 4th, it gives property fortune. The sign and strength of both planets determine the quality of results.",
    "significance": "Guru Mangal Yoga represents the ideal combination of wisdom and action — the philosopher-warrior archetype. It produces leaders who are both courageous and ethical.",
    "examples": [],
    "relatedTerms": [
      "jupiter",
      "mars",
      "raja_yoga"
    ],
    "tags": [
      "yoga",
      "benefic",
      "jupiter",
      "mars"
    ]
  },
  {
    "termKey": "budha_aditya_yoga",
    "domain": "vedic",
    "category": "yoga",
    "title": "Budha Aditya Yoga (बुधादित्य योग)",
    "sanskrit": "बुधादित्य योग",
    "summary": "Sun-Mercury conjunction — combining authority with intellect, creating skilled communicators, administrators, and scholars with recognized expertise.",
    "description": "Budha Aditya Yoga forms when the Sun and Mercury are conjunct. Since Mercury is never more than 28° from the Sun astronomically, this is the most common planetary yoga — present in a large percentage of charts.\n\n**Results:** Intellectual brilliance, skilled communication, administrative ability, fame through knowledge, government recognition, and success in education and media.\n\n**Quality variations:**\n- Mercury more than 10° from the Sun: Strong yoga — clear intellect, independent thinking\n- Mercury 5°-10° from the Sun: Moderate — good intellect but influenced by ego\n- Mercury less than 5° from the Sun: Mercury may be combust (Asta) — weakened intellect despite the yoga's technical presence\n\nThe true power of Budha Aditya lies in the house placement and sign — in the 10th house, it creates powerful administrative ability; in the 5th, it gives exceptional educational achievements.",
    "howToRead": "Check the Sun-Mercury distance — the farther apart (up to 28°), the stronger the yoga. Mercury combust (within 5° of Sun) technically has the yoga but with diminished results. The house placement determines the arena where intellectual authority manifests.",
    "significance": "Budha Aditya is notable as the most common yoga — teaching that yoga formation alone isn't special; the quality of formation (dignity, combustion, house placement) determines whether it produces exceptional or ordinary results.",
    "examples": [],
    "relatedTerms": [
      "sun",
      "mercury",
      "combustion"
    ],
    "tags": [
      "yoga",
      "benefic",
      "sun",
      "mercury",
      "intellect"
    ]
  },
  {
    "termKey": "chandra_mangal_yoga",
    "domain": "vedic",
    "category": "yoga",
    "title": "Chandra Mangal Yoga (चन्द्र मंगल योग)",
    "sanskrit": "चन्द्र मंगल योग",
    "summary": "Moon-Mars conjunction — combining emotional drive with physical energy, creating wealth through initiative, real estate, and courageous enterprise.",
    "description": "Chandra Mangal Yoga forms when the Moon and Mars are conjunct. The Moon's emotional energy combines with Mars's physical energy, creating a potent drive for material achievement.\n\n**Results:** Wealth earned through personal initiative and courage, success in real estate and property, strong physical constitution, enterprising nature, and the ability to turn emotional motivation into tangible results.\n\n**Caveat:** Moon-Mars conjunction can also create emotional volatility if afflicted — anger, impulsiveness, and emotional reactions that damage relationships. The sign and house placement determine whether this yoga expresses constructively or destructively.",
    "howToRead": "Check the sign and house of the Moon-Mars conjunction. In earth signs (Taurus, Virgo, Capricorn), it gives strong material results. In water signs (Cancer, Scorpio, Pisces), emotional intensity may dominate. Mars's strength relative to Moon's strength determines whether energy (Mars) or emotion (Moon) leads.",
    "significance": "Chandra Mangal Yoga illustrates the dual nature of planetary combinations — the same conjunction can produce a wealthy entrepreneur or an emotionally volatile personality, depending on sign, house, and overall chart context.",
    "examples": [],
    "relatedTerms": [
      "moon",
      "mars"
    ],
    "tags": [
      "yoga",
      "benefic",
      "moon",
      "mars",
      "wealth"
    ]
  },
  {
    "termKey": "raja_yoga",
    "domain": "vedic",
    "category": "yoga",
    "title": "Raja Yoga (राजयोग)",
    "sanskrit": "राजयोग",
    "summary": "The 'Royal Combination' — formed when lords of Kendra (1,4,7,10) and Trikona (1,5,9) houses connect, creating power, status, and authority.",
    "description": "Raja Yoga (literally \"Royal Union\") is the most important category of yogas in Vedic astrology. It forms when lords of Kendra houses (1, 4, 7, 10 — pillars of life) connect with lords of Trikona houses (1, 5, 9 — dharmic houses) through conjunction, mutual aspect, or exchange.\n\n**Types and relative strength (strongest first):**\n1. Kendra-Trikona lords conjunct in a Kendra or Trikona\n2. Kendra-Trikona lords in mutual exchange (Parivartana)\n3. Kendra-Trikona lords in mutual aspect\n4. Kendra lord in a Trikona or Trikona lord in a Kendra\n\n**Results:** Rise to positions of power and authority, government favor, social prestige, leadership opportunities, and the resources to accomplish one's life mission.\n\n**Important**: The 1st house lord is simultaneously a Kendra and Trikona lord, making it a natural Raja Yoga producer — any connection between the 1st lord and another Kendra or Trikona lord creates Raja Yoga.\n\nNot all Raja Yogas are equal — the strength depends on the planets involved, their dignity, and the houses they connect. A Raja Yoga formed by naturally benefic planets (Jupiter, Venus) is more readily activated than one formed by malefics.",
    "howToRead": "Identify all Kendra lords (1st, 4th, 7th, 10th house rulers) and Trikona lords (1st, 5th, 9th house rulers). Check for connections: conjunction, mutual aspect, exchange, or one placed in the other's house. Multiple Raja Yogas compound — charts with 3+ Raja Yogas indicate exceptional life achievements.",
    "significance": "Raja Yoga is the fundamental framework for assessing a chart's power and potential. Every classical text devotes extensive chapters to cataloging Raja Yoga variations. Understanding this concept is essential for any serious student of Jyotish.",
    "examples": [],
    "relatedTerms": [
      "gaja_kesari_yoga",
      "dhana_yoga",
      "pancha_mahapurusha_yoga"
    ],
    "tags": [
      "yoga",
      "benefic",
      "power",
      "authority",
      "kendra",
      "trikona"
    ]
  },
  {
    "termKey": "pancha_mahapurusha_yoga",
    "domain": "vedic",
    "category": "yoga",
    "title": "Pancha Mahapurusha Yoga (पंच महापुरुष योग)",
    "sanskrit": "पंच महापुरुष योग",
    "summary": "Five 'Great Person' Yogas — formed when Mars, Mercury, Jupiter, Venus, or Saturn is in its own/exalted sign in a Kendra house, creating extraordinary personality traits.",
    "description": "The five Mahapurusha Yogas each produce a distinctive \"great person\" archetype:\n\n| Yoga | Planet | Condition | Archetype |\n|------|--------|-----------|-----------|\n| **Ruchaka** | Mars | Own/exalted in Kendra | Warrior-commander, bold, fearless |\n| **Bhadra** | Mercury | Own/exalted in Kendra | Scholar-diplomat, eloquent, learned |\n| **Hamsa** | Jupiter | Own/exalted in Kendra | Sage-teacher, wise, righteous |\n| **Malavya** | Venus | Own/exalted in Kendra | Artist-lover, beautiful, luxurious |\n| **Shasha** | Saturn | Own/exalted in Kendra | Disciplinarian-ruler, austere, powerful |\n\n**Formation**: The planet must be in its own sign or exaltation sign AND simultaneously in a Kendra house (1, 4, 7, or 10) from the Lagna.\n\n**Important**: These yogas are moderately common individually (each occurs in roughly 15-20% of charts) but their strength varies enormously based on the planet's house placement, aspects, and conjunction with other planets.",
    "howToRead": "Check if any of the 5 non-luminary planets (Mars, Mercury, Jupiter, Venus, Saturn) is in its own or exalted sign in houses 1, 4, 7, or 10. Multiple Mahapurusha Yogas in one chart indicate an extraordinary personality. The specific yoga reveals the dominant personality archetype.",
    "significance": "Pancha Mahapurusha Yogas are the most systematically cataloged personality yogas in Jyotish. They provide clear archetypes that help astrologers quickly characterize a native's dominant traits.",
    "examples": [],
    "relatedTerms": [
      "raja_yoga",
      "dignity"
    ],
    "tags": [
      "yoga",
      "benefic",
      "personality",
      "archetype"
    ]
  },
  {
    "termKey": "dhana_yoga",
    "domain": "vedic",
    "category": "yoga",
    "title": "Dhana Yoga (धनयोग)",
    "sanskrit": "धनयोग",
    "summary": "Wealth combinations — formed by connections between the lords of houses 1, 2, 5, 9, and 11, creating strong wealth accumulation potential.",
    "description": "Dhana Yoga (wealth combination) forms when lords of wealth-producing houses connect:\n- **2nd house**: Accumulated wealth, family money, speech (earning through communication)\n- **5th house**: Speculative gains, past-life merit, intelligence-based income\n- **9th house**: Fortune, luck, father's wealth, dharmic earnings\n- **11th house**: Gains, income, fulfillment of desires\n\nThe strongest Dhana Yogas involve the 2nd and 11th lords connecting with the 5th or 9th lords — wealth supported by both merit and fortune.\n\n**Examples:**\n- 2nd lord conjunct 11th lord: Direct wealth combination\n- 5th lord in the 2nd house: Past-life merit produces current wealth\n- 9th lord in the 11th house: Fortune translates to gains\n- Multiple Dhana Yogas: Extreme wealth potential",
    "howToRead": "Identify the lords of houses 2, 5, 9, and 11. Check for conjunctions, aspects, or house exchanges among them. The Lagna lord's involvement strengthens any Dhana Yoga. Also check D2 (Hora) chart for confirmation. Jupiter and Venus as Dhana Yoga participants amplify results.",
    "significance": "Dhana Yoga analysis is one of the most commonly requested consultations. Understanding these combinations allows astrologers to give specific, practical financial guidance rather than vague prosperity promises.",
    "examples": [],
    "relatedTerms": [
      "raja_yoga",
      "d2_hora"
    ],
    "tags": [
      "yoga",
      "benefic",
      "wealth",
      "finance"
    ]
  },
  {
    "termKey": "shubha_yoga",
    "domain": "vedic",
    "category": "yoga",
    "title": "Shubha Yoga (शुभयोग)",
    "sanskrit": "शुभयोग",
    "summary": "Benefic combinations — general category for positive planetary associations involving Jupiter, Venus, well-placed Mercury, or strong Moon that produce favorable life outcomes.",
    "description": "Shubha Yoga is a broad category encompassing all benefic planetary combinations that produce positive life results. While specific yogas (Raja, Dhana, etc.) are named individually, Shubha Yoga refers to the general principle of benefic planets creating favorable conditions.\n\n**Key Shubha Yoga principles:**\n- Natural benefics (Jupiter, Venus, well-aspected Mercury, strong Moon) in Kendra or Trikona houses\n- Benefics aspecting the Lagna, Lagna lord, or Moon\n- Benefic planets in their own, friendly, or exalted signs\n- Benefics free from combustion, debilitation, or heavy malefic aspects\n\nA chart with multiple Shubha Yogas — benefics well-placed across Kendras and Trikonas — produces a generally fortunate life with strong social support, good health, and ethical success.",
    "howToRead": "Count the number of benefic planets (Jupiter, Venus, Mercury, Moon) in Kendras and Trikonas. More benefics in these houses = stronger Shubha Yoga. Check that they're not debilitated, combust, or heavily afflicted. A minimum of 2-3 benefics in angular/trinal houses indicates a generally auspicious chart.",
    "significance": "Shubha Yoga represents the baseline 'good fortune' assessment — before analyzing specific yogas, experienced astrologers first check the overall benefic placement pattern to gauge the chart's general positivity.",
    "examples": [],
    "relatedTerms": [
      "raja_yoga",
      "dhana_yoga",
      "jupiter",
      "venus"
    ],
    "tags": [
      "yoga",
      "benefic",
      "general",
      "fortune"
    ]
  },
  {
    "termKey": "kalpadruma_yoga",
    "domain": "vedic",
    "category": "yoga",
    "title": "Kalpadruma Yoga (कल्पद्रुम योग)",
    "sanskrit": "कल्पद्रुम योग",
    "summary": "The 'Wish-Fulfilling Tree' yoga — formed when the Lagna lord is strong and connected to benefic planets in Kendras, enabling the native to fulfill desires effortlessly.",
    "description": "Kalpadruma (or Kalpa Vriksha) Yoga is named after the mythical wish-fulfilling tree in Indra's heaven. It forms when the Lagna lord is strong, well-placed in a Kendra or Trikona, associated with or aspected by benefic planets.\n\n**Formation conditions:**\n- Lagna lord in own sign, exalted, or in a friendly sign\n- Lagna lord in a Kendra or Trikona\n- Lagna lord aspected by or conjunct with benefics (Jupiter, Venus)\n- No significant malefic affliction to the Lagna lord\n\n**Results:** The native's desires are fulfilled with minimal effort — opportunities come naturally, the right people appear at the right time, and intentions manifest into reality. This yoga gives the ability to attract what is needed.",
    "howToRead": "Check the Lagna lord's placement, dignity, and aspects. A strong Lagna lord (own sign or exalted) in a Kendra aspected by Jupiter creates the textbook Kalpadruma. The native experiences a charmed life where things 'just work out.'",
    "significance": "Kalpadruma Yoga embodies the Vedic principle that a strong Lagna lord — the chart's central pillar — can uplift the entire chart, just as a strong tree trunk supports all branches.",
    "examples": [],
    "relatedTerms": [
      "raja_yoga"
    ],
    "tags": [
      "yoga",
      "benefic",
      "wish_fulfillment",
      "lagna"
    ]
  },
  {
    "termKey": "spiritual_yoga",
    "domain": "vedic",
    "category": "yoga",
    "title": "Spiritual Yoga (आध्यात्मिक योग)",
    "sanskrit": "आध्यात्मिक योग",
    "summary": "Moksha combinations — yogas indicating strong spiritual inclination, renunciation tendencies, and potential for spiritual enlightenment. Involves Jupiter, Ketu, and 12th house connections.",
    "description": "Spiritual Yogas (Moksha Yogas) are combinations that indicate deep spiritual inclination and potential for liberation. While material yogas (Raja, Dhana) are more commonly discussed, spiritual yogas are considered the highest achievement in Vedic tradition.\n\n**Key Spiritual Yoga formations:**\n- Jupiter in the 12th house (surrender to the divine)\n- Ketu in the 12th house (past-life spiritual mastery continuing)\n- 5th lord connected to the 9th lord (intelligence aligned with dharma)\n- Multiple planets in the 8th house (transformation-focused life)\n- Saturn aspecting Moon (detachment from emotional attachment)\n- 12th lord in the 1st house (identity dissolving into spiritual purpose)\n- Vargottama Ketu (spiritual awareness fully integrated)\n\n**Signs of activation:** Attraction to meditation, disinterest in material accumulation, seeking solitude, deep philosophical questioning, experiences of transcendence, and gravitating toward spiritual teachers.",
    "howToRead": "Check the 8th, 9th, and 12th houses for spiritual indicators. Jupiter, Ketu, and Saturn in these houses strengthen spiritual yogas. A chart with strong spiritual yogas but weak material yogas suggests a soul choosing the path of renunciation in this lifetime.",
    "significance": "Spiritual Yogas represent the ultimate goal of Vedic astrology — not material prediction, but understanding the soul's evolutionary trajectory toward liberation (Moksha).",
    "examples": [],
    "relatedTerms": [
      "ketu",
      "jupiter",
      "saturn",
      "d20_vimshamsha"
    ],
    "tags": [
      "yoga",
      "spiritual",
      "moksha",
      "liberation"
    ]
  },
  {
    "termKey": "viparitha_raja_yoga",
    "domain": "vedic",
    "category": "yoga",
    "title": "Viparitha Raja Yoga (विपरीत राजयोग)",
    "sanskrit": "विपरीत राजयोग",
    "summary": "The 'reversed royal yoga' — formed when lords of Dusthana houses (6, 8, 12) occupy other Dusthana houses, converting adversity into unexpected fortune.",
    "description": "Viparitha Raja Yoga is one of astrology's most fascinating concepts — it occurs when negative houses neutralize each other. The lords of houses 6 (enemies, disease), 8 (death, transformation), and 12 (loss, expenses) placing in each other's houses create a \"double negative\" that produces positive results.\n\n**Formation:** Any of these combinations:\n- 6th lord in the 8th or 12th house\n- 8th lord in the 6th or 12th house\n- 12th lord in the 6th or 8th house\n\n**Results:** Sudden, unexpected rise — often through the downfall of enemies, inheritance from loss, or gaining through others' misfortune. Success through crisis management, insurance, healthcare, or legal disputes.\n\n**The paradox:** These natives often rise to power through adversity — the very difficulties that would crush others become their stepping stones. Many self-made millionaires and crisis leaders have Viparitha Raja Yoga.",
    "howToRead": "Check if 6th, 8th, or 12th house lords are placed in each other's houses. The yoga is stronger when: (1) The planets are not conjunct with benefics (which would 'purify' the Dusthana energy). (2) No other planets are involved. (3) The Dusthana lord is a natural malefic (Mars, Saturn, Rahu).",
    "significance": "Viparitha Raja Yoga teaches that in astrology (and life), adversity can be transformed into advantage. It's the astrological equivalent of 'what doesn't kill you makes you stronger.'",
    "examples": [],
    "relatedTerms": [
      "raja_yoga"
    ],
    "tags": [
      "yoga",
      "benefic",
      "adversity",
      "transformation"
    ]
  },
  {
    "termKey": "kala_sarpa_dosha",
    "domain": "vedic",
    "category": "dosha",
    "title": "Kala Sarpa Dosha (कालसर्प दोष)",
    "sanskrit": "कालसर्प दोष",
    "summary": "All 7 planets hemmed between Rahu and Ketu — creates a 'serpent of time' pattern causing cyclical obstacles, sudden reversals, and karmic intensity.",
    "description": "Kala Sarpa Dosha occurs when all seven visible planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) are contained within the arc between Rahu and Ketu — effectively hemmed by the serpent's head (Rahu) and tail (Ketu).\n\n**12 Types** (based on which house Rahu occupies):\nAnanta, Kulik, Vasuki, Shankhpal, Padma, Mahapadma, Takshak, Karkotak, Shankhachood, Ghatak, Vishdhar, and Sheshnag.\n\n**Effects:** Life follows a pattern of sudden rises and falls. Success comes in waves rather than steadily. There may be a persistent feeling of being 'blocked' by invisible forces. Relationships may face unexplained turbulence. The native often feels that their efforts don't produce proportional results.\n\n**Important nuances:**\n- **Partial vs. Full:** If even one planet is outside the Rahu-Ketu axis, it's Partial Kala Sarpa (much milder)\n- **Cancellation:** After age 33-35, the dosha naturally weakens. Rahu-Ketu's Dasha periods intensify it\n- **Not always negative:** Some of the most powerful charts in history had Kala Sarpa — it concentrates energy rather than dispersing it",
    "howToRead": "Check if all 7 planets fall within the 180° arc from Rahu to Ketu (in one direction). Identify the type by Rahu's house. The dosha's severity depends on: (1) How many planets are very close to the Rahu-Ketu axis. (2) Whether benefics are strong despite the hemming. (3) The native's age (weakens after mid-30s).",
    "significance": "Kala Sarpa is the most debated dosha in modern Vedic astrology — some consider it devastating, others consider it overhyped. The truth lies in careful chart-specific analysis rather than blanket fear or dismissal.",
    "examples": [],
    "relatedTerms": [
      "rahu",
      "ketu",
      "shrapit_dosha"
    ],
    "tags": [
      "dosha",
      "rahu",
      "ketu",
      "karmic"
    ]
  },
  {
    "termKey": "shrapit_dosha",
    "domain": "vedic",
    "category": "dosha",
    "title": "Shrapit Dosha (श्रापित दोष)",
    "sanskrit": "श्रापित दोष",
    "summary": "Saturn-Rahu conjunction — the 'curse' dosha indicating karmic debts from past lives manifesting as persistent obstacles, delays, and feelings of being cursed.",
    "description": "Shrapit Dosha (\"cursed combination\") forms when Saturn and Rahu are conjunct in the same house. This is considered one of the heaviest karmic indicators in Vedic astrology.\n\n**Effects:** Persistent delays in marriage, career, or personal growth. A feeling of being \"stuck\" or \"cursed.\" Repetitive patterns of bad luck. Problems from hidden enemies. Chronic health issues that resist treatment.\n\n**Severity factors:**\n- In Kendra houses: Most impactful (especially 1st, 7th)\n- In Trikona houses: Affects dharma and fortune\n- In the 5th house: Particularly challenging for children and education\n- With benefic aspects (especially Jupiter): Significantly mitigated\n\n**Remedies:** Shrapit Dosha remedies emphasize karmic correction — charitable actions, particularly feeding the needy, donating to causes related to the affected house, and regular recitation of Saturn and Rahu mantras.",
    "howToRead": "Check for Saturn-Rahu conjunction (same sign). Note the house placement to identify the primary life area affected. Jupiter's aspect on this conjunction is the most powerful natural remedy. The Dasha periods of Saturn or Rahu will intensify the effects.",
    "significance": "Shrapit Dosha represents the concept of inherited karmic debts — the idea that some life challenges are not random but are the consequences of past-life actions requiring conscious correction.",
    "examples": [],
    "relatedTerms": [
      "saturn",
      "rahu",
      "kala_sarpa_dosha",
      "pitra_dosha"
    ],
    "tags": [
      "dosha",
      "saturn",
      "rahu",
      "karmic",
      "curse"
    ]
  },
  {
    "termKey": "pitra_dosha",
    "domain": "vedic",
    "category": "dosha",
    "title": "Pitra Dosha (पितृ दोष)",
    "sanskrit": "पितृ दोष",
    "summary": "Ancestral debt dosha — indicated by afflictions to the Sun, 9th house, or the Pitri Karaka, suggesting unresolved obligations to the ancestral lineage.",
    "description": "Pitra Dosha indicates unresolved karmic debts to ancestors (Pitris). It is identified through several chart indicators:\n\n**Formation conditions (any of these):**\n- Sun conjunct Rahu or Ketu\n- 9th house afflicted by malefics (especially Rahu)\n- Sun debilitated or severely afflicted\n- 9th lord in Dusthana houses (6, 8, 12)\n- Saturn aspecting or conjunct the Sun\n\n**Effects:** Obstacles in father's health or fortune, difficulty in conceiving children, unexplained family patterns of failure, disharmony in paternal relationships, and challenges in spiritual progress.\n\n**Traditional understanding:** The Pitris (ancestors) are believed to bless or impede their descendants based on whether their departed souls received proper rituals (Shraddha) and whether the living members honor the lineage. Pitra Dosha suggests a disruption in this ancestral-descendant spiritual contract.\n\n**Remedies:** Performing Shraddha (ancestral rites), Tarpana (water offerings), feeding Brahmins on Amavasya (new moon), and Pitra Paksha rituals.",
    "howToRead": "Check the Sun (father significator), 9th house (father's house), and their connection with Rahu/Ketu/Saturn. Multiple indicators strengthen the diagnosis. The Dasha periods of the afflicting planets typically trigger Pitra Dosha effects.",
    "significance": "Pitra Dosha connects astrology to the Vedic ancestor worship tradition — one of the oldest spiritual practices in Indian culture. It bridges astrological analysis with practical spiritual remedies.",
    "examples": [],
    "relatedTerms": [
      "sun",
      "rahu",
      "magha",
      "shrapit_dosha"
    ],
    "tags": [
      "dosha",
      "ancestors",
      "karmic",
      "remedies"
    ]
  },
  {
    "termKey": "guru_chandal_dosha",
    "domain": "vedic",
    "category": "dosha",
    "title": "Guru Chandal Dosha (गुरु चण्डाल दोष)",
    "sanskrit": "गुरु चण्डाल दोष",
    "summary": "Jupiter-Rahu conjunction — the 'polluted teacher' dosha where Jupiter's wisdom is corrupted by Rahu's illusion, causing misguided beliefs and flawed judgment.",
    "description": "Guru Chandal Dosha forms when Jupiter and Rahu are conjunct. Jupiter represents the divine teacher (Guru), and Rahu represents the outcast (Chandal) — their combination \"pollutes\" Jupiter's pure wisdom with Rahu's deceptive, obsessive energy.\n\n**Effects:** Misguided beliefs, following false gurus or ideologies, inflated ego disguised as spiritual knowledge, financial losses through misplaced trust, and difficulty distinguishing genuine wisdom from sophisticated deception.\n\n**Modern expression:** Susceptibility to cults, MLM schemes, conspiracy theories, or any belief system that combines genuine insights with manipulative structures.\n\n**Important:** Guru Chandal is NOT inherently destructive — in certain houses and signs, it can produce unconventional wisdom, innovative teaching, and success in foreign lands. Context determines whether it's a \"polluted guru\" or a \"revolutionary thinker.\"",
    "howToRead": "Check for Jupiter-Rahu conjunction. The house and sign determine the expression — in the 9th house, it directly affects spiritual beliefs. In the 10th, it affects career ethics. In the 5th, it affects children and education. Jupiter's strength relative to Rahu's strength determines whether wisdom (Jupiter) or illusion (Rahu) dominates.",
    "significance": "Guru Chandal Dosha is increasingly relevant in the modern era of information overload, where distinguishing genuine wisdom from sophisticated misinformation is one of life's critical challenges.",
    "examples": [],
    "relatedTerms": [
      "jupiter",
      "rahu",
      "shrapit_dosha"
    ],
    "tags": [
      "dosha",
      "jupiter",
      "rahu",
      "wisdom",
      "deception"
    ]
  },
  {
    "termKey": "angarak_dosha",
    "domain": "vedic",
    "category": "dosha",
    "title": "Angarak Dosha (अंगारक दोष)",
    "sanskrit": "अंगारक दोष",
    "summary": "Mars-Rahu conjunction — the 'burning coal' dosha creating explosive anger, accident-proneness, impulsive actions, and conflicts.",
    "description": "Angarak (\"burning coal\") Dosha forms when Mars and Rahu are conjunct. This combines Mars's aggressive energy with Rahu's amplifying, obsessive quality — creating an explosive, volatile combination.\n\n**Effects:** Explosive temper, accident-proneness (especially fire, electricity, and vehicle-related), impulsive decision-making, conflicts with siblings and neighbors, legal disputes, and blood-related health issues.\n\n**Severity by house:**\n- 1st house: Personality becomes aggressive, health issues\n- 4th house: Domestic conflict, property disputes\n- 7th house: Marital conflict, aggressive partner\n- 8th house: Accident risk, surgical interventions\n- 10th house: Career conflicts, disputes with authority\n\n**Positive expression:** When well-channeled, Angarak Dosha produces exceptional courage, military/police aptitude, surgical precision, and success in competitive sports. Many successful athletes and military leaders have this combination.",
    "howToRead": "Check for Mars-Rahu conjunction. The sign tells the quality (fire signs = most volatile, earth signs = most constructive). Benefic aspects (especially Jupiter) significantly mitigate the explosive potential. Channel the energy through physical activity, martial arts, or competitive sports.",
    "significance": "Angarak Dosha demonstrates that 'malefic' combinations aren't inherently bad — they represent intense energy that requires conscious channeling. Suppressed Angarak energy is more dangerous than expressed Angarak energy.",
    "examples": [],
    "relatedTerms": [
      "mars",
      "rahu"
    ],
    "tags": [
      "dosha",
      "mars",
      "rahu",
      "anger",
      "accidents"
    ]
  },
  {
    "termKey": "sade_sati",
    "domain": "vedic",
    "category": "dosha",
    "title": "Sade Sati (साढ़े साती)",
    "sanskrit": "साढ़े साती",
    "summary": "Saturn's 7.5-year transit over the Moon sign — the most significant transit-based challenge, causing restructuring, discipline through hardship, and ultimate growth.",
    "description": "Sade Sati (literally \"seven and a half\") occurs when Saturn transits the three signs around the natal Moon: the 12th house from Moon (approaching), the Moon sign itself (peak), and the 2nd house from Moon (departing). Since Saturn spends approximately 2.5 years in each sign, the total transit takes about 7.5 years.\n\n**Three Phases:**\n1. **Phase 1 (12th from Moon, ~2.5 years):** Mental stress begins, sleep disturbances, hidden anxieties, expenses increase\n2. **Phase 2 (Over Moon, ~2.5 years):** Peak impact — emotional pressure, health concerns, career restructuring, relationship testing\n3. **Phase 3 (2nd from Moon, ~2.5 years):** Financial pressure, family issues, speech/communication challenges, gradual easing\n\n**Frequency:** Sade Sati occurs 2-3 times in a typical lifespan (once every ~30 years). The first (childhood/adolescence), second (middle age), and third (old age) each have distinct flavors.\n\n**Modern understanding:** Sade Sati is NOT a curse — it's Saturn's restructuring program. Whatever in your life is built on shaky foundations gets demolished so it can be rebuilt properly. Relationships that are genuine survive and strengthen; those that aren't fall away.",
    "howToRead": "Calculate when Saturn will transit the 12th, 1st, and 2nd houses from the natal Moon sign. Check Saturn's natal position and strength — if Saturn is well-placed in the birth chart, Sade Sati tends to be constructive rather than destructive. Also check for Pancha Maha Purusha Yoga (Shasha Yoga) which can turn Sade Sati positive.",
    "significance": "Sade Sati is the most widely tracked transit in Indian astrology — millions of people know their Sade Sati status. Understanding it properly (as restructuring, not punishment) is one of an astrologer's most important educational responsibilities.",
    "examples": [],
    "relatedTerms": [
      "saturn",
      "moon",
      "sani_dhaiya"
    ],
    "tags": [
      "dosha",
      "saturn",
      "transit",
      "restructuring"
    ]
  },
  {
    "termKey": "sani_dhaiya",
    "domain": "vedic",
    "category": "dosha",
    "title": "Sani Dhaiya (ढैया)",
    "sanskrit": "ढैया",
    "summary": "Saturn's 2.5-year transit over the 4th or 8th house from Moon — a smaller but significant Saturn transit causing domestic or health challenges.",
    "description": "Sani Dhaiya (literally \"two and a half\") refers to Saturn's 2.5-year transit through the 4th or 8th house from the natal Moon sign. While less intense than Sade Sati, it still creates noticeable pressure.\n\n**Two types:**\n- **Kantak Shani (4th from Moon):** Domestic challenges, relationship with mother, property issues, inner peace disturbed, vehicle problems\n- **Ashtama Shani (8th from Moon):** Health concerns, unexpected obstacles, hidden enemies, inheritance disputes, transformative events\n\n**Duration:** Each Dhaiya lasts approximately 2.5 years (Saturn's transit time per sign).\n\n**Comparative severity:** Sade Sati > Ashtama Shani > Kantak Shani. However, the impact is modulated by Saturn's natal strength, the Moon's condition, and any protective aspects from Jupiter.",
    "howToRead": "Check when Saturn transits the 4th and 8th signs from the natal Moon. Kantak Shani (4th) primarily affects domestic life and emotional peace. Ashtama Shani (8th) affects health and creates hidden obstacles. Strengthen the Moon through positive emotional practices and Jupiter through charitable actions.",
    "significance": "Sani Dhaiya, along with Sade Sati, forms the complete picture of Saturn's impact on the Moon (mind). Understanding both helps astrologers provide comprehensive Saturn transit guidance.",
    "examples": [],
    "relatedTerms": [
      "saturn",
      "moon",
      "sade_sati"
    ],
    "tags": [
      "dosha",
      "saturn",
      "transit",
      "challenges"
    ]
  },
  {
    "termKey": "sthana_bala",
    "domain": "vedic",
    "category": "shadbala",
    "title": "Sthana Bala (स्थान बल)",
    "sanskrit": "स्थान बल",
    "summary": "Positional strength — a planet's strength based on its sign placement, including exaltation, own sign, friendly sign, and house position contributions.",
    "description": "Sthana Bala (positional strength) is the most complex of the six Shadbala components, itself comprising five sub-components:\n\n1. **Ucha Bala**: Strength from exaltation — maximum at exact exaltation degree, zero at debilitation\n2. **Saptavargiya Bala**: Strength from positions in 7 divisional charts (D1, D2, D3, D7, D9, D12, D30)\n3. **Ojhayugmarashi Bala**: Strength from odd/even sign placement (different for each planet)\n4. **Kendradi Bala**: Strength from house position — Kendra (strongest), Panapara (moderate), Apoklima (weakest)\n5. **Drekkana Bala**: Strength from decanate position (male planets strong in 1st decanate, etc.)\n\nSthana Bala answers: \"How well-positioned is this planet in the cosmic geography?\"",
    "howToRead": "Sthana Bala is calculated in Virupas. Higher values indicate a planet that is cosmically 'at home' — well-positioned in signs, houses, and divisional charts. A planet with high Sthana Bala expresses its significations with natural ease.",
    "significance": "Sthana Bala provides the foundation for planetary strength assessment. A planet with strong Sthana Bala has inherent advantage regardless of other factors — like a person born into favorable circumstances.",
    "examples": [],
    "relatedTerms": [
      "dig_bala",
      "kala_bala",
      "virupa",
      "rupa"
    ],
    "tags": [
      "shadbala",
      "strength",
      "position"
    ]
  },
  {
    "termKey": "dig_bala",
    "domain": "vedic",
    "category": "shadbala",
    "title": "Dig Bala (दिग बल)",
    "sanskrit": "दिग बल",
    "summary": "Directional strength — a planet's power based on which house (direction) it occupies. Each planet has one house where it gains maximum directional strength.",
    "description": "Dig Bala assigns strength based on house position, treating the four Kendra houses as the four cardinal directions:\n\n| Planet | Maximum Strength | Direction |\n|--------|-----------------|-----------|\n| Sun, Mars | 10th house | South (Midheaven) |\n| Moon, Venus | 4th house | North (IC) |\n| Mercury, Jupiter | 1st house | East (Ascendant) |\n| Saturn | 7th house | West (Descendant) |\n\nA planet at its Dig Bala point is maximally powerful in its expression:\n- Sun/Mars in the 10th: Maximum career authority and public visibility\n- Moon/Venus in the 4th: Maximum domestic happiness and emotional comfort\n- Mercury/Jupiter in the 1st: Maximum personal wisdom and communication\n- Saturn in the 7th: Maximum discipline in partnerships\n\nDig Bala is calculated as proportional to the planet's angular distance from its point of maximum strength. At the opposite point (e.g., Sun in the 4th), Dig Bala is zero.",
    "howToRead": "Check if any planet is in or near its Dig Bala house. Sun/Mars in the 10th is one of the most powerful configurations in Jyotish. Mercury/Jupiter in the 1st gives exceptional personal charisma and wisdom. A planet with zero Dig Bala (opposite its strength point) struggles to express in that house.",
    "significance": "Dig Bala is the simplest Shadbala component to understand and apply. The four directional strengths provide an instant assessment of which planets are 'in their power zones' and which are struggling.",
    "examples": [],
    "relatedTerms": [
      "sthana_bala",
      "kala_bala"
    ],
    "tags": [
      "shadbala",
      "strength",
      "direction",
      "house"
    ]
  },
  {
    "termKey": "kala_bala",
    "domain": "vedic",
    "category": "shadbala",
    "title": "Kala Bala (काल बल)",
    "sanskrit": "काल बल",
    "summary": "Temporal strength — a planet's power based on time factors: day/night birth, weekday, month, year, hora, and the broader time cycles.",
    "description": "Kala Bala (temporal strength) measures planetary strength based on various time factors at birth:\n\n**Sub-components:**\n1. **Natonnata Bala**: Day/night birth — Sun, Jupiter, Venus strong by day; Moon, Mars, Saturn strong by night\n2. **Paksha Bala**: Lunar phase — benefics strong in Shukla Paksha, malefics strong in Krishna Paksha\n3. **Tribhaga Bala**: Division of day/night into three parts, each ruled by different planets\n4. **Varsha Lord Bala**: The planet ruling the year of birth\n5. **Masa Lord Bala**: The planet ruling the month of birth\n6. **Dina Lord Bala**: The planet ruling the weekday of birth\n7. **Hora Lord Bala**: The planet ruling the hora (hour) of birth\n8. **Ayana Bala**: Strength from the Sun's declination (solstice-based)\n9. **Yuddha Bala**: Planetary war — when two planets are within 1° of each other\n\nKala Bala answers: \"Was this planet temporally empowered at the moment of birth?\"",
    "howToRead": "Kala Bala is primarily calculated through software due to its complexity. The key practical insight: day-born charts favor Sun, Jupiter, Venus; night-born charts favor Moon, Mars, Saturn. Mercury is considered neutral. Shukla Paksha strengthens benefics; Krishna Paksha strengthens malefics.",
    "significance": "Kala Bala introduces the time dimension into planetary strength — a planet can be well-placed positionally (Sthana Bala) but temporally weak, or vice versa. This multi-dimensional assessment is what makes Shadbala comprehensive.",
    "examples": [],
    "relatedTerms": [
      "sthana_bala",
      "dig_bala",
      "paksha"
    ],
    "tags": [
      "shadbala",
      "strength",
      "time",
      "temporal"
    ]
  },
  {
    "termKey": "cheshta_bala",
    "domain": "vedic",
    "category": "shadbala",
    "title": "Cheshta Bala (चेष्ट बल)",
    "sanskrit": "चेष्ट बल",
    "summary": "Motional strength — a planet's power based on its apparent motion: retrograde planets and those near stationary points gain significant Cheshta Bala.",
    "description": "Cheshta Bala (motional strength) is based on the planet's apparent velocity and direction of motion. Counterintuitively, retrograde planets gain MORE Cheshta Bala, not less.\n\n**Principles:**\n- **Retrograde motion**: Maximum Cheshta Bala — the planet appears to move against the cosmic current, requiring and displaying more energy\n- **Stationary (turning retrograde/direct)**: Very high Cheshta Bala — concentrated energy at the turning point\n- **Direct motion at maximum speed**: Moderate Cheshta Bala\n- **Sun and Moon**: These never retrograde, so their Cheshta Bala is calculated differently (based on declination and speed respectively)\n\n**Why retrograde = strong**: A retrograde planet is astronomically closer to Earth, appearing brighter and larger. In Vedic astrology, this proximity translates to more intense, internalized, and powerful expression — though the expression may be unconventional or delayed.",
    "howToRead": "Check each planet's motion status: direct, retrograde, or stationary. Retrograde planets have strong Cheshta Bala and express their significations intensely but often in unconventional ways. Stationary planets (about to turn retrograde or direct) are at peak concentration.",
    "significance": "Cheshta Bala challenges the popular misconception that retrograde = weak. In Shadbala, retrograde planets are among the strongest — they simply express differently. This nuance is essential for accurate chart interpretation.",
    "examples": [],
    "relatedTerms": [
      "retrograde",
      "sthana_bala"
    ],
    "tags": [
      "shadbala",
      "strength",
      "motion",
      "retrograde"
    ]
  },
  {
    "termKey": "naisargika_bala",
    "domain": "vedic",
    "category": "shadbala",
    "title": "Naisargika Bala (नैसर्गिक बल)",
    "sanskrit": "नैसर्गिक बल",
    "summary": "Natural strength — the inherent, permanent strength of each planet that never changes. Sun is strongest, Saturn is weakest in natural luminosity.",
    "description": "Naisargika Bala (natural/inherent strength) is the simplest Shadbala component — it assigns a fixed strength value to each planet based on its natural luminosity:\n\n| Planet | Naisargika Bala (Virupas) |\n|--------|--------------------------|\n| Sun | 60 (strongest) |\n| Moon | 51.43 |\n| Venus | 42.85 |\n| Jupiter | 34.28 |\n| Mercury | 25.71 |\n| Mars | 17.14 |\n| Saturn | 8.57 (weakest) |\n\nThese values never change regardless of the chart — they represent the planet's inherent cosmic significance based on apparent brightness. Rahu and Ketu are excluded from Shadbala calculations.\n\n**Purpose**: Naisargika Bala ensures that when two planets are otherwise equally strong, the naturally more luminous planet prevails. It's the \"tiebreaker\" in planetary strength comparisons.",
    "howToRead": "Naisargika Bala is a fixed value — no interpretation needed per chart. Its importance is in comparative analysis: when Sun and Saturn compete for influence in a chart, the Sun has a natural 7:1 advantage before other factors are considered.",
    "significance": "Naisargika Bala reflects the Vedic principle that cosmic hierarchy is inherent — the Sun naturally outranks Saturn, just as consciousness (Sun) naturally precedes matter (Saturn) in the order of creation.",
    "examples": [],
    "relatedTerms": [
      "sthana_bala",
      "dig_bala"
    ],
    "tags": [
      "shadbala",
      "strength",
      "natural",
      "inherent"
    ]
  },
  {
    "termKey": "drik_bala",
    "domain": "vedic",
    "category": "shadbala",
    "title": "Drik Bala (दृक बल)",
    "sanskrit": "दृक बल",
    "summary": "Aspectual strength — a planet's strength gained or lost through aspects (Drishti) from other planets. Benefic aspects add strength; malefic aspects reduce it.",
    "description": "Drik Bala (aspectual strength) measures how aspects from other planets enhance or diminish a planet's strength:\n\n- **Benefic aspects (Jupiter, Venus, well-placed Mercury, strong Moon)**: Add positive Drik Bala\n- **Malefic aspects (Saturn, Mars, Rahu, afflicted Sun)**: Add negative Drik Bala (reduce strength)\n\n**Aspect types considered:**\n- Full aspect (7th house aspect — all planets have this)\n- Special aspects: Jupiter (5th and 9th), Mars (4th and 8th), Saturn (3rd and 10th)\n\n**Net calculation**: Benefic aspects minus malefic aspects = final Drik Bala. The result can be positive (net benefic influence) or negative (net malefic influence).\n\nDrik Bala answers: \"Is this planet being helped or harmed by the cosmic environment around it?\"",
    "howToRead": "Check which planets aspect the planet in question. Jupiter's aspect is the most powerful benefic influence — a Jupiter aspect can rescue an otherwise weak planet. Conversely, Saturn + Mars aspects on a benefic can severely weaken it. The net result determines whether the planet has environmental support.",
    "significance": "Drik Bala captures the relational dimension of planetary strength — no planet exists in isolation. Even the strongest planet can be weakened by heavy malefic aspects, and even a weak planet can be uplifted by Jupiter's grace.",
    "examples": [],
    "relatedTerms": [
      "sthana_bala",
      "jupiter"
    ],
    "tags": [
      "shadbala",
      "strength",
      "aspects",
      "influence"
    ]
  },
  {
    "termKey": "virupa",
    "domain": "vedic",
    "category": "shadbala",
    "title": "Virupa (विरुप)",
    "sanskrit": "विरुप",
    "summary": "The basic unit of Shadbala measurement — 1/60th of a Rupa. All six strength components are measured in Virupas and summed to get the total Shadbala.",
    "description": "Virupa is the fundamental unit used to measure Shadbala (six-fold strength). It is defined as 1/60th of a Rupa — analogous to how minutes relate to degrees in angular measurement.\n\n**Usage in Shadbala:**\n- Each of the six Bala components (Sthana, Dig, Kala, Cheshta, Naisargika, Drik) is calculated in Virupas\n- The sum of all six components gives the Total Shadbala in Virupas\n- Dividing by 60 converts Virupas to Rupas for easier interpretation\n\n**Minimum required Shadbala** (in Rupas):\n| Planet | Minimum Rupas |\n|--------|--------------|\n| Sun | 5.0 |\n| Moon | 6.0 |\n| Mars | 5.0 |\n| Mercury | 7.0 |\n| Jupiter | 6.5 |\n| Venus | 5.5 |\n| Saturn | 5.0 |\n\nA planet exceeding its minimum required Shadbala is considered \"strong\" — it can deliver its significations effectively.",
    "howToRead": "Look at the Shadbala table in the chart analysis. Each planet's total Virupas (or Rupas) tells you its absolute strength. Compare against the minimum required Rupas — planets above the threshold are functionally strong; those below are weak and need support.",
    "significance": "Virupa as a measurement unit enables quantitative planetary strength comparison — moving beyond qualitative assessments ('strong' or 'weak') to precise numerical values.",
    "examples": [],
    "relatedTerms": [
      "rupa",
      "sthana_bala"
    ],
    "tags": [
      "shadbala",
      "measurement",
      "unit"
    ]
  },
  {
    "termKey": "rupa",
    "domain": "vedic",
    "category": "shadbala",
    "title": "Rupa (रुप)",
    "sanskrit": "रुप",
    "summary": "The primary Shadbala strength unit — 1 Rupa equals 60 Virupas. Used for expressing total planetary strength and comparing against minimum required thresholds.",
    "description": "Rupa is the primary unit for expressing Shadbala results. While calculations happen in Virupas, final results are typically presented in Rupas for readability.\n\n**Conversion:** 1 Rupa = 60 Virupas\n\n**Interpretation scale:**\n- Below minimum required: Planet is weak, struggles to deliver results\n- At minimum: Planet is functionally adequate\n- 1.5× minimum: Strong planet, delivers good results\n- 2× minimum or more: Very strong planet, exceptional results in its significations\n\n**Practical application:** When Shadbala software shows a planet at 8.5 Rupas against a minimum requirement of 5.0, that planet is at 170% strength — well above the threshold and capable of strong expression.",
    "howToRead": "Use Rupas as the summary metric for planetary strength. Compare each planet's Rupa value against its specific minimum requirement. The highest-Rupa planet in a chart is the 'strongest overall' and its significations tend to be most prominent in the native's life.",
    "significance": "Rupas provide the bottom-line answer to 'how strong is this planet?' — essential for quick chart assessment and for prioritizing which planetary periods will deliver the best results.",
    "examples": [],
    "relatedTerms": [
      "virupa",
      "sthana_bala"
    ],
    "tags": [
      "shadbala",
      "measurement",
      "unit"
    ]
  },
  {
    "termKey": "ishta_kashta",
    "domain": "vedic",
    "category": "shadbala",
    "title": "Ishta-Kashta Phala (इष्ट-कष्ट फल)",
    "sanskrit": "इष्ट-कष्ट",
    "summary": "Beneficial vs. harmful strength — derived from Shadbala, measuring how much of a planet's strength produces favorable (Ishta) vs. unfavorable (Kashta) results.",
    "description": "Ishta-Kashta Phala is the final, most practical output of Shadbala calculation. It divides a planet's total strength into two components:\n\n- **Ishta Phala (Benefic Component):** The portion of strength that produces favorable results — happiness, success, health\n- **Kashta Phala (Malefic Component):** The portion that produces unfavorable results — obstacles, suffering, challenges\n\n**Calculation:** Derived from the Cheshta Bala and Sthana Bala using specific formulae. The ratio of Ishta to Kashta reveals whether a planet's strength is primarily constructive or destructive.\n\nA planet can be numerically strong (high total Rupas) but have more Kashta than Ishta — meaning its strength produces challenges rather than benefits. Conversely, a moderately strong planet with high Ishta and low Kashta is functionally more beneficial.",
    "howToRead": "Compare Ishta Phala vs. Kashta Phala for each planet. High Ishta + low Kashta = genuinely beneficial planet. High Kashta + low Ishta = planet creates challenges despite being 'strong.' The ratio matters more than absolute values.",
    "significance": "Ishta-Kashta bridges the gap between strength and beneficence — a crucial distinction that raw Shadbala numbers miss. A 'strong malefic' is worse than a 'weak malefic' because it has more power to cause harm.",
    "examples": [],
    "relatedTerms": [
      "virupa",
      "rupa",
      "cheshta_bala"
    ],
    "tags": [
      "shadbala",
      "measurement",
      "beneficial",
      "harmful"
    ]
  },
  {
    "termKey": "sarvashtakavarga",
    "domain": "vedic",
    "category": "ashtakavarga",
    "title": "Sarvashtakavarga (सर्वाष्टकवर्ग)",
    "sanskrit": "सर्वाष्टकवर्ग",
    "summary": "The combined Ashtakavarga — a 12×8 matrix showing the total benefic points (0-8) each sign receives from all 7 planets + Lagna, revealing overall strength of each house.",
    "description": "Sarvashtakavarga (SAV) is the grand total of all individual Bhinnashtakavarga scores. Each of the 12 signs receives a score from 0 to 8 based on benefic dots contributed by all 7 planets plus the Lagna.\n\n**Interpretation:**\n- **30+ points in a sign**: Very strong — planets transiting this sign give excellent results\n- **25-30 points**: Good — generally favorable transits\n- **20-25 points**: Average — mixed results\n- **Below 20 points**: Weak — planets transiting here face resistance\n\n**Total SAV**: The sum of all 12 signs' points should be 337 for any chart. The distribution across signs determines which life areas are naturally supported.\n\n**Transit application**: SAV is most powerful for predicting transit results. When Saturn, Jupiter, or any planet transits a high-SAV sign in your chart, positive results follow. Low-SAV transits bring challenges.",
    "howToRead": "Check the SAV score for each sign/house. Houses with 30+ points are your chart's power zones. Houses below 20 are vulnerability zones. For transit predictions, combine the transiting planet's SAV score with its Bhinnashtakavarga score in that sign.",
    "significance": "SAV provides the most objective, mathematically verifiable strength assessment in Vedic astrology. Unlike yoga analysis which requires interpretation, SAV gives clear numbers that can be compared across charts.",
    "examples": [],
    "relatedTerms": [
      "bhinnashtakavarga",
      "shodasha_ashtakavarga"
    ],
    "tags": [
      "ashtakavarga",
      "strength",
      "transit"
    ]
  },
  {
    "termKey": "bhinnashtakavarga",
    "domain": "vedic",
    "category": "ashtakavarga",
    "title": "Bhinnashtakavarga (भिन्नाष्टकवर्ग)",
    "sanskrit": "भिन्नाष्टकवर्ग",
    "summary": "Individual planet Ashtakavarga — a matrix showing which signs give benefic points (0-8) for each specific planet, based on the positions of all other planets.",
    "description": "Bhinnashtakavarga (BAV) is the individual Ashtakavarga chart for each of the 7 planets + Lagna. Each planet has its own 12-sign matrix showing benefic dots (bindus) from 0 to 8.\n\n**How it works:**\n- Each planet contributes either a benefic dot (1) or nothing (0) to every sign for every other planet, based on fixed rules from classical texts\n- The sum of dots in each sign (from all 8 contributors) gives the BAV score for that planet in that sign\n- Maximum: 8 bindus (all contributors give a benefic dot) = strongest position\n- Minimum: 0 bindus = weakest position\n\n**Interpretation for each planet:**\n- **5+ bindus**: Strong position — the planet gives good results when transiting or natal in this sign\n- **4 bindus**: Average — neutral results\n- **Below 4**: Weak — challenging results\n\nBAV is the most powerful tool for transit prediction. When Jupiter transits a sign where its BAV score is 6+, expect excellent results in Jupiter's significations.",
    "howToRead": "For each planet, check its BAV score in its natal sign and in currently transiting signs. High BAV natal position = planet well-supported by the overall chart. For transit timing, check the planet's BAV in the sign it's about to enter.",
    "significance": "BAV provides planet-specific strength analysis complementing the house-level SAV view. Together, they form the most mathematically rigorous analytical framework in Vedic astrology.",
    "examples": [],
    "relatedTerms": [
      "sarvashtakavarga",
      "shodasha_ashtakavarga"
    ],
    "tags": [
      "ashtakavarga",
      "strength",
      "planet"
    ]
  },
  {
    "termKey": "shodasha_ashtakavarga",
    "domain": "vedic",
    "category": "ashtakavarga",
    "title": "Shodasha Ashtakavarga (षोडशवर्ग अष्टकवर्ग)",
    "sanskrit": "षोडशवर्ग अष्टकवर्ग",
    "summary": "16-divisional chart Ashtakavarga — an extended analysis incorporating strength from all 16 Shodashavarga divisional charts for deeper precision.",
    "description": "Shodasha Ashtakavarga extends the basic Ashtakavarga analysis across all 16 Shodashavarga divisional charts, providing a multi-dimensional strength assessment.\n\nWhile standard Ashtakavarga uses the D1 (Rashi chart) positions, Shodasha Ashtakavarga considers the cumulative strength across D1 through D60. This gives a much more comprehensive picture of a planet's true strength.\n\n**Application:** Used by advanced astrologers for confirming Dasha predictions, refining transit timing, and resolving ambiguous chart readings where standard Ashtakavarga gives borderline scores.",
    "howToRead": "Shodasha Ashtakavarga is an advanced tool requiring software calculation. Compare its results with standard SAV/BAV — agreements confirm predictions strongly. Disagreements suggest the need for deeper analysis.",
    "significance": "Shodasha Ashtakavarga represents the fusion of two powerful analytical frameworks (Ashtakavarga + Shodashavarga), creating one of the most comprehensive strength assessment tools in classical Jyotish.",
    "examples": [],
    "relatedTerms": [
      "sarvashtakavarga",
      "bhinnashtakavarga"
    ],
    "tags": [
      "ashtakavarga",
      "strength",
      "advanced"
    ]
  },
  {
    "termKey": "tatkalik_maitri",
    "domain": "vedic",
    "category": "ashtakavarga",
    "title": "Tatkalik Maitri Chakra (ताकालिक मैत्री चक्र)",
    "sanskrit": "ताकालिक मैत्री",
    "summary": "Temporal friendship chart — shows real-time planetary friendships based on actual positions (not just natural friendship), affecting how planets interact in a specific chart.",
    "description": "While natural planetary friendship (Naisargika Maitri) is fixed (e.g., Sun and Moon are always friends), Tatkalik Maitri (temporal friendship) varies based on actual planetary positions in a specific chart.\n\n**Rules:**\n- Planets in the 2nd, 3rd, 4th, 10th, 11th, or 12th house from a planet are its **temporal friends**\n- Planets in the 1st, 5th, 6th, 7th, 8th, or 9th house from a planet are its **temporal enemies**\n\n**Combined friendship (Panchada Maitri):**\n- Natural friend + Temporal friend = **Intimate friend** (Adhimitra)\n- Natural friend + Temporal enemy = **Neutral** (Sama)\n- Natural enemy + Temporal friend = **Neutral** (Sama)\n- Natural enemy + Temporal enemy = **Bitter enemy** (Adhishatru)\n- Natural neutral + Temporal friend = **Friend** (Mitra)\n- Natural neutral + Temporal enemy = **Enemy** (Shatru)\n\nThis combined assessment determines how planets actually interact in a specific chart, beyond generic natural friendship rules.",
    "howToRead": "Calculate temporal friendship based on actual planetary positions. Combine with natural friendship to get the five-fold (Panchada) relationship. Intimate friends strongly support each other's Dashas and transits. Bitter enemies create conflict during their combined periods.",
    "significance": "Tatkalik Maitri transforms generic planetary relationships into chart-specific dynamics — essential for understanding why the same planetary Dasha produces different results in different charts.",
    "examples": [],
    "relatedTerms": [
      "sarvashtakavarga"
    ],
    "tags": [
      "ashtakavarga",
      "friendship",
      "relationship"
    ]
  },
  {
    "termKey": "karaka_ashtakavarga",
    "domain": "vedic",
    "category": "ashtakavarga",
    "title": "Karaka Ashtakavarga (कारक अष्टकवर्ग)",
    "sanskrit": "कारक अष्टकवर्ग",
    "summary": "Significator-based Ashtakavarga — analyzes the Karaka (natural significator) planet's strength for specific life questions, adding precision to house-based analysis.",
    "description": "Karaka Ashtakavarga focuses on the natural significator (Karaka) planet for a specific life question, using its Bhinnashtakavarga score in the relevant house:\n\n**Primary Karakas and their houses:**\n- **Sun** (Karaka for father, authority): Check Sun's BAV in the 9th/10th house\n- **Moon** (Karaka for mother, mind): Check Moon's BAV in the 4th house\n- **Mars** (Karaka for siblings, property): Check Mars's BAV in the 3rd/4th house\n- **Jupiter** (Karaka for children, wisdom): Check Jupiter's BAV in the 5th house\n- **Venus** (Karaka for marriage, wife): Check Venus's BAV in the 7th house\n- **Saturn** (Karaka for longevity): Check Saturn's BAV in the 8th house\n\nWhen the Karaka planet has high BAV score (5+) in its signification house, the life area thrives. Low BAV (below 3) indicates challenges in that domain.",
    "howToRead": "For any specific life question, identify the Karaka planet and check its BAV score in the relevant house. High Karaka BAV = strong results. This adds a second layer of confirmation beyond just checking the house lord.",
    "significance": "Karaka Ashtakavarga combines the Karaka system (significator planets) with Ashtakavarga mathematics, creating a targeted analytical tool for specific life questions.",
    "examples": [],
    "relatedTerms": [
      "bhinnashtakavarga",
      "sarvashtakavarga"
    ],
    "tags": [
      "ashtakavarga",
      "karaka",
      "significator"
    ]
  },
  {
    "termKey": "ucha",
    "domain": "vedic",
    "category": "dignity",
    "title": "Ucha — Exaltation (उच्च)",
    "sanskrit": "उच्च",
    "summary": "A planet in its exaltation sign — the highest dignity where the planet expresses its best qualities with maximum power. Each planet has one specific sign of exaltation.",
    "description": "Ucha (exaltation) is the highest dignity a planet can achieve. When a planet occupies its exaltation sign, it expresses its significations at peak capacity — with confidence, ease, and maximum positive effect.\n\n**Exaltation signs and degrees:**\n| Planet | Exalted In | Exact Degree |\n|--------|-----------|-------------|\n| Sun | Aries | 10° |\n| Moon | Taurus | 3° |\n| Mars | Capricorn | 28° |\n| Mercury | Virgo | 15° |\n| Jupiter | Cancer | 5° |\n| Venus | Pisces | 27° |\n| Saturn | Libra | 20° |\n\nAt the exact exaltation degree, the planet is at \"deep exaltation\" (Paramucha) — its absolute peak. Moving away from this degree, the exaltation effect gradually diminishes.\n\nAn exalted planet is like a king in his own palace — naturally commanding, confident, and powerful. It produces excellent results in its Dasha and strongly supports whatever house it occupies.",
    "howToRead": "Check if any planet is in its exaltation sign. Note the degree — closer to the exact exaltation degree means stronger exaltation. An exalted planet is one of the most powerful positive indicators in a chart. Its Dasha period typically brings the best phase of life related to that planet's significations.",
    "significance": "Exaltation is the gold standard of planetary dignity. Classical texts devote extensive attention to exalted planets because they represent the cosmic ideal — a planet functioning at its designed best.",
    "examples": [],
    "relatedTerms": [
      "neecha",
      "swakshetra",
      "vimsopaka",
      "dignity"
    ],
    "tags": [
      "dignity",
      "exaltation",
      "strength"
    ]
  },
  {
    "termKey": "neecha",
    "domain": "vedic",
    "category": "dignity",
    "title": "Neecha — Debilitation (नीच)",
    "sanskrit": "नीच",
    "summary": "A planet in its debilitation sign — the lowest dignity where the planet struggles to express its qualities effectively. Always exactly opposite the exaltation sign.",
    "description": "Neecha (debilitation) is the lowest dignity — a planet in the sign exactly opposite its exaltation. Here, the planet's significations are compromised, weakened, or expressed with difficulty.\n\n**Debilitation signs (always opposite exaltation):**\n| Planet | Debilitated In | Exact Degree |\n|--------|---------------|-------------|\n| Sun | Libra | 10° |\n| Moon | Scorpio | 3° |\n| Mars | Cancer | 28° |\n| Mercury | Pisces | 15° |\n| Jupiter | Capricorn | 5° |\n| Venus | Virgo | 27° |\n| Saturn | Aries | 20° |\n\n**Neecha Bhanga (Cancellation of Debilitation):** Several conditions can cancel or reduce debilitation effects:\n1. The lord of the debilitation sign is in a Kendra from Lagna or Moon\n2. The exaltation lord of the debilitated planet is in a Kendra\n3. The debilitated planet is aspected by or conjunct its exaltation lord\n4. The debilitated planet is in a Kendra\n\nNeecha Bhanga Raja Yoga — when debilitation is cancelled, it can paradoxically produce exceptional results, often surpassing normal exaltation.",
    "howToRead": "Check for debilitated planets. Then check for Neecha Bhanga conditions — cancellation can transform weakness into strength. A debilitated planet without cancellation during its Dasha period brings struggles related to its significations. With cancellation, the struggle transforms into eventual triumph.",
    "significance": "Debilitation teaches the important lesson that initial weakness can become ultimate strength through Neecha Bhanga. This concept mirrors the human experience of growing through adversity.",
    "examples": [],
    "relatedTerms": [
      "ucha",
      "swakshetra",
      "vimsopaka",
      "dignity"
    ],
    "tags": [
      "dignity",
      "debilitation",
      "weakness"
    ]
  },
  {
    "termKey": "swakshetra",
    "domain": "vedic",
    "category": "dignity",
    "title": "Swakshetra — Own Sign (स्व क्षेत्र)",
    "sanskrit": "स्व क्षेत्र",
    "summary": "A planet in its own sign — the comfortable 'home' dignity where the planet functions with natural ease, authenticity, and self-sufficiency.",
    "description": "Swakshetra (own sign/field) occurs when a planet occupies the sign it rules. This is the second-strongest dignity after exaltation — the planet is \"at home,\" functioning with natural ease and authenticity.\n\n**Own sign placements:**\n| Planet | Own Signs |\n|--------|----------|\n| Sun | Leo |\n| Moon | Cancer |\n| Mars | Aries, Scorpio |\n| Mercury | Gemini, Virgo |\n| Jupiter | Sagittarius, Pisces |\n| Venus | Taurus, Libra |\n| Saturn | Capricorn, Aquarius |\n\n**Key difference from exaltation:** An exalted planet is like a guest of honor at a grand event — impressive but temporary. A Swakshetra planet is like a person in their own home — comfortable, natural, sustainable. Swakshetra gives more consistent, reliable results than exaltation.\n\nA Swakshetra planet is self-sufficient — it doesn't need external support (aspects from benefics) to deliver results. It generates its own strength from being in its natural domain.",
    "howToRead": "Check if any planet is in a sign it rules. Swakshetra planets are reliable performers — they deliver their significations consistently and with authenticity. In Dasha analysis, Swakshetra planet periods are typically comfortable and productive without dramatic highs or lows.",
    "significance": "Swakshetra represents the ideal of self-sufficiency — a planet that doesn't depend on external conditions to function well. Many astrologers consider Swakshetra more practically valuable than exaltation for sustained life success.",
    "examples": [],
    "relatedTerms": [
      "ucha",
      "neecha",
      "vimsopaka",
      "dignity"
    ],
    "tags": [
      "dignity",
      "own_sign",
      "strength"
    ]
  },
  {
    "termKey": "vimsopaka",
    "domain": "vedic",
    "category": "dignity",
    "title": "Vimsopaka Bala (विंशोपक बल)",
    "sanskrit": "विंशोपक बल",
    "summary": "The 20-point dignity scale — a composite score measuring a planet's overall dignity across 16 divisional charts, providing the most comprehensive dignity assessment.",
    "description": "Vimsopaka Bala (\"20-point strength\") is a composite dignity score that considers a planet's sign placement across multiple divisional charts (vargas). Instead of checking dignity only in D1, Vimsopaka checks dignity across all 16 Shodashavarga charts and weights them according to importance.\n\n**Scale:** 0 to 20 points\n\n**Interpretation:**\n- **18-20 points**: Excellent dignity — planet in exalted/own sign across most vargas\n- **15-17 points**: Very good — strong in important vargas\n- **12-14 points**: Good — adequate performance expected\n- **8-11 points**: Below average — planet may struggle\n- **Below 8 points**: Weak — planet needs remedial support\n\n**Two calculation systems:**\n1. **Shadvarga** (6-chart): Uses D1, D2, D3, D9, D12, D30\n2. **Shodashavarga** (16-chart): Uses all 16 divisional charts with weighted scores\n\nThe Shodashavarga calculation gives the most comprehensive assessment, as it considers dignity across all life areas (career, marriage, children, spirituality, etc.).",
    "howToRead": "Check each planet's Vimsopaka score. Planets scoring 15+ are strongly dignified across multiple life areas. Planets below 8 need remedial attention (gemstones, mantras, charitable actions). Vimsopaka is the most holistic dignity metric — more reliable than checking D1 dignity alone.",
    "significance": "Vimsopaka Bala synthesizes the entire Shodashavarga system into a single, actionable number per planet. It prevents the common mistake of judging a planet's dignity based on D1 alone, which can be misleading.",
    "examples": [],
    "relatedTerms": [
      "ucha",
      "neecha",
      "swakshetra",
      "d1_rashi",
      "d9_navamsha"
    ],
    "tags": [
      "dignity",
      "composite",
      "score",
      "vimsopaka"
    ]
  },
  {
    "termKey": "sign_lord",
    "domain": "vedic",
    "category": "planetary_attribute",
    "title": "Sign Lord (राशि अधिपति)",
    "sanskrit": "राशि अधिपति",
    "summary": "The ruling planet of the zodiac sign a planet occupies — the sign lord determines how hospitably the sign treats its planetary guest.",
    "description": "Every zodiac sign has a ruling planet (Sign Lord / Rashi Adhipati). When a planet occupies a sign, the sign lord acts as the \"host\" — a friendly host supports the guest planet, while a hostile host creates challenges.\n\nThe sign lord's own condition in the chart also affects the \"guest\" planet. A strong sign lord (well-placed, dignified) provides a strong foundation for any planet in its sign. A weak sign lord (debilitated, combust) undermines planets in its sign.\n\n**Key principle:** Always check the sign lord's position, dignity, and strength alongside any planet's placement. A planet in a friendly sign with a strong sign lord produces significantly better results than the same planet in the same sign with a weak sign lord.",
    "howToRead": "For any planet, identify its sign lord. Then check: (1) Is the sign lord a natural friend or enemy? (2) Where is the sign lord placed? (3) Is the sign lord strong or weak? The sign lord acts as a 'manager' for all planets in its sign — a strong manager produces better team performance.",
    "significance": "Sign lord analysis is fundamental to Vedic chart reading — it prevents the oversimplification of judging a planet solely by its own sign placement without considering who 'manages' that sign.",
    "examples": [],
    "relatedTerms": [
      "rashi_lord",
      "nakshatra_lord",
      "dignity"
    ],
    "tags": [
      "attribute",
      "ruler",
      "sign"
    ]
  },
  {
    "termKey": "nakshatra_lord",
    "domain": "vedic",
    "category": "planetary_attribute",
    "title": "Nakshatra Lord (नक्षत्र स्वामी)",
    "sanskrit": "नक्षत्र स्वामी",
    "summary": "The ruling planet of the nakshatra a planet occupies — provides a deeper, more specific influence than the sign lord, critical for Dasha and KP analysis.",
    "description": "Each of the 27 nakshatras is ruled by one of the 9 planets. When a planet occupies a nakshatra, the nakshatra lord adds a secondary layer of influence — more specific and nuanced than the sign lord.\n\n**Nakshatra-planet assignments:**\nKetu: Ashwini, Magha, Moola\nVenus: Bharani, Purva Phalguni, Purva Ashadha\nSun: Krittika, Uttara Phalguni, Uttara Ashadha\nMoon: Rohini, Hasta, Shravana\nMars: Mrigashira, Chitra, Dhanishta\nRahu: Ardra, Swati, Shatabhisha\nJupiter: Punarvasu, Vishakha, Purva Bhadrapada\nSaturn: Pushya, Anuradha, Uttara Bhadrapada\nMercury: Ashlesha, Jyeshtha, Revati\n\nThe nakshatra lord is the basis of the Vimshottari Dasha system — the Janma Nakshatra's lord becomes the first Mahadasha planet.",
    "howToRead": "For any planet, check which nakshatra it occupies and who rules that nakshatra. The nakshatra lord adds its flavor to the planet's expression. For example, Mars in Pushya (Saturn-ruled) expresses differently from Mars in Ashwini (Ketu-ruled), even if both are in their respective signs.",
    "significance": "Nakshatra lords provide the bridge between planetary positions and the Dasha system. In KP Astrology, the nakshatra lord (Star Lord) is considered more important than the sign lord for prediction.",
    "examples": [],
    "relatedTerms": [
      "sign_lord",
      "nakshatra",
      "kp_star_lord",
      "vimshottari_dasha"
    ],
    "tags": [
      "attribute",
      "ruler",
      "nakshatra"
    ]
  },
  {
    "termKey": "house_placement",
    "domain": "vedic",
    "category": "planetary_attribute",
    "title": "House (Bhava) Placement (भाव स्थिति)",
    "sanskrit": "भाव",
    "summary": "The house (Bhava) a planet occupies in the chart — determines which life area the planet primarily influences. The 12 houses cover all domains of human experience.",
    "description": "The 12 houses (Bhavas) represent the complete spectrum of human experience:\n\n| House | Domain | Key Significations |\n|-------|--------|-------------------|\n| 1st | Self | Personality, body, health, appearance |\n| 2nd | Wealth | Money, speech, family, food |\n| 3rd | Courage | Siblings, communication, short travels |\n| 4th | Home | Mother, property, vehicles, education |\n| 5th | Intelligence | Children, creativity, past merit |\n| 6th | Enemies | Health issues, debts, service, litigation |\n| 7th | Partnership | Marriage, business partners, open enemies |\n| 8th | Transformation | Longevity, inheritance, occult, sudden events |\n| 9th | Fortune | Father, dharma, long travels, higher learning |\n| 10th | Career | Profession, status, authority, public life |\n| 11th | Gains | Income, fulfillment, elder siblings, networks |\n| 12th | Liberation | Losses, expenses, foreign lands, moksha |\n\nA planet's house placement is the most immediately useful piece of information — it tells you WHERE in life the planet operates.",
    "howToRead": "For each planet, note its house placement. This tells you the life area where that planet's energy is focused. Benefics (Jupiter, Venus) bless the house they occupy. Malefics (Saturn, Mars, Rahu) challenge the house but can also strengthen it through forced growth.",
    "significance": "House placement is the entry point for all chart interpretation. Before examining sign, dignity, aspects, or Dasha, most astrologers first note WHERE each planet sits — it immediately tells the story of what life areas are activated.",
    "examples": [],
    "relatedTerms": [
      "sign_lord",
      "degree"
    ],
    "tags": [
      "attribute",
      "house",
      "bhava",
      "placement"
    ]
  },
  {
    "termKey": "degree",
    "domain": "vedic",
    "category": "planetary_attribute",
    "title": "Degree (अंश)",
    "sanskrit": "अंश",
    "summary": "The exact degree position of a planet within its sign (0°-30°) — determines the nakshatra pada, divisional chart placements, and precise strength calculations.",
    "description": "The degree (Amsha) of a planet within its sign (0° to 30°) is far more than just a position marker — it determines:\n\n1. **Nakshatra and Pada**: The exact degree places the planet in a specific nakshatra pada, determining the Navamsha sign and naming syllable\n2. **Divisional Charts**: All 16 divisional charts are calculated from the exact degree — even a 1° difference can change multiple varga placements\n3. **Strength Calculations**: Shadbala, Vimsopaka, and exaltation strength all depend on exact degrees\n4. **Combustion**: Whether a planet is combust (too close to the Sun) depends on the degree gap\n5. **Planetary War**: Two planets within 1° of each other enter Graha Yuddha (planetary war)\n\n**Special degrees:**\n- Exact exaltation degree: Maximum dignity\n- Gandanta degrees (sign junctions of water-fire signs): Karmic knots\n- Pushkara degrees: Exceptionally auspicious positions within signs",
    "howToRead": "Note each planet's exact degree. Key checks: (1) Exaltation/debilitation degree proximity. (2) Combustion distance from Sun. (3) Gandanta positions (29°-0° of Cancer→Leo, Scorpio→Sagittarius, Pisces→Aries). (4) Planetary war (two planets within 1°). Each fraction of a degree matters.",
    "significance": "The degree is what separates precise Vedic astrology from Sun-sign-level generalizations. Two people born minutes apart can have different degrees, leading to different nakshatra padas, different Navamsha signs, and ultimately different life patterns.",
    "examples": [],
    "relatedTerms": [
      "longitude",
      "pada",
      "nakshatra"
    ],
    "tags": [
      "attribute",
      "degree",
      "position",
      "precise"
    ]
  },
  {
    "termKey": "longitude",
    "domain": "vedic",
    "category": "planetary_attribute",
    "title": "Longitude (स्फुट)",
    "sanskrit": "स्फुट",
    "summary": "The total ecliptic longitude of a planet (0°-360°) — the absolute position along the zodiac belt from which sign, nakshatra, and all calculations are derived.",
    "description": "Longitude (Sphuta) is the absolute position of a planet on the 360° ecliptic — the Sun's apparent path around the Earth. It is the fundamental astronomical data from which all astrological calculations begin.\n\n**Conversion:** Longitude → Sign + Degree\n- 0°-30° = Aries 0°-30°\n- 30°-60° = Taurus 0°-30°\n- ... continuing through all 12 signs\n- 330°-360° = Pisces 0°-30°\n\n**Types:**\n- **Nirayana (Sidereal) Longitude**: Used in Vedic astrology — measured from the fixed star Spica/Chitra, corrected by Ayanamsa\n- **Sayana (Tropical) Longitude**: Used in Western astrology — measured from the vernal equinox point\n\nThe difference between Sayana and Nirayana longitude is the Ayanamsa (currently approximately 24°). This is why Vedic and Western charts show planets in different signs.",
    "howToRead": "Longitude is the raw data — you'll see it in chart tables as a number like 127°34'22\". This converts to Leo 7°34'22\" (127° - 120° for the first 4 signs). In practice, you work with the sign+degree format rather than raw longitude.",
    "significance": "Understanding longitude is essential for grasping why Vedic (sidereal) and Western (tropical) astrology place planets in different signs — the Ayanamsa correction is the key difference.",
    "examples": [],
    "relatedTerms": [
      "degree",
      "ayanamsa",
      "lahiri_ayanamsa"
    ],
    "tags": [
      "attribute",
      "astronomy",
      "position"
    ]
  },
  {
    "termKey": "retrograde",
    "domain": "vedic",
    "category": "planetary_attribute",
    "title": "Retrograde — Vakri (वक्री)",
    "sanskrit": "वक्री",
    "summary": "A planet's apparent backward motion through the zodiac — an optical illusion caused by orbital mechanics, but with real astrological significance: intensified, internalized expression.",
    "description": "Retrograde (Vakri) motion occurs when a planet appears to move backward through the zodiac. This is an optical illusion caused by the relative orbital speeds of Earth and the outer planet — similar to how a slower car appears to move backward when you pass it on a highway.\n\n**Who retrogrades:**\n- Mercury: ~3 times/year for ~3 weeks each\n- Venus: ~once every 18 months for ~6 weeks\n- Mars: ~once every 2 years for ~2-3 months\n- Jupiter: ~once/year for ~4 months\n- Saturn: ~once/year for ~4.5 months\n- Rahu/Ketu: Always retrograde (by convention)\n- Sun/Moon: NEVER retrograde\n\n**Vedic interpretation:**\n- Retrograde planets are STRONGER in Shadbala (higher Cheshta Bala)\n- They express their energy inwardly, unconventionally, or with delay\n- Results manifest differently than expected — not worse, but different\n- Past-life connections: Retrograde planets may indicate unfinished karmic business",
    "howToRead": "Check the 'R' marker next to planets in the chart. Retrograde planets operate differently: (1) They give results in a non-linear fashion. (2) They may cause revisiting past situations. (3) Their Dasha periods bring unexpected turns. (4) They are astronomically closer to Earth = stronger influence.",
    "significance": "Retrograde planets challenge the simplistic 'strong = good, weak = bad' framework. They are strong (high Cheshta Bala) but unconventional — teaching that power can express in non-obvious ways.",
    "examples": [],
    "relatedTerms": [
      "cheshta_bala",
      "degree"
    ],
    "tags": [
      "attribute",
      "retrograde",
      "motion"
    ]
  },
  {
    "termKey": "combustion",
    "domain": "vedic",
    "category": "planetary_attribute",
    "title": "Combustion — Asta (अस्त)",
    "sanskrit": "अस्त",
    "summary": "A planet too close to the Sun becomes 'combust' (invisible) — its significations are overpowered by the Sun's ego/authority, weakening its independent expression.",
    "description": "Combustion (Asta) occurs when a planet moves too close to the Sun, becoming invisible in the sky due to the Sun's overwhelming brightness. Each planet has a specific combustion threshold:\n\n| Planet | Combust within |\n|--------|---------------|\n| Moon | 12° |\n| Mars | 17° |\n| Mercury | 14° (12° if retrograde) |\n| Jupiter | 11° |\n| Venus | 10° (8° if retrograde) |\n| Saturn | 15° |\n\n**Effects:** The combust planet's significations are \"burnt\" or overpowered by the Sun's energy. This typically manifests as:\n- The planet's house lordship results are delayed or diminished\n- The person's relationship with what the planet signifies becomes ego-driven (Sun's influence)\n- Natural significations (e.g., Jupiter = wisdom, Venus = love) lose their independence\n\n**Important nuance:** Mercury is frequently combust (never more than 28° from Sun) — strict combustion rules would make Mercury combust for a large percentage of people. Many astrologers use a narrower 5° threshold for Mercury or ignore its combustion entirely.",
    "howToRead": "Check the degree gap between the Sun and each planet. If within the combustion threshold, the planet is combust. Combust planets need remedial attention — especially if they lord important houses. A combust Venus (love) or Jupiter (wisdom) can significantly affect relationships and decision-making.",
    "significance": "Combustion is one of the most debated concepts in Vedic astrology — traditionalists apply strict rules while modernists use narrower thresholds. Understanding the concept helps interpret why certain planetary significations feel 'blocked' or 'ego-contaminated.'",
    "examples": [],
    "relatedTerms": [
      "sun",
      "degree",
      "budha_aditya_yoga"
    ],
    "tags": [
      "attribute",
      "combustion",
      "weakness",
      "sun"
    ]
  },
  {
    "termKey": "dignity",
    "domain": "vedic",
    "category": "planetary_attribute",
    "title": "Dignity (बल स्थिति)",
    "sanskrit": "बल स्थिति",
    "summary": "A planet's sign-based strength status — exalted, own sign, friendly, neutral, enemy, or debilitated — indicating how comfortably the planet can express its nature.",
    "description": "Dignity is the comprehensive sign-based strength classification for a planet. It follows a hierarchy from strongest to weakest:\n\n1. **Exalted (Ucha)**: Peak strength — planet at its cosmic best\n2. **Moolatrikona**: Strong — the planet's 'office' within its own sign (specific degree range)\n3. **Own Sign (Swakshetra)**: Comfortable — at home, self-sufficient\n4. **Friendly Sign (Mitra Kshetra)**: Good — supported by the sign lord's friendship\n5. **Neutral Sign (Sama Kshetra)**: Average — neither helped nor hindered\n6. **Enemy Sign (Shatru Kshetra)**: Challenging — the sign lord is hostile\n7. **Debilitated (Neecha)**: Weakest — planet struggles to express naturally\n\n**Moolatrikona** (often overlooked) is the specific degree range within a planet's own sign where it functions most naturally:\n- Sun: Leo 0°-20°\n- Moon: Taurus 4°-20°\n- Mars: Aries 0°-12°\n- Mercury: Virgo 16°-20°\n- Jupiter: Sagittarius 0°-10°\n- Venus: Libra 0°-15°\n- Saturn: Aquarius 0°-20°",
    "howToRead": "Check each planet's dignity status — the chart software typically labels this. Exalted and own-sign planets are your chart's strongest performers. Debilitated planets are the weakest and may need remedial support. The overall dignity distribution across the chart determines its general strength.",
    "significance": "Dignity is the most fundamental strength indicator in Vedic astrology — it's the first thing experienced astrologers assess. A chart with multiple well-dignified planets (exalted, own sign, Moolatrikona) is inherently stronger than one with debilitated or enemy-sign placements.",
    "examples": [],
    "relatedTerms": [
      "ucha",
      "neecha",
      "swakshetra",
      "vimsopaka"
    ],
    "tags": [
      "attribute",
      "dignity",
      "strength",
      "comprehensive"
    ]
  },
  {
    "termKey": "kp_system",
    "domain": "kp",
    "category": "kp_core",
    "title": "KP System (Krishnamurti Paddhati)",
    "sanskrit": "कृष्णमूर्ति पद्धति",
    "summary": "A precision astrology system developed by Prof. K.S. Krishnamurti that divides nakshatras into sub-divisions ruled by different planets, enabling highly specific predictions.",
    "description": "Krishnamurti Paddhati (KP) is a modern refinement of Vedic astrology created in the 1960s by Prof. K.S. Krishnamurti of Madras. Unlike Parashari astrology which relies primarily on sign lords, KP introduces a multi-layered lord system: Sign Lord (RL) → Star Lord (NL) → Sub Lord (SL) → Sub-Sub Lord (SS). Each nakshatra (13°20') is subdivided proportionally according to Vimshottari Dasha periods, and the Sub Lord of a cusp or planet becomes the decisive factor for predictions. KP uses the Placidus house system (unequal houses), Lahiri/KP Ayanamsa, and treats Rahu/Ketu as co-lords of the signs they occupy. The system is especially powerful for Prashna (horary) astrology where a querent picks a number from 1-249 corresponding to a specific sub-lord division.",
    "howToRead": "In a KP chart, focus on the Sub Lord (SL) of each house cusp — it determines whether the house promise will manifest. Check which houses the SL signifies through its star lord chain. If the SL signifies favorable houses for the query, the result is positive. The 4-level chain (RL → NL → SL → SS) provides increasingly precise timing and results.",
    "significance": "KP System revolutionized prediction accuracy by providing a structured, logical framework that reduces ambiguity. Where Parashari might give multiple possible outcomes, KP narrows predictions to specific yes/no answers with precise timing through dasha periods.",
    "examples": [
      {
        "title": "Marriage Prediction",
        "content": "For marriage, check the Sub Lord of the 7th cusp. If the SL signifies houses 2, 7, and 11 (marriage-favorable houses), marriage is promised. The timing comes from the dasha of planets signifying these same houses."
      },
      {
        "title": "KP Number (Horary)",
        "content": "A querent asks 'Will I get the job?' and picks number 178. This maps to a specific degree in the zodiac, establishing the horary ascendant. The Sub Lord of the 10th cusp in this chart determines the answer."
      }
    ],
    "relatedTerms": [
      "sub_lord",
      "star_lord",
      "sign_lord",
      "cuspal_analysis",
      "kp_horary",
      "significator"
    ],
    "tags": [
      "kp",
      "krishnamurti",
      "paddhati",
      "system",
      "sub-lord",
      "prediction"
    ]
  },
  {
    "termKey": "sub_lord",
    "domain": "kp",
    "category": "kp_core",
    "title": "Sub Lord (SL)",
    "sanskrit": "उप स्वामी",
    "summary": "The planet ruling the sub-division within a nakshatra — the most critical factor in KP predictions, determining whether a house promise manifests.",
    "description": "In KP astrology, each nakshatra (13°20' arc) is divided into 9 unequal sub-divisions proportional to the Vimshottari Dasha periods. For example, in Ashwini nakshatra (ruled by Ketu), the first sub belongs to Ketu (0°00'-0°46'40\"), then Venus (0°46'40\"-3°33'20\"), and so on through all 9 planets. The planet ruling the sub-division where a cusp or planet falls is called the Sub Lord (SL). Prof. Krishnamurti's key discovery was that the Sub Lord is the DECISIVE factor — it determines whether the house promise will be fulfilled or denied. The Star Lord shows the general trend, but the Sub Lord confirms or negates it.",
    "howToRead": "When you see 'SL: Jupiter' for the 7th cusp, it means the 7th house cusp falls in a sub-division ruled by Jupiter. Check which houses Jupiter signifies through occupation, ownership, and its own star lord chain. If Jupiter connects to houses 2, 7, 11 (marriage houses), the 7th house promise of marriage is confirmed.",
    "significance": "The Sub Lord concept is KP's most important contribution to astrology. It resolves the classic problem of identical twins — even a few minutes' birth time difference can change the Sub Lord of key cusps, explaining different life outcomes.",
    "examples": [
      {
        "title": "SL Confirming Promise",
        "content": "7th cusp SL is Venus, placed in the star of Mercury (lord of 2 and 11). Venus through its star lord connects to marriage-favorable houses 2, 7, 11 — marriage is strongly promised."
      },
      {
        "title": "SL Denying Promise",
        "content": "10th cusp SL is Saturn, in the star of Mars (lord of 6 and 12). Saturn through its star lord connects to separation houses — despite other positive factors, career stability is denied."
      }
    ],
    "relatedTerms": [
      "kp_system",
      "star_lord",
      "sign_lord",
      "sub_sub_lord",
      "cuspal_analysis"
    ],
    "tags": [
      "kp",
      "sub-lord",
      "sl",
      "prediction",
      "decisive",
      "nakshatra-division"
    ]
  },
  {
    "termKey": "star_lord",
    "domain": "kp",
    "category": "kp_core",
    "title": "Star Lord (Nakshatra Lord / NL)",
    "sanskrit": "नक्षत्र स्वामी",
    "summary": "The planet ruling the nakshatra (lunar mansion) where a cusp or planet is placed — indicates the source and general direction of results.",
    "description": "The Star Lord (also called Nakshatra Lord or NL) is the planet that rules the nakshatra in which a house cusp or planet is positioned. There are 27 nakshatras, each spanning 13°20', ruled by the 9 Vimshottari planets: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury (repeating 3 times). In KP theory, the Star Lord determines 'through which planet's significations' the results will flow. It acts as an intermediary — the planet in a star acts AS IF it were the star lord for the purpose of delivering results. The Star Lord reveals the SOURCE of the outcome, while the Sub Lord determines whether it actually manifests.",
    "howToRead": "When you see 'NL: Mars' for Jupiter, it means Jupiter is placed in a nakshatra ruled by Mars. Jupiter will primarily deliver results related to the houses owned and occupied by Mars. If Mars owns houses 5 and 10, Jupiter will channel its energy through 5th and 10th house matters (education, career).",
    "significance": "The Star Lord concept explains why planets don't always give results of the houses they own or occupy. A planet gives results primarily of its Star Lord's significations — this is a fundamental departure from Parashari astrology.",
    "examples": [
      {
        "title": "Planet in Star",
        "content": "Venus is in Mrigashira nakshatra (Star Lord = Mars, owner of houses 4 and 9). Venus will primarily deliver 4th house (property, vehicles) and 9th house (fortune, travel) results, regardless of Venus's own house positions."
      }
    ],
    "relatedTerms": [
      "sub_lord",
      "sign_lord",
      "kp_system",
      "nakshatra",
      "significator"
    ],
    "tags": [
      "kp",
      "star-lord",
      "nakshatra-lord",
      "nl",
      "signification"
    ]
  },
  {
    "termKey": "sign_lord",
    "domain": "kp",
    "category": "kp_core",
    "title": "Sign Lord (Rashi Lord / RL)",
    "sanskrit": "राशि स्वामी",
    "summary": "The planet that owns the zodiac sign where a cusp or planet is placed — provides the broadest level of signification in the KP 4-level chain.",
    "description": "The Sign Lord (RL) is the traditional ruler of the zodiac sign. In KP's 4-level hierarchy (RL → NL → SL → SS), the Sign Lord represents the outermost, most general layer. Each of the 12 signs has a planetary ruler: Aries/Scorpio=Mars, Taurus/Libra=Venus, Gemini/Virgo=Mercury, Cancer=Moon, Leo=Sun, Sagittarius/Pisces=Jupiter, Capricorn/Aquarius=Saturn. In KP, Rahu and Ketu are also treated as co-lords of their occupied signs. The Sign Lord establishes the broad domain, but it is the Star Lord and Sub Lord that refine the prediction to specifics.",
    "howToRead": "The Sign Lord appears as 'RL' in KP bhava tables. It provides background context — like the 'department' in which events will unfold. The NL (Star Lord) narrows it to a 'division', and the SL (Sub Lord) pinpoints the exact 'desk' where results materialize.",
    "significance": "While the Sign Lord is the least decisive of the KP chain, it still establishes the fundamental energy. In traditional Parashari, the Sign Lord IS the primary analysis tool — KP treats it as just the starting point.",
    "examples": [
      {
        "title": "KP Chain Example",
        "content": "2nd cusp at 15° Taurus: RL = Venus (Taurus lord), NL = Moon (Rohini nakshatra), SL = Mars (Rohini sub). The broad domain is Venus (wealth, luxury), channeled through Moon (public, emotions), confirmed/denied by Mars's significations."
      }
    ],
    "relatedTerms": [
      "sub_lord",
      "star_lord",
      "kp_system",
      "rashi_lord"
    ],
    "tags": [
      "kp",
      "sign-lord",
      "rashi-lord",
      "rl",
      "ownership"
    ]
  },
  {
    "termKey": "sub_sub_lord",
    "domain": "kp",
    "category": "kp_core",
    "title": "Sub-Sub Lord (SS)",
    "sanskrit": "उप-उप स्वामी",
    "summary": "The fourth and finest level of the KP lord chain — used for precise timing and advanced predictions beyond the Sub Lord.",
    "description": "The Sub-Sub Lord (SS) extends the KP subdivision one level deeper. Just as each nakshatra is divided into 9 subs, each sub is further divided into 9 sub-subs, again proportional to Vimshottari Dasha periods. This creates 729 divisions of the zodiac (27 × 9 × 3 = 729 in practical usage), giving extremely precise positions. The SS is primarily used in Advanced SSL analysis for fine-tuning predictions — particularly for exact timing of events and resolving cases where the Sub Lord alone is ambiguous. In KP horary, the SS can distinguish between very similar birth times or horary numbers.",
    "howToRead": "The SS column appears in detailed KP bhava tables. It's most useful when the SL analysis is borderline — if the SL signifies both favorable and unfavorable houses equally, the SS breaks the tie. For timing, the SS helps pinpoint the exact sub-period (Pratyantar or Sookshma dasha) when an event occurs.",
    "significance": "Advanced KP practitioners use the SS for precision timing that the SL alone cannot provide. It's especially valuable in rectifying birth times — even a 1-minute difference can change the SS of a cusp.",
    "examples": [],
    "relatedTerms": [
      "sub_lord",
      "star_lord",
      "sign_lord",
      "kp_system"
    ],
    "tags": [
      "kp",
      "sub-sub-lord",
      "ss",
      "advanced",
      "precision",
      "timing"
    ]
  },
  {
    "termKey": "cuspal_analysis",
    "domain": "kp",
    "category": "kp_core",
    "title": "Cuspal Analysis",
    "sanskrit": null,
    "summary": "The KP technique of analyzing each house cusp's 4-level lord chain to determine whether the house promise will manifest.",
    "description": "Cuspal Analysis is the primary predictive technique in KP astrology. Each of the 12 house cusps has a specific zodiacal degree, and that degree falls in a sign (RL), nakshatra (NL), sub (SL), and sub-sub (SS). The analysis focuses on the Sub Lord of each cusp — checking which houses the SL signifies to determine if the house promise is fulfilled. For any life question, identify the relevant houses, then check if their cuspal Sub Lords connect to favorable houses. The cuspal degree is calculated using the Placidus house system (unequal houses), which is standard in KP — unlike Parashari's equal-house system.",
    "howToRead": "Read the KP Bhava Details table row by row. Each row shows: House Number | RL | NL | SL | SS | Degree. Focus on the SL column — trace its significations through the houses it occupies, owns, and whose stars it tenants. If those houses support the query, the cusp's promise is positive.",
    "significance": "Cuspal analysis replaces the Parashari concept of 'house lord' analysis. In KP, it's not enough that a planet owns a good house — the cuspal Sub Lord must confirm the promise through its own signification chain.",
    "examples": [
      {
        "title": "Career Query",
        "content": "For career success, check the SL of the 10th cusp. If the SL is Jupiter, and Jupiter occupies the star of Mercury (lord of 2, 11), then Jupiter connects to money houses through the career cusp — professional success with financial rewards is indicated."
      },
      {
        "title": "Health Query",
        "content": "For health, check the SL of the 1st cusp (body) and 6th cusp (disease). If the 6th cusp SL signifies 1, 5, 11 — disease is cured. If it signifies 6, 8, 12 — chronic health issues persist."
      }
    ],
    "relatedTerms": [
      "sub_lord",
      "kp_system",
      "significator",
      "cuspal_interlink"
    ],
    "tags": [
      "kp",
      "cuspal",
      "analysis",
      "house",
      "cusp",
      "prediction"
    ]
  },
  {
    "termKey": "cuspal_interlink",
    "domain": "kp",
    "category": "kp_core",
    "title": "Cuspal Interlink (Promise Analysis)",
    "sanskrit": null,
    "summary": "A KP technique showing how house cusps connect to each other through their lord chains — revealing whether combined life promises (like 'marriage + wealth') are linked.",
    "description": "Cuspal Interlink analysis examines how different house cusps connect through their Sub Lord chains. For any life event, multiple houses are involved — marriage needs 2nd (family), 7th (spouse), and 11th (fulfillment). Cuspal Interlink checks if the Sub Lords of these houses mutually signify each other, creating a 'promise chain.' If the 7th cusp SL signifies 2 and 11, AND the 2nd cusp SL signifies 7 and 11, there's a strong interlinked promise of marriage. The Advanced SSL variant extends this analysis to the Sub-Sub Lord level for greater precision. Each interlink is rated by strength and given a verdict (favorable, neutral, or unfavorable).",
    "howToRead": "In the Interlink table, each row shows a house topic (e.g., 'Marriage'), the relevant houses (2, 7, 11), and the chain of lords connecting them. Green/positive houses support the topic, red/negative houses oppose it. A 'strong' strength with 'favorable' verdict means the life promise is well-supported.",
    "significance": "Cuspal Interlink is a KP innovation that reveals hidden connections between life areas. It can show, for example, that career success (10th) is linked to foreign travel (12th) — indicating a career abroad.",
    "examples": [],
    "relatedTerms": [
      "cuspal_analysis",
      "sub_lord",
      "significator",
      "kp_system"
    ],
    "tags": [
      "kp",
      "cuspal",
      "interlink",
      "promise",
      "house-connection"
    ]
  },
  {
    "termKey": "significator",
    "domain": "kp",
    "category": "kp_core",
    "title": "Significator",
    "sanskrit": null,
    "summary": "A planet that represents or 'signifies' specific houses through occupation, ownership, or star-lord connection — the foundation of KP prediction logic.",
    "description": "In KP astrology, a planet becomes a significator of a house through four levels of connection (in decreasing order of strength): (1) Planets in the STAR of occupants of the house, (2) Occupants of the house, (3) Planets in the STAR of the house owner, (4) The house owner itself. This 4-level significator hierarchy is the backbone of KP predictions. The Signification Matrix shows which houses each planet signifies, creating a map of planetary-house connections. When a planet's dasha runs and it signifies houses relevant to a life event, that event manifests. Multiple planets signifying the same houses create a stronger indication.",
    "howToRead": "In the Signification Matrix, each planet row lists the houses it signifies. For a specific query (e.g., job change), identify the relevant houses (2, 6, 10, 11 for new job) and find which planets signify ALL or most of these houses. Those planets' dasha periods will trigger the event.",
    "significance": "The significator concept replaces the simpler Parashari idea that a planet gives results of the house it occupies and owns. In KP, a planet primarily gives results of its STAR LORD's houses — making the significator hierarchy essential for accurate prediction.",
    "examples": [
      {
        "title": "Significator Hierarchy",
        "content": "For the 7th house (marriage): Level 1 — Venus is in the star of Mars who occupies the 7th. Level 2 — Mars occupies the 7th. Level 3 — Moon is in the star of Jupiter who owns the 7th. Level 4 — Jupiter owns the 7th. Venus (Level 1) is the strongest 7th-house significator."
      }
    ],
    "relatedTerms": [
      "cuspal_analysis",
      "star_lord",
      "kp_system",
      "cuspal_interlink"
    ],
    "tags": [
      "kp",
      "significator",
      "house",
      "signification",
      "prediction",
      "hierarchy"
    ]
  },
  {
    "termKey": "ruling_planets",
    "domain": "kp",
    "category": "kp_core",
    "title": "Ruling Planets (RP)",
    "sanskrit": "शासक ग्रह",
    "summary": "The planets governing the current moment — derived from the day lord, Moon's position, and Ascendant — used to confirm or filter significators in KP predictions.",
    "description": "Ruling Planets (RP) are a set of planets that 'rule' the moment of judgment or query. They are derived from 5 components: (1) Day Lord — ruler of the weekday, (2) Moon Sign Lord — ruler of the sign Moon currently transits, (3) Moon Star Lord — ruler of Moon's current nakshatra, (4) Moon Sub Lord — ruler of Moon's current sub, (5) Lagna Sign Lord, Lagna Star Lord, Lagna Sub Lord — rulers of the rising sign's chain. These are ranked by strength (repeated appearances = stronger). In KP practice, when multiple planets qualify as significators for an event, the Ruling Planets act as a FILTER — only significators that also appear as Ruling Planets are likely to deliver results in the near term.",
    "howToRead": "The RP table shows each component (Day Lord, Moon RL/NL/SL, Lagna RL/NL/SL) and the resulting unique planets sorted by strength. Cross-reference these with your significator list — significators that are also Ruling Planets are the strongest candidates for timing events.",
    "significance": "Ruling Planets solve the timing problem in KP. While significators tell you WHICH planets are relevant, Ruling Planets tell you WHICH of those are active RIGHT NOW. This is why KP encourages analyzing charts at the moment of the query, not just at birth.",
    "examples": [
      {
        "title": "Filtering Significators",
        "content": "For marriage (houses 2, 7, 11), suppose Venus, Jupiter, Mercury, and Moon all signify these houses. The current Ruling Planets are Venus, Saturn, Mercury, and Rahu. Filtered result: Venus and Mercury (both significators AND ruling planets) are the strongest indicators — their dasha periods will trigger marriage."
      }
    ],
    "relatedTerms": [
      "kp_system",
      "significator",
      "cuspal_analysis",
      "kp_horary"
    ],
    "tags": [
      "kp",
      "ruling-planets",
      "rp",
      "timing",
      "filter",
      "current-moment"
    ]
  },
  {
    "termKey": "kp_horary",
    "domain": "kp",
    "category": "kp_core",
    "title": "KP Horary (Prashna)",
    "sanskrit": "प्रश्न",
    "summary": "A KP technique where the querent picks a number from 1-249 to cast a chart for answering a specific question — eliminates birth time dependency.",
    "description": "KP Horary (Prashna) is one of the most powerful applications of the KP system. Instead of requiring an accurate birth time, the querent thinks of their question and picks a number from 1 to 249. Each number corresponds to a specific sub-lord division of the zodiac (360° ÷ 249 ≈ 1°26'50\" per number). This number determines the Ascendant degree, from which a complete KP chart is erected for the moment and place of the query. The Horary chart is then analyzed exactly like a natal chart — cuspal sub-lords, significators, and ruling planets are computed. The advantage is precision — no birth time rectification is needed, and the chart directly addresses the specific question. Prof. Krishnamurti considered Horary the most reliable branch of KP.",
    "howToRead": "When a horary chart is generated from your chosen number, focus on the cusps relevant to your question. For a job question, check the 10th cusp SL. For relationships, check the 7th cusp SL. The significator table and ruling planets work identically to natal chart analysis.",
    "significance": "KP Horary solves two critical problems: (1) Most people don't have accurate birth times, and (2) Natal charts show lifetime patterns, while horary charts address the SPECIFIC question at hand with pinpoint accuracy.",
    "examples": [
      {
        "title": "Horary for Travel",
        "content": "Question: 'Will my visa be approved?' Number chosen: 156. The chart is cast with 156's corresponding ascendant. Check 3rd cusp SL (short travel), 9th cusp SL (foreign travel), and 12th cusp SL (foreign settlement). If these SLs connect to favorable houses, visa approval is indicated."
      }
    ],
    "relatedTerms": [
      "kp_system",
      "sub_lord",
      "ruling_planets",
      "significator"
    ],
    "tags": [
      "kp",
      "horary",
      "prashna",
      "question",
      "249",
      "number"
    ]
  },
  {
    "termKey": "kp_bhava",
    "domain": "kp",
    "category": "kp_core",
    "title": "Bhava (KP House)",
    "sanskrit": "भाव",
    "summary": "A house division in the KP system using the Placidus house system — each bhava has a cusp degree with its own 4-level lord chain.",
    "description": "In KP astrology, a Bhava (house) is defined by its cusp degree calculated using the Placidus house system, which creates unequal house sizes (unlike the equal-house system used in traditional Parashari). The Placidus system divides the diurnal arc of each degree proportionally, meaning houses near the horizon (1st, 7th) may be larger or smaller than those near the meridian (10th, 4th). Each bhava cusp has a precise zodiacal longitude, which determines its Sign Lord (RL), Nakshatra Lord (NL), Sub Lord (SL), and Sub-Sub Lord (SS). A planet 'belongs' to a bhava based on the cusp boundaries — it falls in whichever house's cusp range contains its degree.",
    "howToRead": "The Bhava Details table shows 12 rows, one per house. Each row displays the cusp degree (DMS format), and the 4-level lord chain. The 'Planets in House' column shows which planets physically occupy that bhava. Focus on the SL column for predictions about that house's matters.",
    "significance": "Using Placidus houses is a distinguishing feature of KP. The unequal house sizes mean planets can shift houses compared to equal-house charts — sometimes dramatically. This is why KP practitioners consider the house system crucial for accuracy.",
    "examples": [],
    "relatedTerms": [
      "cuspal_analysis",
      "kp_system",
      "sub_lord",
      "significator"
    ],
    "tags": [
      "kp",
      "bhava",
      "house",
      "placidus",
      "cusp",
      "division"
    ]
  },
  {
    "termKey": "kp_fortuna",
    "domain": "kp",
    "category": "kp_core",
    "title": "Fortuna (Part of Fortune)",
    "sanskrit": "पुण्य सहम",
    "summary": "A calculated sensitive point representing material fortune — derived from Ascendant + Moon - Sun — analyzed through KP's lord chain for wealth and luck indications.",
    "description": "Fortuna (Pars Fortunae or Part of Fortune) is an Arabic Part adopted into KP astrology. It is calculated as: Fortuna = Ascendant longitude + Moon longitude - Sun longitude (for day births) or Ascendant + Sun - Moon (for night births, in some traditions). In KP, Fortuna is treated as a sensitive point whose sign, star, and sub lords indicate the nature and timing of financial fortune. The star lord of Fortuna shows the source of wealth, while the sub lord indicates whether fortune is easily accessible or blocked. Fortuna's house placement shows the life area through which wealth flows.",
    "howToRead": "Check Fortuna's position in the KP chart: its house placement, sign, nakshatra, and sub lord. If Fortuna's sub lord signifies houses 2 (wealth), 6 (service income), 10 (career), or 11 (gains), financial fortune is strong. If it signifies 8 (obstacles) or 12 (losses), material fortune faces challenges.",
    "significance": "Fortuna adds a wealth-specific analysis layer to KP charts. While the 2nd and 11th cusps show general wealth potential, Fortuna specifically indicates 'luck' — the unearned or unexpected financial blessings in one's life.",
    "examples": [],
    "relatedTerms": [
      "kp_system",
      "sub_lord",
      "cuspal_analysis"
    ],
    "tags": [
      "kp",
      "fortuna",
      "fortune",
      "wealth",
      "arabic-parts",
      "sensitive-point"
    ]
  },
  {
    "termKey": "kp_nakshatra_nadi",
    "domain": "kp",
    "category": "kp_core",
    "title": "Nakshatra Nadi (KP)",
    "sanskrit": null,
    "summary": "A KP-specific analysis technique that examines the nakshatra-level connections between planets, revealing hidden planetary relationships beyond sign-based aspects.",
    "description": "Nakshatra Nadi in KP astrology examines the deeper connections between planets through their nakshatra placements. When two planets occupy nakshatras ruled by the same star lord, they form a 'Nadi connection' — they will deliver similar results and activate during similar dasha periods. This technique goes beyond traditional aspects (angular relationships) to reveal functional partnerships between planets. For example, if Saturn is in Pushya (star lord: Saturn) and Venus is in Anuradha (star lord: Saturn), both planets channel Saturn's energy and will co-activate during Saturn-related dashas. Nakshatra Nadi also reveals when planets are working at cross-purposes — if their star lords signify opposing houses.",
    "howToRead": "In the Nakshatra Nadi view, planets are grouped by their star lords. Planets sharing the same star lord form a 'Nadi group' — they function as a team for predictions. Check if your query-relevant significators share Nadi groups, strengthening the prediction.",
    "significance": "Nakshatra Nadi explains why planets without any traditional aspect still influence each other. It's a purely KP concept that has no Parashari equivalent, adding a layer of analysis unique to the system.",
    "examples": [],
    "relatedTerms": [
      "star_lord",
      "nakshatra",
      "kp_system",
      "significator"
    ],
    "tags": [
      "kp",
      "nakshatra",
      "nadi",
      "connection",
      "star-lord",
      "groups"
    ]
  },
  {
    "termKey": "kp_mahadasha",
    "domain": "kp",
    "category": "kp_dasha",
    "title": "KP Dasha System",
    "sanskrit": null,
    "summary": "KP uses the same Vimshottari Dasha periods as Parashari but interprets them through the significator framework — a planet's dasha activates the houses it signifies, not the houses it owns.",
    "description": "While KP uses the standard Vimshottari Dasha system (120-year cycle, 9 planets, Moon's nakshatra determines starting dasha), its INTERPRETATION differs fundamentally from Parashari. In KP, when a planet's dasha runs, it delivers results of the houses it SIGNIFIES — determined by the star lord it tenants, not its ownership or occupation alone. KP recognizes 5 dasha levels for precision timing: Mahadasha (major period) → Antardasha (sub-period) → Pratyantar Dasha (sub-sub) → Sookshma Dasha (finer) → Prana Dasha (finest). An event manifests when the running Mahadasha lord, Antardasha lord, AND Pratyantar lord all signify the relevant houses simultaneously.",
    "howToRead": "In the KP Dasha table, check the current Mahadasha, Antardasha, and Pratyantar lords. Look up each lord's significations in the Signification Matrix. Where all three overlap (signify the same houses), those house matters will dominate the current period.",
    "significance": "KP Dasha interpretation is more precise than Parashari because it relies on the significator hierarchy rather than simple ownership. This means the same planet can give dramatically different results in different charts based on its star lord chain.",
    "examples": [
      {
        "title": "Dasha Convergence",
        "content": "Currently running: Jupiter Maha / Venus Antar / Mercury Pratyantar. Jupiter signifies 4, 7. Venus signifies 2, 7, 11. Mercury signifies 7, 10. All three signify the 7th house — this is a strong marriage period. The exact month comes from the Sookshma dasha lord."
      }
    ],
    "relatedTerms": [
      "vimshottari_dasha",
      "significator",
      "kp_system",
      "mahadasha"
    ],
    "tags": [
      "kp",
      "dasha",
      "timing",
      "vimshottari",
      "signification",
      "period"
    ]
  },
  {
    "termKey": "kp_placidus",
    "domain": "kp",
    "category": "kp_core",
    "title": "Placidus House System",
    "sanskrit": null,
    "summary": "The house division method used in KP astrology — creates unequal houses based on time-based division of the diurnal arc, critical for accurate cusp degrees.",
    "description": "The Placidus house system (developed by Placidus de Titis, 17th century) divides the sky based on the time it takes each degree of the ecliptic to move from the horizon to the meridian. This creates houses of unequal size — near the poles, some houses can be extremely large while others are very small. KP exclusively uses Placidus because it provides the most time-sensitive cusp degrees, which is essential for the sub-lord system where even a fraction of a degree changes the SL. In contrast, Parashari astrology typically uses equal houses (each house = one sign = 30°) or Sripathi (unequal but different algorithm). The Placidus system makes KP charts highly sensitive to birth time accuracy — even a 1-2 minute difference can shift cusp sub-lords.",
    "howToRead": "Notice that KP houses are NOT 30° each. A house might span 25° or 38° depending on latitude and time of birth. This means planets may shift houses compared to equal-house charts. Always use the KP-Placidus cusps as the authoritative house positions.",
    "significance": "The Placidus system is inseparable from KP methodology. Using a different house system with KP sub-lords would produce incorrect results. This is why KP software always defaults to Placidus.",
    "examples": [],
    "relatedTerms": [
      "kp_bhava",
      "cuspal_analysis",
      "kp_system"
    ],
    "tags": [
      "kp",
      "placidus",
      "house-system",
      "unequal",
      "cusp",
      "division"
    ]
  },
  {
    "termKey": "kp_ayanamsa",
    "domain": "kp",
    "category": "kp_core",
    "title": "KP Ayanamsa",
    "sanskrit": null,
    "summary": "The precession correction value used in KP astrology — slightly different from Lahiri Ayanamsa, calibrated by Prof. Krishnamurti for maximum sub-lord accuracy.",
    "description": "Ayanamsa is the angular difference between the Tropical (Western) and Sidereal (Vedic) zodiacs, caused by the precession of equinoxes (~50.3\" per year). Prof. Krishnamurti developed his own Ayanamsa value (KP Ayanamsa), which differs from the standard Lahiri (Chitrapaksha) Ayanamsa by a small amount (~6 minutes of arc). While the difference seems negligible, at the sub-lord level where divisions can be less than 1°, this difference can change the sub-lord of a cusp — leading to different predictions. The KP Ayanamsa was calibrated through extensive empirical testing against known life events. Some KP practitioners use 'KP Straight Line Ayanamsa' (a linear approximation) while others use 'KP New Ayanamsa' (with updated nutation corrections).",
    "howToRead": "In your KP chart software, ensure 'KP Ayanamsa' (not Lahiri) is selected. The difference is small but can be critical for cusps near sub-lord boundaries. Grahvani defaults to the standard KP Ayanamsa for all KP calculations.",
    "significance": "Using the correct Ayanamsa is the foundation of KP accuracy. A wrong Ayanamsa shifts every planet and cusp position, potentially changing multiple sub-lords and invalidating the entire prediction chain.",
    "examples": [],
    "relatedTerms": [
      "kp_system",
      "kp_placidus",
      "sub_lord"
    ],
    "tags": [
      "kp",
      "ayanamsa",
      "precession",
      "sidereal",
      "correction"
    ]
  },
  {
    "termKey": "kp_shodasha_varga",
    "domain": "kp",
    "category": "kp_core",
    "title": "Shodasha Varga (KP Divisional Signs)",
    "sanskrit": null,
    "summary": "The 16 divisional chart sign positions calculated within the KP system — used to assess planetary strength and dignity across multiple life dimensions.",
    "description": "While Shodasha Varga (16 divisional charts) is traditionally a Parashari concept, KP incorporates it for supplementary analysis. In KP, the primary prediction comes from the cuspal sub-lord system, but Shodasha Varga signs provide additional dignity and strength assessment. The 16 vargas (D1 through D60) show where each planet falls in each divisional chart — a planet in its own sign or exaltation sign across multiple vargas is considered strong. This feeds into the Vimsopaka Bala (20-point strength) calculation. KP practitioners use this as a secondary confirmation tool — if the sub-lord chain is positive AND the relevant planets have strong Shodasha Varga dignity, the prediction is more emphatic.",
    "howToRead": "The KP Shodasha Varga table shows each planet's sign position across the 16 divisions. Count how many times a planet falls in its own sign, exaltation, or friendly sign. More favorable placements = stronger planet. Use this alongside (not instead of) the KP significator analysis.",
    "significance": "Shodasha Varga bridges KP and Parashari systems. It allows KP practitioners to assess planetary inherent strength — a strong significator is more likely to deliver results than a weak one, even if both signify the same houses.",
    "examples": [],
    "relatedTerms": [
      "kp_system",
      "vimsopaka",
      "d1_rashi",
      "d9_navamsha"
    ],
    "tags": [
      "kp",
      "shodasha",
      "varga",
      "divisional",
      "strength",
      "dignity"
    ]
  },
  {
    "termKey": "kp_249_mapping",
    "domain": "kp",
    "category": "kp_core",
    "title": "KP 249 Sub-Lord Mapping",
    "sanskrit": null,
    "summary": "The division of the 360° zodiac into 249 sub-lord segments — the foundation of KP horary and the basis for sub-lord determination in all KP charts.",
    "description": "The 249 Sub-Lord Mapping is the mathematical heart of KP astrology. The zodiac (360°) contains 27 nakshatras × 9 subs = 243 subdivisions. However, since the sub proportions are based on Vimshottari Dasha years (Ketu=7, Venus=20, Sun=6, Moon=10, Mars=7, Rahu=18, Jupiter=16, Saturn=19, Mercury=17 = 120 years total), each sub's arc length is: (planet's dasha years / 120) × 13°20'. Some subs span multiple sub-lord boundaries when considering the full 360°, resulting in 249 unique segments when enumerated sequentially. In KP Horary, each of the 249 numbers maps to a specific zodiacal degree, which becomes the Ascendant of the horary chart. This mapping is tabulated in standard KP reference tables.",
    "howToRead": "When selecting a horary number (1-249), you're selecting a specific sub-lord division. Number 1 = 0°00' Aries (start of Ashwini nakshatra, Ketu star, Ketu sub). Number 249 = the last sub in Pisces. Each number maps to a unique RL-NL-SL combination, printed in KP table references.",
    "significance": "The 249 mapping converts the continuous zodiac into a discrete, enumerable system — making it possible to use simple number selection for precise astrological analysis. This is KP's most practical innovation for daily consultation.",
    "examples": [],
    "relatedTerms": [
      "kp_horary",
      "sub_lord",
      "kp_system",
      "nakshatra"
    ],
    "tags": [
      "kp",
      "249",
      "mapping",
      "horary",
      "sub-lord",
      "division",
      "zodiac"
    ]
  },
  {
    "termKey": "koota_varna",
    "domain": "matchmaking",
    "category": "ashta_koota",
    "title": "Varna Koota",
    "sanskrit": "वर्ण कूट",
    "summary": "The first koota (1 point max) assessing spiritual compatibility and ego hierarchy between the couple — based on the four Vedic social orders.",
    "description": "Varna Koota evaluates compatibility based on the Vedic Varna (social/spiritual classification) of each person's Moon sign. The four Varnas are: Brahmin (priest/scholar — Cancer, Scorpio, Pisces), Kshatriya (warrior/leader — Aries, Leo, Sagittarius), Vaishya (merchant/trader — Taurus, Virgo, Capricorn), and Shudra (service/labor — Gemini, Libra, Aquarius). The scoring rule: If the groom's Varna is equal to or higher than the bride's, full 1 point is awarded. If the bride's Varna is higher, 0 points. In modern interpretation, this koota represents ego compatibility and respect dynamics — whether both partners can maintain mutual respect without ego clashes.",
    "howToRead": "Score: 1 = Full compatibility (balanced ego dynamics). Score: 0 = Potential ego friction (the 'lower Varna' partner may feel dominated). With only 1 point maximum, Varna is the LEAST weighted koota — a 0 score here is rarely a dealbreaker.",
    "significance": "Varna Koota has the lowest weight because spiritual/ego compatibility, while important, is the most adaptable aspect of a relationship. Modern couples can consciously work on ego balance regardless of their Varna classification.",
    "examples": [
      {
        "title": "Full Score",
        "content": "Groom: Moon in Aries (Kshatriya). Bride: Moon in Taurus (Vaishya). Kshatriya ≥ Vaishya → 1 point awarded."
      },
      {
        "title": "Zero Score",
        "content": "Groom: Moon in Gemini (Shudra). Bride: Moon in Cancer (Brahmin). Shudra < Brahmin → 0 points."
      }
    ],
    "relatedTerms": [
      "koota_vashya",
      "koota_yoni",
      "koota_gana",
      "koota_nadi"
    ],
    "tags": [
      "matchmaking",
      "koota",
      "varna",
      "compatibility",
      "spiritual",
      "ego"
    ]
  },
  {
    "termKey": "koota_vashya",
    "domain": "matchmaking",
    "category": "ashta_koota",
    "title": "Vashya Koota",
    "sanskrit": "वश्य कूट",
    "summary": "The second koota (2 points max) measuring mutual attraction, influence, and dominance patterns — which partner has more 'pull' over the other.",
    "description": "Vashya Koota assesses the power dynamics and magnetic attraction between partners. Each Moon sign is classified into one of five Vashya categories: Chatushpada (quadruped — Aries, Taurus, 2nd half of Sagittarius, 1st half of Capricorn), Manava (human — Gemini, Virgo, Libra, 1st half of Sagittarius, Aquarius), Jalachara (aquatic — Cancer, Pisces, 2nd half of Capricorn), Vanachara (wild/forest — Leo), and Keeta (insect/reptile — Scorpio). Scoring: 2 points if both partners' Vashyas are mutually compatible or identical. 1 point if one Vashya has dominance over the other (partial compatibility). 0 points if neither has attraction toward the other. The rules of dominance follow a predator-prey logic — for example, Manava (human) dominates Chatushpada (quadruped) and Jalachara (aquatic).",
    "howToRead": "Score 2: Equal partnership with mutual attraction. Score 1: One-sided attraction — one partner may be more invested. Score 0: Lack of magnetic pull between partners. A Vashya score of 0 suggests the couple may struggle with sustained romantic interest.",
    "significance": "Vashya reveals the unconscious attraction dynamics. A high Vashya score indicates natural magnetism — the couple is drawn to each other effortlessly. Low Vashya suggests attraction may need conscious cultivation.",
    "examples": [
      {
        "title": "Full Score",
        "content": "Both partners have Moon in Manava (human) signs (Gemini + Libra). Same Vashya category → 2 points (mutual, balanced attraction)."
      },
      {
        "title": "Partial Score",
        "content": "Groom: Leo (Vanachara). Bride: Taurus (Chatushpada). Vanachara has partial dominance over Chatushpada → 1 point."
      }
    ],
    "relatedTerms": [
      "koota_varna",
      "koota_yoni",
      "koota_graha_maitri",
      "koota_gana"
    ],
    "tags": [
      "matchmaking",
      "koota",
      "vashya",
      "attraction",
      "dominance",
      "compatibility"
    ]
  },
  {
    "termKey": "koota_tara",
    "domain": "matchmaking",
    "category": "ashta_koota",
    "title": "Tara Koota",
    "sanskrit": "तारा कूट",
    "summary": "The third koota (3 points max) evaluating destiny and fortune compatibility — based on the nakshatra distance between the couple's Moon positions.",
    "description": "Tara Koota (also called Dina Koota) measures fortune compatibility by counting the nakshatra distance between the groom's and bride's Moon nakshatras. The count from groom's nakshatra to bride's is divided by 9, and the remainder determines the Tara category: 1-Janma (birth), 2-Sampat (wealth), 3-Vipat (danger), 4-Kshema (prosperity), 5-Pratyari (obstacles), 6-Sadhaka (achievement), 7-Vadha (death), 8-Mitra (friend), 9-Ati Mitra (great friend). Even remainders (2, 4, 6, 8, 0) are favorable; odd remainders (1, 3, 5, 7) are unfavorable. Both directions are checked (groom→bride AND bride→groom). If both are favorable: 3 points. One favorable: 1.5 points. Both unfavorable: 0 points.",
    "howToRead": "Score 3: Both partners bring fortune to each other. Score 1.5: One-sided fortune benefit — one partner is luckier for the other. Score 0: Mutual fortune is not aligned — life may feel like an uphill struggle together. Tara reflects the day-to-day luck and ease of the relationship.",
    "significance": "Tara Koota determines whether being together amplifies or diminishes each partner's fortune. High Tara couples often report that 'things just work out' after marriage, while low Tara couples may face unexplained obstacles.",
    "examples": [
      {
        "title": "Calculation",
        "content": "Groom: Rohini (4th nakshatra). Bride: Hasta (13th nakshatra). Distance = 13 - 4 = 9. 9 ÷ 9 = remainder 0 → Ati Mitra (great friend) = favorable. Reverse: 4 + 27 - 13 = 18. 18 ÷ 9 = remainder 0 → also favorable. Both favorable → 3 points."
      }
    ],
    "relatedTerms": [
      "koota_varna",
      "koota_yoni",
      "nakshatra",
      "koota_nadi"
    ],
    "tags": [
      "matchmaking",
      "koota",
      "tara",
      "dina",
      "fortune",
      "destiny",
      "nakshatra"
    ]
  },
  {
    "termKey": "koota_yoni",
    "domain": "matchmaking",
    "category": "ashta_koota",
    "title": "Yoni Koota",
    "sanskrit": "योनि कूट",
    "summary": "The fourth koota (4 points max) assessing physical and intimate compatibility — each nakshatra is associated with an animal representing sexual temperament.",
    "description": "Yoni Koota evaluates physical compatibility by assigning each of the 27 nakshatras an animal symbol (Yoni), representing innate physical temperament and intimate compatibility. The 14 Yoni animals are: Ashwa (horse), Gaja (elephant), Mesha (ram), Sarpa (serpent), Shvana (dog), Marjara (cat), Mushaka (rat), Gau (cow), Mahisha (buffalo), Vyaghra (tiger), Mriga (deer), Vanara (monkey), Nakula (mongoose), Simha (lion). Scoring: 4 points for same Yoni (identical temperament), 3 for friendly Yonis, 2 for neutral, 1 for enemy Yonis, 0 for sworn enemies (e.g., snake-mongoose, cat-rat). The animal pairs represent archetypal compatibility — not literal animal behavior, but energetic and temperamental alignment in physical intimacy.",
    "howToRead": "Score 4: Excellent physical compatibility — naturally in sync. Score 3: Good compatibility with minor adjustments. Score 2: Average — requires conscious effort. Score 1: Significant mismatch in physical needs. Score 0: Extremely poor physical compatibility (enemy Yonis). With 4 points maximum, Yoni is a moderately weighted koota.",
    "significance": "Yoni Koota addresses the aspect of marriage that is often taboo to discuss openly in traditional Indian culture — physical and sexual compatibility. The animal symbolism provides a culturally acceptable framework for this assessment.",
    "examples": [
      {
        "title": "Same Yoni",
        "content": "Both partners have Moon in Horse (Ashwa) nakshatras: Ashwini and Shatabhisha. Same Yoni → 4 points (perfect physical compatibility)."
      },
      {
        "title": "Enemy Yoni",
        "content": "Groom: Ardra (Dog/Shvana). Bride: Magha (Rat/Mushaka). Dog and Rat are enemy Yonis → 1 point (significant physical mismatch)."
      }
    ],
    "relatedTerms": [
      "koota_vashya",
      "koota_graha_maitri",
      "koota_nadi",
      "nakshatra"
    ],
    "tags": [
      "matchmaking",
      "koota",
      "yoni",
      "physical",
      "compatibility",
      "animal",
      "intimate"
    ]
  },
  {
    "termKey": "koota_graha_maitri",
    "domain": "matchmaking",
    "category": "ashta_koota",
    "title": "Graha Maitri Koota",
    "sanskrit": "ग्रह मैत्री कूट",
    "summary": "The fifth koota (5 points max) measuring mental wavelength and intellectual friendship — based on the planetary friendship between Moon sign lords.",
    "description": "Graha Maitri (planetary friendship) evaluates mental and intellectual compatibility by examining the relationship between the lords of each partner's Moon sign. Vedic astrology defines natural planetary friendships: Sun's friends are Moon, Mars, Jupiter; enemies are Venus, Saturn; neutral is Mercury. Each planet has its own friend/enemy/neutral list. Scoring: 5 points if both sign lords are mutual friends (e.g., Moon sign lord = Jupiter, partner's = Sun — Jupiter and Sun are mutual friends). 4 points if one is friend, other is neutral. 3 points if both are neutral. 1 point if one is friend, other is enemy. 0 points if both are mutual enemies. Graha Maitri indicates whether the couple can be true friends — sharing ideas, communicating easily, and enjoying intellectual companionship.",
    "howToRead": "Score 5: Best friends mentally — think alike, communicate effortlessly. Score 3-4: Good mental rapport with some differences. Score 0-1: Fundamental wavelength mismatch — may struggle to understand each other's thinking. This koota is crucial for long-term happiness since physical attraction fades but mental connection sustains.",
    "significance": "Graha Maitri is often considered the most important koota for modern marriages where companionship and communication matter more than traditional hierarchies. A low Graha Maitri score is harder to compensate for than low scores in other kootas.",
    "examples": [
      {
        "title": "Full Score",
        "content": "Groom: Moon in Cancer (lord = Moon). Bride: Moon in Scorpio (lord = Mars). Moon and Mars are mutual friends → 5 points (excellent mental wavelength)."
      },
      {
        "title": "Zero Score",
        "content": "Groom: Moon in Capricorn (lord = Saturn). Bride: Moon in Leo (lord = Sun). Saturn and Sun are mutual enemies → 0 points (fundamental thinking mismatch)."
      }
    ],
    "relatedTerms": [
      "koota_varna",
      "koota_gana",
      "koota_bhakoot",
      "koota_nadi"
    ],
    "tags": [
      "matchmaking",
      "koota",
      "graha-maitri",
      "mental",
      "friendship",
      "compatibility",
      "intellect"
    ]
  },
  {
    "termKey": "koota_gana",
    "domain": "matchmaking",
    "category": "ashta_koota",
    "title": "Gana Koota",
    "sanskrit": "गण कूट",
    "summary": "The sixth koota (6 points max) assessing temperament and behavioral compatibility — classifies nakshatras into Deva (divine), Manushya (human), or Rakshasa (demon) temperaments.",
    "description": "Gana Koota evaluates behavioral temperament compatibility. Each nakshatra is classified into one of three Ganas: Deva (divine/sattvic — gentle, religious, cultured), Manushya (human/rajasic — balanced, practical, worldly), or Rakshasa (demon/tamasic — independent, aggressive, unconventional). The 9 Deva nakshatras: Ashwini, Mrigashira, Punarvasu, Pushya, Hasta, Swati, Anuradha, Shravana, Revati. The 9 Manushya nakshatras: Bharani, Rohini, Ardra, P.Phalguni, U.Phalguni, P.Ashadha, U.Ashadha, P.Bhadrapada, U.Bhadrapada. The 9 Rakshasa nakshatras: Krittika, Ashlesha, Magha, Chitra, Vishakha, Jyeshtha, Moola, Dhanishta, Shatabhisha. Scoring: Same Gana = 6 points. Deva-Manushya = 5 points. Manushya-Rakshasa = 1 point. Deva-Rakshasa = 0 points (most incompatible).",
    "howToRead": "Score 6: Identical temperaments — smooth daily interactions. Score 5: Minor temperament differences but manageable. Score 1: Significant clash in lifestyle and behavior. Score 0: Fundamental temperament mismatch (gentle Deva vs aggressive Rakshasa). Note: Rakshasa-Rakshasa gets 6 points — two unconventional partners can be perfectly compatible!",
    "significance": "Gana Koota is the second-highest weighted koota (6 points) because daily behavioral compatibility is crucial for cohabitation. A Deva person may find a Rakshasa partner's directness offensive, while the Rakshasa may find the Deva partner too passive.",
    "examples": [
      {
        "title": "Same Gana",
        "content": "Both Moons in Rakshasa nakshatras: Magha and Jyeshtha. Same Gana → 6 points. Despite both being 'Rakshasa,' they understand each other's intensity."
      },
      {
        "title": "Worst Mismatch",
        "content": "Groom: Pushya (Deva). Bride: Ashlesha (Rakshasa). Deva-Rakshasa → 0 points. The gentle Pushya native may find Ashlesha's manipulative tendencies deeply troubling."
      }
    ],
    "relatedTerms": [
      "koota_varna",
      "koota_yoni",
      "koota_bhakoot",
      "koota_nadi",
      "gana"
    ],
    "tags": [
      "matchmaking",
      "koota",
      "gana",
      "temperament",
      "deva",
      "manushya",
      "rakshasa"
    ]
  },
  {
    "termKey": "koota_bhakoot",
    "domain": "matchmaking",
    "category": "ashta_koota",
    "title": "Bhakoot Koota",
    "sanskrit": "भकूट कूट",
    "summary": "The seventh koota (7 points max) evaluating love, family welfare, and financial prosperity — based on the Moon sign distance between partners.",
    "description": "Bhakoot Koota (also called Rashyadhipati) is the second-most important koota, assessing the impact of marriage on family welfare, financial prosperity, and emotional love. It examines the relationship between the partners' Moon signs by their positional distance (1st-12th from each other). Certain combinations are inauspicious: 2-12 (financial drain), 6-8 (health issues and separation), 5-9 (progeny concerns). If the Moon signs fall in these pairs, Bhakoot scores 0; otherwise it scores the full 7 points. However, there are important cancellation rules: if the lords of both Moon signs are friends, or if the same planet rules both signs, or if both Moon signs are ruled by the same planet, the Bhakoot Dosha is cancelled and full 7 points are restored.",
    "howToRead": "Score 7: No Bhakoot Dosha — positive impact on family and finances. Score 0: Bhakoot Dosha present — potential financial strain or health issues in marriage. ALWAYS check cancellation rules before declaring Bhakoot Dosha — if sign lords are mutual friends or identical, the dosha is cancelled.",
    "significance": "Bhakoot Koota's 7-point weight reflects its impact on practical married life — finances, children, and health. A Bhakoot Dosha without cancellation is considered more concerning than most other low koota scores because it affects tangible life outcomes.",
    "examples": [
      {
        "title": "6-8 Bhakoot Dosha",
        "content": "Groom: Moon in Aries (1st sign). Bride: Moon in Virgo (6th sign). Distance = 6. Reverse = 8. This is a 6-8 pair → 0 points (Bhakoot Dosha: health/separation risk). BUT if Mars (Aries lord) and Mercury (Virgo lord) are friendly, dosha is cancelled → 7 points restored."
      },
      {
        "title": "No Dosha",
        "content": "Groom: Moon in Taurus (2nd). Bride: Moon in Libra (7th). Distance = 6 from Taurus, but Taurus-Libra are NOT in 2-12, 6-8, or 5-9 pair → 7 points (no dosha)."
      }
    ],
    "relatedTerms": [
      "koota_nadi",
      "koota_graha_maitri",
      "koota_gana",
      "bhakoot_dosha"
    ],
    "tags": [
      "matchmaking",
      "koota",
      "bhakoot",
      "love",
      "finance",
      "prosperity",
      "family"
    ]
  },
  {
    "termKey": "koota_nadi",
    "domain": "matchmaking",
    "category": "ashta_koota",
    "title": "Nadi Koota",
    "sanskrit": "नाडी कूट",
    "summary": "The eighth and most critical koota (8 points max) assessing health, genetic compatibility, and progeny — the single most important factor in Ashta Koota matching.",
    "description": "Nadi Koota is the highest-weighted koota (8 of 36 points) and is considered the single most critical factor in marriage compatibility. Each nakshatra is classified into one of three Nadis: Aadi (Vata — wind), Madhya (Pitta — bile), or Antya (Kapha — phlegm), corresponding to the three Ayurvedic body constitutions. If both partners have the SAME Nadi, it scores 0 points (Nadi Dosha) — indicating potential health incompatibility and concerns about progeny. Different Nadis score the full 8 points. The severity: same Nadi couples may face health issues, difficulty conceiving, or genetic incompatibility in children. However, crucial cancellation rules exist: if both partners share the same Moon sign but different nakshatras, or same nakshatra but different Moon signs, or if the nakshatra padas (quarters) differ, Nadi Dosha is cancelled.",
    "howToRead": "Score 8: Different Nadis — excellent health and genetic compatibility. Score 0: Same Nadi (Nadi Dosha) — check cancellation rules immediately. Nadi Dosha is the most feared dosha in matchmaking; many families refuse matches solely on this basis. However, experienced astrologers know that cancellation rules apply in ~40% of cases.",
    "significance": "Nadi Koota's 8-point weight (22% of total 36) makes it the kingmaker of Ashta Koota. A match scoring 28/36 but with Nadi Dosha (0/8) may be rejected, while a match scoring only 20/36 with full Nadi (8/8) may be accepted. This koota is believed to affect the most irreversible aspect of marriage — children's health.",
    "examples": [
      {
        "title": "Nadi Dosha",
        "content": "Groom: Ashwini (Aadi Nadi). Bride: Punarvasu (Aadi Nadi). Same Nadi → 0 points (Nadi Dosha). This indicates potential health issues for offspring."
      },
      {
        "title": "Dosha Cancelled",
        "content": "Both have Aadi Nadi, but Groom is in Ashwini (Aries) and Bride is in Ardra (Gemini). Same Nadi but different Moon signs → Nadi Dosha cancelled → 8 points restored."
      }
    ],
    "relatedTerms": [
      "koota_bhakoot",
      "koota_gana",
      "koota_graha_maitri",
      "nadi_dosha",
      "nadi"
    ],
    "tags": [
      "matchmaking",
      "koota",
      "nadi",
      "health",
      "genetic",
      "progeny",
      "critical"
    ]
  },
  {
    "termKey": "manglik_dosha_match",
    "domain": "matchmaking",
    "category": "match_dosha",
    "title": "Manglik Dosha (Marriage Context)",
    "sanskrit": "मांगलिक दोष",
    "summary": "The presence of Mars (Mangal) in houses 1, 2, 4, 7, 8, or 12 from the Ascendant or Moon — a critical factor in marriage compatibility that can be cancelled or balanced.",
    "description": "In the matchmaking context, Manglik Dosha (also called Kuja Dosha or Mangal Dosha) is assessed for BOTH the bride and groom independently. A person is Manglik if Mars occupies the 1st, 2nd, 4th, 7th, 8th, or 12th house from the Ascendant OR Moon. In matchmaking, the ideal scenario is: both Manglik (doshas cancel), or neither Manglik (no dosha). If only ONE partner is Manglik, the marriage may face disharmony, aggression, or separation — traditionally considered the most serious marriage impediment. However, multiple cancellation rules apply: Mars in its own sign (Aries, Scorpio), Mars in friendly signs, Mars aspected by benefics (Jupiter), Mars in certain nakshatras, both partners being Manglik, or the person being over 28 years old (dosha naturally weakens). Modern KP practitioners assess Manglik status through the 7th cusp Sub Lord's Mars signification rather than simple house placement.",
    "howToRead": "In the match report, look for 'Manglik Status: Bride (Yes/No), Groom (Yes/No), Cancelled (Yes/No).' If only one is Manglik AND not cancelled, remedies like Kumbh Vivah (symbolic marriage to a pot/tree) are traditionally recommended before the actual marriage.",
    "significance": "Manglik Dosha is the single most common reason families reject otherwise high-scoring matches in Indian arranged marriages. Understanding the cancellation rules prevents unnecessary rejections — an estimated 50% of the population is technically Manglik, and most have cancellation factors.",
    "examples": [
      {
        "title": "Both Manglik (Cancelled)",
        "content": "Groom: Mars in 7th house. Bride: Mars in 8th house. Both are Manglik → doshas mutually cancel. No marriage impediment."
      },
      {
        "title": "One Manglik (Active)",
        "content": "Groom: Mars in 1st house (Manglik). Bride: No Mars in dosha houses (non-Manglik). Mismatch → check for cancellation: Is Mars in own sign? Is Jupiter aspecting? If no cancellations, dosha is active."
      }
    ],
    "relatedTerms": [
      "manglik_dosha",
      "koota_bhakoot",
      "koota_nadi",
      "mars"
    ],
    "tags": [
      "matchmaking",
      "dosha",
      "manglik",
      "mars",
      "marriage",
      "compatibility",
      "cancellation"
    ]
  },
  {
    "termKey": "nadi_dosha_match",
    "domain": "matchmaking",
    "category": "match_dosha",
    "title": "Nadi Dosha (Marriage Context)",
    "sanskrit": "नाडी दोष",
    "summary": "When both partners share the same Nadi (Aadi/Madhya/Antya), scoring 0/8 in Nadi Koota — indicates potential health and progeny incompatibility that may or may not be cancelled.",
    "description": "Nadi Dosha occurs when both bride and groom have their Moon nakshatras in the same Nadi category (Aadi, Madhya, or Antya). Since Nadi Koota carries 8 of 36 points, this dosha instantly reduces the match score by 22%. Traditional belief holds that same-Nadi couples face: (1) Health issues for one or both partners post-marriage, (2) Difficulty conceiving, (3) Genetic issues in offspring, (4) General lack of vitality in the relationship. However, Nadi Dosha has more cancellation rules than any other dosha: (a) Same Moon sign but different nakshatras → cancelled, (b) Same nakshatra but different Moon signs → cancelled, (c) Same nakshatra but different padas (quarters) → cancelled, (d) If the nakshatra lords of both are friendly → partially cancelled. In South Indian astrology, Nadi Dosha is given LESS weight than in North Indian traditions.",
    "howToRead": "If the match report shows 'Nadi: 0/8' with 'Nadi Dosha: Active', immediately check the cancellation details. A 'Cancelled' status means the dosha is nullified and the couple can proceed. An 'Active' status with no cancellation is a serious concern in traditional matchmaking.",
    "significance": "Nadi Dosha is the most debated dosha in Jyotish matchmaking. Scientific studies have found no correlation between same-Nadi matches and health outcomes, yet it remains the primary reason for match rejection in traditional families. Understanding cancellation rules is essential for practitioners to avoid unnecessary rejections.",
    "examples": [
      {
        "title": "Active Nadi Dosha",
        "content": "Groom: Ashwini (Aadi Nadi, Aries). Bride: Shatabhisha (Aadi Nadi, Aquarius). Same Nadi, different signs, different nakshatras → check: different Moon signs (Aries vs Aquarius) → Dosha CANCELLED."
      },
      {
        "title": "Truly Active",
        "content": "Groom: Krittika pada 2 (Aadi Nadi, Taurus). Bride: Krittika pada 3 (Aadi Nadi, Taurus). Same Nadi, same nakshatra, same Moon sign, but different padas → Dosha CANCELLED due to different padas."
      }
    ],
    "relatedTerms": [
      "koota_nadi",
      "nadi",
      "manglik_dosha_match",
      "bhakoot_dosha"
    ],
    "tags": [
      "matchmaking",
      "dosha",
      "nadi",
      "health",
      "progeny",
      "cancellation"
    ]
  },
  {
    "termKey": "bhakoot_dosha",
    "domain": "matchmaking",
    "category": "match_dosha",
    "title": "Bhakoot Dosha",
    "sanskrit": "भकूट दोष",
    "summary": "When the Moon sign distance between partners falls in inauspicious pairs (2-12, 5-9, or 6-8), scoring 0/7 in Bhakoot Koota — indicates potential financial strain or separation.",
    "description": "Bhakoot Dosha arises when the Moon signs of the bride and groom are positioned in one of three inauspicious pairs relative to each other: 2-12 (Dwidwadash — financial drain, one partner's gain is the other's loss), 6-8 (Shadashtak — most severe, health issues and risk of separation), or 5-9 (Nava Pancham — concerns about children and differing philosophies). With 7 points at stake (19% of total 36), Bhakoot Dosha significantly impacts the match score. Cancellation rules: (1) If the lords of both Moon signs are the SAME planet (e.g., Aries-Scorpio, both ruled by Mars) → cancelled, (2) If the lords are mutual friends → cancelled, (3) If one lord is in the other's sign (exchange) → cancelled. The 6-8 Bhakoot is considered the most damaging because the 6th house represents enemies/disease and the 8th represents sudden transformation/death — together they suggest health crises and marital discord.",
    "howToRead": "In the match report: 'Bhakoot: 0/7' with the specific pair type (2-12, 5-9, or 6-8). The 6-8 pair is most concerning; 2-12 and 5-9 are moderate. Always verify cancellation status. If cancelled: full 7 points restored, no concern.",
    "significance": "Bhakoot Dosha affects the practical, measurable aspects of marriage — money and health. Unlike Nadi Dosha (which concerns progeny), Bhakoot Dosha impacts the couple directly. The 6-8 variant is particularly feared in traditional matchmaking.",
    "examples": [
      {
        "title": "6-8 Bhakoot (Cancelled)",
        "content": "Groom: Moon in Taurus (Venus). Bride: Moon in Sagittarius (Jupiter). Distance = 8 from Taurus → 6-8 pair → 0 points. BUT Venus and Jupiter are mutual friends → Bhakoot Dosha cancelled → 7 points restored."
      },
      {
        "title": "2-12 Bhakoot (Active)",
        "content": "Groom: Moon in Leo (Sun). Bride: Moon in Cancer (Moon). Distance = 12 from Leo → 2-12 pair → 0 points. Sun and Moon are friends → cancelled → 7 points restored. (This particular 2-12 is almost always cancelled because Sun-Moon are natural friends.)"
      }
    ],
    "relatedTerms": [
      "koota_bhakoot",
      "nadi_dosha_match",
      "manglik_dosha_match"
    ],
    "tags": [
      "matchmaking",
      "dosha",
      "bhakoot",
      "finance",
      "separation",
      "6-8",
      "cancellation"
    ]
  },
  {
    "termKey": "match_score_excellent",
    "domain": "matchmaking",
    "category": "match_score",
    "title": "Excellent Match (28-36 Points)",
    "sanskrit": null,
    "summary": "A match scoring 28 or above out of 36 in Ashta Koota Gun Milan — considered highly compatible with strong prospects for a harmonious marriage.",
    "description": "An Excellent match (28-36 points, ~78-100%) indicates exceptional compatibility across most or all of the 8 kootas. At this level, the couple shares aligned temperaments (Gana), strong mental wavelength (Graha Maitri), compatible physical chemistry (Yoni), and healthy genetic compatibility (Nadi). Scores in this range typically mean no more than 1-2 kootas scored poorly, and even those are often in the lower-weighted kootas (Varna, Vashya). An Excellent score does NOT guarantee a perfect marriage — it indicates that the cosmic foundation is strongly supportive. Free will, communication, and effort remain essential. However, couples in this range generally report that their relationship feels 'natural' and 'easy' — they don't have to fight against fundamental incompatibilities.",
    "howToRead": "A green 'Excellent' badge means the match has strong astrological backing. Still check for active doshas (Manglik, Nadi, Bhakoot) — even an Excellent score can have a critical dosha. A score of 28/36 WITH Nadi Dosha (0/8) means the non-Nadi kootas scored 28/28, which is unusually high and the dosha should be carefully evaluated.",
    "significance": "In traditional Indian matchmaking, an Excellent score is the gold standard. Most families feel confident proceeding with such matches, though individual chart compatibility (Kundali Milan beyond Ashta Koota) is also recommended.",
    "examples": [
      {
        "title": "Score Breakdown",
        "content": "Varna: 1, Vashya: 2, Tara: 3, Yoni: 3, Graha Maitri: 5, Gana: 6, Bhakoot: 7, Nadi: 8 = 35/36 — Outstanding match with only minor Yoni mismatch."
      }
    ],
    "relatedTerms": [
      "match_score_good",
      "match_score_average",
      "koota_nadi",
      "koota_bhakoot"
    ],
    "tags": [
      "matchmaking",
      "score",
      "excellent",
      "threshold",
      "compatibility",
      "28-36"
    ]
  },
  {
    "termKey": "match_score_good",
    "domain": "matchmaking",
    "category": "match_score",
    "title": "Good Match (21-27 Points)",
    "sanskrit": null,
    "summary": "A match scoring 21-27 out of 36 in Ashta Koota — considered compatible with some areas needing awareness and conscious effort.",
    "description": "A Good match (21-27 points, ~58-75%) indicates solid compatibility with some areas of friction. At this level, most foundational kootas align well, but 2-3 kootas may have scored low. This is the most common score range for matches that proceed successfully — it's realistic and workable. The specific kootas that scored low matter more than the total: a score of 24/36 with Nadi (8/8) and Bhakoot (7/7) intact is much better than 24/36 with Nadi (0/8) even though the total is identical. In a Good match, the couple will likely notice some areas where they naturally differ — perhaps in temperament (Gana) or physical style (Yoni) — but these differences can be navigated with awareness and communication.",
    "howToRead": "A blue 'Good' badge suggests a viable match that deserves deeper evaluation. Look at WHICH kootas scored low — if the critical kootas (Nadi 8pts, Bhakoot 7pts, Gana 6pts) are intact, the match is stronger than the number suggests. If these high-weight kootas are the ones that scored 0, proceed with more caution.",
    "significance": "Good matches represent the practical sweet spot in Indian matchmaking. Experienced astrologers know that human compatibility is complex — a Good score with matching values and life goals often outperforms an Excellent score with incompatible lifestyles.",
    "examples": [],
    "relatedTerms": [
      "match_score_excellent",
      "match_score_average",
      "koota_gana",
      "koota_graha_maitri"
    ],
    "tags": [
      "matchmaking",
      "score",
      "good",
      "threshold",
      "compatibility",
      "21-27"
    ]
  },
  {
    "termKey": "match_score_average",
    "domain": "matchmaking",
    "category": "match_score",
    "title": "Average Match (18-20 Points)",
    "sanskrit": null,
    "summary": "A match scoring 18-20 out of 36 in Ashta Koota — the minimum traditionally acceptable threshold, requiring careful dosha analysis and additional chart evaluation.",
    "description": "An Average match (18-20 points, 50-56%) sits at the traditional acceptance boundary. The number 18 (exactly half of 36) is the classical minimum threshold established by Vedic matchmaking tradition. At this level, roughly half the kootas are unfavorable — the couple will face meaningful compatibility challenges in multiple areas. However, an Average score is NOT a rejection — it's a 'proceed with detailed analysis' signal. The astrologer should: (1) Check if the three critical kootas (Nadi, Bhakoot, Gana) scored well — if they did, the low total comes from minor kootas and is less concerning, (2) Verify dosha status — active Manglik, Nadi, or Bhakoot doshas in an Average match are more worrisome than in a Good/Excellent match, (3) Compare natal charts directly (Kundali Milan) for additional compatibility indicators beyond Ashta Koota.",
    "howToRead": "An amber 'Average' badge is a caution signal, not a stop sign. The match COULD work but needs deeper investigation. If the couple is strongly motivated (love marriage, compatible families), an Average score alone shouldn't prevent the match — but remedies and awareness of friction areas become important.",
    "significance": "The 18/36 threshold has been debated for centuries among Jyotish scholars. Some South Indian traditions accept 15/36 as the minimum, while some North Indian families insist on 24+. The practitioner should know their community's expectations while providing honest astrological guidance.",
    "examples": [],
    "relatedTerms": [
      "match_score_good",
      "match_score_below_average",
      "koota_nadi",
      "manglik_dosha_match"
    ],
    "tags": [
      "matchmaking",
      "score",
      "average",
      "threshold",
      "minimum",
      "18-20"
    ]
  },
  {
    "termKey": "match_score_below_average",
    "domain": "matchmaking",
    "category": "match_score",
    "title": "Below Average Match (0-17 Points)",
    "sanskrit": null,
    "summary": "A match scoring below 18 out of 36 in Ashta Koota — traditionally considered incompatible, though specific remedies and deeper chart analysis may reveal mitigating factors.",
    "description": "A Below Average match (0-17 points, <50%) falls below the traditional acceptance threshold. At this level, the majority of kootas indicate incompatibility — the couple would face fundamental challenges in multiple life areas simultaneously (temperament, physical compatibility, fortune, health/progeny). Traditionally, matches below 18/36 are rejected without further analysis. However, modern Jyotish practitioners recognize several nuances: (1) Love marriages — when the couple is already committed, the astrologer's role shifts from gatekeeping to guidance, identifying specific challenge areas and prescribing remedies, (2) Dosha cancellations may exist that aren't reflected in the raw score, (3) Individual natal chart analysis (beyond Ashta Koota) may reveal compensating factors like strong 7th house lords, favorable Venus/Jupiter placements, or matching dasha periods. Remedies for low-scoring matches include: Manglik Kumbh Vivah, Nadi Dosha puja, gemstone recommendations, and mantra prescriptions.",
    "howToRead": "A red 'Below Average' badge is a strong caution. The recommendations section will list specific challenge areas and potential remedies. For love marriages proceeding despite a low score, the practitioner should focus on the 2-3 kootas that DID score well and build the couple's awareness around the challenging areas.",
    "significance": "Below Average scores are the most sensitive area for a professional astrologer. Bluntly rejecting a match can cause emotional harm, while dishonestly upgrading the assessment is unethical. The best approach: present the facts clearly, explain remedies honestly, and respect the couple's autonomy in their decision.",
    "examples": [],
    "relatedTerms": [
      "match_score_average",
      "match_score_good",
      "manglik_dosha_match",
      "nadi_dosha_match"
    ],
    "tags": [
      "matchmaking",
      "score",
      "below-average",
      "incompatible",
      "remedies",
      "0-17"
    ]
  },
  {
    "termKey": "muhurta",
    "domain": "vedic",
    "category": "muhurta",
    "title": "Muhurta (Electional Astrology)",
    "sanskrit": "मुहूर्त",
    "summary": "The branch of Vedic astrology dedicated to selecting auspicious dates and times for important activities — weddings, property purchase, travel, business launches, and more.",
    "description": "Muhurta (also spelled Muhurat) is the science of electional timing in Jyotish. The word literally means 'a moment' — specifically, a 48-minute time unit (1/30th of a day). In practice, Muhurta astrology evaluates multiple factors to determine the most auspicious window for beginning any significant activity. The core principle: the birth chart of an EVENT (not just a person) influences its outcome, so starting important activities at cosmically aligned times maximizes success. Muhurta analysis combines: (1) Panchanga elements — favorable Tithi, Nakshatra, Yoga, Karana, and Vara (weekday), (2) Avoidance periods — Rahu Kaal, Yamagandam, Gulika Kaal, (3) Auspicious windows — Abhijit Muhurta, Brahma Muhurta, (4) Category-specific rules — wedding muhurtas differ from property muhurtas, (5) Individual chart compatibility — the muhurta should harmonize with the person's natal chart.",
    "howToRead": "A Muhurta result shows a date, quality rating (excellent/good/average/avoid), a numeric score (0-100), best time window, favorable factors (reasons), and any warnings. Prioritize dates scoring above 70 with no critical warnings. The 'best time window' is the optimal start time within the chosen day.",
    "significance": "Muhurta is one of the six Vedangas (limbs of the Vedas) — highlighting its ancient importance. In India, virtually no wedding, housewarming, or business inauguration occurs without consulting a Muhurta. It represents the practical, actionable side of astrology.",
    "examples": [
      {
        "title": "Wedding Muhurta",
        "content": "For a wedding, favorable factors: Tithi = Dwitiya (2nd lunar day), Nakshatra = Rohini (ruled by Moon, excellent for marriage), Yoga = Siddha (success), Day = Thursday (Jupiter's day). Avoid: Rahu Kaal window, Amavasya (new moon)."
      }
    ],
    "relatedTerms": [
      "abhijit_muhurta",
      "brahma_muhurta",
      "rahu_kaal",
      "tithi",
      "nakshatra"
    ],
    "tags": [
      "muhurta",
      "timing",
      "auspicious",
      "electional",
      "vedic",
      "ceremony"
    ]
  },
  {
    "termKey": "abhijit_muhurta",
    "domain": "vedic",
    "category": "muhurta",
    "title": "Abhijit Muhurta",
    "sanskrit": "अभिजित मुहूर्त",
    "summary": "The most powerful auspicious time window of the day — approximately 24 minutes before and after local solar noon — considered victorious for all undertakings.",
    "description": "Abhijit Muhurta ('the victorious moment') is a ~48-minute window centered around local solar noon (not clock noon). It is calculated as: Sunrise + (Sunset - Sunrise) × 7/15 to Sunrise + (Sunset - Sunrise) × 8/15 — essentially the 8th muhurta of the 15 daytime muhurtas. This period is ruled by Vishnu and is considered universally auspicious, overriding most inauspicious yogas, tithis, or nakshatras that may be present on the day. It is the only time window that can 'rescue' an otherwise mediocre muhurta day. The name 'Abhijit' also refers to a 28th nakshatra (intercalary) associated with this period. Abhijit Muhurta varies daily because sunrise and sunset times change, and it varies by geographic location since it's based on LOCAL solar time.",
    "howToRead": "The Abhijit Muhurta window shows as a start and end time (e.g., 11:48 AM - 12:36 PM). Activities started within this window gain the maximum auspicious boost. Note: Abhijit is NOT observed on Wednesdays in some traditions, as Wednesday's Abhijit is considered less potent.",
    "significance": "Abhijit Muhurta is the 'trump card' of electional astrology. When no other auspicious time can be found on a required date, the Abhijit window provides a safe harbor. Lord Rama is said to have commenced his war against Ravana during Abhijit Muhurta.",
    "examples": [
      {
        "title": "Practical Use",
        "content": "Need to sign an important contract today, but the Panchanga shows unfavorable Tithi and Nakshatra. Solution: Sign during Abhijit Muhurta (today: 12:02 PM - 12:48 PM). The Abhijit window neutralizes the negative factors."
      }
    ],
    "relatedTerms": [
      "muhurta",
      "brahma_muhurta",
      "rahu_kaal",
      "panchanga"
    ],
    "tags": [
      "muhurta",
      "abhijit",
      "auspicious",
      "noon",
      "victorious",
      "universal"
    ]
  },
  {
    "termKey": "brahma_muhurta",
    "domain": "vedic",
    "category": "muhurta",
    "title": "Brahma Muhurta",
    "sanskrit": "ब्रह्म मुहूर्त",
    "summary": "The sacred pre-dawn window approximately 96 minutes before sunrise, lasting 48 minutes — ideal for spiritual practices, meditation, study, and setting daily intentions.",
    "description": "Brahma Muhurta ('the creator's moment') is the 14th muhurta of the night, occurring approximately 1 hour 36 minutes before sunrise and lasting 48 minutes. The exact timing is: (Sunrise - 96 minutes) to (Sunrise - 48 minutes). For example, if sunrise is 6:00 AM, Brahma Muhurta runs from 4:24 AM to 5:12 AM. This period is named after Lord Brahma (the creator) because the mind is in its most creative, receptive, and sattvic (pure) state during these pre-dawn hours. Ayurveda considers this the optimal time for waking, as the atmosphere is rich in nascent oxygen (prana) and the mind is free from the day's accumulated impressions. While not used for worldly muhurta activities (weddings, business), Brahma Muhurta is prescribed for spiritual practices (sadhana), meditation, mantra chanting, and studying sacred texts.",
    "howToRead": "The Brahma Muhurta time is derived from the day's sunrise time. It appears as a time window (e.g., 4:38 AM - 5:26 AM). This is NOT used for selecting ceremony times — it's specifically for spiritual and wellness activities.",
    "significance": "Brahma Muhurta is deeply embedded in Indian culture — traditional Gurukul education began studies during this hour, Ayurvedic physicians recommend waking during this period, and yoga practitioners consider it the ideal meditation window. Modern sleep science partially validates this: the body naturally transitions from deep sleep to lighter sleep phases 90 minutes before typical wake time.",
    "examples": [],
    "relatedTerms": [
      "muhurta",
      "abhijit_muhurta",
      "panchanga"
    ],
    "tags": [
      "muhurta",
      "brahma",
      "spiritual",
      "meditation",
      "pre-dawn",
      "sadhana"
    ]
  },
  {
    "termKey": "rahu_kaal",
    "domain": "vedic",
    "category": "muhurta",
    "title": "Rahu Kaal",
    "sanskrit": "राहु काल",
    "summary": "A daily inauspicious period of approximately 90 minutes ruled by Rahu — activities begun during this window are believed to face obstacles, delays, and unexpected complications.",
    "description": "Rahu Kaal (Rahu Kalam) is a daily inauspicious window approximately 1.5 hours long, associated with the shadow planet Rahu (north lunar node). It is calculated by dividing the daytime (sunrise to sunset) into 8 equal parts, with Rahu Kaal falling on a different segment each day: Sunday = 8th segment, Monday = 2nd, Tuesday = 7th, Wednesday = 5th, Thursday = 6th, Friday = 4th, Saturday = 3rd. The mnemonic: 'Mother Saw Father Wearing The Turban Suddenly' (Mon-2, Sat-3, Fri-4, Wed-5, Thu-6, Tue-7, Sun-8). Since daytime length varies seasonally, Rahu Kaal timing shifts throughout the year. Activities begun during Rahu Kaal are believed to encounter Rahu's chaotic, deceptive, and obstructive energy — leading to unforeseen complications, delays, miscommunications, and hidden problems that surface later.",
    "howToRead": "Rahu Kaal appears as a time window (e.g., 'Rahu Kaal: 10:30 AM - 12:00 PM'). AVOID starting new ventures, signing contracts, beginning journeys, or initiating important conversations during this window. Ongoing activities are unaffected — only NEW beginnings carry the risk.",
    "significance": "Rahu Kaal is the most widely observed inauspicious period in daily Indian life. Even people who don't follow astrology regularly check Rahu Kaal before important activities. It's displayed on most Indian calendars and is a standard feature of Panchanga apps.",
    "examples": [
      {
        "title": "Monday Rahu Kaal",
        "content": "Sunrise: 6:30 AM. Sunset: 6:30 PM. Daytime = 12 hours. Each segment = 1.5 hours. Monday = 2nd segment → Rahu Kaal = 7:30 AM - 9:00 AM. Avoid scheduling important meetings in this window."
      },
      {
        "title": "Seasonal Shift",
        "content": "In summer (longer days), each segment is longer, so Rahu Kaal expands. In winter (shorter days), it contracts. Always calculate from actual sunrise/sunset, not fixed times."
      }
    ],
    "relatedTerms": [
      "gulika_kaal",
      "yamagandam",
      "muhurta",
      "rahu"
    ],
    "tags": [
      "muhurta",
      "rahu-kaal",
      "inauspicious",
      "timing",
      "avoid",
      "daily"
    ]
  },
  {
    "termKey": "gulika_kaal",
    "domain": "vedic",
    "category": "muhurta",
    "title": "Gulika Kaal",
    "sanskrit": "गुलिक काल",
    "summary": "A daily inauspicious period ruled by Gulika (Saturn's son) — considered malefic for important decisions, especially those involving health, legal matters, and financial commitments.",
    "description": "Gulika Kaal is a daily inauspicious window associated with Gulika (also called Mandi), considered the 'son of Saturn' in Vedic astrology. Like Rahu Kaal, it is calculated by dividing daytime into 8 parts, with Gulika occupying a different segment each day: Sunday = 7th, Monday = 6th, Tuesday = 5th, Wednesday = 4th, Thursday = 3rd, Friday = 2nd, Saturday = 1st. Gulika's malefic influence is specifically associated with: poison (both literal and metaphorical — toxic situations), chronic health issues, legal entanglements, and slow-developing problems. While Rahu Kaal brings sudden, chaotic disruptions, Gulika Kaal is believed to create slow-burning, persistent problems that are harder to diagnose and resolve. Activities begun during Gulika Kaal may seem fine initially but develop complications weeks or months later.",
    "howToRead": "Gulika Kaal appears alongside Rahu Kaal and Yamagandam in the daily muhurta timings. If Rahu Kaal is the 'first avoid,' Gulika is the 'second avoid.' When planning important events, ensure they fall outside ALL three inauspicious windows.",
    "significance": "Gulika/Mandi is a calculated point (upagraha) in the natal chart too — its house placement shows where chronic, hard-to-resolve problems manifest. The daily Gulika Kaal extends this energy to mundane timing.",
    "examples": [],
    "relatedTerms": [
      "rahu_kaal",
      "yamagandam",
      "muhurta",
      "saturn"
    ],
    "tags": [
      "muhurta",
      "gulika",
      "mandi",
      "inauspicious",
      "saturn",
      "timing"
    ]
  },
  {
    "termKey": "yamagandam",
    "domain": "vedic",
    "category": "muhurta",
    "title": "Yamagandam",
    "sanskrit": "यमगण्डम",
    "summary": "A daily inauspicious period ruled by Yama (god of death) — considered dangerous for travel, surgery, and risky activities. The most physically perilous of the three daily inauspicious windows.",
    "description": "Yamagandam (also Yama Gandam or Yama Ghantam) is the third daily inauspicious period, associated with Yama, the lord of death and dharma. It is calculated by dividing daytime into 8 parts: Sunday = 5th segment, Monday = 4th, Tuesday = 3rd, Wednesday = 2nd, Thursday = 1st, Friday = 7th, Saturday = 6th. While Rahu Kaal brings confusion and Gulika brings chronic problems, Yamagandam is specifically associated with physical danger, accidents, and life-threatening situations. It is considered the most dangerous of the three windows for: travel (especially long-distance), surgery, adventure activities, starting medication, and any activity with physical risk. However, it is sometimes considered acceptable for activities related to ancestors, death rites, and Yama-related rituals.",
    "howToRead": "Yamagandam appears as the third inauspicious window. If you must choose between scheduling during Rahu Kaal vs Yamagandam, most practitioners consider Yamagandam more dangerous for physical activities, while Rahu Kaal is worse for business/financial activities.",
    "significance": "The three inauspicious windows (Rahu Kaal, Gulika Kaal, Yamagandam) together cover roughly 4.5 hours of the ~12-hour daytime. This means ~62.5% of the day remains 'safe' — the system is designed to GUIDE timing, not paralyze it.",
    "examples": [],
    "relatedTerms": [
      "rahu_kaal",
      "gulika_kaal",
      "muhurta"
    ],
    "tags": [
      "muhurta",
      "yamagandam",
      "yama",
      "inauspicious",
      "danger",
      "travel"
    ]
  },
  {
    "termKey": "muhurta_tithi",
    "domain": "vedic",
    "category": "muhurta",
    "title": "Auspicious Tithis for Muhurta",
    "sanskrit": "शुभ तिथि",
    "summary": "Specific lunar days considered favorable for beginning activities — Dwitiya, Tritiya, Panchami, Saptami, Dashami, Ekadashi, Dwadashi, Trayodashi, and Purnima are generally auspicious.",
    "description": "In Muhurta selection, the Tithi (lunar day) is the primary Panchanga filter. Of the 30 tithis in a lunar month, the following are generally considered auspicious for new beginnings: Dwitiya (2nd — gentle start), Tritiya (3rd — growth), Panchami (5th — intelligence/education), Saptami (7th — travel/movement), Dashami (10th — success/completion), Ekadashi (11th — spiritual/purification), Dwadashi (12th — divine grace), Trayodashi (13th — prosperity), and Purnima (15th — fullness/completion). Tithis to generally avoid: Prathama/Padyami (1st — too raw for new starts), Chaturthi (4th — obstacles), Shashti (6th — conflicts), Ashtami (8th — transformation/upheaval), Navami (9th — aggressive), Chaturdashi (14th — destructive), and Amavasya (30th/new moon — darkness/endings). However, specific activities may PREFER certain 'inauspicious' tithis — for example, Chaturthi is excellent for Ganesha worship, and Ashtami is powerful for Durga/Kali worship.",
    "howToRead": "The muhurta report highlights the day's tithi with a favorable/unfavorable badge. Green tithis boost the muhurta score; red tithis reduce it. Note the tithi-activity exceptions — a tithi 'bad' for weddings may be 'good' for spiritual practices.",
    "significance": "Tithi selection is the first filter in traditional Muhurta. A skilled astrologer won't even evaluate other factors if the Tithi is fundamentally incompatible with the intended activity.",
    "examples": [],
    "relatedTerms": [
      "tithi",
      "muhurta",
      "panchanga",
      "muhurta_nakshatra"
    ],
    "tags": [
      "muhurta",
      "tithi",
      "auspicious",
      "lunar-day",
      "timing",
      "panchanga"
    ]
  },
  {
    "termKey": "muhurta_nakshatra",
    "domain": "vedic",
    "category": "muhurta",
    "title": "Auspicious Nakshatras for Muhurta",
    "sanskrit": "शुभ नक्षत्र",
    "summary": "Specific lunar mansions considered favorable for beginning activities — Rohini, Mrigashira, Pushya, Hasta, Chitra, Swati, Anuradha, Shravana, Dhanishta, and Revati lead the auspicious list.",
    "description": "The Nakshatra (lunar mansion) during which an activity begins significantly influences its outcome. For general auspicious activities, the following nakshatras are considered universally favorable: Rohini (fertility, creativity), Mrigashira (seeking, exploration), Pushya (nourishment — the MOST auspicious nakshatra for almost all activities), Hasta (skill, craftsmanship), Chitra (beauty, architecture), Swati (independence, trade), Anuradha (devotion, friendship), Shravana (learning, communication), Dhanishta (wealth, music), and Revati (completion, travel). Additional favorable nakshatras for specific activities: Ashwini (medical treatment, quick results), Magha (ancestral rites, government work), Uttara Phalguni (marriage), Uttara Ashadha (lasting success), Uttara Bhadrapada (spiritual work). Nakshatras to avoid for new beginnings: Bharani (restraint), Ardra (destruction), Ashlesha (manipulation), Jyeshtha (competition), Moola (uprooting), Poorva Phalguni, Poorva Ashadha, Poorva Bhadrapada (all three Poorvas are less stable).",
    "howToRead": "The muhurta report shows the current nakshatra with a quality badge. Pushya is the gold standard — if your activity falls on a Pushya day with good tithi and no Rahu Kaal conflict, you have an excellent muhurta.",
    "significance": "Nakshatra selection is the second filter after Tithi. Together, Tithi + Nakshatra form the backbone of Muhurta selection. Pushya nakshatra is so universally auspicious that the phrase 'Pushya Nakshatra' has become colloquial for 'perfect timing' in Indian languages.",
    "examples": [],
    "relatedTerms": [
      "nakshatra",
      "muhurta",
      "muhurta_tithi",
      "pushya"
    ],
    "tags": [
      "muhurta",
      "nakshatra",
      "auspicious",
      "lunar-mansion",
      "timing",
      "pushya"
    ]
  },
  {
    "termKey": "muhurta_yoga_day",
    "domain": "vedic",
    "category": "muhurta",
    "title": "Auspicious Yogas and Days for Muhurta",
    "sanskrit": "शुभ योग एवं वार",
    "summary": "Favorable Panchanga Yogas (Siddha, Amrita, Shubha, Brahma, Indra) and weekdays that enhance muhurta quality for specific activity categories.",
    "description": "Beyond Tithi and Nakshatra, two more Panchanga elements refine Muhurta selection: Yoga (luni-solar combination) and Vara (weekday). Favorable Yogas: Siddha (accomplishment — best for all activities), Amrita (immortality — excellent for health/medicine), Shubha (auspiciousness — good for ceremonies), Shukla (brightness — good for education), Brahma (creation — good for new projects), Indra (power — good for authority/government). Unfavorable Yogas: Vishkambha (obstruction), Atiganda (excess danger), Shoola (piercing), Vyaghata (destruction), Vajra (thunderbolt), Vyatipata (calamity), Parigha (iron bar), Vaidhriti (instability). Favorable Weekdays by Activity: Wednesday (business, communication, learning), Thursday (education, ceremonies, spiritual), Friday (marriage, luxury, art), Monday (travel, agriculture, medicine). Caution Days: Tuesday (surgery OK, avoid new starts), Saturday (charitable work OK, avoid luxury/marriage). Sunday is neutral-to-good for government and leadership activities.",
    "howToRead": "The muhurta score incorporates both Yoga and Vara as contributing factors. A day with Siddha Yoga + Thursday is excellent for educational activities. A day with Vyatipata Yoga is generally avoided regardless of other positive factors.",
    "significance": "The combination of all four factors (Tithi + Nakshatra + Yoga + Vara) creates the Panchanga quality matrix. All four being favorable simultaneously is rare and highly prized — such days are marked as 'Sarvartha Siddhi Yoga' (yoga that accomplishes all purposes).",
    "examples": [],
    "relatedTerms": [
      "yoga_panchanga",
      "vara",
      "muhurta",
      "muhurta_tithi",
      "muhurta_nakshatra"
    ],
    "tags": [
      "muhurta",
      "yoga",
      "weekday",
      "vara",
      "auspicious",
      "siddha",
      "timing"
    ]
  },
  {
    "termKey": "muhurta_categories",
    "domain": "vedic",
    "category": "muhurta",
    "title": "Muhurta Categories",
    "sanskrit": null,
    "summary": "Different life events have specialized muhurta rules — wedding, property, vehicle, travel, and general categories each prioritize different Panchanga factors.",
    "description": "Muhurta selection is NOT one-size-fits-all. Each activity category has its own set of preferred and avoided factors: WEDDING (Vivaha Muhurta): Prefer Uttara Phalguni, Rohini, Revati, Magha, Mrigashira nakshatras. Prefer Dwitiya, Tritiya, Panchami, Saptami, Dashami, Ekadashi, Trayodashi tithis. Best days: Monday, Wednesday, Thursday, Friday. Avoid: Amavasya, Tuesday, Saturday. PROPERTY (Griha Pravesh): Prefer Pushya, Rohini, Uttara Phalguni, Uttara Bhadrapada, Uttara Ashadha. Best days: Monday, Thursday, Friday. Avoid: eclipses, Ashtami, Chaturthi. VEHICLE PURCHASE: Prefer Hasta, Pushya, Ashwini, Shravana. Best days: Wednesday, Thursday, Friday. Avoid: Tuesday (Mars = accidents), Saturday. TRAVEL: Prefer Ashwini, Mrigashira, Pushya, Hasta, Anuradha, Revati. Best days: Monday, Wednesday, Friday, Sunday. Avoid: Tuesday, Saturday, Rahu Kaal. GENERAL/BUSINESS: Prefer Pushya, Rohini, Hasta, Chitra, Shravana. Best days: Monday, Wednesday, Thursday, Friday.",
    "howToRead": "When searching for a muhurta, first select the correct category. The scoring algorithm automatically adjusts weights based on the category — a day excellent for travel may be poor for a wedding. The category-specific rules shown in the muhurta result explain why a particular score was given.",
    "significance": "Category-specific muhurta selection is what separates professional astrologers from generic Panchanga apps. A generic 'auspicious day' badge can be misleading — the day must be auspicious for the SPECIFIC activity being planned.",
    "examples": [
      {
        "title": "Category Matters",
        "content": "Tuesday with Ashwini nakshatra: EXCELLENT for surgery (Mars = surgeon, Ashwini = medical healing). TERRIBLE for a wedding (Mars = conflict in marriage). Same day, opposite recommendations based on category."
      }
    ],
    "relatedTerms": [
      "muhurta",
      "muhurta_tithi",
      "muhurta_nakshatra",
      "muhurta_yoga_day"
    ],
    "tags": [
      "muhurta",
      "category",
      "wedding",
      "property",
      "travel",
      "vehicle",
      "business"
    ]
  },
  {
    "termKey": "chaldean_system",
    "domain": "numerology",
    "category": "numerology_core",
    "title": "Chaldean Numerology System",
    "sanskrit": null,
    "summary": "An ancient numerology system originating from Babylonian (Chaldean) culture that assigns number values 1-8 to letters based on sound vibration — considered the most accurate system for name analysis.",
    "description": "Chaldean Numerology is the oldest known numerology system, originating from the Chaldean civilization of ancient Mesopotamia (modern-day Iraq). Unlike the more common Pythagorean system which assigns numbers 1-9 sequentially to the alphabet, the Chaldean system assigns numbers 1-8 based on the SOUND VIBRATION of each letter — the number 9 is considered sacred and is never assigned to a letter, only appearing in final calculations. The Chaldean letter-to-number mapping is: A=1, B=2, C=3, D=4, E=5, F=8, G=3, H=5, I=1, J=1, K=2, L=3, M=4, N=5, O=7, P=8, Q=1, R=2, S=3, T=4, U=6, V=6, W=6, X=5, Y=1, Z=7. Key difference from Pythagorean: Chaldean uses the name a person is KNOWN BY (common name), not the full birth certificate name. It also analyzes compound/double-digit numbers before reducing to single digits, as compound numbers carry their own meanings.",
    "howToRead": "In a Chaldean analysis, you'll see both the compound number (e.g., 23) and its reduced single digit (2+3=5). The compound number reveals the deeper karmic pattern, while the single digit shows the surface personality. Pay attention to both — a name reducing to 5 via compound 23 ('The Royal Star of the Lion') is very different from 5 via compound 14 ('Movement and challenge').",
    "significance": "Chaldean numerology is preferred by professional numerologists because it accounts for sound vibration — meaning names that SOUND similar will have related numerological profiles, regardless of spelling. This makes it more linguistically and vibrationally accurate than systems based on alphabetical position alone.",
    "examples": [
      {
        "title": "Name Calculation",
        "content": "Name: RAMA → R(2) + A(1) + M(4) + A(1) = 8. The Chaldean value of RAMA is 8, associated with Saturn — authority, discipline, and material success."
      },
      {
        "title": "Compound Number",
        "content": "Name: KRISHNA → K(2)+R(2)+I(1)+S(3)+H(5)+N(5)+A(1) = 19. Compound 19 ('The Prince of Heaven') is one of the most fortunate numbers, reducing to 1+9=10→1+0=1 (Sun — leadership)."
      }
    ],
    "relatedTerms": [
      "destiny_number",
      "birth_number",
      "name_number",
      "compound_number"
    ],
    "tags": [
      "numerology",
      "chaldean",
      "system",
      "babylonian",
      "vibration",
      "ancient"
    ]
  },
  {
    "termKey": "destiny_number",
    "domain": "numerology",
    "category": "numerology_core",
    "title": "Destiny Number",
    "sanskrit": null,
    "summary": "The single most important number in Chaldean numerology — derived from the full birth date, revealing one's life purpose, karmic path, and ultimate potential.",
    "description": "The Destiny Number (also called Life Path Number in some traditions) is calculated by reducing the full birth date to a single digit or master number. Calculation: Add all digits of the birth date (DD + MM + YYYY). Example: 15 March 1990 → 1+5+0+3+1+9+9+0 = 28 → 2+8 = 10 → 1+0 = 1. The Destiny Number reveals what you are meant to become in this lifetime — your soul's assignment. It differs from the Birth Number (day of birth only) which shows your personality. The nine Destiny Numbers: 1 (Leader/Pioneer), 2 (Peacemaker/Diplomat), 3 (Creative Communicator), 4 (Builder/Organizer), 5 (Freedom Seeker/Adventurer), 6 (Nurturer/Healer), 7 (Seeker/Mystic), 8 (Power/Authority), 9 (Humanitarian/Visionary). Master numbers 11, 22, and 33 are NOT reduced further — they carry amplified spiritual potential (11: Intuitive Illuminator, 22: Master Builder, 33: Master Healer).",
    "howToRead": "Your Destiny Number is your life's GPS coordinate. It doesn't change and represents the overarching theme of your existence. When the Destiny Number conflicts with the Name Number, a person may feel internal tension between who they ARE (destiny) and how they PRESENT (name).",
    "significance": "In Chaldean numerology, the Destiny Number is fixed at birth and cannot be altered — unlike the Name Number which changes with name modifications. This makes it the foundation of all numerological analysis. Career choices, relationships, and life decisions that align with the Destiny Number tend to feel fulfilling.",
    "examples": [
      {
        "title": "Destiny 8",
        "content": "Birth date: 26/01/1994 → 2+6+0+1+1+9+9+4 = 32 → 3+2 = 5. Destiny 5: This person is meant to experience freedom, travel, versatility, and change. Careers in media, travel, sales, or any field requiring adaptability will fulfill their destiny."
      }
    ],
    "relatedTerms": [
      "birth_number",
      "name_number",
      "chaldean_system",
      "compound_number"
    ],
    "tags": [
      "numerology",
      "destiny",
      "life-path",
      "birth-date",
      "purpose",
      "core"
    ]
  },
  {
    "termKey": "birth_number",
    "domain": "numerology",
    "category": "numerology_core",
    "title": "Birth Number (Birth Day Number)",
    "sanskrit": null,
    "summary": "The number derived from just the day of birth (1-31 reduced to single digit) — reveals your natural personality, instinctive reactions, and how others perceive you at first meeting.",
    "description": "The Birth Number is the simplest yet most immediately apparent numerological influence. It's calculated from just the birth DAY (not month or year): born on the 7th = Birth Number 7, born on the 25th = 2+5 = 7. This number governs your outward personality, first impressions, and natural behavioral tendencies. It's what people see when they first meet you, before your deeper Destiny Number qualities emerge over time. The Birth Number also has a strong influence on career aptitude: 1s are natural leaders, 2s are diplomats, 3s are communicators, 4s are engineers/builders, 5s are marketers/travelers, 6s are counselors/artists, 7s are researchers/analysts, 8s are executives/financiers, 9s are humanitarians/teachers. In Chaldean numerology, the compound birth day number (e.g., 25 before reducing to 7) also carries significance — 25 is different from 16 or 7, even though all reduce to 7.",
    "howToRead": "Compare your Birth Number with your Destiny Number. If they match or are harmonious (e.g., Birth 3 + Destiny 6 — both creative/nurturing), your personality naturally supports your life purpose. If they conflict (e.g., Birth 1 leadership + Destiny 2 diplomacy), you may need to learn to soften your dominant tendencies to fulfill your destiny.",
    "significance": "The Birth Number is the most intuitive entry point into numerology — everyone knows their birth day. It's also the most consistent across numerology systems (Chaldean, Pythagorean, and Vedic all calculate it identically).",
    "examples": [],
    "relatedTerms": [
      "destiny_number",
      "name_number",
      "chaldean_system",
      "personal_year"
    ],
    "tags": [
      "numerology",
      "birth-number",
      "personality",
      "day",
      "core",
      "character"
    ]
  },
  {
    "termKey": "name_number",
    "domain": "numerology",
    "category": "numerology_core",
    "title": "Name Number (Expression Number)",
    "sanskrit": null,
    "summary": "The number derived from a person's commonly used name using Chaldean letter-to-number mapping — represents how one expresses themselves and the energy they project into the world.",
    "description": "The Name Number (Expression Number) is calculated by assigning Chaldean values to each letter of the name a person is commonly KNOWN BY — not necessarily their legal/birth certificate name. This is a critical Chaldean distinction: if 'Rajesh Kumar Singh' goes by 'Raj,' his Name Number is calculated from 'RAJ,' not the full name. The Name Number represents: (1) How you express your inner self outwardly, (2) The vibrational energy your name projects, (3) Your social/professional persona, (4) The opportunities and challenges your name attracts. Since the Name Number is derived from your name (not birth date), it CAN be changed — this is the basis of name correction in Chaldean numerology. A person struggling with a Name Number that conflicts with their Destiny Number can modify their name's spelling to achieve a more harmonious vibration.",
    "howToRead": "The ideal scenario: Name Number harmonizes with Destiny Number and Birth Number. For example, Destiny 1 + Birth 1 + Name 1 creates a powerfully unified 'leader' energy. Conflicts (e.g., Destiny 8 (authority) + Name 2 (submissive)) create internal tension. Name changes are recommended when conflicts are severe.",
    "significance": "Name Number analysis is the most commercially practical aspect of Chaldean numerology. Parents selecting baby names, professionals considering name changes, and businesses choosing brand names all use Name Number optimization to ensure favorable vibrations.",
    "examples": [
      {
        "title": "Name Change Impact",
        "content": "Original: SANJAY = S(3)+A(1)+N(5)+J(1)+A(1)+Y(1) = 12 → 3. Changed to: SANJEY = S(3)+A(1)+N(5)+J(1)+E(5)+Y(1) = 16 → 7. One letter change shifts the Name Number from 3 (creative, social) to 7 (analytical, spiritual) — dramatically different energy."
      }
    ],
    "relatedTerms": [
      "destiny_number",
      "birth_number",
      "chaldean_system",
      "compound_number"
    ],
    "tags": [
      "numerology",
      "name-number",
      "expression",
      "vibration",
      "name-change",
      "core"
    ]
  },
  {
    "termKey": "compound_number",
    "domain": "numerology",
    "category": "numerology_core",
    "title": "Compound Number",
    "sanskrit": null,
    "summary": "The two-digit number obtained before final reduction to a single digit — carries its own distinct meaning and karmic significance in Chaldean numerology.",
    "description": "In Chaldean numerology, compound numbers (10-52) are analyzed BEFORE reducing to single digits because each compound has a unique symbolic meaning inherited from Chaldean mystical traditions. For example, the number 23 and 14 both reduce to 5, but their compound meanings are vastly different: 23 is 'The Royal Star of the Lion' (one of the most fortunate numbers — success, fame, help from superiors), while 14 is 'Movement and Temperance' (warns of overindulgence, need for balance). Notable compound numbers: 10 (Wheel of Fortune — ups and downs), 13 (Power and transformation — not unlucky in Chaldean), 15 (Magic and eloquence), 19 (Prince of Heaven — extremely fortunate), 20 (Judgment — karmic awakening), 22 (Master Builder — extraordinary potential), 23 (Royal Star — fame and fortune), 26 (Partnerships and warnings), 33 (Master Teacher — spiritual service). Some compounds are considered 'karmic debt' numbers: 13, 14, 16, 19 — indicating unresolved lessons from past lives that must be addressed.",
    "howToRead": "When a Chaldean analysis shows a compound number (e.g., 'Name compound: 23, reduces to 5'), read BOTH: the compound meaning describes the deeper karmic pattern, while the single digit describes the surface expression. Compound 23 → person appears as a 5 (freedom-loving, versatile) but has the deeper fortune of 23 (royal success through alliances).",
    "significance": "Compound number analysis is what truly separates Chaldean from Pythagorean numerology. Pythagorean systems largely ignore compound meanings, losing a layer of depth. Chaldean practitioners consider the compound number MORE revealing than the final single digit.",
    "examples": [],
    "relatedTerms": [
      "chaldean_system",
      "destiny_number",
      "name_number",
      "karmic_debt_number"
    ],
    "tags": [
      "numerology",
      "compound",
      "two-digit",
      "karmic",
      "chaldean",
      "meaning"
    ]
  },
  {
    "termKey": "karmic_debt_number",
    "domain": "numerology",
    "category": "numerology_spiritual",
    "title": "Karmic Debt Number",
    "sanskrit": null,
    "summary": "Specific compound numbers (13, 14, 16, 19) that indicate unresolved karmic lessons from past lives — appearing anywhere in a numerological profile signals areas requiring focused spiritual growth.",
    "description": "Karmic Debt Numbers are four specific compound numbers that indicate past-life lessons carried into the present incarnation: 13 — Laziness/shortcuts in past life → present need for hard work, discipline, and completing tasks properly. People with 13 may find that shortcuts always backfire. 14 — Abuse of freedom in past life → present need for temperance, moderation, and responsible use of sensory experiences. Prone to addictive behaviors if unaware. 16 — Ego/vanity in past life → present ego destruction and rebuilding. Often experience dramatic falls followed by spiritual awakening. This is the most intense karmic debt. 19 — Selfishness/power abuse in past life → present need to learn self-reliance without dominating others. Must balance independence with empathy. These numbers can appear as Destiny Numbers, Name Numbers, Birth Numbers, or in any compound calculation. Their presence doesn't indicate punishment — it indicates a growth curriculum that, once mastered, leads to exceptional strength in that area.",
    "howToRead": "When a karmic debt number appears in a profile, it colors all related calculations. A Destiny Number of 14/5 means the life path involves freedom (5) but with a karmic lesson about responsible freedom (14). Contrast with a 'clean' 23/5 where freedom comes more easily. Multiple karmic debt numbers in one profile indicate an 'old soul' with concentrated growth potential.",
    "significance": "Karmic debt numbers are the 'warning labels' of numerology — they don't predict doom but highlight where unconscious patterns from the past will create challenges until consciously addressed. Many highly successful people have karmic debt numbers — they've simply learned their lessons.",
    "examples": [
      {
        "title": "Karmic 16",
        "content": "Name reduces to 16/7: The person may experience cycles of building something impressive (career, relationship) only to see it collapse due to ego or pride. Each collapse is an opportunity for deeper spiritual understanding. Once humility is learned, the 7's natural wisdom flourishes."
      }
    ],
    "relatedTerms": [
      "compound_number",
      "destiny_number",
      "chaldean_system"
    ],
    "tags": [
      "numerology",
      "karmic-debt",
      "13",
      "14",
      "16",
      "19",
      "past-life",
      "spiritual"
    ]
  },
  {
    "termKey": "personal_year",
    "domain": "numerology",
    "category": "numerology_timing",
    "title": "Personal Year Number",
    "sanskrit": null,
    "summary": "A yearly numerological cycle derived from birth date + current year — reveals the overarching theme and energy available for the year, cycling through 9-year patterns.",
    "description": "The Personal Year Number is calculated by adding your birth day + birth month + CURRENT year digits, then reducing to a single digit. Example: Birth = March 15, Current year = 2026 → 1+5+0+3+2+0+2+6 = 19 → 1+9 = 10 → 1. Personal Year 1 in 2026. The 9-year cycle: Year 1 (New beginnings, plant seeds), Year 2 (Patience, partnerships, wait), Year 3 (Creativity, social expansion, express), Year 4 (Foundation building, hard work, structure), Year 5 (Change, freedom, unexpected opportunities), Year 6 (Responsibility, family, home, love), Year 7 (Introspection, analysis, spiritual growth), Year 8 (Power, money, material achievement), Year 9 (Completion, release, endings, philanthropy). Each year starts on January 1st (some schools use the birthday as the start). The Personal Year provides the CONTEXT for all other timing predictions — it's the 'weather' of the year.",
    "howToRead": "Match your planned activities to your Personal Year energy. Starting a business in Year 1 or 8 is ideal. Don't force new beginnings in Year 9 (it's for closing chapters). Year 7 is for study and reflection, not aggressive career moves. Going against the year's energy creates unnecessary friction.",
    "significance": "Personal Year cycles are one of the most practically useful numerological tools. They explain why the same person may have a breakthrough year followed by a stagnant year — they're simply in different phases of the natural 9-year cycle.",
    "examples": [
      {
        "title": "Year 5 Surprise",
        "content": "In a Personal Year 5, expect the unexpected. A person planning stability (buying a house, settling down) may find circumstances pushing them toward change — a job offer abroad, a surprise relocation, or meeting someone who transforms their worldview."
      }
    ],
    "relatedTerms": [
      "destiny_number",
      "personal_month",
      "personal_day",
      "chaldean_system"
    ],
    "tags": [
      "numerology",
      "personal-year",
      "timing",
      "cycle",
      "9-year",
      "prediction"
    ]
  },
  {
    "termKey": "personal_month",
    "domain": "numerology",
    "category": "numerology_timing",
    "title": "Personal Month Number",
    "sanskrit": null,
    "summary": "A monthly sub-cycle within the Personal Year — calculated by adding the Personal Year number to the calendar month, refining predictions to a 30-day focus.",
    "description": "The Personal Month provides a finer resolution than the Personal Year. Calculation: Personal Year Number + Calendar Month Number (January=1 through December=12), reduced to a single digit. Example: Personal Year 3, Month of August (8) → 3+8 = 11 → 1+1 = 2 (unless treating 11 as master number). The Personal Month shows WHEN within the year specific energies peak. In a Personal Year 1 (new beginnings): Month 1 (January/start of year) doubles the initiation energy, Month 5 brings unexpected changes to the new venture, Month 9 wraps up initial planning phase. The interplay between Year and Month energies creates nuanced monthly guidance — a Month 7 (introspection) within a Year 1 (action) suggests a month for PLANNING the new venture, not launching it.",
    "howToRead": "Layer the Personal Month ON TOP of the Personal Year. The year sets the macro theme; the month highlights the specific 30-day focus. Planning important activities? Check both — the ideal month within your year for that activity.",
    "significance": "Personal Month analysis makes numerology actionable for planning. Instead of knowing only that 'this year is good for career,' the month-level analysis says 'August specifically is your career power month this year.'",
    "examples": [],
    "relatedTerms": [
      "personal_year",
      "personal_day",
      "destiny_number"
    ],
    "tags": [
      "numerology",
      "personal-month",
      "timing",
      "cycle",
      "monthly",
      "sub-cycle"
    ]
  },
  {
    "termKey": "personal_day",
    "domain": "numerology",
    "category": "numerology_timing",
    "title": "Personal Day Number",
    "sanskrit": null,
    "summary": "The finest timing cycle — calculated from Personal Month + calendar day — reveals the numerological energy of each specific day for daily decision-making.",
    "description": "The Personal Day Number provides daily numerological guidance. Calculation: Personal Month Number + Calendar Day Number, reduced to a single digit. Example: Personal Month 4, Day 15 → 4+1+5 = 10 → 1. Personal Day 1 — a day for initiative and leadership decisions. The Personal Day is the 'tip of the spear' in timing: Year (macro) → Month (meso) → Day (micro). On a practical level: Personal Day 1 is ideal for starting projects and making bold moves. Day 2 for negotiations and partnerships. Day 3 for presentations and social events. Day 4 for administrative work and organizing. Day 5 for travel and trying something new. Day 6 for family and domestic matters. Day 7 for study, research, and rest. Day 8 for financial decisions and power plays. Day 9 for charity, letting go, and creative completion.",
    "howToRead": "The Daily Forecast feature in Grahvani's Chaldean numerology section calculates your Personal Day automatically. Use it as a daily planning tool — schedule important meetings on Day 1 or 8 days, creative work on Day 3 days, and rest on Day 7 days.",
    "significance": "While Personal Day energy is the subtlest of the three cycles, it's the most frequently consulted because people make daily decisions. The cumulative effect of consistently aligning daily activities with Personal Day energy creates measurable life improvements over months and years.",
    "examples": [],
    "relatedTerms": [
      "personal_month",
      "personal_year",
      "daily_forecast"
    ],
    "tags": [
      "numerology",
      "personal-day",
      "timing",
      "daily",
      "cycle",
      "planning"
    ]
  },
  {
    "termKey": "maturity_number",
    "domain": "numerology",
    "category": "numerology_core",
    "title": "Maturity Number",
    "sanskrit": null,
    "summary": "The sum of Destiny Number + Name Number — reveals the latent potential that activates in the second half of life (typically after age 40-45), showing one's ultimate expression.",
    "description": "The Maturity Number is calculated by adding the Destiny Number and Name Number together, then reducing to a single digit. It represents the person you are becoming — the fully realized version that emerges as youthful impulses settle and wisdom accumulates. Before age ~35-40, the Maturity Number's influence is subtle (background potential). Between 40-50, it begins emerging strongly. After 50, it becomes a dominant influence. If the Maturity Number harmonizes with the Destiny and Birth Numbers, the second half of life feels like a natural evolution. If it introduces a new number energy (e.g., a person with Destiny 1 and Birth 1 getting Maturity 7), the later years bring a surprising new dimension (in this case, the lifelong leader becomes a contemplative seeker). Master numbers as Maturity Numbers (11, 22, 33) indicate exceptional late-life potential for spiritual or humanitarian impact.",
    "howToRead": "For young clients, the Maturity Number is a preview of their future self — useful for long-term career and life planning. For clients over 40, it explains the emerging changes they're experiencing ('Why am I suddenly drawn to spirituality when I was always so practical?').",
    "significance": "The Maturity Number bridges the gap between fate (Destiny) and choice (Name). It shows that numerological influence isn't static — personality evolves according to a blueprint that can be read in advance.",
    "examples": [],
    "relatedTerms": [
      "destiny_number",
      "name_number",
      "birth_number",
      "pinnacle_number"
    ],
    "tags": [
      "numerology",
      "maturity",
      "aging",
      "potential",
      "second-half",
      "evolution"
    ]
  },
  {
    "termKey": "pinnacle_number",
    "domain": "numerology",
    "category": "numerology_core",
    "title": "Pinnacle Numbers",
    "sanskrit": null,
    "summary": "Four major life phases derived from the birth date — each Pinnacle covers a specific age range and reveals the dominant opportunities, challenges, and lessons of that life stage.",
    "description": "Pinnacle Numbers divide life into four major phases, each with its own numerological theme: First Pinnacle (birth to ~age 36 minus Destiny Number), Second Pinnacle (next 9 years), Third Pinnacle (next 9 years), Fourth Pinnacle (remaining life). Calculation: First Pinnacle = Month + Day of birth. Second Pinnacle = Day + Year. Third Pinnacle = First + Second Pinnacle numbers. Fourth Pinnacle = Month + Year. Each is reduced to a single digit. The Pinnacle Number shows what opportunities and lessons dominate each life stage. Example: A First Pinnacle of 1 means the early years are about developing independence and leadership. If the Second Pinnacle shifts to 6, the middle years focus on family, responsibility, and nurturing. The transition between Pinnacles (especially the shift from First to Second, typically in the late 20s-early 30s) often coincides with major life changes — career shifts, marriages, relocations.",
    "howToRead": "Check which Pinnacle you're currently in and what's coming next. Pinnacle transitions explain why people experience life upheavals at predictable ages. The Third Pinnacle (typically mid-40s to mid-50s) is considered the most productive, as it combines the First and Second Pinnacle lessons.",
    "significance": "Pinnacle analysis provides the long-range view of numerology — while Personal Years show annual cycles, Pinnacles show DECADES-long themes. They help explain why certain 9-year periods feel fundamentally different from others.",
    "examples": [],
    "relatedTerms": [
      "destiny_number",
      "maturity_number",
      "personal_year",
      "challenge_number"
    ],
    "tags": [
      "numerology",
      "pinnacle",
      "life-phase",
      "timing",
      "decades",
      "transition"
    ]
  },
  {
    "termKey": "lo_shu_grid",
    "domain": "numerology",
    "category": "numerology_grid",
    "title": "Lo Shu Grid",
    "sanskrit": "लो शू ग्रिड",
    "summary": "An ancient Chinese 3×3 magic square grid used in numerology — birth date digits are mapped onto the grid to reveal personality strengths, weaknesses, and missing number energies.",
    "description": "The Lo Shu Grid (also called the Magic Square of Saturn) is a 3×3 grid where each cell is assigned a number 1-9 in a specific pattern: Top row (4, 9, 2), Middle row (3, 5, 7), Bottom row (8, 1, 6). Every row, column, and diagonal sums to 15. In numerological analysis, the digits of a person's birth date are placed into their corresponding cells. For example, born 25/03/1990: digits 2,5,0,3,1,9,9,0 → cells 2, 5, 3, 1, 9, 9 get marked (0s are ignored). Cells with digits = present strengths. Empty cells = missing energies (growth areas). Multiple occurrences in a cell = amplified energy (can be excessive). Special patterns emerge: 'Arrows of Strength' (three filled cells in a row/column/diagonal) indicate natural talents. 'Arrows of Weakness' (three empty cells in a line) indicate challenges. The grid reveals: Mental plane (top row: 4,9,2 — thinking, intellect), Emotional plane (middle: 3,5,7 — feelings, will), Practical plane (bottom: 8,1,6 — material, action).",
    "howToRead": "In the Lo Shu Grid visualization: filled/highlighted cells are your strengths, empty cells are areas to develop, and cells with multiple numbers (e.g., two 9s) show amplified but potentially excessive energy. Look for complete arrows (3 in a line) — each arrow has a specific meaning (e.g., 4-5-6 diagonal = 'Arrow of Frustration' if missing, or 'Arrow of Will' if complete).",
    "significance": "The Lo Shu Grid bridges Chinese and Indian numerological traditions. In Grahvani, it complements Chaldean analysis by providing a visual, spatial representation of numeric energies — making abstract number concepts tangible and intuitive for clients.",
    "examples": [
      {
        "title": "Grid Analysis",
        "content": "Born 15/11/1985: Digits = 1,5,1,1,1,9,8,5. Grid: Cell 1 has FOUR 1s (excessive individuality/ego), Cell 5 has TWO 5s (strong freedom need), Cell 9 has ONE 9, Cell 8 has ONE 8. Missing: 2,3,4,6,7 — indicates gaps in cooperation (2), creativity (3), stability (4), responsibility (6), and spirituality (7)."
      }
    ],
    "relatedTerms": [
      "chaldean_system",
      "birth_number",
      "destiny_number"
    ],
    "tags": [
      "numerology",
      "lo-shu",
      "grid",
      "magic-square",
      "chinese",
      "birth-date",
      "visual"
    ]
  },
  {
    "termKey": "lucky_numbers",
    "domain": "numerology",
    "category": "numerology_practical",
    "title": "Lucky Numbers",
    "sanskrit": null,
    "summary": "Numbers derived from the birth date and name that are personally favorable — used for selecting dates, phone numbers, house numbers, vehicle registrations, and important decisions.",
    "description": "Lucky Numbers in Chaldean numerology are determined by the harmonious relationships between a person's core numbers (Destiny, Birth, and Name). Each number 1-9 has natural friendships and enmities with other numbers: 1 is friendly with 2, 3, 9; 2 with 1, 3, 7; 3 with 1, 2, 9; 4 with 5, 6, 8; 5 with 4, 6, 8; 6 with 4, 5, 8; 7 with 2, 6, 8; 8 with 4, 5, 6; 9 with 1, 3, 6. Your Lucky Numbers are: your Destiny Number, your Birth Number, and their friendly numbers. Lucky Colors, Lucky Days, and Lucky Gemstones are all derived from these core Lucky Numbers. Practical applications: choosing a house/flat number that matches your lucky numbers, selecting a phone number with predominant lucky digits, scheduling important meetings on lucky-numbered dates, selecting car registration numbers.",
    "howToRead": "The Lucky Numbers section lists your personally favorable numbers (3-5 numbers) with their practical applications. Use these when you have a choice — choosing flat 304 vs 305, picking a phone number, or scheduling an event date. The effect is subtle but cumulative over time.",
    "significance": "Lucky Numbers represent the most accessible and actionable aspect of numerology for everyday life. They require no complex calculations — just awareness and intentional selection when choices present themselves.",
    "examples": [],
    "relatedTerms": [
      "destiny_number",
      "birth_number",
      "name_number",
      "chaldean_system"
    ],
    "tags": [
      "numerology",
      "lucky",
      "numbers",
      "practical",
      "selection",
      "daily"
    ]
  },
  {
    "termKey": "mobile_number_numerology",
    "domain": "numerology",
    "category": "numerology_practical",
    "title": "Mobile Number Analysis",
    "sanskrit": null,
    "summary": "Numerological analysis of a phone number by summing all digits to a single number — determines the energetic vibration the person constantly carries and broadcasts.",
    "description": "In Chaldean numerology, your mobile number is considered your 'vibrating identity' — a frequency you carry 24/7 and broadcast to everyone who contacts you. Analysis method: Sum all digits of the phone number (excluding country code, or including it — practitioners vary). Example: 9876543210 → 9+8+7+6+5+4+3+2+1+0 = 45 → 4+5 = 9. This phone carries a '9' vibration — humanitarian, completion, global connectivity. Additionally, the last 4 digits are considered most influential (they're dialed/seen most frequently), and the first digit sets the 'opening energy' of the number. Ideal phone numbers: those whose total matches or is friendly to your Destiny/Birth Number. Phone numbers to watch: those reducing to your unfriendly numbers, or containing your missing Lo Shu Grid numbers (which can either fill the gap positively or amplify the weakness).",
    "howToRead": "The analysis shows the total vibration number, compound meaning, compatibility with your personal numbers, and whether the phone number helps or hinders your numerological profile. If incompatible, the recommendation may suggest adding/changing a digit if possible.",
    "significance": "Mobile number analysis has become one of the most popular numerology consultations in India because: (1) people choose their mobile numbers, (2) they use them daily, and (3) changing a number is easy compared to changing a name. It's the lowest-friction numerological optimization available.",
    "examples": [],
    "relatedTerms": [
      "lucky_numbers",
      "chaldean_system",
      "birth_number"
    ],
    "tags": [
      "numerology",
      "mobile",
      "phone",
      "number",
      "vibration",
      "practical"
    ]
  },
  {
    "termKey": "business_name_numerology",
    "domain": "numerology",
    "category": "numerology_business",
    "title": "Business Name Analysis",
    "sanskrit": null,
    "summary": "Chaldean numerological assessment of a business name's vibration — determining whether the name's energy supports commercial success, brand recognition, and financial prosperity.",
    "description": "Business Name Numerology applies Chaldean letter-to-number mapping to assess a company's name vibration. The analysis goes beyond personal numerology by evaluating: (1) Total name number — should align with the business owner's Destiny/Birth Number for harmony, (2) Compound number meaning — certain compounds are specifically business-favorable (23 'Royal Star,' 32 'Communicative,' 41 'Authoritative'), (3) Industry alignment — a creative agency benefits from 3/5/9 vibrations, while a law firm needs 4/8/1 energy, (4) Owner compatibility — the business name should harmonize with, not conflict with, the owner's personal numbers, (5) First letter energy — the first letter of the business name carries disproportionate weight as it's the 'opening impression.' The analysis also covers taglines, domain names, and even email addresses associated with the business, as these are sub-vibrations of the brand identity.",
    "howToRead": "The business analysis returns a compatibility score, compound meaning, industry alignment rating, and specific recommendations. A 'FAVORABLE' verdict means the name supports commercial success. If 'UNFAVORABLE,' the report suggests specific letter changes or additions to improve the vibration.",
    "significance": "Business name numerology is one of the highest-value numerology services because the financial stakes are real. Many Indian entrepreneurs consult numerologists before registering company names, and several major Indian corporations reportedly had their names numerologically optimized.",
    "examples": [],
    "relatedTerms": [
      "name_number",
      "chaldean_system",
      "compound_number",
      "lucky_numbers"
    ],
    "tags": [
      "numerology",
      "business",
      "name",
      "brand",
      "commercial",
      "success"
    ]
  },
  {
    "termKey": "compatibility_numerology",
    "domain": "numerology",
    "category": "numerology_relationship",
    "title": "Numerological Compatibility",
    "sanskrit": null,
    "summary": "Assessment of relationship compatibility by comparing the core numbers (Destiny, Birth, Name) of two individuals — used for romantic, business, friendship, and family relationship analysis.",
    "description": "Numerological compatibility analysis compares two people's numerological profiles across multiple dimensions: (1) Destiny Number compatibility — are their life purposes aligned or conflicting? (2) Birth Number compatibility — do their personalities naturally mesh? (3) Name Number compatibility — do their social expressions harmonize? (4) Personal Year synchronization — are they in compatible life phases? (5) Lo Shu Grid complementarity — do they fill each other's missing numbers? The analysis produces both a numeric compatibility score and a narrative explanation. Key harmonious pairs: 1-5 (leader + adventurer), 2-6 (diplomat + nurturer), 3-9 (creative + humanitarian), 4-8 (builder + executive). Challenging pairs: 1-4 (leader vs rigid), 5-7 (freedom vs solitude), 3-8 (creative vs authoritative). Perfect number matches (same number) can be powerfully compatible OR intensely competitive — two 1s may clash for leadership, while two 6s create a deeply nurturing bond.",
    "howToRead": "The compatibility report shows individual profiles side-by-side, a percentage score, strengths/challenges analysis, and specific relationship advice. For romantic compatibility, pay special attention to the Birth Number match (daily interaction quality) and Destiny Number match (long-term life direction alignment).",
    "significance": "Numerological compatibility adds a complementary perspective to traditional Vedic matchmaking (Ashta Koota). While Ashta Koota uses planetary positions, numerological compatibility uses the mathematics of names and dates — sometimes confirming, sometimes nuancing the Vedic assessment.",
    "examples": [],
    "relatedTerms": [
      "destiny_number",
      "birth_number",
      "name_number",
      "chaldean_system"
    ],
    "tags": [
      "numerology",
      "compatibility",
      "relationship",
      "love",
      "partnership",
      "matching"
    ]
  },
  {
    "termKey": "baby_name_numerology",
    "domain": "numerology",
    "category": "numerology_naming",
    "title": "Baby Name Analysis",
    "sanskrit": null,
    "summary": "Numerological evaluation and optimization of baby names — ensuring the child's name vibration harmonizes with their birth date destiny for a supportive life foundation.",
    "description": "Baby Name Numerology is one of the most sought-after applications of Chaldean numerology. The process: (1) Calculate the baby's Destiny Number from their birth date (this is fixed), (2) Calculate the Name Number for proposed names using Chaldean mapping, (3) Check if Name Number harmonizes with Destiny Number, (4) Analyze the compound number for hidden meanings, (5) Check each letter's individual vibration, (6) Verify the first letter's energy aligns with the desired personality traits. The analysis also evaluates: initials (first + middle + last name initials have their own vibration), nicknames (since Chaldean uses the COMMONLY USED name), and cultural naming conventions. For Indian babies, the Namakshar (first syllable) from the nakshatra is often given — numerological analysis can confirm or suggest alternatives within the same nakshatra's syllable range.",
    "howToRead": "The baby name report shows each proposed name with its Chaldean value, compound meaning, compatibility score with the birth destiny, and a verdict. Names with 'HIGHLY FAVORABLE' verdicts offer the most supportive vibrations. The 'variations' feature suggests spelling alternatives that improve the numerological profile while preserving the name's sound.",
    "significance": "Baby naming is where numerology and Vedic astrology most directly overlap — the nakshatra-based Namakshar provides the starting syllable (Vedic), while Chaldean numerology optimizes the full name spelling. Together, they create a name that is both astrologically and numerologically aligned.",
    "examples": [],
    "relatedTerms": [
      "name_number",
      "chaldean_system",
      "destiny_number",
      "nakshatra"
    ],
    "tags": [
      "numerology",
      "baby-name",
      "naming",
      "child",
      "newborn",
      "optimization"
    ]
  },
  {
    "termKey": "daily_forecast_numerology",
    "domain": "numerology",
    "category": "numerology_timing",
    "title": "Daily Numerology Forecast",
    "sanskrit": null,
    "summary": "A personalized daily prediction combining Personal Day Number with universal day energy — provides guidance on optimal activities, lucky colors, and energy management for each day.",
    "description": "The Daily Numerology Forecast synthesizes three layers of numerological timing: (1) Personal Day Number (your individual vibration for the day), (2) Universal Day Number (the collective energy — sum of the full date reduced), (3) Interaction between Personal and Universal energies. When Personal and Universal Day Numbers harmonize (same number or friendly numbers), the day flows easily. When they conflict, external circumstances may oppose personal plans. The forecast includes: recommended activities, lucky color of the day (each number has associated colors), energy level prediction (high-energy numbers like 1, 5, 8 vs. contemplative numbers like 2, 4, 7), people interactions guidance (which number-type people to seek out or avoid), and emotional weather (creative, analytical, restless, etc.). The Daily Lucky Color feature is especially popular — it suggests what to wear based on the day's predominant number vibration.",
    "howToRead": "Check the forecast each morning. The 'Energy Type' tells you whether to be proactive (1, 3, 5, 8) or receptive (2, 4, 6, 7). The Lucky Color amplifies the day's positive vibration when worn. The 'Best Activities' list helps you schedule your day in alignment with numerological currents.",
    "significance": "Daily forecasts make numerology a living practice rather than a one-time consultation. The consistency of checking daily helps clients internalize number patterns and develop intuitive understanding of numerological cycles.",
    "examples": [],
    "relatedTerms": [
      "personal_day",
      "personal_month",
      "personal_year",
      "lucky_numbers"
    ],
    "tags": [
      "numerology",
      "daily",
      "forecast",
      "prediction",
      "color",
      "timing"
    ]
  },
  {
    "termKey": "life_blueprint_numerology",
    "domain": "numerology",
    "category": "numerology_packages",
    "title": "Life Blueprint (Comprehensive Profile)",
    "sanskrit": null,
    "summary": "A complete Chaldean numerological profile combining all core numbers, timing cycles, compatibility insights, and practical recommendations into a single comprehensive report.",
    "description": "The Life Blueprint is the most comprehensive numerological analysis available — it combines ALL core analyses into one unified report. Components include: (1) Core Profile — Destiny, Birth, Name, Maturity, and Expression Numbers with their compound meanings, (2) Timing Overview — current Personal Year, Month, and Day positions within the 9-year cycle, (3) Pinnacle Phases — all four life phases with transition dates, (4) Karmic Analysis — any karmic debt numbers, karmic lessons (missing numbers 1-9 in the birth date), and the Balance Number, (5) Lo Shu Grid — visual grid with arrows of strength/weakness analysis, (6) Lucky Elements — numbers, colors, days, gemstones, directions, (7) Career Alignment — which career paths match the numerological profile, (8) Relationship Compatibility Guide — which number types are ideal partners, (9) Health Indicators — numbers associated with specific health tendencies, (10) Annual Forecast — full 9-year cycle preview. The Blueprint is designed as a reference document that remains relevant for years.",
    "howToRead": "The Life Blueprint is structured progressively: Core Numbers (who you are) → Timing (where you are in life's cycles) → Destiny (where you're heading) → Practical (what to do about it). Start with the Core Profile summary, then deep-dive into sections relevant to your current questions.",
    "significance": "The Life Blueprint represents the premium numerology offering — it's the equivalent of a detailed Kundali (birth chart) in Vedic astrology. For practitioners, it's the highest-value service. For clients, it's a one-time investment that provides ongoing guidance.",
    "examples": [],
    "relatedTerms": [
      "destiny_number",
      "birth_number",
      "name_number",
      "pinnacle_number",
      "lo_shu_grid",
      "personal_year"
    ],
    "tags": [
      "numerology",
      "blueprint",
      "comprehensive",
      "profile",
      "complete",
      "premium"
    ]
  },
  {
    "termKey": "number_meanings_1_9",
    "domain": "numerology",
    "category": "numerology_core",
    "title": "Number Meanings (1-9)",
    "sanskrit": null,
    "summary": "The fundamental meanings of single digits 1 through 9 in Chaldean numerology — each number represents a distinct archetype, planetary ruler, and life energy.",
    "description": "The nine single digits are the building blocks of all numerological analysis. Each has a planetary ruler and archetype: 1 (Sun) — Leadership, independence, originality, pioneering spirit. The initiator. 2 (Moon) — Diplomacy, sensitivity, partnership, receptivity. The peacemaker. 3 (Jupiter) — Creativity, communication, joy, social charisma. The performer. 4 (Rahu/Uranus) — Structure, discipline, unconventional thinking, building foundations. The engineer. 5 (Mercury) — Freedom, versatility, change, communication, travel. The adventurer. 6 (Venus) — Love, beauty, responsibility, nurturing, home. The caretaker. 7 (Ketu/Neptune) — Spirituality, analysis, introspection, mysticism, research. The seeker. 8 (Saturn) — Power, authority, material success, karmic justice, executive ability. The achiever. 9 (Mars) — Humanitarianism, completion, universal love, courage, transformation. The visionary. In Chaldean numerology, 9 is considered sacred — it is the only number that, when multiplied by any number, always reduces back to 9 (9×2=18→9, 9×3=27→9). This 'indestructible' quality gives 9 a special status as the number of completion and universal truth.",
    "howToRead": "When you encounter any number in a Chaldean analysis (Destiny, Birth, Name, Personal Year, etc.), refer to these core meanings. The context modifies the expression — a '1' as a Destiny Number manifests differently than a '1' as a Personal Day — but the archetypal energy remains consistent.",
    "significance": "These nine archetypes are the alphabet of numerology. Just as 26 letters create all English words, these 9 numbers (plus master numbers 11, 22, 33) create all numerological profiles. Mastering their meanings is the foundation of all numerological interpretation.",
    "examples": [],
    "relatedTerms": [
      "chaldean_system",
      "destiny_number",
      "birth_number",
      "compound_number"
    ],
    "tags": [
      "numerology",
      "meanings",
      "1-9",
      "archetypes",
      "planets",
      "foundation"
    ]
  },
  {
    "termKey": "kundali",
    "domain": "vedic",
    "category": "general",
    "title": "Kundali (Birth Chart / Horoscope)",
    "sanskrit": "कुण्डली",
    "summary": "The foundational astrological chart cast for the exact moment and location of birth — a celestial snapshot that maps all 9 planets across 12 houses and 12 signs.",
    "description": "A Kundali (also called Janam Kundali, Janam Patri, or Birth Chart) is the primary tool of Vedic astrology. It is calculated using three birth inputs: date, exact time, and geographic location. The chart consists of: 12 Houses (Bhavas) — each governing a specific life area (1st=self, 2nd=wealth, 3rd=siblings, 4th=home/mother, 5th=children/education, 6th=enemies/disease, 7th=spouse/partnerships, 8th=longevity/transformation, 9th=fortune/father, 10th=career, 11th=gains, 12th=losses/liberation), 12 Signs (Rashis) — mapping the zodiac across these houses, and 9 Planets (Navagraha) — placed in their calculated positions. The Ascendant (Lagna) — the zodiac sign rising on the eastern horizon at birth — determines the house alignment and is considered the chart's anchor. North Indian charts use a diamond grid with the 1st house always at the top; South Indian charts use a rectangular grid with signs in fixed positions. KP charts use the Placidus house system with unequal house sizes.",
    "howToRead": "Start with the Ascendant (1st house) — this is 'you.' Check which planets occupy or aspect the 1st house for personality insights. Then examine houses relevant to your query: 7th for marriage, 10th for career, 5th for children, etc. The sign and planet(s) in each house, plus aspects from other planets, tell the story.",
    "significance": "The Kundali is to Vedic astrology what a DNA report is to genetics — it encodes the cosmic blueprint of an individual's life. Every Vedic astrological analysis (dashas, yogas, doshas, transits, muhurta compatibility) begins with and refers back to the Kundali.",
    "examples": [
      {
        "title": "Chart Reading Start",
        "content": "Ascendant in Leo (ruled by Sun) → The person leads with confidence, charisma, and authority. Sun in the 10th house → Career is central to identity. Jupiter aspects the Ascendant → Wisdom, optimism, and good fortune color the personality."
      }
    ],
    "relatedTerms": [
      "navagraha",
      "rashi",
      "nakshatra",
      "bhava",
      "lagna"
    ],
    "tags": [
      "general",
      "kundali",
      "birth-chart",
      "horoscope",
      "foundation",
      "vedic"
    ]
  },
  {
    "termKey": "lagna",
    "domain": "vedic",
    "category": "general",
    "title": "Lagna (Ascendant / Rising Sign)",
    "sanskrit": "लग्न",
    "summary": "The zodiac sign rising on the eastern horizon at the exact moment of birth — the single most important point in a Vedic chart, determining house alignment and core personality.",
    "description": "The Lagna (Ascendant) is the zodiacal degree crossing the eastern horizon at the precise moment of birth. It changes approximately every 2 hours (each sign takes about 2 hours to rise), making birth time accuracy critical. The Lagna determines: (1) Which sign occupies which house — this is the entire framework of the chart, (2) The Lagna Lord (ruler of the Ascendant sign) — the most important planet in the chart, representing the native's life direction, (3) Physical appearance and constitution — Aries Lagna tends toward athletic build, Taurus toward sturdy, Gemini toward slender, etc., (4) Core personality — distinct from Sun sign (Western astrology) or Moon sign (common Vedic reference), the Lagna shows HOW you engage with the world. In Vedic astrology, the Lagna is more important than the Sun sign. Two people born on the same day but at different times (and thus different Lagnas) will have dramatically different charts and life experiences.",
    "howToRead": "The Lagna is always the 1st house. Its sign tells you the native's basic approach to life. Its lord's placement shows where the native directs their primary energy. Example: Virgo Lagna → analytical, detail-oriented approach. Virgo lord Mercury in the 10th house → career-focused analysis and communication.",
    "significance": "The Lagna changes every ~2 hours while the Moon sign changes every ~2.5 days and the Sun sign every ~30 days. This makes the Lagna the most personalized element of the chart — and why birth time accuracy (ideally within 1-2 minutes) is paramount for correct predictions.",
    "examples": [],
    "relatedTerms": [
      "kundali",
      "rashi",
      "bhava",
      "sign_lord"
    ],
    "tags": [
      "general",
      "lagna",
      "ascendant",
      "rising-sign",
      "1st-house",
      "foundation"
    ]
  },
  {
    "termKey": "ayanamsa",
    "domain": "vedic",
    "category": "general",
    "title": "Ayanamsa (Precession Correction)",
    "sanskrit": "अयनांश",
    "summary": "The angular difference between the Tropical and Sidereal zodiacs — the critical correction that distinguishes Vedic (sidereal) from Western (tropical) astrology.",
    "description": "Ayanamsa literally means 'the degree of movement' — it measures the angular distance between the Vernal Equinox point (Tropical zodiac 0° Aries) and the fixed star reference point (Sidereal zodiac 0° Aries). This difference exists because the Earth's rotational axis slowly wobbles (precesses) over a ~26,000-year cycle, causing the equinox point to drift backwards through the zodiac at ~50.3 arc-seconds per year. In 2026, the Ayanamsa is approximately 24°12' — meaning the Vedic zodiac is shifted ~24° from the Western zodiac. This is why a 'Taurus' in Western astrology might be an 'Aries' in Vedic astrology. Multiple Ayanamsa values exist: Lahiri/Chitrapaksha (Indian government standard, used in most Vedic astrology), Raman (B.V. Raman's calculation), KP Ayanamsa (Prof. Krishnamurti's calibrated value, ~6' different from Lahiri), and Fagan-Bradley (used in Western sidereal astrology). Grahvani supports three systems: Lahiri (default for Parashari), Raman, and KP.",
    "howToRead": "The Ayanamsa value affects EVERY planetary position in the chart. When comparing readings from different astrologers, first check if they used the same Ayanamsa — a discrepancy of even 1° can shift planets between signs or nakshatras, leading to different predictions. Grahvani displays the Ayanamsa used at the top of every chart.",
    "significance": "The Ayanamsa is arguably the most important technical parameter in Vedic astrology. The ongoing debate between Lahiri, Raman, and KP Ayanamsas has produced different 'schools' of prediction, each claiming superior accuracy. There is no universally agreed 'correct' value — practitioners choose based on their training and empirical validation.",
    "examples": [],
    "relatedTerms": [
      "kp_ayanamsa",
      "lagna",
      "kundali",
      "rashi"
    ],
    "tags": [
      "general",
      "ayanamsa",
      "precession",
      "sidereal",
      "tropical",
      "correction",
      "technical"
    ]
  },
  {
    "termKey": "transit",
    "domain": "vedic",
    "category": "general",
    "title": "Gochara (Transit)",
    "sanskrit": "गोचर",
    "summary": "The current real-time positions of planets as they move through the zodiac — transits over natal chart positions trigger life events and shifts in fortune.",
    "description": "Gochara (transit) analysis examines the current positions of planets relative to the natal chart, particularly relative to the natal Moon sign. While the Dasha system provides the PRIMARY timing framework in Vedic astrology, transits provide the SECONDARY trigger — events predicted by dashas typically manifest when supported by favorable transits. Key transit rules: Saturn takes ~2.5 years per sign (Sade Sati when transiting Moon's sign ± 1 sign), Jupiter takes ~1 year per sign (considered the most beneficial transit planet), Rahu/Ketu take ~1.5 years per sign (ecliptic transit points), and inner planets (Sun, Moon, Mercury, Venus, Mars) transit faster and are used for fine-tuning timing. The Ashtakavarga system quantifies transit strength — a planet transiting a sign where it has many Ashtakavarga points (benefic dots) gives good results, regardless of other factors.",
    "howToRead": "Transit analysis shows each planet's current sign and house (from your Moon sign), its speed and direction (direct/retrograde), and its Ashtakavarga score in the current sign. Green planets in strong Ashtakavarga signs are currently supportive. Red planets in weak signs are currently challenging.",
    "significance": "Transits explain DAY-TO-DAY fluctuations within longer dasha periods. A person in a positive Mahadasha may still experience a rough month when Saturn transits a sensitive natal point. Understanding both dashas and transits gives the complete timing picture.",
    "examples": [],
    "relatedTerms": [
      "sade_sati",
      "ashtakavarga",
      "vimshottari_dasha",
      "kundali"
    ],
    "tags": [
      "general",
      "transit",
      "gochara",
      "current",
      "timing",
      "real-time",
      "movement"
    ]
  },
  {
    "termKey": "retrograde",
    "domain": "vedic",
    "category": "general",
    "title": "Vakri (Retrograde)",
    "sanskrit": "वक्री",
    "summary": "The apparent backward motion of a planet as seen from Earth — retrograde planets in the natal chart gain special strength in Vedic astrology, contrary to Western astrology's negative connotation.",
    "description": "Vakri (retrograde) motion occurs when a planet appears to move backward through the zodiac from Earth's perspective. This is an optical illusion caused by the relative orbital speeds of Earth and the planet — like a slow car appearing to move backward when you pass it on a highway. In VEDIC astrology, retrograde planets are generally considered STRONG (contrary to Western astrology where retrogrades are considered weakened): a retrograde planet has the strength of an exalted planet (Parashari view), or behaves as if in the previous sign (some KP practitioners). Retrograde affects only the 5 true planets (Mars, Mercury, Jupiter, Venus, Saturn) — Sun and Moon never retrograde, and Rahu/Ketu are always in apparent retrograde motion. Key behaviors: Retrograde planets give results related to past karma (revisiting, reviewing, reworking). Mercury retrograde is famously associated with communication/technology glitches. Saturn retrograde intensifies karmic lessons. Jupiter retrograde deepens internal wisdom over external growth.",
    "howToRead": "A planet marked with 'R' or '(R)' in the chart is retrograde. In the natal chart, this typically strengthens the planet. In transit analysis, retrograde periods are times for REview, REvisit, and REflect — not ideal for initiating NEW ventures related to that planet's significations.",
    "significance": "The differing interpretation of retrogrades between Vedic and Western astrology is one of the most significant philosophical differences between the systems. Vedic astrology's positive view of natal retrogrades often resolves confusing chart readings that Western astrology struggles with.",
    "examples": [],
    "relatedTerms": [
      "navagraha",
      "transit",
      "kundali",
      "mercury"
    ],
    "tags": [
      "general",
      "retrograde",
      "vakri",
      "backward",
      "strength",
      "review"
    ]
  },
  {
    "termKey": "combustion",
    "domain": "vedic",
    "category": "general",
    "title": "Asta (Combustion)",
    "sanskrit": "अस्त",
    "summary": "When a planet comes too close to the Sun (within specific degree limits), it becomes 'combust' — losing its independent power and becoming overwhelmed by the Sun's energy.",
    "description": "Combustion (Asta or Moudhya) occurs when a planet is within a certain degree proximity to the Sun: Moon (12°), Mars (17°), Mercury (14° direct, 12° retrograde), Jupiter (11°), Venus (10° direct, 8° retrograde), Saturn (15°). When combust, a planet's significations are 'burned' or overwhelmed by the Sun's energy — the planet cannot express itself freely. Effects: a combust Venus may struggle to express love or enjoy beauty, a combust Jupiter may have weakened wisdom or luck, a combust Mercury may have impaired communication or business sense. However, there are important exceptions: Mercury is frequently combust (since it never goes far from the Sun) and is considered less harmed. A combust planet in its own sign or exaltation is partially protected. In KP, combustion is given less weight than in Parashari — the sub-lord analysis takes precedence.",
    "howToRead": "Combust planets are marked with a sun icon or '(C)' notation. Check the exact degree distance from the Sun — closer = more combust. A planet at 16° from the Sun when the combustion limit is 17° is barely combust and may function nearly normally.",
    "significance": "Combustion is one of the most commonly overlooked factors in chart analysis. A chart with a strong-looking Jupiter (in its own sign, well-aspected) but combust may disappoint in Jupiter-related predictions. Always check Sun proximity for all planets.",
    "examples": [],
    "relatedTerms": [
      "sun",
      "navagraha",
      "dignity",
      "kundali"
    ],
    "tags": [
      "general",
      "combustion",
      "asta",
      "sun",
      "proximity",
      "weakness"
    ]
  },
  {
    "termKey": "aspect_vedic",
    "domain": "vedic",
    "category": "general",
    "title": "Drishti (Vedic Aspect)",
    "sanskrit": "दृष्टि",
    "summary": "The 'glance' or influence a planet casts on other houses and planets — Vedic aspects differ fundamentally from Western aspects, with all planets aspecting the 7th house and Mars/Jupiter/Saturn having special additional aspects.",
    "description": "Drishti (literally 'sight' or 'glance') is the Vedic concept of planetary aspect — how planets influence houses and other planets from a distance. Key differences from Western aspects: (1) ALL planets aspect the 7th house from themselves (opposition) at full strength, (2) Mars has SPECIAL aspects on the 4th and 8th houses from itself (in addition to the 7th), (3) Jupiter has SPECIAL aspects on the 5th and 9th houses from itself, (4) Saturn has SPECIAL aspects on the 3rd and 10th houses from itself, (5) Rahu/Ketu have special aspects on the 5th and 9th (like Jupiter), (6) There are NO trine, sextile, or square aspects in traditional Vedic astrology — only the 7th house aspect and special aspects. Aspects are ONE-WAY in Vedic astrology — a planet aspects a house, not the other way around. A benefic planet's aspect improves the aspected house/planet, while a malefic planet's aspect harms it. In KP astrology, aspects are used supplementarily — the sub-lord system takes precedence over aspects.",
    "howToRead": "In the chart, aspect lines show which planets influence which houses. Jupiter's aspect on the 5th and 9th houses is considered highly beneficial (expanding children/education and fortune). Saturn's aspect on the 3rd and 10th houses brings discipline and delays to communication and career respectively. Mars' aspect on the 4th and 8th houses can create property disputes and health challenges.",
    "significance": "Understanding Vedic aspects transforms chart reading. A house that appears 'empty' (no planets) may be strongly influenced by aspects from planets in other houses. Saturn's 10th house aspect, for example, can affect career from three houses away — something invisible without aspect analysis.",
    "examples": [
      {
        "title": "Jupiter's Triple Aspect",
        "content": "Jupiter in the 1st house aspects: 5th house (children, creativity — benefic), 7th house (marriage, partnerships — benefic), 9th house (fortune, spirituality — benefic). Three houses simultaneously blessed by Jupiter's wisdom."
      }
    ],
    "relatedTerms": [
      "navagraha",
      "kundali",
      "bhava",
      "jupiter",
      "saturn",
      "mars"
    ],
    "tags": [
      "general",
      "aspect",
      "drishti",
      "glance",
      "influence",
      "special-aspect"
    ]
  },
  {
    "termKey": "house_significations",
    "domain": "vedic",
    "category": "general",
    "title": "Bhava Significations (House Meanings)",
    "sanskrit": "भाव कारकत्व",
    "summary": "The life areas governed by each of the 12 houses — the foundational framework for interpreting which domains of life are activated by planetary placements and dashas.",
    "description": "Each of the 12 Bhavas (houses) governs specific life domains. The significations expand far beyond the simple keywords: 1st House (Tanu — Self): Physical body, health, personality, general vitality, head, brain, new beginnings. 2nd House (Dhana — Wealth): Accumulated wealth, family, speech, food habits, right eye, face, early education. 3rd House (Sahaja — Siblings): Younger siblings, courage, short travel, communication, writing, arms, shoulders. 4th House (Sukha — Happiness): Mother, home, property, vehicles, emotional peace, chest, formal education. 5th House (Putra — Children): Children, creativity, intelligence, romance, past life merit, stomach, speculation. 6th House (Ripu — Enemies): Enemies, disease, debts, service, competition, obstacles, digestive system. 7th House (Kalatra — Spouse): Marriage, business partnerships, foreign travel, public image, reproductive system. 8th House (Ayu — Longevity): Lifespan, sudden events, inheritance, occult, research, chronic diseases, transformation. 9th House (Dharma — Fortune): Father, fortune, higher education, long travel, spirituality, guru, law. 10th House (Karma — Career): Career, reputation, authority, government, public status, knees. 11th House (Labha — Gains): Income, gains, elder siblings, wishes fulfilled, social circles, ankles. 12th House (Vyaya — Loss): Expenses, foreign residence, spirituality, moksha, hospitalization, isolation, feet.",
    "howToRead": "When analyzing any life question, identify the primary house: career question → 10th house. Marriage → 7th house. Then check: (1) Which sign occupies that house, (2) Its lord's placement and strength, (3) Any planets in the house, (4) Aspects received from other planets. In KP, focus on the cuspal sub-lord of the relevant house.",
    "significance": "House significations are the 'dictionary' of astrological interpretation. Every prediction ultimately traces back to house meanings. Mastering the 12 house significations and their interconnections (e.g., 2nd + 7th + 11th for marriage) is the essential skill for chart reading.",
    "examples": [],
    "relatedTerms": [
      "kundali",
      "lagna",
      "bhava",
      "significator"
    ],
    "tags": [
      "general",
      "house",
      "bhava",
      "signification",
      "meaning",
      "12-houses",
      "life-areas"
    ]
  },
  {
    "termKey": "benefic_malefic",
    "domain": "vedic",
    "category": "general",
    "title": "Benefic and Malefic Planets",
    "sanskrit": "शुभ एवं पाप ग्रह",
    "summary": "The classification of planets as naturally benefic (Jupiter, Venus, waxing Moon, well-associated Mercury) or malefic (Saturn, Mars, Rahu, Ketu, Sun, waning Moon) — modified by house ownership for each Lagna.",
    "description": "Vedic astrology classifies planets into two fundamental categories: Natural Benefics (Shubha Grahas) — Jupiter (greatest benefic), Venus (benefic of beauty/pleasure), Mercury (benefic when alone or with benefics), Moon (benefic when waxing/bright, between Shukla Ashtami to Krishna Ashtami). Natural Malefics (Papa/Krura Grahas) — Saturn (greatest malefic — delays, karmic lessons), Mars (malefic — aggression, accidents), Rahu (malefic — illusion, obsession), Ketu (malefic — detachment, spiritual upheaval), Sun (mild malefic — ego, authority pressure), Moon (malefic when waning/dark). CRITICALLY, natural classification is modified by FUNCTIONAL classification based on the Lagna: a natural benefic becomes a functional malefic if it owns the 6th, 8th, or 12th houses for that Lagna, and a natural malefic becomes a functional benefic if it owns the 1st, 5th, or 9th houses (trines). This dual system prevents simplistic good/bad planet judgments.",
    "howToRead": "First identify natural benefics/malefics. Then determine functional status based on your Lagna — this is chart-specific. A planet that is BOTH natural benefic AND functional benefic (e.g., Jupiter owning the 9th house for Aries Lagna) is exceptionally positive. A planet that is natural malefic BUT functional benefic (e.g., Saturn owning the 9th and 10th for Taurus Lagna — Yogakaraka!) produces powerful positive results despite its malefic nature.",
    "significance": "The benefic/malefic dual classification system is uniquely Vedic — Western astrology doesn't formally classify planets this way. It prevents the common misconception that 'Jupiter is always good' or 'Saturn is always bad' — context (Lagna + house ownership) determines everything.",
    "examples": [
      {
        "title": "Saturn as Yogakaraka",
        "content": "For Taurus and Libra Lagnas, Saturn owns both a Kendra (angular house) and a Trikona (trine house), making it the Yogakaraka — the single most beneficial planet in the chart, despite being a natural malefic. Saturn's dasha becomes the most productive period."
      }
    ],
    "relatedTerms": [
      "navagraha",
      "lagna",
      "kundali",
      "jupiter",
      "saturn",
      "yogakaraka"
    ],
    "tags": [
      "general",
      "benefic",
      "malefic",
      "shubha",
      "papa",
      "classification",
      "functional"
    ]
  },
  {
    "termKey": "remedies_vedic",
    "domain": "vedic",
    "category": "general",
    "title": "Jyotish Remedies (Upaya)",
    "sanskrit": "उपाय",
    "summary": "Prescribed actions to strengthen weak planets or mitigate harsh planetary influences — including gemstones, mantras, charity, fasting, yantra worship, and specific behavioral changes.",
    "description": "Vedic astrological remedies (Upayas) are prescribed to modulate planetary energies in a person's chart. The main remedy categories: (1) Gemstones (Ratna) — wearing specific stones in specific metals on specific fingers strengthens the associated planet: Ruby/Sun, Pearl/Moon, Red Coral/Mars, Emerald/Mercury, Yellow Sapphire/Jupiter, Diamond/Venus, Blue Sapphire/Saturn (most powerful/dangerous), Hessonite/Rahu, Cat's Eye/Ketu. (2) Mantras — planetary mantras chanted in specific counts (108, 1008, etc.) during the planet's hora (hour). Each planet has a Beej (seed) mantra. (3) Charity (Daan) — donating items associated with the malefic planet on its day: black til/oil for Saturn (Saturday), red items for Mars (Tuesday). (4) Fasting (Vrat) — fasting on the malefic planet's day. (5) Yantras — geometric diagrams representing planetary energies, energized through rituals. (6) Puja/Homa — fire rituals and temple worship for specific planets. (7) Behavioral — simple lifestyle adjustments: respecting elders for Saturn, serving parents for Sun/Moon, helping siblings for Mars/Mercury.",
    "howToRead": "Remedies in a Grahvani report appear in the recommendations section of chart analysis. Each remedy includes the target planet, the remedy type, and specific instructions. IMPORTANT: Gemstone remedies should ONLY be prescribed for benefic planets in the chart — never strengthen a malefic planet's energy with a gemstone, as it amplifies the negative effects.",
    "significance": "Remedies transform astrology from a fatalistic diagnosis into a therapeutic practice. The philosophical foundation: karma is modifiable through conscious action. Remedies don't 'change' planetary positions — they adjust the person's energetic relationship with those planetary energies.",
    "examples": [
      {
        "title": "Saturn Remedy",
        "content": "Weak Saturn causing career delays → Behavioral remedy: respect elders, be punctual, take responsibility. Charity: donate black items on Saturdays. Mantra: 'Om Sham Shanaishcharaya Namah' (108 times on Saturdays). Gemstone: Blue Sapphire ONLY if Saturn is a functional benefic for your Lagna."
      }
    ],
    "relatedTerms": [
      "navagraha",
      "kundali",
      "benefic_malefic",
      "saturn",
      "jupiter"
    ],
    "tags": [
      "general",
      "remedies",
      "upaya",
      "gemstone",
      "mantra",
      "charity",
      "healing"
    ]
  },
  {
    "termKey": "sarvottama_grade",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Sarvottama (Supreme Grade)",
    "sanskrit": "सर्वोत्तम",
    "summary": "Score 82-100 — the highest muhurat grade indicating ideal timing with excellent panchang, strong lagna, and no doshas.",
    "description": "Sarvottama is the supreme grade in the Grahvani muhurat grading system, awarded to time windows scoring 82-100 out of 100. A Sarvottama muhurat has passed all gate checks (no gandanta, no dagdha yoga, no mahadoshas), scored highly on Panchang Shuddhi (tithi, nakshatra, vara, yoga, karana all favorable), and has a strong lagna suited to the event type. These windows are rare — typically only a few per month for strict ceremonies like Vivah.",
    "howToRead": "In the Grahvani muhurat results, Sarvottama windows appear with a gold badge and the highest priority ranking. When a client asks for the 'best possible time,' these are the windows to recommend without reservation.",
    "significance": "Sarvottama muhurats represent the gold standard in electional astrology. For high-stakes ceremonies (marriage, griha pravesh, business launch), recommending only Sarvottama windows gives the astrologer confidence that every classical condition has been satisfied.",
    "examples": [],
    "relatedTerms": ["uttama_grade", "madhyama_grade", "panchang_shuddhi", "lagna_shuddhi", "mahadosha_gate"],
    "tags": ["muhurta", "grading", "sarvottama", "supreme"]
  },
  {
    "termKey": "uttama_grade",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Uttama (Excellent Grade)",
    "sanskrit": "उत्तम",
    "summary": "Score 68-81 — highly recommended muhurat with strong positive factors and only minor caveats.",
    "description": "Uttama is the second-highest grade in the Grahvani muhurat system, covering scores from 68 to 81. These windows have cleared all mandatory gate checks and scored well on panchang and lagna evaluation, but may have one or two minor deductions — perhaps a slightly less ideal nakshatra or a modest tara bala penalty. Uttama muhurats are plentiful compared to Sarvottama and are entirely suitable for all ceremony types.",
    "howToRead": "Uttama windows appear with a silver badge in the muhurat results. They are the recommended default when Sarvottama windows are unavailable or fall at impractical times. The minor caveats are noted in the detail breakdown.",
    "significance": "Most professional astrologers consider Uttama muhurats fully acceptable for all ceremonies. The minor deductions that separate Uttama from Sarvottama are often academic distinctions that do not materially affect the ceremony's auspiciousness.",
    "examples": [],
    "relatedTerms": ["sarvottama_grade", "madhyama_grade", "panchang_shuddhi", "lagna_shuddhi"],
    "tags": ["muhurta", "grading", "uttama", "excellent"]
  },
  {
    "termKey": "madhyama_grade",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Madhyama (Good Grade)",
    "sanskrit": "मध्यम",
    "summary": "Score 55-67 — recommended muhurat with balanced positive and negative factors.",
    "description": "Madhyama is the middle grade in the Grahvani muhurat system, spanning scores 55 to 67. These windows have passed all mandatory gate checks but show a mix of favorable and unfavorable factors — perhaps a good tithi paired with an average nakshatra, or strong panchang with a less-than-ideal lagna. Madhyama muhurats are common and practical for most non-critical ceremonies.",
    "howToRead": "Madhyama windows appear with a bronze badge. The detail breakdown highlights both strengths and weaknesses. Recommend these when higher-grade windows conflict with the client's schedule, noting the specific caveats.",
    "significance": "Madhyama represents the practical middle ground in muhurat selection. Traditional texts acknowledge that waiting indefinitely for a perfect muhurat is itself inauspicious — a Madhyama window at a convenient time often serves better than a Sarvottama window at 3 AM.",
    "examples": [],
    "relatedTerms": ["sarvottama_grade", "uttama_grade", "samanya_grade", "panchang_shuddhi"],
    "tags": ["muhurta", "grading", "madhyama", "good"]
  },
  {
    "termKey": "samanya_grade",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Samanya (Average Grade)",
    "sanskrit": "सामान्य",
    "summary": "Score 42-54 — acceptable muhurat where one should proceed with awareness of limitations.",
    "description": "Samanya is the below-middle grade in the Grahvani system, covering scores 42 to 54. These windows have passed mandatory gate checks but accumulated significant deductions from panchang quality, tara bala, chandrabala, or lagna fitness. The timing is not actively harmful but lacks strong auspicious support. Suitable for routine activities or when scheduling constraints leave no better option.",
    "howToRead": "Samanya windows appear with a grey badge. The detail panel will show multiple deduction areas. When presenting these to clients, explain the limitations clearly and suggest remedial measures (specific mantras or puja before the event) to compensate.",
    "significance": "Samanya muhurats are the threshold below which an astrologer should actively seek alternatives. They are acceptable for low-stakes activities (starting a course, minor travel) but should be avoided for major life ceremonies if any higher-grade window exists.",
    "examples": [],
    "relatedTerms": ["madhyama_grade", "adhama_grade", "tara_bala", "chandrabala"],
    "tags": ["muhurta", "grading", "samanya", "average"]
  },
  {
    "termKey": "adhama_grade",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Adhama (Below Average Grade)",
    "sanskrit": "अधम",
    "summary": "Score 25-41 — proceed with caution; significant negative factors are present.",
    "description": "Adhama is the second-lowest grade in the Grahvani system, spanning scores 25 to 41. These windows may have scraped past mandatory gate checks but show poor panchang shuddhi, unfavorable tara/chandrabala, or problematic lagna placement. Multiple negative indicators are active simultaneously. Traditional texts would classify these as 'bearable but undesirable' timing.",
    "howToRead": "Adhama windows appear with an orange warning badge. The detail panel prominently lists all negative factors. Present these to clients only as a last resort, always with full disclosure of the risks and strong remedial recommendations.",
    "significance": "Adhama muhurats signal that the astrologer should push back on the client's preferred timing if possible. Starting a significant venture in an Adhama window invites unnecessary obstacles. The astrologer's duty is to clearly communicate the risks.",
    "examples": [],
    "relatedTerms": ["samanya_grade", "tyajya_grade", "mahadosha_gate", "panchang_shuddhi"],
    "tags": ["muhurta", "grading", "adhama", "below-average", "caution"]
  },
  {
    "termKey": "tyajya_grade",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Tyajya (Avoidable Grade)",
    "sanskrit": "त्याज्य",
    "summary": "Score 0-24 — not recommended; major doshas or inauspicious combinations are active.",
    "description": "Tyajya is the lowest grade in the Grahvani system, covering scores 0 to 24. These windows have failed one or more gate checks, or have accumulated so many deductions that the timing is actively inauspicious. Major doshas (panchaka, dagdha yoga), forbidden periods (varjyam, durmuhurta), or critically weak panchang elements may be present. Traditional texts explicitly forbid ceremonies during such times.",
    "howToRead": "Tyajya windows appear with a red badge and a crossed-out icon. They are included in results for completeness and education but should never be recommended. If a client insists on a Tyajya window, the Grahvani UI displays a formal warning dialog.",
    "significance": "Tyajya muhurats exist in the system to demonstrate the engine's analytical rigor — showing the astrologer exactly why certain times fail. This transparency builds trust in the grading algorithm and helps astrologers educate clients about the importance of muhurat selection.",
    "examples": [],
    "relatedTerms": ["adhama_grade", "mahadosha_gate", "varjyam", "durmuhurta", "dagdha_yoga"],
    "tags": ["muhurta", "grading", "tyajya", "avoidable", "inauspicious"]
  },
  {
    "termKey": "choghadiya",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Choghadiya (North Indian Time Segments)",
    "sanskrit": "चौघड़िया",
    "summary": "North Indian system dividing daytime and nighttime into 8 planetary segments each, used for quick muhurat assessment.",
    "description": "Choghadiya (literally 'four ghatikas') is a popular North Indian time-division system that splits each day and night into 8 segments, each ruled by a planet. The seven types cycle in a fixed order: Udveg (Sun — anxiety, avoid), Char (Venus — neutral, travel okay), Labh (Mercury — profitable, good for business), Amrit (Moon — best, auspicious for all), Kaal (Saturn — death-related, strictly avoid), Shubh (Jupiter — auspicious, ceremonies), and Rog (Mars — disease, avoid). The starting segment depends on the weekday.",
    "howToRead": "The Grahvani day view shows Choghadiya strips color-coded by quality: green for Amrit/Shubh/Labh (favorable), yellow for Char (neutral), and red for Kaal/Rog/Udveg (avoid). Use this as a quick-glance layer for North Indian clients who are familiar with the system.",
    "significance": "Choghadiya is the most widely used quick-muhurat system in North India, especially in Gujarat, Rajasthan, and UP. While less precise than full muhurat analysis, it provides an accessible entry point for clients and is useful for daily activities where a full muhurat calculation is impractical.",
    "examples": [],
    "relatedTerms": ["gowri_panchangam", "amrit_kaal", "pradosh_kaal"],
    "tags": ["muhurta", "choghadiya", "north-indian", "time-segments", "planetary-hours"]
  },
  {
    "termKey": "gowri_panchangam",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Gowri Panchangam (South Indian Time Segments)",
    "sanskrit": "गौरी पञ्चाङ्गम्",
    "summary": "South Indian system of 8 time segments per day: Amirtham (best), Udayam/Labhham/Sugam (good), and Aravam/Visham/Rogam/Dosham (avoid).",
    "description": "Gowri Panchangam (also Gowri Nalla Neram) is the South Indian counterpart to Choghadiya, dividing day and night into 8 segments each. The eight periods are: Udayam (rising, good), Amirtham (nectar, best — auspicious for all activities), Visham (poison, avoid), Sugam (comfortable, good), Rogam (disease, avoid), Labhham (profit, good for business), Dosham (fault, avoid), and Aravam (neutral to negative). This system is deeply embedded in Tamil, Telugu, Kannada, and Kerala astrological traditions.",
    "howToRead": "In the Grahvani day view, Gowri Panchangam segments appear alongside Choghadiya for South Indian clients. Amirtham periods are highlighted in gold. The system is toggled via regional preference settings. Use this for clients from Tamil Nadu, Kerala, Andhra Pradesh, or Karnataka.",
    "significance": "Gowri Panchangam is the default quick-muhurat reference for over 250 million people in South India. Professional astrologers serving South Indian clientele must be fluent in this system. The Amirtham window is considered equivalent to Amrit in Choghadiya but is calculated differently.",
    "examples": [],
    "relatedTerms": ["choghadiya", "amrit_kaal", "panchang_shuddhi"],
    "tags": ["muhurta", "gowri-panchangam", "south-indian", "time-segments", "tamil"]
  },
  {
    "termKey": "panchang_shuddhi",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Panchang Shuddhi (Calendar Purity)",
    "sanskrit": "पञ्चाङ्ग शुद्धि",
    "summary": "Layer 2 of the muhurat pipeline — scores 0-25 based on the combined quality of Tithi, Nakshatra, Vara, Yoga, and Karana.",
    "description": "Panchang Shuddhi evaluates the five limbs (pancha + anga) of the Hindu calendar at a given moment: Tithi (lunar day), Nakshatra (lunar mansion), Vara (weekday), Yoga (Sun-Moon combination), and Karana (half-tithi). Each limb is scored independently for the specific event type, then combined into a 0-25 point score. For example, a Vivah muhurat requires specific favorable tithis (Dwitiya, Tritiya, Panchami, etc.), while a Griha Pravesh emphasizes different tithis and nakshatras.",
    "howToRead": "The Panchang Shuddhi score appears as a subscore in the muhurat detail panel, broken down by each of the five limbs. A score of 20+ indicates excellent calendar alignment. Below 10 suggests the fundamental timing is weak regardless of other factors.",
    "significance": "Panchang Shuddhi is the foundational layer of muhurat selection — classical texts state that no amount of lagna strength or planetary yoga can compensate for fundamentally impure panchang. It is the non-negotiable baseline that every muhurat must clear.",
    "examples": [],
    "relatedTerms": ["lagna_shuddhi", "mahadosha_gate", "sarvottama_grade"],
    "tags": ["muhurta", "panchang", "shuddhi", "tithi", "nakshatra", "vara", "yoga", "karana"]
  },
  {
    "termKey": "lagna_shuddhi",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Lagna Shuddhi (Ascendant Purity)",
    "sanskrit": "लग्न शुद्धि",
    "summary": "Layer 7 of the muhurat pipeline — scores 0-15 by evaluating which zodiac sign is rising at the muhurat time and its suitability for the event.",
    "description": "Lagna Shuddhi assesses the rising sign (ascendant) at the proposed muhurat time and its fitness for the specific ceremony. Different events favor different lagnas: fixed signs (Taurus, Leo, Scorpio, Aquarius) for Griha Pravesh (stability), dual signs (Gemini, Virgo, Sagittarius, Pisces) for education, and specific signs for marriage based on the couple's charts. The lagna lord's strength, aspects from benefics/malefics, and the condition of the 8th house from lagna are all evaluated.",
    "howToRead": "The Lagna Shuddhi subscore appears in the muhurat detail panel showing the rising sign, its lord's condition, and event-specific fitness. A high score means the rising sign actively supports the ceremony. A low score means the lagna is unsuitable — even if the panchang is perfect.",
    "significance": "Lagna selection is what separates a professional muhurat from a calendar-based one. The panchang is the same for everyone on a given day, but the lagna changes every ~2 hours — this is where the astrologer adds precision, narrowing a good day down to the ideal window.",
    "examples": [],
    "relatedTerms": ["panchang_shuddhi", "sarvottama_grade", "griha_pravesh_muhurta", "vivah_muhurta"],
    "tags": ["muhurta", "lagna", "shuddhi", "ascendant", "rising-sign"]
  },
  {
    "termKey": "mahadosha_gate",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Mahadosha (Major Affliction Gate)",
    "sanskrit": "महादोष",
    "summary": "Layer 4 gate check with 21+ dosha evaluations — if any critical dosha is active, the entire date is rejected.",
    "description": "The Mahadosha gate is a binary pass/fail checkpoint in the muhurat pipeline that screens for 21+ classical afflictions. Critical doshas include Panchaka (five-fold affliction from weekday-nakshatra sums), Latta (planetary kick — specific planet-nakshatra combinations), Graha Yuddha (planetary war — two planets within 1 degree), Ekargala (single-point blockage), and Krura Yoga (cruel planetary combinations). If any single critical dosha is active, the entire time window is rejected regardless of its panchang or lagna quality.",
    "howToRead": "In the muhurat results, rejected windows show the specific mahadosha that triggered the rejection in red text. This is valuable for client education — when a client asks 'why not this date?', the specific dosha name and explanation are ready to present.",
    "significance": "The mahadosha gate embodies the classical principle that a single critical flaw can invalidate an otherwise excellent muhurat. This gate-based architecture prevents the engine from recommending superficially good-looking windows that carry hidden dangers.",
    "examples": [],
    "relatedTerms": ["panchaka_dosha", "dagdha_yoga", "gandanta", "tyajya_grade"],
    "tags": ["muhurta", "mahadosha", "dosha", "gate-check", "rejection"]
  },
  {
    "termKey": "varjyam",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Varjyam (Forbidden Time)",
    "sanskrit": "वर्ज्यम्",
    "summary": "An inauspicious ~90-minute window calculated from the Moon's nakshatra, absolutely forbidden for ceremonies in South Indian traditions.",
    "description": "Varjyam is a calculated inauspicious period that occurs daily, derived from the relationship between the current nakshatra and a specific nakshatra-pada combination. The duration is approximately 90 minutes (one-quarter of a nakshatra's length). During Varjyam, no auspicious ceremony should be initiated — this prohibition is especially strict in South Indian (Tamil, Telugu, Kannada, Kerala) traditions where Varjyam is checked before even basic activities like signing documents or starting journeys.",
    "howToRead": "Varjyam appears as a red blocked-out zone on the Grahvani timeline view, with exact start and end times. Any muhurat candidate that overlaps with Varjyam is automatically penalized or rejected. The calculation is shown in the detail panel for verification.",
    "significance": "Varjyam is one of the most commonly checked inauspicious periods in South Indian panchang. Professional astrologers serving South Indian clients cannot afford to overlook it — even minor ceremonies should avoid Varjyam windows. Its inclusion in the engine demonstrates regional sensitivity.",
    "examples": [],
    "relatedTerms": ["durmuhurta", "panchang_shuddhi", "gowri_panchangam"],
    "tags": ["muhurta", "varjyam", "forbidden", "south-indian", "inauspicious"]
  },
  {
    "termKey": "durmuhurta",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Durmuhurta (Evil Muhurat Period)",
    "sanskrit": "दुर्मुहूर्त",
    "summary": "Fixed inauspicious periods — two per day, each ~48 minutes — that are mandatory-avoid windows in most traditions.",
    "description": "Durmuhurta (literally 'bad muhurat') refers to two fixed inauspicious periods that occur every day, each lasting approximately 48 minutes (two ghatikas). Unlike Varjyam which is nakshatra-dependent, Durmuhurta times are calculated from sunrise and are relatively predictable. The first Durmuhurta typically falls in the morning hours, and the second in the afternoon. Classical texts from both North and South Indian traditions agree on avoiding these periods for any auspicious activity.",
    "howToRead": "Durmuhurta periods appear as hatched red zones on the Grahvani timeline, distinct from Varjyam blocks. The two daily windows are pre-calculated at sunrise. Any muhurat candidate overlapping Durmuhurta receives an automatic deduction or rejection depending on severity settings.",
    "significance": "Durmuhurta is one of the universally agreed-upon inauspicious periods across all Indian astrological traditions — North, South, and KP. Its pan-regional acceptance makes it a safe minimum check that every professional astrologer should apply.",
    "examples": [],
    "relatedTerms": ["varjyam", "pradosh_kaal", "amrit_kaal"],
    "tags": ["muhurta", "durmuhurta", "inauspicious", "fixed-period", "universal"]
  },
  {
    "termKey": "shukra_asta",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Shukra Asta (Venus Combustion)",
    "sanskrit": "शुक्र अस्त",
    "summary": "Period when Venus is combust (too close to the Sun), lasting ~40 days — marriage ceremonies are absolutely forbidden.",
    "description": "Shukra Asta occurs when Venus approaches within a certain degree of the Sun and becomes invisible (combust), a period lasting approximately 40 days. Since Venus (Shukra) is the karaka (significator) of marriage, love, beauty, and conjugal happiness, its combustion is considered devastating for marriage ceremonies. This prohibition is one of the strictest in Vedic muhurat shastra — virtually no classical authority permits Vivah during Shukra Asta. Other ceremonies (business launch, griha pravesh) are also discouraged but not absolutely forbidden.",
    "howToRead": "Shukra Asta periods are displayed as a banner warning across the affected date range in the Grahvani calendar view. When a client searches for Vivah muhurats during Shukra Asta, the engine returns zero results with an explanatory message about the Venus combustion.",
    "significance": "Shukra Asta is perhaps the single most important macro-level prohibition in marriage muhurat selection. An astrologer who recommends a wedding during Shukra Asta loses professional credibility instantly. The engine's blanket rejection during this period protects both astrologer and client.",
    "examples": [],
    "relatedTerms": ["vivah_muhurta", "chaturmas", "mahadosha_gate"],
    "tags": ["muhurta", "shukra-asta", "venus", "combustion", "marriage", "forbidden"]
  },
  {
    "termKey": "chaturmas",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Chaturmas (Four Sacred Months)",
    "sanskrit": "चातुर्मास",
    "summary": "July to October — when Vishnu sleeps; major ceremonies (especially marriage) are traditionally postponed.",
    "description": "Chaturmas (literally 'four months') is the period from Devshayani Ekadashi (Ashadha Shukla Ekadashi, typically July) to Prabodhini Ekadashi (Kartik Shukla Ekadashi, typically October/November). According to Vaishnava tradition, Lord Vishnu enters yogic sleep during this period, making it inauspicious for major ceremonies — especially Vivah. The prohibition is strictest in Maharashtra, Gujarat, and parts of North India. Some traditions permit non-marriage ceremonies during Chaturmas, while others avoid all major events.",
    "howToRead": "Chaturmas appears as a seasonal overlay on the Grahvani calendar, shaded to indicate the restricted period. The engine's behavior during Chaturmas is configurable by regional tradition — strict mode blocks all Vivah results, while moderate mode applies a score penalty.",
    "significance": "Chaturmas observance varies by region and family tradition. A professional astrologer must ask the client about their tradition before applying or waiving this restriction. The Grahvani engine supports both strict and lenient modes to accommodate this diversity.",
    "examples": [],
    "relatedTerms": ["shukra_asta", "vivah_muhurta", "panchang_shuddhi"],
    "tags": ["muhurta", "chaturmas", "vishnu", "seasonal", "marriage", "restriction"]
  },
  {
    "termKey": "ashtakoot_system",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Ashtakoot Gun Milan (36-Point Matching)",
    "sanskrit": "अष्टकूट गुण मिलान",
    "summary": "North Indian marriage compatibility system scoring 8 factors (koots) out of 36 total points — above 18 is acceptable.",
    "description": "Ashtakoot Gun Milan is the predominant marriage compatibility system in North Indian astrology, evaluating 8 factors between the prospective bride and groom's Moon nakshatras. The eight koots and their maximum points: Varna (1 — spiritual compatibility), Vashya (2 — mutual attraction/dominance), Tara (3 — birth star compatibility), Yoni (4 — sexual/physical compatibility), Graha Maitri (5 — mental compatibility via Moon-sign lords), Gana (6 — temperament — Deva/Manushya/Rakshasa), Bhakoot (7 — emotional compatibility via Moon-sign relationship), Nadi (8 — health/genetic compatibility, most critical). Total 36 points; 18+ is the minimum acceptable threshold for most traditions.",
    "howToRead": "The Grahvani compatibility module displays all 8 koots in a scorecard layout with individual scores and the aggregate. Nadi dosha (0 out of 8) is flagged prominently as it indicates potential health/progeny issues. Bhakoot dosha (0 out of 7) is similarly highlighted.",
    "significance": "Ashtakoot is the first compatibility check most North Indian families expect. While experienced astrologers know that chart-level analysis (dasha compatibility, 7th house analysis) is more reliable, the 36-point system remains the culturally expected standard. An astrologer must be fluent in it to serve North Indian clients.",
    "examples": [],
    "relatedTerms": ["dasha_porutham", "vivah_muhurta", "rajju_porutham"],
    "tags": ["muhurta", "ashtakoot", "gun-milan", "compatibility", "marriage", "north-indian"]
  },
  {
    "termKey": "dasha_porutham",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Dasha Porutham (10-Factor Matching)",
    "sanskrit": "दश पोरुत्तम्",
    "summary": "South Indian marriage compatibility system from Kalaprakashika with 10 factors — Rajju and Vedhai are mandatory passes.",
    "description": "Dasha Porutham is the South Indian marriage compatibility system, derived from the classical text Kalaprakashika, evaluating 10 factors between the couple's birth nakshatras. The ten factors: Dina (longevity/health), Gana (temperament), Mahendram (prosperity/progeny), Stree Deergham (woman's welfare), Yoni (sexual compatibility), Rashi (emotional affinity), Rasiyathipathi (planetary friendship), Rajju (husband's longevity — MANDATORY), Vedhai (enmity check — MANDATORY), and Vasya (mutual attraction). Unlike Ashtakoot's numerical scoring, Dasha Porutham uses a pass/fail approach for each factor, with Rajju and Vedhai as absolute gates.",
    "howToRead": "The Grahvani compatibility module shows all 10 poruthams as pass/fail indicators with Rajju and Vedhai at the top, prominently marked. If either fails, the overall result shows 'Marriage Not Recommended per Kalaprakashika' regardless of other factors.",
    "significance": "Dasha Porutham is the expected standard for Tamil, Telugu, Kannada, and Kerala families. The mandatory Rajju and Vedhai checks are culturally sacrosanct — families will reject a match solely on Rajju dosha. An astrologer serving South Indian clients must present Dasha Porutham alongside or instead of Ashtakoot.",
    "examples": [],
    "relatedTerms": ["ashtakoot_system", "rajju_porutham", "vedhai_porutham", "vivah_muhurta"],
    "tags": ["muhurta", "dasha-porutham", "compatibility", "marriage", "south-indian", "kalaprakashika"]
  },
  {
    "termKey": "rajju_porutham",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Rajju Porutham (Longevity of Husband)",
    "sanskrit": "ரஜ்ஜு பொருத்தம்",
    "summary": "The most critical mandatory porutham in South Indian matching — tests the husband's longevity; failure blocks the marriage.",
    "description": "Rajju Porutham evaluates whether the couple's birth nakshatras fall in compatible Rajju (rope/chain) positions. The 27 nakshatras are mapped to five body parts of a cosmic figure: Siro (head), Kanta (neck), Udara (stomach), Ooru (thigh), and Paada (feet). If both partners' nakshatras fall in the same Rajju, the marriage is considered dangerous to the husband's longevity. This is the single most important porutham in the Dasha Porutham system — its failure overrides all other compatibility results.",
    "howToRead": "Rajju Porutham appears at the top of the South Indian compatibility report with a large pass/fail indicator. On failure, Grahvani displays a prominent red block with the explanation that this porutham is mandatory per Kalaprakashika. Some traditions accept parihara (remedial rituals) for Rajju dosha — the engine notes this as a configurable option.",
    "significance": "Rajju is the cultural dealbreaker in South Indian marriage matching. Families and temple priests will refuse to proceed with a marriage that fails Rajju porutham. Even modern, progressive families often insist on clearing Rajju as a minimum requirement.",
    "examples": [],
    "relatedTerms": ["vedhai_porutham", "dasha_porutham", "vivah_muhurta"],
    "tags": ["muhurta", "rajju", "porutham", "mandatory", "marriage", "south-indian", "longevity"]
  },
  {
    "termKey": "vedhai_porutham",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Vedhai Porutham (Enmity Check)",
    "sanskrit": "வேதை பொருத்தம்",
    "summary": "Mandatory porutham checking for nakshatra enmity between the couple — failure blocks the marriage per Kalaprakashika.",
    "description": "Vedhai Porutham checks whether the couple's birth nakshatras form an inimical (vedhai) pair. Certain nakshatras are considered natural enemies — when one partner's birth star is the vedhai of the other's, the marriage is predicted to bring constant conflict and suffering. There are 13 vedhai pairs defined in classical texts (e.g., Ashwini-Jyeshtha, Bharani-Anuradha, etc.). Like Rajju, Vedhai is a mandatory gate — its failure alone is sufficient to reject the match.",
    "howToRead": "Vedhai Porutham appears immediately below Rajju in the compatibility report. The specific vedhai pair (if any) is displayed with the classical reference. Pass shows green; fail shows red with the enmity pair named. Combined Rajju-Vedhai status determines whether the match proceeds to further analysis.",
    "significance": "Vedhai is the second mandatory gate in South Indian matching. While Rajju tests physical danger, Vedhai tests relational harmony. Together, they form the minimum acceptable baseline — a match that clears both Rajju and Vedhai is considered 'safe to proceed' for further evaluation.",
    "examples": [],
    "relatedTerms": ["rajju_porutham", "dasha_porutham", "vivah_muhurta"],
    "tags": ["muhurta", "vedhai", "porutham", "mandatory", "marriage", "south-indian", "enmity"]
  },
  {
    "termKey": "chevvai_dosham",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Chevvai Dosham (Tamil Mars Affliction)",
    "sanskrit": "செவ்வாய் தோஷம்",
    "summary": "Tamil term for Manglik Dosha — Mars in houses 1, 2, 4, 7, 8, or 12 from Lagna; Kerala tradition checks from Moon and Venus too.",
    "description": "Chevvai Dosham (also Kuja Dosha or Manglik Dosha) occurs when Mars occupies the 1st, 2nd, 4th, 7th, 8th, or 12th house from the Lagna in a person's birth chart. In South Indian Tamil tradition, this is called Chevvai Dosham (Chevvai = Mars in Tamil). The Kerala tradition applies a stricter triple-point analysis, checking Mars's position from Lagna, Moon, and Venus — if Mars afflicts any one of these three reference points, the dosha is considered active. Chevvai Dosham is primarily a marriage compatibility concern — both partners should ideally have matching dosha status.",
    "howToRead": "Chevvai Dosham analysis appears in the individual chart section of the compatibility module, not in the porutham grid. Grahvani checks from all three reference points (Lagna, Moon, Venus) and displays which are afflicted. The cancellation rules (Chevvai Dosham Parihara) are also evaluated and shown.",
    "significance": "Chevvai Dosham is one of the most feared afflictions in marriage astrology across India. Professional astrologers must handle it carefully — checking cancellation conditions, evaluating severity, and explaining the nuances to anxious families rather than issuing blanket verdicts.",
    "examples": [],
    "relatedTerms": ["vivah_muhurta", "dasha_porutham", "ashtakoot_system"],
    "tags": ["muhurta", "chevvai", "mars", "manglik", "dosha", "marriage", "south-indian"]
  },
  {
    "termKey": "panchaka_dosha",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Panchaka Dosha (Five-Fold Affliction)",
    "sanskrit": "पञ्चक दोष",
    "summary": "One of 21+ mahadoshas checked in Layer 4 — occurs when weekday and nakshatra numbers combine unfavorably; moderate severity.",
    "description": "Panchaka Dosha arises when the combined numerical values of the weekday (Vara) and the birth/muhurat nakshatra produce certain inauspicious sums. The five types of Panchaka are: Mrityu Panchaka (death-related, most severe), Agni Panchaka (fire-related risks), Raja Panchaka (governmental/authority troubles), Chora Panchaka (theft/loss), and Roga Panchaka (disease). The severity varies by type — Mrityu Panchaka is a hard rejection, while others may only impose score penalties depending on the ceremony type.",
    "howToRead": "Panchaka Dosha appears in the mahadosha section of the muhurat detail panel. The specific Panchaka type is identified along with its severity level. Mrityu Panchaka triggers a gate rejection (red); others show as warnings (orange) with associated point deductions.",
    "significance": "Panchaka is one of the most commonly encountered doshas in muhurat selection — it activates frequently enough that ignoring it would produce noticeably flawed recommendations. Its inclusion in the 21+ dosha battery demonstrates comprehensive classical coverage.",
    "examples": [],
    "relatedTerms": ["mahadosha_gate", "dagdha_yoga", "gandanta"],
    "tags": ["muhurta", "panchaka", "dosha", "five-fold", "affliction"]
  },
  {
    "termKey": "dagdha_yoga",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Dagdha Yoga (Burnt Combination)",
    "sanskrit": "दग्ध योग",
    "summary": "Specific tithi-weekday combinations considered highly inauspicious — a Layer 3 gate check that automatically rejects the muhurat.",
    "description": "Dagdha Yoga (literally 'burnt combination') occurs when certain tithis fall on specific weekdays, creating a 'burnt' or 'scorched' energy that is considered destructive for new beginnings. For example, Dwitiya on Saturday, Tritiya on Tuesday, and several other fixed combinations are classified as Dagdha. This is a Layer 3 gate check in the muhurat pipeline — its presence automatically rejects the time window regardless of other favorable factors. The rationale is rooted in the Hora Shastra texts which catalog these combinations as intrinsically flawed.",
    "howToRead": "Dagdha Yoga appears as a gate rejection reason when a date fails Layer 3. The specific tithi-weekday combination is displayed. Since Dagdha is a full-day condition (not time-specific), the entire day is marked as rejected for the affected event types.",
    "significance": "Dagdha Yoga is a well-known classical prohibition that most traditional astrologers check manually. Its inclusion as an automated gate check saves time and prevents oversights. Clients familiar with Dagdha Yoga will appreciate seeing it explicitly addressed in the analysis.",
    "examples": [],
    "relatedTerms": ["mahadosha_gate", "amrit_siddhi_yoga", "panchang_shuddhi"],
    "tags": ["muhurta", "dagdha", "yoga", "burnt", "gate-check", "tithi-weekday"]
  },
  {
    "termKey": "amrit_siddhi_yoga",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Amrit Siddhi Yoga (Nectar of Success)",
    "sanskrit": "अमृत सिद्धि योग",
    "summary": "Specific tithi-weekday combinations that are supremely auspicious — a Layer 3 bonus adding extra points to the muhurat score.",
    "description": "Amrit Siddhi Yoga occurs when certain tithis align with specific weekdays to create a powerfully auspicious combination. For example, Monday with Dwitiya, Wednesday with Saptami, Thursday with Chaturdashi, and Friday with Ashtami are among the classical Amrit Siddhi combinations. Unlike Dagdha Yoga (which rejects), Amrit Siddhi adds substantial bonus points to the muhurat score in Layer 3. A day with Amrit Siddhi Yoga active is considered inherently blessed — even mediocre panchang factors are somewhat compensated.",
    "howToRead": "Amrit Siddhi Yoga appears as a green bonus badge on qualifying dates in the Grahvani calendar view. The bonus points are reflected in the overall muhurat score. When presenting muhurats to clients, an Amrit Siddhi day carries extra weight and client confidence.",
    "significance": "Amrit Siddhi Yoga is widely recognized across Indian traditions as one of the most auspicious spontaneous combinations. Highlighting it in the muhurat results adds value to the astrologer's recommendation — clients and family elders who recognize the term will feel reassured.",
    "examples": [],
    "relatedTerms": ["dagdha_yoga", "panchang_shuddhi", "sarvottama_grade"],
    "tags": ["muhurta", "amrit-siddhi", "yoga", "auspicious", "bonus", "tithi-weekday"]
  },
  {
    "termKey": "gandanta",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Gandanta (Karmic Knot)",
    "sanskrit": "गण्डान्त",
    "summary": "Transition zone between water and fire signs — Moon in gandanta is a Layer 1 disqualifier that rejects the entire day.",
    "description": "Gandanta (literally 'knot at the end') refers to the junctional zone at the boundary between water signs and fire signs: Cancer to Leo, Scorpio to Sagittarius, and Pisces to Aries. When the Moon transits through these narrow zones (approximately the last 3°20' of a water sign and the first 3°20' of the following fire sign), the energy is considered karmically turbulent and unstable. Gandanta is a Layer 1 (pre-filter) disqualifier in the muhurat pipeline — the entire day is rejected for auspicious activities when the Moon occupies a gandanta zone.",
    "howToRead": "Gandanta days appear as blacked-out dates on the Grahvani calendar with a 'Gandanta — Moon at sign junction' label. The exact gandanta window (start/end time) is shown. No muhurat candidates are generated for these periods. The three gandanta zones are color-coded to indicate which junction is active.",
    "significance": "Gandanta is one of the most universally respected prohibitions in Vedic astrology. Even astrologers who are lenient on other doshas will refuse to recommend ceremonies during gandanta. Birth during gandanta is also considered significant — requiring specific remedial rituals (gandanta shanti).",
    "examples": [],
    "relatedTerms": ["mahadosha_gate", "panchang_shuddhi", "tyajya_grade"],
    "tags": ["muhurta", "gandanta", "karmic-knot", "junction", "disqualifier", "moon"]
  },
  {
    "termKey": "vivah_muhurta",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Vivah Muhurta (Marriage Ceremony)",
    "sanskrit": "विवाह मुहूर्त",
    "summary": "The most complex muhurat event — requires two-person compatibility, strictest panchang rules, Shukla Paksha preferred, Shukra Asta forbidden.",
    "description": "Vivah (marriage) muhurat is the most elaborate and stringent muhurat calculation in Vedic astrology. It requires: (1) Shukla Paksha strongly preferred (waxing moon), (2) Specific auspicious tithis — Dwitiya, Tritiya, Panchami, Saptami, Dashami, Ekadashi, Dwadashi, Trayodashi, (3) Best nakshatras — Rohini, Mrigashira, Magha, Uttara Phalguni, Hasta, Swati, Anuradha, Uttara Ashadha, Uttara Bhadrapada, Revati, (4) Absolute prohibition during Shukra Asta and Chaturmas (tradition-dependent), (5) Two-person compatibility (Ashtakoot or Dasha Porutham), (6) The strongest lagna and panchang shuddhi requirements of any event type.",
    "howToRead": "Vivah muhurat results in Grahvani show both the individual muhurat scores AND the compatibility analysis side by side. The engine applies the strictest possible filter set — expect fewer results compared to other event types. Each result shows which nakshatras, tithis, and lagnas qualified.",
    "significance": "Marriage is the single most consulted muhurat event in professional astrology. Families invest enormous emotional and financial resources based on the astrologer's recommendation. Getting Vivah muhurat right is career-defining for a professional astrologer — Grahvani's comprehensive pipeline is built to support this critical use case.",
    "examples": [],
    "relatedTerms": ["shukra_asta", "chaturmas", "ashtakoot_system", "dasha_porutham", "lagna_shuddhi"],
    "tags": ["muhurta", "vivah", "marriage", "ceremony", "strictest", "compatibility"]
  },
  {
    "termKey": "griha_pravesh_muhurta",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Griha Pravesh Muhurta (Housewarming)",
    "sanskrit": "गृह प्रवेश मुहूर्त",
    "summary": "Ceremony for entering a new home — avoids Tuesdays and Saturdays, prefers fixed nakshatras, Leo and Taurus lagnas considered ideal.",
    "description": "Griha Pravesh (house-entering ceremony) muhurat selects the ideal time for a family to first enter and ritually occupy a new home. Key requirements: (1) Avoid Tuesdays (Mars — fire risk symbolism) and Saturdays (Saturn — delays, obstacles), (2) Prefer fixed (Dhruva/Sthira) nakshatras — Rohini, Uttara Phalguni, Uttara Ashadha, Uttara Bhadrapada — symbolizing permanence, (3) Leo Lagna (Simha — royal entry, strength) and Taurus Lagna (Vrishabha — material stability) are considered ideal, (4) Jupiter's aspect on the Lagna or 4th house is a strong positive factor, (5) Avoid Bhadrapada month and Shunya months for the specific Lagna.",
    "howToRead": "Griha Pravesh results in Grahvani emphasize the lagna sign and the nakshatra stability classification. Results are ranked by fixed-nakshatra presence and lagna fitness. The detail panel shows the 4th house condition (representing the home) at the muhurat time.",
    "significance": "Griha Pravesh is the second most commonly requested muhurat after Vivah. The ceremony marks the beginning of a family's life in a new space — the belief is that the energy of the entry moment pervades the home for years. Getting this muhurat right has direct impact on client satisfaction and referrals.",
    "examples": [],
    "relatedTerms": ["vivah_muhurta", "lagna_shuddhi", "panchang_shuddhi"],
    "tags": ["muhurta", "griha-pravesh", "housewarming", "ceremony", "fixed-nakshatra", "lagna"]
  },
  {
    "termKey": "pradosh_kaal",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Pradosh Kaal (Twilight Period)",
    "sanskrit": "प्रदोष काल",
    "summary": "The period just after sunset, considered auspicious for spiritual practices and one of the favorable windows reported by the engine.",
    "description": "Pradosh Kaal is the twilight period spanning approximately 1.5 hours after sunset (specifically, the period when the Sun is between 0° and 12° below the horizon). In Vedic tradition, this liminal time between day and night carries special spiritual potency. While not suitable for material ceremonies (which prefer daylight hours), Pradosh Kaal is highly auspicious for spiritual practices — mantra japa, meditation, Shiva worship (especially on Trayodashi — Pradosh Vrat), and invoking divine blessings for upcoming ceremonies.",
    "howToRead": "Pradosh Kaal appears as an amber-highlighted zone on the Grahvani evening timeline. It is categorized as a 'spiritual window' rather than a ceremony window. The engine may suggest performing pre-ceremony prayers or sankalpas during Pradosh Kaal even if the main ceremony is scheduled for the next day.",
    "significance": "Including Pradosh Kaal in the muhurat engine adds a spiritual dimension beyond mere auspiciousness calculation. Professional astrologers who recommend preparatory rituals during Pradosh Kaal demonstrate depth of knowledge and provide holistic guidance to clients.",
    "examples": [],
    "relatedTerms": ["amrit_kaal", "durmuhurta", "choghadiya"],
    "tags": ["muhurta", "pradosh", "twilight", "spiritual", "evening", "auspicious-window"]
  },
  {
    "termKey": "amrit_kaal",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Amrit Kaal (Nectar Period)",
    "sanskrit": "अमृत काल",
    "summary": "A nakshatra-specific golden window within each day — the most auspicious minutes based on the running nakshatra's amrit period.",
    "description": "Amrit Kaal is a calculated auspicious window that occurs daily, derived from the current nakshatra and its relationship to the weekday. It represents the 'golden minutes' of the day — the period when celestial energies are most favorable for initiating auspicious activities. Unlike the broader Amrit Choghadiya segment, Amrit Kaal is a precise, shorter window (typically 45-90 minutes) calculated using nakshatra-pada mathematics. It is the positive counterpart to Varjyam (the forbidden window).",
    "howToRead": "Amrit Kaal appears as a gold-highlighted zone on the Grahvani timeline, distinct from the broader Choghadiya segments. When a muhurat candidate falls within Amrit Kaal, it receives bonus points. The engine may specifically recommend starting the key ritual (e.g., kanyadaan in Vivah, agni pratishtapana in Griha Pravesh) during the Amrit Kaal window.",
    "significance": "Amrit Kaal represents the pinnacle of time-selection precision in Vedic muhurat practice. Recommending that the critical moment of a ceremony coincides with Amrit Kaal elevates the astrologer's guidance from 'good day selection' to 'exact moment optimization.'",
    "examples": [],
    "relatedTerms": ["varjyam", "choghadiya", "gowri_panchangam", "pradosh_kaal"],
    "tags": ["muhurta", "amrit-kaal", "golden-window", "nakshatra", "auspicious"]
  },
  {
    "termKey": "tara_bala",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Tara Bala (Star Strength)",
    "sanskrit": "तारा बल",
    "summary": "Layer 5 personalization check — evaluates the relationship between the person's birth nakshatra and the muhurat nakshatra.",
    "description": "Tara Bala (star strength) is calculated by counting from the person's Janma Nakshatra (birth star) to the muhurat nakshatra and dividing by 9, producing one of 9 Tara categories: Janma (birth — neutral), Sampat (wealth — good), Vipat (danger — bad), Kshema (well-being — good), Pratyari (obstacles — bad), Sadhaka (achievement — good), Vadha (death — very bad), Mitra (friend — good), Parama Mitra (best friend — very good). Favorable taras (Sampat, Kshema, Sadhaka, Mitra, Parama Mitra) add bonus points; unfavorable taras (Vipat, Pratyari, Vadha) impose penalties.",
    "howToRead": "Tara Bala appears in the personalization section of the muhurat detail panel — it requires the person's birth nakshatra to calculate. The specific tara category and its quality (favorable/unfavorable) are displayed. For two-person events like Vivah, both partners' tara balas are shown.",
    "significance": "Tara Bala is what makes a muhurat personal rather than generic. The same muhurat window can be excellent for one person (Parama Mitra tara) and problematic for another (Vadha tara). This personalization is a key differentiator of professional muhurat services.",
    "examples": [],
    "relatedTerms": ["chandrabala", "panchang_shuddhi", "lagna_shuddhi"],
    "tags": ["muhurta", "tara-bala", "nakshatra", "personalization", "birth-star"]
  },
  {
    "termKey": "chandrabala",
    "domain": "muhurta",
    "category": "muhurta",
    "title": "Chandrabala (Moon Strength)",
    "sanskrit": "चन्द्रबल",
    "summary": "Layer 5 personalization check — the Moon's house position from the person's birth rashi at muhurat time; favorable houses add points.",
    "description": "Chandrabala evaluates the Moon's transit position relative to the person's birth Moon sign (Janma Rashi) at the proposed muhurat time. The Moon's house from Janma Rashi determines the quality: Houses 1, 3, 6, 7, 10, 11 are favorable (Chandrabala present), while houses 2, 4, 5, 8, 9, 12 are unfavorable (Chandrabala absent). Favorable Chandrabala indicates emotional and mental support for the activity being initiated. Like Tara Bala, this is a personal factor that varies by individual.",
    "howToRead": "Chandrabala appears alongside Tara Bala in the personalization section. The Moon's current transit sign and its house number from the person's birth rashi are displayed. Green for favorable houses, red for unfavorable. For Vivah muhurats, both partners' Chandrabala results are shown.",
    "significance": "Chandrabala is the emotional counterpart to Tara Bala's nakshatra-level assessment. Together, they form the complete personal compatibility layer. A muhurat with both favorable Tara Bala and Chandrabala is considered personally auspicious — the person starts the activity with cosmic emotional support.",
    "examples": [],
    "relatedTerms": ["tara_bala", "panchang_shuddhi", "lagna_shuddhi"],
    "tags": ["muhurta", "chandrabala", "moon", "personalization", "transit", "rashi"]
  }
];

/** Lookup map: termKey → KnowledgeEntry (static, no API needed) */
export const KNOWLEDGE_MAP = new Map<string, StaticEntry>(
  ENTRIES.map(e => [e.termKey, e])
);

/** Get a single entry by termKey */
export function getStaticKnowledgeEntry(termKey: string): StaticEntry | undefined {
  return KNOWLEDGE_MAP.get(termKey);
}

/** Get multiple entries by termKeys */
export function getStaticKnowledgeBatch(keys: string[]): Record<string, StaticEntry> {
  const result: Record<string, StaticEntry> = {};
  for (const key of keys) {
    const entry = KNOWLEDGE_MAP.get(key);
    if (entry) result[key] = entry;
  }
  return result;
}
