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
  Syringe
} from 'lucide-react';
import { Animal360, EventoGinecologico } from '../../../types/animal';

interface TabHistorialReproductivoProps {
  animal: Animal360;
}

export const TabHistorialReproductivo: React.FC<TabHistorialReproductivoProps> = ({ animal }) => {
  const { kpisReproductivos, timelineGinecologico } = animal;

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
      {/* KPIs Reproductivos */}
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

        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">{kpisReproductivos.diasAbiertos} d</div>
            <div className="ficha360-kpi-lbl">Días Abiertos</div>
          </div>
        </div>

        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Syringe size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">{kpisReproductivos.serviciosPorConcepcion}</div>
            <div className="ficha360-kpi-lbl">Servicios / Concep.</div>
          </div>
        </div>

        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
            <Baby size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">{kpisReproductivos.totalPartos}</div>
            <div className="ficha360-kpi-lbl">Partos Totales (0 Ab.)</div>
          </div>
        </div>
      </div>

      {/* Resumen del Estado de Gestación Actual */}
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
                Gestación en Curso: {kpisReproductivos.diasPrenez || animal.diasGestacion} Días Confirmados
              </div>
              <div style={{ fontSize: 12.5, color: '#2563eb' }}>
                Último servicio: {kpisReproductivos.fechaUltimoServicio} • Fecha Probable de Parto (FPP): <strong>{kpisReproductivos.fechaProximoParto}</strong>
              </div>
            </div>
          </div>

          <div style={{
            fontSize: 12.5,
            fontWeight: 700,
            padding: '6px 14px',
            backgroundColor: '#ffffff',
            borderRadius: 8,
            color: '#1d4ed8',
            border: '1px solid #93c5fd'
          }}>
            Tercio Medio de Gestación
          </div>
        </div>
      )}

      {/* Timeline Ginecológico */}
      <div className="ficha360-card">
        <div className="ficha360-card-title">
          <Heart size={16} color="#2d6a4f" />
          Línea de Tiempo Ginecológica & Campañas Reproductivas
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
                      🐂 Toro: {evento.detalles.toro}
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
