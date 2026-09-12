import React from 'react';
import { Animal } from '../../../types/animal';

interface AnimalesTableProps {
  items: Animal[];
  selectedAnimals: { [key: string]: boolean };
  isSelectAll: boolean;
  onToggleSelectAll: () => void;
  onToggleSelect: (practico: string) => void;
  onSelectAnimal?: (animal: Animal) => void;
}

export const AnimalesTable: React.FC<AnimalesTableProps> = ({
  items,
  selectedAnimals,
  isSelectAll,
  onToggleSelectAll,
  onToggleSelect,
  onSelectAnimal
}) => {
  return (
    <div className="table-wrapper">
      <table className="animals-table">
        <thead>
          <tr>
            <th className="checkbox-cell">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={isSelectAll}
                onChange={onToggleSelectAll}
              />
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">
                  Práctico
                  <svg className="th-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                  </svg>
                </span>
                <span className="th-subtitle">Único</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Categoría</span>
                <span className="th-subtitle">Estatus</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Fecha nacimiento</span>
                <span className="th-subtitle">Edad</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Lote</span>
                <span className="th-subtitle">Descripción</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Composición</span>
                <span className="th-subtitle">Racial</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Etiquetas</span>
                <span className="th-subtitle">Activos</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Padre</span>
                <span className="th-subtitle">Madre</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(animal => (
            <tr
              key={animal.practico}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectAnimal?.(animal)}
            >
              <td className="checkbox-cell" onClick={e => e.stopPropagation()}>
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={!!selectedAnimals[animal.practico]}
                  onChange={() => onToggleSelect(animal.practico)}
                />
              </td>
              <td>
                <div className="td-inner">
                  <span className="td-line1" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px 8px',
                      borderRadius: 6,
                      backgroundColor: '#e8f5e9',
                      color: '#2d6a4f',
                      fontWeight: 800,
                      fontSize: 13,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                      {animal.practico}
                    </span>
                    {animal.alertaSanitaria && (
                      <span 
                        title={`Alerta Sanitaria: ${animal.alertaSanitaria}`} 
                        style={{ 
                          fontSize: 11, 
                          backgroundColor: '#fee2e2', 
                          color: '#dc2626', 
                          padding: '1px 6px', 
                          borderRadius: 4, 
                          fontWeight: 700 
                        }}
                      >
                        ⚠️ Retiro
                      </span>
                    )}
                  </span>
                  <span className="td-line2">{animal.unico}</span>
                </div>
              </td>
              <td>
                <div className="td-inner">
                  <span className="td-line1" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span 
                      style={{ fontSize: 15 }} 
                      title={animal.especie || 'Bovinos'}
                    >
                      {animal.especie === 'Aves de corral' ? '🐔' :
                       animal.especie === 'Porcinos' ? '🐷' :
                       animal.especie === 'Búfalos' ? '🐃' :
                       animal.especie === 'Caprinos' ? '🐐' :
                       animal.especie === 'Equinos' ? '🐴' : '🐮'}
                    </span>
                    <span style={{ fontWeight: 600 }}>{animal.subcategoria || animal.categoria}</span>
                  </span>
                  <span className="td-line2" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span>{animal.estatus}</span>
                    {animal.especie && (
                      <span 
                        style={{ 
                          fontSize: 10, 
                          backgroundColor: '#f1f5f9', 
                          color: '#475569', 
                          padding: '1px 5px', 
                          borderRadius: 4, 
                          fontWeight: 600 
                        }}
                      >
                        {animal.especie}
                      </span>
                    )}
                  </span>
                </div>
              </td>
              <td>
                <div className="td-inner">
                  <span className="td-line1">{animal.fechaNacimiento || '\u00A0'}</span>
                  <span className="td-line2">{animal.edad || '\u00A0'}</span>
                </div>
              </td>
              <td>
                <div className="td-inner">
                  <span className="td-line1">{animal.lote}</span>
                  <span className="td-line2">{animal.descripcion}</span>
                </div>
              </td>
              <td>
                <div className="td-inner">
                  <span className="td-line1">{animal.composicion}</span>
                  <span className="td-line2">{animal.racial || '\u00A0'}</span>
                </div>
              </td>
              <td>
                <div className="td-inner">
                  <span className="td-line1">{animal.etiquetas || '\u00A0'}</span>
                  <span className="td-line2">{animal.activos || '\u00A0'}</span>
                </div>
              </td>
              <td>
                <div className="td-inner">
                  <span className="td-line1">{animal.padre || '\u00A0'}</span>
                  <span className="td-line2">{animal.madre || '\u00A0'}</span>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                No se encontraron semovientes con los criterios de búsqueda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
