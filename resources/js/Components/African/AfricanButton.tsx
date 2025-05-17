import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { useAfricanTheme } from '@/Context/AfricanThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  withPattern?: boolean;
};

export default function AfricanButton({
  children,
  variant = 'primary',
  size = 'md',
  withPattern = false,
  ...props
}: PropsWithChildren<Props>) {
  const { themeVariant } = useAfricanTheme();

  // Get variant-specific classes based on theme
  const getVariantClasses = () => {
    const variantMap: Record<ButtonVariant, Record<string, string>> = {
      primary: {
        earth: 'bg-clay-500 hover:bg-clay-600 text-white dark:bg-clay-600 dark:hover:bg-clay-700 dark:text-white border-transparent',
        kente: 'bg-kente-gold-500 hover:bg-kente-gold-600 text-gray-900 dark:bg-kente-gold-600 dark:hover:bg-kente-gold-700 dark:text-gray-900 border-transparent',
        ankara: 'bg-ankara-purple-500 hover:bg-ankara-purple-600 text-white dark:bg-ankara-purple-600 dark:hover:bg-ankara-purple-700 dark:text-white border-transparent',
        chitenge: 'bg-chitenge-indigo-500 hover:bg-chitenge-indigo-600 text-white dark:bg-chitenge-indigo-600 dark:hover:bg-chitenge-indigo-700 dark:text-white border-transparent',
        ndebele: 'bg-ndebele-red-600 hover:bg-ndebele-red-700 text-white dark:bg-ndebele-red-700 dark:hover:bg-ndebele-red-800 dark:text-white border-transparent',
      },
      secondary: {
        earth: 'bg-terracotta-500 hover:bg-terracotta-600 text-white dark:bg-terracotta-600 dark:hover:bg-terracotta-700 dark:text-white border-transparent',
        kente: 'bg-kente-green-500 hover:bg-kente-green-600 text-white dark:bg-kente-green-600 dark:hover:bg-kente-green-700 dark:text-white border-transparent',
        ankara: 'bg-ankara-teal-500 hover:bg-ankara-teal-600 text-white dark:bg-ankara-teal-600 dark:hover:bg-ankara-teal-700 dark:text-white border-transparent',
        chitenge: 'bg-chitenge-turquoise-500 hover:bg-chitenge-turquoise-600 text-white dark:bg-chitenge-turquoise-600 dark:hover:bg-chitenge-turquoise-700 dark:text-white border-transparent',
        ndebele: 'bg-ndebele-blue-500 hover:bg-ndebele-blue-600 text-white dark:bg-ndebele-blue-600 dark:hover:bg-ndebele-blue-700 dark:text-white border-transparent',
      },
      accent: {
        earth: 'bg-sand-500 hover:bg-sand-600 text-gray-900 dark:bg-sand-600 dark:hover:bg-sand-700 dark:text-gray-900 border-transparent',
        kente: 'bg-kente-red-500 hover:bg-kente-red-600 text-white dark:bg-kente-red-600 dark:hover:bg-kente-red-700 dark:text-white border-transparent',
        ankara: 'bg-ankara-orange-500 hover:bg-ankara-orange-600 text-white dark:bg-ankara-orange-600 dark:hover:bg-ankara-orange-700 dark:text-white border-transparent',
        chitenge: 'bg-chitenge-magenta-500 hover:bg-chitenge-magenta-600 text-white dark:bg-chitenge-magenta-600 dark:hover:bg-chitenge-magenta-700 dark:text-white border-transparent',
        ndebele: 'bg-ndebele-yellow-500 hover:bg-ndebele-yellow-600 text-ndebele-black-900 dark:bg-ndebele-yellow-600 dark:hover:bg-ndebele-yellow-700 dark:text-ndebele-black-900 border-transparent',
      },
      outline: {
        earth: 'bg-transparent hover:bg-clay-50 text-clay-600 dark:text-clay-400 dark:hover:bg-gray-800 border-clay-500 dark:border-clay-400',
        kente: 'bg-transparent hover:bg-kente-gold-50 text-kente-gold-600 dark:text-kente-gold-400 dark:hover:bg-gray-800 border-kente-gold-500 dark:border-kente-gold-400',
        ankara: 'bg-transparent hover:bg-ankara-purple-50 text-ankara-purple-600 dark:text-ankara-purple-400 dark:hover:bg-gray-800 border-ankara-purple-500 dark:border-ankara-purple-400',
        chitenge: 'bg-transparent hover:bg-chitenge-indigo-50 text-chitenge-indigo-600 dark:text-chitenge-indigo-400 dark:hover:bg-gray-800 border-chitenge-indigo-500 dark:border-chitenge-indigo-400',
        ndebele: 'bg-transparent hover:bg-ndebele-red-50 text-ndebele-red-600 dark:text-ndebele-red-500 dark:hover:bg-gray-800 border-ndebele-red-600 dark:border-ndebele-red-500',
      },
      ghost: {
        earth: 'bg-transparent hover:bg-clay-50 text-clay-600 dark:text-clay-400 dark:hover:bg-gray-800 border-transparent',
        kente: 'bg-transparent hover:bg-kente-gold-50 text-kente-gold-600 dark:text-kente-gold-400 dark:hover:bg-gray-800 border-transparent',
        ankara: 'bg-transparent hover:bg-ankara-purple-50 text-ankara-purple-600 dark:text-ankara-purple-400 dark:hover:bg-gray-800 border-transparent',
        chitenge: 'bg-transparent hover:bg-chitenge-indigo-50 text-chitenge-indigo-600 dark:text-chitenge-indigo-400 dark:hover:bg-gray-800 border-transparent',
        ndebele: 'bg-transparent hover:bg-ndebele-red-50 text-ndebele-red-600 dark:text-ndebele-red-500 dark:hover:bg-gray-800 border-transparent',
      },
    };

    return variantMap[variant][themeVariant];
  };

  // Get size-specific classes
  const getSizeClasses = () => {
    const sizeMap: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return sizeMap[size];
  };

  // Pattern background for buttons
  const getPatternClasses = () => {
    if (!withPattern) return '';

    const patternMap: Record<string, string> = {
      earth: 'relative overflow-hidden',
      kente: 'relative overflow-hidden',
      ankara: 'relative overflow-hidden',
      chitenge: 'relative overflow-hidden',
      ndebele: 'relative overflow-hidden',
    };

    return patternMap[themeVariant];
  };

  return (
    <button
      {...props}
      className={classNames(
        'inline-flex items-center justify-center font-medium border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm',
        getVariantClasses(),
        getSizeClasses(),
        getPatternClasses(),
        props.className,
      )}
    >
      {withPattern && (
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {themeVariant === 'kente' && (
              <pattern id="kente-btn-pattern" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
                <rect width="10" height="10" fill="currentColor" x="0" y="0" />
              </pattern>
            )}
            {themeVariant === 'ankara' && (
              <pattern id="ankara-btn-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                <circle cx="10" cy="10" r="5" fill="currentColor" />
              </pattern>
            )}
            {themeVariant === 'earth' && (
              <pattern id="earth-btn-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                <path d="M0,10 L20,10 M10,0 L10,20" stroke="currentColor" strokeWidth="2" />
              </pattern>
            )}
            {themeVariant === 'chitenge' && (
              <pattern id="chitenge-btn-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                <path d="M0,0 L20,20 M20,0 L0,20" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="10" cy="10" r="3" fill="currentColor" />
              </pattern>
            )}
            {themeVariant === 'ndebele' && (
              <pattern id="ndebele-btn-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                <rect x="2" y="2" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <rect x="6" y="6" width="8" height="8" stroke="currentColor" strokeWidth="1" fill="none" />
                <line x1="2" y1="2" x2="6" y2="6" stroke="currentColor" strokeWidth="1" />
                <line x1="18" y1="2" x2="14" y2="6" stroke="currentColor" strokeWidth="1" />
                <line x1="2" y1="18" x2="6" y2="14" stroke="currentColor" strokeWidth="1" />
                <line x1="18" y1="18" x2="14" y2="14" stroke="currentColor" strokeWidth="1" />
              </pattern>
            )}
            <rect width="100%" height="100%" fill={`url(#${themeVariant}-btn-pattern)`} />
          </svg>
        </div>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
