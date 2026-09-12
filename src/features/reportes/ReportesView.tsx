import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronDown, Filter, Search, ExternalLink, Trash2, FileText, CheckCircle2 } from 'lucide-react';
import { REPORT_CATEGORIES } from './reportesData';
import { ReportCategoryCard } from './components/ReportCategoryCard';
import { NuevoReporteModal, ReporteItem } from './components/NuevoReporteModal';
import { DetalleReporteModal } from './components/DetalleReporteModal';

const INITIAL_REPORTS: ReporteItem[] = [
  {
    id: 'rep-1',
    codigo: 'RPT-001',
    nombre: 'Censo e Inventario General del Hato',
    descripcion: 'Consolidado de animales clasificados por categoría zootécnica, edad y lote actual.',
    categoria: 'Gestión',
    plantillaBase: 'Inventarios (Hato general y lotes)',
    formato: 'Tabla interactiva (XLSX / PDF)',
    frecuencia: 'Semanal (Lunes)',
    rutaAsociada: '/reports/inventories',
    fechaCreacion: '2026-09-01'
  },
  {
    id: 'rep-2',
    codigo: 'RPT-002',
    nombre: 'Vientres en Lactancia y Eficiencia Lechera',
    descripcion: 'Vacas en producción lechera activa con días en leche (DEL) y promedios diarios.',
    categoria: 'Animales',
    plantillaBase: 'Animales Lactando (En Ordeño)',
    formato: 'Resumen ejecutivo con KPIs',
    frecuencia: 'Diario (Automático)',
    rutaAsociada: '/reports/cowsinproduction',
    fechaCreacion: '2026-09-05'
  },
  {
    id: 'rep-3',
    codigo: 'RPT-003',
    nombre: 'Cronograma de Próximos Partos y Secados',
    descripcion: 'Programación de traslados a potrero de maternidad según fecha probable de parto.',
    categoria: 'Animales',
    plantillaBase: 'Próximas a Parir (FPP)',
    formato: 'Ficha analítica detallada',
    frecuencia: 'Bajo demanda (Manual)',
    rutaAsociada: '/reports/nexttobirth',
    fechaCreacion: '2026-09-10'
  }
];

