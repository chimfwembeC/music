import React from 'react';

/**
 * African-inspired pattern components
 *
 * These SVG patterns are inspired by traditional African textile designs,
 * including Kente cloth, Mud cloth (Bògòlanfini), Adinkra symbols, and more.
 */

interface PatternProps {
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  size?: number;
  opacity?: number;
}

// Zigzag pattern inspired by West African textiles
export const ZigzagPattern: React.FC<PatternProps> = ({
  className = '',
  primaryColor = 'currentColor',
  secondaryColor = 'transparent',
  size = 20,
  opacity = 0.15
}) => (
  <svg
    className={`absolute inset-0 w-full h-full ${className}`}
    style={{ opacity }}
    viewBox="0 0 40 40"
    xmlns="http://www.w3.org/2000/svg"
  >
    <pattern id="zigzag-pattern" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
      <path
        d="M0 20 L10 10 L20 20 L30 10 L40 20 L40 40 L0 40 Z"
        fill={primaryColor}
      />
    </pattern>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#zigzag-pattern)" />
  </svg>
);

// Diamond pattern inspired by Kente cloth
export const KentePattern: React.FC<PatternProps> = ({
  className = '',
  primaryColor = 'currentColor',
  secondaryColor = 'currentColor',
  size = 40,
  opacity = 0.1
}) => (
  <svg
    className={`absolute inset-0 w-full h-full ${className}`}
    style={{ opacity }}
    viewBox="0 0 80 80"
    xmlns="http://www.w3.org/2000/svg"
  >
    <pattern id="kente-pattern" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width={size} height={size} fill="transparent" />
      <rect x={size/4} y="0" width={size/2} height={size} fill={primaryColor} />
      <rect x="0" y={size/4} width={size} height={size/2} fill={secondaryColor} />
    </pattern>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#kente-pattern)" />
  </svg>
);

// Dots pattern inspired by Yoruba Adire textile
export const AdirePattern: React.FC<PatternProps> = ({
  className = '',
  primaryColor = 'currentColor',
  size = 20,
  opacity = 0.1
}) => (
  <svg
    className={`absolute inset-0 w-full h-full ${className}`}
    style={{ opacity }}
    viewBox="0 0 40 40"
    xmlns="http://www.w3.org/2000/svg"
  >
    <pattern id="adire-pattern" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
      <circle cx={size/4} cy={size/4} r={size/10} fill={primaryColor} />
      <circle cx={size*3/4} cy={size*3/4} r={size/10} fill={primaryColor} />
    </pattern>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#adire-pattern)" />
  </svg>
);

// Mud cloth (Bògòlanfini) inspired pattern
export const MudclothPattern: React.FC<PatternProps> = ({
  className = '',
  primaryColor = 'currentColor',
  size = 40,
  opacity = 0.1
}) => (
  <svg
    className={`absolute inset-0 w-full h-full ${className}`}
    style={{ opacity }}
    viewBox="0 0 80 80"
    xmlns="http://www.w3.org/2000/svg"
  >
    <pattern id="mudcloth-pattern" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2={size} y2="0" stroke={primaryColor} strokeWidth="2" />
      <line x1="0" y1={size/2} x2={size} y2={size/2} stroke={primaryColor} strokeWidth="2" />
      <line x1="0" y1={size} x2={size} y2={size} stroke={primaryColor} strokeWidth="2" />
      <line x1={size/4} y1={size/4} x2={size*3/4} y2={size/4} stroke={primaryColor} strokeWidth="2" />
      <line x1={size/4} y1={size*3/4} x2={size*3/4} y2={size*3/4} stroke={primaryColor} strokeWidth="2" />
    </pattern>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#mudcloth-pattern)" />
  </svg>
);

// Adinkra symbols pattern (simplified)
export const AdinkraPattern: React.FC<PatternProps> = ({
  className = '',
  primaryColor = 'currentColor',
  size = 60,
  opacity = 0.1
}) => (
  <svg
    className={`absolute inset-0 w-full h-full ${className}`}
    style={{ opacity }}
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
  >
    <pattern id="adinkra-pattern" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
      {/* Simplified Adinkra symbol - Sankofa (return and get it) */}
      <path
        d={`M${size/2},${size/4}
           A${size/4},${size/4} 0 0,1 ${size*3/4},${size/2}
           A${size/4},${size/4} 0 0,1 ${size/2},${size*3/4}
           A${size/4},${size/4} 0 0,1 ${size/4},${size/2}
           A${size/4},${size/4} 0 0,1 ${size/2},${size/4}
           M${size/2},${size/3} L${size/2},${size*2/3}
           M${size/3},${size/2} L${size*2/3},${size/2}`}
        stroke={primaryColor}
        fill="none"
        strokeWidth="2"
      />
    </pattern>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#adinkra-pattern)" />
  </svg>
);

