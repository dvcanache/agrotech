import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { FichaAnimalModal, AnimalModalData } from '../components/FichaAnimalModal';
import { NoVientresFilterDrawer, NoVientresFilterValues } from '../components/NoVientresFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_NO_VIENTRES } from '../animalesMockData';
import { NoVientreEntity } from '../../../../types2/entities';
import { EstatusAnimal } from '../../../../types2/common';

export const NoVientresView: React.FC = () => {
  const [animales] = useState<NoVientreEntity[]>(MOCK_NO_VIENTRES);

  const [selectedAnimal, setSelectedAnimal] = useState<AnimalModalData | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof NoVientreEntity>('edadMeses');
  const [sortAsc, setSortAsc] = useState(true);

  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'practico', label: 'Práctico', visible: true },
    { key: 'unico', label: 'Único', visible: true },
    { key: 'categoria', label: 'Categoría', visible: true },
    { key: 'estatus', label: 'Estatus', visible: true },
    { key: 'lote', label: 'Lote', visible: true },
    { key: 'fechaNacimiento', label: 'Fecha nacimiento', visible: true },
    { key: 'edadMeses', label: 'Edad (meses)', visible: true },
    { key: 'composicion', label: 'Composición', visible: true },
    { key: 'penultimoPesoKg', label: 'Penúltimo peso (kg)', visible: true },
    { key: 'fechaPenultimoPeso', label: 'Fecha penúltimo peso', visible: true },
    { key: 'ultimoPesoKg', label: 'Último Peso (kg)', visible: true },
    { key: 'fechaUltimoPeso', label: 'Fecha último peso', visible: true },
    { key: 'gananciaParcialGramosDia', label: 'Ganancia Parcial (g)', visible: true },
    { key: 'gananciaGlobalGramosDia', label: 'Ganancia Global (g)', visible: true },
    { key: 'pesoIngresoKg', label: 'Peso ingreso (kg)', visible: true },
    { key: 'fechaPesoIngreso', label: 'Fecha peso ingreso', visible: true }
  ]);

  const [filters, setFilters] = useState<NoVientresFilterValues>({
    categorias: ['Becerra', 'Mauta', 'Becerro', 'Maute', 'Novillo'],
    estatus: ['Activo'] as EstatusAnimal[],
    lotes: ['01', 'ESCT', 'POT1', 'SEC1']
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categorias.length < 5) count++;
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

  const handleSort = (field: keyof NoVientreEntity) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredAnimales = useMemo(() => {
    return animales
      .filter(item => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCode = item.practico.toLowerCase().includes(q) || item.unico.toLowerCase().includes(q);
          const matchComp = item.composicion.toLowerCase().includes(q);
          const matchLot = item.lote.toLowerCase().includes(q);
          if (!matchCode && !matchComp && !matchLot) return false;
        }

        if (!filters.categorias.includes(item.categoria)) return false;
        if (!filters.estatus.includes(item.estatus)) return false;
        if (!filters.lotes.includes(item.lote)) return false;

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
  }, [animales, searchQuery, filters, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredAnimales.length / pageSize) || 1;
  const paginatedAnimales = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAnimales.slice(start, start + pageSize);
  }, [filteredAnimales, currentPage, pageSize]);

  const handleExportXLSX = () => {
    const headers = [
      'Práctico',
      'Único',
      'Categoría',
      'Estatus',
      'Lote',
      'Fecha Nacimiento',
      'Edad (meses)',
      'Composición',
      'Penúltimo Peso (kg)',
      'Fecha Penúltimo Peso',
      'Último Peso (kg)',
      'Fecha Último Peso',
      'Ganancia Parcial (g/día)',
      'Ganancia Global (g/día)',
      'Peso Ingreso (kg)',
      'Fecha Peso Ingreso'
    ];
    const rows = filteredAnimales.map(a => [
      a.practico,
      a.unico,
      a.categoria,
      a.estatus,
      a.lote,
      a.fechaNacimiento,
      a.edadMeses,
      a.composicion,
      a.penultimoPesoKg || '',
      a.fechaPenultimoPeso || '',
      a.ultimoPesoKg || '',
      a.fechaUltimoPeso || '',
      a.gananciaParcialGramosDia || '',
      a.gananciaGlobalGramosDia || '',
      a.pesoIngresoKg || '',
      a.fechaPesoIngreso || ''
    ]);
    exportToCSV('reporte_no_vientres', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="No Vientres"
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
              placeholder="Buscar mautes, becerros..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        }
      />

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
              {isColVisible('lote') && (
                <th onClick={() => handleSort('lote')}>
                  <div className="th-content">
                    <span>Lote</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('fechaNacimiento') && <th>Fecha nacimiento</th>}
              {isColVisible('edadMeses') && (
                <th onClick={() => handleSort('edadMeses')}>
                  <div className="th-content">
                    <span>Edad (meses)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('composicion') && <th>Composición</th>}
              {isColVisible('penultimoPesoKg') && <th>Penúltimo peso (kg)</th>}
              {isColVisible('fechaPenultimoPeso') && <th>Fecha penúltimo peso</th>}
              {isColVisible('ultimoPesoKg') && (
                <th onClick={() => handleSort('ultimoPesoKg')}>
                  <div className="th-content">
                    <span>Último Peso (kg)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('fechaUltimoPeso') && <th>Fecha último peso</th>}
              {isColVisible('gananciaParcialGramosDia') && (
                <th onClick={() => handleSort('gananciaParcialGramosDia')}>
                  <div className="th-content">
                    <span>Ganancia Parcial (g)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('gananciaGlobalGramosDia') && (
                <th onClick={() => handleSort('gananciaGlobalGramosDia')}>
                  <div className="th-content">
                    <span>Ganancia Global (g)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('pesoIngresoKg') && <th>Peso ingreso (kg)</th>}
              {isColVisible('fechaPesoIngreso') && <th>Fecha peso ingreso</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedAnimales.length === 0 ? (
              <tr>
                <td colSpan={16} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
                  Ningún registro encontrado
                </td>
              </tr>
            ) : (
              paginatedAnimales.map(a => (
                <tr
                  key={a.practico}
                  onClick={() =>
                    setSelectedAnimal({
                      practico: a.practico,
                      unico: a.unico,
                      categoria: a.categoria,
                      estatus: a.estatus,
                      lote: a.lote,
                      pesoKg: a.ultimoPesoKg,
                      raza: a.composicion
                    })
                  }
                  title="Haga click para ver la ficha del animal"
                >
                  {isColVisible('practico') && (
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{a.practico}</td>
                  )}
                  {isColVisible('unico') && <td>{a.unico}</td>}
                  {isColVisible('categoria') && (
                    <td>
                      <span className="badge-category" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
                        {a.categoria}
                      </span>
                    </td>
                  )}
                  {isColVisible('estatus') && (
                    <td>
                      <span className={`badge-status ${a.estatus.toLowerCase()}`}>
                        {a.estatus}
                      </span>
                    </td>
                  )}
                  {isColVisible('lote') && (
                    <td>
                      <span style={{ fontWeight: 600, color: '#166534' }}>{a.lote}</span>
                    </td>
                  )}
                  {isColVisible('fechaNacimiento') && <td>{a.fechaNacimiento}</td>}
                  {isColVisible('edadMeses') && (
                    <td style={{ fontWeight: 600 }}>{a.edadMeses} m</td>
                  )}
                  {isColVisible('composicion') && (
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.composicion}</td>
                  )}
                  {isColVisible('penultimoPesoKg') && (
                    <td>{a.penultimoPesoKg ? `${a.penultimoPesoKg} kg` : '-'}</td>
                  )}
                  {isColVisible('fechaPenultimoPeso') && <td>{a.fechaPenultimoPeso || '-'}</td>}
                  {isColVisible('ultimoPesoKg') && (
                    <td style={{ fontWeight: 700, color: '#15803d' }}>
                      {a.ultimoPesoKg ? `${a.ultimoPesoKg} kg` : '-'}
                    </td>
                  )}
                  {isColVisible('fechaUltimoPeso') && <td>{a.fechaUltimoPeso || '-'}</td>}
                  {isColVisible('gananciaParcialGramosDia') && (
                    <td>
                      {a.gananciaParcialGramosDia ? (
                        <span className="badge-efficiency high">
                          +{a.gananciaParcialGramosDia} g/d
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  )}
                  {isColVisible('gananciaGlobalGramosDia') && (
                    <td>
                      {a.gananciaGlobalGramosDia ? (
                        <span className="badge-efficiency medium">
                          +{a.gananciaGlobalGramosDia} g/d
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  )}
                  {isColVisible('pesoIngresoKg') && (
                    <td>{a.pesoIngresoKg ? `${a.pesoIngresoKg} kg` : '-'}</td>
                  )}
                  {isColVisible('fechaPesoIngreso') && <td>{a.fechaPesoIngreso || '-'}</td>}
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
        totalRecords={filteredAnimales.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Modal Ficha Semoviente */}
      <FichaAnimalModal
        isOpen={!!selectedAnimal}
        onClose={() => setSelectedAnimal(null)}
        animal={selectedAnimal}
      />

      {/* Drawer Filtros */}
      <NoVientresFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() =>
          setFilters({
            categorias: ['Becerra', 'Mauta', 'Becerro', 'Maute', 'Novillo'],
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
