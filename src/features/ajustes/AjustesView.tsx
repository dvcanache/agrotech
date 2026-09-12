import React, { useState, useEffect } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GeneralConfig } from '../../types/config';
import { SETTINGS_MENU, SETTINGS_TABS } from './ajustesConstants';
import { GeneralConfigForm } from './components/GeneralConfigForm';
import { ParametrosConfigForm } from './components/ParametrosConfigForm';
import { AlertasConfigForm } from './components/AlertasConfigForm';
import { AutomatizacionConfigForm } from './components/AutomatizacionConfigForm';
import { CatalogView } from './components/CatalogView';

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
          <h2 className="toolbar-title">Ajustes & Configuración</h2>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Parámetros zootécnicos, alertas y catálogos maestros del rebaño
          </span>
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

        {/* Right Column (Form & Tabs or Catalog) */}
        <div className="settings-main-area">
          {menuActivo === 'configuracion' ? (
            <>
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

              {/* Tab Content: Parámetros */}
              {tabActivo === 'parametros' && (
                <div>
                  <ParametrosConfigForm />
                </div>
              )}

              {/* Tab Content: Alertas */}
              {tabActivo === 'alertas' && (
                <div>
                  <AlertasConfigForm />
                </div>
              )}

              {/* Tab Content: Automatización */}
              {tabActivo === 'automatizacion' && (
                <div>
                  <AutomatizacionConfigForm />
                </div>
              )}
            </>
          ) : (
            <div>
              <CatalogView catalogType={menuActivo as any} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
