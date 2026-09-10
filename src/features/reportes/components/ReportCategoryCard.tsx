import React from 'react';
import { ReportCategory } from '../../../types/reports';

interface ReportCategoryCardProps {
  category: ReportCategory;
}

export const ReportCategoryCard: React.FC<ReportCategoryCardProps> = ({ category }) => {
  const renderIcon = (type: ReportCategory['iconoType']) => {
    switch (type) {
      case 'gestion':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" fill="#e8f5e9" />
            <path d="M9 12h6M9 16h6" />
          </svg>
        );
      case 'animales':
        return (
          <svg viewBox="0 0 100 100" width="28" height="28" style={{ flexShrink: 0 }}>
            <path d="M25 35c0-10 10-15 25-10 15-5 25 0 25 10c0 10-5 18-10 22c-3 3-5 12-15 12s-12-9-15-12c-5-4-10-12-10-22z" fill="#2d6a4f" stroke="#2d6a4f" strokeWidth="4" fillOpacity="0.1" />
            <path d="M26 38c-5 0-8 3-6 7c2 4 6 0 7-1" fill="#2d6a4f" stroke="#2d6a4f" strokeWidth="4" />
            <path d="M74 38c5 0 8 3 6 7c-2 4-6 0-7-1" fill="#2d6a4f" stroke="#2d6a4f" strokeWidth="4" />
            <path d="M32 27c-2-6-8-9-10-9" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M68 27c2-6 8-9 10-9" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        );
      case 'historicos':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" fill="#e8f5e9" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      case 'multirebanos':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M3 20V11l5-4 5 4v9" fill="#fce8e6" />
            <path d="M3 20V11l5-4 5 4v9" />
            <path d="M8 20v-5h3v5" />
            <path d="M12 20v-4l4-3 5 3v4" fill="#fee2e2" />
            <path d="M12 20v-4l4-3 5 3v4" />
          </svg>
        );
    }
  };

  return (
    <div className="category-card">
      <div className="category-card-header">
        {renderIcon(category.iconoType)}
        <span className="category-card-title">{category.titulo}</span>
      </div>

      <div className="category-links-list">
        {category.reportes.map(rep => (
          <button
            key={rep}
            type="button"
            className="category-link"
            style={{ background: 'none', border: 'none', textAlign: 'left', font: 'inherit', cursor: 'pointer', padding: 0 }}
            onClick={() => alert(`Generando reporte: ${rep}`)}
          >
            <span className="category-link-chevron">&gt;</span>
            <span>{rep}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
