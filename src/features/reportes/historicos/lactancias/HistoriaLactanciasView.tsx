import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { FichaHistoricoModal, HistoricoModalData } from '../components/FichaHistoricoModal';
import { LactanciasFilterDrawer, LactanciasFilterValues } from '../components/LactanciasFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_HISTORIA_LACTANCIAS } from '../historicosMockData';
import { LactanciaHistoricoEntity } from '../../../../types2/entities';
import { EstatusAnimal } from '../../../../types2/common';

export const HistoriaLactanciasView: React.FC = () => {
  const [lactancias] = useState<LactanciaHistoricoEntity[]>(MOCK_HISTORIA_LACTANCIAS);

  const [selectedRecord, setSelectedRecord] = useState<HistoricoModalData | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof LactanciaHistoricoEntity>('produccionTotalKg');
  const [sortAsc, setSortAsc] = useState(false);

  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'practico', label: 'Práctico', visible: true },
    { key: 'unico', label: 'Único', visible: true },
    { key: 'categoria', label: 'Categoría', visible: true },
    { key: 'estatus', label: 'Estatus', visible: true },
    { key: 'loteActual', label: 'Lote', visible: true },
    { key: 'fecha', label: 'Fecha Inicio', visible: true },
    { key: 'lactanciaNumero', label: 'No. Lactancia', visible: true },
    { key: 'diasLactancia', label: 'Días Lactancia', visible: true },
    { key: 'p244Kg', label: 'P-244 (kg)', visible: true },
    { key: 'p270Kg', label: 'P-270 (kg)', visible: true },
    { key: 'p305Kg', label: 'P-305 (kg)', visible: true },
    { key: 'produccionTotalKg', label: 'Producción Total (kg)', visible: true },
    { key: 'rebano', label: 'Rebaño', visible: false }
  ]);

  const [filters, setFilters] = useState<LactanciasFilterValues>({
    lactanciaMin: undefined,
    lactanciaMax: undefined,
    desde: undefined,
    hasta: undefined,
    categorias: ['Vaca', 'Novilla'],
    estatus: ['Activo'] as EstatusAnimal[],
    lotes: ['01', 'ESCT', 'POT1', 'SEC1']
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.lactanciaMin || filters.lactanciaMax) count++;
    if (filters.desde || filters.hasta) count++;
    if (filters.categorias.length < 2) count++;
    if (filters.estatus.length < 3) count++;
    if (filters.lotes.length < 4) count++;
    return count;
  }, [filters]);

  const toggleColumn = (key: string) => {
    setColumns(prev =>
      prev.map(col => (col.key === key ? { ...col, visible: !col.visible } : col))
    );
  };

  const resetColumns = () => {
    setColumns(prev => prev.map(col => ({ ...col, visible: true })));
  };

  const handleSort = (field: keyof LactanciaHistoricoEntity) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredLactancias = useMemo(() => {
    return lactancias
      .filter(item => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCode = item.practico.toLowerCase().includes(q) || item.unico.toLowerCase().includes(q);
          const matchLot = item.loteActual.toLowerCase().includes(q);
          if (!matchCode && !matchLot) return false;
        }

        if (filters.lactanciaMin !== undefined && item.lactanciaNumero < filters.lactanciaMin) return false;
        if (filters.lactanciaMax !== undefined && item.lactanciaNumero > filters.lactanciaMax) return false;
        if (filters.desde && item.fecha < filters.desde) return false;
        if (filters.hasta && item.fecha > filters.hasta) return false;
        if (!filters.categorias.includes(item.categoria)) return false;
        if (!filters.estatus.includes(item.estatus)) return false;
        if (!filters.lotes.includes(item.loteActual)) return false;

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
  }, [lactancias, searchQuery, filters, sortField, sortAsc]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const totalPages = Math.ceil(filteredLactancias.length / pageSize) || 1;
  const paginatedLactancias = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredLactancias.slice(start, start + pageSize);
  }, [filteredLactancias, currentPage, totalPages, pageSize]);

  // KPIs
  const kpiStats = useMemo(() => {
    const count = filteredLactancias.length;
    if (count === 0) return { count: 0, avgDias: 0, avgP305: 0, totalKg: 0 };

    const sumDias = filteredLactancias.reduce((acc, l) => acc + l.diasLactancia, 0);
    const sumP305 = filteredLactancias.reduce((acc, l) => acc + l.p305Kg, 0);
    const totalKg = filteredLactancias.reduce((acc, l) => acc + l.produccionTotalKg, 0);

    return {
      count,
      avgDias: Math.round(sumDias / count),
      avgP305: Math.round(sumP305 / count),
      totalKg
    };
  }, [filteredLactancias]);

  const handleExportXLSX = () => {
    const headers = [
      'Práctico',
      'Único',
      'Categoría',
      'Estatus',
      'Lote Actual',
      'Fecha Inicio',
      'No. Lactancia',
      'Días Lactancia',
      'P-244 (kg)',
      'P-270 (kg)',
      'P-305 (kg)',
      'Producción Total (kg)',
      'Rebaño'
    ];
    const rows = filteredLactancias.map(l => [
      l.practico,
      l.unico,
      l.categoria,
      l.estatus,
      l.loteActual,
      l.fecha,
      l.lactanciaNumero,
      l.diasLactancia,
      l.p244Kg,
      l.p270Kg,
      l.p305Kg,
      l.produccionTotalKg,
      l.rebano
    ]);
    exportToCSV('reporte_historia_lactancias', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Historia de lactancias"
        backRoute="/reportes"
        onFilterToggle={() => setIsFilterDrawerOpen(prev => !prev)}
        isFilterOpen={isFilterDrawerOpen}
        activeFiltersCount={activeFiltersCount}
        onExportXLSX={handleExportXLSX}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
        extraActions={
          <div className="report-search-bar">
            <Search className="report-search-icon" size={16} />
            <input
              type="text"
              className="report-search-input"
              placeholder="Buscar vaca o lote..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
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
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Total Lactancias</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>{kpiStats.count}</div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>Promedio Días Lactancia</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>{kpiStats.avgDias} d</div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#d97706', fontWeight: 600 }}>Promedio P-305 (305 Días)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706', marginTop: 4 }}>{kpiStats.avgP305} kg</div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>Producción Total Acumulada</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>
            {kpiStats.totalKg.toLocaleString()} kg
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="report-table-wrapper">
        <table className="report-grid-table">
          <thead>
            <tr>
              {isColVisible('practico') && (
                <th onClick={() => handleSort('practico')}>
                  <div className="th-content">
                    <span>Práctico</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('unico') && (
                <th onClick={() => handleSort('unico')}>
                  <div className="th-content">
                    <span>Único</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('categoria') && (
                <th onClick={() => handleSort('categoria')}>
                  <div className="th-content">
                    <span>Categoría</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('estatus') && (
                <th onClick={() => handleSort('estatus')}>
                  <div className="th-content">
                    <span>Estatus</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('loteActual') && (
                <th onClick={() => handleSort('loteActual')}>
                  <div className="th-content">
                    <span>Lote</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('fecha') && (
                <th onClick={() => handleSort('fecha')}>
                  <div className="th-content">
                    <span>Fecha Inicio</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('lactanciaNumero') && <th>No. Lactancia</th>}
              {isColVisible('diasLactancia') && (
                <th onClick={() => handleSort('diasLactancia')}>
                  <div className="th-content">
                    <span>Días Lactancia</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('p244Kg') && <th>P-244 (kg)</th>}
              {isColVisible('p270Kg') && <th>P-270 (kg)</th>}
              {isColVisible('p305Kg') && (
                <th onClick={() => handleSort('p305Kg')}>
                  <div className="th-content">
                    <span>P-305 (kg)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('produccionTotalKg') && (
                <th onClick={() => handleSort('produccionTotalKg')}>
                  <div className="th-content">
                    <span>Producción Total (kg)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('rebano') && <th>Rebaño</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedLactancias.length === 0 ? (
              <tr>
                <td colSpan={13} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
                  Ninguna lactancia encontrada
                </td>
              </tr>
            ) : (
              paginatedLactancias.map(l => (
                <tr
                  key={`${l.practico}-${l.lactanciaNumero}`}
                  onClick={() =>
                    setSelectedRecord({
                      tipo: 'lactancia',
                      titulo: `Lactancia #${l.lactanciaNumero}`,
                      practico: l.practico,
                      unico: l.unico,
                      categoria: l.categoria,
                      estatus: l.estatus,
                      lote: l.loteActual,
                      fecha: l.fecha,
                      detalles: [
                        { label: 'Número de Lactancia', value: `#${l.lactanciaNumero}` },
                        { label: 'Días en Lactancia', value: `${l.diasLactancia} días` },
                        { label: 'Producción P-244', value: `${l.p244Kg.toLocaleString()} kg` },
                        { label: 'Producción P-270', value: `${l.p270Kg.toLocaleString()} kg` },
                        { label: 'Producción P-305', value: `${l.p305Kg.toLocaleString()} kg` },
                        { label: 'Producción Total', value: `${l.produccionTotalKg.toLocaleString()} kg` },
                        { label: 'Rebaño', value: l.rebano }
                      ]
                    })
                  }
                  title="Haga click para ver la ficha de la curva de lactancia"
                >
                  {isColVisible('practico') && (
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{l.practico}</td>
                  )}
                  {isColVisible('unico') && <td>{l.unico}</td>}
                  {isColVisible('categoria') && <td>{l.categoria}</td>}
                  {isColVisible('estatus') && (
                    <td>
                      <span className={`badge-status ${l.estatus.toLowerCase()}`}>
                        {l.estatus}
                      </span>
                    </td>
                  )}
                  {isColVisible('loteActual') && (
                    <td>
                      <span style={{ fontWeight: 600, color: '#166534' }}>{l.loteActual}</span>
                    </td>
                  )}
                  {isColVisible('fecha') && <td>{l.fecha}</td>}
                  {isColVisible('lactanciaNumero') && (
                    <td>
                      <span className="badge-category" style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>
                        Lact. {l.lactanciaNumero}
                      </span>
                    </td>
                  )}
                  {isColVisible('diasLactancia') && <td>{l.diasLactancia} días</td>}
                  {isColVisible('p244Kg') && <td>{l.p244Kg.toLocaleString()} kg</td>}
                  {isColVisible('p270Kg') && <td>{l.p270Kg.toLocaleString()} kg</td>}
                  {isColVisible('p305Kg') && (
                    <td style={{ fontWeight: 600, color: '#2563eb' }}>{l.p305Kg.toLocaleString()} kg</td>
                  )}
                  {isColVisible('produccionTotalKg') && (
                    <td style={{ fontWeight: 700, color: '#15803d' }}>
                      {l.produccionTotalKg.toLocaleString()} kg
                    </td>
                  )}
                  {isColVisible('rebano') && <td>{l.rebano}</td>}
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
        totalRecords={filteredLactancias.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Modal Ficha Histórico */}
      <FichaHistoricoModal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        data={selectedRecord}
      />

      {/* Drawer Filtros */}
      <LactanciasFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() =>
          setFilters({
            lactanciaMin: undefined,
            lactanciaMax: undefined,
            desde: undefined,
            hasta: undefined,
            categorias: ['Vaca', 'Novilla'],
            estatus: ['Activo'] as EstatusAnimal[],
            lotes: ['01', 'ESCT', 'POT1', 'SEC1']
          })
        }
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
