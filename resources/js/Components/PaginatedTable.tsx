import React, { useState } from 'react';
import ToggleSwitch from '@/Components/ToggleSwitch';
import get from 'lodash/get';

type ColumnType = 'text' | 'toggle' | 'custom';

interface Column<T> {
  label: string;
  key?: string;
  type?: ColumnType;
  onToggle?: (id: number, newValue: boolean) => void;
  render?: (item: T) => React.ReactNode;
}

interface Props<T> {
  items: T[];
  itemsPerPage?: number;
  columns: Column<T>[];
  getRowId: (item: T) => number;
}

export default function PaginatedTable<T>({
  items,
  itemsPerPage = 10,
  columns,
  getRowId,
}: Props<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase text-xs">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-4 py-3">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item, idx) => (
              <tr key={getRowId(item)} className={idx % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}>
                {columns.map((col, i) => {
                  const id = getRowId(item);

                  if (col.type === 'toggle' && col.key) {
                    const value = get(item, col.key) as boolean;
                    return (
                      <td key={i} className="px-4 py-3">
                        <ToggleSwitch
                          checked={value}
                          onChange={(checked) => col.onToggle?.(id, checked)}
                          color={col.label === 'Published' ? 'green' : 'yellow'}
                        />
                      </td>
                    );
                  }

                  if (col.type === 'custom' && col.render) {
                    return (
                      <td key={i} className="px-4 py-3">
                        {col.render(item)}
                      </td>
                    );
                  }

                  return (
                    <td key={i} className="px-4 py-3">
                      {col.key ? get(item, col.key) ?? '—' : ''}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center px-4 py-6 text-gray-500 dark:text-gray-400">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
