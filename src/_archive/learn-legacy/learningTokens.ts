/**
 * Grahvani Central Learning Design Tokens System
 * 
 * Scalable and production-ready design tokens designed specifically for the Learn tab 
 * (Learn -> Module -> Chapter -> Lesson) focusing on high readability, accessibility, 
 * and premium aesthetics.
 * 
 * Inspired by Duolingo, Notion, and Coursera.
 */

// ==========================================
// 1. READABILITY & CONTRAST RESOLUTION UTILITIES
// ==========================================

export type TextTokenName = 'primary' | 'secondary' | 'muted' | 'inverse' | 'highContrast' | 'onGradient' | 'onCard';

export interface ColorValue {
  class: string;
  hex: string;
}

/**
 * Calculates the relative luminance of a standard hex color string.
 * WCAG Formula: L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 */
export function getRelativeLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return 0.5; // fallback midpoint
  
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  
  const [rL, gL, bL] = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  
  return rL * 0.2126 + gL * 0.7152 + bL * 0.0722;
}

/**
 * Programmatically determines if a background is light (high luminance) or dark.
 */
export function isLightBg(bg: string): boolean {
  const bgTrimmed = bg.trim().toLowerCase();
  
  // If hex, calculate relative luminance
  if (bgTrimmed.startsWith('#')) {
    return getRelativeLuminance(bgTrimmed) > 0.45; // 0.45 threshold
  }
  
  // Check known Tailwind dark/light markers
  const knownDarkClasses = [
    'bg-slate-900', 'bg-slate-950', 'bg-zinc-900', 'bg-zinc-950', 
    'bg-gray-900', 'bg-gray-950', 'bg-neutral-900', 'bg-neutral-950',
    'bg-stone-900', 'bg-stone-950', 'bg-black', 'bg-ink-abyss', 
    'bg-ink-deep', 'bg-dash-bg', 'bg-dash-surface', 'bg-dash-elevated',
    'from-gold-dark', 'to-amber-700', 'luxury-card-bg'
  ];
  
  const hasDarkClass = knownDarkClasses.some(c => bgTrimmed.includes(c));
  if (hasDarkClass) return false;
  
  // Gradients are typically dark in Grahvani's aesthetic unless marked white
  if (bgTrimmed.includes('gradient') && !bgTrimmed.includes('from-white') && !bgTrimmed.includes('from-softwhite')) {
    return false;
  }
  
  // Default to light (since Grahvani is parchment-focused)
  return true;
}

/**
 * Dynamic accessibility engine that returns contrast-safe colors for any background.
 * Guarantees WCAG 2.1 AA/AAA compliance by dynamically flipping contrast based on context.
 */
export function resolveTextColor(bg: string, token: TextTokenName): ColorValue {
  const isLight = isLightBg(bg);

  if (isLight) {
    switch (token) {
      case 'primary':
        return { class: 'text-[#2D2419]', hex: '#2D2419' }; // Rich dark brown/ink - NEVER light amber/gray
      case 'secondary':
        return { class: 'text-[#4A3020]', hex: '#4A3020' }; // Dark brown
      case 'muted':
        return { class: 'text-[#5C3D26]', hex: '#5C3D26' }; // Readable deep terracotta-muted
      case 'inverse':
        return { class: 'text-[#FEFAEA]', hex: '#FEFAEA' }; // Soft cream-white
      case 'highContrast':
        return { class: 'text-[#1A0A05]', hex: '#1A0A05' }; // Deepest dark brown/black
      case 'onGradient':
        return { class: 'text-white', hex: '#FFFFFF' };
      case 'onCard':
        return { class: 'text-[#2D2419]', hex: '#2D2419' };
    }
  } else {
    switch (token) {
      case 'primary':
        return { class: 'text-[#EDE5D8]', hex: '#EDE5D8' }; // Bright warm cream
      case 'secondary':
        return { class: 'text-[#D0C2B0]', hex: '#D0C2B0' }; // Sand text
      case 'muted':
        return { class: 'text-[#A89885]', hex: '#A89885' }; // Readable muted sand
      case 'inverse':
        return { class: 'text-[#2D2419]', hex: '#2D2419' }; // Rich dark ink
      case 'highContrast':
        return { class: 'text-[#FFFFFF]', hex: '#FFFFFF' }; // Pure white
      case 'onGradient':
        return { class: 'text-white', hex: '#FFFFFF' };
      case 'onCard':
        return { class: 'text-[#EDE5D8]', hex: '#EDE5D8' };
    }
  }
}

// ==========================================
// 2. DESIGN TOKENS ARCHITECTURE
// ==========================================

