import React from 'react';
import { AfricanBackground } from '@/theme/africanPatterns';
import AfricanCard from './AfricanCard';
import AfricanButton from './AfricanButton';
import { Trash2, Copy, Check, FileDown, Tag, Layers } from 'lucide-react';
import { PatternConfig } from './PatternCustomizer';
import { EnhancedPatternConfig } from '@/Pages/PatternCustomizer';
import { exportPatternAsSVG, generatePatternCSS } from '@/utils/patternExporter';

interface SavedPatternsProps {
  patterns: (PatternConfig | EnhancedPatternConfig)[];
  onDelete: (index: number) => void;
  onApply: (pattern: PatternConfig | EnhancedPatternConfig) => void;
  className?: string;
}

const SavedPatterns: React.FC<SavedPatternsProps> = ({
  patterns,
  onDelete,
  onApply,
  className = '',
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  // Copy pattern CSS
  const copyPatternCSS = (pattern: PatternConfig, index: number) => {
    const css = generatePatternCSS(pattern);

    navigator.clipboard.writeText(css).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  // Export pattern as SVG
  const exportAsSVG = (pattern: PatternConfig) => {
    exportPatternAsSVG(pattern);
  };

  if (patterns.length === 0) {
    return null;
  }

  // Function to check if a pattern is an enhanced pattern
  const isEnhancedPattern = (pattern: PatternConfig | EnhancedPatternConfig): pattern is EnhancedPatternConfig => {
    return 'name' in pattern || 'layers' in pattern;
  };

  // Function to get pattern name
  const getPatternName = (pattern: PatternConfig | EnhancedPatternConfig): string => {
    if (isEnhancedPattern(pattern) && pattern.name) {
      return pattern.name;
    }
    return pattern.pattern.replace(/-/g, ' ');
  };

  // Function to get pattern category
  const getPatternCategory = (pattern: PatternConfig | EnhancedPatternConfig): string => {
    if (isEnhancedPattern(pattern) && pattern.category) {
      return pattern.category;
    }
    return 'Default';
  };

  // Function to check if pattern has layers
  const hasLayers = (pattern: PatternConfig | EnhancedPatternConfig): boolean => {
    return isEnhancedPattern(pattern) && pattern.layers && pattern.layers.length > 0;
  };

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">Saved Patterns</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {patterns.map((pattern, index) => (
          <AfricanCard key={index} className="overflow-hidden" bordered>
            <div className="relative h-32">
              <div
                className="absolute inset-0 w-full h-full"
                style={{ backgroundColor: pattern.backgroundColor }}
              >
                {/* Base pattern */}
                <div
                  className="absolute inset-0"
                  style={{
                    transform: isEnhancedPattern(pattern) ?
                      `rotate(${pattern.rotation || 0}deg) scale(${pattern.scale || 1}) ${pattern.flipX ? 'scaleX(-1)' : ''} ${pattern.flipY ? 'scaleY(-1)' : ''}` : 'none',
                    transformOrigin: 'center',
                    left: isEnhancedPattern(pattern) ? `${pattern.positionX || 0}%` : '0',
                    top: isEnhancedPattern(pattern) ? `${pattern.positionY || 0}%` : '0',
                    mixBlendMode: (isEnhancedPattern(pattern) && pattern.blendMode) as any || 'normal'
                  }}
                >
                  <AfricanBackground
                    pattern={pattern.pattern as any}
                    primaryColor={pattern.primaryColor}
                    secondaryColor={pattern.secondaryColor}
                    opacity={pattern.opacity}
                  />
                </div>

                {/* Additional layers */}
                {hasLayers(pattern) && (pattern as EnhancedPatternConfig).layers?.map((layer, layerIndex) => (
                  <div
                    key={layerIndex}
                    className="absolute inset-0"
                    style={{
                      transform: `rotate(${layer.rotation || 0}deg) scale(${layer.scale || 1}) ${layer.flipX ? 'scaleX(-1)' : ''} ${layer.flipY ? 'scaleY(-1)' : ''}`,
                      transformOrigin: 'center',
                      left: `${layer.positionX || 0}%`,
                      top: `${layer.positionY || 0}%`,
                      mixBlendMode: (layer.blendMode as any) || 'normal'
                    }}
                  >
                    <AfricanBackground
                      pattern={layer.pattern as any}
                      primaryColor={layer.primaryColor}
                      secondaryColor={layer.secondaryColor || pattern.secondaryColor}
                      opacity={layer.opacity}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium">
                  {getPatternName(pattern)}
                </div>
                {hasLayers(pattern) && (
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Layers size={12} className="mr-1" />
                    {(pattern as EnhancedPatternConfig).layers?.length}
                  </div>
                )}
              </div>

              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                <Tag size={12} className="mr-1" />
                {getPatternCategory(pattern)}
              </div>

              <div className="flex flex-wrap gap-1">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-700"
                  style={{ backgroundColor: pattern.backgroundColor }}
                  title="Background color"
                />
                <div
                  className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-700"
                  style={{ backgroundColor: pattern.primaryColor }}
                  title="Primary color"
                />
                <div
                  className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-700"
                  style={{ backgroundColor: pattern.secondaryColor }}
                  title="Secondary color"
                />
              </div>
              <div className="flex justify-between mt-3">
                <AfricanButton
                  onClick={() => onApply(pattern)}
                  variant="primary"
                  size="sm"
                >
                  Apply
                </AfricanButton>
                <div className="flex gap-1">
                  <button
                    onClick={() => copyPatternCSS(pattern, index)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="Copy CSS"
                  >
                    {copiedIndex === index ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => exportAsSVG(pattern)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="Export SVG"
                  >
                    <FileDown size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(index)}
                    className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    title="Delete pattern"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </AfricanCard>
        ))}
      </div>
    </div>
  );
};

export default SavedPatterns;
