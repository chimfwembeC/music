import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { useAfricanTheme } from '@/Context/AfricanThemeContext';

interface AfricanInputProps extends React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> {
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  error?: boolean;
  fullWidth?: boolean;
}

const AfricanInput = forwardRef<HTMLInputElement, AfricanInputProps>(
  ({ variant = 'default', error = false, fullWidth = false, className, ...props }, ref) => {
    const { themeVariant } = useAfricanTheme();

    // Get variant-specific classes based on theme
    const getVariantClasses = () => {
      const variantMap = {
        default: {
          earth: 'border-gray-300 dark:border-gray-700 focus:border-clay-500 dark:focus:border-clay-400 focus:ring-clay-500 dark:focus:ring-clay-400',
          kente: 'border-gray-300 dark:border-gray-700 focus:border-kente-gold-500 dark:focus:border-kente-gold-400 focus:ring-kente-gold-500 dark:focus:ring-kente-gold-400',
          ankara: 'border-gray-300 dark:border-gray-700 focus:border-ankara-purple-500 dark:focus:border-ankara-purple-400 focus:ring-ankara-purple-500 dark:focus:ring-ankara-purple-400',
          chitenge: 'border-gray-300 dark:border-gray-700 focus:border-chitenge-indigo-500 dark:focus:border-chitenge-indigo-400 focus:ring-chitenge-indigo-500 dark:focus:ring-chitenge-indigo-400',
        },
        primary: {
          earth: 'border-clay-300 dark:border-clay-700 focus:border-clay-500 dark:focus:border-clay-400 focus:ring-clay-500 dark:focus:ring-clay-400',
          kente: 'border-kente-gold-300 dark:border-kente-gold-700 focus:border-kente-gold-500 dark:focus:border-kente-gold-400 focus:ring-kente-gold-500 dark:focus:ring-kente-gold-400',
          ankara: 'border-ankara-purple-300 dark:border-ankara-purple-700 focus:border-ankara-purple-500 dark:focus:border-ankara-purple-400 focus:ring-ankara-purple-500 dark:focus:ring-ankara-purple-400',
          chitenge: 'border-chitenge-indigo-300 dark:border-chitenge-indigo-700 focus:border-chitenge-indigo-500 dark:focus:border-chitenge-indigo-400 focus:ring-chitenge-indigo-500 dark:focus:ring-chitenge-indigo-400',
        },
        secondary: {
          earth: 'border-terracotta-300 dark:border-terracotta-700 focus:border-terracotta-500 dark:focus:border-terracotta-400 focus:ring-terracotta-500 dark:focus:ring-terracotta-400',
          kente: 'border-kente-green-300 dark:border-kente-green-700 focus:border-kente-green-500 dark:focus:border-kente-green-400 focus:ring-kente-green-500 dark:focus:ring-kente-green-400',
          ankara: 'border-ankara-teal-300 dark:border-ankara-teal-700 focus:border-ankara-teal-500 dark:focus:border-ankara-teal-400 focus:ring-ankara-teal-500 dark:focus:ring-ankara-teal-400',
          chitenge: 'border-chitenge-turquoise-300 dark:border-chitenge-turquoise-700 focus:border-chitenge-turquoise-500 dark:focus:border-chitenge-turquoise-400 focus:ring-chitenge-turquoise-500 dark:focus:ring-chitenge-turquoise-400',
        },
        accent: {
          earth: 'border-sand-300 dark:border-sand-700 focus:border-sand-500 dark:focus:border-sand-400 focus:ring-sand-500 dark:focus:ring-sand-400',
          kente: 'border-kente-red-300 dark:border-kente-red-700 focus:border-kente-red-500 dark:focus:border-kente-red-400 focus:ring-kente-red-500 dark:focus:ring-kente-red-400',
          ankara: 'border-ankara-orange-300 dark:border-ankara-orange-700 focus:border-ankara-orange-500 dark:focus:border-ankara-orange-400 focus:ring-ankara-orange-500 dark:focus:ring-ankara-orange-400',
          chitenge: 'border-chitenge-magenta-300 dark:border-chitenge-magenta-700 focus:border-chitenge-magenta-500 dark:focus:border-chitenge-magenta-400 focus:ring-chitenge-magenta-500 dark:focus:ring-chitenge-magenta-400',
        },
      };

      return variantMap[variant][themeVariant];
    };

    // Get error classes
    const getErrorClasses = () => {
      if (!error) return '';

      return 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400 text-red-900 dark:text-red-100 placeholder-red-300 dark:placeholder-red-500';
    };

    return (
      <input
        {...props}
        ref={ref}
        className={classNames(
          'rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200',
          getVariantClasses(),
          getErrorClasses(),
          fullWidth ? 'w-full' : '',
          className,
        )}
      />
    );
  }
);

AfricanInput.displayName = 'AfricanInput';

export default AfricanInput;
