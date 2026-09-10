import React, { useState, useEffect } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GeneralConfig } from '../../types/config';
import { SETTINGS_MENU, SETTINGS_TABS } from './ajustesConstants';
import { GeneralConfigForm } from './components/GeneralConfigForm';

export const AjustesView: React.FC = () => {
  const { config, updateConfig, resetConfig } = useApp();
  const [menuActivo, setMenuActivo] = useState('configuracion');
  const [tabActivo, setTabActivo] = useState('general');
  const [formData, setFormData] = useState<GeneralConfig>(config);

  // Sync formData with context when config updates or resets
  useEffect(() => {
    setFormData(config);
  }, [config]);

  const handleFieldChange = (field: keyof GeneralConfig, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateConfig(formData);
    alert('Configuración guardada con éxito:\n' + JSON.stringify(formData, null, 2));
  };

  const handleReset = () => {
    resetConfig();
    alert('Valores restablecidos a la configuración por defecto.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* Header */}
      <div className="events-header">
        <div className="events-header-left">
          <h2 className="toolbar-title">Ajustes</h2>
        </div>
        <div className="events-header-right">
          {/* Orange Reset Button */}
          <button
            className="btn-orange-reset"
            onClick={handleReset}
            title="Restablecer valores por defecto"
            type="button"
          >
            <RotateCcw size={16} strokeWidth={2} />
            <span>Restablecer</span>
          </button>
          {/* Green Save Button */}
          <button
            className="btn-green-sliders"
            onClick={() => handleSave()}
            title="Guardar configuración"
            type="button"
          >
            <Save size={16} strokeWidth={2} />
            <span>Guardar</span>
          </button>
        </div>
      </div>

      {/* Main Card Container with Two Columns */}
      <div className="settings-card">
        {/* Left Column (Menu) */}
        <div className="settings-sidebar-menu">
          {SETTINGS_MENU.map(item => (
            <div
              key={item.id}
              className={`settings-sidebar-item ${menuActivo === item.id ? 'active' : ''}`}
              onClick={() => setMenuActivo(item.id)}
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* Right Column (Form & Tabs) */}
        <div className="settings-main-area">
          {/* Tabs */}
          <div className="settings-tabs">
            {SETTINGS_TABS.map(tab => (
              <div
                key={tab.id}
                className={`settings-tab ${tabActivo === tab.id ? 'active' : ''}`}
                onClick={() => setTabActivo(tab.id)}
              >
                {tab.label}
              </div>
            ))}
          </div>

          {/* Tab Content: General */}
          {tabActivo === 'general' && (
            <div>
              <GeneralConfigForm
                formData={formData}
                onChange={handleFieldChange}
                onSubmit={handleSave}
              />
            </div>
          )}

          {/* Other Tabs Placeholders */}
          {tabActivo === 'parametros' && (
            <div style={{ padding: '20px 0', color: 'var(--text-secondary)' }}>
              <h4>Parámetros de Configuración</h4>
              <p style={{ marginTop: 10, fontSize: 14 }}>
                Aquí se definen los límites, rangos de peso y lactancia del rebaño.
              </p>
            </div>
          )}

          {tabActivo === 'alertas' && (
            <div style={{ padding: '20px 0', color: 'var(--text-secondary)' }}>
              <h4>Alertas y Notificaciones</h4>
              <p style={{ marginTop: 10, fontSize: 14 }}>
                Definición de alertas tempranas para celos, vacunas y chequeos sanitarios.
              </p>
            </div>
          )}

          {tabActivo === 'automatizacion' && (
            <div style={{ padding: '20px 0', color: 'var(--text-secondary)' }}>
              <h4>Reglas de Automatización</h4>
              <p style={{ marginTop: 10, fontSize: 14 }}>
                Configurar triggers automáticos para cambios de lote y estatus.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
