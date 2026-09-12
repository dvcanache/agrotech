import React, { useState, useEffect } from 'react';
import { X, FileText, Check, Layers, Clock, Filter, Eye } from 'lucide-react';

export interface ReporteItem {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  plantillaBase?: string;
  formato: string;
  frecuencia: string;
  rutaAsociada?: string;
  fechaCreacion: string;
}

export const REPORT_TEMPLATES: { nombre: string; categoria: string; ruta?: string; descripcionDefecto?: string }[] = [
  {
    nombre: 'Inventarios (Hato general y lotes)',
    categoria: 'Gestión',
    ruta: '/reports/inventories',
    descripcionDefecto: 'Consolidado de animales clasificados por categoría zootécnica, edad y lote actual.'
  },
  {
    nombre: 'Movimientos y Traslados de Lote',
    categoria: 'Gestión',
    ruta: '/reports/movements',
    descripcionDefecto: 'Historial de transferencias de lote, rebaño y promociones de etapa productiva.'
  },
  {
    nombre: 'Distribución Normal de Pesos',
    categoria: 'Gestión',
    ruta: '/reports/historics/normaldistribution',
    descripcionDefecto: 'Curva campana de Gauss para pesos en báscula por grupo etario.'
  },
  {
    nombre: 'Técnicos e Inseminadores',
    categoria: 'Gestión',
    ruta: '/reports/technicians',
    descripcionDefecto: 'Evaluación del desempeño y tasa de concepción por operario.'
  },
  {
    nombre: 'Reproductores y Material Genético',
    categoria: 'Gestión',
    ruta: '/reports/breeders',
    descripcionDefecto: 'Catálogo de toros en monta, stock de pajuelas criogénicas y embriones.'
  },
  {
    nombre: 'Vientres y Aptitud Reproductiva',
    categoria: 'Animales',
    ruta: '/reports/dams',
    descripcionDefecto: 'Inventario de hembras activas aptas para monta natural o inseminación.'
  },
  {
    nombre: 'Próximas a Secar (Aviso 15-60 d)',
    categoria: 'Animales',
    ruta: '/reports/nexttodry',
    descripcionDefecto: 'Listado de vacas preñadas prontas a culminar su lactancia actual.'
  },
  {
    nombre: 'Próximas a Parir (FPP)',
    categoria: 'Animales',
    ruta: '/reports/nexttobirth',
    descripcionDefecto: 'Programación de traslados a potrero de maternidad según fecha probable de parto.'
  },
  {
    nombre: 'Próximas a Revisar (Palpación)',
    categoria: 'Animales',
    ruta: '/reports/nexttocheck',
    descripcionDefecto: 'Hembras con servicios cumplidos que requieren confirmación diagnóstica de preñez.'
  },
  {
    nombre: 'Animales Secos (Descanso Mamario)',
    categoria: 'Animales',
    ruta: '/reports/drycows',
    descripcionDefecto: 'Vientres secos en descanso previo al siguiente parto.'
  },
  {
    nombre: 'Animales Lactando (En Ordeño)',
    categoria: 'Animales',
    ruta: '/reports/cowsinproduction',
    descripcionDefecto: 'Vacas en producción lechera activa con días en leche (DEL) y promedios diarios.'
  },
  {
    nombre: 'Animales Criando (Con Cría al Pie)',
    categoria: 'Animales',
    ruta: '/reports/cowsraising',
    descripcionDefecto: 'Madres con becerros lactantes hasta la edad de destete (205 días).'
  },
  {
    nombre: 'No Vientres (Machos / Descarte)',
    categoria: 'Animales',
    ruta: '/reports/nodams',
    descripcionDefecto: 'Maute, toretes y animales de ceba o destino frigorífico.'
  },
  {
    nombre: 'Historia de Reproducciones (Servicios/Partos)',
    categoria: 'Históricos',
    ruta: '/reports/historics/reproductions',
    descripcionDefecto: 'Trazabilidad genealógica y eventos reproductivos a lo largo de la vida del animal.'
  },
  {
    nombre: 'Historia de Lactancias (Curvas de Leche)',
    categoria: 'Históricos',
    ruta: '/reports/historics/lactations',
    descripcionDefecto: 'Producción total acumulada por lactancia y persistencia lechera.'
  },
  {
    nombre: 'Historia de Pesajes de Leche',
    categoria: 'Históricos',
    ruta: '/reports/historics/milks',
    descripcionDefecto: 'Registro de pesajes de control en turnos mañana y tarde.'
  },
  {
    nombre: 'Historia de Crecimientos (Ganancia Diaria)',
    categoria: 'Históricos',
    ruta: '/reports/historics/weighings',
    descripcionDefecto: 'Evolución de peso corporal y cálculo de ganancia diaria de peso (GDP).'
  },
  {
    nombre: 'Inventario Multirebaño',
    categoria: 'Multirebaños',
    ruta: '/reports/multiherds/inventories',
    descripcionDefecto: 'Comparativo global entre diferentes hatos o fincas de la corporación.'
  },
  {
    nombre: 'Maestro de Potreros y Pasturas',
    categoria: 'Potreros',
    ruta: '/potreros',
    descripcionDefecto: 'Estado agronómico, aforos de biomasa y rotación de cargas UGG.'
  },
  {
    nombre: 'Reporte Personalizado (Sin plantilla base)',
    categoria: 'Personalizado',
    ruta: undefined,
    descripcionDefecto: 'Reporte a medida configurado según criterios específicos del usuario.'
  }
];

