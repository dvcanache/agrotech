import React, { useState, useMemo } from 'react';
import { POTREROS_MOCK_DATA, PotreroItem } from './potrerosData';
import { PotrerosTable } from './components/PotrerosTable';
import { PotrerosToolbar } from './components/PotrerosToolbar';
import { NuevoPotreroModal } from './components/NuevoPotreroModal';
import { PotrerosFilterDrawer, PotrerosFilterState } from './components/PotrerosFilterDrawer';
import { ReportPagination } from '../reportes/components/ReportPagination';
import { exportToCSV, exportToPDF } from '../reportes/utils/exportUtils';
import { Trees, CheckCircle2, Moon, Activity } from 'lucide-react';

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
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

      // Estatus
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
  }, [potreros, searchTerm, filters]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPotreros.length / pageSize));
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPotreros.slice(start, start + pageSize);
  }, [filteredPotreros, currentPage]);

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

  const hasActiveFilters =
    filters.estatus !== '' ||
    filters.especieForrajera !== '' ||
    filters.areaMin !== '' ||
    filters.areaMax !== '' ||
    filters.conLote !== 'todos';

  // KPI Metrics
  const totalSuperficieHa = potreros.reduce((sum, p) => sum + p.areaHa, 0);
  const potrerosActivos = potreros.filter(p => p.estatus === 'Activo').length;
  const potrerosDescanso = potreros.filter(p => p.estatus === 'En descanso').length;
  const totalAnimales = potreros.reduce((sum, p) => sum + p.animalesPresentes, 0);

  // Export handlers
  const handleExportExcel = () => {
    const headers = [
      'Código',
      'Descripción',
      'Superficie (ha)',
      'Perímetro (m)',
      'Especie Forrajera',
      'Aforo (kg MV/m²)',
      'Carga Recomendada (UGG/ha)',
      'Carga Actual (UGG/ha)',
      'Lote Asignado',
      'Animales Presentes',
      'Estatus'
    ];
    const rows = filteredPotreros.map(p => [
      p.codigo,
      p.descripcion,
      p.areaHa,
      p.perimetroM,
      p.especieForrajera,
      p.aforoKgM2,
      p.cargaRecomendadaUggHa,
      p.cargaActualUggHa,
      p.loteAsignado || 'Sin Lote',
      p.animalesPresentes,
      p.estatus
    ]);
    exportToCSV('maestro_potreros', headers, rows);
  };

  const handleExportPdf = () => {
    const headers = ['Código', 'Descripción', 'Superficie', 'Forraje', 'Lote', 'Animales', 'Carga', 'Estatus'];
    const rows = filteredPotreros.map(p => [
      p.codigo,
      p.descripcion,
      `${p.areaHa} ha`,
      p.especieForrajera,
      p.loteAsignado || 'N/A',
      p.animalesPresentes,
      `${p.cargaActualUggHa} UGG`,
      p.estatus
    ]);
    exportToPDF('maestro_potreros', 'Maestro de Potreros y Pasturas', headers, rows);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* Header */}
      <div className="events-header">
        <div className="events-header-left">
          <h2 className="toolbar-title">Maestro de Potreros</h2>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Administración agronómica de pasturas y cargas animales
          </span>
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
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Superficie Total</div>
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
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Semovientes en Pastoreo</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {totalAnimales} cabezas
            </div>
          </div>
        </div>
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
