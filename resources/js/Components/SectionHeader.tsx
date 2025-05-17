import React from 'react';
import { Link } from '@inertiajs/react';

interface SectionHeaderProps {
  title: string;
  viewAllLink?: string;
  viewAllText?: string;
  children?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  viewAllLink, 
  viewAllText = 'View All', 
  children 
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <div className="flex items-center space-x-4">
        {children}
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
          >
            {viewAllText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
