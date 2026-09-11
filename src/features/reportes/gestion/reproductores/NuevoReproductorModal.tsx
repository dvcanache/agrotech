import React, { useState } from 'react';
import { X, Dna } from 'lucide-react';
import { ReproductorDetalladoEntity } from '../gestionMockData';

interface NuevoReproductorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reproductor: ReproductorDetalladoEntity) => void;
}

export const NuevoReproductorModal: React.FC<NuevoReproductorModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<ReproductorDetalladoEntity>>({
    categoriaActual: 'Semen',
    practico: '',
    unico: '',
    nombre: '',
    raza: 'Carora Puro',
    estatusActual: 'Activo',
    loteActual: 'TERM1',
    stockActual: 10,
    stockUnidad: 'pajuelas',
    centroGenetico: '',
    padre: '',
    madre: ''
  });

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.practico?.trim()) {
      setError('El código práctico es obligatorio');
      return;
    }
    setError(null);

    const unidad =
      formData.categoriaActual === 'Toro'
        ? 'reproductor en monta'
        : formData.categoriaActual === 'Semen'
        ? 'pajuelas'
        : 'embriones';

    const nuevo: ReproductorDetalladoEntity = {
      practico: formData.practico!.trim().toUpperCase(),
      unico: (formData.unico?.trim() || formData.practico!.trim()).toUpperCase(),
      nombre: formData.nombre?.trim() || '',
      categoriaActual: formData.categoriaActual as 'Toro' | 'Semen' | 'Embrión',
      estatusActual: 'Activo',
      loteActual: formData.loteActual || 'TERM1',
      raza: formData.raza || 'Carora',
      padre: formData.padre?.trim(),
      madre: formData.madre?.trim(),
      centroGenetico: formData.centroGenetico?.trim() || 'Hato Local',
      stockActual: Number(formData.stockActual) || 1,
      stockUnidad: unidad,
      eficiencia: 70.0,
      serviciosPorConcepcion: 1.4,
      criasNacidasTotal: 0,
      criasMachos: 0,
      criasHembras: 0
    };

    onSave(nuevo);
    onClose();
  };

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="report-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Dna size={20} color="#d97706" />
            </div>
            <div>
              <h3 className="report-modal-title">Registrar Material Reproductivo</h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
                Incorpore un toro activo, lote de semen o embriones al catálogo
              </p>
            </div>
          </div>
          <button type="button" className="report-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="report-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && (
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                borderRadius: 6,
                fontSize: 13
              }}>
                {error}
              </div>
            )}

            <div className="form-grid-2">
              <div className="form-group">
                <label>Tipo de Material Reproductivo *</label>
                <select
                  className="form-control"
                  value={formData.categoriaActual}
                  onChange={e => setFormData({
                    ...formData,
                    categoriaActual: e.target.value as 'Toro' | 'Semen' | 'Embrión',
                    stockUnidad: e.target.value === 'Toro' ? 'reproductor en monta' : e.target.value === 'Semen' ? 'pajuelas' : 'embriones'
                  })}
                >
                  <option value="Semen">Semen (Pajuelas)</option>
                  <option value="Embrión">Embrión (FIV / TE)</option>
                  <option value="Toro">Toro (Monta Natural)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Lote de Ubicación *</label>
                <select
                  className="form-control"
                  value={formData.loteActual}
                  onChange={e => setFormData({ ...formData, loteActual: e.target.value })}
                >
                  <option value="TERM1">TERM1 - Termo Criogénico 1</option>
                  <option value="ESCT">ESCT - Escotero</option>
                  <option value="POT1">POT1 - Potrero 1</option>
                  <option value="01">01 - Lote 01</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Código Práctico *</label>
                <input
                  type="text"
                  placeholder="Ej: SM03, EM02, BL003..."
                  className="form-control"
                  required
                  value={formData.practico}
                  onChange={e => setFormData({ ...formData, practico: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Código Único (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: VE-2026-SM03"
                  className="form-control"
                  value={formData.unico}
                  onChange={e => setFormData({ ...formData, unico: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Nombre del Reproductor</label>
                <input
                  type="text"
                  placeholder="Ej: Pajuela Campeón Internacional"
                  className="form-control"
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Raza</label>
                <input
                  type="text"
                  placeholder="Ej: Carora, Gyr, Brahman..."
                  className="form-control"
                  value={formData.raza}
                  onChange={e => setFormData({ ...formData, raza: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Stock / Dosis Iniciales</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={formData.stockActual}
                  onChange={e => setFormData({ ...formData, stockActual: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Centro Genético / Criador</label>
                <input
                  type="text"
                  placeholder="Ej: Alta Genetics / Semex / Hato Propio"
                  className="form-control"
                  value={formData.centroGenetico}
                  onChange={e => setFormData({ ...formData, centroGenetico: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="report-modal-footer">
            <button
              type="button"
              className="btn-amber-action"
              style={{ backgroundColor: '#6b7280', boxShadow: 'none' }}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-green-export">
              Guardar Reproductor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
