import React from 'react';
import { EventCategory } from '../../../types/events';

interface EventCategoryCardProps {
  category: EventCategory;
}

export const EventCategoryCard: React.FC<EventCategoryCardProps> = ({ category }) => {
  const renderIcon = (type: EventCategory['iconoType']) => {
    switch (type) {
      case 'reproductivos':
        return (
          <svg viewBox="0 0 100 100" width="28" height="28" style={{ flexShrink: 0 }}>
            <path d="M25 35c0-10 10-15 25-10 15-5 25 0 25 10c0 10-5 18-10 22c-3 3-5 12-15 12s-12-9-15-12c-5-4-10-12-10-22z" fill="#5c3d2e" stroke="#2d6a4f" strokeWidth="4" />
            <path d="M26 38c-5 0-8 3-6 7c2 4 6 0 7-1" fill="#5c3d2e" stroke="#2d6a4f" strokeWidth="4" />
            <path d="M74 38c5 0 8 3 6 7c-2 4-6 0-7-1" fill="#5c3d2e" stroke="#2d6a4f" strokeWidth="4" />
            <path d="M32 27c-2-6-8-9-10-9" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M68 27c2-6 8-9 10-9" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        );
      case 'productivos':
        return (
          <svg viewBox="0 0 100 100" width="28" height="28" style={{ flexShrink: 0 }}>
            <path d="M25 35c0-10 10-15 25-10 15-5 25 0 25 10c0 10-5 18-10 22c-3 3-5 12-15 12s-12-9-15-12c-5-4-10-12-10-22z" fill="#f0e6d2" stroke="#2d6a4f" strokeWidth="4" />
            <path d="M26 38c-5 0-8 3-6 7c2 4 6 0 7-1" fill="#f0e6d2" stroke="#2d6a4f" strokeWidth="4" />
            <path d="M74 38c5 0 8 3 6 7c-2 4-6 0-7-1" fill="#f0e6d2" stroke="#2d6a4f" strokeWidth="4" />
            <path d="M32 27c-2-6-8-9-10-9" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M68 27c2-6 8-9 10-9" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        );
      case 'inventarios':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" fill="#e8f5e9" />
            <path d="M9 12h6M9 16h6" />
          </svg>
        );
      case 'veterinarios':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" fill="#fee2e2" />
            <path d="M12 8v8M8 12h8" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      case 'otros':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#2d6a4f" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" fill="#e8f5e9" />
            <circle cx="8" cy="12" r="1" fill="#2d6a4f" stroke="#2d6a4f" />
            <circle cx="12" cy="12" r="1" fill="#2d6a4f" stroke="#2d6a4f" />
            <circle cx="16" cy="12" r="1" fill="#2d6a4f" stroke="#2d6a4f" />
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
        {category.enlaces.map(link => (
          <button
            key={link}
            type="button"
            className="category-link"
            style={{ background: 'none', border: 'none', textAlign: 'left', font: 'inherit', cursor: 'pointer', padding: 0 }}
            onClick={() => alert(`Acción: Registrar evento ${link}`)}
          >
            <span className="category-link-chevron">&gt;</span>
            <span>{link}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
