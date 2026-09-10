import React from 'react';
import { Settings, Sliders, ChevronDown } from 'lucide-react';
import { EVENT_CATEGORIES } from './eventosData';
import { EventCategoryCard } from './components/EventCategoryCard';
import { Link } from 'react-router-dom';

export const EventosView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* Header */}
      <div className="events-header">
        <div className="events-header-left">
          <h2 className="toolbar-title">Centro de Eventos</h2>
        </div>
        <div className="events-header-right">
          {/* Gear Dropdown Button */}
          <button className="btn-blue-dark" type="button">
            <Settings size={16} strokeWidth={2} />
            <ChevronDown size={12} strokeWidth={2.5} />
          </button>
          {/* Sliders Settings Button */}
          <Link to="/ajustes" className="btn-green-sliders" style={{ textDecoration: 'none' }}>
            <Sliders size={16} strokeWidth={2} />
            <span>Ajustes</span>
          </Link>
        </div>
      </div>

      {/* Empty State Table */}
      <div>
        <div className="events-table-container">
          <table className="events-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Fecha</th>
                <th style={{ width: '25%' }}>Código</th>
                <th style={{ width: '25%' }}>Tipo</th>
                <th style={{ width: '25%' }}>Vencimiento</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
                  Ningún registro encontrado
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="events-table-footer-text">
          0 registros
        </div>
      </div>

      {/* Grid of Event Categories */}
      <div className="events-categories-grid">
        {EVENT_CATEGORIES.map(cat => (
          <EventCategoryCard key={cat.titulo} category={cat} />
        ))}
      </div>
    </div>
  );
};
