import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  Plugin
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface NormalDistributionChartProps {
  curva: { x: number; y: number }[];
  unidad: string;
  media: number;
  desviacionEstandar: number;
  lowerCutoffValue: number;
  upperCutoffValue: number;
  lowerPercent: number;
  upperPercent: number;
  variableName: string;
  isLowerBetter?: boolean;
}

export const NormalDistributionChart: React.FC<NormalDistributionChartProps> = ({
  curva,
  unidad,
  media,
  desviacionEstandar,
  lowerCutoffValue,
  upperCutoffValue,
  lowerPercent,
  upperPercent,
  variableName,
  isLowerBetter = false
}) => {
  const minX = curva.length > 0 ? curva[0].x : 0;
  const maxX = curva.length > 0 ? curva[curva.length - 1].x : 100;

  // Plugin para dibujar zonas de corte sombreadas y líneas verticales de umbrales zootécnicos
  const cutoffPlugin: Plugin<'line'> = {
    id: 'cutoffLinesPlugin',
    afterDatasetsDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      if (!chartArea || !scales.x) return;

      const cfg = (chart.options.plugins as any)?.cutoffLinesConfig || {
        lowerCutoffValue,
        upperCutoffValue,
        media,
        unidad,
        isLowerBetter
      };
      const effLower = cfg.lowerCutoffValue ?? lowerCutoffValue;
      const effUpper = cfg.upperCutoffValue ?? upperCutoffValue;
      const effMedia = cfg.media ?? media;
      const effUnidad = cfg.unidad ?? unidad;
      const effIsLowerBetter = cfg.isLowerBetter ?? isLowerBetter;

      const xScale = scales.x;
      const top = chartArea.top;
      const bottom = chartArea.bottom;

      const lowerPx = Math.max(chartArea.left, Math.min(chartArea.right, xScale.getPixelForValue(effLower)));
      const upperPx = Math.max(chartArea.left, Math.min(chartArea.right, xScale.getPixelForValue(effUpper)));
      const meanPx = Math.max(chartArea.left, Math.min(chartArea.right, xScale.getPixelForValue(effMedia)));

      ctx.save();

      if (!effIsLowerBetter) {
        // Zona Descarte a la izquierda
        ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
        ctx.fillRect(chartArea.left, top, lowerPx - chartArea.left, bottom - top);

        // Zona Élite a la derecha
        ctx.fillStyle = 'rgba(37, 99, 235, 0.12)';
        ctx.fillRect(upperPx, top, chartArea.right - upperPx, bottom - top);
      } else {
        // En IEP: los mayores a la derecha son descarte, los menores a la izquierda son élite
        ctx.fillStyle = 'rgba(37, 99, 235, 0.12)';
        ctx.fillRect(chartArea.left, top, upperPx - chartArea.left, bottom - top);

        ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
        ctx.fillRect(lowerPx, top, chartArea.right - lowerPx, bottom - top);
      }

      // 1. Línea de Descarte (Rojo)
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(lowerPx, top);
      ctx.lineTo(lowerPx, bottom);
      ctx.stroke();

      // Etiqueta Descarte
      ctx.setLineDash([]);
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.textAlign = !effIsLowerBetter ? 'right' : 'left';
      const cullingText = !effIsLowerBetter
        ? `Descarte (≤ ${effLower} ${effUnidad})`
        : `Descarte (≥ ${effLower} ${effUnidad})`;
      ctx.fillText(cullingText, !effIsLowerBetter ? lowerPx - 6 : lowerPx + 6, top + 16);

      // 2. Línea de Élite (Azul)
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(upperPx, top);
      ctx.lineTo(upperPx, bottom);
      ctx.stroke();

      // Etiqueta Élite
      ctx.fillStyle = '#2563eb';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.textAlign = !effIsLowerBetter ? 'left' : 'right';
      const eliteText = !effIsLowerBetter
        ? `Élite (≥ ${effUpper} ${effUnidad})`
        : `Élite (≤ ${effUpper} ${effUnidad})`;
      ctx.fillText(eliteText, !effIsLowerBetter ? upperPx + 6 : upperPx - 6, top + 16);

      // 3. Línea de Media Poblacional (Verde bosque)
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(meanPx, top);
      ctx.lineTo(meanPx, bottom);
      ctx.stroke();

      // Etiqueta Media
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`μ: ${effMedia} ${effUnidad}`, meanPx, top + 32);

      ctx.restore();
    }
  };

  const chartData = {
    datasets: [
      {
        label: `Densidad Gaussiana — ${variableName}`,
        data: curva,
        borderColor: '#2d6a4f',
        borderWidth: 2.5,
        backgroundColor: 'rgba(82, 183, 136, 0.22)',
        fill: true,
        tension: 0.38,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointBackgroundColor: '#2d6a4f',
        pointBorderColor: '#ffffff'
      }
    ]
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300
    },
    plugins: {
      datalabels: {
        display: false
      },
      cutoffLinesConfig: {
        lowerCutoffValue,
        upperCutoffValue,
        media,
        unidad,
        isLowerBetter
      },
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Outfit', size: 12.5, weight: 600 },
          color: '#1f2937'
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        titleFont: { family: 'Outfit', size: 13, weight: 700 },
        bodyFont: { family: 'Outfit', size: 12 },
        callbacks: {
          title: (items: any[]) => {
            if (!items.length) return '';
            const val = items[0].parsed.x;
            return `${variableName}: ${val} ${unidad}`;
          },
          label: (context: any) => {
            const x = context.parsed.x;
            let clasif = 'Población Central';
            if (!isLowerBetter) {
              if (x <= lowerCutoffValue) clasif = `🔻 Grupo Descarte (Inferior ${lowerPercent}%)`;
              else if (x >= upperCutoffValue) clasif = `⭐ Grupo Élite (Superior ${upperPercent}%)`;
            } else {
              if (x >= lowerCutoffValue) clasif = `🔻 Grupo Descarte (Lento ${lowerPercent}%)`;
              else if (x <= upperCutoffValue) clasif = `⭐ Grupo Élite (Rápido ${upperPercent}%)`;
            }
            const z = desviacionEstandar > 0 ? ((x - media) / desviacionEstandar).toFixed(2) : '0';
            return [
              ` Clasificación: ${clasif}`,
              ` Z-Score: ${Number(z) > 0 ? '+' + z : z} σ`,
              ` Densidad Relativa: ${(context.parsed.y * 1000).toFixed(2)}‰`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        min: minX,
        max: maxX,
        grid: { color: '#f1f5f9' },
        ticks: {
          font: { family: 'Outfit', size: 11 },
          color: '#64748b',
          callback: (value: any) => `${value} ${unidad}`
        }
      },
      y: {
        display: false,
        grid: { display: false }
      }
    }
  };

  return (
    <div style={{ width: '100%', height: 320, position: 'relative' }}>
      <Line
        key={`gauss-chart-${variableName}-${lowerCutoffValue}-${upperCutoffValue}-${media}-${lowerPercent}-${upperPercent}`}
        data={chartData}
        options={options}
        plugins={[cutoffPlugin]}
      />
    </div>
  );
};