// Tribal pattern with triangles
export const TribalPattern: React.FC<PatternProps> = ({
  className = '',
  primaryColor = 'currentColor',
  size = 30,
  opacity = 0.1
}) => (
  <svg
    className={`absolute inset-0 w-full h-full ${className}`}
    style={{ opacity }}
    viewBox="0 0 60 60"
    xmlns="http://www.w3.org/2000/svg"
  >
    <pattern id="tribal-pattern" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
      <path
        d={`M0,0 L${size/2},${size/2} L0,${size} Z`}
        fill={primaryColor}
      />
      <path
        d={`M${size},0 L${size/2},${size/2} L${size},${size} Z`}
        fill={primaryColor}
      />
    </pattern>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#tribal-pattern)" />
  </svg>
);

// Chitenge/Kitenge Geometric Pattern 1 - Diamond Grid
export const ChitengeGeometricPattern: React.FC<PatternProps> = ({
  className = '',
  primaryColor = 'currentColor',
  secondaryColor = 'currentColor',
  size = 50,
  opacity = 0.15
}) => (
  <svg
    className={`absolute inset-0 w-full h-full ${className}`}
    style={{ opacity }}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="chitenge-geometric" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
        {/* Diamond grid */}
        <path
          d={`M${size/2},0 L${size},${size/2} L${size/2},${size} L0,${size/2} Z`}
          stroke={primaryColor}
          strokeWidth="2"
          fill="none"
        />
        {/* Inner diamond */}
        <path
          d={`M${size/2},${size/4} L${size*3/4},${size/2} L${size/2},${size*3/4} L${size/4},${size/2} Z`}
          stroke={secondaryColor}
          strokeWidth="1.5"
          fill="none"
        />
        {/* Center dot */}
        <circle cx={size/2} cy={size/2} r={size/12} fill={primaryColor} />
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#chitenge-geometric)" />
  </svg>
);

// Chitenge/Kitenge Floral Pattern
export const ChitengeFloralPattern: React.FC<PatternProps> = ({
  className = '',
  primaryColor = 'currentColor',
  secondaryColor = 'currentColor',
  size = 60,
  opacity = 0.15
}) => (
  <svg
    className={`absolute inset-0 w-full h-full ${className}`}
    style={{ opacity }}
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="chitenge-floral" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
        {/* Flower center */}
        <circle cx={size/2} cy={size/2} r={size/10} fill={primaryColor} />

        {/* Flower petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <path
            key={i}
            d={`M${size/2},${size/2}
               L${size/2 + (size/4) * Math.cos(angle * Math.PI / 180)},${size/2 + (size/4) * Math.sin(angle * Math.PI / 180)}
               A${size/8},${size/8} 0 1,1 ${size/2 + (size/4) * Math.cos((angle + 45) * Math.PI / 180)},${size/2 + (size/4) * Math.sin((angle + 45) * Math.PI / 180)}
               Z`}
            fill={secondaryColor}
          />
        ))}

        {/* Connecting lines */}
        <line x1="0" y1="0" x2={size} y2={size} stroke={primaryColor} strokeWidth="1" strokeDasharray="2,4" />
        <line x1={size} y1="0" x2="0" y2={size} stroke={primaryColor} strokeWidth="1" strokeDasharray="2,4" />
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#chitenge-floral)" />
  </svg>
);

