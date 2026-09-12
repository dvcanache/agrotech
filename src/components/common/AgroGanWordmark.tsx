import React from 'react';
import wordmarkSrc from '../../assets/agrogan-text.svg';

interface AgroGanWordmarkProps {
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const AgroGanWordmark: React.FC<AgroGanWordmarkProps> = ({
  height = 23,
  className = '',
  style
}) => {
  return (
    <img
      src={wordmarkSrc}
      alt="AGROGAN"
      height={height}
      className={`agrogan-wordmark-img ${className}`}
      style={{
        display: 'inline-block',
        height: `${height}px`,
        width: 'auto',
        objectFit: 'contain',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style
      }}
    />
  );
};
