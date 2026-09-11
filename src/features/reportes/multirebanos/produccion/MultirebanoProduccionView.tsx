import React, { useState, useMemo } from 'react';
import { Search, Filter, Layers, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { SeleccionarRebanosModal } from '../components/SeleccionarRebanosModal';
import { MultirebanoFilterDrawer, MultirebanoFilterValues } from '../components/MultirebanoFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_MULTIREBANO_PRODUCCION } from '../multirebanosMockData';
import { MultirebanoSituacionProductivaEntity } from '../../../../types2/entities';

export const MultirebanoProduccionView: React.FC = () => {
  const [datos] = useState<MultirebanoSituacionProductivaEntity[]>(MOCK_MULTIREBANO_PRODUCCION);

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
  const [sortField, setSortField] = useState<keyof MultirebanoSituacionProductivaEntity>('porcentajeOrdeno');
  const [sortAsc, setSortAsc] = useState(false);

  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'rebanoNombre', label: 'Rebaño', visible: true },
    { key: 'enOrdeno', label: 'En Ordeño', visible: true },
    { key: 'secas', label: 'Secas', visible: true },
    { key: 'criando', label: 'Criando', visible: true },
    { key: 'porcentajeOrdeno', label: '% Ordeño', visible: true },
    { key: 'litrosPromedioVacaDia', label: 'Promedio Litros/Vaca/Día', visible: true },
    { key: 'totalEstimado', label: 'Producción Diaria Estimada (L)', visible: true }
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

  const handleSort = (field: keyof MultirebanoSituacionProductivaEntity) => {
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
      (acc, curr) => {
        const produccionRebano = curr.enOrdeno * curr.litrosPromedioVacaDia;
        return {
          enOrdeno: acc.enOrdeno + curr.enOrdeno,
          secas: acc.secas + curr.secas,
          criando: acc.criando + curr.criando,
          totalLitros: acc.totalLitros + produccionRebano
        };
      },
      { enOrdeno: 0, secas: 0, criando: 0, totalLitros: 0 }
    );

    const totalVacas = sum.enOrdeno + sum.secas;
    const pctGlobal = totalVacas > 0 ? (sum.enOrdeno / totalVacas) * 100 : 0;
    const promedioLitrosGlobal = sum.enOrdeno > 0 ? sum.totalLitros / sum.enOrdeno : 0;

    return {
      enOrdeno: sum.enOrdeno,
      secas: sum.secas,
      criando: sum.criando,
      totalLitros: Math.round(sum.totalLitros),
      pctGlobal: Number(pctGlobal.toFixed(2)),
      promedioLitrosGlobal: Number(promedioLitrosGlobal.toFixed(1))
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
      'En Ordeño',
      'Secas',
      'Criando',
      '% Ordeño',
      'Promedio Litros/Vaca/Día',
      'Producción Diaria Estimada (L)'
    ];
    const rows = filteredDatos.map(d => [
      d.rebanoNombre,
      d.enOrdeno,
      d.secas,
      d.criando,
      `${d.porcentajeOrdeno}%`,
      d.litrosPromedioVacaDia,
      Math.round(d.enOrdeno * d.litrosPromedioVacaDia)
    ]);
    exportToCSV('reporte_multirebano_situacion_productiva', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Situación productiva actual"
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
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Vacas en Ordeño Consolidadas</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
            {totals.enOrdeno}
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>% Ordeño Consolidado</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>
            {totals.pctGlobal}%
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>Promedio Litros / Vaca / Día</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>
            {totals.promedioLitrosGlobal} L/d
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#d97706', fontWeight: 600 }}>Producción Total Diaria Estimada</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706', marginTop: 4 }}>
            {totals.totalLitros.toLocaleString()} L
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
              {isColVisible('enOrdeno') && (
                <th onClick={() => handleSort('enOrdeno')}>
                  <div className="th-content">
                    <span>En Ordeño</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('secas') && <th>Secas</th>}
              {isColVisible('criando') && <th>Criando</th>}
              {isColVisible('porcentajeOrdeno') && (
                <th onClick={() => handleSort('porcentajeOrdeno')}>
                  <div className="th-content">
                    <span>% Ordeño</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('litrosPromedioVacaDia') && (
                <th onClick={() => handleSort('litrosPromedioVacaDia')}>
                  <div className="th-content">
                    <span>Promedio L/Vaca/Día</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('totalEstimado') && <th>Producción Diaria Estimada</th>}
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
              paginatedDatos.map(d => {
                const totalRebano = Math.round(d.enOrdeno * d.litrosPromedioVacaDia);
                return (
                  <tr key={d.rebanoId}>
                    {isColVisible('rebanoNombre') && (
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{d.rebanoNombre}</td>
                    )}
                    {isColVisible('enOrdeno') && (
                      <td style={{ fontWeight: 600, color: '#166534' }}>{d.enOrdeno}</td>
                    )}
                    {isColVisible('secas') && <td>{d.secas}</td>}
                    {isColVisible('criando') && <td>{d.criando}</td>}
                    {isColVisible('porcentajeOrdeno') && (
                      <td>
                        <span className={`badge-efficiency ${d.porcentajeOrdeno >= 72 ? 'high' : 'medium'}`}>
                          {d.porcentajeOrdeno}%
                        </span>
                      </td>
                    )}
                    {isColVisible('litrosPromedioVacaDia') && (
                      <td style={{ fontWeight: 600 }}>{d.litrosPromedioVacaDia} L</td>
                    )}
                    {isColVisible('totalEstimado') && (
                      <td style={{ fontWeight: 700, color: '#1d4ed8' }}>
                        {totalRebano.toLocaleString()} L/día
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#f8fafc', fontWeight: 800, borderTop: '2px solid var(--border-color)' }}>
              {isColVisible('rebanoNombre') && <td>TOTAL GENERAL CONSOLIDADO</td>}
              {isColVisible('enOrdeno') && <td style={{ color: '#166534' }}>{totals.enOrdeno}</td>}
              {isColVisible('secas') && <td>{totals.secas}</td>}
              {isColVisible('criando') && <td>{totals.criando}</td>}
              {isColVisible('porcentajeOrdeno') && (
                <td>
                  <span className="badge-efficiency high" style={{ fontSize: 13 }}>
                    {totals.pctGlobal}%
                  </span>
                </td>
              )}
              {isColVisible('litrosPromedioVacaDia') && <td>{totals.promedioLitrosGlobal} L</td>}
              {isColVisible('totalEstimado') && (
                <td style={{ color: '#1d4ed8' }}>{totals.totalLitros.toLocaleString()} L/día</td>
              )}
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
