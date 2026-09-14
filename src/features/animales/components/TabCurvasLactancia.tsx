import React from 'react';
import { 
  Milk, 
  TrendingUp, 
  Activity, 
  Award,
  Zap,
  Egg,
  CheckCircle2
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Animal360, CurvaLactanciaPoint } from '../../../types/animal';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

export interface ParametrosWood {
  a: number;
  b: number;
  c: number;
  duracionDias: number;
  maxLecheY: number;
}

export const PARAMETROS_WOOD_ESPECIE: Record<string, ParametrosWood> = {
  'Bovinos': {
    a: 11.5,
    b: 0.28,
    c: 0.0050,
    duracionDias: 305,
    maxLecheY: 35
  },
  'Búfalos': {
    a: 6.5,
    b: 0.18,
    c: 0.0045,
    duracionDias: 270,
    maxLecheY: 16
  },
  'Caprinos': {
    a: 1.8,
    b: 0.22,
    c: 0.0060,
    duracionDias: 210,
    maxLecheY: 6
  }
};

export function getParametrosWood(especie?: string): ParametrosWood {
  if (especie === 'Búfalos') return PARAMETROS_WOOD_ESPECIE['Búfalos'];
  if (especie === 'Caprinos' || especie === 'Cabras') return PARAMETROS_WOOD_ESPECIE['Caprinos'];
  return PARAMETROS_WOOD_ESPECIE['Bovinos'];
}

export function generarPuntosCurvaWood(
  especie: string,
  controlesReales?: { dim: number; produccion: number }[]
): CurvaLactanciaPoint[] {
  const params = getParametrosWood(especie);

  let dims: number[];
  if (params.duracionDias === 210) {
    dims = [10, 20, 30, 45, 60, 90, 120, 150, 180, 210];
  } else if (params.duracionDias === 270) {
    dims = [15, 30, 45, 60, 90, 120, 150, 180, 210, 240, 270];
  } else {
    dims = [15, 30, 45, 60, 90, 120, 145, 180, 210, 240, 270, 305];
  }

  const realMap = new Map<number, number>();
  if (controlesReales) {
    controlesReales.forEach(c => realMap.set(c.dim, c.produccion));
  }

  return dims.map(dim => {
    const wood = Math.round((params.a * Math.pow(dim, params.b) * Math.exp(-params.c * dim)) * 10) / 10;
    const promedioFinca = Math.round((wood * 0.86) * 10) / 10;
    const real = realMap.get(dim);

    return {
      dim,
      produccionWood: wood,
      promedioFinca,
      ...(real !== undefined ? { produccionReal: real } : {})
    };
  });
}

export interface EvaluacionRatioGP {
  ratio: number;
  estado: 'Optimo' | 'SARA' | 'Cetosis' | 'GrasaBaja';
  etiqueta: string;
  colorClass: string;
  descripcionClinica: string;
}

export function evaluarRatioGrasaProteina(ratioGP: number, especie?: string): EvaluacionRatioGP {
  const isBuffalo = especie === 'Búfalos';

  if (isBuffalo) {
    // Búfalas: rango fisiológico 1.60 a 1.95
    if (ratioGP < 1.50) {
      return {
        ratio: ratioGP,
        estado: 'SARA',
        etiqueta: 'Alerta Grasa Baja / SARA Bufalino',
        colorClass: 'ratio-gp-sara',
        descripcionClinica: 'Grasa anormalmente baja para búfalas; revisar fibra efectiva.'
      };
    }
    if (ratioGP > 2.05) {
      return {
        ratio: ratioGP,
        estado: 'Cetosis',
        etiqueta: 'Cetosis Bufalina',
        colorClass: 'ratio-gp-cetosis',
        descripcionClinica: 'Hipercetonemia y movilización lipídica acentuada.'
      };
    }
    return {
      ratio: ratioGP,
      estado: 'Optimo',
      etiqueta: 'Fisiológico Bufalino (Óptimo)',
      colorClass: 'ratio-gp-optimo',
      descripcionClinica: 'Relación G/P fisiológica para especie bufalina (1.60 - 1.95).'
    };
  }

  // Bovinos y Caprinos
  if (ratioGP < 1.0) {
    return {
      ratio: ratioGP,
      estado: 'SARA',
      etiqueta: 'Acidosis Ruminal (SARA)',
      colorClass: 'ratio-gp-sara',
      descripcionClinica: 'Inversión de grasa/proteína por acidosis ruminal subaguda.'
    };
  }
  if (ratioGP > 1.4) {
    return {
      ratio: ratioGP,
      estado: 'Cetosis',
      etiqueta: 'Riesgo Cetosis / BEN',
      colorClass: 'ratio-gp-cetosis',
      descripcionClinica: 'Balance energético negativo severo y cetosis metabólica.'
    };
  }
  return {
    ratio: ratioGP,
    estado: 'Optimo',
    etiqueta: 'Óptimo',
    colorClass: 'ratio-gp-optimo',
    descripcionClinica: 'Rango metabólico y nutricional balanceado (1.10 - 1.35).'
  };
}

