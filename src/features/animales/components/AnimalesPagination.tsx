import React from 'react';

interface AnimalesPaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pages: number[];
  onPageChange: (page: number) => void;
}

export const AnimalesPagination: React.FC<AnimalesPaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  pages,
  onPageChange
}) => {
  return (
    <div className="table-footer">
      <div className="pagination-controls">
        <button
          type="button"
          className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="Primera Página"
        >
          |&lt;
        </button>
        <button
          type="button"
          className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Página Anterior"
        >
          &lt;
        </button>

        {pages.map(page => (
          <button
            key={page}
            type="button"
            className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Página Siguiente"
        >
          &gt;
        </button>
        <button
          type="button"
          className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Última Página"
        >
          &gt;|
        </button>
      </div>

      <div className="pagination-summary">
        Página {currentPage} de {totalPages} ({totalRecords} registros)
      </div>
    </div>
  );
};
