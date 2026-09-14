import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportPagination } from '../../components/ReportPagination';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { FichaAnimalModal, AnimalModalData } from '../components/FichaAnimalModal';
import { LactandoFilterDrawer, LactandoFilterValues } from '../components/LactandoFilterDrawer';
import { SpeciesSelectorBar, SPECIES_TABS_CONFIG } from '../../components/SpeciesSelectorBar';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';
import { MOCK_ANIMALES_LACTANDO } from '../animalesMockData';
import { AnimalLactandoEntity } from '../../../../types2/entities';
import { EstatusAnimal } from '../../../../types2/common';

/**
 * Calcula los Días Abiertos zootécnicos del semoviente.
 * - Si está gestante: días desde el último parto hasta la concepción (servicio fertilizante).
 * - Si está vacía: DEL (Días En Leche) o días transcurridos desde el último parto hasta hoy.
 */
export function calculateDiasAbiertos(animal: AnimalLactandoEntity): number {
  const isGestante = animal.situacionReproductivaActual === 'Preñada' || 
                     animal.situacionReproductivaActual === 'Gestante';

  if (isGestante) {
    if (animal.ultimoParto && animal.ultimoServicio) {
      const dParto = new Date(animal.ultimoParto).getTime();
      const dServicio = new Date(animal.ultimoServicio).getTime();
      if (!isNaN(dParto) && !isNaN(dServicio) && dServicio >= dParto) {
        return Math.round((dServicio - dParto) / (1000 * 60 * 60 * 24));
      }
    }
    if (animal.diasParida !== undefined && animal.diasServida !== undefined && animal.diasParida >= animal.diasServida) {
      return animal.diasParida - animal.diasServida;
    }
    return animal.diasParida || animal.diasEnProduccion || 0;
  } else {
    if (animal.diasEnProduccion) {
      return animal.diasEnProduccion;
    }
    if (animal.diasParida) {
      return animal.diasParida;
    }
    if (animal.ultimoParto) {
      const dParto = new Date(animal.ultimoParto).getTime();
      const now = new Date().getTime();
      if (!isNaN(dParto) && now >= dParto) {
        return Math.round((now - dParto) / (1000 * 60 * 60 * 24));
      }
    }
    return 0;
  }
}

