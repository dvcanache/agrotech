import React, { useState, useMemo, useEffect } from 'react';
import { Sliders, Plus, CheckCircle2, Zap, FileSpreadsheet, FolderTree } from 'lucide-react';
import { EVENT_CATEGORIES } from './eventosData';
import { EventCategoryCard } from './components/EventCategoryCard';
import { NuevoEventoModal, EventoItem } from './components/NuevoEventoModal';
import { SpreadsheetGridMode } from './components/SpreadsheetGridMode';
import { QuickActionModal } from './components/QuickActionModal';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ESPECIES_TAXONOMY } from '../../types/animal';
import './components/eventosSpreadsheet.css';

const INITIAL_EVENTS: EventoItem[] = [
  {
    id: 'ev-1',
    fecha: '11/09/2026',
    codigoAnimal: '0001',
    categoria: 'Productivos',
    tipoEvento: 'Pesajes de leche',
    vencimiento: 'Próximo control lechero en 15 días (14.2 kg)',
    tecnico: 'Dr. Carlos Mendoza',
    observaciones: 'AM: 7.8 kg | PM: 6.4 kg | Grasa: 3.8% | RCS: 145k'
  },
  {
    id: 'ev-2',
    fecha: '10/09/2026',
    codigoAnimal: 'GALP-01',
    categoria: 'Productivos',
    tipoEvento: 'Control de Postura',
    vencimiento: 'Recolección diaria programada (% postura: 95.2%)',
    tecnico: 'Control Avícola Masivo',
    observaciones: 'Galpón 01: 2,500 aves | 2,380 comerciales | 35 rotos | Peso Prom: 62.5 g'
  },
  {
    id: 'ev-3',
    fecha: '09/09/2026',
    codigoAnimal: 'POR-CR01',
    categoria: 'Reproductivos',
    tipoEvento: 'Partos',
    vencimiento: 'Destete de camada en 21 días (12 lechones)',
    tecnico: 'Ing. Agr. Marcos Solís',
    observaciones: 'Parto Porcino: 12 vivos, 1 mortinato (Total: 13 | Camada: 16.8 kg | Prom: 1.40 kg)'
  },
  {
    id: 'ev-4',
    fecha: '08/09/2026',
    codigoAnimal: 'BUF-01',
    categoria: 'Productivos',
    tipoEvento: 'Pesajes de leche',
    vencimiento: 'Próximo control lechero búfala (8.6 kg)',
    tecnico: 'Roberto Gómez',
    observaciones: 'Ordeño Búfala: 8.6 kg/día | Grasa butirométrica 7.8% | RCS: 120k'
  },
  {
    id: 'ev-5',
    fecha: '05/09/2026',
    codigoAnimal: 'EQU-YG01',
    categoria: 'Veterinarios',
    tipoEvento: 'Planes sanitarios',
    vencimiento: 'Prueba Serológica AIE (Test Coggins) en 6 meses',
    tecnico: 'Dr. Carlos Mendoza',
    observaciones: 'Certificación de Anemia Infecciosa Equina Negativa • INSAI'
  },
  {
    id: 'ev-6',
    fecha: '01/09/2026',
    codigoAnimal: 'CAP-CL01',
    categoria: 'Veterinarios',
    tipoEvento: 'Planes sanitarios',
    vencimiento: 'Refuerzo Clostridiosis caprina en 6 meses',
    tecnico: 'Luis Martínez',
    observaciones: 'Vacunación polivalente de enterotoxemia caprina en aprisco'
  }
];

