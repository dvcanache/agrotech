import React, { useState } from 'react';
import { 
  Scale, 
  TrendingUp, 
  Activity, 
  Calendar, 
  Award,
  Info
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Animal360 } from '../../../types/animal';

export interface BIFResult {
  p205Ajustado: number;
  p365Ajustado: number;
  p540Ajustado: number;
  factorAEC: number;
}

export function getFactoresAEC(edadMadreAnos: number, sexo: 'Macho' | 'Hembra'): number {
  if (edadMadreAnos <= 2) return sexo === 'Macho' ? 27 : 24;
  if (edadMadreAnos === 3) return sexo === 'Macho' ? 18 : 16;
  if (edadMadreAnos === 4) return sexo === 'Macho' ? 9 : 8;
  if (edadMadreAnos >= 5 && edadMadreAnos <= 10) return 0;
  return sexo === 'Macho' ? 9 : 8; // >= 11 años
}

export function calcularPesosAjustadosBIF(
  pesoNacimientoKg: number,
  pesoActualKg: number,
  diasVida: number,
  sexo: 'Macho' | 'Hembra' = 'Hembra',
  edadMadreAnos: number = 5
): BIFResult {
  const aec = getFactoresAEC(edadMadreAnos, sexo);

  // 1. P205 = ((Peso Actual - Peso Nacimiento) / Días) * 205 + Peso Nacimiento + AEC
  const gdp = diasVida > 0 ? (pesoActualKg - pesoNacimientoKg) / diasVida : 0.75;
  const p205 = Math.round((gdp * 205 + pesoNacimientoKg + aec) * 10) / 10;

  // 2. P365 = P205 + GDP post-destete * 160
  const p365 = Math.round((p205 + gdp * 160) * 10) / 10;

  // 3. P540 = P365 + GDP post-año * 175
  const p540 = Math.round((p365 + gdp * 175) * 10) / 10;

  return {
    p205Ajustado: p205,
    p365Ajustado: p365,
    p540Ajustado: p540,
    factorAEC: aec
  };
}

interface TabDesarrolloPonderalProps {
  animal: Animal360;
}

