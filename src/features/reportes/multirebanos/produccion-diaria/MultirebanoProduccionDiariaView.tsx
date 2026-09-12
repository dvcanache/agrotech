import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Layers, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { SeleccionarRebanosModal } from '../components/SeleccionarRebanosModal';
import { MultirebanoFilterDrawer, MultirebanoFilterValues } from '../components/MultirebanoFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_MULTIREBANO_PRODUCCION_DIARIA } from '../multirebanosMockData';
import { MultirebanoProduccionDiariaEntity } from '../../../../types2/entities';

export const MultirebanoProduccionDiariaView: React.FC = () => {
  const [producciones] = useState<MultirebanoProduccionDiariaEntity[]>(MOCK_MULTIREBANO_PRODUCCION_DIARIA);

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
  const [sortField, setSortField] = useState<keyof MultirebanoProduccionDiariaEntity>('fecha');
  const [sortAsc, setSortAsc] = useState(false);

  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'fecha', label: 'Fecha', visible: true },
    { key: 'rebanoNombre', label: 'Rebaño', visible: true },
    { key: 'vacasOrdenadas', label: 'Vacas Ordeñadas', visible: true },
    { key: 'lecheTotalLitros', label: 'Leche Total (L)', visible: true },
    { key: 'promedioLitrosVaca', label: 'Promedio L/Vaca', visible: true }
  ]);

  const [filters, setFilters] = useState<MultirebanoFilterValues>({
    rebanosIds: selectedHerds,
    desde: undefined,
    hasta: undefined
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedHerds.length < 5) count++;
    if (filters.desde || filters.hasta) count++;
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

  const handleSort = (field: keyof MultirebanoProduccionDiariaEntity) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredProducciones = useMemo(() => {
    return producciones
      .filter(item => {
        if (!selectedHerds.includes(item.rebanoId)) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchReb = item.rebanoNombre.toLowerCase().includes(q);
          const matchDate = item.fecha.includes(q);
          if (!matchReb && !matchDate) return false;
        }

        if (filters.desde && item.fecha < filters.desde) return false;
        if (filters.hasta && item.fecha > filters.hasta) return false;

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
  }, [producciones, selectedHerds, searchQuery, filters, sortField, sortAsc]);

  const totals = useMemo(() => {
    const totalLitros = filteredProducciones.reduce((acc, p) => acc + p.lecheTotalLitros, 0);
    const totalVacas = filteredProducciones.reduce((acc, p) => acc + p.vacasOrdenadas, 0);
    const avgGlobal = totalVacas > 0 ? (totalLitros / totalVacas).toFixed(1) : '0';

    return {
      totalLitros: totalLitros.toFixed(1),
      totalVacas,
      avgGlobal
    };
  }, [filteredProducciones]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedHerds, searchQuery, filters]);

  const totalPages = Math.ceil(filteredProducciones.length / pageSize) || 1;
  const paginatedProducciones = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredProducciones.slice(start, start + pageSize);
  }, [filteredProducciones, currentPage, totalPages, pageSize]);

  const handleExportXLSX = () => {
    const headers = [
      'Fecha',
      'Rebaño',
      'Vacas Ordeñadas',
      'Leche Total (L)',
      'Promedio Litros/Vaca'
    ];
    const rows = filteredProducciones.map(p => [
      p.fecha,
      p.rebanoNombre,
      p.vacasOrdenadas,
      p.lecheTotalLitros,
      p.promedioLitrosVaca
    ]);
    exportToCSV('reporte_multirebano_producciones_diarias', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Producciones diarias"
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
                placeholder="Buscar por fecha o rebaño..."
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
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 16
        }}
      >
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Volumen Total Registrado</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>
            {totals.totalLitros} L
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Total Vacas Ordeñadas</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>
            {totals.totalVacas}
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Promedio Ponderado General</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706', marginTop: 4 }}>
            {totals.avgGlobal} L/vaca
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="report-table-wrapper">
        <table className="report-grid-table">
          <thead>
            <tr>
              {isColVisible('fecha') && (
                <th onClick={() => handleSort('fecha')}>
                  <div className="th-content">
                    <span>Fecha</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('rebanoNombre') && (
                <th onClick={() => handleSort('rebanoNombre')}>
                  <div className="th-content">
                    <span>Rebaño</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('vacasOrdenadas') && (
                <th onClick={() => handleSort('vacasOrdenadas')}>
                  <div className="th-content">
                    <span>Vacas Ordeñadas</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('lecheTotalLitros') && (
                <th onClick={() => handleSort('lecheTotalLitros')}>
                  <div className="th-content">
                    <span>Leche Total (L)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('promedioLitrosVaca') && (
                <th onClick={() => handleSort('promedioLitrosVaca')}>
                  <div className="th-content">
                    <span>Promedio L/Vaca</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedProducciones.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
                  Ningún registro de producción encontrado
                </td>
              </tr>
            ) : (
              paginatedProducciones.map((p, idx) => (
                <tr key={`${p.fecha}-${p.rebanoId}-${idx}`}>
                  {isColVisible('fecha') && <td>{p.fecha}</td>}
                  {isColVisible('rebanoNombre') && (
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.rebanoNombre}</td>
                  )}
                  {isColVisible('vacasOrdenadas') && <td>{p.vacasOrdenadas} vacas</td>}
                  {isColVisible('lecheTotalLitros') && (
                    <td style={{ fontWeight: 700, color: '#166534' }}>
                      {p.lecheTotalLitros.toFixed(1)} L
                    </td>
                  )}
                  {isColVisible('promedioLitrosVaca') && (
                    <td>
                      <span className="badge-efficiency high">{p.promedioLitrosVaca} L/vaca</span>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <ReportPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={filteredProducciones.length}
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
        showDateRange={true}
        showFechaCorte={false}
        onFilterChange={newFilters => {
          setFilters(newFilters);
          setSelectedHerds(newFilters.rebanosIds);
        }}
        onReset={() => {
          setSelectedHerds(['HERD-01', 'HERD-02', 'HERD-03', 'HERD-04', 'HERD-05']);
          setFilters({
            rebanosIds: ['HERD-01', 'HERD-02', 'HERD-03', 'HERD-04', 'HERD-05'],
            desde: undefined,
            hasta: undefined
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
