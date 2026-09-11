import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
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
}

export const NormalDistributionChart: React.FC<NormalDistributionChartProps> = ({
  curva,
  unidad,
  media
}) => {
  const labels = curva.map(p => `${p.x} ${unidad}`);
  const dataValues = curva.map(p => p.y);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Densidad Gaussiana (Distribución Normal)',
        data: dataValues,
        borderColor: '#2d6a4f',
        backgroundColor: 'rgba(82, 183, 136, 0.25)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#2d6a4f',
        pointBorderColor: '#ffffff',
        pointRadius: 4,
        pointHoverRadius: 7
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Outfit', size: 12, weight: 600 },
          color: '#1f2937'
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { family: 'Outfit', size: 13, weight: 600 },
        bodyFont: { family: 'Outfit', size: 12 },
        callbacks: {
          label: (context: any) => {
            return ` Densidad: ${(context.raw * 1000).toFixed(2)}‰ (Media: ${media} ${unidad})`;
          }
        }
      },
      datalabels: {
        display: false // Desactivar datalabels en la curva continua
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Outfit', size: 11 }, color: '#6b7280' }
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { display: false }
      }
    }
  };

  return (
    <div style={{ width: '100%', height: 280, position: 'relative' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};
