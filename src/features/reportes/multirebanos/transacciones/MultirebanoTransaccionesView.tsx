import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Layers, ArrowUpDown, Truck } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { SeleccionarRebanosModal } from '../components/SeleccionarRebanosModal';
import { MultirebanoFilterDrawer, MultirebanoFilterValues } from '../components/MultirebanoFilterDrawer';
import { GuiaMovilizacionModal } from '../../components/GuiaMovilizacionModal';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_MULTIREBANO_TRANSACCIONES, MOCK_REBANOS_CATALOGO } from '../multirebanosMockData';
import { MultirebanoTransaccionEntity } from '../../../../types2/entities';

export const MultirebanoTransaccionesView: React.FC = () => {
  const [transacciones, setTransacciones] = useState<MultirebanoTransaccionEntity[]>(MOCK_MULTIREBANO_TRANSACCIONES);

  const [isHerdModalOpen, setIsHerdModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isGuiaModalOpen, setIsGuiaModalOpen] = useState(false);

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
  const [sortField, setSortField] = useState<keyof MultirebanoTransaccionEntity>('fecha');
  const [sortAsc, setSortAsc] = useState(false);

  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'id', label: 'Código', visible: true },
    { key: 'fecha', label: 'Fecha', visible: true },
    { key: 'tipoTransaccion', label: 'Tipo Transacción', visible: true },
    { key: 'rebanoOrigen', label: 'Origen', visible: true },
    { key: 'rebanoDestino', label: 'Destino', visible: true },
    { key: 'cantidadAnimales', label: 'Cantidad Animales', visible: true },
    { key: 'montoTotal', label: 'Monto Total ($)', visible: true },
    { key: 'responsable', label: 'Responsable', visible: true }
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

  const handleSort = (field: keyof MultirebanoTransaccionEntity) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredTransacciones = useMemo(() => {
    const selectedHerdNames = new Set(
      MOCK_REBANOS_CATALOGO.filter(r => selectedHerds.includes(r.id)).map(r => r.nombre)
    );

    return transacciones
      .filter(item => {
        if (selectedHerds.length > 0) {
          const matchOriginId = item.rebanoOrigenId ? selectedHerds.includes(item.rebanoOrigenId) : false;
          const matchOriginName = item.rebanoOrigen
            ? selectedHerds.includes(item.rebanoOrigen) || selectedHerdNames.has(item.rebanoOrigen)
            : false;
          if (!matchOriginId && !matchOriginName) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchId = item.id.toLowerCase().includes(q);
          const matchOri = (item.rebanoOrigen || '').toLowerCase().includes(q);
          const matchDes = (item.rebanoDestino || '').toLowerCase().includes(q);
          const matchResp = item.responsable.toLowerCase().includes(q);
          if (!matchId && !matchOri && !matchDes && !matchResp) return false;
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
  }, [transacciones, selectedHerds, searchQuery, filters, sortField, sortAsc]);

  const totals = useMemo(() => {
    const totalCount = filteredTransacciones.length;
    const totalAnimales = filteredTransacciones.reduce((acc, t) => acc + t.cantidadAnimales, 0);
    const traslados = filteredTransacciones.filter(t => t.tipoTransaccion === 'Traslado').length;
    const totalMonto = filteredTransacciones.reduce((acc, t) => acc + (t.montoTotal || 0), 0);

    return { totalCount, totalAnimales, traslados, totalMonto };
  }, [filteredTransacciones]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, selectedHerds]);

  const totalPages = Math.ceil(filteredTransacciones.length / pageSize) || 1;
  const paginatedTransacciones = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredTransacciones.slice(start, start + pageSize);
  }, [filteredTransacciones, currentPage, totalPages, pageSize]);

  const handleExportXLSX = () => {
    const headers = [
      'Código',
      'Fecha',
      'Tipo de Transacción',
      'Origen',
      'Destino',
      'Cantidad Animales',
      'Monto Total ($)',
      'Responsable'
    ];
    const rows = filteredTransacciones.map(t => [
      t.id,
      t.fecha,
      t.tipoTransaccion,
      t.rebanoOrigen || '',
      t.rebanoDestino || '',
      t.cantidadAnimales,
      t.montoTotal ? `$${t.montoTotal.toLocaleString()}` : '',
      t.responsable
    ]);
    exportToCSV('reporte_multirebano_transacciones', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  const getTipoBadgeStyle = (tipo: string) => {
    switch (tipo) {
      case 'Traslado':
        return { bg: '#eff6ff', color: '#1d4ed8' };
      case 'Compra':
        return { bg: '#f0fdf4', color: '#15803d' };
      case 'Venta':
        return { bg: '#fefce8', color: '#854d0e' };
      case 'Descarte':
        return { bg: '#fef2f2', color: '#b91c1c' };
      default:
        return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Transacciones"
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
              className="btn-primary"
              onClick={() => setIsGuiaModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 600,
                fontSize: 13,
                padding: '7px 14px'
              }}
              title="Emitir Guía Oficial de Movilización Pecuaria entre Rebaños"
            >
              <Truck size={15} />
              <span>+ Guía de Movilización</span>
            </button>
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
                placeholder="Buscar transacción..."
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
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Total Transacciones</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
            {totals.totalCount}
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>Semovientes Movilizados</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>
            {totals.totalAnimales}
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>Traslados Internos</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>
            {totals.traslados}
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#d97706', fontWeight: 600 }}>Monto Operaciones ($)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706', marginTop: 4 }}>
            ${totals.totalMonto.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="report-table-wrapper">
        <table className="report-grid-table">
          <thead>
            <tr>
              {isColVisible('id') && <th>Código</th>}
              {isColVisible('fecha') && (
                <th onClick={() => handleSort('fecha')}>
                  <div className="th-content">
                    <span>Fecha</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('tipoTransaccion') && (
                <th onClick={() => handleSort('tipoTransaccion')}>
                  <div className="th-content">
                    <span>Tipo Transacción</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('rebanoOrigen') && <th>Origen</th>}
              {isColVisible('rebanoDestino') && <th>Destino</th>}
              {isColVisible('cantidadAnimales') && (
                <th onClick={() => handleSort('cantidadAnimales')}>
                  <div className="th-content">
                    <span>Cantidad</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('montoTotal') && <th>Monto Total</th>}
              {isColVisible('responsable') && <th>Responsable</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedTransacciones.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
                  Ninguna transacción registrada encontrada
                </td>
              </tr>
            ) : (
              paginatedTransacciones.map(t => {
                const badge = getTipoBadgeStyle(t.tipoTransaccion);
                return (
                  <tr key={t.id}>
                    {isColVisible('id') && (
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.id}</td>
                    )}
                    {isColVisible('fecha') && <td>{t.fecha}</td>}
                    {isColVisible('tipoTransaccion') && (
                      <td>
                        <span
                          className="badge-category"
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.color,
                            fontWeight: 700
                          }}
                        >
                          {t.tipoTransaccion}
                        </span>
                      </td>
                    )}
                    {isColVisible('rebanoOrigen') && (
                      <td style={{ fontWeight: 500 }}>{t.rebanoOrigen || '-'}</td>
                    )}
                    {isColVisible('rebanoDestino') && (
                      <td style={{ fontWeight: 500, color: '#166534' }}>{t.rebanoDestino || '-'}</td>
                    )}
                    {isColVisible('cantidadAnimales') && (
                      <td>
                        <span className="badge-efficiency high">{t.cantidadAnimales} anim.</span>
                      </td>
                    )}
                    {isColVisible('montoTotal') && (
                      <td style={{ fontWeight: 600 }}>
                        {t.montoTotal ? `$${t.montoTotal.toLocaleString()}` : '-'}
                      </td>
                    )}
                    {isColVisible('responsable') && <td>{t.responsable}</td>}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <ReportPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={filteredTransacciones.length}
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

      {/* Modal Guía de Movilización Pecuaria */}
      <GuiaMovilizacionModal
        isOpen={isGuiaModalOpen}
        onClose={() => setIsGuiaModalOpen(false)}
        onSuccess={newGuia => {
          setTransacciones(prev => [newGuia, ...prev]);
        }}
      />
    </div>
  );
};
