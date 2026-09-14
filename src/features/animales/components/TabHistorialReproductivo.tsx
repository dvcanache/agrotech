import React from 'react';
import { 
  Heart, 
  Calendar, 
  Clock, 
  Activity, 
  Baby, 
  ShieldCheck, 
  AlertCircle, 
  Stethoscope, 
  CheckCircle2,
  Syringe,
  AlertTriangle
} from 'lucide-react';
import { Animal360, EventoGinecologico } from '../../../types/animal';

export interface GestationStageInfo {
  stage: 'Primer Tercio' | 'Segundo Tercio' | 'Tercer Tercio' | 'Parto Inminente' | 'Fuera de Rango';
  color: string;
  badgeBg: string;
  borderColor: string;
  indicacionesClinicas: string;
}

export function getGestationStage(diasGestacion: number, especie: string, subespecie?: string): GestationStageInfo {
  let duracionTotal = 283;

  switch (especie) {
    case 'Bovinos':
      duracionTotal = (subespecie === 'Cebuino' || subespecie === 'Bos indicus') ? 292 : 283;
      break;
    case 'Búfalos':
      duracionTotal = 310;
      break;
    case 'Equinos':
      duracionTotal = 340;
      break;
    case 'Porcinos':
      duracionTotal = 114;
      break;
    case 'Caprinos':
    case 'Ovinos':
      duracionTotal = 150;
      break;
    default:
      duracionTotal = 283;
  }

  const porcentaje = (diasGestacion / duracionTotal) * 100;

  if (diasGestacion >= duracionTotal - 7) {
    return {
      stage: 'Parto Inminente',
      color: '#b91c1c',
      badgeBg: '#fef2f2',
      borderColor: '#fca5a5',
      indicacionesClinicas: 'Vigilancia 24h, ubicar en paridero, desinfección de ubre y pezones.'
    };
  }

  if (porcentaje <= 33.3) {
    return {
      stage: 'Primer Tercio',
      color: '#0284c7',
      badgeBg: '#f0f9ff',
      borderColor: '#bae6fd',
      indicacionesClinicas: 'Fase de embriogénesis y nidación. Evitar palpación precoz traumática y estrés.'
    };
  } else if (porcentaje <= 66.6) {
    return {
      stage: 'Segundo Tercio',
      color: '#16a34a',
      badgeBg: '#f0fdf4',
      borderColor: '#bbf7d0',
      indicacionesClinicas: 'Desarrollo osteo-muscular. Período seguro para desparasitaciones y vacunas inactivadas.'
    };
  } else {
    return {
      stage: 'Tercer Tercio',
      color: '#d97706',
      badgeBg: '#fffbeb',
      borderColor: '#fde68a',
      indicacionesClinicas: 'Crecimiento fetal acelerado (70% del peso final). Secado obligatorio y dieta de transición.'
    };
  }
}

export function getSireLabel(especie?: string): { icon: string; label: string } {
  switch (especie) {
    case 'Equinos':
    case 'Caballos':
      return { icon: '🐎', label: 'Padrón / Semental' };
    case 'Porcinos':
    case 'Cerdos':
      return { icon: '🐖', label: 'Verraco' };
    case 'Caprinos':
    case 'Cabras':
      return { icon: '🐐', label: 'Chivo Reproductor' };
    case 'Ovinos':
    case 'Ovejas':
      return { icon: '🐑', label: 'Carnero' };
    case 'Búfalos':
      return { icon: '🐃', label: 'Bucerro Semental' };
    case 'Aves de corral':
    case 'Aves':
      return { icon: '🐓', label: 'Gallo Reproductor' };
    case 'Bovinos':
    default:
      return { icon: '🐂', label: 'Toro' };
  }
}

interface TabHistorialReproductivoProps {
  animal: Animal360;
}

