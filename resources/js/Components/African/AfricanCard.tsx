import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { useAfricanTheme } from '@/Context/AfricanThemeContext';
import { AfricanBackground } from '@/theme/africanPatterns';

type CardVariant = 'default' | 'primary' | 'secondary' | 'accent';

interface AfricanCardProps {
  className?: string;
  variant?: CardVariant;
  withPattern?: boolean;
  patternOpacity?: number;
  patternType?: string;
  bordered?: boolean;
  elevated?: boolean;
}

export default function AfricanCard({
  children,
  className = '',
  variant = 'default',
  withPattern = false,
  patternOpacity = 0.05,
  patternType,
  bordered = false,
  elevated = false,
}: PropsWithChildren<AfricanCardProps>) {
  const { themeVariant } = useAfricanTheme();
  const { patternType: contextPatternType } = useAfricanTheme();
  const actualPatternType = patternType || contextPatternType;

  // Get variant-specific classes based on theme
  const getVariantClasses = () => {
    const variantMap: Record<CardVariant, Record<string, string>> = {
      default: {
        earth: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
        kente: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
        ankara: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
        chitenge: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
        ndebele: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
      },
      primary: {
        earth: 'bg-clay-50 dark:bg-gray-800 border-clay-200 dark:border-clay-800 text-gray-900 dark:text-gray-100',
        kente: 'bg-kente-gold-50 dark:bg-gray-800 border-kente-gold-200 dark:border-kente-gold-800 text-gray-900 dark:text-gray-100',
        ankara: 'bg-ankara-purple-50 dark:bg-gray-800 border-ankara-purple-200 dark:border-ankara-purple-800 text-gray-900 dark:text-gray-100',
        chitenge: 'bg-chitenge-indigo-50 dark:bg-gray-800 border-chitenge-indigo-200 dark:border-chitenge-indigo-800 text-gray-900 dark:text-gray-100',
        ndebele: 'bg-ndebele-red-50 dark:bg-gray-800 border-ndebele-red-200 dark:border-ndebele-red-800 text-gray-900 dark:text-gray-100',
      },
      secondary: {
        earth: 'bg-terracotta-50 dark:bg-gray-800 border-terracotta-200 dark:border-terracotta-800 text-gray-900 dark:text-gray-100',
        kente: 'bg-kente-green-50 dark:bg-gray-800 border-kente-green-200 dark:border-kente-green-800 text-gray-900 dark:text-gray-100',
        ankara: 'bg-ankara-teal-50 dark:bg-gray-800 border-ankara-teal-200 dark:border-ankara-teal-800 text-gray-900 dark:text-gray-100',
        chitenge: 'bg-chitenge-turquoise-50 dark:bg-gray-800 border-chitenge-turquoise-200 dark:border-chitenge-turquoise-800 text-gray-900 dark:text-gray-100',
        ndebele: 'bg-ndebele-blue-50 dark:bg-gray-800 border-ndebele-blue-200 dark:border-ndebele-blue-800 text-gray-900 dark:text-gray-100',
      },
      accent: {
        earth: 'bg-sand-50 dark:bg-gray-800 border-sand-200 dark:border-sand-800 text-gray-900 dark:text-gray-100',
        kente: 'bg-kente-red-50 dark:bg-gray-800 border-kente-red-200 dark:border-kente-red-800 text-gray-900 dark:text-gray-100',
        ankara: 'bg-ankara-orange-50 dark:bg-gray-800 border-ankara-orange-200 dark:border-ankara-orange-800 text-gray-900 dark:text-gray-100',
        chitenge: 'bg-chitenge-magenta-50 dark:bg-gray-800 border-chitenge-magenta-200 dark:border-chitenge-magenta-800 text-gray-900 dark:text-gray-100',
        ndebele: 'bg-ndebele-yellow-50 dark:bg-gray-800 border-ndebele-yellow-200 dark:border-ndebele-yellow-800 text-gray-900 dark:text-gray-100',
      },
    };

    return variantMap[variant][themeVariant];
  };

  // Get border classes based on theme
  const getBorderClasses = () => {
    if (!bordered) return 'border-transparent';

    const borderMap: Record<CardVariant, Record<string, string>> = {
      default: {
        earth: 'border-gray-200 dark:border-gray-700',
        kente: 'border-gray-200 dark:border-gray-700',
        ankara: 'border-gray-200 dark:border-gray-700',
        chitenge: 'border-gray-200 dark:border-gray-700',
        ndebele: 'border-gray-200 dark:border-gray-700',
      },
      primary: {
        earth: 'border-clay-300 dark:border-clay-700',
        kente: 'border-kente-gold-300 dark:border-kente-gold-700',
        ankara: 'border-ankara-purple-300 dark:border-ankara-purple-700',
        chitenge: 'border-chitenge-indigo-300 dark:border-chitenge-indigo-700',
        ndebele: 'border-ndebele-red-300 dark:border-ndebele-red-700',
      },
      secondary: {
        earth: 'border-terracotta-300 dark:border-terracotta-700',
        kente: 'border-kente-green-300 dark:border-kente-green-700',
        ankara: 'border-ankara-teal-300 dark:border-ankara-teal-700',
        chitenge: 'border-chitenge-turquoise-300 dark:border-chitenge-turquoise-700',
        ndebele: 'border-ndebele-blue-300 dark:border-ndebele-blue-700',
      },
      accent: {
        earth: 'border-sand-300 dark:border-sand-700',
        kente: 'border-kente-red-300 dark:border-kente-red-700',
        ankara: 'border-ankara-orange-300 dark:border-ankara-orange-700',
        chitenge: 'border-chitenge-magenta-300 dark:border-chitenge-magenta-700',
        ndebele: 'border-ndebele-yellow-300 dark:border-ndebele-yellow-700',
      },
    };

    return borderMap[variant][themeVariant];
  };

  // Get pattern color based on theme
  const getPatternColor = () => {
    const colorMap: Record<string, string> = {
      earth: '#A05A2C', // terracotta color
      kente: '#FFB524', // gold color
      ankara: '#9747FF', // purple color
      chitenge: '#6366F1', // indigo color
      ndebele: '#FA5252', // red color
    };

    return colorMap[themeVariant];
  };

  return (
    <div
      className={classNames(
        'relative rounded-xl overflow-hidden border',
        getVariantClasses(),
        getBorderClasses(),
        elevated ? 'shadow-md' : '',
        className
      )}
    >
      {withPattern && (
        <AfricanBackground
          pattern={actualPatternType as any}
          primaryColor={getPatternColor()}
          opacity={patternOpacity}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
