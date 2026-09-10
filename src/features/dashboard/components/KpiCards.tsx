import React from 'react';
import { KpiCardData } from '../../../types/chart';

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
    }
  };

  return (
    <section className="kpi-grid">
      {cards.map((card, idx) => (
        <div className="kpi-card" key={idx}>
          <div className="kpi-icon-container">
            {renderIcon(card.iconType)}
          </div>
          <div className="kpi-details">
            <span className="kpi-value">{card.value}</span>
            <span className="kpi-subtitle" title={card.subtitle}>{card.subtitle}</span>
          </div>
        </div>
      ))}
    </section>
  );
};
