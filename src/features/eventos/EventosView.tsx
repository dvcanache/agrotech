import React, { useState } from 'react';
import { Settings, Sliders, ChevronDown, Plus, CheckCircle2 } from 'lucide-react';
import { EVENT_CATEGORIES } from './eventosData';
import { EventCategoryCard } from './components/EventCategoryCard';
import { NuevoEventoModal, EventoItem } from './components/NuevoEventoModal';
import { Link } from 'react-router-dom';

const INITIAL_EVENTS: EventoItem[] = [
  {
    id: 'ev-1',
    fecha: '11/09/2026',
    codigoAnimal: '0001',
    categoria: 'Productivos',
    tipoEvento: 'Pesajes de leche',
    vencimiento: 'Próximo control en 15 días',
    tecnico: 'Dr. Carlos Mendoza'
  },
  {
    id: 'ev-2',
    fecha: '08/09/2026',
    codigoAnimal: '0002',
    categoria: 'Reproductivos',
    tipoEvento: 'Revisiones',
    vencimiento: 'Aviso de Secado en 180 días',
    tecnico: 'Roberto Gómez'
  },
  {
    id: 'ev-3',
    fecha: '01/09/2026',
    codigoAnimal: 'BCA01',
    categoria: 'Veterinarios',
    tipoEvento: 'Planes sanitarios',
    vencimiento: 'Refuerzo Aftosa en 6 meses',
    tecnico: 'Luis Martínez'
  }
];

export const EventosView: React.FC = () => {
  const [eventos, setEventos] = useState<EventoItem[]>(INITIAL_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState('Servicios');
  const [modalCategoria, setModalCategoria] = useState('Reproductivos');

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

  const handleSelectLink = (link: string, category: string) => {
    setModalTipo(link);
    setModalCategoria(category);
    setIsModalOpen(true);
  };

  const handleSaveEvento = (nuevo: EventoItem) => {
    setEventos(prev => [nuevo, ...prev]);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategoryTab('Todos');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* Header */}
      <div className="events-header">
        <div className="events-header-left">
          <h2 className="toolbar-title">Centro de Eventos</h2>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Registro transaccional de operaciones zootécnicas, productivas y sanitarias
          </span>
        </div>
        <div className="events-header-right" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                      borderRadius: 4
                    }}>
                      {ev.codigoAnimal}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{ev.tipoEvento}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block' }}>
                      {ev.categoria} {ev.tecnico ? `• ${ev.tecnico}` : ''}
                    </span>
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

      {/* Modal para Registrar Evento */}
      <NuevoEventoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tipoInicial={modalTipo}
        categoriaInicial={modalCategoria}
        onSave={handleSaveEvento}
      />
    </div>
  );
};
