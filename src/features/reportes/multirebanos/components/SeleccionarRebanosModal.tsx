import React, { useState, useEffect } from 'react';
import { X, Filter, Search } from 'lucide-react';
import { MOCK_REBANOS_CATALOGO, RebanoItem } from '../multirebanosMockData';

interface SeleccionarRebanosModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onApply: (ids: string[]) => void;
}

export const SeleccionarRebanosModal: React.FC<SeleccionarRebanosModalProps> = ({
  isOpen,
  onClose,
  selectedIds,
  onApply
}) => {
  const [tempSelected, setTempSelected] = useState<string[]>(selectedIds);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedIds);
      setSearchTerm('');
    }
  }, [isOpen, selectedIds]);

  if (!isOpen) return null;

  const filteredRebanos = MOCK_REBANOS_CATALOGO.filter(r => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      r.nombre.toLowerCase().includes(q) ||
      r.propietario.toLowerCase().includes(q) ||
      r.especie.toLowerCase().includes(q)
    );
  });

  const isAllSelected =
    filteredRebanos.length > 0 &&
    filteredRebanos.every(r => tempSelected.includes(r.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const filteredIds = new Set(filteredRebanos.map(r => r.id));
      setTempSelected(prev => prev.filter(id => !filteredIds.has(id)));
    } else {
      const newSelected = new Set([...tempSelected, ...filteredRebanos.map(r => r.id)]);
      setTempSelected(Array.from(newSelected));
    }
  };

  const toggleOne = (id: string) => {
    setTempSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAccept = () => {
    onApply(tempSelected);
    onClose();
  };

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div
        className="report-modal-dialog modal-large"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 840, backgroundColor: '#1e2424', color: '#e2e8f0', borderRadius: 12 }}
      >
        {/* Header exact to GanSoft */}
        <div
          className="report-modal-header"
          style={{
            borderBottom: '1px solid #2d3748',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#f8fafc' }}>
              Seleccionar rebaños
            </h3>
            <span
              style={{
                fontSize: 12,
                backgroundColor: '#134e4a',
                color: '#2dd4bf',
                padding: '2px 8px',
                borderRadius: 12,
                fontWeight: 600
              }}
            >
              {tempSelected.length} seleccionado(s)
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 4
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search inside modal */}
        <div style={{ padding: '12px 20px 0 20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#141818',
              border: '1px solid #334155',
              borderRadius: 6,
              padding: '6px 12px'
            }}
          >
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder="Buscar por rebaño, propietario o especie..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: '#f8fafc',
                outline: 'none',
                width: '100%',
                fontSize: 13
              }}
            />
          </div>
        </div>

        {/* Body Table matching GanSoft screenshot */}
        <div style={{ padding: '14px 20px', minHeight: 280, maxHeight: 420, overflowY: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 13,
              color: '#cbd5e1'
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '2px solid #22c55e',
                  textAlign: 'left',
                  color: '#f1f5f9'
                }}
              >
                <th style={{ width: 44, padding: '10px 8px' }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    style={{ accentColor: '#22c55e', cursor: 'pointer', width: 16, height: 16 }}
                  />
                </th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Rebaño</span>
                    <Filter size={13} color="#94a3b8" />
                  </div>
                </th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Propietario</span>
                    <Filter size={13} color="#94a3b8" />
                  </div>
                </th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Especie</span>
                    <Filter size={13} color="#94a3b8" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRebanos.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
                    No se encontraron rebaños coincidentes
                  </td>
                </tr>
              ) : (
                filteredRebanos.map((r: RebanoItem) => {
                  const isChecked = tempSelected.includes(r.id);
                  return (
                    <tr
                      key={r.id}
                      onClick={() => toggleOne(r.id)}
                      style={{
                        borderBottom: '1px solid #283333',
                        backgroundColor: isChecked ? 'rgba(34, 197, 94, 0.08)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <td style={{ padding: '12px 8px' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleOne(r.id)}
                          onClick={e => e.stopPropagation()}
                          style={{ accentColor: '#22c55e', cursor: 'pointer', width: 16, height: 16 }}
                        />
                      </td>
                      <td style={{ padding: '12px 12px', fontWeight: 600, color: isChecked ? '#4ade80' : '#f8fafc' }}>
                        {r.nombre}
                      </td>
                      <td style={{ padding: '12px 12px', color: '#94a3b8' }}>
                        {r.propietario}
                      </td>
                      <td style={{ padding: '12px 12px' }}>
                        <span
                          style={{
                            backgroundColor: '#134e4a',
                            color: '#5eead4',
                            padding: '3px 8px',
                            borderRadius: 4,
                            fontSize: 11.5,
                            fontWeight: 600
                          }}
                        >
                          {r.especie}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer exactly like GanSoft screenshot: Red/Coral Cancelar, Emerald Aceptar */}
        <div
          className="report-modal-footer"
          style={{
            borderTop: '1px solid #2d3748',
            padding: '14px 20px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 20px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAccept}
            style={{
              backgroundColor: '#22c55e',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 22px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
