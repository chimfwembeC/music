import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { colors, typography as africanTypography, borderRadius, spacing } from './resources/js/theme/africanTheme';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './vendor/laravel/jetstream/**/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.tsx',
  ],

  theme: {
    extend: {
      colors: {
        // African-inspired color palette
        clay: colors.earth.clay,
        terracotta: colors.earth.terracotta,
        sand: colors.earth.sand,
        kente: {
          gold: colors.kente.gold,
          green: colors.kente.green,
          red: colors.kente.red,
          blue: colors.kente.blue,
        },
        ankara: {
          purple: colors.ankara.purple,
          teal: colors.ankara.teal,
          orange: colors.ankara.orange,
        },
        chitenge: {
          indigo: colors.chitenge.indigo,
          turquoise: colors.chitenge.turquoise,
          magenta: colors.chitenge.magenta,
          ochre: colors.chitenge.ochre,
        },
        ndebele: {
          black: colors.ndebele.black,
          red: colors.ndebele.red,
          yellow: colors.ndebele.yellow,
          blue: colors.ndebele.blue,
          green: colors.ndebele.green,
        },
        // Override primary colors with African-inspired ones
        primary: colors.kente.gold,
        secondary: colors.ankara.purple,
        accent: colors.earth.terracotta,
      },
      fontFamily: {
        // Keep the existing sans font as fallback
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
        // Add African typography
        display: africanTypography.fontFamily.display,
        body: africanTypography.fontFamily.body,
        accent: africanTypography.fontFamily.accent,
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      backgroundImage: {
        'kente-pattern': "url('/patterns/kente.svg')",
        'adinkra-pattern': "url('/patterns/adinkra.svg')",
        'mud-cloth-pattern': "url('/patterns/mudcloth.svg')",
      },
      borderRadius: {
        ...borderRadius,
      },
    },
  },

  plugins: [forms, typography],
};