export const ReportesView: React.FC = () => {
  const navigate = useNavigate();

  // Estados para lista de reportes con persistencia en localStorage
  const [reportes, setReportes] = useState<ReporteItem[]>(() => {
    try {
      const saved = localStorage.getItem('agrotech_saved_reports');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignorar error de parsing
    }
    return INITIAL_REPORTS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Gestión');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Modal de detalle / vista previa
  const [selectedReporte, setSelectedReporte] = useState<ReporteItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Guardar en localStorage al cambiar
  useEffect(() => {
    try {
      localStorage.setItem('agrotech_saved_reports', JSON.stringify(reportes));
    } catch {
      // Manejo silencioso en ambientes restringidos
    }
  }, [reportes]);

  // Manejador de agregar nuevo reporte
  const handleSaveReporte = (nuevo: ReporteItem) => {
    setReportes(prev => [nuevo, ...prev]);
  };

  // Manejador de eliminar reporte
  const handleDeleteReporte = (id: string, nombre: string) => {
    if (confirm(`¿Está seguro de eliminar el reporte "${nombre}"?`)) {
      setReportes(prev => prev.filter(r => r.id !== id));
    }
  };

  // Ejecutar reporte
  const handleExecuteReport = (rep: ReporteItem) => {
    if (rep.rutaAsociada) {
      navigate(rep.rutaAsociada);
    } else {
      setSelectedReporte(rep);
      setIsDetailModalOpen(true);
    }
  };

  // Filtrado de reportes por término de búsqueda
  const filteredReports = reportes.filter(rep => {
    const term = searchTerm.toLowerCase();
    return (
      rep.codigo.toLowerCase().includes(term) ||
      rep.nombre.toLowerCase().includes(term) ||
      rep.descripcion.toLowerCase().includes(term) ||
      rep.categoria.toLowerCase().includes(term)
    );
  });

  // Generación del siguiente código correlativo
  const nextCodigo = `RPT-${String(reportes.length + 1).padStart(3, '0')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* Header */}
      <div className="events-header">
        <div className="events-header-left">
          <h2 className="toolbar-title">Centro de Reportes</h2>
          <span>
            Reportes zootécnicos, reproductivos, productivos y de gestión
          </span>
        </div>

        <div className="events-header-right">
          {/* Green Split Button con Dropdown */}
          <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <div className="split-button-container">
              <button
                className="split-button-main"
                title="Agregar Nuevo Reporte"
                type="button"
                onClick={() => {
                  setSelectedCategory('Gestión');
                  setIsDropdownOpen(false);
                  setIsNewModalOpen(true);
                }}
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Agregar</span>
              </button>
              <button
                className="split-button-arrow"
                type="button"
                title="Opciones de nuevo reporte"
                onClick={() => setIsDropdownOpen(prev => !prev)}
              >
                <ChevronDown size={12} strokeWidth={2.5} />
              </button>
            </div>

            {isDropdownOpen && (
              <div
                className="profile-dropdown"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 6px)',
                  width: 230,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                  borderRadius: 8,
                  border: '1px solid var(--border-gray)',
                  backgroundColor: '#ffffff',
                  zIndex: 150
                }}
              >
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedCategory('Gestión');
                    setIsDropdownOpen(false);
                    setIsNewModalOpen(true);
                  }}
                >
                  Reporte de Gestión
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedCategory('Animales');
                    setIsDropdownOpen(false);
                    setIsNewModalOpen(true);
                  }}
                >
                  Reporte de Animales
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedCategory('Históricos');
                    setIsDropdownOpen(false);
                    setIsNewModalOpen(true);
                  }}
                >
                  Reporte de Históricos
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedCategory('Multirebaños');
                    setIsDropdownOpen(false);
                    setIsNewModalOpen(true);
                  }}
                >
                  Reporte Multirebaños
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedCategory('Personalizado');
                    setIsDropdownOpen(false);
                    setIsNewModalOpen(true);
                  }}
                  style={{ borderTop: '1px solid #f1f5f9', fontWeight: 600, color: 'var(--primary-color)' }}
                >
                  + Reporte Personalizado
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Conteo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div className="search-container" style={{ maxWidth: 380, width: '100%' }}>
          <Search className="search-icon" size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por código, nombre o categoría..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
            {filteredReports.length} {filteredReports.length === 1 ? 'reporte configurado' : 'reportes configurados'}
          </span>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setSelectedCategory('Personalizado');
              setIsNewModalOpen(true);
            }}
            style={{ fontSize: 12.5, padding: '6px 12px' }}
          >
            <Plus size={14} />
            <span>Nuevo Reporte</span>
          </button>
        </div>
      </div>

      {/* Tabla de Reportes Configurados */}
      <div>
        <div className="events-table-container">
          <table className="events-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>
                  Código
                  <Filter size={13} style={{ float: 'right', marginTop: 3, opacity: 0.5 }} />
                </th>
                <th style={{ width: '32%' }}>
                  Nombre del Reporte
                  <Filter size={13} style={{ float: 'right', marginTop: 3, opacity: 0.5 }} />
                </th>
                <th style={{ width: '38%' }}>
                  Descripción y Formato
                  <Filter size={13} style={{ float: 'right', marginTop: 3, opacity: 0.5 }} />
                </th>
                <th style={{ width: '15%', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(rep => (
                <tr key={rep.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ height: 'auto', padding: '14px 20px' }}>
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      backgroundColor: '#f1f5f9',
                      color: '#334155',
                      padding: '4px 8px',
                      borderRadius: 6,
                      fontSize: 12.5
                    }}>
                      {rep.codigo}
                    </span>
                  </td>
                  <td style={{ height: 'auto', padding: '14px 20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <strong style={{ color: 'var(--text-primary)', fontSize: 13.5 }}>
                        {rep.nombre}
                      </strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{
                          backgroundColor: '#e8f5e9',
                          color: 'var(--primary-color)',
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '1px 6px',
                          borderRadius: 4
                        }}>
                          {rep.categoria}
                        </span>
                        <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                          • {rep.frecuencia}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={{ height: 'auto', padding: '14px 20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {rep.descripcion}
                      </span>
                      <span style={{ fontSize: 11, color: '#64748b' }}>
                        Formato: <strong>{rep.formato}</strong>
                      </span>
                    </div>
                  </td>
                  <td style={{ height: 'auto', padding: '14px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => handleExecuteReport(rep)}
                        title="Ver o Ejecutar Reporte"
                        style={{ padding: '6px 12px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 5 }}
                      >
                        <ExternalLink size={13} />
                        <span>Ver</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteReporte(rep.id, rep.nombre)}
                        title="Eliminar Reporte"
                        style={{
                          background: 'none',
                          border: '1px solid #fee2e2',
                          color: '#dc2626',
                          borderRadius: 6,
                          padding: '6px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text-secondary)' }}>
                    <p style={{ margin: 0, fontSize: 14 }}>
                      {searchTerm ? 'No se encontraron reportes que coincidan con la búsqueda.' : 'Ningún reporte registrado en este momento.'}
                    </p>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => setIsNewModalOpen(true)}
                      style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      <Plus size={15} />
                      <span>Crear Primer Reporte</span>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid de Categorías de Reportes Estándar (4 Tarjetas) */}
      <div style={{ marginTop: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
          Módulos y Catálogos de Reportes Estándar
        </h3>
        <div className="reports-categories-grid">
          {REPORT_CATEGORIES.map(cat => (
            <ReportCategoryCard key={cat.titulo} category={cat} />
          ))}
        </div>
      </div>

      {/* Modal Nuevo Reporte */}
      <NuevoReporteModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleSaveReporte}
        categoriaInicial={selectedCategory}
        nextCodigo={nextCodigo}
      />

      {/* Modal Detalle / Vista Previa */}
      <DetalleReporteModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        reporte={selectedReporte}
      />
    </div>
  );
};
