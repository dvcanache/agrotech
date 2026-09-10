import React from 'react';
import { ChartConfig } from '../../../types/chart';
import { DoughnutChart } from '../../../components/charts/DoughnutChart';

interface ChartCardsProps {
  charts: ChartConfig[];
}

export const ChartCards: React.FC<ChartCardsProps> = ({ charts }) => {
  return (
    <section className="charts-grid">
      {charts.map((chart, idx) => (
        <div className="chart-card" key={idx}>
          <h3 className="chart-title">{chart.title}</h3>
          <div className="chart-wrapper">
            <DoughnutChart
              labels={chart.labels}
              data={chart.data}
              colors={chart.colors}
            />
            <div className="chart-center-text">
              <span className="center-subtitle">{chart.centerLabel}</span>
              <span className="center-value">{chart.centerValue}</span>
            </div>
          </div>
          <div className="chart-legend">
            {chart.labels.map((label, index) => (
              <div className="legend-item" key={label}>
                <span
                  className="legend-color"
                  style={{ backgroundColor: chart.colors[index] }}
                />
                <span className="legend-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
