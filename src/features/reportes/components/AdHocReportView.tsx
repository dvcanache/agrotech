import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Layers,
  ArrowLeft,
  AlertCircle,
  Database,
  Hash,
  Table as TableIcon
} from 'lucide-react';
import { ReportViewHeader } from './ReportViewHeader';
import { ADHOC_ENTITIES, BaseEntityType } from './adhocData';
import { AdHocReportDefinition } from './AdHocReportDesignerModal';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import './reportesAdvanced.css';

export const AdHocReportView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [template, setTemplate] = useState<AdHocReportDefinition | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar definición desde localStorage
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      // 1. Intentar cargar por clave directa
      const directData = localStorage.getItem(`agrotech_adhoc_template_${id}`);
      if (directData) {
        setTemplate(JSON.parse(directData));
        setLoading(false);
        return;
      }

      // 2. Intentar buscar en la colección global
      const collectionRaw = localStorage.getItem('agrotech_adhoc_templates');
      if (collectionRaw) {
        const list: AdHocReportDefinition[] = JSON.parse(collectionRaw);
        const found = list.find(t => t.id === id);
        if (found) {
          setTemplate(found);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error('Error al cargar plantilla Ad-Hoc:', e);
    }

    setLoading(false);
  }, [id]);

  // Configuración de la entidad asociada
  const entityConfig = useMemo(() => {
    if (!template) return null;
    const entityKey = template.entityKey as BaseEntityType;
    return ADHOC_ENTITIES[entityKey] || ADHOC_ENTITIES.semovientes;
  }, [template]);

  // Columnas activas según la plantilla guardada
  const activeColumns = useMemo(() => {
    if (!entityConfig || !template) return [];
    const selectedSet = new Set(template.selectedColumns);
    return entityConfig.columns.filter(col => selectedSet.has(col.key));
  }, [entityConfig, template]);

  // Enriquecer datos con campos calculados
  const enrichedData = useMemo(() => {
    if (!entityConfig) return [];
    return entityConfig.data.map(row => {
      const computedRow = { ...row };
      entityConfig.columns.forEach(col => {
        if (col.isCalculated && col.compute) {
          computedRow[col.key] = col.compute(row);
        }
      });
      return computedRow;
    });
  }, [entityConfig]);

  // Aplicar filtros
  const filteredData = useMemo(() => {
    if (!template || !template.filters || template.filters.length === 0) {
      return enrichedData;
    }

    return enrichedData.filter(row => {
      let currentResult = true;

      template.filters.forEach((rule, idx) => {
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
            ruleMatches =
              !isNaN(numVal) &&
              !isNaN(ruleNum) &&
              !isNaN(ruleNum2) &&
              numVal >= ruleNum &&
              numVal <= ruleNum2;
            break;
          default:
            ruleMatches = true;
        }

        if (idx === 0) {
          currentResult = ruleMatches;
        } else {
          const prevRule = template.filters[idx - 1];
          if (prevRule.connector === 'OR') {
            currentResult = currentResult || ruleMatches;
          } else {
            currentResult = currentResult && ruleMatches;
          }
        }
      });

      return currentResult;
    });
  }, [enrichedData, template]);

  // Ordenamiento
  const sortedData = useMemo(() => {
    if (!template) return filteredData;
    const sortField = template.sortField;
    const sortOrder = template.sortOrder;

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
  }, [filteredData, template]);

  // Agrupamiento
  const groupedData = useMemo(() => {
    if (!template || !template.groupBy || template.groupBy === 'none') {
      return [{ groupKey: 'Todos', items: sortedData }];
    }

    const groupsMap = new Map<string, any[]>();
    sortedData.forEach(item => {
      const key = String(item[template.groupBy] || 'Sin especificar');
      if (!groupsMap.has(key)) {
        groupsMap.set(key, []);
      }
      groupsMap.get(key)!.push(item);
    });

    return Array.from(groupsMap.entries()).map(([groupKey, items]) => ({
      groupKey,
      items
    }));
  }, [sortedData, template]);

  // Cálculos de totales
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

  // Exportar a Excel (.csv / .xlsx)
  const handleExportXLSX = () => {
    if (!template) return;
    const headers = activeColumns.map(c => c.label);
    const rows = sortedData.map(row => activeColumns.map(c => row[c.key]));
    exportToCSV(`reporte_bi_${template.codigo.toLowerCase()}`, headers, rows);
  };

  // Exportar a PDF
  const handleExportPDF = () => {
    if (!template) return;
    const headers = activeColumns.map(c => c.label);
    const rows = sortedData.map(row => activeColumns.map(c => row[c.key]));
    exportToPDF(
      `reporte_bi_${template.codigo.toLowerCase()}`,
      template.nombre,
      headers,
      rows
    );
  };

  if (loading) {
    return (
      <div className="report-view-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <p style={{ color: 'var(--text-secondary)' }}>Cargando reporte personalizado...</p>
      </div>
    );
  }

  if (!template || !entityConfig) {
    return (
      <div className="report-view-container">
        <ReportViewHeader
          title="Reporte No Encontrado"
          backRoute="/reportes"
        />
        <div style={{
          margin: '32px auto',
          maxWidth: 600,
          padding: 32,
          backgroundColor: '#ffffff',
          borderRadius: 12,
          border: '1px solid var(--border-gray)',
          textAlign: 'center'
        }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>
            Plantilla BI Ad-Hoc No Encontrada
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.5 }}>
            No se encontró la definición de reporte con identificador <code>{id}</code> en el almacenamiento local.
            Es posible que haya sido eliminada o que provenga de otra sesión de navegación.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/reportes')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <ArrowLeft size={16} />
            <span>Volver al Centro de Reportes</span>
          </button>
        </div>
      </div>
    );
  }

  const totalsConfig = template.calculatedMetrics?.totals || { sum: true, avg: true, min: false, max: false };

  return (
    <div className="report-view-container">
      {/* Encabezado con botones de exportación */}
      <ReportViewHeader
        title={template.nombre}
        backRoute="/reportes"
        onExportXLSX={handleExportXLSX}
        onExportPDF={handleExportPDF}
      />

      {/* Barra de metadatos del reporte */}
      <div style={{
        padding: '12px 20px',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        border: '1px solid var(--border-gray)',
        marginBottom: 16,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{
            backgroundColor: '#e0f2fe',
            color: '#0369a1',
            padding: '3px 10px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700
          }}>
            {template.codigo}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13 }}>
            <Database size={15} color="var(--primary-color)" />
            <span>Entidad: <strong>{entityConfig.title}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13 }}>
            <Calendar size={15} />
            <span>Fecha: {template.fechaCreacion}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13 }}>
            <TableIcon size={15} />
            <span>Registros: <strong>{sortedData.length}</strong></span>
          </div>
        </div>

        {template.descripcion && (
          <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)', maxWidth: 450 }}>
            {template.descripcion}
          </p>
        )}
      </div>

      {/* Tabla de Datos Agrupada o Plana */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 8,
        border: '1px solid var(--border-gray)',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        {groupedData.map((group, gIdx) => (
          <div key={group.groupKey} style={{ borderBottom: gIdx < groupedData.length - 1 ? '2px solid #e2e8f0' : 'none' }}>
            {template.groupBy !== 'none' && (
              <div style={{
                padding: '10px 16px',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13.5,
                fontWeight: 600,
                color: '#1e293b'
              }}>
                <Layers size={16} color="var(--primary-color)" />
                <span>Grupo: {group.groupKey}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 400 }}>
                  ({group.items.length} {group.items.length === 1 ? 'registro' : 'registros'})
                </span>
              </div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                    {activeColumns.map(col => (
                      <th
                        key={col.key}
                        style={{
                          padding: '10px 14px',
                          textAlign: col.type === 'number' ? 'right' : 'left',
                          fontWeight: 600,
                          color: '#334155',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {group.items.length === 0 ? (
                    <tr>
                      <td colSpan={activeColumns.length} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                        No se encontraron registros que cumplan con los filtros configurados.
                      </td>
                    </tr>
                  ) : (
                    group.items.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        style={{
                          backgroundColor: rIdx % 2 === 0 ? '#ffffff' : '#f8fafc',
                          borderBottom: '1px solid #e2e8f0'
                        }}
                      >
                        {activeColumns.map(col => (
                          <td
                            key={col.key}
                            style={{
                              padding: '9px 14px',
                              textAlign: col.type === 'number' ? 'right' : 'left',
                              color: 'var(--text-primary)',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : '-'}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>

                {/* Totales y Métricas Resumen */}
                {numericColumns.length > 0 && (
                  <tfoot style={{ backgroundColor: '#f8fafc', borderTop: '2px solid #cbd5e1', fontWeight: 600 }}>
                    {totalsConfig.sum && (
                      <tr>
                        {activeColumns.map((col, cIdx) => (
                          <td
                            key={col.key}
                            style={{
                              padding: '8px 14px',
                              textAlign: col.type === 'number' ? 'right' : 'left',
                              color: 'var(--primary-color)',
                              fontSize: 12.5
                            }}
                          >
                            {cIdx === 0 ? 'SUMA TOTAL:' : grandTotals[col.key] ? grandTotals[col.key].sum : ''}
                          </td>
                        ))}
                      </tr>
                    )}
                    {totalsConfig.avg && (
                      <tr>
                        {activeColumns.map((col, cIdx) => (
                          <td
                            key={col.key}
                            style={{
                              padding: '8px 14px',
                              textAlign: col.type === 'number' ? 'right' : 'left',
                              color: '#0369a1',
                              fontSize: 12.5
                            }}
                          >
                            {cIdx === 0 ? 'PROMEDIO:' : grandTotals[col.key] ? grandTotals[col.key].avg : ''}
                          </td>
                        ))}
                      </tr>
                    )}
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