interface TabCurvasLactanciaProps {
  animal: Animal360;
}

export const TabCurvasLactancia: React.FC<TabCurvasLactanciaProps> = ({ animal }) => {
  const { lactanciaStats, curvaWoodData, controlesLecheros } = animal;

  const isPoultry = animal.especie === 'Aves de corral' || (animal.categoria && ['Gallina', 'Pollo', 'Gallo', 'Pava', 'Pato', 'Pavito', 'Patito'].some(c => animal.categoria.includes(c)));
  const isCaprine = animal.especie === 'Caprinos' || animal.especie === 'Cabras';
  const isBuffalo = animal.especie === 'Búfalos';

  const woodParams = getParametrosWood(animal.especie);
  const effectiveWoodData = (curvaWoodData && curvaWoodData.length > 0)
    ? curvaWoodData
    : generarPuntosCurvaWood(animal.especie, controlesLecheros.map(c => ({ dim: c.dim, produccion: c.totalKg })));

  // Preparar datos para Chart.js
  const labels = effectiveWoodData.map(d => `${d.dim}d`);
  const dataReal = effectiveWoodData.map(d => d.produccionReal ?? null);
  const dataWood = effectiveWoodData.map(d => d.produccionWood);
  const dataPromedio = effectiveWoodData.map(d => d.promedioFinca);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Producción Real (kg/d)',
        data: dataReal,
        borderColor: '#2d6a4f',
        backgroundColor: 'rgba(45, 106, 79, 0.1)',
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: '#2d6a4f',
        tension: 0.3,
        fill: true
      },
      {
        label: `Curva de Wood Ajustada (${woodParams.duracionDias}d)`,
        data: dataWood,
        borderColor: '#52b788',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        tension: 0.35,
        fill: false
      },
      {
        label: 'Promedio Hacienda El Paraíso',
        data: dataPromedio,
        borderColor: '#94a3b8',
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.2,
        fill: false
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Outfit', size: 12, weight: 600 },
          boxWidth: 14,
          padding: 14
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { family: 'Outfit', size: 13, weight: 700 },
        bodyFont: { family: 'Outfit', size: 12 },
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Leche (kg / día)',
          font: { family: 'Outfit', size: 12, weight: 600 },
          color: '#64748b'
        },
        min: 0,
        max: woodParams.maxLecheY,
        grid: { color: '#f1f5f9' }
      },
      x: {
        title: {
          display: true,
          text: 'Días en Leche (DIM)',
          font: { family: 'Outfit', size: 12, weight: 600 },
          color: '#64748b'
        },
        grid: { display: false }
      }
    }
  };

  if (isPoultry) {
    const poultryChartData = {
      labels: ['Sem 20', 'Sem 24', 'Sem 28', 'Sem 32', 'Sem 36', 'Sem 40', 'Sem 44', 'Sem 48', 'Sem 52'],
      datasets: [
        {
          label: '% Postura Real (Galpón)',
          data: [74, 91, 95.2, 94.8, 93.5, 92.0, 90.5, 89.0, 87.5],
          borderColor: '#d97706',
          backgroundColor: 'rgba(217, 119, 6, 0.1)',
          borderWidth: 3,
          pointRadius: 5,
          pointBackgroundColor: '#d97706',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Guía Genética Lohmann Brown',
          data: [70, 90, 94.0, 93.5, 92.0, 90.0, 88.5, 87.0, 85.5],
          borderColor: '#059669',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          tension: 0.35,
          fill: false
        }
      ]
    };

    const poultryChartOptions: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { family: 'Outfit', size: 12, weight: 600 }, boxWidth: 14, padding: 14 }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { family: 'Outfit', size: 13, weight: 700 },
          bodyFont: { family: 'Outfit', size: 12 },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}% postura`
          }
        }
      },
      scales: {
        y: {
          title: { display: true, text: 'Porcentaje de Postura (%)', font: { family: 'Outfit', size: 12, weight: 600 }, color: '#64748b' },
          min: 60,
          max: 100,
          grid: { color: '#f1f5f9' }
        },
        x: {
          grid: { display: false }
        }
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: 8,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <span style={{ fontSize: 24 }}>🐔</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#92400e' }}>
              Fisiología Aviar: Especie Ovípara (Sin Periodo de Lactancia ni Producción Láctea)
            </div>
            <div style={{ fontSize: 12, color: '#78350f', lineHeight: 1.4 }}>
              Al ser un ave de corral, su biología no contempla lactancia de mamífero ni secreción de leche. Su productividad zootécnica se evalúa a través de la <strong>curva de postura semanal (% postura vs estándar genético)</strong>, masa de huevo acumulada y conversión alimenticia (ICA).
            </div>
          </div>
        </div>

        <div className="ficha360-grid-4">
          <div className="ficha360-kpi-card">
            <div className="ficha360-kpi-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
              <Egg size={22} />
            </div>
            <div>
              <div className="ficha360-kpi-val">95.2%</div>
              <div className="ficha360-kpi-lbl">% Postura Actual (+1.2% vs Guía)</div>
            </div>
          </div>

          <div className="ficha360-kpi-card">
            <div className="ficha360-kpi-icon" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
              <Award size={22} />
            </div>
            <div>
              <div className="ficha360-kpi-val">62.5 g</div>
              <div className="ficha360-kpi-lbl">Peso Medio Huevo (Clase AAA)</div>
            </div>
          </div>

          <div className="ficha360-kpi-card">
            <div className="ficha360-kpi-icon" style={{ backgroundColor: '#e8f5e9', color: '#2d6a4f' }}>
              <TrendingUp size={22} />
            </div>
            <div>
              <div className="ficha360-kpi-val">2,380</div>
              <div className="ficha360-kpi-lbl">Huevos Diarios Galpón</div>
            </div>
          </div>

          <div className="ficha360-kpi-card">
            <div className="ficha360-kpi-icon" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
              <Zap size={22} />
            </div>
            <div>
              <div className="ficha360-kpi-val">1.62</div>
              <div className="ficha360-kpi-lbl">Índice Conversión (ICA kg/kg)</div>
            </div>
          </div>
        </div>

        <div className="wood-formula-banner" style={{ borderLeftColor: '#d97706' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
              Curva de Postura de Lote vs Guía Genética Comercial (Lohmann Brown)
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
              Monitoreo de persistencia post-pico de postura y control de merma por huevos rotos (&lt; 1.5%).
            </div>
          </div>
          <div className="wood-formula-math" style={{ color: '#d97706', backgroundColor: '#fef3c7' }}>
            Postura = (Huevos Totales / Aves Alojadas) · 100
          </div>
        </div>

        <div className="ficha360-card">
          <div className="ficha360-card-title">
            <Activity size={16} color="#d97706" />
            Dinámica Semanal de Postura (%): Galpón vs Estándar Genético
          </div>
          <div className="wood-chart-wrapper">
            <Line data={poultryChartData} options={poultryChartOptions} />
          </div>
        </div>

        <div className="ficha360-card">
          <div className="ficha360-card-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>Clasificación Comercial de la Postura Reciente</span>
            </div>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              Norma de Calidad: Cáscara Limpia y Firme (Tipo A)
            </span>
          </div>

          <div className="ficha360-table-wrapper">
            <table className="ficha360-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Galpón / Lote</th>
                  <th>Huevos Comerciales</th>
                  <th>Huevos AAA (&gt;67g)</th>
                  <th>Huevos AA (60-66g)</th>
                  <th>Huevos Rotos / Fárfaras</th>
                  <th>% Postura Calculado</th>
                  <th>Estado de Calidad</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>12/09/2026</td>
                  <td>GALP-01 (Lohmann)</td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>2,380 uds</td>
                  <td>1,820 uds (76.5%)</td>
                  <td>560 uds (23.5%)</td>
                  <td style={{ color: '#dc2626', fontWeight: 600 }}>35 uds (1.4%)</td>
                  <td style={{ fontWeight: 800, color: '#2d6a4f' }}>95.2%</td>
                  <td><span style={{ padding: '3px 8px', borderRadius: 10, backgroundColor: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: 11.5 }}>● Pico Élite</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  const rcsAlertThreshold = isCaprine ? 1000000 : 200000;
  const diffProyeccion = lactanciaStats.proyeccion305DiasKg - lactanciaStats.promedioFinca305DiasKg;
  const diffPorc = ((diffProyeccion / lactanciaStats.promedioFinca305DiasKg) * 100).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. KPIs de Lactancia y Proyección */}
      <div className="ficha360-grid-4">
        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#e8f5e9', color: '#2d6a4f' }}>
            <Award size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">{lactanciaStats.proyeccion305DiasKg.toLocaleString()} kg</div>
            <div className="ficha360-kpi-lbl">Proyección ({woodParams.duracionDias}d) (+{diffPorc}%)</div>
          </div>
        </div>

        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
            <Milk size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">{lactanciaStats.produccionAcumuladaKg.toLocaleString()} kg</div>
            <div className="ficha360-kpi-lbl">Acumulado ({lactanciaStats.diasEnLeche} DIM)</div>
          </div>
        </div>

        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">{lactanciaStats.picoLactanciaKg} kg</div>
            <div className="ficha360-kpi-lbl">Pico (Día {lactanciaStats.diaPico})</div>
          </div>
        </div>

        <div className="ficha360-kpi-card">
          <div className="ficha360-kpi-icon" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
            <Zap size={22} />
          </div>
          <div>
            <div className="ficha360-kpi-val">{lactanciaStats.persistenciaPorc}%</div>
            <div className="ficha360-kpi-lbl">Persistencia de Curva</div>
          </div>
        </div>
      </div>

      {/* 2. Banner Modelo de Wood Dinámico */}
      <div className="wood-formula-banner">
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
            Curva de Lactancia Modelada (Modelo Gamma Incompleto de Wood) — {animal.especie}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            Ajuste zootécnico continuo para estimación de lactancia equivalente a {woodParams.duracionDias} días.
          </div>
        </div>

        <div className="wood-formula-math">
          yt = {woodParams.a} · t^{woodParams.b} · e^(-{woodParams.c}·t)
        </div>
      </div>

      {/* 3. Gráfica de Curva de Lactancia */}
      <div className="ficha360-card">
        <div className="ficha360-card-title">
          <Milk size={16} color="#2d6a4f" />
          Dinámica de Producción Láctea: Real vs Wood ({woodParams.duracionDias}d) vs Hato
        </div>

        <div className="wood-chart-wrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* 4. Tabla de Controles Lecheros Recientes, Ratio Grasa/Proteína y RCS */}
      <div className="ficha360-card">
        <div className="ficha360-card-title" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={16} color="#2d6a4f" />
            <span>Últimos Controles Lecheros (Pesajes AM/PM &amp; Calidad Fisicoquímica)</span>
          </div>
          <span style={{ fontSize: 12, color: '#64748b' }}>
            {isBuffalo
              ? 'Ratio G/P Normal Búfalas: 1.60 - 1.95 • RCS Alerta: > 200,000 cel/ml'
              : isCaprine
              ? 'Ratio G/P Normal Cabras: 1.10 - 1.30 • RCS Fisiológico Apocrino: hasta 1,000,000 cel/ml'
              : 'Ratio G/P Normal: 1.10 - 1.35 • RCS Alerta: > 200,000 cel/ml'}
          </span>
        </div>

        <div className="ficha360-table-wrapper">
          <table className="ficha360-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>DIM</th>
                <th>AM (kg)</th>
                <th>PM (kg)</th>
                <th>Total Diario</th>
                <th>Grasa %</th>
                <th>Proteína %</th>
                <th>Ratio G/P</th>
                <th>RCS (cel/ml)</th>
              </tr>
            </thead>
            <tbody>
              {controlesLecheros.map((control) => {
                const evalGP = evaluarRatioGrasaProteina(control.ratioGP, animal.especie);
                const isRcsHigh = control.rcs > rcsAlertThreshold;

                return (
                  <tr key={control.id}>
                    <td style={{ fontWeight: 600 }}>{control.fecha}</td>
                    <td>{control.dim}d</td>
                    <td>{control.amKg.toFixed(1)}</td>
                    <td>{control.pmKg.toFixed(1)}</td>
                    <td style={{ fontWeight: 700, color: '#2d6a4f' }}>
                      {control.totalKg.toFixed(1)} kg
                    </td>
                    <td>{control.grasaPorc.toFixed(2)}%</td>
                    <td>{control.proteinaPorc.toFixed(2)}%</td>
                    <td>
                      <span className={`ratio-gp-badge ${evalGP.colorClass}`} title={evalGP.descripcionClinica}>
                        {control.ratioGP.toFixed(2)} — {evalGP.etiqueta}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 700,
                        color: isRcsHigh ? '#dc2626' : '#16a34a'
                      }}>
                        {control.rcs.toLocaleString()} ({isRcsHigh ? 'Alerta Subclínica' : 'Fisiológico'})
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
