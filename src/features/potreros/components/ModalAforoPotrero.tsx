import React, { useState, useEffect } from 'react';
import {
  X,
  Scale,
  Sparkles,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { PotreroItem } from '../potrerosData';
import {
  FORAGE_SPECIES_PRESETS,
  calculateCuttingFrameAforo,
  AforoCuttingFrameResult
} from '../prvUtils';

interface ModalAforoPotreroProps {
  isOpen: boolean;
  onClose: () => void;
  paddock: PotreroItem | null;
  paddocksList: PotreroItem[];
  onSaveAforo: (
    codigo: string,
    aforoKgM2: number,
    porcentajeMS: number,
    cargaRecomendadaUggHa: number,
    aforoKgMsHa: number
  ) => void;
}

export const ModalAforoPotrero: React.FC<ModalAforoPotreroProps> = ({
  isOpen,
  onClose,
  paddock,
  paddocksList,
  onSaveAforo
}) => {
  const [selectedCodigo, setSelectedCodigo] = useState<string>(paddock?.codigo || paddocksList[0]?.codigo || '');
  const [frameAreaM2, setFrameAreaM2] = useState<number>(1.0); // 1.0 m² o 0.25 m²
  const [samplesGrams, setSamplesGrams] = useState<number[]>([2800, 3100, 2700, 3000]);
  const [porcentajeMS, setPorcentajeMS] = useState<number>(22);
  const [eficienciaPastoreo, setEficienciaPastoreo] = useState<number>(75);
  const [diasDescansoRequeridos, setDiasDescansoRequeridos] = useState<number>(30);

  // Sync selected paddock when prop changes
  useEffect(() => {
    if (paddock) {
      setSelectedCodigo(paddock.codigo);
      // Preload species defaults
      const preset = FORAGE_SPECIES_PRESETS[paddock.especieForrajera];
      if (preset) {
        setPorcentajeMS(preset.porcentajeMS);
        setDiasDescansoRequeridos(preset.diasDescansoOptimo);
      }
      // If paddock already has aforo, seed realistic sample
      if (paddock.aforoKgM2 > 0) {
        const baseGrams = Math.round(paddock.aforoKgM2 * 1000 * frameAreaM2);
        setSamplesGrams([
          Math.round(baseGrams * 0.95),
          Math.round(baseGrams * 1.05),
          Math.round(baseGrams * 0.98),
          Math.round(baseGrams * 1.02)
        ]);
      }
    }
  }, [paddock, isOpen]);

  const activePaddock = paddocksList.find(p => p.codigo === selectedCodigo) || paddock || paddocksList[0];

  // Recalculate when species changes
  const handlePaddockChange = (codigo: string) => {
    setSelectedCodigo(codigo);
    const found = paddocksList.find(p => p.codigo === codigo);
    if (found) {
      const preset = FORAGE_SPECIES_PRESETS[found.especieForrajera];
      if (preset) {
        setPorcentajeMS(preset.porcentajeMS);
        setDiasDescansoRequeridos(preset.diasDescansoOptimo);
      }
    }
  };

  const handleSampleChange = (index: number, value: number) => {
    const next = [...samplesGrams];
    next[index] = Math.max(0, value);
    setSamplesGrams(next);
  };

  const handleAddSample = () => {
    if (samplesGrams.length < 8) {
      const avg = samplesGrams.length > 0
        ? Math.round(samplesGrams.reduce((a, b) => a + b, 0) / samplesGrams.length)
        : 2800;
      setSamplesGrams([...samplesGrams, avg]);
    }
  };

  const handleRemoveSample = (index: number) => {
    if (samplesGrams.length > 2) {
      setSamplesGrams(samplesGrams.filter((_, i) => i !== index));
    }
  };

  const handleApplyPreset = (grams: number) => {
    setSamplesGrams([
      Math.round(grams * 0.95),
      Math.round(grams * 1.05),
      Math.round(grams * 0.98),
      Math.round(grams * 1.02)
    ]);
  };

  // Perform aforo calculation
  const results: AforoCuttingFrameResult = calculateCuttingFrameAforo({
    frameAreaM2,
    samplesGrams,
    porcentajeMS,
    eficienciaPastoreo,
    areaHa: activePaddock ? activePaddock.areaHa : 40,
    diasDescansoRequeridos
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaddock) return;
    onSaveAforo(
      activePaddock.codigo,
      results.pesoFrescoKgM2,
      porcentajeMS,
      results.cargaRecomendadaUggHa,
      results.kgMsHa
    );
    onClose();
  };

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div
        className="report-modal-dialog aforo-modal-dialog"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 780, width: '92%' }}
      >
        {/* Header */}
        <div className="report-modal-header" style={{ borderBottom: '1px solid #eef2f5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              backgroundColor: '#e8f5e9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2d6a4f'
            }}>
              <Scale size={22} />
            </div>
            <div>
              <h3 className="report-modal-title" style={{ fontSize: 18, fontWeight: 700 }}>
                Calculadora de Aforo Forrajero (PRV)
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                Estimación de biomasa por marco de corte, % Materia Seca y capacidad de carga
              </p>
            </div>
          </div>
          <button type="button" className="report-modal-close-btn" onClick={onClose} title="Cerrar ventana">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="report-modal-body" style={{ maxHeight: '76vh', overflowY: 'auto', padding: '20px 24px' }}>
            {/* Top Selector: Target Paddock */}
            <div style={{
              background: '#f8faf9',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: 14,
              marginBottom: 20
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 14, alignItems: 'center' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>
                    Potrero a Aforar
                  </label>
                  <select
                    className="form-select"
                    value={selectedCodigo}
                    onChange={e => handlePaddockChange(e.target.value)}
                    style={{ fontWeight: 600, color: 'var(--primary-color)' }}
                  >
                    {paddocksList.map(p => (
                      <option key={p.codigo} value={p.codigo}>
                        {p.codigo} - {p.descripcion} ({p.areaHa} ha)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block' }}>Especie Dominante</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginTop: 2 }}>
                    {activePaddock?.especieForrajera}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block' }}>Superficie Útil</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginTop: 2 }}>
                    {activePaddock?.areaHa} ha ({activePaddock?.perimetroM} m perímetro)
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1: Marco de Muestreo y Preajustes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Dimensiones del Marco de Aforo</span>
                  <HelpCircle size={14} color="#64748b" title="Área del marco físico lanzado en el potrero" />
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    className={`aforo-frame-choice ${frameAreaM2 === 1.0 ? 'active' : ''}`}
                    onClick={() => setFrameAreaM2(1.0)}
                  >
                    <div style={{ fontWeight: 700, fontSize: 14 }}>1.0 m × 1.0 m</div>
                    <div style={{ fontSize: 11, opacity: 0.8 }}>Área: 1.00 m² (Factor ×1)</div>
                  </button>
                  <button
                    type="button"
                    className={`aforo-frame-choice ${frameAreaM2 === 0.25 ? 'active' : ''}`}
                    onClick={() => setFrameAreaM2(0.25)}
                  >
                    <div style={{ fontWeight: 700, fontSize: 14 }}>0.5 m × 0.5 m</div>
                    <div style={{ fontSize: 11, opacity: 0.8 }}>Área: 0.25 m² (Factor ×4)</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">Preajustes Rápidos de Biomasa</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-preset"
                    onClick={() => handleApplyPreset(Math.round(3500 * frameAreaM2))}
                  >
                    🌿 Alta (3.5 kg/m²)
                  </button>
                  <button
                    type="button"
                    className="btn-preset"
                    onClick={() => handleApplyPreset(Math.round(2800 * frameAreaM2))}
                  >
                    🌾 Media (2.8 kg/m²)
                  </button>
                  <button
                    type="button"
                    className="btn-preset"
                    onClick={() => handleApplyPreset(Math.round(1800 * frameAreaM2))}
                  >
                    🍂 Baja (1.8 kg/m²)
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Submuestras de corte en gramos */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>
                  Submuestras de Corte en Potrero (Gramos Frescos por Marco)
                </label>
                <button
                  type="button"
                  onClick={handleAddSample}
                  disabled={samplesGrams.length >= 8}
                  className="btn-secondary"
                  style={{ padding: '3px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Plus size={13} />
                  <span>Añadir Punto ({samplesGrams.length}/8)</span>
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: 10
              }}>
                {samplesGrams.map((grams, idx) => (
                  <div key={idx} className="aforo-sample-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Punto #{idx + 1}</span>
                      {samplesGrams.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSample(idx)}
                          style={{ color: '#94a3b8', hoverColor: '#ef4444' }}
                          title="Eliminar muestra"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input
                        type="number"
                        min="50"
                        step="50"
                        className="form-input"
                        value={grams}
                        onChange={e => handleSampleChange(idx, parseInt(e.target.value, 10) || 0)}
                        style={{ height: 32, fontSize: 13, fontWeight: 700, textAlign: 'right' }}
                      />
                      <span style={{ fontSize: 12, color: '#64748b' }}>g</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Parámetros Zootécnicos (% MS y Aprovechamiento) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 20,
              background: '#ffffff',
              padding: 14,
              border: '1px solid #e2e8f0',
              borderRadius: 10
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label className="form-label" style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
                    Materia Seca estimada (% MS)
                  </label>
                  <span style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: 14 }}>
                    {porcentajeMS}%
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="35"
                  step="1"
                  className="aforo-slider"
                  value={porcentajeMS}
                  onChange={e => setPorcentajeMS(parseInt(e.target.value, 10))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
                  <span>15% (Aguado / Lluvias)</span>
                  <span>22% (Normal)</span>
                  <span>35% (Lignificado)</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label className="form-label" style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
                    Eficiencia de Cosecha / Pastoreo
                  </label>
                  <span style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: 14 }}>
                    {eficienciaPastoreo}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="90"
                  step="5"
                  className="aforo-slider"
                  value={eficienciaPastoreo}
                  onChange={e => setEficienciaPastoreo(parseInt(e.target.value, 10))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
                  <span>50% (Poco intensivo)</span>
                  <span>75% (PRV Estándar)</span>
                  <span>90% (Alta densidad)</span>
                </div>
              </div>
            </div>

            {/* Step 4: Panel de Resultados Agronómicos Calculados */}
            <div style={{
              background: 'linear-gradient(135deg, #1e3a24 0%, #2d6a4f 100%)',
              borderRadius: 12,
              padding: 18,
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(45, 106, 79, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={18} color="#86efac" />
                  <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                    Resultados Zootécnicos del Aforo
                  </span>
                </div>
                <span style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '3px 10px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600
                }}>
                  Calidad: {results.calidadForraje}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 12,
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                paddingTop: 12
              }}>
                <div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>Aforo Materia Verde</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#ffffff' }}>
                    {results.pesoFrescoKgM2} <span style={{ fontSize: 12, fontWeight: 500 }}>kg MV/m²</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>Producción Bruta MS</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#86efac' }}>
                    {results.kgMsHa.toLocaleString('es-VE')} <span style={{ fontSize: 12, fontWeight: 500 }}>kg MS/ha</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>Oferta Neta Aprovechable</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#fef08a' }}>
                    {results.kgMsAprovechableHa.toLocaleString('es-VE')} <span style={{ fontSize: 12, fontWeight: 500 }}>kg MS/ha</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>Carga Sostenible PRV</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#93c5fd' }}>
                    {results.cargaRecomendadaUggHa} <span style={{ fontSize: 12, fontWeight: 500 }}>UGG/ha</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>Biomasa Total Parcela</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#ffffff' }}>
                    {results.toneladasTotalesMs} <span style={{ fontSize: 12, fontWeight: 500 }}>Ton MS</span>
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: 12,
                fontSize: 11.5,
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '8px 12px',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <CheckCircle2 size={15} color="#86efac" />
                <span>
                  Con {results.cargaRecomendadaUggHa} UGG/ha y un descanso de {diasDescansoRequeridos} días, este potrero soporta rotaciones de 1 a 2 días sin degradar raíces.
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="report-modal-footer" style={{ borderTop: '1px solid #eef2f5', padding: '16px 24px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}
            >
              <CheckCircle2 size={16} />
              <span>Guardar Aforo en {activePaddock?.codigo}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
