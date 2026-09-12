import React, { useState } from 'react';
import { 
  Scale, 
  TrendingUp, 
  Activity, 
  Calendar, 
  CheckCircle, 
  Info,
  ChevronRight
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Animal360 } from '../../../types/animal';

interface TabDesarrolloPonderalProps {
  animal: Animal360;
}

export const TabDesarrolloPonderal: React.FC<TabDesarrolloPonderalProps> = ({ animal }) => {
  const { pesajesAjustados, historialPesajes, condicionCorporalActual } = animal;
  const [selectedCC, setSelectedCC] = useState<number>(condicionCorporalActual);

  // CC descriptions
  const CC_LEVELS = [
    { level: 1, label: 'Muy Delgada', desc: 'Estructura ósea muy prominente; apófisis espinosas filosas sin cobertura grasa.' },
    { level: 2, label: 'Delgada', desc: 'Costillas y tuberosidades ilíacas visibles; ligera cobertura muscular.' },
    { level: 3, label: 'Óptima / Moderada', desc: 'Puntos óseos redondeados con manto graso uniforme. Condición ideal en pastoreo.' },
    { level: 4, label: 'Buena / Gorda', desc: 'Costillas cubiertas con depósitos grasos en inserción caudal.' },
    { level: 5, label: 'Muy Grasa / Obesa', desc: 'Depósitos pesados de grasa en ubre y base de cola; movilidad reducida.' }
  ];

  // Gráfica de Crecimiento Ponderal
  const sortedWeighings = [...historialPesajes].sort((a, b) => a.diasVida - b.diasVida);
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
      {/* 1. KPIs de Pesajes Ajustados Estándar */}
      <div className="ficha360-grid-4">
        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#e8f5e9', color: '#2d6a4f' }}>
            <Scale size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">{pesajesAjustados.pesoActualKg} kg</div>
            <div className="ficha360-kpi-lbl">Peso Adulto Actual</div>
          </div>
        </div>

        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">+{pesajesAjustados.gdpGlobalGramosDia} g/d</div>
            <div className="ficha360-kpi-lbl">GDP Global Histórica</div>
          </div>
        </div>

        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">{pesajesAjustados.pesoAjustado205dKg} kg</div>
            <div className="ficha360-kpi-lbl">Ajustado 205d (Destete)</div>
          </div>
        </div>

        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
            <Activity size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">{pesajesAjustados.pesoAjustado365dKg} kg</div>
            <div className="ficha360-kpi-lbl">Ajustado 365d (Año)</div>
          </div>
        </div>
      </div>

      {/* 2. Escala de Condición Corporal (CC 1 - 5) Interactiva */}
      <div className="ficha360-card">
        <div className="ficha360-card-title" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={16} color="#2d6a4f" />
            <span>Condición Corporal (Escala 1 a 5)</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#2d6a4f' }}>
            Calificación Actual: {condicionCorporalActual.toFixed(2)} / 5.0
          </span>
        </div>

        <div className="cc-scale-container">
          {CC_LEVELS.map(cc => {
            const isActive = Math.round(selectedCC) === cc.level;
            return (
              <div
                key={cc.level}
                className={`cc-level-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCC(cc.level)}
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
          <strong>Criterio de Evaluación Zootécnica (CC {Math.round(selectedCC)}):</strong>{' '}
          {CC_LEVELS.find(c => c.level === Math.round(selectedCC))?.desc}
        </div>
      </div>

      {/* 3. Gráfico de Curva de Crecimiento Ponderal */}
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

      {/* 4. Historial de Pesajes Periódicos */}
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
                  <td>CC {pesaje.condicionCorporal.toFixed(2)}</td>
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