export const TabDesarrolloPonderal: React.FC<TabDesarrolloPonderalProps> = ({ animal }) => {
  const { pesajesAjustados, historialPesajes, condicionCorporalActual } = animal;
  const [selectedCC, setSelectedCC] = useState<number>(condicionCorporalActual);

  const isEquine = animal.especie === 'Equinos' || animal.especie === 'Caballos';

  // Escala CC Bovina (1 a 5)
  const BOVINE_CC_LEVELS = [
    { level: 1, label: 'Muy Delgada', desc: 'Estructura ósea muy prominente; apófisis espinosas filosas sin cobertura grasa.' },
    { level: 2, label: 'Delgada', desc: 'Costillas y tuberosidades ilíacas visibles; ligera cobertura muscular.' },
    { level: 3, label: 'Óptima / Moderada', desc: 'Puntos óseos redondeados con manto graso uniforme. Condición ideal en pastoreo.' },
    { level: 4, label: 'Buena / Gorda', desc: 'Costillas cubiertas con depósitos grasos en inserción caudal.' },
    { level: 5, label: 'Muy Grasa / Obesa', desc: 'Depósitos pesados de grasa en ubre y base de cola; movilidad reducida.' }
  ];

  // Escala Henneke Equina (1 a 9)
  const HENNEKE_CC_LEVELS = [
    { level: 1, label: 'Pobre / Emaciado', desc: 'Extremadamente demacrado; apófisis espinosas, costillas y huesos sobresalen fuertemente.' },
    { level: 2, label: 'Muy Delgado', desc: 'Emaciado; ligera capa sobre la base de las apófisis; costillas y cadera muy visibles.' },
    { level: 3, label: 'Delgado', desc: 'Costillas y espina dorsal visibles; vértebras no discernibles individualmente.' },
    { level: 4, label: 'Moderadamente Delgado', desc: 'Línea de la espina y costillas ligeramente perceptibles; cruz redondeada.' },
    { level: 5, label: 'Moderado (Óptimo)', desc: 'Espalda a nivel, costillas palpables sin verse a simple vista; cruz armónica.' },
    { level: 6, label: 'Moderadamente Carnoso', desc: 'Ligero pliegue en el lomo; grasa sobre costillas esponjosa.' },
    { level: 7, label: 'Carnoso', desc: 'Pliegue visible a lo largo del lomo; costillas difíciles de palpar.' },
    { level: 8, label: 'Gordo', desc: 'Pliegue pronunciado en el dorso; costillas no palpables; cuello engrosado.' },
    { level: 9, label: 'Extremadamente Gordo / Obeso', desc: 'Hendidura profunda en el dorso; grasa protuberante en cruz, cola y flancos.' }
  ];

  const activeCCLevels = isEquine ? HENNEKE_CC_LEVELS : BOVINE_CC_LEVELS;

  // Validación de animal adulto: >24 meses o con partos
  const esAdulto = (animal.edadAnos >= 2) || (animal.edadMeses && animal.edadMeses >= 24) || ((animal.kpisReproductivos?.totalPartos ?? 0) > 0);

  // Ordenar pesajes cronológicamente
  const sortedWeighings = [...historialPesajes].sort((a, b) => a.diasVida - b.diasVida);

  // Cálculo de GDP reciente entre los dos últimos pesajes para adultos
  let gdpReciente = 0;
  if (sortedWeighings.length >= 2) {
    const ultimo = sortedWeighings[sortedWeighings.length - 1];
    const penultimo = sortedWeighings[sortedWeighings.length - 2];
    const deltaPeso = ultimo.pesoKg - penultimo.pesoKg;
    const deltaDias = ultimo.diasVida - penultimo.diasVida;
    if (deltaDias > 0) {
      gdpReciente = Math.round((deltaPeso / deltaDias) * 1000);
    }
  } else if (sortedWeighings.length === 1 && sortedWeighings[0].gdpPeriodoGramosDia) {
    gdpReciente = sortedWeighings[0].gdpPeriodoGramosDia;
  }

  // Cálculo BIF
  const ultimoPesaje = sortedWeighings[sortedWeighings.length - 1];
  const bifResult = calcularPesosAjustadosBIF(
    pesajesAjustados.pesoNacimientoKg || 35,
    pesajesAjustados.pesoActualKg || ultimoPesaje?.pesoKg || 480,
    ultimoPesaje?.diasVida || 1980,
    animal.sexo as 'Macho' | 'Hembra' || 'Hembra',
    5 // Edad promedio óptima de la madre
  );

  // Gráfica de Crecimiento Ponderal
  const labels = sortedWeighings.map(p => `${p.edadMeses}m (${p.pesoKg}kg)`);
  const dataReal = sortedWeighings.map(p => p.pesoKg);
  const dataEsperado = sortedWeighings.map(p => p.pesoEsperadoRazaKg);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Peso Real Registrado (kg)',
        data: dataReal,
        borderColor: '#2d6a4f',
        backgroundColor: 'rgba(45, 106, 79, 0.1)',
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: '#2d6a4f',
        tension: 0.25,
        fill: true
      },
      {
        label: 'Patrón de Crecimiento Racial Estándar',
        data: dataEsperado,
        borderColor: '#f59e0b',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 3,
        tension: 0.2,
        fill: false
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. KPIs de Pesajes y GDP Diferenciada */}
      <div className="ficha360-grid-4">
        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#e8f5e9', color: '#2d6a4f' }}>
            <Scale size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">{pesajesAjustados.pesoActualKg} kg</div>
            <div className="ficha360-kpi-lbl">Peso Vivo Actual</div>
          </div>
        </div>

        {/* Sustitución de GDP Global Histórica en Adultos por GDP Reciente */}
        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">
              {esAdulto 
                ? `${gdpReciente >= 0 ? '+' : ''}${gdpReciente} g/d` 
                : `+${pesajesAjustados.gdpGlobalGramosDia} g/d`}
            </div>
            <div className="ficha360-kpi-lbl">
              {esAdulto ? 'GDP Reciente (Último Control)' : 'GDP Crecimiento / Levante'}
            </div>
          </div>
        </div>

        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">{pesajesAjustados.pesoAjustado205dKg || bifResult.p205Ajustado} kg</div>
            <div className="ficha360-kpi-lbl">BIF 205d (Destete + AEC)</div>
          </div>
        </div>

        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
            <Activity size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">{pesajesAjustados.pesoAjustado365dKg || bifResult.p365Ajustado} kg</div>
            <div className="ficha360-kpi-lbl">BIF 365d (Año)</div>
          </div>
        </div>
      </div>

      {/* 2. Banner de Normalización BIF */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Award size={18} color="#2d6a4f" />
          <span style={{ fontSize: 12.5, color: '#334155', fontWeight: 600 }}>
            Estandarización BIF (Beef Improvement Federation): Factores aditivos por edad de la madre (AEC: +{bifResult.factorAEC} kg) incorporados a P205d, P365d y P540d.
          </span>
        </div>
        {esAdulto && (
          <span style={{ fontSize: 11.5, color: '#0369a1', backgroundColor: '#e0f2fe', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
            Semoviente Adulto (&gt;24m): Monitoreo de GDP por Intervalo Reciente
          </span>
        )}
      </div>

      {/* 3. Escala de Condición Corporal Reactiva (Henneke 1-9 en Equinos vs 1-5 en Rumiantes) */}
      <div className="ficha360-card">
        <div className="ficha360-card-title" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={16} color="#2d6a4f" />
            <span>
              {isEquine 
                ? 'Condición Corporal Equina (Escala Henneke 1 a 9)'
                : 'Condición Corporal Rumiante (Escala 1 a 5)'}
            </span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#2d6a4f' }}>
            Calificación Actual: {condicionCorporalActual.toFixed(1)} / {isEquine ? '9.0' : '5.0'}
          </span>
        </div>

        <div className="cc-scale-container" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {activeCCLevels.map(cc => {
            const isActive = Math.round(selectedCC) === cc.level;
            return (
              <div
                key={cc.level}
                className={`cc-level-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCC(cc.level)}
                style={{ flex: 1, minWidth: isEquine ? 90 : 140 }}
              >
                <div className="cc-level-num">CC {cc.level}</div>
                <div className="cc-level-desc">{cc.label}</div>
              </div>
            );
          })}
        </div>

        <div style={{ 
          marginTop: 12, 
          padding: 12, 
          backgroundColor: '#f8fafc', 
          borderRadius: 8, 
          border: '1px solid #e2e8f0',
          fontSize: 12.5,
          color: '#334155'
        }}>
          <strong>Criterio Zootécnico {isEquine ? 'Henneke' : 'Bovino'} (CC {Math.round(selectedCC)}):</strong>{' '}
          {activeCCLevels.find(c => c.level === Math.round(selectedCC))?.desc}
        </div>
      </div>

      {/* 4. Gráfico de Curva de Crecimiento Ponderal */}
      <div className="ficha360-card">
        <div className="ficha360-card-title">
          <TrendingUp size={16} color="#2d6a4f" />
          Curva Ponderal y Ganancia Diaria de Peso
        </div>

        <div style={{ height: 260, width: '100%' }}>
          <Line 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: { font: { family: 'Outfit', size: 12, weight: 600 } }
                }
              },
              scales: {
                y: {
                  title: { display: true, text: 'Peso Vivo (kg)', color: '#64748b' },
                  grid: { color: '#f1f5f9' }
                },
                x: {
                  grid: { display: false }
                }
              }
            }} 
          />
        </div>
      </div>

      {/* 5. Historial de Pesajes Periódicos */}
      <div className="ficha360-card">
        <div className="ficha360-card-title">
          <Scale size={16} color="#2d6a4f" />
          Bitácora Histórica de Pesajes de Manga
        </div>

        <div className="ficha360-table-wrapper">
          <table className="ficha360-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Edad (Meses)</th>
                <th>Peso Registrado</th>
                <th>Peso Esperado</th>
                <th>GDP Período</th>
                <th>Condición Corporal</th>
                <th>Método de Pesaje</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {historialPesajes.map((pesaje) => (
                <tr key={pesaje.id}>
                  <td style={{ fontWeight: 600 }}>{pesaje.fecha}</td>
                  <td>{pesaje.edadMeses} m</td>
                  <td style={{ fontWeight: 700, color: '#2d6a4f' }}>{pesaje.pesoKg} kg</td>
                  <td>{pesaje.pesoEsperadoRazaKg} kg</td>
                  <td>
                    {pesaje.gdpPeriodoGramosDia ? (
                      <span style={{ color: '#16a34a', fontWeight: 600 }}>
                        +{pesaje.gdpPeriodoGramosDia} g/d
                      </span>
                    ) : '—'}
                  </td>
                  <td>CC {pesaje.condicionCorporal.toFixed(1)}</td>
                  <td>{pesaje.metodo}</td>
                  <td style={{ fontSize: 12, color: '#64748b' }}>{pesaje.observaciones || 'Sin notas'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
