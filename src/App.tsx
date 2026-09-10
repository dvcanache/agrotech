import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './features/dashboard/DashboardView';
import { AnimalesView } from './features/animales/AnimalesView';
import { EventosView } from './features/eventos/EventosView';
import { ReportesView } from './features/reportes/ReportesView';
import { AjustesView } from './features/ajustes/AjustesView';

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
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};
