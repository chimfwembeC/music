import React, { useState } from "react";
import { Palette, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAfricanTheme } from "@/Context/AfricanThemeContext";

const AfricanThemeToggle: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { themeVariant, setThemeVariant, patternType, setPatternType } = useAfricanTheme();

  const themeOptions = [
    { value: 'kente', label: 'Kente', description: 'Vibrant West African' },
    { value: 'earth', label: 'Earth', description: 'Earthy Sahel tones' },
    { value: 'ankara', label: 'Ankara', description: 'Bold textile prints' },
    { value: 'chitenge', label: 'Chitenge', description: 'East African textiles' },
    { value: 'ndebele', label: 'Ndebele', description: 'South African geometric' },
  ];

  const patternOptions = [
    { value: 'kente', label: 'Kente Pattern' },
    { value: 'adire', label: 'Adire Pattern' },
    { value: 'mudcloth', label: 'Mud Cloth' },
    { value: 'adinkra', label: 'Adinkra Symbols' },
    { value: 'tribal', label: 'Tribal Pattern' },
    { value: 'zigzag', label: 'Zigzag Pattern' },
    { value: 'chitenge-geometric', label: 'Chitenge Geometric' },
    { value: 'chitenge-floral', label: 'Chitenge Floral' },
    { value: 'chitenge-wave', label: 'Chitenge Wave' },
    { value: 'chitenge-spiral', label: 'Chitenge Spiral' },
    { value: 'ndebele-geometric', label: 'Ndebele Geometric' },
    { value: 'ndebele-zigzag', label: 'Ndebele Zigzag' },
    { value: 'ndebele-triangular', label: 'Ndebele Triangular' },
    { value: 'ndebele-step', label: 'Ndebele Step' },
  ];

  const handleThemeChange = (variant: 'earth' | 'kente' | 'ankara' | 'chitenge' | 'ndebele') => {
    setThemeVariant(variant);
    setOpen(false);
  };

  const handlePatternChange = (pattern: string) => {
    setPatternType(pattern);
    setOpen(false);
  };

  // Get theme color based on current variant
  const getThemeColor = () => {
    switch (themeVariant) {
      case 'earth':
        return 'text-clay-500 dark:text-clay-400';
      case 'kente':
        return 'text-kente-gold-500 dark:text-kente-gold-400';
      case 'ankara':
        return 'text-ankara-purple-500 dark:text-ankara-purple-400';
      case 'chitenge':
        return 'text-chitenge-indigo-500 dark:text-chitenge-indigo-400';
      case 'ndebele':
        return 'text-ndebele-red-600 dark:text-ndebele-red-500';
      default:
        return 'text-kente-gold-500 dark:text-kente-gold-400';
    }
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Palette size={20} className={getThemeColor()} />
        <span className="capitalize">Theme</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50"
          >
            <div className="py-2 px-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-3 py-2">
                Color Theme
              </h3>
              <div className="space-y-1">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleThemeChange(option.value as 'earth' | 'kente' | 'ankara' | 'chitenge' | 'ndebele')}
                    className={`flex items-center justify-between w-full px-3 py-2 text-left rounded-md ${
                      themeVariant === option.value
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </span>
                    </div>
                    {themeVariant === option.value && (
                      <div className={`w-3 h-3 rounded-full ${
                        option.value === 'earth' ? 'bg-clay-500 dark:bg-clay-400' :
                        option.value === 'kente' ? 'bg-kente-gold-500 dark:bg-kente-gold-400' :
                        option.value === 'ankara' ? 'bg-ankara-purple-500 dark:bg-ankara-purple-400' :
                        option.value === 'chitenge' ? 'bg-chitenge-indigo-500 dark:bg-chitenge-indigo-400' :
                        'bg-ndebele-red-600 dark:bg-ndebele-red-500'
                      }`} />
                    )}
                  </button>
                ))}
              </div>

              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-3 py-2 mt-3">
                Pattern Style
              </h3>
              <div className="grid grid-cols-2 gap-1">
                {patternOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePatternChange(option.value)}
                    className={`px-3 py-2 text-sm text-left rounded-md ${
                      patternType === option.value
                        ? 'bg-gray-100 dark:bg-gray-700 font-medium'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AfricanThemeToggle;