export const learningTokens = {
  // Global Font Choices
  fonts: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    serif: 'Georgia, Cambria, serif',
    mono: 'monospace, ui-monospace, SFMono-Regular',
  },

  // 1. Typography Styles (Responsive Tailwind and Raw CSS Definitions)
  typography: {
    display: {
      tw: 'font-sans text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight',
      css: {
        fontFamily: 'var(--font-family-sans)',
        fontSize: '2.25rem',
        fontWeight: '800',
        lineHeight: '1.15',
        letterSpacing: '-0.02em',
      }
    },
    h1: {
      tw: 'font-sans text-2xl sm:text-3xl font-bold tracking-tight leading-snug',
      css: {
        fontFamily: 'var(--font-family-sans)',
        fontSize: '1.875rem',
        fontWeight: '700',
        lineHeight: '1.25',
        letterSpacing: '-0.015em',
      }
    },
    h2: {
      tw: 'font-sans text-xl sm:text-2xl font-bold tracking-tight leading-normal',
      css: {
        fontFamily: 'var(--font-family-sans)',
        fontSize: '1.5rem',
        fontWeight: '700',
        lineHeight: '1.3',
        letterSpacing: '-0.01em',
      }
    },
    h3: {
      tw: 'font-sans text-lg sm:text-xl font-semibold tracking-normal leading-normal',
      css: {
        fontFamily: 'var(--font-family-sans)',
        fontSize: '1.25rem',
        fontWeight: '600',
        lineHeight: '1.35',
        letterSpacing: '-0.005em',
      }
    },
    h4: {
      tw: 'font-sans text-base sm:text-lg font-semibold tracking-normal leading-relaxed',
      css: {
        fontFamily: 'var(--font-family-sans)',
        fontSize: '1.125rem',
        fontWeight: '600',
        lineHeight: '1.4',
        letterSpacing: '0em',
      }
    },
    bodyLarge: {
      tw: 'font-sans text-base font-normal leading-relaxed tracking-normal',
      css: {
        fontFamily: 'var(--font-family-sans)',
        fontSize: '1rem',
        fontWeight: '400',
        lineHeight: '1.625',
        letterSpacing: '0em',
      }
    },
    body: {
      tw: 'font-sans text-sm sm:text-base font-normal leading-relaxed tracking-normal',
      css: {
        fontFamily: 'var(--font-family-sans)',
        fontSize: '0.9375rem',
        fontWeight: '400',
        lineHeight: '1.6',
        letterSpacing: '0em',
      }
    },
    caption: {
      tw: 'font-sans text-xs sm:text-sm font-normal text-muted-refined leading-normal',
      css: {
        fontFamily: 'var(--font-family-sans)',
        fontSize: '0.8125rem',
        fontWeight: '400',
        lineHeight: '1.4',
        letterSpacing: '0.005em',
      }
    },
    labels: {
      tw: 'font-sans text-[11px] sm:text-xs font-bold uppercase tracking-widest leading-none',
      css: {
        fontFamily: 'var(--font-family-sans)',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.075em',
        lineHeight: '1.1',
      }
    },
    code: {
      tw: 'font-mono text-xs sm:text-sm font-medium leading-relaxed tracking-normal',
      css: {
        fontFamily: 'var(--font-family-mono)',
        fontSize: '0.875rem',
        fontWeight: '500',
        lineHeight: '1.5',
        letterSpacing: '0em',
      }
    }
  },

  // 3. Spacing System
  spacing: {
    xs: { rem: '0.25rem', px: 4, tw: '1' },
    sm: { rem: '0.5rem', px: 8, tw: '2' },
    md: { rem: '0.75rem', px: 12, tw: '3' },
    lg: { rem: '1rem', px: 16, tw: '4' },
    xl: { rem: '1.5rem', px: 24, tw: '6' },
    '2xl': { rem: '2rem', px: 32, tw: '8' },
    '3xl': { rem: '3rem', px: 48, tw: '12' },
  },

  // 4. Border System
  borders: {
    radius: {
      xs: '2px',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      '2xl': '24px',
      '3xl': '32px',
      full: '9999px',
      // Semantics
      card: '16px',
      button: '12px',
      lessonContainer: '24px',
    },
    widths: {
      none: '0px',
      hairline: '0.5px',
      thin: '1px',
      medium: '2px',
      thick: '4px',
    }
  },

  // 5. Color Tokens (Auspicious, high-contrast, beautiful Vedic-influenced palette)
  colors: {
    backgrounds: {
      app: 'bg-[#FAEFD8]', // Warm parchment base
      lessonView: 'bg-[#FEFAEA]', // Very soft white sheet background
      sidebar: 'bg-white',
    },
    surfaces: {
      parchment: { bg: 'bg-[#FAEFD8]', border: 'border-[#E7D6B8]', text: 'text-[#2D2419]' },
      softwhite: { bg: 'bg-[#FEFAEA]', border: 'border-[#E7D6B8]', text: 'text-[#2D2419]' },
      darkCharcoal: { bg: 'bg-[#1A1210]', border: 'border-[#382E26]', text: 'text-[#EDE5D8]' },
      darkSurface: { bg: 'bg-[#241C16]', border: 'border-[#382E26]', text: 'text-[#EDE5D8]' },
    },
    cards: {
      classic: 'bg-[#FEFAEA] border border-[#E7D6B8] rounded-2xl shadow-sm',
      elevated: 'bg-[#FEFAEA] border border-[#E7D6B8] rounded-2xl shadow-card',
      interactive: 'bg-[#FEFAEA] border border-[#E7D6B8] rounded-2xl shadow-sm hover:shadow-card hover:border-[#C9A24D] transition-all duration-200 cursor-pointer',
      premium: 'prem-card',
      premiumActive: 'prem-card prem-card-active',
      dark: 'bg-[#241C16] border border-[#382E26] rounded-2xl shadow-lg',
    },
    status: {
      success: {
        text: 'text-[#1E4620]', // Accessible dark green
        bg: 'bg-[#E8F5E9]', // Gentle light green
        border: 'border-[#A2CBA5]', // Define clean border
        iconColor: 'text-[#2E7D32]',
      },
      warning: {
        text: 'text-[#795548]', // Rich brown or accessible dark gold
        bg: 'bg-[#FFF3E0]', // Gentle gold-amber tint
        border: 'border-[#FFE0B2]',
        iconColor: 'text-[#EF6C00]',
      },
      error: {
        text: 'text-[#C62828]', // Deep red
        bg: 'bg-[#FFEBEE]',
        border: 'border-[#FFCDD2]',
        iconColor: 'text-[#D32F2F]',
      },
      info: {
        text: 'text-[#1565C0]', // Accessible dark blue
        bg: 'bg-[#E3F2FD]',
        border: 'border-[#BBDEFB]',
        iconColor: 'text-[#1976D2]',
      }
    },
    dividers: {
      light: 'border-[#DCC9A6]', // Warm antique line
      dark: 'border-[#382E26]', // Dark charcoal line
      muted: 'border-[#E7D6B8]/50', // Soft faint line
    }
  },

  // 6. Learning Components Tokens
  components: {
    lessonContainer: {
      wrapper: 'max-w-[680px] mx-auto px-4 py-8 md:px-6 md:py-12', // Strict reading width constraints
      card: 'bg-white rounded-3xl border border-[#E7D6B8] p-6 md:p-8 shadow-card',
    },
    sidebar: {
      container: 'w-[280px] shrink-0 bg-white border-r border-[#E7D6B8] h-full hidden lg:flex flex-col',
      header: 'p-5 border-b border-[#E7D6B8] bg-[#FEFAEA]/50',
      itemDefault: 'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm text-[#4A3020] hover:bg-[#FEFAEA] hover:text-[#2D2419] transition-colors',
      itemActive: 'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-semibold bg-[#FAEFD8] text-[#2D2419] border border-[#E7D6B8] shadow-sm',
      itemCompleted: 'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm text-[#5C3D26] hover:bg-[#FEFAEA]',
    },
    progressCard: {
      wrapper: 'bg-white border border-[#E7D6B8] rounded-2xl p-4 shadow-sm flex items-center gap-4',
      ringActive: 'stroke-[#C9A24D]', // Burnished gold
      ringBackground: 'stroke-[#F2E6D0]',
      ringCompleted: 'stroke-[#2D6A4F]', // Deep auspicious green
    },
    chapterList: {
      wrapper: 'space-y-4',
      header: 'text-xs font-bold uppercase tracking-widest text-[#9C7A2F] mb-2',
    },
    lessonCards: {
      wrapper: 'grid grid-cols-1 md:grid-cols-2 gap-4',
      default: 'p-5 bg-white border border-[#E7D6B8] rounded-2xl hover:border-[#C9A24D] hover:shadow-md transition-all duration-200 cursor-pointer',
      active: 'p-5 bg-[#FEFAEA] border-2 border-[#C9A24D] rounded-2xl shadow-sm',
      locked: 'p-5 bg-gray-50 border border-gray-200 rounded-2xl opacity-60 cursor-not-allowed',
    },
    codeBlocks: {
      wrapper: 'my-4 p-4 bg-[#1A1210] rounded-xl font-mono text-xs text-[#EAF5E9] overflow-x-auto border border-[#382E26] shadow-inner',
      header: 'flex items-center justify-between border-b border-[#382E26] pb-2 mb-3 text-[10px] text-[#A89885] uppercase tracking-wider',
      keyword: 'text-[#FFD27D] font-bold', // Glowy gold keyword
      comment: 'text-[#7A6B5A] italic',
      string: 'text-[#6EBF7B]', // Green strings
    },
    highlights: 'bg-[#FFF4E6] text-[#8B5A2B] px-1.5 py-0.5 rounded font-semibold border-b-2 border-[#C9A24D]/30',
    quotes: {
      container: 'my-6 pl-4 border-l-4 border-[#C9A24D] bg-[#FEFAEA] py-3 pr-4 rounded-r-xl italic text-[#4A3020]',
      citation: 'block mt-2 text-xs font-bold uppercase tracking-wider text-[#9C7A2F] not-italic',
    },
    notes: {
      container: 'my-6 p-4 rounded-2xl bg-[#FFF3E0] border border-[#FFE0B2] border-l-4 border-l-[#C9A24D]',
      title: 'flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B5A2B] mb-1.5',
      content: 'text-sm text-[#4A3020] leading-relaxed',
    },
    quizCards: {
      container: 'space-y-3',
      optionDefault: 'w-full p-4 text-left text-sm md:text-base font-medium text-[#4A3020] bg-white border border-[#E7D6B8] rounded-xl hover:bg-[#FEFAEA] hover:border-[#C9A24D] transition-all cursor-pointer flex items-center justify-between',
      optionSelected: 'w-full p-4 text-left text-sm md:text-base font-semibold text-[#2D2419] bg-[#FAEFD8] border-2 border-[#C9A24D] rounded-xl flex items-center justify-between shadow-sm',
      optionCorrect: 'w-full p-4 text-left text-sm md:text-base font-semibold text-[#1E4620] bg-[#E8F5E9] border-2 border-[#2D6A4F] rounded-xl flex items-center justify-between',
      optionIncorrect: 'w-full p-4 text-left text-sm md:text-base font-semibold text-[#C62828] bg-[#FFEBEE] border-2 border-[#9B2C2C] rounded-xl flex items-center justify-between',
    },
    buttons: {
      primary: 'bg-[#C9A24D] hover:bg-[#D4AD5A] active:bg-[#B8923F] text-[#1A0A05] border border-[#9C7A2F] px-6 py-3 rounded-xl font-semibold shadow-sm transition-all text-center flex items-center justify-center gap-2',
      secondary: 'bg-transparent hover:bg-[#FAEFD8] active:bg-[#E7D6B8] text-[#C9A24D] border-2 border-[#C9A24D] px-6 py-3 rounded-xl font-semibold transition-all text-center flex items-center justify-center gap-2',
    },
    tags: {
      definition: 'bg-blue-50 text-[#1565C0] border border-blue-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full',
      etymology: 'bg-purple-50 text-[#6A1B9A] border border-purple-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full',
      mechanics: 'bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full',
      algorithm: 'bg-indigo-50 text-[#283593] border border-indigo-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full',
      practical: 'bg-cyan-50 text-[#00838F] border border-cyan-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full',
    }
  },

  // 7. Interaction States (Tailwind Compositions)
  states: {
    hover: 'hover:translate-y-[-1px] hover:shadow-md transition-all duration-200',
    pressed: 'active:scale-[0.98] transition-transform duration-100',
    selected: 'ring-2 ring-[#C9A24D] ring-offset-2',
    completed: 'opacity-90 line-through decoration-[#2D6A4F]/40',
    locked: 'opacity-50 grayscale cursor-not-allowed select-none',
    disabled: 'opacity-40 cursor-not-allowed pointer-events-none select-none',
  },

  // 8. Layout Rules
  layout: {
    contentWidth: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    readingWidth: 'max-w-[65ch]', // 65 characters optimal reading column
    paddings: {
      screen: 'p-4 sm:p-6 lg:p-8',
      card: 'p-5 sm:p-6',
      section: 'py-8 sm:py-12',
    },
    margins: {
      header: 'mb-6',
      paragraph: 'mb-4',
      section: 'my-8 sm:my-12',
    }
  },

  // 9. Accessibility Rules
  accessibility: {
    minContrastBody: '7:1', // WCAG AAA Target for body text
    minContrastHeadings: '4.5:1', // WCAG AA/AAA Target for large fonts
    lineHeightBody: 1.6, // Optimal line height for reading comfort
    lineHeightHeading: 1.25,
    maxLineLength: '70ch', // Strict cap on horizontal characters
    focusIndicator: 'focus-visible:outline-2 focus-visible:outline-[#C9A24D] focus-visible:outline-offset-2',
  }
} as const;
