import React from 'react';
import logoSrc from '../../assets/logo.svg';

interface AgroGanLogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const AgroGanLogo: React.FC<AgroGanLogoProps> = ({
  size = 34,
  className = '',
  style
}) => {
  return (
    <img
      src={logoSrc}
      alt="AgroGan Logo"
      width={size}
      height={size}
      className={`agrogan-logo-img ${className}`}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        objectFit: 'contain',
        borderRadius: '50%',
        flexShrink: 0,
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.12)',
        ...style
      }}
    />
  );
};
