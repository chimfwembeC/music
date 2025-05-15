// components/StatCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';
import classNames from 'classnames';

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  bgColor?: string;
  iconBgColor?: string;
}

export default function StatCard({
  icon: Icon,
  value,
  label,
  bgColor = 'bg-gray-200 dark:bg-purple-800',
  iconBgColor = 'bg-purple-600',
}: StatCardProps) {
  return (
    <div
      className={classNames(
        bgColor,
        'relative p-4 rounded-2xl overflow-hidden shadow-md'
      )}
    >
      {/* Animated Blobby SVG */}
      <svg
        className="absolute -top-10 -right-10 w-40 h-40 text-white dark:text-purple-300 opacity-10 animate-spin-slow"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M43.3,-63.2C58.5,-55.9,74.6,-46.2,77.4,-33.1C80.3,-20,69.9,-3.6,62.5,13.4C55.1,30.5,50.6,48.3,39.8,59.8C28.9,71.2,11.5,76.3,-2.9,78.7C-17.3,81,-34.6,80.5,-48.6,72.7C-62.6,64.9,-73.2,49.8,-76.7,33.9C-80.2,18.1,-76.6,1.6,-71.6,-12.4C-66.6,-26.4,-60.3,-37.9,-50.8,-45.9C-41.2,-54,-28.4,-58.6,-15.1,-64.2C-1.8,-69.9,12,-76.5,24.3,-74.4C36.5,-72.3,47.1,-61.4,43.3,-63.2Z"
          transform="translate(100 100)"
        />
      </svg>

      <div className="flex justify-between items-center relative z-10">
        <div className="text-3xl dark:text-gray-200 font-semibold">
          <span>{value}</span>
        </div>
        <div
          className={classNames(
            iconBgColor,
            'rounded-xl h-10 w-10 flex justify-center items-center shadow'
          )}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="border border-gray-300 dark:border-purple-500 -mx-4 mt-4 opacity-30"></div>

      <div className="text-md mt-2 font-bold relative dark:text-gray-200 z-10">
        {label}
      </div>
    </div>
  );
}