// Chitenge/Kitenge Wave Pattern
export const ChitengeWavePattern: React.FC<PatternProps> = ({
  className = '',
  primaryColor = 'currentColor',
  secondaryColor = 'currentColor',
  size = 40,
  opacity = 0.15
}) => (
  <svg
    className={`absolute inset-0 w-full h-full ${className}`}
    style={{ opacity }}
    viewBox="0 0 80 80"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="chitenge-wave" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
        {/* Horizontal waves */}
        <path
          d={`M0,${size/4}
             Q${size/4},0 ${size/2},${size/4}
             T${size},${size/4}`}
          stroke={primaryColor}
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d={`M0,${size*3/4}
             Q${size/4},${size/2} ${size/2},${size*3/4}
             T${size},${size*3/4}`}
          stroke={primaryColor}
          strokeWidth="1.5"
          fill="none"
        />

        {/* Vertical waves */}
        <path
          d={`M${size/4},0
             Q0,${size/4} ${size/4},${size/2}
             T${size/4},${size}`}
          stroke={secondaryColor}
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d={`M${size*3/4},0
             Q${size/2},${size/4} ${size*3/4},${size/2}
             T${size*3/4},${size}`}
          stroke={secondaryColor}
          strokeWidth="1.5"
          fill="none"
        />

        {/* Intersection dots */}
        <circle cx={size/4} cy={size/4} r={size/20} fill={primaryColor} />
        <circle cx={size*3/4} cy={size/4} r={size/20} fill={primaryColor} />
        <circle cx={size/4} cy={size*3/4} r={size/20} fill={primaryColor} />
        <circle cx={size*3/4} cy={size*3/4} r={size/20} fill={primaryColor} />
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#chitenge-wave)" />
  </svg>
);

// Chitenge/Kitenge Spiral Pattern
export const ChitengeSpiralPattern: React.FC<PatternProps> = ({
  className = '',
  primaryColor = 'currentColor',
  secondaryColor = 'currentColor',
  size = 60,
  opacity = 0.15
}) => (
  <svg
    className={`absolute inset-0 w-full h-full ${className}`}
    style={{ opacity }}
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="chitenge-spiral" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
        {/* Main spiral */}
        <path
          d={`M${size/2},${size/2}
             m0,${-size/6}
             a${size/6},${size/6} 0 1,1 ${-size/8},${size/8}
             a${size/4},${size/4} 0 1,0 ${size/4},${size/4}
             a${size/3},${size/3} 0 1,1 ${-size/3},${size/3}
             a${size/2.5},${size/2.5} 0 1,0 ${size/2.5},${-size/5}`}
          stroke={primaryColor}
          strokeWidth="1.5"
          fill="none"
        />

        {/* Corner decorative elements */}
        <circle cx={size/6} cy={size/6} r={size/12} stroke={secondaryColor} strokeWidth="1" fill="none" />
        <circle cx={size*5/6} cy={size/6} r={size/12} stroke={secondaryColor} strokeWidth="1" fill="none" />
        <circle cx={size/6} cy={size*5/6} r={size/12} stroke={secondaryColor} strokeWidth="1" fill="none" />
        <circle cx={size*5/6} cy={size*5/6} r={size/12} stroke={secondaryColor} strokeWidth="1" fill="none" />

        {/* Center dot */}
        <circle cx={size/2} cy={size/2} r={size/15} fill={primaryColor} />
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#chitenge-spiral)" />
  </svg>
);

// Export a component that combines multiple patterns for a rich background
export const AfricanBackground: React.FC<{
  pattern?: 'zigzag' | 'kente' | 'adire' | 'mudcloth' | 'adinkra' | 'tribal' |
            'chitenge-geometric' | 'chitenge-floral' | 'chitenge-wave' | 'chitenge-spiral';
  primaryColor?: string;
  secondaryColor?: string;
  opacity?: number;
  className?: string;
}> = ({
  pattern = 'kente',
  primaryColor = 'currentColor',
  secondaryColor = 'currentColor',
  opacity = 0.1,
  className = ''
}) => {
  const patternMap = {
    // Traditional patterns
    zigzag: ZigzagPattern,
    kente: KentePattern,
    adire: AdirePattern,
    mudcloth: MudclothPattern,
    adinkra: AdinkraPattern,
    tribal: TribalPattern,

    // Chitenge/Kitenge patterns
    'chitenge-geometric': ChitengeGeometricPattern,
    'chitenge-floral': ChitengeFloralPattern,
    'chitenge-wave': ChitengeWavePattern,
    'chitenge-spiral': ChitengeSpiralPattern
  };

  const PatternComponent = patternMap[pattern];

  return (
    <PatternComponent
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      opacity={opacity}
      className={className}
    />
  );
};