export const AnimalesLactandoView: React.FC = () => {
  const [animales] = useState<AnimalLactandoEntity[]>(MOCK_ANIMALES_LACTANDO);

  // Especie activa
  const [selectedSpecies, setSelectedSpecies] = useState<string>('TODAS');

  const [selectedAnimal, setSelectedAnimal] = useState<AnimalModalData | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof AnimalLactandoEntity | 'diasAbiertos'>('diasEnProduccion');
  const [sortAsc, setSortAsc] = useState(true);

  // Conteo dinámico por especie
  const speciesCounts = useMemo(() => {
    const counts: Record<string, number> = { TODAS: animales.length };
    SPECIES_TABS_CONFIG.forEach(t => {
      if (t.id !== 'TODAS') {
        counts[t.id] = animales.filter(a => (a.especie || 'Bovinos') === t.id).length;
      }
    });
    return counts;
  }, [animales]);

  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'practico', label: 'Práctico', visible: true },
    { key: 'especie', label: 'Especie', visible: true },
    { key: 'unico', label: 'Único', visible: true },
    { key: 'categoria', label: 'Categoría', visible: true },
    { key: 'estatus', label: 'Estatus', visible: true },
    { key: 'situacionReproductivaActual', label: 'Situación reproductiva actual', visible: true },
    { key: 'situacionProductivaActual', label: 'Situación productiva actual', visible: true },
    { key: 'lote', label: 'Lote', visible: true },
    { key: 'ultimoParto', label: 'Último Parto', visible: true },
    { key: 'numeroParto', label: 'Número de parto', visible: true },
    { key: 'ultimoServicio', label: 'Último servicio', visible: true },
    { key: 'reproductor', label: 'Reproductor', visible: true },
    { key: 'diasParida', label: 'Días parida', visible: true },
    { key: 'diasAbiertos', label: 'Días Abiertos', visible: true },
    { key: 'diasServida', label: 'Días servida', visible: true },
    { key: 'proximoParto', label: 'Próximo parto', visible: true },
    { key: 'fechaProximoSecado', label: 'Fecha próximo secado', visible: true },
    { key: 'diasEnProduccion', label: 'Días en producción', visible: true },
    { key: 'diasSeca', label: 'Días seca', visible: true }
  ]);

  const allLotes = useMemo(() => Array.from(new Set(animales.map(a => a.lote))), [animales]);

  const [filters, setFilters] = useState<LactandoFilterValues>(() => ({
    diasProduccionMaximo: undefined,
    estatus: ['Activo'] as EstatusAnimal[],
    lotes: Array.from(new Set(MOCK_ANIMALES_LACTANDO.map(a => a.lote)))
  }));

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.diasProduccionMaximo !== undefined) count++;
    if (filters.estatus.length < 3) count++;
    if (filters.lotes.length < allLotes.length) count++;
    return count;
  }, [filters, allLotes]);

  const toggleColumn = (key: string) => {
    setColumns(prev =>
      prev.map(col => (col.key === key ? { ...col, visible: !col.visible } : col))
    );
  };

  const resetColumns = () => {
    setColumns(prev => prev.map(col => ({ ...col, visible: true })));
  };

  const handleSort = (field: keyof AnimalLactandoEntity | 'diasAbiertos') => {
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
        // Filtro por Especie activa
        const sp = item.especie || 'Bovinos';
        if (selectedSpecies !== 'TODAS' && sp !== selectedSpecies) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCode = item.practico.toLowerCase().includes(q) || item.unico.toLowerCase().includes(q);
          const matchLot = item.lote.toLowerCase().includes(q);
          const matchCat = item.categoria.toLowerCase().includes(q);
          if (!matchCode && !matchLot && !matchCat) return false;
        }

        if (!filters.estatus.includes(item.estatus)) return false;
        if (filters.lotes.length > 0 && !filters.lotes.includes(item.lote)) return false;
        if (
          filters.diasProduccionMaximo !== undefined &&
          item.diasEnProduccion > filters.diasProduccionMaximo
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortField === 'diasAbiertos') {
          const valA = calculateDiasAbiertos(a);
          const valB = calculateDiasAbiertos(b);
          return sortAsc ? valA - valB : valB - valA;
        }
        const valA = a[sortField as keyof AnimalLactandoEntity];
        const valB = b[sortField as keyof AnimalLactandoEntity];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA || '').localeCompare(String(valB || ''))
          : String(valB || '').localeCompare(String(valA || ''));
      });
  }, [animales, selectedSpecies, searchQuery, filters, sortField, sortAsc]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSpecies, filters, searchQuery]);

  const totalPages = Math.ceil(filteredAnimales.length / pageSize) || 1;
  const paginatedAnimales = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredAnimales.slice(start, start + pageSize);
  }, [filteredAnimales, currentPage, totalPages, pageSize]);

  // Indicadores Clave de Rendimiento (KPIs Zootécnicos)
  const kpiStats = useMemo(() => {
    const count = filteredAnimales.length;
    if (count === 0) {
      return {
        totalLactando: 0,
        avgDiasAbiertos: 0,
        totalPrenadas: 0,
        pctPrenadas: 0,
        avgDEL: 0,
        subtextDiasAbiertos: 'Sin registros'
      };
    }

    const sumDEL = filteredAnimales.reduce((acc, a) => acc + (a.diasEnProduccion || a.diasParida || 0), 0);
    const avgDEL = Math.round(sumDEL / count);

    let sumDiasAbiertos = 0;
    let countPrenadas = 0;

    filteredAnimales.forEach(a => {
      const isGestante = a.situacionReproductivaActual === 'Preñada' || a.situacionReproductivaActual === 'Gestante';
      if (isGestante) {
        countPrenadas++;
      }
      sumDiasAbiertos += calculateDiasAbiertos(a);
    });

    const avgDiasAbiertos = Math.round(sumDiasAbiertos / count);
    const pctPrenadas = Math.round((countPrenadas / count) * 100);

    const subtextDiasAbiertos = avgDiasAbiertos <= 110 
      ? 'Eficiencia Óptima (< 110 d)' 
      : avgDiasAbiertos <= 140 
      ? 'Aceptable (110-140 d)' 
      : 'Alerta Reproductiva (> 140 d)';

    return {
      totalLactando: count,
      avgDiasAbiertos,
      totalPrenadas: countPrenadas,
      pctPrenadas,
      avgDEL,
      subtextDiasAbiertos
    };
  }, [filteredAnimales]);

  const handleExportXLSX = () => {
    const headers = [
      'Práctico',
      'Único',
      'Especie',
      'Categoría',
      'Estatus',
      'Situación Reproductiva',
      'Situación Productiva',
      'Lote',
      'Último Parto',
      'Número de Parto',
      'Último Servicio',
      'Reproductor',
      'Días Parida',
      'Días Abiertos',
      'Días Servida',
      'Próximo Parto',
      'Fecha Próximo Secado',
      'Días en Producción',
      'Días Seca'
    ];
    const rows = filteredAnimales.map(a => [
      a.practico,
      a.unico,
      a.especie || 'Bovinos',
      a.categoria,
      a.estatus,
      a.situacionReproductivaActual,
      a.situacionProductivaActual,
      a.lote,
      a.ultimoParto,
      a.numeroParto,
      a.ultimoServicio || '',
      a.reproductor || '',
      a.diasParida,
      calculateDiasAbiertos(a),
      a.diasServida !== undefined ? a.diasServida : '',
      a.proximoParto || '',
      a.fechaProximoSecado || '',
      a.diasEnProduccion,
      a.diasSeca !== undefined ? a.diasSeca : ''
    ]);
    exportToCSV('reporte_animales_lactando', headers, rows);
  };

  const handleExportPDF = () => {
    const headers = [
      'Práctico',
      'Único',
      'Especie',
      'Categoría',
      'Estatus',
      'Sit. Reproductiva',
      'Sit. Productiva',
      'Lote',
      'Último Parto',
      'N° Parto',
      'Último Servicio',
      'Reproductor',
      'Días Parida',
      'Días Abiertos',
      'Días Servida',
      'Próximo Parto',
      'Fecha Próximo Secado',
      'Días en Producción',
      'Días Seca'
    ];
    const rows = filteredAnimales.map(a => [
      a.practico,
      a.unico,
      a.especie || 'Bovinos',
      a.categoria,
      a.estatus,
      a.situacionReproductivaActual,
      a.situacionProductivaActual,
      a.lote,
      a.ultimoParto,
      a.numeroParto,
      a.ultimoServicio || '',
      a.reproductor || '',
      a.diasParida,
      calculateDiasAbiertos(a),
      a.diasServida !== undefined ? a.diasServida : '',
      a.proximoParto || '',
      a.fechaProximoSecado || '',
      a.diasEnProduccion,
      a.diasSeca !== undefined ? a.diasSeca : ''
    ]);
    exportToPDF('reporte_animales_lactando', 'Reporte de Animales Lactando', headers, rows);
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  return (
    <div className="report-view-container">
      {/* Encabezado */}
      <ReportViewHeader
        title="Animales lactando"
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
              placeholder="Buscar animales..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        }
      />

      {/* Barra Selectora Multiespecie */}
      <SpeciesSelectorBar
        selectedSpecies={selectedSpecies}
        onSelectSpecies={setSelectedSpecies}
        speciesCounts={speciesCounts}
      />

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 16
        }}
      >
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Total en Lactancia</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>{kpiStats.totalLactando} cabezas</div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>Promedio Días Abiertos</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>{kpiStats.avgDiasAbiertos} días</div>
          <div style={{ fontSize: 11, color: kpiStats.avgDiasAbiertos <= 110 ? '#16a34a' : kpiStats.avgDiasAbiertos <= 140 ? '#d97706' : '#dc2626', fontWeight: 600, marginTop: 2 }}>
            {kpiStats.subtextDiasAbiertos}
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>Gestantes en Ordeño</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>{kpiStats.totalPrenadas} ({kpiStats.pctPrenadas}%)</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Confirmadas preñadas</div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#d97706', fontWeight: 600 }}>Promedio DEL (Días en Leche)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706', marginTop: 4 }}>{kpiStats.avgDEL} días</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Días en producción</div>
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
              {isColVisible('especie') && (
                <th onClick={() => handleSort('especie' as any)}>
                  <div className="th-content">
                    <span>Especie</span>
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
              {isColVisible('situacionReproductivaActual') && (
                <th onClick={() => handleSort('situacionReproductivaActual')}>
                  <div className="th-content">
                    <span>Situación reproductiva actual</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('situacionProductivaActual') && <th>Situación productiva actual</th>}
              {isColVisible('lote') && (
                <th onClick={() => handleSort('lote')}>
                  <div className="th-content">
                    <span>Lote</span>
                    <Filter size={12} />
                  </div>
                </th>
              )}
              {isColVisible('ultimoParto') && <th>Último Parto</th>}
              {isColVisible('numeroParto') && <th>Número de parto</th>}
              {isColVisible('ultimoServicio') && <th>Último servicio</th>}
              {isColVisible('reproductor') && <th>Reproductor</th>}
              {isColVisible('diasParida') && (
                <th onClick={() => handleSort('diasParida')}>
                  <div className="th-content">
                    <span>Días parida</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('diasAbiertos') && (
                <th onClick={() => handleSort('diasAbiertos')}>
                  <div className="th-content">
                    <span>Días abiertos</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('diasServida') && <th>Días servida</th>}
              {isColVisible('proximoParto') && <th>Próximo parto</th>}
              {isColVisible('fechaProximoSecado') && <th>Fecha próximo secado</th>}
              {isColVisible('diasEnProduccion') && (
                <th onClick={() => handleSort('diasEnProduccion')}>
                  <div className="th-content">
                    <span>Días en producción</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              )}
              {isColVisible('diasSeca') && <th>Días seca</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedAnimales.length === 0 ? (
              <tr>
                <td colSpan={18} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
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
                      especie: a.especie,
                      categoria: a.categoria,
                      estatus: a.estatus,
                      lote: a.lote,
                      estatusReproductivo: a.situacionReproductivaActual,
                      estatusProductivo: a.situacionProductivaActual,
                      ultimoParto: a.ultimoParto,
                      ultimoServicio: a.ultimoServicio,
                      reproductor: a.reproductor,
                      fechaProximoParto: a.proximoParto,
                      fechaProximoSecado: a.fechaProximoSecado,
                      diasParida: a.diasParida
                    })
                  }
                  title="Haga click para ver la ficha del animal"
                >
                  {isColVisible('practico') && (
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{a.practico}</td>
                  )}
                  {isColVisible('especie') && (
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                        <span>
                          {a.especie === 'Aves de corral' ? '🐔' :
                           a.especie === 'Porcinos' ? '🐷' :
                           a.especie === 'Búfalos' ? '🐃' :
                           a.especie === 'Caprinos' ? '🐐' :
                           a.especie === 'Equinos' ? '🐴' : '🐮'}
                        </span>
                        <span>{a.especie || 'Bovinos'}</span>
                      </span>
                    </td>
                  )}
                  {isColVisible('unico') && <td>{a.unico}</td>}
                  {isColVisible('categoria') && <td>{a.categoria}</td>}
                  {isColVisible('estatus') && (
                    <td>
                      <span className={`badge-status ${a.estatus.toLowerCase()}`}>
                        {a.estatus}
                      </span>
                    </td>
                  )}
                  {isColVisible('situacionReproductivaActual') && (
                    <td>
                      <span className={`badge-repro ${a.situacionReproductivaActual.toLowerCase().replace(' ', '-')}`}>
                        {a.situacionReproductivaActual}
                      </span>
                    </td>
                  )}
                  {isColVisible('situacionProductivaActual') && (
                    <td>
                      <span style={{ fontWeight: 600, color: '#166534' }}>{a.situacionProductivaActual}</span>
                    </td>
                  )}
                  {isColVisible('lote') && (
                    <td>
                      <span style={{ fontWeight: 600, color: '#166534' }}>{a.lote}</span>
                    </td>
                  )}
                  {isColVisible('ultimoParto') && <td>{a.ultimoParto}</td>}
                  {isColVisible('numeroParto') && <td>{a.numeroParto}</td>}
                  {isColVisible('ultimoServicio') && <td>{a.ultimoServicio || '-'}</td>}
                  {isColVisible('reproductor') && <td>{a.reproductor || '-'}</td>}
                  {isColVisible('diasParida') && <td>{a.diasParida} días</td>}
                  {isColVisible('diasAbiertos') && (
                    <td>
                      <span className={`badge-efficiency ${calculateDiasAbiertos(a) <= 110 ? 'high' : calculateDiasAbiertos(a) <= 150 ? 'medium' : 'low'}`}>
                        {calculateDiasAbiertos(a)} días
                      </span>
                    </td>
                  )}
                  {isColVisible('diasServida') && <td>{a.diasServida !== undefined ? `${a.diasServida} días` : '-'}</td>}
                  {isColVisible('proximoParto') && (
                    <td style={{ fontWeight: 600, color: a.proximoParto ? '#2563eb' : 'inherit' }}>
                      {a.proximoParto || '-'}
                    </td>
                  )}
                  {isColVisible('fechaProximoSecado') && (
                    <td style={{ fontWeight: 600, color: '#d97706' }}>{a.fechaProximoSecado || '-'}</td>
                  )}
                  {isColVisible('diasEnProduccion') && (
                    <td>
                      <span className="badge-efficiency medium">{a.diasEnProduccion} días</span>
                    </td>
                  )}
                  {isColVisible('diasSeca') && <td>{a.diasSeca !== undefined ? `${a.diasSeca} días` : '-'}</td>}
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
      <LactandoFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() =>
          setFilters({
            diasProduccionMaximo: undefined,
            estatus: ['Activo'] as EstatusAnimal[],
            lotes: Array.from(new Set(animales.map(a => a.lote)))
          })
        }
        lotesDisponibles={allLotes}
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
