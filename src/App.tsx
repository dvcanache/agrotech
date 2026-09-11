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

// Reportes - Sección Animales
import { VientresView } from './features/reportes/animales/vientres/VientresView';
import { ProximasSecarView } from './features/reportes/animales/proximas-secar/ProximasSecarView';
import { ProximasParirView } from './features/reportes/animales/proximas-parir/ProximasParirView';
import { ProximasRevisarView } from './features/reportes/animales/proximas-revisar/ProximasRevisarView';
import { AnimalesSecosView } from './features/reportes/animales/secos/AnimalesSecosView';
import { AnimalesLactandoView } from './features/reportes/animales/lactando/AnimalesLactandoView';
import { AnimalesCriandoView } from './features/reportes/animales/criando/AnimalesCriandoView';
import { NoVientresView } from './features/reportes/animales/no-vientres/NoVientresView';

// Reportes - Sección Históricos
import { HistoriaReproduccionesView } from './features/reportes/historicos/reproducciones/HistoriaReproduccionesView';
import { HistoriaLactanciasView } from './features/reportes/historicos/lactancias/HistoriaLactanciasView';
import { HistoriaPesajesLecheView } from './features/reportes/historicos/pesajes-leche/HistoriaPesajesLecheView';
import { HistoriaCrecimientosView } from './features/reportes/historicos/crecimientos/HistoriaCrecimientosView';

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

            {/* Rutas Reportes - Sección Animales */}
            <Route path="reports/dams" element={<VientresView />} />
            <Route path="reportes/vientres" element={<VientresView />} />

            <Route path="reports/nexttodry" element={<ProximasSecarView />} />
            <Route path="reportes/proximas-secar" element={<ProximasSecarView />} />

            <Route path="reports/nexttobirth" element={<ProximasParirView />} />
            <Route path="reportes/proximas-parir" element={<ProximasParirView />} />

            <Route path="reports/nexttocheck" element={<ProximasRevisarView />} />
            <Route path="reportes/proximas-revisar" element={<ProximasRevisarView />} />

            <Route path="reports/drycows" element={<AnimalesSecosView />} />
            <Route path="reportes/animales-secos" element={<AnimalesSecosView />} />

            <Route path="reports/cowsinproduction" element={<AnimalesLactandoView />} />
            <Route path="reportes/animales-lactando" element={<AnimalesLactandoView />} />

            <Route path="reports/cowsraising" element={<AnimalesCriandoView />} />
            <Route path="reportes/animales-criando" element={<AnimalesCriandoView />} />

            <Route path="reports/nodams" element={<NoVientresView />} />
            <Route path="reportes/no-vientres" element={<NoVientresView />} />

            {/* Rutas Reportes - Sección Históricos */}
            <Route path="reports/historics/reproductions" element={<HistoriaReproduccionesView />} />
            <Route path="reportes/historicos/reproducciones" element={<HistoriaReproduccionesView />} />

            <Route path="reports/historics/lactations" element={<HistoriaLactanciasView />} />
            <Route path="reportes/historicos/lactancias" element={<HistoriaLactanciasView />} />

            <Route path="reports/historics/milks" element={<HistoriaPesajesLecheView />} />
            <Route path="reportes/historicos/pesajes-leche" element={<HistoriaPesajesLecheView />} />

            <Route path="reports/historics/weighings" element={<HistoriaCrecimientosView />} />
            <Route path="reportes/historicos/crecimientos" element={<HistoriaCrecimientosView />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};
