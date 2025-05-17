import React, { useState, useEffect } from 'react';
import { useAfricanTheme } from '@/Context/AfricanThemeContext';
import { AfricanBackground } from '@/theme/africanPatterns';
import AfricanButton from './AfricanButton';
import AfricanCard from './AfricanCard';
import { PatternConfig } from './PatternCustomizer';
import { EnhancedPatternConfig } from '@/Pages/PatternCustomizer';
import { exportPatternAsSVG, generatePatternCSS } from '@/utils/patternExporter';
import {
  Sliders, Copy, Download, Check, FileDown, Plus, Trash2,
  RotateCcw, Move, Layers, Save, Eye, Maximize, Minimize,
  ChevronUp, ChevronDown, FlipHorizontal, FlipVertical
} from 'lucide-react';

interface EnhancedPatternCustomizerProps {
  className?: string;
  onSave?: (config: EnhancedPatternConfig) => void;
  previewMode?: 'card' | 'header' | 'button' | 'fullscreen';
  initialPattern?: EnhancedPatternConfig | null;
}

const EnhancedPatternCustomizer: React.FC<EnhancedPatternCustomizerProps> = ({
  className = '',
  onSave,
  previewMode = 'card',
  initialPattern = null
}) => {
  const { themeVariant, patternType } = useAfricanTheme();

  // Base pattern configuration state
  const [config, setConfig] = useState<EnhancedPatternConfig>({
    name: 'Untitled Pattern',
    category: 'Custom',
    pattern: patternType,
    primaryColor: getDefaultPrimaryColor(),
    secondaryColor: getDefaultSecondaryColor(),
    backgroundColor: '#ffffff',
    size: 50,
    opacity: 0.2,
    layers: [],
    rotation: 0,
    positionX: 0,
    positionY: 0,
    blendMode: 'normal',
    scale: 1,
    flipX: false,
    flipY: false
  });

  // Initialize with initial pattern if provided
  useEffect(() => {
    if (initialPattern) {
      setConfig(initialPattern);
    }
  }, [initialPattern]);

  // Copy success state
  const [copied, setCopied] = useState(false);

  // Active layer index
  const [activeLayerIndex, setActiveLayerIndex] = useState<number>(-1); // -1 means base pattern

  // Layer panel expanded state
  const [layerPanelExpanded, setLayerPanelExpanded] = useState(true);

  // Transform panel expanded state
  const [transformPanelExpanded, setTransformPanelExpanded] = useState(true);

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

  // Blend mode options
  const blendModeOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'multiply', label: 'Multiply' },
    { value: 'screen', label: 'Screen' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'darken', label: 'Darken' },
    { value: 'lighten', label: 'Lighten' },
    { value: 'color-dodge', label: 'Color Dodge' },
    { value: 'color-burn', label: 'Color Burn' },
    { value: 'hard-light', label: 'Hard Light' },
    { value: 'soft-light', label: 'Soft Light' },
    { value: 'difference', label: 'Difference' },
    { value: 'exclusion', label: 'Exclusion' },
  ];

  // Handle pattern change
  const handlePatternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (activeLayerIndex === -1) {
      setConfig({ ...config, pattern: e.target.value });
    } else {
      const updatedLayers = [...(config.layers || [])];
      updatedLayers[activeLayerIndex] = {
        ...updatedLayers[activeLayerIndex],
        pattern: e.target.value
      };
      setConfig({ ...config, layers: updatedLayers });
    }
  };

  // Handle color change
  const handleColorChange = (key: 'primaryColor' | 'secondaryColor' | 'backgroundColor', value: string) => {
    if (activeLayerIndex === -1) {
      setConfig({ ...config, [key]: value });
    } else {
      const updatedLayers = [...(config.layers || [])];
      updatedLayers[activeLayerIndex] = {
        ...updatedLayers[activeLayerIndex],
        [key]: value
      };
      setConfig({ ...config, layers: updatedLayers });
    }
  };

  // Handle slider change
  const handleSliderChange = (key: 'size' | 'opacity' | 'rotation' | 'positionX' | 'positionY' | 'scale', value: number) => {
    if (activeLayerIndex === -1) {
      setConfig({ ...config, [key]: value });
    } else {
      const updatedLayers = [...(config.layers || [])];
      updatedLayers[activeLayerIndex] = {
        ...updatedLayers[activeLayerIndex],
        [key]: value
      };
      setConfig({ ...config, layers: updatedLayers });
    }
  };

  // Handle blend mode change
  const handleBlendModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (activeLayerIndex === -1) {
      setConfig({ ...config, blendMode: e.target.value });
    } else {
      const updatedLayers = [...(config.layers || [])];
      updatedLayers[activeLayerIndex] = {
        ...updatedLayers[activeLayerIndex],
        blendMode: e.target.value
      };
      setConfig({ ...config, layers: updatedLayers });
    }
  };

  // Handle flip change
  const handleFlipChange = (axis: 'flipX' | 'flipY') => {
    if (activeLayerIndex === -1) {
      setConfig({ ...config, [axis]: !config[axis] });
    } else {
      const updatedLayers = [...(config.layers || [])];
      updatedLayers[activeLayerIndex] = {
        ...updatedLayers[activeLayerIndex],
        [axis]: !updatedLayers[activeLayerIndex][axis]
      };
      setConfig({ ...config, layers: updatedLayers });
    }
  };

  // Add a new layer
  const addLayer = () => {
    const newLayer: PatternConfig = {
      pattern: 'kente',
      primaryColor: getDefaultPrimaryColor(),
      secondaryColor: getDefaultSecondaryColor(),
      backgroundColor: 'transparent',
      size: 40,
      opacity: 0.15,
    };

    setConfig({
      ...config,
      layers: [...(config.layers || []), newLayer]
    });

    // Set the new layer as active
    setActiveLayerIndex((config.layers || []).length);
  };

  // Remove a layer
  const removeLayer = (index: number) => {
    const updatedLayers = [...(config.layers || [])];
    updatedLayers.splice(index, 1);

    setConfig({
      ...config,
      layers: updatedLayers
    });

    // Reset active layer if the active one was removed
    if (activeLayerIndex === index) {
      setActiveLayerIndex(-1);
    } else if (activeLayerIndex > index) {
      setActiveLayerIndex(activeLayerIndex - 1);
    }
  };

  // Move layer up
  const moveLayerUp = (index: number) => {
    if (index <= 0) return;

    const updatedLayers = [...(config.layers || [])];
    const temp = updatedLayers[index];
    updatedLayers[index] = updatedLayers[index - 1];
    updatedLayers[index - 1] = temp;

    setConfig({
      ...config,
      layers: updatedLayers
    });

    // Update active layer index
    if (activeLayerIndex === index) {
      setActiveLayerIndex(index - 1);
    } else if (activeLayerIndex === index - 1) {
      setActiveLayerIndex(index);
    }
  };

  // Move layer down
  const moveLayerDown = (index: number) => {
    if (!config.layers || index >= config.layers.length - 1) return;

    const updatedLayers = [...config.layers];
    const temp = updatedLayers[index];
    updatedLayers[index] = updatedLayers[index + 1];
    updatedLayers[index + 1] = temp;

    setConfig({
      ...config,
      layers: updatedLayers
    });

    // Update active layer index
    if (activeLayerIndex === index) {
      setActiveLayerIndex(index + 1);
    } else if (activeLayerIndex === index + 1) {
      setActiveLayerIndex(index);
    }
  };

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, name: e.target.value });
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, category: e.target.value });
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

  // Get the active pattern configuration
  const getActivePattern = (): PatternConfig => {
    if (activeLayerIndex === -1) {
      return config;
    } else {
      return (config.layers || [])[activeLayerIndex];
    }
  };

  const activePattern = getActivePattern();

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
              {/* Base pattern */}
              <div
                className="absolute inset-0"
                style={{
                  transform: `rotate(${config.rotation}deg) scale(${config.scale}) ${config.flipX ? 'scaleX(-1)' : ''} ${config.flipY ? 'scaleY(-1)' : ''}`,
                  transformOrigin: 'center',
                  left: `${config.positionX}%`,
                  top: `${config.positionY}%`,
                  mixBlendMode: config.blendMode as any
                }}
              >
                <AfricanBackground
                  pattern={config.pattern as any}
                  primaryColor={config.primaryColor}
                  secondaryColor={config.secondaryColor}
                  opacity={config.opacity}
                />
              </div>

              {/* Additional layers */}
              {config.layers && config.layers.map((layer, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 ${activeLayerIndex === index ? 'ring-2 ring-primary-500' : ''}`}
                  style={{
                    transform: `rotate(${layer.rotation || 0}deg) scale(${layer.scale || 1}) ${layer.flipX ? 'scaleX(-1)' : ''} ${layer.flipY ? 'scaleY(-1)' : ''}`,
                    transformOrigin: 'center',
                    left: `${layer.positionX || 0}%`,
                    top: `${layer.positionY || 0}%`,
                    mixBlendMode: (layer.blendMode as any) || 'normal'
                  }}
                  onClick={() => setActiveLayerIndex(index)}
                >
                  <AfricanBackground
                    pattern={layer.pattern as any}
                    primaryColor={layer.primaryColor}
                    secondaryColor={layer.secondaryColor || config.secondaryColor}
                    opacity={layer.opacity}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="md:col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Sliders className="mr-2 h-5 w-5" />
                <h3 className="text-lg font-semibold">Advanced Pattern Customizer</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {activeLayerIndex === -1 ? 'Base Pattern' : `Layer ${activeLayerIndex + 1}`}
                </span>
              </div>
            </div>

            {/* Pattern Name and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Pattern Name</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={handleNameChange}
                  className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  value={config.category}
                  onChange={handleCategoryChange}
                  className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                />
              </div>
            </div>

            {/* Layer Management */}
            <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <div
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 cursor-pointer"
                onClick={() => setLayerPanelExpanded(!layerPanelExpanded)}
              >
                <div className="flex items-center">
                  <Layers className="mr-2 h-4 w-4" />
                  <h4 className="font-medium">Layers</h4>
                </div>
                {layerPanelExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {layerPanelExpanded && (
                <div className="p-3">
                  <div className="flex flex-col space-y-2 max-h-40 overflow-y-auto">
                    {/* Base layer */}
                    <div
                      className={`flex items-center justify-between p-2 rounded ${activeLayerIndex === -1 ? 'bg-primary-100 dark:bg-primary-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      onClick={() => setActiveLayerIndex(-1)}
                    >
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: config.primaryColor }}
                        />
                        <span>Base Pattern ({config.pattern})</span>
                      </div>
                    </div>

                    {/* Additional layers */}
                    {config.layers && config.layers.map((layer, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2 rounded ${activeLayerIndex === index ? 'bg-primary-100 dark:bg-primary-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        onClick={() => setActiveLayerIndex(index)}
                      >
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: layer.primaryColor }}
                          />
                          <span>Layer {index + 1} ({layer.pattern})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); moveLayerUp(index); }}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            disabled={index === 0}
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveLayerDown(index); }}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            disabled={!config.layers || index === config.layers.length - 1}
                          >
                            <ChevronDown size={14} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeLayer(index); }}
                            className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3">
                    <AfricanButton
                      onClick={addLayer}
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add Layer
                    </AfricanButton>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pattern Properties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Pattern Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">Pattern</label>
              <select
                value={activePattern.pattern}
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

            {/* Background Color - only for base pattern */}
            {activeLayerIndex === -1 && (
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
            )}

            {/* Primary Color */}
            <div>
              <label className="block text-sm font-medium mb-1">Primary Color</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={activePattern.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="h-9 w-9 rounded-md border-gray-300 mr-2"
                />
                <input
                  type="text"
                  value={activePattern.primaryColor}
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
                  value={activePattern.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="h-9 w-9 rounded-md border-gray-300 mr-2"
                />
                <input
                  type="text"
                  value={activePattern.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="flex-1 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm"
                />
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Size: {activePattern.size}px
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={activePattern.size}
                onChange={(e) => handleSliderChange('size', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Opacity */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Opacity: {activePattern.opacity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.01"
                value={activePattern.opacity}
                onChange={(e) => handleSliderChange('opacity', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Blend Mode */}
            <div>
              <label className="block text-sm font-medium mb-1">Blend Mode</label>
              <select
                value={activePattern.blendMode || 'normal'}
                onChange={handleBlendModeChange}
                className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              >
                {blendModeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transformation Controls */}
          <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-md">
            <div
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 cursor-pointer"
              onClick={() => setTransformPanelExpanded(!transformPanelExpanded)}
            >
              <div className="flex items-center">
                <Move className="mr-2 h-4 w-4" />
                <h4 className="font-medium">Transformations</h4>
              </div>
              {transformPanelExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {transformPanelExpanded && (
              <div className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Rotation */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Rotation: {activePattern.rotation || 0}°
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={activePattern.rotation || 0}
                      onChange={(e) => handleSliderChange('rotation', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Scale */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Scale: {(activePattern.scale || 1).toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={activePattern.scale || 1}
                      onChange={(e) => handleSliderChange('scale', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Position X */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Position X: {activePattern.positionX || 0}%
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={activePattern.positionX || 0}
                      onChange={(e) => handleSliderChange('positionX', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Position Y */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Position Y: {activePattern.positionY || 0}%
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={activePattern.positionY || 0}
                      onChange={(e) => handleSliderChange('positionY', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Flip Controls */}
                  <div className="md:col-span-2 flex space-x-4">
                    <button
                      onClick={() => handleFlipChange('flipX')}
                      className={`flex items-center px-3 py-1 rounded ${activePattern.flipX ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
                    >
                      <FlipHorizontal className="mr-1 h-4 w-4" />
                      Flip Horizontal
                    </button>
                    <button
                      onClick={() => handleFlipChange('flipY')}
                      className={`flex items-center px-3 py-1 rounded ${activePattern.flipY ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
                    >
                      <FlipVertical className="mr-1 h-4 w-4" />
                      Flip Vertical
                    </button>
                  </div>
                </div>
              </div>
            )}
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
              <Save className="mr-1 h-4 w-4" />
              Save Pattern
            </AfricanButton>
          </div>
        </div>
      </AfricanCard>

      {/* Pattern Preview Section */}
      {previewMode === 'card' && (
        <AfricanCard className="mt-6 p-6" bordered>
          <h3 className="text-lg font-semibold mb-4">Card Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="rounded-xl overflow-hidden shadow-md p-6 relative"
              style={{ backgroundColor: config.backgroundColor }}
            >
              <div className="absolute inset-0">
                <AfricanBackground
                  pattern={config.pattern as any}
                  primaryColor={config.primaryColor}
                  secondaryColor={config.secondaryColor}
                  opacity={config.opacity}
                />

                {config.layers && config.layers.map((layer, index) => (
                  <div
                    key={index}
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
                      secondaryColor={layer.secondaryColor || config.secondaryColor}
                      opacity={layer.opacity}
                    />
                  </div>
                ))}
              </div>
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-2">Card Title</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  This is an example of how your custom pattern would look as a card background.
                </p>
              </div>
            </div>
          </div>
        </AfricanCard>
      )}

      {previewMode === 'header' && (
        <AfricanCard className="mt-6 p-6" bordered>
          <h3 className="text-lg font-semibold mb-4">Header Preview</h3>
          <div className="rounded-xl overflow-hidden shadow-md">
            <div
              className="h-32 relative"
              style={{ backgroundColor: config.backgroundColor }}
            >
              <div className="absolute inset-0">
                <AfricanBackground
                  pattern={config.pattern as any}
                  primaryColor={config.primaryColor}
                  secondaryColor={config.secondaryColor}
                  opacity={config.opacity}
                />

                {config.layers && config.layers.map((layer, index) => (
                  <div
                    key={index}
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
                      secondaryColor={layer.secondaryColor || config.secondaryColor}
                      opacity={layer.opacity}
                    />
                  </div>
                ))}
              </div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <h4 className="text-2xl font-bold text-white drop-shadow-md">
                  Website Header
                </h4>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4">
              <p className="text-gray-700 dark:text-gray-300">
                Content area below the patterned header.
              </p>
            </div>
          </div>
        </AfricanCard>
      )}

      {previewMode === 'button' && (
        <AfricanCard className="mt-6 p-6" bordered>
          <h3 className="text-lg font-semibold mb-4">Button Preview</h3>
          <div className="flex flex-wrap gap-4">
            <button
              className="px-4 py-2 rounded-md text-white font-medium relative overflow-hidden"
              style={{ backgroundColor: config.primaryColor }}
            >
              <div className="absolute inset-0">
                <AfricanBackground
                  pattern={config.pattern as any}
                  primaryColor={config.secondaryColor}
                  secondaryColor="white"
                  opacity={0.2}
                />

                {config.layers && config.layers.map((layer, index) => (
                  <div
                    key={index}
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
                      primaryColor="white"
                      secondaryColor="white"
                      opacity={0.1}
                    />
                  </div>
                ))}
              </div>
              <span className="relative z-10">Primary Button</span>
            </button>

            <button
              className="px-4 py-2 rounded-md text-white font-medium relative overflow-hidden"
              style={{ backgroundColor: config.secondaryColor }}
            >
              <div className="absolute inset-0">
                <AfricanBackground
                  pattern={config.pattern as any}
                  primaryColor="white"
                  secondaryColor="white"
                  opacity={0.2}
                />
              </div>
              <span className="relative z-10">Secondary Button</span>
            </button>
          </div>
        </AfricanCard>
      )}

      {previewMode === 'fullscreen' && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="relative w-full max-w-4xl h-[80vh] rounded-lg overflow-hidden">
            <div
              className="absolute inset-0"
              style={{ backgroundColor: config.backgroundColor }}
            >
              <div className="absolute inset-0">
                <AfricanBackground
                  pattern={config.pattern as any}
                  primaryColor={config.primaryColor}
                  secondaryColor={config.secondaryColor}
                  opacity={config.opacity}
                />

                {config.layers && config.layers.map((layer, index) => (
                  <div
                    key={index}
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
                      secondaryColor={layer.secondaryColor || config.secondaryColor}
                      opacity={layer.opacity}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg"
              onClick={() => setPreviewMode('card')}
            >
              <Minimize className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedPatternCustomizer;
