import React from 'react';
import { ChartConfig } from '../../../types/chart';
import { DoughnutChart } from '../../../components/charts/DoughnutChart';

interface ChartCardsProps {
  charts: ChartConfig[];
}

export const ChartCards: React.FC<ChartCardsProps> = ({ charts }) => {
  return (
    <section className="charts-grid">
      {charts.map((chart, idx) => {
        const total = chart.data.reduce((acc, val) => acc + val, 0);
        const hasData = total > 0;

        return (
          <div className="chart-card" key={idx}>
            <div className="chart-header-row">
              <h3 className="chart-title">{chart.title}</h3>
              <span className="chart-header-total">{total} {chart.centerLabel.toLowerCase()}</span>
            </div>

            <div className="chart-wrapper">
              {hasData ? (
                <>
                  <DoughnutChart
                    labels={chart.labels}
                    data={chart.data}
                    colors={chart.colors}
                  />
                  <div className="chart-center-text">
                    <span className="center-subtitle">{chart.centerLabel}</span>
                    <span className="center-value">{chart.centerValue}</span>
                  </div>
                </>
              ) : (
                <div className="chart-empty-state">
                  <span className="chart-empty-icon">📊</span>
                  <span className="chart-empty-text">Sin registros en esta categoría</span>
                </div>
              )}
            </div>

            <div className="chart-legend">
              {chart.labels.map((label, index) => {
                const count = chart.data[index] ?? 0;
                const pct = total > 0 ? ((count / total) * 100).toFixed(0) : '0';

                return (
                  <div className="legend-item" key={label} title={`${label}: ${count} (${pct}%)`}>
                    <span
                      className="legend-color"
                      style={{ backgroundColor: chart.colors[index] || '#9CA3AF' }}
                    />
                    <span className="legend-label">{label}</span>
                    <span className="legend-count">({count})</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
};
