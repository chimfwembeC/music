import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useAfricanTheme } from '@/Context/AfricanThemeContext';
import PatternCustomizer, { PatternConfig } from '@/Components/African/PatternCustomizer';
import SavedPatterns from '@/Components/African/SavedPatterns';
import AfricanCard from '@/Components/African/AfricanCard';
import { Palette, Sliders, Save } from 'lucide-react';
import AfricanButton from '@/Components/African/AfricanButton';

export default function PatternCustomizerDemo() {
  const { themeVariant } = useAfricanTheme();
  const [savedPatterns, setSavedPatterns] = useState<PatternConfig[]>([]);
  const [currentPattern, setCurrentPattern] = useState<PatternConfig | null>(null);

  // Load saved patterns from localStorage on mount
  useEffect(() => {
    const savedPatternsJson = localStorage.getItem('africanPatterns');
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
    localStorage.setItem('africanPatterns', JSON.stringify(savedPatterns));
  }, [savedPatterns]);

  // Handle saving a new pattern
  const handleSavePattern = (pattern: PatternConfig) => {
    setSavedPatterns(prev => [...prev, pattern]);
    setCurrentPattern(pattern);
  };

  // Handle deleting a pattern
  const handleDeletePattern = (index: number) => {
    setSavedPatterns(prev => prev.filter((_, i) => i !== index));
  };

  // Handle applying a saved pattern
  const handleApplyPattern = (pattern: PatternConfig) => {
    setCurrentPattern(pattern);
  };

  return (
    <AppLayout
      title="Pattern Customizer"
      renderHeader={() => (
        <h2 className="font-display text-2xl text-gray-800 dark:text-gray-200 leading-tight">
          African Pattern Customizer
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
                Pattern Customizer Tool
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 font-body">
                Create and customize African-inspired patterns with this interactive tool.
                Adjust colors, size, and opacity to create unique patterns for your designs.
                Save your favorite patterns for later use.
              </p>
              <div className="mb-4">
                <AfricanButton
                  onClick={() => window.location.href = '/pattern-customizer'}
                  variant="primary"
                  className="flex items-center"
                >
                  <Sliders className="mr-2 h-4 w-4" />
                  Try Advanced Pattern Customizer
                </AfricanButton>
              </div>
            </div>
          </AfricanCard>

          {/* Pattern Customizer */}
          <div className="mb-8">
            <PatternCustomizer
              onSave={handleSavePattern}
            />
          </div>

          {/* Saved Patterns */}
          <SavedPatterns
            patterns={savedPatterns}
            onDelete={handleDeletePattern}
            onApply={handleApplyPattern}
            className="mb-8"
          />

          {/* Usage Examples */}
          {currentPattern && (
            <AfricanCard className="p-8 mb-8" bordered>
              <h2 className="text-2xl font-display font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                <Sliders className="mr-3 h-6 w-6" />
                Pattern Usage Examples
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Card Example */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Card Background</h3>
                  <div
                    className="rounded-xl overflow-hidden shadow-md p-6 relative"
                    style={{ backgroundColor: currentPattern.backgroundColor }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundSize: `${currentPattern.size}px`,
                        opacity: currentPattern.opacity,
                      }}
                    >
                      <div className="w-full h-full" style={{ backgroundColor: currentPattern.backgroundColor }}>
                        <div className="absolute inset-0">
                          <AfricanCard
                            withPattern
                            patternType={currentPattern.pattern}
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold mb-2">Card Title</h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        This is an example of how your custom pattern would look as a card background.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Header Example */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Header Background</h3>
                  <div className="rounded-xl overflow-hidden shadow-md">
                    <div
                      className="h-32 relative"
                      style={{ backgroundColor: currentPattern.backgroundColor }}
                    >
                      <div className="absolute inset-0">
                        <AfricanCard
                          withPattern
                          patternType={currentPattern.pattern}
                          className="w-full h-full"
                        />
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
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">CSS Code</h3>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto text-sm">
                  {`/* CSS for the custom pattern */
.custom-pattern {
  background-color: ${currentPattern.backgroundColor};
  background-size: ${currentPattern.size}px;
  background-repeat: repeat;
  position: relative;
}

.custom-pattern::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("YOUR_SVG_PATTERN_URL");
  opacity: ${currentPattern.opacity};
}`}
                </pre>
              </div>
            </AfricanCard>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
