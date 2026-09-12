import React, { useState, useMemo } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  Trash2,
  Download,
  Printer,
  Save,
  Filter,
  Layers,
  ArrowUpDown,
  Calculator,
  Eye,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Sparkles,
  Milk,
  Activity,
  MapPin,
  ListFilter
} from 'lucide-react';
import {
  ADHOC_ENTITIES,
  BaseEntityType,
  ColumnDefinition
} from './adhocData';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import { ReporteItem } from './NuevoReporteModal';

export interface FilterRule {
  id: string;
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'between';
  value: string;
  value2?: string;
  connector: 'AND' | 'OR';
}

interface ColumnConfigItem {
  key: string;
  customLabel: string;
  selected: boolean;
  isCalculated: boolean;
}

interface AdHocReportDesignerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveReport?: (reporte: ReporteItem) => void;
}

export const AdHocReportDesignerModal: React.FC<AdHocReportDesignerModalProps> = ({
  isOpen,
  onClose,
  onSaveReport
}) => {
  // Paso actual (1: Entidad, 2: Columnas, 3: Filtros, 4: Agrupación & Totales)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Paso 1: Entidad Base
  const [selectedEntity, setSelectedEntity] = useState<BaseEntityType>('semovientes');

  // Configuración de la entidad actual
  const currentEntityConfig = ADHOC_ENTITIES[selectedEntity];

  // Paso 2: Columnas seleccionadas y encabezados personalizados
  const [columnsConfig, setColumnsConfig] = useState<Record<string, ColumnConfigItem>>(() => {
    const initial: Record<string, ColumnConfigItem> = {};
    currentEntityConfig.columns.forEach(col => {
      initial[col.key] = {
        key: col.key,
        customLabel: col.label,
        selected: currentEntityConfig.defaultColumns.includes(col.key),
        isCalculated: !!col.isCalculated
      };
    });
    return initial;
  });

  // Al cambiar la entidad base, reiniciar columnas y filtros
  const handleEntityChange = (newEntity: BaseEntityType) => {
    setSelectedEntity(newEntity);
    const config = ADHOC_ENTITIES[newEntity];
    const newCols: Record<string, ColumnConfigItem> = {};
    config.columns.forEach(col => {
      newCols[col.key] = {
        key: col.key,
        customLabel: col.label,
        selected: config.defaultColumns.includes(col.key),
        isCalculated: !!col.isCalculated
      };
    });
    setColumnsConfig(newCols);
    setFilterRules([]);
    setGroupBy('none');
    setSortField(config.columns[0].key);
  };

  // Paso 3: Reglas de Filtros Visuales
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);

  // Paso 4: Agrupación y Ordenamiento
  const [groupBy, setGroupBy] = useState<string>('none');
  const [sortField, setSortField] = useState<string>('arete');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [summaryTotals, setSummaryTotals] = useState<{
    sum: boolean;
    avg: boolean;
    min: boolean;
    max: boolean;
  }>({
    sum: true,
    avg: true,
    min: false,
    max: false
  });

  // Metadata de la Plantilla para Guardar
  const [templateCode, setTemplateCode] = useState(`RPT-BI-${Math.floor(100 + Math.random() * 900)}`);
  const [templateName, setTemplateName] = useState('Reporte Personalizado de Producción y Lotes');
  const [templateDesc, setTemplateDesc] = useState('Informe analítico ad-hoc generado con el Diseñador BI.');
  const [templateFrequency, setTemplateFrequency] = useState('Bajo demanda');

  // Procesamiento y cómputo de datos en vivo con campos calculados
  const enrichedData = useMemo(() => {
    return currentEntityConfig.data.map(row => {
      const computedRow = { ...row };
      currentEntityConfig.columns.forEach(col => {
        if (col.isCalculated && col.compute) {
          computedRow[col.key] = col.compute(row);
        }
      });
      return computedRow;
    });
  }, [currentEntityConfig]);

  // Aplicación de Filtros
  const filteredData = useMemo(() => {
    if (filterRules.length === 0) return enrichedData;

    return enrichedData.filter(row => {
      // Evaluar secuencialmente con conectores AND / OR
      let currentResult = true;

      filterRules.forEach((rule, idx) => {
        const val = row[rule.field];
        let ruleMatches = false;

        const stringVal = String(val ?? '').toLowerCase();
        const ruleVal = String(rule.value ?? '').toLowerCase();
        const numVal = typeof val === 'number' ? val : parseFloat(val);
        const ruleNum = parseFloat(rule.value);
        const ruleNum2 = rule.value2 !== undefined ? parseFloat(rule.value2) : NaN;

        switch (rule.operator) {
          case '=':
            ruleMatches = stringVal === ruleVal;
            break;
          case '!=':
            ruleMatches = stringVal !== ruleVal;
            break;
          case 'contains':
            ruleMatches = stringVal.includes(ruleVal);
            break;
          case '>':
            ruleMatches = !isNaN(numVal) && !isNaN(ruleNum) && numVal > ruleNum;
            break;
          case '<':
            ruleMatches = !isNaN(numVal) && !isNaN(ruleNum) && numVal < ruleNum;
            break;
          case '>=':
            ruleMatches = !isNaN(numVal) && !isNaN(ruleNum) && numVal >= ruleNum;
            break;
          case '<=':
            ruleMatches = !isNaN(numVal) && !isNaN(ruleNum) && numVal <= ruleNum;
            break;
          case 'between':
            ruleMatches = !isNaN(numVal) && !isNaN(ruleNum) && !isNaN(ruleNum2) && numVal >= ruleNum && numVal <= ruleNum2;
            break;
          default:
            ruleMatches = true;
        }

        if (idx === 0) {
          currentResult = ruleMatches;
        } else {
          const prevRule = filterRules[idx - 1];
          if (prevRule.connector === 'OR') {
            currentResult = currentResult || ruleMatches;
          } else {
            currentResult = currentResult && ruleMatches;
          }
        }
      });

      return currentResult;
    });
  }, [enrichedData, filterRules]);

  // Aplicación de Ordenamiento
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'asc'
        ? String(valA || '').localeCompare(String(valB || ''))
        : String(valB || '').localeCompare(String(valA || ''));
    });
  }, [filteredData, sortField, sortOrder]);

  // Lista de columnas visibles activas
  const activeColumns = useMemo(() => {
    return currentEntityConfig.columns.filter(col => columnsConfig[col.key]?.selected);
  }, [currentEntityConfig, columnsConfig]);

  // Datos agrupados si groupBy !== 'none'
  const groupedData = useMemo(() => {
    if (groupBy === 'none') {
      return [{ groupKey: 'Todos', items: sortedData }];
    }

    const groupsMap = new Map<string, any[]>();
    sortedData.forEach(item => {
      const key = String(item[groupBy] || 'Sin especificar');
      if (!groupsMap.has(key)) {
        groupsMap.set(key, []);
      }
      groupsMap.get(key)!.push(item);
    });

    return Array.from(groupsMap.entries()).map(([groupKey, items]) => ({
      groupKey,
      items
    }));
  }, [sortedData, groupBy]);

  // Cálculos de resumen total
  const numericColumns = useMemo(() => {
    return activeColumns.filter(c => c.type === 'number');
  }, [activeColumns]);

  const grandTotals = useMemo(() => {
    const res: Record<string, { sum: number; avg: number; min: number; max: number }> = {};
    numericColumns.forEach(col => {
      const vals = sortedData.map(r => r[col.key]).filter(v => typeof v === 'number' && !isNaN(v));
      if (vals.length > 0) {
        const sum = vals.reduce((acc, v) => acc + v, 0);
        res[col.key] = {
          sum: parseFloat(sum.toFixed(2)),
          avg: parseFloat((sum / vals.length).toFixed(2)),
          min: Math.min(...vals),
          max: Math.max(...vals)
        };
      }
    });
    return res;
  }, [sortedData, numericColumns]);

  // Manejador de agregar regla de filtro
  const handleAddFilterRule = () => {
    const newRule: FilterRule = {
      id: String(Date.now()),
      field: currentEntityConfig.columns[0].key,
      operator: '=',
      value: '',
      connector: 'AND'
    };
    setFilterRules(prev => [...prev, newRule]);
  };

  const handleRemoveFilterRule = (id: string) => {
    setFilterRules(prev => prev.filter(r => r.id !== id));
  };

  const handleUpdateFilterRule = (id: string, updates: Partial<FilterRule>) => {
    setFilterRules(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  // Exportar a Excel (.xlsx / .csv)
  const handleExportXLSX = () => {
    const headers = activeColumns.map(c => columnsConfig[c.key]?.customLabel || c.label);
    const rows = sortedData.map(row => activeColumns.map(c => row[c.key]));
    exportToCSV(`reporte_adhoc_${selectedEntity}`, headers, rows);
  };

  // Exportar a PDF
  const handleExportPDF = () => {
    const headers = activeColumns.map(c => columnsConfig[c.key]?.customLabel || c.label);
    const rows = sortedData.map(row => activeColumns.map(c => row[c.key]));
    exportToPDF(
      `reporte_adhoc_${selectedEntity}`,
      templateName,
      headers,
      rows
    );
  };

  // Guardar plantilla
  const handleSaveTemplate = () => {
    const newReportItem: ReporteItem = {
      id: `adhoc-${Date.now()}`,
      codigo: templateCode,
      nombre: templateName,
      descripcion: templateDesc,
      categoria: 'Personalizado',
      plantillaBase: currentEntityConfig.title,
      formato: 'Diseñador BI (Ad-Hoc)',
      frecuencia: templateFrequency,
      fechaCreacion: new Date().toISOString().split('T')[0]
    };

    if (onSaveReport) {
      onSaveReport(newReportItem);
    }
    alert(`¡Plantilla "${templateName}" (${templateCode}) guardada con éxito en su Centro de Reportes!`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="adhoc-modal-backdrop" onClick={onClose}>
      <div className="adhoc-modal-window" onClick={e => e.stopPropagation()}>
        {/* Cabecera del Diseñador */}
        <div className="adhoc-header">
          <div className="adhoc-title-block">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calculator size={20} color="var(--primary-color)" />
              <h3>Diseñador de Reportes BI Ad-Hoc</h3>
              <span className="badge-category" style={{ backgroundColor: '#e8f5e9', color: 'var(--primary-color)' }}>
                Fase 5 NextGen
              </span>
            </div>
            <p>Construya consultas a medida, campos calculados, filtros multinivel y exporte a Excel o PDF</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: 6,
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper Navigation */}
        <div className="adhoc-stepper">
          <div
            className={`adhoc-step-item ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(1)}
          >
            <div className="adhoc-step-badge">1</div>
            <span>Entidad Base</span>
          </div>

          <div
            className={`adhoc-step-item ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(2)}
          >
            <div className="adhoc-step-badge">2</div>
            <span>Columnas & Fórmulas</span>
          </div>

          <div
            className={`adhoc-step-item ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(3)}
          >
            <div className="adhoc-step-badge">3</div>
            <span>Filtros Visuales ({filterRules.length})</span>
          </div>

          <div
            className={`adhoc-step-item ${currentStep === 4 ? 'active' : ''}`}
            onClick={() => setCurrentStep(4)}
          >
            <div className="adhoc-step-badge">4</div>
            <span>Agrupación & Vista Previa</span>
          </div>
        </div>

        {/* Cuerpo del Diseñador según el Paso */}
        <div className="adhoc-modal-body">
          {/* PASO 1: SELECCIÓN DE ENTIDAD BASE */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                  Seleccione la Entidad Base de Consulta
                </h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                  Elija la fuente de datos zootécnica sobre la cual construirá su reporte analítico.
                </p>
              </div>

              <div className="entity-selection-grid">
                {(Object.keys(ADHOC_ENTITIES) as BaseEntityType[]).map(key => {
                  const ent = ADHOC_ENTITIES[key];
                  const isSelected = selectedEntity === key;
                  return (
                    <div
                      key={key}
                      className={`entity-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleEntityChange(key)}
                    >
                      <div className="entity-icon-box">
                        {key === 'semovientes' && <CheckSquare size={22} />}
                        {key === 'lactancias' && <Milk size={22} />}
                        {key === 'controles_lecheros' && <FileSpreadsheet size={22} />}
                        {key === 'eventos_veterinarios' && <Activity size={22} />}
                        {key === 'potreros' && <MapPin size={22} />}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <strong style={{ fontSize: 14.5, color: 'var(--text-primary)' }}>{ent.title}</strong>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{ent.subtitle}</span>
                      </div>

                      <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                        {ent.description}
                      </p>

                      <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'var(--primary-color)', fontWeight: 600 }}>
                        <span>{ent.columns.length} campos disponibles</span>
                        <span>{ent.data.length} registros</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASO 2: SELECCIÓN DE COLUMNAS Y CAMPOS CALCULADOS */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                  Columnas, Encabezados y Campos Calculados ({currentEntityConfig.title})
                </h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                  Marque las columnas a incluir, renombre sus títulos si lo desea y active fórmulas zootécnicas automáticas.
                </p>
              </div>

              <div className="columns-builder-grid">
                {/* Panel 1: Columnas Estándar */}
                <div className="columns-panel-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>
                      Campos Nativos de la Entidad
                    </strong>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{ fontSize: 11.5, color: 'var(--primary-color)' }}
                        onClick={() => {
                          setColumnsConfig(prev => {
                            const updated = { ...prev };
                            Object.keys(updated).forEach(k => {
                              if (!updated[k].isCalculated) updated[k].selected = true;
                            });
                            return updated;
                          });
                        }}
                      >
                        Marcar Todos
                      </button>
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{ fontSize: 11.5, color: '#dc2626' }}
                        onClick={() => {
                          setColumnsConfig(prev => {
                            const updated = { ...prev };
                            Object.keys(updated).forEach(k => {
                              if (!updated[k].isCalculated) updated[k].selected = false;
                            });
                            return updated;
                          });
                        }}
                      >
                        Desmarcar
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 380, overflowY: 'auto' }}>
                    {currentEntityConfig.columns
                      .filter(c => !c.isCalculated)
                      .map(col => {
                        const isSelected = columnsConfig[col.key]?.selected ?? false;
                        const currentLabel = columnsConfig[col.key]?.customLabel ?? col.label;

                        return (
                          <div key={col.key} className="column-item-row">
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flex: 1 }}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={e => {
                                  setColumnsConfig(prev => ({
                                    ...prev,
                                    [col.key]: {
                                      ...prev[col.key],
                                      selected: e.target.checked
                                    }
                                  }));
                                }}
                                style={{ accentColor: 'var(--primary-color)', width: 16, height: 16 }}
                              />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {col.label}
                                </span>
                                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                                  Tipo: {col.type} • Clave: {col.key}
                                </span>
                              </div>
                            </label>

                            {isSelected && (
                              <input
                                type="text"
                                className="report-search-input"
                                value={currentLabel}
                                onChange={e => {
                                  const newVal = e.target.value;
                                  setColumnsConfig(prev => ({
                                    ...prev,
                                    [col.key]: {
                                      ...prev[col.key],
                                      customLabel: newVal
                                    }
                                  }));
                                }}
                                title="Editar título personalizado de columna"
                                style={{ width: 170, fontSize: 12, padding: '4px 8px' }}
                                placeholder="Encabezado..."
                              />
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Panel 2: Campos Calculados / Fórmulas */}
                <div className="columns-panel-box" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles size={16} color="var(--primary-color)" />
                    <strong style={{ fontSize: 13.5, color: '#166534' }}>
                      Campos Calculados & Fórmulas Automáticas
                    </strong>
                  </div>

                  <p style={{ fontSize: 12, color: '#15803d', margin: 0 }}>
                    Active indicadores biométricos y ratios automáticos derivados de la entidad base:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                    {currentEntityConfig.columns
                      .filter(c => c.isCalculated)
                      .map(col => {
                        const isSelected = columnsConfig[col.key]?.selected ?? false;
                        const currentLabel = columnsConfig[col.key]?.customLabel ?? col.label;

                        return (
                          <div
                            key={col.key}
                            style={{
                              background: '#ffffff',
                              border: isSelected ? '1.5px solid var(--primary-color)' : '1px solid #cbd5e1',
                              borderRadius: 8,
                              padding: 12,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 6
                            }}
                          >
                            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                              <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                                {col.label}
                              </span>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={e => {
                                  setColumnsConfig(prev => ({
                                    ...prev,
                                    [col.key]: {
                                      ...prev[col.key],
                                      selected: e.target.checked
                                    }
                                  }));
                                }}
                                style={{ accentColor: 'var(--primary-color)', width: 18, height: 18 }}
                              />
                            </label>

                            <span style={{ fontSize: 11.5, color: '#166534', background: '#e8f5e9', padding: '4px 8px', borderRadius: 4 }}>
                              📐 <strong>Fórmula:</strong> {col.formulaDescription}
                            </span>

                            {isSelected && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Alias:</span>
                                <input
                                  type="text"
                                  className="report-search-input"
                                  value={currentLabel}
                                  onChange={e => {
                                    const newVal = e.target.value;
                                    setColumnsConfig(prev => ({
                                      ...prev,
                                      [col.key]: {
                                        ...prev[col.key],
                                        customLabel: newVal
                                      }
                                    }));
                                  }}
                                  style={{ flex: 1, fontSize: 12, padding: '4px 8px' }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: CONSTRUCTOR VISUAL DE FILTROS */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                    Constructor Visual de Filtros Multinivel
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                    Restrinja el reporte a criterios específicos mediante operadores lógicos Y (AND) / O (OR).
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleAddFilterRule}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '7px 14px' }}
                >
                  <Plus size={15} />
                  <span>Agregar Filtro</span>
                </button>
              </div>

              {/* Lista de Reglas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filterRules.map((rule, idx) => (
                  <div key={rule.id} className="filter-rule-row">
                    {/* Campo */}
                    <select
                      className="form-control"
                      value={rule.field}
                      onChange={e => handleUpdateFilterRule(rule.id, { field: e.target.value })}
                      style={{ fontSize: 12.5 }}
                    >
                      {currentEntityConfig.columns.map(col => (
                        <option key={col.key} value={col.key}>
                          {col.label}
                        </option>
                      ))}
                    </select>

                    {/* Operador */}
                    <select
                      className="form-control"
                      value={rule.operator}
                      onChange={e => handleUpdateFilterRule(rule.id, { operator: e.target.value as any })}
                      style={{ fontSize: 12.5 }}
                    >
                      <option value="=">Igual a (=)</option>
                      <option value="!=">Diferente de (!=)</option>
                      <option value=">">Mayor que (&gt;)</option>
                      <option value="<">Menor que (&lt;)</option>
                      <option value=">=">Mayor o igual (&gt;=)</option>
                      <option value="<=">Menor o igual (&lt;=)</option>
                      <option value="contains">Contiene texto</option>
                      <option value="between">Entre rango</option>
                    </select>

                    {/* Valor(es) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Valor a comparar..."
                        value={rule.value}
                        onChange={e => handleUpdateFilterRule(rule.id, { value: e.target.value })}
                        style={{ fontSize: 12.5 }}
                      />
                      {rule.operator === 'between' && (
                        <>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>y</span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Valor máximo..."
                            value={rule.value2 || ''}
                            onChange={e => handleUpdateFilterRule(rule.id, { value2: e.target.value })}
                            style={{ fontSize: 12.5 }}
                          />
                        </>
                      )}
                    </div>

                    {/* Conector y Eliminar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {idx < filterRules.length - 1 && (
                        <select
                          className="form-control"
                          value={rule.connector}
                          onChange={e => handleUpdateFilterRule(rule.id, { connector: e.target.value as any })}
                          style={{ width: 80, fontSize: 12, fontWeight: 700 }}
                        >
                          <option value="AND">Y (AND)</option>
                          <option value="OR">O (OR)</option>
                        </select>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveFilterRule(rule.id)}
                        style={{
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          color: '#dc2626',
                          borderRadius: 6,
                          padding: 6,
                          cursor: 'pointer'
                        }}
                        title="Eliminar regla"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}

                {filterRules.length === 0 && (
                  <div style={{
                    background: '#ffffff',
                    border: '1px dashed #cbd5e1',
                    borderRadius: 10,
                    padding: 36,
                    textAlign: 'center',
                    color: 'var(--text-secondary)'
                  }}>
                    <Filter size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                    <h5 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Sin filtros activos</h5>
                    <p style={{ margin: '4px 0 12px 0', fontSize: 12.5 }}>
                      El reporte incluirá el 100% de los registros ({enrichedData.length} registros).
                    </p>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleAddFilterRule}
                      style={{ fontSize: 12.5 }}
                    >
                      <Plus size={14} />
                      <span>Agregar Primera Regla</span>
                    </button>
                  </div>
                )}
              </div>

              <div style={{
                background: '#e0f2fe',
                border: '1px solid #bae6fd',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 12.5,
                color: '#0369a1',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <Eye size={16} />
                <span>
                  Registros que cumplen el criterio actual: <strong>{filteredData.length}</strong> de {enrichedData.length} totales.
                </span>
              </div>
            </div>
          )}

          {/* PASO 4: AGRUPACIÓN, ORDENAMIENTO Y VISTA PREVIA */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Barra de Configuración de Agrupación, Orden y Totales */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-gray)',
                borderRadius: 10,
                padding: 16,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
                alignItems: 'center'
              }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                    Agrupar Registros Por:
                  </label>
                  <select
                    className="form-control"
                    value={groupBy}
                    onChange={e => setGroupBy(e.target.value)}
                    style={{ fontSize: 12.5 }}
                  >
                    <option value="none">Sin agrupación (Lista plana)</option>
                    {currentEntityConfig.columns
                      .filter(c => c.type === 'string' && !c.isCalculated)
                      .map(c => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                    Ordenar Resultados Por:
                  </label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <select
                      className="form-control"
                      value={sortField}
                      onChange={e => setSortField(e.target.value)}
                      style={{ fontSize: 12.5 }}
                    >
                      {activeColumns.map(c => (
                        <option key={c.key} value={c.key}>
                          {columnsConfig[c.key]?.customLabel || c.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                      title={`Cambiar a orden ${sortOrder === 'asc' ? 'Descendente' : 'Ascendente'}`}
                      style={{ padding: '6px 10px', fontSize: 12 }}
                    >
                      {sortOrder === 'asc' ? 'Asc (A-Z)' : 'Desc (Z-A)'}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    Filas de Resumen Numérico:
                  </label>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={summaryTotals.sum}
                        onChange={e => setSummaryTotals(prev => ({ ...prev, sum: e.target.checked }))}
                        style={{ accentColor: 'var(--primary-color)' }}
                      />
                      <span>Suma (Σ)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={summaryTotals.avg}
                        onChange={e => setSummaryTotals(prev => ({ ...prev, avg: e.target.checked }))}
                        style={{ accentColor: 'var(--primary-color)' }}
                      />
                      <span>Promedio (x̄)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={summaryTotals.min}
                        onChange={e => setSummaryTotals(prev => ({ ...prev, min: e.target.checked }))}
                        style={{ accentColor: 'var(--primary-color)' }}
                      />
                      <span>Mínimo</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={summaryTotals.max}
                        onChange={e => setSummaryTotals(prev => ({ ...prev, max: e.target.checked }))}
                        style={{ accentColor: 'var(--primary-color)' }}
                      />
                      <span>Máximo</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Tabla de Vista Previa en Vivo */}
              <div className="report-table-wrapper" style={{ maxHeight: 380, border: '1px solid var(--border-gray)' }}>
                <table className="report-grid-table">
                  <thead>
                    <tr>
                      {activeColumns.map(col => (
                        <th key={col.key}>
                          {columnsConfig[col.key]?.customLabel || col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {groupedData.map(group => (
                      <React.Fragment key={group.groupKey}>
                        {groupBy !== 'none' && (
                          <tr style={{ background: '#f1f5f9', fontWeight: 700 }}>
                            <td colSpan={activeColumns.length} style={{ color: 'var(--primary-color)', padding: '8px 12px' }}>
                              📁 {group.groupKey} — ({group.items.length} registros)
                            </td>
                          </tr>
                        )}

                        {group.items.map((row: any, rIdx: number) => (
                          <tr key={rIdx}>
                            {activeColumns.map(col => {
                              const val = row[col.key];
                              return (
                                <td key={col.key} style={{ fontSize: 12.5 }}>
                                  {val !== undefined && val !== null ? String(val) : '-'}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}

                    {sortedData.length === 0 && (
                      <tr>
                        <td colSpan={activeColumns.length} style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>
                          No hay registros que coincidan con los filtros establecidos.
                        </td>
                      </tr>
                    )}
                  </tbody>

                  {/* Fila de Totales Generales */}
                  {sortedData.length > 0 && (
                    <tfoot style={{ background: '#f8fafc', fontWeight: 700, borderTop: '2px solid #cbd5e1' }}>
                      {summaryTotals.sum && (
                        <tr>
                          {activeColumns.map((col, idx) => (
                            <td key={col.key} style={{ color: '#1e293b' }}>
                              {idx === 0 ? 'Σ TOTAL SUMA' : grandTotals[col.key] ? grandTotals[col.key].sum : ''}
                            </td>
                          ))}
                        </tr>
                      )}
                      {summaryTotals.avg && (
                        <tr style={{ color: '#0369a1' }}>
                          {activeColumns.map((col, idx) => (
                            <td key={col.key}>
                              {idx === 0 ? 'x̄ PROMEDIO' : grandTotals[col.key] ? grandTotals[col.key].avg : ''}
                            </td>
                          ))}
                        </tr>
                      )}
                    </tfoot>
                  )}
                </table>
              </div>

              {/* Formulario de Guardado de Plantilla */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: 14,
                display: 'grid',
                gridTemplateColumns: '120px 1.5fr 1fr 140px',
                gap: 12,
                alignItems: 'center'
              }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block' }}>Código:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={templateCode}
                    onChange={e => setTemplateCode(e.target.value)}
                    style={{ fontSize: 12 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block' }}>Nombre del Reporte:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={templateName}
                    onChange={e => setTemplateName(e.target.value)}
                    style={{ fontSize: 12 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block' }}>Descripción:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={templateDesc}
                    onChange={e => setTemplateDesc(e.target.value)}
                    style={{ fontSize: 12 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block' }}>Frecuencia:</label>
                  <select
                    className="form-control"
                    value={templateFrequency}
                    onChange={e => setTemplateFrequency(e.target.value)}
                    style={{ fontSize: 12 }}
                  >
                    <option value="Bajo demanda">Bajo demanda</option>
                    <option value="Diario">Diario</option>
                    <option value="Semanal">Semanal</option>
                    <option value="Mensual">Mensual</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer con Navegación y Acciones */}
        <div className="adhoc-modal-footer">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCurrentStep(prev => (prev - 1) as any)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}
              >
                <ChevronLeft size={16} />
                <span>Paso Anterior</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {currentStep === 4 ? (
              <>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleExportXLSX}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}
                >
                  <Download size={15} />
                  <span>Exportar XLSX</span>
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleExportPDF}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}
                >
                  <Printer size={15} />
                  <span>Imprimir PDF</span>
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleSaveTemplate}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}
                >
                  <Save size={15} />
                  <span>Guardar Plantilla</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setCurrentStep(prev => (prev + 1) as any)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}
              >
                <span>Siguiente Paso</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
