import React from 'react';
import { 
  Info, 
  Award, 
  UserCheck, 
  MapPin, 
  FileText, 
  Scale, 
  Shield, 
  Layers, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { Animal360 } from '../../../types/animal';

interface TabGeneralIdentificacionProps {
  animal: Animal360;
}

export const TabGeneralIdentificacion: React.FC<TabGeneralIdentificacionProps> = ({ animal }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Fila Superior: Tarjeta de Identidad Visual + Hierro + Resumen Rápido */}
      <div className="ficha360-grid-3">
        {/* Avatar y Datos Principales */}
        <div className="ficha360-card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{
            width: 100,
            height: 100,
            borderRadius: 14,
            backgroundColor: '#e8f5e9',
            border: '2px solid #52b788',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.2" fill="#52b788" />
              <path d="M7 9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9z" />
              <circle cx="10" cy="11" r="1" fill="#2d6a4f" />
              <circle cx="14" cy="11" r="1" fill="#2d6a4f" />
              <path d="M10 14h4" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#1b4332', marginTop: 4 }}>
              {animal.practico}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#2d6a4f', textTransform: 'uppercase' }}>
              {animal.categoria} • {animal.sexo}
            </span>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
              {animal.alias || animal.practico}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              {animal.raza}
            </div>
            <div style={{ fontSize: 11.5, color: '#1b4332', fontWeight: 600, marginTop: 2 }}>
              Nacimiento: {animal.fechaNacimiento || 'N/D'} ({animal.edadTexto})
            </div>
          </div>
        </div>

        {/* Hierro / Marca de Fuego Digital */}
        <div className="ficha360-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 12,
            backgroundColor: '#fffbeb',
            border: '2px dashed #f59e0b',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#b45309', fontFamily: 'serif', letterSpacing: 1 }}>
              {animal.hierroMarca.codigo}
            </span>
            <span style={{ fontSize: 9, color: '#92400e', fontWeight: 700, textTransform: 'uppercase', marginTop: 2 }}>
              Hierro
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="ficha360-field-label">Hierro / Marca Registrada</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
              Código: {animal.hierroMarca.codigo}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              Posición: {animal.hierroMarca.posicion}
            </div>
            <div style={{ fontSize: 11.5, color: '#475569' }}>
              Tipo: {animal.hierroMarca.tipo}
            </div>
          </div>
        </div>

        {/* Tenencia y Propiedad */}
        <div className="ficha360-card">
          <div className="ficha360-card-title">
            <UserCheck size={16} color="#2d6a4f" />
            Propiedad y Origen
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="ficha360-field">
              <span className="ficha360-field-label">Propietario</span>
              <span className="ficha360-field-value">{animal.propietario} ({animal.porcentajeTenencia}%)</span>
            </div>
            <div className="ficha360-field">
              <span className="ficha360-field-label">Origen</span>
              <span className="ficha360-field-value">{animal.origen}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bloque Detallado de Identificación y Características Fenotípicas */}
      <div className="ficha360-grid-2">
        <div className="ficha360-card">
          <div className="ficha360-card-title">
            <Award size={16} color="#2d6a4f" />
            Identificadores Oficiales y Rastreo
          </div>

          <div className="ficha360-grid-2" style={{ gap: 14 }}>
            <div className="ficha360-field">
              <span className="ficha360-field-label">Arete de Manejo (Práctico)</span>
              <span className="ficha360-field-value" style={{ fontWeight: 700, color: '#2d6a4f' }}>
                {animal.practico}
              </span>
            </div>
            <div className="ficha360-field">
              <span className="ficha360-field-label">Código Único Nacional</span>
              <span className="ficha360-field-value">{animal.unico}</span>
            </div>
            <div className="ficha360-field">
              <span className="ficha360-field-label">Chip Transponder RFID / NFC</span>
              <span className="ficha360-field-value">{animal.rfid || 'No asignado'}</span>
            </div>
            <div className="ficha360-field">
              <span className="ficha360-field-label">Tatuaje Auricular</span>
              <span className="ficha360-field-value">{animal.tatuaje || 'Sin Tatuaje'}</span>
            </div>
            <div className="ficha360-field">
              <span className="ficha360-field-label">Especie Zootécnica</span>
              <span className="ficha360-field-value">{animal.especie}</span>
            </div>
            <div className="ficha360-field">
              <span className="ficha360-field-label">Aptitud Productiva</span>
              <span className="ficha360-field-value">{animal.finalidad}</span>
            </div>
          </div>
        </div>

        <div className="ficha360-card">
          <div className="ficha360-card-title">
            <Sparkles size={16} color="#2d6a4f" />
            Fenotipo y Conformación
          </div>

          <div className="ficha360-grid-2" style={{ gap: 14 }}>
            <div className="ficha360-field">
              <span className="ficha360-field-label">Pelaje / Coloración</span>
              <span className="ficha360-field-value">{animal.colorPelaje}</span>
            </div>
            <div className="ficha360-field">
              <span className="ficha360-field-label">Composición Racial</span>
              <span className="ficha360-field-value">{animal.raza}</span>
            </div>
            <div className="ficha360-field">
              <span className="ficha360-field-label">Peso Corporal Actual</span>
              <span className="ficha360-field-value" style={{ fontWeight: 700, color: '#1b4332' }}>
                {animal.pesajesAjustados.pesoActualKg} kg
              </span>
            </div>
            <div className="ficha360-field">
              <span className="ficha360-field-label">Condición Corporal</span>
              <span className="ficha360-field-value">
                {animal.condicionCorporalActual} / 5.0 (Óptima)
              </span>
            </div>
            <div className="ficha360-field">
              <span className="ficha360-field-label">Lote Zootécnico</span>
              <span className="ficha360-field-value">{animal.lote}</span>
            </div>
            <div className="ficha360-field">
              <span className="ficha360-field-label">Potrero Asignado</span>
              <span className="ficha360-field-value">{animal.potrero}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notas Zootécnicas y de Manejo */}
      <div className="ficha360-card">
        <div className="ficha360-card-title">
          <FileText size={16} color="#2d6a4f" />
          Notas Clínicas y Observaciones de Campo
        </div>
        <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.6, margin: 0 }}>
          {animal.notasZootecnicas}
        </p>
      </div>
    </div>
  );
};
