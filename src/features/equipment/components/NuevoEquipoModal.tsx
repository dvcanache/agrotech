import React, { useState } from 'react';
import {
  X,
  Tractor,
  Check,
  ChevronRight,
  ChevronLeft,
  Settings,
  Layers,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  EquipmentItem,
  EquipmentCategory,
  OperationalState,
  LOCATIONS_OPTIONS,
  OPERATORS_OPTIONS
} from '../equipmentData';

interface NuevoEquipoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nuevoEquipo: EquipmentItem) => void;
}

export const NuevoEquipoModal: React.FC<NuevoEquipoModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    categoria: 'Maquinaria' as EquipmentCategory,
    subtipo: 'Tractor Agrícola Pesado',
    marca: '',
    modelo: '',
    serialVin: '',
    placa: '',
    // Variante
    potenciaHp: 120,
    traccion: '4x4' as '4x4' | '4x2' | 'Oruga' | 'N/A',
    capacidad: '',
    transmision: 'PowerQuad Plus',
    combustible: 'Diésel' as 'Diésel' | 'Gasolina' | 'Eléctrico' | 'N/A',
    ano: 2023,
    // Operación
    estado: 'Operativo' as OperationalState,
    unidadMedidaUso: 'Horas' as 'Horas' | 'Kilómetros',
    horometroActual: 0,
    odometroKm: 0,
    ubicacionAsignada: LOCATIONS_OPTIONS[0],
    operadorAsignado: OPERATORS_OPTIONS[0],
    intervaloMantenimientoHoras: 250,
    valorEstimadoUsd: 45000,
    fechaAdquisicion: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const handleCategoryChange = (cat: EquipmentCategory) => {
    let defaultSubtipo = 'Tractor Agrícola';
    let defaultUnidad: 'Horas' | 'Kilómetros' = 'Horas';
    let defaultCombustible: 'Diésel' | 'Gasolina' | 'Eléctrico' | 'N/A' = 'Diésel';
    let defaultTraccion: '4x4' | '4x2' | 'Oruga' | 'N/A' = '4x4';

    if (cat === 'Vehículos') {
      defaultSubtipo = 'Camioneta Pick-up de Campo';
      defaultUnidad = 'Kilómetros';
      defaultCombustible = 'Diésel';
      defaultTraccion = '4x4';
    } else if (cat === 'Implementos') {
      defaultSubtipo = 'Rastra de Tiro / Discos';
      defaultUnidad = 'Horas';
      defaultCombustible = 'N/A';
      defaultTraccion = 'N/A';
    } else if (cat === 'Estacionarios') {
      defaultSubtipo = 'Motobomba / Generador';
      defaultUnidad = 'Horas';
      defaultCombustible = 'Diésel';
      defaultTraccion = 'N/A';
    }

    setFormData(prev => ({
      ...prev,
      categoria: cat,
      subtipo: defaultSubtipo,
      unidadMedidaUso: defaultUnidad,
      combustible: defaultCombustible,
      traccion: defaultTraccion
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.codigo.trim() || !formData.nombre.trim() || !formData.marca.trim() || !formData.modelo.trim()) {
        alert('Por favor complete los campos obligatorios: Código, Nombre, Marca y Modelo.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isKm = formData.unidadMedidaUso === 'Kilómetros';
    const currentUsage = isKm ? Number(formData.odometroKm) : Number(formData.horometroActual);
    const interval = Number(formData.intervaloMantenimientoHoras);
    const proximoMantenimiento = currentUsage + (isKm ? interval * 10 : interval);

    const nuevo: EquipmentItem = {
      codigo: formData.codigo.trim().toUpperCase(),
      nombre: formData.nombre.trim(),
      categoria: formData.categoria,
      subtipo: formData.subtipo.trim(),
      marca: formData.marca.trim(),
      modelo: formData.modelo.trim(),
      serialVin: formData.serialVin.trim() || `SN-${Date.now().toString().slice(-6)}`,
      placa: formData.placa.trim() || undefined,
      variante: {
        potenciaHp: Number(formData.potenciaHp) || undefined,
        traccion: formData.traccion,
        capacidad: formData.capacidad.trim() || undefined,
        transmision: formData.transmision.trim() || undefined,
        combustible: formData.combustible,
        ano: Number(formData.ano) || undefined
      },
      estado: formData.estado,
      horometroActual: Number(formData.horometroActual) || 0,
      odometroKm: isKm ? Number(formData.odometroKm) : undefined,
      unidadMedidaUso: formData.unidadMedidaUso,
      ubicacionAsignada: formData.ubicacionAsignada,
      operadorAsignado: formData.operadorAsignado,
      intervaloMantenimientoHoras: interval,
      proximoMantenimientoHorasKm: proximoMantenimiento,
      alertaMantenimiento: false,
      consumoPromedioLPorHora: formData.categoria === 'Implementos' ? undefined : 11.5,
      fechaAdquisicion: formData.fechaAdquisicion,
      valorEstimadoUsd: Number(formData.valorEstimadoUsd) || 0,
      historialMantenimientos: [],
      historialCombustible: []
    };

    onSave(nuevo);
    onClose();
  };

  return (
    <div className="equipment-modal-overlay" onClick={onClose}>
      <div className="equipment-modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="equipment-modal-header">
          <div className="equipment-modal-header-info">
            <div className="equipment-modal-icon-badge">
              <Tractor size={22} />
            </div>
            <div>
              <h3 className="equipment-modal-title">Registrar Nuevo Equipo o Unidad</h3>
              <p className="equipment-modal-desc">
                Paso {currentStep} de 3 — {currentStep === 1 ? 'Identificación' : currentStep === 2 ? 'Variantes & Potencia' : 'Operación & Mantenimiento'}
              </p>
            </div>
          </div>
          <button type="button" className="equipment-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div style={{ padding: '12px 24px 0 24px' }}>
          <div className="wizard-steps">
            <div className={`wizard-step-item ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="wizard-step-bubble">1</div>
              <span>Ficha & Categoría</span>
            </div>
            <ChevronRight size={14} style={{ color: '#94a3b8' }} />
            <div className={`wizard-step-item ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="wizard-step-bubble">2</div>
              <span>Variantes Técnicas</span>
            </div>
            <ChevronRight size={14} style={{ color: '#94a3b8' }} />
            <div className={`wizard-step-item ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="wizard-step-bubble">3</div>
              <span>Asignación & Horómetro</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
          <div className="equipment-modal-body">
            {/* STEP 1: FICHA & CATEGORIA */}
            {currentStep === 1 && (
              <>
                <div className="form-field">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, display: 'block' }}>
                    Categoría de Flota *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {(['Maquinaria', 'Vehículos', 'Implementos', 'Estacionarios'] as EquipmentCategory[]).map(cat => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 8,
                          fontSize: 12.5,
                          fontWeight: 600,
                          border: formData.categoria === cat ? '2px solid #2d6a4f' : '1px solid #e2e8f0',
                          backgroundColor: formData.categoria === cat ? '#e8f5e9' : '#ffffff',
                          color: formData.categoria === cat ? '#2d6a4f' : '#475569',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Código Interno *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ej. TRAC-04"
                      className="form-input"
                      value={formData.codigo}
                      onChange={e => setFormData({ ...formData, codigo: e.target.value })}
                      style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Nombre Descriptivo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ej. John Deere 6125M Premium"
                      className="form-input"
                      value={formData.nombre}
                      onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Subtipo Específico
                    </label>
                    <input
                      type="text"
                      placeholder="ej. Tractor Agrícola Doble Tracción"
                      className="form-input"
                      value={formData.subtipo}
                      onChange={e => setFormData({ ...formData, subtipo: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Marca Fabricante *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ej. John Deere, Baldan, Toyota"
                      className="form-input"
                      value={formData.marca}
                      onChange={e => setFormData({ ...formData, marca: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Modelo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ej. 6125M, Hilux SRV, GMD 280"
                      className="form-input"
                      value={formData.modelo}
                      onChange={e => setFormData({ ...formData, modelo: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      N° de Serie / VIN / Chasis
                    </label>
                    <input
                      type="text"
                      placeholder="ej. 1L06125MKKD894211"
                      className="form-input"
                      value={formData.serialVin}
                      onChange={e => setFormData({ ...formData, serialVin: e.target.value })}
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    />
                  </div>
                </div>

                {formData.categoria === 'Vehículos' && (
                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Placa Vehicular
                    </label>
                    <input
                      type="text"
                      placeholder="ej. A82BC3D"
                      className="form-input"
                      value={formData.placa}
                      onChange={e => setFormData({ ...formData, placa: e.target.value })}
                      style={{ fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}
                    />
                  </div>
                )}
              </>
            )}

            {/* STEP 2: VARIANTES Y CONFIGURACION */}
            {currentStep === 2 && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Potencia del Motor (HP)
                    </label>
                    <input
                      type="number"
                      placeholder="ej. 125"
                      className="form-input"
                      value={formData.potenciaHp}
                      onChange={e => setFormData({ ...formData, potenciaHp: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Tipo de Tracción
                    </label>
                    <select
                      className="form-select"
                      value={formData.traccion}
                      onChange={e => setFormData({ ...formData, traccion: e.target.value as any })}
                    >
                      <option value="4x4">4x4 (Doble Tracción Asistida / Total)</option>
                      <option value="4x2">4x2 (Simple / Tracción Trasera)</option>
                      <option value="Oruga">Oruga / Bandas de Caucho</option>
                      <option value="N/A">N/A (Tiro / Implemento)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Tipo de Combustible
                    </label>
                    <select
                      className="form-select"
                      value={formData.combustible}
                      onChange={e => setFormData({ ...formData, combustible: e.target.value as any })}
                    >
                      <option value="Diésel">Diésel (Gasoil)</option>
                      <option value="Gasolina">Gasolina</option>
                      <option value="Eléctrico">Eléctrico</option>
                      <option value="N/A">N/A (Sin motor autónomo)</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Año de Fabricación
                    </label>
                    <input
                      type="number"
                      placeholder="ej. 2022"
                      className="form-input"
                      value={formData.ano}
                      onChange={e => setFormData({ ...formData, ano: parseInt(e.target.value, 10) || 2020 })}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                    Capacidad / Especificación de Trabajo
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Enganche Cat. III (5.3 Ton), 24 Discos Ø 26'', 1,200 L/min, etc."
                    className="form-input"
                    value={formData.capacidad}
                    onChange={e => setFormData({ ...formData, capacidad: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                    Tipo de Transmisión / Acople
                  </label>
                  <input
                    type="text"
                    placeholder="ej. PowerQuad Plus 24x24 con Inversor electrohidráulico"
                    className="form-input"
                    value={formData.transmision}
                    onChange={e => setFormData({ ...formData, transmision: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* STEP 3: OPERACION & ASIGNACION */}
            {currentStep === 3 && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Unidad de Medida de Uso
                    </label>
                    <select
                      className="form-select"
                      value={formData.unidadMedidaUso}
                      onChange={e => setFormData({ ...formData, unidadMedidaUso: e.target.value as any })}
                    >
                      <option value="Horas">Horómetro (Horas)</option>
                      <option value="Kilómetros">Odómetro (Kilómetros)</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      {formData.unidadMedidaUso === 'Kilómetros' ? 'Kilometraje Inicial (km)' : 'Horómetro Inicial (horas)'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      className="form-input"
                      value={formData.unidadMedidaUso === 'Kilómetros' ? formData.odometroKm : formData.horometroActual}
                      onChange={e => {
                        const val = parseFloat(e.target.value) || 0;
                        if (formData.unidadMedidaUso === 'Kilómetros') {
                          setFormData({ ...formData, odometroKm: val });
                        } else {
                          setFormData({ ...formData, horometroActual: val });
                        }
                      }}
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Estado Operativo Inicial
                    </label>
                    <select
                      className="form-select"
                      value={formData.estado}
                      onChange={e => setFormData({ ...formData, estado: e.target.value as OperationalState })}
                    >
                      <option value="Operativo">Operativo</option>
                      <option value="En labor">En labor</option>
                      <option value="En mantenimiento">En mantenimiento</option>
                      <option value="Fuera de servicio">Fuera de servicio</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Intervalo Preventivo Regular
                    </label>
                    <select
                      className="form-select"
                      value={formData.intervaloMantenimientoHoras}
                      onChange={e => setFormData({ ...formData, intervaloMantenimientoHoras: parseInt(e.target.value, 10) })}
                    >
                      <option value={250}>Cada 250 Horas (Estándar Maquinaria / Diésel)</option>
                      <option value={500}>Cada 500 Horas / 5,000 km (Fluidos mayores)</option>
                      <option value={1000}>Cada 1,000 Horas / Anual</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Ubicación Inicial Asignada
                    </label>
                    <select
                      className="form-select"
                      value={formData.ubicacionAsignada}
                      onChange={e => setFormData({ ...formData, ubicacionAsignada: e.target.value })}
                    >
                      {LOCATIONS_OPTIONS.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Operador / Maquinista Asignado
                    </label>
                    <select
                      className="form-select"
                      value={formData.operadorAsignado}
                      onChange={e => setFormData({ ...formData, operadorAsignado: e.target.value })}
                    >
                      {OPERATORS_OPTIONS.map(op => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Valor Comercial Estimado (USD)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.valorEstimadoUsd}
                      onChange={e => setFormData({ ...formData, valorEstimadoUsd: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                      Fecha de Adquisición
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.fechaAdquisicion}
                      onChange={e => setFormData({ ...formData, fechaAdquisicion: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="equipment-modal-footer">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handlePrev}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <ChevronLeft size={16} />
                <span>Anterior</span>
              </button>
            )}

            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                className="btn-primary"
                onClick={handleNext}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <span>Siguiente</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Check size={16} />
                <span>Registrar Equipo</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