export const TabHistorialReproductivo: React.FC<TabHistorialReproductivoProps> = ({ animal }) => {
  const { kpisReproductivos, timelineGinecologico } = animal;

  const diasGest = kpisReproductivos.diasPrenez || animal.diasGestacion || 0;
  const stageInfo = getGestationStage(diasGest, animal.especie, animal.subcategoria);
  const sireInfo = getSireLabel(animal.especie);

  // Semáforo Zootécnico de Días Abiertos (DA)
  const getSemaforoDiasAbiertos = (da: number) => {
    if (da <= 115) {
      return {
        label: 'Óptimo (Parto al Año)',
        textColor: '#16a34a',
        bgColor: '#f0fdf4',
        borderColor: '#bbf7d0',
        alerta: 'normal'
      };
    } else if (da <= 150) {
      return {
        label: 'Aceptable Trópico Bajo',
        textColor: '#059669',
        bgColor: '#ecfdf5',
        borderColor: '#a7f3d0',
        alerta: 'aceptable'
      };
    } else if (da <= 180) {
      return {
        label: 'Alerta Moderada (+Retraso)',
        textColor: '#d97706',
        bgColor: '#fffbeb',
        borderColor: '#fde68a',
        alerta: 'moderada'
      };
    } else if (da <= 210) {
      return {
        label: 'Problema Clínico Severo',
        textColor: '#dc2626',
        bgColor: '#fef2f2',
        borderColor: '#fca5a5',
        alerta: 'severa'
      };
    } else {
      return {
        label: 'Candidata Inmediata a Descarte',
        textColor: '#991b1b',
        bgColor: '#fee2e2',
        borderColor: '#f87171',
        alerta: 'descarte'
      };
    }
  };

  const semaforoDA = getSemaforoDiasAbiertos(kpisReproductivos.diasAbiertos);

  // Detección de Síndrome de Vaca Repetidora (Repeat Breeder): S/C >= 3.0
  const esVacaRepetidora = kpisReproductivos.serviciosPorConcepcion >= 3.0;

  const getEventIcon = (tipo: EventoGinecologico['tipo']) => {
    switch (tipo) {
      case 'Celo':
        return <Activity size={14} color="#ea580c" />;
      case 'Servicio':
        return <Syringe size={14} color="#0284c7" />;
      case 'Palpacion':
        return <Stethoscope size={14} color="#7c3aed" />;
      case 'Parto':
        return <Baby size={14} color="#16a34a" />;
      case 'Secado':
        return <ShieldCheck size={14} color="#0d9488" />;
      case 'Aborto':
        return <AlertCircle size={14} color="#dc2626" />;
      default:
        return <Heart size={14} color="#2d6a4f" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Alerta de Vaca Repetidora si S/C >= 3.0 */}
      {esVacaRepetidora && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: 8,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <AlertTriangle size={24} color="#b91c1c" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#991b1b' }}>
              ⚠️ ALERTA GINECOLÓGICA: SÍNDROME DE HEMBRA REPETIDORA (Repeat Breeder — {kpisReproductivos.serviciosPorConcepcion} S/C)
            </div>
            <div style={{ fontSize: 12, color: '#7f1d1d', marginTop: 2, lineHeight: 1.4 }}>
              El semoviente ha superado el umbral zootécnico de 3 servicios por concepción. Requiere revisión ecográfica ovárica urgente (descarte de quistes foliculares o luteales), frotis/cultivo uterino y <strong>suspensión preventiva de pajuelas de semen élite</strong> hasta recibir alta médica ginecológica.
            </div>
          </div>
        </div>
      )}

      {/* KPIs Reproductivos con Semáforos Zootécnicos */}
      <div className="ficha360-grid-4">
        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#e8f5e9', color: '#2d6a4f' }}>
            <Clock size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">{kpisReproductivos.iepPromedioDias} d</div>
            <div className="ficha360-kpi-lbl">IEP Promedio</div>
          </div>
        </div>

        {/* Días Abiertos con Semáforo Cromático */}
        <div className="ficha360-kpi-card" style={{ borderLeft: `4px solid ${semaforoDA.textColor}` }}>
          <div className="ficha360-kpi-icon" style={{ backgroundColor: semaforoDA.bgColor, color: semaforoDA.textColor }}>
            <Calendar size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val" style={{ color: semaforoDA.textColor }}>
              {kpisReproductivos.diasAbiertos} d
            </div>
            <div className="ficha360-kpi-lbl" style={{ fontWeight: 600 }}>
              {semaforoDA.label}
            </div>
          </div>
        </div>

        {/* Servicios por Concepción con Detección de Vaca Repetidora */}
        <div className="ficha360-kpi-card" style={{ borderLeft: esVacaRepetidora ? '4px solid #dc2626' : undefined }}>
          <div className="ficha360-kpi-icon" style={{ backgroundColor: esVacaRepetidora ? '#fee2e2' : '#fef3c7', color: esVacaRepetidora ? '#dc2626' : '#d97706' }}>
            <Syringe size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val" style={{ color: esVacaRepetidora ? '#dc2626' : '#1e293b' }}>
              {kpisReproductivos.serviciosPorConcepcion}
            </div>
            <div className="ficha360-kpi-lbl">
              {esVacaRepetidora ? '⚠️ Vaca Repetidora (≥3)' : 'Servicios / Concep.'}
            </div>
          </div>
        </div>

        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
            <Baby size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">{kpisReproductivos.totalPartos}</div>
            <div className="ficha360-kpi-lbl">Partos Totales ({kpisReproductivos.totalAbortos || 0} Ab.)</div>
          </div>
        </div>
      </div>

      {/* Resumen del Estado de Gestación Actual Dinámico */}
      {animal.estatusReproductivo === 'Preñada' && (
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 10,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1e3a8a' }}>
                Gestación en Curso: {diasGest} Días Confirmados ({animal.especie})
              </div>
              <div style={{ fontSize: 12.5, color: '#2563eb' }}>
                Último servicio: {kpisReproductivos.fechaUltimoServicio} • Fecha Probable de Parto (FPP): <strong>{kpisReproductivos.fechaProximoParto}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <div style={{
              fontSize: 12.5,
              fontWeight: 700,
              padding: '6px 14px',
              backgroundColor: stageInfo.badgeBg,
              borderRadius: 8,
              color: stageInfo.color,
              border: `1px solid ${stageInfo.borderColor}`
            }}>
              {stageInfo.stage}
            </div>
            <span style={{ fontSize: 11, color: '#475569', maxWidth: 280, textAlign: 'right' }}>
              {stageInfo.indicacionesClinicas}
            </span>
          </div>
        </div>
      )}

      {/* Timeline Ginecológico con Terminología de Macho Dinámica */}
      <div className="ficha360-card">
        <div className="ficha360-card-title">
          <Heart size={16} color="#2d6a4f" />
          Línea de Tiempo Ginecológica &amp; Campañas Reproductivas
        </div>

        <div className="gyn-timeline">
          {timelineGinecologico.map((evento) => (
            <div key={evento.id} className="gyn-timeline-item">
              <div className="gyn-timeline-dot">
                {getEventIcon(evento.tipo)}
              </div>

              <div className="gyn-timeline-card">
                <div className="gyn-timeline-header">
                  <div className="gyn-timeline-title">
                    <span>{evento.titulo}</span>
                    <span style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 10,
                      backgroundColor: '#e2e8f0',
                      color: '#475569',
                      fontWeight: 700
                    }}>
                      Campaña {evento.campana}
                    </span>
                  </div>
                  <span className="gyn-timeline-date">{evento.fecha}</span>
                </div>

                <div className="gyn-timeline-desc">
                  {evento.descripcion}
                </div>

                <div className="gyn-timeline-tags">
                  <span className="gyn-tag">
                    👨‍⚕️ {evento.tecnico}
                  </span>
                  {evento.detalles.toro && (
                    <span className="gyn-tag">
                      {sireInfo.icon} {sireInfo.label}: {evento.detalles.toro}
                    </span>
                  )}
                  {evento.detalles.pajuelaLote && (
                    <span className="gyn-tag">
                      🧪 Pajuela: {evento.detalles.pajuelaLote}
                    </span>
                  )}
                  {evento.detalles.cuernoUterino && (
                    <span className="gyn-tag">
                      🔬 {evento.detalles.cuernoUterino}
                    </span>
                  )}
                  {evento.detalles.sexoCria && (
                    <span className="gyn-tag" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                      🍼 Cría {evento.detalles.sexoCria} ({evento.detalles.pesoCriaKg} kg)
                    </span>
                  )}
                  {evento.detalles.diasLactanciaAcumulados && (
                    <span className="gyn-tag">
                      🥛 {evento.detalles.diasLactanciaAcumulados} DIM
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
