import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components and DataLabels plugin
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  colors: string[];
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ labels, data, colors }) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 2.5,
        borderColor: '#ffffff',
        hoverOffset: 6,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { family: 'Outfit', size: 13, weight: 600 },
        bodyFont: { family: 'Outfit', size: 12 },
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
            return ' ' + label + ': ' + value + ' (' + percentage + ')';
          },
        },
      },
      datalabels: {
        color: (context: any) => {
          const color = context.dataset.backgroundColor[context.dataIndex];
          if (color === '#d8f3dc' || color === '#b7e4c7' || color === '#e0f2f1' || color === '#e8f5e9') {
            return '#2d6a4f';
          }
          return '#ffffff';
        },
        font: {
          family: 'Outfit',
          weight: 600,
          size: 10.5,
        },
        formatter: (value: number, context: any) => {
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          if (total <= 0) return '';
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return percentage;
        },
        align: 'center',
        anchor: 'center',
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};
