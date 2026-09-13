import React, { useState, useMemo, useEffect } from 'react';
import { Sliders, Plus, CheckCircle2, Zap, FileSpreadsheet, FolderTree } from 'lucide-react';
import { EVENT_CATEGORIES, INITIAL_EVENTS, getEventCategoriesForSpecies } from './eventosData';
import { EventCategoryCard } from './components/EventCategoryCard';
import { NuevoEventoModal, EventoItem } from './components/NuevoEventoModal';
import { SpreadsheetGridMode } from './components/SpreadsheetGridMode';
import { QuickActionModal } from './components/QuickActionModal';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { EspecieAnimal, ESPECIES_TAXONOMY } from '../../types/animal';
import './components/eventosSpreadsheet.css';

export const EventosView: React.FC = () => {
  const { animals } = useApp();
  const [eventos, setEventos] = useState<EventoItem[]>(INITIAL_EVENTS);
  const [viewMode, setViewMode] = useState<'directorio' | 'spreadsheet'>('directorio');

  // Species Tabs specification
  const SPECIES_TABS: Array<{ id: 'Todas' | EspecieAnimal; label: string; icon: string }> = [
    { id: 'Todas', label: 'Todas las Especies', icon: '🐾' },
    { id: 'Bovinos', label: 'Bovinos', icon: '🐮' },
    { id: 'Aves de corral', label: 'Aves de corral', icon: '🐔' },
    { id: 'Porcinos', label: 'Porcinos', icon: '🐷' },
    { id: 'Búfalos', label: 'Búfalos', icon: '🐃' },
    { id: 'Caprinos', label: 'Caprinos', icon: '🐐' },
    { id: 'Equinos', label: 'Equinos', icon: '🐴' }
  ];

  const [selectedSpeciesTab, setSelectedSpeciesTab] = useState<'Todas' | EspecieAnimal>('Todas');

  const getEventSpecies = (ev: EventoItem): EspecieAnimal => {
    if (ev.especie) return ev.especie;
    const match = animals.find(a => a.practico.toUpperCase() === ev.codigoAnimal.toUpperCase());
    if (match?.especie) return match.especie;
    const c = ev.codigoAnimal.toUpperCase();
    if (c.startsWith('AVE-') || c.startsWith('GALP-') || c.startsWith('INC-') || c.startsWith('GF-') || c.startsWith('POLL-')) return 'Aves de corral';
    if (c.startsWith('POR-') || c.startsWith('LECH-') || c.startsWith('VERR-')) return 'Porcinos';
    if (c.startsWith('BUF-') || c.startsWith('BUC-') || c.startsWith('PAD-BUF')) return 'Búfalos';
    if (c.startsWith('CAP-') || c.startsWith('CHIV-') || c.startsWith('CAB-')) return 'Caprinos';
    if (c.startsWith('EQU-') || c.startsWith('POT-') || c.startsWith('PADR-')) return 'Equinos';
    return 'Bovinos';
  };

  const getAnimalSpeciesMeta = (code: string, explicitSpecies?: EspecieAnimal) => {
    if (explicitSpecies && ESPECIES_TAXONOMY[explicitSpecies]) {
      return ESPECIES_TAXONOMY[explicitSpecies];
    }
    const match = animals.find(a => a.practico.toUpperCase() === code.toUpperCase());
    if (match?.especie) {
      return ESPECIES_TAXONOMY[match.especie];
    }
    const c = code.toUpperCase();
    if (c.startsWith('AVE-') || c.startsWith('GALP-') || c.startsWith('INC-') || c.startsWith('GF-')) return ESPECIES_TAXONOMY['Aves de corral'];
    if (c.startsWith('POR-') || c.startsWith('LECH-') || c.startsWith('VERR-')) return ESPECIES_TAXONOMY['Porcinos'];
    if (c.startsWith('BUF-') || c.startsWith('BUC-') || c.startsWith('PAD-BUF')) return ESPECIES_TAXONOMY['Búfalos'];
    if (c.startsWith('CAP-') || c.startsWith('CHIV-') || c.startsWith('CAB-')) return ESPECIES_TAXONOMY['Caprinos'];
    if (c.startsWith('EQU-') || c.startsWith('POT-') || c.startsWith('PADR-')) return ESPECIES_TAXONOMY['Equinos'];
    return ESPECIES_TAXONOMY['Bovinos'];
  };

  const getSpeciesBadgeStyle = (species: EspecieAnimal) => {
    switch (species) {
      case 'Bovinos':
        return { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' };
      case 'Aves de corral':
        return { bg: '#fef3c7', color: '#92400e', border: '#fde68a' };
      case 'Porcinos':
        return { bg: '#ffedd5', color: '#9a3412', border: '#fed7aa' };
      case 'Búfalos':
        return { bg: '#e0e7ff', color: '#3730a3', border: '#c7d2fe' };
      case 'Caprinos':
        return { bg: '#ccfbf1', color: '#115e59', border: '#99f6e4' };
      case 'Equinos':
        return { bg: '#ede9fe', color: '#5b21b6', border: '#ddd6fe' };
      default:
        return { bg: '#f1f5f9', color: '#334155', border: '#cbd5e1' };
    }
  };
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState('Servicios IA / Monta');
  const [modalCategoria, setModalCategoria] = useState('Reproductivos');
  const [modalAnimal, setModalAnimal] = useState('0001');

  // Quick Action Modal (Cmd/Ctrl + K)
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  // Global shortcut Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickActionOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtros de eventos
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('Todos');

  const CATEGORY_TABS = [
    'Todos',
    'Reproductivos',
    'Productivos',
    'Sanitarios & Veterinarios',
    'Manejo & Rutina',
    'Inventarios & Movimientos'
  ];

  const filteredEventos = useMemo(() => {
    return eventos.filter(ev => {
      // 1. Filtro por Especie
      if (selectedSpeciesTab !== 'Todas') {
        const evSpecies = getEventSpecies(ev);
        if (evSpecies !== selectedSpeciesTab) return false;
      }

      // 2. Filtro por Categoría
      if (selectedCategoryTab !== 'Todos') {
        if (selectedCategoryTab === 'Sanitarios & Veterinarios') {
          if (!ev.categoria.includes('Sanitari') && !ev.categoria.includes('Veterinari')) return false;
        } else if (selectedCategoryTab === 'Manejo & Rutina') {
          if (!ev.categoria.includes('Manejo') && !ev.categoria.includes('Rutina')) return false;
        } else if (selectedCategoryTab === 'Inventarios & Movimientos') {
          if (!ev.categoria.includes('Inventario') && !ev.categoria.includes('Movimiento')) return false;
        } else if (!ev.categoria.toLowerCase().includes(selectedCategoryTab.toLowerCase())) {
          return false;
        }
      }

      // 3. Filtro por término de búsqueda
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchAnimal = ev.codigoAnimal.toLowerCase().includes(q);
        const matchType = ev.tipoEvento.toLowerCase().includes(q);
        const matchCategory = ev.categoria.toLowerCase().includes(q);
        const matchTech = (ev.tecnico || '').toLowerCase().includes(q);
        const matchVenc = ev.vencimiento.toLowerCase().includes(q);
        const matchObs = (ev.observaciones || '').toLowerCase().includes(q);
        const matchSpecies = (ev.especie || '').toLowerCase().includes(q);
        if (!matchAnimal && !matchType && !matchCategory && !matchTech && !matchVenc && !matchObs && !matchSpecies) return false;
      }

      return true;
    });
  }, [eventos, selectedSpeciesTab, selectedCategoryTab, searchTerm]);

  const handleSelectLink = (link: string, category: string, animal = '0001') => {
    setModalTipo(link);
    setModalCategoria(category);
    setModalAnimal(animal);
    setIsModalOpen(true);
  };

  const handleSaveEvento = (nuevo: EventoItem) => {
    setEventos(prev => [nuevo, ...prev]);
  };

  const handleSaveBatchEventos = (batch: EventoItem[]) => {
    setEventos(prev => [...batch, ...prev]);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSpeciesTab('Todas');
    setSelectedCategoryTab('Todos');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* Header */}
      <div className="events-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div className="events-header-left">
          <h2 className="toolbar-title">Centro de Eventos Multi-Especie</h2>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Registro transaccional de operaciones zootécnicas, reproductivas, productivas, sanitarias y de manejo
          </span>
        </div>

        {/* Center / Right: Mode Switcher & Actions */}
        <div className="events-header-right" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* View Mode Switcher Toggle */}
          <div className="eventos-mode-switcher">
            <button
              type="button"
              className={`eventos-mode-btn ${viewMode === 'directorio' ? 'active' : ''}`}
              onClick={() => setViewMode('directorio')}
            >
              <FolderTree size={16} />
              <span>Directorio de Eventos</span>
            </button>
            <button
              type="button"
              className={`eventos-mode-btn ${viewMode === 'spreadsheet' ? 'active' : ''}`}
              onClick={() => setViewMode('spreadsheet')}
            >
              <FileSpreadsheet size={16} />
              <span>Modo Hoja de Cálculo (Manga)</span>
            </button>
          </div>

          {/* Quick-Action Launcher Button (Cmd/Ctrl + K) */}
          <button
            type="button"
            className="quick-action-launcher-btn"
            onClick={() => setIsQuickActionOpen(true)}
            title="Abrir buscador rápido de eventos (Cmd/Ctrl + K)"
          >
            <Zap size={15} color="#d97706" />
            <span>Acción Rápida</span>
            <span className="quick-action-kbd">Ctrl+K</span>
          </button>

          {/* Quick Add Event */}
          <button
            type="button"
            className="btn-primary"
            onClick={() => handleSelectLink('Servicios IA / Monta', 'Reproductivos')}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={16} />
            <span>Registrar Evento</span>
          </button>

          {/* Sliders Settings Button */}
          <Link to="/ajustes" className="btn-green-sliders" style={{ textDecoration: 'none' }}>
            <Sliders size={16} strokeWidth={2} />
            <span>Ajustes</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area based on viewMode */}
      {viewMode === 'spreadsheet' ? (
        <SpreadsheetGridMode onSaveBatch={handleSaveBatchEventos} />
      ) : (
        <>
          {/* SPECIES FILTER BAR */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            backgroundColor: '#ffffff',
            padding: '12px 16px',
            borderRadius: 10,
            border: '1px solid var(--border-gray)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginRight: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                Filtrar por Especie:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {SPECIES_TABS.map(tab => {
                  const isSelected = selectedSpeciesTab === tab.id;
                  const count = tab.id === 'Todas'
                    ? eventos.length
                    : eventos.filter(ev => getEventSpecies(ev) === tab.id).length;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      className={`filter-pill-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedSpeciesTab(tab.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        border: isSelected ? '1px solid var(--primary-color)' : '1px solid #e2e8f0',
                        borderRadius: 20,
                        padding: '6px 14px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--primary-color)' : '#f8fafc',
                        color: isSelected ? '#ffffff' : '#334155',
                        boxShadow: isSelected ? '0 2px 4px rgba(45,106,79,0.2)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: 14 }}>{tab.icon}</span>
                      <span>{tab.label}</span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 10,
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                        color: isSelected ? '#ffffff' : '#64748b'
                      }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedSpeciesTab !== 'Todas' && (
              <button
                type="button"
                onClick={() => setSelectedSpeciesTab('Todas')}
                style={{
                  fontSize: 12,
                  color: 'var(--primary-color)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textDecoration: 'underline'
                }}
              >
                Ver todas las especies
              </button>
            )}
          </div>

          {/* Filter and Search Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            backgroundColor: '#ffffff',
            padding: '12px 16px',
            borderRadius: 10,
            border: '1px solid var(--border-gray)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginRight: 4 }}>
                Categoría:
              </span>
              {CATEGORY_TABS.map(tab => (
                <button
                  key={tab}
                  type="button"
                  className={`filter-pill-btn ${selectedCategoryTab === tab ? 'active' : ''}`}
                  onClick={() => setSelectedCategoryTab(tab)}
                  style={{
                    border: 'none',
                    borderRadius: 20,
                    padding: '6px 14px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: selectedCategoryTab === tab ? 'var(--primary-color)' : '#f1f5f9',
                    color: selectedCategoryTab === tab ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              position: 'relative',
              minWidth: 260
            }}>
              <input
                type="text"
                className="form-input"
                placeholder="Buscar por animal, especie, evento o técnico..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: 34,
                  paddingRight: searchTerm ? 30 : 12,
                  height: 36,
                  fontSize: 13,
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  width: '100%'
                }}
              />
              <span style={{ position: 'absolute', left: 10, color: '#94a3b8', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: 8,
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Events Table (Recent & Scheduled Tasks) */}
          <div>
            <div className="events-table-container">
              <table className="events-table">
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>Fecha</th>
                    <th style={{ width: '22%' }}>Semoviente / Especie</th>
                    <th style={{ width: '33%' }}>Tipo de Evento &amp; Detalles</th>
                    <th style={{ width: '30%' }}>Vencimiento / Próx. Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEventos.map(ev => {
                    const species = getEventSpecies(ev);
                    const speciesMeta = getAnimalSpeciesMeta(ev.codigoAnimal, ev.especie);
                    const badgeStyle = getSpeciesBadgeStyle(species);

                    return (
                      <tr key={ev.id}>
                        <td style={{ fontWeight: 500 }}>{ev.fecha}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{
                                fontWeight: 700,
                                color: 'var(--primary-color)',
                                backgroundColor: 'var(--primary-ultra-light)',
                                padding: '2px 8px',
                                borderRadius: 4,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                fontFamily: 'JetBrains Mono'
                              }}>
                                <span>{speciesMeta?.icono || '🐾'}</span>
                                <span>{ev.codigoAnimal}</span>
                              </span>

                              <span style={{
                                fontSize: 11,
                                fontWeight: 600,
                                padding: '2px 8px',
                                borderRadius: 12,
                                backgroundColor: badgeStyle.bg,
                                color: badgeStyle.color,
                                border: `1px solid ${badgeStyle.border}`
                              }}>
                                {species}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>
                            {ev.tipoEvento}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block' }}>
                            {ev.categoria} {ev.tecnico ? `• Resp: ${ev.tecnico}` : ''}
                          </span>
                          {ev.observaciones && (
                            <span style={{ fontSize: 11, color: '#475569', display: 'block', marginTop: 3, fontStyle: 'italic', lineHeight: 1.4 }}>
                              {ev.observaciones}
                            </span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                            <CheckCircle2 size={15} color="#16a34a" style={{ marginTop: 2, flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 500 }}>
                              {ev.vencimiento}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredEventos.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '36px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 24 }}>🔍</span>
                          <span style={{ fontWeight: 600 }}>No se encontraron eventos con los filtros seleccionados</span>
                          <span style={{ fontSize: 12 }}>Intenta cambiando de especie o borrando el término de búsqueda</span>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={handleResetFilters}
                            style={{ fontSize: 12, padding: '4px 14px', marginTop: 6 }}
                          >
                            Restablecer todos los filtros
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="events-table-footer-text">
              Mostrando {filteredEventos.length} de {eventos.length} {eventos.length === 1 ? 'registro transaccional' : 'registros transaccionales'}
              {selectedSpeciesTab !== 'Todas' ? ` (Filtrado por: ${selectedSpeciesTab})` : ''}
            </div>
          </div>

          {/* Grid of Event Categories */}
          <div className="events-categories-grid">
            {getEventCategoriesForSpecies(selectedSpeciesTab).map(cat => (
              <EventCategoryCard
                key={cat.titulo}
                category={cat}
                onSelectLink={(link, catTitle) => {
                  const defaultAnimal = selectedSpeciesTab === 'Aves de corral' ? 'GALP-01' : 
                    selectedSpeciesTab === 'Porcinos' ? 'POR-CR01' :
                    selectedSpeciesTab === 'Caprinos' ? 'CAP-01' :
                    selectedSpeciesTab === 'Equinos' ? 'EQ-01' :
                    selectedSpeciesTab === 'Búfalos' ? 'BUF-01' : '0001';
                  handleSelectLink(link, catTitle, defaultAnimal);
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal para Registrar Evento */}
      <NuevoEventoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tipoInicial={modalTipo}
        categoriaInicial={modalCategoria}
        codigoAnimalInicial={modalAnimal}
        onSave={handleSaveEvento}
      />

      {/* Quick-Action Launcher Dialog (Cmd/Ctrl + K) */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onSelectAction={(tipo, categoria, codigoAnimal) => {
          handleSelectLink(tipo, categoria, codigoAnimal);
        }}
      />
    </div>
  );
};
