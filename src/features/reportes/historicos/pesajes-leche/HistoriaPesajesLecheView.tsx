import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { FichaHistoricoModal, HistoricoModalData } from '../components/FichaHistoricoModal';
import { PesajesLecheFilterDrawer, PesajesLecheFilterValues } from '../components/PesajesLecheFilterDrawer';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';
import { MOCK_HISTORIA_PESAJES_LECHE } from '../historicosMockData';
import { PesajeLecheHistoricoEntity } from '../../../../types2/entities';
import { EstatusAnimal } from '../../../../types2/common';

export const HistoriaPesajesLecheView: React.FC = () => {
  const [pesajes] = useState<PesajeLecheHistoricoEntity[]>(MOCK_HISTORIA_PESAJES_LECHE);

  const [selectedRecord, setSelectedRecord] = useState<HistoricoModalData | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof PesajeLecheHistoricoEntity>('pesajeTotalKg');
  const [sortAsc, setSortAsc] = useState(false);

  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'practico', label: 'Práctico', visible: true },
    { key: 'unico', label: 'Único', visible: true },
    { key: 'categoria', label: 'Categoría', visible: true },
    { key: 'estatus', label: 'Estatus', visible: true },
    { key: 'loteActual', label: 'Lote', visible: true },
    { key: 'fecha', label: 'Fecha Pesaje', visible: true },
    { key: 'lactanciaNumero', label: 'No. Lactancia', visible: true },
    { key: 'tipoPesaje', label: 'Tipo Pesaje', visible: true },
    { key: 'pesaje1Kg', label: 'Mañana (kg)', visible: true },
    { key: 'pesaje2Kg', label: 'Tarde (kg)', visible: true },
    { key: 'pesaje3Kg', label: 'Noche (kg)', visible: false },
    { key: 'pesajeTotalKg', label: 'Total Día (kg)', visible: true },
    { key: 'comentario', label: 'Comentarios', visible: true }
  ]);

  const [filters, setFilters] = useState<PesajesLecheFilterValues>({
    lactanciaMin: undefined,
    lactanciaMax: undefined,
    desde: undefined,
    hasta: undefined,
    tipoPesaje: ['Inicio', 'Ordeño', 'Secado'],
    categorias: ['Vaca', 'Novilla'],
    estatus: ['Activo'] as EstatusAnimal[],
    lotes: ['01', 'ESCT', 'POT1', 'SEC1']
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.lactanciaMin || filters.lactanciaMax) count++;
    if (filters.desde || filters.hasta) count++;
    if (filters.tipoPesaje.length < 3) count++;
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

  const handleSort = (field: keyof PesajeLecheHistoricoEntity) => {
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
          const matchCom = (item.comentario || '').toLowerCase().includes(q);
          const matchLot = item.loteActual.toLowerCase().includes(q);
          if (!matchCode && !matchCom && !matchLot) return false;
        }

        if (filters.lactanciaMin !== undefined && item.lactanciaNumero < filters.lactanciaMin) return false;
        if (filters.lactanciaMax !== undefined && item.lactanciaNumero > filters.lactanciaMax) return false;
        if (filters.desde && item.fecha < filters.desde) return false;
        if (filters.hasta && item.fecha > filters.hasta) return false;
        if (!filters.tipoPesaje.includes(item.tipoPesaje)) return false;
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
    if (count === 0) return { count: 0, avgTotal: 0, maxTotal: 0, volSum: 0 };

    const sumTotal = filteredPesajes.reduce((acc, p) => acc + p.pesajeTotalKg, 0);
    const maxTotal = Math.max(...filteredPesajes.map(p => p.pesajeTotalKg));

    return {
      count,
      avgTotal: (sumTotal / count).toFixed(1),
      maxTotal,
      volSum: sumTotal.toFixed(1)
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
      'No. Lactancia',
      'Tipo Pesaje',
      'Mañana (kg)',
      'Tarde (kg)',
      'Noche (kg)',
      'Total Día (kg)',
      'Comentario'
    ];
    const rows = filteredPesajes.map(p => [
      p.practico,
      p.unico,
      p.categoria,
      p.estatus,
      p.loteActual,
      p.fecha,
      p.lactanciaNumero,
      p.tipoPesaje,
      p.pesaje1Kg || 0,
      p.pesaje2Kg || 0,
      p.pesaje3Kg || 0,
      p.pesajeTotalKg,
      p.comentario || ''
    ]);
    exportToCSV('reporte_historia_pesajes_leche', headers, rows);
  };

  const handleExportPDF = () => {
    const headers = [
      'Práctico',
      'Único',
      'Categoría',
      'Estatus',
      'Lote',
      'Fecha',
      'Lactancia N°',
      'Tipo Pesaje',
      'Pesaje 1 (Kg)',
      'Pesaje 2 (Kg)',
      'Pesaje 3 (Kg)',
      'Total (Kg)',
      'Comentario'
    ];
    const rows = filteredPesajes.map(p => [
      p.practico,
      p.unico,
      p.categoria,
      p.estatus,
      p.loteActual,
      p.fecha,
      p.lactanciaNumero,
      p.tipoPesaje,
      p.pesaje1Kg || 0,
      p.pesaje2Kg || 0,
      p.pesaje3Kg || 0,
      p.pesajeTotalKg,
      p.comentario || ''
    ]);
    exportToPDF('reporte_historia_pesajes_leche', 'Historial de Controles y Pesajes de Leche', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Historia de pesajes de leche"
        backRoute="/reportes"
        onFilterToggle={() => setIsFilterDrawerOpen(prev => !prev)}
        isFilterOpen={isFilterDrawerOpen}
        activeFiltersCount={activeFiltersCount}
        onExportXLSX={handleExportXLSX}
        onExportPDF={handleExportPDF}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
        extraActions={
          <div className="report-search-bar">
            <Search className="report-search-icon" size={16} />
            <input
              type="text"
              className="report-search-input"
              placeholder="Buscar por vaca, comentario..."
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
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Controles Realizados</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>{kpiStats.count}</div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>Promedio Producción / Vaca</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>{kpiStats.avgTotal} kg/d</div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>Pico Más Alto Registrado</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>{kpiStats.maxTotal} kg</div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#d97706', fontWeight: 600 }}>Volumen Total Controlado</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706', marginTop: 4 }}>{kpiStats.volSum} kg</div>
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
              {isColVisible('lactanciaNumero') && <th>No. Lactancia</th>}
              {isColVisible('tipoPesaje') && <th>Tipo Pesaje</th>}
              {isColVisible('pesaje1Kg') && <th>Mañana (kg)</th>}
              {isColVisible('pesaje2Kg') && <th>Tarde (kg)</th>}
              {isColVisible('pesaje3Kg') && <th>Noche (kg)</th>}
              {isColVisible('pesajeTotalKg') && (
                <th onClick={() => handleSort('pesajeTotalKg')}>
                  <div className="th-content">
                    <span>Total Día (kg)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('comentario') && <th>Comentarios</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedPesajes.length === 0 ? (
              <tr>
                <td colSpan={13} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
                  Ningún pesaje de leche encontrado
                </td>
              </tr>
            ) : (
              paginatedPesajes.map((p, idx) => (
                <tr
                  key={`${p.practico}-${p.fecha}-${idx}`}
                  onClick={() =>
                    setSelectedRecord({
                      tipo: 'pesajeLeche',
                      titulo: `Pesaje de Leche - ${p.fecha}`,
                      practico: p.practico,
                      unico: p.unico,
                      categoria: p.categoria,
                      estatus: p.estatus,
                      lote: p.loteActual,
                      fecha: p.fecha,
                      observaciones: p.comentario,
                      detalles: [
                        { label: 'No. Lactancia', value: `#${p.lactanciaNumero}` },
                        { label: 'Tipo de Pesaje', value: p.tipoPesaje },
                        { label: 'Ordeño Mañana', value: `${p.pesaje1Kg || 0} kg` },
                        { label: 'Ordeño Tarde', value: `${p.pesaje2Kg || 0} kg` },
                        { label: 'Ordeño Noche', value: `${p.pesaje3Kg || 0} kg` },
                        { label: 'Total Día', value: `${p.pesajeTotalKg} kg` }
                      ]
                    })
                  }
                  title="Haga click para ver detalles del pesaje"
                >
                  {isColVisible('practico') && (
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.practico}</td>
                  )}
                  {isColVisible('unico') && <td>{p.unico}</td>}
                  {isColVisible('categoria') && <td>{p.categoria}</td>}
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
                  {isColVisible('lactanciaNumero') && <td>#{p.lactanciaNumero}</td>}
                  {isColVisible('tipoPesaje') && (
                    <td>
                      <span className="badge-category" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>
                        {p.tipoPesaje}
                      </span>
                    </td>
                  )}
                  {isColVisible('pesaje1Kg') && <td>{p.pesaje1Kg || '-'}</td>}
                  {isColVisible('pesaje2Kg') && <td>{p.pesaje2Kg || '-'}</td>}
                  {isColVisible('pesaje3Kg') && <td>{p.pesaje3Kg || '-'}</td>}
                  {isColVisible('pesajeTotalKg') && (
                    <td style={{ fontWeight: 700, color: '#1d4ed8' }}>
                      <span className="badge-efficiency high">{p.pesajeTotalKg} kg</span>
                    </td>
                  )}
                  {isColVisible('comentario') && (
                    <td style={{ fontStyle: 'italic', color: '#64748b' }}>{p.comentario || '-'}</td>
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
      <PesajesLecheFilterDrawer
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
            tipoPesaje: ['Inicio', 'Ordeño', 'Secado'],
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
