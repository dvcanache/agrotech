import React, { useState, useMemo } from 'react';
import { X, Plus, Sparkles, Tag, Calendar, Layers, Activity } from 'lucide-react';
import { Animal, EspecieAnimal, ESPECIES_TAXONOMY } from '../../../types/animal';

interface NuevoAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (animal: Animal) => void;
  defaultEspecie?: string;
  defaultSubcategoria?: string;
}

export const NuevoAnimalModal: React.FC<NuevoAnimalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultEspecie = 'Bovinos',
  defaultSubcategoria = 'Vacas'
}) => {
  const initialSpecies: EspecieAnimal = (
    defaultEspecie && defaultEspecie !== 'Todas' && defaultEspecie !== 'Todas las especies'
      ? defaultEspecie as EspecieAnimal
      : 'Bovinos'
  );

  const [especie, setEspecie] = useState<EspecieAnimal>(initialSpecies);
  const [practico, setPractico] = useState('');
  const [unico, setUnico] = useState('');
  const [subcategoria, setSubcategoria] = useState(defaultSubcategoria || 'Vacas');
  const [sexo, setSexo] = useState<'Hembra' | 'Macho'>('Hembra');
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date().toISOString().split('T')[0]);
  const [lote, setLote] = useState('POT1');
  const [composicion, setComposicion] = useState('Carora');
  const [racial, setRacial] = useState('100%');
  const [pesoKg, setPesoKg] = useState<number>(420);
  const [padre, setPadre] = useState('');
  const [madre, setMadre] = useState('');
  const [rfid, setRfid] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Subcategorías según la especie seleccionada
  const subcategoriasDisponibles = useMemo(() => {
    const tax = ESPECIES_TAXONOMY[especie];
    return tax ? tax.subcategorias : ['General'];
  }, [especie]);

  // Actualizar subcategoría y sugerencias cuando cambia la especie
  const handleEspecieChange = (nuevaEspecie: EspecieAnimal) => {
    setEspecie(nuevaEspecie);
    const tax = ESPECIES_TAXONOMY[nuevaEspecie];
    if (tax && tax.subcategorias.length > 0) {
      setSubcategoria(tax.subcategorias[0]);
    }
    // Ajustar peso y raza sugeridos
    if (nuevaEspecie === 'Aves de corral') {
      setPesoKg(2.2);
      setComposicion('Lohmann Brown');
      setLote('GALP-01');
    } else if (nuevaEspecie === 'Porcinos') {
      setPesoKg(110);
      setComposicion('Landrace x Pietrain');
      setLote('PIARA-01');
    } else if (nuevaEspecie === 'Caprinos') {
      setPesoKg(45);
      setComposicion('Alpino Francés');
      setLote('APRISCO-1');
    } else if (nuevaEspecie === 'Equinos') {
      setPesoKg(450);
      setComposicion('Cuarto de Milla');
      setLote('CABALLERIZA-1');
    } else if (nuevaEspecie === 'Búfalos') {
      setPesoKg(520);
      setComposicion('Murrah');
      setLote('SABANA-1');
    } else {
      setPesoKg(450);
      setComposicion('Carora');
      setLote('POT1');
    }
  };

  // Calcular edad aproximada en meses / años
  const edadCalculada = useMemo(() => {
    if (!fechaNacimiento) return '0 m';
    const birth = new Date(fechaNacimiento);
    const now = new Date();
    const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (diffMonths <= 0) return 'Recién nacido';
    if (diffMonths < 12) return `${diffMonths} m`;
    const years = Math.floor(diffMonths / 12);
    const remMonths = diffMonths % 12;
    return remMonths > 0 ? `${years} a ${remMonths} m` : `${years} años`;
  }, [fechaNacimiento]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!practico.trim()) {
      alert('Por favor ingrese el número o código práctico del animal.');
      return;
    }

    const nuevoAnimal: Animal = {
      practico: practico.trim().toUpperCase(),
      unico: unico.trim() || `VE-${practico.trim().toUpperCase()}`,
      especie,
      categoria: subcategoria,
      subcategoria,
      estatus: 'Activo',
      fechaNacimiento,
      edad: edadCalculada,
      lote: lote || 'POT1',
      descripcion: descripcion || `${especie} - ${subcategoria} en lote ${lote}`,
      composicion,
      racial,
      etiquetas: `${especie}, ${subcategoria}`,
      activos: 'Activo',
      padre: padre.trim() || 'Desconocido',
      madre: madre.trim() || 'Desconocida',
      pesoKg: Number(pesoKg) || 0,
      rfid: rfid.trim(),
      sexo,
      estatusReproductivo: sexo === 'Hembra' ? 'Apta' : 'Reproductor',
      estatusProductivo: 'En producción'
    };

    onSave(nuevoAnimal);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16
    }}>
      <div className="modal-card" style={{
        backgroundColor: '#ffffff',
        borderRadius: 14,
        width: '100%',
        maxWidth: 680,
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.25)',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: '#dcfce7',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Plus size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1e293b' }}>
                Registrar Nuevo Semoviente
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                Alta de animal en el inventario ganadero y biometría 360°
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 6
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Especie Selector Chips */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Especie Zootécnica *
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.values(ESPECIES_TAXONOMY).map(tax => {
                const isSelected = especie === tax.id;
                return (
                  <button
                    key={tax.id}
                    type="button"
                    onClick={() => handleEspecieChange(tax.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 12px',
                      borderRadius: 8,
                      border: isSelected ? '2px solid #166534' : '1px solid #cbd5e1',
                      backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                      color: isSelected ? '#166534' : '#475569',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{tax.icono}</span>
                    <span>{tax.nombre}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fila 1: Código Práctico, Único y Sexo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                N° Práctico / Arete *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 0075"
                value={practico}
                onChange={e => setPractico(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Código Único / SINIIGA
              </label>
              <input
                type="text"
                placeholder="Ej: VE-0075"
                value={unico}
                onChange={e => setUnico(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Sexo *
              </label>
              <select
                value={sexo}
                onChange={e => setSexo(e.target.value as 'Hembra' | 'Macho')}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="Hembra">Hembra</option>
                <option value="Macho">Macho</option>
              </select>
            </div>
          </div>

          {/* Fila 2: Subcategoría y Lote */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Categoría / Subcategoría *
              </label>
              <select
                value={subcategoria}
                onChange={e => setSubcategoria(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                {subcategoriasDisponibles.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Potrero / Lote *
              </label>
              <input
                type="text"
                value={lote}
                onChange={e => setLote(e.target.value)}
                placeholder="Ej: POT1, Lote Ordeño"
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Fila 3: Fecha Nacimiento, Edad Calculada y Peso */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={e => setFechaNacimiento(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Edad Estimada
              </label>
              <div style={{
                height: 38,
                padding: '0 12px',
                borderRadius: 6,
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                fontSize: 13,
                fontWeight: 600,
                color: '#334155'
              }}>
                {edadCalculada}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Peso Corporal (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={pesoKg}
                onChange={e => setPesoKg(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Fila 4: Raza / Composición y Genealogía */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Raza / Composición
              </label>
              <input
                type="text"
                placeholder="Ej: Carora, Brahman x Holstein"
                value={composicion}
                onChange={e => setComposicion(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Padre (Semental)
              </label>
              <input
                type="text"
                placeholder="Ej: SM01 o Toro 12"
                value={padre}
                onChange={e => setPadre(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Madre (Vientre)
              </label>
              <input
                type="text"
                placeholder="Ej: 0014"
                value={madre}
                onChange={e => setMadre(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Fila 5: Chip RFID y Descripción */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Chip RFID / Dispositivo Electrónico
              </label>
              <input
                type="text"
                placeholder="Ej: 982000345678912"
                value={rfid}
                onChange={e => setRfid(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  fontFamily: 'monospace',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Observaciones / Rasgos Particulares
              </label>
              <input
                type="text"
                placeholder="Ej: Mancha blanca en frente, cuernos topizados"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 12,
            marginTop: 12,
            paddingTop: 16,
            borderTop: '1px solid #e2e8f0'
          }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              style={{ padding: '8px 18px', fontSize: 13 }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 20px',
                fontSize: 13,
                fontWeight: 600
              }}
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Guardar Semoviente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
