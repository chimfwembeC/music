import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useAfricanTheme } from '@/Context/AfricanThemeContext';
import EnhancedPatternCustomizer from '@/Components/African/EnhancedPatternCustomizer';
import SavedPatterns from '@/Components/African/SavedPatterns';
import AfricanCard from '@/Components/African/AfricanCard';
import AfricanButton from '@/Components/African/AfricanButton';
import { PatternConfig } from '@/Components/African/PatternCustomizer';
import { Palette, Sliders, Save, Layers, RotateCcw, Move, Eye } from 'lucide-react';

export interface EnhancedPatternConfig extends PatternConfig {
  name?: string;
  category?: string;
  layers?: PatternConfig[];
  rotation?: number;
  positionX?: number;
  positionY?: number;
  blendMode?: string;
  scale?: number;
  flipX?: boolean;
  flipY?: boolean;
}

export default function PatternCustomizer() {
  const { themeVariant } = useAfricanTheme();
  const [savedPatterns, setSavedPatterns] = useState<EnhancedPatternConfig[]>([]);
  const [currentPattern, setCurrentPattern] = useState<EnhancedPatternConfig | null>(null);
  const [previewMode, setPreviewMode] = useState<'card' | 'header' | 'button' | 'fullscreen'>('card');
  
  // Load saved patterns from localStorage on mount
  useEffect(() => {
    const savedPatternsJson = localStorage.getItem('africanEnhancedPatterns');
    if (savedPatternsJson) {
      try {
        const patterns = JSON.parse(savedPatternsJson);
        setSavedPatterns(patterns);
      } catch (e) {
        console.error('Failed to parse saved patterns', e);
      }
    }
  }, []);
  
  // Save patterns to localStorage when they change
  useEffect(() => {
    localStorage.setItem('africanEnhancedPatterns', JSON.stringify(savedPatterns));
  }, [savedPatterns]);
  
  // Handle saving a new pattern
  const handleSavePattern = (pattern: EnhancedPatternConfig) => {
    setSavedPatterns(prev => [...prev, pattern]);
    setCurrentPattern(pattern);
  };
  
  // Handle deleting a pattern
  const handleDeletePattern = (index: number) => {
    setSavedPatterns(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle applying a saved pattern
  const handleApplyPattern = (pattern: EnhancedPatternConfig) => {
    setCurrentPattern(pattern);
  };

  // Toggle preview mode
  const togglePreviewMode = (mode: 'card' | 'header' | 'button' | 'fullscreen') => {
    setPreviewMode(mode);
  };
  
  return (
    <AppLayout
      title="Advanced Pattern Customizer"
      renderHeader={() => (
        <h2 className="font-display text-2xl text-gray-800 dark:text-gray-200 leading-tight">
          Advanced African Pattern Customizer
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Introduction */}
          <AfricanCard className="p-8 mb-8" withPattern bordered>
            <div className="max-w-3xl">
              <h1 className="text-4xl font-display font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <Palette className="mr-3 h-8 w-8" />
                Advanced Pattern Customizer
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 font-body">
                Create and customize complex African-inspired patterns with this advanced tool. 
                Layer multiple patterns, adjust rotation, scale, and position to create unique designs.
                Save your favorite patterns for later use.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <AfricanButton 
                  variant={previewMode === 'card' ? 'primary' : 'outline'} 
                  onClick={() => togglePreviewMode('card')}
                  className="flex items-center"
                >
                  <Sliders className="mr-2 h-4 w-4" />
                  Card Preview
                </AfricanButton>
                
                <AfricanButton 
                  variant={previewMode === 'header' ? 'primary' : 'outline'} 
                  onClick={() => togglePreviewMode('header')}
                  className="flex items-center"
                >
                  <Layers className="mr-2 h-4 w-4" />
                  Header Preview
                </AfricanButton>
                
                <AfricanButton 
                  variant={previewMode === 'button' ? 'primary' : 'outline'} 
                  onClick={() => togglePreviewMode('button')}
                  className="flex items-center"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Button Preview
                </AfricanButton>
                
                <AfricanButton 
                  variant={previewMode === 'fullscreen' ? 'primary' : 'outline'} 
                  onClick={() => togglePreviewMode('fullscreen')}
                  className="flex items-center"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Fullscreen Preview
                </AfricanButton>
              </div>
            </div>
          </AfricanCard>
          
          {/* Enhanced Pattern Customizer */}
          <div className="mb-8">
            <EnhancedPatternCustomizer 
              onSave={handleSavePattern}
              previewMode={previewMode}
              initialPattern={currentPattern}
            />
          </div>
          
          {/* Saved Patterns */}
          <SavedPatterns 
            patterns={savedPatterns}
            onDelete={handleDeletePattern}
            onApply={handleApplyPattern}
            className="mb-8"
          />
        </div>
      </div>
    </AppLayout>
  );
}
