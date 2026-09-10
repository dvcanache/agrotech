import React from 'react';
import { KpiCards } from './components/KpiCards';
import { ChartCards } from './components/ChartCards';
import {
  KPI_CARDS,
  CHART_1_INVENTARIO,
  CHART_2_REPRODUCTIVA,
  CHART_3_PRODUCTIVA
} from './dashboardData';

export const DashboardView: React.FC = () => {
  const charts = [CHART_1_INVENTARIO, CHART_2_REPRODUCTIVA, CHART_3_PRODUCTIVA];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      <KpiCards cards={KPI_CARDS} />
      <ChartCards charts={charts} />
    </div>
  );
};
