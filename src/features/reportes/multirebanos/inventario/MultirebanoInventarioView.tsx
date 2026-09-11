import React, { useState, useMemo } from 'react';
import { Search, Filter, Layers } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { SeleccionarRebanosModal } from '../components/SeleccionarRebanosModal';
import { MultirebanoFilterDrawer, MultirebanoFilterValues } from '../components/MultirebanoFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_MULTIREBANO_INVENTARIOS } from '../multirebanosMockData';
import { MultirebanoInventarioEntity } from '../../../../types2/entities';

export const MultirebanoInventarioView: React.FC = () => {
  const [inventarios] = useState<MultirebanoInventarioEntity[]>(MOCK_MULTIREBANO_INVENTARIOS);

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
  const [sortField, setSortField] = useState<keyof MultirebanoInventarioEntity>('totalAnimales');
  const [sortAsc, setSortAsc] = useState(false);

  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'rebanoNombre', label: 'Rebaño', visible: true },
    { key: 'totalAnimales', label: 'Total Animales', visible: true },
    { key: 'vacas', label: 'Vacas', visible: true },
    { key: 'novillas', label: 'Novillas', visible: true },
    { key: 'mautas', label: 'Mautas', visible: true },
    { key: 'becerras', label: 'Becerras', visible: true },
    { key: 'toros', label: 'Toros', visible: true },
    { key: 'novillos', label: 'Novillos', visible: true },
    { key: 'mautes', label: 'Mautes', visible: true },
    { key: 'becerros', label: 'Becerros', visible: true },
    { key: 'unidadesAnimalesTotales', label: 'UA Totales', visible: true }
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

  const handleSort = (field: keyof MultirebanoInventarioEntity) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredInventarios = useMemo(() => {
    return inventarios
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
  }, [inventarios, selectedHerds, searchQuery, sortField, sortAsc]);

  const totals = useMemo(() => {
    return filteredInventarios.reduce(
      (acc, curr) => ({
        totalAnimales: acc.totalAnimales + curr.totalAnimales,
        vacas: acc.vacas + curr.vacas,
        novillas: acc.novillas + curr.novillas,
        mautas: acc.mautas + curr.mautas,
        becerras: acc.becerras + curr.becerras,
        toros: acc.toros + curr.toros,
        novillos: acc.novillos + curr.novillos,
        mautes: acc.mautes + curr.mautes,
        becerros: acc.becerros + curr.becerros,
        ua: acc.ua + curr.unidadesAnimalesTotales
      }),
      {
        totalAnimales: 0,
        vacas: 0,
        novillas: 0,
        mautas: 0,
        becerras: 0,
        toros: 0,
        novillos: 0,
        mautes: 0,
        becerros: 0,
        ua: 0
      }
    );
  }, [filteredInventarios]);

  const totalPages = Math.ceil(filteredInventarios.length / pageSize) || 1;
  const paginatedInventarios = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInventarios.slice(start, start + pageSize);
  }, [filteredInventarios, currentPage, pageSize]);

  const handleExportXLSX = () => {
    const headers = [
      'Rebaño',
      'Total Animales',
      'Vacas',
      'Novillas',
      'Mautas',
      'Becerras',
      'Toros',
      'Novillos',
      'Mautes',
      'Becerros',
      'UA Totales'
    ];
    const rows = filteredInventarios.map(i => [
      i.rebanoNombre,
      i.totalAnimales,
      i.vacas,
      i.novillas,
      i.mautas,
      i.becerras,
      i.toros,
      i.novillos,
      i.mautes,
      i.becerros,
      i.unidadesAnimalesTotales
    ]);
    exportToCSV('reporte_inventario_multirebano', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Inventario multirebaño"
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
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Total Semovientes Consolidados</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
            {totals.totalAnimales}
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>Total Vacas (Vientres)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>
            {totals.vacas}
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>Total Animales Jóvenes (Hembras)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>
            {totals.novillas + totals.mautas + totals.becerras}
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#d97706', fontWeight: 600 }}>Carga Consolidada (UA)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706', marginTop: 4 }}>
            {totals.ua.toFixed(1)} UA
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
              {isColVisible('totalAnimales') && (
                <th onClick={() => handleSort('totalAnimales')}>
                  <div className="th-content">
                    <span>Total Animales</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('vacas') && <th>Vacas</th>}
              {isColVisible('novillas') && <th>Novillas</th>}
              {isColVisible('mautas') && <th>Mautas</th>}
              {isColVisible('becerras') && <th>Becerras</th>}
              {isColVisible('toros') && <th>Toros</th>}
              {isColVisible('novillos') && <th>Novillos</th>}
              {isColVisible('mautes') && <th>Mautes</th>}
              {isColVisible('becerros') && <th>Becerros</th>}
              {isColVisible('unidadesAnimalesTotales') && (
                <th onClick={() => handleSort('unidadesAnimalesTotales')}>
                  <div className="th-content">
                    <span>UA Totales</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedInventarios.length === 0 ? (
              <tr>
                <td colSpan={11} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
                  Ningún rebaño seleccionado o encontrado
                </td>
              </tr>
            ) : (
              paginatedInventarios.map(i => (
                <tr key={i.rebanoId}>
                  {isColVisible('rebanoNombre') && (
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{i.rebanoNombre}</td>
                  )}
                  {isColVisible('totalAnimales') && (
                    <td>
                      <span className="badge-efficiency high" style={{ fontSize: 13, fontWeight: 700 }}>
                        {i.totalAnimales}
                      </span>
                    </td>
                  )}
                  {isColVisible('vacas') && <td>{i.vacas}</td>}
                  {isColVisible('novillas') && <td>{i.novillas}</td>}
                  {isColVisible('mautas') && <td>{i.mautas}</td>}
                  {isColVisible('becerras') && <td>{i.becerras}</td>}
                  {isColVisible('toros') && <td>{i.toros}</td>}
                  {isColVisible('novillos') && <td>{i.novillos}</td>}
                  {isColVisible('mautes') && <td>{i.mautes}</td>}
                  {isColVisible('becerros') && <td>{i.becerros}</td>}
                  {isColVisible('unidadesAnimalesTotales') && (
                    <td style={{ fontWeight: 700, color: '#166534' }}>
                      {i.unidadesAnimalesTotales.toFixed(1)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#f8fafc', fontWeight: 800, borderTop: '2px solid var(--border-color)' }}>
              {isColVisible('rebanoNombre') && <td>TOTAL GENERAL CONSOLIDADO</td>}
              {isColVisible('totalAnimales') && <td style={{ color: '#15803d' }}>{totals.totalAnimales}</td>}
              {isColVisible('vacas') && <td>{totals.vacas}</td>}
              {isColVisible('novillas') && <td>{totals.novillas}</td>}
              {isColVisible('mautas') && <td>{totals.mautas}</td>}
              {isColVisible('becerras') && <td>{totals.becerras}</td>}
              {isColVisible('toros') && <td>{totals.toros}</td>}
              {isColVisible('novillos') && <td>{totals.novillos}</td>}
              {isColVisible('mautes') && <td>{totals.mautes}</td>}
              {isColVisible('becerros') && <td>{totals.becerros}</td>}
              {isColVisible('unidadesAnimalesTotales') && <td style={{ color: '#166534' }}>{totals.ua.toFixed(1)}</td>}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Paginación */}
      <ReportPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={filteredInventarios.length}
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
