import React, { useState } from 'react';
import { Save, Bell, ShieldAlert, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  MATRIZ_ALERTAS_POR_ESPECIE,
  ParametrosAlertasEspecie,
  getParametrosAlertasPorEspecie
} from '../utils/speciesAlertsEngine';

const ESPECIES_DISPONIBLES = [
  'Bovinos',
  'Búfalos',
  'Equinos',
  'Porcinos',
  'Caprinos',
  'Ovinos',
  'Aves de corral'
];

export const AlertasConfigForm: React.FC = () => {
  const [selectedSpecies, setSelectedSpecies] = useState<string>('Bovinos');

  // Estado de alertas por especie inicializado con la matriz biológica
  const [configPorEspecie, setConfigPorEspecie] = useState<Record<string, {
    diasAvisoPreparto: number;
    diasPostServicioDiagnostico: number;
    diasAvisoPresecado: number;
    umbralCelosRepetidos: number;
  }>>(() => {
    const init: Record<string, any> = {};
    for (const esp of ESPECIES_DISPONIBLES) {
      const p = MATRIZ_ALERTAS_POR_ESPECIE[esp];
      init[esp] = {
        diasAvisoPreparto: p.diasAvisoPreparto,
        diasPostServicioDiagnostico: esp === 'Equinos' ? 14 : esp === 'Porcinos' ? 21 : esp === 'Aves de corral' ? 7 : 35,
        diasAvisoPresecado: p.diasAvisoPresecado || 0,
        umbralCelosRepetidos: p.umbralCelosRepetidos
      };
    }
    return init;
  });

  // Opciones globales de inocuidad
  const [globalOptions, setGlobalOptions] = useState({
    alertaRetiroFarmacologico: true,
    alertaMastitisSinTratar: true
  });

  const activeParams: ParametrosAlertasEspecie = getParametrosAlertasPorEspecie(selectedSpecies);
  const currentConfig = configPorEspecie[selectedSpecies] || {
    diasAvisoPreparto: activeParams.diasAvisoPreparto,
    diasPostServicioDiagnostico: 35,
    diasAvisoPresecado: activeParams.diasAvisoPresecado || 0,
    umbralCelosRepetidos: activeParams.umbralCelosRepetidos
  };

  const handleFieldChange = (field: string, value: number) => {
    setConfigPorEspecie(prev => ({
      ...prev,
      [selectedSpecies]: {
        ...prev[selectedSpecies],
        [field]: value
      }
    }));
  };

  const handleResetToBiologicalStandard = () => {
    const p = MATRIZ_ALERTAS_POR_ESPECIE[selectedSpecies];
    setConfigPorEspecie(prev => ({
      ...prev,
      [selectedSpecies]: {
        diasAvisoPreparto: p.diasAvisoPreparto,
        diasPostServicioDiagnostico: selectedSpecies === 'Equinos' ? 14 : selectedSpecies === 'Porcinos' ? 21 : selectedSpecies === 'Aves de corral' ? 7 : 35,
        diasAvisoPresecado: p.diasAvisoPresecado || 0,
        umbralCelosRepetidos: p.umbralCelosRepetidos
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Configuración de alertas zootécnicas para ${selectedSpecies} guardada exitosamente.`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#fff3e0',
        borderRadius: 8,
        border: '1px solid #ffe0b2',
        color: '#e65100',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <Bell size={18} color="#e65100" />
        <span>
          Las alertas generan avisos dinámicos en el Dashboard, Centro de Eventos y Centro de Reportes
          adaptadas a la biología reproductiva y fisiología de cada especie (Parche 17).
        </span>
      </div>

      {/* Selector de Especie Activa */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid var(--border-gray)',
        borderRadius: 8,
        padding: '12px 16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            Especie Pecuaria a Configurar:
          </label>
          <button
            type="button"
            onClick={handleResetToBiologicalStandard}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary-color)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <Sparkles size={14} />
            Restablecer Valores Fisiológicos Sugeridos
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {ESPECIES_DISPONIBLES.map(esp => {
            const isSelected = selectedSpecies === esp;
            return (
              <button
                key={esp}
                type="button"
                onClick={() => setSelectedSpecies(esp)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12.5,
                  fontWeight: isSelected ? 700 : 500,
                  border: isSelected ? '1.5px solid var(--primary-color)' : '1px solid #cbd5e1',
                  backgroundColor: isSelected ? 'var(--primary-ultra-light)' : '#ffffff',
                  color: isSelected ? 'var(--primary-dark)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {esp}
              </button>
            );
          })}
        </div>
      </div>

      {/* Banner de Metodología Diagnóstica Recomendada */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 12.5,
        color: '#0369a1',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
        <CheckCircle2 size={18} style={{ flexShrink: 0, color: '#0284c7' }} />
        <div>
          <strong>Protocolo Diagnóstico Recomendado ({selectedSpecies}):</strong> {activeParams.metodoDiagnosticoRecomendado}
          <div style={{ fontSize: 11.5, color: '#0c4a6e', marginTop: 2 }}>
            Control de inocuidad alimentaria activo para: <strong>{activeParams.viasControlInocuidad.join(' y ')}</strong>.
          </div>
        </div>
      </div>

      {/* Campos de Configuración Adaptados a la Especie */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="form-field">
          <label className="form-label">
            Aviso Preparto / Maternidad ({selectedSpecies})
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="number"
              min="0"
              max="60"
              className="form-input"
              value={currentConfig.diasAvisoPreparto}
              onChange={e => handleFieldChange('diasAvisoPreparto', parseInt(e.target.value, 10) || 0)}
              style={{ width: 100 }}
            />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>días preparto</span>
          </div>
          <span className="form-hint">
            {selectedSpecies === 'Porcinos' && 'Sugerido: 5 días (ingreso a jaula paridera a los 107-109d para evitar SDP/MMA).'}
            {selectedSpecies === 'Equinos' && 'Sugerido: 30 días (habitualización a paridero y refuerzo vacunal tétanos/influenza).'}
            {selectedSpecies === 'Bovinos' && 'Sugerido: 15 días (traslado a lote preparto y dieta de transición aniónica).'}
            {selectedSpecies === 'Búfalos' && 'Sugerido: 20 días (separación a potrero de maternidad sombreado con agua).'}
            {selectedSpecies === 'Caprinos' && 'Sugerido: 10 días (ingreso a paridero individual en tarima).'}
            {selectedSpecies === 'Ovinos' && 'Sugerido: 10 días (manejo en corral paridero).'}
            {selectedSpecies === 'Aves de corral' && 'No aplica preparto biológico en aves (ovíparas).'}
          </span>
        </div>

        <div className="form-field">
          <label className="form-label">
            Diagnóstico Post-Servicio ({selectedSpecies})
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="number"
              min="1"
              max="90"
              className="form-input"
              value={currentConfig.diasPostServicioDiagnostico}
              onChange={e => handleFieldChange('diasPostServicioDiagnostico', parseInt(e.target.value, 10) || 0)}
              style={{ width: 100 }}
            />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>días post-servicio</span>
          </div>
          <span className="form-hint">
            {selectedSpecies === 'Equinos' && 'Sugerido: 14 días (crítico días 14-16 para descarte precoz y reducción de gemelos).'}
            {selectedSpecies === 'Porcinos' && 'Sugerido: 21 a 28 días (coincide con retorno al celo por ultrasonido sectorial).'}
            {selectedSpecies === 'Bovinos' && 'Sugerido: 28 a 35 días (ecografía B-mode temprana) o 35-45d (palpación rectal).'}
            {selectedSpecies === 'Búfalos' && 'Sugerido: 30 a 45 días (ecografía transrectal).'}
            {selectedSpecies === 'Caprinos' && 'Sugerido: 35 a 50 días (ultrasonografía transabdominal/transrectal).'}
            {selectedSpecies === 'Ovinos' && 'Sugerido: 35 a 50 días (ultrasonografía transabdominal).'}
            {selectedSpecies === 'Aves de corral' && 'Sugerido: 7 a 14 días (ovoscopía de fertilidad en incubación).'}
          </span>
        </div>

        <div className="form-field">
          <label className="form-label">
            Aviso Previo a Fecha de Secado
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="number"
              min="0"
              max="60"
              disabled={!activeParams.aplicaSecadoMamario}
              className="form-input"
              value={activeParams.aplicaSecadoMamario ? currentConfig.diasAvisoPresecado : 0}
              onChange={e => handleFieldChange('diasAvisoPresecado', parseInt(e.target.value, 10) || 0)}
              style={{ width: 100, backgroundColor: !activeParams.aplicaSecadoMamario ? '#f1f5f9' : undefined }}
            />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {activeParams.aplicaSecadoMamario ? 'días de anticipación' : 'No aplica para esta especie'}
            </span>
          </div>
          <span className="form-hint">
            {activeParams.aplicaSecadoMamario
              ? 'Programación de cese de ordeño y terapia antibiótica intramamaria de secado.'
              : `En ${selectedSpecies} no se realiza terapia intramamaria de secado (destete natural de camada/potro o producción de carne/huevo).`}
          </span>
        </div>

        <div className="form-field">
          <label className="form-label">
            Alerta de Celos Repetidos (Servicios Fallidos)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="number"
              min="1"
              max="10"
              disabled={selectedSpecies === 'Aves de corral'}
              className="form-input"
              value={currentConfig.umbralCelosRepetidos}
              onChange={e => handleFieldChange('umbralCelosRepetidos', parseInt(e.target.value, 10) || 0)}
              style={{ width: 100, backgroundColor: selectedSpecies === 'Aves de corral' ? '#f1f5f9' : undefined }}
            />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>repeticiones fallidas</span>
          </div>
          <span className="form-hint">
            {selectedSpecies === 'Porcinos'
              ? 'Umbral recomendado: 2 fallos (en porcinocultura 2 celos repetidos exige revisión ginecológica o descarte).'
              : selectedSpecies === 'Aves de corral'
              ? 'No aplica ciclos estrales en aves.'
              : 'Umbral estándar: 3 servicios fallidos (Síndrome de la Vaca Repetidora / Repeat Breeder).'}
          </span>
        </div>
      </div>

      {/* Controles Globales de Inocuidad y Sanidad */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5 }}>
          <input
            type="checkbox"
            className="custom-checkbox"
            checked={globalOptions.alertaRetiroFarmacologico}
            onChange={e => setGlobalOptions({ ...globalOptions, alertaRetiroFarmacologico: e.target.checked })}
          />
          <div>
            <strong>Alerta de Tiempo de Retiro Farmacológico (Inocuidad Multiespecie: Leche, Carne, Huevo)</strong>
            <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
              Bloquea el despacho de leche a tanque, huevo a comercialización y semovientes a faena/matadero mientras persistan residuos biológicos activos.
            </div>
          </div>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5 }}>
          <input
            type="checkbox"
            className="custom-checkbox"
            checked={globalOptions.alertaMastitisSinTratar}
            onChange={e => setGlobalOptions({ ...globalOptions, alertaMastitisSinTratar: e.target.checked })}
          />
          <div>
            <strong>Alerta Inmediata de Mastitis Clínica Activa (Bovinos, Búfalos, Caprinos)</strong>
            <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
              Notifica al operador de ordeño para desvío obligatorio de leche y aplicación de protocolo veterinario.
            </div>
          </div>
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Save size={16} />
          <span>Guardar Alertas ({selectedSpecies})</span>
        </button>
      </div>
    </form>
  );
};
