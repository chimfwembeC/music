import React, { useState, useEffect } from 'react';
import { useAfricanTheme } from '@/Context/AfricanThemeContext';
import { AfricanBackground } from '@/theme/africanPatterns';
import AfricanButton from './AfricanButton';
import AfricanCard from './AfricanCard';
import { Sliders, Copy, Download, Check, FileDown } from 'lucide-react';
import { exportPatternAsSVG, generatePatternCSS } from '@/utils/patternExporter';

interface PatternCustomizerProps {
  className?: string;
  onSave?: (config: PatternConfig) => void;
}

export interface PatternConfig {
  pattern: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  size: number;
  opacity: number;
}

const PatternCustomizer: React.FC<PatternCustomizerProps> = ({
  className = '',
  onSave
}) => {
  const { themeVariant, patternType } = useAfricanTheme();

  // Pattern configuration state
  const [config, setConfig] = useState<PatternConfig>({
    pattern: patternType,
    primaryColor: getDefaultPrimaryColor(),
    secondaryColor: getDefaultSecondaryColor(),
    backgroundColor: '#ffffff',
    size: 50,
    opacity: 0.2,
  });

  // Copy success state
  const [copied, setCopied] = useState(false);

  // Update default colors when theme changes
  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      primaryColor: getDefaultPrimaryColor(),
      secondaryColor: getDefaultSecondaryColor(),
    }));
  }, [themeVariant]);

  // Get default primary color based on current theme
  function getDefaultPrimaryColor(): string {
    const colorMap: Record<string, string> = {
      earth: '#FF6724', // clay
      kente: '#FF9500', // gold
      ankara: '#9747FF', // purple
      chitenge: '#6366F1', // indigo
      ndebele: '#FA5252', // red
    };

    return colorMap[themeVariant] || '#FF9500';
  }

  // Get default secondary color based on current theme
  function getDefaultSecondaryColor(): string {
    const colorMap: Record<string, string> = {
      earth: '#D06A3A', // terracotta
      kente: '#44B81F', // green
      ankara: '#00E6CE', // teal
      chitenge: '#06B6D4', // turquoise
      ndebele: '#2196F3', // blue
    };

    return colorMap[themeVariant] || '#44B81F';
  }

  // Pattern options grouped by theme
  const patternOptions = [
    { group: 'Traditional', options: [
      { value: 'kente', label: 'Kente' },
      { value: 'adire', label: 'Adire' },
      { value: 'mudcloth', label: 'Mud Cloth' },
      { value: 'adinkra', label: 'Adinkra' },
      { value: 'tribal', label: 'Tribal' },
      { value: 'zigzag', label: 'Zigzag' },
    ]},
    { group: 'Chitenge', options: [
      { value: 'chitenge-geometric', label: 'Geometric' },
      { value: 'chitenge-floral', label: 'Floral' },
      { value: 'chitenge-wave', label: 'Wave' },
      { value: 'chitenge-spiral', label: 'Spiral' },
    ]},
    { group: 'Ndebele', options: [
      { value: 'ndebele-geometric', label: 'Geometric' },
      { value: 'ndebele-zigzag', label: 'Zigzag' },
      { value: 'ndebele-triangular', label: 'Triangular' },
      { value: 'ndebele-step', label: 'Step' },
    ]},
  ];

  // Handle pattern change
  const handlePatternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfig({ ...config, pattern: e.target.value });
  };

  // Handle color change
  const handleColorChange = (key: 'primaryColor' | 'secondaryColor' | 'backgroundColor', value: string) => {
    setConfig({ ...config, [key]: value });
  };

  // Handle slider change
  const handleSliderChange = (key: 'size' | 'opacity', value: number) => {
    setConfig({ ...config, [key]: value });
  };

  // Copy configuration as CSS
  const copyAsCSS = () => {
    const css = generatePatternCSS(config);

    navigator.clipboard.writeText(css).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Export pattern as SVG
  const exportAsSVG = () => {
    exportPatternAsSVG(config);
  };

  // Save configuration
  const saveConfig = () => {
    if (onSave) {
      onSave(config);
    }
  };

  return (
    <div className={`${className}`}>
      <AfricanCard className="overflow-hidden" bordered elevated>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Preview Area */}
          <div className="md:col-span-1 relative h-64 md:h-full">
            <div
              className="absolute inset-0 w-full h-full"
              style={{ backgroundColor: config.backgroundColor }}
            >
              <AfricanBackground
                pattern={config.pattern as any}
                primaryColor={config.primaryColor}
                secondaryColor={config.secondaryColor}
                opacity={config.opacity}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="md:col-span-2 p-6">
            <div className="flex items-center mb-4">
              <Sliders className="mr-2 h-5 w-5" />
              <h3 className="text-lg font-semibold">Pattern Customizer</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pattern Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Pattern</label>
                <select
                  value={config.pattern}
                  onChange={handlePatternChange}
                  className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                >
                  {patternOptions.map(group => (
                    <optgroup key={group.group} label={group.group}>
                      {group.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-sm font-medium mb-1">Background Color</label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={config.backgroundColor}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="h-9 w-9 rounded-md border-gray-300 mr-2"
                  />
                  <input
                    type="text"
                    value={config.backgroundColor}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm"
                  />
                </div>
              </div>

              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium mb-1">Primary Color</label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="h-9 w-9 rounded-md border-gray-300 mr-2"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-medium mb-1">Secondary Color</label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="h-9 w-9 rounded-md border-gray-300 mr-2"
                  />
                  <input
                    type="text"
                    value={config.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm"
                  />
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Size: {config.size}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={config.size}
                  onChange={(e) => handleSliderChange('size', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Opacity */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Opacity: {config.opacity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.01"
                  value={config.opacity}
                  onChange={(e) => handleSliderChange('opacity', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-6">
              <AfricanButton
                onClick={copyAsCSS}
                variant="primary"
                className="flex items-center"
              >
                {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy CSS'}
              </AfricanButton>

              <AfricanButton
                onClick={exportAsSVG}
                variant="outline"
                className="flex items-center"
              >
                <FileDown className="mr-1 h-4 w-4" />
                Export SVG
              </AfricanButton>

              <AfricanButton
                onClick={saveConfig}
                variant="secondary"
                className="flex items-center"
              >
                <Download className="mr-1 h-4 w-4" />
                Save Pattern
              </AfricanButton>
            </div>
          </div>
        </div>
      </AfricanCard>
    </div>
  );
};

export default PatternCustomizer;
