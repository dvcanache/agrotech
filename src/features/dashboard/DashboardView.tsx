import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { KpiCards } from './components/KpiCards';
import { ChartCards } from './components/ChartCards';
import { 
  DashboardSpeciesFilter, 
  SPECIES_SELECTOR_OPTIONS, 
  calculateDashboardData 
} from './dashboardData';
import { matchesEspecie } from '../animales/useAnimales';
import './dashboard.css';

export const DashboardView: React.FC = () => {
  const { animals } = useApp();
  const [selectedSpecies, setSelectedSpecies] = useState<DashboardSpeciesFilter>('global');

  // Compute animal counts for each pill/tab dynamically
  const speciesCounts = useMemo(() => {
    const counts: Record<string, number> = {
      global: animals.length
    };
    SPECIES_SELECTOR_OPTIONS.forEach(opt => {
      if (opt.id !== 'global') {
        counts[opt.id] = animals.filter(a => matchesEspecie(a, opt.id)).length;
      }
    });
    return counts;
  }, [animals]);

  // Compute dynamic KPIs and Charts based on selected species and animals in real time
  const dashboardData = useMemo(() => {
    return calculateDashboardData(animals, selectedSpecies);
  }, [animals, selectedSpecies]);

  // Current active option info
  const currentOption = useMemo(() => {
    return SPECIES_SELECTOR_OPTIONS.find(opt => opt.id === selectedSpecies) || SPECIES_SELECTOR_OPTIONS[0];
  }, [selectedSpecies]);

  return (
    <div className="dashboard-container">
      {/* Sleek Species Selector Card */}
      <section className="species-selector-card" aria-label="Selector de especies">
        <div className="species-selector-header">
          <div className="species-selector-info">
            <div className="species-selector-badge-icon">
              {currentOption.icon}
            </div>
            <div className="species-selector-titles">
              <h2 className="species-selector-main-title">
                {selectedSpecies === 'global' ? 'Visión Global Multiespecie' : `Panel Productivo: ${currentOption.name}`}
              </h2>
              <span className="species-selector-subtitle">
                {selectedSpecies === 'global' 
                  ? 'Monitor zootécnico unificado del inventario pecuario integral'
                  : `Indicadores zootécnicos especializados y rendimiento de ${currentOption.name}`
                }
              </span>
            </div>
          </div>

          <div className="species-selector-status">
            <div className="live-sync-indicator" title="Métricas zootécnicas sincronizadas con el inventario activo">
              <span className="pulse-dot" />
              <span>Sincronizado ({speciesCounts[selectedSpecies] || 0} semovientes)</span>
            </div>
          </div>
        </div>

        {/* Species Pills / Tabs Bar */}
        <div className="species-pills-bar" role="tablist">
          {SPECIES_SELECTOR_OPTIONS.map(opt => {
            const isActive = selectedSpecies === opt.id;
            const count = speciesCounts[opt.id] ?? 0;

            return (
              <button
                key={opt.id}
                role="tab"
                aria-selected={isActive}
                className={`species-pill ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedSpecies(opt.id)}
              >
                <span className="species-pill-icon">{opt.icon}</span>
                <span>{opt.label.replace(/^[^\s]+\s*/, '')}</span>
                <span className="species-pill-count">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Dynamic KPI Cards */}
      <KpiCards cards={dashboardData.kpis} />

      {/* Dynamic Charts Grid */}
      <ChartCards charts={dashboardData.charts} />
    </div>
  );
};
