import React, { useState, useMemo } from 'react';
import { Search, Filter, Layers, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { SeleccionarRebanosModal } from '../components/SeleccionarRebanosModal';
import { MultirebanoFilterDrawer, MultirebanoFilterValues } from '../components/MultirebanoFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_MULTIREBANO_REPRODUCCION } from '../multirebanosMockData';
import { MultirebanoSituacionReproductivaEntity } from '../../../../types2/entities';

export const MultirebanoReproduccionView: React.FC = () => {
  const [datos] = useState<MultirebanoSituacionReproductivaEntity[]>(MOCK_MULTIREBANO_REPRODUCCION);

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
  const [sortField, setSortField] = useState<keyof MultirebanoSituacionReproductivaEntity>('porcentajePrenez');
  const [sortAsc, setSortAsc] = useState(false);

  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'rebanoNombre', label: 'Rebaño', visible: true },
    { key: 'vientresTotales', label: 'Vientres Totales', visible: true },
    { key: 'prenadas', label: 'Preñadas', visible: true },
    { key: 'vacias', label: 'Vacías', visible: true },
    { key: 'enEspera', label: 'En Espera', visible: true },
    { key: 'porcentajePrenez', label: '% Preñez', visible: true },
    { key: 'diasAbiertosPromedio', label: 'Días Abiertos Prom.', visible: true }
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

  const handleSort = (field: keyof MultirebanoSituacionReproductivaEntity) => {
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
    const sum = filteredDatos.reduce(
      (acc, curr) => ({
        vientres: acc.vientres + curr.vientresTotales,
        prenadas: acc.prenadas + curr.prenadas,
        vacias: acc.vacias + curr.vacias,
        enEspera: acc.enEspera + curr.enEspera,
        sumDias: acc.sumDias + curr.diasAbiertosPromedio * curr.vientresTotales
      }),
      { vientres: 0, prenadas: 0, vacias: 0, enEspera: 0, sumDias: 0 }
    );

    const pctGlobal = sum.vientres > 0 ? (sum.prenadas / sum.vientres) * 100 : 0;
    const diasProm = sum.vientres > 0 ? Math.round(sum.sumDias / sum.vientres) : 0;

    return {
      vientres: sum.vientres,
      prenadas: sum.prenadas,
      vacias: sum.vacias,
      enEspera: sum.enEspera,
      pctGlobal: Number(pctGlobal.toFixed(2)),
      diasProm
    };
  }, [filteredDatos]);

  const totalPages = Math.ceil(filteredDatos.length / pageSize) || 1;
  const paginatedDatos = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDatos.slice(start, start + pageSize);
  }, [filteredDatos, currentPage, pageSize]);

  const handleExportXLSX = () => {
    const headers = [
      'Rebaño',
      'Vientres Totales',
      'Preñadas',
      'Vacías',
      'En Espera',
      '% Preñez',
      'Días Abiertos Promedio'
    ];
    const rows = filteredDatos.map(d => [
      d.rebanoNombre,
      d.vientresTotales,
      d.prenadas,
      d.vacias,
      d.enEspera,
      `${d.porcentajePrenez}%`,
      d.diasAbiertosPromedio
    ]);
    exportToCSV('reporte_multirebano_situacion_reproductiva', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Situación reproductiva actual"
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
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Total Vientres Aptos</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
            {totals.vientres}
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>% Preñez Consolidado</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>
            {totals.pctGlobal}%
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>Total Vacas Preñadas</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>
            {totals.prenadas}
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#d97706', fontWeight: 600 }}>Días Abiertos Promedio</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706', marginTop: 4 }}>
            {totals.diasProm} días
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
              {isColVisible('vientresTotales') && (
                <th onClick={() => handleSort('vientresTotales')}>
                  <div className="th-content">
                    <span>Vientres Totales</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('prenadas') && (
                <th onClick={() => handleSort('prenadas')}>
                  <div className="th-content">
                    <span>Preñadas</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('vacias') && <th>Vacías</th>}
              {isColVisible('enEspera') && <th>En Espera</th>}
              {isColVisible('porcentajePrenez') && (
                <th onClick={() => handleSort('porcentajePrenez')}>
                  <div className="th-content">
                    <span>% Preñez</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('diasAbiertosPromedio') && (
                <th onClick={() => handleSort('diasAbiertosPromedio')}>
                  <div className="th-content">
                    <span>Días Abiertos Prom.</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedDatos.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
                  Ningún rebaño seleccionado o encontrado
                </td>
              </tr>
            ) : (
              paginatedDatos.map(d => (
                <tr key={d.rebanoId}>
                  {isColVisible('rebanoNombre') && (
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{d.rebanoNombre}</td>
                  )}
                  {isColVisible('vientresTotales') && <td>{d.vientresTotales}</td>}
                  {isColVisible('prenadas') && (
                    <td style={{ fontWeight: 600, color: '#15803d' }}>{d.prenadas}</td>
                  )}
                  {isColVisible('vacias') && (
                    <td style={{ color: '#dc2626' }}>{d.vacias}</td>
                  )}
                  {isColVisible('enEspera') && (
                    <td style={{ color: '#d97706' }}>{d.enEspera}</td>
                  )}
                  {isColVisible('porcentajePrenez') && (
                    <td>
                      <span className={`badge-efficiency ${d.porcentajePrenez >= 65 ? 'high' : 'medium'}`}>
                        {d.porcentajePrenez}%
                      </span>
                    </td>
                  )}
                  {isColVisible('diasAbiertosPromedio') && (
                    <td>{d.diasAbiertosPromedio} días</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#f8fafc', fontWeight: 800, borderTop: '2px solid var(--border-color)' }}>
              {isColVisible('rebanoNombre') && <td>TOTAL GENERAL CONSOLIDADO</td>}
              {isColVisible('vientresTotales') && <td>{totals.vientres}</td>}
              {isColVisible('prenadas') && <td style={{ color: '#15803d' }}>{totals.prenadas}</td>}
              {isColVisible('vacias') && <td style={{ color: '#dc2626' }}>{totals.vacias}</td>}
              {isColVisible('enEspera') && <td>{totals.enEspera}</td>}
              {isColVisible('porcentajePrenez') && (
                <td>
                  <span className="badge-efficiency high" style={{ fontSize: 13 }}>
                    {totals.pctGlobal}%
                  </span>
                </td>
              )}
              {isColVisible('diasAbiertosPromedio') && <td>{totals.diasProm} días</td>}
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
