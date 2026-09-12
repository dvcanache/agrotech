import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Animal, 
  EspecieAnimal, 
  ESPECIES_TAXONOMY 
} from '../../../types/animal';
import { matchesEspecie, matchesSubcategoria } from '../useAnimales';

interface AnimalesToolbarProps {
  selectedEspecie?: string;
  onEspecieChange?: (especie: string) => void;
  selectedSubcategoria?: string;
  onSubcategoriaChange?: (subcategoria: string) => void;
  quickFilter?: string;
  onQuickFilterChange?: (filter: string) => void;
  onOpenFilterDrawer?: () => void;
  activeFilterCount?: number;
  allAnimals?: Animal[];
  onResetFilters?: () => void;
}

export const AnimalesToolbar: React.FC<AnimalesToolbarProps> = ({
  selectedEspecie = 'Todas',
  onEspecieChange,
  selectedSubcategoria = 'Todas',
  onSubcategoriaChange,
  quickFilter = 'Todos los animales',
  onQuickFilterChange,
  onOpenFilterDrawer,
  activeFilterCount = 0,
  allAnimals = [],
  onResetFilters
}) => {
  const [isEspecieOpen, setIsEspecieOpen] = useState(false);
  const [isSubcatOpen, setIsSubcatOpen] = useState(false);
  const especieRef = useRef<HTMLDivElement>(null);
  const subcatRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (especieRef.current && !especieRef.current.contains(e.target as Node)) {
        setIsEspecieOpen(false);
      }
      if (subcatRef.current && !subcatRef.current.contains(e.target as Node)) {
        setIsSubcatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Species list with icons
  const speciesList = useMemo(() => {
    return Object.values(ESPECIES_TAXONOMY);
  }, []);

  // Available subcategories for current selection
  const availableSubcategories = useMemo(() => {
    if (selectedEspecie !== 'Todas' && selectedEspecie !== 'Todas las especies') {
      const taxonomy = ESPECIES_TAXONOMY[selectedEspecie as EspecieAnimal];
      return taxonomy ? taxonomy.subcategorias : [];
    }
    return [];
  }, [selectedEspecie]);

  // Counts
  const counts = useMemo(() => {
    const total = allAnimals.length;
    const porEspecie: Record<string, number> = {};
    const porSubcategoria: Record<string, number> = {};

    speciesList.forEach(esp => {
      porEspecie[esp.id] = allAnimals.filter(a => matchesEspecie(a, esp.id)).length;
      esp.subcategorias.forEach(sub => {
        porSubcategoria[sub] = allAnimals.filter(a => matchesSubcategoria(a, sub)).length;
      });
    });

    const activos = allAnimals.filter(a => a.estatus === 'Activo').length;
    const inactivos = allAnimals.filter(a => a.estatus === 'Inactivo').length;

    return { total, porEspecie, porSubcategoria, activos, inactivos };
  }, [allAnimals, speciesList]);

  // Handle species selection
  const handleSelectEspecie = (espId: string) => {
    onEspecieChange?.(espId);
    onSubcategoriaChange?.('Todas');
    onQuickFilterChange?.(espId === 'Todas' ? 'Todos los animales' : espId);
    setIsEspecieOpen(false);
  };

  // Handle subcategory selection
  const handleSelectSubcategoria = (subcat: string, parentEspecie?: string) => {
    if (parentEspecie && selectedEspecie === 'Todas') {
      onEspecieChange?.(parentEspecie);
    }
    onSubcategoriaChange?.(subcat);
    onQuickFilterChange?.(subcat);
    setIsSubcatOpen(false);
  };

  // Label for current species button
  const currentEspecieLabel = useMemo(() => {
    if (selectedEspecie === 'Todas' || selectedEspecie === 'Todas las especies') {
      return { icono: '🐾', nombre: 'Todas las categorías' };
    }
    const found = speciesList.find(s => s.id === selectedEspecie);
    return found ? { icono: found.icono, nombre: found.nombre } : { icono: '🐾', nombre: selectedEspecie };
  }, [selectedEspecie, speciesList]);

  const hasActiveCategoryFilter = selectedEspecie !== 'Todas' || selectedSubcategoria !== 'Todas';

  return (
    <div className="animals-toolbar">
      <div className="toolbar-left" style={{ flexWrap: 'wrap', gap: 12 }}>
        <h2 className="toolbar-title">Animales</h2>

        {/* 1. DROPDOWN DE CATEGORÍA / ESPECIE */}
        <div style={{ position: 'relative' }} ref={especieRef}>
          <div
            className={`selector-dropdown ${selectedEspecie !== 'Todas' ? 'has-filter' : ''}`}
            onClick={() => {
              setIsEspecieOpen(prev => !prev);
              setIsSubcatOpen(false);
            }}
            role="button"
            tabIndex={0}
            title="Seleccionar categoría principal (especie animal)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: selectedEspecie !== 'Todas' ? '#f0fdf4' : '#ffffff',
              borderColor: selectedEspecie !== 'Todas' ? '#095431' : '#cbd5e1',
              fontWeight: 600,
              padding: '7px 12px'
            }}
          >
            <span style={{ fontSize: 16 }}>{currentEspecieLabel.icono}</span>
            <span style={{ color: selectedEspecie !== 'Todas' ? '#095431' : 'inherit' }}>
              {currentEspecieLabel.nombre}
            </span>
            <span 
              style={{
                fontSize: 11,
                backgroundColor: selectedEspecie !== 'Todas' ? '#dcfce7' : '#f1f5f9',
                color: selectedEspecie !== 'Todas' ? '#095431' : '#64748b',
                padding: '1px 6px',
                borderRadius: 10,
                fontWeight: 700
              }}
            >
              {selectedEspecie === 'Todas' ? counts.total : (counts.porEspecie[selectedEspecie] ?? 0)}
            </span>

            {/* Down Chevron */}
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{
                transform: isEspecieOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
                marginLeft: 2
              }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          {/* Floating Species Menu */}
          {isEspecieOpen && (
            <div 
              className="selector-dropdown-menu" 
              style={{ 
                minWidth: 260, 
                maxHeight: 420, 
                overflowY: 'auto',
                boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                border: '1px solid #cbd5e1',
                borderRadius: 10,
                padding: '6px'
              }}
            >
              <div style={{ padding: '6px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>
                Categoría Principal / Especie
              </div>

              {/* Todas las especies */}
              <div
                className={`selector-dropdown-item ${selectedEspecie === 'Todas' ? 'active' : ''}`}
                onClick={() => handleSelectEspecie('Todas')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>🐾</span>
                  <span>Todas las especies</span>
                </div>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{counts.total}</span>
              </div>

              <div style={{ height: 1, backgroundColor: '#f1f5f9', margin: '4px 0' }} />

              {/* Especies individuales */}
              {speciesList.map(esp => {
                const count = counts.porEspecie[esp.id] || 0;
                const isSelected = selectedEspecie === esp.id;
                return (
                  <div
                    key={esp.id}
                    className={`selector-dropdown-item ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectEspecie(esp.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '8px 10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{esp.icono}</span>
                      <div>
                        <div style={{ fontWeight: isSelected ? 700 : 500 }}>{esp.nombre}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>
                          {esp.subcategorias.length} subcategorías
                        </div>
                      </div>
                    </div>
                    <span 
                      style={{ 
                        fontSize: 11, 
                        fontWeight: 700,
                        backgroundColor: isSelected ? '#095431' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#64748b',
                        padding: '2px 7px',
                        borderRadius: 10
                      }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}

              <div style={{ height: 1, backgroundColor: '#f1f5f9', margin: '6px 0' }} />
              
              <div style={{ padding: '4px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                Filtros por Estatus
              </div>
              <div
                className={`selector-dropdown-item ${quickFilter === 'Activos' ? 'active' : ''}`}
                onClick={() => {
                  onQuickFilterChange?.('Activos');
                  setIsEspecieOpen(false);
                }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span>🟢 Solo Activos</span>
                <span style={{ fontSize: 11, color: '#64748b' }}>{counts.activos}</span>
              </div>
              <div
                className={`selector-dropdown-item ${quickFilter === 'Inactivos' ? 'active' : ''}`}
                onClick={() => {
                  onQuickFilterChange?.('Inactivos');
                  setIsEspecieOpen(false);
                }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span>⚪ Solo Inactivos</span>
                <span style={{ fontSize: 11, color: '#64748b' }}>{counts.inactivos}</span>
              </div>
            </div>
          )}
        </div>

        {/* 2. DROPDOWN DE SUBCATEGORÍAS */}
        <div style={{ position: 'relative' }} ref={subcatRef}>
          <div
            className={`selector-dropdown ${selectedSubcategoria !== 'Todas' ? 'has-filter' : ''}`}
            onClick={() => {
              setIsSubcatOpen(prev => !prev);
              setIsEspecieOpen(false);
            }}
            role="button"
            tabIndex={0}
            title="Seleccionar subcategoría"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: selectedSubcategoria !== 'Todas' ? '#eff6ff' : '#ffffff',
              borderColor: selectedSubcategoria !== 'Todas' ? '#2563eb' : '#cbd5e1',
              fontWeight: 500,
              padding: '7px 12px'
            }}
          >
            <span style={{ color: '#64748b', fontSize: 12 }}>Subcategoría:</span>
            <span style={{ fontWeight: 600, color: selectedSubcategoria !== 'Todas' ? '#1d4ed8' : 'inherit' }}>
              {selectedSubcategoria === 'Todas' ? 'Todas' : selectedSubcategoria}
            </span>
            {selectedSubcategoria !== 'Todas' && (
              <span 
                style={{
                  fontSize: 11,
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  padding: '1px 6px',
                  borderRadius: 10,
                  fontWeight: 700
                }}
              >
                {counts.porSubcategoria[selectedSubcategoria] ?? 0}
              </span>
            )}
            {/* Down Chevron */}
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{
                transform: isSubcatOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
                marginLeft: 2
              }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          {/* Floating Subcategories Menu */}
          {isSubcatOpen && (
            <div 
              className="selector-dropdown-menu" 
              style={{ 
                minWidth: 280, 
                maxHeight: 440, 
                overflowY: 'auto',
                boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                border: '1px solid #cbd5e1',
                borderRadius: 10,
                padding: '6px',
                zIndex: 60
              }}
            >
              <div style={{ padding: '6px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>
                {selectedEspecie !== 'Todas' 
                  ? `Subcategorías de ${currentEspecieLabel.nombre}`
                  : 'Todas las Subcategorías'}
              </div>

              {/* Opción Todas */}
              <div
                className={`selector-dropdown-item ${selectedSubcategoria === 'Todas' ? 'active' : ''}`}
                onClick={() => handleSelectSubcategoria('Todas')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span>
                  {selectedEspecie !== 'Todas' 
                    ? `Todas las subcategorías (${currentEspecieLabel.nombre})`
                    : 'Todas las subcategorías'}
                </span>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                  {selectedEspecie === 'Todas' 
                    ? counts.total 
                    : (counts.porEspecie[selectedEspecie] ?? 0)}
                </span>
              </div>

              <div style={{ height: 1, backgroundColor: '#f1f5f9', margin: '4px 0' }} />

              {/* Si hay una especie seleccionada, mostrar sólo sus subcategorías */}
              {selectedEspecie !== 'Todas' && availableSubcategories.map(sub => {
                const count = counts.porSubcategoria[sub] || 0;
                const isSelected = selectedSubcategoria === sub;
                return (
                  <div
                    key={sub}
                    className={`selector-dropdown-item ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectSubcategoria(sub)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '7px 10px'
                    }}
                  >
                    <span>{sub}</span>
                    <span 
                      style={{ 
                        fontSize: 11, 
                        fontWeight: 700,
                        backgroundColor: isSelected ? '#2563eb' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#64748b',
                        padding: '1px 6px',
                        borderRadius: 10
                      }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}

              {/* Si está en "Todas las especies", mostrar las subcategorías agrupadas por especie */}
              {selectedEspecie === 'Todas' && speciesList.map(esp => (
                <div key={esp.id} style={{ marginBottom: 8 }}>
                  <div 
                    style={{ 
                      padding: '5px 10px', 
                      fontSize: 11.5, 
                      fontWeight: 700, 
                      color: '#095431', 
                      backgroundColor: '#f0fdf4',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 4
                    }}
                  >
                    <span>{esp.icono}</span>
                    <span>{esp.nombre}</span>
                  </div>
                  {esp.subcategorias.map(sub => {
                    const count = counts.porSubcategoria[sub] || 0;
                    const isSelected = selectedSubcategoria === sub;
                    return (
                      <div
                        key={sub}
                        className={`selector-dropdown-item ${isSelected ? 'active' : ''}`}
                        onClick={() => handleSelectSubcategoria(sub, esp.id)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          padding: '6px 10px 6px 20px',
                          fontSize: 12.5
                        }}
                      >
                        <span>{sub}</span>
                        <span 
                          style={{ 
                            fontSize: 11, 
                            fontWeight: 600,
                            color: isSelected ? '#2563eb' : '#94a3b8'
                          }}
                        >
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chip para resetear filtros si hay especie o subcategoría seleccionada */}
        {hasActiveCategoryFilter && (
          <button
            type="button"
            onClick={() => {
              onEspecieChange?.('Todas');
              onSubcategoriaChange?.('Todas');
              onQuickFilterChange?.('Todos los animales');
              onResetFilters?.();
            }}
            title="Quitar filtro de categoría"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 12,
              fontWeight: 600,
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: 6,
              padding: '6px 10px',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
          >
            <span>✕ Limpiar filtro ({selectedEspecie !== 'Todas' ? currentEspecieLabel.nombre : selectedSubcategoria})</span>
          </button>
        )}

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
        <button 
          className="action-icon-btn" 
          title="Recargar" 
          type="button" 
          onClick={() => {
            onResetFilters?.();
          }}
        >
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
