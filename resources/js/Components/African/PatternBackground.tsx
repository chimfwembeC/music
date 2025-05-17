import React from 'react';
import { useAfricanTheme } from '@/Context/AfricanThemeContext';
import { AfricanBackground } from '@/theme/africanPatterns';

interface PatternBackgroundProps {
  className?: string;
  children: React.ReactNode;
  opacity?: number;
  fullScreen?: boolean;
  variant?: 'primary' | 'secondary' | 'accent' | 'default';
}

export default function PatternBackground({
  className = '',
  children,
  opacity,
  fullScreen = false,
  variant = 'primary',
}: PatternBackgroundProps) {
  const { themeVariant, patternType, patternOpacity } = useAfricanTheme();
  
  // Get pattern color based on theme and variant
  const getPatternColor = () => {
    const colorMap = {
      primary: {
        earth: '#A05A2C', // clay color
        kente: '#FFB524', // gold color
        ankara: '#9747FF', // purple color
      },
      secondary: {
        earth: '#D06A3A', // terracotta color
        kente: '#44B81F', // green color
        ankara: '#00E6CE', // teal color
      },
      accent: {
        earth: '#E5B41D', // sand color
        kente: '#FF3A3A', // red color
        ankara: '#FF8A00', // orange color
      },
      default: {
        earth: '#A05A2C', // clay color
        kente: '#FFB524', // gold color
        ankara: '#9747FF', // purple color
      },
    };

    return colorMap[variant][themeVariant];
  };

  return (
    <div className={`relative ${fullScreen ? 'min-h-screen' : ''} ${className}`}>
      <AfricanBackground
        pattern={patternType as any}
        primaryColor={getPatternColor()}
        opacity={opacity || patternOpacity}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