interface NuevoReporteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nuevoReporte: ReporteItem) => void;
  categoriaInicial?: string;
  nextCodigo?: string;
}

export const NuevoReporteModal: React.FC<NuevoReporteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categoriaInicial = 'Gestión',
  nextCodigo = 'RPT-004'
}) => {
  const [formData, setFormData] = useState({
    codigo: nextCodigo,
    nombre: '',
    categoria: categoriaInicial,
    plantillaBase: REPORT_TEMPLATES[0].nombre,
    formato: 'Tabla interactiva (XLSX / PDF)',
    frecuencia: 'Bajo demanda (Manual)',
    filtroEstado: 'Todos los animales y lotes',
    descripcion: REPORT_TEMPLATES[0].descripcionDefecto || ''
  });

  useEffect(() => {
    if (isOpen) {
      const templateInicial = REPORT_TEMPLATES.find(t => t.categoria === categoriaInicial) || REPORT_TEMPLATES[0];
      setFormData({
        codigo: nextCodigo,
        nombre: '',
        categoria: categoriaInicial,
        plantillaBase: templateInicial.nombre,
        formato: 'Tabla interactiva (XLSX / PDF)',
        frecuencia: 'Bajo demanda (Manual)',
        filtroEstado: 'Todos los animales y lotes',
        descripcion: templateInicial.descripcionDefecto || ''
      });
    }
  }, [isOpen, categoriaInicial, nextCodigo]);

  if (!isOpen) return null;

  const handleTemplateChange = (templateName: string) => {
    const selected = REPORT_TEMPLATES.find(t => t.nombre === templateName);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        plantillaBase: selected.nombre,
        categoria: selected.categoria,
        descripcion: prev.descripcion ? prev.descripcion : (selected.descripcionDefecto || '')
      }));
    } else {
      setFormData(prev => ({ ...prev, plantillaBase: templateName }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.codigo.trim() || !formData.nombre.trim()) {
      alert('Por favor complete el código y nombre del reporte.');
      return;
    }

    const templateMatch = REPORT_TEMPLATES.find(t => t.nombre === formData.plantillaBase);

    const nuevo: ReporteItem = {
      id: `rep-${Date.now()}`,
      codigo: formData.codigo.trim().toUpperCase(),
      nombre: formData.nombre.trim(),
      categoria: formData.categoria,
      plantillaBase: formData.plantillaBase,
      formato: formData.formato,
      frecuencia: formData.frecuencia,
      descripcion: formData.descripcion.trim() || `Reporte de ${formData.nombre} en formato ${formData.formato}`,
      rutaAsociada: templateMatch?.ruta,
      fechaCreacion: new Date().toISOString().split('T')[0]
    };

    onSave(nuevo);
    onClose();
  };

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 620 }}>
        {/* Header */}
        <div className="report-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              backgroundColor: '#e8f5e9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-color)'
            }}>
              <FileText size={20} />
            </div>
            <div>
              <h3 className="report-modal-title">Configurar Nuevo Reporte</h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
                Establezca los parámetros, fuente de datos y formato de visualización
              </p>
            </div>
          </div>
          <button type="button" className="report-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="report-modal-body" style={{ maxHeight: '72vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Row 1: Código y Categoría */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 14 }}>
              <div className="form-field">
                <label className="form-label">Código del Reporte *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. RPT-004"
                  className="form-input"
                  value={formData.codigo}
                  onChange={e => setFormData({ ...formData, codigo: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Categoría / Módulo *</label>
                <select
                  className="form-select"
                  value={formData.categoria}
                  onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                >
                  <option value="Gestión">Gestión (Inventarios, Movimientos)</option>
                  <option value="Animales">Animales (Vientres, Ordeño, Secado)</option>
                  <option value="Históricos">Históricos (Reproducción, Pesajes)</option>
                  <option value="Multirebaños">Multirebaños (Corporativo)</option>
                  <option value="Potreros">Potreros & Cartografía</option>
                  <option value="Personalizado">Personalizado / A Medida</option>
                </select>
              </div>
            </div>

            {/* Row 2: Nombre del Reporte */}
            <div className="form-field">
              <label className="form-label">Nombre del Reporte *</label>
              <input
                type="text"
                required
                placeholder="ej. Balance Mensual de Producción y Ganancia Diaria"
                className="form-input"
                value={formData.nombre}
                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            {/* Row 3: Plantilla Base y Formato de Salida */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
              <div className="form-field">
                <label className="form-label">Plantilla Base / Fuente de Datos</label>
                <select
                  className="form-select"
                  value={formData.plantillaBase}
                  onChange={e => handleTemplateChange(e.target.value)}
                >
                  {REPORT_TEMPLATES.map(t => (
                    <option key={t.nombre} value={t.nombre}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Formato de Salida</label>
                <select
                  className="form-select"
                  value={formData.formato}
                  onChange={e => setFormData({ ...formData, formato: e.target.value })}
                >
                  <option value="Tabla interactiva (XLSX / PDF)">Tabla interactiva (XLSX / PDF)</option>
                  <option value="Resumen ejecutivo con KPIs">Resumen ejecutivo con KPIs</option>
                  <option value="Gráfico de tendencias temporales">Gráfico de tendencias temporales</option>
                  <option value="Ficha analítica detallada">Ficha analítica detallada</option>
                </select>
              </div>
            </div>

            {/* Row 4: Frecuencia y Filtros */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-field">
                <label className="form-label">Periodicidad / Frecuencia</label>
                <select
                  className="form-select"
                  value={formData.frecuencia}
                  onChange={e => setFormData({ ...formData, frecuencia: e.target.value })}
                >
                  <option value="Bajo demanda (Manual)">Bajo demanda (Manual)</option>
                  <option value="Diario (Automático)">Diario (Automático)</option>
                  <option value="Semanal (Lunes)">Semanal (Lunes)</option>
                  <option value="Quincenal">Quincenal</option>
                  <option value="Mensual (Cierre de mes)">Mensual (Cierre de mes)</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Filtro Predeterminado de Animales</label>
                <select
                  className="form-select"
                  value={formData.filtroEstado}
                  onChange={e => setFormData({ ...formData, filtroEstado: e.target.value })}
                >
                  <option value="Todos los animales y lotes">Todos los animales y lotes</option>
                  <option value="Solo animales activos">Solo animales activos</option>
                  <option value="En producción (lactancia activa)">En producción (lactancia activa)</option>
                  <option value="Hato seco y escotero">Hato seco y escotero</option>
                  <option value="Novillas de vientre y reemplazo">Novillas de vientre y reemplazo</option>
                </select>
              </div>
            </div>

            {/* Row 5: Descripción */}
            <div className="form-field">
              <label className="form-label">Descripción y Objetivo Zootécnico</label>
              <textarea
                rows={3}
                placeholder="Explique el propósito o criterio de análisis de este reporte..."
                className="form-input"
                value={formData.descripcion}
                onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
              />
              <span className="form-hint">
                Esta descripción aparecerá en el listado de reportes guardados para referencia de los operarios.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="report-modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Check size={16} />
              <span>Guardar Reporte</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
