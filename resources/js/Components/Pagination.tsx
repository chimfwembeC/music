import React from 'react'


export function Pagination({
    page,
    totalPages,
    setPage,
  }: {
    page: number;
    totalPages: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
  }) {
    const loadMoreComments = () => {
      if (page < totalPages) {
        setPage((prevPage) => prevPage + 1);
      }
    };
  
    return (
      <button
        onClick={loadMoreComments}
        className="text-blue-500 text-xs mt-4"
      >
        Load More Comments
      </button>
    );
  }
  