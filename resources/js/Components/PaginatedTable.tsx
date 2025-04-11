import React, { useState, ReactNode } from 'react';

interface PaginatedTableProps<T> {
  items: T[];
  itemsPerPage?: number;
  renderRow: (item: T, index: number) => ReactNode;
  headers: ReactNode;
}

export default function PaginatedTable<T>({
  items,
  itemsPerPage = 10,
  renderRow,
  headers,
}: PaginatedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  return (
    <div className="overflow-x-auto rounded-lg shadow-md bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 uppercase text-xs">
          <tr>{headers}</tr>
        </thead>
        <tbody>
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td
                colSpan={100}
                className="text-center px-4 py-6 text-gray-500 dark:text-gray-400"
              >
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
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
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
