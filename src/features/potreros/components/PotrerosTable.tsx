import React from 'react';
import { PotreroItem } from '../potrerosData';
import { MoreVertical, Eye, Edit2, RotateCw } from 'lucide-react';

interface PotrerosTableProps {
  items: PotreroItem[];
  selectedPotreros: { [key: string]: boolean };
  isSelectAll: boolean;
  onToggleSelectAll: () => void;
  onToggleSelect: (codigo: string) => void;
  onSelectPotrero?: (potrero: PotreroItem) => void;
}

export const PotrerosTable: React.FC<PotrerosTableProps> = ({
  items,
  selectedPotreros,
  isSelectAll,
  onToggleSelectAll,
  onToggleSelect,
  onSelectPotrero
}) => {
  const getStatusBadgeClass = (estatus: string) => {
    switch (estatus) {
      case 'Activo':
        return 'badge-status activo';
      case 'En descanso':
        return 'badge-status inactivo';
      case 'En mantenimiento':
        return 'badge-status descartado';
      case 'En siembra':
        return 'badge-status muerto';
      default:
        return 'badge-status';
    }
  };

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
                <span className="th-title">Código</span>
                <span className="th-subtitle">Descripción</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Superficie (ha)</span>
                <span className="th-subtitle">Perímetro (m)</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Especie Forrajera</span>
                <span className="th-subtitle">Aforo (kg MV/m²)</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Lote Asignado</span>
                <span className="th-subtitle">Animales</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Carga Animal</span>
                <span className="th-subtitle">Actual / Recom. (UGG/ha)</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Rotación</span>
                <span className="th-subtitle">Ocup. / Descanso</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Estatus</span>
              </div>
            </th>
            <th style={{ width: 60, textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(potrero => (
            <tr
              key={potrero.codigo}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectPotrero?.(potrero)}
            >
              <td className="checkbox-cell" onClick={e => e.stopPropagation()}>
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={!!selectedPotreros[potrero.codigo]}
                  onChange={() => onToggleSelect(potrero.codigo)}
                />
              </td>
              <td>
                <div className="td-inner">
                  <span className="td-line1" style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                    {potrero.codigo}
                  </span>
                  <span className="td-line2">{potrero.descripcion}</span>
                </div>
              </td>
              <td>
                <div className="td-inner">
                  <span className="td-line1">{potrero.areaHa.toLocaleString('es-VE')} ha</span>
                  <span className="td-line2">{potrero.perimetroM.toLocaleString('es-VE')} m</span>
                </div>
              </td>
              <td>
                <div className="td-inner">
                  <span className="td-line1">{potrero.especieForrajera}</span>
                  <span className="td-line2">{potrero.aforoKgM2.toFixed(1)} kg MV/m²</span>
                </div>
              </td>
              <td>
                <div className="td-inner">
                  <span className="td-line1">{potrero.loteAsignado || 'Sin lote asignado'}</span>
                  <span className="td-line2">
                    {potrero.animalesPresentes > 0 ? `${potrero.animalesPresentes} cabezas` : 'Vacío'}
                  </span>
                </div>
              </td>
              <td>
                <div className="td-inner">
                  <span className="td-line1">
                    {potrero.cargaActualUggHa.toFixed(2)} UGG/ha
                  </span>
                  <span className="td-line2">
                    Máx: {potrero.cargaRecomendadaUggHa.toFixed(2)} UGG/ha
                  </span>
                </div>
              </td>
              <td>
                <div className="td-inner">
                  <span className="td-line1">
                    {potrero.estatus === 'Activo'
                      ? `${potrero.diasOcupacionActual} / ${potrero.diasOcupacionMax} d ocupación`
                      : `${potrero.diasDescansoActual} / ${potrero.diasDescansoRequeridos} d descanso`}
                  </span>
                  <span className="td-line2">
                    {potrero.estatus === 'Activo'
                      ? `${potrero.diasOcupacionMax - potrero.diasOcupacionActual} d restantes`
                      : `${Math.max(0, potrero.diasDescansoRequeridos - potrero.diasDescansoActual)} d para habilitar`}
                  </span>
                </div>
              </td>
              <td>
                <span className={getStatusBadgeClass(potrero.estatus)}>
                  {potrero.estatus}
                </span>
              </td>
              <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                <button
                  type="button"
                  className="btn-icon"
                  title="Opciones del potrero"
                  onClick={() => onSelectPotrero?.(potrero)}
                >
                  <MoreVertical size={18} />
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                No se encontraron potreros registrados con los filtros actuales.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
