import React, { useState, useMemo, useEffect } from 'react';
import { Search, UserPlus, Filter, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { FichaTecnicoModal } from './FichaTecnicoModal';
import { NuevoTecnicoModal } from './NuevoTecnicoModal';
import { TecnicosFilterDrawer, TecnicosFilterValues } from './TecnicosFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_TECNICOS } from '../gestionMockData';
import { TecnicoEntity } from '../../../../types2/entities';

export const TecnicosView: React.FC = () => {
  // Lista de técnicos
  const [tecnicos, setTecnicos] = useState<TecnicoEntity[]>(MOCK_TECNICOS);

  // Estados de modales y drawers
  const [selectedTecnico, setSelectedTecnico] = useState<TecnicoEntity | null>(null);
  const [isNuevoModalOpen, setIsNuevoModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Búsqueda y Paginación
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof TecnicoEntity>('eficienciaPorcentaje');
  const [sortAsc, setSortAsc] = useState(false);

  // Columnas configurables
  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'codigo', label: 'Código', visible: true },
    { key: 'nombre', label: 'Nombre', visible: true },
    { key: 'estatus', label: 'Estatus', visible: true },
    { key: 'positivos', label: 'Positivos', visible: true },
    { key: 'negativos', label: 'Negativos', visible: true },
    { key: 'enEspera', label: 'En Espera', visible: true },
    { key: 'totalServicios', label: 'Total servicios', visible: true },
    { key: 'primerServicio', label: 'Primer Servicio', visible: true },
    { key: 'segundoServicio', label: 'Segundo Servicio', visible: true },
    { key: 'tercerServicio', label: 'Tercer Servicio', visible: true },
    { key: 'cuatroOMasServicios', label: '4 o más Servicios', visible: true },
    { key: 'partos', label: 'Partos', visible: true },
    { key: 'abortos', label: 'Abortos', visible: true },
    { key: 'aunPrenadas', label: 'Aún Preñadas', visible: true },
    { key: 'eficienciaPorcentaje', label: 'Eficiencia', visible: true },
    { key: 'serviciosPorConcepcion', label: 'Servicios por Concepción', visible: true },
    { key: 'machosNacidos', label: 'Machos nacidos', visible: true },
    { key: 'hembrasNacidas', label: 'Hembras nacidas', visible: true },
    { key: 'embrionesColocados', label: 'Embriones colocados', visible: true }
  ]);

  // Filtros aplicados
  const [filters, setFilters] = useState<TecnicosFilterValues>({
    desde: '',
    hasta: '',
    estatus: ['Activo'],
    minEficiencia: 0
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.desde || filters.hasta) count++;
    if (filters.estatus.length < 2) count++;
    if (filters.minEficiencia > 0) count++;
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

  const handleSort = (field: keyof TecnicoEntity) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filtrado y ordenamiento de técnicos
  const filteredTecnicos = useMemo(() => {
    return tecnicos
      .filter(t => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCode = t.codigo.toLowerCase().includes(q);
          const matchName = t.nombre.toLowerCase().includes(q);
          if (!matchCode && !matchName) return false;
        }

        if (filters.estatus.length > 0 && !filters.estatus.includes(t.estatus)) return false;
        if (t.eficienciaPorcentaje < filters.minEficiencia) return false;

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
  }, [tecnicos, searchQuery, filters, sortField, sortAsc]);

  // Reset page to 1 when filters or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  // Paginación
  const totalPages = Math.ceil(filteredTecnicos.length / pageSize) || 1;
  const paginatedTecnicos = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredTecnicos.slice(start, start + pageSize);
  }, [filteredTecnicos, currentPage, totalPages, pageSize]);

  // Exportar XLSX
  const handleExportXLSX = () => {
    const headers = [
      'Código',
      'Nombre',
      'Estatus',
      'Positivos',
      'Negativos',
      'En Espera',
      'Total servicios',
      'Primer Servicio',
      'Segundo Servicio',
      'Tercer Servicio',
      '4 o más Servicios',
      'Partos',
      'Abortos',
      'Aún Preñadas',
      'Eficiencia %',
      'Servicios por Concepción',
      'Machos nacidos',
      'Hembras nacidas',
      'Embriones colocados'
    ];
    const rows = filteredTecnicos.map(t => [
      t.codigo,
      t.nombre,
      t.estatus,
      t.positivos,
      t.negativos,
      t.enEspera,
      t.totalServicios,
      t.primerServicio,
      t.segundoServicio,
      t.tercerServicio,
      t.cuatroOMasServicios,
      t.partos,
      t.abortos,
      t.aunPrenadas,
      `${t.eficienciaPorcentaje}%`,
      t.serviciosPorConcepcion,
      t.machosNacidos,
      t.hembrasNacidas,
      t.embrionesColocados || 0
    ]);
    exportToCSV('reporte_tecnicos', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  const handleAddNewTecnico = (nuevo: TecnicoEntity) => {
    setTecnicos(prev => [nuevo, ...prev]);
  };

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Reporte de técnicos"
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
              placeholder="Buscar técnicos..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        }
        primaryAction={{
          label: 'Nuevo Técnico',
          onClick: () => setIsNuevoModalOpen(true),
          icon: <UserPlus size={16} />
        }}
      />

      {/* Tabla de Técnicos */}
      <div className="report-table-wrapper">
        <table className="report-grid-table">
          <thead>
            <tr>
              {isColVisible('codigo') && (
                <th onClick={() => handleSort('codigo')}>
                  <div className="th-content">
                    <span>código</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('nombre') && (
                <th onClick={() => handleSort('nombre')}>
                  <div className="th-content">
                    <span>Nombre</span>
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
              {isColVisible('positivos') && <th>Positivos</th>}
              {isColVisible('negativos') && <th>Negativos</th>}
              {isColVisible('enEspera') && <th>En Espera</th>}
              {isColVisible('totalServicios') && (
                <th onClick={() => handleSort('totalServicios')}>
                  <div className="th-content">
                    <span>Total servicios</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('primerServicio') && <th>Primer Servicio</th>}
              {isColVisible('segundoServicio') && <th>Segundo Servicio</th>}
              {isColVisible('tercerServicio') && <th>Tercer Servicio</th>}
              {isColVisible('cuatroOMasServicios') && <th>4 o más Servicios</th>}
              {isColVisible('partos') && <th>Partos</th>}
              {isColVisible('abortos') && <th>Abortos</th>}
              {isColVisible('aunPrenadas') && <th>Aún Preñadas</th>}
              {isColVisible('eficienciaPorcentaje') && (
                <th onClick={() => handleSort('eficienciaPorcentaje')}>
                  <div className="th-content">
                    <span>Eficiencia</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('serviciosPorConcepcion') && (
                <th onClick={() => handleSort('serviciosPorConcepcion')}>
                  <div className="th-content">
                    <span>Servicios por Concepción</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('machosNacidos') && <th>Machos nacidos</th>}
              {isColVisible('hembrasNacidas') && <th>Hembras nacidas</th>}
              {isColVisible('embrionesColocados') && <th>Embriones colocados</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedTecnicos.length === 0 ? (
              <tr>
                <td colSpan={19} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
                  Ningún técnico encontrado con los criterios especificados
                </td>
              </tr>
            ) : (
              paginatedTecnicos.map(t => (
                <tr
                  key={t.codigo}
                  onClick={() => setSelectedTecnico(t)}
                  title="Haga click para ver la ficha detallada del técnico"
                >
                  {isColVisible('codigo') && (
                    <td style={{ fontWeight: 700, color: '#0284c7' }}>{t.codigo}</td>
                  )}
                  {isColVisible('nombre') && (
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.nombre}</td>
                  )}
                  {isColVisible('estatus') && (
                    <td>
                      <span className={`badge-status ${t.estatus.toLowerCase()}`}>
                        {t.estatus}
                      </span>
                    </td>
                  )}
                  {isColVisible('positivos') && <td style={{ color: '#16a34a', fontWeight: 600 }}>{t.positivos}</td>}
                  {isColVisible('negativos') && <td style={{ color: '#dc2626' }}>{t.negativos}</td>}
                  {isColVisible('enEspera') && <td>{t.enEspera}</td>}
                  {isColVisible('totalServicios') && <td style={{ fontWeight: 700 }}>{t.totalServicios}</td>}
                  {isColVisible('primerServicio') && <td>{t.primerServicio}</td>}
                  {isColVisible('segundoServicio') && <td>{t.segundoServicio}</td>}
                  {isColVisible('tercerServicio') && <td>{t.tercerServicio}</td>}
                  {isColVisible('cuatroOMasServicios') && <td>{t.cuatroOMasServicios}</td>}
                  {isColVisible('partos') && <td>{t.partos}</td>}
                  {isColVisible('abortos') && <td>{t.abortos}</td>}
                  {isColVisible('aunPrenadas') && <td>{t.aunPrenadas}</td>}
                  {isColVisible('eficienciaPorcentaje') && (
                    <td>
                      <span
                        className={`badge-efficiency ${
                          t.eficienciaPorcentaje >= 75
                            ? 'high'
                            : t.eficienciaPorcentaje >= 70
                            ? 'medium'
                            : 'low'
                        }`}
                      >
                        {t.eficienciaPorcentaje}%
                      </span>
                    </td>
                  )}
                  {isColVisible('serviciosPorConcepcion') && (
                    <td style={{ fontWeight: 600 }}>{t.serviciosPorConcepcion}</td>
                  )}
                  {isColVisible('machosNacidos') && <td>{t.machosNacidos}</td>}
                  {isColVisible('hembrasNacidas') && <td>{t.hembrasNacidas}</td>}
                  {isColVisible('embrionesColocados') && <td>{t.embrionesColocados || 0}</td>}
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
        totalRecords={filteredTecnicos.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Modal Ficha del Técnico */}
      <FichaTecnicoModal
        isOpen={!!selectedTecnico}
        onClose={() => setSelectedTecnico(null)}
        tecnico={selectedTecnico}
      />

      {/* Modal Nuevo Técnico */}
      <NuevoTecnicoModal
        isOpen={isNuevoModalOpen}
        onClose={() => setIsNuevoModalOpen(false)}
        onSave={handleAddNewTecnico}
      />

      {/* Drawer Filtros */}
      <TecnicosFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() =>
          setFilters({
            desde: '',
            hasta: '',
            estatus: ['Activo'],
            minEficiencia: 0
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
