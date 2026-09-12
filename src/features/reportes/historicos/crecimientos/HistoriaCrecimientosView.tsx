import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { FichaHistoricoModal, HistoricoModalData } from '../components/FichaHistoricoModal';
import { CrecimientosFilterDrawer, CrecimientosFilterValues } from '../components/CrecimientosFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_HISTORIA_CRECIMIENTOS } from '../historicosMockData';
import { CrecimientoHistoricoEntity } from '../../../../types2/entities';
import { EstatusAnimal } from '../../../../types2/common';

export const HistoriaCrecimientosView: React.FC = () => {
  const [pesajes] = useState<CrecimientoHistoricoEntity[]>(MOCK_HISTORIA_CRECIMIENTOS);

  const [selectedRecord, setSelectedRecord] = useState<HistoricoModalData | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof CrecimientoHistoricoEntity>('fecha');
  const [sortAsc, setSortAsc] = useState(false);

  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'practico', label: 'Práctico', visible: true },
    { key: 'unico', label: 'Único', visible: true },
    { key: 'categoria', label: 'Categoría', visible: true },
    { key: 'estatus', label: 'Estatus', visible: true },
    { key: 'loteActual', label: 'Lote', visible: true },
    { key: 'fecha', label: 'Fecha Pesaje', visible: true },
    { key: 'tipoPesaje', label: 'Tipo Pesaje', visible: true },
    { key: 'pesoKg', label: 'Peso (kg)', visible: true },
    { key: 'gananciaGramosDia', label: 'Ganancia (g/día)', visible: true },
    { key: 'alturaMetros', label: 'Altura (m)', visible: true },
    { key: 'gananciaCmDia', label: 'Ganancia Altura (cm/d)', visible: false },
    { key: 'diasEntreFechas', label: 'Días Transcurridos', visible: true },
    { key: 'tecnicoResponsable', label: 'Técnico Responsable', visible: true }
  ]);

  const [filters, setFilters] = useState<CrecimientosFilterValues>({
    pesoMin: undefined,
    pesoMax: undefined,
    desde: undefined,
    hasta: undefined,
    categorias: ['Becerro', 'Becerra', 'Maute', 'Mauta', 'Novillo', 'Novilla', 'Toro', 'Vaca'],
    tiposPesaje: [
      'General',
      'Al nacer',
      'Al destete',
      'Al servicio',
      'Al ingreso',
      'Al parto',
      'Al secado',
      'Al salir'
    ],
    estatus: ['Activo'] as EstatusAnimal[],
    lotes: ['01', 'ESCT', 'POT1', 'SEC1']
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.pesoMin !== undefined || filters.pesoMax !== undefined) count++;
    if (filters.desde || filters.hasta) count++;
    if (filters.categorias.length < 8) count++;
    if (filters.tiposPesaje.length < 8) count++;
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

  const handleSort = (field: keyof CrecimientoHistoricoEntity) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredPesajes = useMemo(() => {
    return pesajes
      .filter(item => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCode = item.practico.toLowerCase().includes(q) || item.unico.toLowerCase().includes(q);
          const matchTec = (item.tecnicoResponsable || '').toLowerCase().includes(q);
          const matchLot = item.loteActual.toLowerCase().includes(q);
          if (!matchCode && !matchTec && !matchLot) return false;
        }

        if (filters.pesoMin !== undefined && item.pesoKg < filters.pesoMin) return false;
        if (filters.pesoMax !== undefined && item.pesoKg > filters.pesoMax) return false;
        if (filters.desde && item.fecha < filters.desde) return false;
        if (filters.hasta && item.fecha > filters.hasta) return false;
        if (!filters.categorias.includes(item.categoria)) return false;
        if (!filters.tiposPesaje.includes(item.tipoPesaje)) return false;
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
  }, [pesajes, searchQuery, filters, sortField, sortAsc]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const totalPages = Math.ceil(filteredPesajes.length / pageSize) || 1;
  const paginatedPesajes = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredPesajes.slice(start, start + pageSize);
  }, [filteredPesajes, currentPage, totalPages, pageSize]);

  // KPIs
  const kpiStats = useMemo(() => {
    const count = filteredPesajes.length;
    if (count === 0) return { count: 0, avgPeso: 0, avgGdp: 0, maxGdp: 0 };

    const sumPeso = filteredPesajes.reduce((acc, p) => acc + p.pesoKg, 0);
    const validGdp = filteredPesajes.filter(p => (p.gananciaGramosDia || 0) > 0);
    const sumGdp = validGdp.reduce((acc, p) => acc + (p.gananciaGramosDia || 0), 0);
    const maxGdp = Math.max(...filteredPesajes.map(p => p.gananciaGramosDia || 0));

    return {
      count,
      avgPeso: Math.round(sumPeso / count),
      avgGdp: validGdp.length ? Math.round(sumGdp / validGdp.length) : 0,
      maxGdp
    };
  }, [filteredPesajes]);

  const handleExportXLSX = () => {
    const headers = [
      'Práctico',
      'Único',
      'Categoría',
      'Estatus',
      'Lote Actual',
      'Fecha Pesaje',
      'Tipo Pesaje',
      'Peso (kg)',
      'Ganancia (g/día)',
      'Altura (m)',
      'Ganancia Altura (cm/d)',
      'Días Transcurridos',
      'Técnico Responsable'
    ];
    const rows = filteredPesajes.map(p => [
      p.practico,
      p.unico,
      p.categoria,
      p.estatus,
      p.loteActual,
      p.fecha,
      p.tipoPesaje,
      p.pesoKg,
      p.gananciaGramosDia || 0,
      p.alturaMetros || '',
      p.gananciaCmDia || '',
      p.diasEntreFechas !== undefined ? p.diasEntreFechas : '',
      p.tecnicoResponsable || ''
    ]);
    exportToCSV('reporte_historia_crecimientos', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Historia de crecimientos"
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
              placeholder="Buscar animal, técnico o lote..."
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
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Total Pesajes Realizados</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>{kpiStats.count}</div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>Peso Promedio Registrado</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>{kpiStats.avgPeso} kg</div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>Ganancia Media Diaria</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>+{kpiStats.avgGdp} g/d</div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#d97706', fontWeight: 600 }}>Mejor Ganancia Diaria</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706', marginTop: 4 }}>+{kpiStats.maxGdp} g/d</div>
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
                    <span>Fecha Pesaje</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('tipoPesaje') && <th>Tipo Pesaje</th>}
              {isColVisible('pesoKg') && (
                <th onClick={() => handleSort('pesoKg')}>
                  <div className="th-content">
                    <span>Peso (kg)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('gananciaGramosDia') && (
                <th onClick={() => handleSort('gananciaGramosDia')}>
                  <div className="th-content">
                    <span>Ganancia (g/día)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('alturaMetros') && <th>Altura (m)</th>}
              {isColVisible('gananciaCmDia') && <th>Ganancia Altura</th>}
              {isColVisible('diasEntreFechas') && <th>Días Transcurridos</th>}
              {isColVisible('tecnicoResponsable') && <th>Técnico</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedPesajes.length === 0 ? (
              <tr>
                <td colSpan={13} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
                  Ningún pesaje corporal encontrado
                </td>
              </tr>
            ) : (
              paginatedPesajes.map((p, idx) => (
                <tr
                  key={`${p.practico}-${p.fecha}-${idx}`}
                  onClick={() =>
                    setSelectedRecord({
                      tipo: 'crecimiento',
                      titulo: `Pesaje Corporal - ${p.tipoPesaje}`,
                      practico: p.practico,
                      unico: p.unico,
                      categoria: p.categoria,
                      estatus: p.estatus,
                      lote: p.loteActual,
                      fecha: p.fecha,
                      detalles: [
                        { label: 'Tipo de Pesaje', value: p.tipoPesaje },
                        { label: 'Peso Registrado', value: `${p.pesoKg} kg` },
                        { label: 'Ganancia Diaria (GDP)', value: p.gananciaGramosDia ? `+${p.gananciaGramosDia} g/día` : 'Línea base (0 g/día)' },
                        { label: 'Altura a la Cruz', value: p.alturaMetros ? `${p.alturaMetros} m` : '-' },
                        { label: 'Crecimiento en Altura', value: p.gananciaCmDia ? `+${p.gananciaCmDia} cm/día` : '-' },
                        { label: 'Días Transcurridos', value: `${p.diasEntreFechas || 0} días` },
                        { label: 'Técnico Responsable', value: p.tecnicoResponsable || '-' }
                      ]
                    })
                  }
                  title="Haga click para ver detalles del crecimiento"
                >
                  {isColVisible('practico') && (
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.practico}</td>
                  )}
                  {isColVisible('unico') && <td>{p.unico}</td>}
                  {isColVisible('categoria') && (
                    <td>
                      <span className="badge-category" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
                        {p.categoria}
                      </span>
                    </td>
                  )}
                  {isColVisible('estatus') && (
                    <td>
                      <span className={`badge-status ${p.estatus.toLowerCase()}`}>
                        {p.estatus}
                      </span>
                    </td>
                  )}
                  {isColVisible('loteActual') && (
                    <td>
                      <span style={{ fontWeight: 600, color: '#166534' }}>{p.loteActual}</span>
                    </td>
                  )}
                  {isColVisible('fecha') && <td>{p.fecha}</td>}
                  {isColVisible('tipoPesaje') && (
                    <td>
                      <span className="badge-category" style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
                        {p.tipoPesaje}
                      </span>
                    </td>
                  )}
                  {isColVisible('pesoKg') && (
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.pesoKg} kg</td>
                  )}
                  {isColVisible('gananciaGramosDia') && (
                    <td>
                      {p.gananciaGramosDia ? (
                        <span className="badge-efficiency high">+{p.gananciaGramosDia} g/d</span>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>-</span>
                      )}
                    </td>
                  )}
                  {isColVisible('alturaMetros') && <td>{p.alturaMetros ? `${p.alturaMetros} m` : '-'}</td>}
                  {isColVisible('gananciaCmDia') && <td>{p.gananciaCmDia ? `+${p.gananciaCmDia} cm/d` : '-'}</td>}
                  {isColVisible('diasEntreFechas') && <td>{p.diasEntreFechas || 0} d</td>}
                  {isColVisible('tecnicoResponsable') && <td>{p.tecnicoResponsable || '-'}</td>}
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
        totalRecords={filteredPesajes.length}
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
      <CrecimientosFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() =>
          setFilters({
            pesoMin: undefined,
            pesoMax: undefined,
            desde: undefined,
            hasta: undefined,
            categorias: ['Becerro', 'Becerra', 'Maute', 'Mauta', 'Novillo', 'Novilla', 'Toro', 'Vaca'],
            tiposPesaje: [
              'General',
              'Al nacer',
              'Al destete',
              'Al servicio',
              'Al ingreso',
              'Al parto',
              'Al secado',
              'Al salir'
            ],
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
