import React, { useState, useMemo, useEffect } from 'react';
import { POTREROS_MOCK_DATA, PotreroItem } from './potrerosData';
import { PotrerosTable } from './components/PotrerosTable';
import { PotrerosToolbar } from './components/PotrerosToolbar';
import { NuevoPotreroModal } from './components/NuevoPotreroModal';
import { ModalAforoPotrero } from './components/ModalAforoPotrero';
import { PotrerosFilterDrawer, PotrerosFilterState } from './components/PotrerosFilterDrawer';
import { ReportPagination } from '../reportes/components/ReportPagination';
import { exportToCSV, exportToPDF } from '../reportes/utils/exportUtils';
import { getPrvStatusInfo, PrvStatus } from './prvUtils';
import './potreros.css';
import {
  Trees,
  CheckCircle2,
  Moon,
  Activity,
  Scale,
  Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';

const INITIAL_FILTERS: PotrerosFilterState = {
  estatus: '',
  especieForrajera: '',
  areaMin: '',
  areaMax: '',
  conLote: 'todos'
};

export const PotrerosView: React.FC = () => {
  const [potreros, setPotreros] = useState<PotreroItem[]>(POTREROS_MOCK_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<PotrerosFilterState>(INITIAL_FILTERS);
  const [prvFilter, setPrvFilter] = useState<'todos' | PrvStatus>('todos');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isAforoModalOpen, setIsAforoModalOpen] = useState(false);
  const [selectedAforoPaddock, setSelectedAforoPaddock] = useState<PotreroItem | null>(null);
  const [selectedPotreros, setSelectedPotreros] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter logic
  const filteredPotreros = useMemo(() => {
    return potreros.filter(item => {
      // Search
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches =
          item.codigo.toLowerCase().includes(query) ||
          item.descripcion.toLowerCase().includes(query) ||
          item.especieForrajera.toLowerCase().includes(query) ||
          (item.loteAsignado && item.loteAsignado.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // PRV Traffic Light Filter
      if (prvFilter !== 'todos') {
        const prvInfo = getPrvStatusInfo(
          item.animalesPresentes,
          item.diasOcupacionActual,
          item.diasDescansoActual,
          item.diasDescansoRequeridos
        );
        if (prvInfo.status !== prvFilter) return false;
      }

      // Estatus general
      if (filters.estatus && item.estatus !== filters.estatus) {
        return false;
      }

      // Especie forrajera
      if (filters.especieForrajera && item.especieForrajera !== filters.especieForrajera) {
        return false;
      }

      // Area min / max
      if (filters.areaMin && item.areaHa < parseFloat(filters.areaMin)) {
        return false;
      }
      if (filters.areaMax && item.areaHa > parseFloat(filters.areaMax)) {
        return false;
      }

      // Con Lote
      if (filters.conLote === 'con_lote' && !item.loteAsignado) {
        return false;
      }
      if (filters.conLote === 'sin_lote' && item.loteAsignado) {
        return false;
      }

      return true;
    });
  }, [potreros, searchTerm, filters, prvFilter]);

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, prvFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPotreros.length / pageSize));
  const currentItems = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredPotreros.slice(start, start + pageSize);
  }, [filteredPotreros, currentPage, totalPages]);

  // Selection
  const isSelectAll =
    currentItems.length > 0 &&
    currentItems.every(item => !!selectedPotreros[item.codigo]);

  const handleToggleSelectAll = () => {
    if (isSelectAll) {
      const next = { ...selectedPotreros };
      currentItems.forEach(item => delete next[item.codigo]);
      setSelectedPotreros(next);
    } else {
      const next = { ...selectedPotreros };
      currentItems.forEach(item => {
        next[item.codigo] = true;
      });
      setSelectedPotreros(next);
    }
  };

  const handleToggleSelect = (codigo: string) => {
    setSelectedPotreros(prev => ({
      ...prev,
      [codigo]: !prev[codigo]
    }));
  };

  const handleSaveNuevoPotrero = (nuevo: PotreroItem) => {
    setPotreros(prev => [nuevo, ...prev]);
  };

  const handleOpenAforoModal = (paddock?: PotreroItem) => {
    setSelectedAforoPaddock(paddock || potreros[0]);
    setIsAforoModalOpen(true);
  };

  const handleSaveAforo = (
    codigo: string,
    aforoKgM2: number,
    porcentajeMS: number,
    cargaRecomendadaUggHa: number,
    aforoKgMsHa: number
  ) => {
    setPotreros(prev =>
      prev.map(p => {
        if (p.codigo === codigo) {
          return {
            ...p,
            aforoKgM2,
            porcentajeMS,
            cargaRecomendadaUggHa,
            aforoKgMsHa
          };
        }
        return p;
      })
    );
  };

  const hasActiveFilters =
    filters.estatus !== '' ||
    filters.especieForrajera !== '' ||
    filters.areaMin !== '' ||
    filters.areaMax !== '' ||
    filters.conLote !== 'todos' ||
    prvFilter !== 'todos';

  // KPI Metrics
  const totalSuperficieHa = potreros.reduce((sum, p) => sum + p.areaHa, 0);
  const potrerosActivos = potreros.filter(p => p.estatus === 'Activo').length;
  const potrerosDescanso = potreros.filter(p => p.estatus === 'En descanso').length;
  const totalAnimales = potreros.reduce((sum, p) => sum + p.animalesPresentes, 0);
  const totalUgg = potreros.reduce((sum, p) => sum + p.uggPresentes, 0);

  // PRV Count breakdown
  const prvCounts = useMemo(() => {
    const counts = { optimo: 0, pastoreo: 0, sobrepastoreo: 0, descanso: 0 };
    potreros.forEach(p => {
      const info = getPrvStatusInfo(
        p.animalesPresentes,
        p.diasOcupacionActual,
        p.diasDescansoActual,
        p.diasDescansoRequeridos
      );
      counts[info.status]++;
    });
    return counts;
  }, [potreros]);

  // Export handlers
  const handleExportExcel = () => {
    const headers = [
      'Código',
      'Descripción',
      'Superficie (ha)',
      'Perímetro (m)',
      'Especie Forrajera',
      'Aforo (kg MV/m²)',
      'Oferta MS (kg MS/ha)',
      'Materia Seca (%)',
      'Lote Asignado',
      'Animales',
      'UGG Presentes',
      'Carga Actual (UGG/ha)',
      'Carga Recom. (UGG/ha)',
      'Días Ocupado',
      'Días Descanso',
      'Semáforo PRV'
    ];
    const rows = filteredPotreros.map(p => {
      const prv = getPrvStatusInfo(
        p.animalesPresentes,
        p.diasOcupacionActual,
        p.diasDescansoActual,
        p.diasDescansoRequeridos
      );
      return [
        p.codigo,
        p.descripcion,
        p.areaHa,
        p.perimetroM,
        p.especieForrajera,
        p.aforoKgM2,
        p.aforoKgMsHa,
        p.porcentajeMS,
        p.loteAsignado || 'Sin Lote',
        p.animalesPresentes,
        p.uggPresentes,
        p.cargaActualUggHa,
        p.cargaRecomendadaUggHa,
        p.diasOcupacionActual,
        p.diasDescansoActual,
        prv.label
      ];
    });
    exportToCSV('maestro_potreros_prv', headers, rows);
  };

  const handleExportPdf = () => {
    const headers = [
      'Código',
      'Superficie',
      'Forraje',
      'Aforo MS',
      'Lote',
      'Animales',
      'Carga',
      'Semáforo PRV'
    ];
    const rows = filteredPotreros.map(p => {
      const prv = getPrvStatusInfo(
        p.animalesPresentes,
        p.diasOcupacionActual,
        p.diasDescansoActual,
        p.diasDescansoRequeridos
      );
      return [
        p.codigo,
        `${p.areaHa} ha`,
        p.especieForrajera,
        `${p.aforoKgMsHa} kg/ha`,
        p.loteAsignado || 'Sin lote',
        `${p.animalesPresentes} cab`,
        `${p.cargaActualUggHa} UGG/ha`,
        prv.shortLabel
      ];
    });
    exportToPDF('maestro_potreros_prv', 'Maestro de Potreros & Pastoreo Racional Voisin', headers, rows);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* Header */}
      <div className="events-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div className="events-header-left">
          <h2 className="toolbar-title">Maestro de Potreros & Pasturas (PRV)</h2>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Administración agronómica de parcelas, aforos forrajeros y leyes del Pastoreo Racional Voisin
          </span>
        </div>
        <div className="events-header-right" style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleOpenAforoModal()}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Scale size={16} />
            <span>Calculadora de Aforo</span>
          </button>
          <Link to="/mapas" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Compass size={16} />
            <span>Visor Cartográfico GIS</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: 16
      }}>
        <div className="kpi-card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            backgroundColor: '#e8f5e9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2d6a4f'
          }}>
            <Trees size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Superficie Predial</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {totalSuperficieHa.toFixed(1)} ha
            </div>
          </div>
        </div>

        <div className="kpi-card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            backgroundColor: '#e3f2fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1976d2'
          }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Potreros en Pastoreo</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {potrerosActivos} de {potreros.length}
            </div>
          </div>
        </div>

        <div className="kpi-card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            backgroundColor: '#fff3e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f57c00'
          }}>
            <Moon size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Potreros en Descanso</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {potrerosDescanso} parcelas
            </div>
          </div>
        </div>

        <div className="kpi-card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            backgroundColor: '#f3e5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7b1fa2'
          }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Animales & UGG</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {totalAnimales} cab ({totalUgg.toFixed(1)} UGG)
            </div>
          </div>
        </div>
      </div>

      {/* PRV Voisin Traffic Light Bar */}
      <div className="prv-summary-bar">
        <div className="prv-summary-title">
          <span>Semáforo Voisin (PRV):</span>
        </div>

        <div className="prv-summary-pills">
          <button
            type="button"
            className={`prv-filter-pill ${prvFilter === 'todos' ? 'active' : ''}`}
            onClick={() => setPrvFilter('todos')}
          >
            Todos ({potreros.length})
          </button>

          <button
            type="button"
            className={`prv-filter-pill pill-optimo ${prvFilter === 'optimo' ? 'active' : ''}`}
            onClick={() => setPrvFilter('optimo')}
            title="Punto Óptimo de Reposo: listo para pastorear"
          >
            <span>🟢 Punto Óptimo ({prvCounts.optimo})</span>
          </button>

          <button
            type="button"
            className={`prv-filter-pill pill-pastoreo ${prvFilter === 'pastoreo' ? 'active' : ''}`}
            onClick={() => setPrvFilter('pastoreo')}
            title="Pastoreo activo: 1 a 2 días de permanencia"
          >
            <span>🟡 En Pastoreo ({prvCounts.pastoreo})</span>
          </button>

          <button
            type="button"
            className={`prv-filter-pill pill-sobrepastoreo ${prvFilter === 'sobrepastoreo' ? 'active' : ''}`}
            onClick={() => setPrvFilter('sobrepastoreo')}
            title="Alerta de sobrepastoreo: >2 días de permanencia"
          >
            <span>🔴 ¡Sobrepastoreo! ({prvCounts.sobrepastoreo})</span>
          </button>

          <button
            type="button"
            className={`prv-filter-pill pill-descanso ${prvFilter === 'descanso' ? 'active' : ''}`}
            onClick={() => setPrvFilter('descanso')}
            title="En descanso y recuperación forrajera"
          >
            <span>🔵 En Descanso ({prvCounts.descanso})</span>
          </button>
        </div>

        {prvFilter !== 'todos' && (
          <button
            type="button"
            onClick={() => setPrvFilter('todos')}
            style={{ fontSize: 11, color: 'var(--text-secondary)', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Limpiar filtro
          </button>
        )}
      </div>

      {/* Toolbar */}
      <PotrerosToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenFilter={() => setIsFilterOpen(true)}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
        hasActiveFilters={hasActiveFilters}
        totalRecords={filteredPotreros.length}
      />

      {/* Data Table */}
      <div className="data-table-container">
        <PotrerosTable
          items={currentItems}
          selectedPotreros={selectedPotreros}
          isSelectAll={isSelectAll}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelect={handleToggleSelect}
          onOpenAforoModal={handleOpenAforoModal}
          onSelectPotrero={potrero => handleOpenAforoModal(potrero)}
        />
        <ReportPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={filteredPotreros.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modals & Drawers */}
      <NuevoPotreroModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleSaveNuevoPotrero}
      />

      <ModalAforoPotrero
        isOpen={isAforoModalOpen}
        onClose={() => setIsAforoModalOpen(false)}
        paddock={selectedAforoPaddock}
        paddocksList={potreros}
        onSaveAforo={handleSaveAforo}
      />

      <PotrerosFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(INITIAL_FILTERS)}
      />
    </div>
  );
};
