import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Layers, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { SeleccionarRebanosModal } from '../components/SeleccionarRebanosModal';
import { MultirebanoFilterDrawer, MultirebanoFilterValues } from '../components/MultirebanoFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_MULTIREBANO_DISTRIBUCION_PRENEZ } from '../multirebanosMockData';
import { MultirebanoDistribucionPrenezEntity } from '../../../../types2/entities';

export const MultirebanoDistribucionPrenezView: React.FC = () => {
  const [datos] = useState<MultirebanoDistribucionPrenezEntity[]>(MOCK_MULTIREBANO_DISTRIBUCION_PRENEZ);

  const [isHerdModalOpen, setIsHerdModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [selectedHerds, setSelectedHerds] = useState<string[]>([
    'HERD-01',
    'HERD-02',
    'HERD-03',
    'HERD-04',
    'HERD-05'
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof MultirebanoDistribucionPrenezEntity>('primerTercio');
  const [sortAsc, setSortAsc] = useState(false);

  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'rebanoNombre', label: 'Rebaño', visible: true },
    { key: 'primerTercio', label: '1er Tercio (1-3 meses)', visible: true },
    { key: 'segundoTercio', label: '2do Tercio (4-6 meses)', visible: true },
    { key: 'tercerTercio', label: '3er Tercio (7-9 meses)', visible: true },
    { key: 'proximasParir', label: 'Próximas a Parir', visible: true },
    { key: 'totalPrenez', label: 'Total Preñadas', visible: true }
  ]);

  const [filters, setFilters] = useState<MultirebanoFilterValues>({
    rebanosIds: selectedHerds,
    fechaCorte: undefined
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedHerds.length < 5) count++;
    if (filters.fechaCorte) count++;
    return count;
  }, [selectedHerds, filters]);

  const toggleColumn = (key: string) => {
    setColumns(prev =>
      prev.map(col => (col.key === key ? { ...col, visible: !col.visible } : col))
    );
  };

  const resetColumns = () => {
    setColumns(prev => prev.map(col => ({ ...col, visible: true })));
  };

  const handleSort = (field: keyof MultirebanoDistribucionPrenezEntity) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredDatos = useMemo(() => {
    return datos
      .filter(item => {
        if (!selectedHerds.includes(item.rebanoId)) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          if (!item.rebanoNombre.toLowerCase().includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA || '').localeCompare(String(valB || ''))
          : String(valB || '').localeCompare(String(valA || ''));
      });
  }, [datos, selectedHerds, searchQuery, sortField, sortAsc]);

  const totals = useMemo(() => {
    return filteredDatos.reduce(
      (acc, curr) => ({
        t1: acc.t1 + curr.primerTercio,
        t2: acc.t2 + curr.segundoTercio,
        t3: acc.t3 + curr.tercerTercio,
        proximas: acc.proximas + curr.proximasParir,
        total: acc.total + (curr.primerTercio + curr.segundoTercio + curr.tercerTercio)
      }),
      { t1: 0, t2: 0, t3: 0, proximas: 0, total: 0 }
    );
  }, [filteredDatos]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedHerds, searchQuery]);

  const totalPages = Math.ceil(filteredDatos.length / pageSize) || 1;
  const paginatedDatos = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredDatos.slice(start, start + pageSize);
  }, [filteredDatos, currentPage, totalPages, pageSize]);

  const handleExportXLSX = () => {
    const headers = [
      'Rebaño',
      '1er Tercio (1-3 meses)',
      '2do Tercio (4-6 meses)',
      '3er Tercio (7-9 meses)',
      'Próximas a Parir',
      'Total Preñadas'
    ];
    const rows = filteredDatos.map(d => [
      d.rebanoNombre,
      d.primerTercio,
      d.segundoTercio,
      d.tercerTercio,
      d.proximasParir,
      d.primerTercio + d.segundoTercio + d.tercerTercio
    ]);
    exportToCSV('reporte_multirebano_distribucion_prenez', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Distribución por preñez"
        backRoute="/reportes"
        onFilterToggle={() => setIsFilterDrawerOpen(prev => !prev)}
        isFilterOpen={isFilterDrawerOpen}
        activeFiltersCount={activeFiltersCount}
        onExportXLSX={handleExportXLSX}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
        extraActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsHerdModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 600,
                fontSize: 13,
                backgroundColor: '#f0fdf4',
                color: '#166534',
                border: '1px solid #bbf7d0'
              }}
            >
              <Layers size={15} />
              Rebaños ({selectedHerds.length})
            </button>
            <div className="report-search-bar">
              <Search className="report-search-icon" size={16} />
              <input
                type="text"
                className="report-search-input"
                placeholder="Buscar rebaño..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        }
      />

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 16
        }}
      >
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600 }}>1er Tercio (1 - 3 Meses)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1e40af', marginTop: 4 }}>
            {totals.t1} vacas
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#0d9488', fontWeight: 600 }}>2do Tercio (4 - 6 Meses)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#0f766e', marginTop: 4 }}>
            {totals.t2} vacas
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#d97706', fontWeight: 600 }}>3er Tercio (7 - 9 Meses)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#b45309', marginTop: 4 }}>
            {totals.t3} vacas
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>Próximas a Parir</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>
            {totals.proximas} vacas
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="report-table-wrapper">
        <table className="report-grid-table">
          <thead>
            <tr>
              {isColVisible('rebanoNombre') && (
                <th onClick={() => handleSort('rebanoNombre')}>
                  <div className="th-content">
                    <span>Rebaño</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('primerTercio') && (
                <th onClick={() => handleSort('primerTercio')}>
                  <div className="th-content">
                    <span>1er Tercio (1-3 m)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('segundoTercio') && (
                <th onClick={() => handleSort('segundoTercio')}>
                  <div className="th-content">
                    <span>2do Tercio (4-6 m)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('tercerTercio') && (
                <th onClick={() => handleSort('tercerTercio')}>
                  <div className="th-content">
                    <span>3er Tercio (7-9 m)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('proximasParir') && (
                <th onClick={() => handleSort('proximasParir')}>
                  <div className="th-content">
                    <span>Próximas a Parir</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('totalPrenez') && <th>Total Preñadas</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedDatos.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
                  Ningún rebaño seleccionado o encontrado
                </td>
              </tr>
            ) : (
              paginatedDatos.map(d => {
                const totalRebano = d.primerTercio + d.segundoTercio + d.tercerTercio;
                return (
                  <tr key={d.rebanoId}>
                    {isColVisible('rebanoNombre') && (
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{d.rebanoNombre}</td>
                    )}
                    {isColVisible('primerTercio') && (
                      <td style={{ color: '#2563eb', fontWeight: 600 }}>{d.primerTercio}</td>
                    )}
                    {isColVisible('segundoTercio') && (
                      <td style={{ color: '#0d9488', fontWeight: 600 }}>{d.segundoTercio}</td>
                    )}
                    {isColVisible('tercerTercio') && (
                      <td style={{ color: '#d97706', fontWeight: 600 }}>{d.tercerTercio}</td>
                    )}
                    {isColVisible('proximasParir') && (
                      <td>
                        <span className="badge-efficiency high">{d.proximasParir}</span>
                      </td>
                    )}
                    {isColVisible('totalPrenez') && (
                      <td style={{ fontWeight: 700, color: '#15803d' }}>{totalRebano}</td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#f8fafc', fontWeight: 800, borderTop: '2px solid var(--border-color)' }}>
              {isColVisible('rebanoNombre') && <td>TOTAL GENERAL CONSOLIDADO</td>}
              {isColVisible('primerTercio') && <td style={{ color: '#2563eb' }}>{totals.t1}</td>}
              {isColVisible('segundoTercio') && <td style={{ color: '#0d9488' }}>{totals.t2}</td>}
              {isColVisible('tercerTercio') && <td style={{ color: '#d97706' }}>{totals.t3}</td>}
              {isColVisible('proximasParir') && <td>{totals.proximas}</td>}
              {isColVisible('totalPrenez') && <td style={{ color: '#15803d' }}>{totals.total}</td>}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Paginación */}
      <ReportPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={filteredDatos.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Modal Seleccionar Rebaños */}
      <SeleccionarRebanosModal
        isOpen={isHerdModalOpen}
        onClose={() => setIsHerdModalOpen(false)}
        selectedIds={selectedHerds}
        onApply={ids => {
          setSelectedHerds(ids);
          setFilters(prev => ({ ...prev, rebanosIds: ids }));
        }}
      />

      {/* Drawer Filtros */}
      <MultirebanoFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={{ ...filters, rebanosIds: selectedHerds }}
        onFilterChange={newFilters => {
          setFilters(newFilters);
          setSelectedHerds(newFilters.rebanosIds);
        }}
        onReset={() => {
          setSelectedHerds(['HERD-01', 'HERD-02', 'HERD-03', 'HERD-04', 'HERD-05']);
          setFilters({
            rebanosIds: ['HERD-01', 'HERD-02', 'HERD-03', 'HERD-04', 'HERD-05'],
            fechaCorte: undefined
          });
        }}
      />

      {/* Modal Configuración Columnas */}
      <ReportSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        columns={columns}
        onToggleColumn={toggleColumn}
        onResetColumns={resetColumns}
      />
    </div>
  );
};
