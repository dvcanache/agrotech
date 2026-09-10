import React from 'react';
import { GeneralConfig } from '../../../types/config';
import {
  PAISES,
  ESPECIES,
  TIPOS_EXPLOTACION,
  TIPOS_MANEJO,
  ZONAS_AGROECOLOGICAS
} from '../ajustesConstants';

interface GeneralConfigFormProps {
  formData: GeneralConfig;
  onChange: (field: keyof GeneralConfig, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const GeneralConfigForm: React.FC<GeneralConfigFormProps> = ({
  formData,
  onChange,
  onSubmit
}) => {
  return (
    <form className="settings-form-grid" onSubmit={onSubmit}>
      {/* Propietario */}
      <div className="form-field">
        <label className="form-label" htmlFor="propietario">Propietario</label>
        <input
          className="form-input"
          type="text"
          id="propietario"
          value={formData.propietario}
          onChange={e => onChange('propietario', e.target.value)}
          required
        />
      </div>

      {/* Nombre */}
      <div className="form-field">
        <label className="form-label" htmlFor="nombre">Nombre</label>
        <input
          className="form-input"
          type="text"
          id="nombre"
          value={formData.nombre}
          onChange={e => onChange('nombre', e.target.value)}
          required
        />
      </div>

      {/* País */}
      <div className="form-field">
        <label className="form-label" htmlFor="pais">País</label>
        <select
          className="form-select"
          id="pais"
          value={formData.pais}
          onChange={e => onChange('pais', e.target.value)}
          required
        >
          {PAISES.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Especie */}
      <div className="form-field">
        <label className="form-label" htmlFor="especie">Especie</label>
        <select
          className="form-select"
          id="especie"
          value={formData.especie}
          onChange={e => onChange('especie', e.target.value)}
          required
        >
          {ESPECIES.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      {/* Tipo de Explotación */}
      <div className="form-field">
        <label className="form-label" htmlFor="tipoExplotacion">Tipo de Explotación</label>
        <select
          className="form-select"
          id="tipoExplotacion"
          value={formData.tipoExplotacion}
          onChange={e => onChange('tipoExplotacion', e.target.value)}
          required
        >
          {TIPOS_EXPLOTACION.map(te => (
            <option key={te} value={te}>{te}</option>
          ))}
        </select>
      </div>

      {/* Tipo de Manejo */}
      <div className="form-field">
        <label className="form-label" htmlFor="tipoManejo">Tipo de Manejo</label>
        <select
          className="form-select"
          id="tipoManejo"
          value={formData.tipoManejo}
          onChange={e => onChange('tipoManejo', e.target.value)}
          required
        >
          {TIPOS_MANEJO.map(tm => (
            <option key={tm} value={tm}>{tm}</option>
          ))}
        </select>
      </div>

      {/* Zona Agroecológica */}
      <div className="form-field span-full">
        <label className="form-label" htmlFor="zonaAgroecologica">Zona Agroecológica</label>
        <select
          className="form-select"
          id="zonaAgroecologica"
          value={formData.zonaAgroecologica}
          onChange={e => onChange('zonaAgroecologica', e.target.value)}
          required
        >
          {ZONAS_AGROECOLOGICAS.map(za => (
            <option key={za} value={za}>{za}</option>
          ))}
        </select>
      </div>
    </form>
  );
};
