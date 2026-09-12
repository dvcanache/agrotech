import React, { useState, useEffect, useRef } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { EVENT_CATEGORIES } from '../eventosData';
import './eventosSpreadsheet.css';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (tipo: string, categoria: string, codigoAnimal: string) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onSelectAction
}) => {
  const { animals } = useApp();
  const [query, setQuery] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedAnimal('');
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

  // Flattened event list
  const allEvents = EVENT_CATEGORIES.flatMap(cat => 
    cat.enlaces.map(link => ({
      name: link,
      category: cat.titulo,
      iconType: cat.iconoType
    }))
  );

  // Filtered events
  const filteredEvents = allEvents.filter(ev => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return ev.name.toLowerCase().includes(q) || ev.category.toLowerCase().includes(q);
  });

  // Filtered animals
  const filteredAnimals = animals.filter(a => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      a.practico.toLowerCase().includes(q) ||
      (a.unico && a.unico.toLowerCase().includes(q)) ||
      a.categoria.toLowerCase().includes(q) ||
      (a.lote && a.lote.toLowerCase().includes(q))
    );
  }).slice(0, 4);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Reproductivos': return <Heart size={16} />;
      case 'Productivos': return <Milk size={16} />;
      case 'Inventarios': return <Boxes size={16} />;
      case 'Veterinarios': return <Stethoscope size={16} />;
      case 'Potreros': return <Trees size={16} />;
      default: return <Settings2 size={16} />;
    }
  };

  const handleSelectEvent = (name: string, category: string) => {
    const targetAnimal = selectedAnimal || (filteredAnimals.length > 0 ? filteredAnimals[0].practico : '0001');
    onSelectAction(name, category, targetAnimal);
    onClose();
  };

  return (
    <div className="quick-action-backdrop" onClick={onClose}>
      <div className="quick-action-dialog" onClick={e => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className="quick-action-search-header">
          <Search size={18} color="#2d6a4f" />
          <input
            ref={inputRef}
            type="text"
            className="quick-action-search-input"
            placeholder="Escribe para buscar evento (ej. Servicios, Mastitis, Partos) o arete..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {selectedAnimal && (
            <span style={{ 
              fontSize: 11, 
              backgroundColor: '#e8f5e9', 
              color: '#2d6a4f', 
              padding: '2px 8px', 
              borderRadius: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              Animal: {selectedAnimal}
              <button type="button" onClick={() => setSelectedAnimal('')} style={{ fontSize: 10, cursor: 'pointer' }}>✕</button>
            </span>
          )}
          <span className="quick-action-kbd">ESC</span>
        </div>

        {/* Results Stream */}
        <div className="quick-action-list">
          {/* Matched Animals if user typed a tag */}
          {filteredAnimals.length > 0 && (
            <div>
              <div className="quick-action-section-title">Semovientes Encontrados</div>
              {filteredAnimals.map(a => (
                <div
                  key={a.practico}
                  className={`quick-action-item ${selectedAnimal === a.practico ? 'selected' : ''}`}
                  onClick={() => setSelectedAnimal(a.practico)}
                >
                  <div className="quick-action-item-left">
                    <div className="quick-action-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{a.practico}</span>
                    </div>
                    <div>
                      <div className="quick-action-name">{a.categoria} • {a.composicion || 'Mestizo'}</div>
                      <div className="quick-action-sub">Lote {a.lote || '01'} • Estatus: {a.estatus}</div>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    style={{ fontSize: 11, padding: '3px 8px' }}
                  >
                    {selectedAnimal === a.practico ? '✓ Seleccionado' : 'Asignar a Evento'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Event Actions */}
          <div>
            <div className="quick-action-section-title">
              {query.trim() ? `Eventos coincidentes (${filteredEvents.length})` : 'Los 22 Submódulos de Eventos'}
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

            {filteredEvents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 16px', color: '#94a3b8', fontSize: 13 }}>
                No se encontraron eventos con "{query}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
