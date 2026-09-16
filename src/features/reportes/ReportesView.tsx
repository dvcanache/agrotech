import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  ChevronDown,
  Filter,
  Search,
  ExternalLink,
  Trash2,
  Calculator,
  Truck
} from 'lucide-react';
import { REPORT_CATEGORIES, REPORT_METADATA_MAP, INITIAL_REPORTS } from './reportesData';
import { ReportCategory, ReportSpecies } from '../../types/reports';
import { ReportCategoryCard } from './components/ReportCategoryCard';
import { NuevoReporteModal, ReporteItem } from './components/NuevoReporteModal';
import { DetalleReporteModal } from './components/DetalleReporteModal';
import { AdHocReportDesignerModal } from './components/AdHocReportDesignerModal';
import { GuiaMovilizacionModal } from './components/GuiaMovilizacionModal';

interface SpeciesToolbarOption {
  id: ReportSpecies;
  label: string;
  icon: string;
  badgeColor: string;
}

const SPECIES_TOOLBAR_OPTIONS: SpeciesToolbarOption[] = [
  { id: 'todos', label: 'Todos los Reportes', icon: '🐾', badgeColor: '#475569' },
  { id: 'bovinos', label: 'Bovinos', icon: '🐮', badgeColor: '#2d6a4f' },
  { id: 'aves', label: 'Aves de corral', icon: '🐔', badgeColor: '#d97706' },
  { id: 'porcinos', label: 'Porcinos', icon: '🐷', badgeColor: '#db2777' },
  { id: 'bufalos', label: 'Búfalos', icon: '🐃', badgeColor: '#334155' },
  { id: 'caprinos', label: 'Caprinos', icon: '🐐', badgeColor: '#059669' },
  { id: 'equinos', label: 'Equinos', icon: '🐴', badgeColor: '#7c2d12' }
];

