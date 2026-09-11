import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './features/dashboard/DashboardView';
import { AnimalesView } from './features/animales/AnimalesView';
import { EventosView } from './features/eventos/EventosView';
import { ReportesView } from './features/reportes/ReportesView';
import { AjustesView } from './features/ajustes/AjustesView';

// Reportes - Sección Gestión
import { InventariosView } from './features/reportes/gestion/inventarios/InventariosView';
import { MovimientosView } from './features/reportes/gestion/movimientos/MovimientosView';
import { DistribucionNormalView } from './features/reportes/gestion/distribucion-normal/DistribucionNormalView';
import { TecnicosView } from './features/reportes/gestion/tecnicos/TecnicosView';
import { ReproductoresView } from './features/reportes/gestion/reproductores/ReproductoresView';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="animales" element={<AnimalesView />} />
            <Route path="eventos" element={<EventosView />} />
            <Route path="reportes" element={<ReportesView />} />
            <Route path="ajustes" element={<AjustesView />} />

            {/* Rutas Centro de Reportes */}
            <Route path="reports" element={<ReportesView />} />
            <Route path="reports/allreports" element={<ReportesView />} />

            {/* Rutas Reportes - Sección Gestión */}
            <Route path="reports/inventories" element={<InventariosView />} />
            <Route path="reportes/inventarios" element={<InventariosView />} />

            <Route path="reports/movements" element={<MovimientosView />} />
            <Route path="reportes/movimientos" element={<MovimientosView />} />

            <Route path="reports/historics/normaldistribution" element={<DistribucionNormalView />} />
            <Route path="reportes/distribucion-normal" element={<DistribucionNormalView />} />

            <Route path="reports/technicians" element={<TecnicosView />} />
            <Route path="reportes/tecnicos" element={<TecnicosView />} />

            <Route path="reports/breeders" element={<ReproductoresView />} />
            <Route path="reportes/reproductores" element={<ReproductoresView />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};
