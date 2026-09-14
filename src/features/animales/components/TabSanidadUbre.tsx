import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Pill, 
  Info
} from 'lucide-react';
import { Animal360, GradoCMT } from '../../../types/animal';

interface TabSanidadUbreProps {
  animal: Animal360;
}

export const TabSanidadUbre: React.FC<TabSanidadUbreProps> = ({ animal }) => {
  const [cuartos, setCuartos] = useState(animal.cuartosMamarios);
  const [selectedQuarterKey, setSelectedQuarterKey] = useState<'AD' | 'AI' | 'PD' | 'PI' | null>(null);

  const { tratamientosSanitarios, planVacunacion } = animal;

  const isPoultry = animal.especie === 'Aves de corral' || (animal.categoria && ['Gallina', 'Pollo', 'Gallo', 'Pava', 'Pato', 'Pavito', 'Patito'].some(c => animal.categoria.includes(c)));
  const isCaprine = animal.especie === 'Caprinos' || animal.especie === 'Cabras';
  const isEquine = animal.especie === 'Equinos' || animal.especie === 'Caballos';
  const isBipapilar = isCaprine || isEquine; // 2 mamas/mitades en cabras y yeguas

  const handleUpdateCMT = (codigo: 'AD' | 'AI' | 'PD' | 'PI', newCmt: GradoCMT) => {
    setCuartos(prev => ({
      ...prev,
      [codigo]: {
        ...prev[codigo],
        cmt: newCmt,
        estadoClinico: newCmt === 'Negativo' 
          ? 'Sano' 
          : (newCmt === 'Trazas' || newCmt === 'Grado 1' || newCmt === 'Grado 2')
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

  const effectivePlanVacunacion = isPoultry ? [
    { id: 'vac-av-1', enfermedad: 'Enfermedad de Newcastle', producto: 'Cepa LaSota Clon 30 (Vía Ocular/Aspersión)', laboratorio: 'Ceva / Merial', lote: 'NEW-2026-X', fechaAplicacion: '2026-08-15', fechaProximaDosis: '2026-11-15', estado: 'Vigente', veterinario: 'Ing. Agr. Marcos Solís' },
    { id: 'vac-av-2', enfermedad: 'Gumboro (Bursitis Infecciosa)', producto: 'Bursine Plus (Agua de bebida)', laboratorio: 'Zoetis', lote: 'GUM-098', fechaAplicacion: '2026-08-20', fechaProximaDosis: '2026-12-20', estado: 'Vigente', veterinario: 'Ing. Agr. Marcos Solís' },
    { id: 'vac-av-3', enfermedad: 'Bronquitis Infecciosa', producto: 'H120 Liofilizada (Aspersión gota gruesa)', laboratorio: 'MSD Salud Animal', lote: 'BRO-112', fechaAplicacion: '2026-08-10', fechaProximaDosis: '2026-12-10', estado: 'Vigente', veterinario: 'Ing. Agr. Marcos Solís' },
    { id: 'vac-av-4', enfermedad: 'Viruela Aviar', producto: 'Pox-Vac (Punción alar)', laboratorio: 'Boehringer Ingelheim', lote: 'POX-44', fechaAplicacion: '2026-07-05', fechaProximaDosis: '2027-07-05', estado: 'Vigente', veterinario: 'Ing. Agr. Marcos Solís' },
  ] : planVacunacion;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {isPoultry ? (
        /* 1. Sanidad y Bioseguridad Aviar */
        <div className="ficha360-card">
          <div className="ficha360-card-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={16} color="#059669" />
              <span>Bioseguridad &amp; Sanidad del Galpón Aviar</span>
            </div>
            <span style={{ fontSize: 12, color: '#059669', fontWeight: 700, backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: 10 }}>
              Estatus Sanitario: Óptimo
            </span>
          </div>

          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: 8,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16
          }}>
            <span style={{ fontSize: 24 }}>🐔</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#92400e' }}>
                Fisiología Aviar: Especie Ovípara (Sin Glándulas Mamarias ni Mastitis)
              </div>
              <div style={{ fontSize: 12, color: '#78350f', lineHeight: 1.4 }}>
                Las aves carecen por completo de glándulas mamarias (no poseen ubre ni pezones, ni sufren de mastitis, y no se realiza test CMT). El control zoosanitario se realiza a nivel poblacional mediante bioseguridad en el galpón, vías de vacunación y periodos de retiro en <strong>huevo</strong> y <strong>carne</strong>.
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div style={{ padding: 12, borderRadius: 8, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Vía de Vacunación</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>Ocular / Aspersión Gota Gruesa</div>
              <div style={{ fontSize: 12, color: '#059669', marginTop: 2 }}>Newcastle &amp; Bronquitis H120</div>
            </div>

            <div style={{ padding: 12, borderRadius: 8, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Control de Coccidiosis</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>Toltrazuril / Ionóforos</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Rotación en pienso iniciador</div>
            </div>

            <div style={{ padding: 12, borderRadius: 8, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Estado de la Cama</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>Viruta seca (Humedad &lt; 22%)</div>
              <div style={{ fontSize: 12, color: '#059669', marginTop: 2 }}>Sin pododermatitis (Footpad: 0)</div>
            </div>

            <div style={{ padding: 12, borderRadius: 8, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Filtro de Bioseguridad</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>Pediluvios con Amonio Cuaternario</div>
              <div style={{ fontSize: 12, color: '#059669', marginTop: 2 }}>Activo en acceso a galpón</div>
            </div>
          </div>
        </div>
      ) : (
        /* 1. Mapeo Anatómico Reactivo por Especie */
        <div className="ficha360-card">
          <div className="ficha360-card-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} color="#2d6a4f" />
              <span>
                {isBipapilar 
                  ? `Diagrama Anatómico Mamario (2 Mamas / Mitades) — ${animal.especie}`
                  : `Diagrama Anatómico de Ubre (4 Cuartos Mamarios) — ${animal.especie}`}
              </span>
            </div>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              Haga clic sobre cualquier mitad o cuarto para evaluar o cambiar el grado CMT
            </span>
          </div>

          {/* Aviso Fisiológico de RCS para Caprinos */}
          {isCaprine && (
            <div style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 8,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 16
            }}>
              <Info size={18} color="#059669" />
              <div style={{ fontSize: 12, color: '#065f46', lineHeight: 1.4 }}>
                <strong>Fisiología Caprina (Secreción Apocrina):</strong> La leche de cabra contiene de forma fisiológica partículas celulares y restos citoplasmáticos no leucocitarios. El umbral clínico de alerta para RCS en caprinos es de <strong>1,000,000 cel/ml</strong> (a diferencia del estándar bovino merocrino de 200,000 cel/ml).
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div className="udder-diagram-wrapper">
              <span className="udder-label-indicator">▲ Vista Craneal (Cabeza) ▲</span>
              
              {isBipapilar ? (
                /* Anatomía Bipapilar (Cabras y Yeguas: 2 mamas / mitades) */
                <div style={{ display: 'grid', gridTemplateColumns: '160px 160px', gap: 16, margin: '10px 0' }}>
                  {/* Mama Derecha (asignada a AD) */}
                  <div 
                    className={`udder-quarter quarter-ad ${selectedQuarterKey === 'AD' ? 'selected' : ''}`}
                    onClick={() => setSelectedQuarterKey('AD')}
                    style={{ minHeight: 150, borderTopLeftRadius: 40, borderBottomLeftRadius: 40 }}
                  >
                    <div className="quarter-code">MD</div>
                    <div className="quarter-name">Mitad Derecha</div>
                    <div className={`quarter-cmt-pill ${getCmtClass(cuartos.AD.cmt)}`}>
                      CMT: {cuartos.AD.cmt}
                    </div>
                  </div>

                  {/* Mama Izquierda (asignada a AI) */}
                  <div 
                    className={`udder-quarter quarter-ai ${selectedQuarterKey === 'AI' ? 'selected' : ''}`}
                    onClick={() => setSelectedQuarterKey('AI')}
                    style={{ minHeight: 150, borderTopRightRadius: 40, borderBottomRightRadius: 40 }}
                  >
                    <div className="quarter-code">MI</div>
                    <div className="quarter-name">Mitad Izquierda</div>
                    <div className={`quarter-cmt-pill ${getCmtClass(cuartos.AI.cmt)}`}>
                      CMT: {cuartos.AI.cmt}
                    </div>
                  </div>
                </div>
              ) : (
                /* Anatomía Tetrapapilar (Vacas y Búfalas: 4 cuartos) */
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
              )}

              <span className="udder-label-indicator">▼ Vista Caudal (Cola) ▼</span>
            </div>

            {/* Panel de Detalle del Cuarto o Mama Mamaria Seleccionada */}
            <div style={{ flex: 1, minWidth: 260, maxWidth: 380 }}>
              {selectedQuarter ? (
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  padding: 16
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>
                      {isBipapilar 
                        ? (selectedQuarter.codigo === 'AD' ? 'Mitad Derecha (MD)' : 'Mitad Izquierda (MI)')
                        : `Cuarto ${selectedQuarter.nombre} (${selectedQuarter.codigo})`}
                    </span>
                    <span className={`quarter-cmt-pill ${getCmtClass(selectedQuarter.cmt)}`}>
                      {selectedQuarter.cmt}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                    <strong>Diagnóstico Clínico:</strong>{' '}
                    <span style={{ 
                      fontWeight: 700, 
                      color: selectedQuarter.estadoClinico === 'Mastitis Clínica' ? '#dc2626' : selectedQuarter.estadoClinico === 'Mastitis Subclínica' ? '#d97706' : '#16a34a' 
                    }}>
                      {selectedQuarter.estadoClinico}
                    </span>
                  </div>

                  {/* Selector Interactivo de Grado CMT */}
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                    Actualizar Grado California Mastitis Test (CMT):
                  </label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(['Negativo', 'Trazas', 'Grado 1', 'Grado 2', 'Grado 3'] as GradoCMT[]).map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleUpdateCMT(selectedQuarterKey!, g)}
                        style={{
                          fontSize: 11,
                          padding: '4px 8px',
                          borderRadius: 6,
                          border: selectedQuarter.cmt === g ? '2px solid #2d6a4f' : '1px solid #cbd5e1',
                          backgroundColor: selectedQuarter.cmt === g ? '#d8f3dc' : '#ffffff',
                          fontWeight: selectedQuarter.cmt === g ? 700 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: 10,
                  padding: 20,
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: 13
                }}>
                  <Info size={24} style={{ margin: '0 auto 8px auto', color: '#94a3b8' }} />
                  <div>
                    {isBipapilar 
                      ? 'Haga clic en cualquiera de las 2 mitades mamarias para evaluar el reactivo CMT.'
                      : 'Haga clic en cualquiera de los 4 cuartos mamarios del diagrama para evaluar su reactivo CMT.'}
                  </div>
                </div>
              )}

              <div style={{
                marginTop: 12,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: 10,
                fontSize: 11.5,
                color: '#475569',
                lineHeight: 1.4
              }}>
                <strong>Criterio Diagnóstico CMT:</strong><br />
                • <strong>Negativo:</strong> Sin gelificación (Ubre sana).<br />
                • <strong>Trazas, Grado 1 y Grado 2:</strong> Reacción gelatinosa leve a moderada (<strong>Mastitis Subclínica</strong>, sin signos macroscópicos).<br />
                • <strong>Grado 3:</strong> Masa adherente densa o presencia de grumos/inflamación evidente (<strong>Mastitis Clínica</strong>).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Vademécum de Tratamientos & Tiempos de Retiro */}
      <div className="ficha360-card">
        <div className="ficha360-card-title" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Pill size={16} color="#2d6a4f" />
            <span>Vademécum de Tratamientos Farmacológicos &amp; Inocuidad</span>
          </div>
          <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 700 }}>
            {isPoultry ? 'Retiro Activo: Exclusión estricta de huevos y carne' : 'Retiro Leche Activo: Exclusión estricta de tanque'}
          </span>
        </div>

        <div className="ficha360-table-wrapper">
          <table className="ficha360-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Diagnóstico</th>
                <th>Fármaco / Principio Activo</th>
                <th>Dosis &amp; Vía</th>
                <th>{isPoultry ? 'Retiro Huevo' : 'Retiro Leche'}</th>
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
                    {isPoultry ? (
                      trat.activo ? (
                        <span style={{ fontWeight: 700, color: '#dc2626' }}>
                          Descarte Huevo ({trat.diasRestantesRetiro}d)
                        </span>
                      ) : '0d (Huevo Apto)'
                    ) : (
                      trat.retiroLecheHoras > 0 ? (
                        <span style={{ fontWeight: 700, color: trat.activo ? '#dc2626' : '#475569' }}>
                          {trat.retiroLecheHoras}h (Hasta {trat.fechaFinRetiroLeche})
                        </span>
                      ) : '0h (Libre)'
                    )}
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
          Plan Sanitario Preventivo &amp; Inmunizaciones
        </div>

        <div className="ficha360-table-wrapper">
          <table className="ficha360-table">
            <thead>
              <tr>
                <th>Enfermedad / Antígeno</th>
                <th>Biológico &amp; Laboratorio</th>
                <th>Lote</th>
                <th>Última Aplicación</th>
                <th>Próxima Dosis</th>
                <th>Estado</th>
                <th>Responsable</th>
              </tr>
            </thead>
            <tbody>
              {effectivePlanVacunacion.map((vac) => (
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
