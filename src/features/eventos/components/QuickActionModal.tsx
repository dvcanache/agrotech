import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  Heart, 
  Milk, 
  Boxes, 
  Stethoscope, 
  Trees, 
  Settings2,
  ChevronRight,
  ArrowRight,
  Zap,
  Wrench
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { EVENT_CATEGORIES } from '../eventosData';
import { EspecieAnimal, ESPECIES_TAXONOMY } from '../../../types/animal';
import './eventosSpreadsheet.css';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (tipo: string, categoria: string, codigoAnimal: string) => void;
}

interface QuickLauncherItem {
  id: string;
  nombre: string;
  tipo: string;
  categoria: string;
  especie: EspecieAnimal;
  descripcion: string;
  icono: string;
  color: string;
}

const SPECIES_RAPID_LAUNCHERS: QuickLauncherItem[] = [
  // 🐮 BOVINOS
  {
    id: 'lnc-bov-1',
    nombre: 'Control Lechero Diario (Bovinos)',
    tipo: 'Pesajes de leche',
    categoria: 'Productivos',
    especie: 'Bovinos',
    descripcion: 'Registro de pesaje AM/PM, grasa y conteo de células somáticas',
    icono: '🥛',
    color: '#059669'
  },
  {
    id: 'lnc-bov-2',
    nombre: 'Prueba CMT Mastitis 4 Cuartos',
    tipo: 'Mastitis (CMT 4 cuartos)',
    categoria: 'Sanitarios & Veterinarios',
    especie: 'Bovinos',
    descripcion: 'Diagnóstico en 4 cuartos con cálculo de días de retiro en leche',
    icono: '🩺',
    color: '#dc2626'
  },
  {
    id: 'lnc-bov-3',
    nombre: 'Servicio IATF & Consanguinidad Wright',
    tipo: 'Servicios IA / Monta',
    categoria: 'Reproductivos',
    especie: 'Bovinos',
    descripcion: 'Inseminación con chequeo de parentesco genético F < 6.25%',
    icono: '🧬',
    color: '#2563eb'
  },

  // 🐔 AVES DE CORRAL
  {
    id: 'lnc-ave-1',
    nombre: 'Recolección de Postura en Galpón',
    tipo: 'Control de Postura Avícola',
    categoria: 'Productivos',
    especie: 'Aves de corral',
    descripcion: 'Huevos clasificados AAA/AA/A, rotos y cálculo automático de % postura',
    icono: '🥚',
    color: '#d97706'
  },
  {
    id: 'lnc-ave-2',
    nombre: 'Incubación & Eclosión Avícola',
    tipo: 'Incubación & Eclosión Avícola',
    categoria: 'Reproductivos',
    especie: 'Aves de corral',
    descripcion: 'Carga fértil, ovoscopía a 7d/14d, eclosión y Pasgar score élite',
    icono: '🐥',
    color: '#ca8a04'
  },
  {
    id: 'lnc-ave-3',
    nombre: 'Vacunación Aviar por Vía Especializada',
    tipo: 'Vacunación por Vía (Avícola/Porcina/Equina)',
    categoria: 'Sanitarios & Veterinarios',
    especie: 'Aves de corral',
    descripcion: 'Aplicación Newcastle, Viruela o Gumboro por ojo, aspersión o ala',
    icono: '💉',
    color: '#0891b2'
  },
  {
    id: 'lnc-ave-4',
    nombre: 'Acondicionamiento de Gallos Finos',
    tipo: 'Acondicionamiento Gallos Finos',
    categoria: 'Manejo & Rutina',
    especie: 'Aves de corral',
    descripcion: 'Control de peso de combate, sesiones de careo y arreglo de espuelas',
    icono: '🐓',
    color: '#b45309'
  },

  // 🐷 PORCINOS
  {
    id: 'lnc-por-1',
    nombre: 'Registro de Camada Porcina (Parto LNV)',
    tipo: 'Camadas Porcinas',
    categoria: 'Reproductivos',
    especie: 'Porcinos',
    descripcion: 'Nacidos vivos (LNV), mortinatos, momias, peso camada y nodriza',
    icono: '🐖',
    color: '#ea580c'
  },
  {
    id: 'lnc-por-2',
    nombre: 'Manejo Neonatal Porcino (Días 1 a 3)',
    tipo: 'Manejo Neonatal Porcino (Descolmillado/Caudectomía/Hierro)',
    categoria: 'Manejo & Rutina',
    especie: 'Porcinos',
    descripcion: 'Descolmillado, corte de cola, 200mg hierro dextrano y muescado',
    icono: '✂️',
    color: '#c2410c'
  },
  {
    id: 'lnc-por-3',
    nombre: 'Ceba & Medición Grasa Dorsal P2',
    tipo: 'Ceba & Grasa Dorsal Porcina',
    categoria: 'Productivos',
    especie: 'Porcinos',
    descripcion: 'Pesajes de ceba, espesor P2 ultrasonido (mm) y % magro a matadero',
    icono: '⚖️',
    color: '#9a3412'
  },

  // 🐃 BÚFALOS
  {
    id: 'lnc-buf-1',
    nombre: 'Control Lechero Bufalino (Mozzarella)',
    tipo: 'Pesajes de leche',
    categoria: 'Productivos',
    especie: 'Búfalos',
    descripcion: 'Control de sólidos totales (17-19%) y grasa butirométrica (7.5-9.0%)',
    icono: '🐃',
    color: '#4f46e5'
  },
  {
    id: 'lnc-buf-2',
    nombre: 'Monta Natural Padrote Búfalo',
    tipo: 'Servicios IA / Monta',
    categoria: 'Reproductivos',
    especie: 'Búfalos',
    descripcion: 'Servicio estacional en sabana baja con reproductor Murrah o Mediterráneo',
    icono: '🐂',
    color: '#4338ca'
  },

  // 🐐 CAPRINOS
  {
    id: 'lnc-cap-1',
    nombre: 'Evaluación Ocular FAMACHA Caprina',
    tipo: 'Evaluación FAMACHA Caprina',
    categoria: 'Sanitarios & Veterinarios',
    especie: 'Caprinos',
    descripcion: 'Diagnóstico ocular selectivo (grados 1 a 5) para Haemonchus contortus',
    icono: '👁️',
    color: '#0d9488'
  },
  {
    id: 'lnc-cap-2',
    nombre: 'Control Lechero Caprino en Tarima',
    tipo: 'Pesajes de leche',
    categoria: 'Productivos',
    especie: 'Caprinos',
    descripcion: 'Pesaje individual en ordeño Saanen/Alpino con 4.2% grasa promedio',
    icono: '🐐',
    color: '#0f766e'
  },
  {
    id: 'lnc-cap-3',
    nombre: 'Parto Múltiple Caprino & Crías',
    tipo: 'Partos',
    categoria: 'Reproductivos',
    especie: 'Caprinos',
    descripcion: 'Partos simples, mellizos o trillizos con encalostrado asistido',
    icono: '🍼',
    color: '#14b8a6'
  },

  // 🐴 EQUINOS
  {
    id: 'lnc-equ-1',
    nombre: 'Plan de Herraje Profesional (35-45d)',
    tipo: 'Podología & Herraje Equino',
    categoria: 'Sanitarios & Veterinarios',
    especie: 'Equinos',
    descripcion: 'Maestro herrador, tipo de herraduras, balance de aplomos y próximo herraje',
    icono: '🐎',
    color: '#7c3aed'
  },
  {
    id: 'lnc-equ-2',
    nombre: 'Certificación Oficial Test de Coggins AIE',
    tipo: 'Planes Sanitarios',
    categoria: 'Sanitarios & Veterinarios',
    especie: 'Equinos',
    descripcion: 'Registro de dictamen oficial INSAI negativo y vigencia semestral',
    icono: '📜',
    color: '#6d28d9'
  },
  {
    id: 'lnc-equ-3',
    nombre: 'Foliculometría Ovárica Ecográfica',
    tipo: 'Foliculometría Equina',
    categoria: 'Reproductivos',
    especie: 'Equinos',
    descripcion: 'Medición de folículo preovulatorio (mm) y grado de edema uterino',
    icono: '🔬',
    color: '#5b21b6'
  },
  {
    id: 'lnc-equ-4',
    nombre: 'Doma Racional & Jornada de Vaquería',
    tipo: 'Doma Racional Equina',
    categoria: 'Manejo & Rutina',
    especie: 'Equinos',
    descripcion: 'Etapas de doma a la cuerda, filete y bitácora de faena de sabana',
    icono: '🤠',
    color: '#8b5cf6'
  }
];

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onSelectAction
}) => {
  const { animals } = useApp();
  const [query, setQuery] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<string>('');
  const [selectedSpeciesFilter, setSelectedSpeciesFilter] = useState<'Todas' | EspecieAnimal>('Todas');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedAnimal('');
      setSelectedSpeciesFilter('Todas');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Flattened event catalog list
  const allEvents = EVENT_CATEGORIES.flatMap(cat => 
    cat.enlaces.map(link => ({
      name: link,
      category: cat.titulo,
      iconType: cat.iconoType
    }))
  );

  // Filtered standard events
  const filteredEvents = allEvents.filter(ev => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return ev.name.toLowerCase().includes(q) || ev.category.toLowerCase().includes(q);
  });

  // Filtered rapid launchers
  const filteredLaunchers = SPECIES_RAPID_LAUNCHERS.filter(item => {
    if (selectedSpeciesFilter !== 'Todas' && item.especie !== selectedSpeciesFilter) {
      return false;
    }
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.nombre.toLowerCase().includes(q) ||
      item.descripcion.toLowerCase().includes(q) ||
      item.tipo.toLowerCase().includes(q) ||
      item.categoria.toLowerCase().includes(q) ||
      item.especie.toLowerCase().includes(q)
    );
  });

  // Filtered animals matching search query
  const filteredAnimals = animals.filter(a => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      a.practico.toLowerCase().includes(q) ||
      (a.unico && a.unico.toLowerCase().includes(q)) ||
      a.categoria.toLowerCase().includes(q) ||
      (a.especie && a.especie.toLowerCase().includes(q)) ||
      (a.lote && a.lote.toLowerCase().includes(q))
    );
  }).slice(0, 4);

  const getCategoryIcon = (category: string) => {
    if (category.includes('Reproductiv')) return <Heart size={16} color="#e11d48" />;
    if (category.includes('Productiv')) return <Milk size={16} color="#059669" />;
    if (category.includes('Sanitari') || category.includes('Veterinari')) return <Stethoscope size={16} color="#dc2626" />;
    if (category.includes('Manejo') || category.includes('Rutina')) return <Wrench size={16} color="#d97706" />;
    if (category.includes('Inventario') || category.includes('Movimiento')) return <Boxes size={16} color="#2563eb" />;
    if (category.includes('Potrero')) return <Trees size={16} color="#16a34a" />;
    return <Settings2 size={16} color="#64748b" />;
  };

  const findDefaultAnimalForSpecies = (species: EspecieAnimal): string => {
    const match = animals.find(a => a.especie === species);
    if (match) return match.practico;
    switch (species) {
      case 'Aves de corral': return 'GALP-01';
      case 'Porcinos': return 'POR-CR01';
      case 'Búfalos': return 'BUF-01';
      case 'Caprinos': return 'CAP-CL01';
      case 'Equinos': return 'EQU-YG01';
      default: return '0001';
    }
  };

  const handleSelectLauncher = (launcher: QuickLauncherItem) => {
    let targetAnimal = selectedAnimal;
    if (!targetAnimal) {
      targetAnimal = findDefaultAnimalForSpecies(launcher.especie);
    }
    onSelectAction(launcher.tipo, launcher.categoria, targetAnimal);
    onClose();
  };

  const handleSelectEvent = (name: string, category: string) => {
    let targetAnimal = selectedAnimal;
    if (!targetAnimal) {
      if (filteredAnimals.length > 0) {
        targetAnimal = filteredAnimals[0].practico;
      } else if (selectedSpeciesFilter !== 'Todas') {
        targetAnimal = findDefaultAnimalForSpecies(selectedSpeciesFilter);
      } else {
        targetAnimal = '0001';
      }
    }
    onSelectAction(name, category, targetAnimal);
    onClose();
  };

  return (
    <div className="quick-action-backdrop" onClick={onClose}>
      <div className="quick-action-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 720 }}>
        {/* Search Input Bar */}
        <div className="quick-action-search-header">
          <Zap size={20} color="#d97706" />
          <input
            ref={inputRef}
            type="text"
            className="quick-action-search-input"
            placeholder="Búsqueda rápida: 'Postura', 'CMT', 'Camada', 'Herraje', 'FAMACHA' o código de animal..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {selectedAnimal && (
            <span style={{ 
              fontSize: 11, 
              backgroundColor: '#e8f5e9', 
              color: '#2d6a4f', 
              padding: '3px 8px', 
              borderRadius: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              Animal: {selectedAnimal}
              <button type="button" onClick={() => setSelectedAnimal('')} style={{ fontSize: 10, cursor: 'pointer', background: 'none', border: 'none', color: '#2d6a4f' }}>✕</button>
            </span>
          )}
          <span className="quick-action-kbd">ESC</span>
        </div>

        {/* Species Filter Pills Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 18px',
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#fafbfc',
          overflowX: 'auto'
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginRight: 4, textTransform: 'uppercase' }}>
            Especie:
          </span>
          {(['Todas', 'Bovinos', 'Aves de corral', 'Porcinos', 'Búfalos', 'Caprinos', 'Equinos'] as const).map(sp => {
            const isSelected = selectedSpeciesFilter === sp;
            const icon = sp === 'Todas' ? '🐾' : ESPECIES_TAXONOMY[sp]?.icono || '🐾';
            const label = sp === 'Aves de corral' ? 'Aves' : sp;

            return (
              <button
                key={sp}
                type="button"
                className={`filter-pill-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedSpeciesFilter(sp)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  padding: '4px 10px',
                  borderRadius: 14,
                  border: isSelected ? '1px solid var(--primary-color)' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? 'var(--primary-color)' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Stream */}
        <div className="quick-action-list" style={{ maxHeight: '68vh', overflowY: 'auto' }}>
          {/* Matched Animals if user typed a tag */}
          {filteredAnimals.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div className="quick-action-section-title">Semovientes Encontrados</div>
              {filteredAnimals.map(a => {
                const spIcon = a.especie ? ESPECIES_TAXONOMY[a.especie]?.icono : '🐮';
                return (
                  <div
                    key={a.practico}
                    className={`quick-action-item ${selectedAnimal === a.practico ? 'selected' : ''}`}
                    onClick={() => setSelectedAnimal(a.practico)}
                  >
                    <div className="quick-action-item-left">
                      <div className="quick-action-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{spIcon}</span>
                      </div>
                      <div>
                        <div className="quick-action-name">
                          {a.practico} — {a.categoria} • {a.composicion || a.racial || 'Racial'}
                        </div>
                        <div className="quick-action-sub">
                          {a.especie || 'Bovinos'} • Lote: {a.lote || '01'} • Estatus: {a.estatus}
                        </div>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      style={{ fontSize: 11, padding: '3px 10px' }}
                    >
                      {selectedAnimal === a.practico ? '✓ Seleccionado' : 'Asignar a Evento'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* SPECIES RAPID LAUNCHERS SECTION */}
          {filteredLaunchers.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div className="quick-action-section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={13} color="#d97706" />
                <span>Lanzadores Rápidos Multi-Especie ({filteredLaunchers.length})</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 8, padding: '0 4px' }}>
                {filteredLaunchers.map(launcher => (
                  <div
                    key={launcher.id}
                    onClick={() => handleSelectLauncher(launcher)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '10px 12px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = launcher.color;
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      flexShrink: 0
                    }}>
                      {launcher.icono}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
                          {launcher.nombre}
                        </span>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: '1px 6px',
                          borderRadius: 6,
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          flexShrink: 0
                        }}>
                          {launcher.especie}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, lineHeight: 1.3 }}>
                        {launcher.descripcion}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STANDARD ALL-EVENT DIRECTORY */}
          <div>
            <div className="quick-action-section-title">
              {query.trim() ? `Submódulos de Eventos coincidentes (${filteredEvents.length})` : 'Todos los Submódulos del Catálogo'}
            </div>
            {filteredEvents.map(ev => (
              <div
                key={`${ev.category}-${ev.name}`}
                className="quick-action-item"
                onClick={() => handleSelectEvent(ev.name, ev.category)}
              >
                <div className="quick-action-item-left">
                  <div className="quick-action-icon">
                    {getCategoryIcon(ev.category)}
                  </div>
                  <div>
                    <div className="quick-action-name">{ev.name}</div>
                    <div className="quick-action-sub">{ev.category}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 12 }}>
                  <span>Abrir Formulario</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            ))}

            {filteredEvents.length === 0 && filteredLaunchers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94a3b8', fontSize: 13 }}>
                No se encontraron eventos ni lanzadores con "{query}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