export const ReportesView: React.FC = () => {
  const navigate = useNavigate();

  // Toolbar de Especies
  const [selectedSpecies, setSelectedSpecies] = useState<ReportSpecies>('todos');

  // Estados para lista de reportes con persistencia en localStorage
  const [reportes, setReportes] = useState<ReporteItem[]>(() => {
    try {
      const saved = localStorage.getItem('agrogan_saved_reports_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Fallback a INITIAL_REPORTS
    }
    return INITIAL_REPORTS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isAdHocModalOpen, setIsAdHocModalOpen] = useState(false);
  const [isGuiaModalOpen, setIsGuiaModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Gestión');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Modal de detalle / vista previa
  const [selectedReporte, setSelectedReporte] = useState<ReporteItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Guardar en localStorage al cambiar
  useEffect(() => {
    try {
      localStorage.setItem('agrogan_saved_reports_v2', JSON.stringify(reportes));
    } catch {
      // Silencioso
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

  // Restablecer reportes iniciales predeterminados
  const handleResetDefaults = () => {
    setReportes(INITIAL_REPORTS);
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

  // Manejador al hacer clic en un reporte del directorio de categorías
  const handleSelectDirectoryReport = (reportName: string, category: ReportCategory) => {
    const meta = REPORT_METADATA_MAP[reportName];
    const previewItem: ReporteItem = {
      id: `template-${Date.now()}`,
      codigo: `CAT-${(category.especie || 'GEN').toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      nombre: reportName,
      descripcion: meta?.descripcion || `Plantilla zootécnica especializada para ${category.titulo}.`,
      categoria: meta?.categoria || category.titulo,
      especie: meta?.especie || category.especie || 'todos',
      plantillaBase: reportName,
      formato: meta?.formato || 'Informe Zootécnico Digital (XLSX / PDF)',
      frecuencia: meta?.frecuencia || 'Periódico / Según demanda',
      rutaAsociada: meta?.ruta,
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    setSelectedReporte(previewItem);
    setIsDetailModalOpen(true);
  };

  // Función auxiliar de normalización para búsquedas insensibles a tildes y diacríticos
  const normalizeText = (str: string) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  // Filtrado de reportes guardados por especie y término de búsqueda
  const filteredReports = useMemo(() => {
    const term = normalizeText(searchTerm);

    return reportes.filter(rep => {
      // Filtro por especie
      if (selectedSpecies !== 'todos') {
        const repEspecie = rep.especie || 'bovinos';
        if (repEspecie !== selectedSpecies && repEspecie !== 'todos') {
          return false;
        }
      }

      // Filtro por término de búsqueda
      if (term) {
        return (
          normalizeText(rep.codigo).includes(term) ||
          normalizeText(rep.nombre).includes(term) ||
          normalizeText(rep.descripcion).includes(term) ||
          normalizeText(rep.categoria).includes(term) ||
          (rep.especie ? normalizeText(rep.especie).includes(term) : false)
        );
      }

      return true;
    });
  }, [reportes, selectedSpecies, searchTerm]);

  // Filtrado y ordenamiento dinámico de categorías del directorio según la especie seleccionada
  const filteredCategories = useMemo(() => {
    if (selectedSpecies === 'todos') {
      return REPORT_CATEGORIES;
    }

    // Filtrar: mostrar primero la categoría de la especie seleccionada, luego las transversales
    return REPORT_CATEGORIES.filter(cat => {
      return cat.especie === selectedSpecies || cat.especie === 'todos' || !cat.especie;
    }).sort((a, b) => {
      if (a.especie === selectedSpecies && b.especie !== selectedSpecies) return -1;
      if (b.especie === selectedSpecies && a.especie !== selectedSpecies) return 1;
      return 0;
    });
  }, [selectedSpecies]);

  // Generación del siguiente código correlativo
  const nextCodigo = `RPT-${String(reportes.length + 1).padStart(3, '0')}`;

  const renderSpeciesBadge = (esp?: ReportSpecies) => {
    switch (esp) {
      case 'bovinos':
        return <span style={{ backgroundColor: '#e8f5e9', color: '#166534', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>🐮 Bovinos</span>;
      case 'aves':
        return <span style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>🐔 Aves</span>;
      case 'porcinos':
        return <span style={{ backgroundColor: '#fce7f3', color: '#9d174d', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>🐷 Porcinos</span>;
      case 'bufalos':
        return <span style={{ backgroundColor: '#f1f5f9', color: '#334155', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>🐃 Búfalos</span>;
      case 'caprinos':
        return <span style={{ backgroundColor: '#ecfdf5', color: '#065f46', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>🐐 Caprinos</span>;
      case 'equinos':
        return <span style={{ backgroundColor: '#fff7ed', color: '#9a3412', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>🐴 Equinos</span>;
      default:
        return <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>🐾 Global</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%' }}>
      {/* Header */}
      <div className="events-header">
        <div className="events-header-left">
          <h2 className="toolbar-title">Centro de Reportes Multiespecie</h2>
          <span>
            Inteligencia pecuaria, informes zootécnicos y analítica para las 6 especies de AgroGan
          </span>
        </div>

        <div className="events-header-right">
          {/* Botón Diseñar Informe BI Ad-Hoc */}
          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsAdHocModalOpen(true)}
            title="Abrir Diseñador de Reportes BI Ad-Hoc con 8 entidades"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', fontSize: 13 }}
          >
            <Calculator size={15} />
            <span>+ Diseñar Informe BI</span>
          </button>

          {/* Botón Guía de Movilización */}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsGuiaModalOpen(true)}
            title="Emitir Guía de Movilización Pecuaria Oficial Multiespecie"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', fontSize: 13 }}
          >
            <Truck size={15} />
            <span>Guía Movilización</span>
          </button>

          {/* Split Button para Nuevo Reporte */}
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
                  width: 260,
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
                  Reporte de Bovinos
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedCategory('Aves de corral');
                    setIsDropdownOpen(false);
                    setIsNewModalOpen(true);
                  }}
                >
                  🐔 Reporte Aves de corral
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedCategory('Porcinos');
                    setIsDropdownOpen(false);
                    setIsNewModalOpen(true);
                  }}
                >
                  🐷 Reporte Porcinos
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedCategory('Búfalos');
                    setIsDropdownOpen(false);
                    setIsNewModalOpen(true);
                  }}
                >
                  🐃 Reporte Búfalos
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedCategory('Caprinos');
                    setIsDropdownOpen(false);
                    setIsNewModalOpen(true);
                  }}
                >
                  🐐 Reporte Caprinos
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedCategory('Equinos');
                    setIsDropdownOpen(false);
                    setIsNewModalOpen(true);
                  }}
                >
                  🐴 Reporte Equinos
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsAdHocModalOpen(true);
                  }}
                  style={{ borderTop: '1px solid #f1f5f9', fontWeight: 600, color: 'var(--primary-color)' }}
                >
                  ✨ + Diseñador BI Ad-Hoc
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsGuiaModalOpen(true);
                  }}
                  style={{ fontWeight: 600, color: '#15803d' }}
                >
                  🚛 + Guía de Movilización Pecuaria
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Species Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          overflowX: 'auto',
          padding: '6px 2px',
          borderBottom: '1px solid #f1f5f9'
        }}
      >
        {SPECIES_TOOLBAR_OPTIONS.map(sp => {
          const isSelected = selectedSpecies === sp.id;
          return (
            <button
              key={sp.id}
              type="button"
              onClick={() => setSelectedSpecies(sp.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '7px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: isSelected ? 700 : 500,
                border: isSelected ? '1.5px solid var(--primary-color)' : '1px solid #e2e8f0',
                backgroundColor: isSelected ? 'var(--primary-color)' : '#ffffff',
                color: isSelected ? '#ffffff' : '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 3px 10px rgba(45, 106, 79, 0.22)' : 'none'
              }}
            >
              <span style={{ fontSize: 15 }}>{sp.icon}</span>
              <span>{sp.label}</span>
              {isSelected && (
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    fontSize: 10.5,
                    padding: '1px 6px',
                    borderRadius: 10,
                    fontWeight: 700
                  }}
                >
                  {filteredReports.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Barra de Búsqueda y Conteo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div className="search-container" style={{ maxWidth: 400, width: '100%' }}>
          <Search className="search-icon" size={16} />
          <input
            type="text"
            className="search-input"
            placeholder={
              selectedSpecies === 'todos'
                ? 'Buscar por código, nombre, categoría o especie...'
                : `Buscar reportes de ${SPECIES_TOOLBAR_OPTIONS.find(s => s.id === selectedSpecies)?.label}...`
            }
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
            {filteredReports.length} {filteredReports.length === 1 ? 'reporte guardado' : 'reportes guardados'}
            {selectedSpecies !== 'todos' && ` (${SPECIES_TOOLBAR_OPTIONS.find(s => s.id === selectedSpecies)?.label})`}
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

      {/* Tabla de Reportes Guardados */}
      <div>
        <div className="events-table-container">
          <table className="events-table">
            <thead>
              <tr>
                <th style={{ width: '14%' }}>
                  Código
                  <Filter size={13} style={{ float: 'right', marginTop: 3, opacity: 0.5 }} />
                </th>
                <th style={{ width: '32%' }}>
                  Nombre del Reporte & Especie
                  <Filter size={13} style={{ float: 'right', marginTop: 3, opacity: 0.5 }} />
                </th>
                <th style={{ width: '39%' }}>
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
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        backgroundColor: '#f1f5f9',
                        color: '#334155',
                        padding: '4px 8px',
                        borderRadius: 6,
                        fontSize: 12.5
                      }}
                    >
                      {rep.codigo}
                    </span>
                  </td>
                  <td style={{ height: 'auto', padding: '14px 20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <strong style={{ color: 'var(--text-primary)', fontSize: 13.5 }}>
                        {rep.nombre}
                      </strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        {renderSpeciesBadge(rep.especie)}
                        <span
                          style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: 4
                          }}
                        >
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
                  <td colSpan={4} style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-secondary)' }}>
                    <p style={{ margin: 0, fontSize: 14 }}>
                      {searchTerm
                        ? `No se encontraron reportes que coincidan con "${searchTerm}".`
                        : `No hay reportes configurados para la especie seleccionada.`}
                    </p>
                    {searchTerm ? (
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setSearchTerm('')}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '6px 14px' }}
                        >
                          <span>Limpiar búsqueda</span>
                        </button>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => setIsNewModalOpen(true)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '6px 14px' }}
                        >
                          <Plus size={15} />
                          <span>Configurar Nuevo Reporte</span>
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                        {reportes.length === 0 && (
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={handleResetDefaults}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '6px 14px' }}
                          >
                            <span>Restablecer Predeterminados</span>
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => setIsNewModalOpen(true)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '6px 14px' }}
                        >
                          <Plus size={15} />
                          <span>Configurar Primer Reporte</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid de Categorías de Reportes Estándar */}
      <div style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>
              Módulos y Catálogos de Reportes Estándar por Especie
            </h3>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {selectedSpecies === 'todos'
                ? 'Catálogo completo para Bovinos, Aves, Porcinos, Búfalos, Caprinos, Equinos y Gestión'
                : `Mostrando plantillas especializadas para: ${SPECIES_TOOLBAR_OPTIONS.find(s => s.id === selectedSpecies)?.label}`}
            </span>
          </div>

          {selectedSpecies !== 'todos' && (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setSelectedSpecies('todos')}
              style={{ fontSize: 12, color: 'var(--primary-color)' }}
            >
              Ver Todas las Especies
            </button>
          )}
        </div>

        <div className="reports-categories-grid">
          {filteredCategories.map(cat => (
            <ReportCategoryCard
              key={cat.titulo}
              category={cat}
              isHighlighted={selectedSpecies !== 'todos' && cat.especie === selectedSpecies}
              onSelectReport={handleSelectDirectoryReport}
            />
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

      {/* Modal Diseñador BI Ad-Hoc */}
      <AdHocReportDesignerModal
        isOpen={isAdHocModalOpen}
        onClose={() => setIsAdHocModalOpen(false)}
        onSaveReport={handleSaveReporte}
      />

      {/* Modal Guía de Movilización Pecuaria */}
      <GuiaMovilizacionModal
        isOpen={isGuiaModalOpen}
        onClose={() => setIsGuiaModalOpen(false)}
      />
    </div>
  );
};
