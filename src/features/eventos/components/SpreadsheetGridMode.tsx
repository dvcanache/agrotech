import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  Milk, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  HelpCircle,
  Users,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { EventoItem } from './NuevoEventoModal';
import './eventosSpreadsheet.css';

export interface MilkRowData {
  id: string;
  arete: string;
  pesajeAm: number | '';
  pesajePm: number | '';
  grasa: number | '';
  rcs: number | '';
}

export interface WeightRowData {
  id: string;
  arete: string;
  pesoKg: number | '';
  condicion: number;
  observaciones: string;
}

interface SpreadsheetGridModeProps {
  onSaveBatch: (events: EventoItem[]) => void;
  onExit?: () => void;
}

export const SpreadsheetGridMode: React.FC<SpreadsheetGridModeProps> = ({ onSaveBatch }) => {
  const { animals, updateAnimal } = useApp();
  const [activeTab, setActiveTab] = useState<'leche' | 'peso'>('leche');
  const [selectedLoteToPopulate, setSelectedLoteToPopulate] = useState<string>('01');
  const [batchSaveResult, setBatchSaveResult] = useState<{ count: number; total: number; average: number } | null>(null);

  // Available lots
  const availableLotes = useMemo(() => {
    const lotes = new Set<string>();
    animals.forEach(a => {
      if (a.lote) lotes.add(a.lote);
    });
    return Array.from(lotes);
  }, [animals]);

  // Initial Milk Rows
  const [milkRows, setMilkRows] = useState<MilkRowData[]>([
    { id: 'm-1', arete: '0001', pesajeAm: 7.8, pesajePm: 6.4, grasa: 3.8, rcs: 145 },
    { id: 'm-2', arete: '0002', pesajeAm: 6.5, pesajePm: 5.9, grasa: 3.6, rcs: 220 },
    { id: 'm-3', arete: '0003', pesajeAm: 8.2, pesajePm: 7.1, grasa: 4.1, rcs: 110 },
    { id: 'm-4', arete: '0004', pesajeAm: 5.5, pesajePm: 5.2, grasa: 3.5, rcs: 180 },
    { id: 'm-5', arete: '0005', pesajeAm: 9.0, pesajePm: 8.4, grasa: 3.9, rcs: 160 },
  ]);

  // Initial Weight Rows
  const [weightRows, setWeightRows] = useState<WeightRowData[]>([
    { id: 'w-1', arete: 'BCA01', pesoKg: 185, condicion: 3.25, observaciones: 'Desarrollo óptimo' },
    { id: 'w-2', arete: 'BCA02', pesoKg: 178, condicion: 3.0, observaciones: 'Ganancia sostenida' },
    { id: 'w-3', arete: 'BCA03', pesoKg: 192, condicion: 3.5, observaciones: 'Lote de recría' },
    { id: 'w-4', arete: '0001', pesoKg: 465, condicion: 3.25, observaciones: 'Condición post-parto' },
  ]);

  // Animal Map for quick validation and lookup
  const animalsByTag = useMemo(() => {
    const map = new Map<string, typeof animals[0]>();
    animals.forEach(a => map.set(a.practico.toUpperCase(), a));
    return map;
  }, [animals]);

  // Milk Stats
  const milkStats = useMemo(() => {
    let totalKg = 0;
    let countedCows = 0;
    let rcsAlerts = 0;

    milkRows.forEach(r => {
      const am = typeof r.pesajeAm === 'number' ? r.pesajeAm : 0;
      const pm = typeof r.pesajePm === 'number' ? r.pesajePm : 0;
      const total = am + pm;
      if (total > 0 && r.arete.trim()) {
        totalKg += total;
        countedCows++;
      }
      if (typeof r.rcs === 'number' && r.rcs > 200) {
        rcsAlerts++;
      }
    });

    const averageKg = countedCows > 0 ? totalKg / countedCows : 0;
    return { totalKg, countedCows, averageKg, rcsAlerts };
  }, [milkRows]);

  // Weight Stats
  const weightStats = useMemo(() => {
    let totalKg = 0;
    let countedCows = 0;

    weightRows.forEach(r => {
      const p = typeof r.pesoKg === 'number' ? r.pesoKg : 0;
      if (p > 0 && r.arete.trim()) {
        totalKg += p;
        countedCows++;
      }
    });

    const averageKg = countedCows > 0 ? totalKg / countedCows : 0;
    return { totalKg, countedCows, averageKg };
  }, [weightRows]);

  // Key Navigation helper
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number,
    totalRows: number,
    totalCols: number,
    isLastRow: boolean
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isLastRow) {
        // Auto-add new row when pressing Enter on the last row
        if (activeTab === 'leche') {
          addMilkRow();
        } else {
          addWeightRow();
        }
        // Focus the same column on the newly created row after state updates
        setTimeout(() => {
          const nextInput = document.getElementById(`cell-${activeTab}-${rowIndex + 1}-${colIndex}`);
          nextInput?.focus();
        }, 30);
      } else {
        // Move to the next row in the same column
        const nextInput = document.getElementById(`cell-${activeTab}-${rowIndex + 1}-${colIndex}`);
        nextInput?.focus();
      }
    } else if (e.key === 'ArrowDown') {
      if (rowIndex < totalRows - 1) {
        e.preventDefault();
        const nextInput = document.getElementById(`cell-${activeTab}-${rowIndex + 1}-${colIndex}`);
        nextInput?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      if (rowIndex > 0) {
        e.preventDefault();
        const prevInput = document.getElementById(`cell-${activeTab}-${rowIndex - 1}-${colIndex}`);
        prevInput?.focus();
      }
    }
  };

  // Add Row Handlers
  const addMilkRow = () => {
    setMilkRows(prev => [
      ...prev,
      { id: `m-${Date.now()}-${Math.random()}`, arete: '', pesajeAm: '', pesajePm: '', grasa: '', rcs: '' }
    ]);
  };

  const addWeightRow = () => {
    setWeightRows(prev => [
      ...prev,
      { id: `w-${Date.now()}-${Math.random()}`, arete: '', pesoKg: '', condicion: 3.0, observaciones: '' }
    ]);
  };

  // Populate Entire Lot
  const handlePopulateLote = () => {
    const lotAnimals = animals.filter(a => a.lote === selectedLoteToPopulate && a.estatus === 'Activo');
    if (lotAnimals.length === 0) return;

    if (activeTab === 'leche') {
      const newRows: MilkRowData[] = lotAnimals.map((a, idx) => ({
        id: `m-pop-${a.practico}-${idx}-${Date.now()}`,
        arete: a.practico,
        pesajeAm: a.ultimoPesajeLeche ? Math.round((a.ultimoPesajeLeche * 0.55) * 10) / 10 : 7.0,
        pesajePm: a.ultimoPesajeLeche ? Math.round((a.ultimoPesajeLeche * 0.45) * 10) / 10 : 6.0,
        grasa: 3.8,
        rcs: 150
      }));
      setMilkRows(newRows);
    } else {
      const newRows: WeightRowData[] = lotAnimals.map((a, idx) => ({
        id: `w-pop-${a.practico}-${idx}-${Date.now()}`,
        arete: a.practico,
        pesoKg: a.pesoKg || (a.categoria === 'Vaca' ? 460 : a.categoria === 'Becerra' ? 180 : 320),
        condicion: 3.25,
        observaciones: `Pesaje ordinario Lote ${selectedLoteToPopulate}`
      }));
      setWeightRows(newRows);
    }
  };

  // Clean empty rows
  const handleCleanEmptyRows = () => {
    if (activeTab === 'leche') {
      setMilkRows(prev => prev.filter(r => r.arete.trim().length > 0));
    } else {
      setWeightRows(prev => prev.filter(r => r.arete.trim().length > 0));
    }
  };

  // Batch Save
  const handleSaveBatch = () => {
    const today = new Date().toLocaleDateString('es-ES');
    const createdEvents: EventoItem[] = [];

    if (activeTab === 'leche') {
      let savedCount = 0;
      let totalSavedKg = 0;

      milkRows.forEach(r => {
        const arete = r.arete.trim().toUpperCase();
        if (!arete) return;

        const am = typeof r.pesajeAm === 'number' ? r.pesajeAm : 0;
        const pm = typeof r.pesajePm === 'number' ? r.pesajePm : 0;
        const total = am + pm;

        if (total > 0) {
          savedCount++;
          totalSavedKg += total;

          // Update animal state
          updateAnimal(arete, {
            ultimoPesajeLeche: total
          });

          // Create event
          createdEvents.push({
            id: `ev-milk-${arete}-${Date.now()}-${savedCount}`,
            fecha: today,
            codigoAnimal: arete,
            categoria: 'Productivos',
            tipoEvento: 'Pesajes de leche',
            vencimiento: `Próximo control lechero en 15 días (${total.toFixed(1)} kg)`,
            tecnico: 'Control Lechero Masivo',
            observaciones: `AM: ${am} kg | PM: ${pm} kg | Total: ${total.toFixed(1)} kg ${r.grasa ? `| Grasa: ${r.grasa}%` : ''} ${r.rcs ? `| RCS: ${r.rcs}k` : ''}`
          });
        }
      });

      if (createdEvents.length > 0) {
        onSaveBatch(createdEvents);
        setBatchSaveResult({
          count: savedCount,
          total: Math.round(totalSavedKg * 10) / 10,
          average: Math.round((totalSavedKg / savedCount) * 10) / 10
        });
      }
    } else {
      let savedCount = 0;
      let totalSavedKg = 0;

      weightRows.forEach(r => {
        const arete = r.arete.trim().toUpperCase();
        if (!arete) return;

        const p = typeof r.pesoKg === 'number' ? r.pesoKg : 0;
        if (p > 0) {
          savedCount++;
          totalSavedKg += p;

          // Update animal state
          updateAnimal(arete, {
            pesoKg: p
          });

          // Create event
          createdEvents.push({
            id: `ev-weight-${arete}-${Date.now()}-${savedCount}`,
            fecha: today,
            codigoAnimal: arete,
            categoria: 'Productivos',
            tipoEvento: 'Crecimientos',
            vencimiento: 'Pesaje bimestral en 60 días',
            tecnico: 'Báscula de Corral',
            observaciones: `Peso: ${p} kg | Condición: ${r.condicion} ${r.observaciones ? `| ${r.observaciones}` : ''}`
          });
        }
      });

      if (createdEvents.length > 0) {
        onSaveBatch(createdEvents);
        setBatchSaveResult({
          count: savedCount,
          total: totalSavedKg,
          average: Math.round((totalSavedKg / savedCount) * 10) / 10
        });
      }
    }
  };

  return (
    <div className="spreadsheet-container">
      {/* Live KPIs Header */}
      <div className="spreadsheet-kpi-bar">
        <div className="spreadsheet-kpi-card">
          <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#e8f5e9', color: '#2d6a4f' }}>
            <Users size={22} />
          </div>
          <div className="spreadsheet-kpi-info">
            <span className="spreadsheet-kpi-label">Animales en Planilla</span>
            <span className="spreadsheet-kpi-value">
              {activeTab === 'leche' ? milkStats.countedCows : weightStats.countedCows}
            </span>
            <span className="spreadsheet-kpi-sub">
              {activeTab === 'leche' ? `${milkRows.length} filas totales` : `${weightRows.length} filas totales`}
            </span>
          </div>
        </div>

        <div className="spreadsheet-kpi-card">
          <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            {activeTab === 'leche' ? <Milk size={22} /> : <Scale size={22} />}
          </div>
          <div className="spreadsheet-kpi-info">
            <span className="spreadsheet-kpi-label">
              {activeTab === 'leche' ? 'Producción Total Acumulada' : 'Biomasa Total Registrada'}
            </span>
            <span className="spreadsheet-kpi-value">
              {activeTab === 'leche' ? `${milkStats.totalKg.toFixed(1)} kg` : `${weightStats.totalKg.toLocaleString()} kg`}
            </span>
            <span className="spreadsheet-kpi-sub" style={{ color: '#2563eb' }}>
              {activeTab === 'leche' ? `AM + PM de la jornada` : `Báscula en vivo`}
            </span>
          </div>
        </div>

        <div className="spreadsheet-kpi-card">
          <div className="spreadsheet-kpi-icon" style={{ backgroundColor: '#fdf2f8', color: '#db2777' }}>
            <TrendingUp size={22} />
          </div>
          <div className="spreadsheet-kpi-info">
            <span className="spreadsheet-kpi-label">
              {activeTab === 'leche' ? 'Promedio por Vaca' : 'Peso Promedio'}
            </span>
            <span className="spreadsheet-kpi-value">
              {activeTab === 'leche' ? `${milkStats.averageKg.toFixed(1)} kg/vaca` : `${weightStats.averageKg.toFixed(1)} kg`}
            </span>
            <span className="spreadsheet-kpi-sub" style={{ color: '#db2777' }}>
              {activeTab === 'leche' ? 'Estándar doble propósito' : 'Ponderado del lote'}
            </span>
          </div>
        </div>

        {activeTab === 'leche' && (
          <div className="spreadsheet-kpi-card">
            <div className="spreadsheet-kpi-icon" style={{ backgroundColor: milkStats.rcsAlerts > 0 ? '#fffbeb' : '#f0fdf4', color: milkStats.rcsAlerts > 0 ? '#d97706' : '#16a34a' }}>
              <AlertTriangle size={22} />
            </div>
            <div className="spreadsheet-kpi-info">
              <span className="spreadsheet-kpi-label">Alertas RCS (&gt;200k)</span>
              <span className="spreadsheet-kpi-value" style={{ color: milkStats.rcsAlerts > 0 ? '#d97706' : '#16a34a' }}>
                {milkStats.rcsAlerts} {milkStats.rcsAlerts === 1 ? 'vaca' : 'vacas'}
              </span>
              <span className="spreadsheet-kpi-sub" style={{ color: milkStats.rcsAlerts > 0 ? '#d97706' : '#16a34a' }}>
                {milkStats.rcsAlerts > 0 ? 'Sospecha de Mastitis' : 'Sanidad óptima'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Mode Selector & Bulk Actions Toolbar */}
      <div className="spreadsheet-toolbar">
        {/* Mode Switcher */}
        <div className="spreadsheet-tabs">
          <button
            type="button"
            className={`spreadsheet-tab-btn ${activeTab === 'leche' ? 'active' : ''}`}
            onClick={() => setActiveTab('leche')}
          >
            <Milk size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Control Lechero (AM / PM)
          </button>
          <button
            type="button"
            className={`spreadsheet-tab-btn ${activeTab === 'peso' ? 'active' : ''}`}
            onClick={() => setActiveTab('peso')}
          >
            <Scale size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Control Ponderal (Pesajes & CC)
          </button>
        </div>

        {/* Batch Operations */}
        <div className="spreadsheet-actions-group">
          {/* Lote Selector & Populate */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Precargar Lote:</span>
            <select
              className="form-select"
              value={selectedLoteToPopulate}
              onChange={e => setSelectedLoteToPopulate(e.target.value)}
              style={{ height: 32, fontSize: 12, padding: '2px 8px' }}
            >
              {availableLotes.map(l => (
                <option key={l} value={l}>Lote {l}</option>
              ))}
            </select>
            <button
              type="button"
              className="btn-secondary"
              onClick={handlePopulateLote}
              title="Cargar automáticamente todos los animales del lote seleccionado"
              style={{ display: 'flex', alignItems: 'center', gap: 5, height: 32, fontSize: 12, padding: '0 10px' }}
            >
              <Sparkles size={14} color="#2d6a4f" />
              <span>Precargar</span>
            </button>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleCleanEmptyRows}
            title="Eliminar filas que no tengan arete ingresado"
            style={{ height: 32, fontSize: 12, padding: '0 10px' }}
          >
            Limpiar Vacías
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={activeTab === 'leche' ? addMilkRow : addWeightRow}
            style={{ display: 'flex', alignItems: 'center', gap: 5, height: 32, fontSize: 12, padding: '0 12px' }}
          >
            <Plus size={15} />
            <span>Agregar Fila</span>
          </button>

          {/* Batch Save Button */}
          <button
            type="button"
            className="btn-primary"
            onClick={handleSaveBatch}
            style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, fontSize: 12, padding: '0 16px' }}
          >
            <Save size={15} />
            <span>Guardar {activeTab === 'leche' ? `${milkStats.countedCows} Pesajes` : `${weightStats.countedCows} Pesajes`}</span>
          </button>
        </div>
      </div>

      {/* Batch Save Success Modal / Banner */}
      {batchSaveResult && (
        <div className="withdrawal-warning-banner" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
          <CheckCircle2 size={20} color="#16a34a" />
          <div style={{ flex: 1 }}>
            <strong>¡Lote guardado con éxito!</strong> Se registraron {batchSaveResult.count} pesajes en base de datos.
            <span style={{ marginLeft: 8, fontSize: 12, color: '#15803d' }}>
              (Total: {batchSaveResult.total} kg | Promedio: {batchSaveResult.average} kg/animal)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setBatchSaveResult(null)}
            style={{ color: '#15803d', fontWeight: 700, fontSize: 14 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Spreadsheet Grid Table */}
      <div className="spreadsheet-table-wrapper">
        {activeTab === 'leche' ? (
          <table className="spreadsheet-table">
            <thead>
              <tr>
                <th style={{ width: 45, textAlign: 'center' }}>#</th>
                <th style={{ width: 140 }}>Arete / Código</th>
                <th style={{ width: 180 }}>Semoviente</th>
                <th style={{ width: 110, textAlign: 'right' }}>Pesaje AM (kg)</th>
                <th style={{ width: 110, textAlign: 'right' }}>Pesaje PM (kg)</th>
                <th style={{ width: 110, textAlign: 'right' }}>Total Día (kg)</th>
                <th style={{ width: 100, textAlign: 'right' }}>Grasa (%)</th>
                <th style={{ width: 110, textAlign: 'right' }}>RCS (x10³)</th>
                <th style={{ width: 140 }}>Estado</th>
                <th style={{ width: 50, textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {milkRows.map((row, idx) => {
                const areteClean = row.arete.trim().toUpperCase();
                const animal = animalsByTag.get(areteClean);
                const am = typeof row.pesajeAm === 'number' ? row.pesajeAm : 0;
                const pm = typeof row.pesajePm === 'number' ? row.pesajePm : 0;
                const totalDia = am + pm;
                const hasRcsAlert = typeof row.rcs === 'number' && row.rcs > 200;

                return (
                  <tr key={row.id}>
                    <td style={{ textAlign: 'center', color: '#94a3b8', fontSize: 11, fontWeight: 600 }}>
                      {idx + 1}
                    </td>
                    <td>
                      <input
                        id={`cell-leche-${idx}-0`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="ej. 0001"
                        value={row.arete}
                        onChange={e => {
                          const val = e.target.value;
                          setMilkRows(prev => prev.map(r => r.id === row.id ? { ...r, arete: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, idx, 0, milkRows.length, 5, idx === milkRows.length - 1)}
                        style={{ fontWeight: 600, textTransform: 'uppercase' }}
                      />
                    </td>
                    <td>
                      {animal ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, fontSize: 12, color: '#1e293b' }}>
                            {animal.categoria} • {animal.lote ? `Lote ${animal.lote}` : 'Sin lote'}
                          </span>
                          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                            {animal.composicion || 'Mestizo'}
                          </span>
                        </div>
                      ) : areteClean ? (
                        <span style={{ fontSize: 11, color: '#ef4444' }}>No registrado</span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                    <td>
                      <input
                        id={`cell-leche-${idx}-1`}
                        type="number"
                        step="0.1"
                        className="spreadsheet-input num"
                        placeholder="0.0"
                        value={row.pesajeAm}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setMilkRows(prev => prev.map(r => r.id === row.id ? { ...r, pesajeAm: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, idx, 1, milkRows.length, 5, idx === milkRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-leche-${idx}-2`}
                        type="number"
                        step="0.1"
                        className="spreadsheet-input num"
                        placeholder="0.0"
                        value={row.pesajePm}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setMilkRows(prev => prev.map(r => r.id === row.id ? { ...r, pesajePm: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, idx, 2, milkRows.length, 5, idx === milkRows.length - 1)}
                      />
                    </td>
                    <td>
                      <span className="spreadsheet-cell-computed">
                        {totalDia > 0 ? totalDia.toFixed(1) : '-'}
                      </span>
                    </td>
                    <td>
                      <input
                        id={`cell-leche-${idx}-3`}
                        type="number"
                        step="0.1"
                        className="spreadsheet-input num"
                        placeholder="3.8"
                        value={row.grasa}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setMilkRows(prev => prev.map(r => r.id === row.id ? { ...r, grasa: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, idx, 3, milkRows.length, 5, idx === milkRows.length - 1)}
                      />
                    </td>
                    <td>
                      <input
                        id={`cell-leche-${idx}-4`}
                        type="number"
                        step="10"
                        className={`spreadsheet-input num ${hasRcsAlert ? 'text-amber-600 font-bold' : ''}`}
                        placeholder="150"
                        value={row.rcs}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                          setMilkRows(prev => prev.map(r => r.id === row.id ? { ...r, rcs: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, idx, 4, milkRows.length, 5, idx === milkRows.length - 1)}
                      />
                    </td>
                    <td>
                      {hasRcsAlert ? (
                        <span className="badge-status-pill warning" title="RCS superior a 200,000 cel/ml">
                          ⚠️ RCS Alto
                        </span>
                      ) : totalDia > 0 && animal ? (
                        <span className="badge-status-pill valid">
                          ✓ Válido
                        </span>
                      ) : !areteClean ? (
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>Vacía</span>
                      ) : (
                        <span className="badge-status-pill danger">Incompleto</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setMilkRows(prev => prev.filter(r => r.id !== row.id))}
                        style={{ color: '#94a3b8', padding: 4 }}
                        title="Eliminar fila"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <table className="spreadsheet-table">
            <thead>
              <tr>
                <th style={{ width: 45, textAlign: 'center' }}>#</th>
                <th style={{ width: 140 }}>Arete / Código</th>
                <th style={{ width: 180 }}>Semoviente</th>
                <th style={{ width: 130, textAlign: 'right' }}>Peso Actual (kg)</th>
                <th style={{ width: 130, textAlign: 'right' }}>Condición Corporal</th>
                <th style={{ width: 260 }}>Observaciones / Crecimiento</th>
                <th style={{ width: 120 }}>Estado</th>
                <th style={{ width: 50, textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {weightRows.map((row, idx) => {
                const areteClean = row.arete.trim().toUpperCase();
                const animal = animalsByTag.get(areteClean);
                const hasWeight = typeof row.pesoKg === 'number' && row.pesoKg > 0;

                return (
                  <tr key={row.id}>
                    <td style={{ textAlign: 'center', color: '#94a3b8', fontSize: 11, fontWeight: 600 }}>
                      {idx + 1}
                    </td>
                    <td>
                      <input
                        id={`cell-peso-${idx}-0`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="ej. BCA01"
                        value={row.arete}
                        onChange={e => {
                          const val = e.target.value;
                          setWeightRows(prev => prev.map(r => r.id === row.id ? { ...r, arete: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, idx, 0, weightRows.length, 3, idx === weightRows.length - 1)}
                        style={{ fontWeight: 600, textTransform: 'uppercase' }}
                      />
                    </td>
                    <td>
                      {animal ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, fontSize: 12, color: '#1e293b' }}>
                            {animal.categoria} • {animal.lote ? `Lote ${animal.lote}` : 'Sin lote'}
                          </span>
                          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                            {animal.composicion || 'Mestizo'}
                          </span>
                        </div>
                      ) : areteClean ? (
                        <span style={{ fontSize: 11, color: '#ef4444' }}>No registrado</span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                    <td>
                      <input
                        id={`cell-peso-${idx}-1`}
                        type="number"
                        step="1"
                        className="spreadsheet-input num"
                        placeholder="kg"
                        value={row.pesoKg}
                        onChange={e => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setWeightRows(prev => prev.map(r => r.id === row.id ? { ...r, pesoKg: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, idx, 1, weightRows.length, 3, idx === weightRows.length - 1)}
                      />
                    </td>
                    <td>
                      <select
                        className="spreadsheet-input"
                        value={row.condicion}
                        onChange={e => {
                          const val = parseFloat(e.target.value);
                          setWeightRows(prev => prev.map(r => r.id === row.id ? { ...r, condicion: val } : r));
                        }}
                        style={{ height: 32, fontSize: 12 }}
                      >
                        <option value="1.0">1.0 - Muy Flaca / Emaciada</option>
                        <option value="2.0">2.0 - Flaca</option>
                        <option value="2.5">2.5 - Regular</option>
                        <option value="3.0">3.0 - Óptima / Comercial</option>
                        <option value="3.25">3.25 - Buena Condición</option>
                        <option value="3.5">3.5 - Vigorosa</option>
                        <option value="4.0">4.0 - Gorda</option>
                        <option value="5.0">5.0 - Sobreengrasada</option>
                      </select>
                    </td>
                    <td>
                      <input
                        id={`cell-peso-${idx}-2`}
                        type="text"
                        className="spreadsheet-input"
                        placeholder="Notas zootécnicas..."
                        value={row.observaciones}
                        onChange={e => {
                          const val = e.target.value;
                          setWeightRows(prev => prev.map(r => r.id === row.id ? { ...r, observaciones: val } : r));
                        }}
                        onKeyDown={e => handleKeyDown(e, idx, 2, weightRows.length, 3, idx === weightRows.length - 1)}
                      />
                    </td>
                    <td>
                      {hasWeight && animal ? (
                        <span className="badge-status-pill valid">
                          ✓ Válido
                        </span>
                      ) : !areteClean ? (
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>Vacía</span>
                      ) : (
                        <span className="badge-status-pill danger">Incompleto</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setWeightRows(prev => prev.filter(r => r.id !== row.id))}
                        style={{ color: '#94a3b8', padding: 4 }}
                        title="Eliminar fila"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Spreadsheet Keyboard Navigation Help Footer */}
      <div className="spreadsheet-kbd-footer">
        <div className="spreadsheet-kbd-shortcuts">
          <span style={{ fontWeight: 600, color: '#334155' }}>Atajos de Teclado:</span>
          <div className="spreadsheet-shortcut-item">
            <span className="quick-action-kbd">Enter</span>
            <span>Bajar a siguiente celda / Añadir fila al final</span>
          </div>
          <div className="spreadsheet-shortcut-item">
            <span className="quick-action-kbd">Tab</span>
            <span>Avanzar a siguiente columna</span>
          </div>
          <div className="spreadsheet-shortcut-item">
            <span className="quick-action-kbd">↑ / ↓</span>
            <span>Navegación vertical rápida</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontWeight: 600 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
          <span>Modo Manga Alta Velocidad Activo</span>
        </div>
      </div>
    </div>
  );
};
