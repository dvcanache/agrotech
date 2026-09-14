import React, { useState } from 'react';
import { Plus, Search, Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface CatalogItem {
  id: string;
  codigo: string;
  nombre: string;
  detalle: string;
  extra?: string;
  retiroHuevo?: string;
  colorHex?: string;
}

interface CatalogTypeConfig {
  title: string;
  subtitle: string;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5?: string;
  initialData: CatalogItem[];
}

interface CatalogViewProps {
  catalogType: 'lotes' | 'colores' | 'propietarios' | 'diagnosticos' | 'tratamientos' | 'clasificaciones';
}

const CATALOG_CONFIG: Record<string, CatalogTypeConfig> = {
  lotes: {
    title: 'Catálogo de Lotes de Manejo',
    subtitle: 'Grupos de manejo nutricional, productivo y reproductivo del hato',
    col1: 'Código',
    col2: 'Descripción',
    col3: 'Finalidad',
    col4: 'Dieta / Ración',
    initialData: [
      { id: '1', codigo: '01', nombre: 'Lote 01 (Ordeño Alta)', detalle: 'Vacas de Ordeño > 15 kg/d', extra: 'Pasto + Concentrado 18%' },
      { id: '2', codigo: '02', nombre: 'Lote 02 (Novillas Reemplazo)', detalle: 'Hembras de primer servicio', extra: 'Pasto + Sal Mineralizada' },
      { id: '3', codigo: '03', nombre: 'Lote 03 (Vacas Secas)', detalle: 'Período de transición preparto', extra: 'Forraje seco + Sales aniónicas' },
      { id: '4', codigo: '04', nombre: 'Lote 04 (Mautes y Becerros)', detalle: 'Levante y recría', extra: 'Iniciador terneros + Heno' },
      { id: '5', codigo: '05', nombre: 'Lote Maternidad', detalle: 'Partos inminentes y puerperio', extra: 'Pasto de corte + Suplemento' }
    ]
  },
  colores: {
    title: 'Catálogo de Colores y Aretes',
    subtitle: 'Nomenclatura cromática de aretes, pelajes y marcas de identificación visual',
    col1: 'Código',
    col2: 'Color',
    col3: 'Muestra Visual',
    col4: 'Uso Preferencial',
    initialData: [
      { id: '1', codigo: 'BLA', nombre: 'Blanco', detalle: 'Color blanco puro', extra: 'Hembras nacidas en 2024', colorHex: '#ffffff' },
      { id: '2', codigo: 'AMA', nombre: 'Amarillo', detalle: 'Amarillo brillante', extra: 'Hembras nacidas en 2025', colorHex: '#facc15' },
      { id: '3', codigo: 'VER', nombre: 'Verde', detalle: 'Verde esmeralda', extra: 'Machos reproductores', colorHex: '#22c55e' },
      { id: '4', codigo: 'ROJ', nombre: 'Rojo', detalle: 'Rojo alerta', extra: 'Animales en tratamiento / Retiro', colorHex: '#ef4444' },
      { id: '5', codigo: 'AZU', nombre: 'Azul', detalle: 'Azul cobalto', extra: 'Animales de descarte / Venta', colorHex: '#3b82f6' }
    ]
  },
  propietarios: {
    title: 'Catálogo de Propietarios y Titulares',
    subtitle: 'Registro de copropietarios, hierros de herrar y porcentaje de tenencia',
    col1: 'Código / Cédula',
    col2: 'Titular / Razón Social',
    col3: 'Marca de Hierro',
    col4: 'Tenencia (%)',
    initialData: [
      { id: '1', codigo: 'V-12345678', nombre: 'Agropecuaria El Paraíso C.A.', detalle: 'Hierro de Herrar: [EP]', extra: '70% tenencia' },
      { id: '2', codigo: 'V-87654321', nombre: 'Dave Canache', detalle: 'Hierro de Herrar: [DC]', extra: '30% tenencia' },
      { id: '3', codigo: 'J-00987654', nombre: 'Inversiones Ganaderas del Sur', detalle: 'Hierro de Herrar: [GS]', extra: 'Copropiedad 50%' }
    ]
  },
  diagnosticos: {
    title: 'Catálogo de Diagnósticos Veterinarios',
    subtitle: 'Vademécum estandarizado de patologías y afecciones clínicas',
    col1: 'Código',
    col2: 'Patología / Diagnóstico',
    col3: 'Sistema Afectado',
    col4: 'Severidad',
    initialData: [
      { id: '1', codigo: 'MAST-C', nombre: 'Mastitis Clínica', detalle: 'Glándula Mamaria / Ubre', extra: 'Moderada / Severa' },
      { id: '2', codigo: 'ANAP', nombre: 'Anaplasmosis Bovina', detalle: 'Hemotrópico / Sangre', extra: 'Grave' },
      { id: '3', codigo: 'PODO', nombre: 'Pododermatitis (Gabarro)', detalle: 'Locomotor / Casco', extra: 'Moderada' },
      { id: '4', codigo: 'METR', nombre: 'Metritis Puerperal', detalle: 'Reproductivo', extra: 'Moderada' },
      { id: '5', codigo: 'NEUM', nombre: 'Neumonía / Complejo Respiratorio', detalle: 'Respiratorio', extra: 'Severa' }
    ]
  },
  tratamientos: {
    title: 'Catálogo de Tratamientos Farmacológicos',
    subtitle: 'Medicamentos, principios activos, vías de administración y tiempos de retiro (Leche, Carne y Huevo)',
    col1: 'Código',
    col2: 'Principio Activo / Medicamento',
    col3: 'Vía & Dosis Habitual',
    col4: 'Retiro Leche / Carne',
    col5: 'Retiro Huevo Comercial (Aves)',
    initialData: [
      {
        id: '1',
        codigo: 'OXITET-LA',
        nombre: 'Oxitetraciclina L.A. 20%',
        detalle: 'Intramuscular profunda (1 ml / 10 kg)',
        extra: 'Leche: 7 días (168h) | Carne: 28 días',
        retiroHuevo: 'No usar en gallinas ponedoras'
      },
      {
        id: '2',
        codigo: 'CEFTIO',
        nombre: 'Ceftiofur Sódico 5%',
        detalle: 'Subcutánea (1 ml / 50 kg)',
        extra: 'Leche: 0 horas | Carne: 3 días',
        retiroHuevo: '⛔ PROHIBIDO EN AVES (Uso extra-etiqueta vetado FDA/EFSA - Cefalosporina 3ª Gen / Resistencia BLEE)'
      },
      {
        id: '3',
        codigo: 'IVERM',
        nombre: 'Ivermectina 1%',
        detalle: 'Subcutánea (1 ml / 50 kg)',
        extra: 'Leche: Prohibido en ordeño | Carne: 35 días',
        retiroHuevo: 'No autorizado en ponedoras comerciales'
      },
      {
        id: '4',
        codigo: 'FLUNIX',
        nombre: 'Flunixin Meglumine 5%',
        detalle: 'Intravenosa (2 ml / 45 kg)',
        extra: 'Leche: 36 horas | Carne: 4 días',
        retiroHuevo: 'No autorizado en aves'
      },
      {
        id: '5',
        codigo: 'PEN-ESTR',
        nombre: 'Penicilina + Estreptomicina',
        detalle: 'Intramuscular (1 ml / 25 kg)',
        extra: 'Leche: 72 horas | Carne: 14 días',
        retiroHuevo: 'Retiro: 10 días en postura comercial'
      },
      {
        id: '6',
        codigo: 'ENRO-10',
        nombre: 'Enrofloxacina 10% Oral',
        detalle: 'Oral en agua de bebida (10 mg/kg)',
        extra: 'Carne: 7 días',
        retiroHuevo: 'Retiro: 9 días en huevo comercial'
      }
    ]
  },
  clasificaciones: {
    title: 'Clasificaciones y Mérito Genético',
    subtitle: 'Escalas de conformación fenotípica y evaluación lineal de características',
    col1: 'Código',
    col2: 'Aspecto Evaluado',
    col3: 'Escala de Puntuación',
    col4: 'Ponderación',
    initialData: [
      { id: '1', codigo: 'CONF-UBRE', nombre: 'Sistema Mamario / Ubre', detalle: 'Escala 1 a 9 (Profundidad, Inserción, Pezones)', extra: '40% del mérito lechero' },
      { id: '2', codigo: 'APLOMOS', nombre: 'Patas y Pezuñas', detalle: 'Escala 1 a 9 (Ángulo de pezuña, Vista posterior)', extra: '25% de longevidad' },
      { id: '3', codigo: 'FORTALEZA', nombre: 'Fortaleza Lechera / Capacidad', detalle: 'Escala 1 a 9 (Pecho, Cruz, Arco costal)', extra: '20% de resistencia' },
      { id: '4', codigo: 'ESTR-GRUPA', nombre: 'Estructura de Grupa', detalle: 'Escala 1 a 9 (Ángulo, Ancho de isquiones)', extra: '15% facilidad de parto' }
    ]
  }
};

export const CatalogView: React.FC<CatalogViewProps> = ({ catalogType }) => {
  const config = CATALOG_CONFIG[catalogType];
  const [items, setItems] = useState<CatalogItem[]>(config.initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ codigo: '', nombre: '', detalle: '', extra: '', retiroHuevo: '' });

  const filteredItems = items.filter(item =>
    item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.detalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.retiroHuevo && item.retiroHuevo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.codigo.trim() || !newItem.nombre.trim()) return;

    // Validación y restricción de uso extra-etiqueta de Ceftiofur en aves
    const isCeftiofur = newItem.nombre.toLowerCase().includes('ceftiofur') || newItem.codigo.toLowerCase().includes('ceftio');
    let finalRetiroHuevo = newItem.retiroHuevo.trim();
    if (isCeftiofur && (!finalRetiroHuevo || !finalRetiroHuevo.includes('PROHIBIDO'))) {
      finalRetiroHuevo = '⛔ PROHIBIDO EN AVES (Uso extra-etiqueta vetado FDA/EFSA - Cefalosporina 3ª Gen / Resistencia BLEE)';
    }

    const added: CatalogItem = {
      id: String(Date.now()),
      codigo: newItem.codigo.trim(),
      nombre: newItem.nombre.trim(),
      detalle: newItem.detalle.trim(),
      extra: newItem.extra.trim(),
      retiroHuevo: finalRetiroHuevo || undefined
    };
    setItems([...items, added]);
    setNewItem({ codigo: '', nombre: '', detalle: '', extra: '', retiroHuevo: '' });
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('¿Está seguro de eliminar este registro del catálogo?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const hasCol5 = Boolean(config.col5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            {config.title}
          </h3>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            {config.subtitle}
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={16} />
          <span>Agregar Registro</span>
        </button>
      </div>

      {catalogType === 'tratamientos' && (
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 12.5,
          color: '#1e40af',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <ShieldAlert size={20} color="#2563eb" style={{ flexShrink: 0 }} />
          <div>
            <strong>Blindaje de Inocuidad Alimentaria (Leche, Carne y Huevo):</strong> Los tiempos de resguardo farmacológico en huevo comercial son de estricto cumplimiento para evitar decomisos y riesgos de resistencia bacteriana (BLEE). Prohibido taxativamente el uso de Cefalosporinas de 3ª generación (Ceftiofur) en avicultura.
          </div>
        </div>
      )}

      {/* Search */}
      <div className="search-container" style={{ maxWidth: 360 }}>
        <Search className="search-icon" size={16} />
        <input
          type="text"
          className="search-input"
          placeholder="Buscar en el catálogo..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-wrapper" style={{ border: '1px solid var(--border-gray)', borderRadius: 8, overflowX: 'auto' }}>
        <table className="animals-table">
          <thead>
            <tr>
              <th style={{ width: hasCol5 ? '12%' : '18%' }}>{config.col1}</th>
              <th style={{ width: hasCol5 ? '24%' : '32%' }}>{config.col2}</th>
              <th style={{ width: hasCol5 ? '20%' : '25%' }}>{config.col3}</th>
              <th style={{ width: hasCol5 ? '20%' : '25%' }}>{config.col4}</th>
              {hasCol5 && <th style={{ width: '20%' }}>{config.col5}</th>}
              <th style={{ width: 60, textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                  {item.codigo}
                </td>
                <td style={{ fontWeight: 500 }}>
                  {item.nombre}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.colorHex && (
                      <span style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        backgroundColor: item.colorHex,
                        border: '1px solid #cbd5e1',
                        display: 'inline-block'
                      }} />
                    )}
                    <span>{item.detalle}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                  {item.extra || '-'}
                </td>
                {hasCol5 && (
                  <td>
                    {item.retiroHuevo?.includes('PROHIBIDO') ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#b91c1c',
                          backgroundColor: '#fef2f2',
                          padding: '3px 8px',
                          borderRadius: 4,
                          border: '1px solid #fecaca'
                        }}
                        title="Prohibición zoosanitaria internacional (FDA/EFSA) por riesgo de resistencia antimicrobiana BLEE"
                      >
                        <AlertTriangle size={12} />
                        {item.retiroHuevo}
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: item.retiroHuevo ? '#334155' : '#94a3b8' }}>
                        {item.retiroHuevo || 'No establecido'}
                      </span>
                    )}
                  </td>
                )}
                <td style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    className="btn-icon"
                    style={{ color: '#ef4444' }}
                    onClick={() => handleDeleteItem(item.id)}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={hasCol5 ? 6 : 5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
                  No se encontraron elementos en este catálogo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Agregar */}
      {isModalOpen && (
        <div className="report-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="report-modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="report-modal-header">
              <h3 className="report-modal-title">Agregar a {config.title}</h3>
              <button type="button" className="report-modal-close-btn" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleAddItem}>
              <div className="report-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-field">
                  <label className="form-label">{config.col1} *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newItem.codigo}
                    onChange={e => setNewItem({ ...newItem, codigo: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">{config.col2} *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newItem.nombre}
                    onChange={e => setNewItem({ ...newItem, nombre: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">{config.col3}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newItem.detalle}
                    onChange={e => setNewItem({ ...newItem, detalle: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">{config.col4}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej. Leche: 0 horas | Carne: 3 días"
                    value={newItem.extra}
                    onChange={e => setNewItem({ ...newItem, extra: e.target.value })}
                  />
                </div>
                {hasCol5 && (
                  <div className="form-field">
                    <label className="form-label">{config.col5}</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej. Retiro: 7 días en postura comercial"
                      value={newItem.retiroHuevo}
                      onChange={e => setNewItem({ ...newItem, retiroHuevo: e.target.value })}
                    />
                    <span className="form-hint">
                      Para Cefalosporinas de 3ª generación (Ceftiofur), el sistema impondrá restricción automática de prohibición en aves.
                    </span>
                  </div>
                )}
              </div>
              <div className="report-modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
