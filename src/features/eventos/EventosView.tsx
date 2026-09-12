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

  const handleSelectLink = (link: string, category: string) => {
    setModalTipo(link);
    setModalCategoria(category);
    setIsModalOpen(true);
  };

  const handleSaveEvento = (nuevo: EventoItem) => {
    setEventos(prev => [nuevo, ...prev]);
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
              {eventos.map(ev => (
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
              {eventos.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>
                    Ningún registro encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="events-table-footer-text">
          {eventos.length} {eventos.length === 1 ? 'registro' : 'registros'}
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
