export interface GestationStageInfo {
  stage: 'Primer Tercio' | 'Segundo Tercio' | 'Tercer Tercio' | 'Parto Inminente' | 'Fuera de Rango';
  color: string;
  badgeBg: string;
  borderColor: string;
  indicacionesClinicas: string;
}

export function getGestationStage(diasGestacion: number, especie: string, subespecie?: string): GestationStageInfo {
  let duracionTotal = 283;

  switch (especie) {
    case 'Bovinos':
      duracionTotal = (subespecie === 'Cebuino' || subespecie === 'Bos indicus') ? 292 : 283;
      break;
    case 'Búfalos':
      duracionTotal = 310;
      break;
    case 'Equinos':
      duracionTotal = 340;
      break;
    case 'Porcinos':
      duracionTotal = 114;
      break;
    case 'Caprinos':
    case 'Ovinos':
      duracionTotal = 150;
      break;
    default:
      duracionTotal = 283;
  }

  const porcentaje = (diasGestacion / duracionTotal) * 100;

  if (diasGestacion >= duracionTotal - 7) {
    return {
      stage: 'Parto Inminente',
      color: '#b91c1c',
      badgeBg: '#fef2f2',
      borderColor: '#fca5a5',
      indicacionesClinicas: 'Vigilancia 24h, ubicar en paridero, desinfección de ubre y pezones.'
    };
  }

  if (porcentaje <= 33.3) {
    return {
      stage: 'Primer Tercio',
      color: '#0284c7',
      badgeBg: '#f0f9ff',
      borderColor: '#bae6fd',
      indicacionesClinicas: 'Fase de embriogénesis y nidación. Evitar palpación precoz traumática y estrés.'
    };
  } else if (porcentaje <= 66.6) {
    return {
      stage: 'Segundo Tercio',
      color: '#16a34a',
      badgeBg: '#f0fdf4',
      borderColor: '#bbf7d0',
      indicacionesClinicas: 'Desarrollo osteo-muscular. Período seguro para desparasitaciones y vacunas inactivadas.'
    };
  } else {
    return {
      stage: 'Tercer Tercio',
      color: '#d97706',
      badgeBg: '#fffbeb',
      borderColor: '#fde68a',
      indicacionesClinicas: 'Crecimiento fetal acelerado (70% del peso final). Secado obligatorio y dieta de transición.'
    };
  }
}

export function getSireLabel(especie?: string): { icon: string; label: string } {
  switch (especie) {
    case 'Equinos':
    case 'Caballos':
      return { icon: '🐎', label: 'Padrón / Semental' };
    case 'Porcinos':
    case 'Cerdos':
      return { icon: '🐖', label: 'Verraco' };
    case 'Caprinos':
    case 'Cabras':
      return { icon: '🐐', label: 'Chivo Reproductor' };
    case 'Ovinos':
    case 'Ovejas':
      return { icon: '🐑', label: 'Carnero' };
    case 'Búfalos':
      return { icon: '🐃', label: 'Bucerro Semental' };
    case 'Aves de corral':
    case 'Aves':
      return { icon: '🐓', label: 'Gallo Reproductor' };
    case 'Bovinos':
    default:
      return { icon: '🐂', label: 'Toro' };
  }
}
