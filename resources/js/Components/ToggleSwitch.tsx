import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: 'yellow' | 'green' | 'indigo';
}

export default function ToggleSwitch({
  checked,
  onChange,
  color = 'indigo',
}: ToggleSwitchProps) {
  const colorMap: Record<string, string> = {
    yellow: 'bg-yellow-400',
    green: 'bg-green-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`w-10 h-6 bg-gray-600 rounded-full transition-colors duration-300 ${checked ? colorMap[color] : ''}`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </div>
    </label>
  );
}
