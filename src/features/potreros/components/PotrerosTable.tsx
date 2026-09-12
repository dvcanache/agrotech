import React from 'react';
import { PotreroItem } from '../potrerosData';
import { getPrvStatusInfo } from '../prvUtils';
import { MoreVertical, Scale, Map, AlertTriangle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PotrerosTableProps {
  items: PotreroItem[];
  selectedPotreros: { [key: string]: boolean };
  isSelectAll: boolean;
  onToggleSelectAll: () => void;
  onToggleSelect: (codigo: string) => void;
  onSelectPotrero?: (potrero: PotreroItem) => void;
  onOpenAforoModal?: (potrero: PotreroItem) => void;
}

export const PotrerosTable: React.FC<PotrerosTableProps> = ({
  items,
  selectedPotreros,
  isSelectAll,
  onToggleSelectAll,
  onToggleSelect,
  onSelectPotrero,
  onOpenAforoModal
}) => {
  return (
    <div className="table-wrapper">
      <table className="animals-table potreros-table">
        <thead>
          <tr>
            <th className="checkbox-cell">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={isSelectAll}
                onChange={onToggleSelectAll}
                aria-label="Seleccionar todos los potreros"
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
                <span className="th-subtitle">Vigor NDVI</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Aforo (kg MV/m²)</span>
                <span className="th-subtitle">Oferta MS (kg MS/ha)</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Lote Asignado</span>
                <span className="th-subtitle">Animales & UGG</span>
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
                <span className="th-title">Días Ocupado</span>
                <span className="th-subtitle">Días en Descanso</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Semáforo PRV</span>
                <span className="th-subtitle">Estado Voisin</span>
              </div>
            </th>
            <th style={{ width: 100, textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(potrero => {
            const prvInfo = getPrvStatusInfo(
              potrero.animalesPresentes,
              potrero.diasOcupacionActual,
              potrero.diasDescansoActual,
              potrero.diasDescansoRequeridos
            );

            return (
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
                    aria-label={`Seleccionar potrero ${potrero.codigo}`}
                  />
                </td>

                {/* Código & Descripción */}
                <td>
                  <div className="td-inner">
                    <span className="td-line1" style={{ fontWeight: 700, color: 'var(--primary-color)' }}>
                      {potrero.codigo}
                    </span>
                    <span className="td-line2" style={{ fontWeight: 500 }}>
                      {potrero.descripcion}
                    </span>
                  </div>
                </td>

                {/* Superficie & Perímetro */}
                <td>
                  <div className="td-inner">
                    <span className="td-line1" style={{ fontWeight: 600 }}>
                      {potrero.areaHa.toLocaleString('es-VE')} ha
                    </span>
                    <span className="td-line2">
                      {potrero.perimetroM.toLocaleString('es-VE')} m cerca
                    </span>
                  </div>
                </td>

                {/* Forraje & NDVI */}
                <td>
                  <div className="td-inner">
                    <span className="td-line1" style={{ fontWeight: 500 }}>
                      {potrero.especieForrajera}
                    </span>
                    <span className="td-line2" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: potrero.ndviValue >= 0.7 ? '#22c55e' : potrero.ndviValue >= 0.5 ? '#eab308' : '#ef4444'
                        }}
                      />
                      NDVI: {potrero.ndviValue.toFixed(2)}
                    </span>
                  </div>
                </td>

                {/* Aforo en Verde & Materia Seca */}
                <td>
                  <div className="td-inner">
                    <span className="td-line1" style={{ fontWeight: 700, color: '#1f2937' }}>
                      {potrero.aforoKgM2.toFixed(1)} <span style={{ fontSize: 11, fontWeight: 500, color: '#6b7280' }}>kg MV/m²</span>
                    </span>
                    <span className="td-line2" style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                      {potrero.aforoKgMsHa.toLocaleString('es-VE')} kg MS/ha ({potrero.porcentajeMS}% MS)
                    </span>
                  </div>
                </td>

                {/* Lote & Animales */}
                <td>
                  <div className="td-inner">
                    <span className="td-line1" style={{ fontWeight: 600 }}>
                      {potrero.loteAsignado || 'Sin lote asignado'}
                    </span>
                    <span className="td-line2">
                      {potrero.animalesPresentes > 0
                        ? `${potrero.animalesPresentes} cabezas (${potrero.uggPresentes.toFixed(1)} UGG)`
                        : 'En reposo / Vacío'}
                    </span>
                  </div>
                </td>

                {/* Carga Animal */}
                <td>
                  <div className="td-inner">
                    <span
                      className="td-line1"
                      style={{
                        fontWeight: 700,
                        color: potrero.cargaActualUggHa > potrero.cargaRecomendadaUggHa ? '#dc2626' : 'var(--primary-color)'
                      }}
                    >
                      {potrero.cargaActualUggHa.toFixed(2)} UGG/ha
                    </span>
                    <span className="td-line2">
                      Capacidad: {potrero.cargaRecomendadaUggHa.toFixed(2)} UGG/ha
                    </span>
                  </div>
                </td>

                {/* Días Ocupado / Descanso */}
                <td>
                  <div className="td-inner">
                    <span className="td-line1" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {potrero.animalesPresentes > 0 ? (
                        <>
                          <Clock size={12} color={potrero.diasOcupacionActual > 2 ? '#ef4444' : '#eab308'} />
                          <span style={{
                            fontWeight: 700,
                            color: potrero.diasOcupacionActual > 2 ? '#dc2626' : '#854d0e'
                          }}>
                            {potrero.diasOcupacionActual} d ocupado
                          </span>
                          {potrero.diasOcupacionActual > 2 && (
                            <AlertTriangle size={12} color="#dc2626" title="¡Sobrepastoreo! Superó 2 días" />
                          )}
                        </>
                      ) : (
                        <span style={{ color: '#6b7280' }}>0 d (Vacío)</span>
                      )}
                    </span>
                    <span className="td-line2">
                      {potrero.animalesPresentes === 0 ? (
                        <span style={{
                          fontWeight: 600,
                          color: potrero.diasDescansoActual >= potrero.diasDescansoRequeridos ? '#166534' : '#1e40af'
                        }}>
                          {potrero.diasDescansoActual} / {potrero.diasDescansoRequeridos} d descanso
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>En pastoreo</span>
                      )}
                    </span>
                  </div>
                </td>

                {/* PRV Status Chip */}
                <td>
                  <div
                    className={`prv-chip ${prvInfo.badgeClass}`}
                    style={{
                      backgroundColor: prvInfo.bgColor,
                      color: prvInfo.textColor,
                      borderColor: prvInfo.borderColor
                    }}
                    title={`${prvInfo.label}: ${prvInfo.description}`}
                  >
                    <span className="prv-chip-dot" style={{ backgroundColor: prvInfo.color }} />
                    <span className="prv-chip-text">{prvInfo.shortLabel}</span>
                  </div>
                </td>

                {/* Acciones */}
                <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <button
                      type="button"
                      className="btn-icon"
                      title="Calcular aforo forrajero (Marco de corte)"
                      onClick={() => onOpenAforoModal?.(potrero)}
                      style={{ color: 'var(--primary-color)' }}
                    >
                      <Scale size={16} />
                    </button>
                    <Link
                      to="/mapas"
                      className="btn-icon"
                      title="Ver potrero en Cartografía GIS"
                      style={{ color: '#1976d2', display: 'inline-flex', alignItems: 'center' }}
                    >
                      <Map size={16} />
                    </Link>
                    <button
                      type="button"
                      className="btn-icon"
                      title="Más opciones"
                      onClick={() => onSelectPotrero?.(potrero)}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {items.length === 0 && (
            <tr>
              <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                No se encontraron potreros registrados con los filtros actuales.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
