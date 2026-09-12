import React, { useState, useRef, useEffect } from 'react';

interface AnimalesToolbarProps {
  quickFilter?: string;
  onQuickFilterChange?: (filter: string) => void;
  onOpenFilterDrawer?: () => void;
  activeFilterCount?: number;
}

const QUICK_FILTER_OPTIONS = [
  'Todos los animales',
  'Vacas',
  'Novillas',
  'Mautas / Mautes',
  'Becerros / Becerras',
  'Toros',
  'Activos',
  'Inactivos'
];

export const AnimalesToolbar: React.FC<AnimalesToolbarProps> = ({
  quickFilter = 'Todos los animales',
  onQuickFilterChange,
  onOpenFilterDrawer,
  activeFilterCount = 0
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectOption = (option: string) => {
    onQuickFilterChange?.(option);
    setIsDropdownOpen(false);
  };

  return (
    <div className="animals-toolbar">
      <div className="toolbar-left">
        <h2 className="toolbar-title">Animales</h2>

        {/* Selector Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <div
            className="selector-dropdown"
            onClick={() => setIsDropdownOpen(prev => !prev)}
            role="button"
            tabIndex={0}
            title="Seleccionar filtro rápido"
          >
            <span>{quickFilter}</span>
            {/* Star Icon Outline in Green */}
            <svg className="star-icon" viewBox="0 0 24 24" width="16" height="16">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {/* Down Chevron */}
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{
                transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease'
              }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          {/* Floating Dropdown Menu */}
          {isDropdownOpen && (
            <div className="selector-dropdown-menu">
              {QUICK_FILTER_OPTIONS.map(opt => (
                <div
                  key={opt}
                  className={`selector-dropdown-item ${opt === quickFilter ? 'active' : ''}`}
                  onClick={() => handleSelectOption(opt)}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter Button Group (Blue) */}
        <div className="filter-btn-group" title="Filtros avanzados">
          <button
            className="filter-main-btn"
            title="Filtros avanzados"
            type="button"
            onClick={onOpenFilterDrawer}
          >
            {/* Funnel Icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
            {activeFilterCount > 0 && (
              <span
                style={{
                  marginLeft: 6,
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  borderRadius: 10,
                  padding: '1px 6px',
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: '14px'
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            className="filter-chevron-btn"
            type="button"
            title="Ver filtros"
            onClick={onOpenFilterDrawer}
          >
            {/* Down Chevron */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="toolbar-right">
        {/* Action Icons */}
        <button className="action-icon-btn" title="Nuevo Documento" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </button>
        <button className="action-icon-btn" title="Eliminar" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
        <button className="action-icon-btn" title="Recargar" type="button" onClick={() => window.location.reload()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
        </button>
        <button className="action-icon-btn" title="Exportar" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </button>

        {/* Green Plus Circle Button */}
        <button className="add-circle-btn" title="Agregar Animal" type="button" onClick={() => alert('Modal para registrar nuevo semoviente')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Vertical Options Dots */}
        <button className="action-icon-btn" title="Opciones" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>
    </div>
  );
};

