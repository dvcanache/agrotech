import React from 'react';
import { Plus, ChevronDown, Filter } from 'lucide-react';
import { REPORT_CATEGORIES } from './reportesData';
import { ReportCategoryCard } from './components/ReportCategoryCard';

export const ReportesView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* Header */}
      <div className="events-header">
        <div className="events-header-left">
          <h2 className="toolbar-title">Centro de Reportes</h2>
        </div>
        <div className="events-header-right">
          {/* Green Split Button */}
          <div className="split-button-container">
            <button
              className="split-button-main"
              title="Agregar Reporte"
              type="button"
              onClick={() => alert('Modal para configurar nuevo reporte')}
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Agregar</span>
            </button>
            <button className="split-button-arrow" type="button">
              <ChevronDown size={12} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State Table */}
      <div>
        <div className="events-table-container">
          <table className="events-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>
                  Código
                  <Filter size={13} style={{ float: 'right', marginTop: 3 }} />
                </th>
                <th style={{ width: '30%' }}>
                  Nombre
                  <Filter size={13} style={{ float: 'right', marginTop: 3 }} />
                </th>
                <th style={{ width: '35%' }}>
                  Descripción
                  <Filter size={13} style={{ float: 'right', marginTop: 3 }} />
                </th>
                <th style={{ width: '10%' }}></th>
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
      </div>

      {/* Grid of Report Categories (4 Cards) */}
      <div className="reports-categories-grid">
        {REPORT_CATEGORIES.map(cat => (
          <ReportCategoryCard key={cat.titulo} category={cat} />
        ))}
      </div>
    </div>
  );
};
