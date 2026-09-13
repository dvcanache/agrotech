import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportCategory } from '../../../types/reports';

interface ReportCategoryCardProps {
  category: ReportCategory;
  isHighlighted?: boolean;
  onSelectReport?: (reportName: string, category: ReportCategory) => void;
}

const REPORT_ROUTES_MAP: Record<string, string> = {
  // Gestión
  'Inventarios': '/reports/inventories',
  'Movimientos': '/reports/movements',
  'Distribución normal': '/reports/historics/normaldistribution',
  'Técnicos': '/reports/technicians',
  'Reproductores': '/reports/breeders',

  // Animales / Bovinos
  'Vientres': '/reports/dams',
  'Vientres y Producción Lechera': '/reports/dams',
  'Próximas a secar': '/reports/nexttodry',
  'Próximas a parir': '/reports/nexttobirth',
  'Próximas a Parir / Secar': '/reports/nexttobirth',
  'Próximas a revisar': '/reports/nexttocheck',
  'Animales secos': '/reports/drycows',
  'Animales lactando': '/reports/cowsinproduction',
  'Animales criando': '/reports/cowsraising',
  'No Vientres': '/reports/nodams',

  // Históricos
  'Historia de reproducciones': '/reports/historics/reproductions',
  'Historia de lactancias': '/reports/historics/lactations',
  'Historia de pesajes de leche': '/reports/historics/milks',
  'Historia de crecimientos': '/reports/historics/weighings',

  // Multirebaños
  'Inventario multirebaño': '/reports/multiherds/inventories',
  'Situación reproductiva actual': '/reports/multiherds/reproduction',
  'Distribución por preñez': '/reports/multiherds/pregnancy-distribution',
  'Situación productiva actual': '/reports/multiherds/production-status',
  'Transacciones': '/reports/multiherds/transactions',
  'Producciones diarias': '/reports/multiherds/daily-production'
};

export const ReportCategoryCard: React.FC<ReportCategoryCardProps> = ({
  category,
  isHighlighted = false,
  onSelectReport
}) => {
  const navigate = useNavigate();

  const handleReportClick = (rep: string) => {
    const route = REPORT_ROUTES_MAP[rep];
    if (route) {
      navigate(route);
    } else if (onSelectReport) {
      onSelectReport(rep, category);
    } else {
      alert(`Generando reporte: ${rep}`);
    }
  };

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
      case 'bovinos':
        return (
          <svg viewBox="0 0 100 100" width="28" height="28" style={{ flexShrink: 0 }}>
            <path d="M25 35c0-10 10-15 25-10 15-5 25 0 25 10c0 10-5 18-10 22c-3 3-5 12-15 12s-12-9-15-12c-5-4-10-12-10-22z" fill="#2d6a4f" stroke="#2d6a4f" strokeWidth="4" fillOpacity="0.1" />
            <path d="M26 38c-5 0-8 3-6 7c2 4 6 0 7-1" fill="#2d6a4f" stroke="#2d6a4f" strokeWidth="4" />
            <path d="M74 38c5 0 8 3 6 7c-2 4-6 0-7-1" fill="#2d6a4f" stroke="#2d6a4f" strokeWidth="4" />
            <path d="M32 27c-2-6-8-9-10-9" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M68 27c2-6 8-9 10-9" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        );
      case 'aves':
        return (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M12 2a7 7 0 0 0-7 7c0 4.5 4 8 7 12 3-4 7-7.5 7-12a7 7 0 0 0-7-7z" fill="#fef3c7" />
            <circle cx="12" cy="9" r="2" fill="#d97706" />
            <path d="M9 14s1.5 2 3 2 3-2 3-2" />
          </svg>
        );
      case 'porcinos':
        return (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#db2777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="9" fill="#fdf2f8" />
            <ellipse cx="12" cy="13" rx="4" ry="2.5" fill="#fce7f3" stroke="#db2777" strokeWidth="1.5" />
            <circle cx="10.5" cy="13" r="0.75" fill="#db2777" />
            <circle cx="13.5" cy="13" r="0.75" fill="#db2777" />
            <circle cx="8" cy="9" r="1" fill="#db2777" />
            <circle cx="16" cy="9" r="1" fill="#db2777" />
            <path d="M5 6l3 2M19 6l-3 2" stroke="#db2777" strokeWidth="1.5" />
          </svg>
        );
      case 'bufalos':
        return (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M3 8c1-4 6-6 9-3 3-3 8-1 9 3-2 4-5 8-9 8-4 0-7-4-9-8z" fill="#f1f5f9" />
            <path d="M4 6c-2 2-2 5 0 7M20 6c2 2 2 5 0 7" stroke="#334155" strokeWidth="2" />
            <circle cx="9" cy="11" r="1" fill="#334155" />
            <circle cx="15" cy="11" r="1" fill="#334155" />
          </svg>
        );
      case 'caprinos':
        return (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M7 3c2 2 3 5 3 7m7-7c-2 2-3 5-3 7" stroke="#059669" strokeWidth="2" />
            <path d="M12 9c-3 0-5 2-5 5 0 4 3 7 5 7s5-3 5-7c0-3-2-5-5-5z" fill="#ecfdf5" />
            <circle cx="10" cy="13" r="1" fill="#059669" />
            <circle cx="14" cy="13" r="1" fill="#059669" />
            <path d="M12 17v2" stroke="#059669" strokeWidth="1.5" />
          </svg>
        );
      case 'equinos':
        return (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M19 19c-1-5-3-9-7-11-2-1-4-1-6 1l-2 5c-1 3 1 6 4 6h11z" fill="#fff7ed" />
            <path d="M10 8c1-2 3-3 5-3" stroke="#7c2d12" strokeWidth="1.5" />
            <circle cx="9" cy="12" r="1" fill="#7c2d12" />
            <path d="M14 18v2M18 18v2" stroke="#7c2d12" strokeWidth="2" />
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
    <div
      className={`category-card ${isHighlighted ? 'category-card-highlighted' : ''}`}
      style={
        isHighlighted
          ? {
              border: '2px solid var(--primary-color)',
              boxShadow: '0 6px 18px rgba(45, 106, 79, 0.16)',
              backgroundColor: '#f8fdf9'
            }
          : undefined
      }
    >
      <div
        className="category-card-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {renderIcon(category.iconoType)}
          <div>
            <span className="category-card-title">{category.titulo}</span>
            {category.subtitulo && (
              <span style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)' }}>
                {category.subtitulo}
              </span>
            )}
          </div>
        </div>

        {isHighlighted && (
          <span
            style={{
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 12,
              letterSpacing: '0.04em'
            }}
          >
            Especie Activa
          </span>
        )}
      </div>

      <div className="category-links-list">
        {category.reportes.map(rep => (
          <button
            key={rep}
            type="button"
            className="category-link"
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              font: 'inherit',
              cursor: 'pointer',
              padding: '3px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              width: '100%'
            }}
            onClick={() => handleReportClick(rep)}
          >
            <span className="category-link-chevron" style={{ color: isHighlighted ? 'var(--primary-color)' : undefined }}>
              &gt;
            </span>
            <span style={{ fontSize: 12.5, color: '#334155' }}>{rep}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
