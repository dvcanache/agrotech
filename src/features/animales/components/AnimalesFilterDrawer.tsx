import React, { useState } from 'react';
import { ReportFilterDrawer } from '../../reportes/components/ReportFilterDrawer';
import { ESPECIES_TAXONOMY, EspecieAnimal } from '../../../types/animal';

export interface AnimalesFilterValues {
  especies?: string[];
  categorias: string[];
  estatus: string[];
  lotes: string[];
  raza: string;
}

interface AnimalesFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AnimalesFilterValues;
  onFilterChange: (newFilters: AnimalesFilterValues) => void;
  onReset: () => void;
}

const ALL_ESTATUS = ['Activo', 'Inactivo'];
const ALL_LOTES = [
  'Lote 01', 
  'POT1', 
  'POT2', 
  'POT3', 
  'POT-SEM',
  'GALP-01', 
  'GALP-03', 
  'GALP-LEV', 
  'CAS-ELITE', 
  'GALP-PAVOS', 
  'LAG-NORTE',
  'COCH-PAR', 
  'COCH-GEST', 
  'CORR-VERR', 
  'GALP-ENG1', 
  'SAB-BAJA', 
  'POT-BUF-REC', 
  'APR-ORD', 
  'APR-LEV', 
  'PIQ-CHIVOS',
  'POT-CABALL', 
  'PICADERO', 
  'CABALLERIZA-01'
];

const ALL_RAZAS = [
  'Todas las razas',
  'Carora',
  'Holstein',
  'Pardo Suizo',
  'Brahman',
  'Girolando',
  'Lohmann Brown',
  'Hy-Line Brown',
  'Cobb 500',
  'Ross 308',
  'Combatiente Español',
  'Pekín Blanco',
  'Landrace',
  'Large White',
  'Pietrain',
  'Duroc',
  'Topigs 20',
  'Murrah',
  'Mediterráneo',
  'Alpina',
  'Saanen',
  'Boer',
  'Quarter Horse',
  'Paso Fino'
];

export const AnimalesFilterDrawer: React.FC<AnimalesFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset
}) => {
  const [expandedSpecies, setExpandedSpecies] = useState<Record<string, boolean>>({
    'Bovinos': true,
    'Aves de corral': true,
    'Porcinos': true,
    'Búfalos': true,
    'Caprinos': true,
    'Equinos': true
  });

  const toggleSpeciesSection = (esp: string) => {
    setExpandedSpecies(prev => ({
      ...prev,
      [esp]: !prev[esp]
    }));
  };

  const toggleCategoria = (cat: string) => {
    const exists = filters.categorias.includes(cat);
    const updated = exists
      ? filters.categorias.filter(c => c !== cat)
      : [...filters.categorias, cat];
    onFilterChange({ ...filters, categorias: updated });
  };

  const toggleEstatus = (st: string) => {
    const exists = filters.estatus.includes(st);
    const updated = exists
      ? filters.estatus.filter(s => s !== st)
      : [...filters.estatus, st];
    onFilterChange({ ...filters, estatus: updated });
  };

  const toggleLote = (lote: string) => {
    const exists = filters.lotes.includes(lote);
    const updated = exists
      ? filters.lotes.filter(l => l !== lote)
      : [...filters.lotes, lote];
    onFilterChange({ ...filters, lotes: updated });
  };

  return (
    <ReportFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Filtros de Animales"
      onClear={onReset}
    >
      {/* Categorías y Subcategorías Agrupadas por Especie */}
      <div className="filter-section">
        <div className="filter-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Categorías y Subcategorías</span>
          {filters.categorias.length > 0 && (
            <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 600 }}>
              {filters.categorias.length} seleccionadas
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          {Object.values(ESPECIES_TAXONOMY).map(esp => {
            const isExpanded = expandedSpecies[esp.id] ?? false;
            const selectedInEspecie = esp.subcategorias.filter(sub => filters.categorias.includes(sub)).length;

            return (
              <div 
                key={esp.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  overflow: 'hidden',
                  backgroundColor: '#ffffff'
                }}
              >
                {/* Header de la Especie */}
                <div 
                  onClick={() => toggleSpeciesSection(esp.id)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                    borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                    <span style={{ fontSize: 16 }}>{esp.icono}</span>
                    <span>{esp.nombre}</span>
                    {selectedInEspecie > 0 && (
                      <span style={{
                        fontSize: 10,
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        padding: '1px 6px',
                        borderRadius: 10,
                        fontWeight: 700
                      }}>
                        {selectedInEspecie}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 12, color: '#64748b', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    ▼
                  </span>
                </div>

                {/* Subcategorías como Checkboxes */}
                {isExpanded && (
                  <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {esp.subcategorias.map(sub => (
                      <label 
                        key={sub} 
                        className="filter-checkbox-label"
                        style={{ fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 8, margin: 0, cursor: 'pointer' }}
                      >
                        <input
                          type="checkbox"
                          checked={filters.categorias.includes(sub)}
                          onChange={() => toggleCategoria(sub)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ color: filters.categorias.includes(sub) ? '#095431' : '#334155', fontWeight: filters.categorias.includes(sub) ? 600 : 400 }}>
                          {sub}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Estatus */}
      <div className="filter-section">
        <div className="filter-section-title">Estatus Operativo</div>
        <div className="filter-checkbox-list">
          {ALL_ESTATUS.map(st => (
            <label key={st} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.estatus.includes(st)}
                onChange={() => toggleEstatus(st)}
              />
              <span>{st}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Lote */}
      <div className="filter-section">
        <div className="filter-section-title">Lote / Galpón de Ubicación</div>
        <div className="filter-checkbox-list" style={{ maxHeight: 150, overflowY: 'auto' }}>
          {ALL_LOTES.map(lote => (
            <label key={lote} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.lotes.includes(lote)}
                onChange={() => toggleLote(lote)}
              />
              <span>{lote}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Raza / Composición */}
      <div className="filter-section">
        <div className="filter-section-title">Raza o Línea Genética</div>
        <select
          className="form-select"
          value={filters.raza}
          onChange={e => onFilterChange({ ...filters, raza: e.target.value })}
        >
          {ALL_RAZAS.map(r => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </ReportFilterDrawer>
  );
};
