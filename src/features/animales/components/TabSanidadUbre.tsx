import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Syringe, 
  ShieldCheck, 
  Pill, 
  Clock,
  Info
} from 'lucide-react';
import { Animal360, CuartoMamarioInfo, GradoCMT } from '../../../types/animal';

interface TabSanidadUbreProps {
  animal: Animal360;
}

export const TabSanidadUbre: React.FC<TabSanidadUbreProps> = ({ animal }) => {
  const [cuartos, setCuartos] = useState(animal.cuartosMamarios);
  const [selectedQuarterKey, setSelectedQuarterKey] = useState<'AD' | 'AI' | 'PD' | 'PI' | null>(null);

  const { tratamientosSanitarios, planVacunacion } = animal;

  const handleUpdateCMT = (codigo: 'AD' | 'AI' | 'PD' | 'PI', newCmt: GradoCMT) => {
    setCuartos(prev => ({
      ...prev,
      [codigo]: {
        ...prev[codigo],
        cmt: newCmt,
        estadoClinico: newCmt === 'Negativo' 
          ? 'Sano' 
          : newCmt === 'Trazas' 
          ? 'Mastitis Subclínica' 
          : 'Mastitis Clínica'
      }
    }));
  };

  const getCmtClass = (cmt: GradoCMT) => {
    switch (cmt) {
      case 'Negativo': return 'cmt-negativo';
      case 'Trazas': return 'cmt-trazas';
      case 'Grado 1': return 'cmt-grado1';
      case 'Grado 2': return 'cmt-grado2';
      case 'Grado 3': return 'cmt-grado3';
      default: return 'cmt-negativo';
    }
  };

  const selectedQuarter = selectedQuarterKey ? cuartos[selectedQuarterKey] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Mapeo Anatómico de los 4 Cuartos Mamarios */}
      <div className="ficha360-card">
        <div className="ficha360-card-title" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={16} color="#2d6a4f" />
            <span>Diagrama Anatómico de Ubre & Prueba California Mastitis Test (CMT)</span>
          </div>
          <span style={{ fontSize: 12, color: '#64748b' }}>
            Haga clic sobre cualquier cuarto para evaluar o cambiar el grado CMT
          </span>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div className="udder-diagram-wrapper">
            <span className="udder-label-indicator">▲ Vista Anterior (Cabeza) ▲</span>
            
            <div className="udder-grid-4">
              {/* Anterior Derecho (AD) */}
              <div 
                className={`udder-quarter quarter-ad ${selectedQuarterKey === 'AD' ? 'selected' : ''}`}
                onClick={() => setSelectedQuarterKey('AD')}
              >
                <div className="quarter-code">AD</div>
                <div className="quarter-name">Anterior Der.</div>
                <div className={`quarter-cmt-pill ${getCmtClass(cuartos.AD.cmt)}`}>
                  CMT: {cuartos.AD.cmt}
                </div>
              </div>

              {/* Anterior Izquierdo (AI) */}
              <div 
                className={`udder-quarter quarter-ai ${selectedQuarterKey === 'AI' ? 'selected' : ''}`}
                onClick={() => setSelectedQuarterKey('AI')}
              >
                <div className="quarter-code">AI</div>
                <div className="quarter-name">Anterior Izq.</div>
                <div className={`quarter-cmt-pill ${getCmtClass(cuartos.AI.cmt)}`}>
                  CMT: {cuartos.AI.cmt}
                </div>
              </div>

              {/* Posterior Derecho (PD) */}
              <div 
                className={`udder-quarter quarter-pd ${selectedQuarterKey === 'PD' ? 'selected' : ''}`}
                onClick={() => setSelectedQuarterKey('PD')}
              >
                <div className="quarter-code">PD</div>
                <div className="quarter-name">Posterior Der.</div>
                <div className={`quarter-cmt-pill ${getCmtClass(cuartos.PD.cmt)}`}>
                  CMT: {cuartos.PD.cmt}
                </div>
              </div>

              {/* Posterior Izquierdo (PI) */}
              <div 
                className={`udder-quarter quarter-pi ${selectedQuarterKey === 'PI' ? 'selected' : ''}`}
                onClick={() => setSelectedQuarterKey('PI')}
              >
                <div className="quarter-code">PI</div>
                <div className="quarter-name">Posterior Izq.</div>
                <div className={`quarter-cmt-pill ${getCmtClass(cuartos.PI.cmt)}`}>
                  CMT: {cuartos.PI.cmt}
                </div>
              </div>
            </div>

            <span className="udder-label-indicator">▼ Vista Posterior (Cola) ▼</span>
          </div>

          {/* Panel Lateral de Diagnóstico y Selector Rápido CMT */}
          <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {selectedQuarter ? (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 12,
                padding: 16
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                    Cuarto: {selectedQuarter.nombre} ({selectedQuarter.codigo})
                  </div>
                  <span className={`quarter-cmt-pill ${getCmtClass(selectedQuarter.cmt)}`}>
                    {selectedQuarter.cmt}
                  </span>
                </div>

                <div style={{ marginTop: 8, fontSize: 13, color: '#334155' }}>
                  <strong>Diagnóstico Clínico:</strong> {selectedQuarter.estadoClinico}
                </div>
                {selectedQuarter.conductividadMs && (
                  <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 2 }}>
                    Conductividad Eléctrica: <strong>{selectedQuarter.conductividadMs} mS/cm</strong> (Normal &lt; 5.5)
                  </div>
                )}
                {selectedQuarter.ultimoTratamiento && (
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                    Tratamiento asignado: {selectedQuarter.ultimoTratamiento}
                  </div>
                )}

                <div style={{ marginTop: 14 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                    Actualizar Calificación CMT:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                    {(['Negativo', 'Trazas', 'Grado 1', 'Grado 2', 'Grado 3'] as GradoCMT[]).map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleUpdateCMT(selectedQuarter.codigo, g)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          backgroundColor: selectedQuarter.cmt === g ? '#2d6a4f' : '#ffffff',
                          color: selectedQuarter.cmt === g ? '#ffffff' : '#334155',
                          border: '1px solid #cbd5e1'
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: 12,
                padding: 24,
                textAlign: 'center',
                color: '#64748b',
                fontSize: 13
              }}>
                <Info size={28} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
                Seleccione un cuarto en el diagrama de ubre para ver o modificar su historial clínico y grado CMT.
              </div>
            )}

            {/* Guía Rápida CMT */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: 10,
              fontSize: 11.5,
              color: '#475569',
              lineHeight: 1.4
            }}>
              <strong>Escala CMT:</strong> Negativo (sin gel) • Trazas (ligero moco) • Grado 1 (gel leve) • Grado 2 (gel definido) • Grado 3 (masa adherente firme / mastitis clínica).
            </div>
          </div>
        </div>
      </div>

      {/* 2. Vademécum de Tratamientos & Tiempos de Retiro */}
      <div className="ficha360-card">
        <div className="ficha360-card-title" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Pill size={16} color="#2d6a4f" />
            <span>Vademécum de Tratamientos Farmacológicos & Inocuidad</span>
          </div>
          <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 700 }}>
            Retiro Leche Activo: Exclusión estricta de tanque
          </span>
        </div>

        <div className="ficha360-table-wrapper">
          <table className="ficha360-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Diagnóstico</th>
                <th>Fármaco / Principio Activo</th>
                <th>Dosis & Vía</th>
                <th>Retiro Leche</th>
                <th>Retiro Carne</th>
                <th>Estatus Retiro</th>
                <th>Veterinario</th>
              </tr>
            </thead>
            <tbody>
              {tratamientosSanitarios.map((trat) => (
                <tr key={trat.id}>
                  <td style={{ fontWeight: 600 }}>{trat.fecha}</td>
                  <td>{trat.diagnostico}</td>
                  <td>
                    <strong>{trat.farmaco}</strong>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{trat.principioActivo}</div>
                  </td>
                  <td>{trat.dosis} ({trat.via})</td>
                  <td>
                    {trat.retiroLecheHoras > 0 ? (
                      <span style={{ fontWeight: 700, color: trat.activo ? '#dc2626' : '#475569' }}>
                        {trat.retiroLecheHoras}h (Hasta {trat.fechaFinRetiroLeche})
                      </span>
                    ) : '0h (Libre)'}
                  </td>
                  <td>
                    {trat.retiroCarneDias > 0 ? (
                      <span>{trat.retiroCarneDias}d (Hasta {trat.fechaFinRetiroCarne})</span>
                    ) : '0d'}
                  </td>
                  <td>
                    {trat.activo ? (
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: 12,
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        fontWeight: 700,
                        fontSize: 11.5
                      }}>
                        ⛔ {trat.diasRestantesRetiro}d Restantes
                      </span>
                    ) : (
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: 12,
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        fontWeight: 600,
                        fontSize: 11.5
                      }}>
                        ✓ Vencido (Apto)
                      </span>
                    )}
                  </td>
                  <td>{trat.veterinario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Cronograma de Vacunaciones */}
      <div className="ficha360-card">
        <div className="ficha360-card-title">
          <ShieldCheck size={16} color="#2d6a4f" />
          Plan Sanitario Preventivo & Inmunizaciones
        </div>

        <div className="ficha360-table-wrapper">
          <table className="ficha360-table">
            <thead>
              <tr>
                <th>Enfermedad / Antígeno</th>
                <th>Biológico & Laboratorio</th>
                <th>Lote</th>
                <th>Última Aplicación</th>
                <th>Próxima Dosis</th>
                <th>Estado</th>
                <th>Responsable</th>
              </tr>
            </thead>
            <tbody>
              {planVacunacion.map((vac) => (
                <tr key={vac.id}>
                  <td style={{ fontWeight: 700 }}>{vac.enfermedad}</td>
                  <td>{vac.producto} ({vac.laboratorio})</td>
                  <td>{vac.lote}</td>
                  <td>{vac.fechaAplicacion}</td>
                  <td style={{ fontWeight: 600 }}>{vac.fechaProximaDosis}</td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 12,
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      fontWeight: 700,
                      fontSize: 11.5
                    }}>
                      ● {vac.estado}
                    </span>
                  </td>
                  <td>{vac.veterinario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
