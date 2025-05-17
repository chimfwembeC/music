import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useAfricanTheme } from '@/Context/AfricanThemeContext';
import AfricanButton from '@/Components/African/AfricanButton';
import AfricanCard from '@/Components/African/AfricanCard';
import AfricanInput from '@/Components/African/AfricanInput';
import PatternBackground from '@/Components/African/PatternBackground';
import { AfricanBackground } from '@/theme/africanPatterns';
import { Music, Play, Heart, Download, User, Headphones, Settings } from 'lucide-react';

export default function AfricanThemeDemo() {
  const { themeVariant, patternType } = useAfricanTheme();

  return (
    <AppLayout
      title="African Theme Demo"
      renderHeader={() => (
        <h2 className="font-display text-2xl text-gray-800 dark:text-gray-200 leading-tight">
          African-Inspired Design System
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Introduction */}
          <PatternBackground
            className="p-8 mb-8 rounded-xl"
            variant="primary"
            opacity={0.05}
          >
            <div className="max-w-3xl">
              <h1 className="text-4xl font-display font-bold mb-4 text-gray-900 dark:text-white">
                African-Inspired Design System
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 font-body">
                This design system incorporates colors, patterns, and typography inspired by
                traditional African art, textiles, and cultural elements. The system includes
                four main themes: <span className="font-semibold">Earth</span> (inspired by Sahel region),
                <span className="font-semibold"> Kente</span> (inspired by West African textiles),
                <span className="font-semibold"> Ankara</span> (inspired by vibrant African prints),
                and <span className="font-semibold"> Chitenge</span> (inspired by East African textiles).
              </p>
              <div className="flex flex-wrap gap-3">
                <AfricanButton size="lg">Current Theme: {themeVariant}</AfricanButton>
                <AfricanButton size="lg" variant="secondary">Current Pattern: {patternType}</AfricanButton>
              </div>
            </div>
          </PatternBackground>

          {/* Color Palette Section */}
          <AfricanCard className="p-8 mb-8" withPattern bordered>
            <h2 className="text-2xl font-display font-bold mb-6 text-gray-900 dark:text-white">
              Color Palette
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Primary Colors</h3>
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-clay-500 dark:bg-clay-400 flex items-center px-4 text-white">
                    Earth: Clay
                  </div>
                  <div className="h-12 rounded-md bg-kente-gold-500 dark:bg-kente-gold-400 flex items-center px-4 text-gray-900">
                    Kente: Gold
                  </div>
                  <div className="h-12 rounded-md bg-ankara-purple-500 dark:bg-ankara-purple-400 flex items-center px-4 text-white">
                    Ankara: Purple
                  </div>
                  <div className="h-12 rounded-md bg-chitenge-indigo-500 dark:bg-chitenge-indigo-400 flex items-center px-4 text-white">
                    Chitenge: Indigo
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Secondary Colors</h3>
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-terracotta-500 dark:bg-terracotta-400 flex items-center px-4 text-white">
                    Earth: Terracotta
                  </div>
                  <div className="h-12 rounded-md bg-kente-green-500 dark:bg-kente-green-400 flex items-center px-4 text-white">
                    Kente: Green
                  </div>
                  <div className="h-12 rounded-md bg-ankara-teal-500 dark:bg-ankara-teal-400 flex items-center px-4 text-white">
                    Ankara: Teal
                  </div>
                  <div className="h-12 rounded-md bg-chitenge-turquoise-500 dark:bg-chitenge-turquoise-400 flex items-center px-4 text-white">
                    Chitenge: Turquoise
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Accent Colors</h3>
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-sand-500 dark:bg-sand-400 flex items-center px-4 text-gray-900">
                    Earth: Sand
                  </div>
                  <div className="h-12 rounded-md bg-kente-red-500 dark:bg-kente-red-400 flex items-center px-4 text-white">
                    Kente: Red
                  </div>
                  <div className="h-12 rounded-md bg-ankara-orange-500 dark:bg-ankara-orange-400 flex items-center px-4 text-white">
                    Ankara: Orange
                  </div>
                  <div className="h-12 rounded-md bg-chitenge-magenta-500 dark:bg-chitenge-magenta-400 flex items-center px-4 text-white">
                    Chitenge: Magenta
                  </div>
                </div>
              </div>
            </div>
          </AfricanCard>

          {/* Chitenge Patterns Section */}
          <AfricanCard className="p-8 mb-8" variant="primary" withPattern patternType="chitenge-geometric" bordered>
            <h2 className="text-2xl font-display font-bold mb-6 text-gray-900 dark:text-white">
              Chitenge Patterns
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">About Chitenge/Kitenge</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Chitenge (also known as Kitenge) is a traditional East and Central African textile known for its
                  vibrant colors, bold patterns, and cultural significance. These textiles feature geometric designs,
                  floral motifs, and symbolic patterns that tell stories and represent cultural identity.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Pattern Styles</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative h-24 rounded-md bg-white dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                    <AfricanBackground pattern="chitenge-geometric" primaryColor="#6366F1" secondaryColor="#22D3EE" opacity={0.2} />
                    <span className="relative z-10 font-medium text-sm">Geometric</span>
                  </div>
                  <div className="relative h-24 rounded-md bg-white dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                    <AfricanBackground pattern="chitenge-floral" primaryColor="#6366F1" secondaryColor="#EC4899" opacity={0.2} />
                    <span className="relative z-10 font-medium text-sm">Floral</span>
                  </div>
                  <div className="relative h-24 rounded-md bg-white dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                    <AfricanBackground pattern="chitenge-wave" primaryColor="#6366F1" secondaryColor="#22D3EE" opacity={0.2} />
                    <span className="relative z-10 font-medium text-sm">Wave</span>
                  </div>
                  <div className="relative h-24 rounded-md bg-white dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                    <AfricanBackground pattern="chitenge-spiral" primaryColor="#6366F1" secondaryColor="#EC4899" opacity={0.2} />
                    <span className="relative z-10 font-medium text-sm">Spiral</span>
                  </div>
                </div>
              </div>
            </div>
          </AfricanCard>

          {/* Typography Section */}
          <AfricanCard className="p-8 mb-8" variant="secondary" withPattern bordered>
            <h2 className="text-2xl font-display font-bold mb-6 text-gray-900 dark:text-white">
              Typography
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Display Font (Montserrat)</h3>
                <div className="space-y-3">
                  <p className="font-display text-4xl">Heading 1</p>
                  <p className="font-display text-3xl">Heading 2</p>
                  <p className="font-display text-2xl">Heading 3</p>
                  <p className="font-display text-xl">Heading 4</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Body Font (Rubik)</h3>
                <div className="space-y-3">
                  <p className="font-body text-base">Regular paragraph text with <strong>bold emphasis</strong> and <em>italic styling</em> for better readability and hierarchy in the content.</p>
                  <p className="font-body text-sm">Smaller text for secondary information and supporting content.</p>
                  <p className="font-accent text-xl">Accent font (Caveat) for special elements</p>
                </div>
              </div>
            </div>
          </AfricanCard>

          {/* Components Section */}
          <AfricanCard className="p-8 mb-8" variant="accent" withPattern bordered>
            <h2 className="text-2xl font-display font-bold mb-6 text-gray-900 dark:text-white">
              Components
            </h2>

            <div className="space-y-8">
              {/* Buttons */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Buttons</h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  <AfricanButton>Primary Button</AfricanButton>
                  <AfricanButton variant="secondary">Secondary Button</AfricanButton>
                  <AfricanButton variant="accent">Accent Button</AfricanButton>
                  <AfricanButton variant="outline">Outline Button</AfricanButton>
                  <AfricanButton variant="ghost">Ghost Button</AfricanButton>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  <AfricanButton size="sm">Small Button</AfricanButton>
                  <AfricanButton>Medium Button</AfricanButton>
                  <AfricanButton size="lg">Large Button</AfricanButton>
                </div>
                <div className="flex flex-wrap gap-3">
                  <AfricanButton withPattern><Play className="mr-2 h-4 w-4" /> With Icon</AfricanButton>
                  <AfricanButton variant="secondary" withPattern><Heart className="mr-2 h-4 w-4" /> With Icon</AfricanButton>
                  <AfricanButton variant="accent" withPattern><Download className="mr-2 h-4 w-4" /> With Icon</AfricanButton>
                </div>
              </div>

              {/* Inputs */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Inputs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Input</label>
                    <AfricanInput placeholder="Enter your name" fullWidth />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Input</label>
                    <AfricanInput variant="primary" placeholder="Enter your email" fullWidth />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secondary Input</label>
                    <AfricanInput variant="secondary" placeholder="Enter your phone" fullWidth />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Error Input</label>
                    <AfricanInput error placeholder="This field has an error" fullWidth />
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <AfricanCard className="p-4" bordered>
                    <div className="flex items-center mb-3">
                      <Music className="h-5 w-5 mr-2" />
                      <h4 className="font-medium">Default Card</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">A simple card with border.</p>
                  </AfricanCard>

                  <AfricanCard className="p-4" variant="primary" withPattern bordered>
                    <div className="flex items-center mb-3">
                      <Headphones className="h-5 w-5 mr-2" />
                      <h4 className="font-medium">Primary Card with Pattern</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Card with background pattern.</p>
                  </AfricanCard>

                  <AfricanCard className="p-4" variant="secondary" elevated>
                    <div className="flex items-center mb-3">
                      <User className="h-5 w-5 mr-2" />
                      <h4 className="font-medium">Elevated Card</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Card with elevation (shadow).</p>
                  </AfricanCard>
                </div>
              </div>
            </div>
          </AfricanCard>
        </div>
      </div>
    </AppLayout>
  );
}
