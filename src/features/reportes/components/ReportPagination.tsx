import React from 'react';

export interface ReportPaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export const ReportPagination: React.FC<ReportPaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  pageSize = 10,
  onPageChange,
  onPageSizeChange
}) => {
  // Generar lista de números de páginas visibles
  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages.length > 0 ? pages : [1];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="table-footer" style={{ marginTop: 12 }}>
      <div className="pagination-controls">
        <button
          type="button"
          className={`pagination-btn ${currentPage <= 1 ? 'disabled' : ''}`}
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          title="Primera página"
        >
          |&lt;
        </button>
        <button
          type="button"
          className={`pagination-btn ${currentPage <= 1 ? 'disabled' : ''}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          title="Página anterior"
        >
          &lt;
        </button>

        {visiblePages.map(page => (
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
          className={`pagination-btn ${currentPage >= totalPages ? 'disabled' : ''}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          title="Página siguiente"
        >
          &gt;
        </button>
        <button
          type="button"
          className={`pagination-btn ${currentPage >= totalPages ? 'disabled' : ''}`}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          title="Última página"
        >
          &gt;|
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-secondary)' }}>
            <span>Mostrar:</span>
            <select
              className="form-control"
              style={{ padding: '2px 8px', fontSize: 12 }}
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
        <div className="pagination-summary">
          Página {currentPage} de {totalPages || 1} ({totalRecords} registros)
        </div>
      </div>
    </div>
  );
};
