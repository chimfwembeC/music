/**
 * African-inspired Design System
 *
 * This file contains color palettes, typography settings, and pattern definitions
 * inspired by traditional African art, textiles, and cultural elements.
 */

// Color Palettes inspired by different African regions and traditions
export const colors = {
  // Earthy tones inspired by Sahel and Savanna regions
  earth: {
    clay: {
      50: '#FFF5F1',
      100: '#FFE6DB',
      200: '#FFC7AD',
      300: '#FFA77F',
      400: '#FF8751',
      500: '#FF6724', // Primary clay
      600: '#E54D0D',
      700: '#BC3A06',
      800: '#932E08',
      900: '#7A270A',
      950: '#461404',
    },
    terracotta: {
      50: '#FCF5F2',
      100: '#F8E8E0',
      200: '#F0CDB9',
      300: '#E6AD8D',
      400: '#DB8A61',
      500: '#D06A3A', // Primary terracotta
      600: '#B85426',
      700: '#96401E',
      800: '#7A341B',
      900: '#652D1A',
      950: '#3A180D',
    },
    sand: {
      50: '#FDFAED',
      100: '#FBF5D1',
      200: '#F7EAA3',
      300: '#F2D96B',
      400: '#ECC83F',
      500: '#E5B41D', // Primary sand
      600: '#C49014',
      700: '#9C6F12',
      800: '#7D5815',
      900: '#674916',
      950: '#3C280B',
    },
  },

  // Vibrant colors inspired by West African textiles (Kente cloth)
  kente: {
    gold: {
      50: '#FFFAEB',
      100: '#FFF1C6',
      200: '#FFE08A',
      300: '#FFCB4F',
      400: '#FFB524',
      500: '#FF9500', // Primary gold
      600: '#E67200',
      700: '#BF5500',
      800: '#994400',
      900: '#7A3900',
      950: '#461F00',
    },
    green: {
      50: '#EFFCE8',
      100: '#DCF8D0',
      200: '#B8F0A2',
      300: '#8CE46B',
      400: '#65D33D',
      500: '#44B81F', // Primary green
      600: '#339318',
      700: '#287017',
      800: '#235A18',
      900: '#1F4A18',
      950: '#0F2A0C',
    },
    red: {
      50: '#FFF1F1',
      100: '#FFDFDF',
      200: '#FFC5C5',
      300: '#FF9D9D',
      400: '#FF6B6B',
      500: '#FF3A3A', // Primary red
      600: '#E51E1E',
      700: '#C11414',
      800: '#9D1414',
      900: '#821717',
      950: '#4A0A0A',
    },
    blue: {
      50: '#EFF8FF',
      100: '#DAEEFF',
      200: '#B3DEFF',
      300: '#78C6FF',
      400: '#3AA9FF',
      500: '#0B86FF', // Primary blue
      600: '#0069D9',
      700: '#0053AE',
      800: '#00448F',
      900: '#003B76',
      950: '#002347',
    },
  },

  // Colors inspired by Ankara/Dutch Wax prints
  ankara: {
    purple: {
      50: '#F9F5FF',
      100: '#F2E9FF',
      200: '#E5D4FF',
      300: '#D1B1FF',
      400: '#B77EFF',
      500: '#9747FF', // Primary purple
      600: '#8520FF',
      700: '#7109F0',
      800: '#5D0BC4',
      900: '#4C0D9E',
      950: '#2E0663',
    },
    teal: {
      50: '#EFFFFD',
      100: '#D6FFFA',
      200: '#ACFFF5',
      300: '#67FFF0',
      400: '#2AFFE8',
      500: '#00E6CE', // Primary teal
      600: '#00B8A5',
      700: '#008C7F',
      800: '#007067',
      900: '#005C55',
      950: '#003532',
    },
    orange: {
      50: '#FFF8EB',
      100: '#FFECC6',
      200: '#FFD88A',
      300: '#FFBF4F',
      400: '#FFA524',
      500: '#FF8A00', // Primary orange
      600: '#E67200',
      700: '#BF5500',
      800: '#994400',
      900: '#7A3900',
      950: '#461F00',
    },
  },

  // Colors inspired by East African Chitenge/Kitenge textiles
  chitenge: {
    indigo: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1', // Primary indigo
      600: '#4F46E5',
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
      950: '#1E1B4B',
    },
    turquoise: {
      50: '#ECFEFF',
      100: '#CFFAFE',
      200: '#A5F3FC',
      300: '#67E8F9',
      400: '#22D3EE',
      500: '#06B6D4', // Primary turquoise
      600: '#0891B2',
      700: '#0E7490',
      800: '#155E75',
      900: '#164E63',
      950: '#083344',
    },
    magenta: {
      50: '#FDF2F8',
      100: '#FCE7F3',
      200: '#FBCFE8',
      300: '#F9A8D4',
      400: '#F472B6',
      500: '#EC4899', // Primary magenta
      600: '#DB2777',
      700: '#BE185D',
      800: '#9D174D',
      900: '#831843',
      950: '#500724',
    },
    ochre: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B', // Primary ochre
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
      950: '#451A03',
    },
  },
};

// Typography scale inspired by traditional African proportions
export const typography = {
  fontFamily: {
    // Primary font for headings - consider African-inspired fonts
    display: ['Montserrat', 'sans-serif'],
    // Secondary font for body text
    body: ['Rubik', 'sans-serif'],
    // Optional accent font for special elements
    accent: ['Caveat', 'cursive'],
  },
  // Font sizes with larger contrast between heading levels
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },
  // Line heights for better readability
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
};

// Border radius values inspired by organic African shapes
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Spacing scale with more generous values for breathing room
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};
