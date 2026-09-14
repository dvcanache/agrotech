import React from 'react';
import { PotreroItem } from '../potrerosData';
import { getPrvStatusInfo, SPECIES_EMOJI, getUggFactor } from '../prvUtils';
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
                <span className="th-title">Código & Especie</span>
                <span className="th-subtitle">Descripción / Sector</span>
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
                <span className="th-title">Forraje / Alojamiento</span>
                <span className="th-subtitle">Vigor NDVI / Estatus</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Aforo / Capacidad</span>
                <span className="th-subtitle">Oferta MS / Plazas</span>
              </div>
            </th>
            <th>
              <div className="th-inner">
                <span className="th-title">Lote Asignado</span>
                <span className="th-subtitle">Población & UGG</span>
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
                <span className="th-subtitle">Estado Zootécnico</span>
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
            const factorUgg = getUggFactor(potrero.especie);

            /**
             * Calibración de Carga Instantánea vs Capacidad Global (AGR-05):
             * En PRV, la carga instantánea durante los 1-2 días de ocupación es fisiológicamente
             * mucho mayor que la capacidad de carga global de todo el ciclo de rotación.
             * Calculamos la capacidad instantánea máxima admisible para evitar falsas alarmas rojas.
             */
            const diasOcupacionMax = potrero.diasOcupacionMax || 2;
            const factorRotacionPrv = (potrero.diasDescansoRequeridos + diasOcupacionMax) / diasOcupacionMax;
            const capacidadInstantaneaUggHa = potrero.cargaRecomendadaUggHa > 0
              ? Number((potrero.cargaRecomendadaUggHa * factorRotacionPrv).toFixed(1))
              : 0;

            // Alerta roja solo si se sobrepasa la capacidad instantánea admisible para el período
            const esExcesoCargaInstantanea = capacidadInstantaneaUggHa > 0
              ? potrero.cargaActualUggHa > capacidadInstantaneaUggHa
              : false;

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

                {/* Código & Especie */}
                <td>
                  <div className="td-inner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="td-line1" style={{ fontWeight: 800, color: 'var(--primary-color)' }}>
                        {potrero.codigo}
                      </span>
                      <span style={{
                        fontSize: 11,
                        padding: '1px 6px',
                        borderRadius: 10,
                        backgroundColor: '#e8f5e9',
                        color: '#2d6a4f',
                        fontWeight: 600
                      }}>
                        {SPECIES_EMOJI[potrero.especie]} {potrero.especie}
                      </span>
                    </div>
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
                      {potrero.aforoKgMsHa > 0 ? (
                        <>
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: potrero.ndviValue >= 0.7 ? '#22c55e' : potrero.ndviValue >= 0.5 ? '#eab308' : '#ef4444'
                            }}
                          />
                          <span>NDVI: {potrero.ndviValue.toFixed(2)}</span>
                        </>
                      ) : (
                        <span style={{ color: '#64748b' }}>
                          {potrero.sistemaAlojamiento || 'Instalación techada'}
                        </span>
                      )}
                    </span>
                  </div>
                </td>

                {/* Aforo en Verde & Materia Seca o Capacidad */}
                <td>
                  <div className="td-inner">
                    {potrero.aforoKgMsHa > 0 ? (
                      <>
                        <span className="td-line1" style={{ fontWeight: 700, color: '#1f2937' }}>
                          {potrero.aforoKgM2.toFixed(1)} <span style={{ fontSize: 11, fontWeight: 500, color: '#6b7280' }}>kg MV/m²</span>
                        </span>
                        <span className="td-line2" style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                          {potrero.aforoKgMsHa.toLocaleString('es-VE')} kg MS/ha ({potrero.porcentajeMS}% MS)
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="td-line1" style={{ fontWeight: 700, color: '#1f2937' }}>
                          {potrero.capacidadMaxima || Math.round(potrero.animalesPresentes * 1.25)} <span style={{ fontSize: 11, fontWeight: 500, color: '#6b7280' }}>plazas</span>
                        </span>
                        <span className="td-line2" style={{ color: '#64748b' }}>
                          Capacidad de diseño
                        </span>
                      </>
                    )}
                  </div>
                </td>

                {/* Lote & Animales / UGG */}
                <td>
                  <div className="td-inner">
                    <span className="td-line1" style={{ fontWeight: 600 }}>
                      {potrero.loteAsignado || 'Sin lote asignado'}
                    </span>
                    <span className="td-line2">
                      {potrero.animalesPresentes > 0 ? (
                        <>
                          <strong style={{ color: 'var(--text-primary)' }}>
                            {potrero.animalesPresentes.toLocaleString('es-VE')} {potrero.especie === 'Aves de corral' ? 'aves' : 'cab'}
                          </strong>
                          {' • '}
                          <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>
                            {potrero.uggPresentes.toFixed(2)} UGG
                          </span>
                          {' '}
                          <span style={{ fontSize: 10, color: '#94a3b8' }}>
                            (×{factorUgg})
                          </span>
                        </>
                      ) : (
                        'En reposo / Vacío'
                      )}
                    </span>
                  </div>
                </td>

                {/* Carga Animal (Calibrada para PRV sin falsas alarmas) */}
                <td>
                  <div className="td-inner">
                    <span
                      className="td-line1"
                      style={{
                        fontWeight: 700,
                        color: esExcesoCargaInstantanea ? '#dc2626' : 'var(--primary-color)'
                      }}
                      title={`Carga instantánea: ${potrero.cargaActualUggHa.toFixed(2)} UGG/ha. Capacidad instantánea PRV (para ocupación máx ${diasOcupacionMax}d): ${capacidadInstantaneaUggHa} UGG/ha. Capacidad global del ciclo: ${potrero.cargaRecomendadaUggHa.toFixed(2)} UGG/ha.`}
                    >
                      {potrero.cargaActualUggHa.toFixed(2)} UGG/ha
                    </span>
                    <span
                      className="td-line2"
                      title={`Capacidad global del ciclo de rotación completo: ${potrero.cargaRecomendadaUggHa.toFixed(2)} UGG/ha. En pastoreo PRV de 1-2 días, la alta densidad instantánea es normal y deseada hasta ${capacidadInstantaneaUggHa} UGG/ha.`}
                    >
                      Cap. Global: {potrero.cargaRecomendadaUggHa.toFixed(2)} UGG/ha
                    </span>
                  </div>
                </td>

                {/* Días Ocupado / Descanso */}
                <td>
                  <div className="td-inner">
                    <span className="td-line1" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {potrero.animalesPresentes > 0 ? (
                        <>
                          <Clock size={12} color={potrero.diasOcupacionActual > 2 && (potrero.tipoInstalacion === 'potrero' || potrero.tipoInstalacion === 'sabana') ? '#ef4444' : '#eab308'} />
                          <span style={{
                            fontWeight: 700,
                            color: potrero.diasOcupacionActual > 2 && (potrero.tipoInstalacion === 'potrero' || potrero.tipoInstalacion === 'sabana') ? '#dc2626' : '#854d0e'
                          }}>
                            {potrero.diasOcupacionActual} d ocupado
                          </span>
                          {potrero.diasOcupacionActual > 2 && (potrero.tipoInstalacion === 'potrero' || potrero.tipoInstalacion === 'sabana') && (
                            <span title="¡Sobrepastoreo! Superó los 2 días máximos recomendados por la 2da Ley de Voisin">
                              <AlertTriangle size={12} color="#dc2626" />
                            </span>
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
                          color: potrero.diasDescansoActual > potrero.diasDescansoRequeridos * 1.35
                            ? '#d97706'
                            : potrero.diasDescansoActual >= potrero.diasDescansoRequeridos
                            ? '#166534'
                            : '#1e40af'
                        }}>
                          {potrero.diasDescansoActual} / {potrero.diasDescansoRequeridos} d descanso
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>En ocupación</span>
                      )}
                    </span>
                  </div>
                </td>

                {/* PRV Status Chip */}
                <td>
                  <span
                    className={`prv-chip ${prvInfo.badgeClass}`}
                    style={{
                      backgroundColor: prvInfo.bgColor,
                      color: prvInfo.textColor,
                      borderColor: prvInfo.borderColor
                    }}
                    title={prvInfo.description}
                  >
                    <span className="prv-chip-dot" style={{ backgroundColor: prvInfo.color }} />
                    <span>{prvInfo.shortLabel}</span>
                  </span>
                </td>

                {/* Acciones */}
                <td onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    {onOpenAforoModal && potrero.aforoKgMsHa > 0 && (
                      <button
                        type="button"
                        className="btn-icon-table"
                        title="Calcular Aforo con Marco de Corte"
                        onClick={() => onOpenAforoModal(potrero)}
                      >
                        <Scale size={15} />
                      </button>
                    )}
                    <Link
                      to="/mapas"
                      className="btn-icon-table"
                      title="Localizar en Cartografía Agro-GIS"
                    >
                      <Map size={15} />
                    </Link>
                    <button
                      type="button"
                      className="btn-icon-table"
                      title="Más opciones"
                      onClick={() => onSelectPotrero?.(potrero)}
                    >
                      <MoreVertical size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
