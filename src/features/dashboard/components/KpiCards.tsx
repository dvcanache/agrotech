import React from 'react';
import { KpiCardData } from '../../../types/chart';
import { 
  Egg, 
  Layers, 
  Wheat, 
  Activity, 
  TrendingUp, 
  Baby, 
  Feather, 
  Beef, 
  PawPrint,
  CheckCircle2 
} from 'lucide-react';

interface KpiCardsProps {
  cards: KpiCardData[];
}

export const KpiCards: React.FC<KpiCardsProps> = ({ cards }) => {
  const renderIcon = (type: KpiCardData['iconType']) => {
    switch (type) {
      case 'milk-bucket':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21H7a2 2 0 0 1-1.99-1.8L4 8h16l-1.01 11.2A2 2 0 0 1 17 21Z" />
            <path d="M6 8V6a6 6 0 0 1 12 0v2" />
            <path d="M4 8h16" />
          </svg>
        );
      case 'scale-female':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M5 8h14M7 8v10h10V8" />
            <rect x="9" y="10" width="6" height="5" rx="1" />
            <path d="M11 11.5c.3-.3.7-.5 1-.5s.7.2 1 .5v.8c0 .3-.3.4-.5.4h-1c-.2 0-.5-.1-.5-.4v-.8Z" fill="currentColor" stroke="none" />
            <path d="M3 20h18" />
          </svg>
        );
      case 'scale-male':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M5 8h14M7 8v10h10V8" />
            <rect x="9" y="10" width="6" height="5" rx="1" />
            <path d="M11 11.5c.3-.3.7-.5 1-.5s.7.2 1 .5v.8c0 .3-.3.4-.5.4h-1c-.2 0-.5-.1-.5-.4v-.8Z" fill="currentColor" stroke="none" />
            <path d="M3 20h18" />
          </svg>
        );
      case 'weight-maute':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 7a3 3 0 0 1 6 0v1H9V7z" />
            <path d="M5 8h14l1 3v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9l1-3z" />
            <path d="M12 17v-5M9 14l3-3 3 3" />
          </svg>
        );
      case 'census':
        return <PawPrint size={26} strokeWidth={2.2} />;
      case 'species':
        return <Layers size={26} strokeWidth={2.2} />;
      case 'egg':
        return <Egg size={26} strokeWidth={2.2} />;
      case 'meat':
        return <Beef size={26} strokeWidth={2.2} />;
      case 'pig':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8" />
            <ellipse cx="12" cy="13" rx="3.5" ry="2.5" />
            <circle cx="10.8" cy="13" r="0.6" fill="currentColor" />
            <circle cx="13.2" cy="13" r="0.6" fill="currentColor" />
            <circle cx="9" cy="9" r="0.9" fill="currentColor" />
            <circle cx="15" cy="9" r="0.9" fill="currentColor" />
            <path d="M6 7C5 5.5 4 5 3.5 5 4 7 5 8 6 8" />
            <path d="M18 7c1-1.5 2-2 2.5-2-.5 2-1.5 3-2.5 3" />
          </svg>
        );
      case 'baby':
        return <Baby size={26} strokeWidth={2.2} />;
      case 'feather':
        return <Feather size={26} strokeWidth={2.2} />;
      case 'wheat':
        return <Wheat size={26} strokeWidth={2.2} />;
      case 'horse':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 20c1.5-4 2.5-6.5 4-9.5l2.5-4.5 4.5 1.5-1 3.5 3 2-2.5 4-3 1-1.5 3.5z" />
            <circle cx="12.5" cy="8" r="1" fill="currentColor" />
            <path d="M9 16c1.5 2 3 3 5 3" />
          </svg>
        );
      case 'activity':
        return <Activity size={26} strokeWidth={2.2} />;
      case 'trending-up':
        return <TrendingUp size={26} strokeWidth={2.2} />;
      case 'check-circle':
        return <CheckCircle2 size={26} strokeWidth={2.2} />;
      default:
        return <PawPrint size={26} strokeWidth={2.2} />;
    }
  };

  return (
    <section className={`kpi-grid ${cards.length === 5 ? 'has-5' : ''}`}>
      {cards.map((card, idx) => (
        <div className="kpi-card" key={idx}>
          <div className="kpi-icon-container">
            {renderIcon(card.iconType)}
          </div>
          <div className="kpi-details">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="kpi-value">{card.value}</span>
              {card.badge && (
                <span className="kpi-card-badge">{card.badge}</span>
              )}
            </div>
            <span className="kpi-subtitle" title={card.subtitle}>
              {card.subtitle}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
};
