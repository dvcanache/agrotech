import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { NuevoMovimientoModal } from './NuevoMovimientoModal';
import { DetalleMovimientoModal } from './DetalleMovimientoModal';
import { MovimientosFilterDrawer, MovimientosFilterValues } from './MovimientosFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_MOVIMIENTOS } from '../gestionMockData';
import { MovimientoEntity } from '../../../../types2/entities';

export const MovimientosView: React.FC = () => {
  // Lista de movimientos (iniciada con mock data, permite agregar)
  const [movimientos, setMovimientos] = useState<MovimientoEntity[]>(MOCK_MOVIMIENTOS);

  // Estados de interfaz
  const [isNuevoModalOpen, setIsNuevoModalOpen] = useState(false);
  const [selectedMovimiento, setSelectedMovimiento] = useState<MovimientoEntity | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Búsqueda y Paginación
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof MovimientoEntity>('fecha');
  const [sortAsc, setSortAsc] = useState(false);

  // Columnas configurables
  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'fecha', label: 'Fecha', visible: true },
    { key: 'tipo', label: 'Tipo', visible: true },
    { key: 'practico', label: 'Práctico', visible: true },
    { key: 'unico', label: 'Único', visible: true },
    { key: 'rebanoOrigen', label: 'Rebaño Origen', visible: true },
    { key: 'categoriaOrigen', label: 'Categoría Origen', visible: true },
    { key: 'rebanoDestino', label: 'Rebaño Destino', visible: true },
    { key: 'categoriaDestino', label: 'Categoría Destino', visible: true },
    { key: 'tecnico', label: 'Técnico', visible: true },
    { key: 'estatusActual', label: 'Estatus Actual', visible: true },
    { key: 'categoriaActual', label: 'Categoría Actual', visible: true },
    { key: 'loteActual', label: 'Lote Actual', visible: true },
    { key: 'comentario', label: 'Comentario', visible: true }
  ]);

  // Filtros aplicados
  const [filters, setFilters] = useState<MovimientosFilterValues>({
    desde: '',
    hasta: '',
    tipos: [],
    lotes: [],
    tecnico: ''
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.desde || filters.hasta) count++;
    if (filters.tipos.length > 0) count++;
    if (filters.lotes.length > 0) count++;
    if (filters.tecnico) count++;
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

  const handleSort = (field: keyof MovimientoEntity) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filtrado y ordenamiento de movimientos
  const filteredMovimientos = useMemo(() => {
    return movimientos
      .filter(item => {
        // Búsqueda de texto
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCode = item.practico.toLowerCase().includes(q) || item.unico.toLowerCase().includes(q);
          const matchType = item.tipo.toLowerCase().includes(q);
          const matchTech = item.tecnico.toLowerCase().includes(q);
          const matchLot = item.loteActual.toLowerCase().includes(q);
          if (!matchCode && !matchType && !matchTech && !matchLot) return false;
        }

        // Filtro de fechas
        if (filters.desde && item.fecha < filters.desde) return false;
        if (filters.hasta && item.fecha > filters.hasta) return false;

        // Filtro de tipos
        if (filters.tipos.length > 0 && !filters.tipos.includes(item.tipo)) return false;

        // Filtro de lotes
        if (filters.lotes.length > 0 && !filters.lotes.includes(item.loteActual)) return false;

        // Filtro de técnico
        if (filters.tecnico && item.tecnico !== filters.tecnico) return false;

        return true;
      })
      .sort((a, b) => {
        const valA = String(a[sortField] || '');
        const valB = String(b[sortField] || '');
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
  }, [movimientos, searchQuery, filters, sortField, sortAsc]);

  // Paginación
  const totalPages = Math.ceil(filteredMovimientos.length / pageSize) || 1;
  const paginatedMovimientos = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMovimientos.slice(start, start + pageSize);
  }, [filteredMovimientos, currentPage, pageSize]);

  // Exportar XLSX
  const handleExportXLSX = () => {
    const headers = [
      'Fecha',
      'Tipo',
      'Práctico',
      'Único',
      'Rebaño Origen',
      'Categoría Origen',
      'Rebaño Destino',
      'Categoría Destino',
      'Técnico',
      'Estatus Actual',
      'Categoría Actual',
      'Lote Actual',
      'Comentario'
    ];
    const rows = filteredMovimientos.map(m => [
      m.fecha,
      m.tipo,
      m.practico,
      m.unico,
      m.rebanoOrigen,
      m.categoriaOrigen,
      m.rebanoDestino,
      m.categoriaDestino,
      m.tecnico,
      m.estatusActual,
      m.categoriaActual,
      m.loteActual,
      m.comentario || ''
    ]);
    exportToCSV('reporte_movimientos', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  const handleAddNewMovimiento = (nuevo: MovimientoEntity) => {
    setMovimientos(prev => [nuevo, ...prev]);
  };

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Movimientos"
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
              placeholder="Buscar animales o movimientos..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        }
        primaryAction={{
          label: 'Nuevo Movimiento',
          onClick: () => setIsNuevoModalOpen(true),
          icon: <Plus size={16} />
        }}
      />

      {/* Tabla de Movimientos */}
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
              {isColVisible('tipo') && (
                <th onClick={() => handleSort('tipo')}>
                  <div className="th-content">
                    <span>Tipo</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
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
              {isColVisible('rebanoOrigen') && (
                <th>
                  <div className="th-content">
                    <span>Rebaño Origen</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('categoriaOrigen') && (
                <th>
                  <div className="th-content">
                    <span>Categoría Origen</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('rebanoDestino') && (
                <th>
                  <div className="th-content">
                    <span>Rebaño Destino</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('categoriaDestino') && (
                <th>
                  <div className="th-content">
                    <span>Categoría Destino</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('tecnico') && (
                <th>
                  <div className="th-content">
                    <span>Técnico</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('estatusActual') && (
                <th>
                  <div className="th-content">
                    <span>Estatus Actual</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('categoriaActual') && (
                <th>
                  <div className="th-content">
                    <span>Categoría Actual</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('loteActual') && (
                <th>
                  <div className="th-content">
                    <span>Lote Actual</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('comentario') && <th>Comentario</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedMovimientos.length === 0 ? (
              <tr>
                <td colSpan={13} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
                  Ningún registro de movimiento encontrado
                </td>
              </tr>
            ) : (
              paginatedMovimientos.map((m, idx) => (
                <tr
                  key={`${m.practico}-${m.fecha}-${idx}`}
                  onClick={() => setSelectedMovimiento(m)}
                  title="Haga click para ver detalles del movimiento"
                >
                  {isColVisible('fecha') && <td>{m.fecha}</td>}
                  {isColVisible('tipo') && (
                    <td>
                      <span className="badge-category" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                        {m.tipo}
                      </span>
                    </td>
                  )}
                  {isColVisible('practico') && <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.practico}</td>}
                  {isColVisible('unico') && <td>{m.unico}</td>}
                  {isColVisible('rebanoOrigen') && <td>{m.rebanoOrigen}</td>}
                  {isColVisible('categoriaOrigen') && <td>{m.categoriaOrigen}</td>}
                  {isColVisible('rebanoDestino') && <td>{m.rebanoDestino}</td>}
                  {isColVisible('categoriaDestino') && <td>{m.categoriaDestino}</td>}
                  {isColVisible('tecnico') && <td>{m.tecnico}</td>}
                  {isColVisible('estatusActual') && (
                    <td>
                      <span className={`badge-status ${m.estatusActual.toLowerCase()}`}>
                        {m.estatusActual}
                      </span>
                    </td>
                  )}
                  {isColVisible('categoriaActual') && <td>{m.categoriaActual}</td>}
                  {isColVisible('loteActual') && (
                    <td>
                      <span style={{ fontWeight: 600, color: '#166534' }}>{m.loteActual}</span>
                    </td>
                  )}
                  {isColVisible('comentario') && (
                    <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.comentario || '-'}
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
        totalRecords={filteredMovimientos.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Modal Nuevo Movimiento */}
      <NuevoMovimientoModal
        isOpen={isNuevoModalOpen}
        onClose={() => setIsNuevoModalOpen(false)}
        onSave={handleAddNewMovimiento}
      />

      {/* Modal Detalle Movimiento */}
      <DetalleMovimientoModal
        isOpen={!!selectedMovimiento}
        onClose={() => setSelectedMovimiento(null)}
        movimiento={selectedMovimiento}
      />

      {/* Drawer de Filtros */}
      <MovimientosFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() =>
          setFilters({
            desde: '',
            hasta: '',
            tipos: [],
            lotes: [],
            tecnico: ''
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