export const EventosView: React.FC = () => {
  const { animals } = useApp();
  const [eventos, setEventos] = useState<EventoItem[]>(INITIAL_EVENTS);
  const [viewMode, setViewMode] = useState<'directorio' | 'spreadsheet'>('directorio');

  const getAnimalSpeciesMeta = (code: string) => {
    const match = animals.find(a => a.practico.toUpperCase() === code.toUpperCase());
    if (match?.especie) {
      return ESPECIES_TAXONOMY[match.especie];
    }
    const c = code.toUpperCase();
    if (c.startsWith('AVE-') || c.startsWith('GALP-')) return ESPECIES_TAXONOMY['Aves de corral'];
    if (c.startsWith('POR-')) return ESPECIES_TAXONOMY['Porcinos'];
    if (c.startsWith('BUF-')) return ESPECIES_TAXONOMY['Búfalos'];
    if (c.startsWith('CAP-')) return ESPECIES_TAXONOMY['Caprinos'];
    if (c.startsWith('EQU-')) return ESPECIES_TAXONOMY['Equinos'];
    return ESPECIES_TAXONOMY['Bovinos'];
  };
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState('Servicios');
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

  const CATEGORY_TABS = ['Todos', 'Reproductivos', 'Productivos', 'Veterinarios', 'Sanitarios'];

  const filteredEventos = useMemo(() => {
    return eventos.filter(ev => {
      // Filtro por tab de categoría
      if (selectedCategoryTab !== 'Todos') {
        if (selectedCategoryTab === 'Sanitarios') {
          if (ev.categoria !== 'Sanitarios' && ev.categoria !== 'Veterinarios') return false;
        } else if (ev.categoria !== selectedCategoryTab) {
          return false;
        }
      }

      // Filtro por término de búsqueda
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchAnimal = ev.codigoAnimal.toLowerCase().includes(q);
        const matchType = ev.tipoEvento.toLowerCase().includes(q);
        const matchCategory = ev.categoria.toLowerCase().includes(q);
        const matchTech = (ev.tecnico || '').toLowerCase().includes(q);
        const matchVenc = ev.vencimiento.toLowerCase().includes(q);
        if (!matchAnimal && !matchType && !matchCategory && !matchTech && !matchVenc) return false;
      }

      return true;
    });
  }, [eventos, selectedCategoryTab, searchTerm]);

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
    setSelectedCategoryTab('Todos');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* Header */}
      <div className="events-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div className="events-header-left">
          <h2 className="toolbar-title">Centro de Eventos</h2>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Registro transaccional de operaciones zootécnicas, productivas y sanitarias
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
            onClick={() => handleSelectLink('Servicios', 'Reproductivos')}
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
                placeholder="Buscar por animal, evento o técnico..."
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
                    <th style={{ width: '20%' }}>Fecha</th>
                    <th style={{ width: '20%' }}>Código Animal</th>
                    <th style={{ width: '25%' }}>Tipo de Evento</th>
                    <th style={{ width: '35%' }}>Vencimiento / Próx. Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEventos.map(ev => (
                    <tr key={ev.id}>
                      <td style={{ fontWeight: 500 }}>{ev.fecha}</td>
                      <td>
                        <span style={{
                          fontWeight: 700,
                          color: 'var(--primary-color)',
                          backgroundColor: 'var(--primary-ultra-light)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6
                        }}>
                          <span>{getAnimalSpeciesMeta(ev.codigoAnimal)?.icono || '🐾'}</span>
                          <span>{ev.codigoAnimal}</span>
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{ev.tipoEvento}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block' }}>
                          {ev.categoria} {ev.tecnico ? `• ${ev.tecnico}` : ''}
                        </span>
                        {ev.observaciones && (
                          <span style={{ fontSize: 11, color: '#475569', display: 'block', marginTop: 2, fontStyle: 'italic' }}>
                            {ev.observaciones}
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CheckCircle2 size={14} color="#16a34a" />
                          <span>{ev.vencimiento}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredEventos.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '32px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <span>No se encontraron eventos con los filtros seleccionados</span>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={handleResetFilters}
                            style={{ fontSize: 12, padding: '4px 12px' }}
                          >
                            Restablecer filtros
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="events-table-footer-text">
              Mostrando {filteredEventos.length} de {eventos.length} {eventos.length === 1 ? 'registro' : 'registros'}
            </div>
          </div>

          {/* Grid of Event Categories */}
          <div className="events-categories-grid">
            {EVENT_CATEGORIES.map(cat => (
              <EventCategoryCard
                key={cat.titulo}
                category={cat}
                onSelectLink={handleSelectLink}
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
